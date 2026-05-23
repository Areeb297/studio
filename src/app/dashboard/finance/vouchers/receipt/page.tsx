'use client';

import { useState } from 'react';
import { Save, ArrowDownRight, Sparkles } from 'lucide-react';
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

export default function SimplifiedReceiptPage() {
  const [amount, setAmount] = useState(35_000);
  const [from, setFrom] = useState('4001');
  const [to, setTo] = useState('1002');

  return (
    <PageShell
      eyebrow="General Ledger · Fast entry"
      title="Simplified Receipt"
      description="Two-account fast entry for the most common case: Dr Cash/Bank · Cr Income/Customer. No multi-line, no headers — just type and post."
      breadcrumb={[{ label: 'General Ledger' }, { label: 'Simplified Receipt' }]}
      actions={<Button size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Post receipt</Button>}
      kpis={
        <>
          <KpiCard label="Type" value="Receipt" tone="success" icon={ArrowDownRight} />
          <KpiCard label="Amount" value={formatPKR(amount)} tone="accent" />
          <KpiCard label="Posts to" value={to} tone="info" hint="Bank / Cash" />
          <KpiCard label="From" value={from} tone="warning" hint="Income / Customer" />
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6">
          <SectionHeader eyebrow="Single screen · 2-account entry" title="What did we receive?" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Date</Label>
              <Input type="date" defaultValue="2026-05-23" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Voucher #</Label>
              <Input value="SR-2026-05-0044" readOnly className="font-mono bg-muted/30" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Amount (PKR)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="tabular-nums font-bold text-2xl h-14" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Received in</Label>
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1001">1001 · Cash on Hand</SelectItem>
                  <SelectItem value="1002">1002 · Bank — HBL Current</SelectItem>
                  <SelectItem value="1003">1003 · Bank — MCB Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">On behalf of</Label>
              <AccountPicker value={from} onChange={setFrom} placeholder="Income / Customer" defaultFilter="ALL" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Reference</Label>
              <Input placeholder="HBL ch#10488 / IBT-22019 / cash" className="font-mono" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Description</Label>
              <Textarea rows={2} placeholder="Optional remarks" />
            </div>
          </div>
        </Card>

        <Card className="p-5 h-fit">
          <SectionHeader eyebrow="Posting" title="GL preview" />
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b pb-1"><span>Dr {to}</span><span className="tabular-nums text-emerald-700 font-semibold">{formatPKR(amount)}</span></div>
            <div className="flex justify-between pt-1"><span>Cr {from}</span><span className="tabular-nums text-rose-700 font-semibold">{formatPKR(amount)}</span></div>
          </div>
          <div className="mt-3 flex items-start gap-2 text-xs text-emerald-900 dark:text-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-md p-3">
            <Sparkles className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>Posts to the same underlying GL as a full Journal Voucher. Use this when both sides are obvious — saves keystrokes.</span>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
