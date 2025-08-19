'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Users, 
  CalendarDays, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Package,
  Truck,
  UserPlus,
  Calendar,
  BarChart3
} from "lucide-react";

export default function QurbaniPage() {
  const qurbaniStats = [
    {
      title: "Total Registrations",
      value: "1,247",
      change: "+23%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "Animals Allocated",
      value: "312",
      change: "+18%",
      icon: Heart,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      title: "Total Revenue",
      value: "₨ 2,847,500",
      change: "+31%",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      title: "Processing Complete",
      value: "89%",
      change: "+12%",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20"
    }
  ];

  const registrationData = [
    { type: "Goat", count: 687, percentage: 55, color: "bg-blue-500" },
    { type: "Sheep", count: 423, percentage: 34, color: "bg-green-500" },
    { type: "Cow (Share)", count: 98, percentage: 8, color: "bg-purple-500" },
    { type: "Camel (Share)", count: 39, percentage: 3, color: "bg-orange-500" }
  ];

  const processingTimeline = [
    { stage: "Registration Open", date: "Jun 1 - Jul 15", status: "completed" },
    { stage: "Animal Procurement", date: "Jul 16 - Aug 20", status: "completed" },
    { stage: "Processing Day 1", date: "Aug 21", status: "in-progress" },
    { stage: "Processing Day 2", date: "Aug 22", status: "pending" },
    { stage: "Distribution", date: "Aug 23 - Aug 25", status: "pending" }
  ];

  const recentActivities = [
    { action: "New registration", participant: "Ahmed Hassan", time: "2 minutes ago", type: "registration" },
    { action: "Payment received", participant: "Fatima Khan", time: "15 minutes ago", type: "payment" },
    { action: "Animal allocated", participant: "Muhammad Ali", time: "1 hour ago", type: "allocation" },
    { action: "Processing scheduled", participant: "Batch #23", time: "2 hours ago", type: "processing" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Qurbani Management</h1>
          <p className="text-muted-foreground">Manage registrations, allocations, and processing for Qurbani 2025</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <UserPlus className="h-4 w-4 mr-2" />
            New Registration
          </Button>
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {qurbaniStats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
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
        {/* Registration Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Registration Distribution by Animal Type
            </CardTitle>
            <CardDescription>
              Breakdown of Qurbani registrations by animal type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {registrationData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.type}</span>
                    <div className="text-right">
                      <span className="font-bold">{item.count}</span>
                      <span className="text-sm text-muted-foreground ml-2">({item.percentage}%)</span>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-semibold">Registration Status</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Registration period closed on July 15th. Total of 1,247 participants registered for Qurbani 2025.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Processing Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Processing Timeline
            </CardTitle>
            <CardDescription>
              Qurbani 2025 schedule and progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processingTimeline.map((stage, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`p-1 rounded-full mt-1 ${
                    stage.status === 'completed' ? 'bg-green-100 dark:bg-green-950/20' :
                    stage.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-950/20' :
                    'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {stage.status === 'completed' ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : stage.status === 'in-progress' ? (
                      <Clock className="h-3 w-3 text-blue-600" />
                    ) : (
                      <div className="h-3 w-3 rounded-full bg-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{stage.stage}</p>
                    <p className="text-xs text-muted-foreground">{stage.date}</p>
                  </div>
                  <Badge variant={
                    stage.status === 'completed' ? 'default' :
                    stage.status === 'in-progress' ? 'secondary' :
                    'outline'
                  }>
                    {stage.status.replace('-', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Current Status</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Processing Day 1 is currently in progress. Expected completion by 6:00 PM.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest updates and activities in Qurbani management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'registration' ? 'bg-blue-100 dark:bg-blue-950/20' :
                    activity.type === 'payment' ? 'bg-green-100 dark:bg-green-950/20' :
                    activity.type === 'allocation' ? 'bg-purple-100 dark:bg-purple-950/20' :
                    'bg-orange-100 dark:bg-orange-950/20'
                  }`}>
                    {activity.type === 'registration' ? <UserPlus className="h-3 w-3 text-blue-600" /> :
                     activity.type === 'payment' ? <DollarSign className="h-3 w-3 text-green-600" /> :
                     activity.type === 'allocation' ? <Package className="h-3 w-3 text-purple-600" /> :
                     <Truck className="h-3 w-3 text-orange-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.participant}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Distribution Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Distribution Tracking
            </CardTitle>
            <CardDescription>
              Track meat distribution progress and logistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
                  <Package className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-green-600">267</p>
                  <p className="text-xs text-muted-foreground">Packages Ready</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20 rounded-lg">
                  <Truck className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-blue-600">45</p>
                  <p className="text-xs text-muted-foreground">Out for Delivery</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Distribution Progress</span>
                  <span className="text-sm font-medium">72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              
              <div className="p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Next Distribution</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tomorrow at 8:00 AM - Estimated 180 packages for delivery
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}