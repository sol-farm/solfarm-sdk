/* eslint-disable no-await-in-loop */
/* eslint-disable default-case */
// Solana Modules
import * as anchor from 'anchorupdated';
import * as serumAssoToken from '@project-serum/associated-token';
import * as splToken from '@solana/spl-token';

import {
  find,
  forEach,
  isEmpty,
  isObject,
  orderBy,
  transform,
  noop
} from 'lodash';

// Store
import { getStore } from '../stores/get-store';

// Utils
import { commitment, sendTransaction } from '../utils/web3';

// Vaults v2 Helpers
import {
  deriveWithdrawQueueAddress,
  deriveTrackingAddress,
  deriveTrackingPdaAddress,
  deriveTrackingQueueAddress,
  createAssociatedTokenAccount,
  getVaultId,
  getFarmTypeBN,
  getVaultByTag,
  getSharesForLpTokenAmount,
  getLendingOptimizerVaultByAccount
} from './helpers/vaultHelpers';

import { getVaultV2ProgramId } from '../utils/configv2';
import { getTulipVaultBySymbol } from '../utils/tulipVaults';

// IDL for Vaults v2
import idl from '../idl/vaults_v2_idl.json';
import { tagRemainingAccountHandlerMap } from './helpers/tulipVaultHelpers';

// Need to maintain a minimum balance in each standalone vault, which is kept at $50 for now
// Deposited by the Tulip team itself.
const MIN_BALANCE_TO_MAINTAIN = 50;

async function _refreshMultiDepositVaultBalance ({ tag }) {
  const vaultConfig = getVaultByTag(tag);
  const vault = new anchor.web3.PublicKey(
    vaultConfig?.multi_deposit_optimizer?.account
  );

  const tulipVaultData = getTulipVaultBySymbol(
    vaultConfig?.multi_deposit_optimizer?.symbol
  );

  const vaultId = getVaultId({
    symbol: tulipVaultData?.symbol,
    mintAddress: tulipVaultData?.mintAddress
  });
  const vaultStoreItem = getStore('VaultStore').get(vaultId);

  // Fake empty wallet to fetch TVL etc. data
  const walletToInitialize = {
    signTransaction: noop,
    signAllTransactions: noop,
    publicKey: new anchor.web3.Account().publicKey
  };

  const provider = new anchor.Provider(window.$web3, walletToInitialize, {
    skipPreflight: true
  });

  anchor.setProvider(provider);

  // // Generate the program client from IDL.
  const programId = new anchor.web3.PublicKey(getVaultV2ProgramId());
  const program = new anchor.Program(idl, programId);

  const tulipVaultAccountData = await window.$web3.getAccountInfo(vault);

  let decodedTulipAccountInfo = {};

  if (tulipVaultAccountData?.data) {
    decodedTulipAccountInfo = program.coder.accounts.decode(
      'MultiDepositOptimizerV1',
      tulipVaultAccountData?.data
    );
  }

  const { totalDepositedBalance, totalShares } =
    decodedTulipAccountInfo?.base || {};

  const standaloneVaults = transform(
    decodedTulipAccountInfo?.standaloneVaults,
    (vaults, { vaultAddress, depositedBalance }) => {
      vaults[vaultAddress] = { depositedBalance };

      return vaults;
    },
    {}
  );

  // Update the vault store item with new balance for the multi deposit vault
  vaultStoreItem?.update({
    totalDepositedBalance,
    totalShares,
    standaloneVaults
  });

  return { totalDepositedBalance, totalShares };
}

/**
 * @private
 *
 * @description Register deposit tracking account for tulip vaults
 *
 * @param {Object} data
 * @returns transaction
 */
