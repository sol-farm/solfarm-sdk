/* eslint-disable max-len */
import * as anchor from '@project-serum/anchor';
import * as serumAssoToken from '@project-serum/associated-token';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import VAULTS_V2_CONFIG from '../../constants/vaults_v2_config.json';
import { FARM_PLATFORMS, UI_CONFIG_PLATFORM_MAPPING } from '../../constants';
import { compact, find, isNil, toUpper } from 'lodash';

export function deriveManagementAddress (programId) {
  return anchor.web3.PublicKey.findProgramAddress(
    [programId.toBuffer(), Buffer.from('management')],
    programId
  );
}

export function deriveVaultAddress (programId, farmPartOne, farmPartTwo) {
  return anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from('v1'),
      farmPartOne.toArrayLike(Buffer, 'le', 8),
      farmPartTwo.toArrayLike(Buffer, 'le', 8)
    ],
    programId
  );
}

export function deriveVaultPdaAddress (programId, vault) {
  return anchor.web3.PublicKey.findProgramAddress(
    [vault.toBuffer()],
    programId
  );
}

export function deriveSharesMintAddress (programId, vault, mint) {
  return anchor.web3.PublicKey.findProgramAddress(
    [vault.toBuffer(), mint.toBuffer()],
    programId
  );
}

// / derives the address of a raydium vault user stake info address
export function deriveRaydiumUserStakeInfoAddress (programId, vaultPda) {
  return anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('info'), vaultPda.toBuffer()],
    programId
  );
}

// / derives the address of a vault withdraw queue
export function deriveWithdrawQueueAddress (
  programId,
  vault,
  underlyingMint
) {
  return anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('withdrawqueue'), vault.toBuffer(), underlyingMint.toBuffer()],
    programId
  );
}

// / derives the address of a vault compound queue
export function deriveCompoundQueueAddress (
  programId,
  vault,
  underlyingMint
) {
  return anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('compoundqueue'), vault.toBuffer(), underlyingMint.toBuffer()],
    programId
  );
}

export function deriveSerumTradeAccount (programId) {
  return anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('srm')],
    programId
  );
}

export function deriveSerumTradePdaAddress (programId, tradeAccount) {
  return anchor.web3.PublicKey.findProgramAddress(
    [tradeAccount.toBuffer()],
    programId
  );
}

export function deriveSerumTradeOpenOrdersAddress (
  programId,
  tradeAccount,
  serumMarket
) {
  return anchor.web3.PublicKey.findProgramAddress(
    [tradeAccount.toBuffer(), serumMarket.toBuffer()],
    programId
  );
}

export function deriveSerumFeeRecipientAddress (
  programId,
  mint,
  tradePda
) {
  return anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('serumfee'), tradePda.toBuffer(), mint.toBuffer()],
    programId
  );
}

export function deriveTrackingAddress (programId, vault, owner) {
  return anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('tracking'), vault.toBuffer(), owner.toBuffer()],
    programId
  );
}

export function deriveTrackingPdaAddress (programId, trackingAddress) {
  return anchor.web3.PublicKey.findProgramAddress(
    [trackingAddress.toBuffer()],
    programId
  );
}

export function deriveTrackingQueueAddress (
  programId,
  trackingPdaAddress
) {
  return anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('queue'), trackingPdaAddress.toBuffer()],
    programId
  );
}

export function createAssociatedTokenAccount (
  provider, // payer
  owner,
  mint
) {
  return serumAssoToken.getAssociatedTokenAddress(owner, mint);
}

export async function findAssociatedStakeInfoAddress (
  poolId,
  walletAddress,
  programId
) {
  let [_associatedStakerSeed] =
    await anchor.web3.PublicKey.findProgramAddress(
      [
        poolId.toBuffer(),
        walletAddress.toBuffer(),
        Buffer.from('staker_info_v2_associated_seed')
      ],
      programId
    );

  return _associatedStakerSeed;
}

export function deriveLendingPlatformAccountAddress (
  vaultPda,
  lendingMarket,
  programId
) {
  return anchor.web3.PublicKey.findProgramAddress(
    [vaultPda.toBuffer(), lendingMarket.toBuffer()],
    programId
  );
}

export function deriveLndingPlatformInformationAccountAddress (
  vault,
  index,
  programId
) {
  return anchor.web3.PublicKey.findProgramAddress(
    [vault.toBuffer(), index.toArrayLike(Buffer, 'le', 8)],
    programId
  );
}

export function deriveLendingPlatformConfigDataAddress (
  platformAddress,
  programId
) {
  return anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('v1'), platformAddress.toBuffer()],
    programId
  );
}

export function deriveMangoAccountAddress (vault, programId) {
  return anchor.web3.PublicKey.findProgramAddress(
    [vault.toBuffer(), Buffer.from('mango')],
    programId
  );
}

