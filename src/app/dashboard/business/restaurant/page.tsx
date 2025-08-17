'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  ChefHat,
  Star,
  Clock,
  Target,
  Percent,
  AlertTriangle,
  Calendar,
  Utensils,
  Timer,
  Package,
  UserCheck,
  TrendingDown,
  Activity
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Area, AreaChart, Pie, PieChart, Cell } from "recharts";

// Comprehensive Restaurant Analytics Data
const restaurantMetrics = {
  dailyRevenue: 187500,
  totalOrders: 342,
  averageOrderValue: 548,
  foodCostPercentage: 31.2,
  profitMargin: 22.8,
  customerSatisfaction: 4.7,
  tableOccupancy: 78.5,
  staffEfficiency: 92.3,
  orderFulfillmentTime: 18.5,
  inventoryTurnover: 12.4,
  repeatCustomers: 67,
  onlineOrders: 156
};

const hourlyOrdersData = [
  { hour: "9AM", orders: 12, revenue: 6500 },
  { hour: "10AM", orders: 18, revenue: 9800 },
  { hour: "11AM", orders: 25, revenue: 13600 },
  { hour: "12PM", orders: 45, revenue: 24700 },
  { hour: "1PM", orders: 52, revenue: 28400 },
  { hour: "2PM", orders: 38, revenue: 20800 },
  { hour: "3PM", orders: 22, revenue: 12100 },
  { hour: "4PM", orders: 28, revenue: 15300 },
  { hour: "5PM", orders: 41, revenue: 22400 },
  { hour: "6PM", orders: 48, revenue: 26200 },
  { hour: "7PM", orders: 55, revenue: 30100 },
  { hour: "8PM", orders: 42, revenue: 23000 },
];

const weeklyRevenueData = [
  { day: "Mon", revenue: 165000, orders: 298, foodCost: 51450 },
  { day: "Tue", revenue: 172000, orders: 314, foodCost: 53680 },
  { day: "Wed", revenue: 158000, orders: 287, foodCost: 49280 },
  { day: "Thu", revenue: 189000, orders: 345, foodCost: 58980 },
  { day: "Fri", revenue: 245000, orders: 447, foodCost: 76440 },
  { day: "Sat", revenue: 298000, orders: 543, foodCost: 92960 },
  { day: "Sun", revenue: 267000, orders: 487, foodCost: 83310 },
];

const menuCategoryData = [
  { category: "Main Course", orders: 156, revenue: 85800, color: "hsl(var(--primary))" },
  { category: "Appetizers", orders: 89, revenue: 31150, color: "hsl(var(--chart-2))" },
  { category: "Beverages", orders: 134, revenue: 18760, color: "hsl(var(--chart-3))" },
  { category: "Desserts", orders: 67, revenue: 23450, color: "hsl(var(--chart-4))" },
  { category: "Specials", orders: 45, revenue: 27900, color: "hsl(var(--chart-5))" },
];

const topSellingItems = [
  { item: "Chicken Biryani", orders: 89, revenue: 75650, profit: 68.2, trend: "up" },
  { item: "Mutton Karahi", orders: 67, revenue: 120600, profit: 71.5, trend: "up" },
  { item: "BBQ Platter", orders: 45, revenue: 112500, profit: 65.8, trend: "stable" },
  { item: "Seekh Kebab", orders: 78, revenue: 35100, profit: 72.1, trend: "up" },
  { item: "Haleem", orders: 56, revenue: 25200, profit: 69.4, trend: "down" },
  { item: "Fish Karahi", orders: 34, revenue: 30600, profit: 66.7, trend: "up" },
];

const recentOrders = [
  { id: "ORD342", table: "Table 12", items: "Chicken Biryani, Lassi", amount: 950, status: "Served", time: "2 min ago" },
  { id: "ORD343", table: "Takeaway", items: "BBQ Platter, Naan x2", amount: 2500, status: "Ready", time: "5 min ago" },
  { id: "ORD344", table: "Table 08", items: "Mutton Karahi, Roti x4", amount: 1800, status: "Preparing", time: "8 min ago" },
  { id: "ORD345", table: "Online", items: "Seekh Kebab, Soft Drink", amount: 650, status: "Preparing", time: "12 min ago" },
  { id: "ORD346", table: "Table 15", items: "Haleem, Naan", amount: 480, status: "Served", time: "15 min ago" },
];

const staffPerformance = [
  { name: "Chef Ahmed", role: "Head Chef", orders: 89, rating: 4.9, efficiency: 96 },
  { name: "Waiter Ali", role: "Server", tables: 12, rating: 4.7, efficiency: 91 },
  { name: "Cook Hassan", role: "Line Cook", orders: 67, rating: 4.6, efficiency: 88 },
  { name: "Server Fatima", role: "Server", tables: 15, rating: 4.8, efficiency: 94 },
];

const chartConfig = {
  revenue: {
    label: "Revenue (PKR)",
    color: "hsl(var(--primary))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-2))",
  },
  foodCost: {
    label: "Food Cost (PKR)",
    color: "hsl(var(--chart-3))",
  }
} satisfies ChartConfig;

