'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChefHat, Calendar, Dumbbell, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';

type BusinessLine = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  theme: string;
  description: string;
};

const businessLines: BusinessLine[] = [
  {
    id: 'restaurant',
    name: 'Binoria Restaurant',
    icon: ChefHat,
    href: '/dashboard/business/restaurant',
    theme: 'bg-green-500',
    description: 'Food service and kitchen operations'
  },
  {
    id: 'shadi-lawn',
    name: 'Shadi Lawn',
    icon: Calendar,
    href: '/dashboard/business/shadi-lawn',
    theme: 'bg-purple-500',
    description: 'Event venue and marriage hall'
  },
  {
    id: 'gym-time',
    name: 'Gym Time',
    icon: Dumbbell,
    href: '/dashboard/business/gym-time',
    theme: 'bg-blue-500',
    description: 'Fitness center and wellness'
  },
  {
    id: 'madrasa',
    name: 'Tahfeez Madrasa',
    icon: GraduationCap,
    href: '/dashboard/business/madrasa',
    theme: 'bg-orange-500',
    description: 'Islamic education and teaching'
  }
];

interface BusinessLineSelectorProps {
  currentBusinessLine?: string;
}

export function BusinessLineSelector({ currentBusinessLine }: BusinessLineSelectorProps) {
  const router = useRouter();
  const [selectedBusiness, setSelectedBusiness] = useState(
    businessLines.find(bl => bl.id === currentBusinessLine) || businessLines[0]
  );

  const handleBusinessLineChange = (businessLine: BusinessLine) => {
    setSelectedBusiness(businessLine);
    router.push(businessLine.href);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 min-w-[200px]">
          <div className={`w-3 h-3 rounded-full ${selectedBusiness.theme}`} />
          <selectedBusiness.icon className="h-4 w-4" />
          <span className="flex-1 text-left">{selectedBusiness.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px]" align="start">
        {businessLines.map((businessLine) => (
          <DropdownMenuItem
            key={businessLine.id}
            onClick={() => handleBusinessLineChange(businessLine)}
            className="flex items-center gap-3 p-3 cursor-pointer"
          >
            <div className={`w-3 h-3 rounded-full ${businessLine.theme}`} />
            <businessLine.icon className="h-5 w-5" />
            <div className="flex-1">
              <div className="font-medium">{businessLine.name}</div>
              <div className="text-xs text-muted-foreground">{businessLine.description}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}