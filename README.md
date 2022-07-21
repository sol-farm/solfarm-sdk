# Platform SDK

Hello, we are glad to introduce Tulip Protocol's Platform SDK to fellow Solana Developers!\
You can use this SDK to easily integrate Tulip Protocol's Vaults into your product. Cheers 🍻

# Installation
```
npm install --save @tulip-protocol/platform-sdk
```

# Usage
- [Leverage](#leverage)
  - [openMarginPosition](#openmarginposition)
  - [addCollateralPosition](#addcollateralposition)
  - [closeMarginPosition](#closemarginposition)
- [Vaults](#vaults)
  - [depositToVault](#deposittovault)
  - [withdrawFromVault](#withdrawfromvault)
  - [getBalanceForVault](#getbalanceforvault)
- [Lending](#lending)
  - [getAPYForLendingReserves](#getapyforlendingreserves)
  - [getBalanceForLendingReserves](#getbalanceforlendingreserves)
  - [depositLendingReserve](#depositlendingreserve)
  - [withdrawLendingReserve](#withdrawlendingreserve)
  - [depositToLendingReserve - OLD](#deposittolendingreserve)
  - [withdrawFromLendingReserve - OLD](#withdrawfromlendingreserve)

## Leverage

## `openMarginPosition`
Open a margin position

`openMarginPosition({ connection: Connection, wallet: SolanaWalletAdapter | Object, symbol: String, coinBorrowAmount: Number, pcBorrowAmount: Number, baseTokenAmount: Number, quoteTokenAmount: Number, obligationIdx?: Number, onSendTransactions?: Function })`

### Data Parameters
- `connection: Connection` - web3 Connection object
- `wallet: SolanaWalletAdapter | Object` - Wallet object
- `symbol: String` - Asset symbol of leverage farm
- `coinBorrowAmount: Number` - Coin borrow amount
- `pcBorrowAmount: Number` - PC borrow amount
- `baseTokenAmount: Number` - Base token amount
- `quoteTokenAmount: Number` - Quote token amount
- `obligationIdx?: Number` - [Optional] Obligation index for the position state
- `onSendTransactions: Function` - [Optional] Web3 function to execute multiple transactions

### Returns
`Promise<transaction: Transaction>`

### Example

```javascript
import { openMarginPosition } from '@tulip-protocol/platform-sdk';
import { Connection } from '@solana/web3.js';
import SolanaWalletAdapter from '@project-serum/sol-wallet-adapter';

// Boilerplate setup for web3 connection
const endpoint = 'https://solana-api.projectserum.com';
const commitment = 'confirmed';

// Inputs taken by Tulip SDK's `depositToVault`
const connection = new Connection(endpoint, { commitment });
const wallet = new SolanaWalletAdapter('', endpoint);

const openMarginPositionTulipProtocol = ({
  symbol,
  coinBorrowAmount,
  pcBorrowAmount,
  baseTokenAmount,
  quoteTokenAmount
}) => {
  return openMarginPosition({
    connection,
    wallet,
    symbol,
    coinBorrowAmount,
    pcBorrowAmount,
    baseTokenAmount,
    quoteTokenAmount
  });
};
```

## `addCollateralPosition`
Add collateral to a margin position

`addCollateralPosition({ connection: Connection, wallet: SolanaWalletAdapter | Object, symbol: String, reserveName: String, coinBorrowAmount: Number, pcBorrowAmount: Number, baseTokenAmount: Number, quoteTokenAmount: Number, obligationIdx: Number, onSendTransactions?: Function })`

### Data Parameters
- `connection: Connection` - web3 Connection object
- `wallet: SolanaWalletAdapter | Object` - Wallet object
- `symbol: String` - Asset symbol of leverage farm
- `reserveName: String` - Reserve name of the farm. For single borrow send symbol of borrow asset else send `DEFAULT` for dual borrow.
- `coinBorrowAmount: Number` - Coin borrow amount
- `pcBorrowAmount: Number` - PC borrow amount
- `baseTokenAmount: Number` - Base token amount
- `quoteTokenAmount: Number` - Quote token amount
- `obligationIdx: Number` - Obligation index for the position state
- `onSendTransactions: Function` - [Optional] Web3 function to execute multiple transactions

### Returns
`Promise<transaction: Transaction>`

### Example

```javascript
import { addCollateralPosition } from '@tulip-protocol/platform-sdk';
import { Connection } from '@solana/web3.js';
import SolanaWalletAdapter from '@project-serum/sol-wallet-adapter';

// Boilerplate setup for web3 connection
const endpoint = 'https://solana-api.projectserum.com';
const commitment = 'confirmed';

// Inputs taken by Tulip SDK's `depositToVault`
const connection = new Connection(endpoint, { commitment });
const wallet = new SolanaWalletAdapter('', endpoint);

const addCollateralPositionTulipProtocol = ({
  symbol,
  obligationIdx,
  reserveName,
  baseTokenAmount,
  quoteTokenAmount,
  coinBorrowAmount,
  pcBorrowAmount
}) => {
  return addCollateralPosition({
    connection,
    wallet,
    symbol,
    obligationIdx,
    reserveName,
    baseTokenAmount,
    quoteTokenAmount,
    coinBorrowAmount,
    pcBorrowAmount
  });
};
```

## `closeMarginPosition`
Close off the margin position

`closeMarginPosition({ connection: Connection, wallet: SolanaWalletAdapter | Object, symbol: String,  obligationIdx: Number, selectedOption: Number, partialClose: Number, onSendTransactions?: Function })`

### Data Parameters
- `connection: Connection` - web3 Connection object
- `wallet: SolanaWalletAdapter | Object` - Wallet object
- `symbol: String` - Asset symbol of leverage farm
- `obligationIdx: Number` - Obligation index for the position state
- `selectedOption: Number` - Use one of the value from `CLOSE_POSITION_OPTIONS` options
- `partialClose: Number` - Percentage value to partial close a position from 0 - 100%. Defaults to 100.
- `onSendTransactions: Function` - [Optional] Web3 function to execute multiple transactions

CLOSE_POSITION_OPTIONS = {
  MINIMIZE_TRADING: 10,
  CONVERT_TO_COIN: 11,
  CONVERT_TO_PC: 12
};

### Returns
`Promise<transaction: Transaction>`

### Example

```javascript
import { closeMarginPosition, CLOSE_POSITION_OPTIONS } from '@tulip-protocol/platform-sdk';
import { Connection } from '@solana/web3.js';
import SolanaWalletAdapter from '@project-serum/sol-wallet-adapter';

// Boilerplate setup for web3 connection
const endpoint = 'https://solana-api.projectserum.com';
const commitment = 'confirmed';

// Inputs taken by Tulip SDK's `depositToVault`
const connection = new Connection(endpoint, { commitment });
const wallet = new SolanaWalletAdapter('', endpoint);

const closeMarginPositionTulipProtocol = ({
  symbol,
  obligationIdx,
  selectedOption: CLOSE_POSITION_OPTIONS.MINIMIZE_TRADING,
  partialClose: 100
}) => {
  return closeMarginPosition({
    wallet,
    connection,
    symbol,
    obligationIdx,
    selectedOption,
    partialClose
  });
};
```

## Vaults
## `depositToVault`
Deposit to Raydium Vault

`depositToVault(conn: Connection, wallet: SolanaWalletAdapter | Object, mintAddress: String, authorityTokenAccount: PublicKey, amount: String | Number)`

### Parameters
- `conn: Connection` - web3 Connection object
- `wallet: SolanaWalletAdapter | Object` - Wallet object
- `mintAddress: String` - Mint Address of the Vault
- `authorityTokenAccount: PublicKey` - Token account address of the user corresponding to the vault
- `amount: String | Number` - Amount to deposit

### Returns
`Promise<transaction: Transaction>`

### Example

```javascript
import { depositToVault } from '@tulip-protocol/platform-sdk';
import { Connection } from '@solana/web3.js';
import SolanaWalletAdapter from '@project-serum/sol-wallet-adapter';
import { PublicKey } from '@solana/web3.js';

// Create a util to send transactions
import { sendTransaction } from 'utils/web3';

// Boilerplate setup for web3 connection
const endpoint = 'https://solana-api.projectserum.com';
const commitment = 'confirmed';
const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
);

// Token Accounts in the user's wallet
const tokenAccounts = {};

// Set token accounts
(() => {
  conn
    .getParsedTokenAccountsByOwner(
      wallet.publicKey,
      {
        programId: TOKEN_PROGRAM_ID,
      },
      commitment
    )
    .then((parsedTokenAccounts) => {
      parsedTokenAccounts.value.forEach((tokenAccountInfo) => {
        // `tokenAccountAddress` is same as `authorityTokenAccount`
        // (used in input to `depositToVault`)
        const tokenAccountAddress = tokenAccountInfo.pubkey.toBase58(),
          parsedInfo = tokenAccountInfo.account.data.parsed.info,
          mintAddress = parsedInfo.mint,
          balance = parsedInfo.tokenAmount.amount;

        tokenAccounts[mintAddress] = {
          tokenAccountAddress,
          balance,
        };
      });
    });
})();

// Inputs taken by Tulip SDK's `depositToVault`
const conn = new Connection(endpoint, { commitment });
const wallet = new SolanaWalletAdapter('', endpoint);

// For example, this is the `mintAddress` of TULIP-USDC
const farmMintAddress = '2doeZGLJyACtaG9DCUyqMLtswesfje1hjNA11hMdj6YU';

const depositToTulipProtocol = async () => {
  // For example, let's hardcode the `amount` to '0.01'
  const amountToDeposit = '0.01';
  const authorityTokenAccount = tokenAccounts[farmMintAddress].tokenAccountAddress;

  const transaction = await depositToVault(
    conn,
    wallet,
    farmMintAddress,
    authorityTokenAccount,
    amountToDeposit
  );

  // Let's assume this is how the function signature of
  // your custom `sendTransaction` looks like
  return sendTransaction(conn, wallet, transaction);
};
```

## `withdrawFromVault`
Withdraw from Raydium Vault

`withdrawFromVault(conn: Connection, wallet: SolanaWalletAdapter | Object, mintAddress: String, authorityTokenAccount: PublicKey, amount: String | Number)`

### Parameters
- `conn: Connection` - web3 Connection object
- `wallet: SolanaWalletAdapter | Object` - Wallet object
- `mintAddress: String` - Mint Address of the Vault
- `authorityTokenAccount: PublicKey` - Token account address of the user corresponding to the vault
- `amount?: String | Number` - [Optional] Amount to withdraw (Use this if you don't have userShares)
- `userShares?: Number` - [Optional] User shares to withdraw (Use this if you don't have amount)

### Returns
`Promise<transaction: Transaction>`

### Example:
```javascript
import { withdrawFromVault } from '@tulip-protocol/platform-sdk';
import { Connection } from '@solana/web3.js';
import SolanaWalletAdapter from '@project-serum/sol-wallet-adapter';
import { PublicKey } from '@solana/web3.js';

// Create a util to send transactions
import { sendTransaction } from 'utils/web3';

// Boilerplate setup for web3 connection
const endpoint = 'https://solana-api.projectserum.com';
const commitment = 'confirmed';
const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
);

// Token Accounts in the user's wallet
const tokenAccounts = {};

// Set token accounts
(() => {
  conn
    .getParsedTokenAccountsByOwner(
      wallet.publicKey,
      {
        programId: TOKEN_PROGRAM_ID,
      },
      commitment
    )
    .then((parsedTokenAccounts) => {
      parsedTokenAccounts.value.forEach((tokenAccountInfo) => {
        // `tokenAccountAddress` is same as `authorityTokenAccount`
        // (used in input to `withdrawFromVault`)
        const tokenAccountAddress = tokenAccountInfo.pubkey.toBase58(),
          parsedInfo = tokenAccountInfo.account.data.parsed.info,
          mintAddress = parsedInfo.mint,
          balance = parsedInfo.tokenAmount.amount;

        tokenAccounts[mintAddress] = {
          tokenAccountAddress,
          balance,
        };
      });
    });
})();

// Inputs taken by Tulip SDK's `withdrawFromVault`
const conn = new Connection(endpoint, { commitment });
const wallet = new SolanaWalletAdapter('', endpoint);

// For example, this is the `mintAddress` of TULIP-USDC
const farmMintAddress = '2doeZGLJyACtaG9DCUyqMLtswesfje1hjNA11hMdj6YU';

const withdrawFromTulipProtocol = async () => {
  // For example, let's hardcode the `amount` to '0.01'
  const amountToWithdraw = '0.01';

  // You can also use userShares directly instead of providing an amount,
  // and we suggest using it when you want to withdraw all the shares from a vault
  const userShares = 0;

  const authorityTokenAccount = tokenAccounts[farmMintAddress].tokenAccountAddress;

  const transaction = await withdrawFromVault(
    conn,
    wallet,
    farmMintAddress,
    authorityTokenAccount,
    amountToWithdraw,
    userShares
  );

  // Let's assume this is how the function signature of
  // your custom `sendTransaction` looks like
  return sendTransaction(conn, wallet, transaction);
};
```


## `getBalanceForVault`
Get Balance for a user in a Vault

`getBalanceForVault(conn: Connection, wallet: SolanaWalletAdapter | Object, mintAddress: String)`

### Parameters
- `conn: Connection` - web3 Connection object
- `wallet: SolanaWalletAdapter | Object` - Wallet object
- `mintAddress: String` - Mint Address of the Vault

### Returns
`Promise<{ lastDepositTime: BigNumber, depositedAmount: BigNumber, rewardsSinceLastDeposit: BigNumber }>`

### Example:
```javascript
import { getBalanceForVault } from '@tulip-protocol/platform-sdk';
import { Connection } from '@solana/web3.js';
import SolanaWalletAdapter from '@project-serum/sol-wallet-adapter';

// Boilerplate setup for web3 connection
const endpoint = 'https://solana-api.projectserum.com';
const commitment = 'confirmed';

// Inputs taken by Tulip SDK's `getBalanceForVault`
const conn = new Connection(endpoint, { commitment });
const wallet = new SolanaWalletAdapter('', endpoint);

// For example, this is the `mintAddress` of TULIP-USDC
const farmMintAddress = '2doeZGLJyACtaG9DCUyqMLtswesfje1hjNA11hMdj6YU';

const getUserBalanceForTulipProtocol = async () => {
  const {
    lastDepositTime,
    depositedAmount,
    rewardsSinceLastDeposit
  } = await getBalanceForVault(conn, wallet, farmMintAddress);

  return {
    lastDepositTime,
    depositedAmount,
    rewardsSinceLastDeposit
  };
};
```

## Lending

## `getAPYForLendingReserves`
Get APYs for lending reserves.

The function accepts a single object as an argument with the following properties.
```
getAPYForLendingReserves({
  connection: Connection,
  reserves: Array<String>
})
```

### Data Parameters
- `connection: Connection` - web3 Connection object
- `reserves: Array<String>` - Symbol or mint address of the reserves for example [`USDC`, `TULIP`] or [`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`]

### Returns
`Promise<reserveData: Array<Object>>`

### Example

```javascript
import { getAPYForLendingReserves } from '@tulip-protocol/platform-sdk';
import { Connection } from '@solana/web3.js';

// Boilerplate setup for web3 connection
const endpoint = 'https://solana-api.projectserum.com';
const commitment = 'confirmed';

// Inputs taken by Tulip SDK's `getAPYForLendingReserves`
const connection = new Connection(endpoint, { commitment });

const getTulipProtocolLendingReserveAPYs = async (reserves) => {
  const reserveData = await getAPYForLendingReserves({
    connection,
    reserves
  });

  // Map over it if needed to take out just the `name` and `lendAPY` property
  return reserveData.map((reserve) => {
    return {
      name: reserve.name,
      lendAPY: reserve.lendAPY
    };
  });
};
```

## `getBalanceForLendingReserves`
Get user's balance for lending reserves.

The function accepts a single object as an argument with the following properties.
```
getBalanceForLendingReserves({
  connection: Connection,
  wallet: SolanaWalletAdapter | Object,
  reserves: Array<String>
})
```

### Data Parameters
- `connection: Connection` - web3 Connection object
- `wallet: SolanaWalletAdapter | Object` - Wallet object
- `reserves: Array<String>` - Symbol or mint address of the reserves for example [`USDC`, `TULIP`] or [`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`]

### Returns
`Promise<reserveData: Array<Object>>`

### Example

```javascript
import { getBalanceForLendingReserves } from '@tulip-protocol/platform-sdk';
import { Connection } from '@solana/web3.js';

// You can have any wallet adapter you may want, we're taking Phantom as an example here.
// More info can be found here: https://github.com/solana-labs/wallet-adapter#wallets
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

// Boilerplate setup for web3 connection
const endpoint = 'https://solana-api.projectserum.com';
const commitment = 'confirmed';

// Inputs taken by Tulip SDK's `getBalanceForLendingReserves`
const connection = new Connection(endpoint, { commitment });
const wallet = new PhantomWalletAdapter();

const getTulipProtocolLendingReserveBalances = async (reserves) => {
  const reserveData = await getBalanceForLendingReserves({
    connection,
    wallet,
    reserves
  });

  // Map over it if needed to take out just the `name` and `deposited` property
  return reserveData.map((reserve) => {
    return {
      name: reserve.name,
      deposited: reserve.deposited
    };
  });
};
```

## `depositLendingReserve`
Deposit to a Lending Reserve.

The function accepts a single object as an argument with the following properties.
```
depositToLendingReserve({
  connection: Connection,
  wallet: SolanaWalletAdapter | Object,
  reserve: String,
  amount: String | Number,
  authorityTokenAccount?: PublicKey
})
```

### Data Parameters
- `connection: Connection` - web3 Connection object
- `wallet: SolanaWalletAdapter | Object` - Wallet object
- `reserve: String` - Symbol or mint address of the reserve for example `USDC` or `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- `amount: String | Number` - Amount to deposit
- `authorityTokenAccount?: PublicKey` - [Optional] Token account address of the user corresponding to the reserve, if not provided
  then will automatically be fetched by the SDK

### Returns
`Promise<transaction: Transaction>`

### Example

```javascript
import { depositLendingReserve } from '@tulip-protocol/platform-sdk';
import { Connection } from '@solana/web3.js';

// You can have any wallet adapter you may want, we're taking Phantom as an example here.
// More info can be found here: https://github.com/solana-labs/wallet-adapter#wallets
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

// Create a util to send transactions
import { sendTransaction } from 'utils/web3';

// Boilerplate setup for web3 connection
const endpoint = 'https://solana-api.projectserum.com';
const commitment = 'confirmed';

// Inputs taken by Tulip SDK's `depositLendingReserve`
const connection = new Connection(endpoint, { commitment });
const wallet = new PhantomWalletAdapter();

/**
 * Now you need the lending reserve for which you'd want to deposit funds.
 * Refer: https://tulip.garden/lend to find the lending reserve symbol you want.
 * The reserve's symbol or mint address can be provided as the value.
 * For example, this is the symbol of `TULIP`
 */
const reserve = 'TULIP';

const depositToTulipProtocol = async () => {
  // Let's take the hardcoded amount for the example
  const amount = '145';

  const transaction = await depositLendingReserve({
    connection,
    wallet,
    reserve,
    amount
  });

  // Let's assume this is how the function signature of
  // your custom `sendTransaction` looks like
  return sendTransaction(connection, wallet, transaction);
};
```

## `withdrawLendingReserve`
Withdraw from a Lending Reserve.

The function accepts a single object as an argument with the following properties.
```
withdrawLendingReserve({
  connection: Connection,
  wallet: SolanaWalletAdapter | Object,
  reserve: String,
  amount: String | Number,
  authorityTokenAccount?: PublicKey
})
```

### Data Parameters
- `connection: Connection` - web3 Connection object
- `wallet: SolanaWalletAdapter | Object` - Wallet object
- `reserve: String` - Symbol or mint address of the reserve for example `USDC` or `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- `amount: String | Number` - Amount to withdraw
- `authorityTokenAccount?: PublicKey` - [Optional] Token account address of the user corresponding to the reserve, if not provided
  then will automatically be fetched by the SDK

### Returns
`Promise<transaction: Transaction>`

### Example

```javascript
import { withdrawLendingReserve } from '@tulip-protocol/platform-sdk';
import { Connection } from '@solana/web3.js';

// You can have any wallet adapter you may want, we're taking Phantom as an example here.
// More info can be found here: https://github.com/solana-labs/wallet-adapter#wallets
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

// Create a util to send transactions
import { sendTransaction } from 'utils/web3';

// Boilerplate setup for web3 connection
const endpoint = 'https://solana-api.projectserum.com';
const commitment = 'confirmed';

// Inputs taken by Tulip SDK's `depositLendingReserve`
const connection = new Connection(endpoint, { commitment });
const wallet = new PhantomWalletAdapter();

/**
 * Now you need the lending reserve for which you'd want to withdraw funds from.
 * Refer: https://tulip.garden/lend to find the lending reserve symbol you want.
 * The reserve's symbol or mint address can be provided as the value.
 * For example, this is the symbol of `TULIP`
 */
const reserve = 'TULIP';

const withdrawFromTulipProtocol = async () => {
  // Let's take the hardcoded amount for the example
  const amount = '145';

  const transaction = await withdrawLendingReserve({
    connection,
    wallet,
    reserve,
    amount
  });

  // Let's assume this is how the function signature of
  // your custom `sendTransaction` looks like
  return sendTransaction(connection, wallet, transaction);
};
```

## `depositToLendingReserve` [OLD]
Deposit to a Lending Reserve.
We recommend using the `depositLendingReserve` function instead, since it has been updated
with automatic authorityToken finding and can accept a reserve symbol etc.

`depositToLendingReserve(conn: Connection, wallet: SolanaWalletAdapter | Object, mintAddress: String, authorityTokenAccount: PublicKey, amount: String | Number)`

### Parameters
- `conn: Connection` - web3 Connection object
- `wallet: SolanaWalletAdapter | Object` - Wallet object
- `mintAddress: String` - Mint Address of the Vault
- `authorityTokenAccount: PublicKey` - Token account address of the user corresponding to the reserve
- `amount: String | Number` - Amount to deposit

### Returns
`Promise<transaction: Transaction>`

### Example

```javascript
import { depositToLendingReserve } from '@tulip-protocol/platform-sdk';
import { Connection } from '@solana/web3.js';
import SolanaWalletAdapter from '@project-serum/sol-wallet-adapter';
import { PublicKey } from '@solana/web3.js';

// Create a util to send transactions
import { sendTransaction } from 'utils/web3';

// Boilerplate setup for web3 connection
const endpoint = 'https://solana-api.projectserum.com';
const commitment = 'confirmed';
const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
);

// Token Accounts in the user's wallet
const tokenAccounts = {};

// Set token accounts
(() => {
  conn
    .getParsedTokenAccountsByOwner(
      wallet.publicKey,
      {
        programId: TOKEN_PROGRAM_ID,
      },
      commitment
    )
    .then((parsedTokenAccounts) => {
      parsedTokenAccounts.value.forEach((tokenAccountInfo) => {
        // `tokenAccountAddress` is same as `authorityTokenAccount`
        // (used in input to `depositToLendingReserve`)
        const tokenAccountAddress = tokenAccountInfo.pubkey.toBase58(),
          parsedInfo = tokenAccountInfo.account.data.parsed.info,
          mintAddress = parsedInfo.mint,
          balance = parsedInfo.tokenAmount.amount;

        tokenAccounts[mintAddress] = {
          tokenAccountAddress,
          balance,
        };
      });
    });
})();

// Inputs taken by Tulip SDK's `depositToLendingReserve`
const conn = new Connection(endpoint, { commitment });
const wallet = new SolanaWalletAdapter('', endpoint);

// For example, this is the `mintAddress` of TULIP
const farmMintAddress = 'TuLipcqtGVXP9XR62wM8WWCm6a9vhLs7T1uoWBk6FDs';

const depositToTulipProtocol = async () => {
  // For example, let's hardcode the `amount` to '0.01'
  const amountToDeposit = '0.01';
  const authorityTokenAccount = tokenAccounts[farmMintAddress].tokenAccountAddress;

  const transaction = await depositToLendingReserve(
    conn,
    wallet,
    farmMintAddress,
    authorityTokenAccount,
    amountToDeposit
  );

  // Let's assume this is how the function signature of
  // your custom `sendTransaction` looks like
  return sendTransaction(conn, wallet, transaction);
};
```

## `withdrawFromLendingReserve` [OLD]
Withdraw from a Lending Reserve
We recommend using the `withdrawLendingReserve` function instead, since it has been updated
with automatic authorityToken finding and can accept a reserve symbol etc.

`withdrawFromLendingReserve(conn: Connection, wallet: SolanaWalletAdapter | Object, mintAddress: String, authorityTokenAccount: PublicKey, amount: String | Number)`

### Parameters
- `conn: Connection` - web3 Connection object
- `wallet: SolanaWalletAdapter | Object` - Wallet object
- `mintAddress: String` - Mint Address of the Vault
- `authorityTokenAccount: PublicKey` - Token account address of the user corresponding to the vault
- `amount: String | Number` - Amount to deposit

### Returns
`Promise<transaction: Transaction>`

### Example:
```javascript
import { withdrawFromLendingReserve } from '@tulip-protocol/platform-sdk';
import { Connection } from '@solana/web3.js';
import SolanaWalletAdapter from '@project-serum/sol-wallet-adapter';
import { PublicKey } from '@solana/web3.js';

// Create a util to send transactions
import { sendTransaction } from 'utils/web3';

// Boilerplate setup for web3 connection
const endpoint = 'https://solana-api.projectserum.com';
const commitment = 'confirmed';
const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
);

// Token Accounts in the user's wallet
const tokenAccounts = {};

// Set token accounts
(() => {
  conn
    .getParsedTokenAccountsByOwner(
      wallet.publicKey,
      {
        programId: TOKEN_PROGRAM_ID,
      },
      commitment
    )
    .then((parsedTokenAccounts) => {
      parsedTokenAccounts.value.forEach((tokenAccountInfo) => {
        // `tokenAccountAddress` is same as `authorityTokenAccount`
        // (used in input to `withdrawFromLendingReserve`)
        const tokenAccountAddress = tokenAccountInfo.pubkey.toBase58(),
          parsedInfo = tokenAccountInfo.account.data.parsed.info,
          mintAddress = parsedInfo.mint,
          balance = parsedInfo.tokenAmount.amount;

        tokenAccounts[mintAddress] = {
          tokenAccountAddress,
          balance,
        };
      });
    });
})();

// Inputs taken by Tulip SDK's `withdrawFromLendingReserve`
const conn = new Connection(endpoint, { commitment });
const wallet = new SolanaWalletAdapter('', endpoint);

// For example, this is the `mintAddress` of TULIP
const farmMintAddress = 'TuLipcqtGVXP9XR62wM8WWCm6a9vhLs7T1uoWBk6FDs';

const withdrawFromTulipProtocol = async () => {
  // For example, let's hardcode the `amount` to '0.01'
  const amountToWithdraw = '0.01';
  const authorityTokenAccount = tokenAccounts[farmMintAddress].tokenAccountAddress;

  const transaction = await withdrawFromLendingReserve(
    conn,
    wallet,
    farmMintAddress,
    authorityTokenAccount,
    amountToWithdraw
  );

  // Let's assume this is how the function signature of
  // your custom `sendTransaction` looks like
  return sendTransaction(conn, wallet, transaction);
};
```



## `getBalancesForAutoVaults`
Fetch the total deposited balance of V2 autovaults

`getBalancesForAutoVaults(conn: Connection, wallet: SolanaWalletAdapter | Object, query: Object)`

### Parameters
- `conn: Connection` - web3 Connection object
- `wallet: SolanaWalletAdapter | Object` - Wallet object
- `query` - Query object [OPTIONAL]
- `query.platforms` - Could be any of ['raydium', 'saber', 'orca', 'atrix']
- `query.vaults` - Any supported vault symbol

### Returns
`Promise<object: Object>`

### Example:
```javascript
import { FARM_PLATFORMS, VAULTS, getBalancesForAutoVaults } from '@tulip-protocol/platform-sdk';
import { Connection } from '@solana/web3.js';
import SolanaWalletAdapter from '@project-serum/sol-wallet-adapter';
import { PublicKey } from '@solana/web3.js';

// Create a util to send transactions
import { sendTransaction } from 'utils/web3';

// Boilerplate setup for web3 connection
const endpoint = 'https://solana-api.projectserum.com';
const commitment = 'confirmed';
const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
);

// Inputs taken by Tulip SDK's `withdrawFromLendingReserve`
const conn = new Connection(endpoint, { commitment });
const wallet = new SolanaWalletAdapter('', endpoint);

const getBalanceForV2Vaults = async () => {
  // Let's say we want to fetch all the balances for all raydium and saber vaults
  // and we only need the balance for ORCA-USDC separately, then we can create the following query:
  const query = {
    platforms: [FARM_PLATFORMS.RAYDIUM, FARM_PLATFORMS.SABER],
    vaults: [VAULTS.ORCA.ATLAS_USDC]
  };

  const vaults = await getBalancesForAutoVaults(connection, getStore('WalletStore').wallet, query);

  return vaults;
};
``