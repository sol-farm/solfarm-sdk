import { closeMarginPosition, CLOSE_POSITION_OPTIONS } from '@tulip-protocol/platform-sdk';
import { Connection } from '@solana/web3.js';
import SolanaWalletAdapter from '@project-serum/sol-wallet-adapter';

// Boilerplate setup for web3 connection
const endpoint = 'https://solana-api.projectserum.com';
const commitment = 'confirmed';

// Inputs taken by Tulip SDK's `depositToVault`
const connection = new Connection(endpoint, { commitment });
const wallet = new SolanaWalletAdapter('', endpoint);

const closeMarginPositionTulipProtocol = ({
  symbol,
  obligationIdx,
  selectedOption: CLOSE_POSITION_OPTIONS.MINIMIZE_TRADING,
  partialClose: 100
}) => {
  return closeMarginPosition({
    wallet,
    connection,
    symbol,
    obligationIdx,
    selectedOption,
    partialClose
  });
};