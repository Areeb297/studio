'use client';

import { Download, Printer, FileSpreadsheet, Scale, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { balanceSheet } from '@/lib/finance/statements-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const sum = (rows: { current: number; prior: number }[]) => ({
  current: rows.reduce((a, r) => a + r.current, 0),
  prior:   rows.reduce((a, r) => a + r.prior, 0),
});

export default function BalanceSheetPage() {
  const tCurAssets   = sum(balanceSheet.currentAssets);
  const tFixedAssets = sum(balanceSheet.fixedAssets);
  const tCurLiab     = sum(balanceSheet.currentLiabilities);
  const tLtLiab      = sum(balanceSheet.longTermLiabilities);
  const tEquity      = sum(balanceSheet.equity);

  const totalAssets    = { current: tCurAssets.current + tFixedAssets.current, prior: tCurAssets.prior + tFixedAssets.prior };
  const totalLiab      = { current: tCurLiab.current   + tLtLiab.current,      prior: tCurLiab.prior   + tLtLiab.prior      };
  const totalLiabEquity= { current: totalLiab.current  + tEquity.current,      prior: totalLiab.prior  + tEquity.prior      };

  const delta = ((totalAssets.current - totalAssets.prior) / totalAssets.prior) * 100;
  const balanced = Math.abs(totalAssets.current - totalLiabEquity.current) < 1;

  const Section = ({ title, rows, total, tone }: any) => (
    <>
      <TableRow className={cn('bg-muted/30')}>
        <TableCell colSpan={3} className={cn('font-bold uppercase tracking-wide text-xs', tone)}>{title}</TableCell>
      </TableRow>
      {rows.map((r: any) => (
        <TableRow key={r.name} className="hover:bg-muted/30">
          <TableCell className="pl-6 font-medium">{r.name}</TableCell>
          <TableCell className="text-right tabular-nums">{formatPKR(r.current)}</TableCell>
          <TableCell className="text-right tabular-nums text-muted-foreground">{formatPKR(r.prior)}</TableCell>
        </TableRow>
      ))}
      <TableRow className="bg-muted/50">
        <TableCell className="pl-6 font-semibold uppercase text-xs">Total {title}</TableCell>
        <TableCell className="text-right tabular-nums font-bold">{formatPKR(total.current)}</TableCell>
        <TableCell className="text-right tabular-nums font-bold text-muted-foreground">{formatPKR(total.prior)}</TableCell>
      </TableRow>
    </>
  );

  return (
    <PageShell
      eyebrow="Reports · Position as at 31 May 2026"
      title="Balance Sheet"
      description="Position statement comparing current period against prior. Click any line to drill into the underlying ledger."
      breadcrumb={[{ label: 'Reports', href: '/dashboard/finance/reports' }, { label: 'Balance Sheet' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> Excel</Button>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> PDF</Button>
          <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Total assets" value={formatPKR(totalAssets.current)} tone="info" icon={ArrowUpRight}
            delta={{ value: delta, direction: delta > 0 ? 'up' : 'down' }} />
          <KpiCard label="Total liabilities" value={formatPKR(totalLiab.current)} tone="warning" icon={ArrowDownRight} />
          <KpiCard label="Total equity" value={formatPKR(tEquity.current)} tone="accent" icon={Scale} />
          <KpiCard
            label="Equation check"
            value={balanced ? 'Balanced' : `Δ ${formatPKR(Math.abs(totalAssets.current - totalLiabEquity.current))}`}
            tone={balanced ? 'success' : 'danger'}
            icon={CheckCircle2}
            hint="Assets = Liabilities + Equity"
          />
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ASSETS */}
        <Card className="p-4">
          <SectionHeader eyebrow="Section A" title="Assets" />
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">31 May 2026</TableHead>
                  <TableHead className="text-right text-muted-foreground">30 Apr 2026</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <Section title="Current Assets" rows={balanceSheet.currentAssets} total={tCurAssets} tone="text-blue-700" />
                <Section title="Fixed Assets"   rows={balanceSheet.fixedAssets}   total={tFixedAssets} tone="text-blue-700" />
                <TableRow className="bg-primary/10 border-y">
                  <TableCell className="font-bold uppercase tracking-wide text-sm text-primary">Total Assets</TableCell>
                  <TableCell className="text-right tabular-nums font-bold text-base text-primary">{formatPKR(totalAssets.current)}</TableCell>
                  <TableCell className="text-right tabular-nums font-bold text-muted-foreground">{formatPKR(totalAssets.prior)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* LIABILITIES + EQUITY */}
        <Card className="p-4">
          <SectionHeader eyebrow="Section B" title="Liabilities + Equity" />
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">31 May 2026</TableHead>
                  <TableHead className="text-right text-muted-foreground">30 Apr 2026</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <Section title="Current Liabilities" rows={balanceSheet.currentLiabilities} total={tCurLiab} tone="text-rose-700" />
                {balanceSheet.longTermLiabilities.length > 0
                  ? <Section title="Long-term Liabilities" rows={balanceSheet.longTermLiabilities} total={tLtLiab} tone="text-rose-700" />
                  : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-xs text-muted-foreground italic px-6 py-3">No long-term liabilities</TableCell>
                    </TableRow>
                  )}
                <Section title="Equity" rows={balanceSheet.equity} total={tEquity} tone="text-violet-700" />
                <TableRow className="bg-primary/10 border-y">
                  <TableCell className="font-bold uppercase tracking-wide text-sm text-primary">Total L + E</TableCell>
                  <TableCell className="text-right tabular-nums font-bold text-base text-primary">{formatPKR(totalLiabEquity.current)}</TableCell>
                  <TableCell className="text-right tabular-nums font-bold text-muted-foreground">{formatPKR(totalLiabEquity.prior)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          {balanced ? (
            <>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
              </span>
              <span className="font-semibold text-emerald-700">Balance sheet equation holds</span>
            </>
          ) : (
            <span className="font-semibold text-rose-700">⚠ Equation does not balance</span>
          )}
        </div>
        <div>As at 31 May 2026 · BINORIA WELFARE TRUST · PKR</div>
      </div>
    </PageShell>
  );
}
