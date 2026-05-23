/**
 * Mock data for Trial Balance, P&L, Balance Sheet, Cash Flow.
 * All figures in PKR. Cost-centre breakdowns use the 5 real CCs from seed.ts.
 */

import { COST_CENTERS } from './seed';

const CC_REST = COST_CENTERS.find(c => c.name === 'RESTAURANT')!;
const CC_LAWN = COST_CENTERS.find(c => c.name === 'MARRIAGE LAWN')!;
const CC_LSD  = COST_CENTERS.find(c => c.name === 'LOCAL STUDENT DEPT')!;
const CC_TEH  = COST_CENTERS.find(c => c.name === 'TEHFEEZ')!;

// ── Trial Balance ─────────────────────────────────────────────────────────
export const trialBalanceRows = [
  { code: '1001',     name: 'Cash on Hand',                              debit:   450_000, credit:         0, type: 'ASSET' },
  { code: '1002',     name: 'Bank Account — HBL Current',                debit: 2_850_000, credit:         0, type: 'ASSET' },
  { code: '1003',     name: 'Bank Account — MCB Savings',                debit: 1_250_000, credit:         0, type: 'ASSET' },
  { code: '1004',     name: 'Bank Account — UBL USD',                    debit:   312_500, credit:         0, type: 'ASSET' },
  { code: '1100',     name: 'Accounts Receivable',                       debit:   850_000, credit:         0, type: 'ASSET' },
  { code: '1200',     name: 'Inventory — Food Supplies',                 debit:   320_000, credit:         0, type: 'ASSET' },
  { code: '1500',     name: 'Buildings & Structures',                    debit:45_000_000, credit:         0, type: 'ASSET' },
  { code: '1510',     name: 'Acc. Depreciation — Buildings',             debit:         0, credit: 7_875_000, type: 'ASSET' },
  { code: '1600',     name: 'Equipment & Furniture',                     debit: 2_100_000, credit:         0, type: 'ASSET' },
  { code: '1610',     name: 'Acc. Depreciation — Equipment',             debit:         0, credit:   380_500, type: 'ASSET' },
  { code: '1700',     name: 'Vehicles',                                  debit: 3_500_000, credit:         0, type: 'ASSET' },
  { code: '1710',     name: 'Acc. Depreciation — Vehicles',              debit:         0, credit:   947_500, type: 'ASSET' },
  { code: '30030007', name: 'TEHFEEZ Intangible Asset — Computer Software', debit: 1_085_902, credit:      0, type: 'ASSET' },
  { code: '2100',     name: 'Accounts Payable',                          debit:         0, credit:   342_000, type: 'LIABILITY' },
  { code: '2300',     name: 'Sales Tax Payable',                         debit:         0, credit:   175_814, type: 'LIABILITY' },
  { code: '2310',     name: 'WHT Payable',                               debit:         0, credit:    27_300, type: 'LIABILITY' },
  { code: '20030100001', name: 'SALARY PAYABLE WTO — MISC STAFF',         debit:         0, credit: 1_873_642, type: 'LIABILITY' },
  { code: '3100',     name: 'Retained Earnings',                         debit:         0, credit:43_415_000, type: 'EQUITY' },
  { code: '3200',     name: 'Current Year Earnings',                     debit:         0, credit: 4_201_100, type: 'EQUITY' },
  { code: '4001',     name: 'Restaurant Sales',                          debit:         0, credit: 1_732_400, type: 'INCOME' },
  { code: '4002',     name: 'Catering Revenue',                          debit:         0, credit:   712_500, type: 'INCOME' },
  { code: '4003',     name: 'Madrasa Fees Collected',                    debit:         0, credit:   805_000, type: 'INCOME' },
  { code: '4099',     name: 'Other Income',                              debit:         0, credit:    18_500, type: 'INCOME' },
  { code: '4100',     name: 'Donation Income — Zakat',                   debit:         0, credit: 1_234_500, type: 'INCOME' },
  { code: '4101',     name: 'Donation Income — Sadqah',                  debit:         0, credit:   480_000, type: 'INCOME' },
  { code: '4102',     name: 'Donation Income — Mosque',                  debit:         0, credit:   320_000, type: 'INCOME' },
  { code: '4103',     name: 'Donation Income — Madrassah',               debit:         0, credit:   220_000, type: 'INCOME' },
  { code: '4104',     name: 'Donation Income — General',                 debit:         0, credit:    40_000, type: 'INCOME' },
  { code: '5001',     name: 'Purchase Invoice (COGS)',                   debit:   498_200, credit:         0, type: 'EXPENSE' },
  { code: '5012',     name: 'Stationery',                                debit:    17_800, credit:         0, type: 'EXPENSE' },
  { code: '5101',     name: 'Utilities',                                 debit:    55_000, credit:         0, type: 'EXPENSE' },
  { code: '5102',     name: 'Rent',                                      debit:   120_000, credit:         0, type: 'EXPENSE' },
  { code: '5201',     name: 'Salaries — Operational Staff',              debit:   875_000, credit:         0, type: 'EXPENSE' },
  { code: '5202',     name: 'Salaries — Administrative',                 debit:   320_000, credit:         0, type: 'EXPENSE' },
  { code: '5300',     name: 'Marketing & Promotion',                     debit:    42_500, credit:         0, type: 'EXPENSE' },
  { code: '5601',     name: 'Depreciation Expense',                      debit:   412_300, credit:         0, type: 'EXPENSE' },
];

