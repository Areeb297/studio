'use client';

import { Plus, CalendarDays, Lock, Unlock, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { StatusBadge } from '@/components/finance/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

const periods = [
  { period: 'May 2026',  start: '2026-05-01', end: '2026-05-31', status: 'OPEN',    voucherCount: 142, closedDate: null,           closedBy: null },
  { period: 'Apr 2026',  start: '2026-04-01', end: '2026-04-30', status: 'CLOSED',  voucherCount: 168, closedDate: '2026-05-01',  closedBy: 'A. Shafqat' },
  { period: 'Mar 2026',  start: '2026-03-01', end: '2026-03-31', status: 'CLOSED',  voucherCount: 152, closedDate: '2026-04-02',  closedBy: 'A. Shafqat' },
  { period: 'Feb 2026',  start: '2026-02-01', end: '2026-02-28', status: 'CLOSED',  voucherCount: 144, closedDate: '2026-03-01',  closedBy: 'A. Shafqat' },
  { period: 'Jan 2026',  start: '2026-01-01', end: '2026-01-31', status: 'CLOSED',  voucherCount: 138, closedDate: '2026-02-01',  closedBy: 'A. Shafqat' },
  { period: 'Dec 2025',  start: '2025-12-01', end: '2025-12-31', status: 'CLOSED',  voucherCount: 175, closedDate: '2026-01-02',  closedBy: 'M. Owais'   },
  { period: 'Nov 2025',  start: '2025-11-01', end: '2025-11-30', status: 'CLOSED',  voucherCount: 161, closedDate: '2025-12-02',  closedBy: 'M. Owais'   },
];

export default function FiscalPeriodsPage() {
  return (
    <PageShell
      eyebrow="Setup · Fiscal"
      title="Fiscal Years & Periods"
      description="Periods govern when entries can be posted. Once a period is closed, back-dated postings are blocked until a CFO reopens it."
      breadcrumb={[{ label: 'Setup' }, { label: 'Fiscal Periods' }]}
      actions={<Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New fiscal year</Button>}
      kpis={
        <>
          <KpiCard label="Current FY"      value="FY 2025-26" tone="info"    icon={CalendarDays} hint="Jul 2025 – Jun 2026" />
          <KpiCard label="Open periods"     value={periods.filter(p => p.status === 'OPEN').length}   tone="success" icon={Unlock} />
          <KpiCard label="Closed periods"   value={periods.filter(p => p.status === 'CLOSED').length} tone="accent"  icon={Lock} />
          <KpiCard label="Year-end progress" value="11 / 12"     tone="warning" icon={CheckCircle2} hint="1 period remaining" />
        </>
      }
    >
      <Card className="p-4">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[140px]">Period</TableHead>
                <TableHead className="w-[120px]">Start</TableHead>
                <TableHead className="w-[120px]">End</TableHead>
                <TableHead className="text-center w-[110px]">Vouchers</TableHead>
                <TableHead className="w-[200px]">Closed by</TableHead>
                <TableHead className="w-[110px]">Status</TableHead>
                <TableHead className="w-[170px] text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {periods.map(p => (
                <TableRow key={p.period} className={cn('hover:bg-primary/5', p.status === 'OPEN' && 'bg-emerald-50/40 dark:bg-emerald-950/20')}>
                  <TableCell className="font-bold">{p.period}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.start}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.end}</TableCell>
                  <TableCell className="text-center tabular-nums text-xs font-semibold">{p.voucherCount}</TableCell>
                  <TableCell className="text-xs">
                    {p.closedBy ? <span><strong>{p.closedBy}</strong> <span className="text-muted-foreground">· {p.closedDate}</span></span> : <span className="text-muted-foreground italic">—</span>}
                  </TableCell>
                  <TableCell><StatusBadge status={p.status as any} /></TableCell>
                  <TableCell className="text-right">
                    {p.status === 'OPEN' ? (
                      <Button size="sm" className="h-7 text-xs"><Lock className="mr-1 h-3 w-3" /> Close period</Button>
                    ) : (
                      <Button size="sm" variant="outline" className="h-7 text-xs text-amber-700"><Unlock className="mr-1 h-3 w-3" /> Reopen</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground p-3 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
          <AlertCircle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
          <span><strong>Reopen requires CFO + reason</strong>. Every reopen is audit-logged and notifies the auditor.</span>
        </div>
      </Card>
    </PageShell>
  );
}
