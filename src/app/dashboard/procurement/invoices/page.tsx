'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Eye,
  Printer,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Truck,
  PackageCheck,
  ShoppingBag,
  ClipboardList,
  CreditCard,
} from "lucide-react";

// Mock data matching real ERP_New schema
const mockInvoices = [
  {
    id: 1,
    invoiceNumber: "PINV-202603-0009",
    grnNumber: "GRN-202603-0012",
    poNumber: "PO-202603-0004",
    supplierName: "ALI",
    invoiceDate: "2026-03-04",
    totalAmount: 289100.00,
    amountPaid: 289100.00,
    status: "Paid",
    postedToLedger: true,
    department: "RESTAURANT STORE",
    itemCount: 8,
  },
  {
    id: 2,
    invoiceNumber: "PINV-202603-0007",
    grnNumber: "GRN-202603-0009",
    poNumber: "PO-202603-0003",
    supplierName: "ALI",
    invoiceDate: "2026-03-04",
    totalAmount: 7327.80,
    amountPaid: 0,
    status: "Unpaid",
    postedToLedger: false,
    department: "DESI KITCHEN",
    itemCount: 3,
  },
  {
    id: 3,
    invoiceNumber: "PINV-202603-0006",
    grnNumber: "GRN-202603-0008",
    poNumber: "PO-202603-0003",
    supplierName: "ALI",
    invoiceDate: "2026-03-04",
    totalAmount: 1427.80,
    amountPaid: 0,
    status: "Unpaid",
    postedToLedger: false,
    department: "CHINESE KITCHEN",
    itemCount: 2,
  },
  {
    id: 4,
    invoiceNumber: "PINV-202602-0005",
    grnNumber: "GRN-202602-0007",
    poNumber: "PO-202602-0002",
    supplierName: "LOCAL SUPPLIER",
    invoiceDate: "2026-02-28",
    totalAmount: 45200.00,
    amountPaid: 45200.00,
    status: "Paid",
    postedToLedger: true,
    department: "STORE DEPT",
    itemCount: 12,
  },
  {
    id: 5,
    invoiceNumber: "PINV-202602-0004",
    grnNumber: "GRN-202602-0005",
    poNumber: "PO-202602-0001",
    supplierName: "SALEEM BHAI",
    invoiceDate: "2026-02-25",
    totalAmount: 18750.00,
    amountPaid: 10000.00,
    status: "Partial",
    postedToLedger: true,
    department: "BBQ KITCHEN",
    itemCount: 5,
  },
  {
    id: 6,
    invoiceNumber: "PINV-202602-0003",
    grnNumber: "GRN-202602-0004",
    poNumber: "PO-202601-0008",
    supplierName: "CHICKEN SUPPLIER",
    invoiceDate: "2026-02-20",
    totalAmount: 92400.00,
    amountPaid: 92400.00,
    status: "Paid",
    postedToLedger: true,
    department: "RESTAURANT STORE",
    itemCount: 6,
  },
  {
    id: 7,
    invoiceNumber: "PINV-202602-0002",
    grnNumber: "GRN-202602-0003",
    poNumber: "PO-202601-0007",
    supplierName: "Al-Madina",
    invoiceDate: "2026-02-18",
    totalAmount: 33600.00,
    amountPaid: 0,
    status: "Unpaid",
    postedToLedger: false,
    department: "DRY STORE",
    itemCount: 9,
  },
  {
    id: 8,
    invoiceNumber: "PINV-202601-0001",
    grnNumber: "GRN-202601-0001",
    poNumber: "PO-202601-0001",
    supplierName: "LOCAL SUPPLIER",
    invoiceDate: "2026-01-15",
    totalAmount: 67850.00,
    amountPaid: 67850.00,
    status: "Paid",
    postedToLedger: true,
    department: "COLD STORE",
    itemCount: 15,
  },
];

const workflowSteps = [
  { label: "Requisition", icon: ClipboardList },
  { label: "Approval", icon: CheckCircle },
  { label: "Purchase Order", icon: ShoppingBag },
  { label: "Goods Receipt", icon: PackageCheck },
  { label: "Invoicing", icon: Receipt },
  { label: "Payment", icon: CreditCard },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
    Paid:    { variant: "default",  className: "bg-green-500/15 text-green-700 border-green-200 dark:text-green-400" },
    Unpaid:  { variant: "outline",  className: "bg-yellow-500/15 text-yellow-700 border-yellow-200 dark:text-yellow-400" },
    Partial: { variant: "secondary", className: "bg-blue-500/15 text-blue-700 border-blue-200 dark:text-blue-400" },
  };
  const cfg = map[status] ?? { variant: "secondary" as const, className: "" };
  return <Badge variant={cfg.variant} className={cfg.className}>{status}</Badge>;
}

