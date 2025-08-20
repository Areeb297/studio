
'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookCopy,
  Warehouse,
  ShoppingCart,
  Banknote,
  CalendarDays,
  Users,
  MessageSquare,
  Building2,
  BrainCircuit,
  LineChart,
  Bell,
  Settings,
  ChefHat,
  GraduationCap,
  DollarSign,
  UserCheck,
  Package,
  Home,
  Zap,
  Wrench,
  ShoppingBag,
  Heart,
  Moon,
  FileText,
  TrendingUp,
  Shield,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  UserCog,
  Clock,
  Award,
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import Logo from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { ErrorBoundary } from "@/components/error-boundary";
import { Rahah24Chatbot } from "@/components/rahah24-chatbot";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface NavSection {
  type: 'section';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
  defaultExpanded?: boolean;
}

interface NavDivider {
  type: 'divider';
  label: string;
}

type NavItemType = NavItem | NavSection | NavDivider;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['executive', 'business']);

  const toggleSection = (sectionLabel: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionLabel) 
        ? prev.filter(s => s !== sectionLabel)
        : [...prev, sectionLabel]
    );
  };

  const navItems: NavItemType[] = [
    // Executive Dashboard
    {
      type: 'section',
      label: 'executive',
      icon: TrendingUp,
      defaultExpanded: true,
      items: [
        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard Overview" },
        { href: "/dashboard/analytics", icon: LineChart, label: "KPI Analytics" },
        { href: "/dashboard/forecasting", icon: BrainCircuit, label: "AI Insights" },
      ]
    },

    // Business Operations
    {
      type: 'section',
      label: 'business',
      icon: Building2,
      defaultExpanded: true,
      items: [
        { href: "/dashboard/business/restaurant", icon: ChefHat, label: "Restaurant & Catering" },
        { href: "/dashboard/business/madrasa", icon: GraduationCap, label: "Academic (Madrasa)" },
        { href: "/dashboard/business/shadi-lawn", icon: CalendarDays, label: "Events (Shadi Lawn)" },
        { href: "/dashboard/business/gym-time", icon: Heart, label: "Fitness (Gym Time)" },
      ]
    },

    // Financial Management
    {
      type: 'section',
      label: 'financial',
      icon: DollarSign,
      items: [
        { href: "/dashboard/finance", icon: Banknote, label: "General Ledger" },
        { href: "/dashboard/donations", icon: Heart, label: "Donations & Zakat" },
        { href: "/dashboard/sales", icon: ShoppingCart, label: "Sales Management" },
        { href: "/dashboard/finance/reports", icon: FileText, label: "Financial Reports" },
      ]
    },

    // Academic Affairs
    {
      type: 'section',
      label: 'academic',
      icon: GraduationCap,
      items: [
        { href: "/dashboard/academic", icon: GraduationCap, label: "Student Management" },
        { href: "/dashboard/academic/fees", icon: DollarSign, label: "Fee Collection" },
        { href: "/dashboard/academic/attendance", icon: UserCheck, label: "Attendance & Grading" },
        { href: "/dashboard/academic/reports", icon: FileText, label: "Academic Reports" },
      ]
    },

    // Human Resources
    {
      type: 'section',
      label: 'hr',
      icon: Users,
      items: [
        { href: "/dashboard/hr", icon: Users, label: "HR Overview" },
        { href: "/dashboard/hr/employees", icon: UserCog, label: "Employee Management" },
        { href: "/dashboard/hr/attendance", icon: Clock, label: "Attendance & Leave" },
        { href: "/dashboard/hr/talent", icon: Award, label: "Talent Management" },
        { href: "/dashboard/hr/payroll", icon: Banknote, label: "Payroll & Benefits" },
        { href: "/dashboard/departments", icon: Building2, label: "Departments" },
      ]
    },

    // Operations
    {
      type: 'section',
      label: 'operations',
      icon: Package,
      items: [
        { href: "/dashboard/inventory", icon: Warehouse, label: "Inventory Management" },
        { href: "/dashboard/procurement", icon: ShoppingBag, label: "Procurement Dashboard" },
        { href: "/dashboard/procurement/requisitions", icon: FileText, label: "Purchase Requisitions" },
        { href: "/dashboard/procurement/purchase-orders", icon: ShoppingCart, label: "Purchase Orders" },
        { href: "/dashboard/procurement/vendors", icon: Users, label: "Vendor Management" },
        { href: "/dashboard/procurement/analytics", icon: LineChart, label: "Procurement Analytics" },
        { href: "/dashboard/facilities", icon: Wrench, label: "Facilities Management" },
        { href: "/dashboard/utilities", icon: Zap, label: "Utilities Management" },
        { href: "/dashboard/rent", icon: Home, label: "Rent & Properties" },
      ]
    },

    // Islamic Services
    {
      type: 'section',
      label: 'islamic',
      icon: Moon,
      items: [
        { href: "/dashboard/qurbani", icon: Heart, label: "Qurbani Management" },
        { href: "/dashboard/donations", icon: Heart, label: "Donation Campaigns" },
        { href: "/dashboard/events", icon: CalendarDays, label: "Islamic Events" },
        { href: "/dashboard/feedback", icon: MessageSquare, label: "Community Feedback" },
      ]
    },

    { type: 'divider', label: 'System' },
    { href: "/dashboard/settings", icon: Settings, label: "Settings & Configuration" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background overflow-x-hidden">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3 p-2">
              <Logo />
              <span className="text-xl font-semibold font-headline">Rahah24</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {navItems.map((item, index) => {
                if ('type' in item) {
                  if (item.type === 'divider') {
                    return (
                      <div key={index} className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {item.label}
                      </div>
                    );
                  } else if (item.type === 'section') {
                    const section = item as NavSection;
                    const isExpanded = expandedSections.includes(section.label);
                    const hasActiveItem = section.items.some(subItem => 
                      pathname === subItem.href || 
                      (subItem.href !== '/dashboard' && pathname.startsWith(subItem.href + '/'))
                    );
                    
                    return (
                      <div key={index} className="mb-2">
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            onClick={() => toggleSection(section.label)}
                            className={`w-full justify-between font-medium text-sm ${hasActiveItem ? 'bg-accent text-accent-foreground' : ''}`}
                          >
                            <div className="flex items-center gap-2">
                              {React.createElement(section.icon, { className: "h-4 w-4" })}
                              <span className="capitalize">{section.label === 'hr' ? 'Human Resources' : section.label.replace('_', ' ')}</span>
                            </div>
                            {isExpanded ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        
                        {isExpanded && (
                          <div className="ml-4 mt-1 space-y-1">
                            {section.items.map((subItem) => (
                              <SidebarMenuItem key={subItem.href}>
                                <Link href={subItem.href} className="w-full">
                                  <SidebarMenuButton 
                                    isActive={pathname === subItem.href || pathname.startsWith(subItem.href + '/')}
                                    className="text-sm pl-6"
                                    tooltip={subItem.label}
                                  >
                                    {React.createElement(subItem.icon, { className: "h-3 w-3" })}
                                    <span>{subItem.label}</span>
                                  </SidebarMenuButton>
                                </Link>
                              </SidebarMenuItem>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                } else {
                  const navItem = item as NavItem;
                  return (
                    <SidebarMenuItem key={navItem.href}>
                      <Link href={navItem.href} className="w-full">
                        <SidebarMenuButton isActive={pathname === navItem.href} tooltip={navItem.label}>
                          {React.createElement(navItem.icon, { className: "h-4 w-4" })}
                          <span>{navItem.label}</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  );
                }
                return null;
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Separator className="my-2" />
             <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1 w-full min-w-0">
          <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-lg sm:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden"/>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
              <UserNav />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 bg-secondary/50 w-full min-w-0 overflow-x-hidden">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
        
        {/* Global Rahah24 AI Chatbot */}
        <Rahah24Chatbot />
      </div>
    </SidebarProvider>
  );
}
