'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CreditCard,
  CheckCircle,
  ClipboardList,
  ShoppingBag,
  PackageCheck,
  Receipt,
  Plus,
  Banknote,
  CalendarDays,
  Building2,
} from "lucide-react";

const workflowSteps = [
  { label: "Requisition", icon: ClipboardList, done: true },
  { label: "Approval",    icon: CheckCircle,  done: true },
  { label: "Purchase Order", icon: ShoppingBag, done: true },
  { label: "Goods Receipt",  icon: PackageCheck, done: true },
  { label: "Invoicing",   icon: Receipt,      done: true },
  { label: "Payment",     icon: CreditCard,   done: false, active: true },
];

const mockOutstandingInvoices = [
  { id: 7,  invoiceNumber: "PINV-202602-0002", date: "2026-02-18", supplier: "Al-Madina",      total: 33600.00, paid: 0,       outstanding: 33600.00 },
  { id: 3,  invoiceNumber: "PINV-202603-0006", date: "2026-03-04", supplier: "ALI",             total: 1427.80,  paid: 0,       outstanding: 1427.80  },
  { id: 2,  invoiceNumber: "PINV-202603-0007", date: "2026-03-04", supplier: "ALI",             total: 7327.80,  paid: 0,       outstanding: 7327.80  },
  { id: 5,  invoiceNumber: "PINV-202602-0004", date: "2026-02-25", supplier: "SALEEM BHAI",     total: 18750.00, paid: 10000.00, outstanding: 8750.00 },
];

const mockPaymentHistory = [
  { id: 1, paymentRef: "PMT-202603-0001", supplier: "ALI",            date: "2026-03-04", amount: 289100.00, mode: "Cheque",   chequeNo: "CHQ-00112", status: "Cleared" },
  { id: 2, paymentRef: "PMT-202602-0003", supplier: "LOCAL SUPPLIER", date: "2026-02-28", amount: 45200.00,  mode: "Bank Transfer", chequeNo: "TRF-00089", status: "Cleared" },
  { id: 3, paymentRef: "PMT-202602-0002", supplier: "CHICKEN SUPPLIER", date: "2026-02-20", amount: 92400.00, mode: "Cheque",  chequeNo: "CHQ-00108", status: "Cleared" },
  { id: 4, paymentRef: "PMT-202602-0001", supplier: "SALEEM BHAI",    date: "2026-02-25", amount: 10000.00,  mode: "Cash",     chequeNo: "-",         status: "Cleared" },
];

const suppliers = ["ALI", "LOCAL SUPPLIER", "SALEEM BHAI", "CHICKEN SUPPLIER", "Al-Madina"];

const fmt = (n: number) => `Rs. ${n.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`;

