'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Flame, Printer, Filter, X, CheckSquare, Square } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock KOT Data (matching RPOS format) ────────────────────────────────────

const mockKOTs = [
  // Order 20260328-126 — T-1
  { id: 1,  date: "28/03/2026", table: "T-1",  category: "Fast Food (Burger & Sandwich)", orderNo: "20260328-126", kotNo: 1, item: "CHICKEN SANDWICH",         qty: 1, kotStatus: "KOT order placed to Kitchen", void: "NO", costCentre: "Binoria Restaurant", kitchen: "Kitchen-1", verifyStatus: "verify" },
  { id: 2,  date: "28/03/2026", table: "T-1",  category: "Pizza",                          orderNo: "20260328-126", kotNo: 2, item: "FAJITA PIZZA 12\"",          qty: 1, kotStatus: "KOT order placed to Kitchen", void: "NO", costCentre: "Binoria Restaurant", kitchen: "Kitchen-1", verifyStatus: "verify" },
  { id: 3,  date: "28/03/2026", table: "T-1",  category: "Biryani & Handi",                orderNo: "20260328-126", kotNo: 3, item: "CHICKEN BIRYANI (1 PC)",     qty: 1, kotStatus: "KOT order placed to Kitchen", void: "NO", costCentre: "Binoria Restaurant", kitchen: "Kitchen-2", verifyStatus: "verify" },
  // Order 20260328-128 — T-28
  { id: 4,  date: "28/03/2026", table: "T-28", category: "Salad/Raita",                    orderNo: "20260328-128", kotNo: 3, item: "RAITA",                     qty: 1, kotStatus: "KOT order placed to Kitchen", void: "NO", costCentre: "Binoria Restaurant", kitchen: "Kitchen-1", verifyStatus: "verify" },
  { id: 5,  date: "28/03/2026", table: "T-28", category: "Salad/Raita",                    orderNo: "20260328-128", kotNo: 4, item: "GREEN SALAD",                qty: 1, kotStatus: "KOT order placed to Kitchen", void: "NO", costCentre: "Binoria Restaurant", kitchen: "Kitchen-1", verifyStatus: "verify" },
  { id: 6,  date: "28/03/2026", table: "T-28", category: "Beverages",                      orderNo: "20260328-128", kotNo: 6, item: "PAKOLA M. WATER (L)",        qty: 1, kotStatus: "KOT order placed to Kitchen", void: "NO", costCentre: "KOT-2 Beverage",   kitchen: "KOT-2 Beverage", verifyStatus: "verify" },
  { id: 7,  date: "28/03/2026", table: "T-28", category: "Pakistani Cuisine",               orderNo: "20260328-128", kotNo: 1, item: "PALAK PANEER",               qty: 1, kotStatus: "KOT order placed to Kitchen", void: "NO", costCentre: "Binoria Restaurant", kitchen: "Kitchen-2", verifyStatus: "verify" },
  { id: 8,  date: "28/03/2026", table: "T-28", category: "Bar B Que",                       orderNo: "20260328-128", kotNo: 2, item: "MALAI BOTI",                 qty: 1, kotStatus: "KOT order placed to Kitchen", void: "NO", costCentre: "Binoria Restaurant", kitchen: "Kitchen-2", verifyStatus: "verify" },
  { id: 9,  date: "28/03/2026", table: "T-28", category: "Nan",                             orderNo: "20260328-128", kotNo: 5, item: "CHAPATI",                    qty: 5, kotStatus: "KOT order placed to Kitchen", void: "NO", costCentre: "Binoria Restaurant", kitchen: "Kitchen-1", verifyStatus: "verify" },
  // Order 20260328-129 — T-21
  { id: 10, date: "28/03/2026", table: "T-21", category: "Fast Food (Burger & Sandwich)",   orderNo: "20260328-129", kotNo: 1, item: "FRENCH FRIES",               qty: 1, kotStatus: "KOT order placed to Kitchen", void: "NO", costCentre: "Binoria Restaurant", kitchen: "Kitchen-1", verifyStatus: "verify" },
  // Order 20260328-130 — T-4
  { id: 11, date: "28/03/2026", table: "T-4",  category: "Biryani & Handi",                orderNo: "20260328-130", kotNo: 1, item: "B.B.Q MATKA BIRYANI",        qty: 3, kotStatus: "KOT order placed to Kitchen", void: "NO", costCentre: "Binoria Restaurant", kitchen: "Kitchen-2", verifyStatus: "unverify" },
  { id: 12, date: "28/03/2026", table: "T-4",  category: "Salad/Raita",                    orderNo: "20260328-130", kotNo: 2, item: "RAITA",                     qty: 1, kotStatus: "KOT order placed to Kitchen", void: "NO", costCentre: "Binoria Restaurant", kitchen: "Kitchen-1", verifyStatus: "unverify" },
  { id: 13, date: "28/03/2026", table: "T-4",  category: "Salad/Raita",                    orderNo: "20260328-130", kotNo: 3, item: "GREEN SALAD",                qty: 1, kotStatus: "KOT order placed to Kitchen", void: "NO", costCentre: "Binoria Restaurant", kitchen: "Kitchen-1", verifyStatus: "unverify" },
  { id: 14, date: "28/03/2026", table: "T-4",  category: "Beverages",                      orderNo: "20260328-130", kotNo: 4, item: "PAKOLA M. WATER (L)",        qty: 1, kotStatus: "KOT order placed to Kitchen", void: "NO", costCentre: "KOT-2 Beverage",   kitchen: "KOT-2 Beverage", verifyStatus: "unverify" },
  { id: 15, date: "28/03/2026", table: "T-4",  category: "Biryani & Handi",                orderNo: "20260328-130", kotNo: 5, item: "B.B.Q MATKA BIRYANI",        qty: 2, kotStatus: "KOT order placed to Kitchen", void: "NO", costCentre: "Binoria Restaurant", kitchen: "Kitchen-2", verifyStatus: "unverify" },
  // Void example
  { id: 16, date: "28/03/2026", table: "T-9",  category: "Pakistani Cuisine",              orderNo: "20260328-131", kotNo: 1, item: "MUTTON KARAHI",              qty: 1, kotStatus: "Void",                        void: "YES", costCentre: "Binoria Restaurant", kitchen: "Kitchen-2", verifyStatus: "verify" },
  // Takeaway
  { id: 17, date: "28/03/2026", table: "TA",   category: "Biryani & Handi",               orderNo: "20260328-132", kotNo: 1, item: "CHICKEN BIRYANI (1 PC)",     qty: 2, kotStatus: "KOT order placed to Kitchen", void: "NO", costCentre: "Binoria Restaurant (Take Away)", kitchen: "Kitchen-2", verifyStatus: "verify" },
  { id: 18, date: "28/03/2026", table: "TA",   category: "Nan",                           orderNo: "20260328-132", kotNo: 2, item: "NAAN",                       qty: 4, kotStatus: "KOT order placed to Kitchen", void: "NO", costCentre: "Binoria Restaurant (Take Away)", kitchen: "Kitchen-1", verifyStatus: "verify" },
];

