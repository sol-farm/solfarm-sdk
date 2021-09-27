import * as anchor from '@project-serum/anchor';
import * as serumAssoToken from '@project-serum/associated-token';
import { SYSVAR_CLOCK_PUBKEY } from '@solana/web3.js';
import * as serum from '@project-serum/serum';

// Constants
import { TOKENS } from '../constants/tokens';
import idl from '../constants/raydium_idl.json';

// Utils
import { commitment, sendTransaction } from '../utils/web3';
import { getFarmByMintAddress } from '../utils/farmUtils';
import {
  getFarmPoolAuthority,
  getFarmPoolId,
  getFarmProgramId,
  getVaultAccount,
  getVaultInfoAccount,
  getVaultLpTokenAccount,
  getVaultPdaAccount,
  getFarmPoolLpTokenAccount,
  getVaultProgramId,
  getFarmLpMintAddress,
  getVaultRewardAccountA,
  getVaultRewardAccountB,
  getFarmPoolRewardATokenAccount,
  getFarmPoolRewardBTokenAccount,
  getFarmFusion,
  getVaultTulipTokenAccount,
  getVaultOldInfoAccount
} from '../utils/config';

/**
 *
 * @param {Object} conn web3 Connection object
 * @param {Object} wallet
 * @param {String} mintAddress Mint Address of the Vault
 * @param {String} authorityTokenAccount
 * @param {String|Number} value Amount to deposit
 *
 * @returns {Promise}
 */
