export type AccountType = 
  | 'ASSET' 
  | 'LIABILITY' 
  | 'EQUITY' 
  | 'REVENUE' 
  | 'EXPENSE';

export type AccountSubType = 
  // Assets
  | 'CURRENT_ASSET' 
  | 'FIXED_ASSET' 
  | 'INTANGIBLE_ASSET'
  // Liabilities
  | 'CURRENT_LIABILITY' 
  | 'LONG_TERM_LIABILITY'
  // Equity
  | 'OWNER_EQUITY' 
  | 'RETAINED_EARNINGS'
  // Revenue
  | 'OPERATING_REVENUE' 
  | 'NON_OPERATING_REVENUE'
  // Expenses
  | 'OPERATING_EXPENSE' 
  | 'ADMINISTRATIVE_EXPENSE' 
  | 'COST_OF_GOODS_SOLD';

export type PaymentMethod = 
  | 'CASH' 
  | 'BANK_TRANSFER' 
  | 'CREDIT_CARD' 
  | 'DEBIT_CARD' 
  | 'CHEQUE' 
  | 'ONLINE_PAYMENT'
  | 'CREDIT_PURCHASE';

export type TransactionStatus = 
  | 'PENDING' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'RECONCILED';

export type JournalEntryType = 
  | 'GENERAL' 
  | 'ADJUSTING' 
  | 'CLOSING' 
  | 'REVERSING';

export interface Account {
  id: string;
  code: string; // Account number (e.g., "1001", "2001")
  name: string;
  type: AccountType;
  subType: AccountSubType;
  parentId?: string; // For sub-accounts
  normalBalance: 'DEBIT' | 'CREDIT'; // Normal side for increases
  currentBalance: number;
  isActive: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalEntry {
  id: string;
  entryNumber: string; // Sequential journal entry number
  date: Date;
  type: JournalEntryType;
  reference?: string; // Invoice number, receipt number, etc.
  description: string;
  totalDebit: number;
  totalCredit: number;
  status: TransactionStatus;
  createdBy: string;
  approvedBy?: string;
  lineItems: JournalLineItem[];
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalLineItem {
  id: string;
  journalEntryId: string;
  accountId: string;
  account: Account;
  description?: string;
  debitAmount: number;
  creditAmount: number;
  lineNumber: number; // Order within the journal entry
}

export interface Transaction {
  id: string;
  transactionNumber: string;
  date: Date;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  reference?: string; // Invoice #, Receipt #, etc.
  status: TransactionStatus;
  customerId?: string;
  vendorId?: string;
  journalEntryId?: string; // Link to the journal entry
  metadata?: Record<string, any>;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  accountsReceivableBalance: number;
  creditLimit?: number;
  paymentTerms: string; // e.g., "NET 30", "COD"
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface Vendor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  accountsPayableBalance: number;
  paymentTerms: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer: Customer;
  date: Date;
  dueDate: Date;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  lineItems: InvoiceLineItem[];
  payments: Payment[];
  journalEntryId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  accountId?: string; // Revenue account
}

export interface Bill {
  id: string;
  billNumber: string;
  vendorId: string;
  vendor: Vendor;
  date: Date;
  dueDate: Date;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: 'RECEIVED' | 'APPROVED' | 'PAID' | 'OVERDUE';
  lineItems: BillLineItem[];
  payments: Payment[];
  journalEntryId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillLineItem {
  id: string;
  billId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  accountId?: string; // Expense account
}

export interface Payment {
  id: string;
  paymentNumber: string;
  date: Date;
  amount: number;
  paymentMethod: PaymentMethod;
  reference?: string;
  customerId?: string;
  vendorId?: string;
  invoiceId?: string;
  billId?: string;
  bankAccountId?: string;
  status: TransactionStatus;
  journalEntryId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  accountType: 'CHECKING' | 'SAVINGS' | 'CURRENT';
  currentBalance: number;
  isActive: boolean;
  accountId: string; // Link to Chart of Accounts
  createdAt: Date;
  updatedAt: Date;
}

export interface BankTransaction {
  id: string;
  bankAccountId: string;
  date: Date;
  description: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  balance: number;
  reference?: string;
  isReconciled: boolean;
  reconciledDate?: Date;
  journalEntryId?: string;
  createdAt: Date;
}

// Financial Statements
export interface TrialBalance {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  debitBalance: number;
  creditBalance: number;
}

export interface BalanceSheetItem {
  accountId: string;
  accountCode: string;
  accountName: string;
  amount: number;
  parentId?: string;
  level: number;
}

export interface BalanceSheet {
  asOf: Date;
  assets: {
    currentAssets: BalanceSheetItem[];
    fixedAssets: BalanceSheetItem[];
    totalAssets: number;
  };
  liabilities: {
    currentLiabilities: BalanceSheetItem[];
    longTermLiabilities: BalanceSheetItem[];
    totalLiabilities: number;
  };
  equity: {
    ownerEquity: BalanceSheetItem[];
    totalEquity: number;
  };
}

export interface IncomeStatementItem {
  accountId: string;
  accountCode: string;
  accountName: string;
  amount: number;
  parentId?: string;
  level: number;
}

export interface IncomeStatement {
  periodStart: Date;
  periodEnd: Date;
  revenue: {
    operatingRevenue: IncomeStatementItem[];
    nonOperatingRevenue: IncomeStatementItem[];
    totalRevenue: number;
  };
  expenses: {
    costOfGoodsSold: IncomeStatementItem[];
    operatingExpenses: IncomeStatementItem[];
    administrativeExpenses: IncomeStatementItem[];
    totalExpenses: number;
  };
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
}

export interface CashFlowStatement {
  periodStart: Date;
  periodEnd: Date;
  operatingActivities: {
    netIncome: number;
    adjustments: CashFlowItem[];
    netCashFromOperating: number;
  };
  investingActivities: {
    activities: CashFlowItem[];
    netCashFromInvesting: number;
  };
  financingActivities: {
    activities: CashFlowItem[];
    netCashFromFinancing: number;
  };
  netCashFlow: number;
  beginningCash: number;
  endingCash: number;
}

export interface CashFlowItem {
  description: string;
  amount: number;
}

export interface AccountingMetrics {
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  accountsReceivable: number;
  accountsPayable: number;
  cashOnHand: number;
  outstandingInvoices: number;
  overdueInvoices: number;
  unpaidBills: number;
  overdueBills: number;
}

// Validation interfaces
export interface JournalEntryValidation {
  isBalanced: boolean;
  debitTotal: number;
  creditTotal: number;
  difference: number;
  errors: string[];
}

export interface AccountBalance {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  normalBalance: 'DEBIT' | 'CREDIT';
  debitBalance: number;
  creditBalance: number;
  netBalance: number;
  isNormalBalance: boolean;
}