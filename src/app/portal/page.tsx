'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package, Zap, CalendarDays, Shield, Wallet, Users, Headphones,
  Sparkles, Rocket, Building2, Clock, LogOut, Lock, ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type WorkspaceTone = 'teal' | 'rose' | 'amber' | 'violet' | 'blue' | 'indigo' | 'emerald';

const toneClasses: Record<WorkspaceTone, { icon: string; blob: string; chip: string }> = {
  teal:    { icon: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',          blob: 'bg-teal-200/40',    chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  rose:    { icon: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',          blob: 'bg-rose-200/40',    chip: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' },
  amber:   { icon: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',      blob: 'bg-amber-200/40',   chip: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  violet:  { icon: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',  blob: 'bg-violet-200/40',  chip: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300' },
  blue:    { icon: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',          blob: 'bg-blue-200/40',    chip: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
  indigo:  { icon: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',  blob: 'bg-indigo-200/40',  chip: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
  emerald: { icon: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300', blob: 'bg-emerald-200/40', chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
};

type Workspace = {
  icon: any;
  tone: WorkspaceTone;
  title: string;
  desc: string;
  href: string;
  badge: string;
  index: number;
};

const active: Workspace[] = [
  { icon: Package,      tone: 'teal',    title: 'Inventory Management', desc: 'Stock, warehouses, procurement, recipes, finance and reporting.',  href: '/dashboard/inventory',         badge: 'LIVE',         index: 1 },
  { icon: Zap,          tone: 'rose',    title: 'Restaurant POS',        desc: 'Direct sales terminal, kitchen display, table management and billing.', href: '/dashboard/pos',              badge: 'HIGH SPEED',   index: 2 },
  { icon: CalendarDays, tone: 'amber',   title: 'Catering & Events',     desc: 'Banquet bookings, outdoor catering, item-level billing, advance & balance tracking.', href: '/dashboard/events', badge: 'NEW',          index: 3 },
  { icon: Wallet,       tone: 'emerald', title: 'Financial Core',        desc: 'GL · AP / AR · Bank recon · Trial Balance · P&L · Cash Flow · Donations · Tax.', href: '/dashboard/finance',  badge: 'JUST SHIPPED', index: 4 },
  { icon: Shield,       tone: 'violet',  title: 'Admin Console',         desc: 'Users, role permissions, security audit and global system settings.',  href: '/dashboard/admin/users',     badge: 'SECURITY CORE', index: 5 },
];

const roadmap: Workspace[] = [
  { icon: Users,      tone: 'indigo', title: 'HR & Payroll',  desc: 'Employee lifecycle, biometric attendance, leave and payroll workflows.', href: '#', badge: 'Q3 ROADMAP', index: 1 },
  { icon: Headphones, tone: 'blue',   title: 'CRM & Loyalty', desc: 'Customer 360 view, loyalty programs, campaigns and feedback management.', href: '#', badge: 'Q4 ROADMAP', index: 2 },
];

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const i = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(i);
  }, []);
  return now;
}

function greeting(d: Date | null) {
  if (!d) return 'Welcome';
  const h = d.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function ERPPortalPage() {
  const now = useNow();
  const dateStr = now ? now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }) : '—';
  const timeStr = now ? now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Top brand row */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-teal-600 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-primary/20">R</div>
            <div>
              <div className="font-bold text-lg tracking-tight">RAHAH<span className="text-primary">24</span></div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold -mt-0.5">Enterprise Hub</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Signed in as</div>
              <div className="font-semibold mt-0.5">System Admin</div>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal-600 text-white font-bold text-sm shadow-lg shadow-primary/25">
              SA
            </span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/"><LogOut className="mr-1.5 h-3.5 w-3.5" /> Sign out</Link>
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm font-semibold text-primary inline-flex items-center gap-1.5">
            🔥 {greeting(now)}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-2">
            Choose your workspace, <span className="text-primary">System</span>
          </h1>
          <p className="text-muted-foreground mt-2">Each workspace gives you a focused set of tools. You can switch any time via the sidebar.</p>
        </div>

        <Card className="p-0 mb-8 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
            <ContextTile icon={Shield}      label="Role"       value="Admin" />
            <ContextTile icon={Building2}   label="Company"    value="BINORIA WELFARE TRUST" />
            <ContextTile icon={CalendarDays} label="Today"     value={dateStr} />
            <ContextTile icon={Clock}       label="Local time" value={timeStr} />
          </div>
        </Card>

        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] uppercase tracking-[0.12em] font-bold text-muted-foreground">Active workspaces</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-12">
          {active.map(w => <WorkspaceCard key={w.title} ws={w} />)}
        </div>

        <div className="mb-3 flex items-center gap-2">
          <Rocket className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] uppercase tracking-[0.12em] font-bold text-muted-foreground">On the roadmap</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmap.map(w => <WorkspaceCard key={w.title} ws={w} disabled />)}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>Rahah24 ERP © 2026. Advanced Business Management System.</span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
            <span className="text-border mx-1">|</span>
            <span className="font-mono font-bold text-foreground">V 8.0</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function ContextTile({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{label}</div>
        <div className="font-semibold text-sm truncate">{value}</div>
      </div>
    </div>
  );
}

function WorkspaceCard({ ws, disabled = false }: { ws: Workspace; disabled?: boolean }) {
  const t = toneClasses[ws.tone];
  const inner = (
    <Card className={cn(
      'relative overflow-hidden p-5 h-full transition-all',
      disabled ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 cursor-pointer group',
    )}>
      <div className={cn('absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none', t.blob)} />
      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <span className={cn('h-11 w-11 rounded-xl flex items-center justify-center', t.icon)}>
            <ws.icon className="h-5 w-5" />
          </span>
          {disabled && <Lock className="h-4 w-4 text-muted-foreground" />}
          {!disabled && (
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          )}
        </div>
        <h3 className="font-bold text-base mb-1.5">{ws.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-3 flex-1">{ws.desc}</p>
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <span className={cn(
            'inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
            disabled ? 'bg-muted text-muted-foreground' : t.chip,
          )}>
            {!disabled && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />}
            {ws.badge}
          </span>
          <span className="text-xs text-muted-foreground font-mono tabular-nums">{ws.index}</span>
        </div>
      </div>
    </Card>
  );

  return disabled ? inner : <Link href={ws.href}>{inner}</Link>;
}
