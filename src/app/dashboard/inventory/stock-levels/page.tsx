'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, TrendingDown, AlertTriangle, Settings, Download, Search, Bell } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const stockItems = [
  { id: 1, code: 'CONCROCKERY-0004', name: 'LASSI GLASS', current: 21, min: 15, max: 50, reorder: 20, status: 'LOW_STOCK' },
  { id: 2, code: 'FOOD-0001', name: 'Basmati Rice 25kg', current: 150, min: 100, max: 300, reorder: 120, status: 'IN_STOCK' },
  { id: 3, code: 'CLEAN-0015', name: 'Dish Soap Industrial', current: 5, min: 10, max: 30, reorder: 15, status: 'OUT_OF_STOCK' },
  { id: 4, code: 'EQUIP-0023', name: 'Commercial Blender', current: 8, min: 5, max: 15, reorder: 7, status: 'IN_STOCK' },
  { id: 5, code: 'FOOD-0045', name: 'Cooking Oil 5L', current: 45, min: 30, max: 80, reorder: 35, status: 'IN_STOCK' },
  { id: 6, code: 'CONCROCKERY-0008', name: 'Dinner Plates Set', current: 12, min: 20, max: 60, reorder: 25, status: 'LOW_STOCK' },
];

const reorderSuggestions = [
  { item: 'Dish Soap Industrial', currentStock: 5, reorderQty: 20, estimatedCost: 5000 },
  { item: 'LASSI GLASS', currentStock: 21, reorderQty: 30, estimatedCost: 3000 },
  { item: 'Dinner Plates Set', currentStock: 12, reorderQty: 40, estimatedCost: 8000 },
];

const stockDistribution = [
  { status: 'In Stock', count: 3 },
  { status: 'Low Stock', count: 2 },
  { status: 'Out of Stock', count: 1 },
];

const formatPKR = (amount: number) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function StockLevelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  const lowStockCount = stockItems.filter(i => i.status === 'LOW_STOCK').length;
  const outOfStockCount = stockItems.filter(i => i.status === 'OUT_OF_STOCK').length;
  const reorderCount = stockItems.filter(i => i.current <= i.reorder).length;
  const totalReorderCost = reorderSuggestions.reduce((sum, s) => sum + s.estimatedCost, 0);

  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Stock Level Controls</h1>
        <p className="text-muted-foreground">Manage minimum, maximum, and reorder levels for inventory items</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockItems.length}</div>
            <p className="text-xs text-muted-foreground">Active SKUs</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Below minimum</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground">Urgent action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reorder Items</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reorderCount}</div>
            <p className="text-xs text-muted-foreground">Need reordering</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Stock Status Distribution</CardTitle>
            <CardDescription>Items by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stockDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="hsl(var(--primary))" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reorder Suggestions</CardTitle>
            <CardDescription>Automated reorder recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reorderSuggestions.map((sug, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium">{sug.item}</div>
                    <div className="text-sm text-muted-foreground">
                      Current: {sug.currentStock} | Order: {sug.reorderQty} units
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatPKR(sug.estimatedCost)}</div>
                    <Button size="sm" className="mt-1">Create PR</Button>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t flex justify-between items-center">
                <span className="font-medium">Total Estimated Cost:</span>
                <span className="text-xl font-bold text-primary">{formatPKR(totalReorderCost)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full sm:w-64"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button variant="outline" onClick={() => setIsConfigDialogOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />Configure Levels
          </Button>
          <Button><Bell className="h-4 w-4 mr-2" />Setup Alerts</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Level Configuration ({filteredItems.length})</CardTitle>
          <CardDescription>Min/Max/Reorder levels for all items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead className="text-right">Current</TableHead>
                  <TableHead className="text-right">Min</TableHead>
                  <TableHead className="text-right">Reorder</TableHead>
                  <TableHead className="text-right">Max</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right font-mono font-bold">{item.current}</TableCell>
                    <TableCell className="text-right font-mono">{item.min}</TableCell>
                    <TableCell className="text-right font-mono">{item.reorder}</TableCell>
                    <TableCell className="text-right font-mono">{item.max}</TableCell>
                    <TableCell>
                      <Badge variant={
                        item.status === 'OUT_OF_STOCK' ? 'destructive' :
                        item.status === 'LOW_STOCK' ? 'secondary' :
                        'default'
                      }>
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configure Stock Levels</DialogTitle>
            <DialogDescription>Set minimum, maximum, and reorder levels</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Minimum Stock</Label>
                <Input type="number" placeholder="e.g., 10" />
              </div>
              <div className="grid gap-2">
                <Label>Maximum Stock</Label>
                <Input type="number" placeholder="e.g., 50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Reorder Level</Label>
                <Input type="number" placeholder="e.g., 15" />
              </div>
              <div className="grid gap-2">
                <Label>Reorder Quantity</Label>
                <Input type="number" placeholder="e.g., 30" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsConfigDialogOpen(false)}>Save Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
