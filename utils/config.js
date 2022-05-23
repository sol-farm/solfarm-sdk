import { concat, find } from 'lodash';
import config from '../constants/info.json';
import lendConfig from '../constants/lending_info.json';
import saberConfig from '../constants/saber_idl.json';
import orcaConfig from '../constants/orca_idl.json';

export const getVaultProgramId = () => {
  return config.programId;
};

export const getTokenProgramId = () => {
  return config.rayTokenProgramId;
};

export const getSaberVaultProgramId = () => {
  return saberConfig.programs.vault.id;
};

export const getOrcaVaultProgramId = () => {
  return orcaConfig.programs.vault.id;
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

export const getOrcaFarmPoolCoinTokenaccount = (name) => {
  const farm = find(orcaConfig.farms, (farm) => {
    return farm.name === name;
  });

  return farm?.poolCoinTokenaccount;
};

export const getOrcaFarmPoolPcTokenaccount = (name) => {
  const farm = find(orcaConfig.farms, (farm) => {
    return farm.name === name;
  });

  return farm?.poolPcTokenaccount;
};

export const getOrcaLpMintAddress = (name) => {
  const farm = find(orcaConfig.farms, (farm) => {
    return farm.name === name;
  });

  return farm?.lpMintAddress;
};

export const getOrcaFarmDoubleDip = (name) => {
  const farm = find(orcaConfig.farms, (farm) => {
    return farm.name === name;
  });

  return farm?.doubleDip;
};

export const getOrcaVaultAccount = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.account;
};

export const getOrcaVaultLpAccount = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.farm_token_account;
};

export const getOrcaVaultFarmMint = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.farm_token_mint;
};

export const getOrcaVaultDdFarmMint = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.dd_farm_token_mint;
};

export const getOrcaVaultGlobalBaseTokenVault = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.global_base_token_vault;
};

export const getOrcaVaultGlobalDdBaseTokenVault = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.global_base_token_vault_dd;
};

export const getOrcaVaultGlobalFarm = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.global_farm;
};

export const getOrcaVaultGlobalFarmDd = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.global_farm_dd;
};

export const getOrcaVaultGlobalRewardTokenVault = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.global_reward_token_vault;
};

export const getOrcaVaultGlobalRewardTokenVaultDd = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.global_reward_token_vault_dd;
};

export const getOrcaVaultConvertAuthority = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.convert_authority;
};

export const getOrcaVaultConvertAuthorityDd = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.convert_authority_dd;
};

export const getOrcaVaultLpMint = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.swap_pool_token_mint;
};

export const getOrcaVaultSwapPoolTokenAccount = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.swap_pool_token_account;
};

export const getOrcaVaultRewardMint = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.reward_token_mint;
};

export const getOrcaVaultDdRewardMint = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.dd_reward_token_mint;
};

export const getOrcaVaultFeeAccount = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.orca_fee_account;
};

export const getOrcaFarmPoolId = (name) => {
  const farm = find(orcaConfig.farms, (farm) => farm.name === name);

  return farm?.poolId;
};

export const getOrcaFarmPoolLpTokenAccount = (name) => {
  const farm = find(orcaConfig.farms, (farm) => farm.name === name);

  return farm?.poolLpTokenAccount;
};
