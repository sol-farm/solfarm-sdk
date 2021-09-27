import { concat, find } from 'lodash';
import { FARMS } from '../constants/farms';

export const ALL_FARMS = concat(FARMS);

export const ALL_VAULT_FARMS = concat(FARMS);

export const LEVERAGE_FARMS = concat(FARMS);

export const getFarmBySymbol = (symbol) => find(ALL_FARMS, (farm) => farm.symbol === symbol);

export const getFarmByMintAddress = (mintAddress) => find(ALL_FARMS, (farm) => farm.mintAddress === mintAddress);
