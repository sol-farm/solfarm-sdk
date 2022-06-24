import { struct } from 'superstruct';
import { PublicKey } from '@solana/web3.js';
import { isFunction, slice } from 'lodash';
import * as serumAssoToken from '@project-serum/associated-token';

export const commitment = 'confirmed';

/**
 *
 * @param {*} provider
 * @param {*} owner
 * @param {*} mint
 * @returns
 */
export function createAssociatedTokenAccount (
  provider, // payer
  owner,
  mint
) {
  return serumAssoToken.getAssociatedTokenAddress(owner, mint);
}

/**
 *
 * @param {*} connection
 * @param {*} signedTransaction
 * @returns
 */
export async function sendSignedTransaction (connection, signedTransaction, verify = true) {
  let verifyOpts = {};

  if (!verify) {
    verifyOpts = { requireAllSignatures: false, verifySignatures: false };
  }
  const rawTransaction = signedTransaction.serialize(verifyOpts);

  const txid = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
    preflightCommitment: commitment
  });

  return txid;
}

export async function _sendTransaction (connection, transaction) {
  let txId = await sendSignedTransaction(connection, transaction);

  return new Promise((resolve, reject) => {
    if (!txId) {
      reject(new Error('Transaction not found'));
    }

    if (!isFunction(connection.onSignature)) {
      reject(new Error('connection.onSignature is not a function'));
    }

    connection.onSignature(
      txId,
      (signatureResult) => {
        if (!signatureResult.err) {
          // success
          resolve(txId);
        }
        else {
          // failure
          reject(signatureResult.err);
        }
      },
      'confirmed'
    );
  });
}

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
export async function signTransactionsSynchronously (
  connection,
  signedTransactions
) {
  let transactionIds = [];

  for (let signedTransaction of signedTransactions) {
    // eslint-disable-next-line no-await-in-loop
    transactionIds.push(await _sendTransaction(connection, signedTransaction));
  }

  return Promise.resolve(transactionIds);
}

/**
 *
 * @param {*} connection
 * @param {*} wallet
 * @param {*} transactions
 * @param {*} signers
 * @param {*} extraSigners
 * @returns
 */
export async function signAllTransactions (
  connection,
  wallet,
  transactions,
  signers = [],
  extraSigners = []
) {
  // let blockHashses = [];
  const recentBlockhash = (await connection.getRecentBlockhash('processed'))
    .blockhash;

  const finalTransactions = [];

  transactions.forEach((transaction, index) => {
    if (transaction.instructions.length > 0) {
      transaction.recentBlockhash = recentBlockhash;
      transaction.setSigners(
        wallet.publicKey,
        ...signers.map((s) => s.publicKey)
      );

      if (extraSigners.length && extraSigners[index].length > 0) {
        const extraSigner = extraSigners[index];

        transaction.setSigners(
          wallet.publicKey,
          ...extraSigner.map((s) => s.publicKey)
        );
        transaction.partialSign(...extraSigner);
      }

      if (signers.length > 0) {
        transaction.partialSign(...signers);
      }

      finalTransactions.push(transaction);
    }
  });

  return wallet.signAllTransactions(finalTransactions);
}

/**
 *
 * @param {*} connection
 * @param {*} signedTransactions
 * @returns
 */
export function sendAllSignedTransactions (
  connection,
  signedTransactions,
  opts = {}
) {
  const transactions = [];

  return signTransactionsSynchronously(
    connection,
    signedTransactions,
    transactions,
    signedTransactions.length,
    opts
  );
}

/**
 *
 * @param {*} connection
 * @param {*} wallet
 * @param {*} transactions
 * @param {*} signers
 * @param {*} extraSigners
 * @returns
 */
export async function sendAllTransactions (
  connection,
  wallet,
  transactions,
  signers,
  extraSigners,
  opts
) {
  const signedTransactions = await signAllTransactions(
    connection,
    wallet,
    transactions,
    signers,
    extraSigners
  );

  return sendAllSignedTransactions(connection, signedTransactions, opts);
}

/**
 *
 * @param {*} connection
 * @param {*} wallet
 * @param {*} transaction
 * @param {*} signers
 * @returns
 */
