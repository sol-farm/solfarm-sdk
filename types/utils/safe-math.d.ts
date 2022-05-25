export class TokenAmount {
    constructor(wei: any, decimals?: number, isWei?: boolean);
    decimals: number;
    _decimals: any;
    wei: any;
    toEther(): any;
    toWei(): any;
    format(): any;
    fixed(): any;
    isNullOrZero(): any;
}
