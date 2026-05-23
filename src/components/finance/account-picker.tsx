'use client';

import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { postingAccounts, type Account } from '@/lib/finance/coa-data';

type FilterKey = 'ALL' | 'CASH' | 'BANK' | 'AR' | 'AP' | 'FUND' | 'GL';

const FILTERS: { key: FilterKey; label: string; match: (a: Account) => boolean }[] = [
  { key: 'ALL',  label: 'All',      match: () => true },
  { key: 'CASH', label: 'Cash',     match: a => a.controlType === 'CASH' },
  { key: 'BANK', label: 'Bank',     match: a => a.controlType === 'BANK' },
  { key: 'AR',   label: 'Customer', match: a => a.controlType === 'AR' },
  { key: 'AP',   label: 'Supplier', match: a => a.controlType === 'AP' },
  { key: 'FUND', label: 'Donor',    match: a => a.controlType === 'FUND' },
  { key: 'GL',   label: 'GL',       match: a => !a.isControl },
];

interface AccountPickerProps {
  value?: string;
  onChange: (code: string) => void;
  placeholder?: string;
  className?: string;
  defaultFilter?: FilterKey;
}

export function AccountPicker({ value, onChange, placeholder = 'Pick account…', className, defaultFilter = 'ALL' }: AccountPickerProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<FilterKey>(defaultFilter);

  const all = useMemo(() => postingAccounts(), []);
  const selected = value ? all.find(a => a.code === value) : undefined;

  const filtered = useMemo(() => {
    const f = FILTERS.find(x => x.key === filter)!;
    return all
      .filter(a => f.match(a))
      .filter(a => !q || a.code.toLowerCase().includes(q.toLowerCase()) || a.name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 80);
  }, [all, filter, q]);

  // Group by type
  const grouped = useMemo(() => {
    const g: Record<string, Account[]> = {};
    for (const a of filtered) {
      const key = a.type[0] + a.type.slice(1).toLowerCase();
      (g[key] ||= []).push(a);
    }
    return g;
  }, [filtered]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn('justify-between font-normal h-9', className)}
        >
          {selected ? (
            <span className="flex items-center gap-2 truncate">
              <span className="font-mono text-xs text-muted-foreground">{selected.code}</span>
              <span className="truncate">{selected.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[420px]" align="start">
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Type code or name…"
              value={q}
              onChange={e => setQ(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  'text-[11px] font-semibold rounded-md px-2 py-1 ring-1 ring-inset transition-colors',
                  filter === f.key
                    ? 'bg-primary text-primary-foreground ring-primary'
                    : 'bg-muted text-muted-foreground ring-border hover:bg-muted-foreground/10',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <ScrollArea className="h-[320px]">
          {Object.keys(grouped).length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No accounts match.</div>
          ) : (
            <div className="p-1">
              {Object.entries(grouped).map(([type, list]) => (
                <div key={type} className="mb-1">
                  <div className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{type}</div>
                  {list.map(a => (
                    <button
                      key={a.code}
                      onClick={() => { onChange(a.code); setOpen(false); setQ(''); }}
                      className={cn(
                        'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left hover:bg-primary/10 transition-colors',
                        value === a.code && 'bg-primary/10',
                      )}
                    >
                      <Check className={cn('h-3.5 w-3.5 shrink-0', value === a.code ? 'opacity-100 text-primary' : 'opacity-0')} />
                      <span className="font-mono text-xs text-muted-foreground w-[80px] shrink-0">{a.code}</span>
                      <span className="text-sm flex-1 truncate">{a.name}</span>
                      {a.controlType && (
                        <span className="text-[9px] font-bold uppercase tracking-wide bg-muted text-muted-foreground rounded px-1.5 py-0.5 shrink-0">
                          {a.controlType}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-2 border-t flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{filtered.length} of {all.length} accounts</span>
          <span><kbd className="font-mono bg-muted px-1.5 py-0.5 rounded">↵</kbd> select</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
