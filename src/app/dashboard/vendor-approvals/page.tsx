'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Clock, 
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Eye,
  Download,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Filter,
  Search,
  MoreVertical,
  Play,
  Pause,
  RotateCcw,
  UserCheck,
  Shield,
  Workflow
} from "lucide-react";
import {
  ResponsiveContainer,
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
  Line
} from 'recharts';

export default function VendorApprovalsPage() {
  const [selectedTab, setSelectedTab] = useState("pending");

  // Vendor approval data
  const approvalStats = [
    { status: 'Pending Review', count: 12, color: '#F59E0B', percentage: 40 },
    { status: 'Under Investigation', count: 5, color: '#3B82F6', percentage: 16.7 },
    { status: 'Approved', count: 8, color: '#10B981', percentage: 26.7 },
    { status: 'Rejected', count: 5, color: '#EF4444', percentage: 16.7 }
  ];

  // Approval workflow stages
  const workflowStages = [
    { stage: 'Initial Submission', status: 'completed', date: '2024-09-01' },
    { stage: 'Document Verification', status: 'completed', date: '2024-09-03' },
    { stage: 'Financial Assessment', status: 'in-progress', date: '2024-09-05' },
    { stage: 'Department Review', status: 'pending', date: null },
    { stage: 'Executive Approval', status: 'pending', date: null },
    { stage: 'Final Registration', status: 'pending', date: null }
  ];

  // Pending vendor approvals
  const pendingApprovals = [
    {
      id: 'VEN-2024-001',
      companyName: 'Al-Noor Trading Corporation',
      contactPerson: 'Muhammad Hassan',
      category: 'Food & Catering',
      submissionDate: '2024-09-01',
      currentStage: 'Financial Assessment',
      priority: 'high',
      estimatedValue: 2500000,
      documents: 8,
      riskScore: 'Low',
      approver: 'Finance Director',
      daysInQueue: 10
    },
    {
      id: 'VEN-2024-002',
      companyName: 'Karachi Construction Co.',
      contactPerson: 'Ahmed Ali Khan',
      category: 'Construction & Maintenance',
      submissionDate: '2024-09-03',
      currentStage: 'Document Verification',
      priority: 'medium',
      estimatedValue: 1800000,
      documents: 12,
      riskScore: 'Medium',
      approver: 'Operations Manager',
      daysInQueue: 8
    },
    {
      id: 'VEN-2024-003',
      companyName: 'Digital Solutions Ltd.',
      contactPerson: 'Sarah Fatima',
      category: 'IT & Technology',
      submissionDate: '2024-09-05',
      currentStage: 'Initial Review',
      priority: 'low',
      estimatedValue: 950000,
      documents: 6,
      riskScore: 'Low',
      approver: 'IT Director',
      daysInQueue: 6
    }
  ];

  // Monthly approval trends
  const approvalTrends = [
    { month: 'Jun', submitted: 15, approved: 12, rejected: 3, avgDays: 8.5 },
    { month: 'Jul', submitted: 18, approved: 14, rejected: 4, avgDays: 7.2 },
    { month: 'Aug', submitted: 22, approved: 18, rejected: 4, avgDays: 6.8 },
    { month: 'Sep', submitted: 12, approved: 8, rejected: 2, avgDays: 9.1 }
  ];

  // Executive KPIs for vendor management
  const vendorKPIs = [
    {
      title: "Active Vendors",
      value: "247",
      change: "+18",
      period: "this month",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "Avg Approval Time",
      value: "7.8 days",
      change: "-1.3 days",
      period: "vs last month",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      title: "Approval Rate",
      value: "84.2%",
      change: "+2.1%",
      period: "this quarter",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20"
    },
    {
      title: "Risk Score",
      value: "2.3/10",
      change: "-0.4",
      period: "lower risk",
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'in-progress':
        return <Badge variant="secondary" className="bg-blue-500"><Play className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="default">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Vendor Approval System</h1>
          <p className="text-muted-foreground">Comprehensive vendor management and approval workflow</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <UserCheck className="h-4 w-4 mr-2" />
            New Vendor
          </Button>
        </div>
      </div>

      {/* Executive KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vendorKPIs.map((kpi, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className={`font-medium ${kpi.change.startsWith('+') || kpi.change.startsWith('-') && !kpi.change.includes('days') ? 'text-green-600' : kpi.change.includes('-') && kpi.change.includes('days') ? 'text-green-600' : 'text-gray-600'}`}>
                      {kpi.change}
                    </span> {kpi.period}
                  </p>
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
        {/* Approval Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-primary" />
              Approval Status Distribution
            </CardTitle>
            <CardDescription>
              Current status of vendor applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={approvalStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="count"
                    startAngle={90}
                    endAngle={450}
                  >
                    {approvalStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} vendors`, 'Count']} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Approval Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Monthly Approval Trends
            </CardTitle>
            <CardDescription>
              Submission, approval, and rejection trends with average processing time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={approvalTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                  <Bar dataKey="submitted" fill="#3B82F6" name="Submitted" />
                  <Bar dataKey="approved" fill="#10B981" name="Approved" />
                  <Bar dataKey="rejected" fill="#EF4444" name="Rejected" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Approval Workflow Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Vendor Approval Management
          </CardTitle>
          <CardDescription>
            Manage and track vendor applications through the approval process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">Pending ({pendingApprovals.length})</TabsTrigger>
              <TabsTrigger value="in-review">In Review (5)</TabsTrigger>
              <TabsTrigger value="approved">Approved (8)</TabsTrigger>
              <TabsTrigger value="rejected">Rejected (2)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="space-y-4 mt-6">
              {pendingApprovals.map((vendor, index) => (
                <Card key={vendor.id} className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Vendor Basic Info */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{vendor.companyName}</h3>
                              {getPriorityBadge(vendor.priority)}
                            </div>
                            <p className="text-sm text-muted-foreground">ID: {vendor.id}</p>
                            <p className="text-sm text-muted-foreground">Contact: {vendor.contactPerson}</p>
                            <p className="text-sm text-muted-foreground">Category: {vendor.category}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <p className="font-medium">Estimated Value</p>
                            <p className="text-green-600 font-semibold">₨ {vendor.estimatedValue.toLocaleString()}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">Risk Assessment</p>
                            <Badge variant={vendor.riskScore === 'Low' ? 'default' : vendor.riskScore === 'Medium' ? 'secondary' : 'destructive'}>
                              {vendor.riskScore} Risk
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">Documents</p>
                            <p className="text-blue-600">{vendor.documents} files submitted</p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">In Queue</p>
                            <p className="text-orange-600">{vendor.daysInQueue} days</p>
                          </div>
                        </div>
                      </div>

                      {/* Current Stage & Progress */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Current Stage</p>
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <p className="font-medium text-blue-700 dark:text-blue-300">{vendor.currentStage}</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">Assigned to: {vendor.approver}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-2">Progress</p>
                          <Progress value={vendor.currentStage === 'Initial Review' ? 16 : vendor.currentStage === 'Document Verification' ? 33 : vendor.currentStage === 'Financial Assessment' ? 50 : 66} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            Stage {vendor.currentStage === 'Initial Review' ? '1' : vendor.currentStage === 'Document Verification' ? '2' : vendor.currentStage === 'Financial Assessment' ? '3' : '4'} of 6
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <Button className="w-full" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Review Details
                        </Button>
                        <Button variant="outline" className="w-full" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Documents
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="in-review" className="space-y-4 mt-6">
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Under Review</h3>
                <p className="text-muted-foreground">5 vendors are currently under detailed review by department heads.</p>
              </div>
            </TabsContent>

            <TabsContent value="approved" className="space-y-4 mt-6">
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Recently Approved</h3>
                <p className="text-muted-foreground">8 vendors have been approved this month and added to our vendor database.</p>
              </div>
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4 mt-6">
              <div className="text-center py-8">
                <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Rejected Applications</h3>
                <p className="text-muted-foreground">2 vendor applications were rejected due to incomplete documentation or compliance issues.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Workflow Stage Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-primary" />
            Standard Approval Workflow
          </CardTitle>
          <CardDescription>
            Complete vendor approval process with stage-wise requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {workflowStages.map((stage, index) => (
              <Card key={index} className={`relative ${
                stage.status === 'completed' ? 'bg-green-50 dark:bg-green-950/20 border-green-200' :
                stage.status === 'in-progress' ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200' :
                'bg-gray-50 dark:bg-gray-800 border-gray-200'
              }`}>
                <CardContent className="p-4 text-center">
                  <div className="mb-3">
                    {stage.status === 'completed' ? (
                      <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto" />
                    ) : stage.status === 'in-progress' ? (
                      <Play className="h-8 w-8 text-blue-600 mx-auto" />
                    ) : (
                      <Clock className="h-8 w-8 text-gray-400 mx-auto" />
                    )}
                  </div>
                  <h4 className="font-medium text-sm mb-2">{stage.stage}</h4>
                  {getStatusBadge(stage.status)}
                  {stage.date && (
                    <p className="text-xs text-muted-foreground mt-2">{stage.date}</p>
                  )}
                </CardContent>
                {index < workflowStages.length - 1 && (
                  <div className="absolute top-1/2 -right-2 w-4 h-0.5 bg-gray-300 dark:bg-gray-600 hidden lg:block"></div>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}