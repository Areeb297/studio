'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  PlusCircle,
  Search,
  Download,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  Package
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample Chart of Accounts data
const chartOfAccounts = [
  // ASSETS
  { id: 1, code: '1000', name: 'Assets', type: 'ASSET', subType: 'CATEGORY', parent: null, balance: 1245000, isActive: true },
  { id: 2, code: '1100', name: 'Current Assets', type: 'ASSET', subType: 'CATEGORY', parent: 1, balance: 545000, isActive: true },
  { id: 3, code: '1110', name: 'Cash and Bank', type: 'ASSET', subType: 'CURRENT_ASSET', parent: 2, balance: 250000, isActive: true },
  { id: 4, code: '1111', name: 'Petty Cash', type: 'ASSET', subType: 'CURRENT_ASSET', parent: 3, balance: 5000, isActive: true },
  { id: 5, code: '1112', name: 'Bank Account - HBL', type: 'ASSET', subType: 'CURRENT_ASSET', parent: 3, balance: 150000, isActive: true },
  { id: 6, code: '1113', name: 'Bank Account - MCB', type: 'ASSET', subType: 'CURRENT_ASSET', parent: 3, balance: 95000, isActive: true },
  { id: 7, code: '1120', name: 'Accounts Receivable', type: 'ASSET', subType: 'CURRENT_ASSET', parent: 2, balance: 175000, isActive: true },
  { id: 8, code: '1130', name: 'Inventory', type: 'ASSET', subType: 'CURRENT_ASSET', parent: 2, balance: 120000, isActive: true },
  { id: 9, code: '1200', name: 'Fixed Assets', type: 'ASSET', subType: 'CATEGORY', parent: 1, balance: 700000, isActive: true },
  { id: 10, code: '1210', name: 'Property & Equipment', type: 'ASSET', subType: 'FIXED_ASSET', parent: 9, balance: 500000, isActive: true },
  { id: 11, code: '1220', name: 'Vehicles', type: 'ASSET', subType: 'FIXED_ASSET', parent: 9, balance: 200000, isActive: true },

  // LIABILITIES
  { id: 12, code: '2000', name: 'Liabilities', type: 'LIABILITY', subType: 'CATEGORY', parent: null, balance: 345000, isActive: true },
  { id: 13, code: '2100', name: 'Current Liabilities', type: 'LIABILITY', subType: 'CATEGORY', parent: 12, balance: 145000, isActive: true },
  { id: 14, code: '2110', name: 'Accounts Payable', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', parent: 13, balance: 85000, isActive: true },
  { id: 15, code: '2120', name: 'Short-term Loans', type: 'LIABILITY', subType: 'CURRENT_LIABILITY', parent: 13, balance: 60000, isActive: true },
  { id: 16, code: '2200', name: 'Long-term Liabilities', type: 'LIABILITY', subType: 'CATEGORY', parent: 12, balance: 200000, isActive: true },
  { id: 17, code: '2210', name: 'Long-term Debt', type: 'LIABILITY', subType: 'LONG_TERM_LIABILITY', parent: 16, balance: 200000, isActive: true },

  // EQUITY
  { id: 18, code: '3000', name: 'Equity', type: 'EQUITY', subType: 'CATEGORY', parent: null, balance: 900000, isActive: true },
  { id: 19, code: '3100', name: "Owner's Capital", type: 'EQUITY', subType: 'EQUITY', parent: 18, balance: 800000, isActive: true },
  { id: 20, code: '3200', name: 'Retained Earnings', type: 'EQUITY', subType: 'EQUITY', parent: 18, balance: 100000, isActive: true },

  // REVENUE
  { id: 21, code: '4000', name: 'Revenue', type: 'REVENUE', subType: 'CATEGORY', parent: null, balance: 650000, isActive: true },
  { id: 22, code: '4100', name: 'Operating Revenue', type: 'REVENUE', subType: 'REVENUE', parent: 21, balance: 550000, isActive: true },
  { id: 23, code: '4110', name: 'Restaurant Sales', type: 'REVENUE', subType: 'REVENUE', parent: 22, balance: 350000, isActive: true },
  { id: 24, code: '4120', name: 'Academic Fees', type: 'REVENUE', subType: 'REVENUE', parent: 22, balance: 150000, isActive: true },
  { id: 25, code: '4130', name: 'Event Bookings', type: 'REVENUE', subType: 'REVENUE', parent: 22, balance: 50000, isActive: true },
  { id: 26, code: '4200', name: 'Other Income', type: 'REVENUE', subType: 'REVENUE', parent: 21, balance: 100000, isActive: true },
  { id: 27, code: '4210', name: 'Donation Income', type: 'REVENUE', subType: 'REVENUE', parent: 26, balance: 80000, isActive: true },
  { id: 28, code: '4220', name: 'Rent Income', type: 'REVENUE', subType: 'REVENUE', parent: 26, balance: 20000, isActive: true },

  // EXPENSES
  { id: 29, code: '5000', name: 'Expenses', type: 'EXPENSE', subType: 'CATEGORY', parent: null, balance: 420000, isActive: true },
  { id: 30, code: '5100', name: 'Operating Expenses', type: 'EXPENSE', subType: 'CATEGORY', parent: 29, balance: 350000, isActive: true },
  { id: 31, code: '5110', name: 'Cost of Goods Sold', type: 'EXPENSE', subType: 'EXPENSE', parent: 30, balance: 180000, isActive: true },
  { id: 32, code: '5120', name: 'Salaries & Wages', type: 'EXPENSE', subType: 'EXPENSE', parent: 30, balance: 120000, isActive: true },
  { id: 33, code: '5130', name: 'Utilities', type: 'EXPENSE', subType: 'EXPENSE', parent: 30, balance: 30000, isActive: true },
  { id: 34, code: '5140', name: 'Rent Expense', type: 'EXPENSE', subType: 'EXPENSE', parent: 30, balance: 20000, isActive: true },
  { id: 35, code: '5200', name: 'Administrative Expenses', type: 'EXPENSE', subType: 'CATEGORY', parent: 29, balance: 70000, isActive: true },
  { id: 36, code: '5210', name: 'Office Supplies', type: 'EXPENSE', subType: 'EXPENSE', parent: 35, balance: 15000, isActive: true },
  { id: 37, code: '5220', name: 'Professional Fees', type: 'EXPENSE', subType: 'EXPENSE', parent: 35, balance: 35000, isActive: true },
  { id: 38, code: '5230', name: 'Marketing & Advertising', type: 'EXPENSE', subType: 'EXPENSE', parent: 35, balance: 20000, isActive: true },
];

const accountTypeColors: Record<string, string> = {
  ASSET: 'bg-blue-100 text-blue-800',
  LIABILITY: 'bg-red-100 text-red-800',
  EQUITY: 'bg-purple-100 text-purple-800',
  REVENUE: 'bg-green-100 text-green-800',
  EXPENSE: 'bg-orange-100 text-orange-800',
};

const formatPKR = (amount: number) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ChartOfAccountsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Calculate KPI data
  const totalAssets = chartOfAccounts.filter(a => a.type === 'ASSET' && a.parent === 1)[0]?.balance || 0;
  const totalLiabilities = chartOfAccounts.filter(a => a.type === 'LIABILITY' && a.parent === 12)[0]?.balance || 0;
  const totalEquity = chartOfAccounts.filter(a => a.type === 'EQUITY' && a.parent === 18)[0]?.balance || 0;
  const totalRevenue = chartOfAccounts.filter(a => a.type === 'REVENUE' && a.parent === 21)[0]?.balance || 0;
  const totalExpenses = chartOfAccounts.filter(a => a.type === 'EXPENSE' && a.parent === 29)[0]?.balance || 0;
  const netIncome = totalRevenue - totalExpenses;

  // Filter accounts
  const filteredAccounts = chartOfAccounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.code.includes(searchTerm);
    const matchesType = filterType === 'ALL' || account.type === filterType;
    return matchesSearch && matchesType;
  });

  // Build tree structure helper
  const getIndentation = (accountId: number): number => {
    const account = chartOfAccounts.find(a => a.id === accountId);
    if (!account || !account.parent) return 0;
    return 1 + getIndentation(account.parent);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Chart of Accounts</h1>
        <p className="text-muted-foreground">
          Manage your financial account structure and view account balances
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPKR(totalAssets)}</div>
            <p className="text-xs text-muted-foreground">Current & Fixed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPKR(totalLiabilities)}</div>
            <p className="text-xs text-muted-foreground">Current & Long-term</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equity</CardTitle>
            <Building2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPKR(totalEquity)}</div>
            <p className="text-xs text-muted-foreground">Owner's Capital</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPKR(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">YTD Income</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPKR(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">YTD Costs</p>
          </CardContent>
        </Card>

        <Card className={netIncome >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <TrendingUp className={`h-4 w-4 ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {formatPKR(netIncome)}
            </div>
            <p className="text-xs text-muted-foreground">Revenue - Expenses</p>
          </CardContent>
        </Card>
      </div>

      {/* Account Balance Equation */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4 text-center flex-wrap">
            <div>
              <div className="text-sm text-muted-foreground">Assets</div>
              <div className="text-xl font-bold text-blue-600">{formatPKR(totalAssets)}</div>
            </div>
            <div className="text-2xl font-bold text-muted-foreground">=</div>
            <div>
              <div className="text-sm text-muted-foreground">Liabilities</div>
              <div className="text-xl font-bold text-red-600">{formatPKR(totalLiabilities)}</div>
            </div>
            <div className="text-2xl font-bold text-muted-foreground">+</div>
            <div>
              <div className="text-sm text-muted-foreground">Equity</div>
              <div className="text-xl font-bold text-purple-600">{formatPKR(totalEquity)}</div>
            </div>
            <div className="ml-4">
              <Badge variant={totalAssets === (totalLiabilities + totalEquity) ? "default" : "destructive"}>
                {totalAssets === (totalLiabilities + totalEquity) ? "Balanced ✓" : "Unbalanced!"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full sm:w-64"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="ASSET">Assets</SelectItem>
              <SelectItem value="LIABILITY">Liabilities</SelectItem>
              <SelectItem value="EQUITY">Equity</SelectItem>
              <SelectItem value="REVENUE">Revenue</SelectItem>
              <SelectItem value="EXPENSE">Expenses</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Account</DialogTitle>
                <DialogDescription>
                  Create a new account in your chart of accounts
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="account-code">Account Code</Label>
                  <Input id="account-code" placeholder="e.g., 1140" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="account-name">Account Name</Label>
                  <Input id="account-name" placeholder="e.g., Prepaid Expenses" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="account-type">Account Type</Label>
                  <Select>
                    <SelectTrigger id="account-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASSET">Asset</SelectItem>
                      <SelectItem value="LIABILITY">Liability</SelectItem>
                      <SelectItem value="EQUITY">Equity</SelectItem>
                      <SelectItem value="REVENUE">Revenue</SelectItem>
                      <SelectItem value="EXPENSE">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="parent-account">Parent Account</Label>
                  <Select>
                    <SelectTrigger id="parent-account">
                      <SelectValue placeholder="Select parent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">Current Assets</SelectItem>
                      <SelectItem value="9">Fixed Assets</SelectItem>
                      <SelectItem value="13">Current Liabilities</SelectItem>
                      <SelectItem value="16">Long-term Liabilities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>Create Account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Chart of Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Accounts ({filteredAccounts.length})</CardTitle>
          <CardDescription>
            Hierarchical view of all accounts with current balances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Sub-Type</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => {
                  const indentation = getIndentation(account.id);
                  return (
                    <TableRow key={account.id}>
                      <TableCell className="font-mono">{account.code}</TableCell>
                      <TableCell>
                        <div style={{ paddingLeft: `${indentation * 20}px` }} className={indentation === 0 ? "font-bold" : ""}>
                          {account.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={accountTypeColors[account.type]}>
                          {account.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {account.subType}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatPKR(account.balance)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={account.isActive ? "default" : "secondary"}>
                          {account.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
