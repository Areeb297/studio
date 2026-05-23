'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeftRight, Wallet, FileText, Save, CheckCircle2 } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { suppliers, openBills } from '@/lib/finance/ar-ap-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

type Credit = { id: string; ref: string; date: string; amount: number };
type Allocation = { creditId: string; billNumber: string; amount: number };

const supplierCredits: Record<string, Credit[]> = {
  s01: [
    { id: 'sp1', ref: 'SP-2026-04-0030', date: '12 Apr', amount: 80_000 },
    { id: 'dn1', ref: 'DN-2026-05-0007', date: '15 May', amount:  4_500 },
  ],
  s02: [{ id: 'sp2', ref: 'SP-2026-05-0001', date: '02 May', amount: 17_200 }],
};

export default function APAllocationPage() {
  const [supId, setSupId] = useState('s01');
  const sup = suppliers.find(s => s.id === supId)!;
  const credits = supplierCredits[supId] ?? [];
  const bills = openBills.filter(b => b.supplierId === supId);

  const [allocations, setAllocations] = useState<Allocation[]>([
    { creditId: 'sp1', billNumber: 'SI-2026-04-0019', amount: 80_000 },
  ]);

  const usedByCredit = (id: string) => allocations.filter(a => a.creditId === id).reduce((s, a) => s + a.amount, 0);
  const appliedToBill = (n: string) => allocations.filter(a => a.billNumber === n).reduce((s, a) => s + a.amount, 0);

  const totalUnallocated = credits.reduce((s, c) => s + c.amount - usedByCredit(c.id), 0);
  const totalApplied     = allocations.reduce((s, a) => s + a.amount, 0);

  const autoAllocate = () => {
    const next: Allocation[] = [];
    let billsLeft = bills.map(b => ({ ...b, remaining: b.total }));
    for (const credit of credits) {
      let cRem = credit.amount;
      for (const bill of billsLeft) {
        if (cRem <= 0 || bill.remaining <= 0) continue;
        const t = Math.min(cRem, bill.remaining);
        next.push({ creditId: credit.id, billNumber: bill.number, amount: t });
        cRem -= t; bill.remaining -= t;
      }
    }
    setAllocations(next);
  };

  return (
    <PageShell
      eyebrow="Payables · Apply credits"
      title="Supplier Allocation"
      description="Match unallocated supplier payments + debit notes against open bills."
      breadcrumb={[
        { label: 'Payables', href: '/dashboard/finance/ap' },
        { label: 'Allocation' },
      ]}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={autoAllocate}><ArrowLeftRight className="mr-1.5 h-3.5 w-3.5" /> Auto-allocate</Button>
          <Button size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Save</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Supplier"          value={sup.name}                  tone="info" />
          <KpiCard label="Open balance"      value={formatPKR(sup.totalOpen)}  tone="warning" icon={FileText} />
          <KpiCard label="Applied"           value={formatPKR(totalApplied)}   tone="success" icon={CheckCircle2} />
          <KpiCard label="Unallocated"        value={formatPKR(totalUnallocated)} tone="accent" icon={Wallet} />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <Select value={supId} onValueChange={(v) => { setSupId(v); setAllocations([]); }}>
          <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
          <SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
        </Select>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <SectionHeader eyebrow="Source" title="Unallocated credits" />
          <ul className="space-y-2">
            {credits.length === 0 ? <li className="text-sm text-muted-foreground text-center py-6">No unallocated credits.</li> :
              credits.map(c => {
                const used = usedByCredit(c.id);
                const remaining = c.amount - used;
                return (
                  <li key={c.id} className={cn(
                    'flex items-center gap-3 rounded-lg border p-3',
                    remaining === 0 ? 'bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900 opacity-70' : 'bg-muted/30 border-border',
                  )}>
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-700 shrink-0">
                      <Wallet className="h-4 w-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-xs font-bold">{c.ref}</div>
                      <div className="text-xs text-muted-foreground">{c.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold tabular-nums">{formatPKR(remaining)}</div>
                      <div className="text-[10px] text-muted-foreground">of {formatPKR(c.amount)}</div>
                    </div>
                  </li>
                );
              })}
          </ul>
        </Card>

        <Card className="p-4">
          <SectionHeader eyebrow="Target" title="Open bills" />
          <ul className="space-y-2">
            {bills.length === 0 ? <li className="text-sm text-muted-foreground text-center py-6">No open bills.</li> :
              bills.map(b => {
                const applied = appliedToBill(b.number);
                const remaining = b.total - applied;
                return (
                  <li key={b.number} className={cn(
                    'flex items-center gap-3 rounded-lg border p-3',
                    remaining === 0 ? 'bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900' : 'bg-muted/30 border-border',
                  )}>
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-100 text-amber-700 shrink-0">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-xs font-bold">{b.number}</div>
                      <div className="text-xs text-muted-foreground">Due {b.dueDate} · {b.daysOld}d</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold tabular-nums">{formatPKR(remaining)}</div>
                      <div className="text-[10px] text-muted-foreground">of {formatPKR(b.total)}</div>
                    </div>
                    {remaining === 0 && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                  </li>
                );
              })}
          </ul>
        </Card>
      </div>

      <Card className="p-4 mt-4">
        <SectionHeader eyebrow="Allocations" title="Credit → bill mapping" />
        {allocations.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">No allocations yet.</div>
        ) : (
          <ul className="space-y-2">
            {allocations.map((a, i) => (
              <li key={i} className="flex items-center gap-3 rounded-lg border border-border p-3 bg-card">
                <span className="font-mono text-xs flex-1">{a.creditId.toUpperCase()}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="font-mono text-xs flex-1">{a.billNumber}</span>
                <span className="font-bold tabular-nums">{formatPKR(a.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </PageShell>
  );
}
