'use client';

import { useState, useMemo } from 'react';
import {
  Play, Layers, ListChecks, CreditCard, Download, Mail, AlertTriangle,
  CheckCircle2, Truck,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { openBills } from '@/lib/finance/ar-ap-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

export default function BatchPaymentRunPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set(['SI-2026-04-0019', 'SI-2026-05-0041', 'SI-2026-05-0011']));
  const [bank, setBank] = useState('1002');

  const toggle = (n: string) => setSelected(prev => {
    const next = new Set(prev);
    next.has(n) ? next.delete(n) : next.add(n);
    return next;
  });

  const selectAll = () => setSelected(new Set(openBills.map(b => b.number)));
  const selectOverdue = () => setSelected(new Set(openBills.filter(b => b.daysOld > 30).map(b => b.number)));
  const selectDueSoon = () => setSelected(new Set(openBills.filter(b => b.daysOld <= 30).map(b => b.number)));
  const clearSel = () => setSelected(new Set());

  const selectedBills = openBills.filter(b => selected.has(b.number));
  const totalPay = selectedBills.reduce((s, b) => s + b.total, 0);
  const supplierCount = new Set(selectedBills.map(b => b.supplierId)).size;

  return (
    <PageShell
      eyebrow="Payables · Weekly ritual"
      title="Batch Payment Run"
      description="Process multiple supplier invoices in one batch. The system creates one payment per supplier, ready for cheque print or bank file upload."
      breadcrumb={[
        { label: 'Payables', href: '/dashboard/finance/ap' },
        { label: 'Batch Run' },
      ]}
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export selection</Button>
          <Button size="sm" disabled={selected.size === 0}>
            <Play className="mr-1.5 h-3.5 w-3.5" /> Process run ({selected.size})
          </Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Open bills total"  value={openBills.length}                tone="info"    icon={ListChecks} />
          <KpiCard label="Bills selected"    value={selected.size}                   tone="accent"  icon={CheckCircle2} hint={`${supplierCount} suppliers`} />
          <KpiCard label="Total to pay"      value={formatPKR(totalPay)}             tone="warning" icon={CreditCard} />
          <KpiCard label="Bank account"      value="HBL Current"                     tone="success" icon={Truck} hint="Rs 2,850,000 available" />
        </>
      }
    >
      <Card className="p-4">
        {/* Bulk selectors */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Select value={bank} onValueChange={setBank}>
            <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1002">1002 · Bank — HBL Current</SelectItem>
              <SelectItem value="1003">1003 · Bank — MCB Savings</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-1.5 ml-auto">
            <Button variant="outline" size="sm" onClick={selectAll}>Select all</Button>
            <Button variant="outline" size="sm" onClick={selectOverdue}>Overdue only</Button>
            <Button variant="outline" size="sm" onClick={selectDueSoon}>Due ≤ 30d</Button>
            <Button variant="ghost" size="sm" onClick={clearSel}>Clear</Button>
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[40px]" />
                <TableHead>Supplier</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead className="w-[110px]">Date</TableHead>
                <TableHead className="w-[110px]">Due</TableHead>
                <TableHead className="w-[80px] text-center">Days</TableHead>
                <TableHead className="text-right w-[140px]">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openBills.map(b => (
                <TableRow key={b.number}
                  className={cn(
                    'hover:bg-primary/5',
                    selected.has(b.number) && 'bg-primary/10',
                    b.daysOld > 90 && 'bg-rose-50/40 dark:bg-rose-950/10',
                  )}
                >
                  <TableCell>
                    <Checkbox checked={selected.has(b.number)} onCheckedChange={() => toggle(b.number)} />
                  </TableCell>
                  <TableCell className="font-medium">{b.supplier}</TableCell>
                  <TableCell className="font-mono text-xs">{b.number}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{b.date}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{b.dueDate}</TableCell>
                  <TableCell className={cn(
                    'text-center text-xs font-semibold',
                    b.daysOld > 90 ? 'text-rose-700' : b.daysOld > 30 ? 'text-amber-700' : 'text-emerald-700',
                  )}>
                    {b.daysOld}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{formatPKR(b.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-muted/60">
              <TableRow>
                <TableCell colSpan={6} className="text-right text-xs uppercase tracking-wide font-bold">Selected total</TableCell>
                <TableCell className="text-right tabular-nums font-bold text-base">{formatPKR(totalPay)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className="p-4 bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
            <div className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span><strong>{supplierCount} payments</strong> will be generated (1 per supplier), each allocated to its selected invoices. All go to the approval queue.</span>
            </div>
          </Card>
          <Card className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
            <div className="flex items-start gap-2 text-xs text-emerald-900 dark:text-emerald-200">
              <Mail className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Once approved, one-click <strong>Email payment advice</strong> sends a PDF to each supplier.</span>
            </div>
          </Card>
        </div>
      </Card>
    </PageShell>
  );
}
