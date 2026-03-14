'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Shield, Users, PlusCircle, Settings2, ChevronRight, Lock, Eye, Edit2,
  Trash2, Copy, AlertTriangle, CheckCircle2, Building2, Wrench
} from "lucide-react";
import Link from "next/link";

// ── System roles ───────────────────────────────────────────────────────────────
const systemRoles = [
  {
    code: 'SYS_ADMIN',
    name: 'System Administrator',
    color: 'bg-red-500',
    badge: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
    type: 'System',
    users: 1,
    approvalLimit: 'Unlimited',
    canApprove: true,
    modules: ['All Modules'],
    desc: 'Full system access. Manage users, roles, settings, audit logs, and all ERP modules.',
  },
  {
    code: 'GM',
    name: 'General Manager',
    color: 'bg-purple-500',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
    type: 'Management',
    users: 1,
    approvalLimit: 'Unlimited (L3)',
    canApprove: true,
    modules: ['Dashboard', 'Procurement', 'Finance', 'Reports', 'HR', 'Inventory'],
    desc: 'Top-level approver for procurement, finance, and HR. Final authority for requisitions above PKR 200K.',
  },
  {
    code: 'FINANCE',
    name: 'Finance Officer',
    color: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    type: 'Finance',
    users: 1,
    approvalLimit: 'PKR 200K (L2)',
    canApprove: true,
    modules: ['Finance', 'Payments', 'Reports', 'Inventory (view)'],
    desc: 'Approves payments, manages cost centers, reviews financial reports. L2 approver for payments.',
  },
  {
    code: 'APPROVER_L2',
    name: 'Approver Level 2',
    color: 'bg-indigo-500',
    badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
    type: 'Procurement',
    users: 1,
    approvalLimit: 'PKR 200K (L2)',
    canApprove: true,
    modules: ['Procurement', 'Requisitions', 'Purchase Orders', 'GRN (view)', 'Reports'],
    desc: 'Reviews and approves purchase orders between PKR 50K – 200K. Escalates above 200K to GM.',
  },
  {
    code: 'APPROVER_L1',
    name: 'Approver Level 1',
    color: 'bg-teal-500',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
    type: 'Procurement',
    users: 1,
    approvalLimit: 'PKR 50K (L1)',
    canApprove: true,
    modules: ['Procurement', 'Requisitions', 'GRN (view)', 'Reports (limited)'],
    desc: 'First-level approver for requisitions up to PKR 50K. Escalates to L2 above threshold.',
  },
  {
    code: 'PURCHASING',
    name: 'Purchasing Officer',
    color: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    type: 'Procurement',
    users: 1,
    approvalLimit: 'None (creator)',
    canApprove: false,
    modules: ['Procurement', 'Purchase Orders', 'GRN', 'Vendors', 'Reports'],
    desc: 'Creates and manages purchase orders, coordinates with vendors, processes GRNs.',
  },
  {
    code: 'STORE_KEEPER',
    name: 'Store Keeper',
    color: 'bg-green-500',
    badge: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
    type: 'Inventory',
    users: 1,
    approvalLimit: 'None (operations)',
    canApprove: false,
    modules: ['Inventory', 'Stock Issues', 'Stock Transfers', 'Physical Count', 'GRN'],
    desc: 'Manages physical stock: receives goods, issues items to departments, conducts stock counts.',
  },
  {
    code: 'DEPT_HEAD',
    name: 'Department Head',
    color: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
    type: 'Operations',
    users: 1,
    approvalLimit: 'None (requester)',
    canApprove: false,
    modules: ['Requisitions (create)', 'Inventory (view)', 'Reports (dept)'],
    desc: 'Raises purchase requisitions for their department. Receives issued stock from store.',
  },
  {
    code: 'AUDITOR',
    name: 'Auditor',
    color: 'bg-slate-500',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-950/40 dark:text-slate-300',
    type: 'Compliance',
    users: 0,
    approvalLimit: 'None (read-only)',
    canApprove: false,
    modules: ['All Reports (read-only)', 'Audit Log', 'Stock Valuation'],
    desc: 'Read-only access to all modules for audit and compliance purposes. Cannot create or approve.',
  },
];

const approvalChain = [
  { role: 'Store Keeper / Dept Head', limit: '—', action: 'Creates PR', color: 'bg-green-500' },
  { role: 'Approver Level 1', limit: '≤ PKR 50,000', action: 'Approves PR / small POs', color: 'bg-teal-500' },
  { role: 'Approver Level 2', limit: '≤ PKR 200,000', action: 'Approves mid POs', color: 'bg-indigo-500' },
  { role: 'General Manager', limit: 'Unlimited', action: 'Final authority', color: 'bg-purple-500' },
];

