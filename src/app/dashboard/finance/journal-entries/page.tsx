'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ClipboardList,
  PlusCircle,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  FileText
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
import { format } from "date-fns";

// Sample Journal Entries
const journalEntries = [
  {
    id: 1,
    entryNumber: 'JE-2025-001',
    date: '2025-01-15',
    description: 'Initial capital investment by owner',
    status: 'POSTED',
    createdBy: 'Admin User',
    lines: [
      { account: 'Cash - HBL', accountCode: '1111', debit: 500000, credit: 0 },
      { account: "Owner's Capital", accountCode: '3100', debit: 0, credit: 500000 },
    ]
  },
  {
    id: 2,
    entryNumber: 'JE-2025-002',
    date: '2025-01-20',
    description: 'Purchase of equipment for restaurant',
    status: 'POSTED',
    createdBy: 'Finance Manager',
    lines: [
      { account: 'Property & Equipment', accountCode: '1210', debit: 150000, credit: 0 },
      { account: 'Accounts Payable', accountCode: '2110', debit: 0, credit: 150000 },
    ]
  },
  {
    id: 3,
    entryNumber: 'JE-2025-003',
    date: '2025-01-25',
    description: 'Payment of monthly rent expense',
    status: 'POSTED',
    createdBy: 'Accountant',
    lines: [
      { account: 'Rent Expense', accountCode: '5140', debit: 20000, credit: 0 },
      { account: 'Cash - HBL', accountCode: '1111', debit: 0, credit: 20000 },
    ]
  },
  {
    id: 4,
    entryNumber: 'JE-2025-004',
    date: '2025-02-01',
    description: 'Monthly salary payment to staff',
    status: 'POSTED',
    createdBy: 'HR Manager',
    lines: [
      { account: 'Salaries & Wages', accountCode: '5120', debit: 120000, credit: 0 },
      { account: 'Bank Account - HBL', accountCode: '1112', debit: 0, credit: 120000 },
    ]
  },
  {
    id: 5,
    entryNumber: 'JE-2025-005',
    date: '2025-02-05',
    description: 'Restaurant sales revenue for January',
    status: 'POSTED',
    createdBy: 'Sales Team',
    lines: [
      { account: 'Cash - HBL', accountCode: '1111', debit: 350000, credit: 0 },
      { account: 'Restaurant Sales', accountCode: '4110', debit: 0, credit: 350000 },
    ]
  },
  {
    id: 6,
    entryNumber: 'JE-2025-006',
    date: '2025-02-10',
    description: 'Utility bills for electricity and gas',
    status: 'PENDING',
    createdBy: 'Facilities Manager',
    lines: [
      { account: 'Utilities', accountCode: '5130', debit: 30000, credit: 0 },
      { account: 'Accounts Payable', accountCode: '2110', debit: 0, credit: 30000 },
    ]
  },
  {
    id: 7,
    entryNumber: 'JE-2025-007',
    date: '2025-02-15',
    description: 'Donation received from benefactor',
    status: 'DRAFT',
    createdBy: 'Donations Team',
    lines: [
      { account: 'Bank Account - MCB', accountCode: '1113', debit: 80000, credit: 0 },
      { account: 'Donation Income', accountCode: '4210', debit: 0, credit: 80000 },
    ]
  },
];

const formatPKR = (amount: number) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  POSTED: 'bg-green-100 text-green-800',
  VOIDED: 'bg-red-100 text-red-800',
};

