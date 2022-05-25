export const ORCA_VAULTS: ({
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    };
    pc: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    };
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    marginIndex: number;
    maxPositionLimitInUsd: number;
    hidden?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        tags: string[];
    };
    pc: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    coins: ({
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    } | {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        tags: string[];
    })[];
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    marginIndex: number;
    maxPositionLimitInUsd: number;
    hidden?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    pc: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    marginIndex: number;
    maxPositionLimitInUsd: number;
    hidden?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    pc: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    };
    hidden: boolean;
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    marginIndex: number;
    maxPositionLimitInUsd: number;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    };
    pc: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    };
    hidden: boolean;
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    marginIndex: number;
    maxPositionLimitInUsd: number;
})[];
export function getOrcaVaultBySymbol(symbol: any): {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    };
    pc: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    };
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    marginIndex: number;
    maxPositionLimitInUsd: number;
    hidden?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        tags: string[];
    };
    pc: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    coins: ({
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    } | {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        tags: string[];
    })[];
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    marginIndex: number;
    maxPositionLimitInUsd: number;
    hidden?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    pc: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    marginIndex: number;
    maxPositionLimitInUsd: number;
    hidden?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    pc: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    };
    hidden: boolean;
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    marginIndex: number;
    maxPositionLimitInUsd: number;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    };
    pc: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    };
    hidden: boolean;
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    marginIndex: number;
    maxPositionLimitInUsd: number;
};
export function getOrcaVaultByMintAddress(mintAddress: any): {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    };
    pc: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    };
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    marginIndex: number;
    maxPositionLimitInUsd: number;
    hidden?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        tags: string[];
    };
    pc: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    coins: ({
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    } | {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        tags: string[];
    })[];
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    marginIndex: number;
    maxPositionLimitInUsd: number;
    hidden?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    pc: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    marginIndex: number;
    maxPositionLimitInUsd: number;
    hidden?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    pc: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    };
    hidden: boolean;
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    marginIndex: number;
    maxPositionLimitInUsd: number;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    };
    pc: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    };
    hidden: boolean;
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    marginIndex: number;
    maxPositionLimitInUsd: number;
};
