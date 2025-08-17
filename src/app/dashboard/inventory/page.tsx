
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Warehouse, DollarSign, Users, AlertTriangle, PlusCircle, Search, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { alertUnusualPurchases, AlertUnusualPurchasesInput, AlertUnusualPurchasesOutput } from '@/ai/flows/alert-unusual-purchases';
import { Skeleton } from '@/components/ui/skeleton';

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  reorderLevel: number;
  minStock: number;
  maxStock: number;
  shelfLife: string;
  unitCost: number;
};

const initialInventory: InventoryItem[] = [
  { id: 'inv-1', name: 'Basmati Rice', category: 'Grains', currentStock: 50, unit: 'kg', reorderLevel: 25, minStock: 20, maxStock: 100, shelfLife: '1 year', unitCost: 400 },
  { id: 'inv-2', name: 'Chicken', category: 'Meat', currentStock: 15, unit: 'kg', reorderLevel: 25, minStock: 10, maxStock: 50, shelfLife: '3 days', unitCost: 600 },
  { id: 'inv-3', name: 'Tomatoes', category: 'Vegetables', currentStock: 30, unit: 'kg', reorderLevel: 15, minStock: 10, maxStock: 40, shelfLife: '5 days', unitCost: 120 },
  { id: 'inv-4', name: 'Onions', category: 'Vegetables', currentStock: 40, unit: 'kg', reorderLevel: 20, minStock: 15, maxStock: 60, shelfLife: '2 weeks', unitCost: 80 },
  { id: 'inv-5', name: 'Cooking Oil', category: 'Pantry', currentStock: 5, unit: 'liters', reorderLevel: 10, minStock: 5, maxStock: 25, shelfLife: '6 months', unitCost: 550 },
  { id: 'inv-6', name: 'Spices Mix', category: 'Pantry', currentStock: 8, unit: 'kg', reorderLevel: 7, minStock: 5, maxStock: 15, shelfLife: '1 year', unitCost: 1200 },
];

const vendors = [
    { id: 'ven-1', name: 'Metro Cash & Carry', type: 'Approved' },
    { id: 'ven-2', name: 'Local Sabzi Mandi', type: 'Open Market' },
    { id: 'ven-3', name: 'Al-Fatah Meats', type: 'Approved' },
];

const getStockStatus = (item: InventoryItem): { status: 'In Stock' | 'Low Stock' | 'Out of Stock', variant: 'default' | 'secondary' | 'destructive' } => {
  if (item.currentStock <= 0) return { status: 'Out of Stock', variant: 'destructive' };
  if (item.currentStock <= item.reorderLevel) return { status: 'Low Stock', variant: 'secondary' };
  return { status: 'In Stock', variant: 'default' };
};


