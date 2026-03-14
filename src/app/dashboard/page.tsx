'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  ShoppingCart,
  PackageCheck,
  FileText,
  Users,
  Building2,
  TrendingUp,
  AlertCircle,
  Clock,
  BarChart3,
  Boxes,
  ClipboardList,
  Truck,
  Receipt,
  CalendarDays,
  ChevronRight,
  Banknote,
  AlertTriangle,
  CreditCard,
  Bell,
  ArrowRight,
  TrendingDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Line,
} from 'recharts';
import {
  executiveKPIs,
  invoiceStatusBreakdown,
  supplierPayables,
  stockMovementByMonth,
  invoicesByMonth,
  poStatusBreakdown,
  grnStatusBreakdown,
  monthlyProcurementData,
  departmentActivity,
  priorityAlerts,
  kpiSparklines,
  inventoryCategories,
  operationalLedger,
  filterOptions,
  drillDownData,
  procurementDrillDown,
  type ProcurementRecord,
} from '@/lib/dashboard-mock-data';

const tooltipStyle = {
  backgroundColor: 'hsl(var(--background))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '12px',
};

const fmt = (n: number) =>
  n >= 1000000 ? `PKR ${(n / 1000000).toFixed(2)}M`
  : n >= 1000 ? `PKR ${(n / 1000).toFixed(0)}K`
  : `PKR ${n.toLocaleString()}`;

// ── Type badge ───────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: string }) {
  const s: Record<string, string> = {
    GRN: 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
    PO: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    PR: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
  };
  const label: Record<string, string> = { GRN: 'Goods Receipt', PO: 'Purchase Order', PR: 'Purchase Req.' };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${s[type] ?? 'bg-muted'}`}>{label[type] ?? type}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const s: Record<string, string> = {
    Approved: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
    Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
    Closed: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    Paid: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
    Unpaid: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
    Partial: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${s[status] ?? 'bg-muted'}`}>{status}</span>;
}

