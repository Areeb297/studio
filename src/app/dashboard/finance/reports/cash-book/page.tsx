'use client';

import { useState } from 'react';
import { Download, Printer, Banknote, ArrowDown, ArrowUp, Wallet } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { HelperInfo } from '@/components/finance/helper-info';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const movements = [
  { date: '01 May', voucher: '—',                  desc: 'Opening balance',                 dr: 0,        cr: 0 },
  { date: '02 May', voucher: 'CRV-2026-05-0001',   desc: 'Cash sales — Restaurant',         dr: 12_500,   cr: 0 },
  { date: '02 May', voucher: 'CPV-2026-05-0001',   desc: 'Petty cash purchase',              dr: 0,        cr: 2_500 },
  { date: '03 May', voucher: 'DC-2026-05-0011',    desc: 'Zakat donation — cash',           dr: 25_000,   cr: 0 },
  { date: '05 May', voucher: 'CRV-2026-05-0002',   desc: 'Madrasa fees · 8 students',       dr: 64_000,   cr: 0 },
  { date: '08 May', voucher: 'CPV-2026-05-0015',   desc: 'Toyota Hiace fuel',                dr: 0,        cr: 6_400 },
  { date: '10 May', voucher: 'CRV-2026-05-0078',   desc: 'Cash sales — Restaurant',         dr: 18_200,   cr: 0 },
  { date: '12 May', voucher: 'CPV-2026-05-0023',   desc: 'Office supplies',                  dr: 0,        cr: 4_800 },
  { date: '15 May', voucher: 'DC-2026-05-0089',    desc: 'Cash donation — Sadqah',          dr: 17_500,   cr: 0 },
  { date: '18 May', voucher: 'CPV-2026-05-0028',   desc: 'Staff lunch',                      dr: 0,        cr: 12_300 },
  { date: '20 May', voucher: 'BRV-2026-05-0024',   desc: 'Cash deposit to bank',             dr: 0,        cr: 50_000 },
  { date: '23 May', voucher: 'CPV-2026-05-0017',   desc: 'Stationery — Restaurant',          dr: 0,        cr: 2_500 },
];

export default function CashBookPage() {
  const [account, setAccount] = useState('1001');
  const opening = 425_000;
  let running = opening;
  const rows = movements.map((m, i) => {
    if (i > 0) running = running + m.dr - m.cr;
    return { ...m, running };
  });
  const closing = running;
  const totalDr = movements.reduce((s, m) => s + m.dr, 0);
  const totalCr = movements.reduce((s, m) => s + m.cr, 0);

  return (
    <PageShell
      eyebrow="Reports · Cash"
      title="Cash Book"
      description="Day-by-day record of cash receipts and payments. One book per cash account; running balance per row."
      breadcrumb={[{ label: 'Reports', href: '/dashboard/finance/reports' }, { label: 'Cash Book' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> PDF</Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Opening balance" value={formatPKR(opening)} tone="info"    icon={Wallet}      hint="01 May" />
          <KpiCard label="Total receipts"   value={formatPKR(totalDr)} tone="success" icon={ArrowDown}   />
          <KpiCard label="Total payments"   value={formatPKR(totalCr)} tone="warning" icon={ArrowUp}     />
          <KpiCard label="Closing balance"  value={formatPKR(closing)} tone="accent"  icon={Banknote}    hint="31 May" />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={account} onValueChange={setAccount}>
            <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1001">1001 · Cash on Hand</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" defaultValue="2026-05-01" className="w-[150px]" />
          <Input type="date" defaultValue="2026-05-31" className="w-[150px]" />
        </div>
      </Card>

      <Card className="p-4 print:shadow-none">
        <div className="hidden print:block mb-3 pb-2 border-b-2 border-foreground">
          <div className="font-bold">BINORIA WELFARE TRUST</div>
          <div className="text-sm font-semibold">Cash Book — 1001 Cash on Hand · 1-31 May 2026 · PKR</div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead className="w-[200px]">Voucher #</TableHead>
                <TableHead>Particulars</TableHead>
                <TableHead className="text-right w-[140px]">
                  <span className="inline-flex items-center gap-1 justify-end">
                    Receipts <HelperInfo title="Cash receipts" body="Money coming INTO the cash drawer. Debit side of the cash account." />
                  </span>
                </TableHead>
                <TableHead className="text-right w-[140px]">
                  <span className="inline-flex items-center gap-1 justify-end">
                    Payments <HelperInfo title="Cash payments" body="Money going OUT of the cash drawer. Credit side of the cash account." />
                  </span>
                </TableHead>
                <TableHead className="text-right w-[140px]">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={i} className={cn(i === 0 && 'bg-muted/30 italic')}>
                  <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
                  <TableCell className="font-mono text-xs">{r.voucher}</TableCell>
                  <TableCell className="text-sm">{r.desc}</TableCell>
                  <TableCell className="text-right tabular-nums text-emerald-700 font-medium">{r.dr > 0 ? formatPKR(r.dr) : <span className="text-muted-foreground font-normal">—</span>}</TableCell>
                  <TableCell className="text-right tabular-nums text-rose-700 font-medium">{r.cr > 0 ? formatPKR(r.cr) : <span className="text-muted-foreground font-normal">—</span>}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{formatPKR(r.running)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-0 rounded-xl border-2 border-primary overflow-hidden divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="p-5 text-center bg-muted/30">
            <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Σ Receipts</div>
            <div className="text-2xl md:text-3xl font-bold tabular-nums mt-1 text-emerald-700">{formatPKR(totalDr)}</div>
          </div>
          <div className="p-5 text-center bg-muted/30">
            <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Σ Payments</div>
            <div className="text-2xl md:text-3xl font-bold tabular-nums mt-1 text-rose-700">{formatPKR(totalCr)}</div>
          </div>
          <div className="p-5 text-center bg-primary/10">
            <div className="text-[11px] uppercase tracking-wider font-bold text-primary">Closing balance</div>
            <div className="text-2xl md:text-3xl font-bold tabular-nums mt-1 text-primary">{formatPKR(closing)}</div>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}