async function _registerDepositTrackingAccount ({
  program,
  programId,
  provider,
  vault,
  depositTrackingAccount,
  depositTrackingPda,
  farmType,
  sharesMint,
  transaction
}) {
  const [depositTrackingQueueAccount] = await deriveTrackingQueueAddress(
    programId,
    depositTrackingPda
  );

  const depositTrackingHoldAccount = await createAssociatedTokenAccount(
    provider,
    depositTrackingPda,
    sharesMint
  );

  transaction.add(
    await program.instruction.registerDepositTrackingAccount(farmType, {
      accounts: {
        authority: provider.wallet.publicKey,
        vault,
        depositTrackingAccount,
        depositTrackingQueueAccount,
        depositTrackingHoldAccount,
        depositTrackingPda,
        sharesMint,
        tokenProgram: splToken.TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId
      }
    })
  );

  return transaction;
}

/**
 * @private
 *
 * @description Issue shares for tulip vaults
 *
 * @param {Object} data
 * @returns transaction
 */
async function _issueShares ({
  program,
  provider,
  vault,
  depositTrackingAccount,
  depositTrackingPda,
  lpTokenAmount,
  decimals,
  farmType,
  vaultPda,
  sharesMint,
  lpTokenMint,
  userLpTokenAccount,
  transaction
}) {
  const depositTrackingHoldAccount = await createAssociatedTokenAccount(
    provider,
    depositTrackingPda,
    sharesMint
  );

  const hasDepositTrackingHoldAccountInfo = await window.$web3.getAccountInfo(
    depositTrackingHoldAccount
  );

  if (!hasDepositTrackingHoldAccountInfo) {
    transaction.add(
      await serumAssoToken.createAssociatedTokenAccount(
        // who will pay for the account creation
        provider.wallet.publicKey,

        // who is the account getting created for
        depositTrackingPda,

        // what mint address token is being created
        sharesMint
      )
    );
  }

  const vaultUnderlying = await createAssociatedTokenAccount(
    provider,
    vaultPda,
    lpTokenMint
  );

  transaction.add(
    program.instruction.issueShares(
      {
        farmType,
        amount: new anchor.BN(
          Number(lpTokenAmount) * Math.pow(10, Number(decimals))
        )
      },
      {
        accounts: {
          authority: provider.wallet.publicKey,
          vault: vault,
          vaultPda: vaultPda,
          vaultUnderlyingAccount: vaultUnderlying,
          sharesMint: sharesMint,
          receivingSharesAccount: depositTrackingHoldAccount,
          depositingUnderlyingAccount: userLpTokenAccount,
          depositTrackingPda,
          depositTracking: depositTrackingAccount,
          tokenProgram: splToken.TOKEN_PROGRAM_ID
        }
      }
    )
  );

  return transaction;
}

/**
 * @private
 *
 * @description Release funds for tulip vaults
 *
 * @param {Object} data
 * @returns transaction
 */
