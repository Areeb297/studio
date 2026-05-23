'use client';

import { Download, Printer, Heart, TrendingUp, TrendingDown } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, PieChart, Pie } from 'recharts';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { donationStats } from '@/lib/finance/donations-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const monthly = [
  { month: 'Dec',  ZAKAT: 980_000,  SADQAH: 350_000, MOSQUE: 1_500_000, MADRASSAH: 480_000, GENERAL: 70_000 },
  { month: 'Jan',  ZAKAT: 1_010_000, SADQAH: 420_000, MOSQUE: 1_650_000, MADRASSAH: 510_000, GENERAL: 85_000 },
  { month: 'Feb',  ZAKAT: 1_050_000, SADQAH: 480_000, MOSQUE: 1_720_000, MADRASSAH: 590_000, GENERAL: 95_000 },
  { month: 'Mar',  ZAKAT: 1_120_000, SADQAH: 510_000, MOSQUE: 1_850_000, MADRASSAH: 620_000, GENERAL: 110_000 },
  { month: 'Apr',  ZAKAT: 1_012_000, SADQAH: 510_000, MOSQUE: 1_800_000, MADRASSAH: 700_000, GENERAL: 80_000 },
  { month: 'May',  ZAKAT: 1_234_500, SADQAH: 480_000, MOSQUE: 2_100_000, MADRASSAH: 650_000, GENERAL: 120_000 },
];

const fundColors: Record<string, string> = {
  ZAKAT: 'hsl(var(--chart-4))',
  SADQAH: 'hsl(var(--chart-6))',
  MOSQUE: 'hsl(var(--chart-3))',
  MADRASSAH: 'hsl(var(--chart-2))',
  GENERAL: 'hsl(var(--chart-5))',
};

const prev = { ZAKAT: 1_012_000, SADQAH: 510_000, MOSQUE: 1_800_000, MADRASSAH: 700_000, GENERAL: 80_000 };

export default function DonationSummaryPage() {
  const total = donationStats.byFund.reduce((s, f) => s + f.amount, 0);
  const totalPrev = Object.values(prev).reduce((s, v) => s + v, 0);
  const delta = ((total - totalPrev) / totalPrev) * 100;
  const pieData = donationStats.byFund.map(f => ({ name: f.fundName, value: f.amount, color: fundColors[f.fund] }));

  return (
    <PageShell
      eyebrow="Reports · Donations"
      title="Donation Collective Summary"
      description="Org-wide donations per fund, this month vs last. Powers the management dashboard and trustee reports."
      breadcrumb={[{ label: 'Reports', href: '/dashboard/finance/reports' }, { label: 'Donation Summary' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> PDF</Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Period total"  value={formatPKR(total)}     tone="success" icon={Heart} hint="May 2026" />
          <KpiCard label="Prior period" value={formatPKR(totalPrev)} tone="info"  />
          <KpiCard label="Δ"             value={`${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`} tone={delta > 0 ? 'success' : 'danger'} icon={delta > 0 ? TrendingUp : TrendingDown} />
          <KpiCard label="Top fund"     value="MOSQUE" tone="accent" hint={formatPKR(2_100_000)} />
        </>
      }
    >
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-3">
          <Select defaultValue="MAY26"><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="MAY26">May 2026</SelectItem><SelectItem value="APR26">April 2026</SelectItem></SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">vs</span>
          <Select defaultValue="APR26"><SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="APR26">April 2026</SelectItem><SelectItem value="MAY25">May 2025</SelectItem></SelectContent>
          </Select>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2 p-5">
          <SectionHeader eyebrow="Trend · 6 months" title="Monthly donations by fund" />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickFormatter={v => `${(v / 1e6).toFixed(1)}M`} tickLine={false} axisLine={false} className="text-xs" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--popover))' }} formatter={(v: number) => formatPKR(v)} />
              {(['ZAKAT','SADQAH','MOSQUE','MADRASSAH','GENERAL'] as const).map(k => (
                <Bar key={k} dataKey={k} stackId="a" fill={fundColors[k]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <SectionHeader eyebrow="May 2026" title="Mix by fund" />
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatPKR(v)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-4 print:shadow-none">
        <SectionHeader eyebrow="Detail" title="Period comparison" />
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>Fund</TableHead>
                <TableHead className="text-right">May 2026</TableHead>
                <TableHead className="text-right">Apr 2026</TableHead>
                <TableHead className="text-right">Δ</TableHead>
                <TableHead className="text-right w-[100px]">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donationStats.byFund.map(f => {
                const prevVal = (prev as any)[f.fund] || 0;
                const delta = f.amount - prevVal;
                const pct = prevVal ? (delta / prevVal) * 100 : 0;
                return (
                  <TableRow key={f.fund} className="hover:bg-primary/5">
                    <TableCell className="font-semibold">
                      <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: fundColors[f.fund] }} />{f.fundName}</span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">{formatPKR(f.amount)}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{formatPKR(prevVal)}</TableCell>
                    <TableCell className={cn('text-right tabular-nums font-semibold', delta > 0 ? 'text-emerald-700' : 'text-rose-700')}>
                      {delta > 0 ? '+' : ''}{formatPKR(delta)}
                    </TableCell>
                    <TableCell className={cn('text-right tabular-nums font-bold', pct > 0 ? 'text-emerald-700' : 'text-rose-700')}>
                      {pct > 0 ? '+' : ''}{pct.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter className="bg-primary/10">
              <TableRow><TableCell className="font-bold uppercase text-xs text-primary">Total</TableCell>
                <TableCell className="text-right tabular-nums font-bold text-base">{formatPKR(total)}</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(totalPrev)}</TableCell>
                <TableCell className={cn('text-right tabular-nums font-bold', total > totalPrev ? 'text-emerald-700' : 'text-rose-700')}>
                  {total > totalPrev ? '+' : ''}{formatPKR(total - totalPrev)}
                </TableCell>
                <TableCell className={cn('text-right tabular-nums font-bold', delta > 0 ? 'text-emerald-700' : 'text-rose-700')}>
                  {delta > 0 ? '+' : ''}{delta.toFixed(1)}%
                </TableCell></TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
