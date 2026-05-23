'use client';

import { Download, Printer, Mail, HandCoins, Users, Receipt, Banknote } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { donations } from '@/lib/finance/donations-data';
import { DONATION_FUNDS } from '@/lib/finance/seed';
import { formatPKR } from '@/utils/accounting';

export default function DonationCollectorPage() {
  const todayItems = donations.filter(d => d.date === '2026-05-23' || d.date === '2026-05-22' || d.date === '2026-05-20');

  const byFundByMode: Record<string, Record<string, number>> = {};
  for (const f of DONATION_FUNDS) byFundByMode[f.id] = { CASH: 0, CHEQUE: 0, BANK_TRANSFER: 0, PAY_ORDER: 0 };
  for (const d of todayItems) {
    if (byFundByMode[d.fundCode]) byFundByMode[d.fundCode][d.mode] = (byFundByMode[d.fundCode][d.mode] || 0) + d.amount;
  }
  const fundTotals = DONATION_FUNDS.map(f => {
    const modes = byFundByMode[f.id];
    return {
      id: f.id,
      name: f.name,
      CASH:          modes.CASH || 0,
      CHEQUE:        modes.CHEQUE || 0,
      BANK_TRANSFER: modes.BANK_TRANSFER || 0,
      PAY_ORDER:     modes.PAY_ORDER || 0,
      total:         (modes.CASH || 0) + (modes.CHEQUE || 0) + (modes.BANK_TRANSFER || 0) + (modes.PAY_ORDER || 0),
    };
  });

  const grand = fundTotals.reduce((a, f) => ({
    cash:  a.cash  + f.CASH,
    chq:   a.chq   + f.CHEQUE,
    txn:   a.txn   + f.BANK_TRANSFER,
    po:    a.po    + f.PAY_ORDER,
    total: a.total + f.total,
  }), { cash: 0, chq: 0, txn: 0, po: 0, total: 0 });

  return (
    <PageShell
      eyebrow="Reports · Donations"
      title="Donation Collector Detail"
      description="Per-collector daily breakdown by fund × mode. Used at end-of-day to prepare the deposit run."
      breadcrumb={[{ label: 'Reports', href: '/dashboard/finance/reports' }, { label: 'Collector Detail' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Excel</Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
          <Button size="sm"><Mail className="mr-1.5 h-3.5 w-3.5" /> Email manager</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Collector" value="S. Ahmad" tone="info" icon={Users} hint="Today's shift" />
          <KpiCard label="Collections" value={todayItems.length} tone="success" icon={Receipt} />
          <KpiCard label="Cash in hand" value={formatPKR(grand.cash)} tone="warning" icon={Banknote} hint="For deposit" />
          <KpiCard label="Total collected" value={formatPKR(grand.total)} tone="accent" icon={HandCoins} />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue="sa"><SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="sa">S. Ahmad (today)</SelectItem><SelectItem value="mo">M. Owais</SelectItem></SelectContent>
          </Select>
          <Input type="date" defaultValue="2026-05-23" className="w-[150px]" />
        </div>
      </Card>

      <Card className="p-4 print:shadow-none">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>Fund</TableHead>
                <TableHead className="text-right">Cash</TableHead>
                <TableHead className="text-right">Cheque</TableHead>
                <TableHead className="text-right">Transfer</TableHead>
                <TableHead className="text-right">Pay Order</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fundTotals.map(f => (
                <TableRow key={f.id} className="hover:bg-primary/5">
                  <TableCell className="font-semibold">{f.name}</TableCell>
                  <TableCell className="text-right tabular-nums">{f.CASH ? formatPKR(f.CASH) : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-right tabular-nums">{f.CHEQUE ? formatPKR(f.CHEQUE) : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-right tabular-nums">{f.BANK_TRANSFER ? formatPKR(f.BANK_TRANSFER) : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-right tabular-nums">{f.PAY_ORDER ? formatPKR(f.PAY_ORDER) : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-right tabular-nums font-bold">{formatPKR(f.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-primary/10">
              <TableRow><TableCell className="font-bold uppercase text-xs tracking-wide text-primary">Grand total</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(grand.cash)}</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(grand.chq)}</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(grand.txn)}</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(grand.po)}</TableCell>
                <TableCell className="text-right tabular-nums font-bold text-lg text-primary">{formatPKR(grand.total)}</TableCell></TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