async function _releaseFunds ({
  lpTokenAmount,
  tag,
  transactions = new anchor.web3.Transaction()
}) {
  const vaultConfig = getVaultByTag(tag);
  const farmType = getFarmTypeBN(vaultConfig?.farm_type);

  const { wallet } = getStore('WalletStore'),
    provider = new anchor.Provider(window.$web3, wallet, {
      skipPreflight: false,
      preflightCommitment: commitment
    }),
    vault = new anchor.web3.PublicKey(
      vaultConfig?.multi_deposit_optimizer?.account
    );

  anchor.setProvider(provider);

  // Generate the program client from IDL.
  const programId = new anchor.web3.PublicKey(getVaultV2ProgramId());
  const program = new anchor.Program(idl, programId);

  lpTokenAmount = Number(lpTokenAmount);

  const tulipVaultData = getTulipVaultBySymbol(
    vaultConfig?.multi_deposit_optimizer?.symbol
  );
  const { decimals } = tulipVaultData;

  const vaultId = getVaultId({
    symbol: tulipVaultData?.symbol,
    mintAddress: tulipVaultData?.mintAddress
  });
  const vaultStoreItem = getStore('VaultStore').get(vaultId);

  const sharesMint = new anchor.web3.PublicKey(
    vaultConfig?.multi_deposit_optimizer?.base?.shares_mint
  );

  const [depositTrackingAccount] = await deriveTrackingAddress(
    programId,
    vault,
    provider.wallet.publicKey
  );

  const [depositTrackingPda] = await deriveTrackingPdaAddress(
    programId,
    depositTrackingAccount
  );

  const depositTrackingHoldAccount = await createAssociatedTokenAccount(
    provider,
    depositTrackingPda,
    sharesMint
  );

  const providerSharesAccount = await createAssociatedTokenAccount(
    provider,
    provider.wallet.publicKey,
    sharesMint
  );

  const userSharesAccount = await createAssociatedTokenAccount(
    provider,
    provider.wallet.publicKey,
    sharesMint
  );

  const hasUserSharesAccount = await window.$web3.getAccountInfo(
    userSharesAccount
  );

  if (!hasUserSharesAccount) {
    transactions.add(
      await serumAssoToken.createAssociatedTokenAccount(
        // who will pay for the account creation
        provider.wallet.publicKey,

        // who is the account getting created for
        provider.wallet.publicKey,

        // what mint address token is being created
        sharesMint
      )
    );
  }

  const accounts = {
    authority: provider.wallet.publicKey,
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    tokenProgram: splToken.TOKEN_PROGRAM_ID,
    depositTrackingAccount,
    depositTrackingPda,
    depositTrackingHoldAccount,
    receivingSharesAccount: providerSharesAccount,
    sharesMint
  };

  const { totalShares, totalDepositedBalance } = vaultStoreItem;

  const shares = getSharesForLpTokenAmount({
    lpTokenAmount,
    totalDepositedBalance,
    totalShares,
    decimals,
    lockedShares: vaultStoreItem?.shares
  });

  transactions.add(
    program.instruction.withdrawDepositTracking(
      new anchor.BN(shares),
      farmType,
      {
        accounts,
        remainingAccounts: [
          {
            isSigner: false,
            isWritable: true,
            pubkey: vault
          }
        ]
      }
    )
  );

  return transactions;
}