export default function RestaurantDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Binoria Restaurant</h1>
          <p className="text-muted-foreground">Comprehensive restaurant operations dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary text-primary">
            Live Dashboard
          </Badge>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">PKR {restaurantMetrics.dailyRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600">+15.2% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restaurantMetrics.totalOrders}</div>
            <p className="text-xs text-green-600">+8.5% today</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="w-4 h-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {restaurantMetrics.averageOrderValue}</div>
            <p className="text-xs text-green-600">+12.1% vs last week</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Food Cost %</CardTitle>
            <Percent className="w-4 h-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restaurantMetrics.foodCostPercentage}%</div>
            <p className="text-xs text-red-600">+1.2% (needs attention)</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Target className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{restaurantMetrics.profitMargin}%</div>
            <p className="text-xs text-muted-foreground">Healthy margin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Table Occupancy</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restaurantMetrics.tableOccupancy}%</div>
            <p className="text-xs text-green-600">Peak dinner time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Avg Fulfillment Time</CardTitle>
            <Timer className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restaurantMetrics.orderFulfillmentTime} min</div>
            <p className="text-xs text-green-600">Within target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
            <Star className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restaurantMetrics.customerSatisfaction}/5.0</div>
            <p className="text-xs text-green-600">Excellent rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Hourly Orders Line Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Hourly Order Trends
            </CardTitle>
            <CardDescription>Today's order volume and revenue by hour</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[300px]">
              <LineChart data={hourlyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line yAxisId="left" type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={3} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Menu Category Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-primary" />
              Category Distribution
            </CardTitle>
            <CardDescription>Orders by menu category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[300px]">
              <PieChart>
                <Pie
                  data={menuCategoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="orders"
                  label={({ category, orders }) => `${category}: ${orders}`}
                >
                  {menuCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Weekly Revenue & Cost Analysis
          </CardTitle>
          <CardDescription>7-day revenue, orders, and food cost trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="w-full h-[350px]">
            <BarChart data={weeklyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(value) => `${value/1000}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={4} />
              <Bar dataKey="foodCost" fill="hsl(var(--chart-3))" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Selling Items & Recent Orders */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Top Selling Items
            </CardTitle>
            <CardDescription>Best performing menu items today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellingItems.map((item, index) => (
                <div key={item.item} className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-primary">#{index + 1}</div>
                    <div>
                      <div className="font-medium">{item.item}</div>
                      <div className="text-xs text-muted-foreground">{item.orders} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">PKR {item.revenue.toLocaleString()}</div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-primary">{item.profit}% profit</span>
                      {item.trend === 'up' ? <TrendingUp className="h-3 w-3 text-green-500" /> : 
                       item.trend === 'down' ? <TrendingDown className="h-3 w-3 text-red-500" /> : 
                       <div className="h-3 w-3 rounded-full bg-yellow-500"></div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Orders
            </CardTitle>
            <CardDescription>Live order tracking and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium">{order.id}</div>
                    <div className="text-sm text-muted-foreground">{order.table}</div>
                    <div className="text-xs text-muted-foreground">{order.items}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">PKR {order.amount}</div>
                    <Badge 
                      variant={order.status === 'Served' ? 'default' : order.status === 'Ready' ? 'secondary' : 'outline'}
                      className={
                        order.status === 'Served' ? 'bg-green-500/20 text-green-700' :
                        order.status === 'Ready' ? 'bg-blue-500/20 text-blue-700' :
                        'bg-yellow-500/20 text-yellow-700'
                      }
                    >
                      {order.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground">{order.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Staff Performance Today
          </CardTitle>
          <CardDescription>Team productivity and customer service ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {staffPerformance.map((staff) => (
              <div key={staff.name} className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="text-center">
                  <div className="font-semibold">{staff.name}</div>
                  <div className="text-sm text-muted-foreground">{staff.role}</div>
                  <div className="mt-2">
                    <div className="text-lg font-bold text-primary">{staff.efficiency}%</div>
                    <div className="text-xs text-muted-foreground">Efficiency</div>
                  </div>
                  <div className="flex justify-center items-center gap-1 mt-2">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{staff.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-primary/10 to-chart-2/10 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <AlertTriangle className="h-5 w-5" />
            AI-Powered Restaurant Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-semibold text-primary mb-2">Peak Time Alert</h4>
              <p className="text-sm text-muted-foreground">
                7-8 PM shows highest order volume. Consider adding <span className="font-medium text-primary">2 extra staff</span> during this period.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-semibold text-primary mb-2">Inventory Optimization</h4>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">Chicken Biryani</span> demand increasing. Order 25% more rice and chicken for tomorrow.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-semibold text-primary mb-2">Cost Control</h4>
              <p className="text-sm text-muted-foreground">
                Food cost slightly high at 31.2%. Review portion sizes for <span className="font-medium text-primary">BBQ Platter</span>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}