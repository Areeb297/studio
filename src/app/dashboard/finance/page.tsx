'use client';

import Link from 'next/link';
import {
  Wallet, ArrowUpRight, ArrowDownRight, TrendingUp, FileText,
  ClipboardList, HandCoins, Banknote, ArrowRight, Bell, Sparkles, Lock,
  ChevronRight, Plus, BookOpen, Building2, Heart, Scale,
} from 'lucide-react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPKR } from '@/utils/accounting';
import { dashSnapshot, arTopCustomers, apTopSuppliers, bankTiles, alerts } from '@/lib/finance/dashboard-data';
import { monthlyPnl, monthlyCashflow } from '@/lib/finance/statements-data';

const ageingChipColor = (b: string) =>
  b === '0-30'  ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' :
  b === '31-60' ? 'bg-amber-50 text-amber-700 ring-amber-200' :
  b === '61-90' ? 'bg-orange-50 text-orange-700 ring-orange-200' :
                  'bg-rose-50 text-rose-700 ring-rose-200';

const alertColor = (l: 'warn' | 'danger' | 'info') =>
  l === 'danger' ? 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/30 dark:text-rose-200 dark:border-rose-900'
  : l === 'warn' ? 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-900'
  :                'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/30 dark:text-blue-200 dark:border-blue-900';

