
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
import { BusinessLineSelector } from "@/components/business-line-selector";
import { Rahah24Chatbot } from "@/components/rahah24-chatbot";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface NavDivider {
  type: 'divider';
  label: string;
}

type NavItemType = NavItem | NavDivider;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const navItems: NavItemType[] = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/sales", icon: ShoppingCart, label: "Sales" },
    { href: "/dashboard/menu", icon: BookCopy, label: "Menu & Recipes" },
    { href: "/dashboard/inventory", icon: Warehouse, label: "Inventory" },
    { href: "/dashboard/events", icon: CalendarDays, label: "Events Booking" },
    { type: 'divider', label: 'Analysis' },
    { href: "/dashboard/reports", icon: LineChart, label: "Reports" },
    { href: "/dashboard/forecasting", icon: BrainCircuit, label: "Forecasting" },
    { href: "/dashboard/feedback", icon: MessageSquare, label: "Feedback" },
    { type: 'divider', label: 'Management' },
    { href: "/dashboard/finance", icon: Banknote, label: "Finance" },
    { href: "/dashboard/departments", icon: Building2, label: "Departments" },
    { href: "/dashboard/staff", icon: Users, label: "HR" },
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
              {navItems.map((item, index) =>
                'type' in item && item.type === 'divider' ? (
                  <div key={index} className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase">{item.label}</div>
                ) : (
                  <SidebarMenuItem key={(item as NavItem).href}>
                    <Link href={(item as NavItem).href} className="w-full">
                      <SidebarMenuButton isActive={pathname === (item as NavItem).href} tooltip={(item as NavItem).label}>
                        {React.createElement((item as NavItem).icon, { className: "h-4 w-4" })}
                        <span>{(item as NavItem).label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                )
              )}
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
              <div className="hidden md:block">
                <BusinessLineSelector currentBusinessLine={pathname.includes('/business/') ? pathname.split('/business/')[1]?.split('/')[0] : undefined} />
              </div>
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
