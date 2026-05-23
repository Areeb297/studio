'use client';

import { Plus, FileText, ArrowDown, ArrowUp, CheckCircle2 } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { StatusBadge } from '@/components/finance/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const cheques = [
  { id: 1, dir: 'IN',  date: '2026-05-01', chq: '10231', bank: 'HBL',     party: 'GREEN VALLEY CATERING',     amount:  50_000, status: 'DEPOSITED',   linked: 'BRV-…-0007' },
  { id: 2, dir: 'IN',  date: '2026-05-03', chq: '10288', bank: 'MCB',     party: 'NOOR HOSTEL',                amount:  12_500, status: 'PENDING',     linked: null },
  { id: 3, dir: 'OUT', date: '2026-05-02', chq: '81012', bank: 'HBL',     party: 'KARACHI ELECTRIC',           amount:  85_000, status: 'TRANSFERRED', linked: 'BPV-…-0009' },
  { id: 4, dir: 'IN',  date: '2026-05-08', chq: '20019', bank: 'MCB',     party: 'K. MIRZA — donation',        amount:  50_000, status: 'PENDING',     linked: null },
  { id: 5, dir: 'OUT', date: '2026-05-15', chq: '10228', bank: 'HBL',     party: 'KARACHI MEAT TRADERS',       amount:  80_000, status: 'TRANSFERRED', linked: 'BPV-…-0010' },
  { id: 6, dir: 'IN',  date: '2026-05-18', chq: '33001', bank: 'Meezan',  party: 'CITY PHARMA EVENTS',         amount:  72_300, status: 'PENDING',     linked: null },
  { id: 7, dir: 'OUT', date: '2026-05-20', chq: '10031', bank: 'HBL',     party: 'K-ELECTRIC May bill',        amount:  78_500, status: 'TRANSFERRED', linked: 'BPV-…-0011' },
];

const statusColor: Record<string, string> = {
  PENDING:     'PENDING',
  DEPOSITED:   'APPROVED',
  TRANSFERRED: 'APPROVED',
};

export default function ChequeOpeningPage() {
  const pending = cheques.filter(c => c.status === 'PENDING').length;
  const incoming = cheques.filter(c => c.dir === 'IN').length;
  const outgoing = cheques.filter(c => c.dir === 'OUT').length;

  return (
    <PageShell
      eyebrow="Cash & Bank · Pre-posting"
      title="Cheque Opening"
      description="Cheques physically issued or received but not yet posted as a voucher. Acts as the bridge between physical cheque movement and the GL."
      breadcrumb={[{ label: 'Cash & Bank' }, { label: 'Cheque Opening' }]}
      actions={<Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> Record cheque</Button>}
      kpis={
        <>
          <KpiCard label="Total entries" value={cheques.length} tone="info"    icon={FileText} />
          <KpiCard label="Incoming"       value={incoming}        tone="success" icon={ArrowDown} />
          <KpiCard label="Outgoing"       value={outgoing}        tone="warning" icon={ArrowUp} />
          <KpiCard label="Pending"        value={pending}         tone="danger"  icon={CheckCircle2} hint="Awaiting voucher" />
        </>
      }
    >
      <Card className="p-4">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[80px]">Direction</TableHead>
                <TableHead className="w-[110px]">Date</TableHead>
                <TableHead className="w-[100px] font-mono">Cheque #</TableHead>
                <TableHead className="w-[100px]">Bank</TableHead>
                <TableHead>Party</TableHead>
                <TableHead className="text-right w-[140px]">Amount</TableHead>
                <TableHead className="w-[130px]">Status</TableHead>
                <TableHead className="w-[160px]">Linked voucher</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cheques.map(c => (
                <TableRow key={c.id} className="hover:bg-primary/5">
                  <TableCell>
                    <span className={cn(
                      'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold',
                      c.dir === 'IN'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
                    )}>
                      {c.dir === 'IN' ? <ArrowDown className="h-2.5 w-2.5" /> : <ArrowUp className="h-2.5 w-2.5" />}
                      {c.dir}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.date}</TableCell>
                  <TableCell className="font-mono text-xs font-bold">{c.chq}</TableCell>
                  <TableCell className="text-xs"><span className="bg-muted px-1.5 py-0.5 rounded">{c.bank}</span></TableCell>
                  <TableCell className="font-medium">{c.party}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{formatPKR(c.amount)}</TableCell>
                  <TableCell><StatusBadge status={c.status as any} /></TableCell>
                  <TableCell className="font-mono text-[10px] text-muted-foreground">{c.linked ?? <Button variant="ghost" size="sm" className="h-7 text-xs">Link →</Button>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
