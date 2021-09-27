export async function signTransaction(connection, wallet, transaction, signers = []) {
  transaction.recentBlockhash = (await connection.getRecentBlockhash(commitment)).blockhash;
  transaction.setSigners(wallet.publicKey, ...signers.map((s) => s.publicKey));

  if (signers.length > 0) {
    transaction.partialSign(...signers);
  }

  return await wallet.signTransaction(transaction);
}
  
export async function sendTransaction(connection, wallet, transaction, signers) {
  const signedTransaction = await signTransaction(connection, wallet, transaction, signers)
  return await sendSignedTransaction(connection, signedTransaction);
}
  
export async function sendSignedTransaction(connection, signedTransaction) {
  const rawTransaction = signedTransaction.serialize();

  const txid = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
    preflightCommitment: commitment
  });

  return txid;
}
