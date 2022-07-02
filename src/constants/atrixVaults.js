import { TOKENS } from './tokens';

// Empty Logo to fill up space
import { FARM_PLATFORMS } from '../constants/farmConstants';

export const ATRIX_VAULTS = [
  {
    symbol: 'USDr-USDC',
    name: 'USDr-USDC',
    coin: { ...TOKENS.USDr },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.SRM },
    rewardB: { ...TOKENS.SRM },

    mintAddress: 'HKx72DDVoUa1QPb7oqRs4b361TEYoiENxmJJm91Agq8W',
    decimals: TOKENS.SRM.decimals,
    dualYield: false,
    liquidityMining: true,
    saber: false,
    platform: FARM_PLATFORMS.ATRIX,
    coins: [TOKENS.USDr, TOKENS.USDC],
    marginIndex: 999999,
    slippageWarning: false,
    maxPositionLimitInUsd: 0,
    link: 'https://app.atrix.finance/liquidity/7V7igBALu1xyu4ZkXfuS6LnfkZ1aA6DKBx55ouA6Jhbm/deposit',
    rewardEndSlot: 93847628,
    tags: []
  },
  {
    symbol: 'SOL-USDC',
    name: 'SOL-USDC',
    coin: { ...TOKENS.SOL },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.SRM },
    rewardB: { ...TOKENS.SRM },

    mintAddress: 'Gm6HMqHw42TkjTF6ueq8Y6cBD4U17EnNhuSA2UY8Ah7r',
    decimals: TOKENS.SRM.decimals,
    dualYield: false,
    liquidityMining: true,
    saber: false,
    platform: FARM_PLATFORMS.ATRIX,
    coins: [TOKENS.SOL, TOKENS.USDC],
    marginIndex: 11,
    slippageWarning: false,
    maxPositionLimitInUsd: 9000000,
    link: 'https://app.atrix.finance/liquidity/8YnCv62yA1WXuReeYqBFjT7DZBH2A8uJt5HfHPfR7wtK/deposit',
    rewardEndSlot: 93847628,
    tags: []
  }
];