export async function signTransaction (connection,
  wallet,
  transaction,
  signers = []) {
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash(commitment)
  ).blockhash;
  transaction.setSigners(wallet.publicKey,
    ...signers.map((s) => {
      return s.publicKey;
    }));

  if (signers.length > 0) {
    transaction.partialSign(...signers);
  }

  return wallet.signTransaction(transaction);
}

/**
 *
 * @param {*} connection
 * @param {*} wallet
 * @param {*} transaction
 * @param {*} signers
 * @returns {Promise}
 */
export async function sendTransaction (connection,
  wallet,
  transaction,
  signers) {
  const signedTransaction = await signTransaction(connection,
    wallet,
    transaction,
    signers);

  return sendSignedTransaction(connection, signedTransaction);
}

function jsonRpcResult (resultDescription) {
  const jsonRpcVersion = struct.literal('2.0');

  return struct.union([
    struct({
      jsonrpc: jsonRpcVersion,
      id: 'string',
      error: 'any'
    }),
    struct({
      jsonrpc: jsonRpcVersion,
      id: 'string',
      error: 'null?',
      result: resultDescription
    })
  ]);
}

/**
 *
 * @param {*} resultDescription
 * @returns
 */
function jsonRpcResultAndContext (resultDescription) {
  return jsonRpcResult({
    context: struct({
      apiVersion: 'string?',
      slot: 'number'
    }),
    value: resultDescription
  });
}

export const AccountInfoResult = struct({
  executable: 'boolean',
  owner: 'string',
  lamports: 'number',
  data: 'any',
  rentEpoch: 'number?'
});

const GetMultipleAccountsAndContextRpcResult = jsonRpcResultAndContext(
  struct.array([struct.union(['null', AccountInfoResult])])
);

/**
 *
 * @param {Object} connection web3 Connection object
 * @param {Array} publicKeys Array of Public Keys
 * @param {String} commitment
 * @returns {Promise}
 */
export async function getMultipleAccounts (connection, publicKeys, commitment) {
  const keys = [];
  let tempKeys = [];

  publicKeys.forEach((k) => {
    if (tempKeys.length >= 100) {
      keys.push(tempKeys);
      tempKeys = [];
    }
    tempKeys.push(k.toBase58());
  });

  if (tempKeys.length > 0) {
    keys.push(tempKeys);
  }

  const accounts = [];

  for (const key of keys) {
    const args = [key, { commitment }];

    // eslint-disable-next-line no-await-in-loop
    const unsafeRes = await connection._rpcRequest('getMultipleAccounts', args);
    const res = GetMultipleAccountsAndContextRpcResult(unsafeRes);

    if (res.error) {
      console.error(
        'failed to get info about accounts ' +
        publicKeys.map((k) => { return k.toBase58(); }).join(', ') + ': ' + res.error.message
      );

      return;
    }

    for (const account of res.result.value) {
      let value = null;

      if (account === null) {
        accounts.push(null);
        continue;
      }

      if (res.result.value) {
        const { executable, owner, lamports, data } = account || {};

        // assert(data[1] === 'base64')

        value = {
          executable,
          owner: new PublicKey(owner),
          lamports,
          data: Buffer.from(data[0], 'base64')
        };
      }

      if (value === null) {
        console.error('Invalid response');

        return;
      }

      accounts.push(value);
    }
  }

  // eslint-disable-next-line consistent-return
  return accounts.map((account, idx) => {
    if (account === null) {
      return null;
    }

    return {
      publicKey: publicKeys[idx],
      account
    };
  });
}

/**
 * Get multiple accounts for grouped public keys (in arrays).
 *
 * @param {Object} connection - web3 connection
 * @param {Array[]} publicKeyGroupedArray - Array of array of public keys
 * @param {String} commitment
 *
 * @returns {Array[]}
 */
export async function getMultipleAccountsGrouped (
  connection,
  publicKeyGroupedArray,
  commitment
) {
  let dataToFetch = [],
    responseToReturn = [];

  publicKeyGroupedArray.forEach((publicKeyArray) => {
    dataToFetch = dataToFetch.concat(publicKeyArray);
  });

  const dataFetched = await getMultipleAccounts(
    connection,
    dataToFetch,
    commitment
  );

  let lastIndex = 0;

  publicKeyGroupedArray.forEach((publicKeyArray) => {
    responseToReturn.push(
      slice(dataFetched, lastIndex, lastIndex + publicKeyArray.length)
    );

    lastIndex += publicKeyArray.length;
  });

  return responseToReturn;
}
