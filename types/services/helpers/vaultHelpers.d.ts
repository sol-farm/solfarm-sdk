export function deriveManagementAddress(programId: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveVaultAddress(programId: any, farmPartOne: any, farmPartTwo: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveVaultPdaAddress(programId: any, vault: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveSharesMintAddress(programId: any, vault: any, mint: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveRaydiumUserStakeInfoAddress(programId: any, vaultPda: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveWithdrawQueueAddress(programId: any, vault: any, underlyingMint: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveCompoundQueueAddress(programId: any, vault: any, underlyingMint: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveSerumTradeAccount(programId: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveSerumTradePdaAddress(programId: any, tradeAccount: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveSerumTradeOpenOrdersAddress(programId: any, tradeAccount: any, serumMarket: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveSerumFeeRecipientAddress(programId: any, mint: any, tradePda: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveTrackingAddress(programId: any, vault: any, owner: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveTrackingPdaAddress(programId: any, trackingAddress: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveTrackingQueueAddress(programId: any, trackingPdaAddress: any): Promise<[anchor.web3.PublicKey, number]>;
export function createAssociatedTokenAccount(provider: any, owner: any, mint: any): Promise<anchor.web3.PublicKey>;
export function findAssociatedStakeInfoAddress(poolId: any, walletAddress: any, programId: any): Promise<anchor.web3.PublicKey>;
export function deriveLendingPlatformAccountAddress(vaultPda: any, lendingMarket: any, programId: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveLndingPlatformInformationAccountAddress(vault: any, index: any, programId: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveLendingPlatformConfigDataAddress(platformAddress: any, programId: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveMangoAccountAddress(vault: any, programId: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveOrcaUserFarmAddress(globalFarm: any, owner: any, aquaFarmProgramId: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveOrcaDDCompoundQueueAddress(programId: any, vault: any, ddFarmTokenMint: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveTrackingOrcaDDQueueAddress(programId: any, vault: any, trackingPda: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveMultiDepositStateTransitionAddress(vault: any, programId: any): Promise<[anchor.web3.PublicKey, number]>;
export function deriveEphemeralTrackingAddress(vault: any, owner: any, programId: any): Promise<[anchor.web3.PublicKey, number]>;
export function getVaultByPlatformAndName(platform: any, vaultName: any): {};
export function getAllVaultNameSymbolMap(): {};
export function getVaultByName(vaultName: any): {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: {
        account: string;
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        name: string;
        symbol: string;
        rebalance_state_transition: string;
        rebalance_state_transition_underlying: string;
        minimum_rebalance_amount: number;
        standalone_vaults: {
            asset: string;
            farm_name: string;
            optimizer_shares_account: string;
            program_address: string;
            program_type: string;
            tag: string;
            vault_address: string;
        }[];
    };
    lending_optimizer: any;
    raydium: any;
    orca: any;
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: {
        account: string;
        available_programs: {
            config_data_account: string;
            information_account: string;
            program_id: string;
            mangov3: any;
            port: any;
            solend: {
                collateral_mint: string;
                lending_market_account: string;
                lending_market_authority: string;
                oracle_keys: string[];
                oracle_programs: string[];
                reserve_account: string;
                reserve_liquidity_account: string;
                vault_collateral_token_account: string;
            };
            tulip: any;
        }[];
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        name: string;
        symbol: string;
    };
    raydium: any;
    orca: any;
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: {
        account: string;
        available_programs: {
            config_data_account: string;
            information_account: string;
            program_id: string;
            mangov3: any;
            port: any;
            solend: any;
            tulip: {
                collateral_mint: string;
                lending_market_account: string;
                lending_market_authority: string;
                oracle_keys: string[];
                oracle_programs: string[];
                reserve_account: string;
                reserve_liquidity_account: string;
                vault_collateral_token_account: string;
            };
        }[];
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        name: string;
        symbol: string;
    };
    raydium: any;
    orca: any;
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: {
        account: string;
        available_programs: {
            config_data_account: string;
            information_account: string;
            program_id: string;
            mangov3: {
                cache: string;
                group: string;
                group_signer: string;
                group_token_account: string;
                node_bank: string;
                optimizer_mango_account: string;
                root_bank: string;
            };
            port: any;
            solend: any;
            tulip: any;
        }[];
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        name: string;
        symbol: string;
    };
    raydium: any;
    orca: any;
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: any;
    raydium: {
        account: string;
        associated_stake_info_address: string;
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        dual_rewards: boolean;
        name: string;
        symbol: string;
        vault_reward_a_token_account: string;
        vault_reward_b_token_account: string;
        vault_stake_info_account: string;
        fee_collector_reward_a_token_account: string;
        fee_collector_reward_b_token_account: string;
        intermediary_token_mints: any[];
        compound_swap_routes: {
            market_name: string;
            stable: boolean;
            aquafarm: boolean;
            takes_fee: boolean;
            full_amount: boolean;
            check_swap_skip: boolean;
            swap_direction: string;
        }[];
    };
    orca: any;
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: any;
    raydium: any;
    orca: {
        account: string;
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        dd_farm_data: {
            config_data: {
                user_farm_address: string;
                vault_swap_token_a: string;
                vault_swap_token_b: string;
                pool_swap_token_a: string;
                pool_swap_token_b: string;
                pool_swap_account: string;
                pool_swap_token_account: string;
                pool_fee_account: string;
                vault_reward_token_account: string;
                vault_farm_token_account: string;
                vault_swap_token_account: string;
                global_base_token_mint: string;
                global_base_token_vault: string;
                global_reward_token_mint: string;
                global_reward_token_vault: string;
                global_farm: string;
                convert_authority: string;
                pool_swap_authority: string;
                farm_token_mint: string;
                reward_token_mint: string;
                swap_pool_mint: string;
                token_a_mint: string;
                token_b_mint: string;
                fee_collector_token_account: string;
                swap_markets: string[];
                compound_swap_routes: {
                    market_name: string;
                    platform: string;
                    stable: boolean;
                    aquafarm: boolean;
                    takes_fee: boolean;
                    full_amount: boolean;
                    check_swap_skip: boolean;
                    swap_direction: string;
                }[];
            };
            compound_queue_account: string;
            withdraw_queue_account: string;
        };
        double_dip: boolean;
        farm_data: {
            user_farm_address: string;
            vault_swap_token_a: string;
            vault_swap_token_b: string;
            pool_swap_token_a: string;
            pool_swap_token_b: string;
            pool_swap_account: string;
            pool_swap_token_account: string;
            pool_fee_account: string;
            vault_reward_token_account: string;
            vault_farm_token_account: string;
            vault_swap_token_account: string;
            global_base_token_mint: string;
            global_base_token_vault: string;
            global_reward_token_mint: string;
            global_reward_token_vault: string;
            global_farm: string;
            convert_authority: string;
            pool_swap_authority: string;
            farm_token_mint: string;
            reward_token_mint: string;
            swap_pool_mint: string;
            token_a_mint: string;
            token_b_mint: string;
            fee_collector_token_account: string;
            swap_markets: string[];
            compound_swap_routes: {
                market_name: string;
                platform: string;
                stable: boolean;
                aquafarm: boolean;
                takes_fee: boolean;
                full_amount: boolean;
                check_swap_skip: boolean;
                swap_direction: string;
            }[];
        };
        intermediary_token_mints: any[];
        name: string;
        symbol: string;
    };
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: any;
    raydium: any;
    orca: {
        account: string;
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        dd_farm_data: {
            config_data: {
                user_farm_address: string;
                vault_swap_token_a: string;
                vault_swap_token_b: string;
                pool_swap_token_a: string;
                pool_swap_token_b: string;
                pool_swap_account: string;
                pool_swap_token_account: string;
                pool_fee_account: string;
                vault_reward_token_account: string;
                vault_farm_token_account: string;
                vault_swap_token_account: string;
                global_base_token_mint: string;
                global_base_token_vault: string;
                global_reward_token_mint: string;
                global_reward_token_vault: string;
                global_farm: string;
                convert_authority: string;
                pool_swap_authority: string;
                farm_token_mint: string;
                reward_token_mint: string;
                swap_pool_mint: string;
                token_a_mint: string;
                token_b_mint: string;
                fee_collector_token_account: string;
                swap_markets: string[];
                compound_swap_routes: {
                    market_name: string;
                    stable: boolean;
                    aquafarm: boolean;
                    takes_fee: boolean;
                    full_amount: boolean;
                    check_swap_skip: boolean;
                    swap_direction: string;
                }[];
            };
            compound_queue_account: string;
            withdraw_queue_account: string;
        };
        double_dip: boolean;
        farm_data: {
            user_farm_address: string;
            vault_swap_token_a: string;
            vault_swap_token_b: string;
            pool_swap_token_a: string;
            pool_swap_token_b: string;
            pool_swap_account: string;
            pool_swap_token_account: string;
            pool_fee_account: string;
            vault_reward_token_account: string;
            vault_farm_token_account: string;
            vault_swap_token_account: string;
            global_base_token_mint: string;
            global_base_token_vault: string;
            global_reward_token_mint: string;
            global_reward_token_vault: string;
            global_farm: string;
            convert_authority: string;
            pool_swap_authority: string;
            farm_token_mint: string;
            reward_token_mint: string;
            swap_pool_mint: string;
            token_a_mint: string;
            token_b_mint: string;
            fee_collector_token_account: string;
            swap_markets: string[];
            compound_swap_routes: {
                market_name: string;
                stable: boolean;
                aquafarm: boolean;
                takes_fee: boolean;
                full_amount: boolean;
                check_swap_skip: boolean;
                swap_direction: string;
            }[];
        };
        intermediary_token_mints: string[];
        name: string;
        symbol: string;
    };
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: any;
    raydium: any;
    orca: any;
    quarry: {
        account: string;
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        claim_fee_token_account: string;
        compound_swap_routes: {
            market_name: string;
            stable: boolean;
            aquafarm: boolean;
            takes_fee: boolean;
            full_amount: boolean;
            check_swap_skip: boolean;
            swap_direction: string;
        }[];
        config_data_account: string;
        decimal_wrap: any;
        intermediary_token_mints: string[];
        miner: string;
        miner_token_account: string;
        mint_wrapper: string;
        minter: string;
        name: string;
        quarry: string;
        redeem_fee_token_account: string;
        reward_token_account: string;
        reward_token_mint: string;
        rewarder: string;
        saber_config: {
            mint_proxy_state: string;
            proxy_mint_authority: string;
            redeemer: string;
            redemption_mint: string;
            redemption_minter: string;
            redemption_vault: string;
            vault_redemption_token_account: string;
        };
        sunny_config: {
            claim_fee_token_account: string;
            harvest_mint_wrapper: string;
            harvest_minter: string;
            harvest_saber_fee_token_account: string;
            harvest_sunny_fee_token_account: string;
            miner: string;
            miner_token_account: string;
            redeem_fee_token_account: string;
            redeemer: string;
            redemption_mint: string;
            redemption_mint_wrapper: string;
            redemption_minter: string;
            redemption_vault: string;
            rewarder: string;
            sunny_internal_token_mint: string;
            sunny_pool: string;
            sunny_quarry: string;
            sunny_tvault: string;
            sunny_tvault_internal_token_account: string;
            sunny_tvault_saber_reward_token_account: string;
            sunny_tvault_sunny_reward_token_account: string;
            sunny_tvault_vendor_token_account: string;
            vault_redemption_token_account: string;
            vault_reward_token_account: string;
            withdraw_fee_destination: string;
        };
        swap_markets: string[];
        symbol: string;
        variant: string;
    };
};
export function getVaultPdaAddressByName(vaultName: any): any;
export function getVaultSharesMintByName(vaultName: any): any;
export function getAllVaultAccounts(platform: any): any[];
export function getAllVaultsByPlatform(platform: any): any[];
export function getVaultId({ symbol, mintAddress }?: {
    symbol: any;
    mintAddress: any;
}): string;
export function getUserFriendlyVaultId({ symbol, platform }?: {
    symbol: any;
    platform: any;
}): string;
export function getUserFriendlyVaultLink({ symbol: vault, platform, version }?: {
    symbol: any;
    platform: any;
    version?: number;
}): string;
export function getUserFriendlyStrategyLink({ symbol: vault, platform }?: {
    symbol: any;
    platform: any;
}): string;
export function getVaultMarketAmms(platform: any, vaultName: any): any;
export function getFarmTypeBN(farmType: any): anchor.BN[];
export function getVaultByTag(tagName: any): {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: {
        account: string;
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        name: string;
        symbol: string;
        rebalance_state_transition: string;
        rebalance_state_transition_underlying: string;
        minimum_rebalance_amount: number;
        standalone_vaults: {
            asset: string;
            farm_name: string;
            optimizer_shares_account: string;
            program_address: string;
            program_type: string;
            tag: string;
            vault_address: string;
        }[];
    };
    lending_optimizer: any;
    raydium: any;
    orca: any;
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: {
        account: string;
        available_programs: {
            config_data_account: string;
            information_account: string;
            program_id: string;
            mangov3: any;
            port: any;
            solend: {
                collateral_mint: string;
                lending_market_account: string;
                lending_market_authority: string;
                oracle_keys: string[];
                oracle_programs: string[];
                reserve_account: string;
                reserve_liquidity_account: string;
                vault_collateral_token_account: string;
            };
            tulip: any;
        }[];
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        name: string;
        symbol: string;
    };
    raydium: any;
    orca: any;
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: {
        account: string;
        available_programs: {
            config_data_account: string;
            information_account: string;
            program_id: string;
            mangov3: any;
            port: any;
            solend: any;
            tulip: {
                collateral_mint: string;
                lending_market_account: string;
                lending_market_authority: string;
                oracle_keys: string[];
                oracle_programs: string[];
                reserve_account: string;
                reserve_liquidity_account: string;
                vault_collateral_token_account: string;
            };
        }[];
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        name: string;
        symbol: string;
    };
    raydium: any;
    orca: any;
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: {
        account: string;
        available_programs: {
            config_data_account: string;
            information_account: string;
            program_id: string;
            mangov3: {
                cache: string;
                group: string;
                group_signer: string;
                group_token_account: string;
                node_bank: string;
                optimizer_mango_account: string;
                root_bank: string;
            };
            port: any;
            solend: any;
            tulip: any;
        }[];
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        name: string;
        symbol: string;
    };
    raydium: any;
    orca: any;
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: any;
    raydium: {
        account: string;
        associated_stake_info_address: string;
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        dual_rewards: boolean;
        name: string;
        symbol: string;
        vault_reward_a_token_account: string;
        vault_reward_b_token_account: string;
        vault_stake_info_account: string;
        fee_collector_reward_a_token_account: string;
        fee_collector_reward_b_token_account: string;
        intermediary_token_mints: any[];
        compound_swap_routes: {
            market_name: string;
            stable: boolean;
            aquafarm: boolean;
            takes_fee: boolean;
            full_amount: boolean;
            check_swap_skip: boolean;
            swap_direction: string;
        }[];
    };
    orca: any;
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: any;
    raydium: any;
    orca: {
        account: string;
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        dd_farm_data: {
            config_data: {
                user_farm_address: string;
                vault_swap_token_a: string;
                vault_swap_token_b: string;
                pool_swap_token_a: string;
                pool_swap_token_b: string;
                pool_swap_account: string;
                pool_swap_token_account: string;
                pool_fee_account: string;
                vault_reward_token_account: string;
                vault_farm_token_account: string;
                vault_swap_token_account: string;
                global_base_token_mint: string;
                global_base_token_vault: string;
                global_reward_token_mint: string;
                global_reward_token_vault: string;
                global_farm: string;
                convert_authority: string;
                pool_swap_authority: string;
                farm_token_mint: string;
                reward_token_mint: string;
                swap_pool_mint: string;
                token_a_mint: string;
                token_b_mint: string;
                fee_collector_token_account: string;
                swap_markets: string[];
                compound_swap_routes: {
                    market_name: string;
                    platform: string;
                    stable: boolean;
                    aquafarm: boolean;
                    takes_fee: boolean;
                    full_amount: boolean;
                    check_swap_skip: boolean;
                    swap_direction: string;
                }[];
            };
            compound_queue_account: string;
            withdraw_queue_account: string;
        };
        double_dip: boolean;
        farm_data: {
            user_farm_address: string;
            vault_swap_token_a: string;
            vault_swap_token_b: string;
            pool_swap_token_a: string;
            pool_swap_token_b: string;
            pool_swap_account: string;
            pool_swap_token_account: string;
            pool_fee_account: string;
            vault_reward_token_account: string;
            vault_farm_token_account: string;
            vault_swap_token_account: string;
            global_base_token_mint: string;
            global_base_token_vault: string;
            global_reward_token_mint: string;
            global_reward_token_vault: string;
            global_farm: string;
            convert_authority: string;
            pool_swap_authority: string;
            farm_token_mint: string;
            reward_token_mint: string;
            swap_pool_mint: string;
            token_a_mint: string;
            token_b_mint: string;
            fee_collector_token_account: string;
            swap_markets: string[];
            compound_swap_routes: {
                market_name: string;
                platform: string;
                stable: boolean;
                aquafarm: boolean;
                takes_fee: boolean;
                full_amount: boolean;
                check_swap_skip: boolean;
                swap_direction: string;
            }[];
        };
        intermediary_token_mints: any[];
        name: string;
        symbol: string;
    };
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: any;
    raydium: any;
    orca: {
        account: string;
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        dd_farm_data: {
            config_data: {
                user_farm_address: string;
                vault_swap_token_a: string;
                vault_swap_token_b: string;
                pool_swap_token_a: string;
                pool_swap_token_b: string;
                pool_swap_account: string;
                pool_swap_token_account: string;
                pool_fee_account: string;
                vault_reward_token_account: string;
                vault_farm_token_account: string;
                vault_swap_token_account: string;
                global_base_token_mint: string;
                global_base_token_vault: string;
                global_reward_token_mint: string;
                global_reward_token_vault: string;
                global_farm: string;
                convert_authority: string;
                pool_swap_authority: string;
                farm_token_mint: string;
                reward_token_mint: string;
                swap_pool_mint: string;
                token_a_mint: string;
                token_b_mint: string;
                fee_collector_token_account: string;
                swap_markets: string[];
                compound_swap_routes: {
                    market_name: string;
                    stable: boolean;
                    aquafarm: boolean;
                    takes_fee: boolean;
                    full_amount: boolean;
                    check_swap_skip: boolean;
                    swap_direction: string;
                }[];
            };
            compound_queue_account: string;
            withdraw_queue_account: string;
        };
        double_dip: boolean;
        farm_data: {
            user_farm_address: string;
            vault_swap_token_a: string;
            vault_swap_token_b: string;
            pool_swap_token_a: string;
            pool_swap_token_b: string;
            pool_swap_account: string;
            pool_swap_token_account: string;
            pool_fee_account: string;
            vault_reward_token_account: string;
            vault_farm_token_account: string;
            vault_swap_token_account: string;
            global_base_token_mint: string;
            global_base_token_vault: string;
            global_reward_token_mint: string;
            global_reward_token_vault: string;
            global_farm: string;
            convert_authority: string;
            pool_swap_authority: string;
            farm_token_mint: string;
            reward_token_mint: string;
            swap_pool_mint: string;
            token_a_mint: string;
            token_b_mint: string;
            fee_collector_token_account: string;
            swap_markets: string[];
            compound_swap_routes: {
                market_name: string;
                stable: boolean;
                aquafarm: boolean;
                takes_fee: boolean;
                full_amount: boolean;
                check_swap_skip: boolean;
                swap_direction: string;
            }[];
        };
        intermediary_token_mints: string[];
        name: string;
        symbol: string;
    };
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: any;
    raydium: any;
    orca: any;
    quarry: {
        account: string;
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        claim_fee_token_account: string;
        compound_swap_routes: {
            market_name: string;
            stable: boolean;
            aquafarm: boolean;
            takes_fee: boolean;
            full_amount: boolean;
            check_swap_skip: boolean;
            swap_direction: string;
        }[];
        config_data_account: string;
        decimal_wrap: any;
        intermediary_token_mints: string[];
        miner: string;
        miner_token_account: string;
        mint_wrapper: string;
        minter: string;
        name: string;
        quarry: string;
        redeem_fee_token_account: string;
        reward_token_account: string;
        reward_token_mint: string;
        rewarder: string;
        saber_config: {
            mint_proxy_state: string;
            proxy_mint_authority: string;
            redeemer: string;
            redemption_mint: string;
            redemption_minter: string;
            redemption_vault: string;
            vault_redemption_token_account: string;
        };
        sunny_config: {
            claim_fee_token_account: string;
            harvest_mint_wrapper: string;
            harvest_minter: string;
            harvest_saber_fee_token_account: string;
            harvest_sunny_fee_token_account: string;
            miner: string;
            miner_token_account: string;
            redeem_fee_token_account: string;
            redeemer: string;
            redemption_mint: string;
            redemption_mint_wrapper: string;
            redemption_minter: string;
            redemption_vault: string;
            rewarder: string;
            sunny_internal_token_mint: string;
            sunny_pool: string;
            sunny_quarry: string;
            sunny_tvault: string;
            sunny_tvault_internal_token_account: string;
            sunny_tvault_saber_reward_token_account: string;
            sunny_tvault_sunny_reward_token_account: string;
            sunny_tvault_vendor_token_account: string;
            vault_redemption_token_account: string;
            vault_reward_token_account: string;
            withdraw_fee_destination: string;
        };
        swap_markets: string[];
        symbol: string;
        variant: string;
    };
};
export function getLendingOptimizerVaultByAccount(account: any): {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: {
        account: string;
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        name: string;
        symbol: string;
        rebalance_state_transition: string;
        rebalance_state_transition_underlying: string;
        minimum_rebalance_amount: number;
        standalone_vaults: {
            asset: string;
            farm_name: string;
            optimizer_shares_account: string;
            program_address: string;
            program_type: string;
            tag: string;
            vault_address: string;
        }[];
    };
    lending_optimizer: any;
    raydium: any;
    orca: any;
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: {
        account: string;
        available_programs: {
            config_data_account: string;
            information_account: string;
            program_id: string;
            mangov3: any;
            port: any;
            solend: {
                collateral_mint: string;
                lending_market_account: string;
                lending_market_authority: string;
                oracle_keys: string[];
                oracle_programs: string[];
                reserve_account: string;
                reserve_liquidity_account: string;
                vault_collateral_token_account: string;
            };
            tulip: any;
        }[];
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        name: string;
        symbol: string;
    };
    raydium: any;
    orca: any;
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: {
        account: string;
        available_programs: {
            config_data_account: string;
            information_account: string;
            program_id: string;
            mangov3: any;
            port: any;
            solend: any;
            tulip: {
                collateral_mint: string;
                lending_market_account: string;
                lending_market_authority: string;
                oracle_keys: string[];
                oracle_programs: string[];
                reserve_account: string;
                reserve_liquidity_account: string;
                vault_collateral_token_account: string;
            };
        }[];
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        name: string;
        symbol: string;
    };
    raydium: any;
    orca: any;
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: {
        account: string;
        available_programs: {
            config_data_account: string;
            information_account: string;
            program_id: string;
            mangov3: {
                cache: string;
                group: string;
                group_signer: string;
                group_token_account: string;
                node_bank: string;
                optimizer_mango_account: string;
                root_bank: string;
            };
            port: any;
            solend: any;
            tulip: any;
        }[];
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        name: string;
        symbol: string;
    };
    raydium: any;
    orca: any;
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: any;
    raydium: {
        account: string;
        associated_stake_info_address: string;
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        dual_rewards: boolean;
        name: string;
        symbol: string;
        vault_reward_a_token_account: string;
        vault_reward_b_token_account: string;
        vault_stake_info_account: string;
        fee_collector_reward_a_token_account: string;
        fee_collector_reward_b_token_account: string;
        intermediary_token_mints: any[];
        compound_swap_routes: {
            market_name: string;
            stable: boolean;
            aquafarm: boolean;
            takes_fee: boolean;
            full_amount: boolean;
            check_swap_skip: boolean;
            swap_direction: string;
        }[];
    };
    orca: any;
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: any;
    raydium: any;
    orca: {
        account: string;
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        dd_farm_data: {
            config_data: {
                user_farm_address: string;
                vault_swap_token_a: string;
                vault_swap_token_b: string;
                pool_swap_token_a: string;
                pool_swap_token_b: string;
                pool_swap_account: string;
                pool_swap_token_account: string;
                pool_fee_account: string;
                vault_reward_token_account: string;
                vault_farm_token_account: string;
                vault_swap_token_account: string;
                global_base_token_mint: string;
                global_base_token_vault: string;
                global_reward_token_mint: string;
                global_reward_token_vault: string;
                global_farm: string;
                convert_authority: string;
                pool_swap_authority: string;
                farm_token_mint: string;
                reward_token_mint: string;
                swap_pool_mint: string;
                token_a_mint: string;
                token_b_mint: string;
                fee_collector_token_account: string;
                swap_markets: string[];
                compound_swap_routes: {
                    market_name: string;
                    platform: string;
                    stable: boolean;
                    aquafarm: boolean;
                    takes_fee: boolean;
                    full_amount: boolean;
                    check_swap_skip: boolean;
                    swap_direction: string;
                }[];
            };
            compound_queue_account: string;
            withdraw_queue_account: string;
        };
        double_dip: boolean;
        farm_data: {
            user_farm_address: string;
            vault_swap_token_a: string;
            vault_swap_token_b: string;
            pool_swap_token_a: string;
            pool_swap_token_b: string;
            pool_swap_account: string;
            pool_swap_token_account: string;
            pool_fee_account: string;
            vault_reward_token_account: string;
            vault_farm_token_account: string;
            vault_swap_token_account: string;
            global_base_token_mint: string;
            global_base_token_vault: string;
            global_reward_token_mint: string;
            global_reward_token_vault: string;
            global_farm: string;
            convert_authority: string;
            pool_swap_authority: string;
            farm_token_mint: string;
            reward_token_mint: string;
            swap_pool_mint: string;
            token_a_mint: string;
            token_b_mint: string;
            fee_collector_token_account: string;
            swap_markets: string[];
            compound_swap_routes: {
                market_name: string;
                platform: string;
                stable: boolean;
                aquafarm: boolean;
                takes_fee: boolean;
                full_amount: boolean;
                check_swap_skip: boolean;
                swap_direction: string;
            }[];
        };
        intermediary_token_mints: any[];
        name: string;
        symbol: string;
    };
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: any;
    raydium: any;
    orca: {
        account: string;
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        dd_farm_data: {
            config_data: {
                user_farm_address: string;
                vault_swap_token_a: string;
                vault_swap_token_b: string;
                pool_swap_token_a: string;
                pool_swap_token_b: string;
                pool_swap_account: string;
                pool_swap_token_account: string;
                pool_fee_account: string;
                vault_reward_token_account: string;
                vault_farm_token_account: string;
                vault_swap_token_account: string;
                global_base_token_mint: string;
                global_base_token_vault: string;
                global_reward_token_mint: string;
                global_reward_token_vault: string;
                global_farm: string;
                convert_authority: string;
                pool_swap_authority: string;
                farm_token_mint: string;
                reward_token_mint: string;
                swap_pool_mint: string;
                token_a_mint: string;
                token_b_mint: string;
                fee_collector_token_account: string;
                swap_markets: string[];
                compound_swap_routes: {
                    market_name: string;
                    stable: boolean;
                    aquafarm: boolean;
                    takes_fee: boolean;
                    full_amount: boolean;
                    check_swap_skip: boolean;
                    swap_direction: string;
                }[];
            };
            compound_queue_account: string;
            withdraw_queue_account: string;
        };
        double_dip: boolean;
        farm_data: {
            user_farm_address: string;
            vault_swap_token_a: string;
            vault_swap_token_b: string;
            pool_swap_token_a: string;
            pool_swap_token_b: string;
            pool_swap_account: string;
            pool_swap_token_account: string;
            pool_fee_account: string;
            vault_reward_token_account: string;
            vault_farm_token_account: string;
            vault_swap_token_account: string;
            global_base_token_mint: string;
            global_base_token_vault: string;
            global_reward_token_mint: string;
            global_reward_token_vault: string;
            global_farm: string;
            convert_authority: string;
            pool_swap_authority: string;
            farm_token_mint: string;
            reward_token_mint: string;
            swap_pool_mint: string;
            token_a_mint: string;
            token_b_mint: string;
            fee_collector_token_account: string;
            swap_markets: string[];
            compound_swap_routes: {
                market_name: string;
                stable: boolean;
                aquafarm: boolean;
                takes_fee: boolean;
                full_amount: boolean;
                check_swap_skip: boolean;
                swap_direction: string;
            }[];
        };
        intermediary_token_mints: string[];
        name: string;
        symbol: string;
    };
    quarry: any;
} | {
    tag: string;
    farm_type: number[];
    multi_deposit_optimizer: any;
    lending_optimizer: any;
    raydium: any;
    orca: any;
    quarry: {
        account: string;
        base: {
            compound_interval: number;
            fees: {
                controller_fee: number;
                deposit_fee: number;
                multiplier: number;
                platform_fee: number;
                withdraw_fee: number;
            };
            nonce: number;
            pda: string;
            pda_nonce: number;
            shares_mint: string;
            slippage_tolerance: number;
            underlying_compound_queue: string;
            underlying_deposit_queue: string;
            underlying_mint: string;
            underlying_mint_decimals: number;
            underlying_withdraw_queue: string;
        };
        claim_fee_token_account: string;
        compound_swap_routes: {
            market_name: string;
            stable: boolean;
            aquafarm: boolean;
            takes_fee: boolean;
            full_amount: boolean;
            check_swap_skip: boolean;
            swap_direction: string;
        }[];
        config_data_account: string;
        decimal_wrap: any;
        intermediary_token_mints: string[];
        miner: string;
        miner_token_account: string;
        mint_wrapper: string;
        minter: string;
        name: string;
        quarry: string;
        redeem_fee_token_account: string;
        reward_token_account: string;
        reward_token_mint: string;
        rewarder: string;
        saber_config: {
            mint_proxy_state: string;
            proxy_mint_authority: string;
            redeemer: string;
            redemption_mint: string;
            redemption_minter: string;
            redemption_vault: string;
            vault_redemption_token_account: string;
        };
        sunny_config: {
            claim_fee_token_account: string;
            harvest_mint_wrapper: string;
            harvest_minter: string;
            harvest_saber_fee_token_account: string;
            harvest_sunny_fee_token_account: string;
            miner: string;
            miner_token_account: string;
            redeem_fee_token_account: string;
            redeemer: string;
            redemption_mint: string;
            redemption_mint_wrapper: string;
            redemption_minter: string;
            redemption_vault: string;
            rewarder: string;
            sunny_internal_token_mint: string;
            sunny_pool: string;
            sunny_quarry: string;
            sunny_tvault: string;
            sunny_tvault_internal_token_account: string;
            sunny_tvault_saber_reward_token_account: string;
            sunny_tvault_sunny_reward_token_account: string;
            sunny_tvault_vendor_token_account: string;
            vault_redemption_token_account: string;
            vault_reward_token_account: string;
            withdraw_fee_destination: string;
        };
        swap_markets: string[];
        symbol: string;
        variant: string;
    };
};
/**
 * @description Gives the deposited amount for the sharesBalances after conversion
 *
 * @param {Object} data
 * @returns depositedAmount
 */
export function getDepositedAmountForShares({ sharesBalance, totalDepositedBalance, totalShares, decimals }: any): number;
/**
 * @description Gives the shares for lpTokenAmount
 *
 * @param {Object} data
 * @returns shares
 */
export function getSharesForLpTokenAmount({ lpTokenAmount, totalDepositedBalance, totalShares, decimals, lockedShares }: any): number;
/**
 * @description Checks if a platform is supported in the v2 platform or not
 *
 * @param {String} platform
 * @returns Boolean
 */
export function isSupportedV2Platform(platform: string): boolean;
/**
 * @description Total deposited balance for the user
 * Current deposited shares + wallet balance of the collateral token
 *
 * @returns {Number} totalDepositedAmount
 */
export function getTotalDeposited({ tokenAccounts, sharesMint, decimals, totalDepositedBalance, totalShares, deposited }: {
    tokenAccounts: any;
    sharesMint: any;
    decimals: any;
    totalDepositedBalance: any;
    totalShares: any;
    deposited: any;
}): number;
import * as anchor from "@project-serum/anchor";
