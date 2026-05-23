'use client';

import { useState } from 'react';
import { Plus, X, Save, Send, RotateCcw, FileText } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { suppliers } from '@/lib/finance/ar-ap-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

type Line = { id: string; desc: string; account: string; cc: string; amount: number };
const newLine = (): Line => ({ id: Math.random().toString(36).slice(2), desc: '', account: '5001', cc: '2', amount: 0 });

export default function DebitNotePage() {
  const [supId, setSupId] = useState('s01');
  const [reason, setReason] = useState<'RETURN' | 'DISCOUNT' | 'QUALITY' | 'OTHER'>('RETURN');
  const [lines, setLines] = useState<Line[]>([
    { id: 'l1', desc: '5 kg meat returned — quality issue', account: '5001', cc: '2', amount: 4_500 },
  ]);
  const sup = suppliers.find(s => s.id === supId)!;
  const total = lines.reduce((s, l) => s + l.amount, 0);

  const update = (id: string, patch: Partial<Line>) => setLines(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));
  const add = () => setLines(prev => [...prev, newLine()]);
  const drop = (id: string) => setLines(prev => prev.length > 1 ? prev.filter(l => l.id !== id) : prev);

  return (
    <PageShell
      eyebrow="Payables · New debit note"
      title="Supplier Debit Note"
      description="Reduce a supplier's balance — typically for returned goods, post-delivery discounts, or quality issues."
      breadcrumb={[
        { label: 'Payables', href: '/dashboard/finance/ap' },
        { label: 'Debit Note' },
      ]}
      actions={
        <>
          <Button variant="outline" size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Save draft</Button>
          <Button size="sm"><Send className="mr-1.5 h-3.5 w-3.5" /> Post debit note</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Supplier balance" value={formatPKR(sup.totalOpen)} tone="info"    icon={FileText} hint={sup.name} />
          <KpiCard label="Debit amount"     value={formatPKR(total)}         tone="warning" icon={RotateCcw} />
          <KpiCard label="Reason"           value={reason[0] + reason.slice(1).toLowerCase()} tone="violet" />
          <KpiCard label="Net after DN"     value={formatPKR(sup.totalOpen - total)} tone="success" />
        </>
      }
    >
      <Card className="p-5 mb-4">
        <SectionHeader eyebrow="Step 1" title="Header" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Supplier</Label>
            <Select value={supId} onValueChange={setSupId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">DN #</Label>
            <Input value="DN-2026-05-0008" readOnly className="font-mono bg-muted/30" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Date</Label>
            <Input type="date" defaultValue="2026-05-23" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Linked bill</Label>
            <Input placeholder="SI-2026-...." className="font-mono" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Reason</Label>
          <RadioGroup value={reason} onValueChange={(v) => setReason(v as any)} className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {([
              { k: 'RETURN',   label: 'Goods returned' },
              { k: 'DISCOUNT', label: 'Post-delivery discount' },
              { k: 'QUALITY',  label: 'Quality issue' },
              { k: 'OTHER',    label: 'Other' },
            ] as const).map(r => (
              <Label key={r.k} htmlFor={r.k} className={cn(
                'flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer text-xs font-semibold',
                reason === r.k ? 'border-primary bg-primary/10 text-primary' : 'border-border',
              )}>
                <RadioGroupItem id={r.k} value={r.k} className="sr-only" />{r.label}
              </Label>
            ))}
          </RadioGroup>
        </div>
      </Card>

      <Card className="p-5 mb-4">
        <SectionHeader eyebrow="Step 2" title="Lines" actions={<Button variant="outline" size="sm" onClick={add}><Plus className="mr-1 h-3 w-3" /> Add</Button>} />
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[200px]">Reversal account</TableHead>
                <TableHead className="w-[170px]">Cost centre</TableHead>
                <TableHead className="text-right w-[140px]">Amount</TableHead>
                <TableHead className="w-[40px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map((l, i) => (
                <TableRow key={l.id}>
                  <TableCell className="text-xs text-muted-foreground font-mono">{i + 1}</TableCell>
                  <TableCell><Input value={l.desc} onChange={e => update(l.id, { desc: e.target.value })} className="h-9 text-sm" /></TableCell>
                  <TableCell><AccountPicker value={l.account} onChange={(v) => update(l.id, { account: v })} defaultFilter="GL" /></TableCell>
                  <TableCell><CostCenterPicker value={l.cc} onChange={(v) => update(l.id, { cc: v })} /></TableCell>
                  <TableCell><Input type="number" value={l.amount} onChange={e => update(l.id, { amount: Number(e.target.value) || 0 })} className="h-9 text-right tabular-nums" /></TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => drop(l.id)} disabled={lines.length <= 1}><X className="h-3 w-3" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-muted/60">
              <TableRow><TableCell colSpan={4} className="text-right text-xs uppercase tracking-wide font-bold">Total</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(total)}</TableCell><TableCell /></TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Notes</Label>
          <Textarea rows={3} className="mt-1.5" placeholder="Reference original bill, justify the debit..." />
        </Card>
        <Card className="p-5">
          <SectionHeader eyebrow="Posting" title="GL entries" />
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b pb-1"><span>Dr 2100 Accounts Payable</span><span className="tabular-nums">{formatPKR(total)}</span></div>
            <div className="flex justify-between text-emerald-700 pt-1"><span>Cr Expense / COGS reversal</span><span className="tabular-nums">{formatPKR(total)}</span></div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
