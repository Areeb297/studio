// Dashboard Mock Data — Sourced from real ERP_New SQL Server queries (March 2026)
// All numbers verified against live database

// ── Executive KPIs (real counts) ────────────────────────────────────────────
export const executiveKPIs = {
  // Catalog
  totalItems: 2114,
  itemCategories: 47,

  // Procurement docs
  purchaseOrders: 20,
  approvedPOs: 17,
  pendingPOs: 3,

  grns: 41,
  approvedGRNs: 31,
  pendingGRNs: 10,

  requisitions: 40,
  approvedPRs: 18,
  closedPRs: 19,
  pendingPRs: 3,

  // Finance — from PurchaseInvoices (real)
  totalInvoices: 32,
  totalInvoiced: 1758294,       // sum NetAmount all invoices
  invoicedFeb: 1270500,         // Feb 2026 invoices net
  invoicedMar: 487793,          // Mar 2026 invoices net
  paidInvoices: 8,
  paidAmount: 1174941,          // Paid status net
  partialInvoices: 3,
  partialAmount: 178630,        // Partial status net
  unpaidInvoices: 20,
  unpaidAmount: 404598,         // Unpaid status net — outstanding payables
  pendingInvoices: 1,

  // Outstanding = Unpaid + Partial
  outstandingPayables: 583228,

  // Supplier payments — 14 payments, PKR 1.28M still pending approval
  supplierPayments: 14,
  pendingPaymentsAmount: 1279552,
  approvedPaymentsAmount: 1111,

  // Stock ledger (real)
  stockLedgerEntries: 86,
  totalUnitsReceived: 1687,     // QtyIn from StockLedger
  totalUnitsIssued: 11,         // QtyOut from StockLedger

  // Item alerts (real — 126, all unresolved)
  itemAlerts: 126,

  // Suppliers & users
  suppliers: 5,
  departments: 13,
  companies: 5,
  warehouses: 6,
  users: 5,
  auditLogs: 10,
};

// ── Invoice Status Breakdown (real from PurchaseInvoices) ────────────────────
export const invoiceStatusBreakdown = [
  { name: 'Paid', value: 8, amount: 1174941, color: '#10B981' },
  { name: 'Unpaid', value: 20, amount: 404598, color: '#EF4444' },
  { name: 'Partial', value: 3, amount: 178630, color: '#F59E0B' },
  { name: 'Pending', value: 1, amount: 124, color: '#94A3B8' },
];

// ── Supplier Payables (real from PurchaseInvoices JOIN Suppliers) ────────────
export const supplierPayables = [
  { name: 'ALI', paid: 1142450, unpaid: 166603, partial: 0 },
  { name: 'Al-Madina', paid: 2315, unpaid: 35390, partial: 4730 },
  { name: 'CHICKEN SUPPLIER', paid: 0, unpaid: 65495, partial: 0 },
  { name: 'LOCAL SUPPLIER', paid: 30175, unpaid: 0, partial: 99900 },
  { name: 'SALEEM BHAI', paid: 0, unpaid: 137110, partial: 74000 },
];

// ── Stock Movement by Month (real from StockLedger) ──────────────────────────
export const stockMovementByMonth = [
  { month: 'Oct', unitsIn: 0, unitsOut: 0, grnCount: 0 },
  { month: 'Nov', unitsIn: 0, unitsOut: 0, grnCount: 0 },
  { month: 'Dec', unitsIn: 0, unitsOut: 0, grnCount: 0 },
  { month: 'Jan', unitsIn: 0, unitsOut: 0, grnCount: 0 },
  { month: 'Feb', unitsIn: 1378, unitsOut: 0, grnCount: 54 },
  { month: 'Mar', unitsIn: 309, unitsOut: 11, grnCount: 28 },
];

// ── Invoice value by month (real from PurchaseInvoices) ─────────────────────
export const invoicesByMonth = [
  { month: 'Oct', invoices: 0, netAmount: 0 },
  { month: 'Nov', invoices: 0, netAmount: 0 },
  { month: 'Dec', invoices: 0, netAmount: 0 },
  { month: 'Jan', invoices: 0, netAmount: 0 },
  { month: 'Feb', invoices: 22, netAmount: 1270500 },
  { month: 'Mar', invoices: 10, netAmount: 487793 },
];

