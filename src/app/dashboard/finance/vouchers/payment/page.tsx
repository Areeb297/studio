'use client';

import { useState } from 'react';
import { Save, ArrowUpRight, Sparkles } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { AccountPicker } from '@/components/finance/account-picker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPKR } from '@/utils/accounting';

export default function SimplifiedPaymentPage() {
  const [amount, setAmount] = useState(12_500);
  const [to, setTo] = useState('5101');
  const [from, setFrom] = useState('1002');

  return (
    <PageShell
      eyebrow="General Ledger · Fast entry"
      title="Simplified Payment"
      description="Two-account fast entry for the most common case: Dr Expense/Supplier · Cr Cash/Bank. No multi-line — just type and post."
      breadcrumb={[{ label: 'General Ledger' }, { label: 'Simplified Payment' }]}
      actions={<Button size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Post payment</Button>}
      kpis={
        <>
          <KpiCard label="Type"     value="Payment"        tone="warning" icon={ArrowUpRight} />
          <KpiCard label="Amount"   value={formatPKR(amount)} tone="accent" />
          <KpiCard label="Paid to"  value={to}              tone="info"  hint="Expense / Supplier" />
          <KpiCard label="Paid from" value={from}           tone="success" hint="Bank / Cash" />
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6">
          <SectionHeader eyebrow="Single screen · 2-account entry" title="What did we pay?" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Date</Label>
              <Input type="date" defaultValue="2026-05-23" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Voucher #</Label>
              <Input value="SP-2026-05-0029" readOnly className="font-mono bg-muted/30" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Amount (PKR)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="tabular-nums font-bold text-2xl h-14" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Paid from</Label>
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1001">1001 · Cash on Hand</SelectItem>
                  <SelectItem value="1002">1002 · Bank — HBL Current</SelectItem>
                  <SelectItem value="1003">1003 · Bank — MCB Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Paid to (expense / supplier)</Label>
              <AccountPicker value={to} onChange={setTo} placeholder="Expense / Supplier" defaultFilter="ALL" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Reference</Label>
              <Input placeholder="HBL ch#10231 / receipt #..." className="font-mono" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Description</Label>
              <Textarea rows={2} placeholder="K-Electric May bill, office supplies, etc." />
            </div>
          </div>
        </Card>

        <Card className="p-5 h-fit">
          <SectionHeader eyebrow="Posting" title="GL preview" />
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b pb-1"><span>Dr {to}</span><span className="tabular-nums text-emerald-700 font-semibold">{formatPKR(amount)}</span></div>
            <div className="flex justify-between pt-1"><span>Cr {from}</span><span className="tabular-nums text-rose-700 font-semibold">{formatPKR(amount)}</span></div>
          </div>
          <div className="mt-3 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-md p-3">
            <Sparkles className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>Posts to the same underlying GL as a full Journal Voucher. Use this when both sides are obvious — saves keystrokes.</span>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