export default function PurchaseInvoicesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<typeof mockInvoices[0] | null>(null);
  const [showNew, setShowNew] = useState(false);

  const filtered = mockInvoices.filter(inv => {
    const matchSearch = inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())
      || inv.supplierName.toLowerCase().includes(search.toLowerCase())
      || inv.grnNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const totalUnpaid = mockInvoices
    .filter(i => i.status !== 'Paid')
    .reduce((s, i) => s + (i.totalAmount - i.amountPaid), 0);
  const totalPaid = mockInvoices
    .filter(i => i.status === 'Paid')
    .reduce((s, i) => s + i.totalAmount, 0);

  const fmt = (n: number) => `Rs. ${n.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Purchase Invoices</h1>
          <p className="text-muted-foreground text-sm">Manage supplier invoices and payment status</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Invoice
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Total Invoices</p>
            <p className="text-2xl font-bold mt-1">{mockInvoices.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Unpaid / Partial</p>
            <p className="text-2xl font-bold mt-1 text-yellow-600">
              {mockInvoices.filter(i => i.status !== 'Paid').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Outstanding Amount</p>
            <p className="text-lg font-bold mt-1 text-red-600">{fmt(totalUnpaid)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Total Paid (MTD)</p>
            <p className="text-lg font-bold mt-1 text-green-600">{fmt(totalPaid)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Procurement Workflow */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            {workflowSteps.map((step, i) => {
              const Icon = step.icon;
              const isActive = step.label === "Invoicing";
              const isDone = i < 4;
              return (
                <div key={step.label} className="flex items-center gap-1">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2
                      ${isDone ? 'bg-green-500 border-green-500 text-white'
                        : isActive ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-muted border-muted-foreground/30 text-muted-foreground'}`}>
                      {isDone ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
                    </div>
                    <span className={`text-[10px] font-medium ${isActive ? 'text-blue-600' : isDone ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < workflowSteps.length - 1 && (
                    <div className={`h-0.5 w-8 mx-1 mb-3 ${i < 4 ? 'bg-green-400' : 'bg-muted-foreground/20'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoice #, supplier, GRN..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>GRN Ref</TableHead>
                <TableHead>PO Ref</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ledger</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(inv => (
                <TableRow key={inv.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-xs font-semibold text-primary">
                    {inv.invoiceNumber}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{inv.grnNumber}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{inv.poNumber}</TableCell>
                  <TableCell className="font-medium">{inv.supplierName}</TableCell>
                  <TableCell className="text-sm">{inv.invoiceDate}</TableCell>
                  <TableCell className="text-right font-semibold">{fmt(inv.totalAmount)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{fmt(inv.amountPaid)}</TableCell>
                  <TableCell><StatusBadge status={inv.status} /></TableCell>
                  <TableCell>
                    {inv.postedToLedger
                      ? <Badge variant="outline" className="text-green-600 border-green-300 text-xs">Posted</Badge>
                      : <Badge variant="outline" className="text-muted-foreground text-xs">Pending</Badge>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedInvoice(inv)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Printer className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              {selectedInvoice?.invoiceNumber}
            </DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Supplier</span><p className="font-semibold">{selectedInvoice.supplierName}</p></div>
                <div><span className="text-muted-foreground">Date</span><p className="font-semibold">{selectedInvoice.invoiceDate}</p></div>
                <div><span className="text-muted-foreground">GRN Reference</span><p className="font-mono font-semibold">{selectedInvoice.grnNumber}</p></div>
                <div><span className="text-muted-foreground">PO Reference</span><p className="font-mono font-semibold">{selectedInvoice.poNumber}</p></div>
                <div><span className="text-muted-foreground">Department</span><p className="font-semibold">{selectedInvoice.department}</p></div>
                <div><span className="text-muted-foreground">Items</span><p className="font-semibold">{selectedInvoice.itemCount} line items</p></div>
              </div>
              <div className="rounded-lg border p-3 space-y-2 bg-muted/30">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-bold">{fmt(selectedInvoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-semibold text-green-600">{fmt(selectedInvoice.amountPaid)}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-muted-foreground">Outstanding</span>
                  <span className="font-bold text-red-600">{fmt(selectedInvoice.totalAmount - selectedInvoice.amountPaid)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={selectedInvoice.status} />
                {selectedInvoice.postedToLedger
                  ? <Badge variant="outline" className="text-green-600 border-green-300">Posted to Ledger</Badge>
                  : <Badge variant="outline">Pending Posting</Badge>}
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1">Record Payment</Button>
                <Button variant="outline"><Printer className="h-4 w-4 mr-1" /> Print</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