async function _standaloneVaultWithdraws ({
  standaloneVaultConfigs,
  vaultConfig,
  lpTokenAmount,
  program,
  programId,
  provider,
  vaultStoreItem,
  tulipVaultData,
  vault,
  userLpTokenAccount,
  decimals
}) {
  if (lpTokenAmount <= 0) {
    return Promise.resolve({ transactions: [], lpTokenAmount });
  }

  const { tokenAccounts } = getStore('WalletStore');

  // All transactions
  let transactions = [];

  let amountAmountLeftToWithdraw = lpTokenAmount;
  const standaloneVaultsSortedByBalance = orderBy(
    standaloneVaultConfigs,
    ({ accountData }) => {
      return accountData?.depositedBalance;
    },
    'desc'
  );
  let vaultsToWithdrawFrom = [];

  forEach(standaloneVaultsSortedByBalance, (vault) => {
    if (amountAmountLeftToWithdraw <= 0) {
      return;
    }

    const { depositedBalance } = vault.accountData;

    let maxWithdrawFromVault =
      depositedBalance / Math.pow(10, decimals) - MIN_BALANCE_TO_MAINTAIN;

    maxWithdrawFromVault = maxWithdrawFromVault > 0 ? maxWithdrawFromVault : 0;

    const amountToWithdraw =
      amountAmountLeftToWithdraw > maxWithdrawFromVault ?
        maxWithdrawFromVault :
        amountAmountLeftToWithdraw;

    amountAmountLeftToWithdraw -= amountToWithdraw;

    if (amountToWithdraw > 0) {
      vaultsToWithdrawFrom.push({
        standaloneWithdrawVault: vault,
        amount: amountToWithdraw
      });
    }
  });

  const vaultPda = new anchor.web3.PublicKey(
    vaultConfig?.multi_deposit_optimizer?.base?.pda
  );
  const sharesMint = new anchor.web3.PublicKey(
    vaultConfig?.multi_deposit_optimizer?.base?.shares_mint
  );
  const mintAddress = new anchor.web3.PublicKey(
    vaultConfig?.multi_deposit_optimizer?.base?.underlying_mint
  );

  const providerSharesAccount = await createAssociatedTokenAccount(
    provider,
    provider.wallet.publicKey,
    sharesMint
  );

  const { totalShares, totalDepositedBalance } = vaultStoreItem;

  for (let idx = 0; idx < vaultsToWithdrawFrom.length; idx++) {
    const { standaloneWithdrawVault, amount } = vaultsToWithdrawFrom[idx];

    const shares = getSharesForLpTokenAmount({
      lpTokenAmount: amount,
      totalDepositedBalance,
      totalShares,
      decimals: tulipVaultData?.decimals,
      lockedShares:
        tokenAccounts[vaultConfig?.multi_deposit_optimizer?.base?.shares_mint]
          .balance.wei
    });

    const { configData } = standaloneWithdrawVault;

    const withdrawVault = new anchor.web3.PublicKey(
      configData?.lending_optimizer?.account
    );
    const withdrawVaultPda = new anchor.web3.PublicKey(
      configData?.lending_optimizer?.base?.pda
    );
    const withdrawVaultSharesMint = new anchor.web3.PublicKey(
      configData?.lending_optimizer?.base?.shares_mint
    );
    const withdrawVaultDepositQueue = new anchor.web3.PublicKey(
      configData?.lending_optimizer?.base?.underlying_deposit_queue
    );

    const availableProgram =
      configData?.lending_optimizer?.available_programs[0];

    const platformInformation = new anchor.web3.PublicKey(
      availableProgram?.information_account
    );
    const platformConfigData = new anchor.web3.PublicKey(
      availableProgram?.config_data_account
    );
    const lendingProgram = new anchor.web3.PublicKey(
      availableProgram?.program_id
    );

    const withdrawVaultTag = configData?.tag;

    // Find the not-null available program
    const withdrawVaultProgramData = find(availableProgram, (value) => {
      return value && isObject(value);
    });

    const withdrawBurningSharesTokenAccount =
      await createAssociatedTokenAccount(
        provider,
        vaultPda,
        withdrawVaultSharesMint
      );

    let [withdrawQueueAccount] = await deriveWithdrawQueueAddress(
      programId,
      vault,
      mintAddress
    );

    const remainingAccounts = tagRemainingAccountHandlerMap[withdrawVaultTag] ?
      tagRemainingAccountHandlerMap[withdrawVaultTag](
        withdrawVaultProgramData
      ) :
      [];

    const transaction = new anchor.web3.Transaction();

    transaction.add(
      await program.instruction.withdrawMultiDepositOptimizerVault(
        new anchor.BN(shares),
        {
          accounts: {
            authority: provider.wallet.publicKey,
            multiDeposit: vault,
            multiDepositPda: vaultPda,
            withdrawVault,
            withdrawVaultPda,
            platformInformation,
            platformConfigData,
            lendingProgram,
            multiBurningSharesTokenAccount: providerSharesAccount,
            withdrawBurningSharesTokenAccount,
            receivingUnderlyingTokenAccount: userLpTokenAccount,
            multiUnderlyingWithdrawQueue: withdrawQueueAccount,
            multiSharesMint: sharesMint,
            withdrawSharesMint: withdrawVaultSharesMint,
            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
            tokenProgram: splToken.TOKEN_PROGRAM_ID,
            withdrawVaultUnderlyingDepositQueue: withdrawVaultDepositQueue
          },
          remainingAccounts
        }
      )
    );

    transactions.push(transaction);

    return { transactions, lpTokenAmount: lpTokenAmount - amount };
  }

  return { transactions, lpTokenAmount };
}

