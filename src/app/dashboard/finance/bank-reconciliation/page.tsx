'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Upload, Download, AlertCircle, DollarSign, RefreshCw, Building2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

const bankTransactions = [
  { id: 1, date: '2025-02-01', description: 'Customer Payment - INV-001', amount: 45000, type: 'CREDIT', matched: true, glEntry: 'JE-2025-010' },
  { id: 2, date: '2025-02-02', description: 'Vendor Payment - ABC Suppliers', amount: -85000, type: 'DEBIT', matched: true, glEntry: 'JE-2025-011' },
  { id: 3, date: '2025-02-03', description: 'Utility Bill Payment', amount: -30000, type: 'DEBIT', matched: false, glEntry: null },
  { id: 4, date: '2025-02-04', description: 'Bank Charges', amount: -500, type: 'DEBIT', matched: false, glEntry: null },
  { id: 5, date: '2025-02-05', description: 'Customer Deposit', amount: 75000, type: 'CREDIT', matched: true, glEntry: 'JE-2025-012' },
];

const glTransactions = [
  { id: 1, date: '2025-02-01', description: 'Payment from Customer', amount: 45000, type: 'CREDIT', matched: true, bankTx: 1 },
  { id: 2, date: '2025-02-02', description: 'Vendor Payment', amount: -85000, type: 'DEBIT', matched: true, bankTx: 2 },
  { id: 3, date: '2025-02-05', description: 'Customer Deposit', amount: 75000, type: 'CREDIT', matched: true, bankTx: 5 },
  { id: 4, date: '2025-02-06', description: 'Salary Payment', amount: -120000, type: 'DEBIT', matched: false, bankTx: null },
  { id: 5, date: '2025-02-07', description: 'Office Rent', amount: -20000, type: 'DEBIT', matched: false, bankTx: null },
];

const formatPKR = (amount: number) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function BankReconciliationPage() {
  const [selectedBank, setSelectedBank] = useState('HBL');

  const bankBalance = 350000;
  const glBalance = 210000;
  const matchedTransactions = bankTransactions.filter(t => t.matched).length + glTransactions.filter(t => t.matched).length;
  const unmatchedTransactions = bankTransactions.filter(t => !t.matched).length + glTransactions.filter(t => !t.matched).length;
  const difference = bankBalance - glBalance;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Bank Reconciliation</h1>
        <p className="text-muted-foreground">Reconcile bank statements with general ledger entries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bank Balance</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPKR(bankBalance)}</div>
            <p className="text-xs text-muted-foreground">Per bank statement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GL Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPKR(glBalance)}</div>
            <p className="text-xs text-muted-foreground">Per books</p>
          </CardContent>
        </Card>

        <Card className={difference === 0 ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Difference</CardTitle>
            <AlertCircle className={`h-4 w-4 ${difference === 0 ? 'text-green-600' : 'text-yellow-600'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${difference === 0 ? 'text-green-700' : 'text-yellow-700'}`}>
              {formatPKR(Math.abs(difference))}
            </div>
            <p className="text-xs text-muted-foreground">
              {difference === 0 ? 'Reconciled ✓' : 'To be reconciled'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unmatched Items</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unmatchedTransactions}</div>
            <p className="text-xs text-muted-foreground">{matchedTransactions} matched</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Select value={selectedBank} onValueChange={setSelectedBank}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HBL">HBL - Main Account</SelectItem>
              <SelectItem value="MCB">MCB - Secondary</SelectItem>
              <SelectItem value="UBL">UBL - Payroll</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" className="w-48" defaultValue={format(new Date(), 'yyyy-MM-dd')} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Upload className="h-4 w-4 mr-2" />Import Statement</Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button><RefreshCw className="h-4 w-4 mr-2" />Auto-Match</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Bank Statement Transactions</CardTitle>
            <CardDescription>Transactions from bank ({bankTransactions.length})</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankTransactions.map((tx) => (
                    <TableRow key={tx.id} className={tx.matched ? "bg-green-50" : ""}>
                      <TableCell>
                        <Checkbox checked={tx.matched} />
                      </TableCell>
                      <TableCell>{format(new Date(tx.date), 'MMM dd')}</TableCell>
                      <TableCell className="text-sm">{tx.description}</TableCell>
                      <TableCell className={`text-right font-mono ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPKR(tx.amount)}
                      </TableCell>
                      <TableCell>
                        {tx.matched ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />Matched
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Unmatched</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="font-bold">Bank Balance</TableCell>
                    <TableCell className="text-right font-bold">{formatPKR(bankBalance)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>General Ledger Transactions</CardTitle>
            <CardDescription>Transactions from GL ({glTransactions.length})</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {glTransactions.map((tx) => (
                    <TableRow key={tx.id} className={tx.matched ? "bg-green-50" : ""}>
                      <TableCell>
                        <Checkbox checked={tx.matched} />
                      </TableCell>
                      <TableCell>{format(new Date(tx.date), 'MMM dd')}</TableCell>
                      <TableCell className="text-sm">{tx.description}</TableCell>
                      <TableCell className={`text-right font-mono ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPKR(tx.amount)}
                      </TableCell>
                      <TableCell>
                        {tx.matched ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />Matched
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Unmatched</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="font-bold">GL Balance</TableCell>
                    <TableCell className="text-right font-bold">{formatPKR(glBalance)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle>Reconciliation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Bank Statement Balance:</span>
              <span className="font-bold">{formatPKR(bankBalance)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span className="ml-4">Less: Outstanding Checks</span>
              <span>{formatPKR(0)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span className="ml-4">Add: Deposits in Transit</span>
              <span>{formatPKR(0)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span>Adjusted Bank Balance:</span>
              <span className="font-bold">{formatPKR(bankBalance)}</span>
            </div>
            <div className="mt-4 flex justify-between">
              <span>General Ledger Balance:</span>
              <span className="font-bold">{formatPKR(glBalance)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span className="ml-4">Add: Bank Service Charges</span>
              <span>{formatPKR(500)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span>Adjusted GL Balance:</span>
              <span className="font-bold">{formatPKR(glBalance + 500)}</span>
            </div>
            <div className="mt-4 border-t pt-2 flex justify-between">
              <span className="font-bold">Difference:</span>
              <span className={`font-bold ${difference === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPKR(Math.abs(difference))}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
