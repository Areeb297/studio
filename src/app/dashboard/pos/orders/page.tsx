'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Search, Eye, Printer, Receipt, TrendingUp, ShoppingBag, Banknote,
  Users, Filter, FileText, CheckSquare, Square, BarChart3, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockOrders = [
  { id: 1,  invoiceNo: "INV-509695", date: "28/03/2026", time: "10:36 AM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "TA",  guests: 0, itemCount: 1, amount: 620,   approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 620,   payment: "Cash",        status: "Paid"          },
  { id: 2,  invoiceNo: "INV-509698", date: "28/03/2026", time: "11:46 AM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-4", guests: 3, itemCount: 3, amount: 2860,  approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 2860,  payment: "Cash",        status: "Paid"          },
  { id: 3,  invoiceNo: "INV-509699", date: "28/03/2026", time: "11:47 AM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-23",guests: 1, itemCount: 2, amount: 210,   approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 210,   payment: "Cash",        status: "Paid"          },
  { id: 4,  invoiceNo: "INV-509700", date: "28/03/2026", time: "11:49 AM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-22",guests: 2, itemCount: 2, amount: 440,   approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 440,   payment: "Cash",        status: "Paid"          },
  { id: 5,  invoiceNo: "INV-509704", date: "28/03/2026", time: "12:19 PM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-4", guests: 1, itemCount: 1, amount: 700,   approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 700,   payment: "Credit Card", status: "Paid"          },
  { id: 6,  invoiceNo: "INV-509720", date: "28/03/2026", time: "12:54 PM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-2", guests: 2, itemCount: 4, amount: 2630,  approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 2630,  payment: "Credit Card", status: "Paid"          },
  { id: 7,  invoiceNo: "INV-509731", date: "28/03/2026", time: "01:15 PM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-26",guests: 2, itemCount: 6, amount: 1350,  approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 1350,  payment: "Cash",        status: "Paid"          },
  { id: 8,  invoiceNo: "INV-509736", date: "28/03/2026", time: "01:22 PM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-4", guests: 1, itemCount: 2, amount: 750,   approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 750,   payment: "Cash",        status: "Paid"          },
  { id: 9,  invoiceNo: "INV-509738", date: "28/03/2026", time: "01:24 PM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-23",guests: 2, itemCount: 3, amount: 2020,  approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 2020,  payment: "Cash",        status: "Paid"          },
  { id: 10, invoiceNo: "INV-509750", date: "28/03/2026", time: "01:51 PM", customer: "JBA Staff",        costCentre: "Binoria Restaurant",           table: "T-18",guests: 2, itemCount: 5, amount: 2630,  approvedBy: "FARHAN", discPct: 10.0, discAmt: 265, taxPct: 0, taxAmt: 0, tip: 0, total: 2365,  payment: "Cash",        status: "Paid"          },
  { id: 11, invoiceNo: "INV-509756", date: "28/03/2026", time: "02:04 PM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-10",guests: 3, itemCount: 3, amount: 2430,  approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 2430,  payment: "Cash",        status: "Paid"          },
  { id: 12, invoiceNo: "INV-509757", date: "28/03/2026", time: "02:06 PM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-23",guests: 1, itemCount: 1, amount: 900,   approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 900,   payment: "Cash",        status: "Paid"          },
  { id: 13, invoiceNo: "INV-509758", date: "28/03/2026", time: "02:07 PM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-5", guests: 5, itemCount: 3, amount: 3820,  approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 3820,  payment: "Cash",        status: "Paid"          },
  { id: 14, invoiceNo: "INV-509760", date: "28/03/2026", time: "02:09 PM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-24",guests: 4, itemCount: 8, amount: 3510,  approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 3510,  payment: "Cash",        status: "Paid"          },
  { id: 15, invoiceNo: "INV-509763", date: "28/03/2026", time: "02:15 PM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-26",guests: 3, itemCount: 5, amount: 2030,  approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 2030,  payment: "Cash",        status: "Paid"          },
  { id: 16, invoiceNo: "INV-509768", date: "28/03/2026", time: "02:27 PM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-27",guests: 5, itemCount: 7, amount: 7620,  approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 7620,  payment: "Credit Card", status: "Paid"          },
  { id: 17, invoiceNo: "INV-509769", date: "28/03/2026", time: "02:27 PM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-21",guests: 3, itemCount: 8, amount: 2070,  approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 2070,  payment: "Cash",        status: "Paid"          },
  { id: 18, invoiceNo: "INV-509770", date: "28/03/2026", time: "02:28 PM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-3", guests: 3, itemCount: 10, amount: 3520, approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 3520,  payment: "Cash",        status: "Paid"          },
  { id: 19, invoiceNo: "INV-509771", date: "28/03/2026", time: "02:28 PM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-2", guests: 4, itemCount: 3, amount: 4380,  approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 4380,  payment: "Cash",        status: "Paid"          },
  { id: 20, invoiceNo: "INV-509772", date: "28/03/2026", time: "02:29 PM", customer: "Walking Customer", costCentre: "Binoria Restaurant (Take Away)", table: "TA", guests: 0, itemCount: 5, amount: 2270,  approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 2270,  payment: "Cash",        status: "Paid"          },
  { id: 21, invoiceNo: "INV-509775", date: "28/03/2026", time: "02:36 PM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-12",guests: 4, itemCount: 8, amount: 5620,  approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 5620,  payment: "Credit Card", status: "Paid"          },
  { id: 22, invoiceNo: "INV-509780", date: "28/03/2026", time: "02:55 PM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-9", guests: 2, itemCount: 4, amount: 1840,  approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 1840,  payment: "Cash",        status: "Void"          },
  { id: 23, invoiceNo: "INV-509783", date: "28/03/2026", time: "03:02 PM", customer: "Walking Customer", costCentre: "Binoria Restaurant",           table: "T-3", guests: 3, itemCount: 6, amount: 3480,  approvedBy: "",       discPct: 0,    discAmt: 0,   taxPct: 0, taxAmt: 0, tip: 0, total: 3480,  payment: "Cash",        status: "Paid"          },
];

const COST_CENTRES = ['ALL', 'Binoria Restaurant', 'Binoria Restaurant (Take Away)', 'KOT-2 Beverage', 'Counter C'];
const TABLES = ['ALL', 'T-1','T-2','T-3','T-4','T-5','T-6','T-7','T-8','T-9','T-10','T-12','T-18','T-21','T-22','T-23','T-24','T-25','T-26','T-27','T-28','TA'];

const statusColors: Record<string, string> = {
  Paid:  "bg-green-500/15 text-green-700 dark:text-green-400",
  Void:  "bg-red-500/15 text-red-700 dark:text-red-400",
  Cancelled: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
};

const paymentColors: Record<string, string> = {
  Cash:           "text-green-700 dark:text-green-400",
  Credit:         "text-blue-700 dark:text-blue-400",
  "Credit Card":  "text-purple-700 dark:text-purple-400",
  "Food Voucher": "text-amber-700 dark:text-amber-400",
};

type ReportType = 'summary' | 'detail' | 'item-wise' | 'day-wise';
type StatusFilter = 'all' | 'void' | 'unvoid';

export default function SalesReportPage() {
  // ── Filter state ─────────────────────────────────────────────────────────
  const [fromDate,      setFromDate]      = useState('28/03/2026');
  const [tillDate,      setTillDate]      = useState('28/03/2026');
  const [tableFilter,   setTableFilter]   = useState('ALL');
  const [customerFilter,setCustomerFilter]= useState('');
  const [invoiceFilter, setInvoiceFilter] = useState('');
  const [costCentreFilter, setCostCentreFilter] = useState('ALL');
  const [itemsFilter,   setItemsFilter]   = useState('');
  const [withPayments,  setWithPayments]  = useState(false);
  const [statusFilter,  setStatusFilter]  = useState<StatusFilter>('unvoid');
  const [reportType,    setReportType]    = useState<ReportType>('summary');
  const [generated,     setGenerated]     = useState(false);

  // ── Receipt dialog ───────────────────────────────────────────────────────
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);

  // ── Filtered & computed ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!generated) return [];
    return mockOrders.filter(o => {
      const matchTable  = tableFilter === 'ALL' || o.table === tableFilter;
      const matchCust   = !customerFilter.trim() || o.customer.toLowerCase().includes(customerFilter.toLowerCase());
      const matchInv    = !invoiceFilter.trim() || o.invoiceNo.toLowerCase().includes(invoiceFilter.toLowerCase());
      const matchCentre = costCentreFilter === 'ALL' || o.costCentre === costCentreFilter;
      const matchStatus = statusFilter === 'all' ? true : statusFilter === 'void' ? o.status === 'Void' : o.status !== 'Void';
      return matchTable && matchCust && matchInv && matchCentre && matchStatus;
    });
  }, [generated, tableFilter, customerFilter, invoiceFilter, costCentreFilter, statusFilter]);

  const totalAmount  = filtered.reduce((s, o) => s + o.amount, 0);
  const totalDisc    = filtered.reduce((s, o) => s + o.discAmt, 0);
  const totalTax     = filtered.reduce((s, o) => s + o.taxAmt, 0);
  const totalTip     = filtered.reduce((s, o) => s + o.tip, 0);
  const grandTotal   = filtered.reduce((s, o) => s + o.total, 0);
  const totalCash    = filtered.filter(o => o.payment === 'Cash').reduce((s, o) => s + o.total, 0);
  const totalCredit  = filtered.filter(o => o.payment === 'Credit').reduce((s, o) => s + o.total, 0);
  const totalCard    = filtered.filter(o => o.payment === 'Credit Card').reduce((s, o) => s + o.total, 0);
  const totalOther   = filtered.filter(o => !['Cash','Credit','Credit Card'].includes(o.payment)).reduce((s, o) => s + o.total, 0);

  // ── Summary stats (visible before generate) ──────────────────────────────
  const allUnvoid = mockOrders.filter(o => o.status !== 'Void');
  const statsRevenue = allUnvoid.reduce((s, o) => s + o.total, 0);
  const statsCash    = allUnvoid.filter(o => o.payment === 'Cash').reduce((s, o) => s + o.total, 0);
  const statsCard    = allUnvoid.filter(o => o.payment === 'Credit Card').reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" /> Sales Report
          </h1>
          <p className="text-muted-foreground text-sm">Generate and print detailed sales summaries</p>
        </div>
      </div>

      {/* Summary KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Today's Revenue", value: `Rs. ${statsRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-green-600" },
          { label: "Total Invoices",  value: allUnvoid.length,                       icon: ShoppingBag, color: "text-blue-600" },
          { label: "Cash Sales",      value: `Rs. ${statsCash.toLocaleString()}`,    icon: Banknote,   color: "text-amber-600" },
          { label: "Card Sales",      value: `Rs. ${statsCard.toLocaleString()}`,    icon: Users,      color: "text-purple-600" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4 flex items-start gap-3">
              <s.icon className={`h-7 w-7 mt-0.5 ${s.color}`} />
              <div>
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Filter Panel ─────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-4 space-y-4">
          {/* Generate / Print buttons */}
          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5" onClick={() => setGenerated(true)}>
              <Filter className="h-3.5 w-3.5" /> Generate
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5">
              <Printer className="h-3.5 w-3.5" /> Print
            </Button>
            {generated && (
              <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground" onClick={() => setGenerated(false)}>
                <X className="h-3.5 w-3.5" /> Clear
              </Button>
            )}
            {generated && (
              <Badge variant="secondary" className="ml-auto">{filtered.length} invoices</Badge>
            )}
          </div>

          {/* Row 1: dates + table + customer */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground mb-1 block">From Date</Label>
              <Input value={fromDate} onChange={e => setFromDate(e.target.value)} placeholder="DD/MM/YYYY" className="h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Till Date</Label>
              <Input value={tillDate} onChange={e => setTillDate(e.target.value)} placeholder="DD/MM/YYYY" className="h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Table</Label>
              <Select value={tableFilter} onValueChange={setTableFilter}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TABLES.map(t => <SelectItem key={t} value={t} className="text-sm">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Customer</Label>
              <Input value={customerFilter} onChange={e => setCustomerFilter(e.target.value)} placeholder="Search customer…" className="h-8 text-sm" />
            </div>
          </div>

          {/* Row 2: Invoice No + Cost Centre + Items + With Payments */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Invoice No</Label>
              <Input value={invoiceFilter} onChange={e => setInvoiceFilter(e.target.value)} placeholder="INV-509xxx" className="h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Cost Centre</Label>
              <Select value={costCentreFilter} onValueChange={setCostCentreFilter}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COST_CENTRES.map(c => <SelectItem key={c} value={c} className="text-sm">{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Items</Label>
              <Input value={itemsFilter} onChange={e => setItemsFilter(e.target.value)} placeholder="Search item…" className="h-8 text-sm" />
            </div>
            <div className="flex items-end pb-0.5">
              <button
                onClick={() => setWithPayments(p => !p)}
                className="flex items-center gap-2 text-sm font-medium text-foreground"
                aria-pressed={withPayments}
              >
                {withPayments
                  ? <CheckSquare className="h-4 w-4 text-primary" />
                  : <Square className="h-4 w-4 text-muted-foreground" />
                }
                With Payments
              </button>
            </div>
          </div>

          {/* Row 3: Status + Report Type */}
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {/* Status */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Status</p>
              <div className="flex items-center gap-4">
                {(['all', 'void', 'unvoid'] as StatusFilter[]).map(s => (
                  <label key={s} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <span className={cn('flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors',
                      statusFilter === s ? 'border-primary' : 'border-muted-foreground/40')}>
                      {statusFilter === s && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </span>
                    <span className="capitalize">{s === 'unvoid' ? 'Unvoid' : s === 'void' ? 'Void' : 'All'}</span>
                  </label>
                ))}
              </div>
            </div>

            <Separator orientation="vertical" className="h-10 hidden md:block" />

            {/* Report Type */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Report Type</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {([
                  { id: 'summary',   label: 'Summary'          },
                  { id: 'detail',    label: 'Detail'            },
                  { id: 'item-wise', label: 'Item Wise Summary' },
                  { id: 'day-wise',  label: 'Day Wise Summary'  },
                ] as { id: ReportType; label: string }[]).map(rt => (
                  <label key={rt.id} className="flex items-center gap-1.5 text-sm cursor-pointer" onClick={() => setReportType(rt.id)}>
                    <span className={cn('flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors',
                      reportType === rt.id ? 'border-primary' : 'border-muted-foreground/40')}>
                      {reportType === rt.id && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </span>
                    {rt.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Results Table ─────────────────────────────────────────────────── */}
      {generated && (
        <Card>
          <CardContent className="pt-4 p-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm font-medium text-muted-foreground">No invoices match your filters</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground">S#</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Invoice#</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Date</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Time</th>
                        <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Customer</th>
                        <th className="px-2 py-2 text-center font-semibold text-muted-foreground">CC</th>
                        <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Table</th>
                        <th className="px-2 py-2 text-center font-semibold text-muted-foreground">#G</th>
                        <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Items</th>
                        <th className="px-3 py-2 text-right font-semibold text-muted-foreground">Amount</th>
                        <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Appr. By</th>
                        <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Disc%</th>
                        <th className="px-3 py-2 text-right font-semibold text-muted-foreground">Disc Amt</th>
                        <th className="px-2 py-2 text-center font-semibold text-muted-foreground">Tax%</th>
                        <th className="px-3 py-2 text-right font-semibold text-muted-foreground">Tax Amt</th>
                        <th className="px-3 py-2 text-right font-semibold text-muted-foreground">Tip</th>
                        <th className="px-3 py-2 text-right font-semibold text-muted-foreground">Total</th>
                        {withPayments && <th className="px-3 py-2 text-center font-semibold text-muted-foreground">Payment</th>}
                        <th className="px-3 py-2 text-center font-semibold text-muted-foreground">Status</th>
                        <th className="px-3 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((o, idx) => (
                        <tr key={o.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="px-3 py-2 text-muted-foreground">{idx + 1}</td>
                          <td className="px-3 py-2 font-medium text-primary whitespace-nowrap">{o.invoiceNo}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{o.date}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{o.time}</td>
                          <td className="px-3 py-2 max-w-[120px] truncate">{o.customer}</td>
                          <td className="px-2 py-2 text-center">
                            <span className="text-[10px] font-bold">
                              {o.costCentre === 'Binoria Restaurant (Take Away)' ? 'BR-TA' : o.costCentre === 'Binoria Restaurant' ? 'BR' : o.costCentre.substring(0, 4)}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-center font-medium">{o.table}</td>
                          <td className="px-2 py-2 text-center text-muted-foreground">{o.guests || '—'}</td>
                          <td className="px-2 py-2 text-center text-muted-foreground">{o.itemCount}</td>
                          <td className="px-3 py-2 text-right tabular-nums font-medium">{o.amount.toLocaleString()}</td>
                          <td className="px-2 py-2 text-center text-xs">{o.approvedBy || '—'}</td>
                          <td className="px-2 py-2 text-center text-muted-foreground">{o.discPct > 0 ? `${o.discPct}%` : '0'}</td>
                          <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{o.discAmt > 0 ? o.discAmt.toLocaleString() : '0'}</td>
                          <td className="px-2 py-2 text-center text-muted-foreground">{o.taxPct > 0 ? `${o.taxPct}%` : '0'}</td>
                          <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{o.taxAmt > 0 ? o.taxAmt.toLocaleString() : '0'}</td>
                          <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{o.tip > 0 ? o.tip.toLocaleString() : '0'}</td>
                          <td className="px-3 py-2 text-right tabular-nums font-bold">{o.total.toLocaleString()}</td>
                          {withPayments && (
                            <td className="px-3 py-2 text-center">
                              <span className={cn("font-medium", paymentColors[o.payment] ?? "text-foreground")}>{o.payment}</span>
                            </td>
                          )}
                          <td className="px-3 py-2 text-center">
                            <Badge className={cn("text-[10px] px-1.5 py-0", statusColors[o.status] ?? "bg-muted text-muted-foreground")}>{o.status}</Badge>
                          </td>
                          <td className="px-2 py-2">
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setSelectedOrder(o)} aria-label="View invoice">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    {/* Totals row */}
                    <tfoot>
                      <tr className="border-t-2 bg-muted/40 font-bold">
                        <td colSpan={9} className="px-3 py-2 text-right text-xs text-muted-foreground">
                          Total ({filtered.length} invoices):
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">{totalAmount.toLocaleString()}</td>
                        <td />
                        <td />
                        <td className="px-3 py-2 text-right tabular-nums text-destructive">{totalDisc > 0 ? totalDisc.toLocaleString() : '0'}</td>
                        <td />
                        <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{totalTax > 0 ? totalTax.toLocaleString() : '0'}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{totalTip > 0 ? totalTip.toLocaleString() : '0'}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-primary text-sm">{grandTotal.toLocaleString()}</td>
                        {withPayments && <td />}
                        <td />
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Payment summary footer */}
                <div className="flex flex-wrap items-center gap-6 border-t bg-muted/20 px-4 py-3">
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Cash</span>
                    <span className="font-bold text-green-700 dark:text-green-400 tabular-nums">{totalCash.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Credit</span>
                    <span className="font-bold tabular-nums">{totalCredit.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Credit Card</span>
                    <span className="font-bold text-purple-700 dark:text-purple-400 tabular-nums">{totalCard.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Other</span>
                    <span className="font-bold tabular-nums">{totalOther.toLocaleString()}</span>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 text-sm">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Grand Total</span>
                    <span className="text-base font-extrabold text-primary tabular-nums">Rs.{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Invoice detail dialog ─────────────────────────────────────────── */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" />
              {selectedOrder?.invoiceNo}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Date:</span> <span className="font-medium">{selectedOrder.date} {selectedOrder.time}</span></div>
                <div><span className="text-muted-foreground">Table:</span> <span className="font-medium">{selectedOrder.table}</span></div>
                <div><span className="text-muted-foreground">Customer:</span> <span className="font-medium">{selectedOrder.customer}</span></div>
                <div><span className="text-muted-foreground">Guests:</span> <span className="font-medium">{selectedOrder.guests || '—'}</span></div>
                <div><span className="text-muted-foreground">Cost Centre:</span> <span className="font-medium">{selectedOrder.costCentre}</span></div>
                <div><span className="text-muted-foreground">Payment:</span> <span className={cn("font-medium", paymentColors[selectedOrder.payment])}>{selectedOrder.payment}</span></div>
              </div>
              <Separator />
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Items Count</span><span>{selectedOrder.itemCount}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="tabular-nums">Rs.{selectedOrder.amount.toLocaleString()}</span></div>
                {selectedOrder.discAmt > 0 && (
                  <div className="flex justify-between text-destructive"><span>Discount ({selectedOrder.discPct}%) — {selectedOrder.approvedBy}</span><span>-Rs.{selectedOrder.discAmt.toLocaleString()}</span></div>
                )}
                {selectedOrder.taxAmt > 0 && (
                  <div className="flex justify-between text-muted-foreground"><span>Tax ({selectedOrder.taxPct}%)</span><span>Rs.{selectedOrder.taxAmt.toLocaleString()}</span></div>
                )}
                {selectedOrder.tip > 0 && (
                  <div className="flex justify-between text-muted-foreground"><span>Tip</span><span>Rs.{selectedOrder.tip.toLocaleString()}</span></div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-sm"><span>Total</span><span className="tabular-nums text-primary">Rs.{selectedOrder.total.toLocaleString()}</span></div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" className="flex-1 gap-1.5"><Printer className="h-3.5 w-3.5" /> Print</Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1.5"><FileText className="h-3.5 w-3.5" /> Reprint KOT</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
