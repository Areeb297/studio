'use client';

import { Plus, Receipt, Edit, Trash2, Percent } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { StatusBadge } from '@/components/finance/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

const codes = [
  { code: 'ST17',     name: 'Sales Tax — Standard',          rate: 17,   direction: 'OUTPUT',     glAccount: '2300', description: 'Standard rated sales / catering',     used: 142 },
  { code: 'ST0',      name: 'Zero-rated supplies',            rate:  0,   direction: 'OUTPUT',     glAccount: '—',     description: 'Zero-rated supplies (e.g. exports)',  used:  18 },
  { code: 'STX',      name: 'Exempt',                          rate:  0,   direction: 'OUTPUT',     glAccount: '—',     description: 'Exempt — donations, fees, education',  used:  35 },
  { code: 'STIN17',   name: 'Input Tax — Standard',           rate: 17,   direction: 'INPUT',      glAccount: '1310', description: 'Input tax on local purchases',         used:  88 },
  { code: 'STIM17',   name: 'Input Tax — Imports',            rate: 17,   direction: 'INPUT',      glAccount: '1311', description: 'Input tax on imports (CD + SD added)', used:   0 },
  { code: 'WHT-V5',   name: 'WHT — Vendor / Service',          rate:  5,   direction: 'WITHHELD',   glAccount: '2310', description: 'Section 153(1)(a) — services',         used:  56 },
  { code: 'WHT-V11',  name: 'WHT — Vendor / Goods',            rate:  4.5, direction: 'WITHHELD',   glAccount: '2310', description: 'Section 153(1)(a) — goods',            used:  42 },
  { code: 'WHT-RENT', name: 'WHT — Rent',                      rate: 10,   direction: 'WITHHELD',   glAccount: '2311', description: 'Section 155 — rent / lease',           used:  12 },
  { code: 'WHT-SAL',  name: 'WHT — Salary',                    rate:  0,   direction: 'WITHHELD',   glAccount: '2312', description: 'Slab-based — computed at payroll',     used:  88 },
];

const dirColor: Record<string, string> = {
  OUTPUT:    'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
  INPUT:     'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300',
  WITHHELD:  'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
};

export default function TaxCodesPage() {
  return (
    <PageShell
      eyebrow="Setup · Tax"
      title="Tax Codes"
      description="All sales tax + withholding tax codes. Every invoice / bill / payment line carries an optional tax code that drives auto-posting."
      breadcrumb={[{ label: 'Setup' }, { label: 'Tax Codes' }]}
      actions={<Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New tax code</Button>}
      kpis={
        <>
          <KpiCard label="Total codes" value={codes.length} tone="info"    icon={Receipt} />
          <KpiCard label="Output tax"  value={codes.filter(c => c.direction === 'OUTPUT').length}   tone="success" icon={Percent} hint="On sales" />
          <KpiCard label="Input tax"   value={codes.filter(c => c.direction === 'INPUT').length}    tone="accent"  icon={Percent} hint="On purchases" />
          <KpiCard label="WHT"          value={codes.filter(c => c.direction === 'WITHHELD').length} tone="warning" icon={Percent} hint="Withheld at payment" />
        </>
      }
    >
      <Card className="p-4">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[110px] font-mono">Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-center w-[80px]">Rate</TableHead>
                <TableHead className="w-[120px]">Direction</TableHead>
                <TableHead className="w-[110px]">GL account</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center w-[80px]">In use</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.map(c => (
                <TableRow key={c.code} className="hover:bg-primary/5">
                  <TableCell className="font-mono text-xs font-bold">{c.code}</TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-center tabular-nums font-semibold">{c.rate}%</TableCell>
                  <TableCell>
                    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset', dirColor[c.direction])}>
                      {c.direction}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{c.glAccount}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.description}</TableCell>
                  <TableCell className="text-center text-xs font-semibold">{c.used}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-600"><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
