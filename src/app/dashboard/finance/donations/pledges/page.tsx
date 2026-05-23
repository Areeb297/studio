'use client';

import { useState } from 'react';
import {
  Plus, Heart, Star, Calendar, Mail, Search, RefreshCcw, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { pledges } from '@/lib/finance/donations-data';
import { DONATION_FUNDS } from '@/lib/finance/seed';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const fundTone: Record<string, string> = {
  ZAKAT:     'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  SADQAH:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  MOSQUE:    'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  MADRASSAH: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  GENERAL:   'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
};

const today = new Date('2026-05-23');
const dueColor = (d: string) => {
  const days = Math.round((new Date(d).getTime() - today.getTime()) / 86_400_000);
  if (days < 0) return 'text-rose-700 font-bold';
  if (days <= 14) return 'text-amber-700 font-semibold';
  return 'text-muted-foreground';
};

export default function PledgesPage() {
  const [q, setQ] = useState('');

  const rows = pledges.filter(p => !q || p.donorName.toLowerCase().includes(q.toLowerCase()) || p.fundCode.toLowerCase().includes(q.toLowerCase()));

  const overdue = pledges.filter(p => new Date(p.nextDueDate) < today).length;
  const totalPledged = pledges.reduce((s, p) => s + p.amount * p.installmentsPlanned, 0);
  const totalFulfilled = pledges.reduce((s, p) => s + p.amount * p.installmentsFulfilled, 0);

  return (
    <PageShell
      eyebrow="Donations · Recurring commitments"
      title="Donation Pledges"
      description="Active recurring or one-time commitments. Track fulfilment, send reminders, fulfil from the collection screen."
      breadcrumb={[{ label: 'Donations' }, { label: 'Pledges' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><Mail className="mr-1.5 h-3.5 w-3.5" /> Send reminders</Button>
          <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New pledge</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Active pledges"  value={pledges.length}            tone="info"    icon={Star} />
          <KpiCard label="Total committed" value={formatPKR(totalPledged)}    tone="accent"  icon={Heart} />
          <KpiCard label="Fulfilled"        value={formatPKR(totalFulfilled)} tone="success" icon={CheckCircle2} hint={`${((totalFulfilled / totalPledged) * 100).toFixed(0)}% complete`} />
          <KpiCard label="Overdue"          value={overdue}                    tone="danger"  icon={AlertTriangle} />
        </>
      }
    >
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search donor or fund…" className="pl-9" />
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead className="w-[120px]">Fund</TableHead>
                <TableHead className="text-right w-[140px]">Amount</TableHead>
                <TableHead className="w-[120px]">Frequency</TableHead>
                <TableHead className="w-[200px]">Progress</TableHead>
                <TableHead className="w-[140px]">Next due</TableHead>
                <TableHead className="w-[110px] text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(p => {
                const pct = (p.installmentsFulfilled / p.installmentsPlanned) * 100;
                return (
                  <TableRow key={p.id} className="hover:bg-primary/5">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
                          {p.donorName.split(' ').slice(0,2).map(w => w[0]).join('')}
                        </span>
                        <span className="font-semibold text-sm">{p.donorName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold', fundTone[p.fundCode])}>
                        {p.fundCode}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">{formatPKR(p.amount)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <RefreshCcw className="h-3 w-3" /> {p.frequency.replace('_',' ').toLowerCase()}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold">{p.installmentsFulfilled} of {p.installmentsPlanned}</span>
                          <span className="text-muted-foreground">{pct.toFixed(0)}%</span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell className={cn('text-xs inline-flex items-center gap-1', dueColor(p.nextDueDate))}>
                      <Calendar className="h-3 w-3" /> {p.nextDueDate}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" className="h-7 text-xs">Fulfil</Button>
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
