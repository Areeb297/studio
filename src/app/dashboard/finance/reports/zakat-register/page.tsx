'use client';

import { Download, Printer, Heart, BookOpen, ArrowDown, Wallet } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { donations } from '@/lib/finance/donations-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

// Extend mock with disbursement state
const register = donations
  .filter(d => d.fundCode === 'ZAKAT' && d.status === 'POSTED')
  .map((d, i) => ({
    ...d,
    depositBank: d.mode === 'CASH' ? '1001 Cash' : '1002 HBL Current',
    disbursed: i % 3 === 0 ? 'Fully — to Madrassa' : i % 3 === 1 ? `Partial · ${formatPKR(d.amount * 0.6)}` : 'Pending',
    disbursedAmount: i % 3 === 0 ? d.amount : i % 3 === 1 ? d.amount * 0.6 : 0,
  }));

export default function ZakatRegisterPage() {
  const collected = register.reduce((s, r) => s + r.amount, 0);
  const disbursed = register.reduce((s, r) => s + r.disbursedAmount, 0);
  const inBank    = collected - disbursed;

  return (
    <PageShell
      eyebrow="Donations · Shariah audit"
      title="Zakat Collection Register"
      description="Every Zakat-flagged donation in the period with deposit account, mode, and disbursement status. Shariah-audit ready format."
      breadcrumb={[
        { label: 'Reports' },
        { label: 'Zakat Register' },
      ]}
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> PDF</Button>
          <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Period" value="FY 2025-26" tone="info" icon={BookOpen} hint="1 Jul – 30 Jun" />
          <KpiCard label="Collected" value={formatPKR(collected)} tone="success" icon={Heart} />
          <KpiCard label="Disbursed" value={formatPKR(disbursed)} tone="accent"  icon={ArrowDown} />
          <KpiCard label="In bank"    value={formatPKR(inBank)}    tone="warning" icon={Wallet} />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue="FY25-26">
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="FY24-25">FY 2024-25</SelectItem>
              <SelectItem value="FY25-26">FY 2025-26 (current)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="p-4">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-violet-50/60 dark:bg-violet-950/30">
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead className="w-[180px]">Receipt #</TableHead>
                <TableHead className="text-right w-[120px]">Amount</TableHead>
                <TableHead className="w-[120px]">Mode</TableHead>
                <TableHead className="w-[160px]">Deposit account</TableHead>
                <TableHead className="w-[200px]">Disbursement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {register.map(r => (
                <TableRow key={r.id} className="hover:bg-violet-50/30 dark:hover:bg-violet-950/20">
                  <TableCell className="text-xs">{r.date}</TableCell>
                  <TableCell className="font-semibold text-sm">{r.donorName}</TableCell>
                  <TableCell className="font-mono text-xs">{r.number}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{formatPKR(r.amount)}</TableCell>
                  <TableCell className="text-xs">{r.mode.replace('_',' ').toLowerCase()}</TableCell>
                  <TableCell className="text-xs font-mono">{r.depositBank}</TableCell>
                  <TableCell className={cn(
                    'text-xs',
                    r.disbursed === 'Pending'
                      ? 'text-amber-700 font-semibold'
                      : r.disbursed.startsWith('Partial')
                        ? 'text-blue-700 font-semibold'
                        : 'text-emerald-700 font-semibold',
                  )}>
                    {r.disbursed}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-violet-100/60 dark:bg-violet-900/40">
              <TableRow>
                <TableCell colSpan={3} className="text-right font-bold uppercase text-xs">Totals</TableCell>
                <TableCell className="text-right tabular-nums font-bold text-base">{formatPKR(collected)}</TableCell>
                <TableCell colSpan={2} />
                <TableCell className="text-right tabular-nums font-bold">
                  Disbursed {formatPKR(disbursed)} · In bank {formatPKR(inBank)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="p-4 bg-violet-50/40 dark:bg-violet-950/20 border-violet-200 dark:border-violet-900">
            <div className="text-[10px] uppercase tracking-wider font-bold text-violet-700">Shariah note</div>
            <p className="text-xs text-violet-900 dark:text-violet-200 mt-1">
              Zakat collected can only be disbursed to eligible recipients (asnaf) per Shariah law.
            </p>
          </Card>
          <Card className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
            <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-700">Audit ready</div>
            <p className="text-xs text-emerald-900 dark:text-emerald-200 mt-1">
              Every line links to its donation collection receipt, donor profile, and depositing voucher.
            </p>
          </Card>
          <Card className="p-4 bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <div className="text-[10px] uppercase tracking-wider font-bold text-blue-700">Bounced cheques</div>
            <p className="text-xs text-blue-900 dark:text-blue-200 mt-1">
              Auto-reversed during bank reconciliation; bounced rows excluded from this register.
            </p>
          </Card>
        </div>
      </Card>
    </PageShell>
  );
}
