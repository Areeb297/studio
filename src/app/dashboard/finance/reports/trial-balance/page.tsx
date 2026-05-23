'use client';

import { useMemo, useState } from 'react';
import { Search, Download, Printer, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Scale, FileText, ListChecks } from 'lucide-react';
import { trialBalanceRows, trialBalanceTotal } from '@/lib/finance/statements-data';
import { formatPKR } from '@/utils/accounting';

const typeColor: Record<string, string> = {
  ASSET:     'bg-blue-50 text-blue-700 ring-blue-200',
  LIABILITY: 'bg-rose-50 text-rose-700 ring-rose-200',
  EQUITY:    'bg-violet-50 text-violet-700 ring-violet-200',
  INCOME:    'bg-emerald-50 text-emerald-700 ring-emerald-200',
  EXPENSE:   'bg-amber-50 text-amber-700 ring-amber-200',
};

export default function TrialBalancePage() {
  const [q, setQ] = useState('');
  const [type, setType] = useState<string>('ALL');

  const rows = useMemo(() => trialBalanceRows.filter(r => {
    const matchQ = !q || r.code.includes(q) || r.name.toLowerCase().includes(q.toLowerCase());
    const matchT = type === 'ALL' || r.type === type;
    return matchQ && matchT;
  }), [q, type]);

  const totals = rows.reduce(
    (acc, r) => ({ debit: acc.debit + r.debit, credit: acc.credit + r.credit }),
    { debit: 0, credit: 0 },
  );
  const balanced = Math.abs(trialBalanceTotal.debit - trialBalanceTotal.credit) < 0.5;

  return (
    <PageShell
      eyebrow="Reports · Period 1–31 May 2026"
      title="Trial Balance"
      description="Account-level Dr / Cr summary of the posted ledger. Click any line to drill into account movement."
      breadcrumb={[{ label: 'Reports', href: '/dashboard/finance/reports' }, { label: 'Trial Balance' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> Excel</Button>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> PDF</Button>
          <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Total debits"  value={formatPKR(trialBalanceTotal.debit)}  tone="info"    icon={Scale} />
          <KpiCard label="Total credits" value={formatPKR(trialBalanceTotal.credit)} tone="info"    icon={Scale} />
          <KpiCard
            label="Balance check"
            value={balanced ? 'Balanced' : `Δ ${formatPKR(Math.abs(trialBalanceTotal.debit - trialBalanceTotal.credit))}`}
            tone={balanced ? 'success' : 'danger'}
            icon={CheckCircle2}
            hint={balanced ? 'Dr ≡ Cr to the rupee' : 'Out of balance'}
          />
          <KpiCard label="Account rows" value={trialBalanceRows.length} tone="accent" icon={ListChecks} />
        </>
      }
    >
      <Card className="p-4">
        {/* filter row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search code or name…"
              value={q}
              onChange={e => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Account type" />
            </SelectTrigger>
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
            Showing <span className="font-semibold text-foreground">{rows.length}</span> of {trialBalanceRows.length}
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40 sticky top-0">
              <TableRow>
                <TableHead className="w-[140px] font-mono text-xs">Code</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="w-[120px] text-center">Type</TableHead>
                <TableHead className="text-right w-[160px]">Debit</TableHead>
                <TableHead className="text-right w-[160px]">Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r.code} className="hover:bg-primary/5 cursor-pointer">
                  <TableCell className="font-mono text-xs">{r.code}</TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-center">
                    <span className={`text-[10px] font-semibold ring-1 ring-inset rounded px-1.5 py-0.5 ${typeColor[r.type]}`}>
                      {r.type[0] + r.type.slice(1).toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {r.debit > 0 ? formatPKR(r.debit) : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {r.credit > 0 ? formatPKR(r.credit) : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-muted/60">
              <TableRow className="font-bold">
                <TableCell colSpan={3} className="text-right text-xs uppercase tracking-wide">Totals</TableCell>
                <TableCell className="text-right tabular-nums">{formatPKR(totals.debit)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatPKR(totals.credit)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {balanced ? (
              <>
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" />
                </span>
                <span className="font-semibold text-emerald-700">Trial balance is in balance</span>
              </>
            ) : (
              <span className="font-semibold text-rose-700">⚠ Out of balance by {formatPKR(Math.abs(trialBalanceTotal.debit - trialBalanceTotal.credit))}</span>
            )}
          </div>
          <div>As at 31 May 2026 · BINORIA WELFARE TRUST</div>
        </div>
      </Card>
    </PageShell>
  );
}
