'use client';

import { Plus, Heart, Edit, Trash2, BookOpen } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DONATION_FUNDS } from '@/lib/finance/seed';
import { donationStats } from '@/lib/finance/donations-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const fundTone: Record<string, string> = {
  ZAKAT:     'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  SADQAH:    'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  MOSQUE:    'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  MADRASSAH: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  GENERAL:   'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
};

export default function DonationTypesPage() {
  const totalMtd = donationStats.byFund.reduce((s, f) => s + f.amount, 0);

  return (
    <PageShell
      eyebrow="Donations · Setup"
      title="Donation Types (Funds)"
      description="Each fund maps to a GL income account. Zakat-flagged funds feed the shariah-audit Zakat register."
      breadcrumb={[{ label: 'Donations' }, { label: 'Funds' }]}
      actions={<Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New fund</Button>}
      kpis={
        <>
          <KpiCard label="Active funds"          value={DONATION_FUNDS.length}                                  tone="info"    icon={Heart} />
          <KpiCard label="Zakat-flagged"         value={DONATION_FUNDS.filter(f => f.isZakat).length}           tone="violet"  icon={BookOpen} />
          <KpiCard label="Total collected MTD"   value={formatPKR(totalMtd)}                                    tone="success" icon={Heart} />
          <KpiCard label="Top fund"              value="ZAKAT"                                                  tone="accent"  hint={formatPKR(1_234_500)} />
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DONATION_FUNDS.map(f => {
          const stat = donationStats.byFund.find(s => s.fund === f.id);
          return (
            <Card key={f.id} className="overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all">
              <div className={cn('px-5 py-4 flex items-start justify-between', fundTone[f.id])}>
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold opacity-80 font-mono">{f.id}</div>
                  <div className="text-lg font-bold mt-0.5">{f.name}</div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">GL income account</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-mono text-sm font-bold">{f.account}</span>
                    <span className="text-xs text-muted-foreground">Donation Income — {f.name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {f.isZakat && <span className="inline-flex items-center rounded bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300 text-[10px] font-bold uppercase px-1.5 py-0.5">Zakat</span>}
                    {!f.isZakat && 'Non-zakat'}
                  </span>
                  <span className="text-base font-bold tabular-nums">{stat ? formatPKR(stat.amount) : '—'}</span>
                </div>
              </div>
            </Card>
          );
        })}

        <Card className="flex flex-col items-center justify-center p-8 border-dashed cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors text-center min-h-[220px]">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
            <Plus className="h-5 w-5" />
          </span>
          <div className="font-semibold text-sm">Add a fund</div>
          <div className="text-xs text-muted-foreground mt-1 max-w-[200px]">
            Bind a new fund to its GL income account
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
