'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Building, 
  Target,
  Activity,
  BarChart3,
  PieChart as PieIcon,
  LineChart as LineIcon,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function KPIAnalyticsPage() {
  // Revenue data for different business lines
  const revenueData = [
    {
      month: 'Jan',
      restaurant: 11500000,
      academic: 7800000,
      events: 3200000,
      fitness: 1800000,
      total: 24300000,
      forecast: null
    },
    {
      month: 'Feb',
      restaurant: 12200000,
      academic: 8200000,
      events: 3800000,
      fitness: 2100000,
      total: 26300000,
      forecast: null
    },
    {
      month: 'Mar',
      restaurant: 12800000,
      academic: 8900000,
      events: 4200000,
      fitness: 2200000,
      total: 28100000,
      forecast: null
    },
    {
      month: 'Apr',
      restaurant: 13200000,
      academic: 9200000,
      events: 4600000,
      fitness: 2300000,
      total: 29300000,
      forecast: null
    },
    {
      month: 'May',
      restaurant: 13800000,
      academic: 9600000,
      events: 5100000,
      fitness: 2400000,
      total: 30900000,
      forecast: null
    },
    {
      month: 'Jun',
      restaurant: 14200000,
      academic: 9800000,
      events: 5400000,
      fitness: 2500000,
      total: 31900000,
      forecast: null
    },
    // Forecast data with dashed lines
    {
      month: 'Jul',
      restaurant: null,
      academic: null,
      events: null,
      fitness: null,
      total: null,
      forecast: 33200000
    },
    {
      month: 'Aug',
      restaurant: null,
      academic: null,
      events: null,
      fitness: null,
      total: null,
      forecast: 34500000
    },
    {
      month: 'Sep',
      restaurant: null,
      academic: null,
      events: null,
      fitness: null,
      total: null,
      forecast: 35800000
    },
    {
      month: 'Oct',
      restaurant: null,
      academic: null,
      events: null,
      fitness: null,
      total: null,
      forecast: 37100000
    },
    {
      month: 'Nov',
      restaurant: null,
      academic: null,
      events: null,
      fitness: null,
      total: null,
      forecast: 38400000
    },
    {
      month: 'Dec',
      restaurant: null,
      academic: null,
      events: null,
      fitness: null,
      total: null,
      forecast: 39700000
    }
  ];

  // Revenue distribution pie chart data
  const revenueDistribution = [
    { name: 'Restaurant & Catering', value: 45, amount: 14200000, color: '#3b82f6' },
    { name: 'Academic Operations', value: 31, amount: 9800000, color: '#10b981' },
    { name: 'Events & Ceremonies', value: 17, amount: 5400000, color: '#8b5cf6' },
    { name: 'Fitness & Wellness', value: 7, amount: 2500000, color: '#f59e0b' }
  ];

  // Cash flow data
  const cashFlowData = [
    { month: 'Jan', inflow: 24300000, outflow: 18200000, net: 6100000 },
    { month: 'Feb', inflow: 26300000, outflow: 19800000, net: 6500000 },
    { month: 'Mar', inflow: 28100000, outflow: 21200000, net: 6900000 },
    { month: 'Apr', inflow: 29300000, outflow: 22100000, net: 7200000 },
    { month: 'May', inflow: 30900000, outflow: 23400000, net: 7500000 },
    { month: 'Jun', inflow: 31900000, outflow: 24200000, net: 7700000 }
  ];

  // Performance vs targets
  const performanceData = [
    { metric: 'Revenue', actual: 106.3, target: 100, category: 'Financial', actualValue: 31900000, targetValue: 30000000 },
    { metric: 'Students', actual: 113.9, target: 100, category: 'Academic', actualValue: 2847, targetValue: 2500 },
    { metric: 'Occupancy', actual: 105.2, target: 100, category: 'Property', actualValue: 89.4, targetValue: 85 },
    { metric: 'Satisfaction', actual: 104.4, target: 100, category: 'Service', actualValue: 4.7, targetValue: 4.5 },
    { metric: 'Efficiency', actual: 105.3, target: 100, category: 'Operations', actualValue: 94.8, targetValue: 90 }
  ];

  // Staff utilization data
  const staffData = [
    { department: 'Restaurant', total: 45, active: 42, inactive: 3, utilization: 93.3 },
    { department: 'Academic', total: 38, active: 36, inactive: 2, utilization: 94.7 },
    { department: 'Events', total: 12, active: 10, inactive: 2, utilization: 83.3 },
    { department: 'Admin', total: 18, active: 17, inactive: 1, utilization: 94.4 },
    { department: 'Maintenance', total: 8, active: 7, inactive: 1, utilization: 87.5 }
  ];

  // Key metrics summary
  const keyMetrics = [
    {
      title: "Total Revenue",
      value: "₨ 31.9M",
      change: "+8.2%",
      trend: "up",
      target: "₨ 30M",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      title: "Active Entities",
      value: "3,456",
      change: "+12%",
      trend: "up",
      target: "3,200",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "Operational Efficiency",
      value: "94.8%",
      change: "+2.1%",
      trend: "up",
      target: "90%",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      title: "Cash Flow",
      value: "₨ 7.7M",
      change: "+15.3%",
      trend: "up",
      target: "₨ 6M",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20"
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' && entry.value > 1000000 
                ? `₨ ${(entry.value / 1000000).toFixed(1)}M`
                : typeof entry.value === 'number' && entry.value > 1000
                ? `₨ ${(entry.value / 1000).toFixed(0)}K`
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">KPI Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business intelligence and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            Live Dashboard
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center mt-1">
                    {metric.trend === 'up' ? (
                      <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">vs target: {metric.target}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Forecast Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineIcon className="h-5 w-5 text-primary" />
              Revenue Trends & 6-Month Forecast
            </CardTitle>
            <CardDescription>
              Historical performance with AI-powered projections (dashed line)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₨${(value / 1000000).toFixed(0)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Actual Revenue"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  strokeDasharray="8 8"
                  name="Projected Revenue"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Distribution Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-primary" />
              Revenue Distribution
            </CardTitle>
            <CardDescription>
              Business line contribution breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={revenueDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {revenueDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name]}
                  labelFormatter={() => ''}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 gap-2 mt-4">
              {revenueDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Cash Flow Analysis
            </CardTitle>
            <CardDescription>
              Monthly inflow vs outflow trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={cashFlowData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₨${(value / 1000000).toFixed(0)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="inflow" 
                  stroke="#22c55e" 
                  fill="#22c55e" 
                  fillOpacity={0.3}
                  name="Cash Inflow"
                />
                <Area 
                  type="monotone" 
                  dataKey="outflow" 
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.3}
                  name="Cash Outflow"
                />
                <Area 
                  type="monotone" 
                  dataKey="net" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.1}
                  strokeWidth={3}
                  name="Net Cash Flow"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance vs Targets Scatter Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Performance vs Targets
            </CardTitle>
            <CardDescription>
              Achievement percentage across key metrics (Target = 100%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  type="number" 
                  dataKey="target" 
                  name="Target %"
                  domain={[95, 105]}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis 
                  type="number" 
                  dataKey="actual" 
                  name="Actual %"
                  domain={[95, 120]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name, props) => [
                    `${value}%`,
                    name === 'actual' ? `${props.payload.metric}: ${props.payload.actualValue}` : name
                  ]}
                />
                <Scatter 
                  dataKey="actual" 
                  fill="#3b82f6"
                  name="Achievement %"
                />
                <ReferenceLine 
                  segment={[{ x: 95, y: 95 }, { x: 120, y: 120 }]}
                  stroke="#10b981"
                  strokeDasharray="5 5"
                />
              </ScatterChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 gap-2 mt-4">
              {performanceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm p-2 rounded bg-accent/30">
                  <span className="font-medium">{item.metric}</span>
                  <div className="text-right">
                    <span className={`font-semibold ${item.actual > 100 ? 'text-green-600' : 'text-orange-600'}`}>
                      {item.actual}%
                    </span>
                    <span className="text-muted-foreground ml-1">of target</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Utilization Stacked Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Staff Utilization by Department
          </CardTitle>
          <CardDescription>
            Department-wise staffing levels and utilization rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={staffData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="department" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis 
                label={{ value: 'Number of Staff', angle: -90, position: 'insideLeft' }}
                domain={[0, 50]}
              />
              <Tooltip 
                formatter={(value, name) => [value, name]}
                labelFormatter={(label) => `Department: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="active" 
                stackId="staff"
                fill="#16a34a" 
                stroke="#15803d"
                strokeWidth={1}
                name="Active Staff"
              />
              <Bar 
                dataKey="inactive" 
                stackId="staff"
                fill="#dc2626" 
                stroke="#b91c1c"
                strokeWidth={1}
                name="Inactive Staff"
              />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
            {staffData.map((dept, index) => (
              <div key={index} className="text-center p-3 bg-accent/30 rounded-lg">
                <p className="font-semibold text-sm">{dept.department}</p>
                <p className="text-lg font-bold text-primary">{dept.utilization}%</p>
                <p className="text-xs text-muted-foreground">
                  {dept.active}/{dept.total} staff
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Intelligence Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Business Intelligence Summary</CardTitle>
            <CardDescription>
              Key insights and recommendations based on current performance data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-4 border-l-green-500">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-600">Strong Performance</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Revenue exceeds targets by 6.3%. Restaurant and Events divisions showing exceptional growth.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-l-blue-500">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-blue-600">Operational Excellence</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Staff utilization at 94.8% efficiency. Academic department leading in productivity metrics.
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border-l-4 border-l-orange-500">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-orange-600" />
                  <span className="font-semibold text-orange-600">Growth Opportunity</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Fitness division has potential for 35% growth based on market analysis and current capacity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}