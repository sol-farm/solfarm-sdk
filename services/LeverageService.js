import * as anchorold from '@project-serum/anchor';
import * as serumAssoToken from '@project-serum/associated-token';
import * as serum from '@project-serum/serum';
import * as splToken from '@solana/spl-token';
import {
  PublicKey,
  SystemProgram
} from '@solana/web3.js';
import {
  derivePositionInfoAddress,
  findBorrowAuthorizer,
  findLeveragedFarmAddress,
  findObligationVaultAddress,
  findOrcaUserFarmAddress,
  findUserFarmAddress,
  findUserFarmObligationAddress,
  getLeverageFarmBySymbol
} from '../utils/leverageUtils';

import {
  getFarmFusion,
  getFarmPoolAuthority,
  getFarmPoolId,
  getFarmPoolLpTokenAccount,
  getFarmPoolRewardATokenAccount,
  getFarmPoolRewardBTokenAccount,
  getFarmProgramId,
  getLendingFarmAccount,
  getLendingFarmManagementAccount,
  getLendingFarmProgramId,
  getLendingMarketAccount,
  getLendingProgramId,
  getLendingReserve,
  getOrcaFarmDoubleDip,
  getOrcaFarmPoolCoinTokenaccount,
  getOrcaFarmPoolPcTokenaccount,
  getOrcaLpMintAddress,
  getOrcaVaultAccount,
  getOrcaVaultConvertAuthority,
  getOrcaVaultFarmMint,
  getOrcaVaultGlobalBaseTokenVault,
  getOrcaVaultGlobalFarm,
  getOrcaVaultGlobalRewardTokenVault,
  getOrcaVaultLpMint,
  getOrcaVaultProgramId,
  getOrcaVaultRewardMint,
  getPriceFeedsForReserve,
  getVaultAccount,
  getVaultInfoAccount,
  getVaultOldInfoAccount,
  getVaultPdaAccount,
  getVaultProgramId,
  getVaultRewardAccountA,
  getVaultRewardAccountB,
  getVaultSerumVaultSigner
} from '../utils/config';

import { ACCOUNT_LAYOUT } from '../utils/layouts';
import { getReserveByName } from '../utils/lendingUtils';
import leverageIdl from '../constants/leverage_idl.json';
import { findIndex } from 'lodash';
import { commitment, getMultipleAccounts, sendAllTransactions } from '../utils/web3';
import { TOKENS } from '../constants/tokens';
import { getFarmBySymbol, getTokenAccounts, isMintAddressExisting } from '../utils/farmUtils';
import { FARM_PLATFORMS } from '../constants/farms';
import { AQUAFARM_PROGRAM_ID, LIQUIDITY_POOL_PROGRAM_ID_V4, TOKEN_PROGRAM_ID } from '../constants/ids';
import { deriveVaultUserAccount } from '../utils/vault';

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

async function _createUserFarmObligation ({
  wallet,
  tokenAccounts,
  assetSymbol,
  obligationIdx
}) {
  let anchor = anchorold;

  // console.log("obligation index", obligationIdx);
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
    baseToken = farm.coins[0],
    quoteToken = farm.coins[1];

  anchor.setProvider(provider);

  // Address of the deployed program.
  const farmProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());

  // Generate the program client from IDL.
  const farmProgram = new anchor.Program(leverageIdl, farmProgramId);

  const solfarmVaultProgramId = new anchor.web3.PublicKey(
    farm.platform === FARM_PLATFORMS.ORCA ?
      getOrcaVaultProgramId() : getVaultProgramId() // info.json -> programId
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

  const createUserFarmObligationAccounts = {
    authority: provider.wallet.publicKey,
    userFarm: userFarm,
    leveragedFarm: leveragedFarm, // use findLeveragedFarmAddress()
    userFarmObligation: userObligationAcct1,
    lendingMarket: new anchor.web3.PublicKey(getLendingMarketAccount()),
    obligationVaultAddress: obligationVaultAccount,
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    lendingProgram: lendingProgramId,
    tokenProgram: splToken.TOKEN_PROGRAM_ID,
    systemProgram: new anchor.web3.PublicKey(
      '11111111111111111111111111111111'
    )
  };

  const txn = await farmProgram.transaction.createUserFarmObligation({
    accounts: createUserFarmObligationAccounts,
    instructions
  });

  return txn;
}