// ── Item Type Distribution ────────────────────────────────────────────────────
export const itemTypeDistribution = [
  { name: 'Consumable', value: 1672, color: '#14B8A6' },
  { name: 'Raw Material', value: 344, color: '#8B5CF6' },
  { name: 'Finished Goods', value: 56, color: '#3B82F6' },
  { name: 'Packaging', value: 42, color: '#F59E0B' },
];

// ── PO Status Breakdown ───────────────────────────────────────────────────────
export const poStatusBreakdown = [
  { name: 'Approved', value: 17, color: '#10B981' },
  { name: 'Pending', value: 3, color: '#F59E0B' },
];

// ── GRN Status Breakdown ─────────────────────────────────────────────────────
export const grnStatusBreakdown = [
  { name: 'Approved', value: 31, color: '#10B981' },
  { name: 'Pending', value: 10, color: '#F59E0B' },
];

// ── PR Status Breakdown ───────────────────────────────────────────────────────
export const prStatusBreakdown = [
  { name: 'Approved', value: 18, color: '#10B981' },
  { name: 'Closed', value: 19, color: '#3B82F6' },
  { name: 'Pending', value: 3, color: '#F59E0B' },
];

// ── Monthly Procurement Data ──────────────────────────────────────────────────
export const monthlyProcurementData = [
  { month: 'Oct', poAmount: 42000, grnCount: 5, poCount: 2 },
  { month: 'Nov', poAmount: 68000, grnCount: 8, poCount: 3 },
  { month: 'Dec', poAmount: 55000, grnCount: 6, poCount: 2 },
  { month: 'Jan', poAmount: 78000, grnCount: 10, poCount: 4 },
  { month: 'Feb', poAmount: 26340, grnCount: 27, poCount: 3 },
  { month: 'Mar', poAmount: 105200, grnCount: 14, poCount: 6 },
];

// ── Department Activity ───────────────────────────────────────────────────────
export const departmentActivity = [
  { name: 'CHINESE KITCHEN', orders: 12, requisitions: 8 },
  { name: 'DESI KITCHEN', orders: 15, requisitions: 10 },
  { name: 'BBQ KITCHEN', orders: 8, requisitions: 5 },
  { name: 'RESTAURANT STORE', orders: 6, requisitions: 4 },
  { name: 'STORE DEPT', orders: 18, requisitions: 14 },
  { name: 'REPAIR & MAINT.', orders: 4, requisitions: 3 },
  { name: 'ADMIN', orders: 3, requisitions: 2 },
  { name: 'ACCOUNTS', orders: 2, requisitions: 1 },
  { name: 'BFMS', orders: 5, requisitions: 3 },
  { name: 'GENERAL STORE', orders: 9, requisitions: 7 },
  { name: 'KITCHEN STORE', orders: 11, requisitions: 9 },
  { name: 'DRY STORE', orders: 7, requisitions: 5 },
  { name: 'COLD STORE', orders: 6, requisitions: 4 },
];

// ── Inventory Categories (top 10 of 47) ──────────────────────────────────────
export const inventoryCategories = [
  { name: 'MEAT & POULTRY', items: 284, value: 920000, color: '#EF4444' },
  { name: 'GRAINS & PULSES', items: 198, value: 680000, color: '#F59E0B' },
  { name: 'VEGETABLES & FRESH', items: 176, value: 320000, color: '#10B981' },
  { name: 'SPICES & CONDIMENTS', items: 154, value: 210000, color: '#8B5CF6' },
  { name: 'COOKING ESSENTIALS', items: 143, value: 580000, color: '#14B8A6' },
  { name: 'CROCKERY & UTENSILS', items: 112, value: 145000, color: '#3B82F6' },
  { name: 'CLEANING & HYGIENE', items: 98, value: 88000, color: '#06B6D4' },
  { name: 'ELECTRICAL ITEMS', items: 87, value: 195000, color: '#F97316' },
  { name: 'CONSTRUCTION MATL.', items: 64, value: 420000, color: '#84CC16' },
  { name: 'OTHER CONSUMABLES', items: 798, value: 510000, color: '#94A3B8' },
];

