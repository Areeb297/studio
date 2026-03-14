'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, RefreshCcw, CheckCircle2, XCircle, Clock } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const tooltipStyle = { backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' };

const returnReasons = [
  { name: 'Wrong Item Issued', value: 4, color: '#EF4444' },
  { name: 'Excess Quantity', value: 3, color: '#F97316' },
  { name: 'Quality Issue', value: 3, color: '#F59E0B' },
  { name: 'Damaged in Transit', value: 2, color: '#8B5CF6' },
  { name: 'Not Required', value: 2, color: '#3B82F6' },
];

const returns = [
  { id: 'RET-202603-0014', date: '14 Mar 2026', dept: 'DESI KITCHEN', issueRef: 'ISS-202603-0009', items: 3, reason: 'Wrong Item Issued', status: 'Accepted' },
  { id: 'RET-202603-0013', date: '14 Mar 2026', dept: 'CHINESE KITCHEN', issueRef: 'ISS-202603-0008', items: 1, reason: 'Excess Quantity', status: 'Pending' },
  { id: 'RET-202603-0012', date: '13 Mar 2026', dept: 'BBQ KITCHEN', issueRef: 'ISS-202603-0007', items: 2, reason: 'Quality Issue', status: 'Accepted' },
  { id: 'RET-202603-0011', date: '13 Mar 2026', dept: 'ADMIN', issueRef: 'ISS-202603-0006', items: 1, reason: 'Not Required', status: 'Pending' },
  { id: 'RET-202603-0010', date: '12 Mar 2026', dept: 'GENERAL STORE', issueRef: 'ISS-202603-0005', items: 4, reason: 'Excess Quantity', status: 'Accepted' },
  { id: 'RET-202603-0009', date: '12 Mar 2026', dept: 'KITCHEN STORE', issueRef: 'ISS-202603-0004', items: 2, reason: 'Damaged in Transit', status: 'Accepted' },
  { id: 'RET-202603-0008', date: '11 Mar 2026', dept: 'DESI KITCHEN', issueRef: 'ISS-202603-0003', items: 1, reason: 'Wrong Item Issued', status: 'Rejected' },
  { id: 'RET-202603-0007', date: '11 Mar 2026', dept: 'RESTAURANT STORE DEPT', issueRef: 'ISS-202603-0002', items: 3, reason: 'Quality Issue', status: 'Accepted' },
  { id: 'RET-202603-0006', date: '10 Mar 2026', dept: 'BBQ KITCHEN', issueRef: 'ISS-202603-0001', items: 2, reason: 'Excess Quantity', status: 'Pending' },
  { id: 'RET-202603-0005', date: '10 Mar 2026', dept: 'COLD STORE', issueRef: 'ISS-202602-0042', items: 1, reason: 'Not Required', status: 'Accepted' },
];

const statusStyle: Record<string, string> = {
  Accepted: 'bg-green-100 text-green-700 border-green-300',
  Pending: 'bg-amber-100 text-amber-700 border-amber-300',
  Rejected: 'bg-red-100 text-red-700 border-red-300',
};

export default function SalesReturnsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Department Returns</h1>
          <p className="text-muted-foreground mt-1">Items returned from departments back to store</p>
        </div>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          New Return
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Returns This Month', value: '14', icon: RefreshCcw, color: 'text-blue-600' },
          { label: 'Pending Processing', value: '4', icon: Clock, color: 'text-amber-600' },
          { label: 'Accepted Returns', value: '9', icon: CheckCircle2, color: 'text-green-600' },
          { label: 'Rejected', value: '1', icon: XCircle, color: 'text-red-600' },
          { label: 'Value Returned', value: 'PKR 28K', icon: RefreshCcw, color: 'text-purple-600' },
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

      {/* Donut Chart + Table */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Return Reasons</CardTitle>
            <CardDescription>Distribution of this month's returns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={returnReasons} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4}>
                  {returnReasons.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v, 'Returns']} />
                <Legend formatter={(v) => <span className="text-xs">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Returns</CardTitle>
            <CardDescription>Department return log — March 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Issue Ref</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returns.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs font-medium">{row.id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{row.date}</TableCell>
                    <TableCell className="text-sm font-medium">{row.dept}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{row.issueRef}</TableCell>
                    <TableCell className="text-center">{row.items}</TableCell>
                    <TableCell className="text-xs">{row.reason}</TableCell>
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
    </div>
  );
}