const depositToVault = async (conn, wallet, mintAddress, authorityTokenAccount, value) => {
  const { decimals, symbol: assetSymbol } =
    getFarmByMintAddress(mintAddress) || {};

  const provider = new anchor.Provider(conn, wallet, {
      skipPreflight: true,
      preflightCommitment: commitment
    }),
    tulipPubKey = new anchor.web3.PublicKey(TOKENS.TULIP.mintAddress);

  anchor.setProvider(provider);

  // Address of the deployed program.
  const vaultProgramId = new anchor.web3.PublicKey(getVaultProgramId());
  // Generate the program client from IDL.
  const vaultProgram = new anchor.Program(idl, vaultProgramId);

  const txn = new anchor.web3.Transaction();

  const [userBalanceAccount, userBalanceAccountNonce] =
    await anchor.web3.PublicKey.findProgramAddress(
      [
        new anchor.web3.PublicKey(
          getVaultOldInfoAccount(assetSymbol)
        ).toBytes(),
        provider.wallet.publicKey.toBytes()
      ],
      vaultProgramId
    );

  const [userBalanceMetadataAccount, userBalanceMetadataAccountNonce] =
    await anchor.web3.PublicKey.findProgramAddress(
      [userBalanceAccount.toBuffer(), provider.wallet.publicKey.toBytes()],
      vaultProgramId
    );

  const [tulipRewardMetadataAccount, tulipRewardMetadataNonce] =
    await anchor.web3.PublicKey.findProgramAddress(
      [
        userBalanceMetadataAccount.toBytes(),
        provider.wallet.publicKey.toBytes()
      ],
      vaultProgramId
    );

  const tulipRewardTokenAccount =
    await serumAssoToken.getAssociatedTokenAddress(
      wallet.publicKey,
      tulipPubKey
    );

  const depositAccounts = {
    vault: new anchor.web3.PublicKey(getVaultAccount(assetSymbol)),
    lpTokenAccount: new anchor.web3.PublicKey(
      getVaultLpTokenAccount(assetSymbol)
    ),
    authorityTokenAccount: new anchor.web3.PublicKey(authorityTokenAccount),
    authority: provider.wallet.publicKey,
    stakeProgramId: new anchor.web3.PublicKey(getFarmProgramId(assetSymbol)),
    vaultPdaAccount: new anchor.web3.PublicKey(getVaultPdaAccount(assetSymbol)),
    poolId: new anchor.web3.PublicKey(getFarmPoolId(assetSymbol)),
    poolAuthority: new anchor.web3.PublicKey(getFarmPoolAuthority(assetSymbol)),
    userInfoAccount: new anchor.web3.PublicKey(
      getVaultInfoAccount(assetSymbol)
    ),
    userLpTokenAccount: new anchor.web3.PublicKey(
      getVaultLpTokenAccount(assetSymbol)
    ),
    poolLpTokenAccount: new anchor.web3.PublicKey(
      getFarmPoolLpTokenAccount(assetSymbol)
    ),
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
    userBalanceAccount: userBalanceAccount,
    userBalanceMetadata: userBalanceMetadataAccount,
    userTulipRewardMetadata: tulipRewardMetadataAccount,
    vaultTulipTokenAccount: new anchor.web3.PublicKey(
      getVaultTulipTokenAccount(assetSymbol)
    ),
    userTulipTokenAccount: tulipRewardTokenAccount,
    clock: SYSVAR_CLOCK_PUBKEY,
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

  if (!tulipRewardTokenAccount) {
    // add instruction to the deposit transaction
    // to also create $TULIP (rewards) token account
    txn.add(
      await serumAssoToken.createAssociatedTokenAccount(
        // who will pay for the account creation
        wallet.publicKey,

        // who is the account getting created for
        wallet.publicKey,

        // what mint address token is being created
        tulipPubKey
      )
    );
  }

  // Add tulip harvest instruction
  const harvestAccounts = {
    authority: provider.wallet.publicKey,
    vault: new anchor.web3.PublicKey(getVaultAccount(assetSymbol)),
    vaultPdaAccount: new anchor.web3.PublicKey(getVaultPdaAccount(assetSymbol)),
    userInfoAccount: new anchor.web3.PublicKey(
      getVaultInfoAccount(assetSymbol)
    ),
    userBalanceAccount: userBalanceAccount,
    userBalanceMetadata: userBalanceMetadataAccount,
    userTulipRewardMetadata: tulipRewardMetadataAccount,
    userTulipTokenAccount: tulipRewardTokenAccount,
    vaultTulipTokenAccount: new anchor.web3.PublicKey(
      getVaultTulipTokenAccount(assetSymbol)
    ),
    tokenProgramId: serum.TokenInstructions.TOKEN_PROGRAM_ID,
    clock: SYSVAR_CLOCK_PUBKEY,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    systemProgram: new anchor.web3.PublicKey(
      '11111111111111111111111111111111'
    )
  };

  txn.add(
    vaultProgram.instruction.harvestTulips(
      {
        nonce: userBalanceAccountNonce,
        metaNonce: userBalanceMetadataAccountNonce,
        rewardNonce: tulipRewardMetadataNonce
      },
      {
        accounts: harvestAccounts
      }
    )
  );

  // Add deposit instruction
  txn.add(
    vaultProgram.instruction.depositVault(
      {
        nonce: userBalanceAccountNonce,
        amount: new anchor.BN(Number(value) * Math.pow(10, Number(decimals))),
        metaNonce: userBalanceMetadataAccountNonce,
        rewardNonce: tulipRewardMetadataNonce
      },
      {
        accounts: depositAccounts
      }
    )
  );

  return sendTransaction(conn, wallet, txn, []);
};

/**
 *
 * @param {Object} conn web3 Connection object
 * @param {Object} wallet
 * @param {String} mintAddress Mint Address of the Vault
 * @param {String} authorityTokenAccount
 * @param {String|Number} value Amount to withdraw
 *
 * @returns {Promise}
 */
const withdrawFromVault = async (conn, wallet, mintAddress, authorityTokenAccount, value) => {
  const { decimals, symbol: assetSymbol } = getFarmByMintAddress(mintAddress) || {};

  const provider = new anchor.Provider(conn, wallet, {
    skipPreflight: true,
    preflightCommitment: commitment
  });

  anchor.setProvider(provider);

  // Address of the deployed program.
  const vaultProgramId = new anchor.web3.PublicKey(getVaultProgramId());
  // Generate the program client from IDL.
  const vaultProgram = new anchor.Program(idl, vaultProgramId);

  const txn = new anchor.web3.Transaction();

  const { migrateAccount } =
    getStore('FarmStore').getFarm(getFarmLpMintAddress(assetSymbol)) || {};
  const [userBalanceAccount, userBalanceAccountNonce] =
    await anchor.web3.PublicKey.findProgramAddress(
      [
        new anchor.web3.PublicKey(
          getVaultOldInfoAccount(assetSymbol)
        ).toBytes(),
        provider.wallet.publicKey.toBytes()
      ],
      vaultProgramId
    );

  const [userBalanceMetadataAccount, userBalanceMetadataAccountNonce] =
    await anchor.web3.PublicKey.findProgramAddress(
      [userBalanceAccount.toBuffer(), provider.wallet.publicKey.toBytes()],
      vaultProgramId
    );

  const [tulipRewardMetadataAccount, tulipRewardMetadataNonce] =
    await anchor.web3.PublicKey.findProgramAddress(
      [
        userBalanceMetadataAccount.toBytes(),
        provider.wallet.publicKey.toBytes()
      ],
      vaultProgramId
    );

  const vault = await vaultProgram.account.vault(
    new anchor.web3.PublicKey(getVaultAccount(assetSymbol))
  );
  const { totalVaultBalance, totalVlpShares } = vault || {};

  const userInputValue = new anchor.BN(value * Math.pow(10, decimals));

  const withdrawAmount = userInputValue.mul(totalVlpShares).div(totalVaultBalance);

  const withdrawAccounts = {
    vault: new anchor.web3.PublicKey(getVaultAccount(assetSymbol)),
    lpTokenAccount: new anchor.web3.PublicKey(
      getVaultLpTokenAccount(assetSymbol)
    ),
    authorityTokenAccount: new anchor.web3.PublicKey(authorityTokenAccount),
    authority: provider.wallet.publicKey,
    stakeProgramId: new anchor.web3.PublicKey(getFarmProgramId(assetSymbol)),
    vaultPdaAccount: new anchor.web3.PublicKey(getVaultPdaAccount(assetSymbol)),
    poolId: new anchor.web3.PublicKey(getFarmPoolId(assetSymbol)),
    poolAuthority: new anchor.web3.PublicKey(getFarmPoolAuthority(assetSymbol)),
    userInfoAccount: new anchor.web3.PublicKey(
      getVaultInfoAccount(assetSymbol)
    ),
    poolLpTokenAccount: new anchor.web3.PublicKey(
      getFarmPoolLpTokenAccount(assetSymbol)
    ),
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
    userBalanceAccount: userBalanceAccount,
    userBalanceMeta: userBalanceMetadataAccount,
    userTulipRewardMetadata: tulipRewardMetadataAccount,
    clock: SYSVAR_CLOCK_PUBKEY,
    tokenProgramId: serum.TokenInstructions.TOKEN_PROGRAM_ID,
    systemProgram: new anchor.web3.PublicKey(
      '11111111111111111111111111111111'
    ),
    rent: anchor.web3.SYSVAR_RENT_PUBKEY
  };

  if (getFarmFusion(assetSymbol)) {
    withdrawAccounts.userRewardBTokenAccount = new anchor.web3.PublicKey(
      getVaultRewardAccountB(assetSymbol)
    );
  }

  // Add tulip harvest instruction
  const tulipPubKey = new anchor.web3.PublicKey(TOKENS.TULIP.mintAddress);

  const tulipRewardTokenAccount =
    await serumAssoToken.getAssociatedTokenAddress(
      wallet.publicKey,
      tulipPubKey
    );

  let harvestAccounts;

  if (migrateAccount) {
    const [newUserBalanceAccount, newUserBalanceAccountNonce] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          new anchor.web3.PublicKey(getVaultInfoAccount(assetSymbol)).toBytes(),
          provider.wallet.publicKey.toBytes()
        ],
        vaultProgramId
      );

    const [newUserBalanceMetadataAccount, newUserBalanceMetadataAccountNonce] =
      await anchor.web3.PublicKey.findProgramAddress(
        [newUserBalanceAccount.toBuffer(), provider.wallet.publicKey.toBytes()],
        vaultProgramId
      );

    const [newTulipRewardMetadataAccount, newTulipRewardMetadataNonce] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          newUserBalanceMetadataAccount.toBytes(),
          provider.wallet.publicKey.toBytes()
        ],
        vaultProgramId
      );

    harvestAccounts = {
      authority: provider.wallet.publicKey,
      vault: new anchor.web3.PublicKey(getVaultAccount(assetSymbol)),
      vaultPdaAccount: new anchor.web3.PublicKey(
        getVaultPdaAccount(assetSymbol)
      ),
      userInfoAccount: new anchor.web3.PublicKey(
        getVaultInfoAccount(assetSymbol)
      ),
      userBalanceAccount: newUserBalanceAccount,
      userBalanceMetadata: newUserBalanceMetadataAccount,
      userTulipRewardMetadata: newTulipRewardMetadataAccount,
      oldUserBalanceAccount: userBalanceAccount,
      oldUserBalanceMetadata: userBalanceMetadataAccount,
      oldUserTulipRewardMetadata: tulipRewardMetadataAccount,
      userTulipTokenAccount: tulipRewardTokenAccount,
      vaultTulipTokenAccount: new anchor.web3.PublicKey(
        getVaultTulipTokenAccount(assetSymbol)
      ),
      tokenProgramId: serum.TokenInstructions.TOKEN_PROGRAM_ID,
      clock: SYSVAR_CLOCK_PUBKEY,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: new anchor.web3.PublicKey(
        '11111111111111111111111111111111'
      )
    };

    txn.add(
      vaultProgram.instruction.harvestMigrateTulips(
        {
          nonce: newUserBalanceAccountNonce,
          metaNonce: newUserBalanceMetadataAccountNonce,
          rewardNonce: newTulipRewardMetadataNonce,
          oldNonce: userBalanceAccountNonce,
          oldMetaNonce: userBalanceMetadataAccountNonce,
          oldRewardNonce: tulipRewardMetadataNonce
        },
        {
          accounts: harvestAccounts
        }
      )
    );
  }
  else {
    harvestAccounts = {
      authority: provider.wallet.publicKey,
      vault: new anchor.web3.PublicKey(getVaultAccount(assetSymbol)),
      vaultPdaAccount: new anchor.web3.PublicKey(
        getVaultPdaAccount(assetSymbol)
      ),
      userInfoAccount: new anchor.web3.PublicKey(
        getVaultInfoAccount(assetSymbol)
      ),
      userBalanceAccount: userBalanceAccount,
      userBalanceMetadata: userBalanceMetadataAccount,
      userTulipRewardMetadata: tulipRewardMetadataAccount,
      userTulipTokenAccount: tulipRewardTokenAccount,
      vaultTulipTokenAccount: new anchor.web3.PublicKey(
        getVaultTulipTokenAccount(assetSymbol)
      ),
      tokenProgramId: serum.TokenInstructions.TOKEN_PROGRAM_ID,
      clock: SYSVAR_CLOCK_PUBKEY,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: new anchor.web3.PublicKey(
        '11111111111111111111111111111111'
      )
    };

    txn.add(
      vaultProgram.instruction.harvestTulips(
        {
          nonce: userBalanceAccountNonce,
          metaNonce: userBalanceMetadataAccountNonce,
          rewardNonce: tulipRewardMetadataNonce
        },
        {
          accounts: harvestAccounts
        }
      )
    );
  }

  // Add withdraw instruction
  txn.add(
    vaultProgram.transaction.withdrawVault(
      {
        amount: withdrawAmount,
        metaNonce: userBalanceMetadataAccountNonce,
        rewardNonce: tulipRewardMetadataNonce,
        nonce: userBalanceAccountNonce
      },
      {
        accounts: withdrawAccounts
      }
    )
  );

  return sendTransaction(conn, wallet, txn, []);
};

export default {
  depositToVault,
  withdrawFromVault
};
