export const FARM_PLATFORMS = {
  RAYDIUM: 'raydium',
  SABER: 'saber',
  ORCA: 'orca',
  TULIP: 'tulip',
  SOLEND: 'solend',
  MANGO: 'mango',
  ATRIX: 'atrix'
};

export const UI_CONFIG_PLATFORM_MAPPING = {
  raydium: 'raydium',
  saber: 'quarry',
  orca: 'orca',
  tulip: 'multi_deposit_optimizer',
  atrix: 'atrix'
};

export const STANDALONE_VAULT_TAGS = {
  TULIP: 'tulip'
};

export const DEPOSIT_TYPES = {
  SINGLE: 'single',
  DUAL: 'dual'
};

export const TAGS = {
  STABLE: 'stable'
};

// Compounding Time in minutes
const COMPOUNDING_TIME = 10;

const NUMBER_OF_COMPOUNDING_CYCLES_IN_A_DAY = (24 * 60) / COMPOUNDING_TIME;
const NUMBER_OF_PERIODS_IN_A_WEEK = NUMBER_OF_COMPOUNDING_CYCLES_IN_A_DAY * 7;
const NUMBER_OF_PERIODS_IN_A_YEAR = NUMBER_OF_COMPOUNDING_CYCLES_IN_A_DAY * 365;

export const COMPOUNDING_CYCLES = {
  DAILY: NUMBER_OF_COMPOUNDING_CYCLES_IN_A_DAY,
  WEEKLY: NUMBER_OF_PERIODS_IN_A_WEEK,
  YEARLY: NUMBER_OF_PERIODS_IN_A_YEAR
};
