'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Users, Truck, BookOpen, FileText, Receipt, Heart, Package,
  Wallet, Layers, ArrowRight, Sparkles,
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { customers, suppliers } from '@/lib/finance/ar-ap-data';
import { donors } from '@/lib/finance/donations-data';
import { accounts } from '@/lib/finance/coa-data';
import { vouchers } from '@/lib/finance/voucher-data';
import { fixedAssets } from '@/lib/finance/assets-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

type Group =
  | 'donors' | 'customers' | 'suppliers' | 'accounts' | 'vouchers' | 'assets' | 'shortcuts';

type Hit = {
  group: Group;
  icon: any;
  title: string;
  subtitle?: string;
  badge?: string;
  href: string;
};

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const groupMeta: Record<Group, { label: string; icon: any; tone: string }> = {
  shortcuts: { label: 'Quick actions', icon: Sparkles, tone: 'text-primary' },
  donors:    { label: 'Donors',        icon: Heart,    tone: 'text-rose-600' },
  customers: { label: 'Customers',     icon: Users,    tone: 'text-blue-600' },
  suppliers: { label: 'Suppliers',     icon: Truck,    tone: 'text-amber-600' },
  accounts:  { label: 'GL Accounts',   icon: BookOpen, tone: 'text-teal-600' },
  vouchers:  { label: 'Vouchers',      icon: FileText, tone: 'text-violet-600' },
  assets:    { label: 'Fixed Assets',  icon: Package,  tone: 'text-emerald-600' },
};

const shortcuts: Hit[] = [
  { group: 'shortcuts', icon: FileText,   title: 'New Journal Voucher',       subtitle: 'Ctrl + J',          href: '/dashboard/finance/vouchers' },
  { group: 'shortcuts', icon: Receipt,    title: 'New Customer Receipt',                                     href: '/dashboard/finance/ar/receipt' },
  { group: 'shortcuts', icon: Heart,      title: 'Collect Donation',                                         href: '/dashboard/finance/donations/collect' },
  { group: 'shortcuts', icon: Layers,     title: 'Batch Payment Run',                                        href: '/dashboard/finance/ap/batch' },
  { group: 'shortcuts', icon: Wallet,     title: 'Period Close',                                              href: '/dashboard/finance/period-close' },
];

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);

  const hits: Hit[] = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return shortcuts;

    const out: Hit[] = [];

    for (const d of donors) {
      if (d.name.toLowerCase().includes(term) || d.code.toLowerCase().includes(term) || d.cnic.includes(term) || d.phone.includes(term)) {
        out.push({ group: 'donors', icon: Heart, title: d.name, subtitle: `${d.code} · ${d.cnic} · ${formatPKR(d.totalGiving)} lifetime`, badge: d.zakatEligible ? 'Zakat' : undefined, href: `/dashboard/finance/donations/donors` });
      }
    }
    for (const c of customers) {
      if (c.name.toLowerCase().includes(term) || c.phone.includes(term)) {
        out.push({ group: 'customers', icon: Users, title: c.name, subtitle: `${c.contact} · open ${formatPKR(c.totalOpen)}`, href: `/dashboard/finance/ar` });
      }
    }
    for (const s of suppliers) {
      if (s.name.toLowerCase().includes(term)) {
        out.push({ group: 'suppliers', icon: Truck, title: s.name, subtitle: `${s.contact} · open ${formatPKR(s.totalOpen)}`, href: `/dashboard/finance/ap` });
      }
    }
    for (const a of accounts.filter(a => a.isPosting)) {
      if (a.code.includes(term) || a.name.toLowerCase().includes(term)) {
        out.push({ group: 'accounts', icon: BookOpen, title: `${a.code} · ${a.name}`, subtitle: a.controlType ?? a.type, badge: a.controlType, href: `/dashboard/finance/account-movement?account=${a.code}` });
      }
    }
    for (const v of vouchers) {
      if (v.number.toLowerCase().includes(term) || v.description.toLowerCase().includes(term)) {
        out.push({ group: 'vouchers', icon: FileText, title: v.number, subtitle: `${v.description} · ${formatPKR(v.amount)}`, badge: v.status, href: `/dashboard/finance/vouchers/list` });
      }
    }
    for (const a of fixedAssets) {
      if (a.code.toLowerCase().includes(term) || a.name.toLowerCase().includes(term) || a.vendor.toLowerCase().includes(term)) {
        out.push({ group: 'assets', icon: Package, title: a.name, subtitle: `${a.code} · NBV ${formatPKR(a.nbv)}`, href: `/dashboard/finance/assets` });
      }
    }

    return out.slice(0, 30);
  }, [q]);

  // Reset on open
  useEffect(() => {
    if (open) { setQ(''); setActive(0); }
  }, [open]);

  // Group results
  const grouped = useMemo(() => {
    const g: Record<string, Hit[]> = {};
    for (const h of hits) (g[h.group] ||= []).push(h);
    return g;
  }, [hits]);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(hits.length - 1, a + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
      else if (e.key === 'Enter' && hits[active]) {
        e.preventDefault();
        router.push(hits[active].href);
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [open, hits, active, router, onOpenChange]);

  let runningIdx = -1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl gap-0 overflow-hidden">
        <div className="border-b border-border p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Search donors, customers, suppliers, vouchers, accounts, assets…"
              value={q}
              onChange={e => { setQ(e.target.value); setActive(0); }}
              className="pl-9 h-11 text-base border-0 focus-visible:ring-0 shadow-none"
            />
          </div>
        </div>

        <ScrollArea className="h-[420px]">
          {hits.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No results for <span className="font-semibold text-foreground">"{q}"</span>
            </div>
          ) : (
            <div className="p-2">
              {(Object.keys(grouped) as Group[]).map(g => {
                const meta = groupMeta[g];
                const list = grouped[g];
                return (
                  <div key={g} className="mb-2">
                    <div className={cn('flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider font-bold', meta.tone)}>
                      <meta.icon className="h-3 w-3" /> {meta.label}
                    </div>
                    {list.map(h => {
                      runningIdx += 1;
                      const isActive = runningIdx === active;
                      return (
                        <button
                          key={h.title + h.href}
                          onClick={() => { router.push(h.href); onOpenChange(false); }}
                          onMouseEnter={() => setActive(runningIdx)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                            isActive ? 'bg-primary/10' : 'hover:bg-muted/60',
                          )}
                        >
                          <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg', isActive ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                            <h.icon className="h-4 w-4" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">{h.title}</div>
                            {h.subtitle && <div className="text-xs text-muted-foreground truncate">{h.subtitle}</div>}
                          </div>
                          {h.badge && (
                            <span className="text-[9px] font-bold uppercase bg-muted text-muted-foreground rounded px-1.5 py-0.5 shrink-0">
                              {h.badge}
                            </span>
                          )}
                          {isActive && <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-border px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground bg-muted/30">
          <span>{hits.length} results</span>
          <div className="flex gap-3">
            <span><kbd className="font-mono bg-card px-1.5 py-0.5 rounded ring-1 ring-border">↑↓</kbd> navigate</span>
            <span><kbd className="font-mono bg-card px-1.5 py-0.5 rounded ring-1 ring-border">↵</kbd> open</span>
            <span><kbd className="font-mono bg-card px-1.5 py-0.5 rounded ring-1 ring-border">esc</kbd> close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
