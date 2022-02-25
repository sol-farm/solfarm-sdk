import { find, toUpper } from 'lodash';
import { FARMS } from '../constants/farms';
import { RAYDIUM_VAULTS } from '../constants/raydiumVaults';
import { SABER_VAULTS } from '../constants/saberVaults';
import { ORCA_VAULTS } from '../constants/orcaVaults';
import { TULIP_VAULTS } from '../constants/tulipVaults';

export const ALL_FARMS = FARMS;

export const ALL_VAULT_FARMS = FARMS;

export const LEVERAGE_FARMS = FARMS;

// #region Farms V1
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

// #endregion

// #region Raydium
export const getRaydiumVaultBySymbol = (symbol) => {
  return find(RAYDIUM_VAULTS, (vault) => {
    return vault.symbol === symbol;
  });
};

export const getRaydiumVaultByMintAddress = (mintAddress) => {
  return find(RAYDIUM_VAULTS, (vault) => {
    return vault.mintAddress === mintAddress;
  });
};
// #endregion

// #region Saber
export const getSaberVaultBySymbol = (symbol) => {
  return find(SABER_VAULTS, (vault) => {
    return toUpper(vault.symbol) === toUpper(symbol);
  });
};

export const getSaberVaultByMintAddress = (mintAddress) => {
  return find(SABER_VAULTS, (vault) => {
    return vault.mintAddress === mintAddress;
  });
};
// #endregion

// #region Orca
export const getOrcaVaultBySymbol = (symbol) => {
  return find(ORCA_VAULTS, (vault) => {
    return toUpper(vault.symbol) === toUpper(symbol);
  });
};

export const getOrcaVaultByMintAddress = (mintAddress) => {
  return find(ORCA_VAULTS, (vault) => {
    return vault.mintAddress === mintAddress;
  });
};
// #endregion

// #region Tulip
export const getTulipVaultBySymbol = (symbol) => {
  return find(TULIP_VAULTS, (vault) => {
    return vault.symbol === symbol;
  });
};

export const getTulipVaultByMintAddress = (mintAddress) => {
  return find(TULIP_VAULTS, (vault) => {
    return vault.mintAddress === mintAddress;
  });
};
// #endregion
