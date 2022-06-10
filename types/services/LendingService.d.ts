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
export function depositToLendingReserve(conn: any, wallet: any, mintAddress: string, authorityTokenAccount: string, amount: string | number): Promise<any>;
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
export function withdrawFromLendingReserve(conn: any, wallet: any, mintAddress: string, authorityTokenAccount: string, amount: string | number): Promise<any>;
/**
 * @description
 * Deposit amount to a lending reserve such as USDC or TULIP etc.
 * Refer https://tulip.garden/lend to find the reserve name.
 *
 * @param {Object} data.connection web3 Connection object
 * @param {Object} data.wallet wallet object (@solana/web3 version >= 1.4.0)
 * @param {String} data.reserve reserve symbol or mint address
 *  (for eg: USDC or `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`)
 * @param {String|Number} data.amount amount to deposit
 * @param {String} [data.authorityTokenAccount] [optional] data.authorityTokenAccount
 *  authorityTokenAccount of the reserve
 *
 * @returns {Promise}
 */
export function depositLendingReserve({ connection, wallet, reserve, amount, authorityTokenAccount }: any): Promise<any>;
/**
 * @description
 * Withdraw amount from a lending reserve such as USDC or TULIP etc.
 * Refer https://tulip.garden/lend to find the reserve name.
 *
 * @param {Object} data.connection web3 Connection object
 * @param {Object} data.wallet wallet object (@solana/web3 version >= 1.4.0)
 * @param {String} data.reserve reserve symbol or mint address
 *  (for eg: USDC or `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`)
 * @param {String|Number} data.amount amount to withdraw
 * @param {String} [data.authorityTokenAccount] [optional] data.authorityTokenAccount
 *  authorityTokenAccount of the reserve
 *
 * @returns {Promise}
 */
export function withdrawLendingReserve({ connection, wallet, reserve, amount, authorityTokenAccount }: any): Promise<any>;
/**
 * @description Fetch the user balances for the lending reserves
 * Refer https://tulip.garden/lend to find the reserve name.
 *
 * @param {Object} data
 * @param {Object} data.connection web3 Connection object
 * @param {Object} data.wallet wallet object (@solana/web3 version >= 1.4.0)
 * @param {Array<String>} data.reserves reserve symbols or mint addresses
 */
export function getBalanceForLendingReserves({ wallet, connection, reserves }: {
    connection: any;
    wallet: any;
    reserves: Array<string>;
}): Promise<{
    name: string;
    mintAddress: string;
    deposited: number;
}[]>;
/**
 * @description Fetch the lending APY for the lending reserves
 * Refer https://tulip.garden/lend to find the reserve name.
 *
 * @param {Object} data
 * @param {Object} data.connection web3 Connection object
 * @param {Array<String>} data.reserves reserve symbols or mint addresses
 */
export function getAPYForLendingReserves({ connection, reserves }: {
    connection: any;
    reserves: Array<string>;
}): Promise<{
    name: string;
    mintAddress: string;
    lendAPY: number;
}[]>;
