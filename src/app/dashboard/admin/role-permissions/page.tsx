'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  ChevronDown,
  ChevronRight,
  Lock,
  ShoppingCart,
  CheckSquare,
  Package,
  Factory,
  BarChart2,
  RotateCcw,
  DollarSign,
  FileText,
  Settings,
  User,
} from "lucide-react";

const ROLES = [
  'Admin',
  'Developer',
  'PR User',
  'PO User',
  'Store Keeper',
  'Finance Officer',
];

interface SubItem {
  key: string;
  label: string;
}

interface Module {
  key: string;
  label: string;
  icon: React.ElementType;
  subItems: SubItem[];
}

const MODULES: Module[] = [
  {
    key: 'procurement',
    label: 'Procurement',
    icon: ShoppingCart,
    subItems: [
      { key: 'pr_create', label: 'Create Purchase Requisition' },
      { key: 'pr_view', label: 'View Purchase Requisitions' },
      { key: 'po_create', label: 'Create Purchase Order' },
      { key: 'po_view', label: 'View Purchase Orders' },
      { key: 'grn_create', label: 'Create GRN' },
      { key: 'grn_view', label: 'View GRNs' },
    ],
  },
  {
    key: 'approvals',
    label: 'Approvals',
    icon: CheckSquare,
    subItems: [
      { key: 'approval_l1', label: 'Level 1 Approval' },
      { key: 'approval_l2', label: 'Level 2 Approval' },
      { key: 'approval_l3', label: 'Level 3 (GM) Approval' },
      { key: 'approval_override', label: 'Override & Escalate' },
    ],
  },
  {
    key: 'inventory',
    label: 'Inventory',
    icon: Package,
    subItems: [
      { key: 'inv_items', label: 'Item Master' },
      { key: 'inv_stock', label: 'Stock Levels' },
      { key: 'inv_adjustment', label: 'Stock Adjustments' },
      { key: 'inv_transfer', label: 'Stock Transfers' },
      { key: 'inv_count', label: 'Physical Count' },
    ],
  },
  {
    key: 'production',
    label: 'Production',
    icon: Factory,
    subItems: [
      { key: 'prod_recipe', label: 'Recipe Management' },
      { key: 'prod_order', label: 'Production Orders' },
      { key: 'prod_costing', label: 'Production Costing' },
    ],
  },
  {
    key: 'sales',
    label: 'Sales',
    icon: BarChart2,
    subItems: [
      { key: 'sales_pos', label: 'Point of Sale' },
      { key: 'sales_orders', label: 'Sales Orders' },
      { key: 'sales_invoices', label: 'Sales Invoices' },
    ],
  },
  {
    key: 'returns',
    label: 'Returns',
    icon: RotateCcw,
    subItems: [
      { key: 'ret_purchase', label: 'Purchase Returns' },
      { key: 'ret_sales', label: 'Sales Returns' },
      { key: 'ret_debit_note', label: 'Debit Notes' },
    ],
  },
  {
    key: 'finance',
    label: 'Finance',
    icon: DollarSign,
    subItems: [
      { key: 'fin_gl', label: 'General Ledger' },
      { key: 'fin_ap', label: 'Accounts Payable' },
      { key: 'fin_ar', label: 'Accounts Receivable' },
      { key: 'fin_cashbook', label: 'Cashbook & Petty Cash' },
      { key: 'fin_bank', label: 'Bank Reconciliation' },
    ],
  },
  {
    key: 'reports',
    label: 'Reports',
    icon: FileText,
    subItems: [
      { key: 'rep_stock', label: 'Stock Reports' },
      { key: 'rep_financial', label: 'Financial Reports' },
      { key: 'rep_vendor', label: 'Vendor Performance' },
      { key: 'rep_aging', label: 'AP Aging Report' },
    ],
  },
  {
    key: 'admin',
    label: 'Admin',
    icon: Settings,
    subItems: [
      { key: 'adm_users', label: 'User Management' },
      { key: 'adm_roles', label: 'Role Permissions' },
      { key: 'adm_warehouses', label: 'Warehouses' },
      { key: 'adm_audit', label: 'Audit Log' },
    ],
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: User,
    subItems: [
      { key: 'prof_view', label: 'View Profile' },
      { key: 'prof_edit', label: 'Edit Profile' },
      { key: 'prof_password', label: 'Change Password' },
    ],
  },
];

// Default permissions per role (which keys are checked)
const DEFAULT_PERMS: Record<string, Set<string>> = {
  Admin: new Set(MODULES.flatMap((m) => [m.key, ...m.subItems.map((s) => s.key)])),
  Developer: new Set(MODULES.flatMap((m) => [m.key, ...m.subItems.map((s) => s.key)])),
  'PR User': new Set(['procurement', 'pr_create', 'pr_view', 'inventory', 'inv_stock', 'profile', 'prof_view', 'prof_edit', 'prof_password']),
  'PO User': new Set(['procurement', 'pr_view', 'po_create', 'po_view', 'grn_create', 'grn_view', 'inventory', 'inv_stock', 'profile', 'prof_view', 'prof_edit', 'prof_password']),
  'Store Keeper': new Set(['inventory', 'inv_items', 'inv_stock', 'inv_adjustment', 'inv_transfer', 'inv_count', 'procurement', 'grn_create', 'grn_view', 'profile', 'prof_view', 'prof_edit', 'prof_password']),
  'Finance Officer': new Set(['finance', 'fin_gl', 'fin_ap', 'fin_ar', 'fin_cashbook', 'fin_bank', 'reports', 'rep_financial', 'rep_aging', 'profile', 'prof_view', 'prof_edit', 'prof_password']),
};

