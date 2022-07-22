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
  getLendingReserveFromKey,
  getOrcaFarmDoubleDip,
  getOrcaFarmPoolCoinTokenaccount,
  getOrcaFarmPoolPcTokenaccount,
  getOrcaLpMintAddress,
  getOrcaVaultAccount,
  getOrcaVaultConvertAuthority,
  getOrcaVaultConvertAuthorityDd,
  getOrcaVaultDdFarmMint,
  getOrcaVaultDdRewardMint,
  getOrcaVaultFarmMint,
  getOrcaVaultFeeAccount,
  getOrcaVaultGlobalBaseTokenVault,
  getOrcaVaultGlobalDdBaseTokenVault,
  getOrcaVaultGlobalFarm,
  getOrcaVaultGlobalFarmDd,
  getOrcaVaultGlobalRewardTokenVault,
  getOrcaVaultGlobalRewardTokenVaultDd,
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

import {
  ACCOUNT_LAYOUT,
  LENDING_OBLIGATION_LAYOUT,
  LENDING_OBLIGATION_LIQUIDITY,
  LENDING_RESERVE_LAYOUT,
  WAD
} from '../utils/layouts';
import { getReserveByName } from '../utils/lendingUtils';
import leverageIdl from '../constants/leverage_idl.json';
import { find, findIndex, get, isNil, map, slice } from 'lodash';
import { commitment, getMultipleAccounts, sendAllTransactions, createAssociatedTokenAccount } from '../utils/web3';
import { TOKENS } from '../constants/tokens';
import { getFarmBySymbol, getTokenAccounts, isMintAddressExisting } from '../utils/farmUtils';
import { AQUAFARM_PROGRAM_ID, LIQUIDITY_POOL_PROGRAM_ID_V4, TOKEN_PROGRAM_ID } from '../constants/ids';
import { deriveVaultDepositQueue, deriveVaultUserAccount } from '../utils/vault';
import { TokenAmount } from '../utils/safe-math';
import { CLOSE_POSITION_OPTIONS } from '../constants/leverageFarmingConstants';
import { LENDING_RESERVES } from '../constants/lendingReserves';
import { FARM_PLATFORMS } from '../constants';

