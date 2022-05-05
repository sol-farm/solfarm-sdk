import * as anchor from '@project-serum/anchor';
import { LEVERAGE_FARMS } from './farmUtils';

// finds a UserFarm account address
export function findUserFarmAddress (
  // the user's main wallet account
  authority,

  // the id of the lending program
  programId,

  // the index of the account
  // 0 = first account, 1 = second account, etc...
  index,

  // the enum of the particular farm
  // 0 = ray-usdc lp, 1 = ray-sol lp
  farm
) {
  let seeds = [
    authority.toBuffer(),
    index.toArrayLike(Buffer, 'le', 8),
    farm.toArrayLike(Buffer, 'le', 8)
  ];

  return anchor.web3.PublicKey.findProgramAddress(seeds, programId);
}

export function getLeverageFarmBySymbol (symbol) {
  return LEVERAGE_FARMS.find((farm) => {
    return farm.symbol === symbol;
  });
}
