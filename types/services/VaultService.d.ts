/**
 * @description Gets the balances for auto vaults
 *
 * @param {Object} conn
 * @param {Object} wallet
 * @param {Object} query
 * @returns Object vaults and their user balances
 */
export function getBalancesForAutoVaults(conn: any, wallet: any, query?: any): Promise<{
    vaults: any[];
}>;
export function getAutoVaultsProgramId(): any;