async function _createOpenOrdersAccount ({
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
    farm = getFarmBySymbol(assetSymbol),
    baseToken = farm.coins[0], // base / coin
    quoteToken = farm.coins[1]; // quote / pc

  anchor.setProvider(provider);

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
      new anchor.web3.PublicKey(getLendingFarmProgramId())
    );

  const obligationLPTokenAccount =
    await serumAssoToken.getAssociatedTokenAddress(
      obligationVaultAccount,
      new anchor.web3.PublicKey(farm.mintAddress)
    );

  const [obligationLPTokenAccountInfo] = await getMultipleAccounts(
    window.$web3,
    [obligationLPTokenAccount],
    commitment
  );

  const txn = new anchor.web3.Transaction();

  if (!obligationLPTokenAccountInfo) {
    txn.add(

      // userFarmManagerLpTokenAccount
      await serumAssoToken.createAssociatedTokenAccount(
        provider.wallet.publicKey,
        obligationVaultAccount,
        new anchor.web3.PublicKey(farm.mintAddress)
      )
    );
  }

  if (
    baseToken.symbol !== 'SOL' &&
    !isMintAddressExisting(tokenAccounts, baseToken.mintAddress)
  ) {
    txn.add(
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
    txn.add(
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

  return txn;
}

async function _depositBorrow ({
  assetSymbol,
  coinBorrowAmount,
  pcBorrowAmount,
  baseTokenAmount,
  quoteTokenAmount,
  obligationIdx,
  wallet,
  tokenAccounts
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
    farm = getFarmBySymbol(assetSymbol),
    [baseToken, quoteToken] = farm.coins;

  anchor.setProvider(provider);

  // console.log("$$ reserver ", reserveName);
  // const { numberOfObligations = 0 } = userFarmInfo || {};

  // console.log(tokenAccounts);
  // Address of the deployed program.
  const vaultProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());

  // Generate the program client from IDL.
  const vaultProgram = new anchor.Program(leverageIdl, vaultProgramId);

  // console.log('farm.marginIndex', farm.marginIndex);

  const [userFarm] = await findUserFarmAddress(
    provider.wallet.publicKey,
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(0),
    new anchor.BN(farm.marginIndex)
  );

  const solfarmVaultProgramId = new anchor.web3.PublicKey(
    farm.platform === FARM_PLATFORMS.ORCA ?
      getOrcaVaultProgramId() : getVaultProgramId()
  );

  const [leveragedFarm] = await findLeveragedFarmAddress(
    solfarmVaultProgramId,
    new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).serum_market
    ),
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(farm.marginIndex)
  );

  const [userObligationAcct1] =
    await findUserFarmObligationAddress(
      provider.wallet.publicKey,
      userFarm,
      new anchor.web3.PublicKey(getLendingFarmProgramId()),
      new anchor.BN(obligationIdx) // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
    );

  const lendingProgramId = new anchor.web3.PublicKey(getLendingProgramId());

  const lendingMarketAccount = new anchor.web3.PublicKey(
    getLendingMarketAccount()
  );

  const [derivedLendingMarketAuthority] =
    await anchor.web3.PublicKey.findProgramAddress(
      [lendingMarketAccount.toBytes()],
      lendingProgramId
    );

  // let [obligationVaultAccount, obligationVaultNonce] =
  //   await findObligationVaultAddress(
  //     userFarm,
  //     new anchor.BN(obligationIdx), // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
  //     new anchor.web3.PublicKey(getLendingFarmProgramId())
  //   );

  const baseTokenReserve = getReserveByName(baseToken.symbol);
  const quoteTokenReserve = getReserveByName(quoteToken.symbol);

  // const reserves = [
  //   new anchor.web3.PublicKey(baseTokenReserve.account),
  //   new anchor.web3.PublicKey(quoteTokenReserve.account)
  // ];

  const [borrowAuthorizer] =
    await findBorrowAuthorizer(
      lendingMarketAccount,
      new anchor.web3.PublicKey(getLendingFarmProgramId())
    );

  const txn = new anchor.web3.Transaction();

  let coinSourceTokenAccount, pcSourceTokenAccount;

  if (
    baseToken.symbol !== 'SOL' &&
    !isMintAddressExisting(baseToken.mintAddress)
  ) {
    coinSourceTokenAccount = await await serumAssoToken.createAssociatedTokenAccount(
      provider,
      provider.wallet.publicKey,
      new anchor.web3.PublicKey(baseToken.mintAddress)
    );
  }
  else {
    coinSourceTokenAccount = new anchor.web3.PublicKey(
      tokenAccounts[baseToken.mintAddress]?.tokenAccountAddress
    );
  }

  if (
    quoteToken.symbol !== 'SOL' &&
    !isMintAddressExisting(quoteToken.mintAddress)
  ) {
    pcSourceTokenAccount = await await serumAssoToken.createAssociatedTokenAccount(
      provider,
      provider.wallet.publicKey,
      new anchor.web3.PublicKey(quoteToken.mintAddress)
    );
  }
  else {
    pcSourceTokenAccount = new anchor.web3.PublicKey(
      tokenAccounts[quoteToken.mintAddress]?.tokenAccountAddress
    );
  }

  let signers = [];

  if (baseToken.symbol === 'SOL') {
    const lamportsToCreateAccount =
      await window.$web3.getMinimumBalanceForRentExemption(
        ACCOUNT_LAYOUT.span,
        commitment
      );

    const newAccount = new anchor.web3.Account();

    signers.push(newAccount);

    coinSourceTokenAccount = newAccount.publicKey;
    txn.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: coinSourceTokenAccount,
        lamports:
          baseTokenAmount * Math.pow(10, baseToken.decimals) +
          lamportsToCreateAccount,
        space: ACCOUNT_LAYOUT.span,
        programId: TOKEN_PROGRAM_ID
      })
    );

    txn.add(
      splToken.Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
        new PublicKey(TOKENS.WSOL.mintAddress),
        coinSourceTokenAccount,
        wallet.publicKey
      )
    );
  }

  if (quoteToken.symbol === 'SOL') {
    const lamportsToCreateAccount =
      await window.$web3.getMinimumBalanceForRentExemption(
        ACCOUNT_LAYOUT.span,
        commitment
      );

    const newAccount = new anchor.web3.Account();

    signers.push(newAccount);

    pcSourceTokenAccount = newAccount.publicKey;
    txn.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: pcSourceTokenAccount,
        lamports:
          quoteTokenAmount * Math.pow(10, quoteToken.decimals) +
          lamportsToCreateAccount,
        space: ACCOUNT_LAYOUT.span,
        programId: TOKEN_PROGRAM_ID
      })
    );

    txn.add(
      splToken.Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
        new PublicKey(TOKENS.WSOL.mintAddress),
        pcSourceTokenAccount,
        wallet.publicKey
      )
    );
  }

  const vaultAccount =
    farm.platform === FARM_PLATFORMS.ORCA ?
      getLendingFarmAccount(assetSymbol).vault_account :
      getVaultAccount(assetSymbol);

  // Derive the User Position address, to fetch the newer data related to positions.
  const [userPositionInfoAddress] = await derivePositionInfoAddress(
    userFarm,
    vaultProgramId,
    new anchor.BN(obligationIdx)
  );

  let baseAmount = 0,
    quoteAmount = 0,
    baseBorrow = 0,
    quoteBorrow = 0;

  try {
    baseAmount = new anchor.BN(baseTokenAmount * Math.pow(10, baseToken.decimals));
    quoteAmount = new anchor.BN(quoteTokenAmount * Math.pow(10, quoteToken.decimals));
    baseBorrow = new anchor.BN(coinBorrowAmount * Math.pow(10, baseToken.decimals));
    quoteBorrow = new anchor.BN(pcBorrowAmount * Math.pow(10, quoteToken.decimals));
  }
  catch (e) {
    baseAmount = new anchor.BN(baseTokenAmount).mul(new anchor.BN(Math.pow(10, baseToken.decimals)));
    quoteAmount = new anchor.BN(quoteTokenAmount).mul(new anchor.BN(Math.pow(10, quoteToken.decimals)));
    baseBorrow = new anchor.BN(coinBorrowAmount).mul(new anchor.BN(Math.pow(10, baseToken.decimals)));
    quoteBorrow = new anchor.BN(pcBorrowAmount).mul(new anchor.BN(Math.pow(10, quoteToken.decimals)));
  }

  txn.add(
    vaultProgram.instruction.depositBorrowDual(
      baseAmount,
      quoteAmount,
      baseBorrow,
      quoteBorrow,
      new anchor.BN(obligationIdx),
      {
        accounts: {
          authority: provider.wallet.publicKey,
          userFarm: userFarm,
          leveragedFarm: leveragedFarm,
          userFarmObligation: userObligationAcct1,
          coinSourceTokenAccount,
          coinDestinationTokenAccount: new anchor.web3.PublicKey(
            getLendingFarmAccount(assetSymbol).farm_base_token_account
          ),
          coinDepositReserveAccount: new anchor.web3.PublicKey(
            getLendingReserve(baseToken.symbol).account
          ),
          pcSourceTokenAccount,
          pcDestinationTokenAccount: new anchor.web3.PublicKey(
            getLendingFarmAccount(assetSymbol).farm_quote_token_account
          ),
          pcDepositReserveAccount: new anchor.web3.PublicKey(
            getLendingReserve(quoteToken.symbol).account
          ),
          coinReserveLiquidityOracle: new anchor.web3.PublicKey(
            getPriceFeedsForReserve(baseToken.symbol).price_account
          ),
          pcReserveLiquidityOracle: new anchor.web3.PublicKey(
            getPriceFeedsForReserve(quoteToken.symbol).price_account
          ),
          lendingMarketAccount: lendingMarketAccount,
          derivedLendingMarketAuthority: derivedLendingMarketAuthority,
          tokenProgram: splToken.TOKEN_PROGRAM_ID,
          lendingProgram: lendingProgramId,
          coinSourceReserveLiquidityTokenAccount: new anchor.web3.PublicKey(
            baseTokenReserve.liquiditySupplyTokenAccount
          ),
          coinReserveLiquidityFeeReceiver: new anchor.web3.PublicKey(
            baseTokenReserve.liquidityFeeReceiver
          ),
          pcSourceReserveLiquidityTokenAccount: new anchor.web3.PublicKey(
            quoteTokenReserve.liquiditySupplyTokenAccount
          ),
          pcReserveLiquidityFeeReceiver: new anchor.web3.PublicKey(
            quoteTokenReserve.liquidityFeeReceiver
          ),
          borrowAuthorizer: borrowAuthorizer,
          lpPythPriceAccount: new anchor.web3.PublicKey(
            getPriceFeedsForReserve(assetSymbol).price_account
          ),
          vaultAccount: new anchor.web3.PublicKey(vaultAccount),
          rent: anchor.web3.SYSVAR_RENT_PUBKEY
        },
        remainingAccounts: [
          {
            isSigner: false,
            isWritable: true,
            pubkey: userPositionInfoAddress
          },
          {
            isSigner: false,
            isWritable: true,
            pubkey: new anchor.web3.PublicKey(
              '11111111111111111111111111111111'
            )
          }
        ]
      }
    )
  );

  if (baseToken.symbol === 'SOL') {
    txn.add(
      splToken.Token.createCloseAccountInstruction(
        TOKEN_PROGRAM_ID,
        coinSourceTokenAccount,
        wallet.publicKey,
        wallet.publicKey,
        []
      )
    );
  }

  if (quoteToken.symbol === 'SOL') {
    txn.add(
      splToken.Token.createCloseAccountInstruction(
        TOKEN_PROGRAM_ID,
        pcSourceTokenAccount,
        wallet.publicKey,
        wallet.publicKey,
        []
      )
    );
  }

  return [txn, signers];
}

