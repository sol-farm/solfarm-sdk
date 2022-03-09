import {
  depositToVault,
  withdrawFromVault
} from './services/TransactionService';
import { getBalanceForVault } from './services/WalletService';
import {
  depositToLendingReserve,
  withdrawFromLendingReserve
} from './services/LendingService';
import {
  getBalancesForAutoVaults
} from './services/VaultService';

export {
  depositToVault,
  withdrawFromVault,
  getBalanceForVault,
  depositToLendingReserve,
  withdrawFromLendingReserve,
  getBalancesForAutoVaults
};
