'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  Package,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Download
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

interface AnalyticsMetric {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

interface ChartData {
  month: string;
  spending: number;
  orders: number;
  savings: number;
}

const mockMetrics: AnalyticsMetric[] = [
  {
    label: 'Total Procurement Spend',
    value: 'PKR 2.4M',
    change: 8.2,
    icon: <DollarSign className="h-4 w-4" />,
    trend: 'up'
  },
  {
    label: 'Cost Savings',
    value: 'PKR 145K',
    change: 15.3,
    icon: <TrendingDown className="h-4 w-4" />,
    trend: 'up'
  },
  {
    label: 'Purchase Orders',
    value: '156',
    change: -2.1,
    icon: <ShoppingCart className="h-4 w-4" />,
    trend: 'down'
  },
  {
    label: 'Active Vendors',
    value: '42',
    change: 12.5,
    icon: <Users className="h-4 w-4" />,
    trend: 'up'
  },
  {
    label: 'Avg Processing Time',
    value: '3.2 days',
    change: -18.7,
    icon: <Clock className="h-4 w-4" />,
    trend: 'up'
  },
  {
    label: 'On-Time Delivery',
    value: '94.2%',
    change: 3.8,
    icon: <Package className="h-4 w-4" />,
    trend: 'up'
  }
];

const mockChartData: ChartData[] = [
  { month: 'Jan', spending: 420000, orders: 28, savings: 18000 },
  { month: 'Feb', spending: 385000, orders: 32, savings: 22000 },
  { month: 'Mar', spending: 510000, orders: 25, savings: 15000 },
  { month: 'Apr', spending: 465000, orders: 35, savings: 28000 },
  { month: 'May', spending: 520000, orders: 29, savings: 19000 },
  { month: 'Jun', spending: 480000, orders: 38, savings: 32000 }
];

interface CategorySpend {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

const mockCategorySpend: CategorySpend[] = [
  { category: 'Kitchen Equipment', amount: 850000, percentage: 35.4, color: 'bg-blue-500' },
  { category: 'Office Supplies', amount: 480000, percentage: 20.0, color: 'bg-green-500' },
  { category: 'IT Equipment', amount: 650000, percentage: 27.1, color: 'bg-purple-500' },
  { category: 'Maintenance', amount: 285000, percentage: 11.9, color: 'bg-orange-500' },
  { category: 'Others', amount: 135000, percentage: 5.6, color: 'bg-gray-500' }
];

export default function ProcurementAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('spending');

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-red-600" />;
    return <div className="h-3 w-3" />;
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral', change: number) => {
    if (trend === 'up' && change > 0) return 'text-green-600';
    if (trend === 'down' || change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Procurement Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights and reporting for procurement operations</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                {getTrendIcon(metric.trend)}
                <span className={getTrendColor(metric.trend, metric.change)}>
                  {Math.abs(metric.change)}% {metric.change > 0 ? 'increase' : 'decrease'}
                </span>
                <span className="text-muted-foreground">from last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Spending Trend Chart */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Procurement Spending Trend</CardTitle>
                <CardDescription>Monthly spending analysis over time</CardDescription>
              </div>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spending">Spending</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={mockChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name) => {
                      if (name === 'spending') return [`PKR ${(value as number / 1000).toFixed(0)}K`, 'Spending'];
                      if (name === 'savings') return [`PKR ${(value as number / 1000).toFixed(0)}K`, 'Savings'];
                      if (name === 'orders') return [value, 'Orders'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left" 
                    dataKey="spending" 
                    fill="url(#spendingGradient)"
                    name="Spending"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    yAxisId="left" 
                    dataKey="savings" 
                    fill="url(#savingsGradient)"
                    name="Savings"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#F59E0B" 
                    strokeWidth={3}
                    name="Orders"
                    dot={{ r: 6, fill: '#F59E0B' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Breakdown of procurement spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Recharts Donut Chart */}
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={mockCategorySpend}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="amount"
                      startAngle={90}
                      endAngle={450}
                    >
                      {mockCategorySpend.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={
                          entry.category === 'Kitchen Equipment' ? '#3B82F6' :
                          entry.category === 'Office Supplies' ? '#10B981' :
                          entry.category === 'IT Equipment' ? '#8B5CF6' :
                          entry.category === 'Maintenance' ? '#F59E0B' :
                          '#6B7280'
                        } />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`PKR ${((value as number) / 1000).toFixed(0)}K`, 'Amount']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Legend */}
              <div className="space-y-3">
                {mockCategorySpend.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ 
                          backgroundColor: category.category === 'Kitchen Equipment' ? '#3B82F6' :
                          category.category === 'Office Supplies' ? '#10B981' :
                          category.category === 'IT Equipment' ? '#8B5CF6' :
                          category.category === 'Maintenance' ? '#F59E0B' :
                          '#6B7280'
                        }}
                      ></div>
                      <span className="text-sm font-medium">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">PKR {(category.amount / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-muted-foreground">{category.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Vendor Performance</CardTitle>
            <CardDescription>Top performing vendors this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'ABC Kitchen Supplies', score: 94, orders: 15 },
                { name: 'XYZ Office Solutions', score: 92, orders: 23 },
                { name: 'TechCorp Solutions', score: 89, orders: 8 }
              ].map((vendor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{vendor.name}</div>
                    <div className="text-xs text-muted-foreground">{vendor.orders} orders</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">{vendor.score}%</div>
                    <div className="text-xs text-muted-foreground">Performance</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Optimization</CardTitle>
            <CardDescription>Savings and efficiency metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">PKR 145K</div>
                <div className="text-sm text-muted-foreground">Total Savings</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Negotiation Savings</span>
                  <span className="font-medium">PKR 85K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Bulk Discounts</span>
                  <span className="font-medium">PKR 35K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Process Efficiency</span>
                  <span className="font-medium">PKR 25K</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance & Risk</CardTitle>
            <CardDescription>Risk assessment and compliance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Approval Compliance</span>
                <Badge className="bg-green-500/20 text-green-700">98%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Vendor Compliance</span>
                <Badge className="bg-green-500/20 text-green-700">96%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Budget Adherence</span>
                <Badge className="bg-yellow-500/20 text-yellow-700">92%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Risk Score</span>
                <Badge className="bg-green-500/20 text-green-700">Low</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Procurement Pipeline</CardTitle>
          <CardDescription>Current status of procurement activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { stage: 'Requisitions', count: 8, amount: 125000, color: 'bg-blue-500' },
              { stage: 'Pending Approval', count: 3, amount: 45000, color: 'bg-yellow-500' },
              { stage: 'Purchase Orders', count: 12, amount: 285000, color: 'bg-purple-500' },
              { stage: 'Delivered', count: 25, amount: 650000, color: 'bg-green-500' }
            ].map((stage, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <div className={`w-12 h-12 rounded-full ${stage.color} mx-auto mb-2 flex items-center justify-center`}>
                  <span className="text-white font-bold">{stage.count}</span>
                </div>
                <h3 className="font-medium">{stage.stage}</h3>
                <p className="text-sm text-muted-foreground">
                  PKR {(stage.amount / 1000).toFixed(0)}K
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Activities */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Important procurement deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { task: 'Q1 Budget Review', date: '2024-01-30', priority: 'high' },
                { task: 'Vendor Contract Renewals', date: '2024-02-15', priority: 'medium' },
                { task: 'Annual Supplier Audit', date: '2024-03-01', priority: 'high' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{item.task}</div>
                    <div className="text-sm text-muted-foreground">{item.date}</div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={item.priority === 'high' ? 'border-red-500 text-red-700' : 'border-yellow-500 text-yellow-700'}
                  >
                    {item.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>Key accomplishments this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { achievement: 'Reduced processing time by 18%', impact: 'Efficiency' },
                { achievement: 'Negotiated 12% discount with top vendor', impact: 'Cost Savings' },
                { achievement: 'Achieved 94% on-time delivery rate', impact: 'Performance' }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <Target className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">{item.achievement}</div>
                    <div className="text-sm text-muted-foreground">{item.impact}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}