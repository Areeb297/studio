'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  FileText,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  ArrowUpRight,
  Package,
  DollarSign
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProcurementMetrics {
  totalPOs: number;
  pendingApprovals: number;
  activeVendors: number;
  monthlySpend: number;
  avgProcessingTime: string;
  costSavings: number;
}

interface RequisitionItem {
  id: string;
  title: string;
  requestor: string;
  department: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  amount: number;
  status: 'draft' | 'sent' | 'acknowledged' | 'delivered' | 'completed';
  deliveryDate: Date;
}

const mockMetrics: ProcurementMetrics = {
  totalPOs: 245,
  pendingApprovals: 12,
  activeVendors: 68,
  monthlySpend: 458750,
  avgProcessingTime: "3.2 days",
  costSavings: 25400
};

const mockRequisitions: RequisitionItem[] = [
  {
    id: 'REQ-001',
    title: 'Kitchen Equipment Upgrade',
    requestor: 'Ahmed Hassan',
    department: 'Kitchen',
    amount: 45000,
    status: 'pending',
    priority: 'high',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'REQ-002',
    title: 'Office Supplies - Q1',
    requestor: 'Fatima Khan',
    department: 'Administration',
    amount: 8500,
    status: 'approved',
    priority: 'medium',
    createdAt: new Date('2024-01-14')
  },
  {
    id: 'REQ-003',
    title: 'Cleaning Supplies Replenishment',
    requestor: 'Ali Raza',
    department: 'Maintenance',
    amount: 12000,
    status: 'pending',
    priority: 'medium',
    createdAt: new Date('2024-01-13')
  }
];

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-001',
    poNumber: 'PO-2024-001',
    vendor: 'ABC Kitchen Supplies',
    amount: 35000,
    status: 'sent',
    deliveryDate: new Date('2024-01-25')
  },
  {
    id: 'PO-002',
    poNumber: 'PO-2024-002',
    vendor: 'XYZ Office Solutions',
    amount: 15500,
    status: 'delivered',
    deliveryDate: new Date('2024-01-20')
  }
];

export default function ProcurementPage() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-700';
      case 'pending': return 'bg-yellow-500/20 text-yellow-700';
      case 'rejected': return 'bg-red-500/20 text-red-700';
      case 'completed': return 'bg-blue-500/20 text-blue-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Procurement Management</h1>
          <p className="text-muted-foreground">Streamline your procurement process with modern approval workflows</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Reports
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Purchase Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.totalPOs}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.activeVendors}</div>
            <p className="text-xs text-muted-foreground">Verified suppliers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {mockMetrics.monthlySpend.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requisitions">Purchase Requisitions</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Workflow Status */}
            <Card>
              <CardHeader>
                <CardTitle>Approval Workflow Status</CardTitle>
                <CardDescription>Current status of pending approvals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Department Head Approval</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Finance Approval</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Procurement Review</span>
                    <span>90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest procurement activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">PO-2024-003 approved</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">New vendor registered</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">REQ-001 requires approval</p>
                    <p className="text-xs text-muted-foreground">6 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators for procurement operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-green-600">{mockMetrics.avgProcessingTime}</div>
                  <p className="text-sm text-muted-foreground">Average Processing Time</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-blue-600">PKR {mockMetrics.costSavings.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Cost Savings This Month</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-purple-600">94%</div>
                  <p className="text-sm text-muted-foreground">On-time Delivery Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requisitions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Purchase Requisitions</CardTitle>
                  <CardDescription>Review and approve purchase requests from departments</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Requisition
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRequisitions.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{req.title}</h4>
                        <Badge className={`text-xs ${getPriorityColor(req.priority)} text-white`}>
                          {req.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {req.requestor} • {req.department} • PKR {req.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getStatusColor(req.status)}>
                        {req.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Purchase Orders</CardTitle>
                  <CardDescription>Track and manage purchase orders with vendors</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create PO
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPurchaseOrders.map((po) => (
                  <div key={po.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{po.poNumber}</h4>
                        <Badge variant="outline" className={getStatusColor(po.status)}>
                          {po.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {po.vendor} • PKR {po.amount.toLocaleString()} • Delivery: {po.deliveryDate.toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Management</CardTitle>
              <CardDescription>Manage vendor relationships and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Vendor Management</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Comprehensive vendor management features coming soon
                </p>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vendor
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Procurement Analytics</CardTitle>
              <CardDescription>Insights and analytics for procurement operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Analytics Dashboard</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Advanced analytics and reporting features coming soon
                </p>
                <Button className="mt-4">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}