async function _swapTokens ({
  assetSymbol,
  obligationIdx,
  wallet
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
    });

  anchor.setProvider(provider);

  // Address of the deployed program.
  const vaultProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());

  // Generate the program client from IDL.
  const vaultProgram = new anchor.Program(leverageIdl, vaultProgramId);

  const farm = getFarmBySymbol(assetSymbol);

  const [userFarm] = await findUserFarmAddress(
    provider.wallet.publicKey,
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(0),
    new anchor.BN(farm.marginIndex)
  );

  let lendingFarmAccount = getLendingFarmAccount(assetSymbol);
  let serumMarketKey = new anchor.web3.PublicKey(
    lendingFarmAccount.serum_market
  );
  let serumMarketVaultSigner = new anchor.web3.PublicKey(
    getVaultSerumVaultSigner(assetSymbol)
  );
  let openOrdersAccountFarm = new anchor.web3.PublicKey(
    lendingFarmAccount.farm_open_orders
  );
  let marketAccountInfo = await provider.connection.getAccountInfo(
    serumMarketKey
  );
  let dexProgramId = new anchor.web3.PublicKey(
    getLendingFarmAccount(assetSymbol).serum_dex_program // lendingInfo -> farm -> accounts -> serumDexProgram
  );
  const decoded = await serum.Market.getLayout(dexProgramId).decode(
    marketAccountInfo.data
  );

  const [userObligationAcct1] =
    await findUserFarmObligationAddress(
      provider.wallet.publicKey,
      userFarm,
      new anchor.web3.PublicKey(getLendingFarmProgramId()),
      new anchor.BN(obligationIdx) // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
    );

  const solfarmVaultProgramId = new anchor.web3.PublicKey(
    farm.platform === FARM_PLATFORMS.ORCA ?
      getOrcaVaultProgramId() : getVaultProgramId()
  );

  const [leveragedFarm] = await findLeveragedFarmAddress(
    solfarmVaultProgramId,
    new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).serum_market
    ),
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(farm.marginIndex)
  );

  const lendingProgramId = new anchor.web3.PublicKey(getLendingProgramId());

  const lendingMarketAccount = new anchor.web3.PublicKey(
    getLendingMarketAccount()
  );

  const [derivedLendingMarketAuthority] =
    await anchor.web3.PublicKey.findProgramAddress(
      [lendingMarketAccount.toBytes()],
      lendingProgramId
    );

  let requestQueue = decoded.requestQueue;
  let eventQueue = decoded.eventQueue;
  let marketBids = decoded.bids;
  let marketAsks = decoded.asks;
  let baseVault = decoded.baseVault;
  let quoteVault = decoded.quoteVault;

  if (farm.platform === FARM_PLATFORMS.ORCA) {
    baseVault = new anchor.web3.PublicKey(
      getOrcaFarmPoolCoinTokenaccount(assetSymbol)
    );
    quoteVault = new anchor.web3.PublicKey(
      getOrcaFarmPoolPcTokenaccount(assetSymbol)
    );
    requestQueue = new anchor.web3.PublicKey(
      '11111111111111111111111111111111'
    );
  }

  let marketAccountsBids = {
    market: serumMarketKey,
    requestQueue: requestQueue,
    eventQueue: eventQueue,
    bids: marketBids,
    asks: marketAsks,
    coinVault: baseVault,
    pcVault: quoteVault,
    vaultSigner: serumMarketVaultSigner,
    openOrders: openOrdersAccountFarm,
    orderPayerTokenAccount: new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).farm_base_token_account
    ),
    coinWallet: new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).farm_base_token_account
    )
  };

  let txn;
  const [userPositionInfoAddress] = await derivePositionInfoAddress(
    userFarm,
    vaultProgramId,
    new anchor.BN(obligationIdx)
  );

  switch (farm.platform) {
    case FARM_PLATFORMS.RAYDIUM: {
      let remainingAccounts = [
        { pubkey: lendingMarketAccount, isWritable: true, isSigner: false },
        {
          pubkey: derivedLendingMarketAuthority,
          isWritable: true,
          isSigner: false
        },
        { pubkey: lendingProgramId, isWritable: false, isSigner: false },
        { pubkey: userPositionInfoAddress, isWritable: true, isSigner: false }
      ];

      txn = await vaultProgram.transaction.swapTokensRaydiumStats(
        new anchor.BN(obligationIdx),
        {
          accounts: {
            authority: provider.wallet.publicKey,
            leveragedFarm: leveragedFarm,
            userFarm: userFarm,
            userFarmObligation: userObligationAcct1,
            tokenProgram: splToken.TOKEN_PROGRAM_ID,
            vaultSigner: leveragedFarm,
            swapOrLiquidityProgramId: new anchor.web3.PublicKey(
              LIQUIDITY_POOL_PROGRAM_ID_V4
            ),
            ammId: new anchor.web3.PublicKey(
              lendingFarmAccount.raydium_amm_id
            ),
            ammAuthority: new anchor.web3.PublicKey(
              lendingFarmAccount.raydium_amm_authority
            ),
            ammOpenOrders: new anchor.web3.PublicKey(
              lendingFarmAccount.raydium_amm_open_orders
            ),
            ammQuantitiesOrTargetOrders: new anchor.web3.PublicKey(
              lendingFarmAccount.raydium_amm_quantities_or_target_orders
            ),
            poolCoinTokenaccount: new anchor.web3.PublicKey(
              lendingFarmAccount.raydium_coin_token_account
            ),
            poolPcTokenaccount: new anchor.web3.PublicKey(
              lendingFarmAccount.raydium_pc_token_account
            ),
            serumProgramId: dexProgramId,
            serumMarket: serumMarketKey,
            serumBids: marketBids,
            serumAsks: marketAsks,
            serumEventQueue: eventQueue,
            serumCoinVaultAccount: baseVault,
            serumPcVaultAccount: quoteVault,
            serumVaultSigner: serumMarketVaultSigner,
            coinWallet: new anchor.web3.PublicKey(
              getLendingFarmAccount(assetSymbol).farm_base_token_account
            ),
            pcWallet: new anchor.web3.PublicKey(
              getLendingFarmAccount(assetSymbol).farm_quote_token_account
            )
          },
          remainingAccounts: remainingAccounts
        }
      );
      break;
    }

    case FARM_PLATFORMS.ORCA: {
      let remainingAccounts = [
        {
          isSigner: false,
          isWritable: true,
          pubkey: new anchor.web3.PublicKey(
            getLendingFarmAccount(assetSymbol).serum_fee_recipient
          )
        },
        { pubkey: lendingMarketAccount, isWritable: true, isSigner: false },
        {
          pubkey: derivedLendingMarketAuthority,
          isWritable: true,
          isSigner: false
        },
        { pubkey: lendingProgramId, isWritable: false, isSigner: false },
        {
          pubkey: new anchor.web3.PublicKey(
            getOrcaLpMintAddress(assetSymbol)
          ),
          isWritable: true,
          isSigner: false
        },
        { pubkey: userPositionInfoAddress, isWritable: true, isSigner: false }
      ];

      txn = await vaultProgram.transaction.swapTokensOrcaStats(
        new anchor.BN(obligationIdx),
        {
          accounts: {
            authority: provider.wallet.publicKey,
            leveragedFarm: leveragedFarm,
            userFarm: userFarm,
            userFarmObligation: userObligationAcct1,
            pcWallet: new anchor.web3.PublicKey(
              getLendingFarmAccount(assetSymbol).farm_quote_token_account
            ),
            market: marketAccountsBids,
            tokenProgram: splToken.TOKEN_PROGRAM_ID,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            dexProgram: dexProgramId,
            vaultSigner: serumMarketVaultSigner
          },
          remainingAccounts: remainingAccounts
        }
      );
      break;
    }

    // Someday
    case FARM_PLATFORMS.SABER: {
      break;
    }

    default: break;
  }

  return txn;
}

