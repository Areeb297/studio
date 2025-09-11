'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  PlusCircle, 
  Search, 
  Wrench,
  Clock,
  CheckCircle,
  TrendingUp,
  Shield,
  FileText,
  Settings,
  Download,
  Zap,
  Calendar,
  MapPin
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
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

// Facilities Management Data Structure
interface Asset {
  id: string;
  code: string;
  name: string;
  category: 'HVAC' | 'ELECTRICAL' | 'PLUMBING' | 'SECURITY' | 'IT_EQUIPMENT' | 'FURNITURE' | 'VEHICLES';
  location: string;
  building: string;
  floor: string;
  room: string;
  purchaseDate: Date;
  purchaseValue: number;
  currentValue: number;
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'NEEDS_REPAIR';
  lastMaintenanceDate: Date;
  nextMaintenanceDate: Date;
  maintenanceFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  vendor: string;
  warrantyExpiry?: Date;
  status: 'ACTIVE' | 'UNDER_MAINTENANCE' | 'OUT_OF_SERVICE' | 'RETIRED';
}

interface WorkOrder {
  id: string;
  title: string;
  description: string;
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'INSPECTION';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assetId: string;
  assetName: string;
  assignedTo: string;
  requestedBy: string;
  createdAt: Date;
  scheduledDate: Date;
  completedAt?: Date;
  estimatedCost: number;
  actualCost?: number;
  location: string;
}

// Sample data based on Jamia Binoria facilities
const assets: Asset[] = [
  {
    id: 'AST-001',
    code: 'HVAC-001',
    name: 'Central AC Unit - Main Hall',
    category: 'HVAC',
    location: 'Main Campus',
    building: 'Academic Block A',
    floor: '1st Floor',
    room: 'Main Hall',
    purchaseDate: new Date('2022-03-15'),
    purchaseValue: 450000,
    currentValue: 380000,
    condition: 'GOOD',
    lastMaintenanceDate: new Date('2024-08-15'),
    nextMaintenanceDate: new Date('2024-11-15'),
    maintenanceFrequency: 'QUARTERLY',
    vendor: 'Cool Air Solutions',
    warrantyExpiry: new Date('2025-03-15'),
    status: 'ACTIVE'
  },
  {
    id: 'AST-002',
    code: 'ELEC-001',
    name: 'Main Electrical Panel',
    category: 'ELECTRICAL',
    location: 'Main Campus',
    building: 'Academic Block A',
    floor: 'Ground Floor',
    room: 'Electrical Room',
    purchaseDate: new Date('2021-06-10'),
    purchaseValue: 180000,
    currentValue: 135000,
    condition: 'EXCELLENT',
    lastMaintenanceDate: new Date('2024-09-01'),
    nextMaintenanceDate: new Date('2024-12-01'),
    maintenanceFrequency: 'QUARTERLY',
    vendor: 'Power Tech Services',
    warrantyExpiry: new Date('2026-06-10'),
    status: 'ACTIVE'
  },
  {
    id: 'AST-003',
    code: 'PLUMB-001',
    name: 'Main Water Pump System',
    category: 'PLUMBING',
    location: 'Main Campus',
    building: 'Utility Block',
    floor: 'Ground Floor',
    room: 'Pump Room',
    purchaseDate: new Date('2023-01-20'),
    purchaseValue: 85000,
    currentValue: 70000,
    condition: 'GOOD',
    lastMaintenanceDate: new Date('2024-08-20'),
    nextMaintenanceDate: new Date('2024-11-20'),
    maintenanceFrequency: 'MONTHLY',
    vendor: 'Aqua Tech Solutions',
    status: 'ACTIVE'
  },
  {
    id: 'AST-004',
    code: 'SEC-001',
    name: 'CCTV Camera System - Main Gate',
    category: 'SECURITY',
    location: 'Main Campus',
    building: 'Security Post',
    floor: 'Ground Floor',
    room: 'Main Gate',
    purchaseDate: new Date('2022-11-05'),
    purchaseValue: 65000,
    currentValue: 48000,
    condition: 'GOOD',
    lastMaintenanceDate: new Date('2024-09-05'),
    nextMaintenanceDate: new Date('2024-12-05'),
    maintenanceFrequency: 'QUARTERLY',
    vendor: 'Security Systems Ltd',
    warrantyExpiry: new Date('2025-11-05'),
    status: 'ACTIVE'
  },
  {
    id: 'AST-005',
    code: 'IT-001',
    name: 'Network Server Rack',
    category: 'IT_EQUIPMENT',
    location: 'Main Campus',
    building: 'Admin Block',
    floor: '2nd Floor',
    room: 'IT Room',
    purchaseDate: new Date('2023-05-15'),
    purchaseValue: 320000,
    currentValue: 280000,
    condition: 'EXCELLENT',
    lastMaintenanceDate: new Date('2024-09-10'),
    nextMaintenanceDate: new Date('2024-10-10'),
    maintenanceFrequency: 'MONTHLY',
    vendor: 'Tech Solutions Pro',
    warrantyExpiry: new Date('2026-05-15'),
    status: 'ACTIVE'
  },
  {
    id: 'AST-006',
    code: 'HVAC-002',
    name: 'Library AC System',
    category: 'HVAC',
    location: 'Main Campus',
    building: 'Library Block',
    floor: '1st Floor',
    room: 'Reading Hall',
    purchaseDate: new Date('2021-09-12'),
    purchaseValue: 280000,
    currentValue: 210000,
    condition: 'FAIR',
    lastMaintenanceDate: new Date('2024-07-12'),
    nextMaintenanceDate: new Date('2024-10-12'),
    maintenanceFrequency: 'QUARTERLY',
    vendor: 'Cool Air Solutions',
    warrantyExpiry: new Date('2024-09-12'),
    status: 'UNDER_MAINTENANCE'
  }
];

