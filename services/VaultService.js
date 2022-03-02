/* eslint-disable default-case */
// Solana Modules
import * as anchor from 'anchorupdated';

// Store
import { getStore } from '../stores/get-store';

// Utils
import { commitment, getMultipleAccountsGrouped } from '../utils/web3';
import { getOrcaPeriodRate } from '../utils/vault';
import { getWeightedAverage, TokenAmount } from '../utils/safe-math';
import { COMPOUNDING_CYCLES, FARM_PLATFORMS } from '../constants/farmConstants';

// Vaults v2 Helpers
import {
  deriveTrackingAddress,
  getAllVaultAccounts,
  getAllVaultsByPlatform,
  getVaultMarketAmms,
  getDepositedAmountForShares,
  deriveEphemeralTrackingAddress,
  getLendingOptimizerVaultByAccount
} from './helpers/vaultHelpers';

import { getVaultV2ProgramId } from '../utils/configv2';
import {
  getRaydiumVaultByMintAddress,
  getRaydiumVaultBySymbol
} from '../utils/raydiumVaults';

// IDL
import idl from '../idl/vaults_v2_idl.json';
import { assign, isEmpty, isNil, pick, toLower, transform, noop } from 'lodash';
import { RaydiumVaultService } from './RaydiumVaultService';
import { OrcaVaultService } from './OrcaVaultService';
import { TulipVaultService } from './TulipVaultService';
import {
  getOrcaVaultByMintAddress,
  getOrcaVaultBySymbol
} from '../utils/orcaVaults';
import {
  getTulipVaultByMintAddress,
  getTulipVaultBySymbol
} from '../utils/tulipVaults';
import {
  ACCOUNT_LAYOUT,
  GLOBAL_FARM_DATA_LAYOUT,
  MINT_LAYOUT
} from '../utils/layouts';
import {
  getVaultStakeLayoutV2,
  isVaultVersionFourOrFive
} from '../utils/config';
import { getAPY } from '../utils/farmUtils';
import { TOKENS } from '../utils/tokens';
import {
  REBALANCE_STATES,
  TAG_TO_PLATFORM_MAP
} from './helpers/tulipVaultHelpers';
import { SaberVaultService } from './SaberVaultService';
import { getSaberVaultByMintAddress } from '../utils/saberVaults';

const getPerBlockAmountTotalValue = (perBlockAmount, price) => {
  return perBlockAmount * 2 * 60 * 60 * 24 * 365 * price;
};

