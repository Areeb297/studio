'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, DollarSign, Clock, AlertTriangle, Download, Search, Eye, CreditCard } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format, addDays } from "date-fns";

const payables = [
  { id: 1, billNumber: 'BILL-2025-001', vendor: 'ABC Suppliers Ltd', amount: 85000, dueDate: addDays(new Date(), 5), status: 'UNPAID' },
  { id: 2, billNumber: 'BILL-2025-002', vendor: 'XYZ Equipment Co', amount: 150000, dueDate: addDays(new Date(), -10), status: 'OVERDUE' },
  { id: 3, billNumber: 'BILL-2025-003', vendor: 'Food Distributors Inc', amount: 45000, dueDate: addDays(new Date(), 15), status: 'UNPAID' },
  { id: 4, billNumber: 'BILL-2025-004', vendor: 'Utility Company', amount: 30000, dueDate: addDays(new Date(), 2), status: 'UNPAID' },
  { id: 5, billNumber: 'BILL-2025-005', vendor: 'Office Supplies Store', amount: 15000, dueDate: addDays(new Date(), -5), status: 'OVERDUE' },
  { id: 6, billNumber: 'BILL-2025-006', vendor: 'Professional Services', amount: 35000, dueDate: addDays(new Date(), 10), status: 'UNPAID' },
];

const agingData = [
  { range: '0-30 days', amount: 165000 },
  { range: '31-60 days', amount: 165000 },
  { range: '61-90 days', amount: 0 },
  { range: '90+ days', amount: 30000 },
];

const formatPKR = (amount: number) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AccountsPayablePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const totalAP = payables.reduce((sum, r) => sum + r.amount, 0);
  const unpaidAP = payables.filter(r => r.status === 'UNPAID').reduce((sum, r) => sum + r.amount, 0);
  const overdueAP = payables.filter(r => r.status === 'OVERDUE').reduce((sum, r) => sum + r.amount, 0);

  const filteredPayables = payables.filter(item => {
    const matchesSearch = item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.billNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Accounts Payable</h1>
        <p className="text-muted-foreground">Manage vendor bills and track payment obligations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total AP</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPKR(totalAP)}</div>
            <p className="text-xs text-muted-foreground">{payables.length} bills</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatPKR(unpaidAP)}</div>
            <p className="text-xs text-muted-foreground">Pending payment</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{formatPKR(overdueAP)}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(payables.map(p => p.vendor)).size}</div>
            <p className="text-xs text-muted-foreground">Active vendors</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aging Analysis</CardTitle>
          <CardDescription>AP by aging buckets</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={agingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip formatter={(value) => formatPKR(value as number)} />
              <Legend />
              <Bar dataKey="amount" fill="hsl(var(--destructive))" name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bills..."
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
              <SelectItem value="UNPAID">Unpaid</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button><CreditCard className="h-4 w-4 mr-2" />Process Payments</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Outstanding Bills ({filteredPayables.length})</CardTitle>
          <CardDescription>All accounts payable</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bill #</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayables.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.billNumber}</TableCell>
                    <TableCell>{item.vendor}</TableCell>
                    <TableCell className="text-right font-mono">{formatPKR(item.amount)}</TableCell>
                    <TableCell>{format(item.dueDate, 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'UNPAID' ? 'default' : 'destructive'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                        <Button variant="default" size="sm"><CreditCard className="h-4 w-4 mr-1" />Pay</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
