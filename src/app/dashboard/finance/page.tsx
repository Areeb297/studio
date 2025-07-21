
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Banknote, ArrowDownRight, ArrowUpRight, TrendingUp, DollarSign, Scale } from "lucide-react";

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

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Financials ERP Layer</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">PKR 1,250,345</div>
            <p className="text-xs text-muted-foreground">+15.2% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR 4,523,189</div>
            <p className="text-xs text-muted-foreground">+20.1% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownRight className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR 3,272,844</div>
            <p className="text-xs text-muted-foreground">+22.5% vs last month</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Assets vs Liabilities</CardTitle>
            <Scale className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((totalAssets/totalLiabilities) * 100).toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Current Ratio</p>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp /> Profit &amp; Loss Breakdown</CardTitle>
          <CardDescription>Monthly revenue vs. expenses overview.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pnlData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `PKR ${value/1000}k`} />
              <Tooltip formatter={(value: number) => `PKR ${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
              <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Balance Sheet</CardTitle>
                <CardDescription>As of {new Date().toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Account</TableHead>
                            <TableHead className="text-right">Amount (PKR)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="font-bold bg-muted/50"><TableCell>Assets</TableCell><TableCell></TableCell></TableRow>
                        {balanceSheetData.assets.current.map(item => <TableRow key={item.item}><TableCell className="pl-6">{item.item}</TableCell><TableCell className="text-right">{item.amount.toLocaleString()}</TableCell></TableRow>)}
                        {balanceSheetData.assets.nonCurrent.map(item => <TableRow key={item.item}><TableCell className="pl-6">{item.item}</TableCell><TableCell className="text-right">{item.amount.toLocaleString()}</TableCell></TableRow>)}
                         <TableRow className="font-bold"><TableCell>Total Assets</TableCell><TableCell className="text-right">{totalAssets.toLocaleString()}</TableCell></TableRow>

                        <TableRow className="font-bold bg-muted/50"><TableCell>Liabilities & Equity</TableCell><TableCell></TableCell></TableRow>
                        {balanceSheetData.liabilities.current.map(item => <TableRow key={item.item}><TableCell className="pl-6">{item.item}</TableCell><TableCell className="text-right">{item.amount.toLocaleString()}</TableCell></TableRow>)}
                        {balanceSheetData.liabilities.nonCurrent.map(item => <TableRow key={item.item}><TableCell className="pl-6">{item.item}</TableCell><TableCell className="text-right">{item.amount.toLocaleString()}</TableCell></TableRow>)}
                        {balanceSheetData.equity.map(item => <TableRow key={item.item}><TableCell className="pl-6">{item.item}</TableCell><TableCell className="text-right">{item.amount.toLocaleString()}</TableCell></TableRow>)}
                         <TableRow className="font-bold"><TableCell>Total Liabilities & Equity</TableCell><TableCell className="text-right">{totalLiabilitiesAndEquity.toLocaleString()}</TableCell></TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Trial Balance</CardTitle>
                <CardDescription>Ensures debits equal credits.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Account</TableHead>
                            <TableHead className="text-right">Debit (PKR)</TableHead>
                            <TableHead className="text-right">Credit (PKR)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trialBalanceData.map(item => (
                            <TableRow key={item.account}>
                                <TableCell>{item.account}</TableCell>
                                <TableCell className="text-right">{item.debit > 0 ? item.debit.toLocaleString() : '-'}</TableCell>
                                <TableCell className="text-right">{item.credit > 0 ? item.credit.toLocaleString() : '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                         <TableRow className="font-bold text-base">
                            <TableCell>Totals</TableCell>
                            <TableCell className="text-right">{totalDebits.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{totalCredits.toLocaleString()}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
                 <div className="mt-4 text-center">
                    {totalDebits === totalCredits ? (
                      <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 dark:border-green-500/50 dark:bg-green-500/10">Balanced</Badge>
                    ) : (
                      <Badge variant="destructive">Unbalanced</Badge>
                    )}
                 </div>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