export default function FinanceDashboardPage() {
  return (
    <PageShell
      eyebrow="Finance · BINORIA WELFARE TRUST"
      title="Finance & Accounting"
      description="Live snapshot across the Ledger, AR, AP, Cash, and Donations. All numbers are mock — for prototype demo."
      breadcrumb={[{ label: 'Dashboard' }]}
      actions={
        <>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/finance/period-close">
              <Lock className="mr-1.5 h-3.5 w-3.5" /> Period close
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/finance/vouchers">
              <Plus className="mr-1.5 h-3.5 w-3.5" /> New voucher
            </Link>
          </Button>
        </>
      }
      kpis={
        <>
          <KpiCard
            label="Cash position"
            value={formatPKR(dashSnapshot.cashPosition)}
            tone="success"
            icon={Wallet}
            delta={{ value: dashSnapshot.cashPositionDelta, direction: 'up', label: 'vs last month' }}
          />
          <KpiCard
            label="Receivables"
            value={formatPKR(dashSnapshot.receivables)}
            tone="info"
            icon={ArrowDownRight}
            hint={`${formatPKR(dashSnapshot.receivablesOverdue)} overdue`}
          />
          <KpiCard
            label="Payables"
            value={formatPKR(dashSnapshot.payables)}
            tone="warning"
            icon={ArrowUpRight}
            hint={`${formatPKR(dashSnapshot.payablesDueSoon)} due in 7d`}
          />
          <KpiCard
            label="This month P&L"
            value={formatPKR(dashSnapshot.mtdNetProfit)}
            tone="accent"
            icon={TrendingUp}
            delta={{ value: dashSnapshot.mtdNetProfitDelta, direction: 'up' }}
          />
        </>
      }
    >
      {/* Today’s movement strip */}
      <section className="mb-6">
        <SectionHeader eyebrow="Today" title="Live movement" description="Auto-refreshed throughout the day." />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="p-4 flex items-center gap-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <FileText className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground font-medium">Posted vouchers</div>
              <div className="text-xl font-bold tabular-nums">{dashSnapshot.postedVouchersToday}</div>
            </div>
            <Link href="/dashboard/finance/vouchers/list" className="text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Card>

          <Card className="p-4 flex items-center gap-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <ClipboardList className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground font-medium">Pending approvals</div>
              <div className="text-xl font-bold tabular-nums">{dashSnapshot.pendingApprovals}</div>
            </div>
            <Link href="/dashboard/finance/approvals/journals" className="text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Card>

          <Card className="p-4 flex items-center gap-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
              <HandCoins className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground font-medium">Donations collected</div>
              <div className="text-xl font-bold tabular-nums">{formatPKR(dashSnapshot.donationsToday)}</div>
            </div>
            <Link href="/dashboard/finance/donations/collect" className="text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>
      </section>

      {/* AR / AP / Bank — 12-col layout */}
      <section className="mb-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* AR */}
        <Card className="lg:col-span-4 p-5">
          <SectionHeader
            eyebrow="Receivables"
            title="AR snapshot"
            actions={
              <Link href="/dashboard/finance/ar" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                Go to AR <ArrowRight className="h-3 w-3" />
              </Link>
            }
          />
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Total open</span>
              <span className="text-xl font-bold tabular-nums">{formatPKR(dashSnapshot.receivables)}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Overdue</span>
              <span className="text-sm font-semibold text-rose-600 tabular-nums">
                {formatPKR(dashSnapshot.receivablesOverdue)} <span className="text-xs text-muted-foreground">· 32%</span>
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">Top 5 customers</div>
            <ul className="space-y-2">
              {arTopCustomers.map(c => (
                <li key={c.name} className="flex items-center justify-between text-sm">
                  <span className="truncate font-medium">{c.name}</span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-semibold ring-1 ring-inset px-1.5 py-0.5 rounded ${ageingChipColor(c.bucket)}`}>{c.bucket}d</span>
                    <span className="tabular-nums font-semibold">{formatPKR(c.amount)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* AP */}
        <Card className="lg:col-span-4 p-5">
          <SectionHeader
            eyebrow="Payables"
            title="AP snapshot"
            actions={
              <Link href="/dashboard/finance/ap" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                Go to AP <ArrowRight className="h-3 w-3" />
              </Link>
            }
          />
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Total open</span>
              <span className="text-xl font-bold tabular-nums">{formatPKR(dashSnapshot.payables)}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Due in 7 days</span>
              <span className="text-sm font-semibold text-amber-600 tabular-nums">{formatPKR(dashSnapshot.payablesDueSoon)}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">Top 5 suppliers</div>
            <ul className="space-y-2">
              {apTopSuppliers.map(s => (
                <li key={s.name} className="flex items-center justify-between text-sm">
                  <span className="truncate font-medium">{s.name}</span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-semibold ring-1 ring-inset px-1.5 py-0.5 rounded ${s.due === 'Overdue' ? 'bg-rose-50 text-rose-700 ring-rose-200' : 'bg-slate-50 text-slate-700 ring-slate-200'}`}>{s.due}</span>
                    <span className="tabular-nums font-semibold">{formatPKR(s.amount)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Alerts */}
        <Card className="lg:col-span-4 p-5">
          <SectionHeader
            eyebrow="Attention"
            title={`Alerts (${alerts.length})`}
            actions={<Bell className="h-4 w-4 text-muted-foreground" />}
          />
          <ul className="space-y-2">
            {alerts.map((a, i) => (
              <li key={i}>
                <Link
                  href={a.href}
                  className={`block rounded-lg border px-3 py-2.5 text-sm font-medium hover:translate-x-0.5 transition-transform ${alertColor(a.level)}`}
                >
                  {a.text}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Bank tiles */}
      <section className="mb-6">
        <SectionHeader
          eyebrow="Cash & Bank"
          title="Account positions"
          actions={
            <Link href="/dashboard/finance/bank-reconciliation" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
              Bank reconciliation <ArrowRight className="h-3 w-3" />
            </Link>
          }
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {bankTiles.map(t => (
            <Card key={t.code} className="p-4 flex flex-col gap-3 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-mono text-muted-foreground">{t.code}</div>
                  <div className="text-sm font-semibold mt-0.5">{t.name}</div>
                </div>
                <Banknote className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-xl font-bold tabular-nums">
                {t.currency === 'USD'
                  ? `$ ${t.balance.toLocaleString()}`
                  : formatPKR(t.balance)}
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Reconciled {t.lastRecon}</span>
                {t.status === 'stale' && (
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Stale
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <SectionHeader eyebrow="Trend · 6 months" title="Income vs Expense" description="Stacked monthly, PKR" />
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyPnl} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis
                tickFormatter={v => `${(v / 1e6).toFixed(1)}M`}
                tickLine={false} axisLine={false} className="text-xs"
              />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--popover))' }}
                formatter={(v: number) => formatPKR(v)}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income"  name="Income"  fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="hsl(var(--chart-5))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <SectionHeader eyebrow="Trend · 6 months" title="Cash flow" description="Operating + Investing + Financing" />
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyCashflow} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="opGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%"   stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="finGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%"   stopColor="hsl(var(--chart-3))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickFormatter={v => `${(v / 1e6).toFixed(1)}M`} tickLine={false} axisLine={false} className="text-xs" />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--popover))' }}
                formatter={(v: number) => formatPKR(v)}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="operating" name="Operating" stroke="hsl(var(--chart-1))" fill="url(#opGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="financing" name="Financing" stroke="hsl(var(--chart-3))" fill="url(#finGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </section>

      {/* Quick links */}
      <section>
        <SectionHeader eyebrow="Quick access" title="Statements & masters" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { href: '/dashboard/finance/reports/trial-balance', label: 'Trial Balance',   icon: Scale,        tone: 'bg-teal-50 text-teal-700' },
            { href: '/dashboard/finance/reports/pnl',           label: 'Profit & Loss',   icon: TrendingUp,   tone: 'bg-emerald-50 text-emerald-700' },
            { href: '/dashboard/finance/reports/balance-sheet', label: 'Balance Sheet',   icon: Scale,        tone: 'bg-blue-50 text-blue-700' },
            { href: '/dashboard/finance/reports/cash-flow',     label: 'Cash Flow',       icon: Banknote,     tone: 'bg-violet-50 text-violet-700' },
            { href: '/dashboard/finance/accounts',              label: 'Chart of Accounts', icon: BookOpen,   tone: 'bg-amber-50 text-amber-700' },
            { href: '/dashboard/finance/donations/collect',     label: 'Donations',       icon: Heart,        tone: 'bg-rose-50 text-rose-700' },
          ].map(q => (
            <Link key={q.href} href={q.href}>
              <Card className="p-4 flex items-center gap-3 hover:border-primary/40 transition-colors cursor-pointer group">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${q.tone} dark:bg-opacity-20`}>
                  <q.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold">{q.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:translate-x-0.5 transition-transform" />
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
