'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PurchaseRequisition {
  id: string;
  prNumber: string;
  title: string;
  requestor: string;
  department: string;
  totalAmount: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'converted';
  requestDate: Date;
  requiredDate: Date;
  approvalWorkflow?: {
    step: string;
    approver: string;
    status: 'pending' | 'approved' | 'rejected';
    approvedAt?: Date;
    comments?: string;
  }[];
}

const mockRequisitions: PurchaseRequisition[] = [
  {
    id: 'req-001',
    prNumber: 'PR-2024-001',
    title: 'Kitchen Equipment Upgrade',
    requestor: 'Ahmed Hassan',
    department: 'Kitchen',
    totalAmount: 45000,
    priority: 'high',
    status: 'pending',
    requestDate: new Date('2024-01-15'),
    requiredDate: new Date('2024-02-15'),
    approvalWorkflow: [
      { step: 'Department Head', approver: 'Fatima Khan', status: 'approved', approvedAt: new Date('2024-01-16') },
      { step: 'Finance Review', approver: 'Ali Raza', status: 'pending' },
      { step: 'Final Approval', approver: 'Muhammad Tariq', status: 'pending' }
    ]
  },
  {
    id: 'req-002',
    prNumber: 'PR-2024-002',
    title: 'Office Supplies - Q1 2024',
    requestor: 'Fatima Khan',
    department: 'Administration',
    totalAmount: 8500,
    priority: 'medium',
    status: 'approved',
    requestDate: new Date('2024-01-14'),
    requiredDate: new Date('2024-01-30'),
    approvalWorkflow: [
      { step: 'Department Head', approver: 'Sana Ahmed', status: 'approved', approvedAt: new Date('2024-01-14') },
      { step: 'Finance Review', approver: 'Ali Raza', status: 'approved', approvedAt: new Date('2024-01-15') },
      { step: 'Final Approval', approver: 'Muhammad Tariq', status: 'approved', approvedAt: new Date('2024-01-16') }
    ]
  },
  {
    id: 'req-003',
    prNumber: 'PR-2024-003',
    title: 'Cleaning Supplies Replenishment',
    requestor: 'Ali Raza',
    department: 'Maintenance',
    totalAmount: 12000,
    priority: 'medium',
    status: 'draft',
    requestDate: new Date('2024-01-13'),
    requiredDate: new Date('2024-02-01')
  },
  {
    id: 'req-004',
    prNumber: 'PR-2024-004',
    title: 'IT Hardware Upgrade',
    requestor: 'Omar Sheikh',
    department: 'IT',
    totalAmount: 75000,
    priority: 'urgent',
    status: 'rejected',
    requestDate: new Date('2024-01-12'),
    requiredDate: new Date('2024-01-25'),
    approvalWorkflow: [
      { step: 'Department Head', approver: 'Sana Ahmed', status: 'approved', approvedAt: new Date('2024-01-13') },
      { step: 'Finance Review', approver: 'Ali Raza', status: 'rejected', approvedAt: new Date('2024-01-14'), comments: 'Budget constraints for Q1' }
    ]
  }
];

export default function PurchaseRequisitionsPage() {
  const [requisitions, setRequisitions] = useState<PurchaseRequisition[]>(mockRequisitions);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-700';
      case 'pending': return 'bg-yellow-500/20 text-yellow-700';
      case 'rejected': return 'bg-red-500/20 text-red-700';
      case 'draft': return 'bg-gray-500/20 text-gray-700';
      case 'converted': return 'bg-blue-500/20 text-blue-700';
      default: return 'bg-gray-500/20 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'converted': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getWorkflowProgress = (workflow?: PurchaseRequisition['approvalWorkflow']) => {
    if (!workflow) return 0;
    const approvedSteps = workflow.filter(step => step.status === 'approved').length;
    return (approvedSteps / workflow.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Purchase Requisitions</h1>
          <p className="text-muted-foreground">Create and manage purchase requests with approval workflows</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Requisition
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Purchase Requisition</DialogTitle>
              <DialogDescription>
                Create a new purchase requisition that will go through the approval workflow.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Requisition Title</Label>
                  <Input id="title" placeholder="e.g., Office Supplies Q1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kitchen">Kitchen</SelectItem>
                      <SelectItem value="administration">Administration</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="it">IT</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requiredDate">Required Date</Label>
                  <Input id="requiredDate" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed description of items needed..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedAmount">Estimated Amount (PKR)</Label>
                <Input id="estimatedAmount" type="number" placeholder="0.00" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Create Requisition
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requisitions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requisitions.length}</div>
            <p className="text-xs text-muted-foreground">
              +3 new this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requisitions.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requisitions.filter(r => r.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for PO creation
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
              PKR {requisitions.reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all requisitions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Requisitions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Purchase Requisitions</CardTitle>
          <CardDescription>
            Track and manage purchase requisitions through the approval workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PR Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Requestor</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Required Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requisitions.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.prNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{req.title}</div>
                      {req.approvalWorkflow && (
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 transition-all duration-300"
                              style={{ width: `${getWorkflowProgress(req.approvalWorkflow)}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(getWorkflowProgress(req.approvalWorkflow))}%
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{req.requestor}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{req.department}</Badge>
                  </TableCell>
                  <TableCell>PKR {req.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getPriorityColor(req.priority)}`}>
                      {req.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(req.status)}
                      <Badge variant="outline" className={getStatusColor(req.status)}>
                        {req.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{req.requiredDate.toLocaleDateString()}</TableCell>
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
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          Convert to PO
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
    </div>
  );
}