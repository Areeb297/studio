'use client';

import { useState } from 'react';
import { Download, Printer, PiggyBank, ArrowDown, ArrowUp, Wallet } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { HelperInfo } from '@/components/finance/helper-info';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/finance/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const movements = [
  { date: '01 May', voucher: '—',                desc: 'Opening balance',                 reference: '',           dr: 0,        cr: 0,       reconciled: true  },
  { date: '02 May', voucher: 'BPV-2026-05-0009', desc: 'Pay AL-MAJEED VEGETABLES',         reference: 'IBT-22019',  dr: 0,        cr: 25_750,  reconciled: true  },
  { date: '05 May', voucher: 'BRV-2026-05-0007', desc: 'Receipt — GREEN VALLEY CATERING',  reference: 'HBL ch#10488', dr: 35_000, cr: 0,      reconciled: true  },
  { date: '12 May', voucher: 'BRV-2026-05-0006', desc: 'Donation — K. MIRZA (Zakat)',      reference: 'HBL ch#10489', dr: 50_000, cr: 0,      reconciled: true  },
  { date: '15 May', voucher: 'BPV-2026-05-0014', desc: 'Bank charges — May',                reference: '',           dr: 0,        cr: 1_200,   reconciled: false },
  { date: '20 May', voucher: 'BRV-2026-05-0024', desc: 'Cash deposit',                      reference: 'DEP-2245',   dr: 50_000,   cr: 0,       reconciled: false },
  { date: '20 May', voucher: 'BPV-2026-05-0010', desc: 'Pay KARACHI MEAT TRADERS',          reference: 'HBL ch#10228', dr: 0,    cr: 80_000,  reconciled: true  },
  { date: '22 May', voucher: 'BPV-2026-05-0011', desc: 'K-Electric May bill',                reference: 'HBL ch#10231', dr: 0,    cr: 78_500,  reconciled: false },
];

export default function BankBookPage() {
  const [account, setAccount] = useState('1002');
  const opening = 2_780_000;
  let running = opening;
  const rows = movements.map((m, i) => {
    if (i > 0) running = running + m.dr - m.cr;
    return { ...m, running };
  });
  const closing = running;
  const totalDr = movements.reduce((s, m) => s + m.dr, 0);
  const totalCr = movements.reduce((s, m) => s + m.cr, 0);
  const unreconciled = movements.filter(m => !m.reconciled && (m.dr || m.cr)).length;

  return (
    <PageShell
      eyebrow="Reports · Bank"
      title="Bank Book"
      description="Day-by-day record of bank receipts and payments. Reconciled rows are shaded green. Click any voucher to drill."
      breadcrumb={[{ label: 'Reports', href: '/dashboard/finance/reports' }, { label: 'Bank Book' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> PDF</Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Opening balance" value={formatPKR(opening)} tone="info"    icon={Wallet}    hint="01 May" />
          <KpiCard label="Total receipts"   value={formatPKR(totalDr)} tone="success" icon={ArrowDown} />
          <KpiCard label="Total payments"   value={formatPKR(totalCr)} tone="warning" icon={ArrowUp}   />
          <KpiCard label="Unreconciled"     value={unreconciled}        tone={unreconciled === 0 ? 'success' : 'danger'} hint="Lines awaiting bank statement" />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={account} onValueChange={setAccount}>
            <SelectTrigger className="w-[280px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1002">1002 · Bank — HBL Current</SelectItem>
              <SelectItem value="1003">1003 · Bank — MCB Savings</SelectItem>
              <SelectItem value="1004">1004 · Bank — UBL USD</SelectItem>
              <SelectItem value="1005">1005 · Bank — Meezan Donations</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" defaultValue="2026-05-01" className="w-[150px]" />
          <Input type="date" defaultValue="2026-05-31" className="w-[150px]" />
        </div>
      </Card>

      <Card className="p-4 print:shadow-none">
        <div className="hidden print:block mb-3 pb-2 border-b-2 border-foreground">
          <div className="font-bold">BINORIA WELFARE TRUST</div>
          <div className="text-sm font-semibold">Bank Book — 1002 HBL Current · 1-31 May 2026 · PKR</div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[80px]">Date</TableHead>
                <TableHead className="w-[180px]">Voucher #</TableHead>
                <TableHead>Particulars</TableHead>
                <TableHead className="w-[140px]">Reference</TableHead>
                <TableHead className="text-right w-[120px]">Receipts</TableHead>
                <TableHead className="text-right w-[120px]">Payments</TableHead>
                <TableHead className="text-right w-[140px]">Balance</TableHead>
                <TableHead className="w-[110px]">Recon</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow key={i} className={cn(i === 0 && 'bg-muted/30 italic', r.reconciled && i !== 0 && 'bg-emerald-50/30 dark:bg-emerald-950/10')}>
                  <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
                  <TableCell className="font-mono text-xs">{r.voucher}</TableCell>
                  <TableCell className="text-sm">{r.desc}</TableCell>
                  <TableCell className="font-mono text-[10px] text-muted-foreground">{r.reference || '—'}</TableCell>
                  <TableCell className="text-right tabular-nums text-emerald-700 font-medium">{r.dr > 0 ? formatPKR(r.dr) : <span className="text-muted-foreground font-normal">—</span>}</TableCell>
                  <TableCell className="text-right tabular-nums text-rose-700 font-medium">{r.cr > 0 ? formatPKR(r.cr) : <span className="text-muted-foreground font-normal">—</span>}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{formatPKR(r.running)}</TableCell>
                  <TableCell>
                    {i === 0 ? <span className="text-xs text-muted-foreground">—</span>
                      : r.reconciled ? <StatusBadge status="RECONCILED" />
                      : <StatusBadge status="PENDING" />}
                  </TableCell>
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
