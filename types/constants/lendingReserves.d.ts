export const LENDING_RESERVES: ({
    name: string;
    account: string;
    mintAddress: string;
    liquiditySupplyTokenAccount: string;
    liquidityFeeReceiver: string;
    collateralTokenMint: string;
    collateralTokenSupply: string;
    destinationCollateralTokenAccount: string;
    quoteTokenMint: string;
    decimals: number;
    visible: boolean;
    borrowDisabled?: undefined;
} | {
    name: string;
    account: string;
    mintAddress: string;
    liquiditySupplyTokenAccount: string;
    liquidityFeeReceiver: string;
    collateralTokenMint: string;
    collateralTokenSupply: string;
    destinationCollateralTokenAccount: string;
    quoteTokenMint: string;
    decimals: number;
    visible: boolean;
    borrowDisabled: boolean;
})[];
