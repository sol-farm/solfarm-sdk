import { TOKENS } from './tokens';
import { FARM_PLATFORMS } from './farmConstants';

export const TULIP_VAULTS = [
  {
    symbol: 'USDC',
    name: 'USDC',
    reward: { ...TOKENS.USDC },
    rewardB: { ...TOKENS.USDC },
    mintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: TOKENS.USDC.decimals,
    singleStake: true,
    platform: FARM_PLATFORMS.TULIP,
    coins: [TOKENS.USDC, TOKENS.USDC],
    tags: [],
    tag: 'usdcv1'
  },
  {
    symbol: 'RAY',
    name: 'RAY',
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.RAY },
    mintAddress: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    decimals: TOKENS.RAY.decimals,
    singleStake: true,
    platform: FARM_PLATFORMS.TULIP,
    coins: [TOKENS.RAY, TOKENS.RAY],
    tag: 'rayv1'
  },
  {
    symbol: 'USDT',
    name: 'USDT',
    reward: { ...TOKENS.USDT },
    rewardB: { ...TOKENS.USDT },

    mintAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    decimals: TOKENS.USDT.decimals,
    singleStake: true,
    platform: FARM_PLATFORMS.TULIP,
    coins: [TOKENS.USDT, TOKENS.USDT],
    tag: 'usdtv1'
  },
  {
    symbol: 'SOL',
    name: 'SOL',
    reward: { ...TOKENS.SOL },
    rewardB: { ...TOKENS.SOL },

    mintAddress: 'So11111111111111111111111111111111111111112',
    decimals: TOKENS.SOL.decimals,
    singleStake: true,
    platform: FARM_PLATFORMS.TULIP,
    coins: [TOKENS.SOL, TOKENS.SOL],
    tags: [],
    tag: 'solv1'
  }
];