export const trialBalanceTotal = trialBalanceRows.reduce(
  (a, r) => ({ debit: a.debit + r.debit, credit: a.credit + r.credit }),
  { debit: 0, credit: 0 },
);

// ── Profit & Loss ─────────────────────────────────────────────────────────
type PLRow = { code: string; name: string; total: number; byCC?: Partial<Record<string, number>> };

export const pnlIncome: PLRow[] = [
  { code: '4001', name: 'Restaurant Sales',           total: 1_732_400, byCC: { [CC_REST.name]: 1_732_400 } },
  { code: '4002', name: 'Catering Revenue',           total:   712_500, byCC: { [CC_LAWN.name]:   712_500 } },
  { code: '4003', name: 'Madrasa Fees Collected',     total:   805_000, byCC: { [CC_LSD.name]:    805_000 } },
  { code: '4099', name: 'Other Income',               total:    18_500, byCC: { [CC_REST.name]:    12_500, [CC_LAWN.name]: 6_000 } },
  { code: '4100', name: 'Donation Income — Zakat',    total: 1_234_500, byCC: { [CC_TEH.name]: 1_234_500 } },
  { code: '4101', name: 'Donation Income — Sadqah',   total:   480_000, byCC: { [CC_TEH.name]:   480_000 } },
  { code: '4102', name: 'Donation Income — Mosque',   total:   320_000, byCC: { [CC_TEH.name]:   320_000 } },
  { code: '4103', name: 'Donation Income — Madrassah', total:  220_000, byCC: { [CC_LSD.name]:    220_000 } },
  { code: '4104', name: 'Donation Income — General',  total:    40_000, byCC: { [CC_TEH.name]:    40_000 } },
];

export const pnlCogs: PLRow[] = [
  { code: '5001', name: 'Purchase Invoice (COGS)',    total:   498_200, byCC: { [CC_REST.name]: 412_400, [CC_LAWN.name]: 85_800 } },
];

export const pnlOpex: PLRow[] = [
  { code: '5012', name: 'Stationery',                 total:    17_800, byCC: { [CC_REST.name]:  8_500, [CC_LAWN.name]: 5_300, [CC_LSD.name]: 4_000 } },
  { code: '5101', name: 'Utilities',                  total:    55_000, byCC: { [CC_REST.name]: 25_000, [CC_LAWN.name]: 12_000, [CC_LSD.name]: 18_000 } },
  { code: '5102', name: 'Rent',                       total:   120_000, byCC: { [CC_REST.name]: 80_000, [CC_LAWN.name]: 40_000 } },
  { code: '5201', name: 'Salaries — Operational',     total:   875_000, byCC: { [CC_REST.name]: 420_000, [CC_LAWN.name]: 185_000, [CC_TEH.name]: 270_000 } },
  { code: '5202', name: 'Salaries — Administrative',  total:   320_000, byCC: { [CC_LSD.name]: 160_000, [CC_TEH.name]: 160_000 } },
  { code: '5300', name: 'Marketing & Promotion',      total:    42_500, byCC: { [CC_REST.name]: 30_000, [CC_LAWN.name]: 12_500 } },
  { code: '5601', name: 'Depreciation Expense',       total:   412_300, byCC: { [CC_REST.name]: 180_000, [CC_LAWN.name]: 75_000, [CC_TEH.name]: 157_300 } },
];

