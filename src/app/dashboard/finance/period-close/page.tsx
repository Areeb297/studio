'use client';

import { useState } from 'react';
import {
  CheckCircle2, Circle, AlertCircle, Lock, FileText, RefreshCw,
  Banknote, Layers, Calendar, ArrowRight, Sparkles, Clock,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { StatusBadge } from '@/components/finance/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

type CheckItem = {
  id: string;
  label: string;
  detail: string;
  status: 'pass' | 'fail' | 'warn';
  cta?: { label: string; href: string };
  icon: any;
};

export default function PeriodClosePage() {
  const [period, setPeriod] = useState('May 2026');

  const [checks, setChecks] = useState<CheckItem[]>([
    { id: 'jv',    label: 'All journals approved',       detail: '24 of 24',                                    status: 'pass', icon: FileText },
    { id: 'bank',  label: 'All bank accounts reconciled', detail: '3 of 3 — HBL · MCB · UBL USD',                status: 'pass', icon: Banknote },
    { id: 'si',    label: 'All supplier invoices entered', detail: 'No outstanding GRNs un-invoiced',            status: 'pass', icon: FileText },
    { id: 'stock', label: 'Stock valuation matches',      detail: 'Inventory module Rs 320,000 ≡ GL 320,000',    status: 'pass', icon: Layers },
    { id: 'fx',    label: 'Forex revaluation done',       detail: 'UBL USD position pending',                     status: 'fail', icon: RefreshCw, cta: { label: 'Run Forex Run', href: '#fx' } },
    { id: 'dep',   label: 'Depreciation posted',          detail: '142 active assets · Rs 412,300 to post',       status: 'fail', icon: Layers,    cta: { label: 'Run Depreciation', href: '/dashboard/finance/assets/depreciation' } },
  ]);

  const passed = checks.filter(c => c.status === 'pass').length;
  const total = checks.length;
  const allGreen = passed === total;
  const pct = (passed / total) * 100;

  const markPass = (id: string) => setChecks(prev => prev.map(c => c.id === id ? { ...c, status: 'pass', detail: c.detail + ' · just ran' } : c));

  return (
    <PageShell
      eyebrow="Period · Month-end ceremony"
      title="Period Close"
      description="Close the books for the chosen period. Run the pre-close checklist, post any outstanding entries, then lock the period."
      breadcrumb={[{ label: 'Period Close' }]}
      actions={
        <>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button size="sm" disabled={!allGreen} className={cn(!allGreen && 'opacity-60 cursor-not-allowed')}>
            <Lock className="mr-1.5 h-3.5 w-3.5" /> Close period
          </Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Period" value={period} tone="info" icon={Calendar} hint="Status: Open" />
          <KpiCard label="Posted vouchers" value={142} tone="accent" icon={FileText} hint="In this period" />
          <KpiCard label="GL movement" value={formatPKR(18_400_000)} tone="success" icon={Banknote} hint="Sum of Dr lines" />
          <KpiCard
            label="Checklist progress"
            value={`${passed} / ${total}`}
            tone={allGreen ? 'success' : 'warning'}
            icon={CheckCircle2}
            hint={allGreen ? 'Ready to close' : `${total - passed} items remaining`}
          />
        </>
      }
    >
      {/* Progress bar */}
      <Card className="p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Pre-close readiness</div>
            <div className="text-base font-semibold mt-0.5">{passed} of {total} checks passing</div>
          </div>
          <div className="text-2xl font-bold tabular-nums text-primary">{pct.toFixed(0)}%</div>
        </div>
        <Progress value={pct} className="h-2" />
      </Card>

      {/* Checklist */}
      <Card className="p-4 mb-4">
        <SectionHeader eyebrow="Step 1" title="Pre-close checklist" description="Auto-evaluated. Resolve any failed items before closing." />
        <ul className="divide-y divide-border rounded-lg border border-border overflow-hidden">
          {checks.map((c, i) => (
            <li
              key={c.id}
              className={cn(
                'flex items-center gap-4 p-4 transition-colors',
                c.status === 'pass' ? 'bg-emerald-50/40 dark:bg-emerald-950/10' : 'bg-amber-50/40 dark:bg-amber-950/10',
              )}
            >
              <span className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg shrink-0',
                c.status === 'pass'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
              )}>
                {c.status === 'pass' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{c.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.detail}</div>
              </div>
              <span className="text-xs text-muted-foreground font-mono shrink-0 hidden md:inline">#{i + 1}</span>
              {c.status === 'fail' && c.cta && (
                <Button size="sm" variant="outline" onClick={() => markPass(c.id)}>
                  {c.cta.label} <ArrowRight className="ml-1.5 h-3 w-3" />
                </Button>
              )}
              {c.status === 'pass' && <StatusBadge status="APPROVED" />}
            </li>
          ))}
        </ul>
      </Card>

      {/* Step 2 — closing entries preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card className="p-5">
          <SectionHeader eyebrow="Step 2" title="Closing entries preview" description="Auto-generated when you click Close period." />
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium">Income → Retained Earnings</span>
              <span className="tabular-nums font-semibold text-emerald-700">{formatPKR(5_563_900)}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium">Expenses → Retained Earnings</span>
              <span className="tabular-nums font-semibold text-rose-700">({formatPKR(4_283_300)})</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-bold uppercase text-xs tracking-wide text-primary">Net to retained</span>
              <span className="tabular-nums font-bold text-base text-primary">{formatPKR(1_280_600)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader eyebrow="Step 3" title="Lock the period" description="After close, no voucher with date ≤ 31 May 2026 can be posted without explicit reopen." />
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><Sparkles className="h-3.5 w-3.5 text-primary mt-0.5" /> Generates closing journal automatically</li>
            <li className="flex items-start gap-2"><Lock className="h-3.5 w-3.5 text-primary mt-0.5" /> Sets period status to <span className="font-semibold text-foreground">CLOSED</span></li>
            <li className="flex items-start gap-2"><Clock className="h-3.5 w-3.5 text-primary mt-0.5" /> All actions audit-logged with user + timestamp</li>
            <li className="flex items-start gap-2"><RefreshCw className="h-3.5 w-3.5 text-primary mt-0.5" /> Only CFO can reopen (with reason)</li>
          </ul>
          {!allGreen && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-3 text-xs text-amber-900 dark:text-amber-200">
              ⚠ Resolve the {total - passed} pending checks above before the Close button enables.
            </div>
          )}
        </Card>
      </div>

      {/* Historical periods */}
      <Card className="p-4">
        <SectionHeader eyebrow="History" title="Recent periods" />
        <ul className="divide-y divide-border rounded-lg border border-border overflow-hidden">
          {[
            { p: 'Apr 2026', s: 'CLOSED', closed: '01 May 2026 · Areeb Shafqat',  vouchers: 168, net: 1_185_400 },
            { p: 'Mar 2026', s: 'CLOSED', closed: '02 Apr 2026 · Areeb Shafqat',  vouchers: 152, net: 1_022_800 },
            { p: 'Feb 2026', s: 'CLOSED', closed: '01 Mar 2026 · Areeb Shafqat',  vouchers: 144, net:   910_600 },
            { p: 'Jan 2026', s: 'CLOSED', closed: '01 Feb 2026 · Areeb Shafqat',  vouchers: 138, net:   832_000 },
          ].map(p => (
            <li key={p.p} className="flex items-center gap-4 p-3 hover:bg-muted/30">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                <Lock className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-semibold">{p.p}</div>
                <div className="text-xs text-muted-foreground">Closed {p.closed}</div>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <span className="text-xs text-muted-foreground">{p.vouchers} vouchers</span>
                <span className="text-sm font-semibold tabular-nums w-32 text-right">{formatPKR(p.net)}</span>
              </div>
              <StatusBadge status="CLOSED" />
            </li>
          ))}
        </ul>
      </Card>
    </PageShell>
  );
}
