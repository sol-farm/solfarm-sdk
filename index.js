import {
  depositToVault,
  withdrawFromVault
} from './services/TransactionService';
import { getBalanceForVault } from './services/WalletService';
import {
  depositToLendingReserve,
  withdrawFromLendingReserve
} from './services/LendingService';

export {
  depositToVault,
  withdrawFromVault,
  getBalanceForVault,
  depositToLendingReserve,
  withdrawFromLendingReserve
};
