'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus, Save, Send, X, Banknote, Landmark, FileText, ArrowDownRight,
  ArrowUpRight, Sparkles, Paperclip, ListOrdered, RotateCcw,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { AccountPicker } from '@/components/finance/account-picker';
import { CostCenterPicker } from '@/components/finance/cost-center-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

type VType = 'JV' | 'CPV' | 'CRV' | 'BPV' | 'BRV';

type Line = {
  id: string;
  account: string;
  cc: string;
  narration: string;
  debit: string;
  credit: string;
};

const newLine = (): Line => ({ id: Math.random().toString(36).slice(2), account: '', cc: '', narration: '', debit: '', credit: '' });

const tabMeta: Record<VType, { label: string; icon: any; prefix: string; description: string }> = {
  JV:  { label: 'JV',  icon: FileText,         prefix: 'JV-2026-05',  description: 'Generic multi-line — no pre-fill' },
  CPV: { label: 'CPV', icon: Banknote,         prefix: 'CPV-2026-05', description: 'Cash out — pre-fills credit to Cash a/c' },
  CRV: { label: 'CRV', icon: ArrowDownRight,   prefix: 'CRV-2026-05', description: 'Cash in — pre-fills debit to Cash a/c' },
  BPV: { label: 'BPV', icon: ArrowUpRight,     prefix: 'BPV-2026-05', description: 'Cheque / transfer out — captures cheque #' },
  BRV: { label: 'BRV', icon: Landmark,         prefix: 'BRV-2026-05', description: 'Cheque / transfer in — attaches deposit slip' },
};