export function deriveOrcaUserFarmAddress (
  globalFarm,
  owner,
  aquaFarmProgramId
) {
  return anchor.web3.PublicKey.findProgramAddress(
    [globalFarm.toBuffer(), owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer()],
    aquaFarmProgramId
  );
}

// / derives the address of an orca double dip vault compound queue account
export function deriveOrcaDDCompoundQueueAddress (
  programId,
  vault,
  ddFarmTokenMint
) {
  return anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from('ddcompoundqueue'),
      vault.toBuffer(),
      ddFarmTokenMint.toBuffer()
    ],
    programId
  );
}

export function deriveTrackingOrcaDDQueueAddress (
  programId,
  vault,
  trackingPda
) {
  return anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('ddwithdrawqueue'), trackingPda.toBuffer(), vault.toBuffer()],
    programId
  );
}

export function deriveMultiDepositStateTransitionAddress (
  vault,
  programId
) {
  return anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('statetransition'), vault.toBuffer()],
    programId
  );
}

export function deriveEphemeralTrackingAddress (
  vault,
  owner,
  programId
) {
  return anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from('ephemeraltracking'),
      vault.toBuffer(),
      owner.toBuffer()
    ],
    programId
  );
}

export function getVaultByPlatformAndName (platform, vaultName) {
  if (!platform || !vaultName) {
    return {};
  }

  const _platform = UI_CONFIG_PLATFORM_MAPPING[platform];

  const key = `${_platform?.toUpperCase()}-${vaultName?.toUpperCase()}`;

  if (_platform === UI_CONFIG_PLATFORM_MAPPING.saber) {
    return VAULTS_V2_CONFIG.vaults.accounts.find((vault) => { return toUpper(vault[_platform]?.symbol) === toUpper(vaultName); });
  }

  return VAULTS_V2_CONFIG.vaults.accounts.find((vault) => { return toUpper(vault[_platform]?.name) === key; });
}

export function getAllVaultNameSymbolMap () {
  let names = {};

  VAULTS_V2_CONFIG.vaults.accounts.forEach(
    (vault) => {
      if (vault?.raydium?.name) {
        names[vault?.raydium?.name] = vault?.raydium?.symbol;

        return;
      }

      if (vault?.orca?.name) {
        names[vault?.orca?.name] = vault?.orca?.symbol;

        return;
      }

      if (vault?.multi_deposit_optimizer?.name) {
        names[vault?.multi_deposit_optimizer?.name] = vault?.multi_deposit_optimizer?.symbol;
      }
    }
  );

  return names;
}

export function getVaultByName (vaultName) {
  return VAULTS_V2_CONFIG.vaults.accounts.find(
    ({ raydium }) => { return raydium?.name === vaultName; }
  );
}

export function getVaultPdaAddressByName (vaultName) {
  return VAULTS_V2_CONFIG.vaults.accounts.find(
    ({ raydium }) => { return raydium?.name === vaultName; }
  )?.raydium?.base?.pda;
}

export function getVaultSharesMintByName (vaultName) {
  return VAULTS_V2_CONFIG.vaults.accounts.find(
    ({ raydium }) => { return raydium?.name === vaultName; }
  )?.raydium?.base?.shares_mint;
}

export function getAllVaultAccounts (platform) {
  const _platform = UI_CONFIG_PLATFORM_MAPPING[platform];

  return compact(VAULTS_V2_CONFIG.vaults.accounts.map((vault) => { return vault[_platform]?.account; }));
}

export function getAllVaultsByPlatform (platform) {
  const _platform = UI_CONFIG_PLATFORM_MAPPING[platform];

  return compact(VAULTS_V2_CONFIG.vaults.accounts.map((vault) => { return vault[_platform]; }));
}

export function getVaultId ({ symbol, mintAddress } = {}) {
  // TULIP-USDC#mintAddress
  return `${symbol}#${mintAddress}`;
}

export function getUserFriendlyVaultId ({ symbol, platform } = {}) {
  return `${platform}_${symbol}`;
}

export function getUserFriendlyVaultLink ({ symbol: vault, platform, version = 2 } = {}) {
  return `https://tulip.garden/vaults?v=${version}&platform=${platform}&vault=${vault}`;
}

export function getUserFriendlyStrategyLink ({ symbol: vault, platform } = {}) {
  return `https://tulip.garden/strategy?platform=${platform}&vault=${vault}`;
}

export function getVaultMarketAmms (platform, vaultName) {
  let _platform = UI_CONFIG_PLATFORM_MAPPING[platform];

  if (_platform === 'quarry') {
    _platform = 'saber';
  }

  return find(VAULTS_V2_CONFIG.markets[_platform].amms, ({ name }) => {
    return toUpper(name) === toUpper(vaultName);
  });
}

