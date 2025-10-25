'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Scale,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

// Trial Balance Data
const trialBalanceData = [
  // Assets
  { account: 'Cash - HBL', accountCode: '1111', type: 'ASSET', debit: 250000, credit: 0 },
  { account: 'Bank Account - HBL', accountCode: '1112', type: 'ASSET', debit: 150000, credit: 0 },
  { account: 'Bank Account - MCB', accountCode: '1113', type: 'ASSET', debit: 95000, credit: 0 },
  { account: 'Accounts Receivable', accountCode: '1120', type: 'ASSET', debit: 175000, credit: 0 },
  { account: 'Inventory', accountCode: '1130', type: 'ASSET', debit: 120000, credit: 0 },
  { account: 'Property & Equipment', accountCode: '1210', type: 'ASSET', debit: 500000, credit: 0 },
  { account: 'Vehicles', accountCode: '1220', type: 'ASSET', debit: 200000, credit: 0 },

  // Liabilities
  { account: 'Accounts Payable', accountCode: '2110', type: 'LIABILITY', debit: 0, credit: 85000 },
  { account: 'Short-term Loans', accountCode: '2120', type: 'LIABILITY', debit: 0, credit: 60000 },
  { account: 'Long-term Debt', accountCode: '2210', type: 'LIABILITY', debit: 0, credit: 200000 },

  // Equity
  { account: "Owner's Capital", accountCode: '3100', type: 'EQUITY', debit: 0, credit: 800000 },
  { account: 'Retained Earnings', accountCode: '3200', type: 'EQUITY', debit: 0, credit: 100000 },

  // Revenue
  { account: 'Restaurant Sales', accountCode: '4110', type: 'REVENUE', debit: 0, credit: 350000 },
  { account: 'Academic Fees', accountCode: '4120', type: 'REVENUE', debit: 0, credit: 150000 },
  { account: 'Event Bookings', accountCode: '4130', type: 'REVENUE', debit: 0, credit: 50000 },
  { account: 'Donation Income', accountCode: '4210', type: 'REVENUE', debit: 0, credit: 80000 },
  { account: 'Rent Income', accountCode: '4220', type: 'REVENUE', debit: 0, credit: 20000 },

  // Expenses
  { account: 'Cost of Goods Sold', accountCode: '5110', type: 'EXPENSE', debit: 180000, credit: 0 },
  { account: 'Salaries & Wages', accountCode: '5120', type: 'EXPENSE', debit: 120000, credit: 0 },
  { account: 'Utilities', accountCode: '5130', type: 'EXPENSE', debit: 30000, credit: 0 },
  { account: 'Rent Expense', accountCode: '5140', type: 'EXPENSE', debit: 20000, credit: 0 },
  { account: 'Office Supplies', accountCode: '5210', type: 'EXPENSE', debit: 15000, credit: 0 },
  { account: 'Professional Fees', accountCode: '5220', type: 'EXPENSE', debit: 35000, credit: 0 },
  { account: 'Marketing & Advertising', accountCode: '5230', type: 'EXPENSE', debit: 20000, credit: 0 },
];