// ── Drill-down Modal ─────────────────────────────────────────────────────────
function DrillDownModal({
  open, onClose, data
}: {
  open: boolean;
  onClose: () => void;
  data: typeof drillDownData[keyof typeof drillDownData] | null;
}) {
  if (!data) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{data.title}</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto max-h-96">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {data.columns.map((col, i) => (
                  <th key={i} className="text-left py-2 px-3 font-medium text-muted-foreground text-xs">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, i) => (
                <tr key={i} className="border-b hover:bg-muted/30">
                  {row.map((cell, j) => (
                    <td key={j} className="py-2 px-3 text-sm">
                      {j === row.length - 1 ? <StatusBadge status={cell} /> : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Procurement Story Records Modal ─────────────────────────────────────────
function ProcurementModal({
  month, onClose,
}: {
  month: string | null;
  onClose: () => void;
}) {
  if (!month) return null;
  const records: ProcurementRecord[] = procurementDrillDown[month] ?? [];
  const counts = { GRN: 0, PO: 0, PR: 0 };
  records.forEach(r => { if (r.type in counts) counts[r.type as keyof typeof counts]++; });

  return (
    <Dialog open={!!month} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Procurement Records — {month} {month === 'Oct' || month === 'Nov' || month === 'Dec' ? '2025' : '2026'}
            <span className="text-xs font-normal text-muted-foreground flex gap-2">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 rounded">{counts.PO} POs</span>
              <span className="px-2 py-0.5 bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 rounded">{counts.GRN} GRNs</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 rounded">{counts.PR} PRs</span>
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-auto max-h-[28rem]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted/90 backdrop-blur-sm">
              <tr>
                {['Type', 'Doc Number', 'Date', 'Party / Dept', 'Amount', 'Status', 'Approved By', 'Action'].map(h => (
                  <th key={h} className="text-left py-2 px-3 font-medium text-muted-foreground text-xs whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((row, i) => (
                <tr key={i} className="border-t hover:bg-muted/20 transition-colors">
                  <td className="py-2 px-3"><TypeBadge type={row.type} /></td>
                  <td className="py-2 px-3 text-xs font-mono whitespace-nowrap">{row.ref}</td>
                  <td className="py-2 px-3 text-xs text-muted-foreground whitespace-nowrap">{row.date}</td>
                  <td className="py-2 px-3 text-xs whitespace-nowrap">{row.party}</td>
                  <td className="py-2 px-3 text-xs font-medium tabular-nums whitespace-nowrap">{row.amount}</td>
                  <td className="py-2 px-3"><StatusBadge status={row.status} /></td>
                  <td className="py-2 px-3 text-xs text-muted-foreground">{row.approvedBy}</td>
                  <td className="py-2 px-3">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-primary">
                      Print
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Clickable KPI Card ───────────────────────────────────────────────────────
function KPICard({
  title, value, subtitle, icon: Icon, spark, color,
  alert, href, onDrillDown, index,
}: {
  title: string; value: string; subtitle: string;
  icon: React.ElementType; spark: { value: number }[];
  color: string; alert?: boolean; href?: string;
  onDrillDown?: () => void; index: number;
}) {
  const content = (
    <Card className={`cursor-pointer group transition-all hover:shadow-md hover:scale-[1.02] ${alert ? 'border-amber-300 dark:border-amber-700' : 'hover:border-primary/40'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-muted-foreground leading-tight">{title}</p>
          <div className="p-1.5 rounded-md transition-colors group-hover:opacity-80" style={{ backgroundColor: `${color}22` }}>
            <Icon className="h-3.5 w-3.5" style={{ color }} />
          </div>
        </div>
        <p className={`text-2xl font-bold tabular-nums ${alert ? 'text-amber-600 dark:text-amber-400' : ''}`}>{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{subtitle}</p>
        <div className="h-8 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spark}>
              <defs>
                <linearGradient id={`sg-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} fill={`url(#sg-${index})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
          <span>View details</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      </CardContent>
    </Card>
  );

  if (onDrillDown) {
    return <div onClick={onDrillDown}>{content}</div>;
  }
  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

// ── Status Donut ─────────────────────────────────────────────────────────────
function StatusDonut({ title, subtitle, data }: { title: string; subtitle: string; data: { name: string; value: number; color: string }[] }) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <CardDescription className="text-xs">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={32} outerRadius={55} dataKey="value" startAngle={90} endAngle={450}>
                {data.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v: number, n: string) => [v, n]} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-1 text-xs">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-muted-foreground">{d.name}</span>
              <span className="font-semibold">{d.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function ExecutiveDashboard() {
  const [company, setCompany] = useState('All Companies');
  const [dateRange, setDateRange] = useState('This Month');
  const [warehouse, setWarehouse] = useState('All Warehouses');
  const [modalKey, setModalKey] = useState<keyof typeof drillDownData | null>(null);
  const [procurMonth, setProcurMonth] = useState<string | null>(null);

  const openDrill = (key: keyof typeof drillDownData) => setModalKey(key);
  const closeDrill = () => setModalKey(null);

  return (
    <div className="space-y-5">

      {/* ── Header + Filters ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline">Operations Dashboard</h1>
          <p className="text-muted-foreground text-xs mt-0.5">{company} · {dateRange} · {warehouse}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={company} onValueChange={setCompany}>
            <SelectTrigger className="w-44 h-8 text-xs">
              <Building2 className="h-3 w-3 mr-1 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.companies.map(c => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-36 h-8 text-xs">
              <CalendarDays className="h-3 w-3 mr-1 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.dateRanges.map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={warehouse} onValueChange={setWarehouse}>
            <SelectTrigger className="w-44 h-8 text-xs">
              <Boxes className="h-3 w-3 mr-1 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.warehouses.map(w => <SelectItem key={w} value={w} className="text-xs">{w}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Priority Alert Ticker ── */}
      <div className="flex items-center gap-3 rounded-xl border bg-card shadow-sm px-3 py-2.5 overflow-hidden">
        <div className="shrink-0 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Alerts</span>
          <div className="w-px h-4 bg-border shrink-0" />
        </div>
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {(() => {
            const hrefs = [
              '/dashboard/procurement/invoices',
              '/dashboard/approvals',
              '/dashboard/approvals',
              '/dashboard/procurement/supplier-payments',
              '/dashboard/procurement/vendors',
            ];
            return priorityAlerts.map((a, i) => (
              <Link
                key={i}
                href={hrefs[i] ?? '#'}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-all hover:opacity-75 hover:scale-[0.98] ${
                  a.priority === 'high'
                    ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300'
                    : a.priority === 'medium'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                    : 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  a.priority === 'high' ? 'bg-red-500 animate-pulse' :
                  a.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                }`} />
                {a.message}
              </Link>
            ));
          })()}
        </div>
      </div>

      {/* ── Section 1: Financial Summary Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Invoiced', value: fmt(executiveKPIs.totalInvoiced), sub: `${executiveKPIs.totalInvoices} invoices`, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20' },
          { label: 'Paid', value: fmt(executiveKPIs.paidAmount), sub: `${executiveKPIs.paidInvoices} invoices cleared`, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/20' },
          { label: 'Outstanding Payables', value: fmt(executiveKPIs.outstandingPayables), sub: `${executiveKPIs.unpaidInvoices} unpaid + ${executiveKPIs.partialInvoices} partial`, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/20' },
          { label: 'Pending Payments', value: fmt(executiveKPIs.pendingPaymentsAmount), sub: `${executiveKPIs.supplierPayments} supplier payments`, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/20' },
        ].map((item, i) => (
          <div key={i} className={`rounded-lg p-3 ${item.bg} cursor-pointer hover:opacity-80 transition-opacity`} onClick={() => openDrill('invoices')}>
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className={`text-lg font-bold tabular-nums ${item.color}`}>{item.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Section 2: KPI Cards (6 clickable) ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard index={0} title="Purchase Invoices" value={`${executiveKPIs.totalInvoices}`}
          subtitle={`${executiveKPIs.unpaidInvoices} unpaid`} icon={Receipt}
          spark={kpiSparklines.invoiced} color="#3B82F6" onDrillDown={() => openDrill('invoices')} />
        <KPICard index={1} title="Outstanding" value={fmt(executiveKPIs.outstandingPayables)}
          subtitle="Payables due to suppliers" icon={TrendingDown}
          spark={kpiSparklines.payables} color="#EF4444" alert onDrillDown={() => openDrill('payables')} />
        <KPICard index={2} title="Purchase Orders" value={`${executiveKPIs.purchaseOrders}`}
          subtitle={`${executiveKPIs.pendingPOs} pending approval`} icon={ShoppingCart}
          spark={kpiSparklines.pos} color="#14B8A6" onDrillDown={() => openDrill('purchaseOrders')} />
        <KPICard index={3} title="Active Suppliers" value={`${executiveKPIs.suppliers}`}
          subtitle="All approved" icon={Users}
          spark={kpiSparklines.suppliers} color="#EC4899" onDrillDown={() => openDrill('suppliers')} />
        <KPICard index={4} title="Catalog Items" value={executiveKPIs.totalItems.toLocaleString()}
          subtitle={`${executiveKPIs.itemCategories} categories`} icon={Package}
          spark={kpiSparklines.items} color="#8B5CF6" onDrillDown={() => openDrill('items')} />
        <KPICard index={5} title="Item Alerts" value={`${executiveKPIs.itemAlerts}`}
          subtitle="PR/PO notifications" icon={Bell}
          spark={kpiSparklines.alerts} color="#F97316" alert onDrillDown={() => openDrill('alerts')} />
      </div>

      {/* ── Section 3: Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Procurement Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />Procurement Activity
                </CardTitle>
                <CardDescription className="text-xs">Monthly PO value vs GRNs received · click a month bar to see records</CardDescription>
              </div>
              <span className="text-xs text-muted-foreground border rounded px-2 py-0.5 bg-muted/40 flex items-center gap-1">
                <ArrowRight className="h-3 w-3" />Click month
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64" style={{ cursor: 'pointer' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={monthlyProcurementData}
                  margin={{ top: 5, right: 25, left: 5, bottom: 5 }}
                  onClick={(data) => { if (data?.activeLabel) setProcurMonth(data.activeLabel as string); }}
                >
                  <defs>
                    <linearGradient id="poBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.85} />
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={11} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} fontSize={10} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}K`} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} fontSize={10} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n: string) => n === 'PO Amount' ? [`PKR ${v.toLocaleString()}`, n] : [v, n]} />
                  <Legend iconSize={9} wrapperStyle={{ fontSize: 11 }} />
                  <Bar yAxisId="left" dataKey="poAmount" fill="url(#poBar)" name="PO Amount" radius={[3, 3, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="grnCount" stroke="#8B5CF6" strokeWidth={2} name="GRNs Received" dot={{ r: 3 }} />
                  <Line yAxisId="right" type="monotone" dataKey="poCount" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="4 4" name="POs Issued" dot={{ r: 2 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Categories */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />Inventory by Category
            </CardTitle>
            <CardDescription className="text-xs">{executiveKPIs.totalItems.toLocaleString()} items · {executiveKPIs.itemCategories} categories</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1.5">
              {inventoryCategories.map((cat, i) => {
                const total = inventoryCategories.reduce((s, c) => s + c.items, 0);
                const pct = Math.round((cat.items / total) * 100);
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="truncate max-w-[130px]">{cat.name}</span>
                      </div>
                      <span className="font-semibold text-muted-foreground">{cat.items.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="h-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Section 4: Status Donuts + Invoice Status + Stock Movement ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatusDonut title="PO Status" subtitle={`${executiveKPIs.purchaseOrders} orders`} data={poStatusBreakdown} />
        <StatusDonut title="GRN Status" subtitle={`${executiveKPIs.grns} GRNs`} data={grnStatusBreakdown} />

        {/* Invoice Status */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-semibold">Invoice Status</CardTitle>
            <CardDescription className="text-xs">{executiveKPIs.totalInvoices} invoices total</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={invoiceStatusBreakdown} cx="50%" cy="50%" innerRadius={32} outerRadius={55} dataKey="value" startAngle={90} endAngle={450}>
                    {invoiceStatusBreakdown.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number, n: string) => [v, n]} contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
              {invoiceStatusBreakdown.map((d, i) => (
                <div key={i} className="flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="font-semibold">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stock Movement */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-semibold">Stock Movement</CardTitle>
            <CardDescription className="text-xs">{executiveKPIs.totalUnitsReceived.toLocaleString()} units in · {executiveKPIs.totalUnitsIssued} out</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockMovementByMonth.filter(m => m.unitsIn > 0 || m.unitsOut > 0)} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={10} />
                  <YAxis axisLine={false} tickLine={false} fontSize={9} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="unitsIn" fill="#10B981" name="Units In" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="unitsOut" fill="#EF4444" name="Units Out" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-1">
              <div className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-green-500" />In</div>
              <div className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-red-500" />Out</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Section 5: Supplier Payables Bar + Invoice Monthly ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Supplier Payables */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Banknote className="h-4 w-4 text-primary" />Supplier Payables
            </CardTitle>
            <CardDescription className="text-xs">Paid vs outstanding per supplier (real data)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={supplierPayables} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} fontSize={10} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}K`} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} fontSize={10} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`PKR ${v.toLocaleString()}`]} />
                  <Legend iconSize={9} wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="paid" fill="#10B981" name="Paid" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="unpaid" fill="#EF4444" name="Unpaid" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="partial" fill="#F59E0B" name="Partial" stackId="a" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Value by Month */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" />Invoice Value by Month
            </CardTitle>
            <CardDescription className="text-xs">Feb: PKR 1.27M · Mar: PKR 488K (real data)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={invoicesByMonth} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={11} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} fontSize={10} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}K`} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} fontSize={10} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n: string) => n === 'Invoice Value' ? [`PKR ${v.toLocaleString()}`, n] : [v, n]} />
                  <Legend iconSize={9} wrapperStyle={{ fontSize: 11 }} />
                  <Bar yAxisId="left" dataKey="netAmount" fill="url(#invGrad)" name="Invoice Value" radius={[3, 3, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="invoices" stroke="#8B5CF6" strokeWidth={2} name="# Invoices" dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Section 6: Department Activity + Operational Ledger ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />Department Activity
            </CardTitle>
            <CardDescription className="text-xs">Orders and requisitions by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentActivity.slice(0, 8)} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} fontSize={10} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={112} fontSize={10} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconSize={9} wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="orders" fill="#14B8A6" name="Orders" radius={[0, 2, 2, 0]} />
                  <Bar dataKey="requisitions" fill="#8B5CF6" name="Requisitions" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Operational Ledger */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />Operational Ledger
                </CardTitle>
                <CardDescription className="text-xs">Full audit trail — real transaction data</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" asChild>
                <Link href="/dashboard/approvals/history">Full Audit <ChevronRight className="h-3 w-3" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto max-h-64">
              <table className="w-full">
                <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm">
                  <tr>
                    {['Date', 'Type', 'Reference', 'Details', 'Status'].map(h => (
                      <th key={h} className="text-left px-3 py-1.5 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {operationalLedger.map((row, i) => (
                    <tr key={i} className="border-t hover:bg-muted/20 transition-colors">
                      <td className="px-3 py-1.5 text-xs text-muted-foreground whitespace-nowrap">{row.date}</td>
                      <td className="px-3 py-1.5"><TypeBadge type={row.type} /></td>
                      <td className="px-3 py-1.5 text-xs font-mono whitespace-nowrap">{row.ref}</td>
                      <td className="px-3 py-1.5 text-xs text-muted-foreground whitespace-nowrap">{row.details}</td>
                      <td className="px-3 py-1.5"><StatusBadge status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Section 7: Quick Actions ── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
          <CardDescription className="text-xs">Jump to key modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
            {[
              { label: 'Inventory', href: '/dashboard/inventory', icon: Boxes },
              { label: 'Purchase Orders', href: '/dashboard/procurement/purchase-orders', icon: ShoppingCart },
              { label: 'Requisitions', href: '/dashboard/procurement/requisitions', icon: ClipboardList },
              { label: 'Goods Receipt', href: '/dashboard/procurement/grn', icon: PackageCheck },
              { label: 'Invoices', href: '/dashboard/procurement/invoices', icon: Receipt },
              { label: 'Payments', href: '/dashboard/procurement/supplier-payments', icon: CreditCard },
              { label: 'Vendors', href: '/dashboard/procurement/vendors', icon: Truck },
              { label: 'Approvals', href: '/dashboard/approvals', icon: FileText },
              { label: 'Analytics', href: '/dashboard/procurement/analytics', icon: BarChart3 },
            ].map((a, i) => (
              <Button key={i} variant="outline" className="h-14 flex-col gap-1 text-xs" asChild>
                <Link href={a.href}>
                  <a.icon className="h-4 w-4" />
                  <span className="text-center leading-tight">{a.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Drill-down Modal (KPI cards) ── */}
      <DrillDownModal
        open={modalKey !== null}
        onClose={closeDrill}
        data={modalKey ? drillDownData[modalKey] : null}
      />

      {/* ── Procurement Story Records Modal (chart click) ── */}
      <ProcurementModal month={procurMonth} onClose={() => setProcurMonth(null)} />

    </div>
  );
}
