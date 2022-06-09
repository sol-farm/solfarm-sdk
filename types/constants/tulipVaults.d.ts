export const TULIP_VAULTS: ({
    symbol: string;
    name: string;
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
    singleStake: boolean;
    platform: string;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    tags: any[];
    tag: string;
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
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    mintAddress: string;
    decimals: number;
    singleStake: boolean;
    platform: string;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    tag: string;
    tags?: undefined;
} | {
    symbol: string;
    name: string;
    reward: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    };
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    };
    mintAddress: string;
    decimals: number;
    singleStake: boolean;
    platform: string;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    tags: any[];
    tag: string;
})[];