const KITCHENS       = ['ALL', 'Kitchen-1', 'Kitchen-2', 'KOT-2 Beverage'];
const COST_CENTRES   = ['ALL', 'Binoria Restaurant', 'Binoria Restaurant (Take Away)', 'KOT-2 Beverage', 'Counter C'];
const CATEGORIES     = ['ALL', 'Fast Food (Burger & Sandwich)', 'Pizza', 'Biryani & Handi', 'Pakistani Cuisine', 'Bar B Que', 'Nan', 'Salad/Raita', 'Beverages'];
const KOT_STATUSES   = ['ALL', 'KOT order placed to Kitchen', 'Void'];
const ITEMS_LIST     = ['ALL', 'CHICKEN BIRYANI (1 PC)', 'B.B.Q MATKA BIRYANI', 'MALAI BOTI', 'RAITA', 'GREEN SALAD', 'CHAPATI', 'NAAN', 'MUTTON KARAHI', 'FRENCH FRIES', 'PALAK PANEER'];

type KotStatus    = 'all' | 'void' | 'unvoid';
type VerifyStatus = 'all' | 'verify' | 'unverify';
type ReportType   = 'detail' | 'item-wise';

const kotStatusBg: Record<string, string> = {
  "KOT order placed to Kitchen": "bg-green-500/15 text-green-700 dark:text-green-400",
  "Void": "bg-red-500/15 text-red-700 dark:text-red-400",
};

