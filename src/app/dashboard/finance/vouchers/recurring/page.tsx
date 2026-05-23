'use client';

import { Plus, RefreshCcw, Calendar, Edit, Trash2, Play, Sparkles } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { StatusBadge } from '@/components/finance/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

type Recurring = {
  id: string;
  name: string;
  type: 'JV' | 'BPV';
  amount: number;
  frequency: 'MONTHLY_1ST' | 'MONTHLY_LAST' | 'QUARTERLY' | 'ANNUAL';
  nextDue: string;
  active: boolean;
  postsSoFar: number;
};

const items: Recurring[] = [
  { id: 'r1', name: 'Office rent — Restaurant + Lawn',       type: 'JV',  amount: 120_000, frequency: 'MONTHLY_1ST',  nextDue: '2026-06-01', active: true,  postsSoFar: 12 },
  { id: 'r2', name: 'Tehfeez salary accrual',                type: 'JV',  amount: 320_000, frequency: 'MONTHLY_LAST', nextDue: '2026-05-31', active: true,  postsSoFar: 18 },
  { id: 'r3', name: 'Monthly depreciation',                  type: 'JV',  amount: 412_300, frequency: 'MONTHLY_LAST', nextDue: '2026-05-31', active: true,  postsSoFar:  9 },
  { id: 'r4', name: 'HBL bank charges accrual',              type: 'BPV', amount:   1_200, frequency: 'MONTHLY_LAST', nextDue: '2026-05-31', active: true,  postsSoFar: 24 },
  { id: 'r5', name: 'Quarterly fire insurance',              type: 'JV',  amount:  45_000, frequency: 'QUARTERLY',    nextDue: '2026-07-01', active: true,  postsSoFar:  4 },
  { id: 'r6', name: 'Annual vehicle tracker subscription',   type: 'BPV', amount:  18_000, frequency: 'ANNUAL',       nextDue: '2026-08-15', active: true,  postsSoFar:  3 },
  { id: 'r7', name: 'Madrasa scholarship disbursement',      type: 'JV',  amount: 220_000, frequency: 'MONTHLY_1ST',  nextDue: '2026-06-01', active: false, postsSoFar: 11 },
];

const freqLabel: Record<Recurring['frequency'], string> = {
  MONTHLY_1ST: 'Monthly · 1st',
  MONTHLY_LAST: 'Monthly · last',
  QUARTERLY: 'Quarterly',
  ANNUAL: 'Annual',
};

const today = new Date('2026-05-23');
const dueColor = (d: string) => {
  const days = Math.round((new Date(d).getTime() - today.getTime()) / 86_400_000);
  if (days < 0) return 'text-rose-700 font-bold';
  if (days <= 7) return 'text-amber-700 font-semibold';
  return 'text-muted-foreground';
};

export default function RecurringJournalsPage() {
  const active = items.filter(i => i.active);
  const overdue = items.filter(i => new Date(i.nextDue) < today && i.active).length;
  const monthly = active.filter(i => i.frequency.startsWith('MONTHLY')).reduce((s, i) => s + i.amount, 0);

  return (
    <PageShell
      eyebrow="General Ledger · Automation"
      title="Recurring Journals"
      description="Auto-posted templates — system creates the voucher and routes it to approval on its due date. No human action required."
      breadcrumb={[{ label: 'General Ledger' }, { label: 'Recurring Journals' }]}
      actions={<Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New recurring</Button>}
      kpis={
        <>
          <KpiCard label="Active templates" value={active.length} tone="info"    icon={RefreshCcw} hint={`${items.length - active.length} paused`} />
          <KpiCard label="Overdue"           value={overdue}        tone="danger"  icon={Calendar} />
          <KpiCard label="Monthly run-rate"  value={formatPKR(monthly)} tone="success" icon={Sparkles} hint="If posted on schedule" />
          <KpiCard label="Auto-posts this year" value={items.reduce((s, i) => s + i.postsSoFar, 0)} tone="accent" />
        </>
      }
    >
      <Card className="p-4">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[60px]">Type</TableHead>
                <TableHead>Template</TableHead>
                <TableHead className="text-right w-[140px]">Amount</TableHead>
                <TableHead className="w-[160px]">Frequency</TableHead>
                <TableHead className="w-[140px]">Next post</TableHead>
                <TableHead className="text-center w-[100px]">Auto-posts</TableHead>
                <TableHead className="w-[110px]">Active</TableHead>
                <TableHead className="w-[160px] text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(i => (
                <TableRow key={i.id} className={cn('hover:bg-primary/5', !i.active && 'opacity-60')}>
                  <TableCell><span className={cn('inline-flex rounded px-1.5 py-0.5 text-[10px] font-bold', i.type === 'JV' ? 'bg-slate-100 text-slate-700' : 'bg-rose-100 text-rose-700')}>{i.type}</span></TableCell>
                  <TableCell className="font-medium">{i.name}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{formatPKR(i.amount)}</TableCell>
                  <TableCell className="text-xs inline-flex items-center gap-1"><RefreshCcw className="h-3 w-3 text-muted-foreground" /> {freqLabel[i.frequency]}</TableCell>
                  <TableCell className={cn('text-xs', dueColor(i.nextDue))}>{i.nextDue}</TableCell>
                  <TableCell className="text-center text-xs font-semibold tabular-nums">{i.postsSoFar}</TableCell>
                  <TableCell><Switch defaultChecked={i.active} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="outline" className="h-7 text-xs"><Play className="mr-1 h-3 w-3" /> Run now</Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-600"><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
