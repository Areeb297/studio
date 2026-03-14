'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Send, Clock, Building2, Package } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const tooltipStyle = { backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' };

const issuesByDept = [
  { dept: 'DESI KITCHEN', Oct: 38, Nov: 42, Dec: 35, Jan: 40, Feb: 38, Mar: 45 },
  { dept: 'CHINESE KITCHEN', Oct: 30, Nov: 28, Dec: 32, Jan: 35, Feb: 30, Mar: 33 },
  { dept: 'BBQ KITCHEN', Oct: 22, Nov: 25, Dec: 20, Jan: 24, Feb: 22, Mar: 28 },
  { dept: 'RESTAURANT STORE', Oct: 18, Nov: 20, Dec: 22, Jan: 19, Feb: 21, Mar: 24 },
  { dept: 'ADMIN', Oct: 12, Nov: 10, Dec: 14, Jan: 12, Feb: 11, Mar: 15 },
  { dept: 'GENERAL STORE', Oct: 8, Nov: 9, Dec: 10, Jan: 8, Feb: 9, Mar: 10 },
];

const recentIssues = [
  { id: 'ISS-202603-0012', date: '14 Mar 2026', dept: 'DESI KITCHEN', items: 8, value: 24800, status: 'Issued' },
  { id: 'ISS-202603-0011', date: '14 Mar 2026', dept: 'CHINESE KITCHEN', items: 5, value: 18400, status: 'Issued' },
  { id: 'ISS-202603-0010', date: '13 Mar 2026', dept: 'BBQ KITCHEN', items: 6, value: 31200, status: 'Issued' },
  { id: 'ISS-202603-0009', date: '13 Mar 2026', dept: 'RESTAURANT STORE DEPT', items: 3, value: 9600, status: 'Pending' },
  { id: 'ISS-202603-0008', date: '12 Mar 2026', dept: 'ADMIN', items: 4, value: 5800, status: 'Issued' },
  { id: 'ISS-202603-0007', date: '12 Mar 2026', dept: 'COLD STORE', items: 2, value: 14200, status: 'Pending' },
  { id: 'ISS-202603-0006', date: '11 Mar 2026', dept: 'GENERAL STORE', items: 7, value: 8900, status: 'Issued' },
  { id: 'ISS-202603-0005', date: '11 Mar 2026', dept: 'KITCHEN STORE', items: 5, value: 12300, status: 'Cancelled' },
  { id: 'ISS-202603-0004', date: '10 Mar 2026', dept: 'DESI KITCHEN', items: 9, value: 27600, status: 'Issued' },
  { id: 'ISS-202603-0003', date: '10 Mar 2026', dept: 'DRY STORE', items: 3, value: 7400, status: 'Pending' },
];

const statusStyle: Record<string, string> = {
  Issued: 'bg-green-100 text-green-700 border-green-300',
  Pending: 'bg-amber-100 text-amber-700 border-amber-300',
  Cancelled: 'bg-red-100 text-red-700 border-red-300',
};

export default function StockIssuesPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Issues</h1>
          <p className="text-muted-foreground mt-1">Material issues from warehouses to departments</p>
        </div>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          New Issue
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Issues This Month', value: '45', icon: Send, color: 'text-blue-600' },
          { label: 'Pending Issues', value: '8', icon: Clock, color: 'text-amber-600' },
          { label: 'Departments Served', value: '9', icon: Building2, color: 'text-green-600' },
          { label: 'Units Issued', value: '1,840', icon: Package, color: 'text-purple-600' },
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

      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Issues by Department — Last 6 Months</CardTitle>
          <CardDescription>Monthly stock issue counts per department (Oct 2025 – Mar 2026)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={issuesByDept} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="dept" fontSize={10} angle={-20} textAnchor="end" height={50} />
              <YAxis fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="Oct" fill="#14B8A6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Nov" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Dec" fill="#3B82F6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Jan" fill="#F59E0B" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Feb" fill="#EF4444" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Mar" fill="#10B981" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Stock Issues</CardTitle>
          <CardDescription>Latest issue transactions — March 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentIssues.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-sm font-medium">{row.id}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.date}</TableCell>
                  <TableCell className="font-medium">{row.dept}</TableCell>
                  <TableCell className="text-center">{row.items}</TableCell>
                  <TableCell className="text-right font-medium">PKR {row.value.toLocaleString()}</TableCell>
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
