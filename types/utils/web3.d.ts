/**
 *
 * @param {*} provider
 * @param {*} owner
 * @param {*} mint
 * @returns
 */
export function createAssociatedTokenAccount(provider: any, owner: any, mint: any): Promise<PublicKey>;
/**
 *
 * @param {*} connection
 * @param {*} signedTransaction
 * @returns
 */
export function sendSignedTransaction(connection: any, signedTransaction: any, verify?: boolean): Promise<any>;
export function _sendTransaction(connection: any, transaction: any): Promise<any>;
/**
 *
 * @param {*} connection
 * @param {*} signedTransactions
 * @param {*} transactions
 * @param {*} parentResolve
 * @param {*} resolve
 * @param {*} onError
 * @returns
 */
export function signTransactionsSynchronously(connection: any, signedTransactions: any): Promise<any[]>;
/**
 *
 * @param {*} connection
 * @param {*} wallet
 * @param {*} transactions
 * @param {*} signers
 * @param {*} extraSigners
 * @returns
 */
export function signAllTransactions(connection: any, wallet: any, transactions: any, signers?: any, extraSigners?: any): Promise<any>;
/**
 *
 * @param {*} connection
 * @param {*} signedTransactions
 * @returns
 */
export function sendAllSignedTransactions(connection: any, signedTransactions: any, opts?: {}): Promise<any[]>;
/**
 *
 * @param {*} connection
 * @param {*} wallet
 * @param {*} transactions
 * @param {*} signers
 * @param {*} extraSigners
 * @returns
 */
export function sendAllTransactions(connection: any, wallet: any, transactions: any, signers: any, extraSigners: any, opts: any): Promise<any[]>;
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
import { PublicKey } from "@solana/web3.js";