const moduleCoverage = [
  { module: 'Inventory', roles: ['SYS_ADMIN', 'GM', 'STORE_KEEPER', 'AUDITOR'], write: ['STORE_KEEPER'], read: ['GM', 'AUDITOR'] },
  { module: 'Procurement', roles: ['SYS_ADMIN', 'GM', 'PURCHASING', 'APPROVER_L1', 'APPROVER_L2'], write: ['PURCHASING'], approve: ['APPROVER_L1', 'APPROVER_L2', 'GM'] },
  { module: 'Finance', roles: ['SYS_ADMIN', 'GM', 'FINANCE'], write: ['FINANCE'], approve: ['GM'] },
  { module: 'Requisitions', roles: ['SYS_ADMIN', 'DEPT_HEAD', 'PURCHASING', 'APPROVER_L1', 'APPROVER_L2', 'GM'], write: ['DEPT_HEAD'], approve: ['APPROVER_L1', 'APPROVER_L2', 'GM'] },
  { module: 'Reports', roles: ['SYS_ADMIN', 'GM', 'FINANCE', 'AUDITOR', 'APPROVER_L2'], write: [], read: ['SYS_ADMIN', 'GM', 'FINANCE', 'AUDITOR'] },
  { module: 'Admin', roles: ['SYS_ADMIN'], write: ['SYS_ADMIN'], read: [] },
];

