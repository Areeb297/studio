'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Download, Layers, Boxes, Coins, TrendingDown,
  Building2, Eye, MoreHorizontal,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { StatusBadge } from '@/components/finance/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { fixedAssets, assetCategories } from '@/lib/finance/assets-data';
import { COST_CENTERS, getCostCenter } from '@/lib/finance/seed';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

export default function AssetsRegisterPage() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('ALL');
  const [cc, setCc] = useState('ALL');

  const rows = useMemo(() => fixedAssets.filter(a => {
    const matchQ = !q || a.code.toLowerCase().includes(q.toLowerCase()) || a.name.toLowerCase().includes(q.toLowerCase());
    const matchCat = cat === 'ALL' || a.categoryCode === cat;
    const matchCc  = cc === 'ALL'  || String(a.costCenterId) === cc;
    return matchQ && matchCat && matchCc;
  }), [q, cat, cc]);

  const grossCost = fixedAssets.reduce((a, x) => a + x.acquisitionCost, 0);
  const accDep    = fixedAssets.reduce((a, x) => a + x.accDep, 0);
  const nbv       = fixedAssets.reduce((a, x) => a + x.nbv, 0);
  const monthlyDep = 412_300;

  return (
    <PageShell
      eyebrow="Fixed Assets"
      title="Asset Register"
      description="All active fixed assets with their net book value and depreciation status. Click any asset to view its full history."
      breadcrumb={[{ label: 'Fixed Assets' }]}
      actions={
        <>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/finance/assets/categories"><Layers className="mr-1.5 h-3.5 w-3.5" /> Categories</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/finance/assets/depreciation"><TrendingDown className="mr-1.5 h-3.5 w-3.5" /> Run Depreciation</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/finance/assets/acquisition"><Plus className="mr-1.5 h-3.5 w-3.5" /> Acquire</Link>
          </Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Active assets" value={fixedAssets.length} tone="info" icon={Boxes} hint={`${assetCategories.length} categories`} />
          <KpiCard label="Gross cost"    value={formatPKR(grossCost)} tone="accent" icon={Coins} />
          <KpiCard label="Net book value" value={formatPKR(nbv)} tone="success" icon={Layers} hint={`${((nbv / grossCost) * 100).toFixed(1)}% of cost`} />
          <KpiCard label="Monthly depreciation" value={formatPKR(monthlyDep)} tone="warning" icon={TrendingDown} hint="May 2026 — pending run" />
        </>
      }
    >
      {/* Category strip — photo-card style */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {assetCategories.map(c => {
          const count = fixedAssets.filter(a => a.categoryCode === c.code).length;
          const ccost = fixedAssets.filter(a => a.categoryCode === c.code).reduce((a, x) => a + x.acquisitionCost, 0);
          const cnbv  = fixedAssets.filter(a => a.categoryCode === c.code).reduce((a, x) => a + x.nbv, 0);
          const pct   = ccost > 0 ? (cnbv / ccost) * 100 : 0;
          return (
            <button
              key={c.code}
              onClick={() => setCat(cat === c.code ? 'ALL' : c.code)}
              className={cn(
                'relative overflow-hidden rounded-xl border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md',
                cat === c.code ? 'border-primary ring-2 ring-primary/30' : 'border-border',
              )}
            >
              <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset', c.color, 'ring-current/20 dark:bg-opacity-20')}>
                {c.code}
              </span>
              <div className="mt-2 font-semibold text-sm">{c.name}</div>
              <div className="mt-2 flex items-baseline justify-between text-xs">
                <span className="text-muted-foreground">{count} assets</span>
                <span className="font-bold tabular-nums">{formatPKR(cnbv)}</span>
              </div>
              <Progress value={pct} className="h-1 mt-2" />
            </button>
          );
        })}
      </div>

      <Card className="p-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search code or name…" value={q} onChange={e => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All categories</SelectItem>
              {assetCategories.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={cc} onValueChange={setCc}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Cost centre" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All cost centres</SelectItem>
              {COST_CENTERS.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="ml-auto"><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>
        </div>

        <div className="text-xs text-muted-foreground mb-2">
          Showing <span className="font-semibold text-foreground">{rows.length}</span> of {fixedAssets.length} assets
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[140px]">Code</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead className="w-[140px]">Category</TableHead>
                <TableHead className="w-[180px]">Cost centre</TableHead>
                <TableHead className="w-[110px]">Acquired</TableHead>
                <TableHead className="text-right w-[130px]">Cost</TableHead>
                <TableHead className="text-right w-[130px]">Acc. Dep</TableHead>
                <TableHead className="text-right w-[130px]">NBV</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[40px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(a => {
                const c = assetCategories.find(c => c.code === a.categoryCode)!;
                const center = getCostCenter(a.costCenterId);
                return (
                  <TableRow key={a.id} className="hover:bg-primary/5 cursor-pointer">
                    <TableCell className="font-mono text-xs">{a.code}</TableCell>
                    <TableCell>
                      <div className="font-medium">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.vendor}</div>
                    </TableCell>
                    <TableCell>
                      <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset', c.color, 'ring-current/20 dark:bg-opacity-20')}>
                        {c.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="inline-flex items-center gap-1.5">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        {center?.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(a.acquisitionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{formatPKR(a.acquisitionCost)}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{formatPKR(a.accDep)}</TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">{formatPKR(a.nbv)}</TableCell>
                    <TableCell><StatusBadge status={a.status} /></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
