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
  sendTransaction,
  sendAllTransactions
} from '../utils/web3';

// Vaults v2 Helpers
import {
  deriveTrackingAddress,
  deriveTrackingPdaAddress,
  deriveTrackingQueueAddress,
  createAssociatedTokenAccount,
  getVaultByPlatformAndName,
  getVaultId,
  deriveTrackingOrcaDDQueueAddress,
  getSharesForLpTokenAmount,
  deriveEphemeralTrackingAddress,
  getFarmTypeBN
} from './helpers/vaultHelpers';

import { getVaultV2ProgramId } from '../utils/configv2';
import { getOrcaVaultBySymbol } from '../utils/orcaVaults';

// IDL
import idl from '../idl/vaults_v2_idl.json';
import { AQUAFARM_PROGRAM_ID, ORCA_SWAP_PROGRAM_ID } from '../utils/ids';
import { isNil, map } from 'lodash';
import { ACCOUNT_LAYOUT } from '../utils/layouts';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { TOKENS } from '../utils/tokens';

/**
 * @private
 *
 * @description Release funds for orca vaults
 *
 * @param {Object} data
 * @returns transaction
 */
async function _releaseFunds ({
  platform,
  name,
  lpTokenAmount,
  transaction = new anchor.web3.Transaction()
}) {
  lpTokenAmount = Number(lpTokenAmount);
  const vaultConfig = getVaultByPlatformAndName(platform, name);
  const farmType = getFarmTypeBN(vaultConfig?.farm_type);

  const { wallet } = getStore('WalletStore'),
    provider = new anchor.Provider(window.$web3, wallet, {
      skipPreflight: false,
      preflightCommitment: commitment
    }),
    vault = new anchor.web3.PublicKey(vaultConfig?.orca?.account);

  const orcaVaultData = getOrcaVaultBySymbol(vaultConfig?.orca?.symbol);
  const { decimals } = orcaVaultData;

  const vaultId = getVaultId({
    symbol: orcaVaultData?.symbol,
    mintAddress: orcaVaultData?.mintAddress
  });
  const vaultStoreItem = getStore('VaultStore').get(vaultId);

  anchor.setProvider(provider);

  // Generate the program client from IDL.
  const programId = new anchor.web3.PublicKey(getVaultV2ProgramId());
  const program = new anchor.Program(idl, programId);

  const sharesMint = new anchor.web3.PublicKey(
    vaultConfig?.orca?.base?.shares_mint
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
    transaction.add(
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

  transaction.add(
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

  return transaction;
}

/**
 * @private
 *
 * @description Withdraw orca vault double dip - stage 1
 *
 * @param {Object} data
 * @returns transaction
 */
async function _withdrawOrcaVaultDdStageOne ({
  platform,
  name,
  lpTokenAmount,
  transaction = new anchor.web3.Transaction()
}) {
  const { wallet, tokenAccounts } = getStore('WalletStore');
  const provider = new anchor.Provider(window.$web3, wallet, {
    skipPreflight: false,
    preflightCommitment: commitment
  });

  anchor.setProvider(provider);

  // Generate the program client from IDL.
  const programId = new anchor.web3.PublicKey(getVaultV2ProgramId());
  const program = new anchor.Program(idl, programId);

  lpTokenAmount = Number(lpTokenAmount);

  const vaultConfig = getVaultByPlatformAndName(platform, name);
  const vault = new anchor.web3.PublicKey(vaultConfig?.orca?.account);
  const orcaVaultData = getOrcaVaultBySymbol(vaultConfig?.orca?.symbol);
  const { decimals } = orcaVaultData;

  const vaultId = getVaultId({
    symbol: orcaVaultData?.symbol,
    mintAddress: orcaVaultData?.mintAddress
  });
  const vaultStoreItem = getStore('VaultStore').get(vaultId);

  const vaultPda = new anchor.web3.PublicKey(vaultConfig?.orca?.base?.pda);
  const sharesMint = new anchor.web3.PublicKey(
    vaultConfig?.orca?.base?.shares_mint
  );
  const withdrawQueueAccount = new anchor.web3.PublicKey(
    vaultConfig?.orca?.base?.underlying_withdraw_queue
  );

  const farmTokenMint = new anchor.web3.PublicKey(
    vaultConfig?.orca?.dd_farm_data?.config_data?.farm_token_mint
  );
  const userFarm = new anchor.web3.PublicKey(
    vaultConfig?.orca?.dd_farm_data?.config_data?.user_farm_address
  );
  const convertAuthority = new anchor.web3.PublicKey(
    vaultConfig?.orca?.dd_farm_data?.config_data?.convert_authority
  );

  const vaultDDWithdrawQueueAccount = new anchor.web3.PublicKey(
    vaultConfig?.orca?.dd_farm_data?.withdraw_queue_account
  );
  const vaultFarmTokenAccount = new anchor.web3.PublicKey(
    vaultConfig?.orca?.dd_farm_data?.config_data?.vault_farm_token_account
  );
  const vaultSwapTokenAccount = new anchor.web3.PublicKey(
    vaultConfig?.orca?.dd_farm_data?.config_data?.vault_swap_token_account
  );
  const vaultRewardTokenAccount = new anchor.web3.PublicKey(
    vaultConfig?.orca?.dd_farm_data?.config_data?.vault_reward_token_account
  );
  const globalRewardTokenVault = new anchor.web3.PublicKey(
    vaultConfig?.orca?.dd_farm_data?.config_data?.global_reward_token_vault
  );
  const globalBaseTokenVault = new anchor.web3.PublicKey(
    vaultConfig?.orca?.dd_farm_data?.config_data?.global_base_token_vault
  );
  const globalFarm = new anchor.web3.PublicKey(
    vaultConfig?.orca?.dd_farm_data?.config_data?.global_farm
  );
  const vaultSwapTokenAccountB = new anchor.web3.PublicKey(
    vaultConfig?.orca?.dd_farm_data?.config_data?.vault_swap_token_b
  );

  const providerSharesAccount = await createAssociatedTokenAccount(
    provider,
    provider.wallet.publicKey,
    sharesMint
  );

  const farmData = vaultConfig?.orca?.dd_farm_data?.config_data;

  let {
    pool_swap_token_a: poolTokenA,
    pool_swap_token_b: poolTokenB,
    pool_swap_account: swapAccount,
    pool_swap_authority: swapAuthority,
    swap_pool_mint: swapPoolTokenMint,
    pool_fee_account: swapPoolFee,
    fee_collector_token_account: feeCollectorTokenAccount
  } = farmData || {};

  poolTokenA = new anchor.web3.PublicKey(poolTokenA);
  poolTokenB = new anchor.web3.PublicKey(poolTokenB);

  swapAccount = new anchor.web3.PublicKey(swapAccount);
  swapAuthority = new anchor.web3.PublicKey(swapAuthority);
  swapPoolTokenMint = new anchor.web3.PublicKey(swapPoolTokenMint);
  swapPoolFee = new anchor.web3.PublicKey(swapPoolFee);
  feeCollectorTokenAccount = new anchor.web3.PublicKey(
    feeCollectorTokenAccount
  );

  const receivingFarmTokenMint = new anchor.web3.PublicKey(
    vaultConfig?.orca?.farm_data?.farm_token_mint
  );
  const receivingUnderlyingTokenAccount = await createAssociatedTokenAccount(
    provider,
    provider.wallet.publicKey,
    receivingFarmTokenMint
  );

  const hasReceivingUnderlyingTokenAccount = await window.$web3.getAccountInfo(
    receivingUnderlyingTokenAccount
  );

  if (!hasReceivingUnderlyingTokenAccount) {
    transaction.add(
      await serumAssoToken.createAssociatedTokenAccount(
        // who will pay for the account creation
        provider.wallet.publicKey,

        // who is the account getting created for
        provider.wallet.publicKey,

        // what mint address token is being created
        receivingFarmTokenMint
      )
    );
  }

  const [ephemeralTrackingAccount] = await deriveEphemeralTrackingAddress(
    vault,
    provider.wallet.publicKey,
    programId
  );

  const { totalShares, totalDepositedBalance } = vaultStoreItem;

  const shares = getSharesForLpTokenAmount({
    lpTokenAmount,
    totalDepositedBalance,
    totalShares,
    decimals,
    lockedShares:
      tokenAccounts[vaultConfig?.orca?.base?.shares_mint].balance.wei
  });

  transaction.add(
    await program.instruction.withdrawOrcaVaultDdStageOne(
      {
        amount: new anchor.BN(shares),
        doubleDip: true
      },
      {
        accounts: {
          configData: {
            authority: provider.wallet.publicKey,
            vault,
            vaultPda,
            underlyingWithdrawQueue: withdrawQueueAccount,
            burningSharesTokenAccount: providerSharesAccount,
            receivingUnderlyingTokenAccount: withdrawQueueAccount,
            vaultFarmTokenAccount,
            vaultSwapTokenAccount,
            vaultSwapTokenAccountB,
            vaultRewardTokenAccount,
            globalRewardTokenVault,
            globalBaseTokenVault,
            poolTokenA,
            poolTokenB,
            globalFarm,
            userFarm,
            convertAuthority,
            swapAccount,
            swapAuthority,
            swapPoolTokenMint,
            farmTokenMint,
            sharesMint,
            swapPoolFee,
            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
            tokenProgram: splToken.TOKEN_PROGRAM_ID,
            swapProgram: ORCA_SWAP_PROGRAM_ID,
            aquafarmProgram: AQUAFARM_PROGRAM_ID
          }
        },
        remainingAccounts: [
          {
            pubkey: ephemeralTrackingAccount,
            isSigner: false,
            isWritable: true
          },
          {
            pubkey: anchor.web3.SystemProgram.programId,
            isSigner: false,
            isWritable: false
          },
          {
            pubkey: feeCollectorTokenAccount,
            isSigner: false,
            isWritable: true
          },
          {
            pubkey: vaultDDWithdrawQueueAccount,
            isSigner: false,
            isWritable: true
          }
        ]
      }
    )
  );

  return { transaction, signers: [] };
}

/**
 * @private
 *
 * @description Withdraw orca vault double dip - stage 2
 *
 * @param {Object} data
 * @returns transaction
 */
async function _withdrawOrcaVaultDdStageTwo ({
  platform,
  name,
  lpTokenAmount,
  transaction = new anchor.web3.Transaction()
}) {
  const { wallet, tokenAccounts } = getStore('WalletStore');
  const provider = new anchor.Provider(window.$web3, wallet, {
    skipPreflight: false,
    preflightCommitment: commitment
  });

  anchor.setProvider(provider);

  // Generate the program client from IDL.
  const programId = new anchor.web3.PublicKey(getVaultV2ProgramId());
  const program = new anchor.Program(idl, programId);

  lpTokenAmount = Number(lpTokenAmount);

  const vaultConfig = getVaultByPlatformAndName(platform, name);
  const vault = new anchor.web3.PublicKey(vaultConfig?.orca?.account);
  const orcaVaultData = getOrcaVaultBySymbol(vaultConfig?.orca?.symbol);
  const { decimals } = orcaVaultData;

  const vaultId = getVaultId({
    symbol: orcaVaultData?.symbol,
    mintAddress: orcaVaultData?.mintAddress
  });
  const vaultStoreItem = getStore('VaultStore').get(vaultId);

  const vaultPda = new anchor.web3.PublicKey(vaultConfig?.orca?.base?.pda);
  const sharesMint = new anchor.web3.PublicKey(
    vaultConfig?.orca?.base?.shares_mint
  );
  const withdrawQueueAccount = new anchor.web3.PublicKey(
    vaultConfig?.orca?.base?.underlying_withdraw_queue
  );

  const farmTokenMint = new anchor.web3.PublicKey(
    vaultConfig?.orca?.farm_data?.farm_token_mint
  );
  const userFarm = new anchor.web3.PublicKey(
    vaultConfig?.orca?.farm_data?.user_farm_address
  );
  const convertAuthority = new anchor.web3.PublicKey(
    vaultConfig?.orca?.farm_data?.convert_authority
  );

  const vaultFarmTokenAccount = new anchor.web3.PublicKey(
    vaultConfig?.orca?.farm_data?.vault_farm_token_account
  );
  const vaultSwapTokenAccount = new anchor.web3.PublicKey(
    vaultConfig?.orca?.farm_data?.vault_swap_token_account
  );
  const vaultRewardTokenAccount = new anchor.web3.PublicKey(
    vaultConfig?.orca?.farm_data?.vault_reward_token_account
  );
  const globalRewardTokenVault = new anchor.web3.PublicKey(
    vaultConfig?.orca?.farm_data?.global_reward_token_vault
  );
  const globalBaseTokenVault = new anchor.web3.PublicKey(
    vaultConfig?.orca?.farm_data?.global_base_token_vault
  );
  const globalFarm = new anchor.web3.PublicKey(
    vaultConfig?.orca?.farm_data?.global_farm
  );
  const vaultSwapTokenAccountB = new anchor.web3.PublicKey(
    vaultConfig?.orca?.farm_data?.vault_swap_token_b
  );

  const mintForBurningSharesTokenAccount = vaultConfig?.orca?.double_dip ?
    farmTokenMint :
    sharesMint;

  const burningSharesTokenAccount = await createAssociatedTokenAccount(
    provider,
    provider.wallet.publicKey,
    mintForBurningSharesTokenAccount
  );

  const farmData = vaultConfig?.orca?.farm_data;

  let {
    pool_swap_token_a: poolTokenA,
    pool_swap_token_b: poolTokenB,
    pool_swap_account: swapAccount,
    pool_swap_authority: swapAuthority,
    swap_pool_mint: swapPoolTokenMint,
    pool_fee_account: swapPoolFee,
    fee_collector_token_account: feeCollectorTokenAccount
  } = farmData || {};

  poolTokenA = new anchor.web3.PublicKey(poolTokenA);
  poolTokenB = new anchor.web3.PublicKey(poolTokenB);

  swapAccount = new anchor.web3.PublicKey(swapAccount);
  swapAuthority = new anchor.web3.PublicKey(swapAuthority);
  swapPoolTokenMint = new anchor.web3.PublicKey(swapPoolTokenMint);
  swapPoolFee = new anchor.web3.PublicKey(swapPoolFee);
  feeCollectorTokenAccount = new anchor.web3.PublicKey(
    feeCollectorTokenAccount
  );

  const receivingUnderlyingTokenAccount = await createAssociatedTokenAccount(
    provider,
    provider.wallet.publicKey,
    swapPoolTokenMint
  );

  const hasReceivingUnderlyingTokenAccount = await window.$web3.getAccountInfo(
    receivingUnderlyingTokenAccount
  );

  if (!hasReceivingUnderlyingTokenAccount) {
    transaction.add(
      await serumAssoToken.createAssociatedTokenAccount(
        // who will pay for the account creation
        provider.wallet.publicKey,

        // who is the account getting created for
        provider.wallet.publicKey,

        // what mint address token is being created
        swapPoolTokenMint
      )
    );
  }

  const [ephemeralTrackingAccount] = await deriveEphemeralTrackingAddress(
    vault,
    provider.wallet.publicKey,
    programId
  );

  const { totalShares, totalDepositedBalance } = vaultStoreItem;

  const shares = getSharesForLpTokenAmount({
    lpTokenAmount,
    totalDepositedBalance,
    totalShares,
    decimals,
    lockedShares:
      tokenAccounts[vaultConfig?.orca?.base?.shares_mint].balance.wei
  });

  const accounts = {
    authority: provider.wallet.publicKey,
    vault,
    vaultPda,
    burningSharesTokenAccount,
    receivingUnderlyingTokenAccount: withdrawQueueAccount,
    vaultFarmTokenAccount,
    vaultSwapTokenAccount,
    vaultRewardTokenAccount,
    globalRewardTokenVault,
    poolTokenA,
    poolTokenB,
    globalFarm,
    globalBaseTokenVault,
    userFarm,
    convertAuthority,
    swapAccount,
    swapAuthority,
    swapPoolTokenMint,
    farmTokenMint,
    sharesMint,
    swapPoolFee,
    tokenProgram: splToken.TOKEN_PROGRAM_ID,
    swapProgram: ORCA_SWAP_PROGRAM_ID,
    aquafarmProgram: AQUAFARM_PROGRAM_ID
  };

  let data = {};

  if (vaultConfig?.orca?.double_dip) {
    const vaultDDWithdrawQueueAccount = new anchor.web3.PublicKey(
      vaultConfig?.orca?.dd_farm_data?.withdraw_queue_account
    );

    // Update the vaultFarmTokenAccount with vaultDDWithdrawQueueAccount for double dip
    data = {
      accounts: {
        configData: {
          ...accounts,

          // receivingUnderlyingTokenAccount: vaultDDWithdrawQueueAccount

          vaultFarmTokenAccount: vaultDDWithdrawQueueAccount
        },
        ephemeralTrackingAccount
      },
      remainingAccounts: [
        {
          pubkey: feeCollectorTokenAccount,
          isSigner: false,
          isWritable: true
        }
      ]
    };

    transaction.add(
      await program.instruction.withdrawOrcaVaultDdStageTwo({
        options: {
          skipPreflight: false
        },
        ...data
      })
    );
  }
  else {
    const PROPS_FOR_NON_DOUBLE_DIP = {
      vaultSwapTokenAccountB,
      underlyingWithdrawQueue: withdrawQueueAccount
    };

    data = {
      accounts: {
        ...accounts,
        ...PROPS_FOR_NON_DOUBLE_DIP
      },
      remainingAccounts: [
        {
          pubkey: ephemeralTrackingAccount,
          isSigner: false,
          isWritable: true
        },
        {
          pubkey: anchor.web3.SystemProgram.programId,
          isSigner: false,
          isWritable: false
        },
        {
          pubkey: feeCollectorTokenAccount,
          isSigner: false,
          isWritable: true
        }
      ]
    };

    transaction.add(
      await program.instruction.withdrawOrcaVault(
        {
          amount: new anchor.BN(shares),
          doubleDip: false
        },
        {
          options: {
            skipPreflight: false
          },
          ...data
        }
      )
    );
  }

  return { transaction, signers: [] };
}

/**
 * @private
 *
 * @description Withdraw orca vault - remove liquidity
 *
 * @param {Object} data
 * @returns transaction
 */
async function _withdrawOrcaVaultRemoveLiq ({
  platform,
  name,
  transaction = new anchor.web3.Transaction()
}) {
  const { wallet } = getStore('WalletStore');
  const provider = new anchor.Provider(window.$web3, wallet, {
    skipPreflight: false,
    preflightCommitment: commitment
  });

  anchor.setProvider(provider);

  // Generate the program client from IDL.
  const programId = new anchor.web3.PublicKey(getVaultV2ProgramId());
  const program = new anchor.Program(idl, programId);

  const vaultConfig = getVaultByPlatformAndName(platform, name);
  const vault = new anchor.web3.PublicKey(vaultConfig?.orca?.account);
  const vaultPda = new anchor.web3.PublicKey(vaultConfig?.orca?.base?.pda);
  const orcaVaultData = getOrcaVaultBySymbol(vaultConfig?.orca?.symbol);
  const sharesMint = new anchor.web3.PublicKey(
    vaultConfig?.orca?.base?.shares_mint
  );

  const withdrawQueueAccount = new anchor.web3.PublicKey(
    vaultConfig?.orca?.base?.underlying_withdraw_queue
  );

  const farmData = vaultConfig?.orca?.farm_data;

  let {
    token_a_mint: tokenAMint,
    token_b_mint: tokenBMint,
    pool_swap_token_a: poolTokenA,
    pool_swap_token_b: poolTokenB,
    pool_swap_account: swapAccount,
    pool_swap_authority: swapAuthority,
    swap_pool_mint: swapPoolTokenMint,
    pool_fee_account: swapPoolFee
  } = farmData || {};

  tokenAMint = new anchor.web3.PublicKey(tokenAMint);
  tokenBMint = new anchor.web3.PublicKey(tokenBMint);

  poolTokenA = new anchor.web3.PublicKey(poolTokenA);
  poolTokenB = new anchor.web3.PublicKey(poolTokenB);

  swapAccount = new anchor.web3.PublicKey(swapAccount);
  swapAuthority = new anchor.web3.PublicKey(swapAuthority);
  swapPoolTokenMint = new anchor.web3.PublicKey(swapPoolTokenMint);
  swapPoolFee = new anchor.web3.PublicKey(swapPoolFee);

  const [ephemeralTrackingAccount] = await deriveEphemeralTrackingAddress(
    vault,
    provider.wallet.publicKey,
    programId
  );

  let fundingTokenAccountA = await serumAssoToken.getAssociatedTokenAddress(
    provider.wallet.publicKey,
    tokenAMint
  );

  let fundingTokenAccountB = await serumAssoToken.getAssociatedTokenAddress(
    provider.wallet.publicKey,
    tokenBMint
  );

  // const { coin, pc } = orcaVaultData;
  // const { decimals: coinDecimals } = coin;
  // const { decimals: pcDecimals } = pc;

  const [baseToken, quoteToken] = orcaVaultData?.coins;

  let signers = [];

  // let coinReceivingTokenAccount = new anchor.web3.PublicKey(
  //   tokenAccounts[baseToken.mintAddress]?.tokenAccountAddress
  // );
  // let pcReceivingTokenAccount = new anchor.web3.PublicKey(
  //   tokenAccounts[quoteToken.mintAddress]?.tokenAccountAddress
  // );

  if (baseToken.symbol === 'SOL') {
    const lamportsToCreateAccount =
      await window.$web3.getMinimumBalanceForRentExemption(
        ACCOUNT_LAYOUT.span,
        commitment
      );

    const newAccount = new anchor.web3.Account();

    signers.push(newAccount);

    fundingTokenAccountA = newAccount.publicKey;
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: fundingTokenAccountA,
        lamports: lamportsToCreateAccount,
        space: ACCOUNT_LAYOUT.span,
        programId: splToken.TOKEN_PROGRAM_ID
      })
    );

    transaction.add(
      splToken.Token.createInitAccountInstruction(
        splToken.TOKEN_PROGRAM_ID,
        new PublicKey(TOKENS.WSOL.mintAddress),
        fundingTokenAccountA,
        wallet.publicKey
      )
    );
  }

  if (quoteToken.symbol === 'SOL') {
    const lamportsToCreateAccount =
      await window.$web3.getMinimumBalanceForRentExemption(
        ACCOUNT_LAYOUT.span,
        commitment
      );

    const newAccount = new anchor.web3.Account();

    signers.push(newAccount);

    fundingTokenAccountB = newAccount.publicKey;
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: fundingTokenAccountB,
        lamports: lamportsToCreateAccount,
        space: ACCOUNT_LAYOUT.span,
        programId: splToken.TOKEN_PROGRAM_ID
      })
    );

    transaction.add(
      splToken.Token.createInitAccountInstruction(
        splToken.TOKEN_PROGRAM_ID,
        new PublicKey(TOKENS.WSOL.mintAddress),
        fundingTokenAccountB,
        wallet.publicKey
      )
    );
  }

  const doubleDip = vaultConfig?.orca?.double_dip;

  transaction.add(
    await program.instruction.withdrawOrcaVaultRemoveLiq(doubleDip, {
      accounts: {
        authority: provider.wallet.publicKey,
        burningUnderlyingAccount: withdrawQueueAccount,
        removeLiq: {
          fundingTokenAccountA,
          fundingTokenAccountB,
          poolTokenA,
          poolTokenB,
          swapProgram: ORCA_SWAP_PROGRAM_ID,
          swapAccount,
          swapAuthority,
          swapPoolTokenMint
        },
        swapFeeAccount: swapPoolFee,
        tokenProgram: splToken.TOKEN_PROGRAM_ID,
        ephemeralTrackingAccount,
        vault,
        vaultPda,
        sharesMint
      }
    })
  );

  if (baseToken.symbol === 'SOL') {
    transaction.add(
      splToken.Token.createCloseAccountInstruction(
        splToken.TOKEN_PROGRAM_ID,
        fundingTokenAccountA,
        wallet.publicKey,
        wallet.publicKey,
        []
      )
    );
  }

  if (quoteToken.symbol === 'SOL') {
    transaction.add(
      splToken.Token.createCloseAccountInstruction(
        splToken.TOKEN_PROGRAM_ID,
        fundingTokenAccountB,
        wallet.publicKey,
        wallet.publicKey,
        []
      )
    );
  }

  return { transaction, signers };
}

