'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  DollarSign,
  Clock,
  AlertTriangle,
  Download,
  Search,
  Eye,
  Send
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { format, addDays, differenceInDays } from "date-fns";

// AR Data
const receivables = [
  { id: 1, invoiceNumber: 'INV-2025-001', customer: 'ABC Restaurant Supply', amount: 45000, dueDate: addDays(new Date(), -15), status: 'OVERDUE', aging: '15 days' },
  { id: 2, invoiceNumber: 'INV-2025-002', customer: 'XYZ Catering Services', amount: 25000, dueDate: addDays(new Date(), 5), status: 'CURRENT', aging: '0 days' },
  { id: 3, invoiceNumber: 'INV-2025-003', customer: 'Student - Ahmed Khan', amount: 15000, dueDate: addDays(new Date(), -45), status: 'OVERDUE', aging: '45 days' },
  { id: 4, invoiceNumber: 'INV-2025-004', customer: 'Event Booking - Wedding', amount: 75000, dueDate: addDays(new Date(), 10), status: 'CURRENT', aging: '0 days' },
  { id: 5, invoiceNumber: 'INV-2025-005', customer: 'Gym Membership - Corporate', amount: 30000, dueDate: addDays(new Date(), -5), status: 'OVERDUE', aging: '5 days' },
  { id: 6, invoiceNumber: 'INV-2025-006', customer: 'Academic Fees - Student', amount: 12000, dueDate: addDays(new Date(), 15), status: 'CURRENT', aging: '0 days' },
  { id: 7, invoiceNumber: 'INV-2025-007', customer: 'Restaurant Monthly Bill', amount: 55000, dueDate: addDays(new Date(), -30), status: 'OVERDUE', aging: '30 days' },
];

const agingData = [
  { range: '0-30 days', amount: 112000, count: 3 },
  { range: '31-60 days', amount: 100000, count: 3 },
  { range: '61-90 days', amount: 45000, count: 1 },
  { range: '90+ days', amount: 0, count: 0 },
];

const statusDistribution = [
  { name: 'Current', value: 112000, count: 3 },
  { name: 'Overdue', value: 145000, count: 4 },
];

const COLORS = ['#10b981', '#ef4444'];

const formatPKR = (amount: number) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AccountsReceivablePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const totalAR = receivables.reduce((sum, r) => sum + r.amount, 0);
  const currentAR = receivables.filter(r => r.status === 'CURRENT').reduce((sum, r) => sum + r.amount, 0);
  const overdueAR = receivables.filter(r => r.status === 'OVERDUE').reduce((sum, r) => sum + r.amount, 0);
  const averageDays = receivables.reduce((sum, r) => {
    const days = differenceInDays(new Date(), r.dueDate);
    return sum + (days > 0 ? days : 0);
  }, 0) / receivables.length;

  const filteredReceivables = receivables.filter(item => {
    const matchesSearch = item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Accounts Receivable</h1>
        <p className="text-muted-foreground">
          Manage customer invoices and track outstanding payments
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total AR</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPKR(totalAR)}</div>
            <p className="text-xs text-muted-foreground">{receivables.length} invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatPKR(currentAR)}</div>
            <p className="text-xs text-muted-foreground">Not yet due</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{formatPKR(overdueAR)}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Days Overdue</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageDays.toFixed(0)} days</div>
            <p className="text-xs text-muted-foreground">Collection period</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Aging Analysis</CardTitle>
            <CardDescription>AR by aging buckets</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={agingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={(value) => formatPKR(value as number)} />
                <Legend />
                <Bar dataKey="amount" fill="hsl(var(--primary))" name="Amount" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current vs Overdue</CardTitle>
            <CardDescription>Payment status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatPKR(value as number)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
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
              <SelectItem value="CURRENT">Current</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Receivables Table */}
      <Card>
        <CardHeader>
          <CardTitle>Outstanding Invoices ({filteredReceivables.length})</CardTitle>
          <CardDescription>All accounts receivable</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Aging</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceivables.map((item) => {
                  const daysOverdue = differenceInDays(new Date(), item.dueDate);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono">{item.invoiceNumber}</TableCell>
                      <TableCell>{item.customer}</TableCell>
                      <TableCell className="text-right font-mono">{formatPKR(item.amount)}</TableCell>
                      <TableCell>{format(item.dueDate, 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <span className={daysOverdue > 0 ? "text-red-600 font-medium" : ""}>
                          {daysOverdue > 0 ? `${daysOverdue} days overdue` : 'Current'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.status === 'CURRENT' ? 'default' : 'destructive'}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Send className="h-4 w-4" />
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
