/* eslint-disable default-case */
// Solana Modules
import * as anchor from 'anchor18';
import * as splToken from '@solana/spl-token';

// Utils
import { commitment, getMultipleAccountsGrouped } from '../utils/web3';
import { FARM_PLATFORMS } from '../constants/farmConstants';

// // Vaults v2 Helpers
import {
  deriveTrackingAddress,
  getAllVaultAccounts,
  getAllVaultsByPlatform,
  getDepositedAmountForShares,
  isSupportedV2Platform,
  getTotalDeposited
} from './helpers/vaultHelpers';

import {
  getRaydiumVaultByMintAddress,
  getRaydiumVaultBySymbol
} from '../constants/raydiumVaults';

// // IDL
import idl from '../constants/vaults_v2_idl.json';
import config from '../constants/vaults_v2_config.json';
import { assign, find, transform } from 'lodash';
import {
  getOrcaVaultByMintAddress,
  getOrcaVaultBySymbol
} from '../constants/orcaVaults';

import { getSaberVaultByMintAddress } from '../constants/saberVaults';
import { getTulipVaultBySymbol } from '../utils/farmUtils';

export const getAutoVaultsProgramId = () => { return config.programs.vault.id; };

/**
 * @description Gets the balances for auto vaults
 *
 * @param {Object} conn
 * @param {Object} wallet
 * @param {Object} query
 * @returns Object vaults and their user balances
 */
