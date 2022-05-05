import * as anchorold from '@project-serum/anchor';
import { findUserFarmAddress, getLeverageFarmBySymbol } from '../utils/leverageUtils';
import { getLendingFarmProgramId } from '../utils/config';
import leverageIdl from '../constants/leverage_idl.json';
import { findIndex } from 'lodash';

const openMarginPosition = async ({
  connection,
  wallet,
  symbol,
  coinBorrowAmount,
  pcBorrowAmount,
  baseTokenAmount,
  quoteTokenAmount,
  obligationIndex = -2
}) => {
  let anchor = anchorold;

  const transactions = [];

  const farmDetails = getLeverageFarmBySymbol(symbol);

  // 1. Calculate userFarm using the wallet address
  let [userFarm] = await findUserFarmAddress(
    wallet.publicKey,
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(0),
    new anchor.BN(farmDetails.marginIndex)
  );

  // 2. Fetch the data for the userFarm address
  const provider = new anchor.Provider(connection, wallet, { skipPreflight: true });

  anchor.setProvider(provider);

  const userFarmData = await connection.getAccountInfo(userFarm);

  const farmProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());

  // Generate the program client from IDL.
  const farmProgram = new anchor.Program(leverageIdl, farmProgramId, provider);

  // 3. Decode userFarm
  const { userFarmInfo } = farmProgram.coder.accounts.decode(
    'UserFarm',
    userFarmData?.account?.data
  );

  const { obligations } = userFarmInfo || {};

  let obligationIdx;

  obligationIdx = findIndex(obligations, (obligation) => {
    return (
      obligation.positionState.hasOwnProperty('opening') ||
      obligation.positionState.hasOwnProperty('withdrawn') ||
      obligation.positionState.hasOwnProperty('exitingAndLiquidated')
    );
  });

  if (obligationIdx === -1) {
    return Promise.reject(
      new Error(
        'TulipProtocol~openMarginPosition: Cannot open more than 3 positions for the leverage farm'
      )
    );
  }

  let obligationPositionState = { opening: {} };

  if (obligationIdx !== -1) {
    obligationPositionState = obligations[obligationIdx].positionState;
  }

  const { isUserFarmValid } = farmDetails || {};
  let createAccounts = false;
  let extraSigners = [];

  if (!isUserFarmValid) {
    createAccounts = true;
    obligationIdx = 0;

    const createUserFarmManagerTxn = this.createUserFarm(
      symbol,
      obligationIdx
    );

    transactions.push(createUserFarmManagerTxn);
    extraSigners.push([]);
  }
  else if (obligations[obligationIdx].obligationAccount.toBase58() === '11111111111111111111111111111111') {
    createAccounts = true;

    transactions.push(
      this.createUserFarmObligation(symbol, obligationIdx)
    );

    extraSigners.push([]);
  }

  // console.log("obligation idx:", obligationIdx);
  let obligationProgress = 0;
  if (
    obligationPositionState.hasOwnProperty('opening') ||
    obligationPositionState.hasOwnProperty('withdrawn') ||
    obligationPositionState.hasOwnProperty('exitingAndLiquidated')
  ) {
    obligationProgress = 1;
  } else if (obligationPositionState.hasOwnProperty('borrowed')) {
    obligationProgress = 2;
  } else if (obligationPositionState.hasOwnProperty('swapped')) {
    obligationProgress = 3;
  } else if (obligationPositionState.hasOwnProperty('addedLiquidity')) {
    obligationProgress = 4;
  } else if (
    obligationPositionState.hasOwnProperty('depositedOrcaAquaFarm')
  ) {
    obligationProgress = 5;
  }

  // console.log("$$$ progress", obligationProgress);
  if (!createAccounts && obligationProgress < 4) {
    // console.log("$$$ create open orders");
    transactions.push(
      this.createOpenOrdersAccount(assetSymbol, obligationIdx)
    );
    extraSigners.push([]);
  }
  if (obligationProgress > 0 && obligationProgress < 2) {
    const [depositBorrowTxn, signer] = await this.depositBorrow(
      assetSymbol,
      coinBorrowAmount,
      pcBorrowAmount,
      baseTokenAmount,
      quoteTokenAmount,
      obligationIdx,
      createAccounts
    );
    transactions.push(depositBorrowTxn);
    extraSigners.push(signer);
  }

  if (obligationProgress > 0 && obligationProgress < 3) {
    transactions.push(this.swapTokens(assetSymbol, obligationIdx));
    extraSigners.push([]);
  }


  if (obligationProgress > 0 && obligationProgress < 4) {
    transactions.push(this.addLiquidity(assetSymbol, obligationIdx));
    extraSigners.push([]);
  }

  if (getOrcaFarmDoubleDip(assetSymbol)) {
    if (obligationProgress > 0 && obligationProgress < 5) {
      transactions.push(
        this.depositOrcaWithoutShares(assetSymbol, obligationIdx)
      );
      extraSigners.push([]);
    }

    if (obligationProgress > 0 && obligationProgress < 6) {
      transactions.push(
        this.depositOrcaDoubleDip(assetSymbol, obligationIdx)
      );
      extraSigners.push([]);
    }
  } else {
    if (obligationProgress > 0 && obligationProgress < 5) {
      transactions.push(
        this.depositMarginLpTokens(assetSymbol, obligationIdx)
      );
      extraSigners.push([]);
    }
  }

  return Promise.all(transactions).then((fulfilledTransactions) => {
    // Temporary Internal ID, make sure to generate a unique one
    const opts = {
      internalId: `${Date.now()}${Math.round(Math.random() * 1000)}`
    };

    return sendAllTransactions(
      window.$web3,
      wallet,
      fulfilledTransactions,
      [],
      extraSigners,
      opts
    )
    .catch(async (e) => {
      if (e?.cause !== TRANSACTION_ERRORS.TIMEOUT) {
        console.log('Retry bailed out due to some issue', e);
        return Promise.reject(e);
      }

      const context = getStore('TransactionContextStore').get(opts.internalId);

      const finalTransactions = [];

      fulfilledTransactions.forEach((transaction, index) => {
        if (transaction.instructions.length > 0) {
          finalTransactions.push(transaction);
        }
      });

      let totalTxns = finalTransactions.length;
      let retrySignAmt = totalTxns < 6 ? 1 : 2;

      // Retry the transactions if the first tx failed and the obligationProgress wasn't 0
      if (obligationProgress > 1) {
        // console.log('Obligation progress is greater than 1 so can proceed');
      }
      else if (context?.signed >= retrySignAmt) {
        // console.log('Some txns were signed');

        for (let i = 0; i < context.signed; i++) {
          finalTransactions.shift();
        }
      } else {
        return Promise.reject(e);
      }

      let transactionIds = [];
      let txnInitLength = totalTxns - finalTransactions.length;
      let i = 0;
      for (let transaction of finalTransactions) {
        transactionIds.push(await sendRetryRequest(transaction));
        transactionStatusUpdate(
            toastId,
            transactionIds.length + txnInitLength,
            totalTxns
        );
        i++;
      }

      return Promise.resolve(transactionIds);
    })
    .finally(() => {
      dismissToast(toastId);
    });
  });
}
