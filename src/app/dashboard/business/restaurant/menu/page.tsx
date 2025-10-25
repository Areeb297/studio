'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Utensils, PlusCircle, Edit, Trash2, ChefHat, Search, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const menuItems = [
  { id: 1, code: 'MAIN-001', name: 'Chicken Biryani', category: 'Main Course', subCategory: 'Rice Dishes', price: 350, cost: 180, margin: 48.6, available: true, preparationTime: 25 },
  { id: 2, code: 'MAIN-002', name: 'Chicken Karahi', category: 'Main Course', subCategory: 'Karahi', price: 550, cost: 280, margin: 49.1, available: true, preparationTime: 30 },
  { id: 3, code: 'MAIN-003', name: 'Mutton Korma', category: 'Main Course', subCategory: 'Curry', price: 650, cost: 380, margin: 41.5, available: true, preparationTime: 40 },
  { id: 4, code: 'BEV-001', name: 'Lassi', category: 'Beverages', subCategory: 'Cold Drinks', price: 80, cost: 25, margin: 68.8, available: true, preparationTime: 5 },
  { id: 5, code: 'BEV-002', name: 'Fresh Juice', category: 'Beverages', subCategory: 'Cold Drinks', price: 120, cost: 45, margin: 62.5, available: true, preparationTime: 5 },
  { id: 6, code: 'BREAD-001', name: 'Naan', category: 'Bread', subCategory: 'Tandoor', price: 20, cost: 8, margin: 60.0, available: true, preparationTime: 8 },
  { id: 7, code: 'BREAD-002', name: 'Garlic Naan', category: 'Bread', subCategory: 'Tandoor', price: 30, cost: 12, margin: 60.0, available: true, preparationTime: 10 },
  { id: 8, code: 'DESS-001', name: 'Kheer', category: 'Desserts', subCategory: 'Traditional', price: 100, cost: 35, margin: 65.0, available: true, preparationTime: 15 },
  { id: 9, code: 'STARTER-001', name: 'Chicken Tikka', category: 'Starters', subCategory: 'BBQ', price: 280, cost: 140, margin: 50.0, available: false, preparationTime: 20 },
  { id: 10, code: 'MAIN-004', name: 'Fish Masala', category: 'Main Course', subCategory: 'Seafood', price: 480, cost: 250, margin: 47.9, available: false, preparationTime: 35 },
];

const categories = ['Main Course', 'Beverages', 'Bread', 'Desserts', 'Starters'];

const formatPKR = (amount: number) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const availableItems = menuItems.filter(i => i.available).length;
  const unavailableItems = menuItems.filter(i => i.available === false).length;
  const avgMargin = (menuItems.reduce((sum, i) => sum + i.margin, 0) / menuItems.length).toFixed(1);
  const totalRevenue = menuItems.reduce((sum, i) => sum + i.price, 0);

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryDistribution = categories.map(cat => ({
    category: cat,
    count: menuItems.filter(i => i.category === cat).length,
    revenue: menuItems.filter(i => i.category === cat).reduce((sum, i) => sum + i.price, 0),
  }));

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Menu Management</h1>
        <p className="text-muted-foreground">Manage menu items, pricing, and availability</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuItems.length}</div>
            <p className="text-xs text-muted-foreground">{availableItems} available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Margin</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{avgMargin}%</div>
            <p className="text-xs text-muted-foreground">Profit margin</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unavailable</CardTitle>
            <ChefHat className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{unavailableItems}</div>
            <p className="text-xs text-muted-foreground">Out of stock/seasonal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Utensils className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Menu categories</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full sm:w-64"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="h-4 w-4 mr-2" />Add Menu Item</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Menu Item</DialogTitle>
                  <DialogDescription>Create a new item for your menu</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Item Code</Label>
                      <Input placeholder="e.g., MAIN-005" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Item Name</Label>
                      <Input placeholder="e.g., Beef Nihari" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Sub-Category</Label>
                      <Input placeholder="e.g., Curry" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label>Selling Price (PKR)</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Cost (PKR)</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Prep Time (min)</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="available" />
                    <Label htmlFor="available">Available for ordering</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>Add Item</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Menu Items ({filteredItems.length})</CardTitle>
              <CardDescription>Complete menu catalog with pricing and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Sub-Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                      <TableHead className="text-right">Margin %</TableHead>
                      <TableHead className="text-center">Prep Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.code}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.subCategory}</TableCell>
                        <TableCell className="text-right font-mono">{formatPKR(item.price)}</TableCell>
                        <TableCell className="text-right font-mono text-sm text-muted-foreground">{formatPKR(item.cost)}</TableCell>
                        <TableCell className="text-right font-mono font-bold text-green-700">{item.margin}%</TableCell>
                        <TableCell className="text-center">{item.preparationTime} min</TableCell>
                        <TableCell>
                          <Badge variant={item.available ? 'default' : 'secondary'}>
                            {item.available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Menu items organized by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryDistribution.map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-semibold text-lg">{cat.category}</div>
                      <div className="text-sm text-muted-foreground">{cat.count} items</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl">{formatPKR(cat.revenue)}</div>
                      <div className="text-xs text-muted-foreground">Total pricing</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
