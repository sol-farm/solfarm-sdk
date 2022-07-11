/**
 *
 * @param {*} connection
 * @param {*} wallet
 * @param {*} transaction
 * @param {*} signers
 * @returns
 */
export function signTransaction(connection: any, wallet: any, transaction: any, signers?: any): Promise<any>;
/**
 *
 * @param {Object} connection
 * @param {Object} signedTransaction
 * @returns
 */
export function sendSignedTransaction(connection: any, signedTransaction: any): Promise<any>;
/**
 *
 * @param {*} connection
 * @param {*} wallet
 * @param {*} transaction
 * @param {*} signers
 * @returns {Promise}
 */
export function sendTransaction(connection: any, wallet: any, transaction: any, signers: any): Promise<any>;
/**
 *
 * @param {Object} connection web3 Connection object
 * @param {Array} publicKeys Array of Public Keys
 * @param {String} commitment
 * @returns {Promise}
 */
export function getMultipleAccounts(connection: any, publicKeys: any[], commitment: string): Promise<any>;
/**
 * Get multiple accounts for grouped public keys (in arrays).
 *
 * @param {Object} connection - web3 connection
 * @param {Array[]} publicKeyGroupedArray - Array of array of public keys
 * @param {String} commitment
 *
 * @returns {Promise<Array[]>}
 */
export function getMultipleAccountsGrouped(connection: any, publicKeyGroupedArray: any[][], commitment: string): Promise<any[][]>;
export const commitment: "confirmed";
export const AccountInfoResult: import("superstruct").Struct;
