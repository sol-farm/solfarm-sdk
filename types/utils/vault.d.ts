export function deriveVaultUserAccount(vaultAccount: any, authority: any, program: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveVaultDepositQueue(vaultPda: any, program: any): Promise<[anchor.web3.PublicKey, number]>;
export function getOrcaPeriodRate(globalFarm: any, totalLiquidity: any, decimals: any, orcaPrice: any): any;
import * as anchor from "@project-serum/anchor";
