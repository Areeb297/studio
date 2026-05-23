
'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Warehouse,
  ShoppingCart,
  Banknote,
  Users,
  Building2,
  LineChart,
  Bell,
  Settings,
  DollarSign,
  UserCheck,
  Package,
  FileText,
  TrendingUp,
  Shield,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Receipt,
  Calculator,
  Truck,
  PackageCheck,
  AlertCircle,
  ArrowLeftRight,
  BarChart3,
  CheckSquare,
  History,
  Factory,
  BookOpen,
  Wrench,
  RotateCcw,
  UserCircle,
  Tag,
  Scale,
  BarChart2,
  RefreshCcw,
  Boxes,
  CreditCard,
  FileCheck,
  ShoppingBag,
  Layers,
  UtensilsCrossed,
  Heart,
  HandCoins,
  Scissors,
  CalendarDays,
  Wallet,
  PiggyBank,
  BookMarked,
  LayoutGrid,
  UserSquare,
  KeyRound,
  FileBarChart,
  AlertTriangle,
  ListOrdered,
  Flame,
  Clock,
  Monitor,
  Star,
  Gift,
  Coffee,
  TableProperties,
  XCircle,
  UserCog,
  ArrowRightLeft,
  Activity,
  Plus,
  Upload,
  Target,
  Lock,
  Search,
  TrendingDown,
  ArrowDownRight,
  ArrowUpRight,
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
import { GlobalSearchTrigger } from "@/components/finance/global-search-trigger";
import { authService } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// ── Company / tenant registry ─────────────────────────────────────────────────
const COMPANIES = [
  { id: 'JBA-MAIN', name: 'Jamia Binoria Aalamia', short: 'JBA', type: 'Main Entity',  color: 'bg-blue-600',   dot: 'bg-blue-500' },
  { id: 'JBA-REST', name: 'Rahah24 Restaurant',    short: 'R',   type: 'Business Unit', color: 'bg-orange-500', dot: 'bg-orange-500' },
  { id: 'JBA-GYM',  name: 'Gym Time Fitness',      short: 'G',   type: 'Business Unit', color: 'bg-green-600',  dot: 'bg-green-500' },
  { id: 'JBA-LAWN', name: 'Shadi Lawn Events',      short: 'SL',  type: 'Business Unit', color: 'bg-purple-500', dot: 'bg-purple-500' },
  { id: 'JBA-ACM',  name: 'Madrasa Academic',       short: 'MA',  type: 'Business Unit', color: 'bg-teal-600',   dot: 'bg-teal-500' },
];

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  group?: string;   // optional sub-section header inside a section
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
  const [activeCompany, setActiveCompany] = useState(COMPANIES[0]);

  // Fetch current user role on mount
  useEffect(() => {
    authService.getCurrentUser().then(user => {
      const role = user?.role || null;
      setUserRole(role);

      // Set default expanded sections based on role
      if (role === 'admin') {
        setExpandedSections(['pos', 'procurement', 'approvals', 'inventory']);
      } else if (['store_keeper', 'purchasing_officer', 'approver_l1', 'approver_l2', 'gm'].includes(role || '')) {
        setExpandedSections(['procurement', 'approvals', 'inventory']);
      } else if (['finance_officer', 'auditor'].includes(role || '')) {
        setExpandedSections(['finance', 'finance_donations']);
      } else if (role === 'dept_head_kitchen') {
        setExpandedSections(['pos', 'procurement', 'inventory', 'production']);
      } else if (role === 'manager') {
        setExpandedSections(['pos', 'procurement', 'approvals']);
      } else {
        setExpandedSections(['pos', 'procurement']);
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
    if (userRole === 'admin') return true;

    const rolePermissions: Record<string, string[]> = {
      'store_keeper': ['procurement', 'approvals', 'inventory', 'reports'],
      'dept_head_kitchen': ['pos', 'procurement', 'approvals', 'inventory', 'production', 'reports'],
      'purchasing_officer': ['procurement', 'approvals', 'inventory', 'returns', 'reports'],
      'approver_l1': ['procurement', 'approvals', 'inventory', 'reports'],
      'approver_l2': ['procurement', 'approvals', 'inventory', 'reports'],
      'gm': ['pos', 'procurement', 'approvals', 'inventory', 'production', 'sales', 'returns', 'finance', 'finance_donations', 'qurbani', 'reports'],
      'finance_officer': ['procurement', 'approvals', 'inventory', 'finance', 'finance_donations', 'reports'],
      'auditor': ['procurement', 'approvals', 'inventory', 'finance', 'finance_donations', 'reports'],
      'manager': ['pos', 'procurement', 'approvals', 'inventory', 'production', 'sales', 'returns', 'finance', 'finance_donations', 'qurbani', 'reports', 'admin'],
      'staff': ['pos', 'procurement', 'inventory'],
    };

    const allowedSections = rolePermissions[userRole || ''] || [];
    return allowedSections.includes(sectionLabel);
  };

  // Check if divider should be visible
  const canAccessSettings = (): boolean => {
    return true; // Account section always visible
  };

  const navItems: NavItemType[] = [
    // ERP Portal — workspace chooser (Odoo-style hub)
    { href: "/portal", icon: LayoutGrid, label: "ERP Portal" },

    // Dashboard
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },

    // Point of Sale
    {
      type: 'section',
      label: 'pos',
      icon: UtensilsCrossed,
      items: [
        { href: "/dashboard/pos", icon: LayoutGrid, label: "POS Terminal" },
        { href: "/dashboard/pos/kitchen", icon: Monitor, label: "Kitchen Display" },
        { href: "/dashboard/pos/tables", icon: TableProperties, label: "Table Management" },
        { href: "/dashboard/pos/orders", icon: ListOrdered, label: "Order History" },
        { href: "/dashboard/pos/kot", icon: Flame, label: "KOT History" },
        { href: "/dashboard/pos/provisional", icon: Receipt, label: "Provisional Invoice" },
        { href: "/dashboard/pos/table-shift", icon: ArrowRightLeft, label: "Table Shifting" },
        { href: "/dashboard/pos/menu", icon: BookMarked, label: "Menu Management" },
        { href: "/dashboard/pos/combos", icon: Coffee, label: "Combo Deals" },
        { href: "/dashboard/pos/loyalty", icon: Star, label: "Loyalty Program" },
        { href: "/dashboard/pos/shift", icon: Clock, label: "Cashier Shift" },
        { href: "/dashboard/pos/voids", icon: XCircle, label: "Voids & Refunds" },
        { href: "/dashboard/pos/booking", icon: CalendarDays, label: "Event Booking" },
      ]
    },

    // Procurement
    {
      type: 'section',
      label: 'procurement',
      icon: ShoppingCart,
      items: [
        { href: "/dashboard/procurement/requisitions", icon: ClipboardList, label: "Purchase Requisitions" },
        { href: "/dashboard/procurement/purchase-orders", icon: ShoppingBag, label: "Purchase Orders" },
        { href: "/dashboard/procurement/grn", icon: PackageCheck, label: "Goods Receipt Notes" },
        { href: "/dashboard/procurement/invoices", icon: Receipt, label: "Purchase Invoices" },
        { href: "/dashboard/procurement/supplier-payments", icon: CreditCard, label: "Supplier Payments" },
        { href: "/dashboard/procurement/vendors", icon: Truck, label: "Vendors / Suppliers" },
      ]
    },

    // Approvals (expanded to match real ERP)
    {
      type: 'section',
      label: 'approvals',
      icon: CheckSquare,
      items: [
        { href: "/dashboard/approvals", icon: FileCheck, label: "Pending Approvals" },
        { href: "/dashboard/approvals/requisitions", icon: ClipboardList, label: "Approve Requisitions" },
        { href: "/dashboard/approvals/returns", icon: RotateCcw, label: "Approve Returns" },
        { href: "/dashboard/approvals/finance", icon: DollarSign, label: "Finance Approvals" },
        { href: "/dashboard/approvals/payments", icon: CreditCard, label: "Approve Payments" },
        { href: "/dashboard/approvals/inventory", icon: Package, label: "Inventory Approvals" },
        { href: "/dashboard/approvals/history", icon: History, label: "Approval History" },
      ]
    },

    // Inventory
    {
      type: 'section',
      label: 'inventory',
      icon: Package,
      items: [
        { href: "/dashboard/inventory", icon: Warehouse, label: "Inventory Dashboard" },
        { href: "/dashboard/inventory/stock-levels", icon: Boxes, label: "Stock Levels" },
        { href: "/dashboard/inventory/stock-issues", icon: ArrowLeftRight, label: "Stock Issues" },
        { href: "/dashboard/inventory/stock-transfers", icon: RefreshCcw, label: "Stock Transfers" },
        { href: "/dashboard/inventory/stock-adjustments", icon: Scale, label: "Stock Adjustments" },
        { href: "/dashboard/inventory/physical-count", icon: ClipboardList, label: "Physical Stock Count" },
        { href: "/dashboard/inventory/items", icon: Tag, label: "Items Master" },
        { href: "/dashboard/inventory/categories", icon: Layers, label: "Categories" },
        { href: "/dashboard/inventory/expiry-warranty", icon: AlertCircle, label: "Expiry Tracking" },
      ]
    },

    // Production
    {
      type: 'section',
      label: 'production',
      icon: Factory,
      items: [
        { href: "/dashboard/production/bom", icon: BookOpen, label: "Bill of Materials" },
        { href: "/dashboard/production/work-orders", icon: Wrench, label: "Work Orders" },
        { href: "/dashboard/inventory/recipe-costing", icon: Calculator, label: "Recipe Costing" },
      ]
    },

    // Sales
    {
      type: 'section',
      label: 'sales',
      icon: TrendingUp,
      items: [
        { href: "/dashboard/sales/orders", icon: ShoppingCart, label: "Sales Orders" },
        { href: "/dashboard/sales/invoices", icon: Receipt, label: "Invoices" },
        { href: "/dashboard/sales/customers", icon: Users, label: "Customers" },
        { href: "/dashboard/sales/delivery-notes", icon: Truck, label: "Delivery Notes" },
        { href: "/dashboard/sales/customer-receipts", icon: Wallet, label: "Customer Receipts" },
      ]
    },

    // Returns
    {
      type: 'section',
      label: 'returns',
      icon: RotateCcw,
      items: [
        { href: "/dashboard/returns/purchase", icon: RotateCcw, label: "Purchase Return" },
        { href: "/dashboard/returns/sales", icon: RotateCcw, label: "Sales Return" },
      ]
    },

    // Finance — single folder with grouped sub-items
    {
      type: 'section',
      label: 'finance',
      icon: Wallet,
      items: [
        // Overview
        { group: 'Overview',          href: "/dashboard/finance",                                  icon: LayoutDashboard, label: "Finance Dashboard" },
        { group: 'Overview',          href: "/dashboard/finance/period-close",                     icon: KeyRound,        label: "Period Close" },
        { group: 'Overview',          href: "/dashboard/finance/approvals/journals",               icon: CheckSquare,     label: "Approvals" },

        // Setup
        { group: 'Setup',             href: "/dashboard/finance/accounts",                         icon: BookOpen,        label: "Chart of Accounts" },
        { group: 'Setup',             href: "/dashboard/finance/accounts/tree",                    icon: Layers,          label: "Account Tree" },
        { group: 'Setup',             href: "/dashboard/finance/cost-centers",                     icon: Building2,       label: "Cost Centers" },
        { group: 'Setup',             href: "/dashboard/finance/fiscal-periods",                   icon: CalendarDays,    label: "Fiscal Periods" },
        { group: 'Setup',             href: "/dashboard/finance/bank-accounts",                    icon: PiggyBank,       label: "Bank Accounts" },
        { group: 'Setup',             href: "/dashboard/finance/tax-codes",                        icon: Receipt,         label: "Tax Codes" },
        { group: 'Setup',             href: "/dashboard/finance/fx-rates",                         icon: ArrowLeftRight,  label: "FX Rates" },
        { group: 'Setup',             href: "/dashboard/finance/payment-terms",                    icon: Clock,           label: "Payment Terms" },

        // General Ledger
        { group: 'General Ledger',    href: "/dashboard/finance/vouchers",                         icon: FileText,        label: "Unified Voucher" },
        { group: 'General Ledger',    href: "/dashboard/finance/vouchers/list",                    icon: ListOrdered,     label: "Voucher List" },
        { group: 'General Ledger',    href: "/dashboard/finance/vouchers/memories",                icon: Star,            label: "Voucher Memories" },
        { group: 'General Ledger',    href: "/dashboard/finance/vouchers/recurring",               icon: RefreshCcw,      label: "Recurring Journals" },
        { group: 'General Ledger',    href: "/dashboard/finance/gl-transactions",                  icon: BookMarked,      label: "GL Transactions" },
        { group: 'General Ledger',    href: "/dashboard/finance/account-movement",                 icon: Activity,        label: "Account Movement" },
        { group: 'General Ledger',    href: "/dashboard/finance/vouchers/receipt",                 icon: ArrowDownRight,  label: "Simplified Receipt" },
        { group: 'General Ledger',    href: "/dashboard/finance/vouchers/payment",                 icon: ArrowUpRight,    label: "Simplified Payment" },
        { group: 'General Ledger',    href: "/dashboard/finance/vouchers/gl-invoice",              icon: FileBarChart,    label: "GL Invoice" },
        { group: 'General Ledger',    href: "/dashboard/finance/vouchers/gl-bill",                 icon: FileText,        label: "GL Bill" },

        // Receivables
        { group: 'Receivables',       href: "/dashboard/finance/ar",                               icon: Users,           label: "AR Dashboard" },
        { group: 'Receivables',       href: "/dashboard/finance/ar/invoice",                       icon: Receipt,         label: "Customer Invoice" },
        { group: 'Receivables',       href: "/dashboard/finance/ar/receipt",                       icon: HandCoins,       label: "Customer Receipt" },
        { group: 'Receivables',       href: "/dashboard/finance/ar/credit-note",                   icon: RotateCcw,       label: "Credit Note" },
        { group: 'Receivables',       href: "/dashboard/finance/ar/allocation",                    icon: ArrowLeftRight,  label: "Allocation" },
        { group: 'Receivables',       href: "/dashboard/finance/ar/write-off",                     icon: XCircle,         label: "Write-Off" },
        { group: 'Receivables',       href: "/dashboard/finance/ar/statement",                     icon: FileText,        label: "Customer Statement" },

        // Payables
        { group: 'Payables',          href: "/dashboard/finance/ap",                               icon: Truck,           label: "AP Dashboard" },
        { group: 'Payables',          href: "/dashboard/finance/ap/invoice",                       icon: Receipt,         label: "Supplier Invoice" },
        { group: 'Payables',          href: "/dashboard/finance/ap/payment",                       icon: CreditCard,      label: "Supplier Payment" },
        { group: 'Payables',          href: "/dashboard/finance/ap/batch",                         icon: Layers,          label: "Batch Payment Run" },
        { group: 'Payables',          href: "/dashboard/finance/ap/debit-note",                    icon: RotateCcw,       label: "Debit Note" },
        { group: 'Payables',          href: "/dashboard/finance/ap/allocation",                    icon: ArrowLeftRight,  label: "Allocation" },
        { group: 'Payables',          href: "/dashboard/finance/ap/statement",                     icon: FileText,        label: "Supplier Statement" },

        // Cash & Bank
        { group: 'Cash & Bank',       href: "/dashboard/finance/bank/deposit",                     icon: ArrowDownRight,  label: "Cash Deposit" },
        { group: 'Cash & Bank',       href: "/dashboard/finance/bank/withdrawal",                  icon: ArrowUpRight,    label: "Cash Withdrawal" },
        { group: 'Cash & Bank',       href: "/dashboard/finance/bank/transfer",                    icon: ArrowLeftRight,  label: "Bank Transfer" },
        { group: 'Cash & Bank',       href: "/dashboard/finance/bank-reconciliation",              icon: Scale,           label: "Bank Reconciliation" },
        { group: 'Cash & Bank',       href: "/dashboard/finance/bank-reconciliation/browser",      icon: Search,          label: "Recon Browser" },
        { group: 'Cash & Bank',       href: "/dashboard/finance/cheque-book",                      icon: CreditCard,      label: "Cheque Book Stock" },
        { group: 'Cash & Bank',       href: "/dashboard/finance/cheque-opening",                   icon: FileText,        label: "Cheque Opening" },
        { group: 'Cash & Bank',       href: "/dashboard/finance/cash-denomination",                icon: Calculator,      label: "Cash Denomination" },
        { group: 'Cash & Bank',       href: "/dashboard/finance/reconciliation-cutoff",            icon: Lock,            label: "Recon Cutoff" },

        // Fixed Assets
        { group: 'Fixed Assets',      href: "/dashboard/finance/assets",                           icon: Boxes,           label: "Asset Register" },
        { group: 'Fixed Assets',      href: "/dashboard/finance/assets/categories",                icon: Tag,             label: "Categories" },
        { group: 'Fixed Assets',      href: "/dashboard/finance/assets/acquisition",               icon: Plus,            label: "Acquisition" },
        { group: 'Fixed Assets',      href: "/dashboard/finance/assets/depreciation",              icon: TrendingDown,    label: "Depreciation Run" },
        { group: 'Fixed Assets',      href: "/dashboard/finance/assets/disposal",                  icon: XCircle,         label: "Disposal" },

        // Budgeting
        { group: 'Budgeting',         href: "/dashboard/finance/budgets",                          icon: FileBarChart,    label: "Budget Setup" },
        { group: 'Budgeting',         href: "/dashboard/finance/budgets/upload",                   icon: Upload,          label: "Excel Upload" },
        { group: 'Budgeting',         href: "/dashboard/finance/budgets/variance",                 icon: TrendingUp,      label: "Budget vs Actual" },

        // Tax & Statutory
        { group: 'Tax & Statutory',   href: "/dashboard/finance/tax/sales-tax",                    icon: Receipt,         label: "Sales Tax Return" },
        { group: 'Tax & Statutory',   href: "/dashboard/finance/tax/wht",                          icon: FileText,        label: "WHT Certificate" },
        { group: 'Tax & Statutory',   href: "/dashboard/finance/reports/sales-tax-register",       icon: BookOpen,        label: "Sales Tax Register" },
        { group: 'Tax & Statutory',   href: "/dashboard/finance/reports/wht-statement",            icon: BookOpen,        label: "WHT Statement" },

        // Donations
        { group: 'Donations',         href: "/dashboard/finance/donations/donors",                 icon: Users,           label: "Donor Registry" },
        { group: 'Donations',         href: "/dashboard/finance/donations/types",                  icon: Tag,             label: "Donation Types (Funds)" },
        { group: 'Donations',         href: "/dashboard/finance/donations/collect",                icon: HandCoins,       label: "Donation Collection" },
        { group: 'Donations',         href: "/dashboard/finance/donations/pledges",                icon: Heart,           label: "Pledges" },
        { group: 'Donations',         href: "/dashboard/finance/reports/donation-collector",       icon: FileText,        label: "Collector Detail" },
        { group: 'Donations',         href: "/dashboard/finance/reports/donation-summary",         icon: FileBarChart,    label: "Collective Summary" },
        { group: 'Donations',         href: "/dashboard/finance/reports/zakat-register",           icon: BookMarked,      label: "Zakat Register" },
        { group: 'Donations',         href: "/dashboard/finance/reports/donor-statement",          icon: FileText,        label: "Donor Statement" },

        // Reports
        { group: 'Statements',        href: "/dashboard/finance/reports/trial-balance",            icon: Scale,           label: "Trial Balance" },
        { group: 'Statements',        href: "/dashboard/finance/reports/pnl",                      icon: TrendingUp,      label: "Profit & Loss" },
        { group: 'Statements',        href: "/dashboard/finance/reports/balance-sheet",            icon: Scale,           label: "Balance Sheet" },
        { group: 'Statements',        href: "/dashboard/finance/reports/cash-flow",                icon: Banknote,        label: "Cash Flow" },
        { group: 'Statements',        href: "/dashboard/finance/reports/ar-ageing",                icon: Clock,           label: "AR Ageing" },
        { group: 'Statements',        href: "/dashboard/finance/reports/ap-ageing",                icon: Clock,           label: "AP Ageing" },
        { group: 'Statements',        href: "/dashboard/finance/reports/cash-book",                icon: BookOpen,        label: "Cash Book" },
        { group: 'Statements',        href: "/dashboard/finance/reports/bank-book",                icon: BookOpen,        label: "Bank Book" },
        { group: 'Statements',        href: "/dashboard/finance/reports/asset-schedule",           icon: Layers,          label: "Fixed Asset Schedule" },
        { group: 'Statements',        href: "/dashboard/finance/reports/budget-variance",          icon: Target,          label: "Budget Variance" },
      ]
    },

    // Finance & Donations (Phase 2 - new module)
    {
      type: 'section',
      label: 'finance_donations',
      icon: Heart,
      items: [
        { href: "/dashboard/donations/overview", icon: Heart, label: "Donations Overview" },
        { href: "/dashboard/donations/entry", icon: HandCoins, label: "Donation Entry" },
        { href: "/dashboard/donations/zakat", icon: PiggyBank, label: "Zakat & Sadaqat" },
        { href: "/dashboard/donations/in-kind", icon: Package, label: "In-Kind Donations" },
        { href: "/dashboard/donations/donors", icon: Users, label: "Donor Database" },
        { href: "/dashboard/donations/income", icon: TrendingUp, label: "Income Tracking" },
        { href: "/dashboard/donations/expenses", icon: Wallet, label: "Expense Tracking" },
        { href: "/dashboard/donations/cashbook", icon: BookOpen, label: "Cashbook" },
        { href: "/dashboard/donations/budget", icon: BarChart2, label: "Budget vs Actual" },
      ]
    },

    // Qurbani Management
    {
      type: 'section',
      label: 'qurbani',
      icon: Scissors,
      items: [
        { href: "/dashboard/qurbani", icon: Scissors, label: "Animals & Booking" },
        { href: "/dashboard/qurbani/allocation", icon: Users, label: "Share Allocation" },
        { href: "/dashboard/qurbani/slips", icon: FileText, label: "Qurbani Slips" },
        { href: "/dashboard/qurbani/costing", icon: Calculator, label: "Costing" },
        { href: "/dashboard/qurbani/distribution", icon: Truck, label: "Distribution Tracking" },
      ]
    },

    // Reports (expanded to match real ERP)
    {
      type: 'section',
      label: 'reports',
      icon: BarChart3,
      items: [
        { href: "/dashboard/reports/stock-position", icon: Boxes, label: "Stock Position (Summary)" },
        { href: "/dashboard/reports/stock-ledger", icon: FileText, label: "Stock Ledger (Detail)" },
        { href: "/dashboard/reports/internal-requisitions", icon: ClipboardList, label: "Internal Requisition Rpt" },
        { href: "/dashboard/reports/low-stock", icon: AlertTriangle, label: "Low Stock" },
        { href: "/dashboard/reports/expiry-alerts", icon: AlertCircle, label: "Expiry Alerts" },
        { href: "/dashboard/reports/price-history", icon: TrendingUp, label: "Price History" },
        { href: "/dashboard/reports/ap-aging", icon: Clock, label: "AP Aging" },
        { href: "/dashboard/finance/reports", icon: BarChart2, label: "Financial Reports" },
        { href: "/dashboard/reports/dept-performance", icon: BarChart3, label: "Dept Performance" },
        { href: "/dashboard/reports/recipe-variance", icon: Calculator, label: "Recipe Variance" },
        { href: "/dashboard/procurement/analytics", icon: LineChart, label: "P. Requisition Report" },
        { href: "/dashboard/reports/po-list", icon: ShoppingBag, label: "Purchase Order List" },
        { href: "/dashboard/reports/grn-history", icon: PackageCheck, label: "GRN History" },
        { href: "/dashboard/reports/invoice-history", icon: Receipt, label: "Invoice History" },
        { href: "/dashboard/reports/builder", icon: FileBarChart, label: "Report Builder" },
      ]
    },

    // Admin (expanded to match real ERP)
    {
      type: 'section',
      label: 'admin',
      icon: Settings,
      items: [
        { href: "/dashboard/admin/users", icon: Users, label: "Users" },
        { href: "/dashboard/admin/role-master", icon: UserSquare, label: "Role Master" },
        { href: "/dashboard/admin/role-permissions", icon: KeyRound, label: "Role Permissions" },
        { href: "/dashboard/admin/company-settings", icon: Building2, label: "Company Settings" },
        { href: "/dashboard/departments", icon: Building2, label: "Departments" },
        { href: "/dashboard/finance/cost-centers", icon: Banknote, label: "Cost Centers" },
        { href: "/dashboard/admin/warehouses", icon: Warehouse, label: "Warehouses" },
        { href: "/dashboard/admin/workflow-config", icon: Wrench, label: "Workflow Config" },
        { href: "/dashboard/settings", icon: Settings, label: "System Settings" },
        { href: "/dashboard/admin/audit-log", icon: History, label: "Audit Log" },
      ]
    },

    { type: 'divider', label: 'Account' },
    { href: "/dashboard/profile", icon: UserCircle, label: "My Profile" },
    { href: "/dashboard/alerts", icon: Bell, label: "Alerts" },
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
              <div>
                <span className="text-xl font-semibold font-headline">Rahah24</span>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Enterprise ERP</p>
              </div>
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
                                {section.label === 'pos' ? 'Point of Sale'
                                  : section.label === 'procurement' ? 'Procurement'
                                  : section.label === 'approvals' ? 'Approvals'
                                  : section.label === 'inventory' ? 'Inventory'
                                  : section.label === 'production' ? 'Production'
                                  : section.label === 'sales' ? 'Sales'
                                  : section.label === 'returns' ? 'Returns'
                                  : section.label === 'finance' ? 'Finance'
                                  : section.label === 'finance_donations' ? 'Donations Module'
                                  : section.label === 'qurbani' ? 'Qurbani Management'
                                  : section.label === 'reports' ? 'Reports'
                                  : section.label === 'admin' ? 'Admin'
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
                            {section.items.map((subItem, idx) => {
                              const prevGroup = idx > 0 ? section.items[idx - 1].group : undefined;
                              const showHeader = subItem.group && subItem.group !== prevGroup;
                              return (
                                <React.Fragment key={subItem.href}>
                                  {showHeader && (
                                    <div className="pl-6 pt-2 pb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/70">
                                      {subItem.group}
                                    </div>
                                  )}
                                  <SidebarMenuItem>
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
                                </React.Fragment>
                              );
                            })}
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
              {/* Company Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden sm:flex items-center gap-2 border rounded-md px-2.5 py-1.5 text-sm cursor-pointer hover:bg-muted/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <div className={`w-5 h-5 rounded flex items-center justify-center text-white text-[9px] font-bold shrink-0 ${activeCompany.color}`}>
                      {activeCompany.short}
                    </div>
                    <span className="font-medium text-sm max-w-[140px] truncate">{activeCompany.name}</span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="text-xs text-muted-foreground font-normal pb-1">
                    Switch Company / Entity
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {COMPANIES.map(co => (
                    <DropdownMenuItem
                      key={co.id}
                      className="flex items-center gap-2.5 cursor-pointer py-2"
                      onClick={() => setActiveCompany(co)}
                    >
                      <div className={`w-6 h-6 rounded flex items-center justify-center text-white text-[9px] font-bold shrink-0 ${co.color}`}>
                        {co.short}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{co.name}</p>
                        <p className="text-[10px] text-muted-foreground">{co.type} · {co.id}</p>
                      </div>
                      {activeCompany.id === co.id && (
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${co.dot}`} />
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/admin/company-settings" className="flex items-center gap-2 text-xs text-primary cursor-pointer py-2">
                      <Settings className="h-3.5 w-3.5" />Manage Companies
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <GlobalSearchTrigger />
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">3</span>
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
