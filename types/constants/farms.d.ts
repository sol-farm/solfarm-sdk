export const FARMS: ({
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
    saber: boolean;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    marginIndex: number;
    slippageWarning: boolean;
    maxPositionLimitInUsd: number;
    rewardEndSlot: number;
    referrer?: undefined;
    singleStake?: undefined;
    whitelisted?: undefined;
    disabled?: undefined;
    migrated?: undefined;
} | {
    symbol: string;
    name: string;
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    mintAddress: string;
    decimals: number;
    referrer: string;
    singleStake: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    saber: boolean;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    maxPositionLimitInUsd: number;
    rewardEndSlot: number;
    coin?: undefined;
    pc?: undefined;
    rewardB?: undefined;
    dualYield?: undefined;
    marginIndex?: undefined;
    slippageWarning?: undefined;
    whitelisted?: undefined;
    disabled?: undefined;
    migrated?: undefined;
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
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    mintAddress: string;
    decimals: number;
    liquidityMining: boolean;
    totalTulipEmission: number;
    saber: boolean;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    marginIndex: number;
    maxPositionLimitInUsd: number;
    rewardEndSlot: number;
    rewardB?: undefined;
    dualYield?: undefined;
    slippageWarning?: undefined;
    referrer?: undefined;
    singleStake?: undefined;
    whitelisted?: undefined;
    disabled?: undefined;
    migrated?: undefined;
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
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    mintAddress: string;
    decimals: number;
    liquidityMining: boolean;
    totalTulipEmission: number;
    saber: boolean;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    marginIndex: number;
    whitelisted: boolean;
    disabled: boolean;
    maxPositionLimitInUsd: number;
    migrated: boolean;
    rewardEndSlot: number;
    rewardB?: undefined;
    dualYield?: undefined;
    slippageWarning?: undefined;
    referrer?: undefined;
    singleStake?: undefined;
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
    };
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    mintAddress: string;
    decimals: number;
    liquidityMining: boolean;
    totalTulipEmission: number;
    saber: boolean;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    marginIndex: number;
    whitelisted: boolean;
    disabled: boolean;
    maxPositionLimitInUsd: number;
    migrated: boolean;
    rewardEndSlot: number;
    rewardB?: undefined;
    dualYield?: undefined;
    slippageWarning?: undefined;
    referrer?: undefined;
    singleStake?: undefined;
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
    liquidityMining: boolean;
    totalTulipEmission: number;
    saber: boolean;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    marginIndex: number;
    maxPositionLimitInUsd: number;
    rewardEndSlot: number;
    dualYield?: undefined;
    slippageWarning?: undefined;
    referrer?: undefined;
    singleStake?: undefined;
    whitelisted?: undefined;
    disabled?: undefined;
    migrated?: undefined;
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
    liquidityMining: boolean;
    totalTulipEmission: number;
    saber: boolean;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    marginIndex: number;
    maxPositionLimitInUsd: number;
    slippageWarning: boolean;
    rewardEndSlot: number;
    dualYield?: undefined;
    referrer?: undefined;
    singleStake?: undefined;
    whitelisted?: undefined;
    disabled?: undefined;
    migrated?: undefined;
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
    saber: boolean;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    marginIndex: number;
    maxPositionLimitInUsd: number;
    slippageWarning: boolean;
    rewardEndSlot: number;
    referrer?: undefined;
    singleStake?: undefined;
    whitelisted?: undefined;
    disabled?: undefined;
    migrated?: undefined;
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
    saber: boolean;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    marginIndex: number;
    maxPositionLimitInUsd: number;
    rewardEndSlot: number;
    slippageWarning?: undefined;
    referrer?: undefined;
    singleStake?: undefined;
    whitelisted?: undefined;
    disabled?: undefined;
    migrated?: undefined;
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
    saber: boolean;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    rewardEndSlot: number;
    marginIndex?: undefined;
    slippageWarning?: undefined;
    maxPositionLimitInUsd?: undefined;
    referrer?: undefined;
    singleStake?: undefined;
    whitelisted?: undefined;
    disabled?: undefined;
    migrated?: undefined;
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
    liquidityMining: boolean;
    totalTulipEmission: number;
    saber: boolean;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    marginIndex: number;
    whitelisted: boolean;
    disabled: boolean;
    maxPositionLimitInUsd: number;
    migrated: boolean;
    dualYield: boolean;
    rewardEndSlot: number;
    slippageWarning?: undefined;
    referrer?: undefined;
    singleStake?: undefined;
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
    liquidityMining: boolean;
    totalTulipEmission: number;
    saber: boolean;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    marginIndex: number;
    disabled: boolean;
    maxPositionLimitInUsd: number;
    rewardEndSlot: number;
    dualYield?: undefined;
    slippageWarning?: undefined;
    referrer?: undefined;
    singleStake?: undefined;
    whitelisted?: undefined;
    migrated?: undefined;
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
    disabled: boolean;
    saber: boolean;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    rewardEndSlot: number;
    marginIndex?: undefined;
    slippageWarning?: undefined;
    maxPositionLimitInUsd?: undefined;
    referrer?: undefined;
    singleStake?: undefined;
    whitelisted?: undefined;
    migrated?: undefined;
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
    disabled: boolean;
    saber: boolean;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    rewardEndSlot: number;
    marginIndex?: undefined;
    slippageWarning?: undefined;
    maxPositionLimitInUsd?: undefined;
    referrer?: undefined;
    singleStake?: undefined;
    whitelisted?: undefined;
    migrated?: undefined;
})[];
