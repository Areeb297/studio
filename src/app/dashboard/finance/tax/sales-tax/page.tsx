'use client';

import { useState } from 'react';
import {
  Download, FileSpreadsheet, Lock, Send, Receipt, ArrowDown, ArrowUp,
  Calculator, AlertTriangle,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const sectionA = [
  { label: 'Standard rated supplies (17%)', base: 1_732_400, rate: 17, tax: 294_508 },
  { label: 'Zero-rated supplies',           base:   215_000, rate: 0,  tax: 0       },
  { label: 'Exempt supplies',               base:    18_200, rate: 0,  tax: 0       },
];

const sectionB = [
  { label: 'Local taxable purchases (17%)', base:  698_200, rate: 17, tax: 118_694 },
  { label: 'Imports',                       base:        0, rate: 17, tax:       0 },
];

export default function SalesTaxReturnPage() {
  const [period, setPeriod] = useState('MAY26');

  const outputTax = sectionA.reduce((s, r) => s + r.tax, 0);
  const inputTax  = sectionB.reduce((s, r) => s + r.tax, 0);
  const payable   = outputTax - inputTax;

  return (
    <PageShell
      eyebrow="Tax · FBR · Sales Tax / VAT"
      title="Sales Tax Return"
      description="Compute net sales tax liability for the period. All numbers pull from posted tax-coded lines."
      breadcrumb={[{ label: 'Tax' }, { label: 'Sales Tax Return' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> Excel</Button>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> FBR XML</Button>
          <Button variant="outline" size="sm"><Lock className="mr-1.5 h-3.5 w-3.5" /> Lock period</Button>
          <Button size="sm"><Send className="mr-1.5 h-3.5 w-3.5" /> Mark as filed</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Period" value="May 2026" tone="info" icon={Receipt} hint="Due 15 Jun" />
          <KpiCard label="Output tax" value={formatPKR(outputTax)} tone="success" icon={ArrowDown} />
          <KpiCard label="Input tax"  value={formatPKR(inputTax)}  tone="accent"  icon={ArrowUp} />
          <KpiCard label="Net payable" value={formatPKR(payable)}  tone={payable > 0 ? 'danger' : 'success'} icon={Calculator} />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Period</span>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="MAR26">March 2026</SelectItem>
              <SelectItem value="APR26">April 2026</SelectItem>
              <SelectItem value="MAY26">May 2026</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground ml-auto">Status: <span className="font-semibold text-amber-700">Open · not filed</span></span>
        </div>
      </Card>

      {/* Section A — Output */}
      <Card className="p-5 mb-4">
        <SectionHeader eyebrow="Section A" title="Sales — output tax" description="Tax collected on outgoing supplies." />
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-emerald-50/40 dark:bg-emerald-950/20">
              <TableRow>
                <TableHead>Supply type</TableHead>
                <TableHead className="text-right w-[160px]">Taxable base</TableHead>
                <TableHead className="text-right w-[80px]">Rate</TableHead>
                <TableHead className="text-right w-[160px]">Output tax</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sectionA.map(r => (
                <TableRow key={r.label}>
                  <TableCell className="font-medium">{r.label}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPKR(r.base)}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.rate}%</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{r.tax > 0 ? formatPKR(r.tax) : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-emerald-100/60 dark:bg-emerald-900/40">
              <TableRow>
                <TableCell colSpan={3} className="text-right font-bold uppercase text-xs">Total output tax</TableCell>
                <TableCell className="text-right tabular-nums font-bold text-base">{formatPKR(outputTax)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>

      {/* Section B — Input */}
      <Card className="p-5 mb-4">
        <SectionHeader eyebrow="Section B" title="Purchases — input tax" description="Tax paid on incoming supplies, claimable as credit." />
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-amber-50/40 dark:bg-amber-950/20">
              <TableRow>
                <TableHead>Purchase type</TableHead>
                <TableHead className="text-right w-[160px]">Taxable base</TableHead>
                <TableHead className="text-right w-[80px]">Rate</TableHead>
                <TableHead className="text-right w-[160px]">Input tax</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sectionB.map(r => (
                <TableRow key={r.label}>
                  <TableCell className="font-medium">{r.label}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPKR(r.base)}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.rate}%</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{r.tax > 0 ? formatPKR(r.tax) : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-amber-100/60 dark:bg-amber-900/40">
              <TableRow>
                <TableCell colSpan={3} className="text-right font-bold uppercase text-xs">Total input tax</TableCell>
                <TableCell className="text-right tabular-nums font-bold text-base">{formatPKR(inputTax)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>

      {/* Section C — Net */}
      <Card className="p-5 bg-primary/5 border-primary/30">
        <SectionHeader eyebrow="Section C" title="Net liability" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-lg bg-card p-4 ring-1 ring-border">
            <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Output</div>
            <div className="text-2xl font-bold tabular-nums mt-1 text-emerald-700">{formatPKR(outputTax)}</div>
          </div>
          <div className="rounded-lg bg-card p-4 ring-1 ring-border">
            <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Less: Input</div>
            <div className="text-2xl font-bold tabular-nums mt-1 text-amber-700">({formatPKR(inputTax)})</div>
          </div>
          <div className="rounded-lg bg-primary text-primary-foreground p-4">
            <div className="text-[10px] uppercase tracking-wider font-bold opacity-80">Net payable to FBR</div>
            <div className="text-2xl font-bold tabular-nums mt-1">{formatPKR(payable)}</div>
          </div>
        </div>
      </Card>

      <Card className="p-4 mt-4 bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
        <div className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            <strong>FBR direct submission deferred.</strong> Per the proposal Phase 5 — Sales Tax + WHT live, per-line tax-code attribution end-to-end;
            FBR API integration prep deferred per deployment. For now, export XML/PDF and upload via iris.fbr.gov.pk.
          </span>
        </div>
      </Card>
    </PageShell>
  );
}
