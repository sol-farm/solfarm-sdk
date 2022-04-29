import * as anchor from '@project-serum/anchor';
import * as serumAssoToken from '@project-serum/associated-token';
import {
  SYSVAR_CLOCK_PUBKEY,
  TransactionInstruction,
  PublicKey,
  SystemProgram
} from '@solana/web3.js';
import { LENDING_PROGRAM_ID, TOKEN_PROGRAM_ID } from '../constants/ids';
import * as BufferLayout from 'buffer-layout';
import * as Layout from '../utils/layout-from-oyster';
import BN from 'bn.js';
import { Token } from '@solana/spl-token';
import { getReserveByMintAddress, getReserveByName } from '../utils/lendingUtils';
import { commitment, getMultipleAccounts } from '../utils/web3';

import {
  getLendingMarketAccount,
  getPriceFeedsForReserve
} from '../utils/config';
import { TOKENS } from '../constants/tokens';
import {
  ACCOUNT_LAYOUT,
  LENDING_RESERVE_LAYOUT,
  MINT_LAYOUT,
  WAD
} from '../utils/layouts';
import { TokenAmount } from '../utils/safe-math';
import { isFunction, some } from 'lodash';

const LendingInstruction = {
  InitLendingMarket: 0,
  SetLendingMarketOwner: 1,
  InitReserve: 2,
  RefreshReserve: 3,
  DepositReserveLiquidity: 4,
  RedeemReserveCollateral: 5,
  InitObligation: 6,
  RefreshObligation: 7,
  DepositObligationCollateral: 8,
  WithdrawObligationCollateral: 9,
  BorrowObligationLiquidity: 10,
  RepayObligationLiquidity: 11,
  LiquidateObligation: 12,
  FlashLoan: 13,
  UpdatePseudoDeposits: 14
};

const depositInstruction = ({
  liquidityAmount,
  from,
  to,
  reserveAccount,
  reserveSupply,
  collateralMint,
  lendingMarket,
  reserveAuthority,
  transferAuthority
}) => {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8('instruction'),
    Layout.uint64('liquidityAmount')
  ]);

  const data = Buffer.alloc(dataLayout.span);

  dataLayout.encode(
    {
      instruction: LendingInstruction.DepositReserveLiquidity,
      liquidityAmount: new BN(liquidityAmount)
    },
    data
  );

  const keys = [
    { pubkey: from, isSigner: false, isWritable: true },
    { pubkey: to, isSigner: false, isWritable: true },
    { pubkey: reserveAccount, isSigner: false, isWritable: true },
    { pubkey: reserveSupply, isSigner: false, isWritable: true },
    { pubkey: collateralMint, isSigner: false, isWritable: true },
    { pubkey: lendingMarket, isSigner: false, isWritable: false },
    { pubkey: reserveAuthority, isSigner: false, isWritable: false },
    { pubkey: transferAuthority, isSigner: true, isWritable: false },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }
  ];

  return new TransactionInstruction({
    keys,
    programId: LENDING_PROGRAM_ID,
    data
  });
};

const withdrawInstruction = ({
  collateralAmount,
  from,
  to,
  reserveAccount,
  reserveSupply,
  collateralMint,
  lendingMarket,
  reserveAuthority,
  transferAuthority
}) => {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8('instruction'),
    Layout.uint64('collateralAmount')
  ]);

  const data = Buffer.alloc(dataLayout.span);

  dataLayout.encode(
    {
      instruction: LendingInstruction.RedeemReserveCollateral,
      collateralAmount: new BN(collateralAmount)
    },
    data
  );

  const keys = [
    { pubkey: from, isSigner: false, isWritable: true },
    { pubkey: to, isSigner: false, isWritable: true },
    { pubkey: reserveAccount, isSigner: false, isWritable: true },
    { pubkey: collateralMint, isSigner: false, isWritable: true },
    { pubkey: reserveSupply, isSigner: false, isWritable: true },
    { pubkey: lendingMarket, isSigner: false, isWritable: false },
    { pubkey: reserveAuthority, isSigner: false, isWritable: false },
    { pubkey: transferAuthority, isSigner: true, isWritable: false },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }
  ];

  return new TransactionInstruction({
    keys,
    programId: LENDING_PROGRAM_ID,
    data
  });
};

