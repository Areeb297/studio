'use client';

import { useState } from 'react';
import { Mail, Printer, Download, FileText, ArrowUpRight, Truck } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { suppliers } from '@/lib/finance/ar-ap-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const movements = [
  { date: '2026-05-01', doc: '—',                desc: 'Opening balance',                 debit: 0,      credit: 0      },
  { date: '2026-05-04', doc: 'SI-2026-05-0033',  desc: 'Beef + Mutton',                    debit: 0,      credit: 42_500 },
  { date: '2026-05-12', doc: 'SP-2026-05-0044',  desc: 'Payment — HBL ch#10221',           debit: 80_000, credit: 0      },
  { date: '2026-05-18', doc: 'DN-2026-05-0007',  desc: 'Debit note — quality return',      debit:  4_500, credit: 0      },
  { date: '2026-05-22', doc: 'SI-2026-05-0058',  desc: 'Weekly delivery',                  debit: 0,      credit: 23_000 },
];

export default function SupplierStatementPage() {
  const [supId, setSupId] = useState('s01');
  const sup = suppliers.find(s => s.id === supId)!;

  const opening = 175_000;
  let running = opening;
  const rows = movements.map((m, i) => {
    if (i > 0) running = running + m.credit - m.debit;
    return { ...m, running };
  });
  const closing = running;
  const totalDr = movements.reduce((s, m) => s + m.debit, 0);
  const totalCr = movements.reduce((s, m) => s + m.credit, 0);

  return (
    <PageShell
      eyebrow="Payables · Supplier statement"
      title="Supplier Statement"
      description="Generate a statement for any supplier + period. Used when reconciling against the supplier's own ledger."
      breadcrumb={[
        { label: 'Payables', href: '/dashboard/finance/ap' },
        { label: 'Statement' },
      ]}
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> PDF</Button>
          <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
          <Button size="sm"><Mail className="mr-1.5 h-3.5 w-3.5" /> Email to supplier</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Opening balance" value={formatPKR(opening)} tone="info"  icon={FileText} hint="01 May 2026" />
          <KpiCard label="Period debits"    value={formatPKR(totalDr)} tone="success" icon={ArrowUpRight} hint="Payments + DNs" />
          <KpiCard label="Period credits"   value={formatPKR(totalCr)} tone="warning" icon={Truck} hint="New bills" />
          <KpiCard label="Closing balance"  value={formatPKR(closing)} tone="accent"  hint="31 May 2026" />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={supId} onValueChange={setSupId}>
            <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
            <SelectContent>{suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
          </Select>
          <Input type="date" defaultValue="2026-05-01" className="w-[150px]" />
          <Input type="date" defaultValue="2026-05-31" className="w-[150px]" />
        </div>
      </Card>

      <Card className="p-8 max-w-4xl mx-auto print:shadow-none">
        <div className="flex items-start justify-between pb-5 border-b-2 border-foreground">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-teal-600 text-white font-bold text-xl flex items-center justify-center">R</div>
            <div>
              <div className="font-bold text-base">BINORIA WELFARE TRUST</div>
              <div className="text-xs text-muted-foreground">Korangi, Karachi · NTN 1234567-8</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-xl tracking-tight">SUPPLIER STATEMENT</div>
            <div className="text-xs text-muted-foreground mt-1">Issued 01 Jun 2026</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-5 mb-6">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Statement to</div>
            <div className="font-bold text-sm">{sup.name}</div>
            <div className="text-xs text-muted-foreground">{sup.contact}</div>
            <div className="text-xs text-muted-foreground">{sup.phone}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Period</div>
            <div className="font-bold text-sm">01 May – 31 May 2026</div>
            <div className="text-xs text-muted-foreground">Currency: PKR · Terms: {sup.paymentTerms}</div>
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden mb-5">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead className="w-[160px]">Document</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right w-[120px]">Debit (us)</TableHead>
                <TableHead className="text-right w-[120px]">Credit (us)</TableHead>
                <TableHead className="text-right w-[130px]">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={i} className={cn(i === 0 && 'bg-muted/30 italic')}>
                  <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
                  <TableCell className="font-mono text-xs">{r.doc}</TableCell>
                  <TableCell className="text-sm">{r.desc}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.debit > 0 ? formatPKR(r.debit) : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.credit > 0 ? formatPKR(r.credit) : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{formatPKR(r.running)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-primary/10">
              <TableRow>
                <TableCell colSpan={3} className="font-bold uppercase text-xs tracking-wide text-primary">Closing balance · 31 May 2026</TableCell>
                <TableCell className="text-right tabular-nums">{formatPKR(totalDr)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatPKR(totalCr)}</TableCell>
                <TableCell className="text-right tabular-nums font-bold text-base text-primary">{formatPKR(closing)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <div className="border-t pt-4">
          <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-2">Ageing summary (what we owe)</div>
          <div className="grid grid-cols-4 gap-3">
            {(['0-30','31-60','61-90','90+'] as const).map(b => (
              <div key={b} className={cn(
                'rounded-md p-3 ring-1 ring-inset',
                sup.ageingBuckets[b] > 0
                  ? b === '90+' ? 'bg-rose-50 ring-rose-200 dark:bg-rose-950/40' :
                    b === '61-90' || b === '31-60' ? 'bg-amber-50 ring-amber-200' : 'bg-emerald-50 ring-emerald-200'
                  : 'bg-muted ring-border',
              )}>
                <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{b} days</div>
                <div className="text-sm font-bold tabular-nums mt-1">
                  {sup.ageingBuckets[b] > 0 ? formatPKR(sup.ageingBuckets[b]) : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground italic">
          Please reconcile and report any discrepancies within 7 days. Queries: finance@rahah24.com
        </div>
      </Card>
    </PageShell>
  );
}