async function _createUserFarm ({
  wallet,
  tokenAccounts,
  assetSymbol,
  obligationIdx,
  connection
}) {
  let anchor = anchorold;

  const walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58())
    },
    provider = new anchor.Provider(connection, walletToInitialize, {
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
      connection,
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
  const derivedTulipTokenAccount = await createAssociatedTokenAccount(
    provider,
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
  connection,
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
    provider = new anchor.Provider(connection, walletToInitialize, {
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
      connection,
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
  connection,
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
    provider = new anchor.Provider(connection, walletToInitialize, {
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
    connection,
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
  connection,
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
    provider = new anchor.Provider(connection, walletToInitialize, {
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
    !isMintAddressExisting(tokenAccounts, baseToken.mintAddress)
  ) {
    coinSourceTokenAccount = await createAssociatedTokenAccount(
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
    !isMintAddressExisting(tokenAccounts, quoteToken.mintAddress)
  ) {
    pcSourceTokenAccount = await createAssociatedTokenAccount(
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
      await connection.getMinimumBalanceForRentExemption(
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
      await connection.getMinimumBalanceForRentExemption(
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
  connection,
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
    provider = new anchor.Provider(connection, walletToInitialize, {
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

// async function _addLiquidity ({
//   connection,
//   assetSymbol,
//   obligationIdx,
//   checkLpTokenAccount = false,
//   wallet
// }) {
//   let anchor = anchorold;

//   const walletToInitialize = {
//       signTransaction: wallet.signTransaction,
//       signAllTransactions: wallet.signAllTransactions,
//       publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58())
//     },
//     provider = new anchor.Provider(connection, walletToInitialize, {
//       skipPreflight: true,
//       preflightCommitment: commitment
//     });

//   anchor.setProvider(provider);

//   // Address of the deployed program.
//   const vaultProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());

//   // Generate the program client from IDL.
//   const vaultProgram = new anchor.Program(leverageIdl, vaultProgramId);

//   const farm = getFarmBySymbol(assetSymbol);

//   const [userFarm] = await findUserFarmAddress(
//     provider.wallet.publicKey,
//     new anchor.web3.PublicKey(getLendingFarmProgramId()),
//     new anchor.BN(0),
//     new anchor.BN(farm.marginIndex)
//   );

//   // console.log('user farm address', userFarm.toBase58());

//   const solfarmVaultProgramId = new anchor.web3.PublicKey(
//     farm.platform === FARM_PLATFORMS.ORCA ?
//       getOrcaVaultProgramId() :
//       getVaultProgramId()
//   );

//   const [leveragedFarm] = await findLeveragedFarmAddress(
//     solfarmVaultProgramId,
//     new anchor.web3.PublicKey(
//       getLendingFarmAccount(assetSymbol).serum_market
//     ),
//     new anchor.web3.PublicKey(getLendingFarmProgramId()),
//     new anchor.BN(farm.marginIndex)
//   );

//   const [userObligationAcct1] =
//     await findUserFarmObligationAddress(
//       provider.wallet.publicKey,
//       userFarm,
//       new anchor.web3.PublicKey(getLendingFarmProgramId()),
//       new anchor.BN(obligationIdx) // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
//     );

//   const lendingProgramId = new anchor.web3.PublicKey(getLendingProgramId());

//   const lendingMarketAccount = new anchor.web3.PublicKey(
//     getLendingMarketAccount()
//   );

//   const [derivedLendingMarketAuthority] =
//     await anchor.web3.PublicKey.findProgramAddress(
//       [lendingMarketAccount.toBytes()],
//       lendingProgramId
//     );

//   const serumMarketKey = new anchor.web3.PublicKey(
//     getLendingFarmAccount(assetSymbol).serum_market
//   );
//   const serumMarketVaultSigner = new anchor.web3.PublicKey(
//     getVaultSerumVaultSigner(assetSymbol)
//   );

//   let [obligationVaultAccount] =
//     await findObligationVaultAddress(
//       userFarm,
//       new anchor.BN(obligationIdx), // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
//       new anchor.web3.PublicKey(getLendingFarmProgramId())
//     );

//   const obligationLpTokenAccount = await createAssociatedTokenAccount(
//     provider,
//     obligationVaultAccount,
//     new anchor.web3.PublicKey(farm.mintAddress)
//   );

//   let dexProgramId = new anchor.web3.PublicKey(
//     getLendingFarmAccount(assetSymbol).serum_dex_program // lendingInfo -> farm -> accounts -> serumDexProgram
//   );

//   const txn = new anchor.web3.Transaction();

//   if (checkLpTokenAccount) {
//     const [obligationLPTokenAccountInfo] = await getMultipleAccounts(
//       connection,
//       [obligationLpTokenAccount],
//       commitment
//     );

//     if (!obligationLPTokenAccountInfo) {
//       txn.add(
//         await serumAssoToken.createAssociatedTokenAccount(
//           provider.wallet.publicKey,
//           obligationVaultAccount,
//           new anchor.web3.PublicKey(farm.mintAddress)
//         )
//       );
//     }
//   }

//   const [userPositionInfoAddress] = await derivePositionInfoAddress(
//     userFarm,
//     vaultProgramId,
//     new anchor.BN(obligationIdx)
//   );

//   if (obligationProgress < 3) {
//     const swapTokenTxn = await _swapTokens({
//       wallet,
//       connection,
//       tokenAccounts,
//       assetSymbol,
//       obligationIdx
//     });

//     txn.add(swapTokenTxn);
//   }

//   txn.add(
//     vaultProgram.instruction.addLiquidityStats(new anchor.BN(obligationIdx), {
//       accounts: {
//         authority: provider.wallet.publicKey,
//         userFarm: userFarm,
//         leveragedFarm: leveragedFarm,
//         liquidityProgramId: new anchor.web3.PublicKey(
//           getLendingFarmAccount(assetSymbol).raydium_liquidity_program
//         ),
//         ammId: new anchor.web3.PublicKey(
//           getLendingFarmAccount(assetSymbol).raydium_amm_id
//         ),
//         ammAuthority: new anchor.web3.PublicKey(
//           getLendingFarmAccount(assetSymbol).raydium_amm_authority
//         ),
//         ammOpenOrders: new anchor.web3.PublicKey(
//           getLendingFarmAccount(assetSymbol).raydium_amm_open_orders
//         ),
//         ammQuantitiesOrTargetOrders: new anchor.web3.PublicKey(
//           getLendingFarmAccount(
//             assetSymbol
//           ).raydium_amm_quantities_or_target_orders
//         ),
//         lpMintAddress: new anchor.web3.PublicKey(
//           getLendingFarmAccount(assetSymbol).raydium_lp_mint_address
//         ),
//         poolCoinTokenAccount: new anchor.web3.PublicKey(
//           getLendingFarmAccount(assetSymbol).raydium_coin_token_account
//         ),
//         poolPcTokenAccount: new anchor.web3.PublicKey(
//           getLendingFarmAccount(assetSymbol).raydium_pc_token_account
//         ),
//         poolWithdrawQueue: new anchor.web3.PublicKey(
//           getLendingFarmAccount(assetSymbol).raydium_pool_withdraw_queue
//         ),
//         serumMarket: serumMarketKey,
//         serumVaultSigner: serumMarketVaultSigner,
//         tokenProgram: splToken.TOKEN_PROGRAM_ID,
//         levFarmCoinTokenAccount: new anchor.web3.PublicKey(
//           getLendingFarmAccount(assetSymbol).farm_base_token_account
//         ),
//         levFarmPcTokenAccount: new anchor.web3.PublicKey(
//           getLendingFarmAccount(assetSymbol).farm_quote_token_account
//         ),
//         userLpTokenAccount: obligationLpTokenAccount,
//         clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
//         pythPriceAccount: new anchor.web3.PublicKey(
//           getPriceFeedsForReserve(assetSymbol).price_account
//         ),
//         lendingMarketAccount: lendingMarketAccount,
//         userFarmObligation: userObligationAcct1,
//         derivedLendingMarketAuthority: derivedLendingMarketAuthority,
//         lendingProgram: lendingProgramId,
//         dexProgram: dexProgramId
//       },
//       remainingAccounts: [
//         {
//           isSigner: false,
//           isWritable: true,
//           pubkey: userPositionInfoAddress
//         }
//       ]
//     })
//   );

//   return txn;
// }

async function _addLiquidity ({
  wallet,
  connection,
  tokenAccounts,
  assetSymbol,
  obligationIdx,
  obligationProgress,
  checkLpTokenAccount = false
}) {
  let anchor = anchorold;

  const walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58())
    },
    provider = new anchor.Provider(connection, walletToInitialize, {
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

  const obligationLpTokenAccount = await createAssociatedTokenAccount(
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
      connection,
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

  if (obligationProgress < 3) {
    const swapTokenTxn = await _swapTokens({
      connection,
      wallet,
      tokenAccounts,
      obligationIdx,
      assetSymbol
    });

    txn.add(swapTokenTxn);
  }

  switch (farm.platform) {
    case FARM_PLATFORMS.RAYDIUM: {
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

      break;
    }

    case FARM_PLATFORMS.ORCA: {
      const [orcaVaultUserAccountAddress, orcaVaultUserAccountNonce] =
          await deriveVaultUserAccount(
            new anchor.web3.PublicKey(getOrcaVaultAccount(assetSymbol)),
            obligationVaultAccount,
            solfarmVaultProgramId
          );
      const vaultPdaAccount = new anchor.web3.PublicKey(
        getVaultPdaAccount(assetSymbol)
      );

      const [vaultDepositQueue] = await deriveVaultDepositQueue(vaultPdaAccount, solfarmVaultProgramId);

      const vaultAccount = new anchor.web3.PublicKey(
        getVaultAccount(assetSymbol)
      );

      txn.add(
        vaultProgram.instruction.orcaAddLiquidityQueue(
          {
            accountNonce: orcaVaultUserAccountNonce,
            obligationIndex: new anchor.BN(obligationIdx)
          }, {
            accounts: {
              authority: provider.wallet.publicKey,
              userFarm: userFarm,
              leveragedFarm: leveragedFarm,
              vaultAccount: vaultAccount,
              vaultUserAccount: orcaVaultUserAccountAddress,
              tokenProgram: splToken.TOKEN_PROGRAM_ID,
              rent: anchor.web3.SYSVAR_RENT_PUBKEY,
              vaultPda: vaultPdaAccount,
              systemProgram: anchor.web3.SystemProgram.programId,
              levFarmCoinTokenAccount: new anchor.web3.PublicKey(
                getLendingFarmAccount(assetSymbol).farm_base_token_account
              ),
              levFarmPcTokenAccount: new anchor.web3.PublicKey(
                getLendingFarmAccount(assetSymbol).farm_quote_token_account
              ),
              poolCoinTokenAccount: new anchor.web3.PublicKey(
                getLendingFarmAccount(assetSymbol).raydium_coin_token_account
              ),
              poolPcTokenAccount: new anchor.web3.PublicKey(
                getLendingFarmAccount(assetSymbol).raydium_pc_token_account
              ),
              liquidityProgramId: new anchor.web3.PublicKey(
                getLendingFarmAccount(assetSymbol).raydium_liquidity_program
              ),
              ammId: new anchor.web3.PublicKey(
                getLendingFarmAccount(assetSymbol).raydium_amm_id
              ),
              ammAuthority: new anchor.web3.PublicKey(
                getLendingFarmAccount(assetSymbol).raydium_amm_authority
              ),
              vaultDepositQueue: vaultDepositQueue,
              lpMintAddress: new anchor.web3.PublicKey(
                getLendingFarmAccount(assetSymbol).raydium_lp_mint_address
              ),
              lendingMarketAccount: lendingMarketAccount,
              userFarmObligation: userObligationAcct1,
              derivedLendingMarketAuthority: derivedLendingMarketAuthority,
              lendingProgram: lendingProgramId,
              dexProgram: dexProgramId,
              solfarmVaultProgram: solfarmVaultProgramId,
              obligationVaultAddress: obligationVaultAccount
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

      break;
    }

    default:
      break;
  }

  return txn;
}

async function _depositMarginLpTokens ({
  connection,
  wallet,
  assetSymbol,
  obligationIdx
}) {
  let anchor = anchorold;

  const walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58())
    },
    provider = new anchor.Provider(connection, walletToInitialize, {
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

  const userFarmManagerLpTokenAccount = await createAssociatedTokenAccount(
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

      const vaultLpTokenAccount = await createAssociatedTokenAccount(
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

async function _withdrawOrcaDoubleDip ({
  wallet,
  connection,
  assetSymbol,
  obligationIdx,
  partialClose = 100,
  selectedOption = CLOSE_POSITION_OPTIONS.MINIMIZE_TRADING
}) {
  // Step 1 of 5
  let anchor = anchorold;

  const walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58())
    },
    provider = new anchor.Provider(connection, walletToInitialize, {
      skipPreflight: true,
      preflightCommitment: commitment
    });

  anchor.setProvider(provider);

  // Address of the deployed program.
  const vaultProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());

  // Generate the program client from IDL.
  const vaultProgram = new anchor.Program(leverageIdl, vaultProgramId);

  const farm = getFarmBySymbol(assetSymbol);

  const solfarmVaultProgramId = new anchor.web3.PublicKey(
    farm.platform === FARM_PLATFORMS.ORCA ?
      getOrcaVaultProgramId() :
      getVaultProgramId()
  );

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

  let txn;
  let [orcaVaultUserAccountAddress, _] = await deriveVaultUserAccount(
    new anchor.web3.PublicKey(getOrcaVaultAccount(assetSymbol)),
    obligationVaultAccount,
    solfarmVaultProgramId
  );

  let vaultFarmTokenAccount = await serumAssoToken.getAssociatedTokenAddress(
    vaultPdaAccount,
    new anchor.web3.PublicKey(getOrcaVaultFarmMint(assetSymbol))
  );
  let vaultFarmDdTokenAccount =
    await serumAssoToken.getAssociatedTokenAddress(
      vaultPdaAccount,
      new anchor.web3.PublicKey(getOrcaVaultDdFarmMint(assetSymbol))
    );

  let orcaGlobalFarmDd = new anchor.web3.PublicKey(
    getOrcaVaultGlobalFarmDd(assetSymbol)
  );

  let [orcaUserFarmDd] = await findOrcaUserFarmAddress(
    orcaGlobalFarmDd,
    vaultPdaAccount,
    TOKEN_PROGRAM_ID,
    AQUAFARM_PROGRAM_ID
  );
  const [userPositionInfoAddress] = await derivePositionInfoAddress(
    userFarm,
    vaultProgramId,
    new anchor.BN(obligationIdx)
  );

  const withdrawAccounts = {
    authority: provider.wallet.publicKey,
    vaultAccount: vaultAccount,
    vaultUserAccount: orcaVaultUserAccountAddress,
    tokenProgram: serum.TokenInstructions.TOKEN_PROGRAM_ID,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    vaultPda: vaultPdaAccount,
    systemProgram: new anchor.web3.PublicKey(
      '11111111111111111111111111111111'
    ),
    userFarmTokenAccount: vaultFarmTokenAccount,
    userFarmDdTokenAccount: vaultFarmDdTokenAccount,
    userRewardDdTokenAccount: await serumAssoToken.getAssociatedTokenAddress(
      vaultPdaAccount,
      new anchor.web3.PublicKey(getOrcaVaultDdRewardMint(assetSymbol))
    ),
    globalBaseDdTokenVault: new anchor.web3.PublicKey(
      getOrcaVaultGlobalDdBaseTokenVault(assetSymbol)
    ),
    farmDdTokenMint: new anchor.web3.PublicKey(
      getOrcaVaultDdFarmMint(assetSymbol)
    ),
    globalFarmDd: orcaGlobalFarmDd,
    userFarmDd: orcaUserFarmDd,
    globalRewardDdTokenVault: new anchor.web3.PublicKey(
      getOrcaVaultGlobalRewardTokenVaultDd(assetSymbol)
    ),
    convertAuthorityDd: new anchor.web3.PublicKey(
      getOrcaVaultConvertAuthorityDd(assetSymbol)
    ),
    aquaFarmProgram: AQUAFARM_PROGRAM_ID,
    solfarmVaultProgram: solfarmVaultProgramId,
    leveragedFarm: leveragedFarm,

    // clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    obligationVaultAddress: obligationVaultAccount,
    leveragedUserFarm: userFarm
  };

  txn = await vaultProgram.transaction.withdrawOrcaVaultDdClose(
    new anchor.BN(obligationIdx),
    new anchor.BN(partialClose),
    new anchor.BN(selectedOption),
    {
      accounts: withdrawAccounts,
      remainingAccounts: [
        { pubkey: lendingMarketAccount, isWritable: true, isSigner: false },
        { pubkey: userObligationAcct1, isWritable: true, isSigner: false },
        {
          pubkey: derivedLendingMarketAuthority,
          isWritable: true,
          isSigner: false
        },
        { pubkey: lendingProgramId, isWritable: false, isSigner: false },
        { pubkey: userPositionInfoAddress, isWritable: true, isSigner: false }
      ]
    }
  );

  return txn;
}

async function _withdrawOrcaVaultWithoutShares ({
  wallet,
  connection,
  assetSymbol,
  obligationIdx
}) {
  // Step 1 of 5
  let anchor = anchorold;

  const walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58())
    },
    provider = new anchor.Provider(connection, walletToInitialize, {
      skipPreflight: true,
      preflightCommitment: commitment
    });

  anchor.setProvider(provider);

  // Address of the deployed program.
  const vaultProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());

  // Generate the program client from IDL.
  const vaultProgram = new anchor.Program(leverageIdl, vaultProgramId);

  const farm = getFarmBySymbol(assetSymbol);

  const solfarmVaultProgramId = new anchor.web3.PublicKey(
    farm.platform === FARM_PLATFORMS.ORCA ? getOrcaVaultProgramId() : getVaultProgramId()
  );

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

  const [leveragedFarm] = await findLeveragedFarmAddress(
    solfarmVaultProgramId,
    new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).serum_market
    ),
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(farm.marginIndex)
  );

  const userFarmManagerLpTokenAccount = await createAssociatedTokenAccount(
    provider,
    obligationVaultAccount,
    new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).raydium_lp_mint_address
    )
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

  let txn;
  let [orcaVaultUserAccountAddress] = await deriveVaultUserAccount(
    new anchor.web3.PublicKey(getOrcaVaultAccount(assetSymbol)),
    obligationVaultAccount,
    solfarmVaultProgramId
  );

  let vaultBaseTokenAccount = await serumAssoToken.getAssociatedTokenAddress(
    vaultPdaAccount,
    new anchor.web3.PublicKey(getOrcaVaultLpMint(assetSymbol))
  );
  let vaultFarmTokenAccount = await serumAssoToken.getAssociatedTokenAddress(
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
  const withdrawAccounts = {
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
    receivingTokenAccount: userFarmManagerLpTokenAccount,
    solfarmVaultProgram: solfarmVaultProgramId,
    leveragedFarm: leveragedFarm,
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    obligationVaultAddress: obligationVaultAccount,
    leveragedUserFarm: userFarm
  };

  txn = await vaultProgram.transaction.withdrawOrcaVaultWithoutShares(
    new anchor.BN(obligationIdx),
    {
      accounts: withdrawAccounts,
      remainingAccounts: [
        { pubkey: lendingMarketAccount, isWritable: true, isSigner: false },
        { pubkey: userObligationAcct1, isWritable: true, isSigner: false },
        {
          pubkey: derivedLendingMarketAuthority,
          isWritable: true,
          isSigner: false
        },
        { pubkey: lendingProgramId, isWritable: false, isSigner: false }
      ]
    }
  );

  return txn;
}

async function _withdrawMarginLpTokens ({
  wallet,
  connection,
  assetSymbol,
  obligationIdx,
  partialClose = 100,
  selectedOption = CLOSE_POSITION_OPTIONS.MINIMIZE_TRADING
}) {
  // Step 1 of 5
  let anchor = anchorold;

  const walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58())
    },
    provider = new anchor.Provider(connection, walletToInitialize, {
      skipPreflight: true,
      preflightCommitment: commitment
    });

  anchor.setProvider(provider);

  // Address of the deployed program.
  const vaultProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());

  // Generate the program client from IDL.
  const vaultProgram = new anchor.Program(leverageIdl, vaultProgramId);

  const farm = getFarmBySymbol(assetSymbol);

  const solfarmVaultProgramId = new anchor.web3.PublicKey(
    farm.platform === FARM_PLATFORMS.ORCA ? getOrcaVaultProgramId() : getVaultProgramId()
  );

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

  const [leveragedFarm] = await findLeveragedFarmAddress(
    solfarmVaultProgramId,
    new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).serum_market
    ),
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(farm.marginIndex)
  );

  const userFarmManagerLpTokenAccount = await createAssociatedTokenAccount(
    provider,
    obligationVaultAccount,
    new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).raydium_lp_mint_address
    )
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

  let txn;

  switch (farm.platform) {
    case FARM_PLATFORMS.RAYDIUM: {
      const vaultInfoAccountPda = new anchor.web3.PublicKey(
        getVaultInfoAccount(assetSymbol)
      );

      const vaultLpTokenAccount = await createAssociatedTokenAccount(
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

      const [userPositionInfoAddress] = await derivePositionInfoAddress(
        userFarm,
        vaultProgramId,
        new anchor.BN(obligationIdx)
      );

      let withdrawAccounts = {
        authority: provider.wallet.publicKey,
        userFarm: userFarm,
        obligationVaultAddress: obligationVaultAccount,
        leveragedFarm: leveragedFarm,
        vaultProgram: solfarmVaultProgramId,
        vault: vaultAccount,
        userLpTokenAccount: vaultLpTokenAccount,
        authorityTokenAccount: userFarmManagerLpTokenAccount,
        vaultPdaAccount: vaultPdaAccount,
        userBalanceAccount: userFarmManagerVaultBalanceAccount,
        userBalanceMeta: userFarmManagerVaultBalanceMetadataAccount,
        stakeProgramId: new anchor.web3.PublicKey(
          getFarmProgramId(assetSymbol)
        ),
        poolId: new anchor.web3.PublicKey(getFarmPoolId(assetSymbol)),
        poolAuthority: new anchor.web3.PublicKey(
          getFarmPoolAuthority(assetSymbol)
        ),
        userInfoAccount: vaultInfoAccountPda,
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
        tokenProgramId: serum.TokenInstructions.TOKEN_PROGRAM_ID,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY
      };

      if (getFarmFusion(assetSymbol)) {
        withdrawAccounts.userRewardBTokenAccount = new anchor.web3.PublicKey(
          getVaultRewardAccountB(assetSymbol)
        );
      }

      txn = await vaultProgram.transaction.withdrawRaydiumVaultClose(
        {
          metaNonce: vaultMetaNonce,
          nonce: vaultBalanceNonce
        },
        new anchor.BN(obligationIdx),
        new anchor.BN(partialClose),
        new anchor.BN(selectedOption),
        {
          accounts: withdrawAccounts,
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
            { pubkey: lendingProgramId, isWritable: false, isSigner: false },
            {
              pubkey: userPositionInfoAddress,
              isWritable: true,
              isSigner: false
            },
            {
              pubkey: anchor.web3.SystemProgram.programId,
              isWritable: false,
              isSigner: false
            },
            {
              pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
              isWritable: false,
              isSigner: false
            }
          ]
        }
      );

      break;
    }

    case FARM_PLATFORMS.ORCA: {
      let [orcaVaultUserAccountAddress] = await deriveVaultUserAccount(
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
      const withdrawAccounts = {
        authority: provider.wallet.publicKey,
        vaultAccount: vaultAccount,
        vaultUserAccount: orcaVaultUserAccountAddress,
        tokenProgram: serum.TokenInstructions.TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        vaultPda: vaultPdaAccount,
        systemProgram: anchor.web3.SystemProgram.programId,
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
        receivingTokenAccount: userFarmManagerLpTokenAccount,
        solfarmVaultProgram: solfarmVaultProgramId,
        leveragedFarm: leveragedFarm,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        obligationVaultAddress: obligationVaultAccount,
        leveragedUserFarm: userFarm
      };

      const [userPositionInfoAddress] = await derivePositionInfoAddress(
        userFarm,
        vaultProgramId,
        new anchor.BN(obligationIdx)
      );

      txn = await vaultProgram.transaction.withdrawOrcaVaultClose(
        new anchor.BN(obligationIdx),
        new anchor.BN(partialClose),
        new anchor.BN(selectedOption),
        {
          accounts: withdrawAccounts,
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
            { pubkey: lendingProgramId, isWritable: false, isSigner: false },
            {
              pubkey: userPositionInfoAddress,
              isWritable: true,
              isSigner: false
            }
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

async function _removeLiquidity ({
  wallet,
  connection,
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
    provider = new anchor.Provider(connection, walletToInitialize, {
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

  const solfarmVaultProgramId = new anchor.web3.PublicKey(
    farm.platform === FARM_PLATFORMS.ORCA ? getOrcaVaultProgramId() : getVaultProgramId()
  );

  const lendingFarmAccount = getLendingFarmAccount(assetSymbol);
  const [leveragedFarm] = await findLeveragedFarmAddress(
    solfarmVaultProgramId,
    new anchor.web3.PublicKey(lendingFarmAccount.serum_market),
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(farm.marginIndex)
  );

  const [userObligationAcct1] =
    await findUserFarmObligationAddress(
      provider.wallet.publicKey,
      userFarm,
      new anchor.web3.PublicKey(getLendingFarmProgramId()),
      new anchor.BN(obligationIdx) // @todo: fix this for the position being closed
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
  let serumMarketVaultSigner = new anchor.web3.PublicKey(
    getVaultSerumVaultSigner(assetSymbol)
  );

  // let openOrdersAccountFarm =  new anchor.web3.PublicKey(getLendingFarmAccount(assetSymbol).farm_open_orders);
  // const marketAccountInfo = await provider.connection.getAccountInfo(
  //     serumMarketKey
  // );

  let [obligationVaultAccount, obligationVaultNonce] = await findObligationVaultAddress(
    userFarm,
    new anchor.BN(obligationIdx), // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
    new anchor.web3.PublicKey(getLendingFarmProgramId())
  );

  const obligationLpTokenAccount = await createAssociatedTokenAccount(
    provider,
    obligationVaultAccount,
    new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).raydium_lp_mint_address
    )
  );

  let dexProgramId = new anchor.web3.PublicKey(
    getLendingFarmAccount(assetSymbol).serum_dex_program // lendingInfo -> farm -> accounts -> serumDexProgram
  );

  if (farm.platform === FARM_PLATFORMS.ORCA) {
    serumMarketVaultSigner = new anchor.web3.PublicKey(
      getOrcaVaultFeeAccount(assetSymbol)
    );
  }

  const [userPositionInfoAddress] = await derivePositionInfoAddress(
    userFarm,
    vaultProgramId,
    new anchor.BN(obligationIdx)
  );

  const removeLiquidityAccounts = {
    userFarm: userFarm,
    obligationVaultAddress: obligationVaultAccount,
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
    poolTempLpTokenAccount: new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).raydium_pool_temp_token_account
    ),
    serumProgramId: dexProgramId,
    serumMarket: serumMarketKey,
    serumCoinVaultAccount: new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).serum_coin_vault_account
    ),
    serumPcVaultAccount: new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).serum_pc_vault_account
    ),
    serumVaultSigner: serumMarketVaultSigner,
    tokenProgram: splToken.TOKEN_PROGRAM_ID,
    levFarmCoinTokenAccount: new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).farm_base_token_account
    ),
    levFarmPcTokenAccount: new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).farm_quote_token_account
    ),
    userLpTokenAccount: obligationLpTokenAccount,
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY
  };

  let remainAccounts = [
    { pubkey: provider.wallet.publicKey, isWritable: true, isSigner: true },
    { pubkey: lendingMarketAccount, isWritable: true, isSigner: false },
    { pubkey: userObligationAcct1, isWritable: true, isSigner: false },
    {
      pubkey: derivedLendingMarketAuthority,
      isWritable: true,
      isSigner: false
    },
    { pubkey: lendingProgramId, isWritable: false, isSigner: false },
    { pubkey: userPositionInfoAddress, isWritable: true, isSigner: false }
  ];

  if (farm.platform === FARM_PLATFORMS.RAYDIUM) {
    remainAccounts.push({
      pubkey: new anchor.web3.PublicKey(lendingFarmAccount.serum_event_queue),
      isWritable: true,
      isSigner: false
    });
    remainAccounts.push({
      pubkey: new anchor.web3.PublicKey(lendingFarmAccount.serum_market_bids),
      isWritable: true,
      isSigner: false
    });
    remainAccounts.push({
      pubkey: new anchor.web3.PublicKey(lendingFarmAccount.serum_market_asks),
      isWritable: true,
      isSigner: false
    });

    return vaultProgram.transaction.removeLiquidityNew(
      new anchor.BN(obligationIdx),
      new anchor.BN(obligationVaultNonce),
      {
        accounts: {
          removeLiq: removeLiquidityAccounts
        },
        remainingAccounts: remainAccounts
      }
    );
  }

  return vaultProgram.instruction.removeLiquidityNew(
    new anchor.BN(obligationIdx),
    new anchor.BN(obligationVaultNonce),
    {
      accounts: {
        removeLiq: removeLiquidityAccounts
      },
      remainingAccounts: remainAccounts
    }
  );
}

async function _swapTokensForRepaying ({
  wallet,
  connection,
  tokenAccounts,
  assetSymbol,
  obligationIdx,
  obligationBorrowReserves
}) {
  let anchor = anchorold;

  const walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58())
    },
    provider = new anchor.Provider(connection, walletToInitialize, {
      skipPreflight: true,
      preflightCommitment: commitment
    });

  anchor.setProvider(provider);

  // Address of the deployed program.
  const vaultProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());

  // Generate the program client from IDL.
  const vaultProgram = new anchor.Program(leverageIdl, vaultProgramId);

  const farm = getFarmBySymbol(assetSymbol),

    // tulipTokenMint = new anchor.web3.PublicKey(TOKENS.TULIP.mintAddress),
    baseToken = farm.coins[0],
    quoteToken = farm.coins[1],
    coinReserve = getReserveByName(baseToken.symbol),
    pcReserve = getReserveByName(quoteToken.symbol);

  const solfarmVaultProgramId = new anchor.web3.PublicKey(
    farm.platform === FARM_PLATFORMS.ORCA ? getOrcaVaultProgramId() : getVaultProgramId()
  );

  // const farmDetails = getStore('FarmStore').getFarm(farm.mintAddress);
  // const { userFarmInfo, userFarmManagerInfo } = farmDetails || {};

  let [userFarm] = await findUserFarmAddress(
    provider.wallet.publicKey,
    new anchor.web3.PublicKey(getLendingFarmProgramId()), // lending_info.json -> programs -> farm -> id
    new anchor.BN(0),
    new anchor.BN(farm.marginIndex)
  );

  let [userObligationAcct1] = await findUserFarmObligationAddress(
    provider.wallet.publicKey,
    userFarm,
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(obligationIdx) // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
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

  const serumMarketKey = new anchor.web3.PublicKey(
    getLendingFarmAccount(assetSymbol).serum_market
  );
  const serumMarketVaultSigner = new anchor.web3.PublicKey(
    getVaultSerumVaultSigner(assetSymbol)
  );
  let openOrdersAccountFarm = new anchor.web3.PublicKey(
    getLendingFarmAccount(assetSymbol).farm_open_orders
  );
  const marketAccountInfo = await provider.connection.getAccountInfo(
    serumMarketKey
  );

  let dexProgramId = new anchor.web3.PublicKey(
    getLendingFarmAccount(assetSymbol).serum_dex_program // lendingInfo -> farm -> accounts -> serumDexProgram
  );
  const decoded = await serum.Market.getLayout(dexProgramId).decode(
    marketAccountInfo.data
  );

  let firstReserve, secondReserve;

  if (obligationBorrowReserves.length === 0) {
    firstReserve = coinReserve;
    secondReserve = pcReserve;
  }
  else {
    firstReserve = getLendingReserveFromKey(
      obligationBorrowReserves[0].toBase58()
    );

    secondReserve =
      firstReserve.account === coinReserve.account ? pcReserve : coinReserve;
  }

  const [userPositionInfoAddress] = await derivePositionInfoAddress(
    userFarm,
    vaultProgramId,
    new anchor.BN(obligationIdx)
  );

  let quoteTokenPriceFeed = getPriceFeedsForReserve(quoteToken.symbol);

  let remainingAccounts = [
    { pubkey: lendingMarketAccount, isWritable: true, isSigner: false },
    {
      pubkey: derivedLendingMarketAuthority,
      isWritable: true,
      isSigner: false
    },
    { pubkey: lendingProgramId, isWritable: false, isSigner: false },
    {
      pubkey: new anchor.web3.PublicKey(
        getPriceFeedsForReserve(assetSymbol).price_account
      ),
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: new anchor.web3.PublicKey(
        getPriceFeedsForReserve(baseToken.symbol).price_account
      ),
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: new anchor.web3.PublicKey(
        quoteTokenPriceFeed.price_account
      ),
      isWritable: true,
      isSigner: false
    },
    {
      pubkey: new anchor.web3.PublicKey(getVaultAccount(assetSymbol)),
      isWritable: true,
      isSigner: false
    },
    {
      isSigner: false,
      isWritable: true,
      pubkey: userPositionInfoAddress
    },
    {
      isSigner: false,
      isWritable: true,
      pubkey: new anchor.web3.PublicKey(firstReserve.account)
    },
    {
      isSigner: false,
      isWritable: false,
      pubkey: new anchor.web3.PublicKey(
        getPriceFeedsForReserve(firstReserve.name).price_account
      )
    },
    {
      isSigner: false,
      isWritable: true,
      pubkey: new anchor.web3.PublicKey(secondReserve.account)
    },
    {
      isSigner: false,
      isWritable: false,
      pubkey: new anchor.web3.PublicKey(
        getPriceFeedsForReserve(secondReserve.name).price_account
      )
    }
  ];

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

    remainingAccounts = [
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
        isSigner: false,
        isWritable: true,
        pubkey: userPositionInfoAddress
      },
      {
        pubkey: new anchor.web3.PublicKey(
          getPriceFeedsForReserve(assetSymbol).price_account
        ),
        isWritable: true,
        isSigner: false
      },
      {
        pubkey: new anchor.web3.PublicKey(
          getPriceFeedsForReserve(baseToken.symbol).price_account
        ),
        isWritable: true,
        isSigner: false
      },
      {
        pubkey: new anchor.web3.PublicKey(
          getPriceFeedsForReserve(quoteToken.symbol).price_account
        ),
        isWritable: true,
        isSigner: false
      },
      {
        pubkey: new anchor.web3.PublicKey(getVaultAccount(assetSymbol)),
        isWritable: true,
        isSigner: false
      },
      {
        pubkey: new anchor.web3.PublicKey(getOrcaLpMintAddress(assetSymbol)),
        isWritable: true,
        isSigner: false
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: new anchor.web3.PublicKey(firstReserve.account)
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: new anchor.web3.PublicKey(
          getPriceFeedsForReserve(firstReserve.name).price_account
        )
      },
      {
        isSigner: false,
        isWritable: true,
        pubkey: new anchor.web3.PublicKey(secondReserve.account)
      },
      {
        isSigner: false,
        isWritable: false,
        pubkey: new anchor.web3.PublicKey(
          getPriceFeedsForReserve(secondReserve.name).price_account
        )
      }
    ];
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

  let lendingFarmAccount = getLendingFarmAccount(assetSymbol);

  let tx;

  switch (farm.platform) {
    case FARM_PLATFORMS.RAYDIUM: {
      if (farm.highLiquidity) {
        remainingAccounts = [
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
              getPriceFeedsForReserve(assetSymbol).price_account
            ),
            isWritable: true,
            isSigner: false
          },
          {
            pubkey: new anchor.web3.PublicKey(
              getPriceFeedsForReserve(baseToken.symbol).price_account
            ),
            isWritable: true,
            isSigner: false
          },
          {
            pubkey: new anchor.web3.PublicKey(
              getPriceFeedsForReserve(quoteToken.symbol).price_account
            ),
            isWritable: true,
            isSigner: false
          },
          {
            pubkey: new anchor.web3.PublicKey(getVaultAccount(assetSymbol)),
            isWritable: true,
            isSigner: false
          },
          {
            isSigner: false,
            isWritable: true,
            pubkey: userPositionInfoAddress
          },
          {
            isSigner: false,
            isWritable: true,
            pubkey: new anchor.web3.PublicKey(firstReserve.account)
          },
          {
            isSigner: false,
            isWritable: false,
            pubkey: new anchor.web3.PublicKey(
              getPriceFeedsForReserve(firstReserve.name).price_account
            )
          },
          {
            isSigner: false,
            isWritable: true,
            pubkey: new anchor.web3.PublicKey(secondReserve.account)
          },
          {
            isSigner: false,
            isWritable: false,
            pubkey: new anchor.web3.PublicKey(
              getPriceFeedsForReserve(secondReserve.name).price_account
            )
          }
        ];

        tx = await vaultProgram.transaction.swapTokensSerum(
          [
            new anchor.web3.PublicKey(firstReserve.account),
            new anchor.web3.PublicKey(secondReserve.account)
          ],
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
              clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
              dexProgram: dexProgramId,
              vaultSigner: serumMarketVaultSigner
            },
            remainingAccounts: remainingAccounts
          }
        );
      }
      else {
        tx = await vaultProgram.transaction.swapToRepayRaydium(
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
              ammQuantitiesOrTargetOrders: anchor.web3.SystemProgram.programId,
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
      }
      break;
    }

    case FARM_PLATFORMS.ORCA: {
      const removeLiqTxn = await _removeLiquidity({
        wallet,
        connection,
        tokenAccounts,
        assetSymbol,
        obligationIdx
      });

      tx = vaultProgram.transaction.swapToRepayOrca(
        [
          new anchor.web3.PublicKey(firstReserve.account),
          new anchor.web3.PublicKey(secondReserve.account)
        ],
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
            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
            dexProgram: dexProgramId,
            vaultSigner: serumMarketVaultSigner
          },
          remainingAccounts: remainingAccounts,
          instructions: [removeLiqTxn]
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

  return tx;
}

async function _repayObligationLiquidity ({
  connection,
  wallet,
  tokenAccounts,
  assetSymbol,
  obligationIdx,
  obligationBorrowReserves
}) {
  let anchor = anchorold;

  const walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58())
    },
    provider = new anchor.Provider(connection, walletToInitialize, {
      skipPreflight: true,
      preflightCommitment: commitment
    });

  anchor.setProvider(provider);

  // Address of the deployed program.
  const vaultProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());

  // Generate the program client from IDL.
  const vaultProgram = new anchor.Program(leverageIdl, vaultProgramId);

  const farm = getFarmBySymbol(assetSymbol),

    // tulipTokenMint = new anchor.web3.PublicKey(TOKENS.TULIP.mintAddress),
    baseToken = farm.coins[0],
    quoteToken = farm.coins[1],
    coinReserve = getReserveByName(baseToken.symbol),
    pcReserve = getReserveByName(quoteToken.symbol);

  const solfarmVaultProgramId = new anchor.web3.PublicKey(
    farm.platform === FARM_PLATFORMS.ORCA ? getOrcaVaultProgramId() : getVaultProgramId()
  );

  let [userFarm] = await findUserFarmAddress(
    provider.wallet.publicKey,
    new anchor.web3.PublicKey(getLendingFarmProgramId()), // lending_info.json -> programs -> farm -> id
    new anchor.BN(0),
    new anchor.BN(farm.marginIndex)
  );

  let [userObligationAcct1] = await findUserFarmObligationAddress(
    provider.wallet.publicKey,
    userFarm,
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(obligationIdx) // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
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

  let firstReserve, secondReserve;

  if (obligationBorrowReserves.length === 0) {
    firstReserve = coinReserve;
    secondReserve = pcReserve;
  }
  else {
    firstReserve = getLendingReserveFromKey(
      obligationBorrowReserves[0].toBase58()
    );

    secondReserve =
      firstReserve.account === coinReserve.account ? pcReserve : coinReserve;
  }

  let userCoinTokenAccount;
  let userPcTokenAccount;

  if (
    baseToken.symbol !== 'SOL' &&
    !isMintAddressExisting(tokenAccounts, baseToken.mintAddress)
  ) {
    userCoinTokenAccount = await serumAssoToken.getAssociatedTokenAddress(
      wallet.publicKey,
      new anchor.web3.PublicKey(baseToken.mintAddress)
    );
  }
  else {
    userCoinTokenAccount = new anchor.web3.PublicKey(
      tokenAccounts[baseToken.mintAddress]?.tokenAccountAddress
    );
  }

  if (
    quoteToken.symbol !== 'SOL' &&
    !isMintAddressExisting(tokenAccounts, quoteToken.mintAddress)
  ) {
    userPcTokenAccount = await serumAssoToken.getAssociatedTokenAddress(
      wallet.publicKey,
      new anchor.web3.PublicKey(quoteToken.mintAddress)
    );
  }
  else {
    userPcTokenAccount = new anchor.web3.PublicKey(
      tokenAccounts[quoteToken.mintAddress]?.tokenAccountAddress
    );
  }

  const txn = new anchor.web3.Transaction();
  let signers = [];

  if (baseToken.symbol === 'SOL') {
    const lamportsToCreateAccount =
      await connection.getMinimumBalanceForRentExemption(
        ACCOUNT_LAYOUT.span,
        commitment
      );

    const newAccount = new anchor.web3.Account();

    signers.push(newAccount);

    userCoinTokenAccount = newAccount.publicKey;
    txn.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: userCoinTokenAccount,
        lamports: lamportsToCreateAccount,
        space: ACCOUNT_LAYOUT.span,
        programId: TOKEN_PROGRAM_ID
      })
    );

    txn.add(
      splToken.Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
        new PublicKey(TOKENS.WSOL.mintAddress),
        userCoinTokenAccount,
        wallet.publicKey
      )
    );
  }

  if (quoteToken.symbol === 'SOL') {
    const lamportsToCreateAccount =
      await connection.getMinimumBalanceForRentExemption(
        ACCOUNT_LAYOUT.span,
        commitment
      );

    const newAccount = new anchor.web3.Account();

    signers.push(newAccount);

    userPcTokenAccount = newAccount.publicKey;
    txn.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: userPcTokenAccount,
        lamports: lamportsToCreateAccount,
        space: ACCOUNT_LAYOUT.span,
        programId: TOKEN_PROGRAM_ID
      })
    );

    txn.add(
      splToken.Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
        new PublicKey(TOKENS.WSOL.mintAddress),
        userPcTokenAccount,
        wallet.publicKey
      )
    );
  }

  const [userPositionInfoAddress] = await derivePositionInfoAddress(
    userFarm,
    vaultProgramId,
    new anchor.BN(obligationIdx)
  );

  const repayAccounts = {
    authority: provider.wallet.publicKey,
    userFarm: userFarm,
    leveragedFarm: leveragedFarm,
    userFarmObligation: userObligationAcct1,
    coinSourceTokenAccount: new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).farm_base_token_account
    ),
    coinDestinationTokenAccount: new anchor.web3.PublicKey(
      getLendingReserve(baseToken.symbol).liquidity_supply_token_account
    ),
    pcSourceTokenAccount: new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).farm_quote_token_account
    ),
    pcDestinationTokenAccount: new anchor.web3.PublicKey(
      getLendingReserve(quoteToken.symbol).liquidity_supply_token_account
    ),
    coinReserveAccount: new anchor.web3.PublicKey(
      getLendingReserve(baseToken.symbol).account
    ),
    pcReserveAccount: new anchor.web3.PublicKey(
      getLendingReserve(quoteToken.symbol).account
    ),
    lendingMarketAccount: lendingMarketAccount,
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    tokenProgram: splToken.TOKEN_PROGRAM_ID,
    lendingProgram: lendingProgramId,
    lpPythPriceAccount: new anchor.web3.PublicKey(
      getPriceFeedsForReserve(assetSymbol).price_account
    ),
    coinPriceAccount: new anchor.web3.PublicKey(
      getPriceFeedsForReserve(baseToken.symbol).price_account
    ),
    pcPriceAccount: new anchor.web3.PublicKey(
      getPriceFeedsForReserve(quoteToken.symbol).price_account
    ),
    vaultAccount: new anchor.web3.PublicKey(getVaultAccount(assetSymbol)),
    derivedLendingMarketAuthority: derivedLendingMarketAuthority,
    userCoinTokenAccount: userCoinTokenAccount,
    userPcTokenAccount: userPcTokenAccount,
    positionInfoAccount: userPositionInfoAddress
  };

  // console.log("$$ repay account", repayAccounts);
  txn.add(
    vaultProgram.transaction.repayObligationLiquidityExternal(
      [
        new anchor.web3.PublicKey(firstReserve.account),
        new anchor.web3.PublicKey(secondReserve.account)
      ],
      new anchor.BN(obligationIdx),
      {
        confirmOptions: {
          skipPreflight: true
        },
        accounts: repayAccounts,
        remainingAccounts: [
          {
            isSigner: false,
            isWritable: true,
            pubkey: new anchor.web3.PublicKey(firstReserve.account)
          },
          {
            isSigner: false,
            isWritable: false,
            pubkey: new anchor.web3.PublicKey(
              getPriceFeedsForReserve(firstReserve.name).price_account
            )
          },
          {
            isSigner: false,
            isWritable: true,
            pubkey: new anchor.web3.PublicKey(secondReserve.account)
          },
          {
            isSigner: false,
            isWritable: false,
            pubkey: new anchor.web3.PublicKey(
              getPriceFeedsForReserve(secondReserve.name).price_account
            )
          },
          {
            isSigner: false,
            isWritable: true,
            pubkey: new anchor.web3.PublicKey(firstReserve.account)
          },
          {
            isSigner: false,
            isWritable: true,
            pubkey: new anchor.web3.PublicKey(secondReserve.account)
          }
        ]
      }
    )
  );

  if (baseToken.symbol === 'SOL') {
    txn.add(
      splToken.Token.createCloseAccountInstruction(
        TOKEN_PROGRAM_ID,
        userCoinTokenAccount,
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
        userPcTokenAccount,
        wallet.publicKey,
        wallet.publicKey,
        []
      )
    );
  }

  return [txn, signers];
}

