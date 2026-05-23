'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Upload, Download, Save, FileSpreadsheet, Calculator, Target,
  TrendingUp, Plus, Building2, Calendar, AlertTriangle,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { budgetMatrix, budgetMonths } from '@/lib/finance/budget-data';
import { COST_CENTERS } from '@/lib/finance/seed';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

export default function BudgetSetupPage() {
  const [fy, setFy] = useState('FY2026');
  const [ccKey, setCcKey] = useState<keyof typeof budgetMatrix>('RESTAURANT');
  const rows = budgetMatrix[ccKey];

  const totalsByMonth = budgetMonths.map((_, i) =>
    rows.reduce((a, r) => a + (r.type === 'INCOME' ? r.monthly[i] : -r.monthly[i]), 0)
  );
  const totalIncome = rows.filter(r => r.type === 'INCOME').reduce((a, r) => a + r.monthly.reduce((s, v) => s + v, 0), 0);
  const totalExpense = rows.filter(r => r.type === 'EXPENSE').reduce((a, r) => a + r.monthly.reduce((s, v) => s + v, 0), 0);

  return (
    <PageShell
      eyebrow="Budgeting · FY2026"
      title="Budget Setup"
      description="Set annual targets per Account × Cost Centre × Month. Inline edit any cell, or upload from Excel."
      breadcrumb={[{ label: 'Budgeting' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Template</Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/finance/budgets/upload"><Upload className="mr-1.5 h-3.5 w-3.5" /> Excel upload</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/finance/budgets/variance"><TrendingUp className="mr-1.5 h-3.5 w-3.5" /> Variance</Link>
          </Button>
          <Button size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Save draft</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Fiscal year"    value={fy} tone="info" icon={Calendar} />
          <KpiCard label="Budgeted income" value={formatPKR(totalIncome)}  tone="success" icon={TrendingUp} />
          <KpiCard label="Budgeted expense" value={formatPKR(totalExpense)} tone="warning" icon={Calculator} />
          <KpiCard label="Target net profit" value={formatPKR(totalIncome - totalExpense)} tone="accent" icon={Target} />
        </>
      }
    >
      <Card className="p-4">
        {/* Selectors */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Select value={fy} onValueChange={setFy}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['FY2024', 'FY2025', 'FY2026', 'FY2027'].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
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
          <div className="text-xs text-muted-foreground ml-auto">
            {rows.length} accounts budgeted · {budgetMonths.length} months
          </div>
        </div>

        {/* The grid */}
        <div className="rounded-lg border border-border overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[100px] sticky left-0 bg-muted/40 z-10">Code</TableHead>
                <TableHead className="w-[220px] sticky left-[100px] bg-muted/40 z-10">Account</TableHead>
                {budgetMonths.map(m => (
                  <TableHead key={m} className="text-right whitespace-nowrap text-[10px] uppercase tracking-wide font-bold w-[100px]">{m}</TableHead>
                ))}
                <TableHead className="text-right whitespace-nowrap w-[120px]">YTD Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(r => {
                const total = r.monthly.reduce((a, v) => a + v, 0);
                return (
                  <TableRow key={r.accountCode} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs sticky left-0 bg-card z-10">{r.accountCode}</TableCell>
                    <TableCell className="font-medium sticky left-[100px] bg-card z-10">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          r.type === 'INCOME' ? 'bg-emerald-500' : 'bg-amber-500',
                        )} />
                        {r.accountName}
                      </div>
                    </TableCell>
                    {r.monthly.map((v, i) => (
                      <TableCell key={i} className="p-1">
                        <Input
                          defaultValue={v.toLocaleString()}
                          className="h-8 text-right tabular-nums font-medium text-xs px-2"
                        />
                      </TableCell>
                    ))}
                    <TableCell className="text-right tabular-nums font-bold">{formatPKR(total)}</TableCell>
                  </TableRow>
                );
              })}

              {/* Add account row */}
              <TableRow>
                <TableCell colSpan={budgetMonths.length + 3} className="text-center py-2">
                  <Button variant="ghost" size="sm"><Plus className="mr-1 h-3.5 w-3.5" /> Add account row</Button>
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter className="bg-muted/60">
              <TableRow>
                <TableCell colSpan={2} className="text-xs uppercase tracking-wide font-bold sticky left-0 bg-muted/60 z-10">Net (Income − Expense)</TableCell>
                {totalsByMonth.map((v, i) => (
                  <TableCell key={i} className={cn(
                    'text-right tabular-nums font-bold text-xs',
                    v >= 0 ? 'text-emerald-700' : 'text-rose-700',
                  )}>
                    {v >= 0 ? formatPKR(v) : `(${formatPKR(Math.abs(v))})`}
                  </TableCell>
                ))}
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(totalIncome - totalExpense)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
          <span>
            Inline edits are kept in memory only. Click <strong>Save draft</strong> to persist, or <strong>Submit</strong> to lock and start tracking variance.
            Right-click a column header for bulk actions like "copy May to Jun…Dec" or "apply growth %".
          </span>
        </div>
      </Card>
    </PageShell>
  );
}
