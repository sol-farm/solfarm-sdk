export class TokenAmount {
    constructor(wei: any, decimals?: number, isWei?: boolean);
    decimals: number;
    _decimals: BigNumber;
    wei: BigNumber;
    toEther(): BigNumber;
    toWei(): BigNumber;
    format(): string;
    fixed(): string;
    isNullOrZero(): boolean;
}
import BigNumber from "bignumber.js";