const workOrders: WorkOrder[] = [
  {
    id: 'WO-001',
    title: 'Quarterly AC Maintenance - Main Hall',
    description: 'Routine maintenance for central AC unit including filter replacement and coil cleaning',
    type: 'PREVENTIVE',
    priority: 'MEDIUM',
    status: 'OPEN',
    assetId: 'AST-001',
    assetName: 'Central AC Unit - Main Hall',
    assignedTo: 'Ahmed Hassan',
    requestedBy: 'Facilities Manager',
    createdAt: new Date('2024-10-01'),
    scheduledDate: new Date('2024-11-15'),
    estimatedCost: 8500,
    location: 'Academic Block A'
  },
  {
    id: 'WO-002',
    title: 'Emergency Plumbing Repair',
    description: 'Water leak in washroom area needs immediate attention',
    type: 'EMERGENCY',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    assetId: 'AST-003',
    assetName: 'Main Water Pump System',
    assignedTo: 'Muhammad Ali',
    requestedBy: 'Security Guard',
    createdAt: new Date('2024-10-05'),
    scheduledDate: new Date('2024-10-05'),
    estimatedCost: 15000,
    location: 'Utility Block'
  },
  {
    id: 'WO-003',
    title: 'CCTV Camera Lens Cleaning',
    description: 'Monthly cleaning and inspection of CCTV cameras',
    type: 'PREVENTIVE',
    priority: 'LOW',
    status: 'COMPLETED',
    assetId: 'AST-004',
    assetName: 'CCTV Camera System - Main Gate',
    assignedTo: 'Security Team',
    requestedBy: 'Head of Security',
    createdAt: new Date('2024-09-25'),
    scheduledDate: new Date('2024-10-01'),
    completedAt: new Date('2024-10-02'),
    estimatedCost: 2000,
    actualCost: 1800,
    location: 'Security Post'
  },
  {
    id: 'WO-004',
    title: 'Server Room Temperature Check',
    description: 'Monthly temperature and humidity monitoring for server room',
    type: 'INSPECTION',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    assetId: 'AST-005',
    assetName: 'Network Server Rack',
    assignedTo: 'IT Support',
    requestedBy: 'IT Manager',
    createdAt: new Date('2024-09-28'),
    scheduledDate: new Date('2024-10-03'),
    completedAt: new Date('2024-10-03'),
    estimatedCost: 1500,
    actualCost: 1200,
    location: 'Admin Block'
  }
];

// Chart data
const assetsByCategory = [
  { name: 'HVAC Systems', value: 2, color: '#3B82F6' },
  { name: 'Electrical', value: 1, color: '#F59E0B' },
  { name: 'Plumbing', value: 1, color: '#10B981' },
  { name: 'Security', value: 1, color: '#EF4444' },
  { name: 'IT Equipment', value: 1, color: '#8B5CF6' }
];

