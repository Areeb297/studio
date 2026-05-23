'use client';

import { useState } from 'react';
import {
  Upload, RefreshCw, CheckCircle2, AlertTriangle, ArrowLeftRight,
  Lock, FileText, Banknote, Scale, Search, ArrowRight,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { StatusBadge } from '@/components/finance/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

type Line = {
  id: string;
  date: string;
  amount: number;        // signed
  ref: string;
  desc: string;
  matched: boolean;
};

const initialStatement: Line[] = [
  { id: 'b1', date: '2026-05-05', amount:  35_000, ref: 'GVC-2606',  desc: 'GREEN VALLEY CATERING',     matched: true  },
  { id: 'b2', date: '2026-05-07', amount: -12_500, ref: 'KMT-1801',  desc: 'KARACHI MEAT TRADERS',      matched: true  },
  { id: 'b3', date: '2026-05-08', amount:  -1_200, ref: 'CHG-2705',  desc: 'BANK CHARGES — SMS',        matched: false },
  { id: 'b4', date: '2026-05-12', amount:  50_000, ref: 'KM-22019',  desc: 'K. MIRZA — DONATION',       matched: true  },
  { id: 'b5', date: '2026-05-15', amount:   -800,  ref: 'CHG-1503',  desc: 'BANK CHARGES — STMT FEE',   matched: false },
  { id: 'b6', date: '2026-05-20', amount: -80_000, ref: 'CH-10228',  desc: 'CHEQUE — KARACHI MEAT',     matched: true  },
];

const initialSystem: Line[] = [
  { id: 's1', date: '2026-05-06', amount:  35_000, ref: 'BRV-0007',  desc: 'Receipt — GVC',             matched: true  },
  { id: 's2', date: '2026-05-08', amount: -12_500, ref: 'BPV-0008',  desc: 'Payment — KMT',             matched: true  },
  { id: 's3', date: '2026-05-12', amount:  50_000, ref: 'BRV-0006',  desc: 'Donation — Zakat K. Mirza', matched: true  },
  { id: 's4', date: '2026-05-22', amount: -78_500, ref: 'BPV-0011',  desc: 'Utility bill — K-Electric (uncleared)', matched: false },
  { id: 's5', date: '2026-05-20', amount: -80_000, ref: 'BPV-0010',  desc: 'KMT cheque #10228',         matched: true  },
];

export default function BankReconciliationPage() {
  const [bank, setBank] = useState('1002');
  const [statement, setStatement] = useState(initialStatement);
  const [system, setSystem]       = useState(initialSystem);

  const unMatchedStmt = statement.filter(l => !l.matched);
  const unMatchedSys  = system.filter(l => !l.matched);

  const stmtBalance = statement.reduce((a, l) => a + l.amount, 0);
  const sysBalance  = system.reduce((a, l) => a + l.amount, 0);
  const diff = Math.abs(stmtBalance - sysBalance);
  const ready = unMatchedStmt.length === 0 && unMatchedSys.length === 0;

  const markMatched = (id: string, side: 'stmt' | 'sys') => {
    if (side === 'stmt') setStatement(prev => prev.map(l => l.id === id ? { ...l, matched: true } : l));
    else setSystem(prev => prev.map(l => l.id === id ? { ...l, matched: true } : l));
  };

  return (
    <PageShell
      eyebrow="Cash & Bank · Reconciliation"
      title="Bank Reconciliation"
      description="Match bank statement lines to system entries. Auto-match handles 80–90%; drag-match the rest. Lock the period when zero unmatched."
      breadcrumb={[{ label: 'Cash & Bank' }, { label: 'Bank Reconciliation' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><Upload className="mr-1.5 h-3.5 w-3.5" /> Upload statement</Button>
          <Button variant="outline" size="sm"><RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Re-auto-match</Button>
          <Button size="sm" disabled={!ready}>
            <Lock className="mr-1.5 h-3.5 w-3.5" /> Reconcile {ready ? '' : `· ${unMatchedStmt.length + unMatchedSys.length} unmatched`}
          </Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Statement balance" value={formatPKR(stmtBalance)} tone="info" icon={Banknote} hint="Per uploaded CSV" />
          <KpiCard label="System balance"    value={formatPKR(sysBalance)}  tone="accent" icon={FileText} />
          <KpiCard label="Difference"        value={diff === 0 ? 'Reconciled' : formatPKR(diff)} tone={diff === 0 ? 'success' : 'warning'} icon={Scale} />
          <KpiCard label="Unmatched"         value={unMatchedStmt.length + unMatchedSys.length} tone={ready ? 'success' : 'danger'} icon={ready ? CheckCircle2 : AlertTriangle} />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Bank account</div>
          <Select value={bank} onValueChange={setBank}>
            <SelectTrigger className="w-[280px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1002">1002 · Bank — HBL Current</SelectItem>
              <SelectItem value="1003">1003 · Bank — MCB Savings</SelectItem>
              <SelectItem value="1004">1004 · Bank — UBL USD</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground ml-auto">
            Period: 01 May – 31 May 2026 · Cutoff: 30 Apr 2026 (locked)
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bank statement side */}
        <Card className="p-4">
          <SectionHeader
            eyebrow={`${statement.length} lines · ${unMatchedStmt.length} unmatched`}
            title="Bank statement (uploaded CSV)"
          />
          <ul className="space-y-2">
            {statement.map(l => (
              <li
                key={l.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border transition-colors',
                  l.matched ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900'
                            : 'bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900',
                )}
              >
                <span className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-md shrink-0',
                  l.matched ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white',
                )}>
                  {l.matched ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{l.date}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{l.ref}</span>
                  </div>
                  <div className="font-semibold text-sm truncate">{l.desc}</div>
                </div>
                <div className={cn(
                  'tabular-nums font-bold text-sm shrink-0',
                  l.amount < 0 ? 'text-rose-700' : 'text-emerald-700',
                )}>
                  {l.amount < 0 ? `(${formatPKR(Math.abs(l.amount))})` : formatPKR(l.amount)}
                </div>
                {!l.matched && (
                  <Button variant="outline" size="sm" className="text-xs h-7 shrink-0" onClick={() => markMatched(l.id, 'stmt')}>
                    Post as JV
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </Card>

        {/* System side */}
        <Card className="p-4">
          <SectionHeader
            eyebrow={`${system.length} lines · ${unMatchedSys.length} unmatched`}
            title="System (unmatched ledger entries)"
          />
          <ul className="space-y-2">
            {system.map(l => (
              <li
                key={l.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border transition-colors',
                  l.matched ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900'
                            : 'bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900',
                )}
              >
                <span className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-md shrink-0',
                  l.matched ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white',
                )}>
                  {l.matched ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{l.date}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{l.ref}</span>
                  </div>
                  <div className="font-semibold text-sm truncate">{l.desc}</div>
                </div>
                <div className={cn(
                  'tabular-nums font-bold text-sm shrink-0',
                  l.amount < 0 ? 'text-rose-700' : 'text-emerald-700',
                )}>
                  {l.amount < 0 ? `(${formatPKR(Math.abs(l.amount))})` : formatPKR(l.amount)}
                </div>
                {!l.matched && (
                  <Button variant="outline" size="sm" className="text-xs h-7 shrink-0" onClick={() => markMatched(l.id, 'sys')}>
                    Mark outstanding
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-4 mt-4 bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <div className="flex items-start gap-3 text-xs text-blue-900 dark:text-blue-200">
          <ArrowLeftRight className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <strong>Tip · drag to match.</strong> Auto-match flags pairs within ±2 days and ±Rs 50 — anything else gets dragged left→right.
            Statement lines with no system counterpart usually become JVs (bank charges, interest); system lines with no statement counterpart stay <em>Outstanding</em> for next month.
          </div>
        </div>
      </Card>
    </PageShell>
  );
}
