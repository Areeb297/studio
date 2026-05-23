/**
 * AR / AP mock data — customers, suppliers, open invoices, payments.
 * Names are plausible Karachi business names.
 */

export type AgeingBucket = '0-30' | '31-60' | '61-90' | '90+';

export type Customer = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  creditLimit: number;
  paymentTerms: string;
  totalOpen: number;
  ageingBuckets: Record<AgeingBucket, number>;
};

export type Supplier = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  paymentTerms: string;
  totalOpen: number;
  ageingBuckets: Record<AgeingBucket, number>;
};

export type OpenInvoice = {
  number: string;
  date: string;
  dueDate: string;
  total: number;
  applied: number;
  balance: number;
  daysOld: number;
};

// ── Customers ────────────────────────────────────────────────────────────
export const customers: Customer[] = [
  { id: 'c01', name: 'GREEN VALLEY CATERING',     contact: 'M. Riaz',     phone: '+92 300 1234567', creditLimit: 500_000, paymentTerms: 'Net 30', totalOpen: 170_000, ageingBuckets: { '0-30': 50_000, '31-60': 120_000, '61-90': 0, '90+': 0 } },
  { id: 'c02', name: 'NOOR HOSTEL',               contact: 'S. Khan',     phone: '+92 321 9876543', creditLimit: 300_000, paymentTerms: 'Net 45', totalOpen: 130_000, ageingBuckets: { '0-30': 0, '31-60': 0, '61-90': 55_000, '90+': 75_000 } },
  { id: 'c03', name: 'HBL CORP. STAFF MESS',      contact: 'A. Memon',    phone: '+92 333 2222222', creditLimit: 250_000, paymentTerms: 'Net 30', totalOpen:  85_000, ageingBuckets: { '0-30': 0, '31-60': 0, '61-90': 85_000, '90+': 0 } },
  { id: 'c04', name: 'CITY PHARMA EVENTS',        contact: 'I. Qureshi',  phone: '+92 345 1111111', creditLimit: 200_000, paymentTerms: 'Net 30', totalOpen:  72_300, ageingBuckets: { '0-30': 72_300, '31-60': 0, '61-90': 0, '90+': 0 } },
  { id: 'c05', name: 'AL-MUHAMMADI SUPPLIERS',    contact: 'F. Ali',      phone: '+92 333 8888888', creditLimit: 150_000, paymentTerms: 'Net 30', totalOpen:  45_000, ageingBuckets: { '0-30': 45_000, '31-60': 0, '61-90': 0, '90+': 0 } },
  { id: 'c06', name: 'GULSHAN GRAMMAR SCHOOL',    contact: 'R. Hashim',   phone: '+92 300 5556677', creditLimit: 400_000, paymentTerms: 'Net 30', totalOpen: 105_000, ageingBuckets: { '0-30': 105_000, '31-60': 0, '61-90': 0, '90+': 0 } },
  { id: 'c07', name: 'KARACHI EVENT MANAGEMENT',  contact: 'B. Jamil',    phone: '+92 332 4445566', creditLimit: 350_000, paymentTerms: 'Net 30', totalOpen:  68_500, ageingBuckets: { '0-30': 0, '31-60': 68_500, '61-90': 0, '90+': 0 } },
  { id: 'c08', name: 'DEFENCE CENTRAL MESS',      contact: 'Col. Asif',   phone: '+92 321 7778899', creditLimit: 600_000, paymentTerms: 'Net 30', totalOpen: 175_000, ageingBuckets: { '0-30': 175_000, '31-60': 0, '61-90': 0, '90+': 0 } },
];

