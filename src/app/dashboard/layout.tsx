
'use client';

import React, { useState, useEffect } from "react";
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
  Receipt,
  UtensilsCrossed,
  Calculator,
  Truck,
  PackageCheck,
  AlertCircle,
  HandCoins,
  Calendar,
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
  SidebarRail,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import Logo from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { ErrorBoundary } from "@/components/error-boundary";
import { Rahah24Chatbot } from "@/components/rahah24-chatbot";
import { authService } from "@/lib/auth";

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
  const [expandedSections, setExpandedSections] = React.useState<string[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch current user role on mount
  useEffect(() => {
    authService.getCurrentUser().then(user => {
      const role = user?.role || null;
      setUserRole(role);

      // Set default expanded sections based on role
      if (role === 'admin') {
        setExpandedSections(['executive', 'business', 'inventory_procurement']);
      } else if (['store_keeper', 'purchasing_officer', 'approver_l1', 'approver_l2', 'gm'].includes(role || '')) {
        setExpandedSections(['inventory_procurement']);
      } else if (['finance_officer', 'auditor'].includes(role || '')) {
        setExpandedSections(['financial', 'inventory_procurement']);
      } else if (role === 'dept_head_kitchen') {
        setExpandedSections(['business', 'inventory_procurement']);
      } else if (role === 'manager') {
        setExpandedSections(['executive', 'business']);
      } else if (role === 'staff') {
        setExpandedSections(['business']);
      }
    });
  }, []);

  const toggleSection = (sectionLabel: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionLabel)
        ? prev.filter(s => s !== sectionLabel)
        : [...prev, sectionLabel]
    );
  };

  // Role-based section visibility
  const getSectionVisibility = (sectionLabel: string): boolean => {
    // Admin sees everything
    if (userRole === 'admin') return true;

    // Role-based permissions mapping based on USER_ROLES.md
    const rolePermissions: Record<string, string[]> = {
      // Inventory & Procurement users
      'store_keeper': ['inventory_procurement'],
      'dept_head_kitchen': ['inventory_procurement', 'business'], // Has access to Recipe Costing in business
      'purchasing_officer': ['inventory_procurement'],
      'approver_l1': ['inventory_procurement'],
      'approver_l2': ['inventory_procurement'],
      'gm': ['inventory_procurement'],
      'finance_officer': ['financial', 'inventory_procurement'],
      'auditor': ['financial', 'inventory_procurement'],
      // Other roles
      'manager': ['executive', 'business', 'financial', 'academic_affairs', 'hr', 'inventory_procurement', 'facilities_operations', 'islamic'],
      'staff': ['business', 'inventory_procurement'],
    };

    const allowedSections = rolePermissions[userRole || ''] || [];
    return allowedSections.includes(sectionLabel);
  };

  // Check if Settings should be visible (admin only)
  const canAccessSettings = (): boolean => {
    return userRole === 'admin';
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
        { href: "/dashboard/business/restaurant/pos", icon: Receipt, label: "POS System" },
        { href: "/dashboard/business/restaurant/menu", icon: UtensilsCrossed, label: "Menu Management" },
        { href: "/dashboard/business/madrasa", icon: GraduationCap, label: "Academic (Madrasa)" },
        { href: "/dashboard/business/shadi-lawn", icon: CalendarDays, label: "Events (Shadi Lawn)" },
        { href: "/dashboard/business/gym-time", icon: Heart, label: "Fitness (Gym Time)" },
      ]
    },

    // Financial Management & Accounting
    {
      type: 'section',
      label: 'financial',
      icon: DollarSign,
      items: [
        { href: "/dashboard/finance", icon: Banknote, label: "General Ledger" },
        { href: "/dashboard/finance/accounts", icon: FileText, label: "Chart of Accounts" },
        { href: "/dashboard/finance/journal-entries", icon: ClipboardList, label: "Journal Entries" },
        { href: "/dashboard/finance/trial-balance", icon: LineChart, label: "Trial Balance" },
        { href: "/dashboard/finance/accounts-receivable", icon: TrendingUp, label: "Accounts Receivable" },
        { href: "/dashboard/finance/accounts-payable", icon: TrendingUp, label: "Accounts Payable" },
        { href: "/dashboard/finance/bank-reconciliation", icon: Shield, label: "Bank Reconciliation" },
        { href: "/dashboard/finance/reports", icon: FileText, label: "Financial Reports" },
        { href: "/dashboard/sales", icon: ShoppingCart, label: "Sales Management" },
      ]
    },

    // Academic Affairs & Fee Collection
    {
      type: 'section',
      label: 'academic_affairs',
      icon: GraduationCap,
      items: [
        { href: "/dashboard/academic", icon: DollarSign, label: "Fee Collection" },
        { href: "/dashboard/academic/students", icon: Users, label: "Student Registration" },
        { href: "/dashboard/academic/sponsorship", icon: HandCoins, label: "Donor-Student Sponsorship" },
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

    // Inventory & Procurement
    {
      type: 'section',
      label: 'inventory_procurement',
      icon: Package,
      items: [
        { href: "/dashboard/inventory", icon: Warehouse, label: "Inventory Dashboard" },
        { href: "/dashboard/inventory/stock-levels", icon: TrendingUp, label: "Stock Level Controls" },
        { href: "/dashboard/procurement/requisitions", icon: FileText, label: "Purchase Requisitions" },
        { href: "/dashboard/procurement/purchase-orders", icon: ShoppingCart, label: "Purchase Orders" },
        { href: "/dashboard/procurement/grn", icon: PackageCheck, label: "Goods Receipt Notes" },
        { href: "/dashboard/procurement/vendors", icon: Users, label: "Vendor Management" },
        { href: "/dashboard/vendor-approvals", icon: UserCheck, label: "Vendor Approvals" },
        { href: "/dashboard/procurement/analytics", icon: LineChart, label: "Procurement Analytics" },
        { href: "/dashboard/inventory/department-requisitions", icon: ClipboardList, label: "Department Requisitions" },
        { href: "/dashboard/inventory/recipe-costing", icon: Calculator, label: "Recipe Costing" },
        { href: "/dashboard/inventory/expiry-warranty", icon: AlertCircle, label: "Expiry & Warranty Tracking" },
      ]
    },

    // Facilities & Operations
    {
      type: 'section',
      label: 'facilities_operations',
      icon: Wrench,
      items: [
        { href: "/dashboard/facilities", icon: Wrench, label: "Facilities Management" },
        { href: "/dashboard/utilities", icon: Zap, label: "Utilities Management" },
        { href: "/dashboard/rent", icon: Home, label: "Rental & Asset Income" },
        { href: "/dashboard/facilities/maintenance", icon: Truck, label: "Maintenance Management" },
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
        { href: "/dashboard/donations/zakat", icon: HandCoins, label: "Zakat Management" },
        { href: "/dashboard/events", icon: Calendar, label: "Islamic Events Calendar" },
        { href: "/dashboard/feedback", icon: MessageSquare, label: "Community Feedback" },
      ]
    },

    { type: 'divider', label: 'System' },
    { href: "/dashboard/settings", icon: Settings, label: "Settings & Configuration" },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => {
    // During initial load (userRole is null), show nothing to avoid flashing unauthorized content
    if (userRole === null) return false;

    if ('type' in item) {
      // Filter sections based on role
      if (item.type === 'section') {
        return getSectionVisibility(item.label);
      }
      // Show divider only for admin (before Settings)
      if (item.type === 'divider') {
        return canAccessSettings();
      }
    } else {
      // Filter Settings link - only admin can access
      if ('href' in item && item.href === '/dashboard/settings') {
        return canAccessSettings();
      }
    }
    return true;
  });

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background overflow-x-hidden">
        <Sidebar collapsible="offcanvas">
          <SidebarHeader>
            <div className="flex items-center gap-3 p-2">
              <Logo />
              <span className="text-xl font-semibold font-headline">Rahah24</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {filteredNavItems.map((item, index) => {
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
                            className={`w-full justify-between font-medium text-sm py-3 ${hasActiveItem ? 'bg-accent text-accent-foreground' : ''}`}
                          >
                            <div className="flex items-center gap-2">
                              {React.createElement(section.icon, { className: "h-4 w-4" })}
                              <span className="capitalize">
                                {section.label === 'hr' ? 'Human Resources'
                                  : section.label === 'academic_affairs' ? 'Academic Affairs'
                                  : section.label === 'inventory_procurement' ? 'Inventory & Procurement'
                                  : section.label === 'facilities_operations' ? 'Facilities & Operations'
                                  : section.label.replace(/_/g, ' ')}
                              </span>
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
                        <SidebarMenuButton isActive={pathname === navItem.href}>
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
            {canAccessSettings() && (
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/dashboard/settings" className="w-full">
                    <SidebarMenuButton>
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1 w-full min-w-0">
          <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b shrink-0 bg-background/80 backdrop-blur-lg sm:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
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
