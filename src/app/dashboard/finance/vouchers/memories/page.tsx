'use client';

import { useState } from 'react';
import {
  Plus, Star, Calendar, RefreshCcw, Edit, Trash2, Play,
  FileText, Banknote, Landmark, Sparkles,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

type Memory = {
  id: string;
  name: string;
  type: 'JV' | 'CPV' | 'BPV' | 'CRV';
  amount: number;
  schedule: 'MONTHLY_1ST' | 'MONTHLY_LAST' | 'QUARTERLY' | 'ANNUAL' | 'NONE';
  lastUsed: string;
  nextDue: string | null;
  uses: number;
};

const memories: Memory[] = [
  { id: 'm1', name: 'Monthly office rent — Restaurant + Lawn', type: 'JV',  amount: 120_000, schedule: 'MONTHLY_1ST',  lastUsed: '2026-04-01', nextDue: '2026-06-01', uses: 12 },
  { id: 'm2', name: 'Tehfeez salary accrual',                   type: 'JV',  amount: 320_000, schedule: 'MONTHLY_LAST', lastUsed: '2026-04-30', nextDue: '2026-05-31', uses: 18 },
  { id: 'm3', name: 'Monthly depreciation',                     type: 'JV',  amount: 412_300, schedule: 'MONTHLY_LAST', lastUsed: '2026-03-31', nextDue: '2026-04-30', uses:  9 },
  { id: 'm4', name: 'Quarterly insurance',                      type: 'JV',  amount:  45_000, schedule: 'QUARTERLY',    lastUsed: '2026-04-01', nextDue: '2026-07-01', uses:  4 },
  { id: 'm5', name: 'HBL bank charges accrual',                 type: 'BPV', amount:   1_200, schedule: 'MONTHLY_LAST', lastUsed: '2026-04-30', nextDue: '2026-05-31', uses: 24 },
  { id: 'm6', name: 'Annual vehicle insurance — Toyota Hiace',  type: 'CPV', amount:  78_500, schedule: 'ANNUAL',       lastUsed: '2025-06-15', nextDue: '2026-06-15', uses:  3 },
  { id: 'm7', name: 'Petty cash replenishment',                 type: 'CRV', amount:  25_000, schedule: 'NONE',         lastUsed: '2026-05-10', nextDue: null,         uses: 11 },
];

const scheduleLabel: Record<Memory['schedule'], string> = {
  MONTHLY_1ST:  'Monthly · 1st',
  MONTHLY_LAST: 'Monthly · last',
  QUARTERLY:    'Quarterly',
  ANNUAL:       'Annual',
  NONE:         'Manual',
};

const typeIcon: Record<Memory['type'], any> = { JV: FileText, CPV: Banknote, BPV: Landmark, CRV: Banknote };
const typeChip: Record<Memory['type'], string> = {
  JV: 'bg-slate-100 text-slate-700', CPV: 'bg-amber-100 text-amber-700', BPV: 'bg-rose-100 text-rose-700', CRV: 'bg-emerald-100 text-emerald-700',
};

const dueColor = (d: string | null) => {
  if (!d) return '';
  const days = Math.round((new Date(d).getTime() - new Date('2026-05-23').getTime()) / 86_400_000);
  if (days < 0) return 'text-rose-700 font-bold';
  if (days <= 7) return 'text-amber-700 font-semibold';
  return 'text-muted-foreground';
};

export default function VoucherMemoriesPage() {
  const [filter, setFilter] = useState('ALL');

  const rows = memories.filter(m => filter === 'ALL' || m.type === filter);
  const overdue = memories.filter(m => m.nextDue && new Date(m.nextDue) < new Date('2026-05-23')).length;
  const dueSoon = memories.filter(m => {
    if (!m.nextDue) return false;
    const d = Math.round((new Date(m.nextDue).getTime() - new Date('2026-05-23').getTime()) / 86_400_000);
    return d >= 0 && d <= 7;
  }).length;

  return (
    <PageShell
      eyebrow="General Ledger · Templates"
      title="Voucher Memories"
      description="Recurring voucher templates — recall and post in one click. Optional schedule auto-advances the next due date."
      breadcrumb={[{ label: 'General Ledger' }, { label: 'Voucher Memories' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><RefreshCcw className="mr-1.5 h-3.5 w-3.5" /> Recurring journals</Button>
          <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New memory</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Active memories" value={memories.length}   tone="info"    icon={Star} />
          <KpiCard label="Overdue"          value={overdue}            tone="danger"  icon={Calendar} hint="Past next-due date" />
          <KpiCard label="Due ≤ 7 days"     value={dueSoon}            tone="warning" icon={Calendar} />
          <KpiCard label="Posts this year"  value={memories.reduce((a, m) => a + m.uses, 0)} tone="success" icon={Sparkles} />
        </>
      }
    >
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex-1 max-w-md">
            <Input placeholder="Search memories…" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All types</SelectItem>
              {['JV','CPV','CRV','BPV'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[60px]">Type</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead className="text-right w-[140px]">Amount</TableHead>
                <TableHead className="w-[160px]">Schedule</TableHead>
                <TableHead className="w-[140px]">Last used</TableHead>
                <TableHead className="w-[140px]">Next due</TableHead>
                <TableHead className="text-center w-[80px]">Uses</TableHead>
                <TableHead className="w-[200px] text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(m => {
                const Icon = typeIcon[m.type];
                return (
                  <TableRow key={m.id} className="hover:bg-primary/5">
                    <TableCell>
                      <span className={cn('inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold', typeChip[m.type])}>
                        <Icon className="h-2.5 w-2.5" /> {m.type}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">{formatPKR(m.amount)}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-xs">
                        <RefreshCcw className="h-3 w-3 text-muted-foreground" />
                        {scheduleLabel[m.schedule]}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{m.lastUsed}</TableCell>
                    <TableCell className={cn('text-xs', dueColor(m.nextDue))}>
                      {m.nextDue ?? '—'}
                    </TableCell>
                    <TableCell className="text-center tabular-nums text-xs font-semibold">{m.uses}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button size="sm" className="h-7 text-xs">
                          <Play className="mr-1 h-3 w-3" /> Post now
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-600"><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
