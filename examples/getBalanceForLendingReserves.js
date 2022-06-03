import { getBalanceForLendingReserves } from '@tulip-protocol/platform-sdk';
import { Connection } from '@solana/web3.js';

// You can have any wallet adapter you may want, we're taking Phantom as an example here.
// More info can be found here: https://github.com/solana-labs/wallet-adapter#wallets
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

// Boilerplate setup for web3 connection
const endpoint = 'https://solana-api.projectserum.com';
const commitment = 'confirmed';

// Inputs taken by Tulip SDK's `getBalanceForLendingReserves`
const connection = new Connection(endpoint, { commitment });
const wallet = new PhantomWalletAdapter();

const getTulipProtocolLendingReserveBalances = async (reserves) => {
  const reserveData = await getBalanceForLendingReserves({
    connection,
    wallet,
    reserves
  });

  // Map over it if needed to take out just the `name` and `deposited` property
  return reserveData.map((reserve) => {
    return {
      name: reserve.name,
      deposited: reserve.deposited
    };
  });
};

export { getTulipProtocolLendingReserveBalances };