async function openMarginPosition ({
  connection,
  wallet,
  symbol,
  coinBorrowAmount,
  pcBorrowAmount,
  baseTokenAmount,
  quoteTokenAmount,
  obligationIdx = -2,
  onSendTransactions = sendAllTransactions
}) {
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
  const userFarmInfo = farmProgram.coder.accounts.decode(
    'UserFarm',
    userFarmData?.data
  );

  const tokenAccounts = await getTokenAccounts({ connection, wallet });

  const { obligations } = userFarmInfo || {};

  if (obligationIdx === -2) {
    obligationIdx = findIndex(obligations, (obligation) => {
      return (
        obligation.positionState.hasOwnProperty('opening') ||
        obligation.positionState.hasOwnProperty('borrowed') ||
        obligation.positionState.hasOwnProperty('swapped') ||
        obligation.positionState.hasOwnProperty('addedLiquidity') ||
        obligation.positionState.hasOwnProperty('withdrawn') ||
        obligation.positionState.hasOwnProperty('exitingAndLiquidated')
      );
    });
  }

  let obligationPositionState = { opening: {} };

  if (obligationIdx !== -1) {
    obligationPositionState = obligations[obligationIdx].positionState;
  }

  const isUserFarmValid = Boolean(userFarmInfo);

  let createAccounts = false;
  let extraSigners = [];

  if (!isUserFarmValid) {
    createAccounts = true;
    obligationIdx = 0;

    const createUserFarmManagerTxn = _createUserFarm({
      wallet,
      tokenAccounts,
      obligationIdx,
      assetSymbol: symbol
    });

    transactions.push(createUserFarmManagerTxn);
    extraSigners.push([]);
  }
  else if (
    obligations[obligationIdx].obligationAccount.toBase58() === '11111111111111111111111111111111'
  ) {
    createAccounts = true;

    transactions.push(
      _createUserFarmObligation({
        connection,
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
        connection,
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
      connection,
      assetSymbol: symbol,
      coinBorrowAmount,
      pcBorrowAmount,
      baseTokenAmount,
      quoteTokenAmount,
      obligationIdx,
      wallet,
      tokenAccounts,
      userFarmInfo
    });

    transactions.push(depositBorrowTxn);
    extraSigners.push(signer);
  }

  if (obligationProgress > 0 && obligationProgress < 4) {
    transactions.push(_addLiquidity({
      wallet,
      connection,
      tokenAccounts,
      assetSymbol: symbol,
      obligationIdx,
      obligationProgress,
      checkLpTokenAccount: true
    }));
    extraSigners.push([]);
  }

  if (obligationProgress > 0 && obligationProgress < 5 && farmDetails.platform === FARM_PLATFORMS.RAYDIUM) {
    transactions.push(
      _depositMarginLpTokens({
        connection,
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
    return onSendTransactions(
      connection,
      wallet,
      fulfilledTransactions,
      [],
      extraSigners
    );
  });
}

async function closeMarginPosition ({
  wallet,
  connection,
  symbol,
  obligationIdx,
  selectedOption,
  partialClose,
  onSendTransactions = sendAllTransactions
} = { selectedOption: CLOSE_POSITION_OPTIONS.MINIMIZE_TRADING, partialClose: 100 }) {
  const farm = getFarmBySymbol(symbol);

  let anchor = anchorold;

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

  const [userFarmData, tokenAccounts] = await Promise.all([
    connection.getAccountInfo(userFarm),
    getTokenAccounts({ wallet, connection })
  ]);

  const farmProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());

  // Generate the program client from IDL.
  const farmProgram = new anchor.Program(leverageIdl, farmProgramId, provider);

  // 3. Decode userFarm
  const userFarmInfo = farmProgram.coder.accounts.decode(
    'UserFarm',
    userFarmData?.data
  );

  const { obligations } = userFarmInfo || {};

  let borrows = [];

  const obligationPositionState = obligations[obligationIdx].positionState;

  const lendingObligationAccount = await connection.getAccountInfo(obligations[obligationIdx].obligationAccount);

  let extraObligationData = lendingObligationAccount.data.slice(143, 303);

  let decodedObligationAccount = LENDING_OBLIGATION_LAYOUT.decode(
    lendingObligationAccount.data
  );

  for (let i = 0; i < decodedObligationAccount.borrowsLen; i++) {
    borrows.push(
      LENDING_OBLIGATION_LIQUIDITY.decode(
        extraObligationData.slice(i * 80, (i + 1) * 80)
      )
    );
  }

  const baseToken = farm.coins[0],
    quoteToken = farm.coins[1],
    coinReserve = getReserveByName(baseToken.symbol),
    pcReserve = getReserveByName(quoteToken.symbol);
  let coinBorrow = 0,
    pcBorrow = 0;

  const { withdrawPercent } = obligations[obligationIdx];

  if (withdrawPercent > 0) { partialClose = withdrawPercent; }
  let transactions = [];
  let extraSigners = [];
  let obligationProgress = 0;

  if (obligationPositionState.hasOwnProperty('opened')) {
    obligationProgress = 1;
  }
  else if (
    obligationPositionState.hasOwnProperty('withdrawnOrcaDoubleDip')
  ) {
    obligationProgress = 2;
  }
  else if (obligationPositionState.hasOwnProperty('withdrawing')) {
    obligationProgress = 3;
  }
  else if (obligationPositionState.hasOwnProperty('removedLiquidity')) {
    obligationProgress = 4;
  }
  else if (obligationPositionState.hasOwnProperty('swappedForRepaying')) {
    obligationProgress = 5;
  }

  let obligationBorrows = [];

  const _coinLendingReserve = find(LENDING_RESERVES, { mintAddress: coinReserve.mintAddress });
  const _pcLendingReserve = find(LENDING_RESERVES, { mintAddress: pcReserve.mintAddress });

  const _reserves = [
    _coinLendingReserve,
    _pcLendingReserve
  ];

  const reserveAccountsToFetch = map(_reserves,
    (reserve) => new anchor.web3.PublicKey(reserve.account),
  );

  const accountDetails = await getMultipleAccounts(
    connection,
    reserveAccountsToFetch,
    commitment
  );

  const reserveAccountDetails = slice(
    accountDetails,
    0,
    reserveAccountsToFetch.length
  );

  const reserveAccountsBorrowRateWads = reserveAccountDetails.map((reserveAccount, index) => {
    const reserve = _reserves[index];
    const decodedData = LENDING_RESERVE_LAYOUT.decode(
      reserveAccount.account.data
    );

    const {
      cumulativeBorrowRate: cumulativeBorrowRateWads
    } = decodedData?.liquidity || {};

    return {
      reserve,
      mintAddress: reserve.mintAddress,
      newCumulativeBorrowRate: cumulativeBorrowRateWads
    };
  });

  borrows.forEach((borrow) => {
    if (new TokenAmount(borrow.borrowedAmountWads).isNullOrZero() === false) {
      obligationBorrows.push(borrow.borrowReserve);

      if (borrow.borrowReserve.toString() === coinReserve.account) {
        const { newCumulativeBorrowRate } = reserveAccountsBorrowRateWads[0] || {};

        coinBorrow = new TokenAmount(
          borrow.borrowedAmountWads.div(WAD),
          coinReserve.decimals
        ).toWei().multipliedBy(partialClose).dividedBy(100);

        const oldBorrowRate = new TokenAmount(borrow.cumulativeBorrowRateWads);
        const newBorrowRate = new TokenAmount(newCumulativeBorrowRate);

        coinBorrow = coinBorrow
          .times(newBorrowRate.wei)
          .div(oldBorrowRate.wei)
          .div(Math.pow(10, coinReserve?.decimals))
          .toNumber();
      }

      if (borrow.borrowReserve.toString() === pcReserve.account) {
        const { newCumulativeBorrowRate } = reserveAccountsBorrowRateWads[1] || {};

        pcBorrow = new TokenAmount(
          borrow.borrowedAmountWads.div(WAD),
          pcReserve.decimals
        ).toWei().multipliedBy(partialClose).dividedBy(100);

        const oldBorrowRate = new TokenAmount(borrow.cumulativeBorrowRateWads);
        const newBorrowRate = new TokenAmount(newCumulativeBorrowRate);

        pcBorrow = pcBorrow
          .times(newBorrowRate.wei)
          .div(oldBorrowRate.wei)
          .div(Math.pow(10, pcReserve?.decimals))
          .toNumber();
      }
    }
  });

  transactions.push(_createOpenOrdersAccount({
    wallet,
    connection,
    tokenAccounts,
    assetSymbol: symbol,
    obligationIdx
  }));

  extraSigners.push([]);

  if (getOrcaFarmDoubleDip(symbol)) {
    if (obligationProgress > 0 && obligationProgress < 2) {
      transactions.push(
        _withdrawOrcaDoubleDip({
          wallet,
          connection,
          tokenAccounts,
          assetSymbol: symbol,
          obligationIdx,
          partialClose,
          selectedOption
        })
      );
      extraSigners.push([]);
    }

    if (obligationProgress > 0 && obligationProgress < 3) {
      transactions.push(
        _withdrawOrcaVaultWithoutShares({
          wallet,
          connection,
          tokenAccounts,
          assetSymbol: symbol,
          obligationIdx
        })
      );
      extraSigners.push([]);
    }
  }
  else if (obligationProgress > 0 && obligationProgress < 3) {
    transactions.push(
      _withdrawMarginLpTokens({
        wallet,
        connection,
        tokenAccounts,
        assetSymbol: symbol,
        obligationIdx,
        partialClose,
        selectedOption
      })
    );
    extraSigners.push([]);
  }

  if (obligationProgress > 0 && obligationProgress < 4 && farm.platform === FARM_PLATFORMS.RAYDIUM) {
    transactions.push(_removeLiquidity({
      wallet,
      connection,
      tokenAccounts,
      assetSymbol: symbol,
      obligationIdx
    }));
    extraSigners.push([]);
  }

  if (obligationProgress > 0 && obligationProgress < 6) {
    transactions.push(
      _swapTokensForRepaying({
        wallet,
        connection,
        tokenAccounts,
        assetSymbol: symbol,
        obligationIdx,
        obligationBorrowReserves: obligationBorrows,
        selectedOption
      })
    );
    extraSigners.push([]);
  }

  if (obligationProgress > 0 && obligationProgress < 6) {
    let [repayTxn, signer] = await _repayObligationLiquidity({
      wallet,
      connection,
      tokenAccounts,
      assetSymbol: symbol,
      obligationIdx,
      obligationBorrowReserves: obligationBorrows
    });

    transactions.push(repayTxn);
    extraSigners.push(signer);
  }

  return Promise.all(transactions).then((fulfilledTransactions) => {
    return onSendTransactions(
      connection,
      wallet,
      fulfilledTransactions,
      [],
      extraSigners
    );
  });
}

async function _topUpPosition ({
  wallet,
  connection,
  tokenAccounts,
  assetSymbol,
  baseTokenAmount,
  quoteTokenAmount,
  obligationIdx
}) {
  let anchor = anchorold;

  const walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58())
    },
    provider = new anchor.Provider(connection, walletToInitialize, {
      skipPreflight: true,
      preflightCommitment: commitment
    }),
    farm = getFarmBySymbol(assetSymbol),
    baseToken = farm.coins[0], // base / coin
    quoteToken = farm.coins[1]; // quote / pc | @to-do: change coins[0] and coins[1] to baseToken and quoteToken

  anchor.setProvider(provider);

  // Address of the deployed program.
  const vaultProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());

  // Generate the program client from IDL.
  const vaultProgram = new anchor.Program(leverageIdl, vaultProgramId);

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

  const txn = new anchor.web3.Transaction();

  let coinSourceTokenAccount, pcSourceTokenAccount;

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

    coinSourceTokenAccount = await createAssociatedTokenAccount(
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
    !isMintAddressExisting(tokenAccounts, quoteToken.mintAddress)
  ) {
    txn.add(
      await serumAssoToken.createAssociatedTokenAccount(

        // who will pay for the account creation
        provider.wallet.publicKey,

        // who is the account getting created for
        provider.wallet.publicKey,

        // what mint address token is being created
        new anchor.web3.PublicKey(quoteToken.mintAddress)
      )
    );

    pcSourceTokenAccount = await createAssociatedTokenAccount(
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
      await connection.getMinimumBalanceForRentExemption(
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
      await connection.getMinimumBalanceForRentExemption(
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

  const [userPositionInfoAddress] = await derivePositionInfoAddress(
    userFarm,
    vaultProgramId,
    new anchor.BN(obligationIdx)
  );

  txn.add(
    vaultProgram.instruction.topUpPositionStats(
      new anchor.BN(baseTokenAmount * Math.pow(10, baseToken.decimals)),
      new anchor.BN(quoteTokenAmount * Math.pow(10, quoteToken.decimals)),
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
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
          tokenProgram: splToken.TOKEN_PROGRAM_ID,
          lendingProgram: lendingProgramId
        },
        remainingAccounts: [
          {
            isSigner: false,
            isWritable: true,
            pubkey: userPositionInfoAddress
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

async function _topUpPositionMore ({
  wallet,
  connection,
  tokenAccounts,
  assetSymbol,
  baseTokenAmount,
  quoteTokenAmount,
  obligationIdx,
  coinBorrowAmount = 0,
  pcBorrowAmount = 0,
  obligationBorrows
}) {
  let anchor = anchorold;

  const walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58())
    },
    provider = new anchor.Provider(connection, walletToInitialize, {
      skipPreflight: true,
      preflightCommitment: commitment
    }),
    farm = getFarmBySymbol(assetSymbol),
    baseToken = farm.coins[0], // base / coin
    quoteToken = farm.coins[1]; // quote / pc | @to-do: change coins[0] and coins[1] to baseToken and quoteToken

  anchor.setProvider(provider);

  // Address of the deployed program.
  const vaultProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());

  // Generate the program client from IDL.
  const vaultProgram = new anchor.Program(leverageIdl, vaultProgramId);

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

  const txn = new anchor.web3.Transaction();

  let coinSourceTokenAccount, pcSourceTokenAccount;

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

    coinSourceTokenAccount = await createAssociatedTokenAccount(
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
    !isMintAddressExisting(tokenAccounts, quoteToken.mintAddress)
  ) {
    txn.add(
      await serumAssoToken.createAssociatedTokenAccount(

        // who will pay for the account creation
        provider.wallet.publicKey,

        // who is the account getting created for
        provider.wallet.publicKey,

        // what mint address token is being created
        new anchor.web3.PublicKey(quoteToken.mintAddress)
      )
    );

    pcSourceTokenAccount = await createAssociatedTokenAccount(
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
      await connection.getMinimumBalanceForRentExemption(
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
      await connection.getMinimumBalanceForRentExemption(
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

  let borrowedReserves = [];

  obligationBorrows.map((borrow) => {
    if (new TokenAmount(borrow.borrowedAmountWads).isNullOrZero() === false) {
      borrowedReserves.push(borrow.borrowReserve);
    }
  });

  const borrowOrder = get(borrowedReserves, [0, 'mintAddress']) === baseToken.mintAddress ? 0 : 1;

  const [borrowAuthorizer] =
    await findBorrowAuthorizer(
      lendingMarketAccount,
      new anchor.web3.PublicKey(getLendingFarmProgramId())
    );

  const vaultAccount =
    farm.platform === FARM_PLATFORMS.ORCA ?
      getLendingFarmAccount(assetSymbol).vault_account : getVaultAccount(assetSymbol);

  const [userPositionInfoAddress] = await derivePositionInfoAddress(
    userFarm,
    vaultProgramId,
    new anchor.BN(obligationIdx)
  );

  let remainingAccounts = [
    {
      isSigner: false,
      isWritable: true,
      pubkey: userPositionInfoAddress
    }
  ];

  const baseTokenReserve = getReserveByName(baseToken.symbol);
  const quoteTokenReserve = getReserveByName(quoteToken.symbol);

  let baseTokenDeposit = 0,
    quoteTokenDeposit = 0,
    coinBorrow = 0,
    pcBorrow = 0;

  try {
    baseTokenDeposit = new anchor.BN(baseTokenAmount * Math.pow(10, baseToken.decimals));
    quoteTokenDeposit = new anchor.BN(quoteTokenAmount * Math.pow(10, quoteToken.decimals));
    coinBorrow = new anchor.BN(coinBorrowAmount * Math.pow(10, baseToken.decimals));
    pcBorrow = new anchor.BN(pcBorrowAmount * Math.pow(10, quoteToken.decimals));
  }
  catch (e) {
    baseTokenDeposit = new anchor.BN(baseTokenAmount).mul(new anchor.BN(Math.pow(10, baseToken.decimals)));
    quoteTokenDeposit = new anchor.BN(quoteTokenAmount).mul(new anchor.BN(Math.pow(10, quoteToken.decimals)));
    coinBorrow = new anchor.BN(coinBorrowAmount).mul(new anchor.BN(Math.pow(10, baseToken.decimals)));
    pcBorrow = new anchor.BN(pcBorrowAmount).mul(new anchor.BN(Math.pow(10, quoteToken.decimals)));
  }

  txn.add(
    vaultProgram.instruction.topUpPositionDualBorrowStats(
      baseTokenDeposit,
      quoteTokenDeposit,
      coinBorrow,
      pcBorrow,
      new anchor.BN(obligationIdx),
      new anchor.BN(borrowOrder),
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
          borrowAuthorizer,
          derivedLendingMarketAuthority: derivedLendingMarketAuthority,

          // clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
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
          lpPythPriceAccount: new anchor.web3.PublicKey(
            getPriceFeedsForReserve(assetSymbol).price_account
          ),
          vaultAccount: new anchor.web3.PublicKey(vaultAccount)
        },
        remainingAccounts: remainingAccounts
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

async function addCollateralPosition ({
  wallet,
  connection,
  symbol,
  obligationIdx,
  reserveName,
  baseTokenAmount,
  quoteTokenAmount,
  coinBorrowAmount,
  pcBorrowAmount,
  onSendTransactions = sendAllTransactions
}) {
  let anchor = anchorold;

  let noBorrow = false;

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

  const tokenAccounts = await getTokenAccounts({ connection, wallet });

  const userFarmData = await connection.getAccountInfo(userFarm);

  const farmProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());

  // Generate the program client from IDL.
  const farmProgram = new anchor.Program(leverageIdl, farmProgramId, provider);

  // 3. Decode userFarm
  const userFarmInfo = farmProgram.coder.accounts.decode(
    'UserFarm',
    userFarmData?.data
  );

  const { obligations } = userFarmInfo || {};

  const baseToken = farmDetails.coins[0]; // base / coin

  if (reserveName === 'DEFAULT') {
    reserveName = baseToken.symbol;
    noBorrow = true;
  }

  // If the user didn't borrow anything then set the noBorrow to `true`
  // Doing a Math.floor since it's possible that some fractional value might cause this condition to fail
  // and you really can't borrow $0.9 max for eg
  if (
    (isNil(coinBorrowAmount) && isNil(pcBorrowAmount)) ||
    (coinBorrowAmount <= 0 && pcBorrowAmount <= 0)
  ) {
    noBorrow = true;
  }

  const obligationBorrows = [];

  // borrows.forEach((borrow) => {
  //   if (new TokenAmount(borrow.borrowedAmountWads).isNullOrZero() === false) {
  //     obligationBorrows.push(borrow.borrowReserve);
  //   }
  // });

  const obligationPositionState = obligations[obligationIdx].positionState;

  const lendingObligationAccount = await connection.getAccountInfo(obligations[obligationIdx].obligationAccount);

  let extraObligationData = lendingObligationAccount.data.slice(143, 303);

  let decodedObligationAccount = LENDING_OBLIGATION_LAYOUT.decode(
    lendingObligationAccount.data
  );

  for (let i = 0; i < decodedObligationAccount.borrowsLen; i++) {
    obligationBorrows.push(
      LENDING_OBLIGATION_LIQUIDITY.decode(
        extraObligationData.slice(i * 80, (i + 1) * 80)
      )
    );
  }

  let extraSigners = [];

  let obligationProgress = 0;

  if (obligationPositionState.hasOwnProperty('opened')) {
    obligationProgress = 1;
  }
  else if (obligationPositionState.hasOwnProperty('topUp')) {
    obligationProgress = 2;
  }
  else if (obligationPositionState.hasOwnProperty('topUpSwapped')) {
    obligationProgress = 3;
  }
  else if (obligationPositionState.hasOwnProperty('topUpAddedLiquidity')) {
    obligationProgress = 4;
  }
  else if (
    obligationPositionState.hasOwnProperty('depositedOrcaAquaFarm')
  ) {
    obligationProgress = 5;
  }

  if (obligationProgress > 0 && obligationProgress < 2) {
    if (noBorrow) {
      const [topUpTxn, signer] = await _topUpPosition({
        wallet,
        connection,
        tokenAccounts,
        assetSymbol: symbol,
        reserveName,
        baseTokenAmount,
        quoteTokenAmount,
        obligationIdx,
        obligationBorrows
      });

      transactions.push(topUpTxn);
      extraSigners.push(signer);
    }
    else {
      const [topUpTxn, signer] = await _topUpPositionMore({
        wallet,
        connection,
        tokenAccounts,
        assetSymbol: symbol,
        reserveName,
        baseTokenAmount,
        quoteTokenAmount,
        obligationIdx,
        coinBorrowAmount,
        pcBorrowAmount,
        obligationBorrows
      });

      transactions.push(topUpTxn);
      extraSigners.push(signer);
    }
  }

  if (obligationProgress > 0 && obligationProgress < 4) {
    transactions.push(_addLiquidity({
      wallet,
      connection,
      tokenAccounts,
      assetSymbol: symbol,
      obligationIdx,
      obligationProgress,
      checkLpTokenAccount: true
    }));

    extraSigners.push([]);
  }

  if (obligationProgress > 0 && obligationProgress < 5 && farmDetails.platform === FARM_PLATFORMS.RAYDIUM) {
    transactions.push(
      _depositMarginLpTokens({
        wallet,
        connection,
        tokenAccounts,
        assetSymbol: symbol,
        obligationIdx
      })
    );
    extraSigners.push([]);
  }

  return Promise.all(transactions).then((fulfilledTransactions) => {
    return onSendTransactions(
      connection,
      wallet,
      fulfilledTransactions,
      [],
      extraSigners
    );
  });
}

export {
  openMarginPosition,
  closeMarginPosition,
  addCollateralPosition
};
