
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


const salesData = [
  { id: "TRX001", customer: "John Doe", item: "Chicken Biryani", amount: 15.00, status: "Completed", date: "2024-07-28" },
  { id: "TRX002", customer: "Jane Smith", item: "Mutton Karahi", amount: 25.50, status: "Completed", date: "2024-07-28" },
  { id: "TRX003", customer: "Sam Wilson", item: "BBQ Platter", amount: 45.00, status: "Pending", date: "2024-07-27" },
  { id: "TRX004", customer: "Alice Brown", item: "Seekh Kebab", amount: 12.75, status: "Completed", date: "2024-07-27" },
  { id: "TRX005", customer: "Bob Johnson", item: "Nihari", amount: 18.00, status: "Cancelled", date: "2024-07-26" },
  { id: "TRX006", customer: "Charlie Davis", item: "Haleem", amount: 16.50, status: "Completed", date: "2024-07-26" },
];

const menuItems = [
  "Chicken Biryani",
  "Mutton Karahi",
  "BBQ Platter",
  "Seekh Kebab",
  "Nihari",
  "Haleem",
  "Paya",
  "Naan",
  "Roti",
  "Soft Drink",
];

export default function SalesPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Sales</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Sale</DialogTitle>
              <DialogDescription>
                Enter the details of the new sale. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customer-name" className="text-right">
                  Customer
                </Label>
                <Input id="customer-name" defaultValue="Walk-in Customer" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="menu-item" className="text-right">
                  Item
                </Label>
                <Select>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent>
                        {menuItems.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <Input id="quantity" type="number" defaultValue="1" className="col-span-3" />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input id="amount" type="number" placeholder="15.00" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => setOpen(false)}>Save Sale</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>A list of recent sales transactions.</CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search transactions..." className="pl-8 w-full" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>{sale.item}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>
                    <Badge variant={
                        sale.status === "Completed" ? "default" : sale.status === "Pending" ? "secondary" : "destructive"
                    } className={
                        sale.status === "Completed" ? "bg-green-500/20 text-green-700 border-green-500/30" :
                        sale.status === "Pending" ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" : "bg-red-500/20 text-red-700 border-red-500/30"
                    }>{sale.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">${sale.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