export const arTotals = customers.reduce(
  (a, c) => ({
    total: a.total + c.totalOpen,
    '0-30':  a['0-30']  + c.ageingBuckets['0-30'],
    '31-60': a['31-60'] + c.ageingBuckets['31-60'],
    '61-90': a['61-90'] + c.ageingBuckets['61-90'],
    '90+':   a['90+']   + c.ageingBuckets['90+'],
  }),
  { total: 0, '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 },
);

// Open invoices (used inside Customer Receipt allocator)
export const openInvoicesForCustomer = (custId: string): OpenInvoice[] => ({
  c01: [
    { number: 'CI-2026-04-0019', date: '2026-04-12', dueDate: '2026-05-12', total: 120_000, applied: 0, balance: 120_000, daysOld: 41 },
    { number: 'CI-2026-04-0024', date: '2026-04-18', dueDate: '2026-05-18', total:  50_000, applied: 0, balance:  50_000, daysOld: 35 },
    { number: 'CI-2026-05-0042', date: '2026-05-23', dueDate: '2026-06-22', total:  57_650, applied: 0, balance:  57_650, daysOld:  0 },
  ],
  c02: [
    { number: 'CI-2025-09-0144', date: '2025-09-10', dueDate: '2025-10-25', total:  75_000, applied: 0, balance:  75_000, daysOld: 225 },
    { number: 'CI-2025-11-0021', date: '2025-11-05', dueDate: '2025-12-20', total:  55_000, applied: 0, balance:  55_000, daysOld: 169 },
  ],
}[custId] ?? []);

// ── Suppliers ────────────────────────────────────────────────────────────
export const suppliers: Supplier[] = [
  { id: 's01', name: 'KARACHI MEAT TRADERS',   contact: 'H. Iqbal',   phone: '+92 300 1112223', paymentTerms: 'Net 30', totalOpen: 155_000, ageingBuckets: { '0-30': 120_000, '31-60': 35_000, '61-90': 0, '90+': 0 } },
  { id: 's02', name: 'AL-MAJEED VEGETABLES',   contact: 'M. Yousuf',  phone: '+92 321 3334445', paymentTerms: 'Net 15', totalOpen:  45_000, ageingBuckets: { '0-30': 45_000, '31-60': 0, '61-90': 0, '90+': 0 } },
  { id: 's03', name: 'TEHFEEZ STATIONERS',     contact: 'S. Bilal',   phone: '+92 333 4445556', paymentTerms: 'Net 30', totalOpen:  42_000, ageingBuckets: { '0-30': 0, '31-60': 25_000, '61-90': 17_000, '90+': 0 } },
  { id: 's04', name: 'LAHORE SPICES',          contact: 'A. Sharif',  phone: '+92 312 5556677', paymentTerms: 'Net 30', totalOpen:  13_000, ageingBuckets: { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 13_000 } },
  { id: 's05', name: 'BISMILLAH DAIRY',        contact: 'K. Abbas',   phone: '+92 345 7778899', paymentTerms: 'Net 30', totalOpen:  87_200, ageingBuckets: { '0-30': 87_200, '31-60': 0, '61-90': 0, '90+': 0 } },
  { id: 's06', name: 'COOLPRO REFRIGERATION',  contact: 'F. Mughal',  phone: '+92 333 8889990', paymentTerms: 'Net 60', totalOpen:  32_500, ageingBuckets: { '0-30': 32_500, '31-60': 0, '61-90': 0, '90+': 0 } },
  { id: 's07', name: 'EID GAS COMPANY',        contact: 'S. Zafar',   phone: '+92 300 9991122', paymentTerms: 'Net 15', totalOpen:  18_400, ageingBuckets: { '0-30': 18_400, '31-60': 0, '61-90': 0, '90+': 0 } },
];

export const apTotals = suppliers.reduce(
  (a, s) => ({
    total: a.total + s.totalOpen,
    '0-30':  a['0-30']  + s.ageingBuckets['0-30'],
    '31-60': a['31-60'] + s.ageingBuckets['31-60'],
    '61-90': a['61-90'] + s.ageingBuckets['61-90'],
    '90+':   a['90+']   + s.ageingBuckets['90+'],
  }),
  { total: 0, '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 },
);

// Open supplier bills (for Batch Payment Run)
export type OpenBill = {
  supplierId: string;
  supplier: string;
  number: string;
  date: string;
  dueDate: string;
  total: number;
  daysOld: number;
};

export const openBills: OpenBill[] = [
  { supplierId: 's02', supplier: 'AL-MAJEED VEGETABLES',  number: 'SI-2026-05-0034', date: '2026-05-04', dueDate: '2026-05-18', total:  17_200, daysOld: 19 },
  { supplierId: 's02', supplier: 'AL-MAJEED VEGETABLES',  number: 'SI-2026-05-0041', date: '2026-05-06', dueDate: '2026-05-20', total:  25_750, daysOld: 17 },
  { supplierId: 's02', supplier: 'AL-MAJEED VEGETABLES',  number: 'SI-2026-05-0058', date: '2026-05-09', dueDate: '2026-05-23', total:   2_050, daysOld: 14 },
  { supplierId: 's01', supplier: 'KARACHI MEAT TRADERS',   number: 'SI-2026-04-0019', date: '2026-04-12', dueDate: '2026-05-12', total:  80_000, daysOld: 41 },
  { supplierId: 's01', supplier: 'KARACHI MEAT TRADERS',   number: 'SI-2026-04-0024', date: '2026-04-18', dueDate: '2026-05-18', total:  75_000, daysOld: 35 },
  { supplierId: 's03', supplier: 'TEHFEEZ STATIONERS',    number: 'SI-2026-05-0011', date: '2026-05-06', dueDate: '2026-05-20', total:   8_500, daysOld: 17 },
  { supplierId: 's03', supplier: 'TEHFEEZ STATIONERS',    number: 'SI-2026-04-0007', date: '2026-04-07', dueDate: '2026-05-07', total:  33_500, daysOld: 46 },
  { supplierId: 's05', supplier: 'BISMILLAH DAIRY',       number: 'SI-2026-05-0028', date: '2026-05-11', dueDate: '2026-06-10', total:  42_200, daysOld: 12 },
  { supplierId: 's05', supplier: 'BISMILLAH DAIRY',       number: 'SI-2026-05-0033', date: '2026-05-14', dueDate: '2026-06-13', total:  45_000, daysOld:  9 },
  { supplierId: 's04', supplier: 'LAHORE SPICES',         number: 'SI-2025-12-0098', date: '2025-12-15', dueDate: '2026-01-14', total:  13_000, daysOld: 159 },
  { supplierId: 's07', supplier: 'EID GAS COMPANY',       number: 'SI-2026-05-0044', date: '2026-05-14', dueDate: '2026-05-29', total:  18_400, daysOld:  9 },
  { supplierId: 's06', supplier: 'COOLPRO REFRIGERATION', number: 'SI-2026-05-0009', date: '2026-05-05', dueDate: '2026-07-04', total:  32_500, daysOld: 18 },
];