/**
 * @private
 *
 * @description Unstake funds for orca vaults
 *
 * @param {Object} data
 * @returns transaction
 */
async function _unstakeFunds ({
  platform,
  name,
  lpTokenAmount,
  availableForWithdraw
}) {
  const vaultConfig = getVaultByPlatformAndName(platform, name);
  const orcaVaultData = getOrcaVaultBySymbol(vaultConfig?.orca?.symbol);
  const transactions = [];

  // Do not run stage one when availableForWithdraw has some value (it's the fix unstake funds flow)
  if (vaultConfig?.orca?.double_dip && isNil(availableForWithdraw)) {
    const { transaction: stageOneTransactions, signers: stageOneSigners } =
      await _withdrawOrcaVaultDdStageOne({
        platform,
        name,
        lpTokenAmount
      });

    transactions.push({
      transaction: stageOneTransactions,
      signers: stageOneSigners
    });
  }

  const [baseToken, quoteToken] = orcaVaultData?.coins;

  // If either of the tokens are 'SOL' token then we need to split in into two tx's
  if ([baseToken?.symbol, quoteToken?.symbol].includes('SOL')) {
    const { transaction: stageTwoTransaction, signers: stageTwoSigners } =
      await _withdrawOrcaVaultDdStageTwo({
        platform,
        name,
        lpTokenAmount:
          availableForWithdraw > 0 ? availableForWithdraw : lpTokenAmount
      });

    transactions.push({
      transaction: stageTwoTransaction,
      signers: stageTwoSigners
    });

    const { transaction: removeLiqTransaction, signers: removeLiqSigners } =
      await _withdrawOrcaVaultRemoveLiq({
        platform,
        name,
        lpTokenAmount:
          availableForWithdraw > 0 ? availableForWithdraw : lpTokenAmount
      });

    transactions.push({
      transaction: removeLiqTransaction,
      signers: removeLiqSigners
    });
  }

  // Otherwise we can just have a single transaction for both the steps
  else {
    const { transaction: stageTwoTransaction, signers: stageTwoSigners } =
      await _withdrawOrcaVaultDdStageTwo({
        platform,
        name,
        lpTokenAmount:
          availableForWithdraw > 0 ? availableForWithdraw : lpTokenAmount
      });

    const { transaction: removeLiqTransaction, signers: removeLiqSigners } =
      await _withdrawOrcaVaultRemoveLiq({
        platform,
        name,
        lpTokenAmount:
          availableForWithdraw > 0 ? availableForWithdraw : lpTokenAmount,

        // Forward the same transaction as of stageTwo to this step
        transaction: stageTwoTransaction
      });

    transactions.push({
      transaction: removeLiqTransaction,
      signers: [...stageTwoSigners, ...removeLiqSigners]
    });
  }

  return transactions;
}

