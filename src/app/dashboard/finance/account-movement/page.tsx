'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Download, Printer, Activity, Scale, ArrowDown, ArrowUp, Calendar,
  Building2, FileText, Eye, Filter,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { AccountPicker } from '@/components/finance/account-picker';
import { CostCenterPicker } from '@/components/finance/cost-center-picker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { accounts } from '@/lib/finance/coa-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

type Move = {
  date: string;
  voucher: string;
  vType: string;
  desc: string;
  cc: string;
  debit: number;
  credit: number;
};

// Generate plausible movement history for the selected account
const generateMovement = (accountCode: string, opening: number): Move[] => {
  const seed = accountCode.length;
  const baseRows: Move[] = [
    { date: '2026-05-02', voucher: 'CRV-2026-05-0001', vType: 'CRV', desc: 'Daily cash sales — Restaurant',     cc: 'REST', debit:  12_500, credit:      0 },
    { date: '2026-05-04', voucher: 'BPV-2026-05-0009', vType: 'BPV', desc: 'AL-MAJEED VEGETABLES — MCB',          cc: 'REST', debit:       0, credit: 25_750 },
    { date: '2026-05-05', voucher: 'BRV-2026-05-0007', vType: 'BRV', desc: 'GREEN VALLEY CATERING — receipt',     cc: 'LAWN', debit:  35_000, credit:      0 },
    { date: '2026-05-08', voucher: 'CRV-2026-05-0002', vType: 'CRV', desc: 'Madrasa fees — 8 students',           cc: 'LSD',  debit:  64_000, credit:      0 },
    { date: '2026-05-10', voucher: 'CPV-2026-05-0015', vType: 'CPV', desc: 'Toyota Hiace fuel',                    cc: 'LAWN', debit:   6_400, credit:      0 },
    { date: '2026-05-12', voucher: 'BRV-2026-05-0006', vType: 'BRV', desc: 'K. MIRZA — Zakat donation',           cc: '—',    debit:  50_000, credit:      0 },
    { date: '2026-05-15', voucher: 'JV-2026-05-0231',  vType: 'JV',  desc: 'April depreciation accrual',           cc: 'TEH',  debit:       0, credit: 412_300 },
    { date: '2026-05-18', voucher: 'JV-2026-05-0232',  vType: 'JV',  desc: 'Reclass Zakat → Mosque',               cc: '—',    debit:  25_000, credit:      0 },
    { date: '2026-05-20', voucher: 'BPV-2026-05-0010', vType: 'BPV', desc: 'KARACHI MEAT — HBL #10228',            cc: 'REST', debit:       0, credit: 80_000 },
    { date: '2026-05-20', voucher: 'JV-2026-05-0233',  vType: 'JV',  desc: 'Salary accrual — Tehfeez',             cc: 'TEH',  debit: 320_000, credit:      0 },
    { date: '2026-05-22', voucher: 'BPV-2026-05-0011', vType: 'BPV', desc: 'K-Electric May bill — HBL ch#10231',   cc: 'REST', debit:       0, credit: 78_500 },
    { date: '2026-05-23', voucher: 'JV-2026-05-0234',  vType: 'JV',  desc: 'May rent accrual',                     cc: 'REST', debit: 120_000, credit:      0 },
    { date: '2026-05-23', voucher: 'CPV-2026-05-0017', vType: 'CPV', desc: 'Office stationery',                    cc: 'REST', debit:   2_500, credit:      0 },
  ];
  // Deterministic shuffle / scaling based on accountCode so different accounts feel different
  return baseRows.slice(0, 8 + (seed % 6)).map((r, i) => ({
    ...r,
    debit:  i % 3 === seed % 3 ? r.debit  : Math.round(r.debit  * (0.5 + (seed % 5) * 0.1)),
    credit: i % 3 === seed % 3 ? r.credit : Math.round(r.credit * (0.5 + (seed % 7) * 0.1)),
  }));
};

const vTypeColor: Record<string, string> = {
  JV:  'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300',
  CPV: 'bg-amber-100 text-amber-700',
  CRV: 'bg-emerald-100 text-emerald-700',
  BPV: 'bg-rose-100 text-rose-700',
  BRV: 'bg-teal-100 text-teal-700',
};