const refreshReserve = ({ reserveAccount, priceAccount }) => {
  const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction')]);

  const data = Buffer.alloc(dataLayout.span);

  dataLayout.encode(
    {
      instruction: LendingInstruction.RefreshReserve
    },
    data
  );

  const keys = [
    { pubkey: reserveAccount, isSigner: false, isWritable: true },
    { pubkey: priceAccount, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false }
  ];

  return new TransactionInstruction({
    keys,
    programId: LENDING_PROGRAM_ID,
    data
  });
};

/**
 *
 * @param {Object} conn web3 Connection object
 * @param {Object} wallet Wallet object
 * @param {String} mintAddress Mint Address of the Vault
 * @param {String} authorityTokenAccount Token account address of the user corresponding to the vault
 * @param {String|Number} amount Amount to deposit
 *
 * @returns {Promise}
 */
const depositToLendingReserve = async (
  conn,
  wallet,
  mintAddress,
  authorityTokenAccount,
  amount
) => {
  const txn = new anchor.web3.Transaction();

  const {
    decimals,
    collateralTokenMint,
    account,
    liquiditySupplyTokenAccount,
    name: reserveName
  } = getReserveByMintAddress(mintAddress) || {};

  const collateralMintAccount = await serumAssoToken.getAssociatedTokenAddress(
    wallet.publicKey,
    new PublicKey(collateralTokenMint)
  );
  const collateralMintAccountInfo = await conn.getAccountInfo(
    collateralMintAccount
  );

  let fromAccount = new PublicKey(authorityTokenAccount);
  let signers = [];

  if (reserveName === 'SOL') {
    const lamportsToCreateAccount =
      await conn.getMinimumBalanceForRentExemption(
        ACCOUNT_LAYOUT.span,
        commitment
      );

    const newAccount = new anchor.web3.Account();

    signers.push(newAccount);

    fromAccount = newAccount.publicKey;
    txn.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: fromAccount,
        lamports: amount * Math.pow(10, decimals) + lamportsToCreateAccount,
        space: ACCOUNT_LAYOUT.span,
        programId: TOKEN_PROGRAM_ID
      })
    );

    txn.add(
      Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
        new PublicKey(TOKENS.WSOL.mintAddress),
        fromAccount,
        wallet.publicKey
      )
    );
  }

  if (!collateralMintAccountInfo) {
    txn.add(
      await serumAssoToken.createAssociatedTokenAccount(
        // who will pay for the account creation
        wallet.publicKey,

        // who is the account getting created for
        wallet.publicKey,

        // what mint address token is being created
        new PublicKey(collateralTokenMint)
      )
    );
  }

  const [derivedLendingMarketAuthority] =
    await anchor.web3.PublicKey.findProgramAddress(
      [new anchor.web3.PublicKey(getLendingMarketAccount()).toBytes()],
      LENDING_PROGRAM_ID
    );

  txn.add(
    refreshReserve({
      reserveAccount: new PublicKey(account),
      priceAccount: new PublicKey(getPriceFeedsForReserve(reserveName)?.price_account)
    })
  );

  txn.add(
    depositInstruction({
      liquidityAmount: amount * Math.pow(10, decimals),
      from: fromAccount,
      to: collateralMintAccount,
      reserveAccount: new PublicKey(account),
      reserveSupply: new PublicKey(liquiditySupplyTokenAccount),
      collateralMint: new PublicKey(collateralTokenMint),
      lendingMarket: new PublicKey(getLendingMarketAccount()),
      reserveAuthority: derivedLendingMarketAuthority,
      transferAuthority: wallet.publicKey
    })
  );

  if (reserveName === 'SOL') {
    txn.add(
      Token.createCloseAccountInstruction(
        TOKEN_PROGRAM_ID,
        fromAccount,
        wallet.publicKey,
        wallet.publicKey,
        []
      )
    );
  }

  return txn;
};

/**
 * @description
 * Deposit amount to a lending reserve such as USDC or TULIP etc.
 * Refer https://tulip.garden/lend to find the reserve name.
 *
 * @param {Object} data.connection web3 Connection object
 * @param {Object} data.wallet wallet object (@solana/web3 version >= 1.4.0)
 * @param {String} data.reserve reserve symbol or mint address
 *  (for eg: USDC or `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`)
 * @param {String|Number} data.amount amount to deposit
 * @param {String} [data.authorityTokenAccount] [optional] data.authorityTokenAccount
 *  authorityTokenAccount of the reserve
 *
 * @returns {Promise}
 */
