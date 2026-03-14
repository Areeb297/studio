'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ScrollText, Activity, Users, AlertTriangle, Filter } from "lucide-react";

const actionStyle: Record<string, string> = {
  CREATE: 'bg-green-100 text-green-700 border-green-300',
  UPDATE: 'bg-blue-100 text-blue-700 border-blue-300',
  APPROVE: 'bg-purple-100 text-purple-700 border-purple-300',
  DELETE: 'bg-red-100 text-red-700 border-red-300',
  LOGIN: 'bg-gray-100 text-gray-700 border-gray-300',
  REJECT: 'bg-amber-100 text-amber-700 border-amber-300',
};

const logs = [
  { id: 1, ts: '14 Mar 2026, 10:18', user: 'admin', action: 'APPROVE', module: 'Procurement', recordId: 'GRN-202603-0014', ip: '192.168.1.10', details: 'GRN approved for ALI supplier' },
  { id: 2, ts: '14 Mar 2026, 10:12', user: 'purchasing', action: 'CREATE', module: 'Procurement', recordId: 'PO-202603-0020', ip: '192.168.1.12', details: 'New PO created for CHICKEN SUPPLIER' },
  { id: 3, ts: '14 Mar 2026, 09:54', user: 'storekeeper', action: 'UPDATE', module: 'Inventory', recordId: 'ISS-202603-0012', ip: '192.168.1.15', details: 'Stock issue quantity updated from 5 to 8' },
  { id: 4, ts: '14 Mar 2026, 09:32', user: 'admin', action: 'DELETE', module: 'Admin', recordId: 'USR-0006', ip: '192.168.1.10', details: 'Deleted inactive test user account' },
  { id: 5, ts: '14 Mar 2026, 09:15', user: 'approverl1', action: 'APPROVE', module: 'Approvals', recordId: 'PR-202603-0036', ip: '192.168.1.18', details: 'PR approved — Level 1 sign-off' },
  { id: 6, ts: '14 Mar 2026, 08:58', user: 'finance', action: 'UPDATE', module: 'Finance', recordId: 'CC-007', ip: '192.168.1.14', details: 'Cost center budget revised from PKR 160K to 180K' },
  { id: 7, ts: '14 Mar 2026, 08:45', user: 'storekeeper', action: 'CREATE', module: 'Inventory', recordId: 'ADJ-202603-0018', ip: '192.168.1.15', details: 'New stock adjustment for GOAT BAKRA A (-3 KG)' },
  { id: 8, ts: '14 Mar 2026, 08:30', user: 'purchasing', action: 'REJECT', module: 'Procurement', recordId: 'PR-202603-0034', ip: '192.168.1.12', details: 'PR rejected — budget exceeded' },
  { id: 9, ts: '14 Mar 2026, 08:14', user: 'admin', action: 'LOGIN', module: 'Auth', recordId: 'SESSION-8821', ip: '192.168.1.10', details: 'User login — admin@rahah24.com' },
  { id: 10, ts: '13 Mar 2026, 17:42', user: 'finance', action: 'APPROVE', module: 'Finance', recordId: 'INV-202603-0009', ip: '192.168.1.14', details: 'Invoice matched and posted to GL' },
];

export default function AuditLogPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit Log</h1>
          <p className="text-muted-foreground mt-1">System-wide activity trail with full field-level tracking</p>
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: '10', icon: ScrollText, color: 'text-blue-600' },
          { label: 'Events Today', value: '4', icon: Activity, color: 'text-green-600' },
          { label: 'Users Active', value: '3', icon: Users, color: 'text-purple-600' },
          { label: 'Critical Events', value: '1', icon: AlertTriangle, color: 'text-red-600' },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex gap-3">
        <Input placeholder="Filter by user..." className="max-w-xs" />
        <Input placeholder="Filter by module..." className="max-w-xs" />
        <div className="flex gap-2">
          {['All', 'CREATE', 'UPDATE', 'APPROVE', 'DELETE'].map((t) => (
            <Button key={t} variant="outline" size="sm">{t}</Button>
          ))}
        </div>
      </div>

      {/* Audit Table */}
      <Card>
        <CardHeader>
          <CardTitle>Event Log</CardTitle>
          <CardDescription>All recorded system events — newest first</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-center">Action</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Record ID</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{row.ts}</TableCell>
                  <TableCell className="font-mono text-sm font-medium">{row.user}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={actionStyle[row.action]}>{row.action}</Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{row.module}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{row.recordId}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{row.ip}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{row.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
