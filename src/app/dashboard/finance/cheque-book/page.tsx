'use client';

import { useState, useMemo } from 'react';
import {
  Plus, CreditCard, CheckCircle2, Ban, Printer, Search, Layers,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { StatusBadge } from '@/components/finance/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

type ChequeStatus = 'AVAILABLE' | 'USED' | 'VOID';

type ChequeSlot = {
  number: string;
  status: ChequeStatus;
  voucher?: string;
  payee?: string;
  amount?: number;
  date?: string;
  reason?: string;
};

const HBL_RANGE = Array.from({ length: 100 }, (_, i) => 10001 + i);

const usedSlots: Record<number, Partial<ChequeSlot>> = {
  10001: { voucher: 'BPV-2026-04-0001', payee: 'KARACHI ELECTRIC SUPPLY',  amount: 78_500, date: '2026-04-02' },
  10002: { voucher: 'BPV-2026-04-0002', payee: 'AL-MAJEED VEGETABLES',     amount: 22_500, date: '2026-04-05' },
  10009: { voucher: 'BPV-2026-04-0009', payee: 'KARACHI PROPERTIES',       amount: 120_000, date: '2026-04-15' },
  10011: { voucher: 'BPV-2026-04-0011', payee: 'LAHORE SPICES',            amount:  13_000, date: '2026-04-22' },
  10015: { reason: 'Printer jam — voided' },
  10016: { voucher: 'BPV-2026-05-0001', payee: 'BISMILLAH DAIRY',          amount:  42_200, date: '2026-05-04' },
  10019: { voucher: 'BPV-2026-05-0009', payee: 'AL-MAJEED VEGETABLES',     amount:  25_750, date: '2026-05-04' },
  10024: { reason: 'Mistake on date — voided' },
  10026: { voucher: 'BPV-2026-05-0010', payee: 'KARACHI MEAT TRADERS',     amount:  80_000, date: '2026-05-20' },
  10028: { voucher: 'BPV-2026-05-0010', payee: 'KARACHI MEAT TRADERS',     amount:  80_000, date: '2026-05-20' },
  10031: { voucher: 'BPV-2026-05-0011', payee: 'K-ELECTRIC',                amount:  78_500, date: '2026-05-22' },
};

const buildSlots = (range: number[]): ChequeSlot[] => range.map(n => {
  const u = usedSlots[n];
  if (!u) return { number: String(n), status: 'AVAILABLE' };
  if (u.reason) return { number: String(n), status: 'VOID', reason: u.reason };
  return { number: String(n), status: 'USED', ...u };
});

export default function ChequeBookStockPage() {
  const [bank, setBank] = useState('HBL-2026-B1');
  const [status, setStatus] = useState<ChequeStatus | 'ALL'>('ALL');
  const [q, setQ] = useState('');

  const slots = useMemo(() => buildSlots(HBL_RANGE).reverse(), []);
  const filtered = slots.filter(s => {
    if (status !== 'ALL' && s.status !== status) return false;
    if (q && !(s.number.includes(q) || (s.payee ?? '').toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  });

  const stats = {
    total: slots.length,
    available: slots.filter(s => s.status === 'AVAILABLE').length,
    used:      slots.filter(s => s.status === 'USED').length,
    void:      slots.filter(s => s.status === 'VOID').length,
  };

  return (
    <PageShell
      eyebrow="Cash & Bank · Cheque control"
      title="Cheque Book Stock"
      description="Pre-issued cheque slots with lifecycle tracking — Available → Used → Void. Picked automatically on every BPV."
      breadcrumb={[{ label: 'Cash & Bank' }, { label: 'Cheque Book Stock' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print sample</Button>
          <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> Issue cheque book</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Total slots"      value={stats.total}     tone="info"    icon={Layers} hint={bank} />
          <KpiCard label="Available"        value={stats.available} tone="success" icon={CheckCircle2} />
          <KpiCard label="Used"             value={stats.used}      tone="accent"  icon={CreditCard} />
          <KpiCard label="Void"             value={stats.void}      tone="danger"  icon={Ban} />
        </>
      }
    >
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Select value={bank} onValueChange={setBank}>
            <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="HBL-2026-B1">HBL Current — Book #B1 · 10001–10100</SelectItem>
              <SelectItem value="MCB-2026-B1">MCB Savings — Book #B1 · 20001–20100</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search # or payee" className="pl-9" />
          </div>
          <div className="flex gap-1">
            {(['ALL','AVAILABLE','USED','VOID'] as const).map(s => (
              <Button
                key={s}
                size="sm"
                variant={status === s ? 'default' : 'outline'}
                onClick={() => setStatus(s)}
                className="h-8 text-xs"
              >
                {s[0] + s.slice(1).toLowerCase()}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[100px] font-mono">Cheque #</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[180px]">Voucher</TableHead>
                <TableHead>Issued to</TableHead>
                <TableHead className="text-right w-[140px]">Amount</TableHead>
                <TableHead className="w-[110px]">Date</TableHead>
                <TableHead className="w-[100px] text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 30).map(s => (
                <TableRow key={s.number} className={cn(
                  'hover:bg-primary/5',
                  s.status === 'VOID' && 'opacity-60',
                )}>
                  <TableCell className="font-mono font-bold">{s.number}</TableCell>
                  <TableCell><StatusBadge status={s.status} /></TableCell>
                  <TableCell className="font-mono text-xs">{s.voucher ?? '—'}</TableCell>
                  <TableCell className="text-sm">{s.payee ?? (s.reason ? <span className="text-rose-700 italic text-xs">{s.reason}</span> : '—')}</TableCell>
                  <TableCell className="text-right tabular-nums">{s.amount ? `Rs ${s.amount.toLocaleString()}` : <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.date ?? '—'}</TableCell>
                  <TableCell className="text-right">
                    {s.status === 'USED' && <Button size="sm" variant="ghost" className="h-7 text-xs"><Printer className="mr-1 h-3 w-3" /> Print</Button>}
                    {s.status === 'AVAILABLE' && <Button size="sm" variant="ghost" className="h-7 text-xs text-rose-700">Void</Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          Showing first 30 of {filtered.length} slots. BPV pulls the next AVAILABLE slot automatically when the bank is selected.
        </div>
      </Card>
    </PageShell>
  );
}
