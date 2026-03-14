'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, FolderOpen, Package } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const tooltipStyle = { backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' };

const typeData = [
  { name: 'CON (Consumable)', value: 20, color: '#3B82F6' },
  { name: 'FIN (Finished)', value: 11, color: '#10B981' },
  { name: 'RAW (Raw Material)', value: 8, color: '#F59E0B' },
  { name: 'PAK (Packaging)', value: 3, color: '#8B5CF6' },
  { name: 'Mixed', value: 5, color: '#14B8A6' },
];

const typeBadgeStyle: Record<string, string> = {
  CON: 'bg-blue-100 text-blue-700 border-blue-300',
  RAW: 'bg-amber-100 text-amber-700 border-amber-300',
  FIN: 'bg-green-100 text-green-700 border-green-300',
  PAK: 'bg-purple-100 text-purple-700 border-purple-300',
  Mixed: 'bg-teal-100 text-teal-700 border-teal-300',
};

const categoryCards = [
  { name: 'MEAT & POULTRY', items: 284, type: 'RAW', color: '#EF4444' },
  { name: 'GRAINS & PULSES', items: 198, type: 'CON', color: '#F59E0B' },
  { name: 'VEGETABLES & FRESH', items: 176, type: 'CON', color: '#10B981' },
  { name: 'SPICES & CONDIMENTS', items: 154, type: 'CON', color: '#F97316' },
  { name: 'COOKING ESSENTIALS', items: 143, type: 'CON', color: '#3B82F6' },
  { name: 'CROCKERY & UTENSILS', items: 112, type: 'FIN', color: '#8B5CF6' },
];

const allCategories = [
  { code: 'CAT-001', name: 'MEAT & POULTRY', type: 'RAW', items: 284, active: true },
  { code: 'CAT-002', name: 'GRAINS & PULSES', type: 'CON', items: 198, active: true },
  { code: 'CAT-003', name: 'VEGETABLES & FRESH', type: 'CON', items: 176, active: true },
  { code: 'CAT-004', name: 'SPICES & CONDIMENTS', type: 'CON', items: 154, active: true },
  { code: 'CAT-005', name: 'COOKING ESSENTIALS', type: 'CON', items: 143, active: true },
  { code: 'CAT-006', name: 'CROCKERY & UTENSILS', type: 'FIN', items: 112, active: true },
  { code: 'CAT-007', name: 'CLEANING & HYGIENE', type: 'CON', items: 98, active: true },
  { code: 'CAT-008', name: 'ELECTRICAL ITEMS', type: 'CON', items: 87, active: true },
  { code: 'CAT-009', name: 'CONSTRUCTION MATL.', type: 'RAW', items: 64, active: true },
  { code: 'CAT-010', name: 'DAIRY PRODUCTS', type: 'RAW', items: 58, active: true },
  { code: 'CAT-011', name: 'BEVERAGES', type: 'CON', items: 52, active: true },
  { code: 'CAT-012', name: 'PACKAGING MATERIAL', type: 'PAK', items: 48, active: true },
  { code: 'CAT-013', name: 'FRESH BAKERY', type: 'FIN', items: 44, active: true },
  { code: 'CAT-014', name: 'FROZEN ITEMS', type: 'RAW', items: 42, active: true },
  { code: 'CAT-015', name: 'STATIONARY', type: 'CON', items: 38, active: true },
  { code: 'CAT-016', name: 'MEDICINES & FIRST AID', type: 'CON', items: 35, active: true },
  { code: 'CAT-017', name: 'PRINTING MATERIAL', type: 'PAK', items: 30, active: true },
  { code: 'CAT-018', name: 'FURNITURE & FIXTURES', type: 'FIN', items: 28, active: true },
  { code: 'CAT-019', name: 'NUTS & DRY FRUITS', type: 'CON', items: 26, active: true },
  { code: 'CAT-020', name: 'LABORATORY ITEMS', type: 'CON', items: 22, active: false },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Item Categories</h1>
          <p className="text-muted-foreground mt-1">47 categories across all item types</p>
        </div>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Categories', value: '47', color: 'text-blue-600' },
          { label: 'CON Categories', value: '20', color: 'text-blue-500' },
          { label: 'FIN Categories', value: '11', color: 'text-green-600' },
          { label: 'RAW Categories', value: '8', color: 'text-amber-600' },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <FolderOpen className={`w-4 h-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Categories by Item Type</CardTitle>
            <CardDescription>Distribution of 47 categories by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={typeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4}>
                  {typeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v, 'Categories']} />
                <Legend formatter={(v) => <span className="text-xs">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Category Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Top Categories by Item Count</CardTitle>
            <CardDescription>Largest categories in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {categoryCards.map((cat) => (
                <div key={cat.name} className="p-3 rounded-lg border flex flex-col gap-1" style={{ borderLeftColor: cat.color, borderLeftWidth: 4 }}>
                  <div className="flex items-center justify-between">
                    <Badge className={typeBadgeStyle[cat.type]}>{cat.type}</Badge>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  </div>
                  <p className="text-xs font-semibold leading-tight mt-1">{cat.name}</p>
                  <p className="text-lg font-bold" style={{ color: cat.color }}>{cat.items}</p>
                  <p className="text-xs text-muted-foreground">items</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>Showing 20 of 47 categories</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Code</TableHead>
                <TableHead>Category Name</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="text-center">Items Count</TableHead>
                <TableHead className="text-center">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allCategories.map((row) => (
                <TableRow key={row.code}>
                  <TableCell className="font-mono text-sm">{row.code}</TableCell>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Package className="w-3 h-3 text-muted-foreground" />
                    {row.name}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={typeBadgeStyle[row.type]}>{row.type}</Badge>
                  </TableCell>
                  <TableCell className="text-center font-medium">{row.items}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={row.active ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-500 border-gray-300'}>
                      {row.active ? 'Active' : 'Inactive'}
                    </Badge>
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
