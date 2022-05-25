import { NATIVE_SOL, TOKENS } from './tokens';

export const FARMS = [
  {
    symbol: 'SVT-USDC',
    name: 'SVT-USDC LP',
    coin: { ...TOKENS.SVT },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SVT },

    mintAddress: 'HXLkojxGWSUwjagzRXMFRgmnNxkcKrFHvq4ZCZeNvBJL',
    decimals: TOKENS.SVT.decimals,
    coins: [TOKENS.SVT, TOKENS.USDC]
  },
  {
    symbol: 'SLC-USDC',
    name: 'SLC-USDC LP',
    coin: { ...TOKENS.SLC },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SLC },

    mintAddress: '4A3kqZBJu581eFePXL1dTLfxEkjZPWJFgj4tJmP6mQQp',
    decimals: TOKENS.SLC.decimals,
    coins: [TOKENS.SLC, TOKENS.USDC]
  },
  {
    symbol: 'MBS-USDC',
    name: 'MBS-USDC LP',
    coin: { ...TOKENS.MBS },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.MBS },

    mintAddress: 'BAgSWaPZpsQKyZJdvB5KyvmCNj6hzczzentt5FhDCVHb',
    decimals: TOKENS.MBS.decimals,
    coins: [TOKENS.MBS, TOKENS.USDC]
  },
  {
    symbol: 'PRISM-USDC',
    name: 'PRISM-USDC LP',
    coin: { ...TOKENS.PRISM },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.PRISM },

    mintAddress: '3baYkTcudvSFMe25UpZcBfdp4FA5kL2E4pfaeJ8AiYJB',
    decimals: TOKENS.PRISM.decimals,
    coins: [TOKENS.PRISM, TOKENS.USDC]
  },
  {
    symbol: 'CHICKS-USDC',
    name: 'CHICKS-USDC LP',
    coin: { ...TOKENS.CHICKS },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.CHICKS },

    mintAddress: 'CPzmcw81a6PDasSXhVLfDRKuTJXZPUqocS9VFf5zCFhs',
    decimals: TOKENS.CHICKS.decimals,
    coins: [TOKENS.CHICKS, TOKENS.USDC]
  },
  {
    symbol: 'MEAN-RAY',
    name: 'MEAN-RAY LP',
    coin: { ...TOKENS.MEAN },
    pc: { ...TOKENS.RAY },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.MEAN },

    mintAddress: 'H9wUyrxpAErmdNVPitpHSXgwoomoh91ggJKPWtQQoCn1',
    decimals: TOKENS.MEAN.decimals,
    coins: [TOKENS.MEAN, TOKENS.RAY]
  },
  {
    symbol: 'REAL-USDC',
    name: 'REAL-USDC LP',
    coin: { ...TOKENS.REAL },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.REAL },

    mintAddress: 'EN43tp8xdkcM8RYSJ4msFHMPTJRXKhUteVYBDJLwTvr3',
    decimals: TOKENS.REAL.decimals,
    coins: [TOKENS.REAL, TOKENS.USDC]
  },
  {
    symbol: 'CRWNY-USDC',
    name: 'CRWNY-USDC LP',
    coin: { ...TOKENS.CRWNY },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.CRWNY },

    mintAddress: 'H3D9Gyi4frRLW6bS9vBthDVDJyzyRJ6XhhpP6PJGWaDC',
    decimals: TOKENS.CRWNY.decimals,
    coins: [TOKENS.CRWNY, TOKENS.USDC]
  },
  {
    symbol: 'CRWNY-RAY',
    name: 'CRWNY-RAY LP',
    coin: { ...TOKENS.CRWNY },
    pc: { ...TOKENS.RAY },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.CRWNY },

    mintAddress: '5Cz9wGStNjiUg81q8t6sJJeckuT2C14CYSfyQbtYirSX',
    decimals: TOKENS.CRWNY.decimals,
    coins: [TOKENS.CRWNY, TOKENS.RAY]
  },
  {
    symbol: 'RUN-USDC',
    name: 'RUN-USDC LP',
    coin: { ...TOKENS.RUN },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.RUN },

    mintAddress: 'CjTLvvKSQdEujcSzeZRYgk4w1DpuXBbMppLHaxZyz11Y',
    decimals: TOKENS.RUN.decimals,
    coins: [TOKENS.RUN, TOKENS.USDC]
  },
  {
    symbol: 'TTT-USDC',
    name: 'TTT-USDC LP',
    coin: { ...TOKENS.TTT },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.TTT },

    mintAddress: '84fmrerHGohoRf4iLPDQ1KG4CjSjCRksYWGzjWfCRM8a',
    decimals: TOKENS.TTT.decimals,
    coins: [TOKENS.TTT, TOKENS.USDC]
  },
  {
    symbol: 'BOKU-USDC',
    name: 'BOKU-USDC LP',
    coin: { ...TOKENS.BOKU },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.BOKU },

    mintAddress: '8jjQn5Yagb6Nm2WGAxPW1bcGqrTWpg5adf6QukXEarcP',
    decimals: TOKENS.BOKU.decimals,
    coins: [TOKENS.BOKU, TOKENS.USDC]
  },
  {
    symbol: 'XTAG-USDC',
    name: 'XTAG-USDC LP',
    coin: { ...TOKENS.XTAG },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.XTAG },

    mintAddress: 'GCEQbLg4ik5YJ4CMcbtuVqEc4sjLdSGy34rFk1CtGjdg',
    decimals: TOKENS.XTAG.decimals,
    coins: [TOKENS.XTAG, TOKENS.USDC]
  },
  {
    symbol: 'SRM-USDC',
    name: 'SRM-USDC LP',
    coin: { ...TOKENS.SRM },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SRM },

    mintAddress: '9XnZd82j34KxNLgQfz29jGbYdxsYznTWRpvZE3SRE7JG',
    decimals: TOKENS.SRM.decimals,
    dualYield: false,
    liquidityMining: false,
    totalTulipEmission: 0,
    coins: [TOKENS.SRM, TOKENS.USDC]
  },
  {
    symbol: 'SOL-USDT-RAY',
    name: 'SOL-USDT LP',
    coin: { ...NATIVE_SOL },
    pc: { ...TOKENS.USDT },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SRM },

    mintAddress: 'Epm4KfTj4DMrvqn6Bwg2Tr2N8vhQuNbuK8bESFp4k33K',
    decimals: NATIVE_SOL.decimals,
    coins: [NATIVE_SOL, TOKENS.USDT]
  },
  {
    symbol: 'SOL-USDC-RAY',
    name: 'SOL-USDC LP',
    coin: { ...NATIVE_SOL },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SRM },

    mintAddress: '8HoQnePLqPj4M7PUDzfw8e3Ymdwgc7NLGnaTUapubyvu',
    decimals: NATIVE_SOL.decimals,
    coins: [NATIVE_SOL, TOKENS.USDC]
  },
  {
    symbol: 'wbWBNB-USDC',
    name: 'wbWBNB-USDC LP',
    coin: { ...TOKENS.wbWBNB },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SRM },

    mintAddress: 'FEsEfEJJSfiMQcshUgZ5UigfytfGRQ3z5puyF6DXDp9C',
    decimals: TOKENS.wbWBNB.decimals,
    coins: [TOKENS.wbWBNB, TOKENS.USDC]
  },
  {
    symbol: 'MIMO-SOL',
    name: 'MIMO-SOL LP',
    coin: { ...TOKENS.MIMO },
    pc: { ...NATIVE_SOL },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.MIMO },

    mintAddress: 'HUJ1opSk8AiPfDT47r7n4hTiK2EXgrR3Msy7T8q1BywS',
    decimals: TOKENS.MIMO.decimals,
    coins: [TOKENS.MIMO, NATIVE_SOL]
  },
  // {
  //   symbol: 'wePEOPLE-USDC',
  //   name: 'wePEOPLE-USDC LP',
  //   coin: { ...TOKENS.wePEOPLE },
  //   pc: { ...TOKENS.USDC },
  //   reward: { ...TOKENS.RAY },
  //   rewardB: { ...TOKENS.SRM },
  //
  //   mintAddress: '3e5ZCKi4etorpV4pv1fSckP5iJD67xcUkx3RtFCZhbzD',
  //   decimals: TOKENS.wePEOPLE.decimals,
  //   logos: [wePEOPLELogo, usdcLogo],
  //   dualYield: false,
  //   liquidityMining: false,
  //   totalTulipEmission: 0,
  //   saber: false,
  //   coins: [TOKENS.wePEOPLE, TOKENS.USDC],
  //   marginIndex: 11111,
  //   slippageWarning: false,
  //   maxPositionLimitInUsd: 90000000,
  //   link: 'https://raydium.io/liquidity/?ammId=GfvqUB36CPfqZDz5ntQ2YsoKRwg1MCewmurhc7jw3P5s',
  //   rewardEndSlot: 93847628,
  //   platform: FARM_PLATFORMS.RAYDIUM,
  //   isNew: isFarmNew('04/12/2021'),
  //   tags: [],
  // },
  {
    symbol: 'DFL-USDC',
    name: 'DFL-USDC LP',
    coin: { ...TOKENS.DFL },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.DFL },

    mintAddress: 'Fffijd6UVJdQeLVXhenS8YcsnMUdWJqpbBeH42LFkXgS',
    decimals: TOKENS.DFL.decimals,
    coins: [TOKENS.DFL, TOKENS.USDC]
  },
  {
    symbol: 'APT-USDC',
    name: 'APT-USDC LP',
    coin: { ...TOKENS.APT },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.APT },

    mintAddress: 'Hk8mDAJFq4E9kF3DtNgPFwzbo5kbeiusNFJgWmo3LoQ5',
    decimals: TOKENS.APT.decimals,
    coins: [TOKENS.APT, TOKENS.USDC]
  },
  {
    symbol: 'SHILL-USDC',
    name: 'SHILL-USDC LP',
    coin: { ...TOKENS.SHILL },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SHILL },

    mintAddress: 'CnUhYBtQEbSBZ76bgxAouVCTCb8rofZzwerVF5z5LREJ',
    decimals: TOKENS.SHILL.decimals,
    coins: [TOKENS.SHILL, TOKENS.USDC]
  },
  {
    symbol: 'SONAR-USDC',
    name: 'SONAR-USDC LP',
    coin: { ...TOKENS.SONAR },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SONAR },

    mintAddress: '2tAcfqJ1YYjpGLqwh76kyNt9VaNFDd4fJySfH6SmWfKt',
    decimals: TOKENS.SONAR.decimals,
    coins: [TOKENS.SONAR, TOKENS.USDC]
  },
  {
    symbol: 'CWAR-USDC',
    name: 'CWAR-USDC LP',
    coin: { ...TOKENS.CWAR },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.CWAR },

    mintAddress: 'HjR23bxn2gtRDB2P1Tm3DLepAPPZgazsWJpLG9wqjnYR',
    decimals: TOKENS.CWAR.decimals,
    link: 'https://raydium.io/liquidity/?ammId=13uCPybNakXHGVd2DDVB7o2uwXuf9GqPFkvJMVgKy6UJ'
  },
  {
    symbol: 'GENE-USDC',
    name: 'GENE-USDC LP',
    coin: { ...TOKENS.GENE },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.GENE },

    mintAddress: '7GKvfHEXenNiWYbJBKae89mdaMPr5gGMYwZmyC8gBNVG',
    decimals: TOKENS.GENE.decimals,
    coins: [TOKENS.GENE, TOKENS.USDC]
  },
  {
    symbol: 'GENE-RAY',
    name: 'GENE-RAY LP',
    coin: { ...TOKENS.GENE },
    pc: { ...TOKENS.RAY },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.GENE },

    mintAddress: '3HzXnc1qZ8mGqun18Ck3KA616XnZNqF1RWbgYE2nGRMA',
    decimals: TOKENS.GENE.decimals,
    link: 'https://raydium.io/liquidity/?ammId=8FrCybrh7UFznP1hVHg8kXZ8bhii37c7BGzmjkdcsGJp'
  },
  {
    symbol: 'weMANA-USDC',
    name: 'weMANA-USDC LP',
    coin: { ...TOKENS.weMANA },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SRM },

    mintAddress: 'HpUkVAPRJ5zNRuJ1ZwMXEhbMHL3gSuPb2QuSER9YUd3a',
    decimals: TOKENS.weMANA.decimals,
    coins: [TOKENS.weMANA, TOKENS.USDC]
  },
  {
    symbol: 'weSAND-USDC',
    name: 'weSAND-USDC LP',
    coin: { ...TOKENS.weSAND },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SRM },

    mintAddress: '3dADrQa7utyiCsaFeVk9r7oebW1WheowhKo5soBYKBVT',
    decimals: TOKENS.weSAND.decimals,
    coins: [TOKENS.weSAND, TOKENS.USDC]
  },
  {
    symbol: 'CAVE-USDC',
    name: 'CAVE-USDC LP',
    coin: { ...TOKENS.CAVE },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.CAVE },

    mintAddress: '5Gba1k3fU7Vh7UtAiBmie9vhQNNq1JfEwgn1DPGZ7NKQ',
    decimals: TOKENS.CAVE.decimals,
    coins: [TOKENS.CAVE, TOKENS.USDC]
  },
  {
    symbol: 'weAXS-USDC',
    name: 'weAXS-USDC LP',
    coin: { ...TOKENS.weAXS },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SRM },

    mintAddress: '6PSoJQ7myQ1BJtbQC6oiWR8HSecQGyoWsPYTZRJo2ci3',
    coins: [TOKENS.weAXS, TOKENS.USDC]
  },
  {
    symbol: 'weDYDX-USDC',
    name: 'weDYDX-USDC LP',
    coin: { ...TOKENS.weDYDX },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SRM },

    mintAddress: 'BjkkMZnnzmgLqzGErzDbkk15ozv48iVKQuunpeM2Hqnk',
    decimals: TOKENS.weDYDX.decimals,
    coins: [TOKENS.weDYDX, TOKENS.USDC]
  },
  {
    symbol: 'weSHIB-USDC',
    name: 'weSHIB-USDC LP',
    coin: { ...TOKENS.weSHIB },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SRM },

    mintAddress: 'AcjX5pmTMGSgxkdxc3r82r6WMKBvS6eQXXFz5ck5KKUa',
    decimals: TOKENS.weSHIB.decimals,
    coins: [TOKENS.weSHIB, TOKENS.USDC]
  },
  {
    symbol: 'STARS-USDC',
    name: 'STARS-USDC LP',
    coin: { ...TOKENS.STARS },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.STARS },

    mintAddress: 'FJ68q7NChhETcGVdinMbM2FF1Cy79dpmUi6HC83K55Hv',
    decimals: TOKENS.STARS.decimals,
    coins: [TOKENS.STARS, TOKENS.USDC]
  },
  {
    symbol: 'weSUSHI-USDC',
    name: 'weSUSHI-USDC LP',
    coin: { ...TOKENS.weSUSHI },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SRM },

    mintAddress: '3wVrtQZsiDNp5yTPyfEzQHPU6iuJoMmpnWg6CTt4V8sR',
    decimals: TOKENS.weSUSHI.decimals,
    coins: [TOKENS.weSUSHI, TOKENS.USDC]
  },
  {
    symbol: 'weUNI-USDC',
    name: 'weUNI-USDC LP',
    coin: { ...TOKENS.weUNI },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SRM },

    mintAddress: 'EEC4QnT41py39QaYnzQnoYQEtDUDNa6Se8SBDgfPSN2a',
    decimals: TOKENS.weSUSHI.decimals,
    coins: [TOKENS.weUNI, TOKENS.USDC]
  },
  {
    symbol: 'whETH-USDC',
    name: 'whETH-USDC LP',
    coin: { ...TOKENS.whETH },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SRM },

    mintAddress: '3529SBnMCDW3S3xQ52aABbRHo7PcHvpQA4no8J12L5eK',
    decimals: TOKENS.whETH.decimals,
    coins: [TOKENS.whETH, TOKENS.USDC]
  },
  {
    symbol: 'whETH-SOL',
    name: 'whETH-SOL LP',
    coin: { ...TOKENS.whETH },
    pc: { ...NATIVE_SOL },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SRM },

    mintAddress: '3hbozt2Por7bcrGod8N7kEeJNMocFFjCJrQR16TQGBrE',
    decimals: TOKENS.whETH.decimals,
    coins: [TOKENS.whETH, NATIVE_SOL]
  },
  {
    symbol: 'FRKT-SOL',
    name: 'FRKT-SOL LP',
    coin: { ...TOKENS.FRKT },
    pc: { ...NATIVE_SOL },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.FRKT },

    mintAddress: 'HYUKXgpjaxMXHttyrFYtv3z2rdhZ1U9QDH8zEc8BooQC',
    decimals: TOKENS.FRKT.decimals,
    coins: [TOKENS.FRKT, NATIVE_SOL]
  },
  {
    symbol: 'WOOF-RAY',
    name: 'WOOF-RAY LP',
    coin: { ...TOKENS.WOOF },
    pc: { ...TOKENS.RAY },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.WOOF },

    mintAddress: 'H2FAnazDaGFutcmnrwDxhmdncR1Bd7GG4mhPCSUiamDX',
    decimals: TOKENS.WOOF.decimals,
    coins: [TOKENS.WOOF, TOKENS.RAY]
  },
  {
    symbol: 'SYP-USDC',
    name: 'SYP-USDC LP',
    coin: { ...TOKENS.SYP },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SYP },

    mintAddress: '2xJGuLAivAR1WkARRA6zP1v4jaA9jV2Qis8JfMNvrVyZ',
    decimals: TOKENS.SYP.decimals,
    coins: [TOKENS.SYP, TOKENS.USDC]
  },
  {
    symbol: 'SYP-RAY',
    name: 'SYP-RAY LP',
    coin: { ...TOKENS.SYP },
    pc: { ...TOKENS.RAY },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SYP },

    mintAddress: 'FT2KZqxxM8F2h9pZtTF4PyjK88bM4YbuBzd7ZPwQ5wMB',
    decimals: TOKENS.SYP.decimals,
    coins: [TOKENS.SYP, TOKENS.RAY]
  },
  {
    symbol: 'SYP-SOL',
    name: 'SYP-SOL LP',
    coin: { ...TOKENS.SYP },
    pc: { ...NATIVE_SOL },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SYP },

    mintAddress: 'KHV6dfj2bDntzJ9z1S26cDfqWfUZdJRFmteLR6LxHwW',
    decimals: TOKENS.SYP.decimals,
    coins: [TOKENS.SYP, NATIVE_SOL]
  },
  {
    symbol: 'LIQ-USDC',
    name: 'LIQ-USDC LP',
    coin: { ...TOKENS.LIQ },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.LIQ },

    mintAddress: 'GWpD3eTfhJB5KDCcnE85dBQrjAk2CsrgDF9b52R9CrjV',
    decimals: TOKENS.LIQ.decimals,
    coins: [TOKENS.LIQ, TOKENS.USDC]
  },
  {
    symbol: 'LIQ-RAY',
    name: 'LIQ-RAY LP',
    coin: { ...TOKENS.LIQ },
    pc: { ...TOKENS.RAY },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.LIQ },

    mintAddress: '49YUsDrThJosHSagCn1F59Uc9NRxbr9thVrZikUnQDXy',
    decimals: TOKENS.LIQ.decimals,
    coins: [TOKENS.LIQ, TOKENS.RAY]
  },
  {
    symbol: 'MNDE-mSOL',
    name: 'MNDE-mSOL LP',
    coin: { ...TOKENS.MNDE },
    pc: { ...TOKENS.MSOLRAYDIUM },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.MNDE },

    mintAddress: '4bh8XCzTHSbqbWN8o1Jn4ueBdz1LvJFoEasN6K6CQ8Ny',
    decimals: TOKENS.MNDE.decimals,
    coins: [TOKENS.MNDE, TOKENS.MSOLRAYDIUM]
  },
  {
    symbol: 'mSOL-USDC',
    name: 'mSOL-USDC LP',
    coin: { ...TOKENS.MSOLRAYDIUM },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.MNDE },

    mintAddress: '4xTpJ4p76bAeggXoYywpCCNKfJspbuRzZ79R7pRhbqSf',
    decimals: TOKENS.MNDE.decimals,
    coins: [TOKENS.MSOLRAYDIUM, TOKENS.USDC]
  },
  {
    symbol: 'mSOL-USDT',
    name: 'mSOL-USDT LP',
    coin: { ...TOKENS.MSOLRAYDIUM },
    pc: { ...TOKENS.USDT },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.MNDE },

    mintAddress: '69NCmEW9mGpiWLjAcAWHq51k4ionJZmzgRfRT3wQaCCf',
    decimals: TOKENS.MNDE.decimals,
    coins: [TOKENS.MSOLRAYDIUM, TOKENS.USDT]
  },
  {
    symbol: 'mSOL-RAY',
    name: 'mSOL-RAY LP',
    coin: { ...TOKENS.MSOLRAYDIUM },
    pc: { ...TOKENS.RAY },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.MNDE },

    mintAddress: 'De2EHBAdkgfc72DpShqDGG42cV3iDWh8wvvZdPsiEcqP',
    decimals: TOKENS.MNDE.decimals,
    coins: [TOKENS.MSOLRAYDIUM, TOKENS.RAY]
  },
  {
    symbol: 'ETH-mSOL',
    name: 'ETH-mSOL LP',
    coin: { ...TOKENS.ETH },
    pc: { ...TOKENS.MSOLRAYDIUM },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.MNDE },

    mintAddress: 'HYv3grQfi8QbV7nG7EFgNK1aJSrsJ7HynXJKJVPLL2Uh',
    decimals: TOKENS.ETH.decimals,
    coins: [TOKENS.ETH, TOKENS.MSOLRAYDIUM]
  },
  {
    symbol: 'BTC-mSOL',
    name: 'BTC-mSOL LP',
    coin: { ...TOKENS.BTC },
    pc: { ...TOKENS.MSOLRAYDIUM },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.MNDE },

    mintAddress: '92bcERNtUmuaJ6mwLSxYHZYSph37jdKxRdoYNxpcYNPp',
    decimals: TOKENS.BTC.decimals,
    coins: [TOKENS.BTC, TOKENS.MSOLRAYDIUM]
  },
  {
    symbol: 'LARIX-RAY',
    name: 'LARIX-RAY LP',
    coin: { ...TOKENS.LARIX },
    pc: { ...TOKENS.RAY },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.LARIX },

    mintAddress: 'ZRDfSLgWGeaYSmhdPvFNKQQhDcYdZQaue2N8YDmHX4q',
    decimals: TOKENS.LARIX.decimals,
    coins: [TOKENS.LARIX, TOKENS.RAY]
  },
  {
    symbol: 'LARIX-USDC',
    name: 'LARIX-USDC LP',
    coin: { ...TOKENS.LARIX },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.LARIX },

    mintAddress: '7yieit4YsNsZ9CAK8H5ZEMvvk35kPEHHeXwp6naoWU9V',
    decimals: TOKENS.LARIX.decimals,
    coins: [TOKENS.LARIX, TOKENS.USDC]
  },
  {
    symbol: 'GRAPE-USDC',
    name: 'GRAPE-USDC LP',
    coin: { ...TOKENS.GRAPE },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.GRAPE },

    mintAddress: 'A8ZYmnZ1vwxUa4wpJVUaJgegsuTEz5TKy5CiJXffvmpt',
    decimals: TOKENS.GRAPE.decimals,
    coins: [TOKENS.GRAPE, TOKENS.USDC]
  },
  {
    symbol: 'ATLAS-USDC',
    name: 'ATLAS-USDC LP',
    coin: { ...TOKENS.ATLAS },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.ATLAS },

    mintAddress: '9shGU9f1EsxAbiR567MYZ78WUiS6ZNCYbHe53WUULQ7n',
    decimals: TOKENS.ATLAS.decimals,
    coins: [TOKENS.ATLAS, TOKENS.USDC]
  },
  {
    symbol: 'POLIS-USDC',
    name: 'POLIS-USDC LP',
    coin: { ...TOKENS.POLIS },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.POLIS },

    mintAddress: '8MbKSBpyXs8fVneKgt71jfHrn5SWtX8n4wMLpiVfF9So',
    decimals: TOKENS.POLIS.decimals,
    coins: [TOKENS.POLIS, TOKENS.USDC]
  },
  {
    symbol: 'ATLAS-RAY',
    name: 'ATLAS-RAY LP',
    coin: { ...TOKENS.ATLAS },
    pc: { ...TOKENS.RAY },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.ATLAS },

    mintAddress: '418MFhkaYQtbn529wmjLLqL6uKxDz7j4eZBaV1cobkyd',
    decimals: TOKENS.ATLAS.decimals,
    coins: [TOKENS.ATLAS, TOKENS.RAY]
  },
  {
    symbol: 'POLIS-RAY',
    name: 'POLIS-RAY LP',
    coin: { ...TOKENS.POLIS },
    pc: { ...TOKENS.RAY },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.POLIS },

    mintAddress: '9ysGKUH6WqzjQEUT4dxqYCUaFNVK9QFEa24pGzjFq8xg',
    decimals: TOKENS.POLIS.decimals,
    coins: [TOKENS.POLIS, TOKENS.RAY]
  },
  {
    symbol: 'TULIP-USDC',
    name: 'TULIP-USDC LP',
    coin: { ...TOKENS.TULIP },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.TULIP },

    mintAddress: '2doeZGLJyACtaG9DCUyqMLtswesfje1hjNA11hMdj6YU',
    decimals: TOKENS.TULIP.decimals,
    coins: [TOKENS.TULIP, TOKENS.USDC]
  },
  {
    symbol: 'RAY',
    name: 'Raydium',
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.RAY },

    mintAddress: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    decimals: TOKENS.RAY.decimals,
    referrer: '33XpMmMQRf6tSPpmYyzpwU4uXpZHkFwCZsusD9dMYkjy',
    coins: [TOKENS.RAY, TOKENS.RAY]
  },
  {
    symbol: 'RAY-USDT',
    name: 'RAY-USDT LP',
    coin: { ...TOKENS.RAY },
    pc: { ...TOKENS.USDT },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.RAY },

    mintAddress: 'C3sT1R3nsw4AVdepvLTLKr5Gvszr7jufyBWUCvy4TUvT',
    decimals: TOKENS.RAY.decimals,
    coins: [TOKENS.RAY, TOKENS.USDT]
  },
  {
    symbol: 'RAY-USDC',
    name: 'RAY-USDC LP',
    coin: { ...TOKENS.RAY },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.RAY },

    mintAddress: 'FbC6K13MzHvN42bXrtGaWsvZY9fxrackRSZcBGfjPc7m',
    decimals: TOKENS.RAY.decimals,
    coins: [TOKENS.RAY, TOKENS.USDC]
  },
  {
    symbol: 'RAY-SRM',
    name: 'RAY-SRM LP',
    coin: { ...TOKENS.RAY },
    pc: { ...TOKENS.SRM },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.RAY },

    mintAddress: '7P5Thr9Egi2rvMmEuQkLn8x8e8Qro7u2U7yLD2tU2Hbe',
    decimals: TOKENS.RAY.decimals,
    coins: [TOKENS.RAY, TOKENS.SRM]
  },
  {
    symbol: 'RAY-SOL',
    name: 'RAY-SOL LP',
    coin: { ...TOKENS.RAY },
    pc: { ...NATIVE_SOL },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.RAY },

    mintAddress: '89ZKE4aoyfLBe2RuV6jM3JGNhaV18Nxh8eNtjRcndBip',
    decimals: TOKENS.RAY.decimals,
    coins: [TOKENS.RAY, NATIVE_SOL]
  },
  {
    symbol: 'RAY-ETH',
    name: 'RAY-ETH LP',
    coin: { ...TOKENS.RAY },
    pc: { ...TOKENS.ETH },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.RAY },

    mintAddress: 'mjQH33MqZv5aKAbKHi8dG3g3qXeRQqq1GFcXceZkNSr',
    decimals: TOKENS.RAY.decimals,
    coins: [TOKENS.RAY, TOKENS.ETH]
  },
  {
    symbol: 'MEDIA-USDC',
    name: 'MEDIA-USDC LP',
    coin: { ...TOKENS.MEDIA },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.MEDIA },

    mintAddress: 'A5zanvgtioZGiJMdEyaKN4XQmJsp1p7uVxaq2696REvQ',
    decimals: TOKENS.MEDIA.decimals,
    coins: [TOKENS.MEDIA, TOKENS.USDC]
  },
  {
    symbol: 'SAMO-RAY',
    name: 'SAMO-RAY LP',
    coin: { ...TOKENS.SAMO },
    pc: { ...TOKENS.RAY },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.SAMO },

    mintAddress: 'HwzkXyX8B45LsaHXwY8su92NoRBS5GQC32HzjQRDqPnr',
    decimals: TOKENS.SAMO.decimals,
    coins: [TOKENS.SAMO, TOKENS.RAY]
  },
  {
    symbol: 'COPE-USDC',
    name: 'COPE-USDC LP',
    coin: { ...TOKENS.COPE },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.COPE },

    mintAddress: 'Cz1kUvHw98imKkrqqu95GQB9h1frY8RikxPojMwWKGXf',
    decimals: TOKENS.COPE.decimals,
    coins: [TOKENS.COPE, TOKENS.USDC]
  },
  {
    symbol: 'MER-USDC',
    name: 'MER-USDC LP',
    coin: { ...TOKENS.MER },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.MER },

    mintAddress: '3H9NxvaZoxMZZDZcbBDdWMKbrfNj7PCF5sbRwDr7SdDW',
    decimals: TOKENS.MER.decimals,
    coins: [TOKENS.MER, TOKENS.USDC]
  },
  {
    symbol: 'ALEPH-USDC',
    name: 'ALEPH-USDC LP',
    coin: { ...TOKENS.ALEPH },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.ALEPH },

    mintAddress: 'iUDasAP2nXm5wvTukAHEKSdSXn8vQkRtaiShs9ceGB7',
    decimals: TOKENS.ALEPH.decimals,
    coins: [TOKENS.ALEPH, TOKENS.USDC]
  },
  {
    symbol: 'LIKE-USDC',
    name: 'LIKE-USDC LP',
    coin: { ...TOKENS.LIKE },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.LIKE },

    mintAddress: 'cjZmbt8sJgaoyWYUttomAu5LJYU44ZrcKTbzTSEPDVw',
    decimals: TOKENS.LIKE.decimals,
    coins: [TOKENS.LIKE, TOKENS.USDC]
  },
  {
    symbol: 'KIN-RAY',
    name: 'KIN-RAY LP',
    coin: { ...TOKENS.KIN },
    pc: { ...TOKENS.RAY },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.KIN },

    mintAddress: 'CHT8sft3h3gpLYbCcZ9o27mT5s3Z6VifBVbUiDvprHPW',
    decimals: 6,
    coins: [TOKENS.KIN, TOKENS.RAY]
  },
  {
    symbol: 'BOP-RAY',
    name: 'BOP-RAY LP',
    coin: { ...TOKENS.BOP },
    pc: { ...TOKENS.RAY },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.BOP },

    mintAddress: '9nQPYJvysyfnXhQ6nkK5V7sZG26hmDgusfdNQijRk5LD',
    decimals: TOKENS.BOP.decimals,
    coins: [TOKENS.BOP, TOKENS.RAY]
  },
  {
    symbol: 'ROPE-USDC',
    name: 'ROPE-USDC LP',
    coin: { ...TOKENS.ROPE },
    pc: { ...TOKENS.USDC },
    reward: { ...TOKENS.RAY },
    rewardB: { ...TOKENS.ROPE },

    mintAddress: 'Cq4HyW5xia37tKejPF2XfZeXQoPYW6KfbPvxvw5eRoUE',
    decimals: TOKENS.ROPE.decimals,
    coins: [TOKENS.ROPE, TOKENS.USDC]
  }
];

export const FARM_PLATFORMS = {
  RAYDIUM: 'raydium',
  SABER: 'saber',
  ORCA: 'orca',
  TULIP: 'tulip',
  SOLEND: 'solend',
  MANGO: 'mango'
};