function AccountMovementInner() {
  const params = useSearchParams();
  const initial = params.get('account') ?? '1002';
  const [code, setCode] = useState(initial);
  const [cc, setCc] = useState('ALL');

  const acc = accounts.find(a => a.code === code);
  const opening = acc?.openingBalance ?? 0;

  const allRows = useMemo(() => generateMovement(code, opening), [code, opening]);
  const rows = useMemo(
    () => allRows.filter(r => cc === 'ALL' || (cc === r.cc) || r.cc === '—'),
    [allRows, cc],
  );

  // Running balance
  let running = opening;
  const rowsWithRunning = rows.map(r => {
    running = running + r.debit - r.credit;
    return { ...r, running };
  });

  const totals = rows.reduce(
    (a, r) => ({ debit: a.debit + r.debit, credit: a.credit + r.credit }),
    { debit: 0, credit: 0 },
  );
  const closing = opening + totals.debit - totals.credit;

  return (
    <PageShell
      eyebrow="General Ledger · Drill"
      title="Account Movement"
      description="Single-account ledger view with running balance. Drill into any voucher to see the full posting."
      breadcrumb={[{ label: 'General Ledger' }, { label: 'Account Movement' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>
          <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Opening balance" value={opening === 0 ? '—' : opening < 0 ? `(${formatPKR(Math.abs(opening))})` : formatPKR(opening)} tone="info" icon={Calendar} />
          <KpiCard label="Σ Debits"        value={formatPKR(totals.debit)}  tone="success" icon={ArrowDown} />
          <KpiCard label="Σ Credits"       value={formatPKR(totals.credit)} tone="warning" icon={ArrowUp} />
          <KpiCard label="Closing balance" value={closing < 0 ? `(${formatPKR(Math.abs(closing))})` : formatPKR(closing)} tone={closing >= 0 ? 'accent' : 'danger'} icon={Scale} />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Account</label>
            <AccountPicker value={code} onChange={setCode} placeholder="Pick account" className="w-full" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Period</label>
            <Select defaultValue="MAY26">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MAY26">May 2026</SelectItem>
                <SelectItem value="APR26">April 2026</SelectItem>
                <SelectItem value="MAR26">March 2026</SelectItem>
                <SelectItem value="YTD">YTD FY2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Cost centre</label>
            <Select value={cc} onValueChange={setCc}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All cost centres</SelectItem>
                <SelectItem value="REST">RESTAURANT</SelectItem>
                <SelectItem value="LAWN">MARRIAGE LAWN</SelectItem>
                <SelectItem value="LSD">LOCAL STUDENT DEPT</SelectItem>
                <SelectItem value="TEH">TEHFEEZ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {acc && (
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-mono text-foreground">{acc.code}</span>
            <span>·</span>
            <span className="font-semibold text-foreground">{acc.name}</span>
            <span>·</span>
            <span>{acc.type[0] + acc.type.slice(1).toLowerCase()}</span>
            {acc.controlType && (
              <>
                <span>·</span>
                <span className="font-semibold">[{acc.controlType}]</span>
              </>
            )}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead className="w-[170px]">Voucher</TableHead>
                <TableHead className="w-[60px]">Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[80px]">CC</TableHead>
                <TableHead className="text-right w-[120px]">Debit</TableHead>
                <TableHead className="text-right w-[120px]">Credit</TableHead>
                <TableHead className="text-right w-[140px]">Running</TableHead>
                <TableHead className="w-[40px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Opening row */}
              <TableRow className="bg-muted/30">
                <TableCell colSpan={7} className="font-semibold uppercase text-xs tracking-wide">Opening balance</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{opening === 0 ? '—' : opening < 0 ? `(${formatPKR(Math.abs(opening))})` : formatPKR(opening)}</TableCell>
                <TableCell />
              </TableRow>
              {rowsWithRunning.map((r, i) => (
                <TableRow key={i} className="hover:bg-primary/5 cursor-pointer">
                  <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
                  <TableCell className="font-mono text-xs">{r.voucher}</TableCell>
                  <TableCell>
                    <span className={cn('inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold', vTypeColor[r.vType])}>
                      {r.vType}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{r.desc}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.cc}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.debit > 0 ? formatPKR(r.debit) : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.credit > 0 ? formatPKR(r.credit) : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{r.running < 0 ? `(${formatPKR(Math.abs(r.running))})` : formatPKR(r.running)}</TableCell>
                  <TableCell><Eye className="h-3 w-3 text-muted-foreground" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-muted/60">
              <TableRow>
                <TableCell colSpan={5} className="text-right font-bold uppercase text-xs tracking-wide">Σ this period</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(totals.debit)}</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(totals.credit)}</TableCell>
                <TableCell className="text-right tabular-nums font-bold text-primary">{closing < 0 ? `(${formatPKR(Math.abs(closing))})` : formatPKR(closing)}</TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}

export default function AccountMovementPage() {
  return (
    <Suspense fallback={null}>
      <AccountMovementInner />
    </Suspense>
  );
}
