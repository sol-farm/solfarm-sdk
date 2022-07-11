export function getTokenAccounts({ connection, wallet }: {
    connection: any;
    wallet: any;
}): Promise<{}>;
export function isMintAddressExisting(tokenAccounts: any, mintAddress: any): any;
export const ALL_FARMS: ({
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
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    link?: undefined;
    referrer?: undefined;
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
        referrer: string;
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        detailLink: string;
        docs: {
            website: string;
        };
        socials: {
            Discord: string;
            Medium: string;
            Twitter: string;
            Telegram: string;
        };
        tags: string[];
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
        detailLink: string;
        docs: {
            website: string;
        };
        socials: {
            Discord: string;
            Medium: string;
            Twitter: string;
            Telegram: string;
        };
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
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
        detailLink: string;
        docs: {
            website: string;
        };
        socials: {
            Discord: string;
            Medium: string;
            Twitter: string;
            Telegram: string;
        };
        tags: string[];
    })[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    link: string;
    coins?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    referrer?: undefined;
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
    link: string;
    coins?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    referrer?: undefined;
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
    decimals?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
        tags: string[];
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        tags: string[];
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
        tags: string[];
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
        tags: string[];
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    referrer: string;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    coin?: undefined;
    pc?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
})[];
export const ALL_VAULT_FARMS: ({
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
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    link?: undefined;
    referrer?: undefined;
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
        referrer: string;
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        detailLink: string;
        docs: {
            website: string;
        };
        socials: {
            Discord: string;
            Medium: string;
            Twitter: string;
            Telegram: string;
        };
        tags: string[];
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
        detailLink: string;
        docs: {
            website: string;
        };
        socials: {
            Discord: string;
            Medium: string;
            Twitter: string;
            Telegram: string;
        };
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
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
        detailLink: string;
        docs: {
            website: string;
        };
        socials: {
            Discord: string;
            Medium: string;
            Twitter: string;
            Telegram: string;
        };
        tags: string[];
    })[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    link: string;
    coins?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    referrer?: undefined;
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
    link: string;
    coins?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    referrer?: undefined;
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
    decimals?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
        tags: string[];
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        tags: string[];
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
        tags: string[];
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
        tags: string[];
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    referrer: string;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    coin?: undefined;
    pc?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
})[];
export const LEVERAGE_FARMS: ({
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
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    link?: undefined;
    referrer?: undefined;
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
        referrer: string;
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        detailLink: string;
        docs: {
            website: string;
        };
        socials: {
            Discord: string;
            Medium: string;
            Twitter: string;
            Telegram: string;
        };
        tags: string[];
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
        detailLink: string;
        docs: {
            website: string;
        };
        socials: {
            Discord: string;
            Medium: string;
            Twitter: string;
            Telegram: string;
        };
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
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
        detailLink: string;
        docs: {
            website: string;
        };
        socials: {
            Discord: string;
            Medium: string;
            Twitter: string;
            Telegram: string;
        };
        tags: string[];
    })[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    link: string;
    coins?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    referrer?: undefined;
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
    link: string;
    coins?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    referrer?: undefined;
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
    decimals?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
        tags: string[];
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        tags: string[];
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
        tags: string[];
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
        tags: string[];
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    referrer: string;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    coin?: undefined;
    pc?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
})[];
export function getFarmBySymbol(symbol: any): {
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
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    link?: undefined;
    referrer?: undefined;
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
        referrer: string;
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        detailLink: string;
        docs: {
            website: string;
        };
        socials: {
            Discord: string;
            Medium: string;
            Twitter: string;
            Telegram: string;
        };
        tags: string[];
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
        detailLink: string;
        docs: {
            website: string;
        };
        socials: {
            Discord: string;
            Medium: string;
            Twitter: string;
            Telegram: string;
        };
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
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
        detailLink: string;
        docs: {
            website: string;
        };
        socials: {
            Discord: string;
            Medium: string;
            Twitter: string;
            Telegram: string;
        };
        tags: string[];
    })[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    link: string;
    coins?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    referrer?: undefined;
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
    link: string;
    coins?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    referrer?: undefined;
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
    decimals?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
        tags: string[];
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        tags: string[];
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
        tags: string[];
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
        tags: string[];
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    referrer: string;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    coin?: undefined;
    pc?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
};
export function getFarmByMintAddress(mintAddress: any): {
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
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    link?: undefined;
    referrer?: undefined;
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
        referrer: string;
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        detailLink: string;
        docs: {
            website: string;
        };
        socials: {
            Discord: string;
            Medium: string;
            Twitter: string;
            Telegram: string;
        };
        tags: string[];
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
        detailLink: string;
        docs: {
            website: string;
        };
        socials: {
            Discord: string;
            Medium: string;
            Twitter: string;
            Telegram: string;
        };
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
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
        detailLink: string;
        docs: {
            website: string;
        };
        socials: {
            Discord: string;
            Medium: string;
            Twitter: string;
            Telegram: string;
        };
        tags: string[];
    })[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    link: string;
    coins?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    referrer?: undefined;
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
    link: string;
    coins?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    referrer?: undefined;
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
    decimals?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    rewardB: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
        tags: string[];
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        tags: string[];
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
        tags: string[];
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
        tags: string[];
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
        tags: string[];
    };
    mintAddress: string;
    decimals: number;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
    referrer?: undefined;
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
    referrer: string;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    coin?: undefined;
    pc?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    totalTulipEmission?: undefined;
    link?: undefined;
};
export function getRaydiumVaultBySymbol(symbol: any): {
    symbol: string;
    name: string;
    configName: string;
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
    hidden: boolean;
    platform: string;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    marginIndex: number;
    slippageWarning: boolean;
    maxPositionLimitInUsd: number;
    link: string;
    rewardEndSlot: number;
    whitelisted?: undefined;
    disabled?: undefined;
    migrated?: undefined;
    highLiquidity?: undefined;
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
    platform: string;
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
    link: string;
    migrated: boolean;
    rewardEndSlot: number;
    highLiquidity: boolean;
    configName?: undefined;
    dualYield?: undefined;
    hidden?: undefined;
    slippageWarning?: undefined;
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
    link: string;
    rewardEndSlot: number;
    platform: string;
    configName?: undefined;
    hidden?: undefined;
    whitelisted?: undefined;
    disabled?: undefined;
    migrated?: undefined;
    highLiquidity?: undefined;
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
    platform: string;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    marginIndex: number;
    maxPositionLimitInUsd: number;
    link: string;
    rewardEndSlot: number;
    configName?: undefined;
    dualYield?: undefined;
    hidden?: undefined;
    slippageWarning?: undefined;
    whitelisted?: undefined;
    disabled?: undefined;
    migrated?: undefined;
    highLiquidity?: undefined;
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
    platform: string;
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
    link: string;
    migrated: boolean;
    rewardEndSlot: number;
    configName?: undefined;
    dualYield?: undefined;
    hidden?: undefined;
    slippageWarning?: undefined;
    highLiquidity?: undefined;
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
    };
    hidden: boolean;
    mintAddress: string;
    decimals: number;
    liquidityMining: boolean;
    totalTulipEmission: number;
    saber: boolean;
    platform: string;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    marginIndex: number;
    whitelisted: boolean;
    maxPositionLimitInUsd: number;
    link: string;
    migrated: boolean;
    rewardEndSlot: number;
    highLiquidity: boolean;
    configName?: undefined;
    dualYield?: undefined;
    slippageWarning?: undefined;
    disabled?: undefined;
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
    };
    mintAddress: string;
    decimals: number;
    liquidityMining: boolean;
    totalTulipEmission: number;
    saber: boolean;
    platform: string;
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
    hidden: boolean;
    maxPositionLimitInUsd: number;
    link: string;
    migrated: boolean;
    rewardEndSlot: number;
    highLiquidity: boolean;
    configName?: undefined;
    dualYield?: undefined;
    slippageWarning?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddres: string;
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
        mintAddres: string;
        decimals: number;
    };
    hidden: boolean;
    mintAddress: string;
    decimals: number;
    totalTulipEmission: number;
    saber: boolean;
    platform: string;
    coins: ({
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    } | {
        symbol: string;
        name: string;
        mintAddres: string;
        decimals: number;
    })[];
    marginIndex: number;
    whitelisted: boolean;
    disabled: boolean;
    maxPositionLimitInUsd: number;
    link: string;
    migrated: boolean;
    configName?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    slippageWarning?: undefined;
    rewardEndSlot?: undefined;
    highLiquidity?: undefined;
};
export function getRaydiumVaultByMintAddress(mintAddress: any): {
    symbol: string;
    name: string;
    configName: string;
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
    hidden: boolean;
    platform: string;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
    }[];
    marginIndex: number;
    slippageWarning: boolean;
    maxPositionLimitInUsd: number;
    link: string;
    rewardEndSlot: number;
    whitelisted?: undefined;
    disabled?: undefined;
    migrated?: undefined;
    highLiquidity?: undefined;
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
    platform: string;
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
    link: string;
    migrated: boolean;
    rewardEndSlot: number;
    highLiquidity: boolean;
    configName?: undefined;
    dualYield?: undefined;
    hidden?: undefined;
    slippageWarning?: undefined;
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
    link: string;
    rewardEndSlot: number;
    platform: string;
    configName?: undefined;
    hidden?: undefined;
    whitelisted?: undefined;
    disabled?: undefined;
    migrated?: undefined;
    highLiquidity?: undefined;
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
    platform: string;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    marginIndex: number;
    maxPositionLimitInUsd: number;
    link: string;
    rewardEndSlot: number;
    configName?: undefined;
    dualYield?: undefined;
    hidden?: undefined;
    slippageWarning?: undefined;
    whitelisted?: undefined;
    disabled?: undefined;
    migrated?: undefined;
    highLiquidity?: undefined;
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
    platform: string;
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
    link: string;
    migrated: boolean;
    rewardEndSlot: number;
    configName?: undefined;
    dualYield?: undefined;
    hidden?: undefined;
    slippageWarning?: undefined;
    highLiquidity?: undefined;
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
    };
    hidden: boolean;
    mintAddress: string;
    decimals: number;
    liquidityMining: boolean;
    totalTulipEmission: number;
    saber: boolean;
    platform: string;
    coins: {
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    }[];
    marginIndex: number;
    whitelisted: boolean;
    maxPositionLimitInUsd: number;
    link: string;
    migrated: boolean;
    rewardEndSlot: number;
    highLiquidity: boolean;
    configName?: undefined;
    dualYield?: undefined;
    slippageWarning?: undefined;
    disabled?: undefined;
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
    };
    mintAddress: string;
    decimals: number;
    liquidityMining: boolean;
    totalTulipEmission: number;
    saber: boolean;
    platform: string;
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
    hidden: boolean;
    maxPositionLimitInUsd: number;
    link: string;
    migrated: boolean;
    rewardEndSlot: number;
    highLiquidity: boolean;
    configName?: undefined;
    dualYield?: undefined;
    slippageWarning?: undefined;
} | {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddres: string;
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
        mintAddres: string;
        decimals: number;
    };
    hidden: boolean;
    mintAddress: string;
    decimals: number;
    totalTulipEmission: number;
    saber: boolean;
    platform: string;
    coins: ({
        symbol: string;
        name: string;
        mintAddress: string;
        decimals: number;
        referrer: string;
    } | {
        symbol: string;
        name: string;
        mintAddres: string;
        decimals: number;
    })[];
    marginIndex: number;
    whitelisted: boolean;
    disabled: boolean;
    maxPositionLimitInUsd: number;
    link: string;
    migrated: boolean;
    configName?: undefined;
    dualYield?: undefined;
    liquidityMining?: undefined;
    slippageWarning?: undefined;
    rewardEndSlot?: undefined;
    highLiquidity?: undefined;
};
export function getSaberVaultBySymbol(symbol: any): {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddres: string;
        decimals: number;
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
        mintAddres: string;
        decimals: number;
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
        mintAddres: string;
        decimals: number;
    };
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    sunnyPlatform: string;
    link: string;
    totalSBREmission: number;
    totalSunnyEmission: number;
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
        mintAddres: string;
        decimals: number;
    };
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    sunnyPlatform: string;
    link: string;
    totalSBREmission: number;
    totalSunnyEmission: number;
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
        mintAddres: string;
        decimals: number;
    };
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    sunnyPlatform: string;
    link: string;
    totalSBREmission: number;
    totalSunnyEmission: number;
};
export function getSaberVaultByMintAddress(mintAddress: any): {
    symbol: string;
    name: string;
    coin: {
        symbol: string;
        name: string;
        mintAddres: string;
        decimals: number;
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
        mintAddres: string;
        decimals: number;
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
        mintAddres: string;
        decimals: number;
    };
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    sunnyPlatform: string;
    link: string;
    totalSBREmission: number;
    totalSunnyEmission: number;
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
        mintAddres: string;
        decimals: number;
    };
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    sunnyPlatform: string;
    link: string;
    totalSBREmission: number;
    totalSunnyEmission: number;
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
        mintAddres: string;
        decimals: number;
    };
    mintAddress: string;
    decimals: number;
    dualYield: boolean;
    liquidityMining: boolean;
    totalTulipEmission: number;
    platform: string;
    sunnyPlatform: string;
    link: string;
    totalSBREmission: number;
    totalSunnyEmission: number;
};
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
export function getTulipVaultBySymbol(symbol: any): {
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
};
export function getTulipVaultByMintAddress(mintAddress: any): {
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
};
export function getAPY(dailyPeriodicRate: any, numberOfPeriods: any): number;