export const VaultService = {
  [FARM_PLATFORMS.RAYDIUM]: {
    handleDepositToVault (data) {
      return RaydiumVaultService.handleDepositToVault(data);
    },

    handleReleaseFunds (data) {
      return RaydiumVaultService.handleReleaseFunds(data);
    },

    handleUnstakeFunds (data) {
      return RaydiumVaultService.handleUnstakeFunds(data);
    }
  },

  [FARM_PLATFORMS.ORCA]: {
    handleDepositToVault (data) {
      return OrcaVaultService.handleDepositToVault(data);
    },

    handleReleaseFunds (data) {
      return OrcaVaultService.handleReleaseFunds(data);
    },

    handleUnstakeFunds (data) {
      return OrcaVaultService.handleUnstakeFunds(data);
    }
  },

  [FARM_PLATFORMS.SABER]: {
    handleDepositToVault (data) {
      return SaberVaultService.handleDepositToVault(data);
    },

    handleReleaseFunds (data) {
      return SaberVaultService.handleReleaseFunds(data);
    },

    handleUnstakeFunds (data) {
      return SaberVaultService.handleUnstakeFunds(data);
    }
  },

  [FARM_PLATFORMS.TULIP]: {
    handleDepositToVault (data) {
      return TulipVaultService.handleDepositToVault(data);
    },

    handleReleaseFunds (data) {
      return TulipVaultService.handleReleaseFunds(data);
    },

    handleUnstakeFunds (data) {
      return TulipVaultService.handleUnstakeFunds(data);
    }
  },

  /**
   * @description Fetches the data for vaults only and updates the stores
   * Does not rely on wallet.
   */
  async updateVaults () {
    // eslint-disable-next-line no-console
    console.info('Refreshing data for vaults');

    // Fake empty wallet to fetch TVL etc. data
    const walletToInitialize = {
      signTransaction: noop,
      signAllTransactions: noop,
      publicKey: new anchor.web3.Account().publicKey
    };
    const provider = new anchor.Provider(window.$web3, walletToInitialize, {
      skipPreflight: true
    });

    anchor.setProvider(provider);

    // Generate the program client from IDL.
    const programId = new anchor.web3.PublicKey(getVaultV2ProgramId());
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

    const orcaVaultAccountPublicKeys = allOrcaVaultAccounts.map((account) => {
      return new anchor.web3.PublicKey(account);
    });

    const tulipVaultAccountPublicKeys = allTulipVaultAccounts.map((account) => {
      return new anchor.web3.PublicKey(account);
    });

    const saberVaultAccountPublicKeys = allSaberVaultAccounts.map((account) => {
      return new anchor.web3.PublicKey(account);
    });

    // Raydium - reward meta data
    let poolIds = [],
      poolLpTokenAccounts = [];

    allRaydiumVaults.forEach((vaultConfig) => {
      const vaultAmmsData = getVaultMarketAmms(
        FARM_PLATFORMS.RAYDIUM,
        vaultConfig?.symbol
      );

      let { pool_id: poolId, lp_token_account: poolLpTokenAccount } =
        vaultAmmsData?.farm || {};

      poolId = new anchor.web3.PublicKey(poolId);
      poolIds.push(poolId);

      poolLpTokenAccount = new anchor.web3.PublicKey(poolLpTokenAccount);
      poolLpTokenAccounts.push(poolLpTokenAccount);
    });

    let orcaMintAddresses = [],
      orcaPoolCoinTokenAccounts = [],
      orcaPoolPcTokenAccounts = [],
      orcaGlobalFarms = [],
      orcaGlobalFarmsDd = [],
      doubleDipFarms = new Map();

    allOrcaVaults.forEach((orcaVaultConfig) => {
      const mintAddress = new anchor.web3.PublicKey(
        orcaVaultConfig?.base?.underlying_mint
      );

      orcaMintAddresses.push(mintAddress);

      const poolSwapTokenA = new anchor.web3.PublicKey(
        orcaVaultConfig?.farm_data?.pool_swap_token_a
      );

      orcaPoolCoinTokenAccounts.push(poolSwapTokenA);

      const poolSwapTokenB = new anchor.web3.PublicKey(
        orcaVaultConfig?.farm_data?.pool_swap_token_b
      );

      orcaPoolPcTokenAccounts.push(poolSwapTokenB);

      // Choose the global farm based on if double dip or not
      if (orcaVaultConfig?.double_dip) {
        const globalFarmDd = new anchor.web3.PublicKey(
          orcaVaultConfig?.dd_farm_data?.config_data?.global_farm
        );

        orcaGlobalFarmsDd.push(globalFarmDd);
        doubleDipFarms.set(
          orcaVaultConfig?.symbol,
          orcaGlobalFarmsDd.length - 1
        );
      }

      const globalFarm = new anchor.web3.PublicKey(
        orcaVaultConfig?.farm_data?.global_farm
      );

      orcaGlobalFarms.push(globalFarm);
    });

    let saberVaultCoinTokenAccounts = [],
      saberVaultPcTokenAccounts = [],
      saberMintAddresses = [],
      sunnyMintAddresses = [];

    allSaberVaults.forEach((saberVaultConfig) => {
      const mintAddress = new anchor.web3.PublicKey(
        saberVaultConfig?.base?.underlying_mint
      );

      saberMintAddresses.push(mintAddress);

      const vaultAmmsData = getVaultMarketAmms(
        FARM_PLATFORMS.SABER,
        saberVaultConfig?.symbol
      );

      const coinTokenAccount = new anchor.web3.PublicKey(
        vaultAmmsData?.swap_token_a_account
      );

      saberVaultCoinTokenAccounts.push(coinTokenAccount);

      const pcTokenAccount = new anchor.web3.PublicKey(
        vaultAmmsData?.swap_token_b_account
      );

      saberVaultPcTokenAccounts.push(pcTokenAccount);

      const sunnyMintAddress = new anchor.web3.PublicKey(
        saberVaultConfig?.sunny_config?.sunny_internal_token_mint
      );

      sunnyMintAddresses.push(sunnyMintAddress);
    });

    const publicKeys = [
      // Raydium vaults
      raydiumVaultAccountPublicKeys,
      poolIds,
      poolLpTokenAccounts,

      // Orca vaults
      orcaVaultAccountPublicKeys,
      orcaMintAddresses,
      orcaPoolCoinTokenAccounts,
      orcaPoolPcTokenAccounts,
      orcaGlobalFarms,
      orcaGlobalFarmsDd,

      // Tulip Vaults
      tulipVaultAccountPublicKeys,

      // Saber Vaults
      saberVaultAccountPublicKeys,
      saberVaultCoinTokenAccounts,
      saberVaultPcTokenAccounts,
      saberMintAddresses,
      sunnyMintAddresses
    ];

    const [
      // Raydium
      raydiumAccounts,
      poolInfo,
      poolLpTokenAccountsInfo,

      // Orca
      orcaAccounts,
      orcaMintAddressesInfo,
      orcaPoolCoinTokenAccountsInfo,
      orcaPoolPcTokenAccountsInfo,
      orcaGlobalFarmsInfo,
      orcaGlobalFarmsDdInfo,

      // Tulip
      tulipAccounts,

      // Saber
      saberAccounts,
      saberVaultCoinTokenAccountsInfo,
      saberVaultPCTokenAccountsInfo,
      tokenSupplyForSaberVaults,
      tokenSupplyForSunnyVaults
    ] = await getMultipleAccountsGrouped(window.$web3, publicKeys, commitment);

    // This will store all the data for the vaults and used to update the VaultStore
    const vaultsData = new Map();

    [
      ...allRaydiumVaultAccounts,
      ...allOrcaVaultAccounts,
      ...allTulipVaultAccounts,
      ...allSaberVaultAccounts
    ].forEach((account) => {
      vaultsData.set(account, {});
    });

    // #region - RAYDIUM VAULTS
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

        const mintAddress = allRaydiumVaults[index]?.base?.underlying_mint;

        const uiConfigData = getRaydiumVaultByMintAddress(mintAddress) || {};

        const { getPair, getCoinInLp, getPcInLp, getPrice } =
          getStore('PriceStore');

        const farmDetails = getPair(mintAddress) || {},
          currentPoolInfo = poolInfo[index],
          currentPoolLayout = getVaultStakeLayoutV2(uiConfigData),
          isPoolVersionFourOrFive = isVaultVersionFourOrFive(uiConfigData),
          decodedPoolInfo = currentPoolLayout.decode(
            currentPoolInfo.account.data
          ),
          poolLpTokenAccountInfo = poolLpTokenAccountsInfo[index],
          decodedPoolLpTokenAccountInfo = ACCOUNT_LAYOUT.decode(
            poolLpTokenAccountInfo.account.data
          );

        let price,
          rewardPerBlockAmount,
          rewardBPerBlockAmount,
          rewardPerBlockAmountTotalValue,
          rewardBPerBlockAmountTotalValue,
          totalAPY,
          coinInLp,
          pcInLp,
          farm = uiConfigData;

        // liquidityInUSD;
        if (farm.singleStake) {
          price = Number(getPrice(farm.symbol));
        }
        else {
          coinInLp = getCoinInLp(farm.symbol) || 0;
          pcInLp = getPcInLp(farm.symbol) || 0;

          price = getPrice(farm.symbol, FARM_PLATFORMS.RAYDIUM) || 0;
        }

        const priceBN = new anchor.BN(price);

        if (isPoolVersionFourOrFive) {
          const { perBlock, perBlockB } = decodedPoolInfo,
            { reward, rewardB } = farm;

          rewardPerBlockAmount = new TokenAmount(
            perBlock.toString(),
            reward.decimals
          );
          rewardBPerBlockAmount = new TokenAmount(
            perBlockB.toString(),
            rewardB.decimals
          );

          rewardPerBlockAmountTotalValue = getPerBlockAmountTotalValue(
            rewardPerBlockAmount.toEther().toNumber(),
            getPrice(reward.symbol)
          );

          rewardBPerBlockAmountTotalValue = getPerBlockAmountTotalValue(
            rewardBPerBlockAmount.toEther().toNumber(),
            getPrice(rewardB.symbol)
          );

          let apyA = 0;
          let apyB = 0;

          try {
            const liquidityInUSD = new anchor.BN(
              new anchor.BN(decodedPoolLpTokenAccountInfo.amount.toString()) *
                price
            ).div(new anchor.BN(Math.pow(10, farm.decimals)));

            apyA = (100 * rewardPerBlockAmountTotalValue) / liquidityInUSD;
            apyB = (100 * rewardBPerBlockAmountTotalValue) / liquidityInUSD;
          }
          catch (e) {
            const liquidityInUSD =
              new anchor.BN(
                decodedPoolLpTokenAccountInfo.amount.toString()
              ).div(new anchor.BN(Math.pow(10, farm.decimals))) * price;

            apyA = (100 * rewardPerBlockAmountTotalValue) / liquidityInUSD;
            apyB = (100 * rewardBPerBlockAmountTotalValue) / liquidityInUSD;
          }

          if (reward && rewardB) {
            totalAPY = apyA + apyB;
          }
          else {
            totalAPY = apyA;
          }

          // console.log({
          //   rewardPerBlockAmount: rewardPerBlockAmount.toEther().toNumber,
          //   rewardBPerBlockAmount: rewardBPerBlockAmount.toEther().toNumber,
          //   tokenAPrice: getTokenPrice(reward.symbol),
          //   tokenBPrice: getTokenPrice(rewardB.symbol),
          //   totalAPY
          // });
        }
        else {
          const { rewardPerBlock } = decodedPoolInfo;

          rewardPerBlockAmount = new TokenAmount(
            rewardPerBlock.toString(),
            farm.decimals
          );

          rewardPerBlockAmountTotalValue = getPerBlockAmountTotalValue(
            rewardPerBlockAmount.toEther().toNumber(),
            getPrice(farm.reward.symbol)
          );

          const liquidityInUsd = new anchor.BN(
            decodedPoolLpTokenAccountInfo.amount.toString()
          )
            .mul(priceBN)
            .div(new anchor.BN(Math.pow(10, farm.decimals)));

          totalAPY = (100 * rewardPerBlockAmountTotalValue) / liquidityInUsd;
        }

        // We want `apyDetails` in all cases but `farmDetails` only when the Farm is NOT `singleStake`
        if (!((farmDetails || farm.singleStake) && !isNil(totalAPY))) {
          return;
        }

        const periodicRate = totalAPY / 365;
        const { apy: tradingFees = 0 } = getPair(farm.mintAddress) || {};
        const dailyTradingFees = Number(tradingFees) / 365;

        const dailyAPR = periodicRate + (farm.disabled ? 0 : dailyTradingFees);
        const weeklyAPY =
          getAPY(periodicRate, COMPOUNDING_CYCLES.WEEKLY) +
          (farm.disabled ? 0 : dailyTradingFees * 7);
        let yearlyAPY = getAPY(periodicRate, COMPOUNDING_CYCLES.YEARLY);

        const compoundedFees = (1 + yearlyAPY / 100) * tradingFees;

        yearlyAPY += compoundedFees;

        const vaultData = vaultsData.get(account);

        const data = {
          uiConfigData,
          totalShares,
          totalDepositedBalance,
          mintAddress: allRaydiumVaults[index]?.base?.underlying_mint,
          sharesMint: allRaydiumVaults[index]?.base?.shares_mint,
          symbol: allRaydiumVaults[index]?.symbol,
          name: allRaydiumVaults[index]?.name,

          dailyAPR,

          // since we compound every 1hr, we need that rate
          weeklyAPY,
          yearlyAPY,
          yieldBreakdown: {
            dailyYield: periodicRate,
            weeklyYield: getAPY(periodicRate, COMPOUNDING_CYCLES.WEEKLY),
            yearlyYield:
              getAPY(periodicRate, COMPOUNDING_CYCLES.YEARLY) + compoundedFees,
            dailyTradingFees
          },
          coinInLp,
          pcInLp,
          price
        };

        vaultsData.set(account, assign({}, vaultData, data));
      }
      catch (e) {
        console.error({ e });
      }
    }

    // #endregion

    // #region - ORCA VAULTS
    for (const [index, orcaAccount] of orcaAccounts.entries()) {
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

      const mintAddress = allOrcaVaults[index]?.base?.underlying_mint;
      const vaultConfig = allOrcaVaults[index];

      const uiConfigData = getOrcaVaultByMintAddress(mintAddress) || {};

      const { getPair, getPrice } = getStore('PriceStore');

      const orcaPrice = getPrice(TOKENS.ORCA.symbol) || 0;
      const decodedGlobalFarm = GLOBAL_FARM_DATA_LAYOUT.decode(
        orcaGlobalFarmsInfo[index].account.data
      );

      let decodedGlobalFarmDd;
      const isDoubleDip = vaultConfig?.double_dip;

      if (isDoubleDip) {
        const currentIndex = doubleDipFarms.get(vaultConfig?.symbol);

        decodedGlobalFarmDd = GLOBAL_FARM_DATA_LAYOUT.decode(
          orcaGlobalFarmsDdInfo[currentIndex].account.data
        );
      }

      const decodedTokenData = MINT_LAYOUT.decode(
        orcaMintAddressesInfo[index].account.data
      );
      const uiAmount =
        decodedTokenData.supply / Math.pow(10, decodedTokenData.decimals);

      const decodedPoolCoinTokenAccountInfo = ACCOUNT_LAYOUT.decode(
        orcaPoolCoinTokenAccountsInfo[index].account.data
      );
      const decodedPoolPcTokenAccountInfo = ACCOUNT_LAYOUT.decode(
        orcaPoolPcTokenAccountsInfo[index].account.data
      );

      let price,
        poolCoinAmount,
        poolPCAmount,
        coinInLp,
        pcInLp,
        totalLiquidity,
        coinToPcRatio;

      if (uiConfigData.singleStake) {
        price = Number(getPrice(uiConfigData.symbol));
      }
      else {
        poolCoinAmount = new TokenAmount(
          decodedPoolCoinTokenAccountInfo.amount.toString(),
          uiConfigData.coin.decimals
        );
        poolPCAmount = new TokenAmount(
          decodedPoolPcTokenAccountInfo.amount.toString(),
          uiConfigData.pc.decimals
        );

        coinToPcRatio =
          Number(poolCoinAmount.fixed()) / Number(poolPCAmount.fixed());

        coinInLp = Number(poolCoinAmount.fixed()) / uiAmount;
        pcInLp = Number(poolPCAmount.fixed()) / uiAmount;

        if (uiConfigData.symbol === 'ORCA-USDC') {
          getStore('PriceStore').setTokenPrice(
            TOKENS.ORCA.symbol,
            poolPCAmount.wei.div(poolCoinAmount.wei).toNumber()
          );
        }

        price =
          coinInLp * Number(getPrice(uiConfigData.coin.symbol)) +
          pcInLp * Number(getPrice(uiConfigData.pc.symbol));
        totalLiquidity = price * uiAmount;
      }

      let periodicRateA = 0,
        periodicRateB = 0;

      periodicRateA = getOrcaPeriodRate(
        decodedGlobalFarm,
        totalLiquidity,
        uiConfigData.reward.decimals,
        orcaPrice
      );

      if (isDoubleDip) {
        const rewardBPrice = Number(getPrice(uiConfigData.rewardB.symbol)) || 0;

        periodicRateB = getOrcaPeriodRate(
          decodedGlobalFarmDd,
          totalLiquidity,
          uiConfigData.rewardB.decimals,
          rewardBPrice
        );
      }

      const periodicRate = periodicRateA + periodicRateB;

      const { apy: tradingFees = 0 } = getPair(mintAddress) || {};
      const dailyTradingFees = Number(tradingFees) / 365;

      const dailyAPR =
        periodicRate + (uiConfigData.disabled ? 0 : dailyTradingFees);

      // const weeklyAPY =
      //   getAPY(periodicRate, COMPOUNDING_CYCLES.WEEKLY) +
      //   (uiConfigData.disabled ? 0 : dailyTradingFees * 7);
      // const yearlyAPY =
      //   getAPY(periodicRate, COMPOUNDING_CYCLES.YEARLY) +
      //   (uiConfigData.disabled ? 0 : Number(tradingFees));

      const weeklyAPY =
        getAPY(periodicRate, COMPOUNDING_CYCLES.WEEKLY) +
        (uiConfigData.disabled ? 0 : dailyTradingFees * 7);
      let yearlyAPY = getAPY(periodicRate, COMPOUNDING_CYCLES.YEARLY);

      const compoundedFees = (1 + yearlyAPY / 100) * tradingFees;

      yearlyAPY += compoundedFees;

      // console.log({
      //   symbol: uiConfigData.symbol,
      //   orcaPrice: orcaPrice,
      //   poolCoinAmount: poolCoinAmount.fixed(),
      //   poolPCAmount: poolPCAmount.fixed(),
      //   coinToPcRatio,
      //   coinInLp: coinInLp + '',
      //   pcInLp: pcInLp + '',
      //   price: price,
      //   tradingFees,
      //   periodicRateA,
      //   periodicRateB,
      //   dailyAPR,
      //   weeklyAPY
      // });

      const vaultData = vaultsData.get(account);

      vaultsData.set(
        account,
        assign({}, vaultData, {
          uiConfigData,
          totalShares,
          totalDepositedBalance,
          mintAddress: allOrcaVaults[index]?.base?.underlying_mint,
          sharesMint: allOrcaVaults[index]?.base?.shares_mint,
          symbol: allOrcaVaults[index]?.symbol,
          name: allOrcaVaults[index]?.name,
          dailyAPR,
          weeklyAPY,
          yearlyAPY,
          yieldBreakdown: {
            dailyYield: periodicRate,
            weeklyYield: getAPY(periodicRate, COMPOUNDING_CYCLES.WEEKLY),
            yearlyYield: getAPY(periodicRate, COMPOUNDING_CYCLES.YEARLY),
            dailyTradingFees
          },
          coinInLp,
          pcInLp,
          coinToPcRatio,
          price
        })
      );
    }

    // #endregion

    // #region - TULIP VAULTS
    for (const [index, tulipAccount] of tulipAccounts.entries()) {
      try {
        const account = allTulipVaultAccounts[index];

        let decodedTulipAccountInfo = {};

        if (tulipAccount?.account?.data) {
          decodedTulipAccountInfo = program.coder.accounts.decode(
            'MultiDepositOptimizerV1',
            tulipAccount?.account?.data
          );
        }

        const { totalDepositedBalance, totalShares } =
          decodedTulipAccountInfo?.base || {};

        const mintAddress = allTulipVaults[index]?.base?.underlying_mint;

        const uiConfigData = getTulipVaultByMintAddress(mintAddress) || {};

        const vaultData = vaultsData.get(account);

        const standaloneVaults = transform(
          decodedTulipAccountInfo?.standaloneVaults,
          (vaults, { vaultAddress, depositedBalance }) => {
            vaults[vaultAddress] = { depositedBalance };

            return vaults;
          },
          {}
        );

        const { getPrice, getInterestRate } = getStore('PriceStore');
        const price = getPrice(uiConfigData.symbol);
        const interestRate = getInterestRate(uiConfigData.symbol);

        const standaloneVaultBalances = transform(
          standaloneVaults,
          (acc, vaultData, account) => {
            const vaultConfig = getLendingOptimizerVaultByAccount(account);

            if (vaultConfig) {
              const depositedBalance =
                (Number(vaultData.depositedBalance) || 0) /
                Math.pow(10, uiConfigData.decimals);
              const platform = TAG_TO_PLATFORM_MAP[vaultConfig.tag];

              acc.push({ platform, depositedBalance });
            }
          },
          []
        );

        const interestRatesWeightAverage = getWeightedAverage(
          standaloneVaultBalances.map((standaloneVaultDetails) => {
            return {
              weight: standaloneVaultDetails.depositedBalance,
              value:
                (!isEmpty(interestRate) &&
                  interestRate[standaloneVaultDetails.platform]) ||
                0
            };
          })
        );

        const dailyAPR = interestRatesWeightAverage / 365;
        const weeklyAPY = getAPY(dailyAPR, COMPOUNDING_CYCLES.WEEKLY);
        const yearlyAPY = getAPY(dailyAPR, COMPOUNDING_CYCLES.YEARLY);

        vaultsData.set(
          account,
          assign({}, vaultData, {
            mintAddress,
            uiConfigData,
            totalShares,
            totalDepositedBalance,
            standaloneVaults,
            sharesMint: allTulipVaults[index]?.base?.shares_mint,
            symbol: allTulipVaults[index]?.symbol,
            name: allTulipVaults[index]?.name,
            price,
            standaloneVaultBalances,
            dailyAPR,
            weeklyAPY,
            yearlyAPY
          })
        );
      }
      catch (e) {
        console.error({ e });
      }
    }

    // #endregion

    // #region - SABER VAULTS
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

        const { getPrice } =
          getStore('PriceStore');

        let coinPrice;
        let pcPrice;

        if (
          uiConfigData.pc.symbol === 'BTC' ||
          uiConfigData.pc.symbol === 'SOL' ||
          uiConfigData.pc.symbol === 'FTT' ||
          uiConfigData.pc.symbol === 'SRM'
        ) {
          coinPrice = Number(getPrice(uiConfigData.pc.symbol));
          pcPrice = coinPrice;
        }
        else {
          coinPrice = 1;
          pcPrice = coinPrice;
        }

        let saberPrice = getPrice('SABER');
        let sunnyPrice = getPrice('SUNNY');
        const totalDepositedBalanceInNumber = new anchor.BN(
          totalDepositedBalance?.toString()
        );

        const decodedSaberCoinTokenaccountInfo = ACCOUNT_LAYOUT.decode(
          saberVaultCoinTokenAccountsInfo[index].account.data
        );
        const decodedSaberPCTokenaccountInfo = ACCOUNT_LAYOUT.decode(
          saberVaultPCTokenAccountsInfo[index].account.data
        );

        const decodedTokenData = MINT_LAYOUT.decode(
          tokenSupplyForSaberVaults[index].account.data
        );

        const uiAmount =
          decodedTokenData.supply / Math.pow(10, decodedTokenData.decimals);

        const decodedTokenDataSunny = MINT_LAYOUT.decode(
          tokenSupplyForSunnyVaults[index].account.data
        );

        const uiAmountSunny =
          decodedTokenDataSunny.supply /
          Math.pow(10, decodedTokenData.decimals);

        let poolCoinAmount = new TokenAmount(0, uiConfigData.coin.decimals);
        let poolPCAmount = new TokenAmount(0, uiConfigData.pc.decimals);

        poolCoinAmount.wei = poolCoinAmount.wei.plus(
          decodedSaberCoinTokenaccountInfo.amount.toString()
        );

        poolPCAmount.wei = poolPCAmount.wei.plus(
          decodedSaberPCTokenaccountInfo.amount.toString()
        );

        const price =
          (Number(poolCoinAmount.fixed()) * coinPrice +
            Number(poolPCAmount.fixed()) * pcPrice) /
          uiAmount;

        const tvl =
          (totalDepositedBalanceInNumber * price) /
          Math.pow(10, uiConfigData.decimals);

        const totalLiquidity =
          Number(poolCoinAmount.fixed() * coinPrice) +
          Number(poolPCAmount.fixed()) * pcPrice;

        const totalLiquiditySunny = uiAmountSunny * price;

        const periodicRateSaber =
          (uiConfigData.totalSBREmission * 0.84 * Number(saberPrice) * 100) /
          totalLiquidity;

        const periodicRateSunny =
          (uiConfigData.totalSunnyEmission * Number(sunnyPrice) * 105) /
          totalLiquiditySunny;
        const periodicRate = periodicRateSaber + periodicRateSunny;

        // @TODO: Should we fix it for v2 around the compoundedFees? Check with @ssj
        // const compoundedFees = (1 + yearlyAPY / 100) * tradingFees;

        // yearlyAPY = yearlyAPY + compoundedFees;

        const vaultData = vaultsData.get(account);

        const data = {
          uiConfigData,
          totalShares,
          totalDepositedBalance,
          mintAddress: allSaberVaults[index]?.base?.underlying_mint,
          sharesMint: allSaberVaults[index]?.base?.shares_mint,
          symbol: allSaberVaults[index]?.symbol,
          name: allSaberVaults[index]?.name,

          dailyAPR: periodicRate,

          // since we compound every 1hr, we need that rate
          weeklyAPY: getAPY(periodicRate, COMPOUNDING_CYCLES.WEEKLY),
          yearlyAPY: getAPY(periodicRate, COMPOUNDING_CYCLES.YEARLY),

          // yieldBreakdown: {
          //   dailyYield: periodicRate,
          //   weeklyYield: getAPY(periodicRate, COMPOUNDING_CYCLES.WEEKLY),
          //   yearlyYield: getAPY(periodicRate, COMPOUNDING_CYCLES.YEARLY) + compoundedFees,
          //   dailyTradingFees
          // },

          tvl,
          price
        };

        vaultsData.set(account, assign({}, vaultData, data));
      }
      catch (e) {
        console.error({ e });
      }
    }

    // #endregion

    getStore('VaultStore').add(Array.from(vaultsData.values()));

    // eslint-disable-next-line no-console
    console.info('Refresh complete');
  },

  async updateBalanceForVaults () {
    if (getStore('VaultStore').isRefreshingVaultsData) {
      console.warn('Bailed out refresh since already in progress');

      return;
    }

    // Update all vaults data
    this.updateVaults();

    getStore('VaultStore').setRefreshingVaultsData(true);

    // eslint-disable-next-line no-console
    console.info('Refreshing user data for vaults');

    const { wallet } = getStore('WalletStore'),
      provider = new anchor.Provider(window.$web3, wallet, {
        skipPreflight: false,
        preflightCommitment: commitment
      });

    anchor.setProvider(provider);

    // Generate the program client from IDL.
    const programId = new anchor.web3.PublicKey(getVaultV2ProgramId());
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

    const orcaEphemeralTrackingAccounts = await Promise.all(
      orcaVaultAccountPublicKeys.map(async (account) => {
        const [ephemeralTrackingAccount] = await deriveEphemeralTrackingAddress(
          account,
          provider.wallet.publicKey,
          programId
        );

        return ephemeralTrackingAccount;
      })
    );

    const tulipRebalanceStateTransitionAccounts = allTulipVaults.map(
      (vault) => {
        return new anchor.web3.PublicKey(vault.rebalance_state_transition);
      }
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
      orcaEphemeralTrackingAccounts,

      tulipDepositTrackingAccounts,
      tulipVaultAccountPublicKeys,
      tulipRebalanceStateTransitionAccounts,

      // Saber vaults
      saberVaultAccountPublicKeys,
      saberDepositTrackingAccounts
    ];

    const [
      raydiumUserBalanceAccounts,
      raydiumAccounts,

      orcaUserBalanceAccounts,
      orcaAccounts,
      orcaEphemeralTrackingData,

      tulipUserBalanceAccounts,
      tulipAccounts,
      tulipRebalanceStateTransitionAccountsInfo,

      saberAccounts,
      saberUserBalanceAccounts
    ] = await getMultipleAccountsGrouped(window.$web3, publicKeys, commitment);

    // This will store all the data for the vaults and used to update the VaultStore
    const vaultsData = new Map();

    [
      ...allRaydiumVaultAccounts,
      ...allOrcaVaultAccounts,
      ...allTulipVaultAccounts,
      ...allSaberVaultAccounts
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

    // Load ephemeral account data
    for (const [
      index,
      ephemeralAccount
    ] of orcaEphemeralTrackingData.entries()) {
      const account = allOrcaVaultAccounts[index];

      let decodedInfo = {};

      if (orcaEphemeralTrackingData[index]) {
        decodedInfo = program?.coder?.accounts?.decode(
          'EphemeralTrackingV1',
          ephemeralAccount?.account?.data
        );
      }

      const vaultData = vaultsData.get(account);

      vaultsData.set(
        account,
        assign({}, vaultData, {
          ephemeralAccount: pick(
            decodedInfo,
            OrcaVaultService.EPHEMERAL_REQUIRED_PROPS
          )
        })
      );
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

    // #region - TULIP VAULTS
    for (const [
      index,
      userBalanceAccount
    ] of tulipUserBalanceAccounts.entries()) {
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
          decodedTulipAccountInfo = program.coder.accounts.decode(
            'MultiDepositOptimizerV1',
            tulipAccount?.account?.data
          );
        }

        const { totalDepositedBalance, totalShares } =
          decodedTulipAccountInfo?.base || {};

        const tulipVaultData =
          getTulipVaultBySymbol(vaultsData.get(account)?.symbol) || {};

        const shares = vaultsData.get(account)?.shares;

        let depositedAmount = getDepositedAmountForShares({
          totalDepositedBalance,
          totalShares,
          sharesBalance: shares,
          decimals: tulipVaultData?.decimals
        });

        const standaloneVaults = transform(
          decodedTulipAccountInfo?.standaloneVaults,
          (vaults, { vaultAddress, depositedBalance }) => {
            vaults[vaultAddress] = { depositedBalance };

            return vaults;
          },
          {}
        );

        const vaultData = vaultsData.get(account);

        vaultsData.set(
          account,
          assign({}, vaultData, {
            uiConfigData: tulipVaultData,
            totalShares,
            totalDepositedBalance,
            deposited: depositedAmount,
            standaloneVaults
          })
        );
      }
      catch (e) {
        console.error({ e });
      }
    }

    for (const [
      index,
      rebalanceStateTransitionAccount
    ] of tulipRebalanceStateTransitionAccountsInfo.entries()) {
      try {
        const account = allTulipVaultAccounts[index];

        let decodedRebalanceAccountInfo = {};

        if (rebalanceStateTransitionAccount?.account?.data) {
          decodedRebalanceAccountInfo = program.coder.accounts.decode(
            'RebalanceStateTransitionV1',
            rebalanceStateTransitionAccount?.account?.data
          );
        }

        const state =
          Object.keys(decodedRebalanceAccountInfo?.state || {})[0] ||
          REBALANCE_STATES.INACTIVE;

        const vaultData = vaultsData.get(account);

        vaultsData.set(
          account,
          assign({}, vaultData, {
            rebalanceState: toLower(state)
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

    getStore('VaultStore').setRefreshingVaultsData(false);
    getStore('VaultStore').add(Array.from(vaultsData.values()));

    // eslint-disable-next-line no-console
    console.info('Refresh complete');
  }
};
