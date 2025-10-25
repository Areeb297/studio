'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, PlusCircle, AlertTriangle, CheckCircle, Clock, XCircle, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addDays, differenceInDays } from "date-fns";
import { Progress } from "@/components/ui/progress";

const workOrders = [
  {
    id: 1,
    workOrderNo: 'WO-2025-001',
    title: 'AC Unit Repair - Main Hall',
    category: 'HVAC',
    priority: 'HIGH',
    location: 'Main Hall',
    requestedBy: 'Admin Office',
    assignedTo: 'Ahmed Technician',
    status: 'IN_PROGRESS',
    createdDate: addDays(new Date(), -3),
    dueDate: addDays(new Date(), 2),
    completedDate: null,
    estimatedCost: 15000,
    actualCost: null,
    description: 'AC unit not cooling properly, needs inspection and repair',
  },
  {
    id: 2,
    workOrderNo: 'WO-2025-002',
    title: 'Plumbing Leak - Washroom Block B',
    category: 'PLUMBING',
    priority: 'URGENT',
    location: 'Washroom Block B',
    requestedBy: 'Facilities Manager',
    assignedTo: 'Hassan Plumber',
    status: 'OPEN',
    createdDate: addDays(new Date(), -1),
    dueDate: addDays(new Date(), 1),
    completedDate: null,
    estimatedCost: 8000,
    actualCost: null,
    description: 'Water leaking from pipe in washroom, urgent repair needed',
  },
  {
    id: 3,
    workOrderNo: 'WO-2025-003',
    title: 'Electrical Wiring - Classroom 3',
    category: 'ELECTRICAL',
    priority: 'MEDIUM',
    location: 'Classroom 3',
    requestedBy: 'Academic Department',
    assignedTo: 'Tariq Electrician',
    status: 'COMPLETED',
    createdDate: addDays(new Date(), -10),
    dueDate: addDays(new Date(), -5),
    completedDate: addDays(new Date(), -6),
    estimatedCost: 12000,
    actualCost: 11500,
    description: 'Install additional power outlets for computers',
  },
  {
    id: 4,
    workOrderNo: 'WO-2025-004',
    title: 'Door Lock Replacement - Office 2',
    category: 'GENERAL',
    priority: 'LOW',
    location: 'Office 2',
    requestedBy: 'HR Department',
    assignedTo: 'Ali Carpenter',
    status: 'OPEN',
    createdDate: addDays(new Date(), -2),
    dueDate: addDays(new Date(), 5),
    completedDate: null,
    estimatedCost: 3000,
    actualCost: null,
    description: 'Door lock broken, needs replacement',
  },
  {
    id: 5,
    workOrderNo: 'WO-2025-005',
    title: 'Paint Job - Corridor A',
    category: 'GENERAL',
    priority: 'LOW',
    location: 'Corridor A',
    requestedBy: 'Maintenance Dept',
    assignedTo: 'Bilal Painter',
    status: 'SCHEDULED',
    createdDate: addDays(new Date(), 0),
    dueDate: addDays(new Date(), 10),
    completedDate: null,
    estimatedCost: 25000,
    actualCost: null,
    description: 'Repaint corridor walls',
  },
];

const categories = ['HVAC', 'PLUMBING', 'ELECTRICAL', 'GENERAL', 'CARPENTRY', 'PAINTING'];
const priorityLevels = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];
const statusTypes = ['OPEN', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const formatPKR = (amount: number) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);

