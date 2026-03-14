'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, ArrowRightLeft, Loader2, CheckCircle2, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

const tooltipStyle = { backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' };

const transferVolume = [
  { month: 'Oct', volume: 8, value: 84000 },
  { month: 'Nov', volume: 10, value: 96000 },
  { month: 'Dec', volume: 7, value: 71000 },
  { month: 'Jan', volume: 11, value: 108000 },
  { month: 'Feb', volume: 9, value: 92000 },
  { month: 'Mar', volume: 12, value: 124000 },
];

const transfers = [
  { id: 'TRF-202603-0012', date: '14 Mar 2026', from: 'JAMIA STORE', to: 'COLD STORE', items: 6, status: 'Completed' },
  { id: 'TRF-202603-0011', date: '14 Mar 2026', from: 'DRY STORE', to: 'KITCHEN STORE', items: 4, status: 'In Transit' },
  { id: 'TRF-202603-0010', date: '13 Mar 2026', from: 'GENERAL STORE', to: 'RESTAURANT STORE', items: 3, status: 'Completed' },
  { id: 'TRF-202603-0009', date: '13 Mar 2026', from: 'JAMIA STORE', to: 'DRY STORE', items: 5, status: 'In Transit' },
  { id: 'TRF-202603-0008', date: '12 Mar 2026', from: 'COLD STORE', to: 'KITCHEN STORE', items: 2, status: 'Completed' },
  { id: 'TRF-202603-0007', date: '12 Mar 2026', from: 'RESTAURANT STORE', to: 'GENERAL STORE', items: 7, status: 'Pending' },
  { id: 'TRF-202603-0006', date: '11 Mar 2026', from: 'KITCHEN STORE', to: 'JAMIA STORE', items: 4, status: 'Completed' },
  { id: 'TRF-202603-0005', date: '10 Mar 2026', from: 'DRY STORE', to: 'COLD STORE', items: 3, status: 'In Transit' },
];

const statusStyle: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700 border-green-300',
  'In Transit': 'bg-blue-100 text-blue-700 border-blue-300',
  Pending: 'bg-amber-100 text-amber-700 border-amber-300',
};

export default function StockTransfersPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Transfers</h1>
          <p className="text-muted-foreground mt-1">Inter-warehouse stock movement tracking</p>
        </div>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          New Transfer
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Transfers This Month', value: '12', icon: ArrowRightLeft, color: 'text-blue-600' },
          { label: 'In Transit', value: '3', icon: Loader2, color: 'text-amber-600' },
          { label: 'Completed', value: '9', icon: CheckCircle2, color: 'text-green-600' },
          { label: 'Value Transferred', value: 'PKR 124K', icon: TrendingUp, color: 'text-purple-600' },
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

      {/* Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Volume by Month</CardTitle>
          <CardDescription>Transfer count and total value (Oct 2025 – Mar 2026)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={transferVolume} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="transferGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis yAxisId="left" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(val: number, name: string) =>
                  name === 'value' ? [`PKR ${val.toLocaleString()}`, 'Value'] : [val, 'Transfers']
                }
              />
              <Area yAxisId="left" type="monotone" dataKey="volume" stroke="#3B82F6" fill="url(#transferGrad)" name="Transfers" />
              <Area yAxisId="right" type="monotone" dataKey="value" stroke="#14B8A6" fill="url(#valueGrad)" name="value" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transfers</CardTitle>
          <CardDescription>Latest inter-warehouse transfer transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transfer No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>From Warehouse</TableHead>
                <TableHead>To Warehouse</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-sm font-medium">{row.id}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.date}</TableCell>
                  <TableCell className="font-medium">{row.from}</TableCell>
                  <TableCell className="font-medium">{row.to}</TableCell>
                  <TableCell className="text-center">{row.items}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={statusStyle[row.status]}>{row.status}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="sm">View</Button>
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
