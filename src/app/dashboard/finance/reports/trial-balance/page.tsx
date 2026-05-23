'use client';

import { useMemo, useState } from 'react';
import {
  Search, Download, Printer, CheckCircle2, FileSpreadsheet, Plus, Trash2,
  Scale, ListChecks, FileText,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { HelperInfo } from '@/components/finance/helper-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { trialBalanceRows as defaultRows } from '@/lib/finance/statements-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

type TBRow = { code: string; name: string; type: string; debit: number; credit: number };

const typeColor: Record<string, string> = {
  ASSET:     'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300',
  LIABILITY: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300',
  EQUITY:    'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300',
  INCOME:    'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
  EXPENSE:   'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
};

export default function TrialBalancePage() {
  const [rows, setRows] = useState<TBRow[]>(defaultRows);
  const [q, setQ] = useState('');
  const [type, setType] = useState('ALL');
  const [period, setPeriod] = useState('MAY26');

  const filtered = useMemo(() => rows.filter(r => {
    const matchQ = !q || r.code.includes(q) || r.name.toLowerCase().includes(q.toLowerCase());
    const matchT = type === 'ALL' || r.type === type;
    return matchQ && matchT;
  }), [rows, q, type]);

  const totalsAll = rows.reduce(
    (a, r) => ({ debit: a.debit + r.debit, credit: a.credit + r.credit }),
    { debit: 0, credit: 0 },
  );
  const totalsFiltered = filtered.reduce(
    (a, r) => ({ debit: a.debit + r.debit, credit: a.credit + r.credit }),
    { debit: 0, credit: 0 },
  );
  const balanced = Math.abs(totalsAll.debit - totalsAll.credit) < 0.5;

  const update = (i: number, patch: Partial<TBRow>) =>
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  const del = (i: number) => setRows(prev => prev.filter((_, idx) => idx !== i));
  const add = () => setRows(prev => [...prev, { code: '0000', name: 'New account', type: 'ASSET', debit: 0, credit: 0 }]);

  return (
    <PageShell
      eyebrow="Reports · Period as filtered"
      title="Trial Balance"
      description="Account-level Dr / Cr summary. Edit any row, add or delete lines for what-if scenarios — refresh resets to posted balances."
      breadcrumb={[{ label: 'Reports', href: '/dashboard/finance/reports' }, { label: 'Trial Balance' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> Excel</Button>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> PDF</Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
          <Button size="sm" onClick={add}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add row</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Total debits"  value={formatPKR(totalsAll.debit)}  tone="info"    icon={Scale} />
          <KpiCard label="Total credits" value={formatPKR(totalsAll.credit)} tone="info"    icon={Scale} />
          <KpiCard
            label="Balance check"
            value={balanced ? 'Balanced' : `Δ ${formatPKR(Math.abs(totalsAll.debit - totalsAll.credit))}`}
            tone={balanced ? 'success' : 'danger'}
            icon={CheckCircle2}
            hint={balanced ? 'Dr ≡ Cr to the rupee' : 'Out of balance'}
          />
          <KpiCard label="Account rows" value={rows.length} tone="accent" icon={ListChecks} />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="MAY26">May 2026</SelectItem>
              <SelectItem value="APR26">April 2026</SelectItem>
              <SelectItem value="YTD">YTD FY 2026</SelectItem>
              <SelectItem value="CUSTOM">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" defaultValue="2026-05-01" className="w-[150px]" />
          <Input type="date" defaultValue="2026-05-31" className="w-[150px]" />
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search code or name…" value={q} onChange={e => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All types</SelectItem>
              <SelectItem value="ASSET">Assets</SelectItem>
              <SelectItem value="LIABILITY">Liabilities</SelectItem>
              <SelectItem value="EQUITY">Equity</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expenses</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground ml-auto">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {rows.length}
          </div>
        </div>
      </Card>

      <Card className="p-4 print:shadow-none print:p-0">
        {/* Print letterhead */}
        <div className="hidden print:block mb-4 pb-3 border-b-2 border-foreground">
          <div className="text-base font-bold">BINORIA WELFARE TRUST</div>
          <div className="text-sm font-semibold">Trial Balance · as at 31 May 2026 · PKR</div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40 sticky top-0">
              <TableRow>
                <TableHead className="w-[140px] font-mono text-xs">Code</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="w-[130px] text-center">Type</TableHead>
                <TableHead className="text-right w-[180px]">
                  <span className="inline-flex items-center gap-1 justify-end">
                    Debit <HelperInfo title="Debit" body="Left-side entry. Increases assets and expenses; decreases liabilities, equity, and income." />
                  </span>
                </TableHead>
                <TableHead className="text-right w-[180px]">
                  <span className="inline-flex items-center gap-1 justify-end">
                    Credit <HelperInfo title="Credit" body="Right-side entry. Increases liabilities, equity, and income; decreases assets and expenses." />
                  </span>
                </TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r, i) => {
                const idx = rows.indexOf(r);
                return (
                  <TableRow key={`${r.code}-${i}`} className="hover:bg-primary/5 cursor-pointer group">
                    <TableCell>
                      <Input value={r.code} onChange={e => update(idx, { code: e.target.value })} className="h-8 font-mono text-xs border-0 shadow-none focus-visible:ring-1 px-1 bg-transparent" />
                    </TableCell>
                    <TableCell>
                      <Input value={r.name} onChange={e => update(idx, { name: e.target.value })} className="h-8 font-medium text-sm border-0 shadow-none focus-visible:ring-1 px-1 bg-transparent" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Select value={r.type} onValueChange={(v) => update(idx, { type: v })}>
                        <SelectTrigger className={cn('h-7 text-[10px] font-bold uppercase border-0 shadow-none focus:ring-1 px-2 w-[110px] mx-auto', typeColor[r.type])}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['ASSET','LIABILITY','EQUITY','INCOME','EXPENSE'].map(t => (
                            <SelectItem key={t} value={t}>{t[0]+t.slice(1).toLowerCase()}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input type="number" value={r.debit || ''} onChange={e => update(idx, { debit: Number(e.target.value) || 0 })} placeholder="—" className="h-8 text-right tabular-nums font-medium border-0 shadow-none focus-visible:ring-1 px-1 bg-transparent" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" value={r.credit || ''} onChange={e => update(idx, { credit: Number(e.target.value) || 0 })} placeholder="—" className="h-8 text-right tabular-nums font-medium border-0 shadow-none focus-visible:ring-1 px-1 bg-transparent" />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-600 opacity-0 group-hover:opacity-100" onClick={() => del(idx)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* BIG TOTAL — bold, bigger row */}
        <div className={cn(
          'mt-4 grid grid-cols-1 md:grid-cols-3 gap-0 rounded-xl border-2 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-border',
          balanced ? 'border-emerald-500' : 'border-rose-500',
        )}>
          <div className="p-5 text-center bg-muted/30">
            <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Σ Debits</div>
            <div className="text-2xl md:text-3xl font-bold tabular-nums mt-1 text-emerald-700">{formatPKR(totalsAll.debit)}</div>
          </div>
          <div className="p-5 text-center bg-muted/30">
            <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Σ Credits</div>
            <div className="text-2xl md:text-3xl font-bold tabular-nums mt-1 text-rose-700">{formatPKR(totalsAll.credit)}</div>
          </div>
          <div className={cn('p-5 text-center', balanced ? 'bg-emerald-50 dark:bg-emerald-950/40' : 'bg-rose-50 dark:bg-rose-950/40')}>
            <div className={cn('text-[11px] uppercase tracking-wider font-bold inline-flex items-center gap-1', balanced ? 'text-emerald-700' : 'text-rose-700')}>
              {balanced ? <CheckCircle2 className="h-3 w-3" /> : null} {balanced ? 'In balance' : 'Out of balance'}
              <HelperInfo title="Trial balance check" body="In a sound double-entry ledger, Σ debits MUST equal Σ credits. Any difference indicates a posting error or missing entry." />
            </div>
            <div className={cn('text-2xl md:text-3xl font-bold tabular-nums mt-1', balanced ? 'text-emerald-700' : 'text-rose-700')}>
              {balanced ? '✓' : `Δ ${formatPKR(Math.abs(totalsAll.debit - totalsAll.credit))}`}
            </div>
          </div>
        </div>

        {filtered.length !== rows.length && (
          <div className="mt-3 text-xs text-muted-foreground text-center">
            Filtered subtotal: Dr {formatPKR(totalsFiltered.debit)} · Cr {formatPKR(totalsFiltered.credit)}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5" />
            <span>Tip — refresh the page to reset edits to posted balances</span>
          </div>
          <div>As at 31 May 2026 · BINORIA WELFARE TRUST</div>
        </div>
      </Card>
    </PageShell>
  );
}
