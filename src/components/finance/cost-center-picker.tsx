'use client';

import { Building2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COST_CENTERS } from '@/lib/finance/seed';
import { cn } from '@/lib/utils';

interface CostCenterPickerProps {
  value?: number | string;
  onChange: (id: string) => void;
  className?: string;
  placeholder?: string;
}

export function CostCenterPicker({ value, onChange, className, placeholder = 'Cost centre' }: CostCenterPickerProps) {
  return (
    <Select value={value ? String(value) : undefined} onValueChange={onChange}>
      <SelectTrigger className={cn('h-9', className)}>
        <Building2 className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {COST_CENTERS.map(c => (
          <SelectItem key={c.id} value={String(c.id)}>
            <span className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{c.code}</span>
              <span>{c.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
