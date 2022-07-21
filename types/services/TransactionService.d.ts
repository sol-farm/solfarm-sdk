/**
 *
 * @param {Object} conn web3 Connection object
 * @param {Object} wallet Wallet object
 * @param {String} mintAddress Mint Address of the Vault
 * @param {String} authorityTokenAccount Token account address of the user corresponding to the vault
 * @param {String|Number} amount Amount to deposit
 *
 * @returns {Promise}
 */
export function depositToVault(conn: any, wallet: any, mintAddress: string, authorityTokenAccount: string, amount: string | number): Promise<any>;
/**
 *
 * @param {Object} conn web3 Connection object
 * @param {Object} wallet Wallet object
 * @param {String} mintAddress Mint Address of the Vault
 * @param {String} authorityTokenAccount Token account address of the user corresponding to the vault
 * @param {String|Number} amount - [Optional] Amount to withdraw (Use this if you don't have userShares)
 * @param {Number} userShares - [Optional] User shares to withdraw (Use this if you don't have amount)
 *
 * @returns {Promise}
 */
export function withdrawFromVault(conn: any, wallet: any, mintAddress: string, authorityTokenAccount: string, amount: string | number, userShares: number): Promise<any>;
