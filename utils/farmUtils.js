import { concat, find, isNil, toUpper } from 'lodash';
import { FARMS } from '../constants/farms';
import { ORCA_FARMS } from '../constants/orcaFarms';
import { RAYDIUM_VAULTS } from '../constants/raydiumVaults';
import { SABER_VAULTS } from '../constants/saberVaults';
import { ORCA_VAULTS } from '../constants/orcaVaults';
import { TULIP_VAULTS } from '../constants/tulipVaults';
import { TokenAmount } from './safe-math';
import { TOKEN_PROGRAM_ID } from '../constants/ids';

export const ALL_FARMS = FARMS;

export const ALL_VAULT_FARMS = FARMS;

export const LEVERAGE_FARMS = concat(FARMS, ORCA_FARMS.filter((farm) => { return !isNil(farm.marginIndex); }));

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

export async function getTokenAccounts ({
  connection,
  wallet
}) {
  // Set token accounts
  const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
    wallet.publicKey,
    {
      programId: TOKEN_PROGRAM_ID
    },
    'processed'
  );

  const tokenAccounts = {};

  parsedTokenAccounts.value.forEach((tokenAccountInfo) => {
    const tokenAccountAddress = tokenAccountInfo.pubkey.toBase58(),
      parsedInfo = tokenAccountInfo.account.data.parsed.info,
      mintAddress = parsedInfo.mint,
      balance = new TokenAmount(
        parsedInfo.tokenAmount.amount,
        parsedInfo.tokenAmount.decimals
      );

    if (
      Object.prototype.hasOwnProperty.call(tokenAccounts, mintAddress)
    ) {
      if (tokenAccounts[mintAddress].balance.isNullOrZero()) {
        tokenAccounts[mintAddress] = {
          tokenAccountAddress,
          balance
        };
      }
      else {
        tokenAccounts[mintAddress] = {
          tokenAccountAddress,
          balance
        };
      }
    }
  });
}
