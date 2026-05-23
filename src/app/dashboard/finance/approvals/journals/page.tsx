'use client';

import { useState } from 'react';
import {
  CheckCircle2, XCircle, Clock, FileText, ChevronRight, Eye, ArrowRight,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { StatusBadge } from '@/components/finance/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { vouchers } from '@/lib/finance/voucher-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

export default function JournalApprovalsPage() {
  const pending = vouchers.filter(v => v.status === 'PENDING_APPROVAL');
  const [active, setActive] = useState(0);
  const current = pending[active];

  if (!current) {
    return (
      <PageShell
        eyebrow="Approvals · Queue"
        title="Journal Voucher Approvals"
        description="All clear — nothing waiting on you right now."
        breadcrumb={[{ label: 'Approvals' }, { label: 'Journals' }]}
      >
        <Card className="p-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
          <div className="text-lg font-semibold">Inbox zero ✨</div>
          <div className="text-sm text-muted-foreground mt-1">No JVs awaiting your approval.</div>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Approvals · Queue"
      title="Journal Voucher Approvals"
      description={`${pending.length} JV${pending.length > 1 ? 's' : ''} awaiting your decision. j/k to navigate · a to approve · r to reject.`}
      breadcrumb={[{ label: 'Approvals' }, { label: 'Journals' }]}
      kpis={
        <>
          <KpiCard label="Pending" value={pending.length} tone="warning" icon={Clock} />
          <KpiCard label="Approved today" value={4} tone="success" icon={CheckCircle2} />
          <KpiCard label="Rejected today" value={0} tone="danger" icon={XCircle} />
          <KpiCard label="Avg cycle time" value="4h 22m" tone="info" hint="From submit → approve" />
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Queue */}
        <Card className="p-3 lg:col-span-1 h-fit">
          <SectionHeader eyebrow="Queue" title={`${pending.length} items`} />
          <ul className="space-y-1">
            {pending.map((v, i) => (
              <li key={v.id}>
                <button
                  onClick={() => setActive(i)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg border transition-colors',
                    active === i ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted/50',
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold">{v.number}</span>
                    <span className="text-[10px] uppercase font-bold bg-muted text-muted-foreground rounded px-1.5 py-0.5">{v.type}</span>
                  </div>
                  <div className="text-sm font-medium truncate">{v.description}</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-muted-foreground">{v.date} · by {v.createdBy}</span>
                    <span className="text-xs font-bold tabular-nums">{formatPKR(v.amount)}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {/* Detail */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-mono text-base font-bold">{current.number}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{current.description}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] uppercase font-bold bg-muted px-1.5 py-0.5 rounded">{current.type}</span>
                <StatusBadge status={current.status} />
                <span className="text-xs text-muted-foreground">· {current.date} · by {current.createdBy}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Amount</div>
              <div className="text-2xl font-bold tabular-nums">{formatPKR(current.amount)}</div>
            </div>
          </div>

          <SectionHeader eyebrow="Lines" title="Posting detail" />
          <div className="rounded-lg border border-border overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left p-2 text-[10px] uppercase tracking-wider">Account</th>
                  <th className="text-left p-2 text-[10px] uppercase tracking-wider">Narration</th>
                  <th className="text-right p-2 text-[10px] uppercase tracking-wider">Debit</th>
                  <th className="text-right p-2 text-[10px] uppercase tracking-wider">Credit</th>
                </tr>
              </thead>
              <tbody>
                {current.lines.map((l, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-2"><span className="font-mono text-xs text-muted-foreground mr-1">{l.accountCode}</span> {l.accountName}</td>
                    <td className="p-2 text-xs text-muted-foreground">{l.narration ?? '—'}</td>
                    <td className="p-2 text-right tabular-nums">{l.debit > 0 ? formatPKR(l.debit) : '—'}</td>
                    <td className="p-2 text-right tabular-nums">{l.credit > 0 ? formatPKR(l.credit) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2 mb-4">
            <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Remarks (optional)</div>
            <Textarea rows={2} placeholder="Add a remark before approving or rejecting…" />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Eye className="mr-1.5 h-3.5 w-3.5" /> Open full voucher</Button>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="sm" className="text-rose-700"><XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject (r)</Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700"><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Approve (a)</Button>
              <Button size="sm" variant="ghost" onClick={() => setActive((active + 1) % pending.length)}>Next <ArrowRight className="ml-1 h-3 w-3" /></Button>
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
