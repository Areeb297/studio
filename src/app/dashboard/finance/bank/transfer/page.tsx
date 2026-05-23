'use client';

import { useState } from 'react';
import { Save, ArrowLeftRight, PiggyBank } from 'lucide-react';
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

const banks = [
  { code: '1002', name: 'HBL Current',       balance: 2_850_000 },
  { code: '1003', name: 'MCB Savings',       balance: 1_250_000 },
  { code: '1005', name: 'Meezan Donations',   balance:   875_000 },
  { code: '1006', name: 'HBL Madrasa Fees',   balance:   320_000 },
];

export default function BankTransferPage() {
  const [amount, setAmount] = useState(200_000);
  const [from, setFrom] = useState('1002');
  const [to, setTo] = useState('1003');

  const fromBank = banks.find(b => b.code === from)!;
  const toBank   = banks.find(b => b.code === to)!;

  return (
    <PageShell
      eyebrow="Cash & Bank · Transfer"
      title="Bank Transfer"
      description="Move money between two of your own bank accounts. Generates a JV: Dr To-Bank · Cr From-Bank."
      breadcrumb={[{ label: 'Cash & Bank' }, { label: 'Transfer' }]}
      actions={<Button size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Post transfer</Button>}
      kpis={
        <>
          <KpiCard label="From (before)" value={formatPKR(fromBank.balance)}          tone="warning" icon={PiggyBank} hint={fromBank.name} />
          <KpiCard label="Transfer"       value={formatPKR(amount)}                    tone="accent"  icon={ArrowLeftRight} />
          <KpiCard label="From (after)"   value={formatPKR(fromBank.balance - amount)} tone="info" />
          <KpiCard label="To (after)"     value={formatPKR(toBank.balance + amount)}   tone="success" hint={toBank.name} />
        </>
      }
    >
      <Card className="p-5 max-w-2xl">
        <SectionHeader eyebrow="Inter-account transfer" title="From → To" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Date</Label>
            <Input type="date" defaultValue="2026-05-23" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Voucher #</Label>
            <Input value="JV-2026-05-0235" readOnly className="font-mono bg-muted/30" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">From bank</Label>
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {banks.map(b => <SelectItem key={b.code} value={b.code} disabled={b.code === to}>{b.code} · {b.name} ({formatPKR(b.balance)})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">To bank</Label>
            <Select value={to} onValueChange={setTo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {banks.map(b => <SelectItem key={b.code} value={b.code} disabled={b.code === from}>{b.code} · {b.name} ({formatPKR(b.balance)})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Amount (PKR)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="tabular-nums font-bold text-lg h-12" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Bank reference</Label>
            <Input placeholder="IBT-2026052321..." className="font-mono" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Notes</Label>
            <Textarea rows={2} placeholder="Reason for transfer (cashflow management, etc.)" />
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-border">
          <SectionHeader eyebrow="Posting preview" title="GL entries" />
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b pb-1"><span>Dr {to} {toBank.name}</span><span className="tabular-nums">{formatPKR(amount)}</span></div>
            <div className="flex justify-between text-rose-700 pt-1"><span>Cr {from} {fromBank.name}</span><span className="tabular-nums">{formatPKR(amount)}</span></div>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}
