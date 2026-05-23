'use client';

import { useState } from 'react';
import { Play, CheckCircle2, Clock, Calendar, FileText, History, TrendingDown } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { StatusBadge } from '@/components/finance/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { depreciationRuns, depRunPreview, fixedAssets } from '@/lib/finance/assets-data';
import { formatPKR } from '@/utils/accounting';

export default function DepreciationRunPage() {
  const [period, setPeriod] = useState('May 2026');
  const [showPreview, setShowPreview] = useState(true);

  const totalDep = depRunPreview.reduce((a, x) => a + x.monthly, 0);
  const current = depreciationRuns[0];

  return (
    <PageShell
      eyebrow="Fixed Assets · Monthly batch"
      title="Depreciation Run"
      description="Run a single batch journal that depreciates every active asset for the selected period."
      breadcrumb={[
        { label: 'Fixed Assets', href: '/dashboard/finance/assets' },
        { label: 'Depreciation Run' },
      ]}
      actions={
        <>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {depreciationRuns.map(r => (
                <SelectItem key={r.period} value={r.period} disabled={r.status === 'POSTED'}>
                  {r.period} {r.status === 'POSTED' && '· posted'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm"><Play className="mr-1.5 h-3.5 w-3.5" /> Generate journal</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Period" value={period} tone="info" icon={Calendar} />
          <KpiCard label="Eligible assets" value={fixedAssets.length} tone="accent" icon={FileText} />
          <KpiCard label="Computed depreciation" value={formatPKR(totalDep)} tone="warning" icon={TrendingDown} hint="To post this period" />
          <KpiCard label="Current status" value={current.status === 'PENDING' ? 'Pending' : 'Posted'} tone={current.status === 'PENDING' ? 'warning' : 'success'} icon={current.status === 'PENDING' ? Clock : CheckCircle2} />
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4">
            <SectionHeader
              eyebrow="Run preview"
              title="Per-asset depreciation"
              description="Generated using each category's method (straight-line or reducing balance)."
              actions={<Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>{showPreview ? 'Hide' : 'Show'} preview</Button>}
            />
            {showPreview && (
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead className="w-[140px]">Code</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead className="text-right w-[130px]">Cost</TableHead>
                      <TableHead className="text-right w-[130px]">Acc.Dep prior</TableHead>
                      <TableHead className="text-right w-[150px]">Dep this period</TableHead>
                      <TableHead className="text-right w-[130px]">Acc.Dep new</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {depRunPreview.map(r => (
                      <TableRow key={r.code}>
                        <TableCell className="font-mono text-xs">{r.code}</TableCell>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatPKR(r.cost)}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">{formatPKR(r.accDepPrior)}</TableCell>
                        <TableCell className="text-right tabular-nums font-semibold text-amber-700">{formatPKR(r.monthly)}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatPKR(r.accDepPrior + r.monthly)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter className="bg-muted/60">
                    <TableRow>
                      <TableCell colSpan={4} className="text-right text-xs uppercase tracking-wide font-bold">Total this period</TableCell>
                      <TableCell className="text-right tabular-nums font-bold">{formatPKR(totalDep)}</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            )}
          </Card>
        </div>

        <Card className="p-5 h-fit">
          <SectionHeader eyebrow="History" title="Recent runs" />
          <ul className="space-y-3">
            {depreciationRuns.map(r => (
              <li key={r.period} className="flex items-center gap-3">
                <span className={r.status === 'POSTED'
                  ? 'flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700'
                  : 'flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700'}>
                  {r.status === 'POSTED' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                </span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{r.period}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.runDate ? new Date(r.runDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not run yet'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold tabular-nums">{formatPKR(r.total)}</div>
                  <div className="text-xs text-muted-foreground">{r.assets} assets</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PageShell>
  );
}
