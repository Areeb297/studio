'use client';

import { useState } from 'react';
import { Lock, RefreshCcw, ArrowDown, ArrowUp, Search, CheckCircle2 } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { StatusBadge } from '@/components/finance/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const rows = [
  { id: 1, date: '2026-05-02', voucher: 'CRV-2026-05-0001', type: 'CRV', account: '1002 HBL',  dr: 12_500, cr: 0,       posted: true,  reconciled: true  },
  { id: 2, date: '2026-05-04', voucher: 'BPV-2026-05-0009', type: 'BPV', account: '1003 MCB',  dr: 0,      cr: 25_750,  posted: true,  reconciled: true  },
  { id: 3, date: '2026-05-05', voucher: 'BRV-2026-05-0007', type: 'BRV', account: '1002 HBL',  dr: 35_000, cr: 0,       posted: true,  reconciled: true  },
  { id: 4, date: '2026-05-08', voucher: 'CRV-2026-05-0002', type: 'CRV', account: '1001 Cash', dr: 64_000, cr: 0,       posted: true,  reconciled: false },
  { id: 5, date: '2026-05-12', voucher: 'BRV-2026-05-0006', type: 'BRV', account: '1002 HBL',  dr: 50_000, cr: 0,       posted: true,  reconciled: true  },
  { id: 6, date: '2026-05-18', voucher: 'JV-2026-05-0232',  type: 'JV',  account: '4100 Zakat', dr: 25_000, cr: 0,      posted: false, reconciled: false },
  { id: 7, date: '2026-05-20', voucher: 'BPV-2026-05-0010', type: 'BPV', account: '1002 HBL',  dr: 0,      cr: 80_000,  posted: true,  reconciled: true  },
  { id: 8, date: '2026-05-22', voucher: 'BPV-2026-05-0011', type: 'BPV', account: '1002 HBL',  dr: 0,      cr: 78_500,  posted: false, reconciled: false },
];

const typeChip: Record<string, string> = {
  JV:  'bg-slate-100 text-slate-700',
  CPV: 'bg-amber-100 text-amber-700',
  CRV: 'bg-emerald-100 text-emerald-700',
  BPV: 'bg-rose-100 text-rose-700',
  BRV: 'bg-teal-100 text-teal-700',
};

