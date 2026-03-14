'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Building2, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const tooltipStyle = { backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' };

const budgetData = [
  { dept: 'DESI KITCHEN', budget: 420000, actual: 368000 },
  { dept: 'CHINESE KITCHEN', budget: 340000, actual: 298000 },
  { dept: 'BBQ KITCHEN', budget: 280000, actual: 261000 },
  { dept: 'RESTAURANT STORE', budget: 220000, actual: 198000 },
  { dept: 'ADMIN', budget: 180000, actual: 154000 },
  { dept: 'GENERAL STORE', budget: 160000, actual: 142000 },
  { dept: 'REPAIR & MAINT.', budget: 140000, actual: 128000 },
  { dept: 'ACCOUNTS', budget: 120000, actual: 112000 },
];

const costCenters = [
  { code: 'CC-001', name: 'DESI KITCHEN', head: 'Head Chef A', budget: 420000, utilized: 368000, pct: 88, status: 'Active' },
  { code: 'CC-002', name: 'CHINESE KITCHEN', head: 'Head Chef B', budget: 340000, utilized: 298000, pct: 88, status: 'Active' },
  { code: 'CC-003', name: 'BBQ KITCHEN', head: 'Head Chef C', budget: 280000, utilized: 261000, pct: 93, status: 'Active' },
  { code: 'CC-004', name: 'RESTAURANT STORE DEPT', head: 'Store Manager', budget: 220000, utilized: 198000, pct: 90, status: 'Active' },
  { code: 'CC-005', name: 'STORE DEPT', head: 'Warehouse Mgr', budget: 190000, utilized: 156000, pct: 82, status: 'Active' },
  { code: 'CC-006', name: 'REPAIR & MAINTENANCE', head: 'Maint. Supervisor', budget: 140000, utilized: 128000, pct: 91, status: 'Active' },
  { code: 'CC-007', name: 'ADMIN', head: 'Admin Manager', budget: 180000, utilized: 154000, pct: 86, status: 'Active' },
  { code: 'CC-008', name: 'ACCOUNTS', head: 'Chief Accountant', budget: 120000, utilized: 112000, pct: 93, status: 'Active' },
  { code: 'CC-009', name: 'BFMS', head: 'BFMS Head', budget: 100000, utilized: 72000, pct: 72, status: 'Active' },
  { code: 'CC-010', name: 'GENERAL STORE', head: 'Store Keeper', budget: 160000, utilized: 142000, pct: 89, status: 'Active' },
  { code: 'CC-011', name: 'KITCHEN STORE', head: 'Kitchen Mgr', budget: 130000, utilized: 98000, pct: 75, status: 'Active' },
  { code: 'CC-012', name: 'DRY STORE', head: 'Dry Store Mgr', budget: 110000, utilized: 87000, pct: 79, status: 'Active' },
  { code: 'CC-013', name: 'COLD STORE', head: 'Cold Store Mgr', budget: 110000, utilized: 94000, pct: 85, status: 'Active' },
];

const totalBudget = costCenters.reduce((a, c) => a + c.budget, 0);
const totalUtilized = costCenters.reduce((a, c) => a + c.utilized, 0);
const overBudget = costCenters.filter((c) => c.pct > 90).length;

export default function CostCentersPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cost Centers</h1>
          <p className="text-muted-foreground mt-1">Departmental budget allocation and utilization tracking</p>
        </div>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Cost Center
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Cost Centers', value: '13', icon: Building2, color: 'text-blue-600' },
          { label: 'Total Budget', value: `PKR ${(totalBudget / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-green-600' },
          { label: `Utilized (${Math.round(totalUtilized / totalBudget * 100)}%)`, value: `PKR ${(totalUtilized / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-amber-600' },
          { label: 'Near Limit (>90%)', value: overBudget.toString(), icon: AlertTriangle, color: 'text-red-600' },
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
          <CardTitle>Budget vs Actual by Department</CardTitle>
          <CardDescription>Top 8 departments — PKR values</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" horizontal={false} />
              <XAxis type="number" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <YAxis dataKey="dept" type="category" width={130} fontSize={10} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n: string) => [`PKR ${v.toLocaleString()}`, n === 'budget' ? 'Budget' : 'Actual']} />
              <Legend />
              <Bar dataKey="budget" fill="#3B82F6" name="Budget" radius={[0, 2, 2, 0]} opacity={0.5} />
              <Bar dataKey="actual" fill="#10B981" name="Actual" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cost Centers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Cost Centers</CardTitle>
          <CardDescription>13 cost centers — current period utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Cost Center</TableHead>
                <TableHead>Dept Head</TableHead>
                <TableHead className="text-right">Budget (PKR)</TableHead>
                <TableHead className="text-right">Utilized (PKR)</TableHead>
                <TableHead className="w-32">% Used</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costCenters.map((row) => (
                <TableRow key={row.code}>
                  <TableCell className="font-mono text-sm">{row.code}</TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.head}</TableCell>
                  <TableCell className="text-right">{row.budget.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium">{row.utilized.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={row.pct} className="h-1.5 flex-1" />
                      <span className={`text-xs font-medium w-8 ${row.pct > 90 ? 'text-red-600' : row.pct > 80 ? 'text-amber-600' : 'text-green-600'}`}>{row.pct}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-green-100 text-green-700 border-green-300">{row.status}</Badge>
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
