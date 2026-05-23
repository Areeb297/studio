'use client';

import { useState } from 'react';
import { Search, Download, Eye, FileText } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { AccountPicker } from '@/components/finance/account-picker';
import { CostCenterPicker } from '@/components/finance/cost-center-picker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { vouchers } from '@/lib/finance/voucher-data';
import { formatPKR } from '@/utils/accounting';
import { COST_CENTERS } from '@/lib/finance/seed';

const allLines = vouchers.filter(v => v.status === 'POSTED').flatMap(v =>
  v.lines.map(l => ({
    date: v.date,
    voucher: v.number,
    type: v.type,
    accountCode: l.accountCode,
    accountName: l.accountName,
    cc: l.costCenterId ? COST_CENTERS.find(c => c.id === l.costCenterId)?.code : '—',
    narration: l.narration ?? v.description,
    debit: l.debit,
    credit: l.credit,
  }))
);

export default function GLTransactionsPage() {
  const [q, setQ] = useState('');
  const filtered = allLines.filter(l => !q || l.voucher.includes(q) || l.accountCode.includes(q) || l.accountName.toLowerCase().includes(q.toLowerCase()) || l.narration.toLowerCase().includes(q.toLowerCase()));
  const totalDr = filtered.reduce((s, l) => s + l.debit, 0);
  const totalCr = filtered.reduce((s, l) => s + l.credit, 0);

  return (
    <PageShell
      eyebrow="General Ledger · Raw lines"
      title="GL Transactions"
      description="Line-level ledger view — one row per voucher line. The auditor's primary lookup screen."
      breadcrumb={[{ label: 'General Ledger' }, { label: 'GL Transactions' }]}
      actions={<Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV</Button>}
      kpis={
        <>
          <KpiCard label="Lines (period)"   value={allLines.length} tone="info"   icon={FileText} />
          <KpiCard label="Filtered"         value={filtered.length} tone="accent" icon={Search} />
          <KpiCard label="Σ Debits"          value={formatPKR(totalDr)} tone="success" />
          <KpiCard label="Σ Credits"         value={formatPKR(totalCr)} tone="warning" />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search voucher #, account, narration" className="pl-9" />
          </div>
          <AccountPicker value="" onChange={() => {}} placeholder="Account (any)" />
          <CostCenterPicker value="" onChange={() => {}} placeholder="Cost centre (any)" />
          <Input type="date" defaultValue="2026-05-01" />
          <Input type="date" defaultValue="2026-05-31" />
          <Select defaultValue="ALL"><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All types</SelectItem>
              {['JV','CPV','CRV','BPV','BRV','GLI','GLB'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="p-4">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead className="w-[160px]">Voucher</TableHead>
                <TableHead className="w-[60px]">Type</TableHead>
                <TableHead className="w-[110px]">Account</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[70px]">CC</TableHead>
                <TableHead className="text-right w-[120px]">Debit</TableHead>
                <TableHead className="text-right w-[120px]">Credit</TableHead>
                <TableHead className="w-[40px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l, i) => (
                <TableRow key={i} className="hover:bg-primary/5">
                  <TableCell className="text-xs text-muted-foreground">{l.date}</TableCell>
                  <TableCell className="font-mono text-xs">{l.voucher}</TableCell>
                  <TableCell><span className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded">{l.type}</span></TableCell>
                  <TableCell className="font-mono text-xs">{l.accountCode}</TableCell>
                  <TableCell>
                    <div className="text-sm">{l.accountName}</div>
                    <div className="text-[10px] text-muted-foreground">{l.narration}</div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{l.cc}</TableCell>
                  <TableCell className="text-right tabular-nums">{l.debit > 0 ? formatPKR(l.debit) : '—'}</TableCell>
                  <TableCell className="text-right tabular-nums">{l.credit > 0 ? formatPKR(l.credit) : '—'}</TableCell>
                  <TableCell><Eye className="h-3 w-3 text-muted-foreground" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-primary/10">
              <TableRow><TableCell colSpan={6} className="text-right font-bold uppercase text-xs">Totals</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(totalDr)}</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(totalCr)}</TableCell><TableCell /></TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
