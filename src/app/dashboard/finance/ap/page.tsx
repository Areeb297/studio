'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  Plus, Search, Mail, ArrowUpRight, Truck, Clock, AlertTriangle, CheckCircle,
  CreditCard, FileText, Layers, TrendingUp,
} from 'lucide-react';
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell,
} from 'recharts';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { suppliers, apTotals, openBills } from '@/lib/finance/ar-ap-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const heat = (v: number, max: number) => {
  if (v === 0) return '';
  const pct = v / max;
  if (pct > 0.5) return 'bg-rose-100 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200';
  if (pct > 0.25) return 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200';
  return 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200';
};

export default function APDashboardPage() {
  const overduePct = ((apTotals['61-90'] + apTotals['90+']) / apTotals.total) * 100;
  const maxByBucket = {
    '0-30':  Math.max(...suppliers.map(c => c.ageingBuckets['0-30'])),
    '31-60': Math.max(...suppliers.map(c => c.ageingBuckets['31-60'])),
    '61-90': Math.max(...suppliers.map(c => c.ageingBuckets['61-90'])),
    '90+':   Math.max(...suppliers.map(c => c.ageingBuckets['90+'])),
  };

  // Cash needed by week (next 4 weeks)
  const forecast = useMemo(() => {
    const today = new Date('2026-05-23');
    const buckets = Array.from({ length: 4 }, (_, i) => ({ week: `W${21 + i}`, total: 0 }));
    for (const b of openBills) {
      const due = new Date(b.dueDate);
      const diff = Math.floor((due.getTime() - today.getTime()) / (7 * 86_400_000));
      if (diff >= 0 && diff < 4) buckets[diff].total += b.total;
    }
    return buckets;
  }, []);

  return (
    <PageShell
      eyebrow="Payables"
      title="AP Dashboard"
      description="Outstanding supplier balances by ageing bucket. Trigger a weekly batch payment run when balances pile up."
      breadcrumb={[{ label: 'Payables' }, { label: 'Dashboard' }]}
      actions={
        <>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/finance/ap/invoice"><FileText className="mr-1.5 h-3.5 w-3.5" /> New bill</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/finance/ap/payment"><CreditCard className="mr-1.5 h-3.5 w-3.5" /> Single payment</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/finance/ap/batch"><Layers className="mr-1.5 h-3.5 w-3.5" /> Batch run</Link>
          </Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Total payables" value={formatPKR(apTotals.total)} tone="info" icon={ArrowUpRight} hint={`${suppliers.length} suppliers`} />
          <KpiCard label="Due ≤ 30 days" value={formatPKR(apTotals['0-30'])} tone="warning" icon={Clock} />
          <KpiCard label="Overdue 31–90 days" value={formatPKR(apTotals['31-60'] + apTotals['61-90'])} tone="warning" icon={AlertTriangle} />
          <KpiCard label="Overdue 90+ days" value={formatPKR(apTotals['90+'])} tone="danger" icon={AlertTriangle} hint={`${overduePct.toFixed(0)}% of total`} />
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* AP table */}
        <Card className="lg:col-span-2 p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search supplier…" className="pl-9" />
            </div>
            <div className="text-xs text-muted-foreground ml-auto">{suppliers.length} suppliers</div>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-[40px]"><Truck className="h-3.5 w-3.5" /></TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">0–30d</TableHead>
                  <TableHead className="text-right">31–60d</TableHead>
                  <TableHead className="text-right">61–90d</TableHead>
                  <TableHead className="text-right">90+d</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map(s => (
                  <TableRow key={s.id} className="hover:bg-primary/5">
                    <TableCell>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase">
                        {s.name.split(' ').slice(0,2).map(w => w[0]).join('')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-sm">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.contact} · {s.paymentTerms}</div>
                    </TableCell>
                    {(['0-30','31-60','61-90','90+'] as const).map(b => (
                      <TableCell key={b} className="text-right">
                        {s.ageingBuckets[b] > 0 ? (
                          <span className={cn('inline-block tabular-nums font-semibold rounded px-2 py-0.5 text-xs', heat(s.ageingBuckets[b], maxByBucket[b]))}>
                            {formatPKR(s.ageingBuckets[b])}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-right tabular-nums font-bold">{formatPKR(s.totalOpen)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="bg-muted/60">
                <TableRow className="font-bold">
                  <TableCell />
                  <TableCell className="text-right text-xs uppercase tracking-wide">Total</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPKR(apTotals['0-30'])}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPKR(apTotals['31-60'])}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPKR(apTotals['61-90'])}</TableCell>
                  <TableCell className="text-right tabular-nums text-rose-700">{formatPKR(apTotals['90+'])}</TableCell>
                  <TableCell className="text-right tabular-nums text-base">{formatPKR(apTotals.total)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </Card>

        {/* Cash forecast */}
        <Card className="p-5">
          <SectionHeader
            eyebrow="Forecast"
            title="Cash needed by week"
            description="Bills due in the next 4 weeks. Yellow zone if any week ≥ Rs 200K."
          />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={forecast} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tickFormatter={v => `${(v / 1000).toFixed(0)}K`} tickLine={false} axisLine={false} className="text-xs" />
              <YAxis type="category" dataKey="week" tickLine={false} axisLine={false} className="text-xs" width={40} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--popover))' }}
                formatter={(v: number) => formatPKR(v)}
              />
              <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                {forecast.map((f, i) => (
                  <Cell key={i} fill={f.total >= 200_000 ? 'hsl(var(--chart-5))' : 'hsl(var(--chart-1))'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 text-xs text-muted-foreground">
            Click <Link href="/dashboard/finance/ap/batch" className="text-primary font-semibold hover:underline">Batch run</Link> to process payments by week.
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