/**
 * @private
 *
 * @description Unstake funds for tulip vaults
 *
 * @param {Object} data
 * @returns transaction
 */
function _unstakeFunds ({
  tag,
  lpTokenAmount,
  transaction = new anchor.web3.Transaction()
}) {
  const vaultConfig = getVaultByTag(tag);

  const { wallet, tokenAccounts } = getStore('WalletStore'),
    provider = new anchor.Provider(window.$web3, wallet, {
      skipPreflight: false,
      preflightCommitment: commitment
    });

  anchor.setProvider(provider);

  // Generate the program client from IDL.
  const programId = new anchor.web3.PublicKey(getVaultV2ProgramId());
  const program = new anchor.Program(idl, programId);

  lpTokenAmount = Number(lpTokenAmount);

  const vault = new anchor.web3.PublicKey(
    vaultConfig?.multi_deposit_optimizer?.account
  );
  const tulipVaultData = getTulipVaultBySymbol(
    vaultConfig?.multi_deposit_optimizer?.symbol
  );
  const vaultId = getVaultId({
    symbol: tulipVaultData?.symbol,
    mintAddress: tulipVaultData?.mintAddress
  });
  const vaultStoreItem = getStore('VaultStore').get(vaultId);

  const { tokenAccountAddress } =
    tokenAccounts[tulipVaultData?.mintAddress] || {};

  const userLpTokenAccount =
    tokenAccountAddress && new anchor.web3.PublicKey(tokenAccountAddress);

  const { standaloneVaults, decimals } = vaultStoreItem;

  /* Data structure of the transformation below:
  {
    'BvWrY99cFckZLZMYRVUVYp2Bey4s68kL65afM6xtfyu8': {
      accountData: {
        depositedBalance
      },

      config: {
        tag: 'tulip',
        multi_deposit_optimizer: null,
        lending_optimizer: {...}
      }
    }
  };
  */
  const standaloneVaultConfigs = transform(
    standaloneVaults,
    (vaults, vaultData, account) => {
      const vaultConfig = getLendingOptimizerVaultByAccount(account);

      vaults[account] = {
        accountData: { ...vaultData || {} },
        configData: vaultConfig
      };

      return vaults;
    },
    {}
  );

  return _standaloneVaultWithdraws({
    standaloneVaultConfigs,
    vaultConfig,
    standaloneVaults,
    lpTokenAmount,
    transaction,
    program,
    programId,
    provider,
    vaultStoreItem,
    tulipVaultData,
    vault,
    userLpTokenAccount,
    decimals
  });
}

