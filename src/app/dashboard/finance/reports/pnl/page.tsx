'use client';

import { useMemo, useState } from 'react';
import { Download, Printer, FileSpreadsheet, TrendingUp, TrendingDown, Building2 } from 'lucide-react';
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from 'recharts';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { pnlIncome, pnlCogs, pnlOpex, pnlPrior, monthlyPnl } from '@/lib/finance/statements-data';
import { COST_CENTERS } from '@/lib/finance/seed';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const sum = (rows: { total: number }[]) => rows.reduce((a, r) => a + r.total, 0);

export default function PnLPage() {
  const [showCC, setShowCC] = useState(true);

  const totalIncome = sum(pnlIncome);
  const totalCogs   = sum(pnlCogs);
  const grossProfit = totalIncome - totalCogs;
  const totalOpex   = sum(pnlOpex);
  const netProfit   = grossProfit - totalOpex;
  const grossMargin = (grossProfit / totalIncome) * 100;
  const netMargin   = (netProfit / totalIncome) * 100;

  const ccCols = useMemo(
    () => COST_CENTERS.filter(c => c.name !== 'Test Center').map(c => c.name),
    [],
  );

  const ccSum = (rows: { byCC?: Partial<Record<string, number>> }[], cc: string) =>
    rows.reduce((a, r) => a + (r.byCC?.[cc] ?? 0), 0);

  const Row = ({ code, name, total, byCC, accent }: any) => (
    <TableRow className="hover:bg-muted/40">
      <TableCell className="font-mono text-xs text-muted-foreground">{code}</TableCell>
      <TableCell className={cn('font-medium', accent && 'font-semibold')}>{name}</TableCell>
      {showCC && ccCols.map(cc => (
        <TableCell key={cc} className="text-right tabular-nums">
          {byCC?.[cc] ? formatPKR(byCC[cc]) : <span className="text-muted-foreground">—</span>}
        </TableCell>
      ))}
      <TableCell className="text-right tabular-nums font-semibold">{formatPKR(total)}</TableCell>
    </TableRow>
  );

  const SubtotalRow = ({ label, value, ccTotals, emphasized = false }: any) => (
    <TableRow className={emphasized ? 'bg-primary/5 border-y' : 'bg-muted/30'}>
      <TableCell />
      <TableCell className={cn('font-bold uppercase text-xs tracking-wide', emphasized && 'text-primary')}>{label}</TableCell>
      {showCC && ccTotals.map((v: number, i: number) => (
        <TableCell key={i} className="text-right tabular-nums font-bold">{formatPKR(v)}</TableCell>
      ))}
      <TableCell className={cn('text-right tabular-nums font-bold', emphasized && 'text-base text-primary')}>{formatPKR(value)}</TableCell>
    </TableRow>
  );

  return (
    <PageShell
      eyebrow="Reports · 1 – 31 May 2026"
      title="Profit & Loss"
      description="Income and expense by GL account with optional cost-centre breakdown. Compare to prior period in the KPI row."
      breadcrumb={[{ label: 'Reports', href: '/dashboard/finance/reports' }, { label: 'Profit & Loss' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> Excel</Button>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> PDF</Button>
          <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Total income" value={formatPKR(totalIncome)} tone="success" icon={TrendingUp}
            delta={{ value: ((totalIncome - pnlPrior.income) / pnlPrior.income) * 100, direction: 'up' }} />
          <KpiCard label="Gross profit" value={formatPKR(grossProfit)} tone="info"
            hint={`Margin ${grossMargin.toFixed(1)}%`} />
          <KpiCard label="Operating expenses" value={formatPKR(totalOpex)} tone="warning" icon={TrendingDown}
            delta={{ value: ((totalOpex - pnlPrior.opex) / pnlPrior.opex) * 100, direction: 'up' }} />
          <KpiCard
            label="Net profit"
            value={formatPKR(netProfit)}
            tone={netProfit > 0 ? 'accent' : 'danger'}
            hint={`Margin ${netMargin.toFixed(1)}%`}
            delta={{ value: ((netProfit - pnlPrior.net) / pnlPrior.net) * 100, direction: netProfit > pnlPrior.net ? 'up' : 'down' }}
          />
        </>
      }
    >
      {/* Chart */}
      <Card className="p-5 mb-4">
        <SectionHeader eyebrow="Trend · 6 months" title="Income vs Expense" />
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyPnl} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis tickFormatter={v => `${(v / 1e6).toFixed(1)}M`} tickLine={false} axisLine={false} className="text-xs" />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--popover))' }}
              formatter={(v: number) => formatPKR(v)}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="income"  name="Income"  fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" name="Expense" fill="hsl(var(--chart-5))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Table */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <SectionHeader eyebrow="Statement" title="Line-by-line" />
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="ccToggle" className="text-xs font-semibold">CC breakdown</Label>
            <Switch id="ccToggle" checked={showCC} onCheckedChange={setShowCC} />
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[120px]">Code</TableHead>
                <TableHead>Account</TableHead>
                {showCC && ccCols.map(cc => (
                  <TableHead key={cc} className="text-right text-[10px] uppercase tracking-wider whitespace-nowrap">{cc}</TableHead>
                ))}
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* INCOME */}
              <TableRow className="bg-emerald-50/50 dark:bg-emerald-950/20">
                <TableCell colSpan={showCC ? ccCols.length + 3 : 3} className="font-bold uppercase tracking-wide text-emerald-700 text-xs">Income</TableCell>
              </TableRow>
              {pnlIncome.map(r => <Row key={r.code} {...r} />)}
              <SubtotalRow label="Total income" value={totalIncome}
                ccTotals={ccCols.map(cc => ccSum(pnlIncome, cc))} />

              {/* COGS */}
              <TableRow className="bg-amber-50/50 dark:bg-amber-950/20">
                <TableCell colSpan={showCC ? ccCols.length + 3 : 3} className="font-bold uppercase tracking-wide text-amber-700 text-xs">Less: Cost of sales</TableCell>
              </TableRow>
              {pnlCogs.map(r => <Row key={r.code} {...r} />)}
              <SubtotalRow label="Gross profit" value={grossProfit}
                ccTotals={ccCols.map(cc => ccSum(pnlIncome, cc) - ccSum(pnlCogs, cc))} emphasized />

              {/* OPEX */}
              <TableRow className="bg-amber-50/50 dark:bg-amber-950/20">
                <TableCell colSpan={showCC ? ccCols.length + 3 : 3} className="font-bold uppercase tracking-wide text-amber-700 text-xs">Less: Operating expenses</TableCell>
              </TableRow>
              {pnlOpex.map(r => <Row key={r.code} {...r} />)}
              <SubtotalRow label="Total operating expenses" value={totalOpex}
                ccTotals={ccCols.map(cc => ccSum(pnlOpex, cc))} />

              {/* NET */}
              <SubtotalRow label="Net operating profit" value={netProfit}
                ccTotals={ccCols.map(cc => ccSum(pnlIncome, cc) - ccSum(pnlCogs, cc) - ccSum(pnlOpex, cc))} emphasized />
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Compared with prior period: <span className="font-semibold text-foreground">{formatPKR(pnlPrior.net)}</span></span>
          <span>BINORIA WELFARE TRUST · PKR</span>
        </div>
      </Card>
    </PageShell>
  );
}