async function _addLiquidity ({
  assetSymbol,
  obligationIdx,
  checkLpTokenAccount = false,
  wallet
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
    });

  anchor.setProvider(provider);

  // Address of the deployed program.
  const vaultProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());

  // Generate the program client from IDL.
  const vaultProgram = new anchor.Program(leverageIdl, vaultProgramId);

  const farm = getFarmBySymbol(assetSymbol);

  const [userFarm] = await findUserFarmAddress(
    provider.wallet.publicKey,
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(0),
    new anchor.BN(farm.marginIndex)
  );

  // console.log('user farm address', userFarm.toBase58());

  const solfarmVaultProgramId = new anchor.web3.PublicKey(
    farm.platform === FARM_PLATFORMS.ORCA ?
      getOrcaVaultProgramId() :
      getVaultProgramId()
  );

  const [leveragedFarm] = await findLeveragedFarmAddress(
    solfarmVaultProgramId,
    new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).serum_market
    ),
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(farm.marginIndex)
  );

  const [userObligationAcct1] =
    await findUserFarmObligationAddress(
      provider.wallet.publicKey,
      userFarm,
      new anchor.web3.PublicKey(getLendingFarmProgramId()),
      new anchor.BN(obligationIdx) // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
    );

  const lendingProgramId = new anchor.web3.PublicKey(getLendingProgramId());

  const lendingMarketAccount = new anchor.web3.PublicKey(
    getLendingMarketAccount()
  );

  const [derivedLendingMarketAuthority] =
    await anchor.web3.PublicKey.findProgramAddress(
      [lendingMarketAccount.toBytes()],
      lendingProgramId
    );

  const serumMarketKey = new anchor.web3.PublicKey(
    getLendingFarmAccount(assetSymbol).serum_market
  );
  const serumMarketVaultSigner = new anchor.web3.PublicKey(
    getVaultSerumVaultSigner(assetSymbol)
  );

  let [obligationVaultAccount] =
    await findObligationVaultAddress(
      userFarm,
      new anchor.BN(obligationIdx), // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
      new anchor.web3.PublicKey(getLendingFarmProgramId())
    );

  const obligationLpTokenAccount = await serumAssoToken.createAssociatedTokenAccount(
    provider,
    obligationVaultAccount,
    new anchor.web3.PublicKey(farm.mintAddress)
  );

  let dexProgramId = new anchor.web3.PublicKey(
    getLendingFarmAccount(assetSymbol).serum_dex_program // lendingInfo -> farm -> accounts -> serumDexProgram
  );

  const txn = new anchor.web3.Transaction();

  if (checkLpTokenAccount) {
    const [obligationLPTokenAccountInfo] = await getMultipleAccounts(
      window.$web3,
      [obligationLpTokenAccount],
      commitment
    );

    if (!obligationLPTokenAccountInfo) {
      txn.add(
        await serumAssoToken.createAssociatedTokenAccount(
          provider.wallet.publicKey,
          obligationVaultAccount,
          new anchor.web3.PublicKey(farm.mintAddress)
        )
      );
    }
  }

  const [userPositionInfoAddress] = await derivePositionInfoAddress(
    userFarm,
    vaultProgramId,
    new anchor.BN(obligationIdx)
  );

  txn.add(
    vaultProgram.instruction.addLiquidityStats(new anchor.BN(obligationIdx), {
      accounts: {
        authority: provider.wallet.publicKey,
        userFarm: userFarm,
        leveragedFarm: leveragedFarm,
        liquidityProgramId: new anchor.web3.PublicKey(
          getLendingFarmAccount(assetSymbol).raydium_liquidity_program
        ),
        ammId: new anchor.web3.PublicKey(
          getLendingFarmAccount(assetSymbol).raydium_amm_id
        ),
        ammAuthority: new anchor.web3.PublicKey(
          getLendingFarmAccount(assetSymbol).raydium_amm_authority
        ),
        ammOpenOrders: new anchor.web3.PublicKey(
          getLendingFarmAccount(assetSymbol).raydium_amm_open_orders
        ),
        ammQuantitiesOrTargetOrders: new anchor.web3.PublicKey(
          getLendingFarmAccount(
            assetSymbol
          ).raydium_amm_quantities_or_target_orders
        ),
        lpMintAddress: new anchor.web3.PublicKey(
          getLendingFarmAccount(assetSymbol).raydium_lp_mint_address
        ),
        poolCoinTokenAccount: new anchor.web3.PublicKey(
          getLendingFarmAccount(assetSymbol).raydium_coin_token_account
        ),
        poolPcTokenAccount: new anchor.web3.PublicKey(
          getLendingFarmAccount(assetSymbol).raydium_pc_token_account
        ),
        poolWithdrawQueue: new anchor.web3.PublicKey(
          getLendingFarmAccount(assetSymbol).raydium_pool_withdraw_queue
        ),
        serumMarket: serumMarketKey,
        serumVaultSigner: serumMarketVaultSigner,
        tokenProgram: splToken.TOKEN_PROGRAM_ID,
        levFarmCoinTokenAccount: new anchor.web3.PublicKey(
          getLendingFarmAccount(assetSymbol).farm_base_token_account
        ),
        levFarmPcTokenAccount: new anchor.web3.PublicKey(
          getLendingFarmAccount(assetSymbol).farm_quote_token_account
        ),
        userLpTokenAccount: obligationLpTokenAccount,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        pythPriceAccount: new anchor.web3.PublicKey(
          getPriceFeedsForReserve(assetSymbol).price_account
        ),
        lendingMarketAccount: lendingMarketAccount,
        userFarmObligation: userObligationAcct1,
        derivedLendingMarketAuthority: derivedLendingMarketAuthority,
        lendingProgram: lendingProgramId,
        dexProgram: dexProgramId
      },
      remainingAccounts: [
        {
          isSigner: false,
          isWritable: true,
          pubkey: userPositionInfoAddress
        }
      ]
    })
  );

  return txn;
}

