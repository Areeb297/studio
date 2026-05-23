'use client';

import { Lock, Save, AlertTriangle, Shield } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

const banks = [
  { code: '1002', name: 'HBL Current',         lastRecon: '31 Apr 2026', cutoff: '2026-04-30', hardFreeze: true,  pendingBeforeCutoff: 0 },
  { code: '1003', name: 'MCB Savings',         lastRecon: '31 Apr 2026', cutoff: '2026-04-30', hardFreeze: true,  pendingBeforeCutoff: 0 },
  { code: '1004', name: 'UBL USD',             lastRecon: '30 Apr 2026', cutoff: '2026-04-30', hardFreeze: false, pendingBeforeCutoff: 2 },
  { code: '1005', name: 'Meezan Donations',     lastRecon: '31 Apr 2026', cutoff: '2026-04-30', hardFreeze: true,  pendingBeforeCutoff: 0 },
  { code: '1006', name: 'HBL Madrasa Fees',     lastRecon: '31 Apr 2026', cutoff: '2026-04-30', hardFreeze: true,  pendingBeforeCutoff: 0 },
];

export default function ReconciliationCutoffPage() {
  const hard = banks.filter(b => b.hardFreeze).length;
  const soft = banks.filter(b => !b.hardFreeze).length;
  const pending = banks.reduce((s, b) => s + b.pendingBeforeCutoff, 0);

  return (
    <PageShell
      eyebrow="Cash & Bank · Security control"
      title="Reconciliation Cutoff Setup"
      description="Per-bank cutoff dates that freeze older entries. The posting engine enforces these — no voucher with a date ≤ cutoff can post on a hard-frozen bank."
      breadcrumb={[{ label: 'Cash & Bank' }, { label: 'Recon Cutoff' }]}
      actions={<Button size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Save changes</Button>}
      kpis={
        <>
          <KpiCard label="Bank accounts" value={banks.length} tone="info"    icon={Shield} />
          <KpiCard label="Hard-frozen"   value={hard}          tone="success" icon={Lock} />
          <KpiCard label="Soft (warn only)" value={soft}       tone="warning" icon={AlertTriangle} />
          <KpiCard label="Pending before cutoff" value={pending} tone={pending > 0 ? 'danger' : 'success'} hint="Postings that need handling" />
        </>
      }
    >
      <Card className="p-4">
        <SectionHeader eyebrow="Per-bank" title="Cutoff configuration" />
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[100px] font-mono">GL</TableHead>
                <TableHead>Bank account</TableHead>
                <TableHead className="w-[160px]">Last reconciled</TableHead>
                <TableHead className="w-[180px]">Cutoff date</TableHead>
                <TableHead className="w-[180px]">Mode</TableHead>
                <TableHead className="text-center w-[140px]">Pending before</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banks.map(b => (
                <TableRow key={b.code} className="hover:bg-primary/5">
                  <TableCell className="font-mono text-xs">{b.code}</TableCell>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{b.lastRecon}</TableCell>
                  <TableCell><Input type="date" defaultValue={b.cutoff} className="h-9 text-xs" /></TableCell>
                  <TableCell>
                    <Label className="flex items-center gap-2 cursor-pointer">
                      <Switch defaultChecked={b.hardFreeze} />
                      <span className={cn('text-xs font-semibold', b.hardFreeze ? 'text-rose-700' : 'text-amber-700')}>
                        {b.hardFreeze ? <><Lock className="inline h-3 w-3 mr-0.5" /> Hard freeze</> : <><AlertTriangle className="inline h-3 w-3 mr-0.5" /> Soft (warn)</>}
                      </span>
                    </Label>
                  </TableCell>
                  <TableCell className={cn('text-center text-xs font-semibold', b.pendingBeforeCutoff > 0 ? 'text-rose-700' : 'text-muted-foreground')}>
                    {b.pendingBeforeCutoff > 0 ? `${b.pendingBeforeCutoff} entries` : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className="p-4 bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900">
            <div className="flex items-start gap-2 text-xs text-rose-900 dark:text-rose-200">
              <Lock className="h-4 w-4 shrink-0 mt-0.5" />
              <span><strong>Hard freeze</strong> — voucher form rejects any date ≤ cutoff on that bank. Used after reconciling a period.</span>
            </div>
          </Card>
          <Card className="p-4 bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
            <div className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span><strong>Soft (warn only)</strong> — voucher form shows a yellow banner but allows posting with CFO override.</span>
            </div>
          </Card>
        </div>
      </Card>
    </PageShell>
  );
}
