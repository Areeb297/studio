
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip, ReferenceLine, Cell } from "recharts";
import { 
  Banknote, 
  ArrowDownRight, 
  ArrowUpRight, 
  TrendingUp, 
  DollarSign, 
  Scale, 
  Activity,
  PlusCircle,
  FileText,
  CreditCard,
  Building2,
  Users,
  AlertCircle,
  CheckCircle,
  Eye
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { HRKPICard } from "@/components/hr/hr-kpi-card";
import { 
  accountingMetrics, 
  chartOfAccounts, 
  trialBalance,
  journalEntries,
  transactions,
  customers,
  vendors,
  bankAccounts
} from "@/lib/accounting-data";
import { formatPKR, getAccountTypeColor } from "@/utils/accounting";
import Link from "next/link";
import { format } from "date-fns";

const pnlData = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
];

const balanceSheetData = {
  assets: {
    current: [
      { item: 'Cash and Bank', amount: 150000 },
      { item: 'Accounts Receivable', amount: 75000 },
      { item: 'Inventory', amount: 120000 },
    ],
    nonCurrent: [
      { item: 'Property & Equipment', amount: 500000 },
    ]
  },
  liabilities: {
    current: [
      { item: 'Accounts Payable', amount: 45000 },
      { item: 'Short-term Loans', amount: 100000 },
    ],
    nonCurrent: [
       { item: 'Long-term Debt', amount: 200000 },
    ]
  },
  equity: [
    { item: "Owner's Capital", amount: 500000 },
  ]
};

const calculateTotal = (items: {item: string, amount: number}[]) => items.reduce((acc, item) => acc + item.amount, 0);

const totalAssets = calculateTotal(balanceSheetData.assets.current) + calculateTotal(balanceSheetData.assets.nonCurrent);
const totalLiabilities = calculateTotal(balanceSheetData.liabilities.current) + calculateTotal(balanceSheetData.liabilities.nonCurrent);
const totalEquity = calculateTotal(balanceSheetData.equity);
const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;


const trialBalanceData = [
    { account: 'Cash', debit: 150000, credit: 0 },
    { account: 'Accounts Receivable', debit: 75000, credit: 0 },
    { account: 'Inventory', debit: 120000, credit: 0 },
    { account: 'Equipment', debit: 500000, credit: 0 },
    { account: 'Accounts Payable', debit: 0, credit: 45000 },
    { account: 'Loans Payable', debit: 0, credit: 300000 },
    { account: "Owner's Capital", debit: 0, credit: 500000 },
];

const totalDebits = trialBalanceData.reduce((acc, item) => acc + item.debit, 0);
const totalCredits = trialBalanceData.reduce((acc, item) => acc + item.credit, 0);

// Cashflow data - positive values for inflows, negative for outflows
const cashflowData = [
  { month: 'Jan', cashflow: 125000, type: 'inflow' },
  { month: 'Feb', cashflow: 95000, type: 'inflow' },
  { month: 'Mar', cashflow: -45000, type: 'outflow' },
  { month: 'Apr', cashflow: 167000, type: 'inflow' },
  { month: 'May', cashflow: 85000, type: 'inflow' },
  { month: 'Jun', cashflow: -78000, type: 'outflow' },
  { month: 'Jul', cashflow: 145000, type: 'inflow' },
  { month: 'Aug', cashflow: 112000, type: 'inflow' },
  { month: 'Sep', cashflow: -23000, type: 'outflow' },
  { month: 'Oct', cashflow: 189000, type: 'inflow' },
  { month: 'Nov', cashflow: -67000, type: 'outflow' },
  { month: 'Dec', cashflow: 203000, type: 'inflow' },
];