async function _depositMarginLpTokens ({
  wallet,
  assetSymbol,
  obligationIdx,
  userFarmInfo
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
    });

  anchor.setProvider(provider);

  // Address of the deployed program.
  const vaultProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());

  // Generate the program client from IDL.
  const vaultProgram = new anchor.Program(leverageIdl, vaultProgramId);

  const farm = getFarmBySymbol(assetSymbol);

  let [userFarm] = await findUserFarmAddress(
    provider.wallet.publicKey,
    new anchor.web3.PublicKey(getLendingFarmProgramId()), // lending_info.json -> programs -> farm -> id
    new anchor.BN(0),
    new anchor.BN(farm.marginIndex)
  );

  let [obligationVaultAccount] = await findObligationVaultAddress(
    userFarm,
    new anchor.BN(obligationIdx), // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
    new anchor.web3.PublicKey(getLendingFarmProgramId())
  );

  let [userObligationAcct1] = await findUserFarmObligationAddress(
    provider.wallet.publicKey,
    userFarm,
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(obligationIdx) // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
  );

  const vaultAccount = new anchor.web3.PublicKey(
    getVaultAccount(assetSymbol)
  );
  const vaultPdaAccount = new anchor.web3.PublicKey(
    getVaultPdaAccount(assetSymbol)
  );

  const solfarmVaultProgramId = new anchor.web3.PublicKey(
    farm.platform === FARM_PLATFORMS.ORCA ?
      getOrcaVaultProgramId() : getVaultProgramId()
  );

  const lendingProgramId = new anchor.web3.PublicKey(getLendingProgramId());

  const [leveragedFarm] = await findLeveragedFarmAddress(
    solfarmVaultProgramId,
    new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).serum_market
    ),
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(farm.marginIndex)
  );

  const lendingMarketAccount = new anchor.web3.PublicKey(
    getLendingMarketAccount()
  );

  const [derivedLendingMarketAuthority] =
    await anchor.web3.PublicKey.findProgramAddress(
      [lendingMarketAccount.toBytes()],
      lendingProgramId
    );

  const userFarmManagerLpTokenAccount = await serumAssoToken.createAssociatedTokenAccount(
    provider,
    obligationVaultAccount,
    new anchor.web3.PublicKey(farm.mintAddress)
  );

  let txn;

  switch (farm.platform) {
    case FARM_PLATFORMS.RAYDIUM: {
      const vaultInfoAccountPda = new anchor.web3.PublicKey(
        getVaultInfoAccount(assetSymbol)
      );

      const vaultLpTokenAccount = await serumAssoToken.createAssociatedTokenAccount(
        provider,
        vaultPdaAccount,
        new anchor.web3.PublicKey(
          getLendingFarmAccount(assetSymbol).raydium_lp_mint_address
        )
      );

      let [userFarmManagerVaultBalanceAccount, nonce3] =
        await anchor.web3.PublicKey.findProgramAddress(
          [
            new anchor.web3.PublicKey(
              getVaultOldInfoAccount(assetSymbol)
            ).toBytes(),
            obligationVaultAccount.toBuffer()
          ],
          solfarmVaultProgramId
        );
      const vaultBalanceNonce = nonce3;
      let [userFarmManagerVaultBalanceMetadataAccount, nonce4] =
        await anchor.web3.PublicKey.findProgramAddress(
          [
            userFarmManagerVaultBalanceAccount.toBuffer(),
            obligationVaultAccount.toBuffer()
          ],
          solfarmVaultProgramId
        );
      const vaultMetaNonce = nonce4;

      const depositAccounts = {
        authority: provider.wallet.publicKey,
        userFarm: userFarm,
        obligationVaultAddress: obligationVaultAccount,
        leveragedFarm: leveragedFarm,
        vaultProgram: solfarmVaultProgramId,
        vault: vaultAccount,
        lpTokenAccount: vaultLpTokenAccount,

        // todo(bonedaddy): set to the correct one
        authorityTokenAccount: userFarmManagerLpTokenAccount,

        // need to figure these out from raydium
        stakeProgramId: new anchor.web3.PublicKey(
          getFarmProgramId(assetSymbol)
        ),
        vaultPdaAccount: vaultPdaAccount,

        // need to figure these out from raydium
        poolId: new anchor.web3.PublicKey(getFarmPoolId(assetSymbol)),
        poolAuthority: new anchor.web3.PublicKey(
          getFarmPoolAuthority(assetSymbol)
        ),
        userInfoAccount: vaultInfoAccountPda,

        // userLpTokenAccount: vaultLpTokenAccount,
        poolLpTokenAccount: new anchor.web3.PublicKey(
          getFarmPoolLpTokenAccount(assetSymbol)
        ),

        // since this is for a non-fusion pool reward use the same address
        userRewardATokenAccount: new anchor.web3.PublicKey(
          getVaultRewardAccountA(assetSymbol)
        ),
        poolRewardATokenAccount: new anchor.web3.PublicKey(
          getFarmPoolRewardATokenAccount(assetSymbol)
        ),
        userRewardBTokenAccount: new anchor.web3.PublicKey(
          getVaultRewardAccountA(assetSymbol)
        ),
        poolRewardBTokenAccount: new anchor.web3.PublicKey(
          getFarmPoolRewardBTokenAccount(assetSymbol)
        ),
        userBalanceAccount: userFarmManagerVaultBalanceAccount,
        userBalanceMetadata: userFarmManagerVaultBalanceMetadataAccount,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        tokenProgramId: serum.TokenInstructions.TOKEN_PROGRAM_ID,
        systemProgram: new anchor.web3.PublicKey(
          '11111111111111111111111111111111'
        ),
        rent: anchor.web3.SYSVAR_RENT_PUBKEY
      };

      if (getFarmFusion(assetSymbol)) {
        depositAccounts.userRewardBTokenAccount = new anchor.web3.PublicKey(
          getVaultRewardAccountB(assetSymbol)
        );
      }

      txn = await vaultProgram.transaction.depositVault(
        {
          nonce: vaultBalanceNonce,
          metaNonce: vaultMetaNonce
        },
        new anchor.BN(obligationIdx),
        {
          accounts: depositAccounts,
          remainingAccounts: [
            {
              pubkey: lendingMarketAccount,
              isWritable: true,
              isSigner: false
            },
            {
              pubkey: userObligationAcct1,
              isWritable: true,
              isSigner: false
            },
            {
              pubkey: derivedLendingMarketAuthority,
              isWritable: true,
              isSigner: false
            },
            { pubkey: lendingProgramId, isWritable: false, isSigner: false }
          ]
        }
      );

      break;
    }
    case FARM_PLATFORMS.ORCA: {
      let [orcaVaultUserAccountAddress, orcaVaultUserAccountNonce] =
        await deriveVaultUserAccount(
          new anchor.web3.PublicKey(getOrcaVaultAccount(assetSymbol)),
          obligationVaultAccount,
          solfarmVaultProgramId
        );

      let vaultBaseTokenAccount =
        await serumAssoToken.getAssociatedTokenAddress(
          vaultPdaAccount,
          new anchor.web3.PublicKey(getOrcaVaultLpMint(assetSymbol))
        );
      let vaultFarmTokenAccount =
        await serumAssoToken.getAssociatedTokenAddress(
          vaultPdaAccount,
          new anchor.web3.PublicKey(getOrcaVaultFarmMint(assetSymbol))
        );
      let vaultRewardTokenAccount =
        await serumAssoToken.getAssociatedTokenAddress(
          vaultPdaAccount,
          new anchor.web3.PublicKey(getOrcaVaultRewardMint(assetSymbol))
        );

      let orcaGlobalFarm = new anchor.web3.PublicKey(
        getOrcaVaultGlobalFarm(assetSymbol)
      );

      let [orcaUserFarm] = await findOrcaUserFarmAddress(
        orcaGlobalFarm,
        vaultPdaAccount,
        TOKEN_PROGRAM_ID,
        AQUAFARM_PROGRAM_ID
      );

      const depositAccounts = {
        authority: provider.wallet.publicKey,
        vaultAccount: vaultAccount,
        vaultUserAccount: orcaVaultUserAccountAddress,
        tokenProgram: serum.TokenInstructions.TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        vaultPda: vaultPdaAccount,
        systemProgram: new anchor.web3.PublicKey(
          '11111111111111111111111111111111'
        ),
        userFarmOwner: vaultPdaAccount,
        userTransferAuthority: vaultPdaAccount,
        userBaseTokenAccount: vaultBaseTokenAccount,
        userFarmTokenAccount: vaultFarmTokenAccount,
        userRewardTokenAccount: vaultRewardTokenAccount,
        globalBaseTokenVault: new anchor.web3.PublicKey(
          getOrcaVaultGlobalBaseTokenVault(assetSymbol)
        ),
        farmTokenMint: new anchor.web3.PublicKey(
          getOrcaVaultFarmMint(assetSymbol)
        ),
        globalFarm: orcaGlobalFarm,
        orcaUserFarm: orcaUserFarm,
        globalRewardTokenVault: new anchor.web3.PublicKey(
          getOrcaVaultGlobalRewardTokenVault(assetSymbol)
        ),
        convertAuthority: new anchor.web3.PublicKey(
          getOrcaVaultConvertAuthority(assetSymbol)
        ),
        aquaFarmProgram: AQUAFARM_PROGRAM_ID,
        fundingTokenAccount: userFarmManagerLpTokenAccount,
        solfarmVaultProgram: solfarmVaultProgramId,
        leveragedFarm: leveragedFarm,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        obligationVaultAddress: obligationVaultAccount,
        leveragedUserFarm: userFarm
      };

      // console.log("$$ orca accounts", depositAccounts);
      txn = await vaultProgram.transaction.depositOrcaVault(
        {
          accountNonce: orcaVaultUserAccountNonce
        },
        new anchor.BN(obligationIdx),
        {
          accounts: depositAccounts,
          remainingAccounts: [
            {
              pubkey: lendingMarketAccount,
              isWritable: true,
              isSigner: false
            },
            {
              pubkey: userObligationAcct1,
              isWritable: true,
              isSigner: false
            },
            {
              pubkey: derivedLendingMarketAuthority,
              isWritable: true,
              isSigner: false
            },
            { pubkey: lendingProgramId, isWritable: false, isSigner: false }
          ]
        }
      );

      break;
    }

    // Someday
    case FARM_PLATFORMS.SABER: {
      break;
    }

    default: break;
  }

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

  const tokenAccounts = await getTokenAccounts({ connection, wallet });

  if (!isUserFarmValid) {
    createAccounts = true;
    obligationIdx = 0;

    const createUserFarmManagerTxn = _createUserFarm({
      tokenAccounts,
      obligationIdx,
      assetSymbol: symbol
    });

    transactions.push(createUserFarmManagerTxn);
    extraSigners.push([]);
  }
  else if (obligations[obligationIdx].obligationAccount.toBase58() === '11111111111111111111111111111111') {
    createAccounts = true;

    transactions.push(
      _createUserFarmObligation({
        obligationIdx,
        wallet,
        tokenAccounts,
        assetSymbol: symbol
      })
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
  }
  else if (obligationPositionState.hasOwnProperty('borrowed')) {
    obligationProgress = 2;
  }
  else if (obligationPositionState.hasOwnProperty('swapped')) {
    obligationProgress = 3;
  }
  else if (obligationPositionState.hasOwnProperty('addedLiquidity')) {
    obligationProgress = 4;
  }
  else if (
    obligationPositionState.hasOwnProperty('depositedOrcaAquaFarm')
  ) {
    obligationProgress = 5;
  }

  // console.log("$$$ progress", obligationProgress);
  if (!createAccounts && obligationProgress < 4) {
    // console.log("$$$ create open orders");
    transactions.push(
      _createOpenOrdersAccount({
        assetSymbol: symbol,
        obligationIdx,
        wallet,
        tokenAccounts
      })
    );
    extraSigners.push([]);
  }
  if (obligationProgress > 0 && obligationProgress < 2) {
    const [depositBorrowTxn, signer] = await _depositBorrow({
      assetSymbol: symbol,
      coinBorrowAmount,
      pcBorrowAmount,
      baseTokenAmount,
      quoteTokenAmount,
      obligationIdx,
      wallet,
      connection,
      userFarmInfo
    });

    transactions.push(depositBorrowTxn);
    extraSigners.push(signer);
  }

  if (obligationProgress > 0 && obligationProgress < 3) {
    transactions.push(_swapTokens({
      wallet,
      obligationIdx,
      assetSymbol: symbol
    }));

    extraSigners.push([]);
  }

  if (obligationProgress > 0 && obligationProgress < 4) {
    transactions.push(_addLiquidity({
      wallet,
      obligationIdx,
      assetSymbol: symbol
    }));

    extraSigners.push([]);
  }

  if (getOrcaFarmDoubleDip(symbol)) {
    // @TODO: t0uristx to fix this by adding the orca functions back again.
    //
    // if (obligationProgress > 0 && obligationProgress < 5) {
    //   transactions.push(
    //     this.depositOrcaWithoutShares(assetSymbol, obligationIdx)
    //   );
    //   extraSigners.push([]);
    // }

    // if (obligationProgress > 0 && obligationProgress < 6) {
    //   transactions.push(
    //     this.depositOrcaDoubleDip(assetSymbol, obligationIdx)
    //   );
    //   extraSigners.push([]);
    // }
  }
  else if (obligationProgress > 0 && obligationProgress < 5) {
    transactions.push(
      _depositMarginLpTokens({
        assetSymbol: symbol,
        obligationIdx,
        wallet,
        userFarmInfo,
        tokenAccounts
      })
    );
    extraSigners.push([]);
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
    );
  });
};

export { openMarginPosition };
