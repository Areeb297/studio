import { Construction, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PageShell } from './page-shell';
import { Button } from '@/components/ui/button';

interface ComingSoonProps {
  title: string;
  description?: string;
  specDoc?: string;          // e.g. "05_general_ledger.md"
  breadcrumb?: { label: string; href?: string }[];
  bullets?: string[];
}

export function ComingSoon({ title, description, specDoc, breadcrumb, bullets }: ComingSoonProps) {
  return (
    <PageShell
      eyebrow="Coming soon"
      title={title}
      description={description}
      breadcrumb={breadcrumb}
    >
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-card p-8 md:p-12">
        <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" />
        <div className="relative max-w-2xl space-y-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Construction className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Screen design in spec — implementation queued</h2>
            <p className="text-sm text-muted-foreground">
              This route is reserved per the front-end spec set. The detailed layout, fields, and workflow
              live in the corresponding markdown spec. Implementation lands in the matching build phase.
            </p>
          </div>

          {bullets && bullets.length > 0 && (
            <ul className="space-y-2 text-sm">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
          )}

          {specDoc && (
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/finance`}>
                  Back to Finance dashboard
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </Button>
              <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1.5 text-xs font-mono text-muted-foreground">
                docs/specs/finance/{specDoc}
              </span>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
