import * as anchor from '@project-serum/anchor';
import Decimal from 'decimal.js';

export function deriveVaultUserAccount (vaultAccount, authority, program) {
  return anchor.web3.PublicKey.findProgramAddress(
    [vaultAccount.toBuffer(), authority.toBuffer()],
    program
  );
}

export function deriveVaultDepositQueue (vaultPda, program) {
  return anchor.web3.PublicKey.findProgramAddress(
    [vaultPda.toBuffer(), Buffer.from('deposit_queue')],
    program
  );
}

export function getOrcaPeriodRate (
  globalFarm,
  totalLiquidity,
  decimals,
  orcaPrice
) {
  return new Decimal(globalFarm.emissionsPerSecondNumerator.toString())
    .mul(60 * 60 * 24 * 100) // the 100 here is divided by 10 as its divided later, in the SDK it was 1000
    .div(globalFarm.emissionsPerSecondDenominator.toString())
    .div(totalLiquidity)
    .div(new Decimal(10).pow(decimals))
    .mul(orcaPrice)
    .toNumber();
}