export default function KOTReportPage() {
  // ── Filter state ─────────────────────────────────────────────────────────
  const [fromDate,       setFromDate]       = useState('28/03/2026');
  const [tillDate,       setTillDate]       = useState('28/03/2026');
  const [kitchen,        setKitchen]        = useState('ALL');
  const [costCentre,     setCostCentre]     = useState('Binoria Restaurant');
  const [category,       setCategory]       = useState('ALL');
  const [item,           setItem]           = useState('ALL');
  const [kotStatusDd,    setKotStatusDd]    = useState('ALL');
  const [pendingInvoice, setPendingInvoice] = useState(true);
  const [reportType,     setReportType]     = useState<ReportType>('detail');
  const [statusFilter,   setStatusFilter]   = useState<KotStatus>('unvoid');
  const [verifyStatus,   setVerifyStatus]   = useState<VerifyStatus>('all');
  const [generated,      setGenerated]      = useState(false);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!generated) return [];
    return mockKOTs.filter(k => {
      const matchKitchen   = kitchen === 'ALL'    || k.kitchen === kitchen;
      const matchCentre    = costCentre === 'ALL' || k.costCentre === costCentre;
      const matchCat       = category === 'ALL'   || k.category === category;
      const matchItem      = item === 'ALL'        || k.item === item;
      const matchKotStatus = kotStatusDd === 'ALL' || k.kotStatus === kotStatusDd;
      const matchStatus    = statusFilter === 'all' ? true : statusFilter === 'void' ? k.void === 'YES' : k.void === 'NO';
      const matchVerify    = verifyStatus === 'all' ? true : verifyStatus === 'verify' ? k.verifyStatus === 'verify' : k.verifyStatus === 'unverify';
      return matchKitchen && matchCentre && matchCat && matchItem && matchKotStatus && matchStatus && matchVerify;
    });
  }, [generated, kitchen, costCentre, category, item, kotStatusDd, statusFilter, verifyStatus]);

  const totalQty = filtered.reduce((s, k) => s + k.qty, 0);

  // ── Stats (unfiltered) ────────────────────────────────────────────────────
  const totalKOTs    = mockKOTs.length;
  const voidCount    = mockKOTs.filter(k => k.void === 'YES').length;
  const verifyCount  = mockKOTs.filter(k => k.verifyStatus === 'verify').length;
  const unverifyCount= mockKOTs.filter(k => k.verifyStatus === 'unverify').length;

  // Item-wise summary (for item-wise report type)
  const itemWise = useMemo(() => {
    const map: Record<string, { item: string; category: string; qty: number }> = {};
    filtered.forEach(k => {
      if (!map[k.item]) map[k.item] = { item: k.item, category: k.category, qty: 0 };
      map[k.item].qty += k.qty;
    });
    return Object.values(map).sort((a, b) => b.qty - a.qty);
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" /> KOT List Report
          </h1>
          <p className="text-muted-foreground text-sm">Kitchen Order Ticket report with verify and void tracking</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total KOT Lines", value: totalKOTs,    color: "text-foreground"   },
          { label: "Void Lines",       value: voidCount,    color: "text-red-600"      },
          { label: "Verified",         value: verifyCount,  color: "text-green-600"    },
          { label: "Unverified",       value: unverifyCount,color: "text-amber-600"    },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Filter Panel ─────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="pt-4 space-y-4">
          {/* Generate / Print */}
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
            {generated && <Badge variant="secondary" className="ml-auto">{filtered.length} KOT lines · {totalQty} qty</Badge>}
          </div>

          {/* Row 1: Dates + Kitchen */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground mb-1 block">From Date</Label>
              <Input value={fromDate} onChange={e => setFromDate(e.target.value)} placeholder="DD/MM/YYYY" className="h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Till Date</Label>
              <Input value={tillDate} onChange={e => setTillDate(e.target.value)} placeholder="DD/MM/YYYY" className="h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Kitchen</Label>
              <Select value={kitchen} onValueChange={setKitchen}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {KITCHENS.map(k => <SelectItem key={k} value={k} className="text-sm">{k}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Cost Centre + Category + Items + KOT Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Cost Centre</Label>
              <Select value={costCentre} onValueChange={setCostCentre}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COST_CENTRES.map(c => <SelectItem key={c} value={c} className="text-sm">{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Items Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c} className="text-sm">{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground mb-1 block">Items</Label>
              <Select value={item} onValueChange={setItem}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ITEMS_LIST.map(i => <SelectItem key={i} value={i} className="text-sm">{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground mb-1 block">KOT Status</Label>
              <Select value={kotStatusDd} onValueChange={setKotStatusDd}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {KOT_STATUSES.map(s => <SelectItem key={s} value={s} className="text-sm">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Pending Invoice + Report Type + Status + Verify Status */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 items-start">
            {/* Pending Invoice checkbox */}
            <div className="flex items-center pt-0.5">
              <button onClick={() => setPendingInvoice(p => !p)} className="flex items-center gap-2 text-sm font-medium">
                {pendingInvoice
                  ? <CheckSquare className="h-4 w-4 text-primary" />
                  : <Square className="h-4 w-4 text-muted-foreground" />}
                Pending Invoice
              </button>
            </div>

            <Separator orientation="vertical" className="h-10 hidden md:block" />

            {/* Report Type */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Report Type</p>
              <div className="flex gap-4">
                {([{ id: 'detail', label: 'Detail' }, { id: 'item-wise', label: 'Item Wise Summary' }] as { id: ReportType; label: string }[]).map(rt => (
                  <label key={rt.id} className="flex items-center gap-1.5 text-sm cursor-pointer" onClick={() => setReportType(rt.id)}>
                    <span className={cn('flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors', reportType === rt.id ? 'border-primary' : 'border-muted-foreground/40')}>
                      {reportType === rt.id && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </span>
                    {rt.label}
                  </label>
                ))}
              </div>
            </div>

            <Separator orientation="vertical" className="h-10 hidden md:block" />

            {/* Status */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Status</p>
              <div className="flex gap-4">
                {(['all', 'void', 'unvoid'] as KotStatus[]).map(s => (
                  <label key={s} className="flex items-center gap-1.5 text-sm cursor-pointer" onClick={() => setStatusFilter(s)}>
                    <span className={cn('flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors', statusFilter === s ? 'border-primary' : 'border-muted-foreground/40')}>
                      {statusFilter === s && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </span>
                    <span className="capitalize">{s}</span>
                  </label>
                ))}
              </div>
            </div>

            <Separator orientation="vertical" className="h-10 hidden md:block" />

            {/* Verify Status */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Verify Status</p>
              <div className="flex gap-4">
                {([{ id: 'all', label: 'All' }, { id: 'verify', label: 'Verify' }, { id: 'unverify', label: 'Un Verify' }] as { id: VerifyStatus; label: string }[]).map(vs => (
                  <label key={vs.id} className="flex items-center gap-1.5 text-sm cursor-pointer" onClick={() => setVerifyStatus(vs.id)}>
                    <span className={cn('flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors', verifyStatus === vs.id ? 'border-primary' : 'border-muted-foreground/40')}>
                      {verifyStatus === vs.id && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </span>
                    {vs.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Results ───────────────────────────────────────────────────────── */}
      {generated && (
        <Card>
          <CardContent className="pt-0 p-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Flame className="mb-3 h-10 w-10 text-muted-foreground/20" />
                <p className="text-sm font-medium text-muted-foreground">No KOT records match your filters</p>
              </div>
            ) : reportType === 'item-wise' ? (
              /* ── Item Wise Summary ── */
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">S#</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Item Name</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Category</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold text-muted-foreground">Total Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemWise.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="px-3 py-2 text-muted-foreground text-xs">{idx + 1}</td>
                        <td className="px-3 py-2 font-medium">{row.item}</td>
                        <td className="px-3 py-2 text-muted-foreground text-xs">{row.category}</td>
                        <td className="px-3 py-2 text-right font-bold text-primary">{row.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 bg-muted/40 font-bold">
                      <td colSpan={3} className="px-3 py-2 text-right text-xs text-muted-foreground">Total ({itemWise.length} items):</td>
                      <td className="px-3 py-2 text-right text-primary">{itemWise.reduce((s, r) => s + r.qty, 0)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              /* ── Detail ── */
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">SNo</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">Date</th>
                      <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground">Table #/TA</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">Category</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">Order #</th>
                      <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground">KOT #</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">KOT</th>
                      <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground">Qty</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">KOT Status</th>
                      <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground">Verify</th>
                      <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground">Void</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((k, idx) => (
                      <tr key={k.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="px-3 py-2 text-muted-foreground">{idx + 1}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{k.date}</td>
                        <td className="px-2 py-2 text-center">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{k.table}</Badge>
                        </td>
                        <td className="px-3 py-2 max-w-[120px] truncate text-muted-foreground">{k.category}</td>
                        <td className="px-3 py-2 font-mono text-[11px] text-primary whitespace-nowrap">{k.orderNo}</td>
                        <td className="px-2 py-2 text-center font-bold">{k.kotNo}</td>
                        <td className="px-3 py-2 font-medium">{k.item}</td>
                        <td className="px-2 py-2 text-center font-bold text-primary">{k.qty}</td>
                        <td className="px-3 py-2">
                          <span className={cn("text-[10px] font-medium rounded px-1.5 py-0.5", kotStatusBg[k.kotStatus] ?? "text-muted-foreground")}>
                            {k.kotStatus === 'KOT order placed to Kitchen' ? 'Kitchen' : k.kotStatus}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-center">
                          <span className={cn("text-[10px] font-medium", k.verifyStatus === 'verify' ? 'text-green-600' : 'text-amber-600')}>
                            {k.verifyStatus === 'verify' ? 'Verified' : 'Unverified'}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-center">
                          <span className={cn("text-[10px] font-bold", k.void === 'YES' ? 'text-red-600' : 'text-muted-foreground')}>
                            {k.void}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 bg-muted/40 font-bold">
                      <td colSpan={7} className="px-3 py-2 text-right text-xs text-muted-foreground">Total ({filtered.length} lines):</td>
                      <td className="px-2 py-2 text-center text-primary">{totalQty}</td>
                      <td colSpan={3} />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