export default function UnifiedVoucherPage() {
  const [tab, setTab] = useState<VType>('JV');
  const [date, setDate] = useState('2026-05-23');
  const [reference, setReference] = useState('');
  const [cheque, setCheque] = useState('');
  const [description, setDescription] = useState('');
  const [lines, setLines] = useState<Line[]>([newLine(), newLine()]);
  const [defaultCash, setDefaultCash] = useState<string>('1001');

  const meta = tabMeta[tab];

  const effectiveCash = tab === 'JV' ? null
    : (tab === 'CPV' || tab === 'CRV') ? '1001'
    : defaultCash;

  const totals = useMemo(() => lines.reduce(
    (a, l) => ({ debit: a.debit + (Number(l.debit) || 0), credit: a.credit + (Number(l.credit) || 0) }),
    { debit: 0, credit: 0 },
  ), [lines]);
  const delta = totals.debit - totals.credit;
  const balanced = Math.abs(delta) < 0.5 && totals.debit > 0;

  const update = (id: string, patch: Partial<Line>) =>
    setLines(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));
  const remove = (id: string) => setLines(prev => prev.length > 2 ? prev.filter(l => l.id !== id) : prev);
  const addLine = () => setLines(prev => [...prev, newLine()]);

  const autoBalance = () => {
    if (Math.abs(delta) < 0.5) return;
    if (!effectiveCash) return;
    const fill: Line = {
      id: Math.random().toString(36).slice(2),
      account: effectiveCash,
      cc: '',
      narration: 'Auto-balance counter',
      debit:  delta < 0 ? String(Math.abs(delta)) : '',
      credit: delta > 0 ? String(delta)            : '',
    };
    setLines(prev => [...prev.filter(l => l.account || Number(l.debit) || Number(l.credit)), fill]);
  };

  const switchTab = (next: VType) => {
    setTab(next);
    if (next !== 'JV') {
      setLines([
        newLine(),
        { ...newLine(), account: next === 'BPV' || next === 'BRV' ? defaultCash : '1001' },
      ]);
    } else {
      setLines([newLine(), newLine()]);
    }
  };

  const counter = lines.length;
  const number = `${meta.prefix}-${String(17 + counter).padStart(4, '0')}`;

  return (
    <PageShell
      eyebrow="General Ledger · New voucher"
      title="Unified Voucher"
      description="One screen, five voucher types. The form pre-fills the cash or bank side based on the active tab; everything posts to the same ledger."
      breadcrumb={[{ label: 'General Ledger' }, { label: 'Unified Voucher' }]}
      actions={
        <>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/finance/vouchers/list"><ListOrdered className="mr-1.5 h-3.5 w-3.5" /> Voucher list</Link>
          </Button>
          <Button variant="outline" size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Save draft</Button>
          <Button size="sm" disabled={!balanced}>
            <Send className="mr-1.5 h-3.5 w-3.5" /> Post {balanced ? '' : `· Δ ${formatPKR(Math.abs(delta))}`}
          </Button>
        </>
      }
    >
      <Tabs value={tab} onValueChange={(v) => switchTab(v as VType)} className="mb-4">
        <TabsList className="grid grid-cols-5 w-full max-w-xl">
          {(Object.keys(tabMeta) as VType[]).map(k => {
            const Icon = tabMeta[k].icon;
            return (
              <TabsTrigger key={k} value={k} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Icon className="h-3.5 w-3.5 mr-1.5" /> {tabMeta[k].label}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <div className="mt-2 text-xs text-muted-foreground inline-flex items-center gap-2">
          <Sparkles className="h-3 w-3 text-primary" />
          <span>{meta.description}</span>
        </div>
      </Tabs>

      <Card className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 pb-5 border-b border-border">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Voucher #</Label>
            <Input value={number} readOnly className="font-mono text-sm bg-muted/30" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Date</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Reference</Label>
            <Input value={reference} onChange={e => setReference(e.target.value)} placeholder={tab === 'BPV' ? 'Cheque #' : 'Optional'} />
          </div>
          {(tab === 'BPV' || tab === 'BRV') && (
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Bank account</Label>
              <Select value={defaultCash} onValueChange={setDefaultCash}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1002">1002 · Bank — HBL Current</SelectItem>
                  <SelectItem value="1003">1003 · Bank — MCB Savings</SelectItem>
                  <SelectItem value="1004">1004 · Bank — UBL USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {(tab === 'CPV' || tab === 'CRV') && (
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Cash account</Label>
              <Select value="1001" onValueChange={() => {}}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1001">1001 · Cash on Hand</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {tab === 'BPV' && (
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Cheque #</Label>
              <Input value={cheque} onChange={e => setCheque(e.target.value)} placeholder="auto from book" className="font-mono" />
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border overflow-hidden mb-4">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[40px] text-center">#</TableHead>
                <TableHead className="w-[280px]">Account</TableHead>
                <TableHead className="w-[200px]">Cost Centre</TableHead>
                <TableHead>Narration</TableHead>
                <TableHead className="text-right w-[140px]">Debit</TableHead>
                <TableHead className="text-right w-[140px]">Credit</TableHead>
                <TableHead className="w-[40px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map((l, i) => (
                <TableRow key={l.id}>
                  <TableCell className="text-center text-xs text-muted-foreground font-mono">{i + 1}</TableCell>
                  <TableCell>
                    <AccountPicker value={l.account} onChange={(v) => update(l.id, { account: v })} placeholder="Pick account" />
                  </TableCell>
                  <TableCell>
                    <CostCenterPicker value={l.cc} onChange={(v) => update(l.id, { cc: v })} />
                  </TableCell>
                  <TableCell>
                    <Input value={l.narration} onChange={e => update(l.id, { narration: e.target.value })} placeholder="—" className="h-9 text-sm" />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={l.debit}
                      onChange={e => update(l.id, { debit: e.target.value, credit: e.target.value ? '' : l.credit })}
                      placeholder="0"
                      className="h-9 text-right tabular-nums font-medium"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={l.credit}
                      onChange={e => update(l.id, { credit: e.target.value, debit: e.target.value ? '' : l.debit })}
                      placeholder="0"
                      className="h-9 text-right tabular-nums font-medium"
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => remove(l.id)} disabled={lines.length <= 2}>
                      <X className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-muted/60">
              <TableRow>
                <TableCell colSpan={4} className="text-right text-xs uppercase tracking-wide font-bold">
                  Σ Dr · Σ Cr · Δ
                </TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(totals.debit)}</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(totals.credit)}</TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Button variant="outline" size="sm" onClick={addLine}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add line
          </Button>
          <Button variant="outline" size="sm" onClick={autoBalance} disabled={!effectiveCash || Math.abs(delta) < 0.5}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Auto-balance
          </Button>
          <div className="ml-auto flex items-center gap-3">
            <span className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-bold ring-1 ring-inset tabular-nums',
              balanced ? 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900' :
                         'bg-amber-50  text-amber-800 ring-amber-200  dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900',
            )}>
              {balanced ? '✓ Balanced' : `Δ ${formatPKR(Math.abs(delta))}`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Why this entry exists…" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Attachments</Label>
            <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-6 text-xs text-muted-foreground hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors">
              <Paperclip className="h-4 w-4" />
              Drop invoice / receipt / supporting doc
            </div>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}
