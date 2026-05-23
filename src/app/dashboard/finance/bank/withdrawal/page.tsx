'use client';

import { useState } from 'react';
import { Save, ArrowUpRight, Banknote, PiggyBank } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPKR } from '@/utils/accounting';

export default function CashWithdrawalPage() {
  const [amount, setAmount] = useState(25_000);
  const [bank, setBank] = useState('1002');

  return (
    <PageShell
      eyebrow="Cash & Bank · Withdrawal"
      title="Cash Withdrawal"
      description="Withdraw cash from a bank to the cash drawer. Generates a BPV-type voucher: Dr Cash · Cr Bank."
      breadcrumb={[{ label: 'Cash & Bank' }, { label: 'Withdrawal' }]}
      actions={<Button size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Post withdrawal</Button>}
      kpis={
        <>
          <KpiCard label="Bank (before)" value={formatPKR(2_850_000)}        tone="info"    icon={PiggyBank} hint="HBL Current" />
          <KpiCard label="Withdraw"        value={formatPKR(amount)}           tone="warning" icon={ArrowUpRight} />
          <KpiCard label="Bank (after)"    value={formatPKR(2_850_000 - amount)} tone="accent" />
          <KpiCard label="Cash (after)"    value={formatPKR(452_800 + amount)} tone="success" icon={Banknote} />
        </>
      }
    >
      <Card className="p-5 max-w-2xl">
        <SectionHeader eyebrow="Withdrawal slip" title="Move bank → cash" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Date</Label>
            <Input type="date" defaultValue="2026-05-23" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Voucher #</Label>
            <Input value="BPV-2026-05-0028" readOnly className="font-mono bg-muted/30" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">From (bank)</Label>
            <Select value={bank} onValueChange={setBank}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1002">1002 · Bank — HBL Current</SelectItem>
                <SelectItem value="1003">1003 · Bank — MCB Savings</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">To (cash)</Label>
            <Select defaultValue="1001">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1001">1001 · Cash on Hand</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Amount (PKR)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="tabular-nums font-bold text-lg h-12" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Cheque # / reference</Label>
            <Input placeholder="HBL ch#10031" className="font-mono" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Notes</Label>
            <Textarea rows={2} placeholder="Petty-cash replenishment, weekly run, etc." />
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-border">
          <SectionHeader eyebrow="Posting preview" title="GL entries" />
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b pb-1"><span>Dr 1001 Cash on Hand</span><span className="tabular-nums">{formatPKR(amount)}</span></div>
            <div className="flex justify-between text-rose-700 pt-1"><span>Cr {bank} Bank Account</span><span className="tabular-nums">{formatPKR(amount)}</span></div>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}