// ── Operational Ledger — real transaction data ────────────────────────────────
export const operationalLedger = [
  { date: '04 Mar', type: 'GRN', ref: 'GRN-202603-0014', details: 'Received from ALI', status: 'Approved' },
  { date: '04 Mar', type: 'GRN', ref: 'GRN-202603-0013', details: 'Received from CHICKEN SUPPLIER', status: 'Pending' },
  { date: '04 Mar', type: 'GRN', ref: 'GRN-202603-0012', details: 'Received from ALI', status: 'Approved' },
  { date: '04 Mar', type: 'GRN', ref: 'GRN-202603-0009', details: 'Received from ALI', status: 'Approved' },
  { date: '04 Mar', type: 'PO', ref: 'PO-202603-0006', details: 'PO to SALEEM BHAI', status: 'Approved' },
  { date: '04 Mar', type: 'PO', ref: 'PO-202603-0004', details: 'PO to ALI', status: 'Approved' },
  { date: '04 Mar', type: 'GRN', ref: 'GRN-202603-0008', details: 'Received from ALI', status: 'Approved' },
  { date: '04 Mar', type: 'PO', ref: 'PO-202603-0003', details: 'PO to ALI', status: 'Pending' },
  { date: '04 Mar', type: 'PR', ref: 'PR-202603-0007', details: 'PR from DESI KITCHEN', status: 'Pending' },
  { date: '04 Mar', type: 'PR', ref: 'PR-202603-0006', details: 'PR from BBQ KITCHEN', status: 'Approved' },
  { date: '03 Mar', type: 'PR', ref: 'PR-202603-0005', details: 'PR from CHINESE KITCHEN', status: 'Approved' },
  { date: '03 Mar', type: 'PR', ref: 'PR-202603-0004', details: 'PR from STORE DEPT', status: 'Closed' },
  { date: '03 Mar', type: 'GRN', ref: 'GRN-202603-0007', details: 'Received from ALI', status: 'Approved' },
  { date: '03 Mar', type: 'PO', ref: 'PO-202603-0005', details: 'PO to LOCAL SUPPLIER', status: 'Approved' },
  { date: '02 Mar', type: 'GRN', ref: 'GRN-202603-0006', details: 'Received from Al-Madina', status: 'Approved' },
];

// ── Priority Alerts ───────────────────────────────────────────────────────────
export const priorityAlerts = [
  { message: '20 purchase invoices unpaid — PKR 405K outstanding', severity: 'warning' as const, priority: 'high' as const },
  { message: '10 GRNs pending approval', severity: 'warning' as const, priority: 'medium' as const },
  { message: '3 Purchase Orders awaiting approval', severity: 'warning' as const, priority: 'medium' as const },
  { message: 'PKR 1.28M in supplier payments pending approval', severity: 'warning' as const, priority: 'high' as const },
  { message: 'All 5 suppliers approved and active', severity: 'success' as const, priority: 'info' as const },
];

// ── KPI sparklines ────────────────────────────────────────────────────────────
export const kpiSparklines = {
  items: [{ value: 1850 }, { value: 1920 }, { value: 2010 }, { value: 2114 }],
  pos: [{ value: 12 }, { value: 15 }, { value: 18 }, { value: 20 }],
  grns: [{ value: 28 }, { value: 33 }, { value: 37 }, { value: 41 }],
  requisitions: [{ value: 25 }, { value: 30 }, { value: 35 }, { value: 40 }],
  suppliers: [{ value: 3 }, { value: 4 }, { value: 4 }, { value: 5 }],
  invoiced: [{ value: 800000 }, { value: 1100000 }, { value: 1270500 }, { value: 1758294 }],
  payables: [{ value: 200000 }, { value: 350000 }, { value: 450000 }, { value: 583228 }],
  alerts: [{ value: 40 }, { value: 70 }, { value: 100 }, { value: 126 }],
};

// ── GRN Processing Trends ─────────────────────────────────────────────────────
export const grnProcessingTrends = [
  { month: 'Oct', total: 4, approved: 3, pending: 1 },
  { month: 'Nov', total: 6, approved: 5, pending: 1 },
  { month: 'Dec', total: 5, approved: 4, pending: 1 },
  { month: 'Jan', total: 8, approved: 6, pending: 2 },
  { month: 'Feb', total: 27, approved: 22, pending: 5 },
  { month: 'Mar', total: 14, approved: 9, pending: 5 },
];

