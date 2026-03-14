'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, DollarSign, AlertTriangle, Tag, Calendar } from "lucide-react";
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';

const tooltipStyle = { backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' };

const COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#F97316', '#14B8A6', '#EC4899', '#84CC16', '#6366F1'];

const treemapData = [
  { name: 'MEAT & POULTRY', size: 920000 },
  { name: 'GRAINS & PULSES', size: 680000 },
  { name: 'COOKING ESSENTIALS', size: 580000 },
  { name: 'CONSTRUCTION MATL', size: 420000 },
  { name: 'OTHER', size: 510000 },
  { name: 'VEGETABLES', size: 320000 },
  { name: 'SPICES', size: 210000 },
  { name: 'ELECTRICAL', size: 195000 },
  { name: 'CROCKERY', size: 145000 },
  { name: 'CLEANING', size: 88000 },
];

const totalValue = treemapData.reduce((a, c) => a + c.size, 0);

const valuationTable = [
  { category: 'MEAT & POULTRY', items: 284, totalQty: 1840, avgCost: 500, totalValue: 920000 },
  { category: 'GRAINS & PULSES', items: 198, totalQty: 6800, avgCost: 100, totalValue: 680000 },
  { category: 'COOKING ESSENTIALS', items: 143, totalQty: 2900, avgCost: 200, totalValue: 580000 },
  { category: 'CONSTRUCTION MATL', items: 64, totalQty: 4200, avgCost: 100, totalValue: 420000 },
  { category: 'OTHER', items: 798, totalQty: 12750, avgCost: 40, totalValue: 510000 },
  { category: 'VEGETABLES & FRESH', items: 176, totalQty: 3200, avgCost: 100, totalValue: 320000 },
  { category: 'SPICES & CONDIMENTS', items: 154, totalQty: 2100, avgCost: 100, totalValue: 210000 },
  { category: 'ELECTRICAL ITEMS', items: 87, totalQty: 780, avgCost: 250, totalValue: 195000 },
  { category: 'CROCKERY & UTENSILS', items: 112, totalQty: 1450, avgCost: 100, totalValue: 145000 },
  { category: 'CLEANING & HYGIENE', items: 98, totalQty: 880, avgCost: 100, totalValue: 88000 },
];

const CustomContent = (props: any) => {
  const { x, y, width, height, name, index, value } = props;
  if (width < 40 || height < 25) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={COLORS[index % COLORS.length]} rx={4} opacity={0.85} />
      {width > 70 && height > 35 && (
        <text x={x + width / 2} y={y + height / 2 - 8} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={10} fontWeight="600">
          {name.length > 14 ? name.slice(0, 13) + '…' : name}
        </text>
      )}
      {width > 70 && height > 50 && (
        <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={10}>
          PKR {(value / 1000).toFixed(0)}K
        </text>
      )}
    </g>
  );
};

export default function StockValuationPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Valuation Report</h1>
          <p className="text-muted-foreground mt-1">Current inventory valuation across all categories — weighted average costing</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Stock Value', value: `PKR ${(totalValue / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-green-600' },
          { label: 'Highest Category', value: 'Meat PKR 920K', icon: Tag, color: 'text-blue-600' },
          { label: 'Items with Zero Value', value: '42', icon: AlertTriangle, color: 'text-amber-600' },
          { label: 'Last Valuation Date', value: '14 Mar 2026', icon: Calendar, color: 'text-purple-600' },
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

      {/* Treemap */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Value by Category</CardTitle>
          <CardDescription>Area proportional to total stock value — PKR {(totalValue / 1000000).toFixed(2)}M total</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={340}>
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={16 / 9}
              content={<CustomContent />}
            >
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(val: number, _n: string, props: any) => {
                  const name = props?.payload?.name ?? '';
                  return [`PKR ${val.toLocaleString()} (${((val / totalValue) * 100).toFixed(1)}%)`, name];
                }}
              />
            </Treemap>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Valuation Table */}
      <Card>
        <CardHeader>
          <CardTitle>Valuation by Category</CardTitle>
          <CardDescription>Detailed breakdown with unit costs and portfolio share</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Total Items</TableHead>
                <TableHead className="text-center">Total Qty</TableHead>
                <TableHead className="text-right">Avg Unit Cost</TableHead>
                <TableHead className="text-right">Total Value (PKR)</TableHead>
                <TableHead className="text-right">% of Portfolio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {valuationTable.map((row) => (
                <TableRow key={row.category}>
                  <TableCell className="font-medium">{row.category}</TableCell>
                  <TableCell className="text-center">{row.items}</TableCell>
                  <TableCell className="text-center">{row.totalQty.toLocaleString()}</TableCell>
                  <TableCell className="text-right">PKR {row.avgCost}</TableCell>
                  <TableCell className="text-right font-bold">PKR {row.totalValue.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium text-muted-foreground">
                    {((row.totalValue / totalValue) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="border-t-2 font-bold">
                <TableCell>TOTAL</TableCell>
                <TableCell className="text-center">{valuationTable.reduce((a, r) => a + r.items, 0)}</TableCell>
                <TableCell className="text-center">{valuationTable.reduce((a, r) => a + r.totalQty, 0).toLocaleString()}</TableCell>
                <TableCell />
                <TableCell className="text-right text-green-600">PKR {totalValue.toLocaleString()}</TableCell>
                <TableCell className="text-right">100.0%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
