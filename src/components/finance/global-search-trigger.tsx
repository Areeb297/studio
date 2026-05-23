'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { GlobalSearch } from './global-search';
import { Button } from '@/components/ui/button';

export function GlobalSearchTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K  · or F1
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || e.key === 'F1') {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="hidden md:inline-flex items-center gap-2 text-xs text-muted-foreground font-normal h-8 pl-2 pr-2 hover:text-foreground"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search…</span>
        <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">⌘K</kbd>
      </Button>
      <GlobalSearch open={open} onOpenChange={setOpen} />
    </>
  );
}
