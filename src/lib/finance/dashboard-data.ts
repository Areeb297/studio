/**
 * Finance dashboard — KPI snapshot, AR/AP top customers, bank tiles, alerts.
 */

export const dashSnapshot = {
  cashPosition:        4_862_500,   // 1001 + 1002 + 1003 + 1004 in PKR-equivalent
  cashPositionDelta:   8.2,
  receivables:           850_000,
  receivablesOverdue:    275_000,
  payables:              342_000,
  payablesDueSoon:        88_000,
  mtdNetProfit:        1_280_600,
  mtdNetProfitDelta:     12.4,
  postedVouchersToday:        18,
  pendingApprovals:            4,
  donationsToday:        47_500,
};

export const arTopCustomers = [
  { name: 'GREEN VALLEY CATERING',     amount: 170_000, bucket: '31-60' },
  { name: 'NOOR HOSTEL',               amount: 130_000, bucket: '90+'   },
  { name: 'HBL CORP. STAFF MESS',      amount:  85_000, bucket: '61-90' },
  { name: 'CITY PHARMA EVENTS',        amount:  72_300, bucket: '0-30'  },
  { name: 'AL-MUHAMMADI SUPPLIERS',    amount:  45_000, bucket: '0-30'  },
];

export const apTopSuppliers = [
  { name: 'KARACHI MEAT TRADERS',      amount: 155_000, due: '5 days'   },
  { name: 'AL-MAJEED VEGETABLES',      amount:  45_000, due: '3 days'   },
  { name: 'TEHFEEZ STATIONERS',        amount:  42_000, due: '14 days'  },
  { name: 'LAHORE SPICES',             amount:  13_000, due: 'Overdue'  },
  { name: 'BISMILLAH DAIRY',           amount:  87_200, due: '21 days'  },
];

export const bankTiles = [
  { code: '1001', name: 'Cash Drawer',          balance:   450_000, currency: 'PKR', lastRecon: 'Today',     status: 'recon' as const },
  { code: '1002', name: 'HBL Current',           balance: 2_850_000, currency: 'PKR', lastRecon: '31 Apr',    status: 'recon' as const },
  { code: '1003', name: 'MCB Savings',           balance: 1_250_000, currency: 'PKR', lastRecon: '31 Apr',    status: 'recon' as const },
  { code: '1004', name: 'UBL USD',               balance:    12_500, currency: 'USD', lastRecon: '30 Apr',    status: 'stale' as const },
];

export const alerts = [
  { level: 'warn'  as const, text: 'Period May 2026 not yet closed — 5 days past month-end',           href: '/dashboard/finance/period-close' },
  { level: 'warn'  as const, text: 'Bank UBL USD not reconciled for 23 days',                          href: '/dashboard/finance/bank-reconciliation' },
  { level: 'warn'  as const, text: 'Forex revaluation pending (May 2026)',                              href: '/dashboard/finance/period-close' },
  { level: 'danger'as const, text: '3 supplier invoices > 90 days overdue',                             href: '/dashboard/finance/ap' },
  { level: 'info'  as const, text: '12 vouchers awaiting your approval',                                href: '/dashboard/finance/approvals/journals' },
];