const depositToLendingReserveV2 = async ({
  connection,
  wallet,
  reserve,
  amount,
  authorityTokenAccount
}) => {
  if (!connection) {
    throw new Error('TulipProtocol-SDK~depositToLendingReserveV2: connection parameter is missing');
  }

  if (!wallet) {
    throw new Error('TulipProtocol-SDK~depositToLendingReserveV2: wallet parameter is missing');
  }

  if (!reserve) {
    throw new Error('TulipProtocol-SDK~depositToLendingReserveV2: reserve symbol/mintAddress parameter is missing');
  }

  const _reserveData = getReserveByName(reserve) || getReserveByMintAddress(reserve);

  if (!_reserveData) {
    throw new Error(
      `
        TulipProtocol-SDK~depositToLendingReserveV2: reserve symbol/mintAddress is not supported. Please verify that
        the symbol or mintAddress that is provided is correct. Provided: ${reserve}
      `
    );
  }

  try {
    // If the authorityTokenAccount has not been provided then fetch it
    if (!authorityTokenAccount) {
      // Set token accounts
      const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
        wallet.publicKey,
        {
          programId: TOKEN_PROGRAM_ID
        },
        'processed'
      );

      some(parsedTokenAccounts.value, (tokenAccountInfo) => {
        try {
          // `tokenAccountAddress` is same as `authorityTokenAccount`
          // (used in input to `depositToVault`)
          const tokenAccountAddress = tokenAccountInfo.pubkey.toBase58(),
            parsedInfo = tokenAccountInfo.account.data.parsed.info,
            tokenMintAddress = parsedInfo.mint;

          if (tokenMintAddress !== _reserveData.mintAddress) {
            return false;
          }

          authorityTokenAccount = tokenAccountAddress;

          return true;
        }
        catch (e) {
          return false;
        }
      });
    }

    const txn = new anchor.web3.Transaction();

    const {
      decimals,
      collateralTokenMint,
      account,
      liquiditySupplyTokenAccount,
      name: reserveName
    } = _reserveData;

    const collateralMintAccount = await serumAssoToken.getAssociatedTokenAddress(
      wallet.publicKey,
      new PublicKey(collateralTokenMint)
    );
    const collateralMintAccountInfo = await connection.getAccountInfo(
      collateralMintAccount
    );

    let fromAccount = new PublicKey(authorityTokenAccount);
    let signers = [];

    if (reserveName === 'SOL') {
      const lamportsToCreateAccount =
        await connection.getMinimumBalanceForRentExemption(
          ACCOUNT_LAYOUT.span,
          commitment
        );

      const newAccount = new anchor.web3.Account();

      signers.push(newAccount);

      fromAccount = newAccount.publicKey;
      txn.add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: fromAccount,
          lamports: amount * Math.pow(10, decimals) + lamportsToCreateAccount,
          space: ACCOUNT_LAYOUT.span,
          programId: TOKEN_PROGRAM_ID
        })
      );

      txn.add(
        Token.createInitAccountInstruction(
          TOKEN_PROGRAM_ID,
          new PublicKey(TOKENS.WSOL.mintAddress),
          fromAccount,
          wallet.publicKey
        )
      );
    }

    if (!collateralMintAccountInfo) {
      txn.add(
        await serumAssoToken.createAssociatedTokenAccount(
          // who will pay for the account creation
          wallet.publicKey,

          // who is the account getting created for
          wallet.publicKey,

          // what mint address token is being created
          new PublicKey(collateralTokenMint)
        )
      );
    }

    const [derivedLendingMarketAuthority] =
      await anchor.web3.PublicKey.findProgramAddress(
        [new anchor.web3.PublicKey(getLendingMarketAccount()).toBytes()],
        LENDING_PROGRAM_ID
      );

    txn.add(
      refreshReserve({
        reserveAccount: new PublicKey(account),
        priceAccount: new PublicKey(getPriceFeedsForReserve(reserveName)?.price_account)
      })
    );

    txn.add(
      depositInstruction({
        liquidityAmount: amount * Math.pow(10, decimals),
        from: fromAccount,
        to: collateralMintAccount,
        reserveAccount: new PublicKey(account),
        reserveSupply: new PublicKey(liquiditySupplyTokenAccount),
        collateralMint: new PublicKey(collateralTokenMint),
        lendingMarket: new PublicKey(getLendingMarketAccount()),
        reserveAuthority: derivedLendingMarketAuthority,
        transferAuthority: wallet.publicKey
      })
    );

    if (reserveName === 'SOL') {
      txn.add(
        Token.createCloseAccountInstruction(
          TOKEN_PROGRAM_ID,
          fromAccount,
          wallet.publicKey,
          wallet.publicKey,
          []
        )
      );
    }

    return txn;
  }
  catch (e) {
    console.error(e);
    throw e;
  }
};

