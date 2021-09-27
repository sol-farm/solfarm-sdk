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