export const TulipVaultService = {
  async handleDepositToVault ({ platform, name, tag, lpTokenAmount }) {
    const vaultConfig = getVaultByTag(tag);
    const farmType = getFarmTypeBN(vaultConfig?.farm_type);

    const { wallet, tokenAccounts } = getStore('WalletStore');

    const provider = new anchor.Provider(window.$web3, wallet, {
      skipPreflight: false,
      preflightCommitment: commitment
    });

    const vault = new anchor.web3.PublicKey(
      vaultConfig?.multi_deposit_optimizer?.account
    );

    const tulipVaultData = getTulipVaultBySymbol(
      vaultConfig?.multi_deposit_optimizer?.symbol
    );

    const { decimals } = tulipVaultData || {};

    anchor.setProvider(provider);

    // Generate the program client from IDL.
    const programId = new anchor.web3.PublicKey(getVaultV2ProgramId());
    const program = new anchor.Program(idl, programId);

    const vaultPda = new anchor.web3.PublicKey(
      vaultConfig?.multi_deposit_optimizer?.base?.pda
    );
    const sharesMint = new anchor.web3.PublicKey(
      vaultConfig?.multi_deposit_optimizer?.base?.shares_mint
    );
    const mintAddress =
      vaultConfig?.multi_deposit_optimizer?.base?.underlying_mint;
    const lpTokenMint = new anchor.web3.PublicKey(mintAddress);

    const { tokenAccountAddress } = tokenAccounts[mintAddress] || {};

    const userLpTokenAccount =
      tokenAccountAddress && new anchor.web3.PublicKey(tokenAccountAddress);

    // const vaultUnderlyingAccount = new anchor.web3.PublicKey();

    const [depositTrackingAccount] = await deriveTrackingAddress(
      programId,
      vault,
      provider.wallet.publicKey
    );

    const [depositTrackingPda] = await deriveTrackingPdaAddress(
      programId,
      depositTrackingAccount
    );

    // Get the deposit tracking account info for the user
    const hasTrackingAccountInfo = await window.$web3.getAccountInfo(
      depositTrackingAccount
    );

    const transaction = new anchor.web3.Transaction();

    // Register the deposit tracking account if it doesn't exist for the user
    // This flow generally happens only for the first time when the user is depositing in the vault
    if (!hasTrackingAccountInfo) {
      await _registerDepositTrackingAccount({
        program,
        programId,
        provider,
        vault,
        depositTrackingAccount,
        depositTrackingPda,

        farmType,
        name,
        platform,
        vaultPda,
        sharesMint,
        lpTokenMint,
        transaction
      });
    }

    await _issueShares({
      program,
      programId,
      provider,
      vault,
      depositTrackingAccount,
      depositTrackingPda,
      lpTokenAmount,
      decimals,
      farmType,
      name,
      platform,
      vaultPda,
      sharesMint,
      lpTokenMint,
      userLpTokenAccount,
      transaction
    });

    return sendTransaction(window.$web3, wallet, transaction, []);
  },

  handleReleaseFunds (data) {
    const transaction = new anchor.web3.Transaction();

    // Chaining transactions so that in the final one we send them all together
    return Promise.resolve()
      .then(() => {
        return _releaseFunds({
          ...data,
          transaction
        });
      })
      .then((transactions) => {
        const { wallet } = getStore('WalletStore');

        return sendTransaction(window.$web3, wallet, transactions, []);
      });
  },

  handleUnstakeFunds (data, resolve = Promise.resolve) {
    const transaction = new anchor.web3.Transaction();

    // Chaining transactions so that in the final one we send them all together
    return Promise.resolve()
      .then(() => {
        return _unstakeFunds({
          ...data,
          transaction
        });
      })
      .then(async ({ transactions, lpTokenAmount }) => {
        if (isEmpty(transactions)) {
          return resolve();
        }

        const { wallet } = getStore('WalletStore');

        /**
         * Steps:
         * 1. Send the transaction for the first item in the transactions array
         * 2. Check if the left lpTokenAmount is 0 after the tx has been sent
         * 3. If lpTokenAmount is left, then refresh the multi-deposit vault balance from which we're withdrawing funds
         * 4. Call the unstake funds with updated lpTokenAmount (lpTokenAmount gets reduced per tx)
         *
         * Refer TulipVaultService~_standaloneWithdraws
         */
        const tx = await sendTransaction(
          window.$web3,
          wallet,
          transactions[0],
          []
        );

        return new Promise((resolve, reject) => {
          window.$web3.onSignature(
            tx,
            // eslint-disable-next-line consistent-return
            async (signatureResult) => {
              if (!signatureResult.err) {
                if (lpTokenAmount <= 0) {
                  return resolve(tx);
                }

                // Refresh the vault
                await _refreshMultiDepositVaultBalance(data);

                // Initiate transaction again once the balances have been refreshed
                return TulipVaultService.handleUnstakeFunds(
                  {
                    ...data,
                    lpTokenAmount
                  },
                  resolve
                );
              }
              reject(new Error('Transaction failed'));
            },
            'confirmed'
          );
        });
      });
  }
};
