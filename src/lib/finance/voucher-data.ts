/**
 * Sample vouchers across all types (JV / CPV / CRV / BPV / BRV / GLI / GLB).
 * Distribution: ~75% POSTED, ~15% PENDING_APPROVAL, ~5% DRAFT, ~5% REVERSED.
 */

export type VoucherType = 'JV' | 'CPV' | 'CRV' | 'BPV' | 'BRV' | 'GLI' | 'GLB' | 'SR' | 'SP';
export type VoucherStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'POSTED' | 'REVERSED';

export type VoucherLine = {
  accountCode: string;
  accountName: string;
  costCenterId?: number;
  narration?: string;
  debit: number;
  credit: number;
};

export type Voucher = {
  id: string;
  number: string;
  type: VoucherType;
  date: string;
  reference: string;
  partyName?: string;
  description: string;
  lines: VoucherLine[];
  status: VoucherStatus;
  amount: number;            // Σ debits == Σ credits
  createdBy: string;
  approvedBy?: string;
};

const v = (
  number: string, type: VoucherType, date: string, status: VoucherStatus,
  reference: string, description: string, lines: VoucherLine[],
  partyName?: string, createdBy = 'A. Shafqat', approvedBy?: string,
): Voucher => ({
  id: number,
  number, type, date, reference, description, lines, status, partyName, createdBy, approvedBy,
  amount: lines.reduce((s, l) => s + l.debit, 0),
});