export default function ReconBrowserPage() {
  const [picked, setPicked] = useState<Set<number>>(new Set());

  const totalReceipts = rows.reduce((s, r) => s + r.dr, 0);
  const totalPayments = rows.reduce((s, r) => s + r.cr, 0);
  const net = totalReceipts - totalPayments;

  const toggle = (id: number) => setPicked(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });
  const selectAll = () => setPicked(new Set(rows.map(r => r.id)));
  const clear = () => setPicked(new Set());
  const postSel = () => alert(`Mock: post ${picked.size} vouchers (re-arms reconciled flag)`);
  const unpostSel = () => alert(`Mock: un-post ${picked.size} vouchers`);

  return (
    <PageShell
      eyebrow="Cash & Bank · Climax-style browser"
      title="Bank Reconciliation Browser"
      description="Power-user view — multi-filter, bulk Post/UnPost, Climax-exact column set with Receipt/Payment/Net split summary."
      breadcrumb={[{ label: 'Cash & Bank' }, { label: 'Bank Reconciliation', href: '/dashboard/finance/bank-reconciliation' }, { label: 'Browser' }]}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={selectAll}>Select all</Button>
          <Button variant="outline" size="sm" onClick={clear}>Clear</Button>
          <Button size="sm" onClick={postSel} disabled={picked.size === 0}><Lock className="mr-1.5 h-3.5 w-3.5" /> Post all ({picked.size})</Button>
          <Button size="sm" variant="outline" onClick={unpostSel} disabled={picked.size === 0}><RefreshCcw className="mr-1.5 h-3.5 w-3.5" /> UnPost all</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Receipts" value={formatPKR(totalReceipts)} tone="success" icon={ArrowDown} />
          <KpiCard label="Payments" value={formatPKR(totalPayments)} tone="warning" icon={ArrowUp} />
          <KpiCard label="Net"      value={formatPKR(net)} tone={net >= 0 ? 'accent' : 'danger'} hint={net >= 0 ? 'Inflow' : 'Outflow'} />
          <KpiCard label="Selected" value={picked.size} tone="info" icon={CheckCircle2} />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <SectionHeader eyebrow="Filters · Climax-exact" title="Refine browser scope" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <Select defaultValue="VOUCHER"><SelectTrigger className="text-xs"><SelectValue placeholder="Date mode" /></SelectTrigger>
            <SelectContent><SelectItem value="VOUCHER">Voucher date</SelectItem><SelectItem value="POSTED">Posted date</SelectItem></SelectContent>
          </Select>
          <Select defaultValue="POSTED"><SelectTrigger className="text-xs"><SelectValue placeholder="Posting" /></SelectTrigger>
            <SelectContent><SelectItem value="POSTED">Posted</SelectItem><SelectItem value="UNPOSTED">Un-posted</SelectItem><SelectItem value="ALL">All</SelectItem></SelectContent>
          </Select>
          <Select defaultValue="ALL"><SelectTrigger className="text-xs"><SelectValue placeholder="Post-to-bank" /></SelectTrigger>
            <SelectContent><SelectItem value="ALL">Any bank</SelectItem><SelectItem value="HBL">1002 HBL</SelectItem><SelectItem value="MCB">1003 MCB</SelectItem></SelectContent>
          </Select>
          <Select defaultValue="ALL"><SelectTrigger className="text-xs"><SelectValue placeholder="Voucher types" /></SelectTrigger>
            <SelectContent><SelectItem value="ALL">All types</SelectItem><SelectItem value="JV">JV</SelectItem><SelectItem value="CPV">CPV</SelectItem><SelectItem value="CRV">CRV</SelectItem><SelectItem value="BPV">BPV</SelectItem><SelectItem value="BRV">BRV</SelectItem></SelectContent>
          </Select>
          <Input type="date" defaultValue="2026-05-01" className="h-9 text-xs" />
          <Input type="date" defaultValue="2026-05-31" className="h-9 text-xs" />
        </div>
        <div className="mt-3 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search voucher # or account" className="pl-9" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[40px]" />
                <TableHead className="w-[180px]">Voucher #</TableHead>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead className="w-[60px]">Type</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right w-[120px]">Debit</TableHead>
                <TableHead className="text-right w-[120px]">Credit</TableHead>
                <TableHead className="w-[120px]">Posted-to-bank</TableHead>
                <TableHead className="w-[120px]">Recon status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r.id} className={cn(picked.has(r.id) && 'bg-primary/10', 'hover:bg-primary/5')}>
                  <TableCell><Checkbox checked={picked.has(r.id)} onCheckedChange={() => toggle(r.id)} /></TableCell>
                  <TableCell className="font-mono text-xs">{r.voucher}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
                  <TableCell>
                    <span className={cn('inline-flex rounded px-1.5 py-0.5 text-[10px] font-bold', typeChip[r.type])}>{r.type}</span>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{r.account}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.dr > 0 ? formatPKR(r.dr) : '—'}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.cr > 0 ? formatPKR(r.cr) : '—'}</TableCell>
                  <TableCell><StatusBadge status={r.posted ? 'POSTED' : 'PENDING'} /></TableCell>
                  <TableCell><StatusBadge status={r.reconciled ? 'RECONCILED' : 'PENDING'} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-muted/60">
              <TableRow><TableCell colSpan={5} className="text-right text-xs uppercase tracking-wide font-bold">Σ Receipts · Σ Payments · Net</TableCell>
                <TableCell className="text-right tabular-nums font-bold text-emerald-700">{formatPKR(totalReceipts)}</TableCell>
                <TableCell className="text-right tabular-nums font-bold text-rose-700">{formatPKR(totalPayments)}</TableCell>
                <TableCell colSpan={2} className="text-right tabular-nums font-bold">{formatPKR(net)}</TableCell></TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
