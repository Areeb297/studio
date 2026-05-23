'use client';

import { useState, useMemo } from 'react';
import { Save, Send, ArrowUpRight, Wallet, Check, CreditCard, Truck } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { suppliers, openBills } from '@/lib/finance/ar-ap-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

type Mode = 'CASH' | 'CHEQUE' | 'TRANSFER' | 'PAY_ORDER';

export default function SupplierPaymentPage() {
  const [supplierId, setSupplierId] = useState('s01');
  const [mode, setMode] = useState<Mode>('CHEQUE');
  const [amount, setAmount] = useState(80_000);
  const supplier = suppliers.find(s => s.id === supplierId)!;
  const supplierBills = useMemo(() => openBills.filter(b => b.supplierId === supplierId), [supplierId]);
  const [chosen, setChosen] = useState<Record<string, number>>({ 'SI-2026-04-0019': 80_000 });

  const applied = Object.values(chosen).reduce((s, v) => s + v, 0);
  const remaining = amount - applied;

  const toggle = (n: string, balance: number) => setChosen(prev => {
    const next = { ...prev };
    if (next[n]) delete next[n]; else next[n] = balance;
    return next;
  });

  const update = (n: string, v: number) => setChosen(prev => ({ ...prev, [n]: v }));

  const autoAlloc = () => {
    let r = amount;
    const next: Record<string, number> = {};
    for (const b of supplierBills) {
      if (r <= 0) break;
      const t = Math.min(r, b.total);
      if (t > 0) { next[b.number] = t; r -= t; }
    }
    setChosen(next);
  };

  return (
    <PageShell
      eyebrow="Payables · New payment"
      title="Supplier Payment"
      description="Pay one supplier — apply against one or more open bills. Cheque mode pulls the next cheque from the book."
      breadcrumb={[
        { label: 'Payables', href: '/dashboard/finance/ap' },
        { label: 'Payment' },
      ]}
      actions={
        <>
          <Button variant="outline" size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Save draft</Button>
          <Button size="sm" disabled={Math.abs(remaining) > 0.5 && applied > 0}>
            <Send className="mr-1.5 h-3.5 w-3.5" /> Submit for approval
          </Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Supplier balance" value={formatPKR(supplier.totalOpen)} tone="info" icon={Truck} hint={supplier.name} />
          <KpiCard label="Payment amount"   value={formatPKR(amount)} tone="warning" icon={ArrowUpRight} />
          <KpiCard label="Applied"           value={formatPKR(applied)} tone="accent" icon={Check} />
          <KpiCard
            label={remaining > 0 ? 'On account' : remaining < 0 ? 'Over-applied' : 'Fully applied'}
            value={formatPKR(Math.abs(remaining))}
            tone={remaining === 0 ? 'success' : remaining > 0 ? 'warning' : 'danger'}
            icon={Wallet}
          />
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <SectionHeader eyebrow="Step 1" title="Payment header" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Supplier</Label>
                <Select value={supplierId} onValueChange={(v) => { setSupplierId(v); setChosen({}); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Payment #</Label>
                <Input value="SP-2026-05-0059" readOnly className="font-mono bg-muted/30" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Date</Label>
                <Input type="date" defaultValue="2026-05-23" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Amount (PKR)</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="tabular-nums font-semibold" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Mode</Label>
                <RadioGroup value={mode} onValueChange={(v) => setMode(v as Mode)} className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(['CASH','CHEQUE','TRANSFER','PAY_ORDER'] as Mode[]).map(m => (
                    <Label key={m} htmlFor={m} className={cn(
                      'flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer text-xs font-semibold',
                      mode === m ? 'border-primary bg-primary/10 text-primary' : 'border-border',
                    )}>
                      <RadioGroupItem id={m} value={m} className="sr-only" />
                      {m === 'PAY_ORDER' ? 'Pay Order' : m[0] + m.slice(1).toLowerCase()}
                    </Label>
                  ))}
                </RadioGroup>
              </div>
              {mode === 'CHEQUE' && (
                <div className="space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Cheque #</Label>
                  <Input defaultValue="10031" placeholder="auto from book" className="font-mono" />
                </div>
              )}
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Pay from</Label>
                <Select defaultValue={mode === 'CASH' ? '1001' : '1002'}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1001">1001 · Cash on Hand</SelectItem>
                    <SelectItem value="1002">1002 · Bank — HBL Current</SelectItem>
                    <SelectItem value="1003">1003 · Bank — MCB Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeader eyebrow="Step 2" title="Apply to bills" actions={<Button variant="outline" size="sm" onClick={autoAlloc}>Auto-allocate</Button>} />
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-[40px]" />
                    <TableHead>Bill #</TableHead>
                    <TableHead className="w-[110px]">Due</TableHead>
                    <TableHead className="w-[70px] text-center">Days</TableHead>
                    <TableHead className="text-right w-[120px]">Total</TableHead>
                    <TableHead className="text-right w-[140px]">Apply</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplierBills.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">No open bills.</TableCell></TableRow>
                  ) : supplierBills.map(b => (
                    <TableRow key={b.number} className={chosen[b.number] ? 'bg-primary/5' : ''}>
                      <TableCell><Checkbox checked={!!chosen[b.number]} onCheckedChange={() => toggle(b.number, b.total)} /></TableCell>
                      <TableCell className="font-mono text-xs">{b.number}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{b.dueDate}</TableCell>
                      <TableCell className={cn(
                        'text-center text-xs font-semibold',
                        b.daysOld > 90 ? 'text-rose-700' : b.daysOld > 30 ? 'text-amber-700' : 'text-emerald-700',
                      )}>{b.daysOld}</TableCell>
                      <TableCell className="text-right tabular-nums font-medium">{formatPKR(b.total)}</TableCell>
                      <TableCell><Input type="number" value={chosen[b.number] ?? ''} onChange={e => update(b.number, Number(e.target.value))} disabled={!chosen[b.number]} className="h-8 text-right tabular-nums" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter className="bg-muted/60">
                  <TableRow><TableCell colSpan={4} className="text-right text-xs uppercase tracking-wide font-bold">Applied</TableCell>
                    <TableCell />
                    <TableCell className="text-right tabular-nums font-bold">{formatPKR(applied)}</TableCell></TableRow>
                </TableFooter>
              </Table>
            </div>
          </Card>
        </div>

        <Card className="p-5 h-fit">
          <SectionHeader eyebrow="Posting" title="GL preview" />
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b pb-1"><span>Dr 2100 Accounts Payable</span><span className="tabular-nums">{formatPKR(amount)}</span></div>
            <div className="flex justify-between text-rose-700 pt-1"><span>Cr 1002 Bank / 1001 Cash</span><span className="tabular-nums">{formatPKR(amount)}</span></div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">After approval: cheque marked Used, payment advice emailed automatically.</p>
        </Card>
      </div>
    </PageShell>
  );
}
