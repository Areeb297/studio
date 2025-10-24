'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Building, 
  ChefHat,
  GraduationCap,
  CalendarDays,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  BarChart3,
  Activity,
  Zap,
  UserCheck,
  Home,
  Percent,
  Globe,
  Workflow
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ComposedChart,
  ReferenceLine
} from 'recharts';

export default function ExecutiveDashboard() {
  // Enhanced chart data for executive dashboard
  const monthlyRevenueData = [
    { month: 'Jan', restaurant: 9.5, academic: 6.2, events: 2.8, fitness: 1.8, total: 20.3, target: 22.0 },
    { month: 'Feb', restaurant: 10.2, academic: 7.1, events: 3.2, fitness: 2.1, total: 22.6, target: 22.5 },
    { month: 'Mar', restaurant: 11.8, academic: 7.8, events: 3.9, fitness: 2.3, total: 25.8, target: 23.0 },
    { month: 'Apr', restaurant: 12.1, academic: 8.2, events: 4.1, fitness: 2.4, total: 26.8, target: 23.5 },
    { month: 'May', restaurant: 13.2, academic: 8.9, events: 4.8, fitness: 2.6, total: 29.5, target: 24.0 },
    { month: 'Jun', restaurant: 12.6, academic: 9.0, events: 4.5, fitness: 2.4, total: 28.5, target: 24.5 }
  ];

  const businessLineDistribution = [
    { name: 'Restaurant & Catering', value: 44.2, revenue: 12.6, color: '#14B8A6' },
    { name: 'Academic Operations', value: 31.6, revenue: 9.0, color: '#3B82F6' },
    { name: 'Events & Ceremonies', value: 15.8, revenue: 4.5, color: '#8B5CF6' },
    { name: 'Fitness & Wellness', value: 8.4, revenue: 2.4, color: '#F59E0B' }
  ];

  const operationalMetrics = [
    { metric: 'Student Enrollment', current: 2847, target: 3000, percentage: 95, growth: 12.3 },
    { metric: 'Property Occupancy', current: 89.4, target: 95, percentage: 94, growth: 4.2 },
    { metric: 'Staff Efficiency', current: 94.8, target: 96, percentage: 99, growth: 2.1 },
    { metric: 'Customer Satisfaction', current: 4.7, target: 4.8, percentage: 98, growth: 8.5 },
    { metric: 'Revenue Target', current: 28.5, target: 30.0, percentage: 95, growth: 15.2 }
  ];

  const weeklyTrends = [
    { week: 'Week 1', revenue: 6.8, expenses: 4.2, profit: 2.6, efficiency: 89 },
    { week: 'Week 2', revenue: 7.2, expenses: 4.1, profit: 3.1, efficiency: 92 },
    { week: 'Week 3', revenue: 7.8, expenses: 4.5, profit: 3.3, efficiency: 94 },
    { week: 'Week 4', revenue: 6.9, expenses: 4.0, profit: 2.9, efficiency: 91 }
  ];

  // Enhanced KPI Cards with mini charts
  const executiveKPIs = [
    {
      title: "Total Revenue",
      value: "₨ 28.5M",
      change: "+15.2%",
      period: "vs last month",
      icon: DollarSign,
      trend: "up",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      chartData: monthlyRevenueData.slice(-4).map(d => ({ value: d.total }))
    },
    {
      title: "Active Students",
      value: "2,847",
      change: "+127",
      period: "new enrollments",
      icon: GraduationCap,
      trend: "up",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      chartData: [{ value: 2720 }, { value: 2765 }, { value: 2810 }, { value: 2847 }]
    },
    {
      title: "Property Occupancy",
      value: "89.4%",
      change: "+4.2%",
      period: "vs last quarter",
      icon: Home,
      trend: "up",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      chartData: [{ value: 85.2 }, { value: 87.1 }, { value: 88.7 }, { value: 89.4 }]
    },
    {
      title: "Overall Efficiency",
      value: "94.8%",
      change: "+2.1%",
      period: "operational score",
      icon: Target,
      trend: "up",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      chartData: [{ value: 92.7 }, { value: 93.2 }, { value: 93.8 }, { value: 94.8 }]
    }
  ];

  // Business line performance summary
  const businessLines = [
    {
      name: "Restaurant & Catering",
      revenue: 12567890,
      growth: 18.5,
      status: "excellent",
      icon: ChefHat,
      metrics: { orders: 1247, satisfaction: "4.7/5", efficiency: "92%" }
    },
    {
      name: "Academic Operations",
      revenue: 8976543,
      growth: 12.3,
      status: "good",
      icon: GraduationCap,
      metrics: { students: 2847, attendance: "94.2%", collection: "91%" }
    },
    {
      name: "Events & Ceremonies",
      revenue: 4534567,
      growth: 25.7,
      status: "excellent",
      icon: CalendarDays,
      metrics: { events: 89, bookings: "78%", revenue: "₨4.5M" }
    },
    {
      name: "Fitness & Wellness",
      revenue: 2378123,
      growth: 8.9,
      status: "stable",
      icon: Heart,
      metrics: { members: 456, utilization: "67%", retention: "89%" }
    }
  ];

  // Recent activities across all business lines
  const recentActivities = [
    { activity: "Large donation received", amount: "₨ 250,000", source: "Zakat Fund", time: "15 mins ago", type: "finance" },
    { activity: "New student enrollment", count: "23 students", source: "Hifz Program", time: "1 hour ago", type: "academic" },
    { activity: "Event booking confirmed", event: "Wedding Reception", source: "Shadi Lawn", time: "2 hours ago", type: "events" },
    { activity: "Property lease renewed", property: "Shop #5", source: "Commercial", time: "3 hours ago", type: "property" },
    { activity: "Monthly payroll processed", amount: "₨ 1,847,500", source: "HR Department", time: "5 hours ago", type: "hr" }
  ];

  // Key alerts and notifications
  const alerts = [
    { type: "warning", message: "12 maintenance requests pending", action: "Review Now", priority: "medium" },
    { type: "success", message: "Monthly revenue target achieved", action: "View Report", priority: "low" },
    { type: "info", message: "Qurbani registration deadline approaching", action: "Monitor", priority: "medium" },
    { type: "error", message: "3 lease renewals require immediate attention", action: "Contact Tenants", priority: "high" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Executive Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive overview of all business operations with advanced analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Full Report
          </Button>
          <Button>
            <Activity className="h-4 w-4 mr-2" />
            Live Analytics
          </Button>
        </div>
      </div>

      {/* Enhanced Executive KPIs with Mini Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {executiveKPIs.map((kpi, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <div className="flex items-center mt-1">
                    {kpi.trend === 'up' ? (
                      <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">{kpi.period}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
              
              {/* Mini Chart */}
              <div className="h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={kpi.chartData}>
                    <defs>
                      <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={kpi.color.includes('green') ? '#10B981' : kpi.color.includes('blue') ? '#3B82F6' : kpi.color.includes('purple') ? '#8B5CF6' : '#F59E0B'} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={kpi.color.includes('green') ? '#10B981' : kpi.color.includes('blue') ? '#3B82F6' : kpi.color.includes('purple') ? '#8B5CF6' : '#F59E0B'} stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={kpi.color.includes('green') ? '#10B981' : kpi.color.includes('blue') ? '#3B82F6' : kpi.color.includes('purple') ? '#8B5CF6' : '#F59E0B'}
                      strokeWidth={2}
                      fill={`url(#gradient-${index})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sophisticated Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trends Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue Performance & Trends
            </CardTitle>
            <CardDescription>
              Monthly revenue with target comparison and business line breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="restaurant" stackId="a" fill="#14B8A6" name="Restaurant" />
                  <Bar dataKey="academic" stackId="a" fill="#3B82F6" name="Academic" />
                  <Bar dataKey="events" stackId="a" fill="#8B5CF6" name="Events" />
                  <Bar dataKey="fitness" stackId="a" fill="#F59E0B" name="Fitness" />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    name="Target"
                    dot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#059669" 
                    strokeWidth={3}
                    name="Total Revenue"
                    dot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Business Line Distribution Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-primary" />
              Business Line Distribution
            </CardTitle>
            <CardDescription>
              Revenue contribution by business line
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={businessLineDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
                  >
                    {businessLineDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {businessLineDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="font-semibold">₨ {item.revenue}M</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Metrics Bar+Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Operational Excellence Metrics
            </CardTitle>
            <CardDescription>
              Key performance indicators with target achievement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {operationalMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{metric.current}{metric.metric.includes('Satisfaction') ? '/5' : metric.metric.includes('%') || metric.metric.includes('Occupancy') || metric.metric.includes('Efficiency') ? '%' : metric.metric.includes('Revenue') ? 'M' : ''}</span>
                      <Badge variant={metric.percentage >= 95 ? 'default' : metric.percentage >= 90 ? 'secondary' : 'outline'}>
                        {metric.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={metric.percentage} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Target: {metric.target}{metric.metric.includes('Satisfaction') ? '/5' : metric.metric.includes('%') || metric.metric.includes('Occupancy') || metric.metric.includes('Efficiency') ? '%' : metric.metric.includes('Revenue') ? 'M' : ''}</span>
                    <span className="text-green-600">+{metric.growth}% growth</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Weekly Performance Analysis
            </CardTitle>
            <CardDescription>
              Revenue, expenses, and efficiency trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={weeklyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#14B8A6" name="Revenue (M)" />
                  <Bar yAxisId="left" dataKey="expenses" fill="#EF4444" name="Expenses (M)" />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#profitGradient)"
                    name="Profit (M)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    name="Efficiency %"
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Executive Alerts & Priority Actions
          </CardTitle>
          <CardDescription>
            Items requiring immediate executive attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'error' ? 'border-l-red-500 bg-red-50 dark:bg-red-950/20' :
                alert.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' :
                alert.type === 'success' ? 'border-l-green-500 bg-green-50 dark:bg-green-950/20' :
                'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium">{alert.message}</p>
                  <Badge variant={
                    alert.priority === 'high' ? 'destructive' :
                    alert.priority === 'medium' ? 'default' : 'secondary'
                  }>
                    {alert.priority}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-8">
                  {alert.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Activities Across All Operations
          </CardTitle>
          <CardDescription>
            Latest activities from all business lines and departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className={`p-2 rounded-full w-8 h-8 flex items-center justify-center ${
                  activity.type === 'finance' ? 'bg-green-100 dark:bg-green-950/20' :
                  activity.type === 'academic' ? 'bg-blue-100 dark:bg-blue-950/20' :
                  activity.type === 'events' ? 'bg-purple-100 dark:bg-purple-950/20' :
                  activity.type === 'property' ? 'bg-orange-100 dark:bg-orange-950/20' :
                  'bg-gray-100 dark:bg-gray-800'
                }`}>
                  {activity.type === 'finance' ? <DollarSign className="h-3 w-3 text-green-600" /> :
                   activity.type === 'academic' ? <GraduationCap className="h-3 w-3 text-blue-600" /> :
                   activity.type === 'events' ? <CalendarDays className="h-3 w-3 text-purple-600" /> :
                   activity.type === 'property' ? <Home className="h-3 w-3 text-orange-600" /> :
                   <Users className="h-3 w-3 text-gray-600" />}
                </div>
                <div>
                  <p className="font-medium text-sm">{activity.activity}</p>
                  <p className="text-xs text-muted-foreground">{activity.source}</p>
                  {activity.amount && (
                    <p className="text-xs font-medium text-green-600">{activity.amount}</p>
                  )}
                  {activity.count && (
                    <p className="text-xs font-medium text-blue-600">{activity.count}</p>
                  )}
                  {activity.event && (
                    <p className="text-xs font-medium text-purple-600">{activity.event}</p>
                  )}
                  {activity.property && (
                    <p className="text-xs font-medium text-orange-600">{activity.property}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Approvals Alert */}
      <Card className="border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-orange-600" />
            Pending Vendor Approvals
          </CardTitle>
          <CardDescription>
            Vendor applications requiring executive attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">12 Pending</div>
              <div className="text-sm text-muted-foreground">5 High Priority • 7 Standard</div>
              <div className="text-xs text-muted-foreground mt-1">Average wait: 8.3 days</div>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild className="bg-orange-600 hover:bg-orange-700">
                <a href="/dashboard/vendor-approvals">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Review Approvals
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="/dashboard/vendor-approvals/workflow">
                  <Workflow className="h-4 w-4 mr-2" />
                  View Workflow
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Quick Actions</CardTitle>
          <CardDescription>
            Direct access to critical business functions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-xs">Full Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <DollarSign className="h-6 w-6" />
              <span className="text-xs">Finance Overview</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span className="text-xs">Staff Management</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <a href="/dashboard/vendor-approvals">
                <UserCheck className="h-6 w-6" />
                <span className="text-xs">Vendor Approvals</span>
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <AlertCircle className="h-6 w-6" />
              <span className="text-xs">Review Alerts</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Zap className="h-6 w-6" />
              <span className="text-xs">System Health</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