export default function InventoryPage() {
  const [inventoryItems] = useState<InventoryItem[]>(initialInventory);
  const [aiAlert, setAiAlert] = useState<AlertUnusualPurchasesOutput | null>(null);
  const [isAlertLoading, setIsAlertLoading] = useState(false);

  const totalInventoryValue = inventoryItems.reduce((acc, item) => acc + item.currentStock * item.unitCost, 0);
  const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.reorderLevel).length;

  const handleCheckPurchase = async () => {
    setIsAlertLoading(true);
    setAiAlert(null);
    try {
        const mockPurchase: AlertUnusualPurchasesInput = {
            item: "Chicken",
            quantity: 20,
            thresholdMultiplier: 1.5,
            purchaseRate: 650, // Higher than the agreed rate
            agreedRate: 600
        };
        const result = await alertUnusualPurchases(mockPurchase);
        setAiAlert(result);
    } catch(error) {
        console.error("Failed to get AI alert:", error);
    } finally {
        setIsAlertLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Inventory Management</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {totalInventoryValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across {inventoryItems.length} items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Items Low on Stock</CardTitle>
            <Warehouse className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items at or below reorder level</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Registered Vendors</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
            <p className="text-xs text-muted-foreground">{vendors.filter(v => v.type === 'Approved').length} approved vendors</p>
          </CardContent>
        </Card>
         <Card className="bg-destructive/10 border-destructive/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Unusual purchase rate detected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Current Stock Levels</CardTitle>
                        <CardDescription>An overview of all items in your inventory.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Dialog>
                            <DialogTrigger asChild><Button variant="outline"><PlusCircle className="mr-2"/>Record Purchase</Button></DialogTrigger>
                             <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Record a Purchase Order</DialogTitle>
                                    <DialogDescription>Enter details of a new purchase to update your stock.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="item-name">Item Name</Label>
                                        <Input id="item-name" placeholder="e.g., Chicken"/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity">Quantity</Label>
                                        <Input id="quantity" type="number" placeholder="e.g., 25"/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="total-cost">Total Cost (PKR)</Label>
                                        <Input id="total-cost" type="number" placeholder="e.g., 15000"/>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="submit" onClick={async () => {
                                            const nameInput = document.getElementById('item-name') as HTMLInputElement | null
                                            const qtyInput = document.getElementById('quantity') as HTMLInputElement | null
                                            const costInput = document.getElementById('total-cost') as HTMLInputElement | null
                                            const quantity = Number(qtyInput?.value || 0)
                                            const totalCost = Number(costInput?.value || 0)
                                            await fetch('/api/inventory/purchases', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ itemName: nameInput?.value, quantity, totalCost })
                                            })
                                        }}>Save Purchase</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                         <Button><PlusCircle className="mr-2"/>Add New Item</Button>
                    </div>
                </div>
                 <div className="relative mt-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search inventory items..." className="pl-8 w-full" />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-center">Current Stock</TableHead>
                            <TableHead className="text-center">Reorder Level</TableHead>
                            <TableHead className="text-center">Min Stock</TableHead>
                            <TableHead className="text-center">Max Stock</TableHead>
                            <TableHead className="text-center">Shelf Life</TableHead>
                            <TableHead className="text-right">Unit Cost</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inventoryItems.map((item) => {
                            const { status, variant } = getStockStatus(item);
                            const statusClassName = 
                                status === 'Low Stock' ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 dark:border-yellow-500/50 dark:bg-yellow-500/10" :
                                status === 'Out of Stock' ? "bg-red-500/20 text-red-700 dark:text-red-300 dark:border-red-500/50 dark:bg-red-500/10" : "bg-green-500/20 text-green-700 dark:text-green-300 dark:border-green-500/50 dark:bg-green-500/10";
                            return (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell className="text-center">{item.currentStock} {item.unit}</TableCell>
                                    <TableCell className="text-center">{item.reorderLevel} {item.unit}</TableCell>
                                    <TableCell className="text-center">{item.minStock} {item.unit}</TableCell>
                                    <TableCell className="text-center">{item.maxStock} {item.unit}</TableCell>
                                    <TableCell className="text-center">{item.shelfLife}</TableCell>
                                    <TableCell className="text-right">PKR {item.unitCost.toFixed(2)}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={variant} className={statusClassName}>{status}</Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/>AI Purchase Analysis</CardTitle>
                    <CardDescription>The AI monitors purchase activity for anomalies like over-billing or unusual consumption spikes.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isAlertLoading && <Skeleton className="h-24 w-full" />}
                    {aiAlert && (
                         <div className={`p-4 rounded-lg space-y-2 ${aiAlert.isUnusual ? 'bg-destructive/10 border-destructive/30 border' : 'bg-secondary'}`}>
                             <h4 className={`font-semibold flex items-center gap-2 ${aiAlert.isUnusual ? 'text-destructive' : ''}`}>
                                <AlertTriangle className="w-5 h-5"/>
                                {aiAlert.isUnusual ? "Unusual Activity Detected" : "Activity Normal"}
                             </h4>
                            <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Reason:</span> {aiAlert.reason}</p>
                            <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Recommendation:</span> {aiAlert.recommendation}</p>
                        </div>
                    )}
                    {!isAlertLoading && !aiAlert && (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                            <p>Click below to simulate and check a recent purchase for issues.</p>
                        </div>
                    )}
                </CardContent>
                 <CardFooter>
                    <Button onClick={handleCheckPurchase} disabled={isAlertLoading} className="w-full">
                        {isAlertLoading ? "Analyzing..." : "Check Last Purchase"}
                    </Button>
                </CardFooter>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Vendors</CardTitle>
                    <CardDescription>List of approved and open-market vendors.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vendors.map(vendor => (
                                <TableRow key={vendor.id}>
                                    <TableCell className="font-medium">{vendor.name}</TableCell>
                                    <TableCell><Badge variant={vendor.type === 'Approved' ? 'default' : 'secondary'}>{vendor.type}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