const maintenanceSchedule = [
  { month: 'Oct', scheduled: 5, completed: 3, pending: 2 },
  { month: 'Nov', scheduled: 7, completed: 0, pending: 7 },
  { month: 'Dec', scheduled: 4, completed: 0, pending: 4 },
  { month: 'Jan', scheduled: 6, completed: 0, pending: 6 },
  { month: 'Feb', scheduled: 3, completed: 0, pending: 3 }
];

const costAnalysis = [
  { category: 'HVAC', planned: 25000, actual: 22000 },
  { category: 'Electrical', planned: 15000, actual: 18000 },
  { category: 'Plumbing', planned: 12000, actual: 16000 },
  { category: 'Security', planned: 8000, actual: 6500 },
  { category: 'IT Equipment', planned: 20000, actual: 15000 }
];

// Custom KPI Card Component
const KPICard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  status = "default",
  className = "" 
}: {
  title: string;
  value: string;
  icon: any;
  trend?: string;
  status?: "default" | "warning" | "critical";
  className?: string;
}) => {
  const statusClasses = {
    default: "",
    warning: "bg-amber-50 border-amber-200",
    critical: "bg-red-50 border-red-200"
  };

  const iconColors = {
    default: "text-muted-foreground",
    warning: "text-amber-600",
    critical: "text-red-600"
  };

  return (
    <Card className={`${statusClasses[status]} ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`w-4 h-4 ${iconColors[status]}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${status === 'critical' ? 'text-red-600' : status === 'warning' ? 'text-amber-600' : ''}`}>
          {value}
        </div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">{trend}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default function FacilitiesManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculations
  const totalAssets = assets.length;
  const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const underMaintenance = assets.filter(a => a.status === 'UNDER_MAINTENANCE').length;
  const criticalWorkOrders = workOrders.filter(wo => wo.priority === 'CRITICAL' && wo.status !== 'COMPLETED').length;
  const upcomingMaintenance = assets.filter(a => {
    const nextDate = new Date(a.nextMaintenanceDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return nextDate <= thirtyDaysFromNow;
  }).length;

  // Filter assets based on search term
  const filteredAssets = useMemo(() => {
    if (!searchTerm) return assets;
    return assets.filter(asset => 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getConditionBadgeVariant = (condition: Asset['condition']) => {
    switch (condition) {
      case 'EXCELLENT': return 'default';
      case 'GOOD': return 'secondary';
      case 'FAIR': return 'outline';
      case 'POOR': return 'destructive';
      case 'NEEDS_REPAIR': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusBadgeVariant = (status: Asset['status']) => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'UNDER_MAINTENANCE': return 'secondary';
      case 'OUT_OF_SERVICE': return 'destructive';
      case 'RETIRED': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Facilities Management</h1>
          <p className="text-muted-foreground mt-1">
            Asset tracking, maintenance scheduling, and work order management across {totalAssets} assets
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
      
      {/* KPI Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Total Assets Value"
          value={`PKR ${(totalValue / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          trend={`${totalAssets} total assets tracked`}
        />
        
        <KPICard
          title="Under Maintenance"
          value={underMaintenance.toString()}
          icon={Wrench}
          status={underMaintenance > 0 ? "warning" : "default"}
          trend="Assets currently being serviced"
        />
        
        <KPICard
          title="Critical Work Orders"
          value={criticalWorkOrders.toString()}
          icon={AlertTriangle}
          status={criticalWorkOrders > 0 ? "critical" : "default"}
          trend="High priority repairs needed"
        />
        
        <KPICard
          title="Upcoming Maintenance"
          value={upcomingMaintenance.toString()}
          icon={Calendar}
          status={upcomingMaintenance > 0 ? "warning" : "default"}
          trend="Due within 30 days"
        />
        
        <KPICard
          title="Work Orders Completed"
          value={workOrders.filter(wo => wo.status === 'COMPLETED').length.toString()}
          icon={CheckCircle}
          trend="This month"
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Assets by Category Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Assets by Category
            </CardTitle>
            <CardDescription>Distribution of assets across different categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetsByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {assetsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} assets`, 'Count']}
                />
                <Legend 
                  formatter={(value) => (
                    <span className="text-sm">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Maintenance Schedule Line Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Maintenance Schedule Overview
            </CardTitle>
            <CardDescription>Planned vs completed maintenance activities</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={maintenanceSchedule}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value: number, name: string) => [value, name === 'scheduled' ? 'Scheduled' : name === 'completed' ? 'Completed' : 'Pending']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="scheduled" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Scheduled"
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Completed"
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pending" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Pending"
                  dot={{ r: 4 }}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cost Analysis Chart */}
      <div className="grid lg:grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Maintenance Cost Analysis
            </CardTitle>
            <CardDescription>Planned vs actual maintenance costs by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" fontSize={12} />
                <YAxis 
                  formatter={(value: number) => `PKR ${(value/1000).toFixed(0)}K`}
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value: number) => [`PKR ${value.toLocaleString()}`, value === undefined ? '' : '']}
                />
                <Legend />
                <Bar dataKey="planned" fill="#3B82F6" name="Planned Cost" radius={[2, 2, 0, 0]} />
                <Bar dataKey="actual" fill="#10B981" name="Actual Cost" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Assets Table */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Asset Inventory
                </CardTitle>
                <CardDescription>
                  Complete overview of {filteredAssets.length} facilities assets
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <PlusCircle className="mr-2 w-4 h-4"/>
                      New Work Order
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Work Order</DialogTitle>
                      <DialogDescription>
                        Create a new maintenance or repair work order
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="wo-title">Work Order Title</Label>
                        <Input id="wo-title" placeholder="e.g., AC Filter Replacement"/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wo-asset">Asset</Label>
                        <Input id="wo-asset" placeholder="Select asset"/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wo-priority">Priority</Label>
                        <Input id="wo-priority" placeholder="High/Medium/Low"/>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="submit">Create Work Order</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button>
                  <PlusCircle className="mr-2 w-4 h-4"/>
                  Add Asset
                </Button>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative mt-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search assets by name, code, category, or location..." 
                className="pl-8 w-full" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Asset Details</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Next Maintenance</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-sm text-muted-foreground">{asset.code}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{asset.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{asset.building}</div>
                        <div className="text-muted-foreground">{asset.floor}, {asset.room}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">PKR {asset.currentValue.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        Original: PKR {asset.purchaseValue.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getConditionBadgeVariant(asset.condition)}>
                        {asset.condition}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{asset.nextMaintenanceDate.toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">{asset.maintenanceFrequency}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusBadgeVariant(asset.status)}>
                        {asset.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Recent Work Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Recent Work Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {workOrders.slice(0, 4).map((wo) => (
                <div key={wo.id} className="flex items-center gap-3 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    wo.status === 'COMPLETED' ? 'bg-green-500' : 
                    wo.status === 'IN_PROGRESS' ? 'bg-blue-500' : 
                    wo.priority === 'CRITICAL' ? 'bg-red-500' : 'bg-amber-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium">{wo.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {wo.assetName} • {wo.status}
                    </p>
                  </div>
                  <Badge 
                    variant={wo.priority === 'CRITICAL' ? 'destructive' : wo.priority === 'HIGH' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {wo.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Maintenance Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Maintenance Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <div className="flex-1">
                  <p className="font-medium">Library AC System</p>
                  <p className="text-muted-foreground text-xs">Overdue maintenance - 5 days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-amber-500" />
                <div className="flex-1">
                  <p className="font-medium">Main Water Pump</p>
                  <p className="text-muted-foreground text-xs">Maintenance due in 15 days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Zap className="w-4 h-4 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium">Server Room AC</p>
                  <p className="text-muted-foreground text-xs">Temperature monitoring required</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Service Vendors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex-1">
                  <p className="font-medium">Cool Air Solutions</p>
                  <p className="text-muted-foreground text-xs">HVAC Services • 8 jobs</p>
                </div>
                <div className="text-right">
                  <Badge variant="default">⭐ 4.8/5</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex-1">
                  <p className="font-medium">Power Tech Services</p>
                  <p className="text-muted-foreground text-xs">Electrical • 5 jobs</p>
                </div>
                <div className="text-right">
                  <Badge variant="default">⭐ 4.6/5</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex-1">
                  <p className="font-medium">Aqua Tech Solutions</p>
                  <p className="text-muted-foreground text-xs">Plumbing • 3 jobs</p>
                </div>
                <div className="text-right">
                  <Badge variant="default">⭐ 4.9/5</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}