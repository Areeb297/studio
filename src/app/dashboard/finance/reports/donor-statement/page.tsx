'use client';

import { useState } from 'react';
import { Mail, Printer, Download, Heart, Receipt, Calendar, Users } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { donors, donations } from '@/lib/finance/donations-data';
import { DONATION_FUNDS } from '@/lib/finance/seed';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

export default function DonorStatementPage() {
  const [donorId, setDonorId] = useState('d02');
  const donor = donors.find(d => d.id === donorId)!;
  const items = donations.filter(d => d.donorId === donorId);
  const total = items.filter(i => i.status === 'POSTED').reduce((s, i) => s + i.amount, 0);

  const fundTone: Record<string, string> = {
    ZAKAT:     'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
    SADQAH:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    MOSQUE:    'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    MADRASSAH: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    GENERAL:   'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  };

  return (
    <PageShell
      eyebrow="Reports · Donations"
      title="Donor Statement"
      description="Per-donor annual statement — PDF-ready, mailed automatically as a year-end acknowledgement."
      breadcrumb={[{ label: 'Reports', href: '/dashboard/finance/reports' }, { label: 'Donor Statement' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Download PDF</Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
          <Button size="sm"><Mail className="mr-1.5 h-3.5 w-3.5" /> Email donor</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Donor" value={donor.name.split(' ').slice(0,2).join(' ')} tone="info"  icon={Users} hint={donor.cnic} />
          <KpiCard label="Donations" value={items.length} tone="accent" icon={Receipt} />
          <KpiCard label="Total this year" value={formatPKR(total)} tone="success" icon={Heart} />
          <KpiCard label="Last gift" value={donor.lastDonationDate} tone="warning" icon={Calendar} />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <Select value={donorId} onValueChange={setDonorId}>
          <SelectTrigger className="w-[300px]"><SelectValue /></SelectTrigger>
          <SelectContent>{donors.map(d => <SelectItem key={d.id} value={d.id}>{d.code} · {d.name}</SelectItem>)}</SelectContent>
        </Select>
      </Card>

      <Card className="p-8 max-w-3xl mx-auto print:shadow-none">
        <div className="text-center pb-5 mb-6 border-b-2 border-foreground">
          <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">In the name of Allah</div>
          <div className="text-lg font-bold mt-2">BINORIA WELFARE TRUST</div>
          <div className="text-xs text-muted-foreground">Korangi, Karachi · NTN 1234567-8</div>
          <div className="text-2xl font-bold tracking-tight mt-4">Annual Donation Acknowledgement</div>
          <div className="text-xs text-muted-foreground mt-1">FY 2025-26 · Issued 01 Jul 2026</div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">To</div>
            <div className="font-bold text-sm">{donor.name}</div>
            <div className="text-xs text-muted-foreground font-mono">{donor.code} · {donor.cnic}</div>
            <div className="text-xs text-muted-foreground">{donor.phone}</div>
            <div className="text-xs text-muted-foreground mt-1">{donor.address}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Period</div>
            <div className="font-bold text-sm">1 Jul 2025 – 30 Jun 2026</div>
            {donor.zakatEligible && <div className="text-xs font-bold text-violet-700 mt-1">Zakat-eligible donor</div>}
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden mb-5">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead className="w-[180px]">Receipt #</TableHead>
                <TableHead className="w-[140px]">Fund</TableHead>
                <TableHead className="w-[140px]">Mode</TableHead>
                <TableHead className="text-right w-[140px]">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.filter(i => i.status === 'POSTED').map(i => (
                <TableRow key={i.id}>
                  <TableCell className="text-xs">{i.date}</TableCell>
                  <TableCell className="font-mono text-xs">{i.number}</TableCell>
                  <TableCell><span className={cn('inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold', fundTone[i.fundCode])}>{DONATION_FUNDS.find(f => f.id === i.fundCode)?.name}</span></TableCell>
                  <TableCell className="text-xs">{i.mode.replace('_',' ').toLowerCase()}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{formatPKR(i.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-primary/10">
              <TableRow><TableCell colSpan={4} className="font-bold uppercase text-xs tracking-wide text-primary">Total contributions</TableCell>
                <TableCell className="text-right tabular-nums font-bold text-lg text-primary">{formatPKR(total)}</TableCell></TableRow>
            </TableFooter>
          </Table>
        </div>

        <div className="rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 p-4 text-center">
          <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 mb-2">Your generosity has supported:</div>
          <ul className="text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
            <li>· 12 hifz students at Madrassa Tehfeezul Quran</li>
            <li>· 8 hostel meals / day in Local Student Department</li>
            <li>· Phase 1 of Mosque construction (approx 18% completed)</li>
          </ul>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground italic">
          May Allah accept your contributions and reward you abundantly. Jazak Allahu Khair.
        </div>
      </Card>
    </PageShell>
  );
}
