import {
  bool,
  publicKey,
  struct,
  u32,
  u64,
  u8,
  u128
} from '@project-serum/borsh';
import * as BufferLayout from 'buffer-layout';
// eslint-disable-next-line no-unused-vars
import * as Layout from '../utils/layout-from-oyster';
// eslint-disable-next-line no-unused-vars
import BigNumber from 'bignumber.js';

// eslint-disable-next-line no-duplicate-imports
import { blob } from 'buffer-layout';
import * as anchor from '@project-serum/anchor';

// import { toBigIntLE, toBufferLE } from 'bigint-buffer';

// export const WAD = BigNumber('1e+18');
export const WAD = new anchor.BN(10).pow(new anchor.BN(18));
export const hundred = new anchor.BN(100);

// https://github.com/solana-labs/solana-program-library/blob/master/token/js/client/token.js#L210
export const ACCOUNT_LAYOUT = struct([
  publicKey('mint'),
  publicKey('owner'),
  u64('amount'),
  u32('delegateOption'),
  publicKey('delegate'),
  u8('state'),
  u32('isNativeOption'),
  u64('isNative'),
  u64('delegatedAmount'),
  u32('closeAuthorityOption'),
  publicKey('closeAuthority')
]);

export const MINT_LAYOUT = struct([
  u32('mintAuthorityOption'),
  publicKey('mintAuthority'),
  u64('supply'),
  u8('decimals'),
  bool('initialized'),
  u32('freezeAuthorityOption'),
  publicKey('freezeAuthority')
]);

export const VAULT_LAYOUT = struct([
  blob(8),
  publicKey('authority'),
  publicKey('tokenProgram'),
  publicKey('pdaTokenAccount'),
  publicKey('pda'),
  u8('nonce'),
  u8('infoNonce'),
  u8('rewardANonce'),
  u8('rewardBNonce'),
  u8('swapToNonce'),
  u64('totalVaultBalance'),
  publicKey('infoAccount'),
  publicKey('lpTokenAccount'),
  publicKey('lpTokenMint'),
  publicKey('rewardAAccount'),
  publicKey('rewardBAccount'),
  publicKey('swapToAccount'),
  u64('totalVlpShares')
]);

export const STAKE_INFO_LAYOUT = struct([
  u64('state'),
  u64('nonce'),
  publicKey('poolLpTokenAccount'),
  publicKey('poolRewardTokenAccount'),
  publicKey('owner'),
  publicKey('feeOwner'),
  u64('feeY'),
  u64('feeX'),
  u64('totalReward'),
  u128('rewardPerShareNet'),
  u64('lastBlock'),
  u64('rewardPerBlock')
]);

export const STAKE_INFO_LAYOUT_V4 = struct([
  u64('state'),
  u64('nonce'),
  publicKey('poolLpTokenAccount'),
  publicKey('poolRewardTokenAccount'),
  u64('totalReward'),
  u128('perShare'),
  u64('perBlock'),
  u8('option'),
  publicKey('poolRewardTokenAccountB'),
  blob(7),
  u64('totalRewardB'),
  u128('perShareB'),
  u64('perBlockB'),
  u64('lastBlock'),
  publicKey('owner')
]);

export const AMM_INFO_LAYOUT_V3 = struct([
  u64('status'),
  u64('nonce'),
  u64('orderNum'),
  u64('depth'),
  u64('coinDecimals'),
  u64('pcDecimals'),
  u64('state'),
  u64('resetFlag'),
  u64('fee'),
  u64('min_separate'),
  u64('minSize'),
  u64('volMaxCutRatio'),
  u64('pnlRatio'),
  u64('amountWaveRatio'),
  u64('coinLotSize'),
  u64('pcLotSize'),
  u64('minPriceMultiplier'),
  u64('maxPriceMultiplier'),
  u64('needTakePnlCoin'),
  u64('needTakePnlPc'),
  u64('totalPnlX'),
  u64('totalPnlY'),
  u64('systemDecimalsValue'),
  publicKey('poolCoinTokenAccount'),
  publicKey('poolPcTokenAccount'),
  publicKey('coinMintAddress'),
  publicKey('pcMintAddress'),
  publicKey('lpMintAddress'),
  publicKey('ammOpenOrders'),
  publicKey('serumMarket'),
  publicKey('serumProgramId'),
  publicKey('ammTargetOrders'),
  publicKey('ammQuantities'),
  publicKey('poolWithdrawQueue'),
  publicKey('poolTempLpTokenAccount'),
  publicKey('ammOwner'),
  publicKey('pnlOwner'),
  publicKey('srmTokenAccount')
]);

