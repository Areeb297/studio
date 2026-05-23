'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeftRight, Wallet, FileText, Save, CheckCircle2 } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { customers } from '@/lib/finance/ar-ap-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

type Credit = { id: string; ref: string; date: string; remaining: number };
type Invoice = { number: string; date: string; balance: number; daysOld: number };

const initialCredits: Credit[] = [
  { id: 'cr1', ref: 'CR-2026-04-0078', date: '12 Apr', remaining: 45_000 },
  { id: 'cr2', ref: 'CR-2026-05-0090', date: '18 May', remaining: 30_000 },
  { id: 'cn1', ref: 'CN-2026-05-0003', date: '15 May', remaining:  5_000 },
];

const initialInvoices: Invoice[] = [
  { number: 'CI-2026-04-0019', date: '12 Apr', balance: 120_000, daysOld: 41 },
  { number: 'CI-2026-04-0024', date: '18 Apr', balance:  50_000, daysOld: 35 },
  { number: 'CI-2026-05-0042', date: '23 May', balance:  57_650, daysOld:  0 },
];

type Allocation = { creditId: string; invoiceNumber: string; amount: number };

export default function AllocationPage() {
  const [custId, setCustId] = useState('c01');
  const cust = customers.find(c => c.id === custId)!;
  const [allocations, setAllocations] = useState<Allocation[]>([
    { creditId: 'cr1', invoiceNumber: 'CI-2026-04-0019', amount: 45_000 },
    { creditId: 'cn1', invoiceNumber: 'CI-2026-04-0019', amount:  5_000 },
  ]);

  const usedByCredit = (id: string) => allocations.filter(a => a.creditId === id).reduce((s, a) => s + a.amount, 0);
  const appliedToInvoice = (n: string) => allocations.filter(a => a.invoiceNumber === n).reduce((s, a) => s + a.amount, 0);

  const totalUnallocated = initialCredits.reduce((s, c) => s + c.remaining - usedByCredit(c.id), 0);
  const totalApplied     = allocations.reduce((s, a) => s + a.amount, 0);

  // Allocate ALL unapplied credits oldest-first
  const autoAllocate = () => {
    const next: Allocation[] = [];
    let invoicesLeft = initialInvoices.map(i => ({ ...i, remaining: i.balance }));
    for (const credit of initialCredits) {
      let cRem = credit.remaining;
      for (const inv of invoicesLeft) {
        if (cRem <= 0 || inv.remaining <= 0) continue;
        const t = Math.min(cRem, inv.remaining);
        next.push({ creditId: credit.id, invoiceNumber: inv.number, amount: t });
        cRem -= t; inv.remaining -= t;
      }
    }
    setAllocations(next);
  };

  return (
    <PageShell
      eyebrow="Receivables · Apply credits"
      title="Customer Allocation"
      description="Manually match unallocated receipts and credit notes against open invoices. Click auto-allocate for oldest-first."
      breadcrumb={[
        { label: 'Receivables', href: '/dashboard/finance/ar' },
        { label: 'Allocation' },
      ]}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={autoAllocate}><ArrowLeftRight className="mr-1.5 h-3.5 w-3.5" /> Auto-allocate oldest-first</Button>
          <Button size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Save allocations</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Customer"          value={cust.name}                  tone="info"  hint={cust.contact} />
          <KpiCard label="Open balance"      value={formatPKR(cust.totalOpen)} tone="warning" icon={FileText} />
          <KpiCard label="Total applied"     value={formatPKR(totalApplied)}    tone="success" icon={CheckCircle2} />
          <KpiCard label="Unallocated"        value={formatPKR(totalUnallocated)} tone="accent"  icon={Wallet} hint="On account" />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <Select value={custId} onValueChange={setCustId}>
          <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
          <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
        </Select>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <SectionHeader eyebrow="Source" title="Unallocated credits" description="Receipts + credit notes with remaining balance" />
          <ul className="space-y-2">
            {initialCredits.map(cr => {
              const used = usedByCredit(cr.id);
              const remaining = cr.remaining - used;
              const fullyUsed = remaining === 0;
              return (
                <li key={cr.id} className={cn(
                  'flex items-center gap-3 rounded-lg border p-3',
                  fullyUsed ? 'bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900 opacity-70'
                            : 'bg-muted/30 border-border',
                )}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-700 shrink-0">
                    <Wallet className="h-4 w-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs font-bold">{cr.ref}</div>
                    <div className="text-xs text-muted-foreground">{cr.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold tabular-nums">{formatPKR(remaining)}</div>
                    <div className="text-[10px] text-muted-foreground">of {formatPKR(cr.remaining)}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="p-4">
          <SectionHeader eyebrow="Target" title="Open invoices" description="Outstanding balances, oldest first" />
          <ul className="space-y-2">
            {initialInvoices.map(inv => {
              const applied = appliedToInvoice(inv.number);
              const remaining = inv.balance - applied;
              const fullyPaid = remaining === 0;
              return (
                <li key={inv.number} className={cn(
                  'flex items-center gap-3 rounded-lg border p-3',
                  fullyPaid ? 'bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900' : 'bg-muted/30 border-border',
                )}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-100 text-amber-700 shrink-0">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs font-bold">{inv.number}</div>
                    <div className="text-xs text-muted-foreground">{inv.date} · {inv.daysOld}d old</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold tabular-nums">{formatPKR(remaining)}</div>
                    <div className="text-[10px] text-muted-foreground">of {formatPKR(inv.balance)}</div>
                  </div>
                  {fullyPaid && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <Card className="p-4 mt-4">
        <SectionHeader eyebrow="Allocations" title="Mapping: credit → invoice" />
        {allocations.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">No allocations yet — click auto-allocate.</div>
        ) : (
          <ul className="space-y-2">
            {allocations.map((a, i) => (
              <li key={i} className="flex items-center gap-3 rounded-lg border border-border p-3 bg-card">
                <span className="font-mono text-xs flex-1">{a.creditId.toUpperCase()}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="font-mono text-xs flex-1">{a.invoiceNumber}</span>
                <span className="font-bold tabular-nums">{formatPKR(a.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </PageShell>
  );
}