export default function JournalEntriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    lines: [
      { account: '', accountCode: '', debit: 0, credit: 0 },
      { account: '', accountCode: '', debit: 0, credit: 0 },
    ]
  });

  // Calculate KPIs
  const totalEntries = journalEntries.length;
  const postedEntries = journalEntries.filter(e => e.status === 'POSTED').length;
  const pendingEntries = journalEntries.filter(e => e.status === 'PENDING').length;
  const draftEntries = journalEntries.filter(e => e.status === 'DRAFT').length;
  const totalDebits = journalEntries
    .filter(e => e.status === 'POSTED')
    .reduce((sum, entry) => sum + entry.lines.reduce((s, l) => s + l.debit, 0), 0);
  const totalCredits = journalEntries
    .filter(e => e.status === 'POSTED')
    .reduce((sum, entry) => sum + entry.lines.reduce((s, l) => s + l.credit, 0), 0);

  // Filter entries
  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = entry.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || entry.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const addLine = () => {
    setNewEntry({
      ...newEntry,
      lines: [...newEntry.lines, { account: '', accountCode: '', debit: 0, credit: 0 }]
    });
  };

  const calculateTotals = () => {
    const totalDebit = newEntry.lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredit = newEntry.lines.reduce((sum, line) => sum + (line.credit || 0), 0);
    return { totalDebit, totalCredit };
  };

  const { totalDebit, totalCredit } = calculateTotals();
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Journal Entries</h1>
        <p className="text-muted-foreground">
          Record and manage financial transactions with double-entry bookkeeping
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEntries}</div>
            <p className="text-xs text-muted-foreground">All journal entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posted</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{postedEntries}</div>
            <p className="text-xs text-muted-foreground">Completed entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingEntries}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{draftEntries}</div>
            <p className="text-xs text-muted-foreground">Work in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debits</CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPKR(totalDebits)}</div>
            <p className="text-xs text-muted-foreground">Posted entries</p>
          </CardContent>
        </Card>

        <Card className={totalDebits === totalCredits ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <ClipboardList className={`h-4 w-4 ${totalDebits === totalCredits ? 'text-green-600' : 'text-red-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalDebits === totalCredits ? 'text-green-700' : 'text-red-700'}`}>
              {formatPKR(totalCredits)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalDebits === totalCredits ? "Balanced ✓" : "Unbalanced!"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full sm:w-64"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="POSTED">Posted</SelectItem>
              <SelectItem value="VOIDED">Voided</SelectItem>
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
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Journal Entry</DialogTitle>
                <DialogDescription>
                  Record a new financial transaction with balanced debits and credits
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="entry-date">Date</Label>
                    <Input
                      id="entry-date"
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Entry Status</Label>
                    <Select defaultValue="DRAFT">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PENDING">Pending Approval</SelectItem>
                        <SelectItem value="POSTED">Post Immediately</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="entry-description">Description</Label>
                  <Textarea
                    id="entry-description"
                    placeholder="Enter transaction description..."
                    value={newEntry.description}
                    onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                    rows={2}
                  />
                </div>

                {/* Journal Entry Lines */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Entry Lines</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addLine}>
                      <PlusCircle className="h-3 w-3 mr-1" />
                      Add Line
                    </Button>
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40%]">Account</TableHead>
                          <TableHead className="text-right">Debit</TableHead>
                          <TableHead className="text-right">Credit</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {newEntry.lines.map((line, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Select>
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1111">1111 - Cash - HBL</SelectItem>
                                  <SelectItem value="1112">1112 - Bank Account - HBL</SelectItem>
                                  <SelectItem value="2110">2110 - Accounts Payable</SelectItem>
                                  <SelectItem value="4110">4110 - Restaurant Sales</SelectItem>
                                  <SelectItem value="5120">5120 - Salaries & Wages</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input type="number" className="h-8 text-right" placeholder="0.00" />
                            </TableCell>
                            <TableCell>
                              <Input type="number" className="h-8 text-right" placeholder="0.00" />
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  setNewEntry({
                                    ...newEntry,
                                    lines: newEntry.lines.filter((_, i) => i !== index)
                                  });
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell className="font-bold">Total</TableCell>
                          <TableCell className="text-right font-bold">{formatPKR(totalDebit)}</TableCell>
                          <TableCell className="text-right font-bold">{formatPKR(totalCredit)}</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                  <div className="flex items-center gap-2">
                    {isBalanced ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Balanced
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        Unbalanced (Debits must equal Credits)
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button disabled={!isBalanced} onClick={() => setIsAddDialogOpen(false)}>
                  Create Entry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Journal Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Journal Entries ({filteredEntries.length})</CardTitle>
          <CardDescription>
            All recorded financial transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEntries.map((entry) => {
              const totalDebit = entry.lines.reduce((sum, line) => sum + line.debit, 0);
              const totalCredit = entry.lines.reduce((sum, line) => sum + line.credit, 0);

              return (
                <div key={entry.id} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{entry.entryNumber}</span>
                        <Badge variant="outline" className={statusColors[entry.status]}>
                          {entry.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{entry.description}</p>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(entry.date), 'MMM dd, yyyy')} • By {entry.createdBy}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Account</TableHead>
                          <TableHead className="text-right">Debit</TableHead>
                          <TableHead className="text-right">Credit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entry.lines.map((line, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="font-medium">{line.account}</div>
                              <div className="text-xs text-muted-foreground font-mono">{line.accountCode}</div>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {line.debit > 0 ? formatPKR(line.debit) : '-'}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {line.credit > 0 ? formatPKR(line.credit) : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell className="font-bold">Total</TableCell>
                          <TableCell className="text-right font-bold">{formatPKR(totalDebit)}</TableCell>
                          <TableCell className="text-right font-bold">{formatPKR(totalCredit)}</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