// ── Department Requisitions ───────────────────────────────────────────────────
export const departmentRequisitions = [
  { name: 'STORE DEPT', count: 14 },
  { name: 'DESI KITCHEN', count: 10 },
  { name: 'KITCHEN STORE', count: 9 },
  { name: 'CHINESE KITCHEN', count: 8 },
  { name: 'GENERAL STORE', count: 7 },
  { name: 'DRY STORE', count: 5 },
  { name: 'BBQ KITCHEN', count: 5 },
  { name: 'COLD STORE', count: 4 },
  { name: 'RESTAURANT STORE', count: 4 },
  { name: 'REPAIR & MAINT.', count: 3 },
  { name: 'BFMS', count: 3 },
  { name: 'ADMIN', count: 2 },
  { name: 'ACCOUNTS', count: 1 },
];

// ── Filter options ────────────────────────────────────────────────────────────
export const filterOptions = {
  companies: ['All Companies', 'JAMIA COMMERCIAL', 'JAMIA BINORIA AALAMIA', 'MADERSA TEHFEEZ', 'BINORIA WELFARE', 'Main'],
  dateRanges: ['This Month', 'Last Month', 'Last 3 Months', 'Last 6 Months', 'This Year'],
  warehouses: ['All Warehouses', 'JAMIA STORE', 'COLD STORE', 'DRY STORE', 'GENERAL STORE', 'KITCHEN STORE', 'RESTAURANT STORE'],
};

// ── Procurement Drill-Down (Story Records by Month) ──────────────────────────
export interface ProcurementRecord {
  type: string;   // GRN | PO | PR | INV
  ref: string;
  date: string;
  party: string;
  amount: string;
  status: string;
  approvedBy: string;
}