export const AMM_INFO_LAYOUT_V4 = struct([
  u64('status'),
  u64('nonce'),
  u64('orderNum'),
  u64('depth'),
  u64('coinDecimals'),
  u64('pcDecimals'),
  u64('state'),
  u64('resetFlag'),
  u64('minSize'),
  u64('volMaxCutRatio'),
  u64('amountWaveRatio'),
  u64('coinLotSize'),
  u64('pcLotSize'),
  u64('minPriceMultiplier'),
  u64('maxPriceMultiplier'),
  u64('systemDecimalsValue'),

  // Fees
  u64('minSeparateNumerator'),
  u64('minSeparateDenominator'),
  u64('tradeFeeNumerator'),
  u64('tradeFeeDenominator'),
  u64('pnlNumerator'),
  u64('pnlDenominator'),
  u64('swapFeeNumerator'),
  u64('swapFeeDenominator'),

  // OutPutData
  u64('needTakePnlCoin'),
  u64('needTakePnlPc'),
  u64('totalPnlPc'),
  u64('totalPnlCoin'),
  u128('poolTotalDepositPc'),
  u128('poolTotalDepositCoin'),
  u128('swapCoinInAmount'),
  u128('swapPcOutAmount'),
  u64('swapCoin2PcFee'),
  u128('swapPcInAmount'),
  u128('swapCoinOutAmount'),
  u64('swapPc2CoinFee'),

  publicKey('poolCoinTokenAccount'),
  publicKey('poolPcTokenAccount'),
  publicKey('coinMintAddress'),
  publicKey('pcMintAddress'),
  publicKey('lpMintAddress'),
  publicKey('ammOpenOrders'),
  publicKey('serumMarket'),
  publicKey('serumProgramId'),
  publicKey('ammTargetOrders'),
  publicKey('poolWithdrawQueue'),
  publicKey('poolTempLpTokenAccount'),
  publicKey('ammOwner'),
  publicKey('pnlOwner')
]);

// Lending Reserve
export const LENDING_RESERVE_LAYOUT = BufferLayout.struct([
  u8('version'),
  struct([u64('slot'), bool('stale')], 'lastUpdateSlot'),

  publicKey('lendingMarket'),
  publicKey('borrowAuthorizer'),

  struct(
    [
      publicKey('mintPubKey'),
      u8('mintDecimals'),
      publicKey('supplyPubKey'),
      publicKey('feeReceiver'),
      publicKey('oraclePubKey'),
      u64('availableAmount'),
      u128('borrowedAmount'),
      u128('cumulativeBorrowRate'),
      u128('marketPrice'),
      u128('platformAmountWads'),

      u8('platformFees')
    ],
    'liquidity'
  )
]);

// Lending Obligation
export const LENDING_OBLIGATION_LAYOUT = BufferLayout.struct([
  u8('version'),
  struct([u64('slot'), bool('stale')], 'lastUpdateSlot'),

  publicKey('lendingMarket'),
  publicKey('owner'),
  u128('borrowedValue'), // decimal
  u64('vaultShares'), // decimal
  u64('lpTokens'), // decimal
  u64('coinDeposits'), // decimal
  u64('pcDeposits'), // decimal
  u128('depositsMarketValue'), // decimal
  u8('lpDecimals'),
  u8('coinDecimals'),
  u8('pcDecimals'),
  u8('depositsLen'),
  u8('borrowsLen'),
  blob(160) // deposits + borrow data
]);

export const LENDING_OBLIGATION_LIQUIDITY = BufferLayout.struct([
  publicKey('borrowReserve'),
  u128('cumulativeBorrowRateWads'), // decimal
  u128('borrowedAmountWads'), // decimal
  u128('marketValue') // decimal
]);

export const GLOBAL_FARM_DATA_LAYOUT = BufferLayout.struct([
  u8('isInitialized'),
  u8('accountType'),
  u8('nonce'),
  publicKey('tokenProgramId'),
  publicKey('emissionsAuthority'),
  publicKey('removeRewardsAuthority'),
  publicKey('baseTokenMint'),
  publicKey('baseTokenVault'),
  publicKey('rewardTokenVault'),
  publicKey('farmTokenMint'),
  u64('emissionsPerSecondNumerator'),
  u64('emissionsPerSecondDenominator'),
  u64('lastUpdatedTimestamp'),
  blob(32)
]);
