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

const items = [
  { date: '2026-05-02', voucher: 'SP-2026-05-0006', supplier: 'KARACHI PROPERTIES', section: '155',     gross: 120_000, rate: 10,  wht: 12_000 },
  { date: '2026-05-04', voucher: 'SP-2026-05-0009', supplier: 'AL-MAJEED VEGETABLES', section: '153(1)(a)', gross:  25_750, rate:  4.5, wht:  1_159 },
  { date: '2026-05-12', voucher: 'SP-2026-05-0044', supplier: 'COMPUTER MARKETING', section: '153(1)(a)', gross: 120_000, rate:  5,   wht:  6_000 },
  { date: '2026-05-15', voucher: 'SP-2026-05-0050', supplier: 'IT SERVICES PVT',     section: '153(1)(b)', gross:  85_000, rate:  9,   wht:  7_650 },
  { date: '2026-05-20', voucher: 'SP-2026-05-0058', supplier: 'KARACHI MEAT TRADERS', section: '153(1)(a)', gross:  75_000, rate:  4.5, wht:  3_375 },
  { date: '2026-05-22', voucher: 'SP-2026-05-0062', supplier: 'TEHFEEZ STATIONERS',   section: '153(1)(a)', gross:  42_500, rate:  4.5, wht:  1_913 },
];

export default function WHTStatementPage() {
  const totalGross = items.reduce((s, i) => s + i.gross, 0);
  const totalWht   = items.reduce((s, i) => s + i.wht, 0);

  return (
    <PageShell
      eyebrow="Reports · Tax statutory"
      title="WHT Statement"
      description="Every withholding-tax-applied payment in the period, organised by FBR section. Source for the monthly WHT challan."
      breadcrumb={[{ label: 'Reports', href: '/dashboard/finance/reports' }, { label: 'WHT Statement' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Excel</Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Payments" value={items.length} tone="info" icon={Receipt} />
          <KpiCard label="Gross paid" value={formatPKR(totalGross)} tone="accent" />
          <KpiCard label="WHT withheld" value={formatPKR(totalWht)} tone="success" icon={Calculator} />
          <KpiCard label="Effective rate" value={`${((totalWht / totalGross) * 100).toFixed(2)}%`} tone="warning" />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-3">
          <Select defaultValue="MAY26"><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="MAY26">May 2026</SelectItem></SelectContent>
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
                <TableHead className="w-[180px]">Voucher</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="w-[110px]">FBR section</TableHead>
                <TableHead className="text-right w-[120px]">Gross</TableHead>
                <TableHead className="text-center w-[60px]">Rate</TableHead>
                <TableHead className="text-right w-[120px]">WHT withheld</TableHead>
                <TableHead className="text-right w-[120px]">Net paid</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(i => (
                <TableRow key={i.voucher} className="hover:bg-primary/5">
                  <TableCell className="text-xs text-muted-foreground">{i.date}</TableCell>
                  <TableCell className="font-mono text-xs">{i.voucher}</TableCell>
                  <TableCell className="font-medium">{i.supplier}</TableCell>
                  <TableCell className="font-mono text-xs">{i.section}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPKR(i.gross)}</TableCell>
                  <TableCell className="text-center text-xs font-semibold">{i.rate}%</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold text-amber-700">{formatPKR(i.wht)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPKR(i.gross - i.wht)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-primary/10">
              <TableRow><TableCell colSpan={4} className="font-bold uppercase text-xs text-primary">Period totals</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(totalGross)}</TableCell>
                <TableCell />
                <TableCell className="text-right tabular-nums font-bold text-base text-amber-700">{formatPKR(totalWht)}</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(totalGross - totalWht)}</TableCell></TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
