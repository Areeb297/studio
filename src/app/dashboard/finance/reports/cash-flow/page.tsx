'use client';

import { Download, Printer, FileSpreadsheet, Waves, ArrowUp, ArrowDown, Wallet } from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from 'recharts';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cashFlow, monthlyCashflow } from '@/lib/finance/statements-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const sum = (rows: { amount: number }[]) => rows.reduce((a, r) => a + r.amount, 0);

export default function CashFlowPage() {
  const op  = sum(cashFlow.operating);
  const inv = sum(cashFlow.investing);
  const fin = sum(cashFlow.financing);
  const net = op + inv + fin;
  const closing = cashFlow.openingCash + net;

  const SectionBlock = ({ title, rows, total, tone }: any) => (
    <>
      <TableRow className="bg-muted/40">
        <TableCell colSpan={2} className={cn('font-bold uppercase tracking-wide text-xs', tone)}>{title}</TableCell>
      </TableRow>
      {rows.map((r: any) => (
        <TableRow key={r.name} className="hover:bg-muted/30">
          <TableCell className="pl-6">{r.name}</TableCell>
          <TableCell className={cn('text-right tabular-nums font-medium', r.amount < 0 && 'text-rose-600')}>
            {r.amount < 0 ? `(${formatPKR(Math.abs(r.amount))})` : formatPKR(r.amount)}
          </TableCell>
        </TableRow>
      ))}
      <TableRow className="bg-primary/5">
        <TableCell className="pl-6 font-semibold uppercase text-xs tracking-wide">Net cash from {title.toLowerCase()}</TableCell>
        <TableCell className={cn('text-right tabular-nums font-bold', total < 0 && 'text-rose-600')}>
          {total < 0 ? `(${formatPKR(Math.abs(total))})` : formatPKR(total)}
        </TableCell>
      </TableRow>
    </>
  );

  return (
    <PageShell
      eyebrow="Reports · 1 – 31 May 2026"
      title="Cash Flow Statement"
      description="Indirect method. Reconciles net profit to cash position; tracks where the money actually moved."
      breadcrumb={[{ label: 'Reports', href: '/dashboard/finance/reports' }, { label: 'Cash Flow' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> Excel</Button>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> PDF</Button>
          <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Operating" value={formatPKR(op)} tone="success" icon={ArrowUp} />
          <KpiCard label="Investing" value={formatPKR(inv)} tone={inv >= 0 ? 'info' : 'warning'} icon={inv >= 0 ? ArrowUp : ArrowDown} />
          <KpiCard label="Financing" value={formatPKR(fin)} tone="accent" icon={Waves} />
          <KpiCard label="Net change · cash" value={formatPKR(net)} tone={net >= 0 ? 'success' : 'danger'} icon={Wallet} hint={`Closing ${formatPKR(closing)}`} />
        </>
      }
    >
      {/* Chart */}
      <Card className="p-5 mb-4">
        <SectionHeader eyebrow="Trend · 6 months" title="Cash inflows / outflows" />
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={monthlyCashflow} margin={{ top: 5, right: 5, left: 0, bottom: 0 }} stackOffset="sign">
            <defs>
              <linearGradient id="opG" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="invG" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-3))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="finG" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-4))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis tickFormatter={v => `${(v / 1e6).toFixed(1)}M`} tickLine={false} axisLine={false} className="text-xs" />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--popover))' }}
              formatter={(v: number) => formatPKR(v)}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="operating" name="Operating" stroke="hsl(var(--chart-1))" fill="url(#opG)"  strokeWidth={2} />
            <Area type="monotone" dataKey="investing" name="Investing" stroke="hsl(var(--chart-3))" fill="url(#invG)" strokeWidth={2} />
            <Area type="monotone" dataKey="financing" name="Financing" stroke="hsl(var(--chart-4))" fill="url(#finG)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Statement table */}
      <Card className="p-4">
        <SectionHeader eyebrow="Statement" title="Cash flow detail" />
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right w-[200px]">Amount (PKR)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SectionBlock title="Operating activities" rows={cashFlow.operating} total={op} tone="text-emerald-700" />
              <SectionBlock title="Investing activities" rows={cashFlow.investing} total={inv} tone="text-amber-700" />
              <SectionBlock title="Financing activities" rows={cashFlow.financing} total={fin} tone="text-violet-700" />

              <TableRow className="bg-primary/10 border-y">
                <TableCell className="font-bold uppercase tracking-wide text-sm text-primary">Net change in cash</TableCell>
                <TableCell className={cn('text-right tabular-nums font-bold text-base text-primary', net < 0 && '!text-rose-700')}>
                  {net < 0 ? `(${formatPKR(Math.abs(net))})` : formatPKR(net)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Cash at start of period</TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">{formatPKR(cashFlow.openingCash)}</TableCell>
              </TableRow>
              <TableRow className="bg-emerald-50/60 dark:bg-emerald-950/20">
                <TableCell className="font-bold uppercase tracking-wide text-sm text-emerald-800 dark:text-emerald-200">Cash at end of period</TableCell>
                <TableCell className="text-right tabular-nums font-bold text-emerald-800 dark:text-emerald-200">{formatPKR(closing)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-xs text-muted-foreground text-right">For period 1 – 31 May 2026 · BINORIA WELFARE TRUST · PKR</div>
      </Card>
    </PageShell>
  );
}
