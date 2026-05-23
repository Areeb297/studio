import { ReactNode } from 'react';
import { FinanceBreadcrumb } from './finance-breadcrumb';
import { cn } from '@/lib/utils';

interface PageShellProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
  actions?: ReactNode;
  kpis?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PageShell({
  eyebrow, title, description, breadcrumb, actions, kpis, children, className,
}: PageShellProps) {
  return (
    <div className={cn('flex flex-col gap-6 p-4 md:p-6', className)}>
      <div className="flex flex-col gap-4">
        {breadcrumb && <FinanceBreadcrumb items={breadcrumb} />}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground max-w-2xl">{description}</p>
            )}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      </div>

      {kpis && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">{kpis}</div>}

      <div>{children}</div>
    </div>
  );
}