export default function RoleMasterPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', code: '', desc: '', baseRole: '', status: true });

  const filtered = systemRoles.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || r.type.toLowerCase() === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />Role Master
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Define and manage system roles · Control module access and approval authority
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1 h-8" asChild>
            <Link href="/dashboard/admin/role-permissions">
              <Lock className="h-3 w-3" />Permissions Matrix
            </Link>
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1 text-xs h-8">
                <PlusCircle className="h-3 w-3" />New Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><PlusCircle className="h-4 w-4 text-primary" />Create New Role</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Role Name</Label>
                    <Input placeholder="e.g. Kitchen Manager" className="h-8 text-xs"
                      value={newRole.name} onChange={e => setNewRole(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Role Code</Label>
                    <Input placeholder="e.g. KITCHEN_MGR" className="h-8 text-xs font-mono"
                      value={newRole.code} onChange={e => setNewRole(p => ({ ...p, code: e.target.value.toUpperCase() }))} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Description</Label>
                  <Input placeholder="Brief description of role responsibilities" className="h-8 text-xs"
                    value={newRole.desc} onChange={e => setNewRole(p => ({ ...p, desc: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Clone Permissions From</Label>
                  <Select onValueChange={v => setNewRole(p => ({ ...p, baseRole: v }))}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select base role (optional)" /></SelectTrigger>
                    <SelectContent>
                      {systemRoles.map(r => <SelectItem key={r.code} value={r.code} className="text-xs">{r.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <div>
                    <p className="text-xs font-medium">Active</p>
                    <p className="text-xs text-muted-foreground">Role can be assigned to users</p>
                  </div>
                  <Switch checked={newRole.status} onCheckedChange={v => setNewRole(p => ({ ...p, status: v }))} />
                </div>
                <p className="text-xs text-muted-foreground bg-muted/40 rounded p-2">
                  After creating the role, configure module permissions via the <span className="font-medium text-primary">Permissions Matrix</span>.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button size="sm" className="text-xs" onClick={() => setDialogOpen(false)}>Create Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Roles', value: '9', sub: '9 system-defined', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20' },
          { label: 'Users Assigned', value: '5', sub: 'Across all roles', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/20' },
          { label: 'Approval Levels', value: '3', sub: 'L1 · L2 · GM', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/20' },
          { label: 'Unassigned Roles', value: '1', sub: 'Auditor — no users', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/20' },
        ].map((k, i) => (
          <div key={i} className={`rounded-lg p-3 ${k.bg}`}>
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className={`text-lg font-bold tabular-nums ${k.color}`}>{k.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Approval Hierarchy ── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-primary" />Approval Hierarchy
          </CardTitle>
          <CardDescription className="text-xs">Procurement approval chain based on transaction value</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-0 overflow-x-auto">
            {approvalChain.map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center px-4 min-w-[130px]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${step.color}`}>
                    {i + 1}
                  </div>
                  <p className="text-xs font-semibold mt-1 text-center leading-tight">{step.role}</p>
                  <p className="text-[10px] text-muted-foreground text-center mt-0.5">{step.limit}</p>
                  <p className="text-[10px] text-primary text-center font-medium mt-0.5">{step.action}</p>
                </div>
                {i < approvalChain.length - 1 && <div className="h-px w-8 shrink-0 bg-border" />}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
            Configure approval thresholds at{' '}
            <Link href="/dashboard/admin/workflow-config" className="text-primary hover:underline font-medium">
              Admin → Workflow Config
            </Link>
          </p>
        </CardContent>
      </Card>

      {/* ── Roles Table ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />System Roles
              </CardTitle>
              <CardDescription className="text-xs">Click a role to view and edit its permissions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search roles..."
                className="h-7 text-xs w-40"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-7 text-xs w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">All Types</SelectItem>
                  <SelectItem value="system" className="text-xs">System</SelectItem>
                  <SelectItem value="management" className="text-xs">Management</SelectItem>
                  <SelectItem value="procurement" className="text-xs">Procurement</SelectItem>
                  <SelectItem value="finance" className="text-xs">Finance</SelectItem>
                  <SelectItem value="inventory" className="text-xs">Inventory</SelectItem>
                  <SelectItem value="operations" className="text-xs">Operations</SelectItem>
                  <SelectItem value="compliance" className="text-xs">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-muted/30">
                {['Role', 'Code', 'Type', 'Users', 'Approval Limit', 'Modules', 'Actions'].map(h => (
                  <th key={h} className="text-left py-2 px-4 font-medium text-muted-foreground first:pl-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((role) => (
                <tr key={role.code} className="border-t hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${role.color}`} />
                      <div>
                        <p className="font-medium">{role.name}</p>
                        <p className="text-[10px] text-muted-foreground leading-tight max-w-[220px] truncate">{role.desc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">{role.code}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${role.badge}`}>{role.type}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-semibold tabular-nums ${role.users === 0 ? 'text-muted-foreground' : ''}`}>
                      {role.users}
                    </span>
                    {role.users === 0 && <span className="ml-1 text-amber-500 text-[10px]">unassigned</span>}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`${role.canApprove ? 'text-primary' : 'text-muted-foreground'}`}>
                      {role.approvalLimit}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {role.modules.slice(0, 3).map(m => (
                        <span key={m} className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-[10px]">{m}</span>
                      ))}
                      {role.modules.length > 3 && (
                        <span className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-[10px]">+{role.modules.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                        <Link href="/dashboard/admin/role-permissions" title="View Permissions">
                          <Lock className="h-3 w-3" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" title="Edit Role">
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" title="Clone Role">
                        <Copy className="h-3 w-3" />
                      </Button>
                      {role.code !== 'SYS_ADMIN' && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600" title="Delete Role">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ── Module Coverage Matrix ── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-primary" />Module Access Summary
          </CardTitle>
          <CardDescription className="text-xs">High-level access type per module — manage granular permissions via Permissions Matrix</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-2 px-4 font-medium text-muted-foreground">Module</th>
                  {systemRoles.map(r => (
                    <th key={r.code} className="text-center py-2 px-2 font-medium text-muted-foreground min-w-[70px]">
                      <div className={`w-2 h-2 rounded-full ${r.color} mx-auto mb-0.5`} />
                      <span className="text-[10px]">{r.code.split('_')[0]}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {moduleCoverage.map((mod) => (
                  <tr key={mod.module} className="border-t hover:bg-muted/10">
                    <td className="py-2 px-4 font-medium">{mod.module}</td>
                    {systemRoles.map(r => {
                      const hasAccess = mod.roles.includes(r.code);
                      const isWrite = mod.write?.includes(r.code);
                      const isApprove = (mod as any).approve?.includes(r.code);
                      return (
                        <td key={r.code} className="py-2 px-2 text-center">
                          {!hasAccess ? (
                            <span className="text-muted-foreground/30">—</span>
                          ) : isApprove ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-purple-500 mx-auto" title="Approve" />
                          ) : isWrite ? (
                            <Edit2 className="h-3 w-3 text-blue-500 mx-auto" title="Write" />
                          ) : (
                            <Eye className="h-3 w-3 text-muted-foreground mx-auto" title="View" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-4 px-4 py-2 border-t bg-muted/10 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> View only</span>
            <span className="flex items-center gap-1"><Edit2 className="h-3 w-3 text-blue-500" /> Write access</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-purple-500" /> Approve transactions</span>
            <span className="ml-auto">
              Full permission matrix →{' '}
              <Link href="/dashboard/admin/role-permissions" className="text-primary hover:underline font-medium">
                Role Permissions
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ── Security Notice ── */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-800 dark:text-amber-300">
          <p className="font-medium mb-0.5">Role changes take effect immediately</p>
          <p>Modifying a role affects all users assigned to it. Changes are recorded in the{' '}
            <Link href="/dashboard/admin/audit-log" className="underline font-medium">Audit Log</Link>.
            System roles (SYS_ADMIN) cannot be deleted.
          </p>
        </div>
      </div>

    </div>
  );
}
