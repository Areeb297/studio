'use client';

import { useState } from 'react';
import { Plus, X, Save, Send, Printer, FileBarChart } from 'lucide-react';
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

type Line = { id: string; desc: string; account: string; cc: string; amount: number; taxPct: number };
const newLine = (): Line => ({ id: Math.random().toString(36).slice(2), desc: '', account: '4099', cc: '3', amount: 0, taxPct: 0 });

export default function GLInvoicePage() {
  const [custId, setCustId] = useState('c01');
  const [lines, setLines] = useState<Line[]>([
    { id: 'l1', desc: 'Catering hall rental — Eid event', account: '4002', cc: '3', amount: 50_000, taxPct: 0 },
    { id: 'l2', desc: 'Cleanup service',                   account: '4099', cc: '3', amount:  5_000, taxPct: 0 },
  ]);
  const cust = customers.find(c => c.id === custId)!;
  const sub = lines.reduce((s, l) => s + l.amount, 0);
  const tax = lines.reduce((s, l) => s + l.amount * (l.taxPct / 100), 0);
  const total = sub + tax;

  const update = (id: string, patch: Partial<Line>) => setLines(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));

  return (
    <PageShell
      eyebrow="General Ledger · Document entry"
      title="GL Invoice"
      description="Lightweight invoice-style entry — multi-line header with customer, but doesn't consume inventory. Use for rent, services, late fees, etc."
      breadcrumb={[{ label: 'General Ledger' }, { label: 'GL Invoice' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print pack</Button>
          <Button variant="outline" size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Save draft</Button>
          <Button size="sm"><Send className="mr-1.5 h-3.5 w-3.5" /> Post</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Customer" value={cust.name.split(' ')[0]} tone="info" icon={FileBarChart} hint={cust.name} />
          <KpiCard label="Subtotal" value={formatPKR(sub)}   tone="accent" />
          <KpiCard label="Tax"       value={formatPKR(tax)}  tone="warning" />
          <KpiCard label="Total"     value={formatPKR(total)} tone="success" />
        </>
      }
    >
      <Card className="p-5 mb-4">
        <SectionHeader eyebrow="Header" title="GL Invoice details" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Customer</Label>
            <Select value={custId} onValueChange={setCustId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">GL Invoice #</Label>
            <Input value="GLI-2026-05-0009" readOnly className="font-mono bg-muted/30" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Date</Label>
            <Input type="date" defaultValue="2026-05-23" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Reference</Label>
            <Input placeholder="PO-887" />
          </div>
        </div>
      </Card>

      <Card className="p-5 mb-4">
        <SectionHeader eyebrow="Lines" title="Items / services" actions={<Button variant="outline" size="sm" onClick={() => setLines(p => [...p, newLine()])}><Plus className="mr-1 h-3 w-3" /> Add</Button>} />
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="w-[200px]">Income account</TableHead>
                <TableHead className="w-[170px]">Cost centre</TableHead>
                <TableHead className="text-right w-[80px]">Tax%</TableHead>
                <TableHead className="text-right w-[140px]">Amount</TableHead>
                <TableHead className="w-[40px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map(l => (
                <TableRow key={l.id}>
                  <TableCell><Input value={l.desc} onChange={e => update(l.id, { desc: e.target.value })} className="h-9" /></TableCell>
                  <TableCell><AccountPicker value={l.account} onChange={(v) => update(l.id, { account: v })} defaultFilter="GL" /></TableCell>
                  <TableCell><CostCenterPicker value={l.cc} onChange={(v) => update(l.id, { cc: v })} /></TableCell>
                  <TableCell><Input type="number" value={l.taxPct} onChange={e => update(l.id, { taxPct: Number(e.target.value) || 0 })} className="h-9 text-right tabular-nums" /></TableCell>
                  <TableCell><Input type="number" value={l.amount} onChange={e => update(l.id, { amount: Number(e.target.value) || 0 })} className="h-9 text-right tabular-nums font-semibold" /></TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setLines(p => p.filter(x => x.id !== l.id))} disabled={lines.length <= 1}><X className="h-3 w-3" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-muted/60">
              <TableRow><TableCell colSpan={4} className="text-right text-xs font-bold">Subtotal</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(sub)}</TableCell><TableCell /></TableRow>
              <TableRow><TableCell colSpan={4} className="text-right text-xs font-bold">Tax</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(tax)}</TableCell><TableCell /></TableRow>
              <TableRow className="bg-primary/10"><TableCell colSpan={4} className="text-right text-sm font-bold uppercase text-primary">Grand total</TableCell>
                <TableCell className="text-right tabular-nums font-bold text-lg text-primary">{formatPKR(total)}</TableCell><TableCell /></TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
