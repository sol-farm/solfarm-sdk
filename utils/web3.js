import { struct } from 'superstruct';
import { PublicKey } from '@solana/web3.js';

export const commitment = 'confirmed';

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
 * @param {Object} connection
 * @param {Object} signedTransaction
 * @returns
 */
export async function sendSignedTransaction (connection, signedTransaction) {
  const rawTransaction = signedTransaction.serialize();

  const txid = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
    preflightCommitment: commitment
  });

  return txid;
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

function jsonRpcResultAndContext (resultDescription) {
  return jsonRpcResult({
    context: struct({
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

    // Update slot globally
    // window.$slot = get(res, 'result.context.slot');

    if (res.error) {
      console.error(
        'failed to get info about accounts ' +
        publicKeys.map((k) => { return k.toBase58(); }).join(', ') + ': ' + res.error.message
      );

      return;
    }

    // assert(typeof res.result !== 'undefined')

    for (const account of res.result.value) {
      let value = null;

      if (account === null) {
        accounts.push(null);
        continue;
      }

      if (res.result.value) {
        const { executable, owner, lamports, data } = account || {};

        // assert(data[1] === 'base64')

        // eslint-disable-next-line object-shorthand
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

    // eslint-disable-next-line object-shorthand
    return {
      publicKey: publicKeys[idx],
      account
    };
  });
}