export default function SupplierPaymentsPage() {
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [paymentMode, setPaymentMode] = useState('CASH');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [referenceNo, setReferenceNo] = useState('');
  const [remarks, setRemarks] = useState('');
  const [paymentDate, setPaymentDate] = useState('2026-03-14');
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [allocations, setAllocations] = useState<Record<number, boolean>>({});

  const filteredInvoices = selectedSupplier
    ? mockOutstandingInvoices.filter(i => i.supplier === selectedSupplier)
    : mockOutstandingInvoices;

  const totalAllocated = filteredInvoices
    .filter(i => allocations[i.id])
    .reduce((s, i) => s + i.outstanding, 0);

  const toggleAllocation = (id: number) =>
    setAllocations(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Supplier Payment</h1>
        <p className="text-muted-foreground text-sm">Record payments to vendors and settle invoices.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {(['new', 'history'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'new' ? 'New Payment Voucher' : 'Payment History'}
          </button>
        ))}
      </div>

      {activeTab === 'new' && (
        <div className="space-y-5">
          {/* Workflow Stepper */}
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-full mb-2 flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> Procurement Workflow
                  <span className="ml-auto font-normal text-blue-600">Current Status: Invoiced</span>
                </p>
                {workflowSteps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.label} className="flex items-center gap-1">
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold
                          ${step.done ? 'bg-green-500 border-green-500 text-white'
                            : step.active ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-muted border-muted-foreground/30 text-muted-foreground'}`}>
                          {step.done
                            ? <CheckCircle className="h-4 w-4" />
                            : <span>{i + 1}</span>}
                        </div>
                        <span className={`text-[10px] font-medium text-center max-w-[56px] leading-tight
                          ${step.active ? 'text-blue-600' : step.done ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {step.label}
                        </span>
                      </div>
                      {i < workflowSteps.length - 1 && (
                        <div className={`h-0.5 w-6 mx-0.5 mb-4 ${step.done ? 'bg-green-400' : 'bg-muted-foreground/20'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <strong>NEXT STEP:</strong>{' '}
                <span className="text-primary cursor-pointer hover:underline">Payment</span>{' '}
                <span className="text-muted-foreground">(Pending with Cashier)</span>
              </p>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                New Payment Voucher
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide">Supplier</Label>
                  <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                    <SelectTrigger>
                      <SelectValue placeholder="-- Select Supplier --" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide">Payment Date</Label>
                  <Input
                    type="date"
                    value={paymentDate}
                    onChange={e => setPaymentDate(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide">Payment Mode</Label>
                  <Select value={paymentMode} onValueChange={setPaymentMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">CASH</SelectItem>
                      <SelectItem value="CHEQUE">CHEQUE</SelectItem>
                      <SelectItem value="BANK_TRANSFER">BANK TRANSFER</SelectItem>
                      <SelectItem value="ONLINE">ONLINE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide">Reference No</Label>
                  <Input
                    placeholder="Cheque # / Trans ID"
                    value={referenceNo}
                    onChange={e => setReferenceNo(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide">Enter Payment Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm text-muted-foreground font-medium">Rs</span>
                    <Input
                      className="pl-9"
                      type="number"
                      placeholder="0.00"
                      value={paymentAmount}
                      onChange={e => setPaymentAmount(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Enter total amount being paid now.</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide">Remarks</Label>
                  <Textarea
                    placeholder="Notes..."
                    rows={2}
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                  />
                </div>
              </div>

              {/* Outstanding Invoices */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Outstanding Invoices (Auto-Allocation)</h3>
                {filteredInvoices.length > 0 ? (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-10"></TableHead>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-right">Paid</TableHead>
                          <TableHead className="text-right">Outstanding</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInvoices.map(inv => (
                          <TableRow key={inv.id}
                            className={`cursor-pointer ${allocations[inv.id] ? 'bg-primary/5' : ''}`}
                            onClick={() => toggleAllocation(inv.id)}>
                            <TableCell>
                              <input type="checkbox" checked={!!allocations[inv.id]} readOnly className="cursor-pointer" />
                            </TableCell>
                            <TableCell className="font-mono text-xs font-semibold">{inv.invoiceNumber}</TableCell>
                            <TableCell className="text-sm">{inv.date}</TableCell>
                            <TableCell className="text-right text-sm">{fmt(inv.total)}</TableCell>
                            <TableCell className="text-right text-sm text-green-600">{fmt(inv.paid)}</TableCell>
                            <TableCell className="text-right font-semibold text-red-600">{fmt(inv.outstanding)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                    Select a supplier to view outstanding invoices
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-sm">
                  Total Allocated:{' '}
                  <span className="font-bold text-primary text-base">{fmt(totalAllocated)}</span>
                </p>
                <Button size="lg" disabled={!selectedSupplier || !paymentAmount}>
                  <Banknote className="h-4 w-4 mr-2" />
                  Process Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment Ref</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Cheque / Trans</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPaymentHistory.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs font-semibold text-primary">{p.paymentRef}</TableCell>
                    <TableCell className="font-medium">{p.supplier}</TableCell>
                    <TableCell className="text-sm">{p.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{p.mode}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.chequeNo}</TableCell>
                    <TableCell className="text-right font-semibold">{fmt(p.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-500/15 text-green-700 border-green-200 text-xs">
                        {p.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
