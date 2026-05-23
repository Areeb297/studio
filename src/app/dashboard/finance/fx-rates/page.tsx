'use client';

import { Plus, ArrowLeftRight, TrendingUp, TrendingDown, RefreshCcw, Calendar } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const usdHistory = [
  { date: '01 May', rate: 281.20 }, { date: '05 May', rate: 281.85 },
  { date: '08 May', rate: 282.10 }, { date: '12 May', rate: 281.95 },
  { date: '15 May', rate: 282.50 }, { date: '18 May', rate: 282.90 },
  { date: '20 May', rate: 283.10 }, { date: '22 May', rate: 283.05 },
  { date: '23 May', rate: 283.40 },
];

const rates = [
  { date: '23 May 2026', from: 'USD', to: 'PKR', mid: 283.40, buy: 282.85, sell: 283.95, source: 'SBP', isLatest: true },
  { date: '23 May 2026', from: 'AED', to: 'PKR', mid: 77.18,  buy: 76.95,  sell: 77.41,  source: 'SBP', isLatest: true },
  { date: '23 May 2026', from: 'SAR', to: 'PKR', mid: 75.56,  buy: 75.31,  sell: 75.81,  source: 'SBP', isLatest: true },
  { date: '23 May 2026', from: 'GBP', to: 'PKR', mid: 360.10, buy: 359.40, sell: 360.80, source: 'SBP', isLatest: true },
  { date: '22 May 2026', from: 'USD', to: 'PKR', mid: 283.05, buy: 282.50, sell: 283.60, source: 'SBP' },
  { date: '21 May 2026', from: 'USD', to: 'PKR', mid: 283.10, buy: 282.55, sell: 283.65, source: 'SBP' },
  { date: '20 May 2026', from: 'USD', to: 'PKR', mid: 282.90, buy: 282.35, sell: 283.45, source: 'SBP' },
];

export default function FxRatesPage() {
  const latest = usdHistory[usdHistory.length - 1].rate;
  const prev = usdHistory[usdHistory.length - 2].rate;
  const delta = ((latest - prev) / prev) * 100;
  const up = delta > 0;

  return (
    <PageShell
      eyebrow="Setup · Multi-currency"
      title="FX Rates"
      description="Foreign-currency rates used for revaluation at period end. Defaults to SBP daily rate; manual rates allowed for negotiated deals."
      breadcrumb={[{ label: 'Setup' }, { label: 'FX Rates' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><RefreshCcw className="mr-1.5 h-3.5 w-3.5" /> Refresh from SBP</Button>
          <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> Manual rate</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Base currency" value="PKR" tone="info"    icon={ArrowLeftRight} hint="Pakistani Rupee" />
          <KpiCard label="USD/PKR latest" value={`Rs ${latest.toFixed(2)}`} tone="accent" icon={ArrowLeftRight} />
          <KpiCard label="vs yesterday"  value={`${up ? '+' : ''}${delta.toFixed(2)}%`} tone={up ? 'success' : 'danger'} icon={up ? TrendingUp : TrendingDown} />
          <KpiCard label="Next revaluation" value="31 May" tone="warning" icon={Calendar} hint="Period close" />
        </>
      }
    >
      <Card className="p-5 mb-4">
        <SectionHeader eyebrow="USD/PKR — last 30 days" title="Mid-rate trend" />
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={usdHistory} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="usdG" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%"   stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} className="text-xs" />
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} axisLine={false} className="text-xs" tickFormatter={v => v.toFixed(0)} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--popover))' }}
              formatter={(v: number) => `Rs ${v.toFixed(2)}`}
            />
            <Area type="monotone" dataKey="rate" stroke="hsl(var(--chart-1))" fill="url(#usdG)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-4">
        <SectionHeader eyebrow="Recent rates" title="All currency pairs" />
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead className="w-[120px]">Pair</TableHead>
                <TableHead className="text-right w-[110px]">Mid</TableHead>
                <TableHead className="text-right w-[110px]">Buy</TableHead>
                <TableHead className="text-right w-[110px]">Sell</TableHead>
                <TableHead className="w-[100px]">Source</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rates.map((r, i) => (
                <TableRow key={i} className={r.isLatest ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/30'}>
                  <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
                  <TableCell className="font-mono font-bold">{r.from}/{r.to}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">Rs {r.mid.toFixed(2)}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">Rs {r.buy.toFixed(2)}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">Rs {r.sell.toFixed(2)}</TableCell>
                  <TableCell className="text-xs"><span className="bg-muted px-1.5 py-0.5 rounded font-mono">{r.source}</span></TableCell>
                  <TableCell>{r.isLatest && <span className="text-[10px] font-bold text-primary uppercase">Latest</span>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
