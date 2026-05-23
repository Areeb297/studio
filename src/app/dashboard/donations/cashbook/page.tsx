'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Download, Printer, Plus, Trash2, BookOpen, ArrowDown, ArrowUp, Wallet,
  TrendingUp, TrendingDown, Calendar, FileText, Filter,
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { HelperInfo } from '@/components/finance/helper-info';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

type Row = {
  id: string;
  date: string;
  voucher: string;
  particulars: string;
  category: string;
  mode: 'CASH' | 'CHEQUE' | 'TRANSFER' | 'PAY_ORDER';
  receipts: number;
  payments: number;
};

const initialRows: Row[] = [
  { id: 'r1',  date: '2026-05-01', voucher: '—',                 particulars: 'Opening balance',                                                  category: 'OPENING',    mode: 'CASH', receipts: 0,        payments: 0 },
  { id: 'r2',  date: '2026-05-02', voucher: 'DC-2026-05-0098',   particulars: 'F. AHMED — Zakat donation',                                       category: 'ZAKAT',      mode: 'CASH', receipts: 25_000,   payments: 0 },
  { id: 'r3',  date: '2026-05-03', voucher: 'CPV-2026-05-0001',  particulars: 'Madrasa students — daily milk',                                    category: 'MADRASSAH',  mode: 'CASH', receipts: 0,        payments: 4_200 },
  { id: 'r4',  date: '2026-05-04', voucher: 'DC-2026-05-0101',   particulars: 'B. JAVED — Sadqah cash donation',                                  category: 'SADQAH',     mode: 'CASH', receipts: 8_000,    payments: 0 },
  { id: 'r5',  date: '2026-05-05', voucher: 'CPV-2026-05-0005',  particulars: 'Mosque cleaning supplies',                                          category: 'MOSQUE',     mode: 'CASH', receipts: 0,        payments: 6_500 },
  { id: 'r6',  date: '2026-05-08', voucher: 'DC-2026-05-0105',   particulars: 'M. UMAIR — Sadqah',                                                category: 'SADQAH',     mode: 'CASH', receipts: 8_000,    payments: 0 },
  { id: 'r7',  date: '2026-05-10', voucher: 'CPV-2026-05-0012',  particulars: 'Bulk wheat purchase — Madrasa kitchen',                            category: 'MADRASSAH',  mode: 'CASH', receipts: 0,        payments: 18_500 },
  { id: 'r8',  date: '2026-05-12', voucher: 'DC-2026-05-0108',   particulars: 'A. NAEEM — Madrassah donation',                                    category: 'MADRASSAH',  mode: 'CASH', receipts: 18_000,   payments: 0 },
  { id: 'r9',  date: '2026-05-14', voucher: 'CPV-2026-05-0019',  particulars: 'Hifz student scholarships (5 students × 2,400)',                  category: 'MADRASSAH',  mode: 'CASH', receipts: 0,        payments: 12_000 },
  { id: 'r10', date: '2026-05-15', voucher: 'DC-2026-05-0112',   particulars: 'M. HASSAN ALI — General donation (Pay Order)',                    category: 'GENERAL',    mode: 'PAY_ORDER', receipts: 12_000, payments: 0 },
  { id: 'r11', date: '2026-05-18', voucher: 'CPV-2026-05-0025',  particulars: 'Mosque electricity bill — May',                                     category: 'MOSQUE',     mode: 'CASH', receipts: 0,        payments: 8_700 },
  { id: 'r12', date: '2026-05-20', voucher: 'DC-2026-05-0114',   particulars: 'B. JAVED — Mosque construction donation',                          category: 'MOSQUE',     mode: 'CASH', receipts: 35_000,   payments: 0 },
  { id: 'r13', date: '2026-05-22', voucher: 'CPV-2026-05-0029',  particulars: 'Hostel groceries (Tehfeez students)',                              category: 'MADRASSAH',  mode: 'CASH', receipts: 0,        payments: 22_400 },
  { id: 'r14', date: '2026-05-22', voucher: 'DC-2026-05-0121',   particulars: 'S. NAZIM — Madrassah (transfer)',                                  category: 'MADRASSAH',  mode: 'TRANSFER', receipts: 30_000, payments: 0 },
  { id: 'r15', date: '2026-05-23', voucher: 'DC-2026-05-0123',   particulars: 'I. QURESHI — Zakat (cash)',                                        category: 'ZAKAT',      mode: 'CASH', receipts: 25_000,   payments: 0 },
];

