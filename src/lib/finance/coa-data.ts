/**
 * Chart of Accounts — flat list + helpers for tree view.
 * Anchored on real account codes from ERP_New (5001 + the 30030xxx TEHFEEZ family).
 */

export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';
export type AccountSubType =
  | 'CURRENT_ASSET' | 'FIXED_ASSET' | 'CONTRA_ASSET' | 'INTANGIBLE'
  | 'CURRENT_LIABILITY' | 'LONG_TERM_LIABILITY'
  | 'EQUITY'
  | 'OPERATING_INCOME' | 'OTHER_INCOME' | 'DONATION_INCOME'
  | 'COGS' | 'OPERATING_EXPENSE' | 'ADMIN_EXPENSE' | 'DEPRECIATION_EXPENSE';

export type Account = {
  code: string;
  name: string;
  parent: string | null;
  type: AccountType;
  subType: AccountSubType | null;       // null for header accounts
  normalBalance: 'DEBIT' | 'CREDIT';
  isPosting: boolean;                    // false = header/summary, true = postable
  isControl: boolean;                    // AR/AP/Bank/Cash/Fund
  controlType?: 'AR' | 'AP' | 'BANK' | 'CASH' | 'STOCK' | 'FUND';
  fundCode?: string;
  openingBalance: number;
  currentBalance: number;
  currency: 'PKR' | 'USD';
  companies: number[];
  isActive: boolean;
};

