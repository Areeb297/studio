'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Home, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Building,
  Calendar,
  FileText,
  Settings,
  MapPin,
  Key,
  Wrench,
  Phone,
  Mail,
  UserPlus
} from "lucide-react";

export default function RentPage() {
  const rentStats = [
    {
      title: "Total Properties",
      value: "47",
      change: "+3",
      icon: Building,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "Monthly Revenue",
      value: "₨ 1,847,500",
      change: "+12%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      title: "Occupancy Rate",
      value: "89.4%",
      change: "+4.2%",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      title: "Pending Maintenance",
      value: "12",
      change: "-3",
      icon: Wrench,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20"
    }
  ];

  const propertyTypes = [
    { type: "Residential Flats", count: 28, occupied: 25, revenue: 1247800, color: "bg-blue-500" },
    { type: "Commercial Shops", count: 12, occupied: 11, revenue: 456700, color: "bg-green-500" },
    { type: "Office Spaces", count: 5, occupied: 4, revenue: 125600, color: "bg-purple-500" },
    { type: "Storage Units", count: 2, occupied: 2, revenue: 17400, color: "bg-orange-500" }
  ];

  const recentActivities = [
    { activity: "Rent Payment Received", tenant: "Ahmed Khan - Flat A-201", amount: 35000, time: "2 hours ago", type: "payment" },
    { activity: "Lease Renewal Request", tenant: "Fatima Shop - Shop #5", amount: null, time: "5 hours ago", type: "renewal" },
    { activity: "Maintenance Request", tenant: "Ali Hassan - Flat B-105", amount: null, time: "1 day ago", type: "maintenance" },
    { activity: "New Tenant Application", tenant: "Muhammad Ibrahim - Office #3", amount: null, time: "2 days ago", type: "application" }
  ];

  const upcomingRenewals = [
    { tenant: "Ahmed Khan", property: "Flat A-201", expiry: "March 15, 2025", rent: 35000, status: "pending" },
    { tenant: "Fatima Bibi", property: "Shop #5", expiry: "March 20, 2025", rent: 45000, status: "processing" },
    { tenant: "Ali Hassan", property: "Office #2", expiry: "March 25, 2025", rent: 28000, status: "confirmed" },
    { tenant: "Omar Sheikh", property: "Flat B-105", expiry: "March 30, 2025", rent: 32000, status: "pending" }
  ];

  const maintenanceRequests = [
    { property: "Flat A-201", issue: "Plumbing Issue", priority: "High", submitted: "2 days ago", status: "in-progress" },
    { property: "Shop #3", issue: "Electrical Problem", priority: "Medium", submitted: "4 days ago", status: "pending" },
    { property: "Office #1", issue: "AC Repair", priority: "Low", submitted: "1 week ago", status: "completed" },
    { property: "Flat B-203", issue: "Paint Touch-up", priority: "Low", submitted: "1 week ago", status: "pending" }
  ];

  const revenueData = [
    { month: "January 2025", collected: 1756400, pending: 91100, total: 1847500 },
    { month: "February 2025", collected: 1689200, pending: 158300, total: 1847500 },
    { month: "March 2025", collected: 1523600, pending: 323900, total: 1847500 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Rent Management</h1>
          <p className="text-muted-foreground">Manage properties, tenants, and rental income</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Tenant
          </Button>
          <Button variant="outline">
            <Building className="h-4 w-4 mr-2" />
            Add Property
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rentStats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-sm flex items-center mt-1 ${
                    stat.change.startsWith('+') ? 'text-green-600' : 
                    stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Property Portfolio Overview
            </CardTitle>
            <CardDescription>
              Distribution of properties by type and occupancy status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {propertyTypes.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.type}</span>
                    <Badge variant="outline">
                      {item.occupied}/{item.count} occupied
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Occupancy Rate</span>
                      <span>{Math.round((item.occupied / item.count) * 100)}%</span>
                    </div>
                    <Progress value={(item.occupied / item.count) * 100} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Revenue</span>
                    <span className="font-semibold">₨ {item.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-semibold">Portfolio Performance</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Overall occupancy rate of 89.4% exceeds the market average of 82% in the area.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest property and tenant activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full mt-1 ${
                      activity.type === 'payment' ? 'bg-green-100 dark:bg-green-950/20' :
                      activity.type === 'renewal' ? 'bg-blue-100 dark:bg-blue-950/20' :
                      activity.type === 'maintenance' ? 'bg-orange-100 dark:bg-orange-950/20' :
                      'bg-purple-100 dark:bg-purple-950/20'
                    }`}>
                      {activity.type === 'payment' ? <DollarSign className="h-3 w-3 text-green-600" /> :
                       activity.type === 'renewal' ? <Calendar className="h-3 w-3 text-blue-600" /> :
                       activity.type === 'maintenance' ? <Wrench className="h-3 w-3 text-orange-600" /> :
                       <UserPlus className="h-3 w-3 text-purple-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.activity}</p>
                      <p className="text-xs text-muted-foreground">{activity.tenant}</p>
                      {activity.amount && (
                        <p className="text-xs text-green-600 font-medium">₨ {activity.amount.toLocaleString()}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Lease Renewals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Lease Renewals
            </CardTitle>
            <CardDescription>
              Leases expiring in the next 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingRenewals.map((renewal, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-sm">{renewal.tenant}</p>
                      <p className="text-xs text-muted-foreground">{renewal.property}</p>
                    </div>
                    <Badge variant={
                      renewal.status === 'confirmed' ? 'default' :
                      renewal.status === 'processing' ? 'secondary' : 'outline'
                    }>
                      {renewal.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Expires: {renewal.expiry}</span>
                    <span className="font-semibold">₨ {renewal.rent.toLocaleString()}/month</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Action Required</span>
              </div>
              <p className="text-xs text-muted-foreground">
                2 renewal applications require immediate attention to avoid vacancy.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              Maintenance Requests
            </CardTitle>
            <CardDescription>
              Property maintenance and repair tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {maintenanceRequests.map((request, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-sm">{request.property}</p>
                      <p className="text-xs text-muted-foreground">{request.issue}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        request.priority === 'High' ? 'destructive' :
                        request.priority === 'Medium' ? 'default' : 'secondary'
                      }>
                        {request.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Submitted: {request.submitted}</span>
                    <Badge variant={
                      request.status === 'completed' ? 'default' :
                      request.status === 'in-progress' ? 'secondary' : 'outline'
                    }>
                      {request.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="w-full mt-4" variant="outline">
              <Wrench className="h-4 w-4 mr-2" />
              View All Requests
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Collection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Monthly Revenue Collection Status
          </CardTitle>
          <CardDescription>
            Track rental income collection and pending payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {revenueData.map((month, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sm">{month.month}</h4>
                  <Badge variant="outline">
                    {Math.round((month.collected / month.total) * 100)}% collected
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Collected: ₨ {month.collected.toLocaleString()}</span>
                    <span className="text-red-600">Pending: ₨ {month.pending.toLocaleString()}</span>
                  </div>
                  <Progress value={(month.collected / month.total) * 100} className="h-2" />
                </div>
                
                <div className="text-center">
                  <p className="text-sm font-medium">Total: ₨ {month.total.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-green-600">94.8%</p>
              <p className="text-xs text-muted-foreground">Collection Rate</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20 rounded-lg">
              <Home className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-blue-600">42</p>
              <p className="text-xs text-muted-foreground">Occupied Units</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-purple-600">₨ 43,969</p>
              <p className="text-xs text-muted-foreground">Avg. Rent/Unit</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-orange-600">4</p>
              <p className="text-xs text-muted-foreground">Renewals Due</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}