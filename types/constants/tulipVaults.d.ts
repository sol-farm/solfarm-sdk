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
    tag: string;
    tags?: undefined;
} | {
    symbol: string;
    name: string;
    reward: any;
    rewardB: any;
    mintAddress: string;
    decimals: any;
    singleStake: boolean;
    platform: string;
    coins: any[];
    tags: any[];
    tag: string;
})[];