export const accounts: Account[] = [
  // ── Roots ────────────────────────────────────────────────────────────
  { code: '1', name: 'ASSETS',       parent: null, type: 'ASSET',     subType: null, normalBalance: 'DEBIT',  isPosting: false, isControl: false, openingBalance: 0, currentBalance: 53_493_602, currency: 'PKR', companies: [1,2,3,4,5], isActive: true },
  { code: '2', name: 'LIABILITIES',  parent: null, type: 'LIABILITY', subType: null, normalBalance: 'CREDIT', isPosting: false, isControl: false, openingBalance: 0, currentBalance: -2_418_756, currency: 'PKR', companies: [1,2,3,4,5], isActive: true },
  { code: '3', name: 'EQUITY',       parent: null, type: 'EQUITY',    subType: null, normalBalance: 'CREDIT', isPosting: false, isControl: false, openingBalance: 0, currentBalance: -51_074_846, currency: 'PKR', companies: [1,2,3,4,5], isActive: true },
  { code: '4', name: 'INCOME',       parent: null, type: 'INCOME',    subType: null, normalBalance: 'CREDIT', isPosting: false, isControl: false, openingBalance: 0, currentBalance: -5_582_900, currency: 'PKR', companies: [1,2,3,4,5], isActive: true },
  { code: '5', name: 'EXPENSES',     parent: null, type: 'EXPENSE',   subType: null, normalBalance: 'DEBIT',  isPosting: false, isControl: false, openingBalance: 0, currentBalance: 2_340_800, currency: 'PKR', companies: [1,2,3,4,5], isActive: true },

  // ── Current Assets (parent 11) ───────────────────────────────────────
  { code: '11',   name: 'Current Assets',                 parent: '1',  type: 'ASSET', subType: null, normalBalance: 'DEBIT', isPosting: false, isControl: false, openingBalance: 0, currentBalance: 5_720_000, currency: 'PKR', companies: [1,2,3,4,5], isActive: true },
  { code: '1001', name: 'Cash on Hand',                    parent: '11', type: 'ASSET', subType: 'CURRENT_ASSET', normalBalance: 'DEBIT', isPosting: true, isControl: true, controlType: 'CASH', openingBalance: 425_000, currentBalance:    450_000, currency: 'PKR', companies: [1,2,3,4,5], isActive: true },
  { code: '1002', name: 'Bank Account — HBL Current',      parent: '11', type: 'ASSET', subType: 'CURRENT_ASSET', normalBalance: 'DEBIT', isPosting: true, isControl: true, controlType: 'BANK', openingBalance: 2_780_000, currentBalance:  2_850_000, currency: 'PKR', companies: [3,5],     isActive: true },
  { code: '1003', name: 'Bank Account — MCB Savings',      parent: '11', type: 'ASSET', subType: 'CURRENT_ASSET', normalBalance: 'DEBIT', isPosting: true, isControl: true, controlType: 'BANK', openingBalance: 1_200_000, currentBalance:  1_250_000, currency: 'PKR', companies: [3,5],     isActive: true },
  { code: '1004', name: 'Bank Account — UBL USD',          parent: '11', type: 'ASSET', subType: 'CURRENT_ASSET', normalBalance: 'DEBIT', isPosting: true, isControl: true, controlType: 'BANK', openingBalance:    12_300, currentBalance:    312_500, currency: 'USD', companies: [3,5],     isActive: true },
  { code: '1100', name: 'Accounts Receivable',             parent: '11', type: 'ASSET', subType: 'CURRENT_ASSET', normalBalance: 'DEBIT', isPosting: true, isControl: true, controlType: 'AR',   openingBalance:   720_000, currentBalance:    850_000, currency: 'PKR', companies: [1,2,3,4,5], isActive: true },
  { code: '1200', name: 'Inventory — Food Supplies',       parent: '11', type: 'ASSET', subType: 'CURRENT_ASSET', normalBalance: 'DEBIT', isPosting: true, isControl: true, controlType: 'STOCK',openingBalance:   290_000, currentBalance:    320_000, currency: 'PKR', companies: [2],       isActive: true },

  // ── Fixed Assets (parent 12) ─────────────────────────────────────────
  { code: '12',   name: 'Fixed Assets',                    parent: '1',  type: 'ASSET', subType: null, normalBalance: 'DEBIT', isPosting: false, isControl: false, openingBalance: 0, currentBalance: 47_773_602, currency: 'PKR', companies: [1,2,3,4,5], isActive: true },
  { code: '1500', name: 'Buildings & Structures',          parent: '12', type: 'ASSET', subType: 'FIXED_ASSET', normalBalance: 'DEBIT', isPosting: true, isControl: false, openingBalance: 45_000_000, currentBalance: 45_000_000, currency: 'PKR', companies: [3,5], isActive: true },
  { code: '1510', name: 'Acc. Depreciation — Buildings',   parent: '12', type: 'ASSET', subType: 'CONTRA_ASSET', normalBalance: 'CREDIT', isPosting: true, isControl: false, openingBalance: -7_500_000, currentBalance: -7_875_000, currency: 'PKR', companies: [3,5], isActive: true },
  { code: '1600', name: 'Equipment & Furniture',           parent: '12', type: 'ASSET', subType: 'FIXED_ASSET', normalBalance: 'DEBIT', isPosting: true, isControl: false, openingBalance: 2_100_000, currentBalance: 2_100_000, currency: 'PKR', companies: [2,3,4,5], isActive: true },
  { code: '1610', name: 'Acc. Depreciation — Equipment',   parent: '12', type: 'ASSET', subType: 'CONTRA_ASSET', normalBalance: 'CREDIT', isPosting: true, isControl: false, openingBalance: -354_500, currentBalance: -380_500, currency: 'PKR', companies: [2,3,4,5], isActive: true },
  { code: '1620', name: 'Computer Equipment',              parent: '12', type: 'ASSET', subType: 'FIXED_ASSET', normalBalance: 'DEBIT', isPosting: true, isControl: false, openingBalance: 1_280_000, currentBalance: 1_280_000, currency: 'PKR', companies: [3,5], isActive: true },
  { code: '1700', name: 'Vehicles',                        parent: '12', type: 'ASSET', subType: 'FIXED_ASSET', normalBalance: 'DEBIT', isPosting: true, isControl: false, openingBalance: 3_500_000, currentBalance: 3_500_000, currency: 'PKR', companies: [2,5], isActive: true },
  { code: '1710', name: 'Acc. Depreciation — Vehicles',    parent: '12', type: 'ASSET', subType: 'CONTRA_ASSET', normalBalance: 'CREDIT', isPosting: true, isControl: false, openingBalance: -875_000, currentBalance: -947_500, currency: 'PKR', companies: [2,5], isActive: true },

  // ── Intangibles (parent 13) — real TEHFEEZ codes from ERP_New ───────
  { code: '13',       name: 'Intangible Assets',                          parent: '1',  type: 'ASSET', subType: null, normalBalance: 'DEBIT', isPosting: false, isControl: false, openingBalance: 0, currentBalance: 1_085_902, currency: 'PKR', companies: [4],       isActive: true },
  { code: '30030007', name: 'TEHFEEZ Intangible Asset — Computer Software', parent: '13', type: 'ASSET', subType: 'INTANGIBLE',   normalBalance: 'DEBIT',  isPosting: true, isControl: false, openingBalance: 1_085_902, currentBalance: 1_085_902, currency: 'PKR', companies: [4], isActive: true },
  { code: '30030003', name: 'TEHFEEZ ALLOWANCE FOR DEPRECIATION',          parent: '13', type: 'ASSET', subType: 'CONTRA_ASSET', normalBalance: 'CREDIT', isPosting: true, isControl: false, openingBalance: -3_312_517, currentBalance: -3_312_517, currency: 'PKR', companies: [4], isActive: true },
  { code: '30030001', name: 'TEHFEEZ EQUIPMENT DEPRECIATION',              parent: '13', type: 'ASSET', subType: 'CONTRA_ASSET', normalBalance: 'CREDIT', isPosting: true, isControl: false, openingBalance: -2_241_416, currentBalance: -2_241_416, currency: 'PKR', companies: [4], isActive: true },
  { code: '30030004', name: 'TEHFEEZ BOOKS DEPRECIATION',                  parent: '13', type: 'ASSET', subType: 'CONTRA_ASSET', normalBalance: 'CREDIT', isPosting: true, isControl: false, openingBalance:   -561_203, currentBalance:   -561_203, currency: 'PKR', companies: [4], isActive: true },
  { code: '30030006', name: 'TEHFEEZ KITCHEN ACCESSORIES DEPRECIATION',    parent: '13', type: 'ASSET', subType: 'CONTRA_ASSET', normalBalance: 'CREDIT', isPosting: true, isControl: false, openingBalance:   -189_532, currentBalance:   -189_532, currency: 'PKR', companies: [4], isActive: true },

  // ── Current Liabilities (parent 21) ──────────────────────────────────
  { code: '21',          name: 'Current Liabilities',                  parent: '2',  type: 'LIABILITY', subType: null, normalBalance: 'CREDIT', isPosting: false, isControl: false, openingBalance: 0, currentBalance: -2_418_756, currency: 'PKR', companies: [1,2,3,4,5], isActive: true },
  { code: '2100',        name: 'Accounts Payable',                      parent: '21', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', normalBalance: 'CREDIT', isPosting: true,  isControl: true,  controlType: 'AP', openingBalance: -298_000, currentBalance: -342_000, currency: 'PKR', companies: [1,2,3,4,5], isActive: true },
  { code: '2300',        name: 'Sales Tax Payable',                     parent: '21', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', normalBalance: 'CREDIT', isPosting: true,  isControl: false, openingBalance: -162_400, currentBalance: -175_814, currency: 'PKR', companies: [2,3,5],     isActive: true },
  { code: '2310',        name: 'WHT Payable',                            parent: '21', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', normalBalance: 'CREDIT', isPosting: true,  isControl: false, openingBalance:  -19_500, currentBalance:  -27_300, currency: 'PKR', companies: [2,3,5],     isActive: true },
  { code: '20030100001', name: 'SALARY PAYABLE WTO — MISC STAFF',        parent: '21', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', normalBalance: 'CREDIT', isPosting: true,  isControl: false, openingBalance: -1_873_642, currentBalance: -1_873_642, currency: 'PKR', companies: [3,4], isActive: true },

  // ── Equity (parent 31) ───────────────────────────────────────────────
  { code: '31',   name: 'Retained Earnings',          parent: '3',  type: 'EQUITY', subType: null,    normalBalance: 'CREDIT', isPosting: false, isControl: false, openingBalance: 0, currentBalance: -51_074_846, currency: 'PKR', companies: [1,2,3,4,5], isActive: true },
  { code: '3100', name: 'Retained Earnings (b/f)',     parent: '31', type: 'EQUITY', subType: 'EQUITY', normalBalance: 'CREDIT', isPosting: true,  isControl: false, openingBalance: -43_415_000, currentBalance: -43_415_000, currency: 'PKR', companies: [1,2,3,4,5], isActive: true },
  { code: '3200', name: 'Current Year Earnings',       parent: '31', type: 'EQUITY', subType: 'EQUITY', normalBalance: 'CREDIT', isPosting: true,  isControl: false, openingBalance:           0, currentBalance: -4_201_100, currency: 'PKR', companies: [1,2,3,4,5], isActive: true },

  // ── Operating Income (parent 41) ─────────────────────────────────────
  { code: '41',   name: 'Operating Income', parent: '4',  type: 'INCOME', subType: null, normalBalance: 'CREDIT', isPosting: false, isControl: false, openingBalance: 0, currentBalance: -3_268_400, currency: 'PKR', companies: [2,3,5], isActive: true },
  { code: '4001', name: 'Restaurant Sales',                  parent: '41', type: 'INCOME', subType: 'OPERATING_INCOME', normalBalance: 'CREDIT', isPosting: true, isControl: false, openingBalance: 0, currentBalance: -1_732_400, currency: 'PKR', companies: [2], isActive: true },
  { code: '4002', name: 'Catering Revenue',                  parent: '41', type: 'INCOME', subType: 'OPERATING_INCOME', normalBalance: 'CREDIT', isPosting: true, isControl: false, openingBalance: 0, currentBalance:   -712_500, currency: 'PKR', companies: [2], isActive: true },
  { code: '4003', name: 'Madrasa Fees Collected',            parent: '41', type: 'INCOME', subType: 'OPERATING_INCOME', normalBalance: 'CREDIT', isPosting: true, isControl: false, openingBalance: 0, currentBalance:   -805_000, currency: 'PKR', companies: [3], isActive: true },
  { code: '4099', name: 'Other Income',                      parent: '41', type: 'INCOME', subType: 'OTHER_INCOME',     normalBalance: 'CREDIT', isPosting: true, isControl: false, openingBalance: 0, currentBalance:    -18_500, currency: 'PKR', companies: [2,3,5], isActive: true },

  // ── Donation Income (parent 42) — funds linked here ─────────────────
  { code: '42',   name: 'Donation Income', parent: '4', type: 'INCOME', subType: null, normalBalance: 'CREDIT', isPosting: false, isControl: false, openingBalance: 0, currentBalance: -2_294_500, currency: 'PKR', companies: [3,4,5], isActive: true },
  { code: '4100', name: 'Donation Income — Zakat',           parent: '42', type: 'INCOME', subType: 'DONATION_INCOME', normalBalance: 'CREDIT', isPosting: true, isControl: true, controlType: 'FUND', fundCode: 'ZAKAT',     openingBalance: 0, currentBalance: -1_234_500, currency: 'PKR', companies: [5], isActive: true },
  { code: '4101', name: 'Donation Income — Sadqah',          parent: '42', type: 'INCOME', subType: 'DONATION_INCOME', normalBalance: 'CREDIT', isPosting: true, isControl: true, controlType: 'FUND', fundCode: 'SADQAH',    openingBalance: 0, currentBalance:   -480_000, currency: 'PKR', companies: [5], isActive: true },
  { code: '4102', name: 'Donation Income — Mosque',          parent: '42', type: 'INCOME', subType: 'DONATION_INCOME', normalBalance: 'CREDIT', isPosting: true, isControl: true, controlType: 'FUND', fundCode: 'MOSQUE',    openingBalance: 0, currentBalance:   -320_000, currency: 'PKR', companies: [5], isActive: true },
  { code: '4103', name: 'Donation Income — Madrassah',       parent: '42', type: 'INCOME', subType: 'DONATION_INCOME', normalBalance: 'CREDIT', isPosting: true, isControl: true, controlType: 'FUND', fundCode: 'MADRASSAH', openingBalance: 0, currentBalance:   -220_000, currency: 'PKR', companies: [5], isActive: true },
  { code: '4104', name: 'Donation Income — General',         parent: '42', type: 'INCOME', subType: 'DONATION_INCOME', normalBalance: 'CREDIT', isPosting: true, isControl: true, controlType: 'FUND', fundCode: 'GENERAL',   openingBalance: 0, currentBalance:    -40_000, currency: 'PKR', companies: [5], isActive: true },

  // ── COGS (parent 51) ─────────────────────────────────────────────────
  { code: '51',   name: 'Cost of Sales',     parent: '5',  type: 'EXPENSE', subType: null, normalBalance: 'DEBIT', isPosting: false, isControl: false, openingBalance: 0, currentBalance: 498_200, currency: 'PKR', companies: [2], isActive: true },
  { code: '5001', name: 'Purchase Invoice (COGS)', parent: '51', type: 'EXPENSE', subType: 'COGS', normalBalance: 'DEBIT', isPosting: true, isControl: false, openingBalance: 0, currentBalance: 498_200, currency: 'PKR', companies: [2], isActive: true },

  // ── Operating Expenses (parent 52) ───────────────────────────────────
  { code: '52',   name: 'Operating Expenses',       parent: '5',  type: 'EXPENSE', subType: null, normalBalance: 'DEBIT', isPosting: false, isControl: false, openingBalance: 0, currentBalance: 1_430_300, currency: 'PKR', companies: [1,2,3,4,5], isActive: true },
  { code: '5012', name: 'Stationery',                parent: '52', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', normalBalance: 'DEBIT', isPosting: true, isControl: false, openingBalance: 0, currentBalance:    17_800, currency: 'PKR', companies: [2,3], isActive: true },
  { code: '5101', name: 'Utilities',                 parent: '52', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', normalBalance: 'DEBIT', isPosting: true, isControl: false, openingBalance: 0, currentBalance:    55_000, currency: 'PKR', companies: [2,3,4,5], isActive: true },
  { code: '5102', name: 'Rent',                      parent: '52', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', normalBalance: 'DEBIT', isPosting: true, isControl: false, openingBalance: 0, currentBalance:   120_000, currency: 'PKR', companies: [2], isActive: true },
  { code: '5201', name: 'Salaries — Operational',    parent: '52', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', normalBalance: 'DEBIT', isPosting: true, isControl: false, openingBalance: 0, currentBalance:   875_000, currency: 'PKR', companies: [2,3,4], isActive: true },
  { code: '5202', name: 'Salaries — Administrative', parent: '52', type: 'EXPENSE', subType: 'ADMIN_EXPENSE',     normalBalance: 'DEBIT', isPosting: true, isControl: false, openingBalance: 0, currentBalance:   320_000, currency: 'PKR', companies: [3,4], isActive: true },
  { code: '5300', name: 'Marketing & Promotion',     parent: '52', type: 'EXPENSE', subType: 'OPERATING_EXPENSE', normalBalance: 'DEBIT', isPosting: true, isControl: false, openingBalance: 0, currentBalance:    42_500, currency: 'PKR', companies: [2,5], isActive: true },

  // ── Depreciation (parent 53) ─────────────────────────────────────────
  { code: '53',   name: 'Depreciation', parent: '5', type: 'EXPENSE', subType: null, normalBalance: 'DEBIT', isPosting: false, isControl: false, openingBalance: 0, currentBalance: 412_300, currency: 'PKR', companies: [2,3,4,5], isActive: true },
  { code: '5601', name: 'Depreciation Expense', parent: '53', type: 'EXPENSE', subType: 'DEPRECIATION_EXPENSE', normalBalance: 'DEBIT', isPosting: true, isControl: false, openingBalance: 0, currentBalance: 412_300, currency: 'PKR', companies: [2,3,4,5], isActive: true },
];

export const getAccount = (code: string) => accounts.find(a => a.code === code);
export const getChildren = (code: string) => accounts.filter(a => a.parent === code);
export const getRoots = () => accounts.filter(a => a.parent === null);
export const postingAccounts = () => accounts.filter(a => a.isPosting && a.isActive);

export const accountTotals = {
  count: accounts.length,
  postingCount: accounts.filter(a => a.isPosting).length,
  assets:      accounts.filter(a => a.type === 'ASSET'     && a.parent === '1').reduce((s, x) => s + x.currentBalance, 0),
  liabilities: accounts.filter(a => a.type === 'LIABILITY' && a.parent === '2').reduce((s, x) => s + x.currentBalance, 0),
  equity:      accounts.filter(a => a.type === 'EQUITY'    && a.parent === '3').reduce((s, x) => s + x.currentBalance, 0),
  income:      accounts.filter(a => a.type === 'INCOME'    && a.parent === '4').reduce((s, x) => s + x.currentBalance, 0),
  expense:     accounts.filter(a => a.type === 'EXPENSE'   && a.parent === '5').reduce((s, x) => s + x.currentBalance, 0),
};
