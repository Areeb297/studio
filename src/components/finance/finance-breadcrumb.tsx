import Link from 'next/link';
import { ChevronRight, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Crumb {
  label: string;
  href?: string;
}

export function FinanceBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <Link
        href="/dashboard/finance"
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-muted hover:text-foreground transition-colors"
      >
        <Wallet className="h-3.5 w-3.5" />
        Finance
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3 text-border" />
          {item.href ? (
            <Link
              href={item.href}
              className="rounded-md px-2 py-1 hover:bg-muted hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn('rounded-md px-2 py-1', i === items.length - 1 && 'text-foreground')}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
