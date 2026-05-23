'use client';

import { Download, Printer, Mail, AlertTriangle, Clock, Users, CheckCircle } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { HelperInfo } from '@/components/finance/helper-info';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { customers, arTotals } from '@/lib/finance/ar-ap-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const heat = (v: number, max: number) => {
  if (v === 0 || max === 0) return '';
  const pct = v / max;
  if (pct > 0.5) return 'bg-rose-100 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200';
  if (pct > 0.25) return 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200';
  return 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200';
};

export default function ARAgeingReportPage() {
  const max = {
    '0-30':  Math.max(...customers.map(c => c.ageingBuckets['0-30'])),
    '31-60': Math.max(...customers.map(c => c.ageingBuckets['31-60'])),
    '61-90': Math.max(...customers.map(c => c.ageingBuckets['61-90'])),
    '90+':   Math.max(...customers.map(c => c.ageingBuckets['90+'])),
  };
  const overdue = arTotals['31-60'] + arTotals['61-90'] + arTotals['90+'];

  return (
    <PageShell
      eyebrow="Reports · Receivables"
      title="AR Ageing Report"
      description="Who owes us — bucketed by how overdue each balance is. The number-one screen for collections follow-up."
      breadcrumb={[{ label: 'Reports', href: '/dashboard/finance/reports' }, { label: 'AR Ageing' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> PDF</Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Total receivable" value={formatPKR(arTotals.total)} tone="info"    icon={Users}     hint={`${customers.length} customers`} />
          <KpiCard label="Current ≤ 30d"     value={formatPKR(arTotals['0-30'])} tone="success" icon={CheckCircle} />
          <KpiCard label="Overdue (31-90d)" value={formatPKR(arTotals['31-60'] + arTotals['61-90'])} tone="warning" icon={Clock} />
          <KpiCard label="Critical 90+d"     value={formatPKR(arTotals['90+'])} tone="danger"  icon={AlertTriangle} hint={`${((overdue/arTotals.total)*100).toFixed(0)}% overdue`} />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input type="date" defaultValue="2026-05-31" className="w-[150px]" />
          <Select defaultValue="ALL">
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Customer" /></SelectTrigger>
            <SelectContent><SelectItem value="ALL">All customers</SelectItem></SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="ml-auto"><Mail className="mr-1.5 h-3.5 w-3.5" /> Send statements</Button>
        </div>
      </Card>

      <Card className="p-4 print:shadow-none">
        <div className="hidden print:block mb-3 pb-2 border-b-2 border-foreground">
          <div className="font-bold">BINORIA WELFARE TRUST</div>
          <div className="text-sm font-semibold">AR Ageing Report · As at 31 May 2026 · PKR</div>
        </div>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="w-[140px]">Contact</TableHead>
                <TableHead className="text-right w-[120px]">Credit limit</TableHead>
                <TableHead className="text-right">0–30d</TableHead>
                <TableHead className="text-right">31–60d</TableHead>
                <TableHead className="text-right">61–90d</TableHead>
                <TableHead className="text-right">
                  <span className="inline-flex items-center gap-1 justify-end">
                    90+d <HelperInfo title="Critical receivable" body="Severely overdue — write-off candidate if recovery efforts fail." />
                  </span>
                </TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map(c => (
                <TableRow key={c.id} className="hover:bg-primary/5">
                  <TableCell className="font-semibold">{c.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.contact}</TableCell>
                  <TableCell className="text-right tabular-nums text-xs">{formatPKR(c.creditLimit)}</TableCell>
                  {(['0-30','31-60','61-90','90+'] as const).map(b => (
                    <TableCell key={b} className="text-right">
                      {c.ageingBuckets[b] > 0 ? (
                        <span className={cn('inline-block tabular-nums font-semibold rounded px-2 py-0.5 text-xs', heat(c.ageingBuckets[b], max[b]))}>
                          {formatPKR(c.ageingBuckets[b])}
                        </span>
                      ) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                  ))}
                  <TableCell className="text-right tabular-nums font-bold">{formatPKR(c.totalOpen)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-0 rounded-xl border-2 border-primary overflow-hidden divide-y md:divide-y-0 md:divide-x divide-border">
          {(['0-30','31-60','61-90','90+'] as const).map((b, i) => (
            <div key={b} className={cn('p-4 text-center', i === 3 ? 'bg-rose-50 dark:bg-rose-950/40' : 'bg-muted/30')}>
              <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{b} days</div>
              <div className={cn('text-xl font-bold tabular-nums mt-1', i === 3 && 'text-rose-700')}>{formatPKR(arTotals[b])}</div>
            </div>
          ))}
          <div className="p-4 text-center bg-primary/10">
            <div className="text-[10px] uppercase tracking-wider font-bold text-primary">Σ Total</div>
            <div className="text-2xl font-bold tabular-nums mt-1 text-primary">{formatPKR(arTotals.total)}</div>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}
