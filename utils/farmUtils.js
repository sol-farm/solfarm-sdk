import { find } from 'lodash';
import { FARMS } from '../constants/farms';

export const ALL_FARMS = FARMS;

export const ALL_VAULT_FARMS = FARMS;

export const LEVERAGE_FARMS = FARMS;

export const getFarmBySymbol = (symbol) => {
  return find(ALL_FARMS, (farm) => {
    return farm.symbol === symbol;
  });
};

export const getFarmByMintAddress = (mintAddress) => {
  return find(ALL_FARMS, (farm) => {
    return farm.mintAddress === mintAddress;
  });
};