const formatPKR = (amount: number) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function TrialBalancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Calculate totals
  const totalDebits = trialBalanceData.reduce((sum, item) => sum + item.debit, 0);
  const totalCredits = trialBalanceData.reduce((sum, item) => sum + item.credit, 0);
  const isBalanced = totalDebits === totalCredits;
  const difference = Math.abs(totalDebits - totalCredits);

  // Group by type
  const assets = trialBalanceData.filter(item => item.type === 'ASSET');
  const liabilities = trialBalanceData.filter(item => item.type === 'LIABILITY');
  const equity = trialBalanceData.filter(item => item.type === 'EQUITY');
  const revenue = trialBalanceData.filter(item => item.type === 'REVENUE');
  const expenses = trialBalanceData.filter(item => item.type === 'EXPENSE');

  const totalAssetDebits = assets.reduce((sum, item) => sum + item.debit, 0);
  const totalLiabilityCredits = liabilities.reduce((sum, item) => sum + item.credit, 0);
  const totalEquityCredits = equity.reduce((sum, item) => sum + item.credit, 0);
  const totalRevenueCredits = revenue.reduce((sum, item) => sum + item.credit, 0);
  const totalExpenseDebits = expenses.reduce((sum, item) => sum + item.debit, 0);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Trial Balance</h1>
        <p className="text-muted-foreground">
          Verify account balances and ensure debits equal credits
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debits</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPKR(totalDebits)}</div>
            <p className="text-xs text-muted-foreground">All debit balances</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPKR(totalCredits)}</div>
            <p className="text-xs text-muted-foreground">All credit balances</p>
          </CardContent>
        </Card>

        <Card className={isBalanced ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance Status</CardTitle>
            {isBalanced ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isBalanced ? 'text-green-700' : 'text-red-700'}`}>
              {isBalanced ? 'Balanced' : 'Unbalanced'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isBalanced ? 'Debits = Credits ✓' : `Difference: ${formatPKR(difference)}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trialBalanceData.length}</div>
            <p className="text-xs text-muted-foreground">Active accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Period Selector */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Month</SelectItem>
              <SelectItem value="previous">Previous Month</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="custom">Custom Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards by Account Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-600">{formatPKR(totalAssetDebits)}</div>
            <p className="text-xs text-muted-foreground">{assets.length} accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600">{formatPKR(totalLiabilityCredits)}</div>
            <p className="text-xs text-muted-foreground">{liabilities.length} accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Equity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-600">{formatPKR(totalEquityCredits)}</div>
            <p className="text-xs text-muted-foreground">{equity.length} accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">{formatPKR(totalRevenueCredits)}</div>
            <p className="text-xs text-muted-foreground">{revenue.length} accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-orange-600">{formatPKR(totalExpenseDebits)}</div>
            <p className="text-xs text-muted-foreground">{expenses.length} accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Trial Balance Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Trial Balance Report</CardTitle>
              <CardDescription>
                As of {format(new Date(selectedDate), 'MMMM dd, yyyy')}
              </CardDescription>
            </div>
            {isBalanced && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Balanced
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead className="text-right w-[150px]">Debit</TableHead>
                  <TableHead className="text-right w-[150px]">Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Assets Section */}
                <TableRow className="bg-blue-50">
                  <TableCell colSpan={5} className="font-bold">ASSETS</TableCell>
                </TableRow>
                {assets.map((item) => (
                  <TableRow key={item.accountCode}>
                    <TableCell className="font-mono text-sm">{item.accountCode}</TableCell>
                    <TableCell>{item.account}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.debit > 0 ? formatPKR(item.debit) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.credit > 0 ? formatPKR(item.credit) : '-'}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Liabilities Section */}
                <TableRow className="bg-red-50">
                  <TableCell colSpan={5} className="font-bold">LIABILITIES</TableCell>
                </TableRow>
                {liabilities.map((item) => (
                  <TableRow key={item.accountCode}>
                    <TableCell className="font-mono text-sm">{item.accountCode}</TableCell>
                    <TableCell>{item.account}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.debit > 0 ? formatPKR(item.debit) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.credit > 0 ? formatPKR(item.credit) : '-'}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Equity Section */}
                <TableRow className="bg-purple-50">
                  <TableCell colSpan={5} className="font-bold">EQUITY</TableCell>
                </TableRow>
                {equity.map((item) => (
                  <TableRow key={item.accountCode}>
                    <TableCell className="font-mono text-sm">{item.accountCode}</TableCell>
                    <TableCell>{item.account}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-100 text-purple-800">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.debit > 0 ? formatPKR(item.debit) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.credit > 0 ? formatPKR(item.credit) : '-'}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Revenue Section */}
                <TableRow className="bg-green-50">
                  <TableCell colSpan={5} className="font-bold">REVENUE</TableCell>
                </TableRow>
                {revenue.map((item) => (
                  <TableRow key={item.accountCode}>
                    <TableCell className="font-mono text-sm">{item.accountCode}</TableCell>
                    <TableCell>{item.account}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.debit > 0 ? formatPKR(item.debit) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.credit > 0 ? formatPKR(item.credit) : '-'}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Expenses Section */}
                <TableRow className="bg-orange-50">
                  <TableCell colSpan={5} className="font-bold">EXPENSES</TableCell>
                </TableRow>
                {expenses.map((item) => (
                  <TableRow key={item.accountCode}>
                    <TableCell className="font-mono text-sm">{item.accountCode}</TableCell>
                    <TableCell>{item.account}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-orange-100 text-orange-800">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.debit > 0 ? formatPKR(item.debit) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.credit > 0 ? formatPKR(item.credit) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-primary/10">
                  <TableCell colSpan={3} className="font-bold text-lg">TOTAL</TableCell>
                  <TableCell className="text-right font-bold text-lg">{formatPKR(totalDebits)}</TableCell>
                  <TableCell className="text-right font-bold text-lg">{formatPKR(totalCredits)}</TableCell>
                </TableRow>
                <TableRow className={isBalanced ? "bg-green-50" : "bg-red-50"}>
                  <TableCell colSpan={3} className="font-bold">
                    {isBalanced ? 'BALANCED ✓' : 'DIFFERENCE'}
                  </TableCell>
                  <TableCell colSpan={2} className={`text-right font-bold ${isBalanced ? 'text-green-700' : 'text-red-700'}`}>
                    {isBalanced ? 'Debits = Credits' : formatPKR(difference)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
