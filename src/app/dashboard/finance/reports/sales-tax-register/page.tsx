'use client';

import { Download, Printer, Receipt, Calculator } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { formatPKR } from '@/utils/accounting';

const lines = [
  { date: '2026-05-02', voucher: 'CI-2026-05-0019', party: 'GREEN VALLEY CATERING',  description: 'Catering — Friday booking',  base:  87_000, rate: 17, tax: 14_790 },
  { date: '2026-05-08', voucher: 'CI-2026-05-0024', party: 'NOOR HOSTEL',             description: 'Monthly hostel meals',         base: 105_000, rate: 17, tax: 17_850 },
  { date: '2026-05-12', voucher: 'CI-2026-05-0029', party: 'HBL CORP. STAFF MESS',    description: 'Lunch catering',                base:  56_500, rate: 17, tax:  9_605 },
  { date: '2026-05-15', voucher: 'CI-2026-05-0035', party: 'GULSHAN GRAMMAR SCHOOL',  description: 'Madrasa fees collected',        base: 220_000, rate:  0, tax:      0 },
  { date: '2026-05-18', voucher: 'CI-2026-05-0038', party: 'CITY PHARMA EVENTS',      description: 'Event hall hire',               base:  72_300, rate: 17, tax: 12_291 },
  { date: '2026-05-20', voucher: 'CI-2026-05-0041', party: 'AL-MUHAMMADI SUPPLIERS',  description: 'Banquet for engagement',       base: 145_000, rate: 17, tax: 24_650 },
  { date: '2026-05-22', voucher: 'CI-2026-05-0042', party: 'GREEN VALLEY CATERING',  description: 'Eid event hall + cleanup',     base:  50_000, rate: 17, tax:  8_500 },
  { date: '2026-05-23', voucher: 'CI-2026-05-0046', party: 'DEFENCE CENTRAL MESS',    description: 'Friday lunch (zero-rated)',    base:  18_200, rate:  0, tax:      0 },
];

export default function SalesTaxRegisterPage() {
  const totalBase = lines.reduce((s, l) => s + l.base, 0);
  const totalTax  = lines.reduce((s, l) => s + l.tax, 0);

  return (
    <PageShell
      eyebrow="Reports · Tax statutory"
      title="Sales Tax Register"
      description="Every taxable + zero-rated + exempt sale in the period — line-level evidence for the Sales Tax Return."
      breadcrumb={[{ label: 'Reports', href: '/dashboard/finance/reports' }, { label: 'Sales Tax Register' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Excel</Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Lines" value={lines.length} tone="info" icon={Receipt} />
          <KpiCard label="Taxable supplies" value={formatPKR(totalBase)} tone="accent" />
          <KpiCard label="Output tax" value={formatPKR(totalTax)} tone="success" icon={Calculator} />
          <KpiCard label="Effective rate" value={`${((totalTax / totalBase) * 100).toFixed(1)}%`} tone="warning" />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-3">
          <Select defaultValue="MAY26"><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="MAY26">May 2026</SelectItem><SelectItem value="APR26">Apr 2026</SelectItem></SelectContent>
          </Select>
          <Input type="date" defaultValue="2026-05-01" className="w-[150px]" />
          <Input type="date" defaultValue="2026-05-31" className="w-[150px]" />
        </div>
      </Card>

      <Card className="p-4 print:shadow-none">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead className="w-[170px]">Voucher</TableHead>
                <TableHead>Party</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right w-[120px]">Taxable base</TableHead>
                <TableHead className="text-center w-[60px]">Rate</TableHead>
                <TableHead className="text-right w-[120px]">Output tax</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map(l => (
                <TableRow key={l.voucher} className="hover:bg-primary/5">
                  <TableCell className="text-xs text-muted-foreground">{l.date}</TableCell>
                  <TableCell className="font-mono text-xs">{l.voucher}</TableCell>
                  <TableCell className="font-medium">{l.party}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{l.description}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPKR(l.base)}</TableCell>
                  <TableCell className="text-center text-xs font-semibold">{l.rate}%</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{l.tax > 0 ? formatPKR(l.tax) : <span className="text-muted-foreground">—</span>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-primary/10">
              <TableRow><TableCell colSpan={4} className="font-bold uppercase text-xs text-primary">Period totals</TableCell>
                <TableCell className="text-right tabular-nums font-bold text-base">{formatPKR(totalBase)}</TableCell>
                <TableCell />
                <TableCell className="text-right tabular-nums font-bold text-base text-primary">{formatPKR(totalTax)}</TableCell></TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