export async function getBalancesForAutoVaults (conn, wallet, query = {}) {
  const provider = new anchor.Provider(conn, wallet, {
    skipPreflight: false,
    preflightCommitment: commitment
  });

  let tokenAccounts = {};

  // Set token accounts
  await conn
    .getParsedTokenAccountsByOwner(
      wallet.publicKey,
      {
        programId: splToken.TOKEN_PROGRAM_ID
      },
      commitment
    )
    .then((parsedTokenAccounts) => {
      parsedTokenAccounts.value.forEach((tokenAccountInfo) => {
        // `tokenAccountAddress` is same as `authorityTokenAccount`
        // (used in input to `depositToVault`)
        const tokenAccountAddress = tokenAccountInfo.pubkey.toBase58(),
          parsedInfo = tokenAccountInfo.account.data.parsed.info,
          mintAddress = parsedInfo.mint,
          balance = parsedInfo.tokenAmount.amount;

        tokenAccounts[mintAddress] = {
          tokenAccountAddress,
          balance
        };
      });
    });

  anchor.setProvider(provider);

  // Generate the program client from IDL.
  const programId = new anchor.web3.PublicKey(getAutoVaultsProgramId());
  const program = new anchor.Program(idl, programId);

  // All vaults data
  const allRaydiumVaults = getAllVaultsByPlatform(FARM_PLATFORMS.RAYDIUM);
  const allOrcaVaults = getAllVaultsByPlatform(FARM_PLATFORMS.ORCA);
  const allTulipVaults = getAllVaultsByPlatform(FARM_PLATFORMS.TULIP);
  const allSaberVaults = getAllVaultsByPlatform(FARM_PLATFORMS.SABER);

  // All vault accounts
  const allRaydiumVaultAccounts = getAllVaultAccounts(FARM_PLATFORMS.RAYDIUM);
  const allOrcaVaultAccounts = getAllVaultAccounts(FARM_PLATFORMS.ORCA);
  const allTulipVaultAccounts = getAllVaultAccounts(FARM_PLATFORMS.TULIP);
  const allSaberVaultAccounts = getAllVaultAccounts(FARM_PLATFORMS.SABER);

  const raydiumVaultAccountPublicKeys = allRaydiumVaultAccounts.map(
    (account) => {
      return new anchor.web3.PublicKey(account);
    }
  );

  const saberVaultAccountPublicKeys = allSaberVaultAccounts.map((account) => {
    return new anchor.web3.PublicKey(account);
  });

  // Deposit tracking accounts for raydium vaults
  const raydiumDepositTrackingAccounts = await Promise.all(
    raydiumVaultAccountPublicKeys.map(async (vaultAccountPublicKey) => {
      const [depositTrackingAccount] = await deriveTrackingAddress(
        programId,
        vaultAccountPublicKey,
        provider.wallet.publicKey
      );

      return depositTrackingAccount;
    })
  );

  const orcaVaultAccountPublicKeys = allOrcaVaultAccounts.map((account) => {
    return new anchor.web3.PublicKey(account);
  });

  // Deposit tracking accounts for orca vaults
  const orcaDepositTrackingAccounts = await Promise.all(
    orcaVaultAccountPublicKeys.map(async (vaultAccountPublicKey) => {
      const [depositTrackingAccount] = await deriveTrackingAddress(
        programId,
        vaultAccountPublicKey,
        provider.wallet.publicKey
      );

      return depositTrackingAccount;
    })
  );

  const tulipVaultAccountPublicKeys = allTulipVaultAccounts.map((account) => {
    return new anchor.web3.PublicKey(account);
  });

  // Deposit tracking accounts for raydium vaults
  const tulipDepositTrackingAccounts = await Promise.all(
    tulipVaultAccountPublicKeys.map(async (vaultAccountPublicKey) => {
      const [depositTrackingAccount] = await deriveTrackingAddress(
        programId,
        vaultAccountPublicKey,
        provider.wallet.publicKey
      );

      return depositTrackingAccount;
    })
  );

  // Deposit tracking accounts for raydium vaults
  const saberDepositTrackingAccounts = await Promise.all(
    saberVaultAccountPublicKeys.map(async (vaultAccountPublicKey) => {
      const [depositTrackingAccount] = await deriveTrackingAddress(
        programId,
        vaultAccountPublicKey,
        provider.wallet.publicKey
      );

      return depositTrackingAccount;
    })
  );

  const publicKeys = [
    // Raydium deposit tracking accounts data
    raydiumDepositTrackingAccounts,
    raydiumVaultAccountPublicKeys,

    // Orca deposit tracking accounts data
    orcaDepositTrackingAccounts,
    orcaVaultAccountPublicKeys,

    // Tulip vaults
    tulipDepositTrackingAccounts,
    tulipVaultAccountPublicKeys,

    // Saber vaults
    saberVaultAccountPublicKeys,
    saberDepositTrackingAccounts
  ];

  const [
    raydiumUserBalanceAccounts,
    raydiumAccounts,

    orcaUserBalanceAccounts,
    orcaAccounts,

    tulipUserBalanceAccounts,
    tulipAccounts,

    saberAccounts,
    saberUserBalanceAccounts
  ] = await getMultipleAccountsGrouped(connection, publicKeys, commitment);

  // This will store all the data for the vaults and used to update the VaultStore
  const vaultsData = new Map();

  [
    ...allRaydiumVaultAccounts,
    ...allOrcaVaultAccounts,
    ...allSaberVaultAccounts,
    ...allTulipVaultAccounts
  ].forEach((account) => {
    vaultsData.set(account, {});
  });

  // #region - RAYDIUM VAULTS
  for (const [
    index,
    userBalanceAccount
  ] of raydiumUserBalanceAccounts.entries()) {
    try {
      const account = allRaydiumVaultAccounts[index];

      let decodedUserAccountInfo = {};

      if (userBalanceAccount?.account?.data) {
        decodedUserAccountInfo = program?.coder?.accounts?.decode(
          'DepositTrackingV1',
          userBalanceAccount?.account?.data
        );
      }

      vaultsData.set(account, {
        mintAddress: allRaydiumVaults[index]?.base?.underlying_mint,
        sharesMint: allRaydiumVaults[index]?.base?.shares_mint,
        symbol: allRaydiumVaults[index]?.symbol,
        name: allRaydiumVaults[index]?.name,
        depositedBalance: decodedUserAccountInfo?.depositedBalance,
        deposited: decodedUserAccountInfo?.depositedBalance,
        shares: decodedUserAccountInfo?.shares,
        lastDepositTime: decodedUserAccountInfo?.lastDepositTime
      });
    }
    catch (e) {
      console.error({ e });
    }
  }

  for (const [index, raydiumAccount] of raydiumAccounts.entries()) {
    try {
      const account = allRaydiumVaultAccounts[index];

      let decodedRaydiumAccountInfo = {};

      if (raydiumAccount?.account?.data) {
        decodedRaydiumAccountInfo = program.coder.accounts.decode(
          'RaydiumVaultV1',
          raydiumAccount?.account?.data
        );
      }

      const { totalDepositedBalance, totalShares } =
        decodedRaydiumAccountInfo?.base || {};

      const raydiumVaultData = getRaydiumVaultBySymbol(
        vaultsData.get(account)?.symbol
      );

      const shares = vaultsData.get(account)?.shares;

      let depositedAmount = getDepositedAmountForShares({
        totalDepositedBalance,
        totalShares,
        sharesBalance: shares,
        decimals: raydiumVaultData?.decimals
      });

      const vaultData = vaultsData.get(account);

      const uiConfigData =
        getRaydiumVaultByMintAddress(vaultData?.mintAddress) || {};

      vaultsData.set(
        account,
        assign({}, vaultData, {
          uiConfigData,
          totalShares,
          totalDepositedBalance,
          deposited: depositedAmount
        })
      );
    }
    catch (e) {
      console.error({ e });
    }
  }

  // #endregion

  // #region - TULIP VAULTS
  for (const [index, userBalanceAccount] of tulipUserBalanceAccounts.entries()) {
    try {
      const account = allTulipVaultAccounts[index];

      let decodedUserAccountInfo = {};

      if (userBalanceAccount?.account?.data) {
        decodedUserAccountInfo = program?.coder?.accounts?.decode(
          'DepositTrackingV1',
          userBalanceAccount?.account?.data
        );
      }

      vaultsData.set(account, {
        mintAddress: allTulipVaults[index]?.base?.underlying_mint,
        sharesMint: allTulipVaults[index]?.base?.shares_mint,
        symbol: allTulipVaults[index]?.symbol,
        name: allTulipVaults[index]?.name,
        depositedBalance: decodedUserAccountInfo?.depositedBalance,
        deposited: decodedUserAccountInfo?.depositedBalance,
        shares: decodedUserAccountInfo?.shares,
        lastDepositTime: decodedUserAccountInfo?.lastDepositTime
      });
    }
    catch (e) {
      console.error({ e });
    }
  }

  for (const [index, tulipAccount] of tulipAccounts.entries()) {
    try {
      const account = allTulipVaultAccounts[index];

      let decodedTulipAccountInfo = {};

      if (tulipAccount?.account?.data) {
        decodedTulipAccountInfo = program.coder.accounts.decode('MultiDepositOptimizerV1', tulipAccount?.account?.data);
      }

      const {
        totalDepositedBalance,
        totalShares
      } = decodedTulipAccountInfo?.base || {};

      const tulipVaultData = getTulipVaultBySymbol(vaultsData.get(account)?.symbol) || {};

      const shares = vaultsData.get(account)?.shares;

      let depositedAmount = getDepositedAmountForShares({
        totalDepositedBalance,
        totalShares,
        sharesBalance: shares,
        decimals: tulipVaultData?.decimals
      });

      const standaloneVaults = transform(decodedTulipAccountInfo?.standaloneVaults,
        (vaults, { vaultAddress, depositedBalance }) => {
          vaults[vaultAddress] = { depositedBalance };

          return vaults;
        }, {});

      const vaultData = vaultsData.get(account);

      vaultsData.set(account, assign({}, vaultData, {
        uiConfigData: tulipVaultData,
        totalShares,
        totalDepositedBalance,
        deposited: depositedAmount,
        standaloneVaults
      }));
    }
    catch (e) {
      console.error({ e });
    }
  }

  // #endregion

  // #region - ORCA VAULTS
  for (const [
    index,
    userBalanceAccount
  ] of orcaUserBalanceAccounts.entries()) {
    try {
      const account = allOrcaVaultAccounts[index];

      let decodedUserAccountInfo = {};

      if (userBalanceAccount?.account?.data) {
        decodedUserAccountInfo = program?.coder?.accounts?.decode(
          'DepositTrackingV1',
          userBalanceAccount?.account?.data
        );
      }

      vaultsData.set(account, {
        mintAddress: allOrcaVaults[index]?.base?.underlying_mint,
        sharesMint: allOrcaVaults[index]?.base?.shares_mint,
        symbol: allOrcaVaults[index]?.symbol,
        name: allOrcaVaults[index]?.name,
        depositedBalance: decodedUserAccountInfo?.depositedBalance,
        deposited: decodedUserAccountInfo?.depositedBalance,
        shares: decodedUserAccountInfo?.shares,
        lastDepositTime: decodedUserAccountInfo?.lastDepositTime
      });
    }
    catch (e) {
      console.error({ e });
    }
  }

  for (const [index, orcaAccount] of orcaAccounts.entries()) {
    try {
      const account = allOrcaVaultAccounts[index];

      let decodedOrcaAccountInfo = {};

      if (orcaAccount?.account?.data) {
        decodedOrcaAccountInfo = program.coder.accounts.decode(
          'OrcaVaultV1',
          orcaAccount?.account?.data
        );
      }

      const { totalDepositedBalance, totalShares } =
        decodedOrcaAccountInfo?.base || {};

      const orcaVaultData = getOrcaVaultBySymbol(
        vaultsData.get(account)?.symbol
      );

      const shares = vaultsData.get(account)?.shares;

      let depositedAmount = getDepositedAmountForShares({
        totalDepositedBalance,
        totalShares,
        sharesBalance: shares,
        decimals: orcaVaultData?.decimals
      });

      const vaultData = vaultsData.get(account);

      const uiConfigData =
        getOrcaVaultByMintAddress(vaultData?.mintAddress) || {};

      vaultsData.set(
        account,
        assign({}, vaultData, {
          uiConfigData,
          totalShares,
          totalDepositedBalance,
          deposited: depositedAmount
        })
      );
    }
    catch (e) {
      console.error({ e });
    }
  }

  // #endregion

  // #region - SABER VAULTS
  for (const [
    index,
    userBalanceAccount
  ] of saberUserBalanceAccounts.entries()) {
    try {
      const account = allSaberVaultAccounts[index];

      let decodedUserAccountInfo = {};

      if (userBalanceAccount?.account?.data) {
        decodedUserAccountInfo = program?.coder?.accounts?.decode(
          'DepositTrackingV1',
          userBalanceAccount?.account?.data
        );
      }

      vaultsData.set(account, {
        mintAddress: allSaberVaults[index]?.base?.underlying_mint,
        sharesMint: allSaberVaults[index]?.base?.shares_mint,
        symbol: allSaberVaults[index]?.symbol,
        name: allSaberVaults[index]?.name,
        depositedBalance: decodedUserAccountInfo?.depositedBalance,
        deposited: decodedUserAccountInfo?.depositedBalance,
        shares: decodedUserAccountInfo?.shares,
        lastDepositTime: decodedUserAccountInfo?.lastDepositTime
      });
    }
    catch (e) {
      console.error({ e });
    }
  }

  for (const [index, saberAccount] of saberAccounts.entries()) {
    try {
      const account = allSaberVaultAccounts[index];

      let decodedSaberAccountInfo = {};

      if (saberAccount?.account?.data) {
        decodedSaberAccountInfo = program.coder.accounts.decode(
          'QuarryVaultV1',
          saberAccount?.account?.data
        );
      }

      const { totalDepositedBalance, totalShares } =
        decodedSaberAccountInfo?.base || {};

      const mintAddress = allSaberVaults[index]?.base?.underlying_mint;

      const uiConfigData = getSaberVaultByMintAddress(mintAddress) || {};

      const vaultData = vaultsData.get(account);

      const shares = vaultsData.get(account)?.shares;

      let depositedAmount = getDepositedAmountForShares({
        totalDepositedBalance,
        totalShares,
        sharesBalance: shares,
        decimals: uiConfigData?.decimals
      });

      const data = {
        uiConfigData,
        totalShares,
        totalDepositedBalance,
        deposited: depositedAmount
      };

      vaultsData.set(account, assign({}, vaultData, data));
    }
    catch (e) {
      console.error({ e });
    }
  }

  // #endregion

  // Build the query response
  let queriedVaults = {};

  const allVaults = Array.from(vaultsData.values());

  // Return all vault balances if no query has been provided
  if (!query.platforms && !query.vaults) {
    const vaultsData = allVaults.map((vault) => {
      const balance = getTotalDeposited({
        tokenAccounts,
        sharesMint: vault.sharesMint,
        decimals: vault.uiConfigData.decimals,
        totalDepositedBalance: vault.totalDepositedBalance,
        totalShares: vault.totalShares,
        deposited: vault.deposited
      });

      return {
        platform: vault.uiConfigData.platform,
        symbol: vault.uiConfigData.symbol,
        balance: balance / Math.pow(10, vault.uiConfigData.decimals)
      };
    });

    return {
      vaults: vaultsData
    };
  }

  if (query.platforms) {
    query.platforms.forEach((platform) => {
      if (!isSupportedV2Platform(platform)) {
        return null;
      }

      if (!queriedVaults.platforms[platform]) {
        queriedVaults.platforms[platform] = [];
      }

      allVaults.forEach((vault) => {
        if (vault.platform !== platform) {
          return null;
        }

        const decimals = vault.uiConfigData.decimals;

        const balance = getTotalDeposited({
          tokenAccounts,
          sharesMint: vault.sharesMint,
          decimals,
          totalDepositedBalance: vault.totalDepositedBalance,
          totalShares: vault.totalShares,
          deposited: vault.deposited
        });

        queriedVaults.platforms[platform].push({
          platform: vault.uiConfigData.platform,
          symbol: vault.uiConfigData.symbol,
          balance: balance / Math.pow(10, vault.uiConfigData.decimals)
        });
      });

      return null;
    });
  }

  if (Array.isArray(query.vaults)) {
    queriedVaults.vaults = [];

    allVaults.forEach((vault) => {
      const mintAddress = vault.uiConfigData.mintAddress;

      if (!find(query.vaults, { mintAddress })) {
        return null;
      }

      const balance = getTotalDeposited({
        tokenAccounts,
        sharesMint: vault.sharesMint,
        decimals: vault.uiConfigData.decimals,
        totalDepositedBalance: vault.totalDepositedBalance,
        totalShares: vault.totalShares,
        deposited: vault.deposited
      });

      queriedVaults.vaults.push({
        platform: vault.uiConfigData.platform,
        symbol: vault.uiConfigData.symbol,
        balance: balance / Math.pow(10, vault.uiConfigData.decimals)
      });
    });
  }

  return queriedVaults;
}
