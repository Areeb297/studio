'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, TrendingUp, TrendingDown, Activity, Sparkles, Calendar } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

const profitLossData = {
  revenue: [
    { account: 'Restaurant Sales', amount: 350000 },
    { account: 'Academic Fees', amount: 150000 },
    { account: 'Event Bookings', amount: 50000 },
    { account: 'Donation Income', amount: 80000 },
    { account: 'Rent Income', amount: 20000 },
  ],
  expenses: [
    { account: 'Cost of Goods Sold', amount: 180000 },
    { account: 'Salaries & Wages', amount: 120000 },
    { account: 'Utilities', amount: 30000 },
    { account: 'Rent Expense', amount: 20000 },
    { account: 'Office Supplies', amount: 15000 },
    { account: 'Professional Fees', amount: 35000 },
    { account: 'Marketing', amount: 20000 },
  ],
};

const monthlyTrend = [
  { month: 'Jan', revenue: 650000, expenses: 420000, profit: 230000 },
  { month: 'Feb', revenue: 680000, expenses: 440000, profit: 240000 },
  { month: 'Mar', revenue: 720000, expenses: 460000, profit: 260000 },
  { month: 'Apr', revenue: 700000, expenses: 450000, profit: 250000 },
  { month: 'May', revenue: 750000, expenses: 480000, profit: 270000 },
  { month: 'Jun', revenue: 780000, expenses: 500000, profit: 280000 },
];

const cashFlowData = [
  { category: 'Operating Activities', inflow: 650000, outflow: 420000, net: 230000 },
  { category: 'Investing Activities', inflow: 0, outflow: 150000, net: -150000 },
  { category: 'Financing Activities', inflow: 100000, outflow: 50000, net: 50000 },
];

const formatPKR = (amount: number) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function FinancialReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const totalRevenue = profitLossData.revenue.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = profitLossData.expenses.reduce((sum, item) => sum + item.amount, 0);
  const netIncome = totalRevenue - totalExpenses;
  const profitMargin = (netIncome / totalRevenue * 100).toFixed(1);

  const handleGenerateAI = () => {
    setIsGeneratingAI(true);
    setTimeout(() => setIsGeneratingAI(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <p className="text-muted-foreground">Comprehensive financial statements and AI-powered insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatPKR(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatPKR(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatPKR(netIncome)}</div>
            <p className="text-xs text-muted-foreground">Profit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profitMargin}%</div>
            <p className="text-xs text-muted-foreground">Net margin</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Calendar className="h-4 w-4 mr-2" />Custom Period</Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export PDF</Button>
          <Button onClick={handleGenerateAI} disabled={isGeneratingAI}>
            <Sparkles className="h-4 w-4 mr-2" />
            {isGeneratingAI ? 'Generating...' : 'AI Insights'}
          </Button>
        </div>
      </div>

      {isGeneratingAI && (
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <div>
                <p className="font-medium">Generating AI Insights...</p>
                <p className="text-sm text-muted-foreground">Analyzing financial data and trends</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI-Generated Financial Insights</CardTitle>
          </div>
          <CardDescription>Powered by Google Gemini 2.0 Flash</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-white/50 p-4 space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Revenue Analysis
            </h4>
            <p className="text-sm text-muted-foreground">
              Your revenue has shown consistent growth over the past 6 months, with restaurant sales contributing 53.8% of total revenue.
              Consider expanding catering services as they show high profit margins.
            </p>
          </div>
          <div className="rounded-lg bg-white/50 p-4 space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              Expense Optimization
            </h4>
            <p className="text-sm text-muted-foreground">
              Cost of Goods Sold represents 42.9% of expenses. Recommended action: Negotiate bulk purchasing agreements with top 3 vendors
              to reduce COGS by an estimated 8-12%.
            </p>
          </div>
          <div className="rounded-lg bg-white/50 p-4 space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              Cash Flow Forecast
            </h4>
            <p className="text-sm text-muted-foreground">
              Based on current trends, projected cash flow for next quarter is PKR 780,000. Monitor accounts receivable aging to maintain healthy cash flow.
              Current DSO (Days Sales Outstanding) is 23 days, which is within industry norms.
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pnl" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pnl">Profit & Loss</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="pnl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss Statement</CardTitle>
              <CardDescription>For the month ended {format(new Date(), 'MMMM dd, yyyy')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-green-50">
                      <TableHead colSpan={2} className="font-bold">REVENUE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profitLossData.revenue.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.account}</TableCell>
                        <TableCell className="text-right font-mono">{formatPKR(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className="font-bold">Total Revenue</TableCell>
                      <TableCell className="text-right font-bold text-green-600">{formatPKR(totalRevenue)}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>

                <Table className="mt-4">
                  <TableHeader>
                    <TableRow className="bg-red-50">
                      <TableHead colSpan={2} className="font-bold">EXPENSES</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profitLossData.expenses.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.account}</TableCell>
                        <TableCell className="text-right font-mono">{formatPKR(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className="font-bold">Total Expenses</TableCell>
                      <TableCell className="text-right font-bold text-red-600">{formatPKR(totalExpenses)}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>

                <Table className="mt-4">
                  <TableFooter>
                    <TableRow className="bg-primary/10">
                      <TableCell className="font-bold text-lg">NET INCOME</TableCell>
                      <TableCell className="text-right font-bold text-lg text-primary">{formatPKR(netIncome)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Profit Margin</TableCell>
                      <TableCell className="text-right font-bold">{profitMargin}%</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Expense Trends</CardTitle>
              <CardDescription>6-month comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatPKR(value as number)} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                  <Line type="monotone" dataKey="profit" stroke="hsl(var(--primary))" strokeWidth={2} name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Statement</CardTitle>
              <CardDescription>Cash inflows and outflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Inflow</TableHead>
                      <TableHead className="text-right">Outflow</TableHead>
                      <TableHead className="text-right">Net</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cashFlowData.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.category}</TableCell>
                        <TableCell className="text-right font-mono text-green-600">{formatPKR(item.inflow)}</TableCell>
                        <TableCell className="text-right font-mono text-red-600">{formatPKR(item.outflow)}</TableCell>
                        <TableCell className={`text-right font-mono font-bold ${item.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPKR(item.net)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell className="font-bold">Net Cash Flow</TableCell>
                      <TableCell colSpan={2}></TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {formatPKR(cashFlowData.reduce((sum, item) => sum + item.net, 0))}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
