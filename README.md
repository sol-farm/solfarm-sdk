# SolFarm SDK

Hello, we are glad to introduce SolFarm SDK to fellow Solana Developers! You can use this SDK to easily integrate SolFarm's Vaults into your product. Cheers 🍻

# Installation
```
npm install --save https://github.com/sol-farm/solfarm-sdk.git
```

# Usage

## `depositToVault`
Deposit to Raydium Vault

`depositToVault(userAddress: PublicKey, mintAddress: String, authorityTokenAccount: PublicKey, amount: String | Number)`

### Parameters
- `userAddress: PublicKey` - Public key of the user
- `mintAddress: String` - Mint Address of the Vault
- `authorityTokenAccount: PublicKey` - Token account address of the user corresponding to the vault
- `amount: String | Number` - Amount to deposit

### Returns
`Promise<transaction: Object>`

### Example

```javascript
import { depositToVault } from 'solfarm-sdk';
import { PublicKey } from '@solana/web3.js';

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

// Inputs taken by SolFarm SDK's `depositToVault`
const conn = new Connection(endpoint, { commitment });
const wallet = new SolanaWalletAdapter('', endpoint);

// For example, this is the `mintAddress` of TULIP-USDC
const farmMintAddress = '2doeZGLJyACtaG9DCUyqMLtswesfje1hjNA11hMdj6YU';

const depositToSolfarm = async () => {
  // For example, let's hardcode the `amount` to '0.01'
  const amountToDeposit = '0.01';
  const authorityTokenAccount = tokenAccounts[farmMintAddress].tokenAccountAddress;
  const userAddress = new anchor.web3.PublicKey(wallet.publicKey.toBase58())

  const transaction = await depositToVault(
    userAddress
    farmMintAddress,
    authorityTokenAccount,
    amountToDeposit
  );

  // Execute the `transaction` using the connection for the user's wallet
};
```

## `withdrawFromVault`
Withdraw from Raydium Vault

`withdrawFromVault(userAddress: PublicKey, mintAddress: String, authorityTokenAccount: PublicKey, amount: String | Number)`

### Parameters
- `userAddress: PublicKey` - Public key of the user
- `mintAddress: String` - Mint Address of the Vault
- `authorityTokenAccount: PublicKey` - Token account address of the user corresponding to the vault
- `amount: String | Number` - Amount to deposit

### Returns
`Promise<transaction: Object>`

### Example:
```javascript
import { withdrawFromVault } from 'solfarm-sdk';
import { PublicKey } from '@solana/web3.js';

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

// Inputs taken by SolFarm SDK's `withdrawFromVault`
const conn = new Connection(endpoint, { commitment });
const wallet = new SolanaWalletAdapter('', endpoint);

// For example, this is the `mintAddress` of TULIP-USDC
const farmMintAddress = '2doeZGLJyACtaG9DCUyqMLtswesfje1hjNA11hMdj6YU';

const withdrawFromSolfarm = async () => {
  // For example, let's hardcode the `amount` to '0.01'
  const amountToWithdraw = '0.01';
  const authorityTokenAccount = tokenAccounts[farmMintAddress].tokenAccountAddress;
  const userAddress = new anchor.web3.PublicKey(wallet.publicKey.toBase58())

  const transaction = await withdrawFromVault(
    userAddress,
    farmMintAddress,
    authorityTokenAccount,
    amountToWithdraw
  );

  // Execute the `transaction` using the connection for the user's wallet
};
```