/**
 * @private
 *
 * @description Register deposit tracking account for the vault
 *
 * @param {Object} data
 * @returns {Promise} depositTrackingAccount
 */
async function _registerDepositTrackingAccount ({
  programId,
  program,
  vault,
  provider,
  depositTrackingAccount,
  depositTrackingPda,
  farmType,
  sharesMint,
  vaultConfig
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

  const [depositTrackingOrcaDDQueueAddress] =
    await deriveTrackingOrcaDDQueueAddress(
      programId,
      vault,
      depositTrackingPda
    );

  const farmTokenMint = new anchor.web3.PublicKey(
    vaultConfig?.orca?.farm_data?.farm_token_mint
  );

  const accountsData = {
    authority: provider.wallet.publicKey,
    vault: vault,
    depositTrackingAccount,
    depositTrackingQueueAccount,
    depositTrackingHoldAccount,
    depositTrackingPda,
    sharesMint,
    tokenProgram: splToken.TOKEN_PROGRAM_ID,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    systemProgram: anchor.web3.SystemProgram.programId
  };

  // @TODO: Verify this for non double dip flows
  let payload = {
    accounts: accountsData
  };

  if (vaultConfig?.orca?.double_dip) {
    payload.remainingAccounts = [
      {
        pubkey: depositTrackingOrcaDDQueueAddress,
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: farmTokenMint,
        isSigner: false,
        isWritable: true
      }
    ];
  }

  return program.instruction.registerDepositTrackingAccount(farmType, payload);
}

/**
 * @private
 *
 * @description Add liquidity and issue shares to orca vault
 *
 * @param {Object} data
 * @returns transactionObj
 */
async function _addLiquidityAndIssueShares ({
  program,
  provider,
  vault,
  depositTrackingAccount,
  depositTrackingPda,
  tokenAmountA,
  tokenAmountB,
  farmType,
  vaultData,
  vaultConfig,
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

  const farmData = vaultConfig?.orca?.double_dip ?
    vaultConfig?.orca?.dd_farm_data?.config_data :
    vaultConfig?.orca?.farm_data;

  let {
    token_a_mint: tokenAMint,
    token_b_mint: tokenBMint,
    pool_swap_token_a: poolTokenA,
    pool_swap_token_b: poolTokenB,
    pool_swap_account: swapAccount,
    pool_swap_authority: swapAuthority,
    swap_pool_mint: swapPoolTokenMint
  } = farmData || {};

  tokenAMint = new anchor.web3.PublicKey(tokenAMint);
  tokenBMint = new anchor.web3.PublicKey(tokenBMint);

  poolTokenA = new anchor.web3.PublicKey(poolTokenA);
  poolTokenB = new anchor.web3.PublicKey(poolTokenB);

  swapAccount = new anchor.web3.PublicKey(swapAccount);
  swapAuthority = new anchor.web3.PublicKey(swapAuthority);
  swapPoolTokenMint = new anchor.web3.PublicKey(swapPoolTokenMint);

  let fundingTokenAccountA = await createAssociatedTokenAccount(
    provider,
    provider.wallet.publicKey,
    tokenAMint
  );

  let fundingTokenAccountB = await createAssociatedTokenAccount(
    provider,
    provider.wallet.publicKey,
    tokenBMint
  );

  const { coin, pc } = vaultData;
  const { decimals: coinDecimals } = coin;
  const { decimals: pcDecimals } = pc;

  const [baseToken, quoteToken] = vaultData?.coins;

  let signers = [];

  const { wallet } = getStore('WalletStore');

  if (baseToken?.symbol === 'SOL') {
    const lamportsToCreateAccount =
      await window.$web3.getMinimumBalanceForRentExemption(
        ACCOUNT_LAYOUT.span,
        commitment
      );

    const newAccount = new anchor.web3.Account();

    signers.push(newAccount);

    fundingTokenAccountA = newAccount.publicKey;
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: fundingTokenAccountA,
        lamports:
          tokenAmountA * Math.pow(10, baseToken.decimals) +
          lamportsToCreateAccount,
        space: ACCOUNT_LAYOUT.span,
        programId: splToken.TOKEN_PROGRAM_ID
      })
    );

    transaction.add(
      splToken.Token.createInitAccountInstruction(
        splToken.TOKEN_PROGRAM_ID,
        new PublicKey(TOKENS.WSOL.mintAddress),
        fundingTokenAccountA,
        wallet.publicKey
      )
    );
  }

  if (quoteToken?.symbol === 'SOL') {
    const lamportsToCreateAccount =
      await window.$web3.getMinimumBalanceForRentExemption(
        ACCOUNT_LAYOUT.span,
        commitment
      );

    const newAccount = new anchor.web3.Account();

    signers.push(newAccount);

    fundingTokenAccountB = newAccount.publicKey;
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: fundingTokenAccountB,
        lamports:
          tokenAmountB * Math.pow(10, quoteToken.decimals) +
          lamportsToCreateAccount,
        space: ACCOUNT_LAYOUT.span,
        programId: splToken.TOKEN_PROGRAM_ID
      })
    );

    transaction.add(
      splToken.Token.createInitAccountInstruction(
        splToken.TOKEN_PROGRAM_ID,
        new PublicKey(TOKENS.WSOL.mintAddress),
        fundingTokenAccountB,
        wallet.publicKey
      )
    );
  }

  transaction.add(
    program.instruction.orcaAddLiqIssueShares(
      {
        tokenAmountA: new anchor.BN(tokenAmountA * Math.pow(10, coinDecimals)),
        tokenAmountB: new anchor.BN(tokenAmountB * Math.pow(10, pcDecimals)),
        farmType
      },
      {
        accounts: {
          issueShares: {
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
          },
          aquaFarmProgram: AQUAFARM_PROGRAM_ID,
          addLiq: {
            fundingTokenAccountA,
            fundingTokenAccountB,
            poolTokenA,
            poolTokenB,
            swapAccount,
            swapAuthority,
            swapPoolTokenMint,
            swapProgram: ORCA_SWAP_PROGRAM_ID
          }
        }
      }
    )
  );

  // :prayge: therealssj
  if (baseToken.symbol === 'SOL') {
    transaction.add(
      splToken.Token.createCloseAccountInstruction(
        splToken.TOKEN_PROGRAM_ID,
        fundingTokenAccountA,
        wallet.publicKey,
        wallet.publicKey,
        []
      )
    );
  }

  if (quoteToken.symbol === 'SOL') {
    transaction.add(
      splToken.Token.createCloseAccountInstruction(
        splToken.TOKEN_PROGRAM_ID,
        fundingTokenAccountB,
        wallet.publicKey,
        wallet.publicKey,
        []
      )
    );
  }

  return signers;
}

