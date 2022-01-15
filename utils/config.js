import { concat, find } from 'lodash';
import config from '../constants/info.json';
import lendConfig from '../constants/lending_info.json';

export const getVaultProgramId = () => {
  return config.programId;
};
export const getTokenProgramId = () => {
  return config.rayTokenProgramId;
};

const vaultAccounts = concat(config.vault.accounts);

const farmAccounts = concat(config.farms);

// #region Vault getters
export const getVaultInfoAccount = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => {
    return account.name === name;
  });

  return vaultAccount?.infoAccount;
};

export const getVaultOldInfoAccount = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => {
    return account.name === name;
  });

  return vaultAccount?.oldInfoAccount;
};

export const getVaultAccount = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => {
    return account.name === name;
  });

  return vaultAccount?.account;
};

export const getVaultLpTokenAccount = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => {
    return account.name === name;
  });

  return vaultAccount?.lpTokenAccount;
};

export const getVaultPdaAccount = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => {
    return account.name === name;
  });

  return vaultAccount?.pdaAccount;
};

export const getVaultRewardAccountA = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => {
    return account.name === name;
  });

  return vaultAccount?.rewardAccountA;
};

export const getVaultRewardAccountB = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => {
    return account.name === name;
  });

  return vaultAccount?.rewardAccountB;
};

export const getVaultVersion = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => {
    return account.name === name;
  });

  return vaultAccount?.rayPoolVersion;
};

export const getVaultTulipTokenAccount = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => {
    return account.name === name;
  });

  return vaultAccount?.vaultTulipTokenAccount;
};

export const getVaultTulipRewardPerSlot = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => {
    return account.name === name;
  });

  return vaultAccount?.tulipRewardPerSlot;
};

export const getVaultTulipRewardEndSlot = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => {
    return account.name === name;
  });

  return vaultAccount?.tulipRewardEndSlot;
};

export const getVaultTulipMint = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => {
    return account.name === name;
  });

  return vaultAccount?.tulipMint;
};

export const getVaultSerumOpenOrdersAccount = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => {
    return account.name === name;
  });

  return vaultAccount?.serumOpenOrdersAccount;
};

export const getVaultSerumVaultSigner = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => {
    return account.name === name;
  });

  return vaultAccount?.serumVaultSigner;
};

export const isVersionFourOrFive = (name) => {
  const vaultVersion = getVaultVersion(name);

  return ['4', '5'].includes(vaultVersion);
};
// #endregion

// #region Farm getters
export const getFarmProgramId = (name) => {
  const farm = find(farmAccounts, (farm) => {
    return farm.name === name;
  });

  return farm?.programId;
};

export const getFarmPoolId = (name) => {
  const farm = find(farmAccounts, (farm) => {
    return farm.name === name;
  });

  return farm?.poolId;
};

export const getFarmPoolAuthority = (name) => {
  const farm = find(farmAccounts, (farm) => {
    return farm.name === name;
  });

  return farm?.poolAuthority;
};

export const getFarmLpMintAddress = (name) => {
  const farm = find(farmAccounts, (farm) => {
    return farm.name === name;
  });

  return farm?.lpMintAddress;
};

export const getFarmPoolLpTokenAccount = (name) => {
  const farm = find(farmAccounts, (farm) => {
    return farm.name === name;
  });

  return farm?.poolLpTokenAccount;
};

export const getFarmPoolRewardATokenAccount = (name) => {
  const farm = find(farmAccounts, (farm) => {
    return farm.name === name;
  });

  return farm?.poolRewardATokenAccount;
};

export const getFarmPoolRewardBTokenAccount = (name) => {
  const farm = find(farmAccounts, (farm) => {
    return farm.name === name;
  });

  return farm?.poolRewardBTokenAccount;
};

export const getFarmFusion = (name) => {
  const farm = find(farmAccounts, (farm) => {
    return farm.name === name;
  });

  return farm?.fusion;
};

export const getFarmPoolCoinTokenaccount = (name) => {
  const farm = find(farmAccounts, (farm) => {
    return farm.name === name;
  });

  return farm?.poolCoinTokenaccount;
};

export const getFarmPoolPcTokenaccount = (name) => {
  const farm = find(farmAccounts, (farm) => {
    return farm.name === name;
  });

  return farm?.poolPcTokenaccount;
};

export const getFarmAmmId = (name) => {
  const farm = find(farmAccounts, (farm) => {
    return farm.name === name;
  });

  return farm?.ammId;
};

export const getFarmAmmOpenOrders = (name) => {
  const farm = find(farmAccounts, (farm) => {
    return farm.name === name;
  });

  return farm?.ammOpenOrders;
};

export const getFarmSerumProgramId = (name) => {
  const farm = find(farmAccounts, (farm) => {
    return farm.name === name;
  });

  return farm?.serumProgramId;
};
// #endregion

// #region Lending Info getters
export const getLendingProgramId = () => {
  return lendConfig.programs.lending.id;
};

export const getLendingFarmProgramId = () => {
  return lendConfig.programs.farm.id;
};

export const getLendingMarketAccount = () => {
  return lendConfig.lending.lending_market_account;
};

export const getLendingFarmManagementAccount = () => {
  return lendConfig.farm.global_account;
};

export const getLendingFarmAccount = (name) => {
  return find(lendConfig.farm.farms, (farm) => {
    return farm.name === name;
  });
};

export const getLendingReserve = (name) => {
  return find(lendConfig.lending.reserves, (reserve) => {
    return reserve.name === name;
  });
};

export const getLendingReserveFromKey = (key) => {
  return find(lendConfig.lending.reserves, (reserve) => {
    return reserve.account === key;
  });
};

export const getPriceFeedsForReserve = (name) => {
  return find(lendConfig.pyth.price_feeds, (priceFeed) => {
    return priceFeed.name === name;
  });
};

export const isSupportedLendingFarm = (name) => {
  return Boolean(
    find(lendConfig.farm.farms, (farm) => {
      return farm.name === name;
    })
  );
};

export const getLendingReserveByAccount = (account) => {
  return find(lendConfig.lending.reserves, (reserve) => {
    return reserve.account === account;
  });
};

// #endregion
