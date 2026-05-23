'use client';

import Link from 'next/link';
import {
  Plus, Search, Mail, ArrowDownRight, Users, Clock, AlertTriangle, CheckCircle,
  HandCoins, FileText,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { customers, arTotals } from '@/lib/finance/ar-ap-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const heat = (v: number, max: number) => {
  if (v === 0) return '';
  const pct = v / max;
  if (pct > 0.5) return 'bg-rose-100 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200';
  if (pct > 0.25) return 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200';
  return 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200';
};

export default function ARDashboardPage() {
  const overduePct = ((arTotals['61-90'] + arTotals['90+']) / arTotals.total) * 100;
  const maxByBucket = {
    '0-30':  Math.max(...customers.map(c => c.ageingBuckets['0-30'])),
    '31-60': Math.max(...customers.map(c => c.ageingBuckets['31-60'])),
    '61-90': Math.max(...customers.map(c => c.ageingBuckets['61-90'])),
    '90+':   Math.max(...customers.map(c => c.ageingBuckets['90+'])),
  };

  return (
    <PageShell
      eyebrow="Receivables"
      title="AR Dashboard"
      description="Outstanding customer balances by ageing bucket. Click a customer to view detail, record a receipt, or email a statement."
      breadcrumb={[{ label: 'Receivables' }, { label: 'Dashboard' }]}
      actions={
        <>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/finance/ar/statement"><Mail className="mr-1.5 h-3.5 w-3.5" /> Email statements</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/finance/ar/invoice"><FileText className="mr-1.5 h-3.5 w-3.5" /> New invoice</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/finance/ar/receipt"><HandCoins className="mr-1.5 h-3.5 w-3.5" /> Record receipt</Link>
          </Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Total receivables" value={formatPKR(arTotals.total)} tone="info" icon={ArrowDownRight} hint={`${customers.length} customers`} />
          <KpiCard label="Due ≤ 30 days" value={formatPKR(arTotals['0-30'])} tone="success" icon={CheckCircle} />
          <KpiCard label="Overdue 31–90 days" value={formatPKR(arTotals['31-60'] + arTotals['61-90'])} tone="warning" icon={Clock} />
          <KpiCard label="Overdue 90+ days" value={formatPKR(arTotals['90+'])} tone="danger" icon={AlertTriangle} hint={`${overduePct.toFixed(0)}% of total overdue`} />
        </>
      }
    >
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search customer…" className="pl-9" />
          </div>
          <div className="text-xs text-muted-foreground ml-auto">{customers.length} customers</div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[40px]"><Users className="h-3.5 w-3.5" /></TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">0–30d</TableHead>
                <TableHead className="text-right">31–60d</TableHead>
                <TableHead className="text-right">61–90d</TableHead>
                <TableHead className="text-right">90+d</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map(c => (
                <TableRow key={c.id} className="hover:bg-primary/5">
                  <TableCell>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
                      {c.name.split(' ').slice(0,2).map(w => w[0]).join('')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-sm">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.contact} · {c.phone}</div>
                  </TableCell>
                  {(['0-30','31-60','61-90','90+'] as const).map(b => (
                    <TableCell key={b} className="text-right">
                      {c.ageingBuckets[b] > 0 ? (
                        <span className={cn('inline-block tabular-nums font-semibold rounded px-2 py-0.5 text-xs', heat(c.ageingBuckets[b], maxByBucket[b]))}>
                          {formatPKR(c.ageingBuckets[b])}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-right tabular-nums font-bold">{formatPKR(c.totalOpen)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-end">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">Receipt</Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Mail className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-muted/60">
              <TableRow className="font-bold">
                <TableCell />
                <TableCell className="text-right text-xs uppercase tracking-wide">Total</TableCell>
                <TableCell className="text-right tabular-nums">{formatPKR(arTotals['0-30'])}</TableCell>
                <TableCell className="text-right tabular-nums">{formatPKR(arTotals['31-60'])}</TableCell>
                <TableCell className="text-right tabular-nums">{formatPKR(arTotals['61-90'])}</TableCell>
                <TableCell className="text-right tabular-nums text-rose-700">{formatPKR(arTotals['90+'])}</TableCell>
                <TableCell className="text-right tabular-nums text-base">{formatPKR(arTotals.total)}</TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
