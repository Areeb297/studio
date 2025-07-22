
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip, Line, LineChart, PieChart, Pie, Cell } from "recharts";
import { DollarSign, Percent, Users, Utensils, TrendingUp, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

// Mock Data
const kpiData = {
  avgCustomerSpend: { value: 2550, change: 5.2 },
  profitMargin: { value: 22.5, change: -1.8 },
  foodCostPercentage: { value: 31.2, change: 1.5 },
  laborCostPercentage: { value: 25.8, change: -2.1 },
};

const salesTrendData = Array.from({ length: 14 }, (_, i) => ({
  date: `Day ${i + 1}`,
  revenue: Math.floor(Math.random() * (250000 - 150000 + 1)) + 150000,
}));

const categoryProfitabilityData = [
  { category: "Main Course", profit: 450000 },
  { category: "BBQ", profit: 320000 },
  { category: "Beverages", profit: 180000 },
  { category: "Appetizers", profit: 150000 },
  { category: "Desserts", profit: 95000 },
];

const topSellingItems = [
  { name: "Chicken Biryani", unitsSold: 450, revenue: 382500 },
  { name: "Mutton Karahi", unitsSold: 210, revenue: 378000 },
  { name: "BBQ Platter", unitsSold: 150, revenue: 375000 },
  { name: "Mint Margarita", unitsSold: 600, revenue: 210000 },
  { name: "Seekh Kebab", unitsSold: 300, revenue: 195000 },
];

const costBreakdownData = [
  { name: 'Kitchen', value: 65 },
  { name: 'Service Staff', value: 25 },
  { name: 'Admin & Marketing', value: 10 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];


export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Reports & Analytics</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Avg. Customer Spend</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {kpiData.avgCustomerSpend.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-600">
              <ArrowUpCircle className="w-3 h-3 mr-1"/> +{kpiData.avgCustomerSpend.change}% this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.profitMargin.value}%</div>
            <p className="text-xs text-muted-foreground flex items-center text-red-600">
              <ArrowDownCircle className="w-3 h-3 mr-1"/> {kpiData.profitMargin.change}% this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Food Cost %</CardTitle>
            <Utensils className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.foodCostPercentage.value}%</div>
            <p className="text-xs text-muted-foreground flex items-center text-red-600">
               <ArrowUpCircle className="w-3 h-3 mr-1"/> +{kpiData.foodCostPercentage.change}% this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Labor Cost %</CardTitle>
            <Percent className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.laborCostPercentage.value}%</div>
             <p className="text-xs text-muted-foreground flex items-center text-green-600">
               <ArrowDownCircle className="w-3 h-3 mr-1"/> {kpiData.laborCostPercentage.change}% this month
            </p>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp /> Daily Sales Performance (Last 14 Days)</CardTitle>
          <CardDescription>Track daily revenue to understand sales trends and peak periods.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `PKR ${value/1000}k`} />
              <Tooltip formatter={(value: number) => `PKR ${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} name="Daily Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

       <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Profitability by Category</CardTitle>
                <CardDescription>Analyze which menu categories are driving the most profit.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryProfitabilityData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value) => `PKR ${value/1000}k`} />
                        <YAxis type="category" dataKey="category" width={100} />
                        <Tooltip formatter={(value: number) => `PKR ${value.toLocaleString()}`} />
                        <Legend />
                        <Bar dataKey="profit" fill="hsl(var(--primary))" name="Gross Profit" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Department Cost Breakdown</CardTitle>
                <CardDescription>A relative overview of major cost centers.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={costBreakdownData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {costBreakdownData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value}%`, name]}/>
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Top Selling Items</CardTitle>
          <CardDescription>
            A list of the most popular items by units sold and revenue generated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-center">Units Sold</TableHead>
                <TableHead className="text-right">Total Revenue (PKR)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topSellingItems.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-center">{item.unitsSold}</TableCell>
                  <TableCell className="text-right">{item.revenue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
