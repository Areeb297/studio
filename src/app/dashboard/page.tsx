'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ArrowUpRight, DollarSign, Users, ShoppingCart, BrainCircuit } from "lucide-react";
import Link from "next/link";

const chartData = [
  { month: "January", sales: 18623 },
  { month: "February", sales: 20543 },
  { month: "March", sales: 22345 },
  { month: "April", sales: 27890 },
  { month: "May", sales: 25432 },
  { month: "June", sales: 30123 },
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const transactions = [
    { id: "TRX001", customer: "John Doe", item: "Chicken Biryani", amount: 4500.00, status: "Completed" },
    { id: "TRX002", customer: "Jane Smith", item: "Mutton Karahi", amount: 7550.50, status: "Completed" },
    { id: "TRX003", customer: "Sam Wilson", item: "BBQ Platter", amount: 12500.00, status: "Pending" },
    { id: "TRX004", customer: "Alice Brown", item: "Seekh Kebab", amount: 3275.00, status: "Completed" },
    { id: "TRX005", customer: "Bob Johnson", item: "Nihari", amount: 5000.00, status: "Cancelled" },
]

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="text-muted-foreground font-bold">PKR</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,523,189</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+235</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Food Cost %</CardTitle>
            <div className="w-4 h-4 text-muted-foreground font-bold">%</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.5%</div>
            <p className="text-xs text-muted-foreground">-2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="w-full h-[300px]">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
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
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
                <CardTitle className="flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-primary" /> AI-Powered Insights</CardTitle>
                <CardDescription>
                Suggestions, analysis and recommendations from Rahah24 AI.
                </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/dashboard/forecasting">
                View All
                <ArrowUpRight className="w-4 h-4" />
                </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
             <div className="font-semibold">Demand Forecast</div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Chicken Biryani</span> sales are projected to increase by 15% this weekend. Recommend increasing stock of chicken and rice by 20%.
              </p>
              <div className="font-semibold">Pricing Suggestion</div>
              <p className="text-muted-foreground">
                The cost of mutton has increased. Consider increasing the price of <span className="font-medium text-foreground">Mutton Karahi</span> from PKR 7550.50 to PKR 7799.00 to maintain a 2.5x gross profit multiplier.
              </p>
              <div className="font-semibold">Staffing Alert</div>
              <p className="text-muted-foreground">
                High sales volume expected on Saturday. Suggest adding one extra staff member for the evening shift to maintain service quality.
              </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            A list of the most recent sales transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.customer}</TableCell>
                  <TableCell>{transaction.item}</TableCell>
                  <TableCell>
                    <Badge variant={
                        transaction.status === "Completed" ? "default" : transaction.status === "Pending" ? "secondary" : "destructive"
                    } className={
                        transaction.status === "Completed" ? "bg-green-500/20 text-green-700 dark:text-green-300 dark:border-green-500/50 dark:bg-green-500/10" :
                        transaction.status === "Pending" ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 dark:border-yellow-500/50 dark:bg-yellow-500/10" : "bg-red-500/20 text-red-700 dark:text-red-300 dark:border-red-500/50 dark:bg-red-500/10"
                    }>{transaction.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">PKR {transaction.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