export const OrcaVaultService = {
  EPHEMERAL_REQUIRED_PROPS: ['availableForWithdraw', 'liqToRemove'],

  async handleDepositToVault ({ platform, name, tokenAmountA, tokenAmountB }) {
    // Make sure these two properties are also Number type, to avoid any calculation problems
    tokenAmountA = Number(tokenAmountA);
    tokenAmountB = Number(tokenAmountB);

    const vaultConfig = getVaultByPlatformAndName(platform, name);
    const farmType = getFarmTypeBN(vaultConfig?.farm_type);

    const { wallet } = getStore('WalletStore');
    const provider = new anchor.Provider(window.$web3, wallet, {
      skipPreflight: false,
      preflightCommitment: commitment
    });

    anchor.setProvider(provider);

    // Generate the program client from IDL.
    const programId = new anchor.web3.PublicKey(getVaultV2ProgramId());
    const program = new anchor.Program(idl, programId);

    const vault = new anchor.web3.PublicKey(vaultConfig?.orca?.account);
    const vaultData = getOrcaVaultBySymbol(vaultConfig?.orca?.symbol);
    const { decimals } = vaultData || {};

    const vaultPda = new anchor.web3.PublicKey(vaultConfig?.orca?.base?.pda);
    const sharesMint = new anchor.web3.PublicKey(
      vaultConfig?.orca?.base?.shares_mint
    );
    const mintAddress = vaultConfig?.orca?.base?.underlying_mint;
    const lpTokenMint = new anchor.web3.PublicKey(mintAddress);

    const swapPoolMint = new anchor.web3.PublicKey(
      vaultConfig?.orca?.farm_data?.swap_pool_mint
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

    // Get the deposit tracking account info for the user
    const hasTrackingAccountInfo = await window.$web3.getAccountInfo(
      depositTrackingAccount
    );

    const transaction = new anchor.web3.Transaction();

    // Register the deposit tracking account if it doesn't exist for the user
    // This flow generally happens only for the first time when the user is depositing in the vault
    if (!hasTrackingAccountInfo) {
      transaction.add(
        await _registerDepositTrackingAccount({
          programId,
          program,
          vault,
          provider,
          depositTrackingAccount,
          depositTrackingPda,
          farmType,
          sharesMint,
          vaultData,
          vaultConfig
        })
      );
    }

    const userLpTokenAccount = await createAssociatedTokenAccount(
      provider,
      provider.wallet.publicKey,
      swapPoolMint
    );

    const hasUserLpTokenAccount = await window.$web3.getAccountInfo(
      userLpTokenAccount
    );

    if (!hasUserLpTokenAccount) {
      transaction.add(
        await serumAssoToken.createAssociatedTokenAccount(
          // who will pay for the account creation
          provider.wallet.publicKey,

          // who is the account getting created for
          provider.wallet.publicKey,

          // what mint address token is being created
          swapPoolMint
        )
      );
    }

    const signers = await _addLiquidityAndIssueShares({
      program,
      programId,
      provider,
      vault,
      depositTrackingAccount,
      depositTrackingPda,
      tokenAmountA,
      tokenAmountB,
      decimals,
      farmType,
      name,
      platform,
      vaultData,
      vaultConfig,
      vaultPda,
      sharesMint,
      lpTokenMint,
      userLpTokenAccount,
      transaction
    });

    return sendTransaction(window.$web3, wallet, transaction, signers);
  },

  handleReleaseFunds ({ platform, name, lpTokenAmount }) {
    const transaction = new anchor.web3.Transaction();

    // Chaining transactions so that in the final one we send them all together
    return Promise.resolve()
      .then(() => {
        return _releaseFunds({
          platform,
          name,
          lpTokenAmount,
          transaction
        });
      })
      .then((transaction) => {
        const { wallet } = getStore('WalletStore');

        return sendTransaction(window.$web3, wallet, transaction, []);
      });
  },

  handleUnstakeFunds ({
    platform,
    name,
    lpTokenAmount,
    availableForWithdraw
  }) {
    let signers = [];

    // Chaining transactions so that in the final one we send them all together
    return Promise.resolve()
      .then(() => {
        return _unstakeFunds({
          platform,
          name,
          lpTokenAmount,
          availableForWithdraw
        });
      })
      .then((transactionsData) => {
        const transactions = map(transactionsData, 'transaction');

        // Signers should be a 2D array likeL: [[account1], [account2]]
        const _signers = map(transactionsData, 'signers');

        // Store the signers
        signers = _signers;

        return Promise.all(transactions);
      })
      .then((transactions) => {
        const { wallet } = getStore('WalletStore');

        return sendAllTransactions(
          window.$web3,
          wallet,
          transactions,
          [],
          signers
        );
      });
  }
};
