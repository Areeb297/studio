import { cn } from '@/lib/utils';

export type FinanceStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL' | 'PENDING'
  | 'APPROVED' | 'POSTED' | 'PAID'
  | 'RECONCILED'
  | 'OVERDUE' | 'BOUNCED'
  | 'WRITTEN_OFF'
  | 'REVERSED' | 'REJECTED'
  | 'CLOSED' | 'OPEN'
  | 'ACTIVE' | 'DISPOSED' | 'WRITTEN_OFF'
  | 'USED' | 'AVAILABLE' | 'VOID';

const STYLES: Record<string, string> = {
  DRAFT:            'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700',
  PENDING_APPROVAL: 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900',
  PENDING:          'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900',
  APPROVED:         'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900',
  POSTED:           'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900',
  PAID:             'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900',
  RECONCILED:       'bg-teal-50 text-teal-800 ring-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-teal-900',
  OVERDUE:          'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900',
  BOUNCED:          'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900',
  WRITTEN_OFF:      'bg-violet-50 text-violet-800 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900',
  REVERSED:         'bg-slate-100 text-slate-600 ring-slate-200 line-through dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700',
  REJECTED:         'bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900',
  CLOSED:           'bg-indigo-50 text-indigo-800 ring-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:ring-indigo-900',
  OPEN:             'bg-blue-50 text-blue-800 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900',
  ACTIVE:           'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900',
  DISPOSED:         'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700',
  USED:             'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700',
  AVAILABLE:        'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900',
  VOID:             'bg-rose-50 text-rose-800 ring-rose-200 line-through dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900',
};

const LABELS: Record<string, string> = {
  PENDING_APPROVAL: 'Pending approval',
  WRITTEN_OFF: 'Written off',
};

export function StatusBadge({
  status,
  className,
}: { status: FinanceStatus | string; className?: string }) {
  const key = String(status).toUpperCase();
  const style = STYLES[key] ?? 'bg-slate-100 text-slate-700 ring-slate-200';
  const label = LABELS[key] ?? String(status).replace(/_/g, ' ').toLowerCase();
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize ring-1 ring-inset',
        style,
        className,
      )}
    >
      {label}
    </span>
  );
}