export default function RolePermissionsPage() {
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [permissions, setPermissions] = useState<Set<string>>(new Set(DEFAULT_PERMS['Admin']));
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['procurement']));
  const [saved, setSaved] = useState(false);

  function handleRoleChange(role: string) {
    setSelectedRole(role);
    setPermissions(new Set(DEFAULT_PERMS[role] || new Set()));
    setSaved(false);
  }

  function toggleExpand(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function togglePermission(key: string) {
    setPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setSaved(false);
  }

  function toggleModule(mod: Module) {
    const allKeys = [mod.key, ...mod.subItems.map((s) => s.key)];
    const allChecked = allKeys.every((k) => permissions.has(k));
    setPermissions((prev) => {
      const next = new Set(prev);
      if (allChecked) {
        allKeys.forEach((k) => next.delete(k));
      } else {
        allKeys.forEach((k) => next.add(k));
      }
      return next;
    });
    setSaved(false);
  }

  function selectAll() {
    const all = new Set(MODULES.flatMap((m) => [m.key, ...m.subItems.map((s) => s.key)]));
    setPermissions(all);
    setSaved(false);
  }

  function deselectAll() {
    setPermissions(new Set());
    setSaved(false);
  }

  const allSelected = MODULES.flatMap((m) => [m.key, ...m.subItems.map((s) => s.key)]).every(
    (k) => permissions.has(k)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Role Permissions</h1>
          <p className="text-muted-foreground mt-1">
            Assign access rights to specific modules and forms.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-sm font-medium dark:bg-slate-900/50 dark:text-slate-300 dark:border-slate-700 whitespace-nowrap">
          <Lock className="h-3.5 w-3.5" />
          Security Manager
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT: Role Selector */}
        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4 text-primary" />
              Select Role
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="role-select">User Role</Label>
              <Select value={selectedRole} onValueChange={handleRoleChange}>
                <SelectTrigger id="role-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Current Role: {selectedRole}</p>
              <p>
                {permissions.size} permission{permissions.size !== 1 ? 's' : ''} assigned
              </p>
            </div>
            <Button
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => setSaved(true)}
            >
              {saved ? '✓ Saved' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* RIGHT: Access Matrix */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lock className="h-4 w-4 text-primary" />
                Access Matrix
              </CardTitle>
              <p className="text-xs text-muted-foreground">Checked = Permitted</p>
            </div>
            {/* Select All row */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              <Checkbox
                id="select-all"
                checked={allSelected}
                onCheckedChange={(checked) => {
                  if (checked) selectAll();
                  else deselectAll();
                }}
              />
              <Label
                htmlFor="select-all"
                className="text-sm font-semibold cursor-pointer"
              >
                Select All Permissions
              </Label>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {MODULES.map((mod) => {
                const Icon = mod.icon;
                const isExpanded = expanded.has(mod.key);
                const allSubChecked = mod.subItems.every((s) => permissions.has(s.key));
                const someSubChecked = mod.subItems.some((s) => permissions.has(s.key));
                const moduleChecked = permissions.has(mod.key);

                return (
                  <div key={mod.key}>
                    {/* Module Header Row */}
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <Checkbox
                        id={`mod-${mod.key}`}
                        checked={moduleChecked && allSubChecked}
                        data-state={
                          moduleChecked && allSubChecked
                            ? 'checked'
                            : someSubChecked || moduleChecked
                            ? 'indeterminate'
                            : 'unchecked'
                        }
                        onCheckedChange={() => toggleModule(mod)}
                        className={someSubChecked && !allSubChecked ? 'data-[state=indeterminate]:bg-primary/50' : ''}
                      />
                      <div
                        className="flex items-center gap-2 flex-1 cursor-pointer"
                        onClick={() => toggleExpand(mod.key)}
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-semibold">{mod.label}</span>
                        <span className="text-xs text-muted-foreground ml-auto mr-1">
                          {mod.subItems.filter((s) => permissions.has(s.key)).length}/{mod.subItems.length}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                      </div>
                    </div>

                    {/* Sub Items */}
                    {isExpanded && (
                      <div className="bg-muted/20 border-t divide-y">
                        {mod.subItems.map((sub) => (
                          <div
                            key={sub.key}
                            className="flex items-center gap-3 px-4 py-2.5 pl-12 hover:bg-muted/40 transition-colors"
                          >
                            <Checkbox
                              id={`sub-${sub.key}`}
                              checked={permissions.has(sub.key)}
                              onCheckedChange={() => togglePermission(sub.key)}
                            />
                            <Label
                              htmlFor={`sub-${sub.key}`}
                              className="text-sm cursor-pointer text-muted-foreground"
                            >
                              {sub.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
