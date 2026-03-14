'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Warehouse, Package, BarChart2, CheckCircle2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const tooltipStyle = { backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' };

const warehouseData = [
  { name: 'JAMIA STORE', items: 420 },
  { name: 'COLD STORE', items: 186 },
  { name: 'DRY STORE', items: 340 },
  { name: 'KITCHEN STORE', items: 298 },
  { name: 'RESTAURANT STORE', items: 530 },
  { name: 'GENERAL STORE', items: 340 },
];

const warehouses = [
  {
    name: 'JAMIA STORE', location: 'Main Building, Ground Floor', manager: 'Warehouse Manager A',
    capacity: 2000, utilized: 1680, items: 420, pct: 84,
    categories: ['Dry Goods', 'Spices', 'Packaging'],
    color: '#3B82F6',
  },
  {
    name: 'COLD STORE', location: 'Kitchen Block, East Wing', manager: 'Cold Store Manager',
    capacity: 500, utilized: 372, items: 186, pct: 74,
    categories: ['Meat & Poultry', 'Dairy', 'Frozen'],
    color: '#14B8A6',
  },
  {
    name: 'DRY STORE', location: 'Main Building, B1', manager: 'Dry Store Manager',
    capacity: 1500, utilized: 1020, items: 340, pct: 68,
    categories: ['Grains', 'Pulses', 'Cooking Oil'],
    color: '#F59E0B',
  },
  {
    name: 'KITCHEN STORE', location: 'Kitchen Block, Level 1', manager: 'Kitchen Store Keeper',
    capacity: 800, utilized: 596, items: 298, pct: 75,
    categories: ['Fresh Produce', 'Spices', 'Sauces'],
    color: '#10B981',
  },
  {
    name: 'RESTAURANT STORE', location: 'Restaurant Wing, Ground', manager: 'Restaurant Store Mgr',
    capacity: 1200, utilized: 1060, items: 530, pct: 88,
    categories: ['Consumables', 'Crockery', 'Cleaning'],
    color: '#8B5CF6',
  },
  {
    name: 'GENERAL STORE', location: 'Admin Block, G Floor', manager: 'General Store Keeper',
    capacity: 1000, utilized: 680, items: 340, pct: 68,
    categories: ['Stationary', 'Electrical', 'Maintenance'],
    color: '#F97316',
  },
];

const totalCapacity = warehouses.reduce((a, w) => a + w.capacity, 0);
const totalUtilized = warehouses.reduce((a, w) => a + w.utilized, 0);

export default function WarehousesPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Warehouses</h1>
          <p className="text-muted-foreground mt-1">6 storage locations across all companies</p>
        </div>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Warehouse
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Warehouses', value: '6', icon: Warehouse, color: 'text-blue-600' },
          { label: 'Total Capacity', value: `${totalCapacity.toLocaleString()} units`, icon: BarChart2, color: 'text-purple-600' },
          { label: `Utilized (${Math.round(totalUtilized / totalCapacity * 100)}%)`, value: `${totalUtilized.toLocaleString()} units`, icon: Package, color: 'text-amber-600' },
          { label: 'Active Items', value: '2,114', icon: CheckCircle2, color: 'text-green-600' },
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

      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Items per Warehouse</CardTitle>
          <CardDescription>Active item count by storage location</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={warehouseData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" fontSize={10} angle={-15} textAnchor="end" height={45} />
              <YAxis fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="items" fill="#3B82F6" name="Items" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Warehouse Cards Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {warehouses.map((wh) => (
          <Card key={wh.name} className="overflow-hidden">
            <div className="h-1" style={{ backgroundColor: wh.color }} />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{wh.name}</CardTitle>
                <Badge className="bg-green-100 text-green-700 border-green-300">Active</Badge>
              </div>
              <CardDescription>{wh.location}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Manager:</span>
                <span className="font-medium">{wh.manager}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active Items:</span>
                <span className="font-medium">{wh.items}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Capacity Used:</span>
                  <span className="font-medium">{wh.utilized} / {wh.capacity} ({wh.pct}%)</span>
                </div>
                <Progress value={wh.pct} className="h-1.5" />
              </div>
              <div className="flex gap-1 flex-wrap">
                {wh.categories.map((c) => (
                  <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
