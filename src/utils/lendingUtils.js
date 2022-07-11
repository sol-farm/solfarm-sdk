import { LENDING_RESERVES } from '../constants/lendingReserves';
import { find } from 'lodash';

export const getReserveByName = (name) => {
  return find(LENDING_RESERVES, (reserve) => {
    return reserve.name === name;
  });
};

export const getReserveByMintAddress = (mintAddress) => {
  return find(LENDING_RESERVES, (reserve) => {
    return reserve.mintAddress === mintAddress;
  });
};

export const getReserveByCollateralTokenMint = (collateralTokenMint) => {
  return find(LENDING_RESERVES, (reserve) => {
    return reserve.collateralTokenMint === collateralTokenMint;
  });
};
