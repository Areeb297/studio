'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Download, FileText, Eye, Banknote, Landmark,
  ArrowDownRight, ArrowUpRight, CheckCircle2, Clock, AlertCircle, Undo2,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { StatusBadge } from '@/components/finance/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { vouchers, voucherStats, type Voucher, type VoucherType } from '@/lib/finance/voucher-data';
import { COST_CENTERS } from '@/lib/finance/seed';
import { formatPKR } from '@/utils/accounting';

const typeIcon: Record<VoucherType, any> = {
  JV: FileText, CPV: Banknote, CRV: ArrowDownRight, BPV: ArrowUpRight, BRV: Landmark, GLI: FileText, GLB: FileText, SR: ArrowDownRight, SP: ArrowUpRight,
};

const typeChip: Record<VoucherType, string> = {
  JV:  'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300',
  CPV: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  CRV: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  BPV: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  BRV: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
  GLI: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  GLB: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  SR:  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  SP:  'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
};

export default function VoucherListPage() {
  const [q, setQ] = useState('');
  const [type, setType] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [open, setOpen] = useState<Voucher | null>(null);

  const rows = useMemo(() => vouchers.filter(v => {
    if (q && !(v.number.toLowerCase().includes(q.toLowerCase()) || v.description.toLowerCase().includes(q.toLowerCase()) || (v.partyName ?? '').toLowerCase().includes(q.toLowerCase()))) return false;
    if (type !== 'ALL' && v.type !== type) return false;
    if (status !== 'ALL' && v.status !== status) return false;
    return true;
  }), [q, type, status]);

  return (
    <PageShell
      eyebrow="General Ledger"
      title="Voucher List"
      description="Every voucher in the ledger across all types. Click a row to inspect the full posting and audit trail."
      breadcrumb={[{ label: 'General Ledger' }, { label: 'Voucher List' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/finance/vouchers"><Plus className="mr-1.5 h-3.5 w-3.5" /> New voucher</Link>
          </Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Total vouchers"     value={voucherStats.total}    tone="info"    icon={FileText} />
          <KpiCard label="Posted"             value={voucherStats.posted}   tone="success" icon={CheckCircle2} />
          <KpiCard label="Pending approval"   value={voucherStats.pending}  tone="warning" icon={Clock} />
          <KpiCard label="Drafts / Reversed"  value={voucherStats.draft + voucherStats.reversed} tone="danger" icon={AlertCircle} />
        </>
      }
    >
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search #, description, party…" value={q} onChange={e => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All types</SelectItem>
              {['JV','CPV','CRV','BPV','BRV','GLI','GLB'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="POSTED">Posted</SelectItem>
              <SelectItem value="PENDING_APPROVAL">Pending</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="REVERSED">Reversed</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground ml-auto">{rows.length} of {vouchers.length}</div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[170px]">Voucher #</TableHead>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead className="w-[80px]">Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[180px]">Party</TableHead>
                <TableHead className="text-right w-[140px]">Amount</TableHead>
                <TableHead className="w-[140px]">Status</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(v => {
                const Icon = typeIcon[v.type];
                return (
                  <TableRow key={v.id} className="hover:bg-primary/5 cursor-pointer" onClick={() => setOpen(v)}>
                    <TableCell className="font-mono text-xs">{v.number}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(v.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${typeChip[v.type]}`}>
                        <Icon className="h-2.5 w-2.5" /> {v.type}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{v.description}</TableCell>
                    <TableCell className="text-xs text-muted-foreground truncate">{v.partyName ?? '—'}</TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">{formatPKR(v.amount)}</TableCell>
                    <TableCell><StatusBadge status={v.status} /></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3 w-3" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {open && (
            <>
              <SheetHeader>
                <div className="flex items-start gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${typeChip[open.type]}`}>
                    {(() => { const I = typeIcon[open.type]; return <I className="h-5 w-5" />; })()}
                  </span>
                  <div className="flex-1">
                    <SheetTitle className="font-mono text-base">{open.number}</SheetTitle>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {open.date} · {open.partyName ?? 'No party'} · by {open.createdBy}
                    </div>
                  </div>
                  <StatusBadge status={open.status} />
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Description</div>
                  <p className="text-sm">{open.description}</p>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-2">Lines</div>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/40">
                        <TableRow>
                          <TableHead className="w-[100px]">Account</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-[110px]">CC</TableHead>
                          <TableHead className="text-right w-[110px]">Debit</TableHead>
                          <TableHead className="text-right w-[110px]">Credit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {open.lines.map((l, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-mono text-xs">{l.accountCode}</TableCell>
                            <TableCell>
                              <div className="text-sm">{l.accountName}</div>
                              {l.narration && <div className="text-xs text-muted-foreground">{l.narration}</div>}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {l.costCenterId ? COST_CENTERS.find(c => c.id === l.costCenterId)?.code : '—'}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">{l.debit > 0 ? formatPKR(l.debit) : '—'}</TableCell>
                            <TableCell className="text-right tabular-nums">{l.credit > 0 ? formatPKR(l.credit) : '—'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-2 flex items-center justify-end gap-3 text-sm">
                    <span className="text-muted-foreground">Σ Dr</span>
                    <span className="font-bold tabular-nums">{formatPKR(open.amount)}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-2">Audit trail</div>
                  <ul className="space-y-2 text-xs">
                    <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Created {open.date} 10:14 — {open.createdBy}</li>
                    {open.approvedBy && <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Approved 10:32 — {open.approvedBy}</li>}
                    {open.status === 'POSTED' && <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Posted to GL · 10:32</li>}
                    {open.status === 'REVERSED' && <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Reversed by M. Owais · same day</li>}
                  </ul>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Print pack</Button>
                  {open.status === 'POSTED' && (
                    <Button variant="outline" size="sm" className="text-rose-700 hover:text-rose-800">
                      <Undo2 className="mr-1.5 h-3.5 w-3.5" /> Reverse
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}
