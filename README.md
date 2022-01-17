# Platform SDK

Hello, we are glad to introduce Tulip Protocol's Platform SDK to fellow Solana Developers!\
You can use this SDK to easily integrate Tulip Protocol's Vaults into your product. Cheers 🍻

# Installation
```
npm install --save @tulip-protocol/platform-sdk
```

# Usage

- [Vaults](#vaults)
  - [depositToVault](#deposittovault)
  - [withdrawFromVault](#withdrawfromvault)
  - [getBalanceForVault](#getbalanceforvault)
- [Lending](#lending)
  - [depositToLendingReserve](#deposittolendingreserve)
  - [withdrawFromLendingReserve](#withdrawfromlendingreserve)

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
- `amount: String | Number` - Amount to deposit

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
  const authorityTokenAccount = tokenAccounts[farmMintAddress].tokenAccountAddress;

  const transaction = await withdrawFromVault(
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
## `depositToLendingReserve`
Deposit to a Lending Reserve

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

## `withdrawFromLendingReserve`
Withdraw from a Lending Reserve

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