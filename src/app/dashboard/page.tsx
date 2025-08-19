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
  Home
} from "lucide-react";

export default function ExecutiveDashboard() {
  // Executive-level KPIs across all business lines
  const executiveKPIs = [
    {
      title: "Total Revenue",
      value: "₨ 28,456,890",
      change: "+15.2%",
      period: "vs last month",
      icon: DollarSign,
      trend: "up",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      title: "Active Students",
      value: "2,847",
      change: "+127",
      period: "new enrollments",
      icon: GraduationCap,
      trend: "up",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "Property Occupancy",
      value: "89.4%",
      change: "+4.2%",
      period: "vs last quarter",
      icon: Home,
      trend: "up",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      title: "Overall Efficiency",
      value: "94.8%",
      change: "+2.1%",
      period: "operational score",
      icon: Target,
      trend: "up",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20"
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
          <p className="text-muted-foreground">Comprehensive overview of all business operations</p>
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

      {/* Executive KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {executiveKPIs.map((kpi, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
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
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Line Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Business Line Performance
            </CardTitle>
            <CardDescription>
              Revenue and key metrics across all business operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {businessLines.map((business, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <business.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{business.name}</h4>
                        <p className="text-sm text-muted-foreground">₨ {business.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        business.status === 'excellent' ? 'default' :
                        business.status === 'good' ? 'secondary' : 'outline'
                      }>
                        {business.status}
                      </Badge>
                      <p className="text-sm text-green-600 font-medium mt-1">+{business.growth}%</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    {Object.entries(business.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="font-medium">{value}</p>
                        <p className="text-muted-foreground capitalize">{key}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Alerts & Actions
            </CardTitle>
            <CardDescription>
              Items requiring executive attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'error' ? 'border-l-red-500 bg-red-50 dark:bg-red-950/20' :
                  alert.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' :
                  alert.type === 'success' ? 'border-l-green-500 bg-green-50 dark:bg-green-950/20' :
                  'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20'
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-sm">{alert.message}</p>
                    <Badge variant={
                      alert.priority === 'high' ? 'destructive' :
                      alert.priority === 'medium' ? 'default' : 'secondary'
                    } className="text-xs">
                      {alert.priority}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    {alert.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Target className="h-6 w-6" />
              <span className="text-xs">Set Targets</span>
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
