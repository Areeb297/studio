
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Area, AreaChart } from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Sales analytics data
const salesAnalytics = {
  totalRevenue: 82750.50,
  totalOrders: 156,
  avgOrderValue: 530.45,
  topSellingItem: "Chicken Biryani"
};

const dailySalesData = [
  { day: "Mon", sales: 12500, orders: 25 },
  { day: "Tue", sales: 15200, orders: 32 },
  { day: "Wed", sales: 11800, orders: 22 },
  { day: "Thu", sales: 18900, orders: 38 },
  { day: "Fri", sales: 22300, orders: 45 },
  { day: "Sat", sales: 19200, orders: 41 },
  { day: "Sun", sales: 16800, orders: 35 },
];

const topItemsData = [
  { item: "Chicken Biryani", sales: 45, revenue: 38250 },
  { item: "Mutton Karahi", sales: 28, revenue: 50400 },
  { item: "BBQ Platter", sales: 18, revenue: 45000 },
  { item: "Seekh Kebab", sales: 35, revenue: 11462.5 },
  { item: "Haleem", sales: 22, revenue: 10230 },
];

const chartConfig = {
  sales: {
    label: "Sales (PKR)",
    color: "hsl(var(--primary))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--secondary))",
  },
} satisfies ChartConfig;

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
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [salesData, setSalesData] = useState([
    { id: "TRX001", customer: "John Doe", item: "Chicken Biryani", amount: 4500.00, status: "Completed", date: "2024-07-28" },
    { id: "TRX002", customer: "Jane Smith", item: "Mutton Karahi", amount: 7550.50, status: "Completed", date: "2024-07-28" },
    { id: "TRX003", customer: "Sam Wilson", item: "BBQ Platter", amount: 12500.00, status: "Pending", date: "2024-07-27" },
    { id: "TRX004", customer: "Alice Brown", item: "Seekh Kebab", amount: 3275.00, status: "Completed", date: "2024-07-27" },
    { id: "TRX005", customer: "Bob Johnson", item: "Nihari", amount: 5000.00, status: "Cancelled", date: "2024-07-26" },
    { id: "TRX006", customer: "Charlie Davis", item: "Haleem", amount: 4650.00, status: "Completed", date: "2024-07-26" },
  ]);

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
                <Select value={selectedItem} onValueChange={setSelectedItem}>
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
                  Amount (PKR)
                </Label>
                <Input id="amount" type="number" placeholder="4500.00" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={async () => {
                const customerInput = (document.getElementById('customer-name') as HTMLInputElement | null)
                const quantityInput = (document.getElementById('quantity') as HTMLInputElement | null)
                const amountInput = (document.getElementById('amount') as HTMLInputElement | null)
                const quantity = Number(quantityInput?.value || 1)
                const unitPrice = Number(amountInput?.value || 0)
                const customerName = customerInput?.value || 'Walk-in Customer'
                
                if (!selectedItem || unitPrice <= 0) {
                  alert('Please select an item and enter a valid amount')
                  return
                }
                
                try {
                  const res = await fetch('/api/sales', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      customerId: null,
                      items: [{ menuItemId: null, quantity, unitPrice }],
                      notes: customerName,
                      paymentStatus: 'paid',
                    })
                  })
                  
                  if (res.ok) {
                    const result = await res.json()
                    // Add the new sale to the local state to show it immediately
                    const newSale = {
                      id: result.orderNumber,
                      customer: customerName,
                      item: selectedItem,
                      amount: unitPrice * quantity,
                      status: "Completed",
                      date: new Date().toISOString().split('T')[0]
                    }
                    setSalesData(prev => [newSale, ...prev])
                    
                    // Reset form
                    setSelectedItem('')
                    if (customerInput) customerInput.value = 'Walk-in Customer'
                    if (quantityInput) quantityInput.value = '1'
                    if (amountInput) amountInput.value = ''
                  } else {
                    const e = await res.json()
                    console.error('Failed to save sale', e)
                    alert('Failed to save sale: ' + (e.error || 'Unknown error'))
                  }
                } catch (error) {
                  console.error('Error saving sale:', error)
                  alert('Error saving sale')
                } finally {
                  setOpen(false)
                }
              }}>Save Sale</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {salesAnalytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesAnalytics.totalOrders}</div>
            <p className="text-xs text-muted-foreground">+8.2% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {salesAnalytics.avgOrderValue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">+3.8% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Top Selling Item</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesAnalytics.topSellingItem}</div>
            <p className="text-xs text-muted-foreground">45 orders this week</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Daily Sales Performance</CardTitle>
            <CardDescription>Sales revenue and order count for the past week</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="w-full h-[300px]">
              <BarChart accessibilityLayer data={dailySalesData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => `PKR ${value/1000}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
            <CardDescription>Best performing menu items this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topItemsData.map((item, index) => (
                <div key={item.item} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-medium">{item.item}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">PKR {item.revenue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{item.sales} orders</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>A list of recent sales transactions.</CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search transactions..." className="pl-8 w-full" />
          </div>
        </CardHeader>
        <CardContent className="w-full overflow-x-auto">
          <Table className="w-full">
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
                        sale.status === "Completed" ? "bg-green-500/20 text-green-700 dark:text-green-300 dark:border-green-500/50 dark:bg-green-500/10" :
                        sale.status === "Pending" ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 dark:border-yellow-500/50 dark:bg-yellow-500/10" : "bg-red-500/20 text-red-700 dark:text-red-300 dark:border-red-500/50 dark:bg-red-500/10"
                    }>{sale.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">PKR {sale.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
