'use client';

import { useState } from 'react';
import {
  Printer, Download, Mail, Receipt, FileText, Calculator,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { suppliers } from '@/lib/finance/ar-ap-data';
import { formatPKR } from '@/utils/accounting';

const payments = [
  { date: '2026-04-12', voucher: 'SP-2026-04-0030', gross:  80_000, rate: 5,  wht:  4_000 },
  { date: '2026-04-28', voucher: 'SP-2026-04-0044', gross:  35_000, rate: 5,  wht:  1_750 },
  { date: '2026-05-09', voucher: 'SP-2026-05-0012', gross: 120_000, rate: 5,  wht:  6_000 },
  { date: '2026-05-20', voucher: 'SP-2026-05-0058', gross:  75_000, rate: 5,  wht:  3_750 },
  { date: '2026-05-22', voucher: 'SP-2026-05-0062', gross:  42_500, rate: 5,  wht:  2_125 },
];

export default function WHTCertificatePage() {
  const [supplierId, setSupplierId] = useState('s01');
  const [period, setPeriod] = useState('FY25-26');
  const supplier = suppliers.find(s => s.id === supplierId)!;

  const totals = payments.reduce(
    (a, p) => ({ gross: a.gross + p.gross, wht: a.wht + p.wht }),
    { gross: 0, wht: 0 },
  );

  return (
    <PageShell
      eyebrow="Tax · Withholding"
      title="Withholding Tax Certificate"
      description="Generate the per-supplier WHT certificate in FBR-acceptable format with line-level payment detail."
      breadcrumb={[{ label: 'Tax' }, { label: 'WHT Certificate' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> PDF</Button>
          <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
          <Button size="sm"><Mail className="mr-1.5 h-3.5 w-3.5" /> Email to supplier</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Supplier"           value={supplier.name.split(' ')[0]} tone="info" hint={supplier.name} />
          <KpiCard label="Payments in period" value={payments.length}              tone="accent"  icon={FileText} />
          <KpiCard label="Gross paid"         value={formatPKR(totals.gross)}      tone="warning" icon={Calculator} />
          <KpiCard label="Total WHT withheld" value={formatPKR(totals.wht)}        tone="success" icon={Receipt} />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={supplierId} onValueChange={setSupplierId}>
            <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="FY24-25">FY 2024-25</SelectItem>
              <SelectItem value="FY25-26">FY 2025-26</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Certificate */}
      <Card className="p-8 max-w-3xl mx-auto print:shadow-none">
        <div className="text-center mb-6 pb-4 border-b-2 border-foreground">
          <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Withholder</div>
          <div className="text-lg font-bold mt-1">BINORIA WELFARE TRUST</div>
          <div className="text-xs text-muted-foreground">NTN 1234567-8 · Korangi, Karachi</div>
        </div>

        <div className="text-center mb-6">
          <div className="text-2xl font-bold tracking-tight">Withholding Tax Certificate</div>
          <div className="text-xs text-muted-foreground mt-1">u/s 153(1)(a) of the Income Tax Ordinance, 2001 · Issued 23 May 2026</div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Issued to</div>
            <div className="font-bold text-sm">{supplier.name}</div>
            <div className="text-xs text-muted-foreground">NTN 9999999-9</div>
            <div className="text-xs text-muted-foreground">{supplier.phone}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Period</div>
            <div className="font-bold text-sm">FY 2025-26 (1 Jul 2025 – 30 Jun 2026)</div>
            <div className="text-xs text-muted-foreground">Currency: PKR</div>
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden mb-6">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[110px]">Date</TableHead>
                <TableHead className="w-[180px]">Voucher</TableHead>
                <TableHead className="text-right w-[120px]">Gross</TableHead>
                <TableHead className="text-right w-[80px]">Rate</TableHead>
                <TableHead className="text-right w-[120px]">WHT</TableHead>
                <TableHead className="text-right w-[120px]">Net paid</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map(p => (
                <TableRow key={p.voucher}>
                  <TableCell className="text-xs">{p.date}</TableCell>
                  <TableCell className="font-mono text-xs">{p.voucher}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPKR(p.gross)}</TableCell>
                  <TableCell className="text-right tabular-nums">{p.rate}%</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{formatPKR(p.wht)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPKR(p.gross - p.wht)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-primary/10">
              <TableRow>
                <TableCell colSpan={2} className="font-bold uppercase text-xs text-primary">Totals</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(totals.gross)}</TableCell>
                <TableCell />
                <TableCell className="text-right tabular-nums font-bold text-base text-primary">{formatPKR(totals.wht)}</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(totals.gross - totals.wht)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <div className="border-t pt-6 grid grid-cols-2 gap-8">
          <div>
            <div className="border-t border-foreground/40 pt-1.5 mt-12 text-xs text-muted-foreground text-center">
              Authorised signature
            </div>
          </div>
          <div>
            <div className="border-t border-foreground/40 pt-1.5 mt-12 text-xs text-muted-foreground text-center">
              Date / Stamp
            </div>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}
