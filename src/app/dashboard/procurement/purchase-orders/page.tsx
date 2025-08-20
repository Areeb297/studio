'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  Package,
  Eye,
  Edit,
  MoreHorizontal,
  FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PurchaseOrder {
  id: string;
  poNumber: string;
  title: string;
  vendor: string;
  department: string;
  totalAmount: number;
  status: 'draft' | 'sent' | 'acknowledged' | 'partial_delivery' | 'delivered' | 'completed' | 'cancelled';
  createdDate: Date;
  deliveryDate: Date;
  prReference?: string;
  approvalWorkflow?: {
    step: string;
    approver: string;
    status: 'pending' | 'approved' | 'rejected';
    approvedAt?: Date;
  }[];
  deliveryProgress?: number;
  items?: {
    name: string;
    quantity: number;
    unitPrice: number;
    delivered?: number;
  }[];
}

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-001',
    poNumber: 'PO-2024-001',
    title: 'Kitchen Equipment Purchase',
    vendor: 'ABC Kitchen Supplies',
    department: 'Kitchen',
    totalAmount: 35000,
    status: 'acknowledged',
    createdDate: new Date('2024-01-16'),
    deliveryDate: new Date('2024-01-25'),
    prReference: 'PR-2024-001',
    deliveryProgress: 75,
    approvalWorkflow: [
      { step: 'Department Approval', approver: 'Ahmed Hassan', status: 'approved', approvedAt: new Date('2024-01-16') },
      { step: 'Finance Approval', approver: 'Ali Raza', status: 'approved', approvedAt: new Date('2024-01-17') },
      { step: 'Procurement Review', approver: 'Procurement Manager', status: 'approved', approvedAt: new Date('2024-01-18') }
    ],
    items: [
      { name: 'Industrial Mixer', quantity: 1, unitPrice: 25000, delivered: 1 },
      { name: 'Commercial Oven', quantity: 1, unitPrice: 10000, delivered: 0 }
    ]
  },
  {
    id: 'po-002',
    poNumber: 'PO-2024-002',
    title: 'Office Supplies Q1',
    vendor: 'XYZ Office Solutions',
    department: 'Administration',
    totalAmount: 8500,
    status: 'completed',
    createdDate: new Date('2024-01-17'),
    deliveryDate: new Date('2024-01-20'),
    prReference: 'PR-2024-002',
    deliveryProgress: 100,
    items: [
      { name: 'A4 Paper (Reams)', quantity: 50, unitPrice: 120, delivered: 50 },
      { name: 'Printer Cartridges', quantity: 10, unitPrice: 250, delivered: 10 }
    ]
  },
  {
    id: 'po-003',
    poNumber: 'PO-2024-003',
    title: 'IT Hardware Upgrade',
    vendor: 'TechCorp Solutions',
    department: 'IT',
    totalAmount: 125000,
    status: 'sent',
    createdDate: new Date('2024-01-18'),
    deliveryDate: new Date('2024-02-01'),
    deliveryProgress: 0,
    items: [
      { name: 'Desktop Computers', quantity: 5, unitPrice: 18000, delivered: 0 },
      { name: 'Network Equipment', quantity: 1, unitPrice: 35000, delivered: 0 }
    ]
  },
  {
    id: 'po-004',
    poNumber: 'PO-2024-004',
    title: 'Maintenance Supplies',
    vendor: 'General Supplies Ltd',
    department: 'Maintenance',
    totalAmount: 15000,
    status: 'partial_delivery',
    createdDate: new Date('2024-01-19'),
    deliveryDate: new Date('2024-01-30'),
    deliveryProgress: 60,
    items: [
      { name: 'Cleaning Chemicals', quantity: 20, unitPrice: 300, delivered: 15 },
      { name: 'Maintenance Tools', quantity: 10, unitPrice: 900, delivered: 5 }
    ]
  }
];

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-700';
      case 'delivered': return 'bg-blue-500/20 text-blue-700';
      case 'acknowledged': return 'bg-yellow-500/20 text-yellow-700';
      case 'sent': return 'bg-orange-500/20 text-orange-700';
      case 'draft': return 'bg-gray-500/20 text-gray-700';
      case 'partial_delivery': return 'bg-purple-500/20 text-purple-700';
      case 'cancelled': return 'bg-red-500/20 text-red-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'delivered': return <Package className="h-4 w-4" />;
      case 'acknowledged': return <CheckCircle className="h-4 w-4" />;
      case 'sent': return <FileText className="h-4 w-4" />;
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'partial_delivery': return <Truck className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Purchase Orders</h1>
          <p className="text-muted-foreground">Manage purchase orders and track delivery status</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create PO
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
              <DialogDescription>
                Create a new purchase order from approved requisitions or directly.
              </DialogDescription>
            </DialogHeader>
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Purchase Order Creation</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Purchase order creation form coming soon
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total POs</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 new this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Delivery</CardTitle>
            <Truck className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {purchaseOrders.filter(po => ['sent', 'acknowledged', 'partial_delivery'].includes(po.status)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting delivery
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {purchaseOrders.filter(po => po.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              PKR {purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all POs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Purchase Orders</CardTitle>
          <CardDescription>
            Track purchase orders, delivery status, and vendor performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delivery Progress</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{po.poNumber}</div>
                      {po.prReference && (
                        <div className="text-xs text-muted-foreground">
                          From {po.prReference}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{po.title}</div>
                    {po.items && (
                      <div className="text-xs text-muted-foreground">
                        {po.items.length} item(s)
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{po.vendor}</Badge>
                  </TableCell>
                  <TableCell>{po.department}</TableCell>
                  <TableCell>PKR {po.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(po.status)}
                      <Badge variant="outline" className={getStatusColor(po.status)}>
                        {formatStatus(po.status)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {po.deliveryProgress !== undefined && (
                      <div className="space-y-1">
                        <Progress value={po.deliveryProgress} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {po.deliveryProgress}% delivered
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {po.deliveryDate.toLocaleDateString()}
                    </div>
                    {po.deliveryDate < new Date() && po.status !== 'completed' && (
                      <div className="text-xs text-red-600">Overdue</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit PO
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Truck className="mr-2 h-4 w-4" />
                          Update Delivery
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Generate Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delivery Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deliveries</CardTitle>
          <CardDescription>Expected deliveries in the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {purchaseOrders
              .filter(po => po.deliveryDate >= new Date() && po.deliveryDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
              .sort((a, b) => a.deliveryDate.getTime() - b.deliveryDate.getTime())
              .map((po) => (
                <div key={po.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-blue-500/10">
                      <Truck className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{po.poNumber}</h4>
                      <p className="text-sm text-muted-foreground">{po.vendor} • {po.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{po.deliveryDate.toLocaleDateString()}</div>
                    <div className="text-sm text-muted-foreground">
                      PKR {po.totalAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            {purchaseOrders.filter(po => po.deliveryDate >= new Date() && po.deliveryDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No upcoming deliveries in the next 7 days
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}