// Prior period (for delta)
export const pnlPrior = {
  income: 4_900_000,
  cogs:   470_000,
  opex: 1_785_000,
  net:  2_645_000,
};

// ── Balance Sheet ─────────────────────────────────────────────────────────
type BSRow = { name: string; current: number; prior: number };

export const balanceSheet = {
  currentAssets: [
    { name: 'Cash on Hand',                        current:   450_000, prior:   425_000 },
    { name: 'Bank Accounts',                       current: 4_412_500, prior: 3_980_000 },
    { name: 'Accounts Receivable',                 current:   850_000, prior:   720_000 },
    { name: 'Inventory',                           current:   320_000, prior:   290_000 },
  ] as BSRow[],
  fixedAssets: [
    { name: 'Buildings & Structures (net)',        current:37_125_000, prior:37_500_000 },
    { name: 'Equipment & Furniture (net)',         current: 1_719_500, prior: 1_745_500 },
    { name: 'Vehicles (net)',                      current: 2_552_500, prior: 2_625_000 },
    { name: 'Intangibles',                         current: 1_085_902, prior: 1_085_902 },
  ] as BSRow[],
  currentLiabilities: [
    { name: 'Accounts Payable',                    current:   342_000, prior:   298_000 },
    { name: 'Sales Tax Payable',                   current:   175_814, prior:   162_400 },
    { name: 'WHT Payable',                         current:    27_300, prior:    19_500 },
    { name: 'Salary Payable',                      current: 1_873_642, prior: 1_873_642 },
  ] as BSRow[],
  longTermLiabilities: [] as BSRow[],
  equity: [
    { name: 'Retained Earnings',                   current:43_415_000, prior:36_950_000 },
    { name: 'Current Year Earnings',               current: 4_201_100, prior: 7_464_160 },
  ] as BSRow[],
};

// ── Cash Flow ─────────────────────────────────────────────────────────────
export const cashFlow = {
  operating: [
    { name: 'Net profit for the period',           amount:  4_201_100 },
    { name: 'Add: Depreciation',                   amount:    412_300 },
    { name: 'Add: Increase in AP',                 amount:     44_000 },
    { name: 'Less: Increase in AR',                amount:   -130_000 },
    { name: 'Less: Increase in Inventory',         amount:    -30_000 },
  ],
  investing: [
    { name: 'Asset acquisition',                   amount:          0 },
    { name: 'Asset disposal proceeds',             amount:    150_000 },
  ],
  financing: [
    { name: 'Donations received',                  amount:  2_294_500 },
  ],
  openingCash: 4_405_000,
};

// Monthly trend — 6 months
export const monthlyPnl = [
  { month: 'Dec',  income: 4_200_000, expense: 3_140_000 },
  { month: 'Jan',  income: 4_580_000, expense: 3_320_000 },
  { month: 'Feb',  income: 4_910_000, expense: 3_650_000 },
  { month: 'Mar',  income: 5_120_000, expense: 3_780_000 },
  { month: 'Apr',  income: 5_310_000, expense: 4_490_840 },
  { month: 'May',  income: 5_563_900, expense: 4_283_300 },
];

export const monthlyCashflow = [
  { month: 'Dec', operating: 2_100_000, investing:   -50_000, financing:  800_000 },
  { month: 'Jan', operating: 2_310_000, investing:         0, financing:  920_000 },
  { month: 'Feb', operating: 1_980_000, investing:  -120_000, financing: 1_050_000 },
  { month: 'Mar', operating: 2_540_000, investing:  -240_000, financing: 1_180_000 },
  { month: 'Apr', operating: 2_820_000, investing:         0, financing: 1_980_000 },
  { month: 'May', operating: 4_497_400, investing:   150_000, financing: 2_294_500 },
];
