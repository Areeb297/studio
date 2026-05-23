'use client';

import { useState, useMemo } from 'react';
import {
  Download, Filter, TrendingUp, TrendingDown, Target,
  ArrowRight, Building2,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { budgetMatrix } from '@/lib/finance/budget-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

export default function BudgetVariancePage() {
  const [ccKey, setCcKey] = useState<keyof typeof budgetMatrix>('RESTAURANT');
  const [onlyOver, setOnlyOver] = useState(false);
  const rows = budgetMatrix[ccKey];

  const filteredRows = onlyOver ? rows.filter(r => Math.abs(r.variancePct) >= 5) : rows;

  const totals = useMemo(() => {
    const income = rows.filter(r => r.type === 'INCOME');
    const exp = rows.filter(r => r.type === 'EXPENSE');
    return {
      ytdBudget: income.reduce((a, r) => a + r.ytdBudget, 0) - exp.reduce((a, r) => a + r.ytdBudget, 0),
      ytdActual: income.reduce((a, r) => a + r.ytdActual, 0) - exp.reduce((a, r) => a + r.ytdActual, 0),
      incomeBudget: income.reduce((a, r) => a + r.ytdBudget, 0),
      incomeActual: income.reduce((a, r) => a + r.ytdActual, 0),
      expenseBudget: exp.reduce((a, r) => a + r.ytdBudget, 0),
      expenseActual: exp.reduce((a, r) => a + r.ytdActual, 0),
    };
  }, [rows]);

  return (
    <PageShell
      eyebrow="Budgeting · FY2026 · Through May"
      title="Budget vs Actual"
      description="YTD comparison of actual postings against the locked budget, by cost centre."
      breadcrumb={[
        { label: 'Budgeting', href: '/dashboard/finance/budgets' },
        { label: 'Variance' },
      ]}
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export PDF</Button>
          <Button variant="outline" size="sm"><Filter className="mr-1.5 h-3.5 w-3.5" /> By department</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Income · YTD budget" value={formatPKR(totals.incomeBudget)} tone="info" icon={Target} />
          <KpiCard
            label="Income · YTD actual"
            value={formatPKR(totals.incomeActual)}
            tone={totals.incomeActual >= totals.incomeBudget ? 'success' : 'warning'}
            icon={TrendingUp}
            delta={{ value: ((totals.incomeActual - totals.incomeBudget) / totals.incomeBudget) * 100, direction: totals.incomeActual >= totals.incomeBudget ? 'up' : 'down' }}
          />
          <KpiCard
            label="Expense · YTD actual"
            value={formatPKR(totals.expenseActual)}
            tone={totals.expenseActual <= totals.expenseBudget ? 'success' : 'danger'}
            icon={TrendingDown}
            delta={{ value: ((totals.expenseActual - totals.expenseBudget) / totals.expenseBudget) * 100, direction: 'up' }}
          />
          <KpiCard
            label="Net · YTD"
            value={formatPKR(totals.ytdActual)}
            tone={totals.ytdActual >= totals.ytdBudget ? 'accent' : 'danger'}
            hint={`vs budget ${formatPKR(totals.ytdBudget)}`}
          />
        </>
      }
    >
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Select value={ccKey} onValueChange={(v) => setCcKey(v as any)}>
            <SelectTrigger className="w-[220px]">
              <Building2 className="h-3.5 w-3.5 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(budgetMatrix) as Array<keyof typeof budgetMatrix>).map(k => (
                <SelectItem key={k} value={k}>{k}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 ml-auto">
            <Label htmlFor="onlyOver" className="text-xs">Only &gt; 5% variance</Label>
            <Switch id="onlyOver" checked={onlyOver} onCheckedChange={setOnlyOver} />
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[100px]">Code</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">YTD Budget</TableHead>
                <TableHead className="text-right">YTD Actual</TableHead>
                <TableHead className="text-right">Variance</TableHead>
                <TableHead className="text-right w-[100px]">%</TableHead>
                <TableHead className="w-[180px]">Trend</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.map(r => {
                // For income, +ve variance = good (over budget). For expense, +ve = bad (over).
                const isFavorable = r.type === 'INCOME' ? r.variance >= 0 : r.variance <= 0;
                const pctUtilization = Math.min(150, (r.ytdActual / r.ytdBudget) * 100);
                return (
                  <TableRow key={r.accountCode} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs">{r.accountCode}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'h-1.5 w-1.5 rounded-full shrink-0',
                          r.type === 'INCOME' ? 'bg-emerald-500' : 'bg-amber-500',
                        )} />
                        <span className="font-medium">{r.accountName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{formatPKR(r.ytdBudget)}</TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">{formatPKR(r.ytdActual)}</TableCell>
                    <TableCell className={cn('text-right tabular-nums font-semibold', isFavorable ? 'text-emerald-700' : 'text-rose-700')}>
                      {r.variance >= 0 ? '+' : ''}{formatPKR(r.variance)}
                    </TableCell>
                    <TableCell className={cn('text-right tabular-nums font-bold', isFavorable ? 'text-emerald-700' : 'text-rose-700')}>
                      <span className="inline-flex items-center gap-0.5">
                        {isFavorable ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(r.variancePct).toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            pctUtilization > 100 ? 'bg-rose-500' :
                            pctUtilization > 90  ? 'bg-amber-500' :
                                                   'bg-emerald-500',
                          )}
                          style={{ width: `${Math.min(100, pctUtilization)}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><ArrowRight className="h-3.5 w-3.5" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter className="bg-muted/60">
              <TableRow>
                <TableCell colSpan={2} className="font-bold uppercase text-xs tracking-wide">Net contribution</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(totals.ytdBudget)}</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(totals.ytdActual)}</TableCell>
                <TableCell className={cn(
                  'text-right tabular-nums font-bold',
                  totals.ytdActual >= totals.ytdBudget ? 'text-emerald-700' : 'text-rose-700',
                )}>
                  {totals.ytdActual - totals.ytdBudget >= 0 ? '+' : ''}{formatPKR(totals.ytdActual - totals.ytdBudget)}
                </TableCell>
                <TableCell colSpan={3} />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
