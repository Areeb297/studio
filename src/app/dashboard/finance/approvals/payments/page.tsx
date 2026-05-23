'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Truck, ArrowRight } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const payments = [
  { id: 1, ref: 'SP-2026-05-0058', supplier: 'KARACHI MEAT TRADERS',  bills: 2, mode: 'CHEQUE',  amount:  80_000, date: '2026-05-23', submittedBy: 'A. Shafqat' },
  { id: 2, ref: 'SP-2026-05-0059', supplier: 'AL-MAJEED VEGETABLES',   bills: 3, mode: 'CHEQUE',  amount:  44_950, date: '2026-05-23', submittedBy: 'A. Shafqat' },
  { id: 3, ref: 'SP-2026-05-0060', supplier: 'TEHFEEZ STATIONERS',     bills: 1, mode: 'TRANSFER', amount:  17_000, date: '2026-05-23', submittedBy: 'A. Shafqat' },
  { id: 4, ref: 'CR-2026-05-0103', supplier: 'GREEN VALLEY (refund)',  bills: 1, mode: 'TRANSFER', amount:   8_500, date: '2026-05-22', submittedBy: 'AR Clerk' },
];

export default function PaymentApprovalsPage() {
  const [picked, setPicked] = useState<Set<number>>(new Set([1, 2]));
  const total = payments.filter(p => picked.has(p.id)).reduce((s, p) => s + p.amount, 0);

  const toggle = (id: number) => setPicked(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });
  const all = () => setPicked(new Set(payments.map(p => p.id)));
  const none = () => setPicked(new Set());

  return (
    <PageShell
      eyebrow="Approvals · Queue"
      title="Payment Approvals"
      description="Bulk-approve supplier payments and customer refunds. Tick rows to include, then approve / reject in one shot."
      breadcrumb={[{ label: 'Approvals' }, { label: 'Payments' }]}
      kpis={
        <>
          <KpiCard label="Pending" value={payments.length} tone="warning" icon={Clock} />
          <KpiCard label="Selected" value={picked.size} tone="accent" icon={CheckCircle2} />
          <KpiCard label="Total to release" value={formatPKR(total)} tone="success" />
          <KpiCard label="Suppliers" value={new Set(payments.filter(p => picked.has(p.id)).map(p => p.supplier)).size} tone="info" icon={Truck} />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={all}>Select all</Button>
          <Button variant="outline" size="sm" onClick={none}>Clear</Button>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" className="text-rose-700"><XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject selected</Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" disabled={picked.size === 0}><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Approve {picked.size > 0 ? `(${picked.size})` : ''}</Button>
          </div>
        </div>
      </Card>

      <Card className="p-4 mb-4">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[40px]" />
                <TableHead className="w-[170px]">Reference</TableHead>
                <TableHead>Supplier / Party</TableHead>
                <TableHead className="text-center w-[80px]">Bills</TableHead>
                <TableHead className="w-[110px]">Mode</TableHead>
                <TableHead className="w-[110px]">Submitted</TableHead>
                <TableHead className="w-[130px]">By</TableHead>
                <TableHead className="text-right w-[140px]">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map(p => (
                <TableRow key={p.id} className={cn(picked.has(p.id) && 'bg-primary/10', 'hover:bg-primary/5')}>
                  <TableCell><Checkbox checked={picked.has(p.id)} onCheckedChange={() => toggle(p.id)} /></TableCell>
                  <TableCell className="font-mono text-xs">{p.ref}</TableCell>
                  <TableCell className="font-medium">{p.supplier}</TableCell>
                  <TableCell className="text-center text-xs font-semibold">{p.bills}</TableCell>
                  <TableCell className="text-xs">{p.mode.toLowerCase()}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.date}</TableCell>
                  <TableCell className="text-xs">{p.submittedBy}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{formatPKR(p.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-primary/10">
              <TableRow><TableCell colSpan={7} className="text-right font-bold uppercase text-xs text-primary">Selected total</TableCell>
                <TableCell className="text-right tabular-nums font-bold text-lg text-primary">{formatPKR(total)}</TableCell></TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>

      <Card className="p-5">
        <SectionHeader eyebrow="Bulk action" title="Remarks (applied to all selected)" />
        <Textarea rows={3} placeholder="Optional — e.g. 'OK to release — verified bank balance'" />
      </Card>
    </PageShell>
  );
}
