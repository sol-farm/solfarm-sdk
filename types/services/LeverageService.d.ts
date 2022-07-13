export function openMarginPosition({ connection, wallet, symbol, coinBorrowAmount, pcBorrowAmount, baseTokenAmount, quoteTokenAmount, obligationIdx, onSendTransactions }: {
    connection: any;
    wallet: any;
    symbol: any;
    coinBorrowAmount: any;
    pcBorrowAmount: any;
    baseTokenAmount: any;
    quoteTokenAmount: any;
    obligationIdx?: number;
    onSendTransactions?: typeof sendAllTransactions;
}): Promise<any[]>;
export function closeMarginPosition({ wallet, connection, symbol, obligationIdx, selectedOption, partialClose, onSendTransactions }?: {
    selectedOption: number;
    partialClose: number;
    wallet: any;
    connection: any;
    symbol: any;
    obligationIdx: any;
    onSendTransactions?: typeof sendAllTransactions;
}): Promise<any[]>;
export function addCollateralPosition({ wallet, connection, symbol, obligationIdx, reserveName, baseTokenAmount, quoteTokenAmount, coinBorrowAmount, pcBorrowAmount, onSendTransactions }: {
    wallet: any;
    connection: any;
    symbol: any;
    obligationIdx: any;
    reserveName: any;
    baseTokenAmount: any;
    quoteTokenAmount: any;
    coinBorrowAmount: any;
    pcBorrowAmount: any;
    onSendTransactions?: typeof sendAllTransactions;
}): Promise<any[]>;
import { sendAllTransactions } from "../utils/web3";