export function getFarmTypeBN (farmType) {
  if (!farmType) {
    return [];
  }

  return [
    new anchor.BN(farmType[0]),
    new anchor.BN(farmType[1])
  ];
}

export function getVaultByTag (tagName) {
  return VAULTS_V2_CONFIG.vaults.accounts.find(({ tag }) => { return tag === tagName; });
}

export function getLendingOptimizerVaultByAccount (account) {
  if (!account) {
    return null;
  }

  return VAULTS_V2_CONFIG.vaults.accounts.find(({ lending_optimizer }) => {
    return lending_optimizer?.account === account;
  });
}

/**
 * @description Gives the deposited amount for the sharesBalances after conversion
 *
 * @param {Object} data
 * @returns depositedAmount
 */
export function getDepositedAmountForShares ({
  sharesBalance = 0,
  totalDepositedBalance = 0,
  totalShares = 0,
  decimals = 0
}) {
  let depositedAmount = 0;

  if (isNil(sharesBalance) || isNil(totalDepositedBalance) || isNil(totalShares) || totalDepositedBalance <= 0 || sharesBalance <= 0 || totalShares <= 0) {
    return depositedAmount;
  }

  try {
    depositedAmount =
      new anchor.BN(sharesBalance)
        .mul(totalDepositedBalance)
        .div(totalShares)
        .toNumber() / Math.pow(10, decimals);
  }
  catch (e) {
    depositedAmount = new anchor.BN(sharesBalance)
      .mul(totalDepositedBalance)
      .div(totalShares)
      .div(new anchor.BN(Math.pow(10, decimals)))
      .toNumber();
  }

  return depositedAmount;
}

/**
 * @description Gives the shares for lpTokenAmount
 *
 * @param {Object} data
 * @returns shares
 */
export function getSharesForLpTokenAmount ({
  lpTokenAmount = 0,
  totalDepositedBalance = 0,
  totalShares = 0,
  decimals = 0,
  lockedShares = null
}) {
  let shares = 0;

  if (isNil(lpTokenAmount) || isNil(totalDepositedBalance) || isNil(totalShares) || totalDepositedBalance <= 0 || lpTokenAmount <= 0 || totalShares <= 0) {
    return shares;
  }

  try {
    shares = new anchor.BN(lpTokenAmount * Math.pow(10, decimals))
      .mul(totalShares)
      .div(totalDepositedBalance).toNumber();
  }
  catch (e) {
    shares = new anchor.BN(lpTokenAmount)
      .mul(new anchor.BN(Math.pow(10, decimals)))
      .mul(totalShares)
      .div(totalDepositedBalance)
      .toNumber();
  }

  // We're doing shares + 1 in the following lines because
  // in the above calculations, the amount after converting the lpTokenAmount to anchor.BN
  // can lead to a calculation where the resultant is a decimal like 0.98
  // Now anchor.BN can't represent 0.98 when the division happens, so the number turns out to be 0
  // Hence when the transaction is sent, we're left behind with a deposit balance like 0.0000001 in the vaults.
  // That's why we're doing the shares + 1 check.
  if (lockedShares === null) {
    return shares + 1;
  }

  // Additionally, the check for lockedShares is there so that the user
  // does not run into the issue of trying to withdraw more than what the vault can offer
  // More than what can be withdrawn to be specific.

  return Math.min(shares + 1, lockedShares);
}

/**
 * @description Checks if a platform is supported in the v2 platform or not
 *
 * @param {String} platform
 * @returns Boolean
 */
export function isSupportedV2Platform (platform) {
  return [
    FARM_PLATFORMS.SABER,
    FARM_PLATFORMS.RAYDIUM,
    FARM_PLATFORMS.ORCA,
    FARM_PLATFORMS.ATRIX
  ].includes(platform);
}

/**
 * @description Total deposited balance for the user
 * Current deposited shares + wallet balance of the collateral token
 *
 * @returns {Number} totalDepositedAmount
 */
export function getTotalDeposited ({ tokenAccounts, sharesMint, decimals, totalDepositedBalance, totalShares, deposited }) {
  const sharesMintBalance = Number(tokenAccounts[sharesMint]?.balance) * Math.pow(10, decimals) || 0;

  let depositedAmount = 0;

  if (isNil(sharesMintBalance) || isNil(totalDepositedBalance) || isNil(totalShares)) {
    return depositedAmount + Number(deposited);
  }

  depositedAmount = getDepositedAmountForShares({
    sharesBalance: sharesMintBalance,
    totalDepositedBalance: totalDepositedBalance,
    totalShares: totalShares,
    decimals: decimals
  });

  return depositedAmount + (Number(deposited) * Math.pow(10, decimals));
}