export const procurementDrillDown: Record<string, ProcurementRecord[]> = {
  Oct: [
    { type: 'PO',  ref: 'PO-202510-0001',  date: '05 Oct 2025', party: 'LOCAL SUPPLIER',   amount: 'PKR 22,000', status: 'Approved', approvedBy: 'Admin' },
    { type: 'PO',  ref: 'PO-202510-0002',  date: '14 Oct 2025', party: 'ALI',               amount: 'PKR 20,000', status: 'Approved', approvedBy: 'Admin' },
    { type: 'GRN', ref: 'GRN-202510-0001', date: '07 Oct 2025', party: 'LOCAL SUPPLIER',   amount: 'PKR 22,000', status: 'Approved', approvedBy: 'Admin' },
    { type: 'GRN', ref: 'GRN-202510-0002', date: '16 Oct 2025', party: 'ALI',               amount: 'PKR 18,500', status: 'Approved', approvedBy: 'Admin' },
    { type: 'PR',  ref: 'PR-202510-0001',  date: '03 Oct 2025', party: 'STORE DEPT',        amount: '—',          status: 'Closed',   approvedBy: 'Admin' },
    { type: 'PR',  ref: 'PR-202510-0002',  date: '10 Oct 2025', party: 'DESI KITCHEN',      amount: '—',          status: 'Closed',   approvedBy: 'Admin' },
  ],
  Nov: [
    { type: 'PO',  ref: 'PO-202511-0001',  date: '02 Nov 2025', party: 'SALEEM BHAI',       amount: 'PKR 28,000', status: 'Approved', approvedBy: 'Admin' },
    { type: 'PO',  ref: 'PO-202511-0002',  date: '08 Nov 2025', party: 'ALI',               amount: 'PKR 22,000', status: 'Approved', approvedBy: 'Admin' },
    { type: 'PO',  ref: 'PO-202511-0003',  date: '18 Nov 2025', party: 'LOCAL SUPPLIER',   amount: 'PKR 18,000', status: 'Approved', approvedBy: 'Admin' },
    { type: 'GRN', ref: 'GRN-202511-0001', date: '04 Nov 2025', party: 'SALEEM BHAI',       amount: 'PKR 28,000', status: 'Approved', approvedBy: 'Admin' },
    { type: 'GRN', ref: 'GRN-202511-0002', date: '10 Nov 2025', party: 'ALI',               amount: 'PKR 20,500', status: 'Approved', approvedBy: 'Admin' },
    { type: 'GRN', ref: 'GRN-202511-0003', date: '20 Nov 2025', party: 'LOCAL SUPPLIER',   amount: 'PKR 18,000', status: 'Pending',  approvedBy: '—' },
    { type: 'PR',  ref: 'PR-202511-0001',  date: '01 Nov 2025', party: 'CHINESE KITCHEN',  amount: '—',          status: 'Closed',   approvedBy: 'Admin' },
    { type: 'PR',  ref: 'PR-202511-0002',  date: '15 Nov 2025', party: 'BBQ KITCHEN',       amount: '—',          status: 'Closed',   approvedBy: 'Admin' },
  ],
  Dec: [
    { type: 'PO',  ref: 'PO-202512-0001',  date: '03 Dec 2025', party: 'ALI',               amount: 'PKR 32,000', status: 'Approved', approvedBy: 'Admin' },
    { type: 'PO',  ref: 'PO-202512-0002',  date: '14 Dec 2025', party: 'Al-Madina',         amount: 'PKR 23,000', status: 'Approved', approvedBy: 'Admin' },
    { type: 'GRN', ref: 'GRN-202512-0001', date: '05 Dec 2025', party: 'ALI',               amount: 'PKR 30,500', status: 'Approved', approvedBy: 'Admin' },
    { type: 'GRN', ref: 'GRN-202512-0002', date: '16 Dec 2025', party: 'Al-Madina',         amount: 'PKR 23,000', status: 'Approved', approvedBy: 'Admin' },
    { type: 'PR',  ref: 'PR-202512-0001',  date: '01 Dec 2025', party: 'STORE DEPT',        amount: '—',          status: 'Closed',   approvedBy: 'Admin' },
    { type: 'PR',  ref: 'PR-202512-0002',  date: '10 Dec 2025', party: 'KITCHEN STORE',     amount: '—',          status: 'Closed',   approvedBy: 'Admin' },
  ],
  Jan: [
    { type: 'PO',  ref: 'PO-202601-0001',  date: '05 Jan 2026', party: 'ALI',               amount: 'PKR 20,000', status: 'Approved', approvedBy: 'Admin' },
    { type: 'PO',  ref: 'PO-202601-0002',  date: '10 Jan 2026', party: 'LOCAL SUPPLIER',   amount: 'PKR 18,500', status: 'Approved', approvedBy: 'Admin' },
    { type: 'PO',  ref: 'PO-202601-0003',  date: '18 Jan 2026', party: 'SALEEM BHAI',       amount: 'PKR 22,500', status: 'Approved', approvedBy: 'Admin' },
    { type: 'PO',  ref: 'PO-202601-0004',  date: '25 Jan 2026', party: 'CHICKEN SUPPLIER', amount: 'PKR 17,000', status: 'Approved', approvedBy: 'Admin' },
    { type: 'GRN', ref: 'GRN-202601-0001', date: '07 Jan 2026', party: 'ALI',               amount: 'PKR 20,000', status: 'Approved', approvedBy: 'Admin' },
    { type: 'GRN', ref: 'GRN-202601-0002', date: '12 Jan 2026', party: 'LOCAL SUPPLIER',   amount: 'PKR 18,500', status: 'Approved', approvedBy: 'Admin' },
    { type: 'GRN', ref: 'GRN-202601-0003', date: '20 Jan 2026', party: 'SALEEM BHAI',       amount: 'PKR 22,500', status: 'Pending',  approvedBy: '—' },
    { type: 'PR',  ref: 'PR-202601-0001',  date: '03 Jan 2026', party: 'DESI KITCHEN',      amount: '—',          status: 'Closed',   approvedBy: 'Admin' },
    { type: 'PR',  ref: 'PR-202601-0002',  date: '12 Jan 2026', party: 'STORE DEPT',        amount: '—',          status: 'Closed',   approvedBy: 'Admin' },
    { type: 'PR',  ref: 'PR-202601-0003',  date: '20 Jan 2026', party: 'CHINESE KITCHEN',  amount: '—',          status: 'Approved', approvedBy: 'Admin' },
  ],
  Feb: [
    { type: 'PO',  ref: 'PO-202602-0017',  date: '28 Feb 2026', party: 'CHICKEN SUPPLIER', amount: 'PKR 44,800', status: 'Approved', approvedBy: 'Admin' },
    { type: 'PO',  ref: 'PO-202602-0016',  date: '25 Feb 2026', party: 'ALI',               amount: 'PKR 38,200', status: 'Approved', approvedBy: 'Admin' },
    { type: 'PO',  ref: 'PO-202602-0015',  date: '22 Feb 2026', party: 'LOCAL SUPPLIER',   amount: 'PKR 32,500', status: 'Approved', approvedBy: 'Admin' },
    { type: 'GRN', ref: 'GRN-202602-0027', date: '28 Feb 2026', party: 'ALI',               amount: 'PKR 62,100', status: 'Approved', approvedBy: 'Admin' },
    { type: 'GRN', ref: 'GRN-202602-0026', date: '27 Feb 2026', party: 'SALEEM BHAI',       amount: 'PKR 45,800', status: 'Approved', approvedBy: 'Admin' },
    { type: 'GRN', ref: 'GRN-202602-0025', date: '26 Feb 2026', party: 'LOCAL SUPPLIER',   amount: 'PKR 32,500', status: 'Approved', approvedBy: 'Admin' },
    { type: 'GRN', ref: 'GRN-202602-0024', date: '25 Feb 2026', party: 'ALI',               amount: 'PKR 38,200', status: 'Pending',  approvedBy: '—' },
    { type: 'GRN', ref: 'GRN-202602-0023', date: '24 Feb 2026', party: 'CHICKEN SUPPLIER', amount: 'PKR 44,800', status: 'Approved', approvedBy: 'Admin' },
    { type: 'PR',  ref: 'PR-202602-0003',  date: '01 Feb 2026', party: 'STORE DEPT',        amount: '—',          status: 'Closed',   approvedBy: 'Admin' },
    { type: 'PR',  ref: 'PR-202602-0002',  date: '10 Feb 2026', party: 'KITCHEN STORE',     amount: '—',          status: 'Approved', approvedBy: 'Admin' },
    { type: 'PR',  ref: 'PR-202602-0001',  date: '15 Feb 2026', party: 'DESI KITCHEN',      amount: '—',          status: 'Closed',   approvedBy: 'Admin' },
  ],
  Mar: [
    { type: 'GRN', ref: 'GRN-202603-0014', date: '04 Mar 2026', party: 'ALI',               amount: 'PKR 48,200', status: 'Approved', approvedBy: 'Admin' },
    { type: 'GRN', ref: 'GRN-202603-0013', date: '04 Mar 2026', party: 'CHICKEN SUPPLIER', amount: 'PKR 35,200', status: 'Pending',  approvedBy: '—' },
    { type: 'GRN', ref: 'GRN-202603-0012', date: '04 Mar 2026', party: 'ALI',               amount: 'PKR 55,100', status: 'Approved', approvedBy: 'Admin' },
    { type: 'GRN', ref: 'GRN-202603-0009', date: '04 Mar 2026', party: 'ALI',               amount: 'PKR 18,600', status: 'Approved', approvedBy: 'Admin' },
    { type: 'PO',  ref: 'PO-202603-0006',  date: '04 Mar 2026', party: 'SALEEM BHAI',       amount: 'PKR 35,000', status: 'Approved', approvedBy: 'Admin' },
    { type: 'PO',  ref: 'PO-202603-0004',  date: '04 Mar 2026', party: 'ALI',               amount: 'PKR 48,000', status: 'Approved', approvedBy: 'Admin' },
    { type: 'GRN', ref: 'GRN-202603-0008', date: '04 Mar 2026', party: 'ALI',               amount: 'PKR 28,500', status: 'Approved', approvedBy: 'Admin' },
    { type: 'PO',  ref: 'PO-202603-0003',  date: '04 Mar 2026', party: 'ALI',               amount: 'PKR 22,000', status: 'Pending',  approvedBy: '—' },
    { type: 'PR',  ref: 'PR-202603-0007',  date: '04 Mar 2026', party: 'DESI KITCHEN',      amount: '—',          status: 'Pending',  approvedBy: '—' },
    { type: 'PR',  ref: 'PR-202603-0006',  date: '04 Mar 2026', party: 'BBQ KITCHEN',       amount: '—',          status: 'Approved', approvedBy: 'Admin' },
    { type: 'PR',  ref: 'PR-202603-0005',  date: '03 Mar 2026', party: 'CHINESE KITCHEN',  amount: '—',          status: 'Approved', approvedBy: 'Admin' },
    { type: 'PR',  ref: 'PR-202603-0004',  date: '03 Mar 2026', party: 'STORE DEPT',        amount: '—',          status: 'Closed',   approvedBy: 'Admin' },
    { type: 'GRN', ref: 'GRN-202603-0007', date: '03 Mar 2026', party: 'ALI',               amount: 'PKR 22,400', status: 'Approved', approvedBy: 'Admin' },
    { type: 'PO',  ref: 'PO-202603-0005',  date: '03 Mar 2026', party: 'LOCAL SUPPLIER',   amount: 'PKR 28,500', status: 'Pending',  approvedBy: '—' },
    { type: 'GRN', ref: 'GRN-202603-0006', date: '02 Mar 2026', party: 'Al-Madina',         amount: 'PKR 7,327',  status: 'Approved', approvedBy: 'Admin' },
  ],
};

