import { depositLendingReserve } from '@tulip-protocol/platform-sdk';
import { Connection } from '@solana/web3.js';

// You can have any wallet adapter you may want, we're taking Phantom as an example here.
// More info can be found here: https://github.com/solana-labs/wallet-adapter#wallets
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

// Create a util to send transactions
import { sendTransaction } from 'utils/web3';

// Boilerplate setup for web3 connection
const endpoint = 'https://solana-api.projectserum.com';
const commitment = 'confirmed';

// Inputs taken by Tulip SDK's `depositLendingReserve`
const connection = new Connection(endpoint, { commitment });
const wallet = new PhantomWalletAdapter();

const depositToTulipProtocol = async (reserve, amount) => {
  const transaction = await depositLendingReserve({
    connection,
    wallet,
    reserve,
    amount
  });

  // Let's assume this is how the function signature of
  // your custom `sendTransaction` looks like
  return sendTransaction(connection, wallet, transaction);
};

export { depositToTulipProtocol };
