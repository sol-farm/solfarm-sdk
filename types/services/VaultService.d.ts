/**
 * @description Gets the balances for auto vaults
 *
 * @param {Object} conn
 * @param {Object} wallet
 * @param {Object} query
 * @returns Object vaults and their user balances
 */
export function getBalancesForAutoVaults(conn: any, wallet: any, query?: any): Promise<{
    platforms: {};
    vaults: any[];
} | {
    vaults: {
        platform: any;
        symbol: any;
        balance: number;
    }[];
}>;
export function getAutoVaultsProgramId(): any;
