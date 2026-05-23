'use client';

import { useState, useMemo } from 'react';
import { Send, Save, XCircle, AlertTriangle, FileText, ShieldAlert } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { customers, openInvoicesForCustomer } from '@/lib/finance/ar-ap-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

export default function WriteOffPage() {
  const [custId, setCustId] = useState('c02');
  const cust = customers.find(c => c.id === custId)!;
  const invoices = useMemo(() => openInvoicesForCustomer(custId), [custId]);
  const [chosen, setChosen] = useState<Set<string>>(new Set(invoices.length > 0 ? [invoices[0].number] : []));

  const total = invoices.filter(i => chosen.has(i.number)).reduce((s, i) => s + i.balance, 0);

  const toggle = (n: string) => setChosen(prev => {
    const next = new Set(prev);
    next.has(n) ? next.delete(n) : next.add(n);
    return next;
  });

  return (
    <PageShell
      eyebrow="Receivables · Bad debt"
      title="Customer Write-Off"
      description="Move unrecoverable invoices off the receivables ledger. Requires GM approval. The original invoice stays on file, marked WRITTEN_OFF."
      breadcrumb={[
        { label: 'Receivables', href: '/dashboard/finance/ar' },
        { label: 'Write-Off' },
      ]}
      actions={
        <>
          <Button variant="outline" size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Save draft</Button>
          <Button size="sm" className="bg-rose-600 hover:bg-rose-700" disabled={total === 0}>
            <Send className="mr-1.5 h-3.5 w-3.5" /> Submit for GM approval
          </Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Customer balance" value={formatPKR(cust.totalOpen)} tone="info"    icon={FileText} hint={cust.name} />
          <KpiCard label="Invoices selected" value={chosen.size}                tone="warning" icon={XCircle} />
          <KpiCard label="Write-off amount"  value={formatPKR(total)}           tone="danger"  icon={AlertTriangle} />
          <KpiCard label="Requires approval" value="GM only"                     tone="violet"  icon={ShieldAlert} />
        </>
      }
    >
      <Card className="p-5 mb-4">
        <SectionHeader eyebrow="Step 1" title="Customer" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Customer</Label>
            <Select value={custId} onValueChange={(v) => { setCustId(v); setChosen(new Set()); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">WO #</Label>
            <Input value="WO-2026-05-0003" readOnly className="font-mono bg-muted/30" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Date</Label>
            <Input type="date" defaultValue="2026-05-23" />
          </div>
        </div>
      </Card>

      <Card className="p-5 mb-4">
        <SectionHeader eyebrow="Step 2" title="Pick invoices to write off" description="Typically only 90+ day-old, unrecoverable balances." />
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[40px]" />
                <TableHead>Invoice #</TableHead>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead className="w-[80px] text-center">Age</TableHead>
                <TableHead className="text-right w-[160px]">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">No open invoices for this customer.</TableCell></TableRow>
              ) : invoices.map(inv => (
                <TableRow key={inv.number} className={cn(chosen.has(inv.number) ? 'bg-rose-50 dark:bg-rose-950/30' : '')}>
                  <TableCell><Checkbox checked={chosen.has(inv.number)} onCheckedChange={() => toggle(inv.number)} /></TableCell>
                  <TableCell className="font-mono text-xs">{inv.number}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{inv.date}</TableCell>
                  <TableCell className={cn(
                    'text-center text-xs font-bold',
                    inv.daysOld > 90 ? 'text-rose-700' : inv.daysOld > 30 ? 'text-amber-700' : 'text-emerald-700',
                  )}>
                    {inv.daysOld}d
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{formatPKR(inv.balance)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-muted/60">
              <TableRow><TableCell colSpan={4} className="text-right text-xs uppercase tracking-wide font-bold">Total to write off</TableCell>
                <TableCell className="text-right tabular-nums font-bold text-base text-rose-700">{formatPKR(total)}</TableCell></TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Justification</Label>
          <Textarea rows={4} className="mt-1.5" defaultValue="Customer ceased operations. Multiple recovery attempts failed (calls + legal notice). Recommended to write off per audit policy." />
        </Card>
        <Card className="p-5">
          <SectionHeader eyebrow="Posting preview" title="GL entries on approval" />
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b pb-1"><span>Dr 5550 Bad Debt Expense</span><span className="tabular-nums">{formatPKR(total)}</span></div>
            <div className="flex justify-between text-rose-700 pt-1"><span>Cr 1100 Accounts Receivable</span><span className="tabular-nums">{formatPKR(total)}</span></div>
          </div>
          <div className="mt-3 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span><strong>Irreversible after approval.</strong> Invoices marked WRITTEN_OFF stay visible in customer history but no longer count in receivables or ageing.</span>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
