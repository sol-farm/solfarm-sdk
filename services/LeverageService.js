import * as anchorold from '@project-serum/anchor';
import * as serumAssoToken from '@project-serum/associated-token';
import * as splToken from '@solana/spl-token';
import {
  findLeveragedFarmAddress,
  findObligationVaultAddress,
  findUserFarmAddress,
  findUserFarmObligationAddress,
  getLeverageFarmBySymbol
} from '../utils/leverageUtils';

import {
  getLendingFarmAccount,
  getLendingFarmManagementAccount,
  getLendingFarmProgramId,
  getLendingMarketAccount,
  getLendingProgramId,
  getOrcaVaultProgramId,
  getVaultProgramId
} from '../utils/config';

import leverageIdl from '../constants/leverage_idl.json';
import { findIndex } from 'lodash';
import { commitment, getMultipleAccounts } from '../utils/web3';
import { TOKENS } from '../constants/tokens';
import { getFarmBySymbol } from '../utils/farmUtils';
import { FARM_PLATFORMS } from '../constants/farms';

async function _createUserFarm ({
  wallet,
  tokenAccounts,
  assetSymbol,
  obligationIdx
}) {
  let anchor = anchorold;

  const walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58())
    },
    provider = new anchor.Provider(window.$web3, walletToInitialize, {
      skipPreflight: true,
      preflightCommitment: commitment
    }),
    tulipTokenMint = new anchor.web3.PublicKey(TOKENS.TULIP.mintAddress),
    farm = getFarmBySymbol(assetSymbol),
    baseToken = farm.coins[0], // base / coin
    quoteToken = farm.coins[1]; // quote / pc | @to-do: change coins[0] and coins[1] to baseToken and quoteToken

  anchor.setProvider(provider);

  // Address of the deployed program.
  const farmProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());

  // Generate the program client from IDL.
  const farmProgram = new anchor.Program(leverageIdl, farmProgramId);

  const solfarmVaultProgramId = new anchor.web3.PublicKey(
    farm.platform === FARM_PLATFORMS.ORCA ?
      getOrcaVaultProgramId() : getVaultProgramId()
  );

  const lendingProgramId = new anchor.web3.PublicKey(
    getLendingProgramId() // lendingInfo -> programs -> lending -> id
  );

  let [userFarm] = await findUserFarmAddress(
    provider.wallet.publicKey,
    new anchor.web3.PublicKey(getLendingFarmProgramId()), // lending_info.json -> programs -> farm -> id
    new anchor.BN(0),
    new anchor.BN(farm.marginIndex)
  );

  let [obligationVaultAccount] =
    await findObligationVaultAddress(
      userFarm,
      new anchor.BN(obligationIdx), // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
      farmProgramId
    );

  let [userObligationAcct1] =
    await findUserFarmObligationAddress(
      provider.wallet.publicKey,
      userFarm,
      farmProgramId,
      new anchor.BN(obligationIdx) // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
    );

  const [leveragedFarm] = await findLeveragedFarmAddress(
    solfarmVaultProgramId,
    new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).serum_market
    ),
    farmProgramId,
    new anchor.BN(farm.marginIndex)
  );

  const obligationLPTokenAccount =
    await serumAssoToken.getAssociatedTokenAddress(
      obligationVaultAccount,
      new anchor.web3.PublicKey(farm.mintAddress)
    );

  const obligationTulipTokenAccount =
    await serumAssoToken.getAssociatedTokenAddress(
      obligationVaultAccount,
      tulipTokenMint
    );
  const [obligationLPTokenAccountInfo, obligationTulipTokenAccountInfo] =
    await getMultipleAccounts(
      window.$web3,
      [obligationLPTokenAccount, obligationTulipTokenAccount],
      commitment
    );

  const instructions = [];

  if (!obligationLPTokenAccountInfo) {
    instructions.push(
      await serumAssoToken.createAssociatedTokenAccount(
        provider.wallet.publicKey,
        obligationVaultAccount,
        new anchor.web3.PublicKey(farm.mintAddress)
      )
    );
  }

  if (!obligationTulipTokenAccountInfo) {
    instructions.push(
      await serumAssoToken.createAssociatedTokenAccount(
        provider.wallet.publicKey,
        obligationVaultAccount,
        tulipTokenMint
      )
    );
  }

  if (
    baseToken.symbol !== 'SOL' &&
    !isMintAddressExisting(tokenAccounts, baseToken.mintAddress)
  ) {
    instructions.push(
      await serumAssoToken.createAssociatedTokenAccount(

        // who will pay for the account creation
        wallet.publicKey,

        // who is the account getting created for
        wallet.publicKey,

        // what mint address token is being created
        new anchor.web3.PublicKey(baseToken.mintAddress)
      )
    );
  }

  if (
    quoteToken.symbol !== 'SOL' &&
    !isMintAddressExisting(tokenAccounts, quoteToken.mintAddress)
  ) {
    instructions.push(
      await serumAssoToken.createAssociatedTokenAccount(

        // who will pay for the account creation
        wallet.publicKey,

        // who is the account getting created for
        wallet.publicKey,

        // what mint address token is being created
        new anchor.web3.PublicKey(quoteToken.mintAddress)
      )
    );
  }

  const tulipTokenAccount =
    tokenAccounts[TOKENS.TULIP.mintAddress]?.tokenAccountAddress;
  const derivedTulipTokenAccount = await serumAssoToken.getAssociatedTokenAddress(
    provider.wallet.publicKey,
    new anchor.web3.PublicKey(TOKENS.TULIP.mintAddress)
  );
  const isTulipAssociatedAddress =
    tulipTokenAccount === derivedTulipTokenAccount.toBase58();
  const isTulipAuxillaryAddress =
    tulipTokenAccount && !isTulipAssociatedAddress;
  const shouldCreateTulipAssociatedAddress =
    baseToken.mintAddress !== TOKENS.TULIP.mintAddress ?
      !isTulipAssociatedAddress : isTulipAuxillaryAddress;

  if (shouldCreateTulipAssociatedAddress) {
    instructions.push(
      await serumAssoToken.createAssociatedTokenAccount(

        // who will pay for the account creation
        provider.wallet.publicKey,

        // who is the account getting created for
        provider.wallet.publicKey,

        // what mint address token is being created
        new anchor.web3.PublicKey(TOKENS.TULIP.mintAddress)
      )
    );
  }

  const createUserFarmAccounts = {
    authority: provider.wallet.publicKey,
    userFarm: userFarm,
    userFarmObligation: userObligationAcct1,
    lendingMarket: new anchor.web3.PublicKey(getLendingMarketAccount()),
    global: new anchor.web3.PublicKey(getLendingFarmManagementAccount()),
    leveragedFarm: leveragedFarm, // use findLeveragedFarmAddress()
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    systemProgram: new anchor.web3.PublicKey(
      '11111111111111111111111111111111'
    ),
    lendingProgram: lendingProgramId,
    tokenProgram: splToken.TOKEN_PROGRAM_ID,
    obligationVaultAddress: obligationVaultAccount
  };

  // console.log("farm accounts", createUserFarmAccounts);
  const txn = await farmProgram.transaction.createUserFarm(
    solfarmVaultProgramId,
    {
      accounts: createUserFarmAccounts,
      instructions
    }
  );

  return txn;
}

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

    const createUserFarmManagerTxn = _createUserFarm({
      assetSymbol: symbol,
      obligationIdx
    });

    transactions.push(createUserFarmManagerTxn);
    extraSigners.push([]);
  }
  else if (obligations[obligationIdx].obligationAccount.toBase58() === '11111111111111111111111111111111') {
    createAccounts = true;

    transactions.push(
      _createUserFarmObligation(symbol, obligationIdx)
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

export { openMarginPosition };