'use client';

import { useState } from 'react';
import {
  Download, Printer, FileSpreadsheet, Waves, ArrowUp, ArrowDown, Wallet,
  ChevronDown, ChevronUp, Plus, Trash2,
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from 'recharts';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { HelperInfo } from '@/components/finance/helper-info';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cashFlow as defaultCashflow, monthlyCashflow } from '@/lib/finance/statements-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

type Row = { name: string; amount: number };

export default function CashFlowPage() {
  const [op, setOp]   = useState<Row[]>(defaultCashflow.operating);
  const [inv, setInv] = useState<Row[]>(defaultCashflow.investing);
  const [fin, setFin] = useState<Row[]>(defaultCashflow.financing);
  const [open, setOpen] = useState({ op: true, inv: true, fin: true });

  const sum = (r: Row[]) => r.reduce((a, x) => a + x.amount, 0);
  const opTotal = sum(op);
  const invTotal = sum(inv);
  const finTotal = sum(fin);
  const net = opTotal + invTotal + finTotal;
  const closing = defaultCashflow.openingCash + net;

  const addRow = (which: 'op' | 'inv' | 'fin') => {
    const blank = { name: 'New item', amount: 0 };
    if (which === 'op')  setOp(p => [...p, blank]);
    if (which === 'inv') setInv(p => [...p, blank]);
    if (which === 'fin') setFin(p => [...p, blank]);
  };
  const updateRow = (which: 'op' | 'inv' | 'fin', idx: number, patch: Partial<Row>) => {
    const upd = (rows: Row[]) => rows.map((r, i) => i === idx ? { ...r, ...patch } : r);
    if (which === 'op')  setOp(upd);
    if (which === 'inv') setInv(upd);
    if (which === 'fin') setFin(upd);
  };
  const deleteRow = (which: 'op' | 'inv' | 'fin', idx: number) => {
    const del = (rows: Row[]) => rows.filter((_, i) => i !== idx);
    if (which === 'op')  setOp(del);
    if (which === 'inv') setInv(del);
    if (which === 'fin') setFin(del);
  };

  const SectionTable = ({
    title, which, rows, total, tone, helper,
  }: { title: string; which: 'op' | 'inv' | 'fin'; rows: Row[]; total: number; tone: string; helper: string }) => {
    const isOpen = open[which];
    return (
      <Card className="overflow-hidden">
        <button
          onClick={() => setOpen(s => ({ ...s, [which]: !s[which] }))}
          className={cn(
            'w-full flex items-center justify-between px-5 py-3 transition-colors border-b border-border',
            tone,
          )}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase text-sm tracking-wide">{title}</span>
            <HelperInfo title={title} body={helper} />
          </div>
          <div className="flex items-center gap-4">
            <span className={cn('tabular-nums font-bold text-base', total < 0 ? 'text-rose-700' : 'text-emerald-700')}>
              {total < 0 ? `(${formatPKR(Math.abs(total))})` : formatPKR(total)}
            </span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </button>
        {isOpen && (
          <>
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="pl-8">Line</TableHead>
                  <TableHead className="text-right w-[200px]">Amount (PKR)</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={i} className="hover:bg-muted/30">
                    <TableCell className="pl-8">
                      <Input value={r.name} onChange={e => updateRow(which, i, { name: e.target.value })} className="h-8 text-sm border-0 shadow-none focus-visible:ring-1 px-0 bg-transparent" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={r.amount}
                        onChange={e => updateRow(which, i, { amount: Number(e.target.value) || 0 })}
                        className={cn(
                          'h-8 text-right tabular-nums font-semibold border-0 shadow-none focus-visible:ring-1 px-1 bg-transparent',
                          r.amount < 0 && 'text-rose-700',
                          r.amount > 0 && 'text-emerald-700',
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-600 opacity-50 hover:opacity-100" onClick={() => deleteRow(which, i)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="pl-8 py-2">
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => addRow(which)}>
                      <Plus className="mr-1 h-3 w-3" /> Add line
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        )}
      </Card>
    );
  };

  return (
    <PageShell
      eyebrow="Reports · 1 – 31 May 2026"
      title="Cash Flow Statement"
      description="Indirect method. Reconciles net profit to cash position. Click section headers to collapse. Add / edit / delete lines for hypothetical scenarios."
      breadcrumb={[{ label: 'Reports', href: '/dashboard/finance/reports' }, { label: 'Cash Flow' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> Excel</Button>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> PDF</Button>
          <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
        </>
      }
      kpis={
        <>
          <KpiCard
            label="Operating"
            value={formatPKR(opTotal)}
            tone="success"
            icon={ArrowUp}
            hint="Cash from day-to-day business"
          />
          <KpiCard
            label="Investing"
            value={formatPKR(invTotal)}
            tone={invTotal >= 0 ? 'info' : 'warning'}
            icon={invTotal >= 0 ? ArrowUp : ArrowDown}
            hint="Asset buys / disposals"
          />
          <KpiCard
            label="Financing"
            value={formatPKR(finTotal)}
            tone="accent"
            icon={Waves}
            hint="Donations / loans / equity"
          />
          <KpiCard
            label="Net change · cash"
            value={formatPKR(net)}
            tone={net >= 0 ? 'success' : 'danger'}
            icon={Wallet}
            hint={`Closing ${formatPKR(closing)}`}
          />
        </>
      }
    >
      {/* Filters */}
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Period</span>
          <Select defaultValue="MAY26">
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="MAY26">May 2026</SelectItem>
              <SelectItem value="APR26">April 2026</SelectItem>
              <SelectItem value="YTD">YTD FY 2026</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" defaultValue="2026-05-01" className="w-[150px]" />
          <Input type="date" defaultValue="2026-05-31" className="w-[150px]" />
          <Select defaultValue="ALL">
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Cost centre" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All cost centres</SelectItem>
              <SelectItem value="REST">Restaurant</SelectItem>
              <SelectItem value="LAWN">Marriage Lawn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Chart */}
      <Card className="p-5 mb-4">
        <SectionHeader eyebrow="Trend · 6 months" title="Cash inflows / outflows" />
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={monthlyCashflow} margin={{ top: 5, right: 5, left: 0, bottom: 0 }} stackOffset="sign">
            <defs>
              <linearGradient id="opG" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="invG" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-3))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="finG" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-4))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis tickFormatter={v => `${(v / 1e6).toFixed(1)}M`} tickLine={false} axisLine={false} className="text-xs" />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--popover))' }}
              formatter={(v: number) => formatPKR(v)}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="operating" name="Operating" stroke="hsl(var(--chart-1))" fill="url(#opG)"  strokeWidth={2} />
            <Area type="monotone" dataKey="investing" name="Investing" stroke="hsl(var(--chart-3))" fill="url(#invG)" strokeWidth={2} />
            <Area type="monotone" dataKey="financing" name="Financing" stroke="hsl(var(--chart-4))" fill="url(#finG)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Statement */}
      <div className="space-y-3">
        <SectionTable
          title="Operating activities"
          which="op"
          rows={op}
          total={opTotal}
          tone="bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/60"
          helper="Cash generated (or used) by the core business: net profit adjusted for non-cash items (depreciation) and working-capital changes (AR, AP, inventory)."
        />
        <SectionTable
          title="Investing activities"
          which="inv"
          rows={inv}
          total={invTotal}
          tone="bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100/60"
          helper="Cash spent on or received from long-term assets: buying equipment / buildings, selling assets, etc."
        />
        <SectionTable
          title="Financing activities"
          which="fin"
          rows={fin}
          total={finTotal}
          tone="bg-violet-50/60 dark:bg-violet-950/30 hover:bg-violet-100/60"
          helper="Cash from external sources of funding: donations received, loans, equity contributions, repayments."
        />

        {/* BIG TOTAL */}
        <Card className={cn('overflow-hidden border-2', net >= 0 ? 'border-emerald-500' : 'border-rose-500')}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="p-5 text-center">
              <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Cash at start</div>
              <div className="text-2xl font-bold tabular-nums mt-1">{formatPKR(defaultCashflow.openingCash)}</div>
            </div>
            <div className={cn('p-5 text-center', net >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/40' : 'bg-rose-50 dark:bg-rose-950/40')}>
              <div className={cn('text-[11px] uppercase tracking-wider font-bold inline-flex items-center gap-1', net >= 0 ? 'text-emerald-700' : 'text-rose-700')}>
                Net change <HelperInfo title="Net change in cash" body="Σ of Operating + Investing + Financing flows. Positive (green) = cash increased; negative (red) = cash drained." />
              </div>
              <div className={cn('text-3xl font-bold tabular-nums mt-1', net >= 0 ? 'text-emerald-700' : 'text-rose-700')}>
                {net < 0 ? `(${formatPKR(Math.abs(net))})` : formatPKR(net)}
              </div>
            </div>
            <div className="p-5 text-center bg-primary/10">
              <div className="text-[11px] uppercase tracking-wider font-bold text-primary">Cash at end</div>
              <div className="text-3xl font-bold tabular-nums mt-1 text-primary">{formatPKR(closing)}</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-4 text-xs text-muted-foreground text-right">For period 1 – 31 May 2026 · BINORIA WELFARE TRUST · PKR</div>
    </PageShell>
  );
}
