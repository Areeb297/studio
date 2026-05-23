'use client';

import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tone = 'success' | 'info' | 'warning' | 'danger' | 'accent' | 'violet';

interface KpiCardProps {
  label: string;
  value: string | number;
  tone?: Tone;
  icon?: LucideIcon;
  hint?: string;
  delta?: { value: number; label?: string; direction?: 'up' | 'down' };
  className?: string;
}

const TONE_STRIPE: Record<Tone, string> = {
  success: 'bg-emerald-500',
  info:    'bg-blue-500',
  warning: 'bg-amber-500',
  danger:  'bg-rose-500',
  accent:  'bg-teal-500',
  violet:  'bg-violet-500',
};

const TONE_ICON_BG: Record<Tone, string> = {
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  info:    'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  danger:  'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  accent:  'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
  violet:  'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
};

const TONE_BLOB: Record<Tone, string> = {
  success: 'kpi-blob-success',
  info:    'kpi-blob-info',
  warning: 'kpi-blob-warning',
  danger:  'kpi-blob-danger',
  accent:  'kpi-blob-accent',
  violet:  'kpi-blob-violet',
};

export function KpiCard({
  label, value, tone = 'accent', icon: Icon, hint, delta, className,
}: KpiCardProps) {
  const deltaUp = delta?.direction === 'up' || (delta && delta.value > 0);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-card shadow-sm',
        'transition-all hover:-translate-y-0.5 hover:shadow-md',
        className,
      )}
    >
      {/* coloured top stripe */}
      <div className={cn('absolute inset-x-0 top-0 h-1', TONE_STRIPE[tone])} />
      {/* radial gradient blob */}
      <div className={cn('absolute inset-0 pointer-events-none', TONE_BLOB[tone])} />

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
            {label}
          </span>
          {Icon && (
            <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', TONE_ICON_BG[tone])}>
              <Icon className="h-4 w-4" />
            </span>
          )}
        </div>

        <div className="mt-3 text-2xl font-bold tracking-tight tabular-nums text-foreground">
          {value}
        </div>

        {(hint || delta) && (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            {delta && (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold tabular-nums',
                  deltaUp
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
                )}
              >
                {deltaUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(delta.value).toFixed(1)}%
              </span>
            )}
            {hint && <span>{hint}</span>}
            {delta?.label && <span>{delta.label}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
