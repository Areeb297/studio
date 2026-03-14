'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, TrendingUp, TrendingDown, Scale, Activity } from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend
} from 'recharts';

const tooltipStyle = { backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' };

const adjTypes = [
  { name: 'Damage', value: 5, color: '#EF4444' },
  { name: 'Expiry', value: 3, color: '#F97316' },
  { name: 'Count Correction', value: 4, color: '#3B82F6' },
  { name: 'Surplus', value: 4, color: '#10B981' },
  { name: 'Transfer Error', value: 2, color: '#8B5CF6' },
];

const adjReasons = [
  { name: 'Physical Count Variance', value: 6, color: '#14B8A6' },
  { name: 'Kitchen Spillage', value: 4, color: '#F59E0B' },
  { name: 'Cold Chain Failure', value: 3, color: '#EF4444' },
  { name: 'Supplier Short Delivery', value: 3, color: '#8B5CF6' },
  { name: 'Data Entry Error', value: 2, color: '#3B82F6' },
];

const adjustments = [
  { id: 'ADJ-202603-0018', date: '14 Mar 2026', item: 'GOAT BAKRA A', warehouse: 'COLD STORE', qtyChange: -3, reason: 'Damage', approvedBy: 'Admin', status: 'Approved' },
  { id: 'ADJ-202603-0017', date: '14 Mar 2026', item: 'BASMATI RICE', warehouse: 'DRY STORE', qtyChange: +10, reason: 'Count Correction', approvedBy: 'Admin', status: 'Approved' },
  { id: 'ADJ-202603-0016', date: '13 Mar 2026', item: 'COOKING OIL 16L', warehouse: 'GENERAL STORE', qtyChange: +2, reason: 'Surplus', approvedBy: 'Admin', status: 'Approved' },
  { id: 'ADJ-202603-0015', date: '13 Mar 2026', item: 'CHICKEN WHOLE', warehouse: 'COLD STORE', qtyChange: -5, reason: 'Expiry', approvedBy: 'Admin', status: 'Approved' },
  { id: 'ADJ-202603-0014', date: '12 Mar 2026', item: 'RED CHILLI', warehouse: 'DRY STORE', qtyChange: -2, reason: 'Damage', approvedBy: 'Pending', status: 'Pending' },
  { id: 'ADJ-202603-0013', date: '12 Mar 2026', item: 'ONION', warehouse: 'KITCHEN STORE', qtyChange: +8, reason: 'Count Correction', approvedBy: 'Pending', status: 'Pending' },
  { id: 'ADJ-202603-0012', date: '11 Mar 2026', item: 'BEEF UNDERCUT', warehouse: 'COLD STORE', qtyChange: -1, reason: 'Transfer Error', approvedBy: 'Admin', status: 'Approved' },
  { id: 'ADJ-202603-0011', date: '11 Mar 2026', item: 'SALT', warehouse: 'DRY STORE', qtyChange: +15, reason: 'Surplus', approvedBy: 'Admin', status: 'Approved' },
];

const statusStyle: Record<string, string> = {
  Approved: 'bg-green-100 text-green-700 border-green-300',
  Pending: 'bg-amber-100 text-amber-700 border-amber-300',
  Rejected: 'bg-red-100 text-red-700 border-red-300',
};

export default function StockAdjustmentsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Adjustments</h1>
          <p className="text-muted-foreground mt-1">Inventory corrections for damage, expiry, count variances, and surplus</p>
        </div>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          New Adjustment
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Adjustments This Month', value: '18', icon: Scale, color: 'text-blue-600' },
          { label: 'Positive Adj (+PKR 42K)', value: '7', icon: TrendingUp, color: 'text-green-600' },
          { label: 'Negative Adj (-PKR 28K)', value: '11', icon: TrendingDown, color: 'text-red-600' },
          { label: 'Net Effect', value: '+PKR 14K', icon: Activity, color: 'text-purple-600' },
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

      {/* Two Donut Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Adjustment by Type</CardTitle>
            <CardDescription>Distribution across 5 adjustment types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={adjTypes} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4}>
                  {adjTypes.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v, 'Adjustments']} />
                <Legend formatter={(v) => <span className="text-xs">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adjustment by Reason</CardTitle>
            <CardDescription>Root cause breakdown this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={adjReasons} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4}>
                  {adjReasons.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v, 'Adjustments']} />
                <Legend formatter={(v) => <span className="text-xs">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Adjustments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Adjustments</CardTitle>
          <CardDescription>Stock adjustment log — March 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Adj No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead className="text-center">Qty Change</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adjustments.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-sm font-medium">{row.id}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.date}</TableCell>
                  <TableCell className="font-medium">{row.item}</TableCell>
                  <TableCell className="text-sm">{row.warehouse}</TableCell>
                  <TableCell className={`text-center font-bold ${row.qtyChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {row.qtyChange > 0 ? `+${row.qtyChange}` : row.qtyChange}
                  </TableCell>
                  <TableCell className="text-sm">{row.reason}</TableCell>
                  <TableCell className="text-sm">{row.approvedBy}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={statusStyle[row.status]}>{row.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
