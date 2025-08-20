import { 
  Account, 
  AccountType, 
  AccountSubType, 
  JournalEntry, 
  JournalLineItem,
  Transaction,
  Customer,
  Vendor,
  Invoice,
  Bill,
  Payment,
  BankAccount,
  BankTransaction,
  AccountingMetrics,
  TrialBalance,
  PaymentMethod
} from '@/types/accounting';

// Chart of Accounts - Based on Current Jamia Binoria Aalamiah System
export const chartOfAccounts: Account[] = [
  // ASSETS
  // Current Assets
  {
    id: '1001',
    code: '1001',
    name: 'Cash on Hand',
    type: 'ASSET',
    subType: 'CURRENT_ASSET',
    normalBalance: 'DEBIT',
    currentBalance: 450000,
    isActive: true,
    description: 'Physical cash in registers and petty cash',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '1002',
    code: '1002',
    name: 'Bank Account - HBL Current',
    type: 'ASSET',
    subType: 'CURRENT_ASSET',
    normalBalance: 'DEBIT',
    currentBalance: 2850000,
    isActive: true,
    description: 'HBL Current Account for operations',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '1003',
    code: '1003',
    name: 'Bank Account - MCB Savings',
    type: 'ASSET',
    subType: 'CURRENT_ASSET',
    normalBalance: 'DEBIT',
    currentBalance: 1250000,
    isActive: true,
    description: 'MCB Savings Account for reserves',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '1100',
    code: '1100',
    name: 'Accounts Receivable',
    type: 'ASSET',
    subType: 'CURRENT_ASSET',
    normalBalance: 'DEBIT',
    currentBalance: 850000,
    isActive: true,
    description: 'Student fees and service receivables',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '1200',
    code: '1200',
    name: 'Inventory - Food Supplies',
    type: 'ASSET',
    subType: 'CURRENT_ASSET',
    normalBalance: 'DEBIT',
    currentBalance: 320000,
    isActive: true,
    description: 'Restaurant and catering inventory',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  // Fixed Assets
  {
    id: '1500',
    code: '1500',
    name: 'Buildings & Structures',
    type: 'ASSET',
    subType: 'FIXED_ASSET',
    normalBalance: 'DEBIT',
    currentBalance: 45000000,
    isActive: true,
    description: 'Madrasa, restaurant, and event hall buildings',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '1600',
    code: '1600',
    name: 'Equipment & Furniture',
    type: 'ASSET',
    subType: 'FIXED_ASSET',
    normalBalance: 'DEBIT',
    currentBalance: 2100000,
    isActive: true,
    description: 'Kitchen equipment, gym equipment, furniture',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },

  // REAL ACCOUNTS FROM CURRENT SYSTEM - DEPRECIATION ACCOUNTS
  {
    id: '30030003',
    code: '30030003',
    name: 'TEHFEEZ ALLOWANCE FOR DEPRECIATION',
    type: 'ASSET',
    subType: 'CONTRA_ASSET',
    normalBalance: 'CREDIT',
    currentBalance: 3312517,
    isActive: true,
    description: 'Tehfeez equipment depreciation allowance',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '30030001',
    code: '30030001',
    name: 'TEHFEEZ EQUIPMENT DEPRECIATION',
    type: 'ASSET',
    subType: 'CONTRA_ASSET',
    normalBalance: 'CREDIT',
    currentBalance: 2241416,
    isActive: true,
    description: 'Tehfeez equipment depreciation',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '30030004',
    code: '30030004',
    name: 'TEHFEEZ BOOKS DEPRECIATION',
    type: 'ASSET',
    subType: 'CONTRA_ASSET',
    normalBalance: 'CREDIT',
    currentBalance: 561203,
    isActive: true,
    description: 'Tehfeez books and educational material depreciation',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '30030006',
    code: '30030006',
    name: 'TEHFEEZ KITCHEN ACCESSORIES DEPRECIATION',
    type: 'ASSET',
    subType: 'CONTRA_ASSET',
    normalBalance: 'CREDIT',
    currentBalance: 189532,
    isActive: true,
    description: 'Tehfeez kitchen accessories depreciation',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '30030007',
    code: '30030007',
    name: 'TEHFEEZ INTANGIBLE ASSET COMPUTER SOFTWARE',
    type: 'ASSET',
    subType: 'INTANGIBLE_ASSET',
    normalBalance: 'DEBIT',
    currentBalance: 1085902,
    isActive: true,
    description: 'Computer software for Tehfeez operations',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },

  // LIABILITIES - FROM CURRENT SYSTEM
  // Staff Salary Payables
  {
    id: '20030100001',
    code: '20030100001',
    name: 'SALARY PAYABLE WTO - MISC STAFF',
    type: 'LIABILITY',
    subType: 'CURRENT_LIABILITY',
    normalBalance: 'CREDIT',
    currentBalance: 1873642,
    isActive: true,
    description: 'Salary payable for miscellaneous staff',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '20030100002',
    code: '20030100002',
    name: 'SALARY PAYABLE WTO - MAIN STAFF',
    type: 'LIABILITY',
    subType: 'CURRENT_LIABILITY',
    normalBalance: 'CREDIT',
    currentBalance: 2135642,
    isActive: true,
    description: 'Salary payable for main teaching staff',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  // Other Payables from Current System
  {
    id: '200372',
    code: '200372',
    name: 'JAMIA BINORIA PAYABLE',
    type: 'LIABILITY',
    subType: 'CURRENT_LIABILITY',
    normalBalance: 'CREDIT',
    currentBalance: 250000,
    isActive: true,
    description: 'General Jamia Binoria payables',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '200373',
    code: '200373',
    name: 'CHAMANS+ORPHAN-THRU-UBO GHULAM ASHAB SHIRK',
    type: 'LIABILITY',
    subType: 'CURRENT_LIABILITY',
    normalBalance: 'CREDIT',
    currentBalance: 60775,
    isActive: true,
    description: 'Orphan support fund payable',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  // Customer Advances
  {
    id: '20040010',
    code: '20040010',
    name: 'CUSTOMER ADVANCE - HQRS (JAMA)',
    type: 'LIABILITY',
    subType: 'CURRENT_LIABILITY',
    normalBalance: 'CREDIT',
    currentBalance: 2410375,
    isActive: true,
    description: 'Customer advance payments - Headquarters Jama',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  // Regular Accounts Payable
  {
    id: '2001',
    code: '2001',
    name: 'Accounts Payable',
    type: 'LIABILITY',
    subType: 'CURRENT_LIABILITY',
    normalBalance: 'CREDIT',
    currentBalance: 680000,
    isActive: true,
    description: 'Supplier and vendor payables',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2100',
    code: '2100',
    name: 'Salaries Payable',
    type: 'LIABILITY',
    subType: 'CURRENT_LIABILITY',
    normalBalance: 'CREDIT',
    currentBalance: 1200000,
    isActive: true,
    description: 'Outstanding staff salaries',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2200',
    code: '2200',
    name: 'Utilities Payable',
    type: 'LIABILITY',
    subType: 'CURRENT_LIABILITY',
    normalBalance: 'CREDIT',
    currentBalance: 150000,
    isActive: true,
    description: 'Electricity, gas, water bills',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },

  // EQUITY
  {
    id: '3001',
    code: '3001',
    name: 'Organizational Capital',
    type: 'EQUITY',
    subType: 'OWNER_EQUITY',
    normalBalance: 'CREDIT',
    currentBalance: 35000000,
    isActive: true,
    description: 'Initial organizational capital and donations',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '3200',
    code: '3200',
    name: 'Retained Earnings',
    type: 'EQUITY',
    subType: 'RETAINED_EARNINGS',
    normalBalance: 'CREDIT',
    currentBalance: 8500000,
    isActive: true,
    description: 'Accumulated earnings from operations',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },

  // REVENUE
  {
    id: '4001',
    code: '4001',
    name: 'Student Fees Revenue',
    type: 'REVENUE',
    subType: 'OPERATING_REVENUE',
    normalBalance: 'CREDIT',
    currentBalance: 2800000,
    isActive: true,
    description: 'Monthly student fees and tuition',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '4002',
    code: '4002',
    name: 'Restaurant Revenue',
    type: 'REVENUE',
    subType: 'OPERATING_REVENUE',
    normalBalance: 'CREDIT',
    currentBalance: 1850000,
    isActive: true,
    description: 'Restaurant and catering sales',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '4003',
    code: '4003',
    name: 'Event Hall Revenue',
    type: 'REVENUE',
    subType: 'OPERATING_REVENUE',
    normalBalance: 'CREDIT',
    currentBalance: 950000,
    isActive: true,
    description: 'Wedding and event bookings',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '4004',
    code: '4004',
    name: 'Gym Membership Revenue',
    type: 'REVENUE',
    subType: 'OPERATING_REVENUE',
    normalBalance: 'CREDIT',
    currentBalance: 420000,
    isActive: true,
    description: 'Gym Time membership fees',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '4100',
    code: '4100',
    name: 'Donation Revenue',
    type: 'REVENUE',
    subType: 'NON_OPERATING_REVENUE',
    normalBalance: 'CREDIT',
    currentBalance: 680000,
    isActive: true,
    description: 'Charitable donations and zakat',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },

  // EXPENSES
  {
    id: '5001',
    code: '5001',
    name: 'Teaching Staff Salaries',
    type: 'EXPENSE',
    subType: 'OPERATING_EXPENSE',
    normalBalance: 'DEBIT',
    currentBalance: 1850000,
    isActive: true,
    description: 'Academic staff salaries and benefits',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '5002',
    code: '5002',
    name: 'Administrative Salaries',
    type: 'EXPENSE',
    subType: 'ADMINISTRATIVE_EXPENSE',
    normalBalance: 'DEBIT',
    currentBalance: 1200000,
    isActive: true,
    description: 'Administrative and support staff salaries',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '5100',
    code: '5100',
    name: 'Food & Beverage Costs',
    type: 'EXPENSE',
    subType: 'COST_OF_GOODS_SOLD',
    normalBalance: 'DEBIT',
    currentBalance: 950000,
    isActive: true,
    description: 'Restaurant ingredient and supply costs',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '5200',
    code: '5200',
    name: 'Utilities Expense',
    type: 'EXPENSE',
    subType: 'OPERATING_EXPENSE',
    normalBalance: 'DEBIT',
    currentBalance: 380000,
    isActive: true,
    description: 'Electricity, gas, water, internet',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '5300',
    code: '5300',
    name: 'Maintenance & Repairs',
    type: 'EXPENSE',
    subType: 'OPERATING_EXPENSE',
    normalBalance: 'DEBIT',
    currentBalance: 280000,
    isActive: true,
    description: 'Building and equipment maintenance',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
];

// Sample Customers
export const customers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Ahmed Wedding Services',
    email: 'ahmed@weddingservices.pk',
    phone: '+92-300-1234567',
    address: 'Block-A, Gulshan-e-Iqbal, Karachi',
    accountsReceivableBalance: 450000,
    creditLimit: 500000,
    paymentTerms: 'NET 15',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'cust-2',
    name: 'Karachi Catering Co.',
    email: 'orders@kcatering.pk',
    phone: '+92-321-9876543',
    address: 'Defence Housing Authority, Karachi',
    accountsReceivableBalance: 180000,
    creditLimit: 300000,
    paymentTerms: 'NET 30',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'cust-3',
    name: 'Corporate Events Ltd',
    email: 'bookings@corporateevents.pk',
    phone: '+92-333-5555555',
    address: 'Clifton, Karachi',
    accountsReceivableBalance: 220000,
    creditLimit: 400000,
    paymentTerms: 'NET 45',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20')
  }
];

// Real Vendors from Current Jamia Binoria System
export const vendors: Vendor[] = [
  // Paint & Construction Vendors
  {
    id: 'vend-1',
    name: 'NELSON PAINT',
    email: 'danish@nelsonpaint.pk',
    phone: '+92-300-2641260',
    address: 'Karachi',
    accountsPayableBalance: 0,
    paymentTerms: '60 DAYS',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'vend-2',
    name: 'AGEEL PAINTS',
    email: 'ageel@ageelpaints.pk',
    phone: '+92-300-8110468',
    address: 'Karachi',
    accountsPayableBalance: 0,
    paymentTerms: '60 DAYS',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'vend-3',
    name: 'BERGER PAINTS',
    email: 'ashir@bergerpaints.pk',
    phone: '+92-346-1225050',
    address: 'Karachi',
    accountsPayableBalance: 0,
    paymentTerms: '60 DAYS',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'vend-4',
    name: 'GHULAM AND SONS',
    email: 'info@ghulamcons.pk',
    phone: '+92-321-2982948',
    address: 'Karachi',
    accountsPayableBalance: 0,
    paymentTerms: '60 DAYS',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  // Food & Catering Vendors
  {
    id: 'vend-5',
    name: 'M IMRAN AND BRO',
    email: 'imran@imranfood.pk',
    phone: '+92-320-0003872',
    address: 'Karachi',
    accountsPayableBalance: 125000,
    paymentTerms: '45 DAYS',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'vend-6',
    name: 'SOBAT KHAN',
    email: 'sobat@sobatkhan.pk',
    phone: '+92-349-9702647',
    address: 'Karachi',
    accountsPayableBalance: 0,
    paymentTerms: 'ADVANCE',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  // Equipment & Electronics
  {
    id: 'vend-7',
    name: 'NOMAN BROTHERS',
    email: 'noman@nomanbrothers.pk',
    phone: '+92-331-2539801',
    address: 'Karachi',
    accountsPayableBalance: 45000,
    paymentTerms: '90 DAYS',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'vend-8',
    name: 'FAZAL HAKEEM',
    email: 'hassan@fazalhakeem.pk',
    phone: '+92-317-2797553',
    address: 'Karachi',
    accountsPayableBalance: 0,
    paymentTerms: '90 DAYS',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'vend-9',
    name: 'HH ENTERPRISES',
    email: 'shareef@hhenterprises.pk',
    phone: '+92-345-6586976',
    address: 'Karachi',
    accountsPayableBalance: 0,
    paymentTerms: '45 DAYS',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  // Computer & IT Vendors
  {
    id: 'vend-10',
    name: 'LEO COMPUTERS',
    email: 'hussain@leopc.pk',
    phone: '+92-323-2892598',
    address: 'Karachi',
    accountsPayableBalance: 0,
    paymentTerms: '45 DAYS',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'vend-11',
    name: 'QUICK TECHNOLOGIES',
    email: 'saad@quicktech.pk',
    phone: '+92-313-1393445',
    address: 'Karachi',
    accountsPayableBalance: 0,
    paymentTerms: '45 DAYS',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  // Sanitary & Hygiene Vendors
  {
    id: 'vend-12',
    name: 'N S CHEMICAL',
    email: 'shareef@nschemical.pk',
    phone: '+92-334-2588833',
    address: 'Karachi',
    accountsPayableBalance: 0,
    paymentTerms: '45 DAYS',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'vend-13',
    name: 'POOL TECH',
    email: 'umar@pooltech.pk',
    phone: '+92-313-9304119',
    address: 'Karachi',
    accountsPayableBalance: 0,
    paymentTerms: '90 DAYS',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  // Restaurant Supplies
  {
    id: 'vend-14',
    name: 'SAYED STEEL',
    email: 'qamar@sayedsteel.pk',
    phone: '+92-313-3246168',
    address: 'Karachi',
    accountsPayableBalance: 0,
    paymentTerms: '45 DAYS',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'vend-15',
    name: 'KAMRAN TRADER',
    email: 'kamran@kamrantrader.pk',
    phone: '+92-335-1227186',
    address: 'Karachi',
    accountsPayableBalance: 0,
    paymentTerms: 'ADVANCE',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  // Utilities
  {
    id: 'vend-16',
    name: 'K-Electric',
    email: 'billing@ke.com.pk',
    phone: '+92-111-111-111',
    address: 'KE House, Karachi',
    accountsPayableBalance: 95000,
    paymentTerms: 'Due on Receipt',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  // Media & Equipment
  {
    id: 'vend-17',
    name: 'AZAD MEDIA',
    email: 'azad@azadmedia.pk',
    phone: '+92-300-2755459',
    address: 'Karachi',
    accountsPayableBalance: 0,
    paymentTerms: '60 DAYS',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  // Furniture & Wood
  {
    id: 'vend-18',
    name: 'KAMRAN WOOD',
    email: 'kamran@kamranwood.pk',
    phone: '+92-335-1227186',
    address: 'Karachi',
    accountsPayableBalance: 0,
    paymentTerms: '60 DAYS',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  }
];

// Sample Bank Accounts
export const bankAccounts: BankAccount[] = [
  {
    id: 'bank-1',
    name: 'HBL Current Account',
    accountNumber: '12345678901234',
    bankName: 'Habib Bank Limited',
    accountType: 'CURRENT',
    currentBalance: 2850000,
    isActive: true,
    accountId: '1002',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'bank-2',
    name: 'MCB Savings Account',
    accountNumber: '98765432109876',
    bankName: 'Muslim Commercial Bank',
    accountType: 'SAVINGS',
    currentBalance: 1250000,
    isActive: true,
    accountId: '1003',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  }
];

// Sample Journal Entries with proper double-entry bookkeeping
export const journalEntries: JournalEntry[] = [
  {
    id: 'je-001',
    entryNumber: 'JE-2024-001',
    date: new Date('2024-01-15'),
    type: 'GENERAL',
    reference: 'INV-001',
    description: 'Wedding event service invoice to Ahmed Wedding Services',
    totalDebit: 450000,
    totalCredit: 450000,
    status: 'COMPLETED',
    createdBy: 'admin',
    lineItems: [
      {
        id: 'jli-001-1',
        journalEntryId: 'je-001',
        accountId: '1100', // Accounts Receivable
        account: chartOfAccounts.find(a => a.id === '1100')!,
        description: 'Wedding service invoice',
        debitAmount: 450000,
        creditAmount: 0,
        lineNumber: 1
      },
      {
        id: 'jli-001-2',
        journalEntryId: 'je-001',
        accountId: '4003', // Event Hall Revenue
        account: chartOfAccounts.find(a => a.id === '4003')!,
        description: 'Wedding service revenue',
        debitAmount: 0,
        creditAmount: 450000,
        lineNumber: 2
      }
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'je-002',
    entryNumber: 'JE-2024-002',
    date: new Date('2024-01-16'),
    type: 'GENERAL',
    reference: 'BILL-001',
    description: 'Food supplies purchase from Al-Khair Food Suppliers',
    totalDebit: 280000,
    totalCredit: 280000,
    status: 'COMPLETED',
    createdBy: 'admin',
    lineItems: [
      {
        id: 'jli-002-1',
        journalEntryId: 'je-002',
        accountId: '5100', // Food & Beverage Costs
        account: chartOfAccounts.find(a => a.id === '5100')!,
        description: 'Food supplies purchase',
        debitAmount: 280000,
        creditAmount: 0,
        lineNumber: 1
      },
      {
        id: 'jli-002-2',
        journalEntryId: 'je-002',
        accountId: '2001', // Accounts Payable
        account: chartOfAccounts.find(a => a.id === '2001')!,
        description: 'Credit purchase from Al-Khair',
        debitAmount: 0,
        creditAmount: 280000,
        lineNumber: 2
      }
    ],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: 'je-003',
    entryNumber: 'JE-2024-003',
    date: new Date('2024-01-18'),
    type: 'GENERAL',
    reference: 'PAY-001',
    description: 'Payment received from Ahmed Wedding Services',
    totalDebit: 300000,
    totalCredit: 300000,
    status: 'COMPLETED',
    createdBy: 'admin',
    lineItems: [
      {
        id: 'jli-003-1',
        journalEntryId: 'je-003',
        accountId: '1002', // Bank Account - HBL
        account: chartOfAccounts.find(a => a.id === '1002')!,
        description: 'Bank transfer received',
        debitAmount: 300000,
        creditAmount: 0,
        lineNumber: 1
      },
      {
        id: 'jli-003-2',
        journalEntryId: 'je-003',
        accountId: '1100', // Accounts Receivable
        account: chartOfAccounts.find(a => a.id === '1100')!,
        description: 'Payment on account',
        debitAmount: 0,
        creditAmount: 300000,
        lineNumber: 2
      }
    ],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'je-004',
    entryNumber: 'JE-2024-004',
    date: new Date('2024-01-20'),
    type: 'GENERAL',
    reference: 'SAL-001',
    description: 'Monthly salary payment to teaching staff',
    totalDebit: 950000,
    totalCredit: 950000,
    status: 'COMPLETED',
    createdBy: 'admin',
    lineItems: [
      {
        id: 'jli-004-1',
        journalEntryId: 'je-004',
        accountId: '5001', // Teaching Staff Salaries
        account: chartOfAccounts.find(a => a.id === '5001')!,
        description: 'Teaching staff salaries - January',
        debitAmount: 950000,
        creditAmount: 0,
        lineNumber: 1
      },
      {
        id: 'jli-004-2',
        journalEntryId: 'je-004',
        accountId: '1002', // Bank Account - HBL
        account: chartOfAccounts.find(a => a.id === '1002')!,
        description: 'Salary payment via bank transfer',
        debitAmount: 0,
        creditAmount: 950000,
        lineNumber: 2
      }
    ],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
];

// Sample Transactions
export const transactions: Transaction[] = [
  {
    id: 'txn-001',
    transactionNumber: 'TXN-001',
    date: new Date('2024-01-18'),
    description: 'Payment received from Ahmed Wedding Services',
    amount: 300000,
    paymentMethod: 'BANK_TRANSFER',
    reference: 'TT-123456',
    status: 'COMPLETED',
    customerId: 'cust-1',
    journalEntryId: 'je-003',
    createdBy: 'admin',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'txn-002',
    transactionNumber: 'TXN-002',
    date: new Date('2024-01-20'),
    description: 'Teaching staff salary payments',
    amount: 950000,
    paymentMethod: 'BANK_TRANSFER',
    reference: 'BULK-PAY-001',
    status: 'COMPLETED',
    journalEntryId: 'je-004',
    createdBy: 'admin',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'txn-003',
    transactionNumber: 'TXN-003',
    date: new Date('2024-01-19'),
    description: 'Cash sale - Restaurant',
    amount: 85000,
    paymentMethod: 'CASH',
    reference: 'CASH-001',
    status: 'COMPLETED',
    createdBy: 'cashier',
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19')
  }
];

// Calculate Trial Balance
export const calculateTrialBalance = (accounts: Account[]): TrialBalance[] => {
  return accounts.map(account => {
    const balance = account.currentBalance;
    return {
      accountId: account.id,
      accountCode: account.code,
      accountName: account.name,
      accountType: account.type,
      debitBalance: account.normalBalance === 'DEBIT' && balance > 0 ? balance : 0,
      creditBalance: account.normalBalance === 'CREDIT' && balance > 0 ? balance : 0
    };
  });
};

export const trialBalance = calculateTrialBalance(chartOfAccounts);

// Accounting Metrics
export const accountingMetrics: AccountingMetrics = {
  totalAssets: chartOfAccounts
    .filter(acc => acc.type === 'ASSET')
    .reduce((sum, acc) => sum + acc.currentBalance, 0),
  
  totalLiabilities: chartOfAccounts
    .filter(acc => acc.type === 'LIABILITY')
    .reduce((sum, acc) => sum + acc.currentBalance, 0),
  
  totalEquity: chartOfAccounts
    .filter(acc => acc.type === 'EQUITY')
    .reduce((sum, acc) => sum + acc.currentBalance, 0),
  
  totalRevenue: chartOfAccounts
    .filter(acc => acc.type === 'REVENUE')
    .reduce((sum, acc) => sum + acc.currentBalance, 0),
  
  totalExpenses: chartOfAccounts
    .filter(acc => acc.type === 'EXPENSE')
    .reduce((sum, acc) => sum + acc.currentBalance, 0),
  
  netIncome: chartOfAccounts
    .filter(acc => acc.type === 'REVENUE')
    .reduce((sum, acc) => sum + acc.currentBalance, 0) - 
    chartOfAccounts
    .filter(acc => acc.type === 'EXPENSE')
    .reduce((sum, acc) => sum + acc.currentBalance, 0),
  
  accountsReceivable: chartOfAccounts.find(acc => acc.code === '1100')?.currentBalance || 0,
  accountsPayable: chartOfAccounts.find(acc => acc.code === '2001')?.currentBalance || 0,
  cashOnHand: chartOfAccounts.find(acc => acc.code === '1001')?.currentBalance || 0,
  
  outstandingInvoices: 3,
  overdueInvoices: 1,
  unpaidBills: 2,
  overdueBills: 0
};

// Payment Methods for Islamic Finance Compliance
export const paymentMethods: { method: PaymentMethod; label: string; description: string; isHalal: boolean }[] = [
  {
    method: 'CASH',
    label: 'Cash Payment',
    description: 'Physical currency transaction',
    isHalal: true
  },
  {
    method: 'BANK_TRANSFER',
    label: 'Bank Transfer',
    description: 'Electronic fund transfer between accounts',
    isHalal: true
  },
  {
    method: 'DEBIT_CARD',
    label: 'Debit Card',
    description: 'Direct bank account debit',
    isHalal: true
  },
  {
    method: 'CHEQUE',
    label: 'Cheque',
    description: 'Written payment order',
    isHalal: true
  },
  {
    method: 'ONLINE_PAYMENT',
    label: 'Online Payment',
    description: 'Digital payment platforms (JazzCash, EasyPaisa)',
    isHalal: true
  },
  {
    method: 'CREDIT_PURCHASE',
    label: 'Credit Purchase',
    description: 'Buy now, pay later (Islamic finance compliant)',
    isHalal: true
  },
  {
    method: 'CREDIT_CARD',
    label: 'Credit Card',
    description: 'Interest-based credit (use with caution)',
    isHalal: false
  }
];