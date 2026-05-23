'use client';

import { Plus, Layers, Coins, Calendar, Percent, Edit, Boxes } from 'lucide-react';
import Link from 'next/link';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { assetCategories, fixedAssets } from '@/lib/finance/assets-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

export default function AssetCategoriesPage() {
  return (
    <PageShell
      eyebrow="Fixed Assets · Setup"
      title="Asset Categories"
      description="Each asset is classified into a category that defines its depreciation method, useful life, and GL postings."
      breadcrumb={[
        { label: 'Fixed Assets', href: '/dashboard/finance/assets' },
        { label: 'Categories' },
      ]}
      actions={<Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New category</Button>}
      kpis={
        <>
          <KpiCard label="Categories" value={assetCategories.length} tone="accent" icon={Layers} />
          <KpiCard label="Straight-line" value={assetCategories.filter(c => c.method === 'STRAIGHT_LINE').length} tone="info" icon={Calendar} />
          <KpiCard label="Reducing balance" value={assetCategories.filter(c => c.method === 'REDUCING_BALANCE').length} tone="warning" icon={Percent} />
          <KpiCard label="Assets categorised" value={fixedAssets.length} tone="success" icon={Boxes} />
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assetCategories.map(c => {
          const count = fixedAssets.filter(a => a.categoryCode === c.code).length;
          const gross = fixedAssets.filter(a => a.categoryCode === c.code).reduce((a, x) => a + x.acquisitionCost, 0);
          return (
            <Card key={c.code} className="overflow-hidden">
              {/* coloured header */}
              <div className={cn('px-5 pt-5 pb-3', c.color, 'dark:bg-opacity-20')}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider font-bold opacity-80">{c.code}</div>
                    <div className="text-base font-bold mt-0.5">{c.name}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Method</div>
                    <div className="font-semibold mt-0.5">{c.method === 'STRAIGHT_LINE' ? 'Straight-line' : 'Reducing balance'}</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Rate / Life</div>
                    <div className="font-semibold mt-0.5">
                      {c.method === 'STRAIGHT_LINE' ? `${c.lifeMonths} months` : `${c.rate}% p.a.`}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-1">GL mapping</div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="rounded-md bg-muted/40 px-2 py-1.5">
                      <div className="text-[10px] text-muted-foreground uppercase">Asset</div>
                      <div className="font-semibold">{c.assetAcc}</div>
                    </div>
                    <div className="rounded-md bg-muted/40 px-2 py-1.5">
                      <div className="text-[10px] text-muted-foreground uppercase">Acc.Dep</div>
                      <div className="font-semibold">{c.accDepAcc}</div>
                    </div>
                    <div className="rounded-md bg-muted/40 px-2 py-1.5">
                      <div className="text-[10px] text-muted-foreground uppercase">Dep Exp</div>
                      <div className="font-semibold">{c.depExpAcc}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <Link href={`/dashboard/finance/assets?category=${c.code}`} className="text-xs font-semibold text-primary hover:underline">
                    {count} assets →
                  </Link>
                  <span className="text-sm font-bold tabular-nums">{formatPKR(gross)}</span>
                </div>
              </div>
            </Card>
          );
        })}

        {/* Add category card */}
        <Card className="flex flex-col items-center justify-center p-8 border-dashed cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors text-center min-h-[260px]">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
            <Plus className="h-5 w-5" />
          </span>
          <div className="font-semibold text-sm">Add a category</div>
          <div className="text-xs text-muted-foreground mt-1 max-w-[200px]">
            Categories drive default depreciation rules for every asset you create
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
