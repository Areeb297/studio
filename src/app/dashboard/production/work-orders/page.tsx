'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Wrench, CheckCircle2, Clock, BarChart2 } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const tooltipStyle = { backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' };

const productionOutput = [
  { week: 'Wk 9', biryani: 120, karahi: 80, bbq: 65, dal: 90 },
  { week: 'Wk 10', biryani: 135, karahi: 95, bbq: 70, dal: 85 },
  { week: 'Wk 11', biryani: 110, karahi: 75, bbq: 80, dal: 100 },
  { week: 'Wk 12', biryani: 145, karahi: 100, bbq: 75, dal: 110 },
  { week: 'Wk 13', biryani: 130, karahi: 90, bbq: 85, dal: 95 },
  { week: 'Wk 14', biryani: 150, karahi: 105, bbq: 90, dal: 115 },
];

const workOrders = [
  { id: 'WO-202603-0010', recipe: '1KG Biryani', kitchen: 'DESI KITCHEN', qtyOrdered: 80, qtyProduced: 65, startDate: '14 Mar 2026', status: 'In Progress' },
  { id: 'WO-202603-0009', recipe: 'Desi Karahi (1KG)', kitchen: 'DESI KITCHEN', qtyOrdered: 40, qtyProduced: 40, startDate: '14 Mar 2026', status: 'Completed' },
  { id: 'WO-202603-0008', recipe: 'BBQ Mix Platter', kitchen: 'BBQ KITCHEN', qtyOrdered: 30, qtyProduced: 30, startDate: '13 Mar 2026', status: 'Completed' },
  { id: 'WO-202603-0007', recipe: 'Haleem (1KG)', kitchen: 'DESI KITCHEN', qtyOrdered: 25, qtyProduced: 18, startDate: '13 Mar 2026', status: 'In Progress' },
  { id: 'WO-202603-0006', recipe: 'Chinese Fried Rice', kitchen: 'CHINESE KITCHEN', qtyOrdered: 50, qtyProduced: 0, startDate: '15 Mar 2026', status: 'Scheduled' },
  { id: 'WO-202603-0005', recipe: 'Nihari (1KG)', kitchen: 'DESI KITCHEN', qtyOrdered: 35, qtyProduced: 35, startDate: '12 Mar 2026', status: 'Completed' },
  { id: 'WO-202603-0004', recipe: 'Dal Makhani (2L)', kitchen: 'DESI KITCHEN', qtyOrdered: 20, qtyProduced: 0, startDate: '15 Mar 2026', status: 'Scheduled' },
  { id: 'WO-202603-0003', recipe: 'Shami Kebab (1DZ)', kitchen: 'BBQ KITCHEN', qtyOrdered: 60, qtyProduced: 0, startDate: '16 Mar 2026', status: 'Scheduled' },
  { id: 'WO-202603-0002', recipe: 'Chicken Manchurian', kitchen: 'CHINESE KITCHEN', qtyOrdered: 45, qtyProduced: 40, startDate: '13 Mar 2026', status: 'In Progress' },
  { id: 'WO-202603-0001', recipe: '1KG Biryani', kitchen: 'DESI KITCHEN', qtyOrdered: 100, qtyProduced: 100, startDate: '12 Mar 2026', status: 'Completed' },
];

const statusStyle: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700 border-green-300',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-300',
  Scheduled: 'bg-amber-100 text-amber-700 border-amber-300',
};

export default function WorkOrdersPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Work Orders</h1>
          <p className="text-muted-foreground mt-1">Kitchen production work orders and output tracking</p>
        </div>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          New Work Order
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Work Orders', value: '8', icon: Wrench, color: 'text-blue-600' },
          { label: 'Completed Today', value: '3', icon: CheckCircle2, color: 'text-green-600' },
          { label: 'In Queue', value: '5', icon: Clock, color: 'text-amber-600' },
          { label: 'Units Produced', value: '420', icon: BarChart2, color: 'text-purple-600' },
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
          <CardTitle>Production Output by Week</CardTitle>
          <CardDescription>Units produced per recipe over last 6 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={productionOutput} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                {[
                  { id: 'bGrad', color: '#14B8A6' },
                  { id: 'kGrad', color: '#8B5CF6' },
                  { id: 'bqGrad', color: '#EF4444' },
                  { id: 'dGrad', color: '#F59E0B' },
                ].map(g => (
                  <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={g.color} stopOpacity={0.7} />
                    <stop offset="95%" stopColor={g.color} stopOpacity={0.05} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="week" fontSize={12} />
              <YAxis fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Area type="monotone" dataKey="biryani" stroke="#14B8A6" fill="url(#bGrad)" name="Biryani" />
              <Area type="monotone" dataKey="karahi" stroke="#8B5CF6" fill="url(#kGrad)" name="Karahi" />
              <Area type="monotone" dataKey="bbq" stroke="#EF4444" fill="url(#bqGrad)" name="BBQ" />
              <Area type="monotone" dataKey="dal" stroke="#F59E0B" fill="url(#dGrad)" name="Dal" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Work Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Work Orders</CardTitle>
          <CardDescription>All production work orders — March 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Work Order No</TableHead>
                <TableHead>Recipe</TableHead>
                <TableHead>Kitchen</TableHead>
                <TableHead className="text-center">Qty Ordered</TableHead>
                <TableHead className="text-center">Qty Produced</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrders.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-sm font-medium">{row.id}</TableCell>
                  <TableCell className="font-medium">{row.recipe}</TableCell>
                  <TableCell className="text-sm">{row.kitchen}</TableCell>
                  <TableCell className="text-center">{row.qtyOrdered}</TableCell>
                  <TableCell className={`text-center font-medium ${row.qtyProduced === row.qtyOrdered ? 'text-green-600' : row.qtyProduced > 0 ? 'text-blue-600' : 'text-muted-foreground'}`}>
                    {row.qtyProduced === 0 ? '—' : row.qtyProduced}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.startDate}</TableCell>
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
