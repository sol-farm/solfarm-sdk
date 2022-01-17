import * as anchor from '@project-serum/anchor';

// Constants
import idl from '../constants/raydium_idl.json';

// Utils
import { commitment, getMultipleAccounts } from '../utils/web3';
import { getFarmByMintAddress } from '../utils/farmUtils';
import {
  getVaultAccount,
  getVaultProgramId,
  getVaultOldInfoAccount
} from '../utils/config';
import BigNumber from 'bignumber.js';

/**
 *
 * @param {Object} conn web3 Connection object
 * @param {Object} wallet Wallet object
 * @param {String} mintAddress Mint Address of the Vault
 *
 * @returns {Promise}
 */
const getBalanceForVault = async (conn, wallet, mintAddress) => {
  const provider = new anchor.Provider(conn, wallet, { skipPreflight: true });
  const farm = getFarmByMintAddress(mintAddress);

  anchor.setProvider(provider);

  const vaultProgramId = new anchor.web3.PublicKey(getVaultProgramId()),
    [userBalanceAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [
        new anchor.web3.PublicKey(
          getVaultOldInfoAccount(farm.symbol)
        ).toBytes(),
        provider.wallet.publicKey.toBytes()
      ],
      vaultProgramId
    ),
    [userBalanceMetadataAccount] =
      await anchor.web3.PublicKey.findProgramAddress(
        [userBalanceAccount.toBuffer(), provider.wallet.publicKey.toBytes()],
        vaultProgramId
      );

  const vaultProgram = new anchor.Program(idl, vaultProgramId, provider);

  const publicKeys = [
    userBalanceAccount,
    userBalanceMetadataAccount,
    new anchor.web3.PublicKey(getVaultAccount(farm.symbol))
  ];

  const [
    userBalanceAccountInfo,
    userBalanceMetadataAccountInfo,
    vaultAccountInfo
  ] = await getMultipleAccounts(conn, publicKeys, commitment);

  const userBalanceAccountData = vaultProgram.coder.accounts.decode(
      'VaultBalanceAccount',
      Buffer.from(userBalanceAccountInfo.account.data)
    ),
    userBalanceMetadataAccountData = vaultProgram.coder.accounts.decode(
      'VaultBalanceMetadata',
      Buffer.from(userBalanceMetadataAccountInfo.account.data)
    ),
    vaultAccountData = vaultProgram.coder.accounts.decode(
      'Vault',
      Buffer.from(vaultAccountInfo.account.data)
    );

  const { totalVaultBalance, totalVlpShares } = vaultAccountData || {};
  const userShares = userBalanceAccountData.amount;
  const totalLpTokens = userBalanceMetadataAccountData?.totalLpTokens;
  const depositedAmount = userShares.mul(totalVaultBalance).div(totalVlpShares);
  const lastDepositedAmount = totalLpTokens;
  const lastDepositTime = userBalanceMetadataAccountData?.lastDepositTime;
  const rewardsSinceLastDeposit = depositedAmount.sub(lastDepositedAmount);
  const farmDecimals = Math.pow(10, farm.decimals);

  // BigNumber types
  const depositedAmountBN = new BigNumber(depositedAmount.toString()).dividedBy(
    farmDecimals
  );
  const rewardsSinceLastDepositBN = new BigNumber(
    rewardsSinceLastDeposit.toString()
  ).dividedBy(farmDecimals);
  const lastDepositTimeBN = new BigNumber(lastDepositTime.toString());

  return {
    depositedAmount: depositedAmountBN,
    rewardsSinceLastDeposit: rewardsSinceLastDepositBN,
    lastDepositTime: lastDepositTimeBN
  };
};

export { getBalanceForVault };
