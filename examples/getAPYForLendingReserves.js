import { getAPYForLendingReserves } from '@tulip-protocol/platform-sdk';
import { Connection } from '@solana/web3.js';

// Boilerplate setup for web3 connection
const endpoint = 'https://solana-api.projectserum.com';
const commitment = 'confirmed';

// Inputs taken by Tulip SDK's `getAPYForLendingReserves`
const connection = new Connection(endpoint, { commitment });

const getTulipProtocolLendingReserveAPYs = async (reserves) => {
  const reserveData = await getAPYForLendingReserves({
    connection,
    reserves
  });

  // Map over it if needed to take out just the `name` and `lendAPY` property
  return reserveData.map((reserve) => {
    return {
      name: reserve.name,
      lendAPY: reserve.lendAPY
    };
  });
};

export { getTulipProtocolLendingReserveAPYs };