/**
 *
 * @param {Object} conn web3 Connection object
 * @param {Object} wallet Wallet object
 * @param {String} mintAddress Mint Address of the Vault
 * @param {String} authorityTokenAccount Token account address of the user corresponding to the vault
 * @param {String|Number} amount Amount to deposit
 *
 * @returns {Promise}
 */
const withdrawFromLendingReserve = async (
  conn,
  wallet,
  mintAddress,
  authorityTokenAccount,
  amount
) => {
  const txn = new anchor.web3.Transaction();

  const {
    decimals,
    collateralTokenMint,
    account,
    liquiditySupplyTokenAccount,
    name: reserveName
  } = getReserveByMintAddress(mintAddress) || {};

  const collateralMintAccount = await serumAssoToken.getAssociatedTokenAddress(
    wallet.publicKey,
    new PublicKey(collateralTokenMint)
  );

  const [derivedLendingMarketAuthority] =
    await anchor.web3.PublicKey.findProgramAddress(
      [new anchor.web3.PublicKey(getLendingMarketAccount()).toBytes()],
      LENDING_PROGRAM_ID
    );

  const [
    authorityTokenAccountInfo,
    collateralTokenAccountInfo,
    reserveAccountInfo
  ] = await getMultipleAccounts(
    conn,
    [
      new PublicKey(authorityTokenAccount),
      new PublicKey(collateralTokenMint),
      new PublicKey(account)
    ],
    commitment
  );

  const decodedAuthorityTokenAccountInfo = ACCOUNT_LAYOUT.decode(
    authorityTokenAccountInfo.account.data
  );
  const decodedCollateralTokenAccountInfo = MINT_LAYOUT.decode(
    collateralTokenAccountInfo.account.data
  );
  const decodedReserveAccountInfo = LENDING_RESERVE_LAYOUT.decode(
    reserveAccountInfo.account.data
  );

  let toAccount;

  if (reserveName !== 'SOL' && !decodedAuthorityTokenAccountInfo) {
    txn.add(
      await serumAssoToken.createAssociatedTokenAccount(
        // who will pay for the account creation
        wallet.publicKey,

        // who is the account getting created for
        wallet.publicKey,

        // what mint address token is being created
        new anchor.web3.PublicKey(mintAddress)
      )
    );

    toAccount = await serumAssoToken.getAssociatedTokenAddress(
      wallet.publicKey,
      new anchor.web3.PublicKey(mintAddress)
    );
  }
  else {
    toAccount = new PublicKey(authorityTokenAccount);
  }

  let signers = [];

  if (reserveName === 'SOL') {
    const lamportsToCreateAccount =
      await conn.getMinimumBalanceForRentExemption(
        ACCOUNT_LAYOUT.span,
        commitment
      );

    const newAccount = new anchor.web3.Account();

    signers.push(newAccount);

    toAccount = newAccount.publicKey;

    txn.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: toAccount,
        lamports: lamportsToCreateAccount,
        space: ACCOUNT_LAYOUT.span,
        programId: TOKEN_PROGRAM_ID
      })
    );

    txn.add(
      Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
        new PublicKey(TOKENS.WSOL.mintAddress),
        toAccount,
        wallet.publicKey
      )
    );
  }

  txn.add(
    refreshReserve({
      reserveAccount: new PublicKey(account),
      priceAccount: new PublicKey(getPriceFeedsForReserve(reserveName)?.price_account)
    })
  );

  const {
    availableAmount,
    platformAmountWads,
    borrowedAmount: borrowedAmountWads
  } = decodedReserveAccountInfo?.liquidity || {};
  const { supply: uiAmountRaw } = decodedCollateralTokenAccountInfo || {};

  const borrowedAmount = new TokenAmount(borrowedAmountWads.div(WAD), decimals);
  const platformAmount = new TokenAmount(platformAmountWads.div(WAD), decimals);
  const availableAmountWei = new TokenAmount(availableAmount, decimals);
  const totalSupply = availableAmountWei.wei
    .plus(borrowedAmount.wei)
    .minus(platformAmount.wei);

  const userInputValue = new anchor.BN(Number(amount) * Math.pow(10, decimals));
  const totalSupplyBN = new anchor.BN(totalSupply.toString());
  const uiAmountBN = new anchor.BN(uiAmountRaw);
  const collateralAmount = userInputValue.mul(uiAmountBN).div(totalSupplyBN);

  txn.add(
    withdrawInstruction({
      collateralAmount,
      from: collateralMintAccount,
      to: toAccount,
      reserveAccount: new PublicKey(account),
      reserveSupply: new PublicKey(liquiditySupplyTokenAccount),
      collateralMint: new PublicKey(collateralTokenMint),
      lendingMarket: new PublicKey(getLendingMarketAccount()),
      reserveAuthority: derivedLendingMarketAuthority,
      transferAuthority: wallet.publicKey
    })
  );

  if (reserveName === 'SOL') {
    txn.add(
      Token.createCloseAccountInstruction(
        TOKEN_PROGRAM_ID,
        toAccount,
        wallet.publicKey,
        wallet.publicKey,
        []
      )
    );
  }

  return txn;
};

