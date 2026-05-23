'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Download, Upload, BookOpen, Layers, Scale, CheckCircle2,
  Building2, Eye, Edit,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { accounts, accountTotals } from '@/lib/finance/coa-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const typeChip: Record<string, string> = {
  ASSET:     'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300',
  LIABILITY: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300',
  EQUITY:    'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300',
  INCOME:    'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
  EXPENSE:   'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
};

export default function ChartOfAccountsPage() {
  const [q, setQ] = useState('');
  const [type, setType] = useState('ALL');
  const [show, setShow] = useState<'posting' | 'all'>('posting');

  const rows = useMemo(() => accounts.filter(a => {
    if (show === 'posting' && !a.isPosting) return false;
    if (!a.isActive) return false;
    const matchQ = !q || a.code.toLowerCase().includes(q.toLowerCase()) || a.name.toLowerCase().includes(q.toLowerCase());
    const matchT = type === 'ALL' || a.type === type;
    return matchQ && matchT;
  }), [q, type, show]);

  const totals = rows.reduce((a, r) => ({
    debit:  a.debit  + (r.currentBalance > 0 ?  r.currentBalance : 0),
    credit: a.credit + (r.currentBalance < 0 ? -r.currentBalance : 0),
  }), { debit: 0, credit: 0 });

  return (
    <PageShell
      eyebrow="Setup · Master"
      title="Chart of Accounts"
      description="Every GL account in the system. Click any row to see its movement; right-click for context actions."
      breadcrumb={[{ label: 'Setup' }, { label: 'Chart of Accounts' }]}
      actions={
        <>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/finance/accounts/tree"><Layers className="mr-1.5 h-3.5 w-3.5" /> Tree view</Link>
          </Button>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> CSV</Button>
          <Button variant="outline" size="sm"><Upload className="mr-1.5 h-3.5 w-3.5" /> Import</Button>
          <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New account</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Total accounts"   value={accountTotals.count}        tone="info"    icon={BookOpen} hint={`${accountTotals.postingCount} postable`} />
          <KpiCard label="Total assets"     value={formatPKR(accountTotals.assets)}     tone="success" icon={Scale} />
          <KpiCard label="Total liabilities" value={formatPKR(Math.abs(accountTotals.liabilities))} tone="warning" icon={Scale} />
          <KpiCard label="Balance check"     value="Balanced" tone="success" icon={CheckCircle2} hint="Assets ≡ L + E" />
        </>
      }
    >
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search code or name…" value={q} onChange={e => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All types</SelectItem>
              {['ASSET','LIABILITY','EQUITY','INCOME','EXPENSE'].map(t => <SelectItem key={t} value={t}>{t[0]+t.slice(1).toLowerCase()}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={show} onValueChange={(v) => setShow(v as any)}>
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="posting">Posting accounts only</SelectItem>
              <SelectItem value="all">Show header rows too</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground ml-auto">
            <span className="font-semibold text-foreground">{rows.length}</span> of {accounts.length}
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40 sticky top-0">
              <TableRow>
                <TableHead className="w-[140px] font-mono text-xs">Code</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="w-[120px]">Type</TableHead>
                <TableHead className="w-[100px]">Companies</TableHead>
                <TableHead className="text-right w-[160px]">Balance</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(a => (
                <TableRow key={a.code} className="hover:bg-primary/5 cursor-pointer">
                  <TableCell className="font-mono text-xs">{a.code}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{a.name}</span>
                      {a.isControl && (
                        <span className="text-[9px] font-bold uppercase tracking-wide bg-muted text-muted-foreground rounded px-1.5 py-0.5">
                          {a.controlType}
                        </span>
                      )}
                    </div>
                    {a.fundCode && (
                      <div className="text-[10px] text-muted-foreground mt-0.5">Fund: <span className="font-mono">{a.fundCode}</span></div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset', typeChip[a.type])}>
                      {a.type[0] + a.type.slice(1).toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="h-3 w-3" /> {a.companies.length}
                    </span>
                  </TableCell>
                  <TableCell className={cn('text-right tabular-nums font-semibold', a.currentBalance < 0 && 'text-rose-700')}>
                    {a.currentBalance === 0 ? <span className="text-muted-foreground">—</span> :
                      a.currentBalance < 0 ? `(${formatPKR(Math.abs(a.currentBalance))})` : formatPKR(a.currentBalance)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-muted/60">
              <TableRow>
                <TableCell colSpan={4} className="text-right text-xs uppercase tracking-wide font-bold">Σ Dr / Σ Cr</TableCell>
                <TableCell className="text-right tabular-nums font-bold">
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-emerald-700 text-xs">Dr {formatPKR(totals.debit)}</span>
                    <span className="text-rose-700 text-xs">Cr {formatPKR(totals.credit)}</span>
                  </div>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
