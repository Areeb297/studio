'use client';

import { useState, useMemo } from 'react';
import {
  Plus, Save, Send, X, FileText, PackageCheck, Truck, Paperclip,
  CheckCircle2, AlertTriangle,
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
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { suppliers } from '@/lib/finance/ar-ap-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

type GRN = { number: string; date: string; total: number; items: string };
type Line = { id: string; desc: string; account: string; cc: string; qty: number; rate: number; taxPct: number };

const sampleGRNs: GRN[] = [
  { number: 'GRN-2026-05-0034', date: '2026-05-17', total: 42_500, items: '12 items — beef carcass, chicken, mutton' },
  { number: 'GRN-2026-05-0041', date: '2026-05-20', total: 18_750, items: '4 items — vegetables, spices' },
  { number: 'GRN-2026-05-0058', date: '2026-05-22', total: 23_000, items: '8 items — dairy + bread' },
];

const newLine = (): Line => ({ id: Math.random().toString(36).slice(2), desc: '', account: '5001', cc: '2', qty: 1, rate: 0, taxPct: 17 });

const subtotal = (l: Line) => l.qty * l.rate;
const tax      = (l: Line) => subtotal(l) * (l.taxPct / 100);
const total    = (l: Line) => subtotal(l) + tax(l);

export default function SupplierInvoicePage() {
  const [supplierId, setSupplierId] = useState('s01');
  const [mode, setMode] = useState<'FREE' | 'GRN'>('GRN');
  const [pickedGRNs, setPickedGRNs] = useState<Set<string>>(new Set(['GRN-2026-05-0034', 'GRN-2026-05-0041']));
  const [lines, setLines] = useState<Line[]>([
    { id: 'l1', desc: 'Beef + Chicken + Mutton (from GRN-0034)', account: '5001', cc: '2', qty: 1, rate: 42_500, taxPct: 0 },
    { id: 'l2', desc: 'Vegetables + Spices (from GRN-0041)',     account: '5001', cc: '2', qty: 1, rate: 18_750, taxPct: 0 },
  ]);

  const supplier = suppliers.find(s => s.id === supplierId)!;
  const sub = useMemo(() => lines.reduce((a, l) => a + subtotal(l), 0), [lines]);
  const taxT = useMemo(() => lines.reduce((a, l) => a + tax(l), 0), [lines]);
  const grand = sub + taxT;

  const poTotal = 67_200;
  const grnTotal = sampleGRNs.filter(g => pickedGRNs.has(g.number)).reduce((s, g) => s + g.total, 0);
  const threeWayMatch = Math.abs(grand - grnTotal) < 0.5;

  const update = (id: string, patch: Partial<Line>) =>
    setLines(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));
  const drop = (id: string) => setLines(prev => prev.length > 1 ? prev.filter(l => l.id !== id) : prev);
  const add = () => setLines(prev => [...prev, newLine()]);

  const togglePick = (n: string) =>
    setPickedGRNs(prev => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });

  return (
    <PageShell
      eyebrow="Payables · New bill"
      title="Supplier Invoice"
      description="Enter a supplier bill — free-form, or load directly from one or more outstanding GRNs."
      breadcrumb={[
        { label: 'Payables', href: '/dashboard/finance/ap' },
        { label: 'Invoice' },
      ]}
      actions={
        <>
          <Button variant="outline" size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Save draft</Button>
          <Button size="sm" disabled={!threeWayMatch && mode === 'GRN'}>
            <Send className="mr-1.5 h-3.5 w-3.5" /> Post bill
          </Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Supplier balance" value={formatPKR(supplier.totalOpen)} tone="info"    icon={Truck} hint={supplier.name} />
          <KpiCard label="PO total"          value={formatPKR(poTotal)}            tone="accent" />
          <KpiCard label="GRN total"         value={formatPKR(grnTotal)}           tone="warning" hint={`${pickedGRNs.size} GRNs picked`} />
          <KpiCard
            label="Bill total"
            value={formatPKR(grand)}
            tone={threeWayMatch ? 'success' : 'danger'}
            icon={threeWayMatch ? CheckCircle2 : AlertTriangle}
            hint={threeWayMatch ? '3-way match ✓' : `Δ ${formatPKR(Math.abs(grand - grnTotal))}`}
          />
        </>
      }
    >
      {/* Mode toggle */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="mb-4">
        <TabsList className="grid grid-cols-2 max-w-sm">
          <TabsTrigger value="GRN" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <PackageCheck className="h-3.5 w-3.5 mr-1.5" /> Load from GRN
          </TabsTrigger>
          <TabsTrigger value="FREE" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileText className="h-3.5 w-3.5 mr-1.5" /> Free-form
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="p-5 mb-4">
        <SectionHeader eyebrow="Step 1" title="Bill header" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Supplier</Label>
            <Select value={supplierId} onValueChange={setSupplierId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Supplier inv #</Label>
            <Input placeholder="INV-2026-05-...." />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Bill date</Label>
            <Input type="date" defaultValue="2026-05-23" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Due date</Label>
            <Input type="date" defaultValue="2026-06-22" />
          </div>
        </div>
      </Card>

      {/* GRN picker (only in GRN mode) */}
      {mode === 'GRN' && (
        <Card className="p-5 mb-4">
          <SectionHeader eyebrow="Step 2a" title="Pick outstanding GRNs" description="Un-invoiced GRNs from this supplier." />
          <div className="space-y-2">
            {sampleGRNs.map(g => (
              <label
                key={g.number}
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
                  pickedGRNs.has(g.number) ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted/30',
                )}
              >
                <Checkbox checked={pickedGRNs.has(g.number)} onCheckedChange={() => togglePick(g.number)} />
                <div className="flex-1">
                  <div className="font-mono text-xs font-bold">{g.number}</div>
                  <div className="text-xs text-muted-foreground">{g.date} · {g.items}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold tabular-nums">{formatPKR(g.total)}</div>
                </div>
              </label>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5 mb-4">
        <SectionHeader eyebrow={mode === 'GRN' ? 'Step 2b' : 'Step 2'} title="Lines" actions={
          <Button variant="outline" size="sm" onClick={add}><Plus className="mr-1 h-3 w-3" /> Add line</Button>
        } />
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[200px]">Expense account</TableHead>
                <TableHead className="w-[170px]">Cost centre</TableHead>
                <TableHead className="w-[70px] text-right">Qty</TableHead>
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
                    <Input value={l.desc} onChange={e => update(l.id, { desc: e.target.value })} className="h-9 text-sm" />
                  </TableCell>
                  <TableCell>
                    <AccountPicker value={l.account} onChange={(v) => update(l.id, { account: v })} placeholder="Expense…" defaultFilter="GL" />
                  </TableCell>
                  <TableCell>
                    <CostCenterPicker value={l.cc} onChange={(v) => update(l.id, { cc: v })} />
                  </TableCell>
                  <TableCell><Input type="number" value={l.qty} onChange={e => update(l.id, { qty: Number(e.target.value) || 0 })} className="h-9 text-right tabular-nums" /></TableCell>
                  <TableCell><Input type="number" value={l.rate} onChange={e => update(l.id, { rate: Number(e.target.value) || 0 })} className="h-9 text-right tabular-nums" /></TableCell>
                  <TableCell><Input type="number" value={l.taxPct} onChange={e => update(l.id, { taxPct: Number(e.target.value) || 0 })} className="h-9 text-right tabular-nums" /></TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{formatPKR(total(l))}</TableCell>
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
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(sub)}</TableCell>
                <TableCell />
              </TableRow>
              <TableRow>
                <TableCell colSpan={7} className="text-right text-xs uppercase tracking-wide font-bold">Sales tax</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(taxT)}</TableCell>
                <TableCell />
              </TableRow>
              <TableRow className="bg-primary/10">
                <TableCell colSpan={7} className="text-right text-sm uppercase tracking-wide font-bold text-primary">Grand total</TableCell>
                <TableCell className="text-right tabular-nums font-bold text-lg text-primary">{formatPKR(grand)}</TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>

      {!threeWayMatch && mode === 'GRN' && (
        <Card className="p-4 bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900">
          <div className="flex items-start gap-2 text-xs text-rose-900 dark:text-rose-200">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              <strong>3-way match failed.</strong> Bill total ({formatPKR(grand)}) ≠ GRN total ({formatPKR(grnTotal)}).
              Either fix the lines, escalate to your manager for override, or split the discrepancy as a debit note.
            </span>
          </div>
        </Card>
      )}
    </PageShell>
  );
}
