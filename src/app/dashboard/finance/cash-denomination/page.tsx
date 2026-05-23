'use client';

import { useState, useMemo } from 'react';
import {
  Save, Calculator, Banknote, CheckCircle2, AlertTriangle, FileText,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

type Denom = { value: number; label: string; type: 'note' | 'coin' };

const DENOMS: Denom[] = [
  { value: 5000, label: 'Rs 5,000', type: 'note' },
  { value: 1000, label: 'Rs 1,000', type: 'note' },
  { value: 500,  label: 'Rs 500',   type: 'note' },
  { value: 100,  label: 'Rs 100',   type: 'note' },
  { value: 50,   label: 'Rs 50',    type: 'note' },
  { value: 20,   label: 'Rs 20',    type: 'note' },
  { value: 10,   label: 'Rs 10',    type: 'note' },
  { value: 5,    label: 'Rs 5',     type: 'coin' },
  { value: 2,    label: 'Rs 2',     type: 'coin' },
  { value: 1,    label: 'Rs 1',     type: 'coin' },
];

export default function CashDenominationPage() {
  const [account, setAccount] = useState('1001');
  const systemBalance = 452_800;
  const [counts, setCounts] = useState<Record<number, number>>({
    5000: 50, 1000: 150, 500: 60, 100: 40, 50: 16, 20: 30, 10: 0, 5: 12, 2: 5, 1: 10,
  });

  const physicalTotal = useMemo(
    () => DENOMS.reduce((s, d) => s + (counts[d.value] || 0) * d.value, 0),
    [counts],
  );
  const diff = physicalTotal - systemBalance;
  const tone = Math.abs(diff) < 0.5 ? 'success' : diff > 0 ? 'warning' : 'danger';

  const update = (v: number, c: number) =>
    setCounts(prev => ({ ...prev, [v]: c }));

  return (
    <PageShell
      eyebrow="Cash & Bank · Physical count"
      title="Cash Denomination Count"
      description="Physical cash count by note + coin. The system compares against the GL balance and surfaces any over/short."
      breadcrumb={[{ label: 'Cash & Bank' }, { label: 'Cash Denomination' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><FileText className="mr-1.5 h-3.5 w-3.5" /> Save count only</Button>
          <Button size="sm" disabled={Math.abs(diff) < 0.5}>
            <Save className="mr-1.5 h-3.5 w-3.5" /> Save &amp; post JV
          </Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="System balance"  value={formatPKR(systemBalance)} tone="info"     icon={Banknote} />
          <KpiCard label="Physical total"   value={formatPKR(physicalTotal)} tone="accent"   icon={Calculator} />
          <KpiCard
            label={Math.abs(diff) < 0.5 ? 'Matched' : diff > 0 ? 'Over' : 'Short'}
            value={diff === 0 ? '—' : formatPKR(Math.abs(diff))}
            tone={tone}
            icon={Math.abs(diff) < 0.5 ? CheckCircle2 : AlertTriangle}
          />
          <KpiCard label="Counted by"  value="A. Shafqat" tone="violet" icon={CheckCircle2} hint="23 May 17:30" />
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <SectionHeader eyebrow="Step 1" title="Count by denomination" />
            <Select value={account} onValueChange={setAccount}>
              <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1001">1001 · Cash on Hand</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {DENOMS.map(d => {
              const c = counts[d.value] || 0;
              const lineTotal = c * d.value;
              return (
                <div key={d.value} className={cn(
                  'flex items-center gap-3 rounded-lg border p-3 transition-colors',
                  c > 0 ? 'border-primary/30 bg-primary/5' : 'border-border',
                )}>
                  <span className={cn(
                    'flex h-10 w-14 items-center justify-center rounded-md font-bold text-xs',
                    d.type === 'note' ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                                     : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                  )}>
                    {d.label}
                  </span>
                  <span className="text-muted-foreground text-xs">×</span>
                  <Input
                    type="number"
                    value={c}
                    onChange={e => update(d.value, Number(e.target.value) || 0)}
                    placeholder="0"
                    className="h-9 w-20 text-right tabular-nums font-semibold"
                  />
                  <span className="text-muted-foreground text-xs">=</span>
                  <span className="flex-1 text-right tabular-nums font-bold">
                    {lineTotal > 0 ? `Rs ${lineTotal.toLocaleString()}` : <span className="text-muted-foreground font-normal">—</span>}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-sm uppercase tracking-wide font-bold text-muted-foreground">Physical total</span>
            <span className="text-2xl font-bold tabular-nums">{formatPKR(physicalTotal)}</span>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className={cn(
            'p-5 border-l-4',
            Math.abs(diff) < 0.5 ? 'border-l-emerald-500' : diff > 0 ? 'border-l-amber-500' : 'border-l-rose-500',
          )}>
            <SectionHeader eyebrow="Step 2" title="Reconciliation" />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Physical</dt>
                <dd className="font-semibold tabular-nums">{formatPKR(physicalTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">GL balance</dt>
                <dd className="font-semibold tabular-nums">{formatPKR(systemBalance)}</dd>
              </div>
              <div className={cn(
                'flex justify-between rounded-lg px-3 py-2 mt-2',
                Math.abs(diff) < 0.5 ? 'bg-emerald-50 dark:bg-emerald-950/30' :
                diff > 0 ? 'bg-amber-50 dark:bg-amber-950/30' : 'bg-rose-50 dark:bg-rose-950/30',
              )}>
                <dt className="font-bold uppercase text-xs tracking-wide">
                  {Math.abs(diff) < 0.5 ? 'Matched' : diff > 0 ? 'Cash over' : 'Cash short'}
                </dt>
                <dd className="font-bold tabular-nums">{diff === 0 ? '—' : formatPKR(Math.abs(diff))}</dd>
              </div>
            </dl>
          </Card>

          {Math.abs(diff) >= 0.5 && (
            <Card className="p-5">
              <SectionHeader eyebrow="Step 3" title="Suggested adjustment" />
              <div className="space-y-2 text-xs font-mono">
                {diff > 0 ? (
                  <>
                    <div className="flex justify-between border-b pb-1"><span>Dr 1001 Cash on Hand</span><span className="tabular-nums">{formatPKR(diff)}</span></div>
                    <div className="flex justify-between text-emerald-700 pt-1"><span>Cr 4099 Cash Over (Other Income)</span><span className="tabular-nums">{formatPKR(diff)}</span></div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between border-b pb-1"><span>Dr 5510 Cash Short Expense</span><span className="tabular-nums">{formatPKR(Math.abs(diff))}</span></div>
                    <div className="flex justify-between text-rose-700 pt-1"><span>Cr 1001 Cash on Hand</span><span className="tabular-nums">{formatPKR(Math.abs(diff))}</span></div>
                  </>
                )}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Clicking <strong>Save &amp; post JV</strong> generates this voucher and routes it to the approval queue.
              </p>
            </Card>
          )}

          <Card className="p-4 bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <div className="text-xs text-blue-900 dark:text-blue-200">
              <div className="font-semibold mb-1">Tip</div>
              <p>Save the count even when reconciled — it creates an audit record for the cash drawer, evidence-of-counting that auditors look for.</p>
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