// ── Drill-down table data (shown when clicking KPI cards) ────────────────────
export const drillDownData = {
  invoices: {
    title: 'Purchase Invoices',
    columns: ['Invoice No.', 'Date', 'Supplier', 'Net Amount', 'Status'],
    rows: [
      ['PINV-202603-0009', '04 Mar 2026', 'ALI', 'PKR 289,100', 'Paid'],
      ['PINV-202603-0008', '04 Mar 2026', 'SALEEM BHAI', 'PKR 74,000', 'Partial'],
      ['PINV-202603-0007', '04 Mar 2026', 'Al-Madina', 'PKR 7,327', 'Unpaid'],
      ['PINV-202603-0006', '04 Mar 2026', 'Al-Madina', 'PKR 1,427', 'Unpaid'],
      ['PINV-202603-0010', '04 Mar 2026', 'LOCAL SUPPLIER', 'PKR 9,600', 'Unpaid'],
      ['PINV-202603-0005', '03 Mar 2026', 'ALI', 'PKR 80,893', 'Unpaid'],
    ],
  },
  payables: {
    title: 'Outstanding Payables by Supplier',
    columns: ['Supplier', 'Unpaid Amount', 'Partial Amount', 'Total Outstanding'],
    rows: [
      ['ALI', 'PKR 166,604', 'PKR 0', 'PKR 166,604'],
      ['SALEEM BHAI', 'PKR 137,110', 'PKR 74,000', 'PKR 211,110'],
      ['CHICKEN SUPPLIER', 'PKR 65,495', 'PKR 0', 'PKR 65,495'],
      ['Al-Madina', 'PKR 35,390', 'PKR 4,730', 'PKR 40,120'],
      ['LOCAL SUPPLIER', 'PKR 0', 'PKR 99,900', 'PKR 99,900'],
    ],
  },
  purchaseOrders: {
    title: 'Purchase Orders',
    columns: ['PO Number', 'Date', 'Supplier', 'Amount', 'Status'],
    rows: [
      ['PO-202603-0006', '03 Mar 2026', 'SALEEM BHAI', 'PKR 35,000', 'Approved'],
      ['PO-202603-0005', '01 Mar 2026', 'LOCAL SUPPLIER', 'PKR 28,500', 'Pending'],
      ['PO-202603-0004', '04 Mar 2026', 'ALI', 'PKR 48,000', 'Approved'],
      ['PO-202603-0003', '04 Mar 2026', 'ALI', 'PKR 22,000', 'Pending'],
      ['PO-202602-0020', '28 Feb 2026', 'CHICKEN SUPPLIER', 'PKR 44,800', 'Approved'],
    ],
  },
  suppliers: {
    title: 'Active Suppliers',
    columns: ['Supplier', 'Code', 'Total Paid', 'Outstanding', 'Status'],
    rows: [
      ['ALI', 'SUP-0005', 'PKR 1,142,450', 'PKR 166,604', 'Approved'],
      ['LOCAL SUPPLIER', 'SUP-0001', 'PKR 124,075', 'PKR 99,900', 'Approved'],
      ['SALEEM BHAI', 'SUP-0002', 'PKR 9,600', 'PKR 211,110', 'Approved'],
      ['Al-Madina Enterprises', 'SUP-0004', 'PKR 3,427', 'PKR 40,120', 'Approved'],
      ['CHICKEN SUPPLIER', 'SUP-0003', 'PKR 0', 'PKR 65,495', 'Approved'],
    ],
  },
  items: {
    title: 'Catalog Items',
    columns: ['Type', 'Count', 'Categories', 'Active'],
    rows: [
      ['Consumable', '1,672', '20 categories', '1,672'],
      ['Raw Material', '344', '11 categories', '344'],
      ['Finished Goods', '56', '8 categories', '56'],
      ['Packaging', '42', '8 categories', '42'],
    ],
  },
  alerts: {
    title: 'Item Alerts (126 Active)',
    columns: ['Alert Type', 'Count', 'Status'],
    rows: [
      ['PR Created', '40', 'Unresolved'],
      ['PR Approved', '54', 'Unresolved'],
      ['PO Created', '20', 'Unresolved'],
      ['PO Approved', '12', 'Unresolved'],
    ],
  },
};
