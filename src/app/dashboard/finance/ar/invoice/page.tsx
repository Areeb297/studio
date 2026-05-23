'use client';

import { useState, useMemo } from 'react';
import {
  Plus, Save, Send, X, FileText, Printer, Paperclip,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { AccountPicker } from '@/components/finance/account-picker';
import { CostCenterPicker } from '@/components/finance/cost-center-picker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { customers } from '@/lib/finance/ar-ap-data';
import { formatPKR } from '@/utils/accounting';

type Line = {
  id: string;
  desc: string;
  account: string;
  cc: string;
  qty: number;
  rate: number;
  taxPct: number;
};

const newLine = (): Line => ({ id: Math.random().toString(36).slice(2), desc: '', account: '4001', cc: '2', qty: 1, rate: 0, taxPct: 17 });

const lineSubtotal = (l: Line) => l.qty * l.rate;
const lineTax = (l: Line) => lineSubtotal(l) * (l.taxPct / 100);
const lineTotal = (l: Line) => lineSubtotal(l) + lineTax(l);

export default function CustomerInvoicePage() {
  const [custId, setCustId] = useState('c01');
  const [lines, setLines] = useState<Line[]>([
    { id: 'l1', desc: 'Catering — Eid event', account: '4002', cc: '3', qty: 1, rate: 45_000, taxPct: 17 },
    { id: 'l2', desc: 'Hall cleanup',         account: '4099', cc: '3', qty: 1, rate:  5_000, taxPct:  0 },
  ]);

  const cust = customers.find(c => c.id === custId)!;
  const subtotal = useMemo(() => lines.reduce((a, l) => a + lineSubtotal(l), 0), [lines]);
  const tax      = useMemo(() => lines.reduce((a, l) => a + lineTax(l),     0), [lines]);
  const total    = subtotal + tax;

  const update = (id: string, patch: Partial<Line>) =>
    setLines(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));
  const add  = () => setLines(prev => [...prev, newLine()]);
  const drop = (id: string) => setLines(prev => prev.length > 1 ? prev.filter(l => l.id !== id) : prev);

  return (
    <PageShell
      eyebrow="Receivables · New invoice"
      title="Customer Invoice"
      description="Issue an invoice to a customer. On post: Dr 1100 AR · Cr line accounts · Cr Tax Payable. Updates customer balance + ageing instantly."
      breadcrumb={[
        { label: 'Receivables', href: '/dashboard/finance/ar' },
        { label: 'Invoice' },
      ]}
      actions={
        <>
          <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print pack</Button>
          <Button variant="outline" size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Save draft</Button>
          <Button size="sm"><Send className="mr-1.5 h-3.5 w-3.5" /> Post invoice</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Customer balance" value={formatPKR(cust.totalOpen)} tone="info"  icon={FileText} hint={cust.name} />
          <KpiCard label="Credit limit"     value={formatPKR(cust.creditLimit)} tone="accent" hint={cust.paymentTerms} />
          <KpiCard label="Invoice subtotal" value={formatPKR(subtotal)} tone="warning" />
          <KpiCard label="Grand total"      value={formatPKR(total)} tone="success" hint={`Tax ${formatPKR(tax)}`} />
        </>
      }
    >
      <Card className="p-5 mb-4">
        <SectionHeader eyebrow="Step 1" title="Invoice header" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Invoice #</Label>
            <Input value="CI-2026-05-0043" readOnly className="font-mono bg-muted/30" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Date</Label>
            <Input type="date" defaultValue="2026-05-23" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Due date</Label>
            <Input type="date" defaultValue="2026-06-22" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Customer PO</Label>
            <Input placeholder="PO-..." />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Terms</Label>
            <Select defaultValue={cust.paymentTerms}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Cash on delivery'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Currency</Label>
            <Select defaultValue="PKR">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PKR">PKR · Rupees</SelectItem>
                <SelectItem value="USD">USD · Dollars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-5 mb-4">
        <SectionHeader eyebrow="Step 2" title="Lines" actions={
          <Button variant="outline" size="sm" onClick={add}><Plus className="mr-1 h-3 w-3" /> Add line</Button>
        } />

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[200px]">Income account</TableHead>
                <TableHead className="w-[170px]">Cost centre</TableHead>
                <TableHead className="w-[80px] text-right">Qty</TableHead>
                <TableHead className="w-[110px] text-right">Rate</TableHead>
                <TableHead className="w-[80px] text-right">Tax %</TableHead>
                <TableHead className="w-[120px] text-right">Amount</TableHead>
                <TableHead className="w-[40px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map((l, i) => (
                <TableRow key={l.id}>
                  <TableCell className="text-xs text-muted-foreground font-mono">{i + 1}</TableCell>
                  <TableCell>
                    <Input value={l.desc} onChange={e => update(l.id, { desc: e.target.value })} placeholder="Item description" className="h-9 text-sm" />
                  </TableCell>
                  <TableCell>
                    <AccountPicker value={l.account} onChange={(v) => update(l.id, { account: v })} placeholder="Income…" defaultFilter="GL" />
                  </TableCell>
                  <TableCell>
                    <CostCenterPicker value={l.cc} onChange={(v) => update(l.id, { cc: v })} />
                  </TableCell>
                  <TableCell>
                    <Input type="number" value={l.qty} onChange={e => update(l.id, { qty: Number(e.target.value) || 0 })} className="h-9 text-right tabular-nums" />
                  </TableCell>
                  <TableCell>
                    <Input type="number" value={l.rate} onChange={e => update(l.id, { rate: Number(e.target.value) || 0 })} className="h-9 text-right tabular-nums" />
                  </TableCell>
                  <TableCell>
                    <Input type="number" value={l.taxPct} onChange={e => update(l.id, { taxPct: Number(e.target.value) || 0 })} className="h-9 text-right tabular-nums" />
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{formatPKR(lineTotal(l))}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => drop(l.id)} disabled={lines.length <= 1}>
                      <X className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-muted/60">
              <TableRow>
                <TableCell colSpan={7} className="text-right text-xs uppercase tracking-wide font-bold">Subtotal</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(subtotal)}</TableCell>
                <TableCell />
              </TableRow>
              <TableRow>
                <TableCell colSpan={7} className="text-right text-xs uppercase tracking-wide font-bold">Sales tax</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(tax)}</TableCell>
                <TableCell />
              </TableRow>
              <TableRow className="bg-primary/10">
                <TableCell colSpan={7} className="text-right text-sm uppercase tracking-wide font-bold text-primary">Grand total</TableCell>
                <TableCell className="text-right tabular-nums font-bold text-lg text-primary">{formatPKR(total)}</TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Description</Label>
          <Textarea rows={3} className="mt-1.5" placeholder="Internal notes / payment instructions for the customer…" />
        </Card>
        <Card className="p-5">
          <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Attachments</Label>
          <div className="mt-1.5 flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-6 text-xs text-muted-foreground hover:border-primary hover:bg-primary/5 cursor-pointer">
            <Paperclip className="h-4 w-4" /> Drop PO copy, supporting docs
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