const categories = ['ALL', 'ZAKAT', 'SADQAH', 'MOSQUE', 'MADRASSAH', 'GENERAL'] as const;
const categoryColor: Record<string, string> = {
  ZAKAT:     'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  SADQAH:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  MOSQUE:    'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  MADRASSAH: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  GENERAL:   'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  OPENING:   'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-400',
};
const modeColor: Record<string, string> = {
  CASH:           'bg-amber-50 text-amber-700 ring-amber-200',
  CHEQUE:         'bg-blue-50  text-blue-700  ring-blue-200',
  TRANSFER:       'bg-teal-50  text-teal-700  ring-teal-200',
  PAY_ORDER:      'bg-violet-50 text-violet-700 ring-violet-200',
};

export default function DonationsCashbookPage() {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [tab, setTab] = useState<'ALL' | 'RECEIPTS' | 'PAYMENTS'>('ALL');
  const [cat, setCat] = useState<string>('ALL');
  const [from, setFrom] = useState('2026-05-01');
  const [to, setTo] = useState('2026-05-31');

  const opening = 425_000;
  const filtered = useMemo(() => rows.filter(r => {
    if (cat !== 'ALL' && r.category !== cat && r.category !== 'OPENING') return false;
    if (tab === 'RECEIPTS' && r.receipts === 0 && r.category !== 'OPENING') return false;
    if (tab === 'PAYMENTS' && r.payments === 0 && r.category !== 'OPENING') return false;
    return true;
  }), [rows, tab, cat]);

  // Running balance computed over the FULL list (so filtering doesn't break the running balance)
  let running = opening;
  const allWithRunning = rows.map((r, i) => {
    if (i > 0) running = running + r.receipts - r.payments;
    return { ...r, running };
  });
  const visibleRows = filtered.map(r => ({ ...r, running: allWithRunning.find(x => x.id === r.id)!.running }));

  const totalReceipts = rows.reduce((s, r) => s + r.receipts, 0);
  const totalPayments = rows.reduce((s, r) => s + r.payments, 0);
  const closing = opening + totalReceipts - totalPayments;
  const net = totalReceipts - totalPayments;

  const update = (id: string, patch: Partial<Row>) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
  const del = (id: string) =>
    setRows(prev => prev.filter(r => r.id !== id));
  const addRow = () =>
    setRows(prev => [...prev, {
      id: 'r' + Math.random().toString(36).slice(2),
      date: '2026-05-24', voucher: '—', particulars: 'New entry', category: 'GENERAL', mode: 'CASH', receipts: 0, payments: 0,
    }]);

  // Daily trend for chart
  const dailyTrend = useMemo(() => {
    const map: Record<string, { date: string; receipts: number; payments: number }> = {};
    for (const r of rows) {
      if (r.category === 'OPENING') continue;
      if (!map[r.date]) map[r.date] = { date: r.date.slice(8), receipts: 0, payments: 0 };
      map[r.date].receipts += r.receipts;
      map[r.date].payments += r.payments;
    }
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }, [rows]);

  return (
    <PageShell
      eyebrow="Donations · Cashbook"
      title="Cashbook & Petty Cash"
      description="Daily record of cash receipts and payments for the donations module. Edit any row, add or delete lines for what-if scenarios. Refresh resets to defaults."
      breadcrumb={[{ label: 'Donations' }, { label: 'Cashbook' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Excel</Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
          <Button size="sm" onClick={addRow}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add row</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Opening balance" value={formatPKR(opening)}   tone="info"     icon={Wallet}      hint="01 May 2026" />
          <KpiCard label="Total receipts"   value={formatPKR(totalReceipts)} tone="success" icon={ArrowDown} hint={`${rows.filter(r => r.receipts > 0).length} entries`} />
          <KpiCard label="Total payments"   value={formatPKR(totalPayments)} tone="warning" icon={ArrowUp}   hint={`${rows.filter(r => r.payments > 0).length} entries`} />
          <KpiCard
            label="Closing balance"
            value={formatPKR(closing)}
            tone={net >= 0 ? 'accent' : 'danger'}
            icon={net >= 0 ? TrendingUp : TrendingDown}
            hint={`Net ${net >= 0 ? '+' : ''}${formatPKR(net)}`}
          />
        </>
      }
    >
      {/* Filters */}
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground inline-flex items-center gap-1"><Filter className="h-3 w-3" /> Filters</span>
          <Input type="date" value={from} onChange={e => setFrom(e.target.value)} className="w-[150px]" />
          <span className="text-xs text-muted-foreground">to</span>
          <Input type="date" value={to} onChange={e => setTo(e.target.value)} className="w-[150px]" />
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c} value={c}>{c === 'ALL' ? 'All categories' : c[0] + c.slice(1).toLowerCase()}</SelectItem>)}
            </SelectContent>
          </Select>
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="ml-auto">
            <TabsList>
              <TabsTrigger value="ALL">All</TabsTrigger>
              <TabsTrigger value="RECEIPTS" className="data-[state=active]:text-emerald-700"><ArrowDown className="h-3 w-3 mr-1" /> Receipts</TabsTrigger>
              <TabsTrigger value="PAYMENTS" className="data-[state=active]:text-rose-700"><ArrowUp className="h-3 w-3 mr-1" /> Payments</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      {/* Trend */}
      <Card className="p-5 mb-4">
        <SectionHeader eyebrow="Daily flow" title="Receipts vs Payments — May 2026" />
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={dailyTrend} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="rxG" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-6))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--chart-6))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pyG" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-5))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}K`} tickLine={false} axisLine={false} className="text-xs" />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--popover))' }} formatter={(v: number) => formatPKR(v)} />
            <Area type="monotone" dataKey="receipts" stroke="hsl(var(--chart-6))" fill="url(#rxG)" strokeWidth={2} name="Receipts" />
            <Area type="monotone" dataKey="payments" stroke="hsl(var(--chart-5))" fill="url(#pyG)" strokeWidth={2} name="Payments" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Cashbook */}
      <Card className="p-4 print:shadow-none">
        <div className="hidden print:block mb-3 pb-2 border-b-2 border-foreground">
          <div className="font-bold">BINORIA WELFARE TRUST</div>
          <div className="text-sm font-semibold">Donations Cashbook · {from} – {to} · PKR</div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40 sticky top-0">
              <TableRow>
                <TableHead className="w-[110px]">Date</TableHead>
                <TableHead className="w-[180px]">Voucher</TableHead>
                <TableHead>Particulars</TableHead>
                <TableHead className="w-[130px]">Category</TableHead>
                <TableHead className="w-[110px]">Mode</TableHead>
                <TableHead className="text-right w-[130px]">
                  <span className="inline-flex items-center gap-1 justify-end">
                    Receipts <HelperInfo title="Cash receipts" body="Money flowing INTO the donations cash drawer — typically donor contributions." />
                  </span>
                </TableHead>
                <TableHead className="text-right w-[130px]">
                  <span className="inline-flex items-center gap-1 justify-end">
                    Payments <HelperInfo title="Cash payments" body="Money flowing OUT of the donations cash drawer — disbursements, expenses, transfers to bank." />
                  </span>
                </TableHead>
                <TableHead className="text-right w-[140px]">Balance</TableHead>
                <TableHead className="w-[40px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRows.map(r => (
                <TableRow key={r.id} className={cn('hover:bg-primary/5 group', r.category === 'OPENING' && 'bg-muted/30 italic')}>
                  <TableCell>
                    <Input type="date" value={r.date} onChange={e => update(r.id, { date: e.target.value })} className="h-8 text-xs border-0 shadow-none focus-visible:ring-1 px-1 bg-transparent" />
                  </TableCell>
                  <TableCell>
                    <Input value={r.voucher} onChange={e => update(r.id, { voucher: e.target.value })} className="h-8 text-xs font-mono border-0 shadow-none focus-visible:ring-1 px-1 bg-transparent" />
                  </TableCell>
                  <TableCell>
                    <Input value={r.particulars} onChange={e => update(r.id, { particulars: e.target.value })} className="h-8 text-sm border-0 shadow-none focus-visible:ring-1 px-1 bg-transparent" />
                  </TableCell>
                  <TableCell>
                    <Select value={r.category} onValueChange={(v) => update(r.id, { category: v })}>
                      <SelectTrigger className={cn('h-7 text-[10px] font-bold uppercase border-0 shadow-none focus:ring-1 px-2', categoryColor[r.category])}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c !== 'ALL').map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        <SelectItem value="OPENING">OPENING</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select value={r.mode} onValueChange={(v) => update(r.id, { mode: v as any })}>
                      <SelectTrigger className={cn('h-7 text-[10px] font-bold uppercase border-0 shadow-none focus:ring-1 px-2 ring-1 ring-inset', modeColor[r.mode])}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>{['CASH','CHEQUE','TRANSFER','PAY_ORDER'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={r.receipts || ''}
                      onChange={e => update(r.id, { receipts: Number(e.target.value) || 0 })}
                      placeholder="—"
                      className="h-8 text-right tabular-nums font-semibold text-emerald-700 border-0 shadow-none focus-visible:ring-1 px-1 bg-transparent"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={r.payments || ''}
                      onChange={e => update(r.id, { payments: Number(e.target.value) || 0 })}
                      placeholder="—"
                      className="h-8 text-right tabular-nums font-semibold text-rose-700 border-0 shadow-none focus-visible:ring-1 px-1 bg-transparent"
                    />
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{formatPKR(r.running)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-600 opacity-0 group-hover:opacity-100" onClick={() => del(r.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* BIG totals */}
        <div className={cn(
          'mt-4 grid grid-cols-1 md:grid-cols-4 gap-0 rounded-xl border-2 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-border',
          net >= 0 ? 'border-emerald-500' : 'border-rose-500',
        )}>
          <div className="p-5 text-center bg-muted/30">
            <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Opening</div>
            <div className="text-2xl font-bold tabular-nums mt-1">{formatPKR(opening)}</div>
          </div>
          <div className="p-5 text-center bg-emerald-50 dark:bg-emerald-950/40">
            <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-700">Σ Receipts</div>
            <div className="text-2xl md:text-3xl font-bold tabular-nums mt-1 text-emerald-700">{formatPKR(totalReceipts)}</div>
          </div>
          <div className="p-5 text-center bg-rose-50 dark:bg-rose-950/40">
            <div className="text-[11px] uppercase tracking-wider font-bold text-rose-700">Σ Payments</div>
            <div className="text-2xl md:text-3xl font-bold tabular-nums mt-1 text-rose-700">{formatPKR(totalPayments)}</div>
          </div>
          <div className="p-5 text-center bg-primary/10">
            <div className="text-[11px] uppercase tracking-wider font-bold text-primary">Closing balance</div>
            <div className="text-2xl md:text-3xl font-bold tabular-nums mt-1 text-primary">{formatPKR(closing)}</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5" />
            <span>Refresh the page to reset edits to seed data · Add / delete rows are session-only (no backend yet)</span>
          </div>
          <Link href="/dashboard/finance/reports/cash-book" className="text-primary font-semibold hover:underline">
            Finance cash book → /reports/cash-book
          </Link>
        </div>
      </Card>
    </PageShell>
  );
}