/**
 * @description
 * Withdraw amount from a lending reserve such as USDC or TULIP etc.
 * Refer https://tulip.garden/lend to find the reserve name.
 *
 * @param {Object} data.connection web3 Connection object
 * @param {Object} data.wallet wallet object (@solana/web3 version >= 1.4.0)
 * @param {String} data.reserve reserve symbol or mint address
 *  (for eg: USDC or `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`)
 * @param {String|Number} data.amount amount to withdraw
 * @param {String} [data.authorityTokenAccount] [optional] data.authorityTokenAccount
 *  authorityTokenAccount of the reserve
 *
 * @returns {Promise}
 */
const withdrawFromLendingReserveV2 = async ({
  connection,
  wallet,
  reserve,
  amount,
  authorityTokenAccount
}) => {
  if (!connection) {
    throw new Error('TulipProtocol-SDK~withdrawFromLendingReserveV2: connection parameter is missing');
  }

  if (!wallet) {
    throw new Error('TulipProtocol-SDK~withdrawFromLendingReserveV2: wallet parameter is missing');
  }

  if (!reserve) {
    throw new Error('TulipProtocol-SDK~withdrawFromLendingReserveV2: reserve symbol/mintAddress parameter is missing');
  }

  const _reserveData = getReserveByName(reserve) || getReserveByMintAddress(reserve);

  if (!_reserveData) {
    throw new Error(
      `
        TulipProtocol-SDK~withdrawFromLendingReserveV2: reserve symbol/mintAddress is not supported. Please verify that
        the symbol or mintAddress that is provided is correct. Provided: ${reserve}
      `
    );
  }

  const mintAddress = _reserveData.mintAddress;

  try {
    // If the authorityTokenAccount has not been provided then fetch it
    if (!authorityTokenAccount) {
      // Set token accounts
      const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
        wallet.publicKey,
        {
          programId: TOKEN_PROGRAM_ID
        },
        commitment
      );

      some(parsedTokenAccounts.value, (tokenAccountInfo) => {
        if (!isFunction(tokenAccountInfo?.pubkey?.toBase58)) {
          return false;
        }

        // `tokenAccountAddress` is same as `authorityTokenAccount`
        // (used in input to `depositToVault`)
        const tokenAccountAddress = tokenAccountInfo.pubkey.toBase58(),
          parsedInfo = tokenAccountInfo.account.data.parsed.info,
          tokenMintAddress = parsedInfo.mint;

        if (tokenMintAddress !== _reserveData.mintAddress) {
          return false;
        }

        authorityTokenAccount = tokenAccountAddress;

        return true;
      });
    }

    const txn = new anchor.web3.Transaction();

    const {
      decimals,
      collateralTokenMint,
      account,
      liquiditySupplyTokenAccount,
      name: reserveName
    } = _reserveData;

    const collateralMintAccount = await serumAssoToken.getAssociatedTokenAddress(
      wallet.publicKey,
      new PublicKey(collateralTokenMint)
    );

    const [derivedLendingMarketAuthority] =
      await anchor.web3.PublicKey.findProgramAddress(
        [new anchor.web3.PublicKey(getLendingMarketAccount()).toBytes()],
        LENDING_PROGRAM_ID
      );

    const [
      authorityTokenAccountInfo,
      collateralTokenAccountInfo,
      reserveAccountInfo
    ] = await getMultipleAccounts(
      connection,
      [
        new PublicKey(authorityTokenAccount),
        new PublicKey(collateralTokenMint),
        new PublicKey(account)
      ],
      commitment
    );

    const decodedAuthorityTokenAccountInfo = ACCOUNT_LAYOUT.decode(
      authorityTokenAccountInfo.account.data
    );
    const decodedCollateralTokenAccountInfo = MINT_LAYOUT.decode(
      collateralTokenAccountInfo.account.data
    );
    const decodedReserveAccountInfo = LENDING_RESERVE_LAYOUT.decode(
      reserveAccountInfo.account.data
    );

    let toAccount;

    if (reserveName !== 'SOL' && !decodedAuthorityTokenAccountInfo) {
      txn.add(
        await serumAssoToken.createAssociatedTokenAccount(
          // who will pay for the account creation
          wallet.publicKey,

          // who is the account getting created for
          wallet.publicKey,

          // what mint address token is being created
          new anchor.web3.PublicKey(mintAddress)
        )
      );

      toAccount = await serumAssoToken.getAssociatedTokenAddress(
        wallet.publicKey,
        new anchor.web3.PublicKey(mintAddress)
      );
    }
    else {
      toAccount = new PublicKey(authorityTokenAccount);
    }

    let signers = [];

    if (reserveName === 'SOL') {
      const lamportsToCreateAccount =
        await connection.getMinimumBalanceForRentExemption(
          ACCOUNT_LAYOUT.span,
          commitment
        );

      const newAccount = new anchor.web3.Account();

      signers.push(newAccount);

      toAccount = newAccount.publicKey;

      txn.add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: toAccount,
          lamports: lamportsToCreateAccount,
          space: ACCOUNT_LAYOUT.span,
          programId: TOKEN_PROGRAM_ID
        })
      );

      txn.add(
        Token.createInitAccountInstruction(
          TOKEN_PROGRAM_ID,
          new PublicKey(TOKENS.WSOL.mintAddress),
          toAccount,
          wallet.publicKey
        )
      );
    }

    txn.add(
      refreshReserve({
        reserveAccount: new PublicKey(account),
        priceAccount: new PublicKey(getPriceFeedsForReserve(reserveName)?.price_account)
      })
    );

    const {
      availableAmount,
      platformAmountWads,
      borrowedAmount: borrowedAmountWads
    } = decodedReserveAccountInfo?.liquidity || {};
    const { supply: uiAmountRaw } = decodedCollateralTokenAccountInfo || {};

    const borrowedAmount = new TokenAmount(borrowedAmountWads.div(WAD), decimals);
    const platformAmount = new TokenAmount(platformAmountWads.div(WAD), decimals);
    const availableAmountWei = new TokenAmount(availableAmount, decimals);
    const totalSupply = availableAmountWei.wei
      .plus(borrowedAmount.wei)
      .minus(platformAmount.wei);

    const userInputValue = new anchor.BN(Number(amount) * Math.pow(10, decimals));
    const totalSupplyBN = new anchor.BN(totalSupply.toString());
    const uiAmountBN = new anchor.BN(uiAmountRaw);
    const collateralAmount = userInputValue.mul(uiAmountBN).div(totalSupplyBN);

    txn.add(
      withdrawInstruction({
        collateralAmount,
        from: collateralMintAccount,
        to: toAccount,
        reserveAccount: new PublicKey(account),
        reserveSupply: new PublicKey(liquiditySupplyTokenAccount),
        collateralMint: new PublicKey(collateralTokenMint),
        lendingMarket: new PublicKey(getLendingMarketAccount()),
        reserveAuthority: derivedLendingMarketAuthority,
        transferAuthority: wallet.publicKey
      })
    );

    if (reserveName === 'SOL') {
      txn.add(
        Token.createCloseAccountInstruction(
          TOKEN_PROGRAM_ID,
          toAccount,
          wallet.publicKey,
          wallet.publicKey,
          []
        )
      );
    }

    return txn;
  }
  catch (e) {
    console.error(e);
    throw e;
  }
};

export {
  depositToLendingReserve,
  withdrawFromLendingReserve,
  depositToLendingReserveV2,
  withdrawFromLendingReserveV2
};
