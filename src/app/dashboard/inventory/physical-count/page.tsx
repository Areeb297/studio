'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, ClipboardList, CheckSquare, AlertTriangle, Calendar } from "lucide-react";

const warehouses = [
  { name: 'JAMIA STORE', total: 420, counted: 412, pct: 98 },
  { name: 'COLD STORE', total: 186, counted: 172, pct: 92 },
  { name: 'DRY STORE', total: 340, counted: 310, pct: 91 },
  { name: 'KITCHEN STORE', total: 298, counted: 264, pct: 89 },
  { name: 'RESTAURANT STORE', total: 530, counted: 440, pct: 83 },
  { name: 'GENERAL STORE', total: 340, counted: 249, pct: 73 },
];

const countSheets = [
  { id: 'CNT-202603-0002', date: '14 Mar 2026', warehouse: 'JAMIA STORE', scheduled: 420, counted: 412, variances: 8, status: 'In Progress' },
  { id: 'CNT-202603-0001', date: '14 Mar 2026', warehouse: 'DRY STORE', scheduled: 340, counted: 310, variances: 6, status: 'In Progress' },
  { id: 'CNT-202602-0008', date: '28 Feb 2026', warehouse: 'COLD STORE', scheduled: 186, counted: 186, variances: 3, status: 'Completed' },
  { id: 'CNT-202602-0007', date: '20 Feb 2026', warehouse: 'KITCHEN STORE', scheduled: 298, counted: 298, variances: 4, status: 'Completed' },
  { id: 'CNT-202601-0005', date: '15 Jan 2026', warehouse: 'RESTAURANT STORE', scheduled: 530, counted: 530, variances: 12, status: 'Completed' },
  { id: 'CNT-202601-0004', date: '10 Jan 2026', warehouse: 'GENERAL STORE', scheduled: 340, counted: 340, variances: 7, status: 'Completed' },
  { id: 'CNT-202603-0003', date: '15 Mar 2026', warehouse: 'RESTAURANT STORE', scheduled: 530, counted: 0, variances: 0, status: 'Open' },
  { id: 'CNT-202603-0004', date: '15 Mar 2026', warehouse: 'GENERAL STORE', scheduled: 340, counted: 0, variances: 0, status: 'Open' },
];

const statusStyle: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700 border-green-300',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-300',
  Open: 'bg-amber-100 text-amber-700 border-amber-300',
};

export default function PhysicalCountPage() {
  const totalCounted = warehouses.reduce((a, w) => a + w.counted, 0);
  const totalItems = warehouses.reduce((a, w) => a + w.total, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Physical Stock Count</h1>
          <p className="text-muted-foreground mt-1">Conduct and reconcile physical inventory counts against system records</p>
        </div>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          New Count Sheet
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Counts', value: '2', icon: ClipboardList, color: 'text-blue-600' },
          { label: 'Items Counted (87%)', value: `${totalCounted.toLocaleString()} / ${totalItems.toLocaleString()}`, icon: CheckSquare, color: 'text-green-600' },
          { label: 'Variances Found', value: '23', icon: AlertTriangle, color: 'text-amber-600' },
          { label: 'Last Count Date', value: '01 Mar 2026', icon: Calendar, color: 'text-purple-600' },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Warehouse Count Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Count Progress by Warehouse</CardTitle>
          <CardDescription>Completion percentage for current counting cycle</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {warehouses.map((wh) => (
            <div key={wh.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{wh.name}</span>
                <span className="text-muted-foreground">{wh.counted} / {wh.total} items ({wh.pct}%)</span>
              </div>
              <Progress value={wh.pct} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Count Sheets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Count Sheets</CardTitle>
          <CardDescription>All physical count sessions across warehouses</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Count No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead className="text-center">Scheduled</TableHead>
                <TableHead className="text-center">Counted</TableHead>
                <TableHead className="text-center">Variances</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {countSheets.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-sm font-medium">{row.id}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.date}</TableCell>
                  <TableCell className="font-medium">{row.warehouse}</TableCell>
                  <TableCell className="text-center">{row.scheduled}</TableCell>
                  <TableCell className="text-center">{row.counted > 0 ? row.counted : '—'}</TableCell>
                  <TableCell className={`text-center font-medium ${row.variances > 0 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                    {row.variances > 0 ? row.variances : '—'}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={statusStyle[row.status]}>{row.status}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="sm">
                      {row.status === 'Open' ? 'Start' : 'View'}
                    </Button>
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
