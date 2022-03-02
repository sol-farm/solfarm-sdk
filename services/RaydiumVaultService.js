/* eslint-disable default-case */
// Solana Modules
import * as anchor from 'anchorupdated';
import * as serumAssoToken from '@project-serum/associated-token';
import * as splToken from '@solana/spl-token';

// Store
import { getStore } from '../stores/get-store';

// Utils
import {
  commitment,
  sendTransaction
} from '../utils/web3';

// Vaults v2 Helpers
import {
  deriveTrackingAddress,
  deriveTrackingPdaAddress,
  deriveTrackingQueueAddress,
  createAssociatedTokenAccount,
  getVaultByPlatformAndName,
  getVaultMarketAmms,
  getVaultId,
  getSharesForLpTokenAmount,
  getFarmTypeBN
} from './helpers/vaultHelpers';

import { getVaultV2ProgramId } from '../utils/configv2';
import { getRaydiumVaultBySymbol } from '../utils/raydiumVaults';

// IDL
import idl from '../idl/vaults_v2_idl.json';

async function _releaseFunds ({
  platform,
  name,
  lpTokenAmount,
  transactions = new anchor.web3.Transaction()
}) {
  lpTokenAmount = Number(lpTokenAmount);
  const vaultConfig = getVaultByPlatformAndName(platform, name);
  const farmType = getFarmTypeBN(vaultConfig?.farm_type);

  const { wallet } = getStore('WalletStore'),
    provider = new anchor.Provider(window.$web3, wallet, {
      skipPreflight: false,
      preflightCommitment: commitment
    }),
    vault = new anchor.web3.PublicKey(vaultConfig?.raydium?.account);

  const raydiumVaultData = getRaydiumVaultBySymbol(
    vaultConfig?.raydium?.symbol
  );
  const { decimals } = raydiumVaultData;

  const vaultId = getVaultId({
    symbol: raydiumVaultData?.symbol,
    mintAddress: raydiumVaultData?.mintAddress
  });
  const vaultStoreItem = getStore('VaultStore').get(vaultId);

  anchor.setProvider(provider);

  // Generate the program client from IDL.
  const programId = new anchor.web3.PublicKey(getVaultV2ProgramId());
  const program = new anchor.Program(idl, programId);

  const sharesMint = new anchor.web3.PublicKey(
    vaultConfig?.raydium?.base?.shares_mint
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

async function _unstakeFunds ({
  platform,
  name,
  lpTokenAmount,
  transactions = new anchor.web3.Transaction()
}) {
  lpTokenAmount = Number(lpTokenAmount);
  const vaultConfig = getVaultByPlatformAndName(platform, name);

  const { wallet, tokenAccounts } = getStore('WalletStore'),
    provider = new anchor.Provider(window.$web3, wallet, {
      skipPreflight: false,
      preflightCommitment: commitment
    }),
    vault = new anchor.web3.PublicKey(vaultConfig?.raydium?.account);

  const raydiumVaultData = getRaydiumVaultBySymbol(
    vaultConfig?.raydium?.symbol
  );
  const vaultId = getVaultId({
    symbol: raydiumVaultData?.symbol,
    mintAddress: raydiumVaultData?.mintAddress
  });
  const vaultStoreItem = getStore('VaultStore').get(vaultId);

  anchor.setProvider(provider);

  const vaultPda = new anchor.web3.PublicKey(vaultConfig?.raydium?.base?.pda);
  const sharesMint = new anchor.web3.PublicKey(
    vaultConfig?.raydium?.base?.shares_mint
  );
  const userStakeInfoAddress = new anchor.web3.PublicKey(
    vaultConfig?.raydium?.associated_stake_info_address
  );
  const vaultRewardATokenAccount = new anchor.web3.PublicKey(
    vaultConfig?.raydium?.vault_reward_a_token_account
  );
  const vaultRewardBTokenAccount = new anchor.web3.PublicKey(
    vaultConfig?.raydium?.vault_reward_b_token_account
  );

  // Generate the program client from IDL.
  const programId = new anchor.web3.PublicKey(getVaultV2ProgramId());
  const program = new anchor.Program(idl, programId);

  const providerSharesAccount = await createAssociatedTokenAccount(
    provider,
    provider.wallet.publicKey,
    sharesMint
  );

  const vaultAmmsData = getVaultMarketAmms(platform, name);

  let {
    lp_mint: lpMint,
    farm
  } = vaultAmmsData || {};

  let {
    pool_id: poolId,
    pool_authority: poolAuthority,
    lp_token_account: poolLpTokenAccount,
    reward_token_account_a: poolRewardATokenAccount,
    reward_token_account_b: poolRewardBTokenAccount,
    stake_program: stakeProgram
  } = farm || {};

  poolId = new anchor.web3.PublicKey(poolId);
  poolAuthority = new anchor.web3.PublicKey(poolAuthority);
  poolLpTokenAccount = new anchor.web3.PublicKey(poolLpTokenAccount);
  stakeProgram = new anchor.web3.PublicKey(stakeProgram);
  poolRewardATokenAccount = new anchor.web3.PublicKey(poolRewardATokenAccount);
  poolRewardBTokenAccount = new anchor.web3.PublicKey(poolRewardBTokenAccount);
  lpMint = new anchor.web3.PublicKey(lpMint);

  const { totalShares, totalDepositedBalance } = vaultStoreItem;

  const shares = getSharesForLpTokenAmount({
    lpTokenAmount,
    totalDepositedBalance,
    totalShares,
    decimals: raydiumVaultData?.decimals,
    currentShares: vaultStoreItem.shares,
    lockedShares:
      tokenAccounts[vaultConfig?.raydium?.base?.shares_mint].balance.wei
  });

  const lpTokenAccount = await serumAssoToken.getAssociatedTokenAddress(
    provider.wallet.publicKey,
    lpMint
  );

  const underlyingWithdrawQueue = new anchor.web3.PublicKey(
    vaultConfig?.raydium?.base?.underlying_withdraw_queue
  );

  const feeCollectorRewardTokenA = new anchor.web3.PublicKey(
    vaultConfig?.raydium?.fee_collector_reward_a_token_account
  );
  let remainingAccounts = [
    {
      isSigner: false,
      isWritable: true,
      pubkey: feeCollectorRewardTokenA
    }
  ];

  if (raydiumVaultData?.dualYield) {
    const feeCollectorRewardTokenB = new anchor.web3.PublicKey(
      vaultConfig?.raydium?.fee_collector_reward_b_token_account
    );

    remainingAccounts.push({
      isSigner: false,
      isWritable: true,
      pubkey: feeCollectorRewardTokenB
    });
  }

  transactions.add(
    program.instruction.withdrawRaydiumVault(new anchor.BN(shares), {
      accounts: {
        authority: provider.wallet.publicKey,
        vault: vault,
        vaultPda: vaultPda,
        vaultStakeInfoAccount: userStakeInfoAddress,
        poolId: poolId,
        poolAuthority: poolAuthority,
        underlyingWithdrawQueue: underlyingWithdrawQueue,
        poolLpTokenAccount: poolLpTokenAccount,
        vaultRewardATokenAccount: vaultRewardATokenAccount,
        poolRewardATokenAccount: poolRewardATokenAccount,
        vaultRewardBTokenAccount: vaultRewardBTokenAccount,
        poolRewardBTokenAccount: poolRewardBTokenAccount,
        burningSharesTokenAccount: providerSharesAccount,
        receivingUnderlyingTokenAccount: lpTokenAccount,
        sharesMint,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        tokenProgram: splToken.TOKEN_PROGRAM_ID,
        raydiumStakeProgram: stakeProgram
      },
      remainingAccounts
    })
  );

  return transactions;
}

export const RaydiumVaultService = {
  async registerDepositTrackingAccount ({
    programId,
    program,
    vault,
    provider,
    depositTrackingAccount,
    depositTrackingPda,

    farmType,
    sharesMint
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

    const accountsData = {
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
    };

    return program.instruction.registerDepositTrackingAccount(farmType, {
      accounts: accountsData
    });
  },

  async issueShares ({
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
    txn
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
      txn.add(
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

    txn.add(
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
            vaultUnderlyingAccount: vaultUnderlying, // deposit queue
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

    return txn;
  },

  async handleDepositToVault ({ platform, name, lpTokenAmount }) {
    const vaultConfig = getVaultByPlatformAndName(platform, name);
    const farmType = getFarmTypeBN(vaultConfig?.farm_type);

    const { wallet, tokenAccounts } = getStore('WalletStore');
    const provider = new anchor.Provider(window.$web3, wallet, {
      skipPreflight: false,
      preflightCommitment: commitment
    });
    const vault = new anchor.web3.PublicKey(vaultConfig?.raydium?.account);

    const raydiumVaultData = getRaydiumVaultBySymbol(
      vaultConfig?.raydium?.symbol
    );

    const { decimals } = raydiumVaultData || {};

    anchor.setProvider(provider);

    // Generate the program client from IDL.
    const programId = new anchor.web3.PublicKey(getVaultV2ProgramId());
    const program = new anchor.Program(idl, programId);

    const vaultPda = new anchor.web3.PublicKey(vaultConfig?.raydium?.base?.pda);
    const sharesMint = new anchor.web3.PublicKey(
      vaultConfig?.raydium?.base?.shares_mint
    );
    const mintAddress = vaultConfig?.raydium?.base?.underlying_mint;
    const lpTokenMint = new anchor.web3.PublicKey(mintAddress);
    const { tokenAccountAddress } = tokenAccounts[mintAddress] || {};

    // TODO: Verify if we need this from tokenAccountAddress or should we just create
    // it using the swap pool mint address or something?
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

    // Another code we saw that can be tried if the above one doesn't work:
    // const hasTrackingAccountInfo = await provider.connection.getAccountInfo(depositTrackingAccount);

    const transaction = new anchor.web3.Transaction();

    // Register the deposit tracking account if it doesn't exist for the user
    // This flow generally happens only for the first time when the user is depositing in the vault
    if (!hasTrackingAccountInfo) {
      transaction.add(
        await RaydiumVaultService.registerDepositTrackingAccount({
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
          lpTokenMint
        })
      );
    }

    await RaydiumVaultService.issueShares({
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
      txn: transaction
    });

    // In case there's an issue in the vault sweeping backend, then we can enable this sweep vault code
    // await _sweepVault({
    //   platform,
    //   name,
    //   lpTokenAmount,
    //   transaction
    // });

    return sendTransaction(window.$web3, wallet, transaction, []);
  },

  handleReleaseFunds ({ platform, name, lpTokenAmount }) {
    const transactions = new anchor.web3.Transaction();

    // Chaining transactions so that in the final one we send them all together
    return Promise.resolve()
      .then(() => {
        return _releaseFunds({
          platform,
          name,
          lpTokenAmount,
          transactions
        });
      })
      .then((transactions) => {
        const { wallet } = getStore('WalletStore');

        return sendTransaction(window.$web3, wallet, transactions, []);
      });
  },

  handleUnstakeFunds ({ platform, name, lpTokenAmount }) {
    const transactions = new anchor.web3.Transaction();

    // Chaining transactions so that in the final one we send them all together
    return Promise.resolve()
      .then(() => {
        return _unstakeFunds({
          platform,
          name,
          lpTokenAmount,
          transactions
        });
      })
      .then((transactions) => {
        const { wallet } = getStore('WalletStore');

        return sendTransaction(window.$web3, wallet, transactions, []);
      });
  }
};