export default function MaintenancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const totalWorkOrders = workOrders.length;
  const openWorkOrders = workOrders.filter(wo => wo.status === 'OPEN' || wo.status === 'SCHEDULED').length;
  const inProgressWorkOrders = workOrders.filter(wo => wo.status === 'IN_PROGRESS').length;
  const urgentWorkOrders = workOrders.filter(wo => wo.priority === 'URGENT' || wo.priority === 'HIGH').length;
  const overdueWorkOrders = workOrders.filter(wo => wo.status !== 'COMPLETED' && differenceInDays(new Date(), wo.dueDate) > 0).length;
  const totalEstimatedCost = workOrders.filter(wo => wo.status !== 'COMPLETED').reduce((sum, wo) => sum + wo.estimatedCost, 0);
  const completionRate = ((workOrders.filter(wo => wo.status === 'COMPLETED').length / totalWorkOrders) * 100).toFixed(0);

  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesSearch = wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.workOrderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || wo.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || wo.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Maintenance Management</h1>
        <p className="text-muted-foreground">Track and manage facility maintenance work orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Work Orders</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkOrders}</div>
            <p className="text-xs text-muted-foreground">{openWorkOrders} open</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{inProgressWorkOrders}</div>
            <p className="text-xs text-muted-foreground">Being worked on</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent/High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{urgentWorkOrders}</div>
            <p className="text-xs text-muted-foreground">{overdueWorkOrders} overdue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPKR(totalEstimatedCost)}</div>
            <p className="text-xs text-muted-foreground">Pending work</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completion Rate</CardTitle>
          <CardDescription>Overall maintenance work completion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completed vs Total</span>
              <span className="font-mono font-bold">{completionRate}%</span>
            </div>
            <Progress value={parseFloat(completionRate)} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {workOrders.filter(wo => wo.status === 'COMPLETED').length} of {totalWorkOrders} work orders completed
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search work orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full sm:w-64"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statusTypes.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="h-4 w-4 mr-2" />Create Work Order</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Work Order</DialogTitle>
              <DialogDescription>Submit a maintenance request</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Work Order Title</Label>
                <Input placeholder="Brief description of the issue" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityLevels.map(priority => (
                        <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Location</Label>
                  <Input placeholder="Building/Room/Area" />
                </div>
                <div className="grid gap-2">
                  <Label>Due Date</Label>
                  <Input type="date" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Assign To</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech1">Ahmed Technician</SelectItem>
                    <SelectItem value="tech2">Hassan Plumber</SelectItem>
                    <SelectItem value="tech3">Tariq Electrician</SelectItem>
                    <SelectItem value="tech4">Ali Carpenter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea placeholder="Detailed description of the maintenance issue" rows={4} />
              </div>
              <div className="grid gap-2">
                <Label>Estimated Cost (PKR)</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Create Work Order</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Work Orders</TabsTrigger>
          <TabsTrigger value="details">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Work Orders ({filteredWorkOrders.length})</CardTitle>
              <CardDescription>Maintenance tasks and requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>WO #</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Est. Cost</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWorkOrders.map((wo) => {
                      const daysUntilDue = differenceInDays(wo.dueDate, new Date());
                      const isOverdue = wo.status !== 'COMPLETED' && daysUntilDue < 0;
                      return (
                        <TableRow key={wo.id}>
                          <TableCell className="font-mono text-sm">{wo.workOrderNo}</TableCell>
                          <TableCell className="font-medium max-w-xs">{wo.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{wo.category}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{wo.location}</TableCell>
                          <TableCell className="text-sm">{wo.assignedTo}</TableCell>
                          <TableCell>
                            <Badge variant={
                              wo.priority === 'URGENT' ? 'destructive' :
                              wo.priority === 'HIGH' ? 'destructive' :
                              wo.priority === 'MEDIUM' ? 'secondary' :
                              'outline'
                            }>
                              {wo.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className={isOverdue ? 'text-red-600 font-bold' : ''}>
                            {format(wo.dueDate, 'MMM dd, yyyy')}
                            {isOverdue && <div className="text-xs">OVERDUE</div>}
                          </TableCell>
                          <TableCell className="text-right font-mono">{formatPKR(wo.estimatedCost)}</TableCell>
                          <TableCell>
                            <Badge variant={
                              wo.status === 'COMPLETED' ? 'default' :
                              wo.status === 'IN_PROGRESS' ? 'secondary' :
                              wo.status === 'CANCELLED' ? 'destructive' :
                              'outline'
                            }>
                              {wo.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="space-y-3">
            {filteredWorkOrders.map((wo) => {
              const daysUntilDue = differenceInDays(wo.dueDate, new Date());
              const isOverdue = wo.status !== 'COMPLETED' && daysUntilDue < 0;
              return (
                <Card key={wo.id} className={isOverdue ? 'border-red-300 bg-red-50' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{wo.title}</CardTitle>
                        <CardDescription className="font-mono">{wo.workOrderNo}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={
                          wo.priority === 'URGENT' ? 'destructive' :
                          wo.priority === 'HIGH' ? 'destructive' :
                          wo.priority === 'MEDIUM' ? 'secondary' :
                          'outline'
                        }>
                          {wo.priority}
                        </Badge>
                        <Badge variant={
                          wo.status === 'COMPLETED' ? 'default' :
                          wo.status === 'IN_PROGRESS' ? 'secondary' :
                          wo.status === 'CANCELLED' ? 'destructive' :
                          'outline'
                        }>
                          {wo.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{wo.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Category</div>
                        <div className="font-medium">{wo.category}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Location</div>
                        <div className="font-medium">{wo.location}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Assigned To</div>
                        <div className="font-medium">{wo.assignedTo}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Requested By</div>
                        <div className="font-medium">{wo.requestedBy}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-2 border-t">
                      <div>
                        <div className="text-muted-foreground">Created</div>
                        <div className="font-medium">{format(wo.createdDate, 'MMM dd, yyyy')}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Due Date</div>
                        <div className={`font-medium ${isOverdue ? 'text-red-600 font-bold' : ''}`}>
                          {format(wo.dueDate, 'MMM dd, yyyy')}
                          {isOverdue && ' (OVERDUE)'}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Estimated Cost</div>
                        <div className="font-mono font-bold">{formatPKR(wo.estimatedCost)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Actual Cost</div>
                        <div className="font-mono font-bold">
                          {wo.actualCost ? formatPKR(wo.actualCost) : 'Pending'}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Update Status</Button>
                      <Button variant="outline" size="sm">Add Note</Button>
                      {wo.status !== 'COMPLETED' && (
                        <Button size="sm" className="ml-auto">
                          <CheckCircle className="h-4 w-4 mr-2" />Mark Complete
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
