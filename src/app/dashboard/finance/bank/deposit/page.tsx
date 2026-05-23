'use client';

import { useState } from 'react';
import { Save, ArrowDownRight, Banknote, PiggyBank } from 'lucide-react';
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

export default function CashDepositPage() {
  const [amount, setAmount] = useState(50_000);
  const [bank, setBank] = useState('1002');

  return (
    <PageShell
      eyebrow="Cash & Bank · Deposit"
      title="Cash Deposit"
      description="Move cash from the drawer into a bank account. Generates a BRV-type voucher: Dr Bank · Cr Cash."
      breadcrumb={[{ label: 'Cash & Bank' }, { label: 'Deposit' }]}
      actions={<Button size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Post deposit</Button>}
      kpis={
        <>
          <KpiCard label="Cash drawer (before)" value={formatPKR(452_800)} tone="warning" icon={Banknote} />
          <KpiCard label="Deposit amount"        value={formatPKR(amount)}  tone="accent"  icon={ArrowDownRight} />
          <KpiCard label="Bank (after)"           value={formatPKR(2_850_000 + amount)} tone="success" icon={PiggyBank} hint="HBL Current" />
          <KpiCard label="Cash (after)"           value={formatPKR(452_800 - amount)}   tone="info" />
        </>
      }
    >
      <Card className="p-5 max-w-2xl">
        <SectionHeader eyebrow="Deposit slip" title="Move cash → bank" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Date</Label>
            <Input type="date" defaultValue="2026-05-23" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Voucher #</Label>
            <Input value="BRV-2026-05-0024" readOnly className="font-mono bg-muted/30" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">From (cash)</Label>
            <Select defaultValue="1001">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1001">1001 · Cash on Hand</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">To (bank)</Label>
            <Select value={bank} onValueChange={setBank}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1002">1002 · Bank — HBL Current</SelectItem>
                <SelectItem value="1003">1003 · Bank — MCB Savings</SelectItem>
                <SelectItem value="1005">1005 · Bank — Meezan Donations</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Amount (PKR)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="tabular-nums font-bold text-lg h-12" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Deposit slip #</Label>
            <Input placeholder="HBL-DEP-20260523-..." className="font-mono" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Notes</Label>
            <Textarea rows={2} placeholder="Optional remarks" />
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-border">
          <SectionHeader eyebrow="Posting preview" title="GL entries" />
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b pb-1"><span>Dr {bank} Bank Account</span><span className="tabular-nums">{formatPKR(amount)}</span></div>
            <div className="flex justify-between text-rose-700 pt-1"><span>Cr 1001 Cash on Hand</span><span className="tabular-nums">{formatPKR(amount)}</span></div>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}
