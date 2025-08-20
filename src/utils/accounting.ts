import { JournalEntry, JournalEntryValidation, Account, AccountBalance } from '@/types/accounting';

/**
 * Validates that a journal entry follows double-entry bookkeeping principles
 * Total debits must equal total credits
 */
export function validateJournalEntry(entry: JournalEntry): JournalEntryValidation {
  const debitTotal = entry.lineItems.reduce((sum, item) => sum + item.debitAmount, 0);
  const creditTotal = entry.lineItems.reduce((sum, item) => sum + item.creditAmount, 0);
  const difference = Math.abs(debitTotal - creditTotal);
  const isBalanced = difference < 0.01; // Allow for minor rounding errors
  
  const errors: string[] = [];
  
  if (!isBalanced) {
    errors.push(`Journal entry is not balanced. Difference: ₨${difference.toLocaleString()}`);
  }
  
  if (entry.lineItems.length < 2) {
    errors.push('Journal entry must have at least 2 line items');
  }
  
  const hasDebit = entry.lineItems.some(item => item.debitAmount > 0);
  const hasCredit = entry.lineItems.some(item => item.creditAmount > 0);
  
  if (!hasDebit) {
    errors.push('Journal entry must have at least one debit');
  }
  
  if (!hasCredit) {
    errors.push('Journal entry must have at least one credit');
  }
  
  // Check for line items with both debit and credit amounts
  const invalidLineItems = entry.lineItems.filter(item => 
    item.debitAmount > 0 && item.creditAmount > 0
  );
  
  if (invalidLineItems.length > 0) {
    errors.push('Line items cannot have both debit and credit amounts');
  }
  
  return {
    isBalanced,
    debitTotal,
    creditTotal,
    difference,
    errors
  };
}

/**
 * Calculates the account balance considering normal balance side
 * Assets and Expenses normally have debit balances
 * Liabilities, Equity, and Revenue normally have credit balances
 */
export function calculateAccountBalance(
  account: Account, 
  transactions: { debitAmount: number; creditAmount: number }[]
): AccountBalance {
  const totalDebits = transactions.reduce((sum, txn) => sum + txn.debitAmount, 0);
  const totalCredits = transactions.reduce((sum, txn) => sum + txn.creditAmount, 0);
  
  const netBalance = totalDebits - totalCredits;
  const debitBalance = Math.max(0, netBalance);
  const creditBalance = Math.max(0, -netBalance);
  
  // Determine if the balance is on the normal side
  const isNormalBalance = account.normalBalance === 'DEBIT' 
    ? netBalance >= 0 
    : netBalance <= 0;
  
  return {
    accountId: account.id,
    accountCode: account.code,
    accountName: account.name,
    accountType: account.type,
    normalBalance: account.normalBalance,
    debitBalance,
    creditBalance,
    netBalance: Math.abs(netBalance),
    isNormalBalance
  };
}

/**
 * Formats currency in PKR with proper locale
 */
export function formatPKR(amount: number): string {
  if (amount === 0) return '₨0';
  
  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);
  
  // Format with Pakistani number system (lakh, crore)
  if (absoluteAmount >= 10000000) { // 1 crore
    const crores = absoluteAmount / 10000000;
    return `${isNegative ? '-' : ''}₨${crores.toFixed(2)} Cr`;
  } else if (absoluteAmount >= 100000) { // 1 lakh
    const lakhs = absoluteAmount / 100000;
    return `${isNegative ? '-' : ''}₨${lakhs.toFixed(2)} L`;
  } else if (absoluteAmount >= 1000) { // 1 thousand
    const thousands = absoluteAmount / 1000;
    return `${isNegative ? '-' : ''}₨${thousands.toFixed(0)}K`;
  }
  
  return `${isNegative ? '-' : ''}₨${absoluteAmount.toLocaleString('en-PK')}`;
}

/**
 * Gets the appropriate account type color for UI display
 */
export function getAccountTypeColor(accountType: string): string {
  switch (accountType) {
    case 'ASSET':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'LIABILITY':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'EQUITY':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'REVENUE':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'EXPENSE':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Validates account codes follow standard numbering
 * 1000-1999: Assets
 * 2000-2999: Liabilities  
 * 3000-3999: Equity
 * 4000-4999: Revenue
 * 5000-5999: Expenses
 */
export function validateAccountCode(code: string, accountType: string): boolean {
  const numericCode = parseInt(code);
  
  switch (accountType) {
    case 'ASSET':
      return numericCode >= 1000 && numericCode <= 1999;
    case 'LIABILITY':
      return numericCode >= 2000 && numericCode <= 2999;
    case 'EQUITY':
      return numericCode >= 3000 && numericCode <= 3999;
    case 'REVENUE':
      return numericCode >= 4000 && numericCode <= 4999;
    case 'EXPENSE':
      return numericCode >= 5000 && numericCode <= 5999;
    default:
      return false;
  }
}

/**
 * Generates the next available account code for a given type
 */
export function generateAccountCode(accountType: string, existingCodes: string[]): string {
  let baseCode: number;
  
  switch (accountType) {
    case 'ASSET':
      baseCode = 1001;
      break;
    case 'LIABILITY':
      baseCode = 2001;
      break;
    case 'EQUITY':
      baseCode = 3001;
      break;
    case 'REVENUE':
      baseCode = 4001;
      break;
    case 'EXPENSE':
      baseCode = 5001;
      break;
    default:
      baseCode = 9001;
  }
  
  const existingNumbers = existingCodes
    .map(code => parseInt(code))
    .filter(num => !isNaN(num))
    .sort((a, b) => a - b);
  
  let nextCode = baseCode;
  while (existingNumbers.includes(nextCode)) {
    nextCode++;
  }
  
  return nextCode.toString();
}

/**
 * Creates a balanced journal entry template
 */
export function createJournalEntryTemplate(
  date: Date,
  description: string,
  reference?: string
): Partial<JournalEntry> {
  return {
    date,
    type: 'GENERAL',
    reference,
    description,
    totalDebit: 0,
    totalCredit: 0,
    status: 'PENDING',
    lineItems: []
  };
}

/**
 * Validates payment method compliance with Islamic finance
 */
export function validateIslamicFinanceCompliance(paymentMethod: string): {
  isCompliant: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  let isCompliant = true;
  
  if (paymentMethod === 'CREDIT_CARD') {
    isCompliant = false;
    warnings.push('Credit cards may involve interest (riba) which is prohibited in Islamic finance');
  }
  
  // Add other Islamic finance validation rules as needed
  
  return { isCompliant, warnings };
}

/**
 * Calculates financial ratios for analysis
 */
export function calculateFinancialRatios(
  totalAssets: number,
  currentAssets: number,
  totalLiabilities: number,
  currentLiabilities: number,
  revenue: number,
  netIncome: number
) {
  return {
    currentRatio: currentLiabilities > 0 ? currentAssets / currentLiabilities : 0,
    debtToAssetRatio: totalAssets > 0 ? totalLiabilities / totalAssets : 0,
    profitMargin: revenue > 0 ? (netIncome / revenue) * 100 : 0,
    returnOnAssets: totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0,
    assetTurnover: totalAssets > 0 ? revenue / totalAssets : 0
  };
}