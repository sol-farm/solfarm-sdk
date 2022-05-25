export function deriveManagementAddress(programId: any): any;
export function deriveVaultAddress(programId: any, farmPartOne: any, farmPartTwo: any): any;
export function deriveVaultPdaAddress(programId: any, vault: any): any;
export function deriveSharesMintAddress(programId: any, vault: any, mint: any): any;
export function deriveRaydiumUserStakeInfoAddress(programId: any, vaultPda: any): any;
export function deriveWithdrawQueueAddress(programId: any, vault: any, underlyingMint: any): any;
export function deriveCompoundQueueAddress(programId: any, vault: any, underlyingMint: any): any;
export function deriveSerumTradeAccount(programId: any): any;
export function deriveSerumTradePdaAddress(programId: any, tradeAccount: any): any;
export function deriveSerumTradeOpenOrdersAddress(programId: any, tradeAccount: any, serumMarket: any): any;
export function deriveSerumFeeRecipientAddress(programId: any, mint: any, tradePda: any): any;
export function deriveTrackingAddress(programId: any, vault: any, owner: any): any;
export function deriveTrackingPdaAddress(programId: any, trackingAddress: any): any;
export function deriveTrackingQueueAddress(programId: any, trackingPdaAddress: any): any;
export function createAssociatedTokenAccount(provider: any, owner: any, mint: any): any;
export function findAssociatedStakeInfoAddress(poolId: any, walletAddress: any, programId: any): Promise<any>;
export function deriveLendingPlatformAccountAddress(vaultPda: any, lendingMarket: any, programId: any): any;
export function deriveLndingPlatformInformationAccountAddress(vault: any, index: any, programId: any): any;
export function deriveLendingPlatformConfigDataAddress(platformAddress: any, programId: any): any;
export function deriveMangoAccountAddress(vault: any, programId: any): any;
export function deriveOrcaUserFarmAddress(globalFarm: any, owner: any, aquaFarmProgramId: any): any;
export function deriveOrcaDDCompoundQueueAddress(programId: any, vault: any, ddFarmTokenMint: any): any;
export function deriveTrackingOrcaDDQueueAddress(programId: any, vault: any, trackingPda: any): any;
export function deriveMultiDepositStateTransitionAddress(vault: any, programId: any): any;
export function deriveEphemeralTrackingAddress(vault: any, owner: any, programId: any): any;
export function getVaultByPlatformAndName(platform: any, vaultName: any): any;
export function getAllVaultNameSymbolMap(): {};
export function getVaultByName(vaultName: any): any;
export function getVaultPdaAddressByName(vaultName: any): any;
export function getVaultSharesMintByName(vaultName: any): any;
export function getAllVaultAccounts(platform: any): any[];
export function getAllVaultsByPlatform(platform: any): any[];
export function getVaultId({ symbol, mintAddress }?: {
    symbol: any;
    mintAddress: any;
}): string;
export function getUserFriendlyVaultId({ symbol, platform }?: {
    symbol: any;
    platform: any;
}): string;
export function getUserFriendlyVaultLink({ symbol: vault, platform, version }?: {
    symbol: any;
    platform: any;
    version?: number;
}): string;
export function getUserFriendlyStrategyLink({ symbol: vault, platform }?: {
    symbol: any;
    platform: any;
}): string;
export function getVaultMarketAmms(platform: any, vaultName: any): any;
export function getFarmTypeBN(farmType: any): any[];
export function getVaultByTag(tagName: any): any;
export function getLendingOptimizerVaultByAccount(account: any): any;
/**
 * @description Gives the deposited amount for the sharesBalances after conversion
 *
 * @param {Object} data
 * @returns depositedAmount
 */
export function getDepositedAmountForShares({ sharesBalance, totalDepositedBalance, totalShares, decimals }: any): number;
/**
 * @description Gives the shares for lpTokenAmount
 *
 * @param {Object} data
 * @returns shares
 */
export function getSharesForLpTokenAmount({ lpTokenAmount, totalDepositedBalance, totalShares, decimals, lockedShares }: any): number;
/**
 * @description Checks if a platform is supported in the v2 platform or not
 *
 * @param {String} platform
 * @returns Boolean
 */
export function isSupportedV2Platform(platform: string): boolean;
/**
 * @description Total deposited balance for the user
 * Current deposited shares + wallet balance of the collateral token
 *
 * @returns {Number} totalDepositedAmount
 */
export function getTotalDeposited({ tokenAccounts, sharesMint, decimals, totalDepositedBalance, totalShares, deposited }: {
    tokenAccounts: any;
    sharesMint: any;
    decimals: any;
    totalDepositedBalance: any;
    totalShares: any;
    deposited: any;
}): number;
