import {
  depositToVault,
  withdrawFromVault
} from './services/TransactionService';
import { getBalanceForVault } from './services/WalletService';
import {
  depositToLendingReserve,
  depositLendingReserve,
  withdrawFromLendingReserve,
  withdrawLendingReserve
} from './services/LendingService';
import {
  getBalancesForAutoVaults
} from './services/VaultService';
import {
  openMarginPosition
} from './services/LeverageService';
import { FARM_PLATFORMS } from './constants/farmConstants';
import { VAULTS } from './constants/vaults';

export {
  // Leverage
  openMarginPosition,

  // Vaults
  depositToVault,
  withdrawFromVault,
  getBalanceForVault,
  getBalancesForAutoVaults,

  // Lending
  depositToLendingReserve,
  depositLendingReserve,
  withdrawFromLendingReserve,
  withdrawLendingReserve,

  // Configuration files
  FARM_PLATFORMS,
  VAULTS
};
