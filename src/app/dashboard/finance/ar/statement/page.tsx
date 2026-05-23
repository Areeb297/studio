'use client';

import { useState, useMemo } from 'react';
import {
  Mail, Printer, Download, FileText, ArrowDownRight, Clock, AlertTriangle,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { customers } from '@/lib/finance/ar-ap-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

// Generic statement movements for the active customer
const movements = [
  { date: '2026-05-01', doc: '—',                  desc: 'Opening balance',                  debit: 0,        credit: 0      },
  { date: '2026-05-04', doc: 'CI-2026-05-0019',    desc: 'Catering — Friday booking',        debit: 87_000,   credit: 0      },
  { date: '2026-05-12', doc: 'CR-2026-05-0078',    desc: 'Receipt — HBL ch#10231 (Apr inv)', debit: 0,        credit: 120_000 },
  { date: '2026-05-15', doc: 'CN-2026-05-0003',    desc: 'Credit note — pricing correction', debit: 0,        credit:   5_000 },
  { date: '2026-05-23', doc: 'CI-2026-05-0042',    desc: 'Catering — Eid event',             debit: 57_650,   credit: 0      },
];

export default function CustomerStatementPage() {
  const [custId, setCustId] = useState('c01');
  const cust = customers.find(c => c.id === custId)!;

  // Compute running balance
  const opening = 235_000;
  let running = opening;
  const rows = movements.map((m, i) => {
    if (i > 0) running = running + m.debit - m.credit;
    return { ...m, running };
  });
  const closing = running;

  const totalDr = movements.reduce((s, m) => s + m.debit, 0);
  const totalCr = movements.reduce((s, m) => s + m.credit, 0);

  return (
    <PageShell
      eyebrow="Receivables · Customer statement"
      title="Customer Statement"
      description="Generate a statement for any customer + period. PDF-ready layout with running balance and ageing summary at the foot."
      breadcrumb={[
        { label: 'Receivables', href: '/dashboard/finance/ar' },
        { label: 'Statement' },
      ]}
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Download PDF</Button>
          <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
          <Button size="sm"><Mail className="mr-1.5 h-3.5 w-3.5" /> Email to customer</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Opening balance" value={formatPKR(opening)} tone="info"  icon={FileText} hint="01 May 2026" />
          <KpiCard label="Period debits"    value={formatPKR(totalDr)} tone="warning" icon={ArrowDownRight} />
          <KpiCard label="Period credits"   value={formatPKR(totalCr)} tone="success" icon={Clock} />
          <KpiCard label="Closing balance"  value={formatPKR(closing)} tone={closing > 0 ? 'accent' : 'success'} hint="31 May 2026" />
        </>
      }
    >
      {/* Filters */}
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Customer</label>
            <Select value={custId} onValueChange={setCustId}>
              <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">From</label>
            <Input type="date" defaultValue="2026-05-01" className="w-[150px]" />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">To</label>
            <Input type="date" defaultValue="2026-05-31" className="w-[150px]" />
          </div>
        </div>
      </Card>

      {/* Print-style statement card */}
      <Card className="p-8 max-w-4xl mx-auto print:shadow-none">
        {/* Letterhead */}
        <div className="flex items-start justify-between pb-5 border-b-2 border-foreground">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-teal-600 text-white font-bold text-xl flex items-center justify-center">R</div>
            <div>
              <div className="font-bold text-base">BINORIA WELFARE TRUST</div>
              <div className="text-xs text-muted-foreground">Korangi, Karachi · NTN 1234567-8</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-xl tracking-tight">STATEMENT</div>
            <div className="text-xs text-muted-foreground mt-1">Issued 01 Jun 2026</div>
          </div>
        </div>

        {/* To */}
        <div className="grid grid-cols-2 gap-6 mt-5 mb-6">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Statement to</div>
            <div className="font-bold text-sm">{cust.name}</div>
            <div className="text-xs text-muted-foreground">{cust.contact}</div>
            <div className="text-xs text-muted-foreground">{cust.phone}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Period</div>
            <div className="font-bold text-sm">01 May – 31 May 2026</div>
            <div className="text-xs text-muted-foreground">Currency: PKR</div>
          </div>
        </div>

        {/* Movements */}
        <div className="rounded-lg border border-border overflow-hidden mb-5">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead className="w-[160px]">Document</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right w-[120px]">Debit</TableHead>
                <TableHead className="text-right w-[120px]">Credit</TableHead>
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

        {/* Ageing summary */}
        <div className="border-t pt-4">
          <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-2">Ageing summary</div>
          <div className="grid grid-cols-4 gap-3">
            {(['0-30','31-60','61-90','90+'] as const).map(b => (
              <div key={b} className={cn(
                'rounded-md p-3 ring-1 ring-inset',
                cust.ageingBuckets[b] > 0
                  ? b === '90+' ? 'bg-rose-50 ring-rose-200 dark:bg-rose-950/40' : b === '61-90' ? 'bg-amber-50 ring-amber-200' : b === '31-60' ? 'bg-amber-50 ring-amber-200' : 'bg-emerald-50 ring-emerald-200'
                  : 'bg-muted ring-border',
              )}>
                <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{b} days</div>
                <div className="text-sm font-bold tabular-nums mt-1">
                  {cust.ageingBuckets[b] > 0 ? formatPKR(cust.ageingBuckets[b]) : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground italic">
          Please remit payment by the due date. Queries: finance@rahah24.com · +92 21 35555 0199
        </div>
      </Card>
    </PageShell>
  );
}
