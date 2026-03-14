'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Users, Clock, CheckCircle2, Star } from "lucide-react";
import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from 'recharts';

const tooltipStyle = { backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' };

const vendorChartData = [
  { name: 'ALI', orders: 8, grns: 16, onTime: 92 },
  { name: 'LOCAL SUPPLIER', orders: 4, grns: 8, onTime: 78 },
  { name: 'SALEEM BHAI', orders: 3, grns: 7, onTime: 85 },
  { name: 'Al-Madina', orders: 3, grns: 6, onTime: 88 },
  { name: 'CHICKEN SUPPLIER', orders: 2, grns: 4, onTime: 95 },
];

const metricColors = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6'];

const miniDonuts = [
  { supplier: 'ALI', metrics: [{ name: 'Delivery', v: 92 }, { name: 'Quality', v: 88 }, { name: 'Pricing', v: 85 }, { name: 'Reliability', v: 90 }] },
  { supplier: 'CHICKEN SUPPLIER', metrics: [{ name: 'Delivery', v: 95 }, { name: 'Quality', v: 92 }, { name: 'Pricing', v: 80 }, { name: 'Reliability', v: 94 }] },
  { supplier: 'Al-Madina', metrics: [{ name: 'Delivery', v: 88 }, { name: 'Quality', v: 84 }, { name: 'Pricing', v: 90 }, { name: 'Reliability', v: 86 }] },
  { supplier: 'SALEEM BHAI', metrics: [{ name: 'Delivery', v: 85 }, { name: 'Quality', v: 80 }, { name: 'Pricing', v: 88 }, { name: 'Reliability', v: 82 }] },
];

const vendors = [
  { name: 'ALI', pos: 8, grns: 16, leadDays: 2.4, onTime: 92, quality: 4.4, terms: 'Net 30' },
  { name: 'CHICKEN SUPPLIER', pos: 2, grns: 4, leadDays: 1.2, onTime: 95, quality: 4.7, terms: 'Cash' },
  { name: 'Al-Madina', pos: 3, grns: 6, leadDays: 3.1, onTime: 88, quality: 4.2, terms: 'Net 15' },
  { name: 'SALEEM BHAI', pos: 3, grns: 7, leadDays: 3.8, onTime: 85, quality: 3.9, terms: 'Net 7' },
  { name: 'LOCAL SUPPLIER', pos: 4, grns: 8, leadDays: 4.6, onTime: 78, quality: 3.6, terms: 'Cash' },
];

const ratingBadge = (r: number) => r >= 4.5 ? 'bg-green-100 text-green-700 border-green-300' : r >= 4.0 ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-amber-100 text-amber-700 border-amber-300';

export default function VendorPerformancePage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vendor Performance Report</h1>
          <p className="text-muted-foreground mt-1">Supplier performance analytics — 5 active suppliers</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Suppliers', value: '5', icon: Users, color: 'text-blue-600' },
          { label: 'Avg On-Time Rate', value: '87%', icon: CheckCircle2, color: 'text-green-600' },
          { label: 'Total Orders', value: '20', icon: CheckCircle2, color: 'text-purple-600' },
          { label: 'Avg Lead Time', value: '3.2 days', icon: Clock, color: 'text-amber-600' },
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

      {/* Composed Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Orders vs On-Time Delivery Rate</CardTitle>
          <CardDescription>Bar = total POs/GRNs · Line = on-time delivery %</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={vendorChartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis yAxisId="left" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" domain={[60, 100]} tickFormatter={(v) => `${v}%`} fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n: string) => [n === 'onTime' ? `${v}%` : v, n === 'onTime' ? 'On-Time %' : n === 'orders' ? 'POs' : 'GRNs']} />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" fill="#3B82F6" name="POs" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="grns" fill="#14B8A6" name="GRNs" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="onTime" stroke="#F59E0B" strokeWidth={2} name="onTime" dot={{ r: 5, fill: '#F59E0B' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Mini Donuts for 4 suppliers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {miniDonuts.map((s) => (
          <Card key={s.supplier}>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">{s.supplier}</CardTitle>
              <CardDescription className="text-xs">4 performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={s.metrics} dataKey="v" nameKey="name" cx="50%" cy="50%" innerRadius={28} outerRadius={48} paddingAngle={3}>
                    {s.metrics.map((_, i) => <Cell key={i} fill={metricColors[i % metricColors.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n: string) => [`${v}%`, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {s.metrics.map((m, i) => (
                  <div key={m.name} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: metricColors[i] }} />
                    <span className="text-xs text-muted-foreground">{m.name} {m.v}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vendor Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Summary</CardTitle>
          <CardDescription>Performance overview for all 5 suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-center">Total POs</TableHead>
                <TableHead className="text-center">Total GRNs</TableHead>
                <TableHead className="text-center">Avg Lead (Days)</TableHead>
                <TableHead className="text-center">On-Time %</TableHead>
                <TableHead className="text-center">Quality Rating</TableHead>
                <TableHead>Payment Terms</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-center">{row.pos}</TableCell>
                  <TableCell className="text-center">{row.grns}</TableCell>
                  <TableCell className="text-center">{row.leadDays}</TableCell>
                  <TableCell className={`text-center font-medium ${row.onTime >= 90 ? 'text-green-600' : row.onTime >= 80 ? 'text-amber-600' : 'text-red-600'}`}>
                    {row.onTime}%
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={ratingBadge(row.quality)}>
                      <Star className="w-3 h-3 mr-1 inline" />
                      {row.quality}/5
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{row.terms}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
