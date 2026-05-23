/**
 * Budget mock data — per Account × Cost Centre × 12 months.
 */

import { COST_CENTERS } from './seed';

const MONTHS = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export const budgetMonths = MONTHS;

export type BudgetRow = {
  accountCode: string;
  accountName: string;
  type: 'INCOME' | 'EXPENSE';
  monthly: number[];          // 12 values
  ytdBudget: number;          // sum of monthly through current month
  ytdActual: number;
  variance: number;           // YTD actual − YTD budget (sign-aware: +ve = over for exp, +ve = better for inc)
  variancePct: number;
};

const cumulativeThrough = (monthly: number[], thru: number) =>
  monthly.slice(0, thru).reduce((a, v) => a + v, 0);

// Currently in May (index 10) of FY2026
const CUR_MONTH = 11; // through May

function row(accountCode: string, accountName: string, type: 'INCOME' | 'EXPENSE', base: number, growth = 0.02, actualMultiplier = 1.0): BudgetRow {
  const monthly = MONTHS.map((_, i) => Math.round(base * (1 + i * growth)));
  const ytdBudget = cumulativeThrough(monthly, CUR_MONTH);
  const ytdActual = Math.round(ytdBudget * actualMultiplier);
  const variance = ytdActual - ytdBudget;
  return {
    accountCode,
    accountName,
    type,
    monthly,
    ytdBudget,
    ytdActual,
    variance,
    variancePct: ytdBudget ? (variance / ytdBudget) * 100 : 0,
  };
}

export const budgetsRestaurant: BudgetRow[] = [
  row('4001', 'Restaurant Sales',          'INCOME',  320_000, 0.018, 0.962),
  row('4099', 'Other Income',               'INCOME',    2_500, 0.010, 1.083),
  row('5001', 'Purchase COGS',              'EXPENSE',  80_000, 0.015, 1.107),
  row('5012', 'Stationery',                 'EXPENSE',   1_250, 0.000, 1.187),
  row('5101', 'Utilities',                  'EXPENSE',  25_000, 0.005, 1.000),
  row('5102', 'Rent',                       'EXPENSE',  80_000, 0.000, 1.000),
  row('5201', 'Salaries — Operational',     'EXPENSE', 420_000, 0.000, 1.000),
  row('5300', 'Marketing',                  'EXPENSE',   8_000, 0.010, 1.250),
];

export const budgetsLawn: BudgetRow[] = [
  row('4002', 'Catering Revenue',           'INCOME',  100_000, 0.025, 1.188),
  row('5102', 'Rent',                       'EXPENSE',  40_000, 0.000, 1.000),
  row('5301', 'Marketing & Promotion',      'EXPENSE',   2_500, 0.020, 1.083),
];

export const budgetsTehfeez: BudgetRow[] = [
  row('4100', 'Donation Income — Zakat',    'INCOME',  205_000, 0.012, 1.003),
  row('4101', 'Donation Income — Sadqah',   'INCOME',   85_000, 0.010, 0.941),
  row('5202', 'Salaries — Administrative',  'EXPENSE', 160_000, 0.000, 1.000),
];

export const budgetMatrix = {
  RESTAURANT:     budgetsRestaurant,
  'MARRIAGE LAWN': budgetsLawn,
  TEHFEEZ:        budgetsTehfeez,
};

// Upload preview mock
export const uploadPreview = {
  totalRows: 142,
  ready: 138,
  warnings: [
    { row: 47,  field: 'CostCenter', value: 'CATERING',  msg: 'Unknown cost centre — did you mean MARRIAGE LAWN?' },
    { row: 89,  field: 'AccountCode', value: '5099',     msg: 'Account does not exist in CoA' },
    { row: 102, field: 'CostCenter', value: 'LSD',       msg: 'Use full name LOCAL STUDENT DEPT' },
    { row: 119, field: 'AccountCode', value: '4999',     msg: 'Account does not exist in CoA' },
  ],
};
