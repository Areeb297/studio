'use client';

import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface HelperInfoProps {
  title: string;
  body: string | React.ReactNode;
  className?: string;
}

export function HelperInfo({ title, body, className }: HelperInfoProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors',
            className,
          )}
          aria-label={`Help: ${title}`}
        >
          <Info className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 text-xs p-3" side="top" align="center">
        <div className="font-bold text-sm mb-1">{title}</div>
        <div className="text-muted-foreground leading-relaxed">{body}</div>
      </PopoverContent>
    </Popover>
  );
}
