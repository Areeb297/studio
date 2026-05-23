'use client';

import { useState, useMemo } from 'react';
import {
  Save, Send, ArrowDownRight, Wallet, Calendar, Hash, Check,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { customers, openInvoicesForCustomer, type OpenInvoice } from '@/lib/finance/ar-ap-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

type Mode = 'CASH' | 'CHEQUE' | 'TRANSFER' | 'PAY_ORDER';

export default function CustomerReceiptPage() {
  const [custId, setCustId] = useState('c01');
  const [mode, setMode] = useState<Mode>('CHEQUE');
  const [amount, setAmount] = useState(120_000);
  const [chosen, setChosen] = useState<Record<string, number>>({ 'CI-2026-04-0019': 120_000 });

  const cust = customers.find(c => c.id === custId)!;
  const invoices = useMemo(() => openInvoicesForCustomer(custId), [custId]);
  const applied = Object.values(chosen).reduce((a, v) => a + v, 0);
  const remaining = amount - applied;

  const toggleInvoice = (inv: OpenInvoice) => {
    setChosen(prev => {
      const next = { ...prev };
      if (next[inv.number]) delete next[inv.number];
      else next[inv.number] = inv.balance;
      return next;
    });
  };

  const updateApply = (n: string, v: number) =>
    setChosen(prev => ({ ...prev, [n]: v }));

  // auto-allocate oldest-first
  const autoAlloc = () => {
    let remaining = amount;
    const next: Record<string, number> = {};
    for (const inv of invoices) {
      if (remaining <= 0) break;
      const take = Math.min(remaining, inv.balance);
      if (take > 0) {
        next[inv.number] = take;
        remaining -= take;
      }
    }
    setChosen(next);
  };

  return (
    <PageShell
      eyebrow="Receivables · New entry"
      title="Customer Receipt"
      description="Apply incoming money to outstanding customer invoices. Oldest-first by default; manual override on every row."
      breadcrumb={[
        { label: 'Receivables', href: '/dashboard/finance/ar' },
        { label: 'Customer Receipt' },
      ]}
      actions={
        <>
          <Button variant="outline" size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Save draft</Button>
          <Button size="sm" disabled={Math.abs(remaining) > 0.5 && applied > 0}>
            <Send className="mr-1.5 h-3.5 w-3.5" /> Post receipt
          </Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Customer balance" value={formatPKR(cust.totalOpen)} tone="info" icon={ArrowDownRight} hint={cust.name} />
          <KpiCard label="Amount received" value={formatPKR(amount)} tone="success" icon={Wallet} />
          <KpiCard label="Applied" value={formatPKR(applied)} tone="accent" icon={Check} />
          <KpiCard
            label={remaining > 0 ? 'On account' : remaining < 0 ? 'Over-applied' : 'Fully applied'}
            value={formatPKR(Math.abs(remaining))}
            tone={remaining === 0 ? 'success' : remaining > 0 ? 'warning' : 'danger'}
            icon={Check}
          />
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <SectionHeader eyebrow="Step 1" title="Receipt header" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Customer</Label>
                <Select value={custId} onValueChange={setCustId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Receipt #</Label>
                <Input value="CR-2026-05-0104" readOnly className="font-mono bg-muted/30" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Date</Label>
                <Input type="date" defaultValue="2026-05-23" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Amount received (PKR)</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="tabular-nums font-semibold"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Payment mode</Label>
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
                <>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Cheque #</Label>
                    <Input placeholder="HBL ch#10488" className="font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Cheque date</Label>
                    <Input type="date" defaultValue="2026-05-22" />
                  </div>
                </>
              )}
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Deposit account</Label>
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
            <SectionHeader
              eyebrow="Step 2"
              title="Apply to invoices"
              description="Oldest-first when you click auto-allocate. Manually edit any row."
              actions={<Button variant="outline" size="sm" onClick={autoAlloc}>Auto-allocate oldest-first</Button>}
            />
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-[40px]" />
                    <TableHead>Invoice #</TableHead>
                    <TableHead className="w-[110px]">Date</TableHead>
                    <TableHead className="w-[110px]">Due</TableHead>
                    <TableHead className="w-[70px] text-center">Days</TableHead>
                    <TableHead className="text-right w-[120px]">Balance</TableHead>
                    <TableHead className="text-right w-[140px]">Apply</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">No open invoices for this customer.</TableCell></TableRow>
                  ) : invoices.map(inv => (
                    <TableRow key={inv.number} className={cn(chosen[inv.number] ? 'bg-primary/5' : '')}>
                      <TableCell>
                        <Checkbox checked={!!chosen[inv.number]} onCheckedChange={() => toggleInvoice(inv)} />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{inv.number}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{inv.date}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{inv.dueDate}</TableCell>
                      <TableCell className={cn(
                        'text-center text-xs font-semibold',
                        inv.daysOld > 90 ? 'text-rose-700' : inv.daysOld > 30 ? 'text-amber-700' : 'text-emerald-700',
                      )}>{inv.daysOld}</TableCell>
                      <TableCell className="text-right tabular-nums font-medium">{formatPKR(inv.balance)}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={chosen[inv.number] ?? ''}
                          onChange={e => updateApply(inv.number, Number(e.target.value))}
                          placeholder="0"
                          className="h-8 text-right tabular-nums"
                          disabled={!chosen[inv.number]}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter className="bg-muted/60">
                  <TableRow>
                    <TableCell colSpan={5} className="text-right text-xs uppercase tracking-wide font-bold">Applied</TableCell>
                    <TableCell className="text-right tabular-nums font-bold">{formatPKR(applied)}</TableCell>
                    <TableCell />
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </Card>
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          <Card className="p-5">
            <SectionHeader eyebrow="Posting preview" title="GL entries" />
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-border pb-1">
                <span>Dr 1002 Bank / 1001 Cash</span>
                <span className="tabular-nums font-semibold">{formatPKR(amount)}</span>
              </div>
              <div className="flex justify-between text-rose-700 pt-1">
                <span>Cr 1100 Accounts Receivable</span>
                <span className="tabular-nums font-semibold">{formatPKR(amount)}</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              + {Object.keys(chosen).length} allocation rows linking receipt to invoices.
            </div>
          </Card>

          <Card className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
            <div className="text-xs text-emerald-900 dark:text-emerald-200">
              <div className="font-semibold mb-1">Tip</div>
              <p>Click <strong>Auto-allocate</strong> to apply oldest invoices first. If the received amount exceeds open invoices, the surplus parks as <em>On Account</em> and can be applied later.</p>
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
