import { TOKENS } from './tokens';

import { FARM_PLATFORMS } from './farms';

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
  }
];