export const vouchers: Voucher[] = [
  v('JV-2026-05-0234', 'JV', '2026-05-23', 'POSTED', 'May rent accrual',
    'Monthly rent accrual — Restaurant + Marriage Lawn',
    [
      { accountCode: '5102', accountName: 'Rent',         costCenterId: 2, debit: 80_000, credit: 0,      narration: 'Restaurant share' },
      { accountCode: '5102', accountName: 'Rent',         costCenterId: 3, debit: 40_000, credit: 0,      narration: 'Lawn share' },
      { accountCode: '2100', accountName: 'Accounts Payable',                  debit:      0, credit: 120_000, narration: 'Landlord' },
    ], 'KARACHI PROPERTIES', 'A. Shafqat', 'M. Owais',
  ),
  v('CPV-2026-05-0017', 'CPV', '2026-05-23', 'POSTED', 'Petty cash',
    'Office stationery — Pakistan paper supplies',
    [
      { accountCode: '5012', accountName: 'Stationery',   costCenterId: 2, debit: 2_500, credit: 0 },
      { accountCode: '1001', accountName: 'Cash on Hand',                  debit:     0, credit: 2_500 },
    ], undefined, 'A. Shafqat', 'A. Shafqat',
  ),
  v('BPV-2026-05-0011', 'BPV', '2026-05-22', 'PENDING_APPROVAL', 'HBL ch#10231',
    'Utility bill — K-Electric May',
    [
      { accountCode: '5101', accountName: 'Utilities',    costCenterId: 2, debit: 78_500, credit: 0 },
      { accountCode: '1002', accountName: 'Bank — HBL',                    debit:      0, credit: 78_500, narration: 'Cheque #10231' },
    ], 'K-ELECTRIC', 'A. Shafqat',
  ),
  v('CRV-2026-05-0001', 'CRV', '2026-05-02', 'POSTED', 'Cash sales',
    'Daily cash sales — Restaurant',
    [
      { accountCode: '1001', accountName: 'Cash on Hand',                  debit: 12_500, credit: 0 },
      { accountCode: '4001', accountName: 'Restaurant Sales', costCenterId: 2, debit:      0, credit: 12_500 },
    ], undefined, 'A. Shafqat', 'A. Shafqat',
  ),
  v('BRV-2026-05-0007', 'BRV', '2026-05-05', 'POSTED', 'HBL ch#10488',
    'Receipt — GREEN VALLEY CATERING',
    [
      { accountCode: '1002', accountName: 'Bank — HBL',                    debit: 35_000, credit: 0 },
      { accountCode: '1100', accountName: 'Accounts Receivable',           debit:      0, credit: 35_000, narration: 'Inv CI-2026-04-0019 partial' },
    ], 'GREEN VALLEY CATERING', 'A. Shafqat', 'M. Owais',
  ),
  v('JV-2026-05-0233', 'JV', '2026-05-20', 'POSTED', 'Salary accrual',
    'May salary accrual — Tehfeez staff',
    [
      { accountCode: '5202', accountName: 'Salaries — Admin', costCenterId: 5, debit: 320_000, credit: 0 },
      { accountCode: '20030100001', accountName: 'Salary Payable',          debit:       0, credit: 320_000 },
    ], undefined, 'A. Shafqat', 'M. Owais',
  ),
  v('BPV-2026-05-0010', 'BPV', '2026-05-20', 'POSTED', 'HBL ch#10228',
    'Supplier payment — KARACHI MEAT TRADERS',
    [
      { accountCode: '2100', accountName: 'Accounts Payable',               debit: 80_000, credit: 0,      narration: 'Inv SI-…-0019' },
      { accountCode: '1002', accountName: 'Bank — HBL',                     debit:      0, credit: 80_000, narration: 'Cheque #10228' },
    ], 'KARACHI MEAT TRADERS', 'A. Shafqat', 'M. Owais',
  ),
  v('CPV-2026-05-0016', 'CPV', '2026-05-19', 'REVERSED', 'Cancelled',
    'Cash advance — entered in error, reversed',
    [
      { accountCode: '5300', accountName: 'Marketing & Promotion', costCenterId: 2, debit: 5_000, credit: 0 },
      { accountCode: '1001', accountName: 'Cash on Hand',                              debit:     0, credit: 5_000 },
    ], undefined, 'A. Shafqat',
  ),
  v('JV-2026-05-0232', 'JV', '2026-05-18', 'POSTED', 'Donation reclass',
    'Reclassify Zakat → Mosque per donor instruction',
    [
      { accountCode: '4100', accountName: 'Donation — Zakat',  debit: 25_000, credit: 0 },
      { accountCode: '4102', accountName: 'Donation — Mosque', debit:      0, credit: 25_000 },
    ], 'F. AHMED', 'A. Shafqat', 'M. Owais',
  ),
  v('BRV-2026-05-0006', 'BRV', '2026-05-15', 'POSTED', 'Zakat donation',
    'Zakat donation — cheque',
    [
      { accountCode: '1002', accountName: 'Bank — HBL',                       debit: 50_000, credit: 0,      narration: 'Cheque #10488' },
      { accountCode: '4100', accountName: 'Donation — Zakat',                 debit:      0, credit: 50_000, narration: 'Donor K. Mirza' },
    ], 'K. MIRZA', 'A. Shafqat', 'M. Owais',
  ),
  v('JV-2026-05-0231', 'JV', '2026-05-12', 'PENDING_APPROVAL', 'Apr depreciation',
    'April depreciation run — auto-generated',
    [
      { accountCode: '5601', accountName: 'Depreciation Expense', costCenterId: 2, debit: 180_000, credit: 0 },
      { accountCode: '5601', accountName: 'Depreciation Expense', costCenterId: 3, debit:  75_000, credit: 0 },
      { accountCode: '5601', accountName: 'Depreciation Expense', costCenterId: 5, debit: 157_300, credit: 0 },
      { accountCode: '1610', accountName: 'Acc. Dep — Equipment',                 debit:       0, credit:  93_500 },
      { accountCode: '1710', accountName: 'Acc. Dep — Vehicles',                  debit:       0, credit:  72_500 },
      { accountCode: '1510', accountName: 'Acc. Dep — Buildings',                 debit:       0, credit: 246_300 },
    ], undefined, 'System',
  ),
  v('CPV-2026-05-0015', 'CPV', '2026-05-10', 'POSTED', 'Fuel petty',
    'Vehicle fuel — Toyota Hiace',
    [
      { accountCode: '5101', accountName: 'Utilities', costCenterId: 3, debit: 6_400, credit: 0 },
      { accountCode: '1001', accountName: 'Cash on Hand',               debit:     0, credit: 6_400 },
    ],
  ),
  v('CRV-2026-05-0002', 'CRV', '2026-05-08', 'POSTED', 'Madrasa fees',
    'Madrasa fee collection — 8 students',
    [
      { accountCode: '1001', accountName: 'Cash on Hand',                              debit: 64_000, credit: 0 },
      { accountCode: '4003', accountName: 'Madrasa Fees Collected', costCenterId: 1, debit:      0, credit: 64_000 },
    ], undefined, 'A. Shafqat', 'A. Shafqat',
  ),
  v('GLI-2026-05-0008', 'GLI', '2026-05-07', 'DRAFT', 'PO-887',
    'Catering hall rental — Eid event',
    [
      { accountCode: '1100', accountName: 'Accounts Receivable',  debit: 57_650, credit: 0 },
      { accountCode: '4002', accountName: 'Catering Revenue', costCenterId: 3, debit: 0, credit: 50_000 },
      { accountCode: '2300', accountName: 'Sales Tax Payable',     debit:      0, credit:  7_650 },
    ], 'GREEN VALLEY CATERING', 'A. Shafqat',
  ),
  v('BPV-2026-05-0009', 'BPV', '2026-05-04', 'POSTED', 'MCB transfer',
    'Pay supplier via bank transfer',
    [
      { accountCode: '2100', accountName: 'Accounts Payable',  debit: 25_750, credit: 0 },
      { accountCode: '1003', accountName: 'Bank — MCB',        debit:      0, credit: 25_750 },
    ], 'AL-MAJEED VEGETABLES', 'A. Shafqat', 'M. Owais',
  ),
];

export const voucherStats = {
  total:    vouchers.length,
  posted:   vouchers.filter(v => v.status === 'POSTED').length,
  pending:  vouchers.filter(v => v.status === 'PENDING_APPROVAL').length,
  draft:    vouchers.filter(v => v.status === 'DRAFT').length,
  reversed: vouchers.filter(v => v.status === 'REVERSED').length,
};
