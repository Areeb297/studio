'use client';

import { Download, Printer, Layers, TrendingDown, Boxes } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { assetCategories, fixedAssets } from '@/lib/finance/assets-data';
import { formatPKR } from '@/utils/accounting';

export default function AssetScheduleReportPage() {
  const summary = assetCategories.map(c => {
    const assets = fixedAssets.filter(a => a.categoryCode === c.code);
    const grossOpen = assets.reduce((s, a) => s + a.acquisitionCost, 0);
    const accDepOpen = assets.reduce((s, a) => s + a.accDep - Math.round((a.acquisitionCost - a.salvageValue) / (c.lifeMonths ?? 60)), 0);
    const depThisYear = assets.reduce((s, a) => s + Math.round((a.acquisitionCost - a.salvageValue) / (c.lifeMonths ?? 60)) * 5, 0);
    const accDepClose = assets.reduce((s, a) => s + a.accDep, 0);
    const nbv = grossOpen - accDepClose;
    return { ...c, count: assets.length, grossOpen, additions: 0, disposals: 0, grossClose: grossOpen, accDepOpen, depThisYear, accDepClose, nbv };
  });

  const totals = summary.reduce(
    (a, s) => ({
      count: a.count + s.count,
      gross: a.gross + s.grossClose,
      accDep: a.accDep + s.accDepClose,
      nbv: a.nbv + s.nbv,
      dep: a.dep + s.depThisYear,
    }),
    { count: 0, gross: 0, accDep: 0, nbv: 0, dep: 0 },
  );

  return (
    <PageShell
      eyebrow="Reports · Fixed Assets"
      title="Fixed Asset Schedule"
      description="Movement statement per category — gross cost in / out, accumulated depreciation roll-forward, and net book value."
      breadcrumb={[{ label: 'Reports', href: '/dashboard/finance/reports' }, { label: 'Asset Schedule' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> PDF</Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Asset categories"   value={assetCategories.length} tone="info"    icon={Layers} />
          <KpiCard label="Active assets"      value={totals.count}            tone="accent"  icon={Boxes} />
          <KpiCard label="Gross cost"         value={formatPKR(totals.gross)} tone="warning" />
          <KpiCard label="Net book value"     value={formatPKR(totals.nbv)}   tone="success" hint={`Dep YTD ${formatPKR(totals.dep)}`} />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-3">
          <Input type="date" defaultValue="2025-07-01" className="w-[150px]" />
          <Input type="date" defaultValue="2026-05-31" className="w-[150px]" />
        </div>
      </Card>

      <Card className="p-4 print:shadow-none">
        <div className="hidden print:block mb-3 pb-2 border-b-2 border-foreground">
          <div className="font-bold">BINORIA WELFARE TRUST</div>
          <div className="text-sm font-semibold">Fixed Asset Schedule · FY 2025-26 · PKR</div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[60px] font-mono">Cat.</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center w-[60px]">#</TableHead>
                <TableHead className="text-right">Gross open</TableHead>
                <TableHead className="text-right">Additions</TableHead>
                <TableHead className="text-right">Disposals</TableHead>
                <TableHead className="text-right">Gross close</TableHead>
                <TableHead className="text-right">AccDep open</TableHead>
                <TableHead className="text-right text-amber-700">Dep this yr</TableHead>
                <TableHead className="text-right">AccDep close</TableHead>
                <TableHead className="text-right font-bold">NBV</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.map(s => (
                <TableRow key={s.code} className="hover:bg-primary/5">
                  <TableCell className="font-mono text-xs font-bold">{s.code}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-center text-xs">{s.count}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPKR(s.grossOpen)}</TableCell>
                  <TableCell className="text-right tabular-nums text-emerald-700">—</TableCell>
                  <TableCell className="text-right tabular-nums text-rose-700">—</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{formatPKR(s.grossClose)}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{formatPKR(Math.max(0, s.accDepClose - s.depThisYear))}</TableCell>
                  <TableCell className="text-right tabular-nums text-amber-700 font-medium">{formatPKR(s.depThisYear)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPKR(s.accDepClose)}</TableCell>
                  <TableCell className="text-right tabular-nums font-bold">{formatPKR(s.nbv)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-primary/10">
              <TableRow>
                <TableCell colSpan={2} className="font-bold uppercase text-xs tracking-wide text-primary">Totals</TableCell>
                <TableCell className="text-center text-xs font-bold">{totals.count}</TableCell>
                <TableCell colSpan={3} />
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(totals.gross)}</TableCell>
                <TableCell />
                <TableCell className="text-right tabular-nums font-bold text-amber-700">{formatPKR(totals.dep)}</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(totals.accDep)}</TableCell>
                <TableCell className="text-right tabular-nums font-bold text-base text-primary">{formatPKR(totals.nbv)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