const chartConfig = {
  cashflow: {
    label: "Cash Flow",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

// Calculate cashflow metrics
const totalInflows = cashflowData.filter(d => d.cashflow > 0).reduce((sum, d) => sum + d.cashflow, 0);
const totalOutflows = Math.abs(cashflowData.filter(d => d.cashflow < 0).reduce((sum, d) => sum + d.cashflow, 0));
const netCashflow = totalInflows - totalOutflows;

export default function FinancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("current-month");
  
  // Account Balance Summary by Type
  const accountTypeSummary = [
    {
      type: 'ASSET',
      name: 'Total Assets',
      amount: accountingMetrics.totalAssets,
      color: '#10b981',
      accounts: chartOfAccounts.filter(acc => acc.type === 'ASSET').length
    },
    {
      type: 'LIABILITY',
      name: 'Total Liabilities',
      amount: accountingMetrics.totalLiabilities,
      color: '#ef4444',
      accounts: chartOfAccounts.filter(acc => acc.type === 'LIABILITY').length
    },
    {
      type: 'EQUITY',
      name: 'Total Equity',
      amount: accountingMetrics.totalEquity,
      color: '#3b82f6',
      accounts: chartOfAccounts.filter(acc => acc.type === 'EQUITY').length
    },
    {
      type: 'REVENUE',
      name: 'Total Revenue',
      amount: accountingMetrics.totalRevenue,
      color: '#8b5cf6',
      accounts: chartOfAccounts.filter(acc => acc.type === 'REVENUE').length
    },
    {
      type: 'EXPENSE',
      name: 'Total Expenses',
      amount: accountingMetrics.totalExpenses,
      color: '#f59e0b',
      accounts: chartOfAccounts.filter(acc => acc.type === 'EXPENSE').length
    }
  ];

  const recentJournalEntries = journalEntries.slice(0, 5);
  const recentTransactions = transactions.slice(0, 5);

  // Financial Health Indicators
  const workingCapital = accountingMetrics.totalAssets - accountingMetrics.totalLiabilities;
  const debtToEquityRatio = accountingMetrics.totalEquity > 0 
    ? (accountingMetrics.totalLiabilities / accountingMetrics.totalEquity) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">General Ledger</h1>
          <p className="text-muted-foreground">
            Comprehensive financial overview and account management
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="current-quarter">Current Quarter</SelectItem>
              <SelectItem value="current-year">Current Year</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/dashboard/finance/journal-entries">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Entry
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Financial KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <HRKPICard
          title="Net Income"
          value={formatPKR(accountingMetrics.netIncome)}
          subtitle="This period"
          icon={TrendingUp}
          trend={{
            value: 12.5,
            isPositive: true,
            label: "vs last month"
          }}
          iconColor="text-green-600"
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
        />
        <HRKPICard
          title="Total Assets"
          value={formatPKR(accountingMetrics.totalAssets)}
          subtitle="Current book value"
          icon={Building2}
          trend={{
            value: 5.8,
            isPositive: true,
            label: "vs last month"
          }}
          iconColor="text-blue-600"
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
        />
        <HRKPICard
          title="Cash Flow"
          value={formatPKR(accountingMetrics.cashOnHand)}
          subtitle="Available cash"
          icon={DollarSign}
          trend={{
            value: 3.2,
            isPositive: false,
            label: "vs last month"
          }}
          iconColor="text-purple-600"
          className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
        />
        <HRKPICard
          title="Working Capital"
          value={formatPKR(workingCapital)}
          subtitle="Current assets - liabilities"
          icon={Banknote}
          iconColor="text-orange-600"
          className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
        />
      </div>

      {/* Outstanding Items */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <HRKPICard
          title="Accounts Receivable"
          value={formatPKR(accountingMetrics.accountsReceivable)}
          subtitle={`${accountingMetrics.outstandingInvoices} outstanding invoices`}
          icon={TrendingUp}
          trend={{
            value: 8.5,
            isPositive: false,
            label: "collection period"
          }}
          iconColor="text-green-600"
        />
        <HRKPICard
          title="Accounts Payable"
          value={formatPKR(accountingMetrics.accountsPayable)}
          subtitle={`${accountingMetrics.unpaidBills} unpaid bills`}
          icon={TrendingUp}
          trend={{
            value: 15.2,
            isPositive: true,
            label: "payment period"
          }}
          iconColor="text-red-600"
        />
        <HRKPICard
          title="Overdue Invoices"
          value={accountingMetrics.overdueInvoices}
          subtitle="Require follow-up"
          icon={AlertCircle}
          iconColor="text-orange-600"
        />
        <HRKPICard
          title="Bank Accounts"
          value={bankAccounts.length}
          subtitle="Active accounts"
          icon={CreditCard}
          iconColor="text-blue-600"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Type Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Account Balances by Type</CardTitle>
            <CardDescription>Overview of account categories and balances</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={accountTypeSummary} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis 
                  tickFormatter={(value) => formatPKR(value)}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  width={80}
                />
                <Tooltip 
                  formatter={(value: number) => [formatPKR(value), "Balance"]}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="amount" 
                  radius={[4, 4, 0, 0]}
                  fill="hsl(var(--primary))"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Financial Health Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Health</CardTitle>
            <CardDescription>Key financial ratios and indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Debt-to-Equity Ratio</span>
                  <span className="text-sm font-bold">
                    {debtToEquityRatio.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      debtToEquityRatio < 0.5 ? 'bg-green-500' : 
                      debtToEquityRatio < 1 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(debtToEquityRatio * 50, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {debtToEquityRatio < 0.5 ? 'Excellent' : 
                   debtToEquityRatio < 1 ? 'Good' : 'Needs attention'}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Profit Margin</span>
                  <span className="text-sm font-bold">
                    {((accountingMetrics.netIncome / accountingMetrics.totalRevenue) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-blue-500 transition-all"
                    style={{ 
                      width: `${Math.min((accountingMetrics.netIncome / accountingMetrics.totalRevenue) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="text-lg font-bold text-green-600">{customers.length}</div>
                  <div className="text-xs text-green-600">Active Customers</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="text-lg font-bold text-blue-600">{vendors.length}</div>
                  <div className="text-xs text-blue-600">Active Vendors</div>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link href="/dashboard/finance/trial-balance">
                    <FileText className="w-4 h-4 mr-2" />
                    View Trial Balance
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link href="/dashboard/finance/reports">
                    <FileText className="w-4 h-4 mr-2" />
                    Financial Reports
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Cash Flow Analysis
            </CardTitle>
            <CardDescription>Monthly cash inflows and outflows</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[300px]">
              <BarChart data={cashflowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                />
                <YAxis 
                  tickFormatter={(value) => `${value >= 0 ? '' : '-'}PKR ${Math.abs(value/1000)}k`}
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
                <Bar dataKey="cashflow" radius={[2, 2, 0, 0]}>
                  {cashflowData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.cashflow >= 0 ? "hsl(180 98% 31%)" : "hsl(160 84% 39%)"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="journal-entries" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="journal-entries">Recent Journal Entries</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
        </TabsList>

        <TabsContent value="journal-entries">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Recent Journal Entries</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/finance/journal-entries">
                    View All Entries
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentJournalEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{entry.entryNumber}</span>
                        <Badge 
                          variant={entry.status === 'COMPLETED' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {entry.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{entry.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(entry.date, 'MMM dd, yyyy')} • {entry.lineItems.length} line items
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">
                        {formatPKR(entry.totalDebit)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Dr/Cr Balance
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                <Button variant="outline" size="sm">
                  View All Transactions
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        {transaction.paymentMethod === 'CASH' ? (
                          <DollarSign className="w-4 h-4 text-primary" />
                        ) : transaction.paymentMethod === 'BANK_TRANSFER' ? (
                          <CreditCard className="w-4 h-4 text-primary" />
                        ) : (
                          <Banknote className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            {format(transaction.date, 'MMM dd, yyyy')}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.paymentMethod.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">
                        {formatPKR(transaction.amount)}
                      </div>
                      <Badge 
                        variant={transaction.status === 'COMPLETED' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trial-balance">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trial Balance</CardTitle>
              <CardDescription>Verification that total debits equal total credits</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Code</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead className="text-right">Debit Balance</TableHead>
                    <TableHead className="text-right">Credit Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trialBalance.map(item => (
                    <TableRow key={item.accountId}>
                      <TableCell className="font-mono text-xs">{item.accountCode}</TableCell>
                      <TableCell>{item.accountName}</TableCell>
                      <TableCell className="text-right">
                        {item.debitBalance > 0 ? formatPKR(item.debitBalance) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.creditBalance > 0 ? formatPKR(item.creditBalance) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="font-bold text-base">
                    <TableCell colSpan={2}>Totals</TableCell>
                    <TableCell className="text-right">
                      {formatPKR(trialBalance.reduce((sum, item) => sum + item.debitBalance, 0))}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPKR(trialBalance.reduce((sum, item) => sum + item.creditBalance, 0))}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
              <div className="mt-4 text-center">
                {trialBalance.reduce((sum, item) => sum + item.debitBalance, 0) === 
                 trialBalance.reduce((sum, item) => sum + item.creditBalance, 0) ? (
                  <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Trial Balance is Balanced
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Trial Balance is Unbalanced
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
}
