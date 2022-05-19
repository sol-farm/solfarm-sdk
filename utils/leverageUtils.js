import * as anchor from '@project-serum/anchor';
import { LEVERAGE_FARMS } from './farmUtils';
import { isNil } from 'lodash';

export function getLeverageFarmBySymbol (symbol) {
  return LEVERAGE_FARMS.find((farm) => {
    return farm.symbol === symbol;
  });
}

// finds a UserFarm account address
export function findUserFarmAddress (
  // the user's main wallet account
  authority,

  // the id of the lending program
  programId,

  // the index of the account
  // 0 = first account, 1 = second account, etc...
  index,

  // the enum of the particular farm
  // 0 = ray-usdc lp, 1 = ray-sol lp
  farm
) {
  let seeds = [
    authority.toBuffer(),
    index.toArrayLike(Buffer, 'le', 8),
    farm.toArrayLike(Buffer, 'le', 8)
  ];

  return anchor.web3.PublicKey.findProgramAddress(seeds, programId);
}

// used to find a UserFarmManager account address
export function findUserFarmManagerAddress (
  // the user's main wallet account
  authority,

  // the id of the lending program
  programId,

  // the enum of the particular farm
  // 0 = ray-usdc lp, 1 = ray-sol lp
  farm
) {
  let seeds = [authority.toBuffer(), farm.toArrayLike(Buffer, 'le', 8)];

  return anchor.web3.PublicKey.findProgramAddress(seeds, programId);
}

export function findUserFarmObligationAddress (
  authority,
  userFarmAddr,
  lendingProgramId,
  obligationIndex
) {
  let seeds = [
    authority.toBuffer(),
    userFarmAddr.toBuffer(),
    obligationIndex.toArrayLike(Buffer, 'le', 8)
  ];

  return anchor.web3.PublicKey.findProgramAddress(seeds, lendingProgramId);
}

export function derivePositionInfoAddress (
  userFarmAddr,
  lendingProgramId,
  obligationIndex
) {
  let seeds = [
    Buffer.from('position_info'),
    userFarmAddr.toBuffer(),
    obligationIndex.toArrayLike(Buffer, 'le', 8)
  ];

  return anchor.web3.PublicKey.findProgramAddress(seeds, lendingProgramId);
}

export function findLeveragedFarmAddress (
  solfarmVaultProgram,
  serumMarket,
  farmProgramId,
  farm
) {
  let seeds = [
    Buffer.from('new'),
    solfarmVaultProgram.toBuffer(),
    serumMarket.toBuffer(),
    farm.toArrayLike(Buffer, 'le', 8)
  ];

  return anchor.web3.PublicKey.findProgramAddress(seeds, farmProgramId);
}

export function findVaultManagerAddress (
  authority,
  leveragedFarmAccount,
  farmProgramId
) {
  let seeds = [authority.toBuffer(), leveragedFarmAccount.toBuffer()];

  return anchor.web3.PublicKey.findProgramAddress(seeds, farmProgramId);
}

export function findObligationVaultAddress (
  userFarmAccount,
  obligationIndex,
  farmProgramId
) {
  let seeds = [
    userFarmAccount.toBuffer(),
    obligationIndex.toArrayLike(Buffer, 'le', 8)
  ];

  return anchor.web3.PublicKey.findProgramAddress(seeds, farmProgramId);
}

export function findBorrowAuthorizer (lendingMarket, sourceProgram) {
  let seeds = [lendingMarket.toBuffer(), sourceProgram.toBuffer()];

  return anchor.web3.PublicKey.findProgramAddress(seeds, sourceProgram);
}

export function getDefaultSelectedCoinIndex (borrowDisabledCoinIndex) {
  if (isNil(borrowDisabledCoinIndex)) {
    return 0;
  }

  return borrowDisabledCoinIndex === 0 ? 1 : 0;
}

// finds a Orca UserFarm address
export function findOrcaUserFarmAddress (
  globalFarm,
  owner,
  tokenProgramId,
  aquaFarmProgramId
) {
  let seeds = [
    globalFarm.toBuffer(),
    owner.toBuffer(),
    tokenProgramId.toBuffer()
  ];

  return anchor.web3.PublicKey.findProgramAddress(seeds, aquaFarmProgramId);
}
