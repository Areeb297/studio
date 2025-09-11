'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  Home,
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  PlusCircle, 
  Search, 
  Users,
  Clock,
  MapPin,
  FileText,
  Settings,
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  Key,
  Percent
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
  Line,
  AreaChart,
  Area,
  ComposedChart,
  ReferenceLine
} from 'recharts';

// Rent & Properties Data Structure
interface Property {
  id: string;
  propertyCode: string;
  name: string;
  type: 'RESIDENTIAL' | 'COMMERCIAL' | 'RETAIL' | 'OFFICE' | 'WAREHOUSE' | 'PARKING';
  location: string;
  address: string;
  size: number; // Square feet
  totalUnits: number;
  occupiedUnits: number;
  availableUnits: number;
  monthlyRent: number;
  yearlyIncome: number;
  acquisitionDate: Date;
  acquisitionCost: number;
  currentValue: number;
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'NEEDS_REPAIR';
  status: 'ACTIVE' | 'UNDER_RENOVATION' | 'VACANT';
}

interface Tenant {
  id: string;
  tenantCode: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  leaseStartDate: Date;
  leaseEndDate: Date;
  monthlyRent: number;
  securityDeposit: number;
  status: 'ACTIVE' | 'NOTICE_GIVEN' | 'OVERDUE' | 'TERMINATED';
  rentDueDate: Date;
  lastPaymentDate?: Date;
  outstandingAmount: number;
}

interface RentPayment {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyName: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CHECK';
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';
  month: string;
  year: number;
}

// Sample data for Jamia Binoria properties
const properties: Property[] = [
  {
    id: 'PROP-001',
    propertyCode: 'JBA-RES-001',
    name: 'Faculty Housing Complex A',
    type: 'RESIDENTIAL',
    location: 'Main Campus',
    address: 'Block A, Jamia Binoria, Karachi',
    size: 25000,
    totalUnits: 20,
    occupiedUnits: 18,
    availableUnits: 2,
    monthlyRent: 45000,
    yearlyIncome: 810000,
    acquisitionDate: new Date('2020-01-15'),
    acquisitionCost: 15000000,
    currentValue: 18000000,
    condition: 'GOOD',
    status: 'ACTIVE'
  },
  {
    id: 'PROP-002',
    propertyCode: 'JBA-COM-001',
    name: 'Commercial Plaza',
    type: 'COMMERCIAL',
    location: 'Main Road',
    address: 'Main Road, Near Jamia Binoria, Karachi',
    size: 15000,
    totalUnits: 12,
    occupiedUnits: 10,
    availableUnits: 2,
    monthlyRent: 75000,
    yearlyIncome: 900000,
    acquisitionDate: new Date('2021-06-10'),
    acquisitionCost: 12000000,
    currentValue: 14500000,
    condition: 'EXCELLENT',
    status: 'ACTIVE'
  },
  {
    id: 'PROP-003',
    propertyCode: 'JBA-RET-001',
    name: 'Market Shops',
    type: 'RETAIL',
    location: 'University Avenue',
    address: 'University Avenue, Karachi',
    size: 8000,
    totalUnits: 8,
    occupiedUnits: 6,
    availableUnits: 2,
    monthlyRent: 35000,
    yearlyIncome: 252000,
    acquisitionDate: new Date('2019-03-20'),
    acquisitionCost: 8000000,
    currentValue: 9500000,
    condition: 'FAIR',
    status: 'ACTIVE'
  },
  {
    id: 'PROP-004',
    propertyCode: 'JBA-OFF-001',
    name: 'Administrative Offices',
    type: 'OFFICE',
    location: 'Business District',
    address: 'Business District, Karachi',
    size: 5000,
    totalUnits: 6,
    occupiedUnits: 5,
    availableUnits: 1,
    monthlyRent: 55000,
    yearlyIncome: 330000,
    acquisitionDate: new Date('2022-09-15'),
    acquisitionCost: 6500000,
    currentValue: 7200000,
    condition: 'EXCELLENT',
    status: 'ACTIVE'
  },
  {
    id: 'PROP-005',
    propertyCode: 'JBA-WAR-001',
    name: 'Storage Warehouse',
    type: 'WAREHOUSE',
    location: 'Industrial Area',
    address: 'Industrial Area, Karachi',
    size: 12000,
    totalUnits: 4,
    occupiedUnits: 3,
    availableUnits: 1,
    monthlyRent: 40000,
    yearlyIncome: 144000,
    acquisitionDate: new Date('2021-11-05'),
    acquisitionCost: 4500000,
    currentValue: 5200000,
    condition: 'GOOD',
    status: 'ACTIVE'
  }
];

const tenants: Tenant[] = [
  {
    id: 'TEN-001',
    tenantCode: 'T-001',
    name: 'Dr. Ahmed Hassan',
    contactPerson: 'Dr. Ahmed Hassan',
    phone: '+92-300-1234567',
    email: 'ahmed.hassan@email.com',
    propertyId: 'PROP-001',
    propertyName: 'Faculty Housing Complex A',
    unitNumber: 'A-101',
    leaseStartDate: new Date('2023-01-01'),
    leaseEndDate: new Date('2025-12-31'),
    monthlyRent: 45000,
    securityDeposit: 135000,
    status: 'ACTIVE',
    rentDueDate: new Date('2024-11-01'),
    lastPaymentDate: new Date('2024-10-28'),
    outstandingAmount: 0
  },
  {
    id: 'TEN-002',
    tenantCode: 'T-002',
    name: 'Karachi Electronics Store',
    contactPerson: 'Muhammad Ali',
    phone: '+92-300-2345678',
    email: 'ali@electronics.com',
    propertyId: 'PROP-002',
    propertyName: 'Commercial Plaza',
    unitNumber: 'CP-105',
    leaseStartDate: new Date('2022-06-01'),
    leaseEndDate: new Date('2025-05-31'),
    monthlyRent: 75000,
    securityDeposit: 225000,
    status: 'ACTIVE',
    rentDueDate: new Date('2024-11-01'),
    lastPaymentDate: new Date('2024-10-30'),
    outstandingAmount: 0
  },
  {
    id: 'TEN-003',
    tenantCode: 'T-003',
    name: 'Green Tea Cafe',
    contactPerson: 'Sara Ahmed',
    phone: '+92-300-3456789',
    email: 'sara@greentea.com',
    propertyId: 'PROP-003',
    propertyName: 'Market Shops',
    unitNumber: 'MS-03',
    leaseStartDate: new Date('2023-03-15'),
    leaseEndDate: new Date('2026-03-14'),
    monthlyRent: 35000,
    securityDeposit: 105000,
    status: 'OVERDUE',
    rentDueDate: new Date('2024-10-15'),
    lastPaymentDate: new Date('2024-09-12'),
    outstandingAmount: 70000
  },
  {
    id: 'TEN-004',
    tenantCode: 'T-004',
    name: 'Tech Solutions Office',
    contactPerson: 'Omar Khan',
    phone: '+92-300-4567890',
    email: 'omar@techsolutions.com',
    propertyId: 'PROP-004',
    propertyName: 'Administrative Offices',
    unitNumber: 'AO-302',
    leaseStartDate: new Date('2022-12-01'),
    leaseEndDate: new Date('2024-11-30'),
    monthlyRent: 55000,
    securityDeposit: 165000,
    status: 'NOTICE_GIVEN',
    rentDueDate: new Date('2024-11-01'),
    lastPaymentDate: new Date('2024-10-25'),
    outstandingAmount: 0
  }
];

const rentPayments: RentPayment[] = [
  {
    id: 'PAY-001',
    tenantId: 'TEN-001',
    tenantName: 'Dr. Ahmed Hassan',
    propertyName: 'Faculty Housing Complex A',
    amount: 45000,
    dueDate: new Date('2024-11-01'),
    paidDate: new Date('2024-10-28'),
    paymentMethod: 'BANK_TRANSFER',
    status: 'PAID',
    month: 'October',
    year: 2024
  },
  {
    id: 'PAY-002',
    tenantId: 'TEN-002',
    tenantName: 'Karachi Electronics Store',
    propertyName: 'Commercial Plaza',
    amount: 75000,
    dueDate: new Date('2024-11-01'),
    paidDate: new Date('2024-10-30'),
    paymentMethod: 'CHECK',
    status: 'PAID',
    month: 'October',
    year: 2024
  },
  {
    id: 'PAY-003',
    tenantId: 'TEN-003',
    tenantName: 'Green Tea Cafe',
    propertyName: 'Market Shops',
    amount: 35000,
    dueDate: new Date('2024-10-15'),
    paymentMethod: 'CASH',
    status: 'OVERDUE',
    month: 'October',
    year: 2024
  },
  {
    id: 'PAY-004',
    tenantId: 'TEN-004',
    tenantName: 'Tech Solutions Office',
    propertyName: 'Administrative Offices',
    amount: 55000,
    dueDate: new Date('2024-11-01'),
    status: 'PENDING',
    paymentMethod: 'BANK_TRANSFER',
    month: 'November',
    year: 2024
  }
];

// Chart data
const occupancyByType = [
  { name: 'Residential', occupied: 18, total: 20, occupancy: 90, color: '#14B8A6' },
  { name: 'Commercial', occupied: 10, total: 12, occupancy: 83, color: '#3B82F6' },
  { name: 'Retail', occupied: 6, total: 8, occupancy: 75, color: '#8B5CF6' },
  { name: 'Office', occupied: 5, total: 6, occupancy: 83, color: '#F59E0B' },
  { name: 'Warehouse', occupied: 3, total: 4, occupancy: 75, color: '#EF4444' }
];

const monthlyRevenueData = [
  { month: 'Jun', residential: 810000, commercial: 750000, retail: 210000, office: 275000, warehouse: 120000, total: 2165000 },
  { month: 'Jul', residential: 810000, commercial: 900000, retail: 245000, office: 330000, warehouse: 144000, total: 2429000 },
  { month: 'Aug', residential: 810000, commercial: 825000, retail: 252000, office: 330000, warehouse: 144000, total: 2361000 },
  { month: 'Sep', residential: 810000, commercial: 900000, rent: 210000, office: 330000, warehouse: 120000, total: 2370000 },
  { month: 'Oct', residential: 810000, commercial: 900000, retail: 252000, office: 275000, warehouse: 144000, total: 2381000 },
  { month: 'Nov', residential: 765000, commercial: 825000, retail: 217000, office: 275000, warehouse: 144000, total: 2226000 }
];

const propertyPerformance = [
  { name: 'Faculty Housing A', revenue: 810000, occupancy: 90, roi: 4.5 },
  { name: 'Commercial Plaza', revenue: 900000, occupancy: 83, roi: 6.2 },
  { name: 'Market Shops', revenue: 252000, occupancy: 75, roi: 2.8 },
  { name: 'Admin Offices', revenue: 330000, occupancy: 83, roi: 4.6 },
  { name: 'Storage Warehouse', revenue: 144000, occupancy: 75, roi: 2.9 }
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

export default function RentPropertiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Calculations
  const totalProperties = properties.length;
  const totalUnits = properties.reduce((sum, prop) => sum + prop.totalUnits, 0);
  const occupiedUnits = properties.reduce((sum, prop) => sum + prop.occupiedUnits, 0);
  const totalValue = properties.reduce((sum, prop) => sum + prop.currentValue, 0);
  const monthlyRevenue = properties.reduce((sum, prop) => sum + prop.yearlyIncome / 12, 0);
  const overdueTenants = tenants.filter(t => t.status === 'OVERDUE').length;
  const averageOccupancy = Math.round((occupiedUnits / totalUnits) * 100);
  const totalOutstanding = tenants.reduce((sum, tenant) => sum + tenant.outstandingAmount, 0);

  // Filter properties based on search term
  const filteredProperties = useMemo(() => {
    if (!searchTerm) return properties;
    return properties.filter(property => 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.propertyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getStatusBadgeVariant = (status: Property['status']) => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'UNDER_RENOVATION': return 'secondary';
      case 'VACANT': return 'outline';
      default: return 'secondary';
    }
  };

  const getTenantStatusBadgeVariant = (status: Tenant['status']) => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'NOTICE_GIVEN': return 'secondary';
      case 'OVERDUE': return 'destructive';
      case 'TERMINATED': return 'outline';
      default: return 'secondary';
    }
  };

  const getConditionBadgeVariant = (condition: Property['condition']) => {
    switch (condition) {
      case 'EXCELLENT': return 'default';
      case 'GOOD': return 'secondary';
      case 'FAIR': return 'outline';
      case 'NEEDS_REPAIR': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Rent & Properties Management</h1>
          <p className="text-muted-foreground mt-1">
            Property portfolio management across {totalProperties} properties with {totalUnits} units
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
      
      {/* KPI Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <KPICard
          title="Total Portfolio Value"
          value={`PKR ${(totalValue / 1000000).toFixed(1)}M`}
          icon={Building}
          trend={`${totalProperties} properties managed`}
        />
        
        <KPICard
          title="Occupancy Rate"
          value={`${averageOccupancy}%`}
          icon={Key}
          trend={`${occupiedUnits}/${totalUnits} units occupied`}
        />
        
        <KPICard
          title="Monthly Revenue"
          value={`PKR ${(monthlyRevenue / 1000).toFixed(0)}K`}
          icon={DollarSign}
          trend="Current month collection"
        />
        
        <KPICard
          title="Overdue Tenants"
          value={overdueTenants.toString()}
          icon={AlertTriangle}
          status={overdueTenants > 0 ? "critical" : "default"}
          trend={`PKR ${(totalOutstanding / 1000).toFixed(0)}K outstanding`}
        />
        
        <KPICard
          title="Available Units"
          value={(totalUnits - occupiedUnits).toString()}
          icon={Home}
          trend="Ready for new tenants"
        />

        <KPICard
          title="Average ROI"
          value="4.2%"
          icon={Percent}
          trend="Annual return on investment"
        />
      </div>

      {/* Tabs for Different Views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="payments">Rent Collection</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Occupancy by Property Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Occupancy by Property Type
                </CardTitle>
                <CardDescription>Current occupancy rates across different property categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={occupancyByType}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      formatter={(value: number, name: string) => {
                        if (name === 'occupancy') return [`${value}%`, 'Occupancy Rate'];
                        return [value, name];
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      align="right"
                      wrapperStyle={{ paddingBottom: '20px' }}
                    />
                    <Bar dataKey="occupancy" fill="#14B8A6" name="Occupancy %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Property Performance Donut */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Revenue Distribution
                </CardTitle>
                <CardDescription>Monthly revenue contribution by property type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={occupancyByType}
                      dataKey="occupied"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                    >
                      {occupancyByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value} units`, 'Occupied Units']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Revenue Trends & Performance Analysis
              </CardTitle>
              <CardDescription>Monthly revenue breakdown with performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart 
                  data={monthlyRevenueData}
                  margin={{ top: 40, right: 40, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis 
                    fontSize={12} 
                    tickFormatter={(value) => `PKR ${(value/1000).toFixed(0)}K`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`PKR ${value.toLocaleString()}`, '']}
                    labelStyle={{ color: '#1E293B', fontWeight: '600' }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    wrapperStyle={{ paddingBottom: '30px' }}
                  />
                  
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    fill="url(#totalGradient)"
                    stroke="#14B8A6"
                    strokeWidth={2}
                    name="Total Revenue"
                  />
                  
                  <Bar dataKey="residential" fill="#3B82F6" name="Residential" />
                  <Bar dataKey="commercial" fill="#10B981" name="Commercial" />
                  <Bar dataKey="retail" fill="#8B5CF6" name="Retail" />
                  <Bar dataKey="office" fill="#F59E0B" name="Office" />
                  <Bar dataKey="warehouse" fill="#EF4444" name="Warehouse" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties" className="space-y-6">
          {/* Property Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Property Performance Metrics
              </CardTitle>
              <CardDescription>Revenue and ROI analysis by individual property</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={propertyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-30}
                    textAnchor="end"
                    height={80}
                    fontSize={10}
                  />
                  <YAxis 
                    yAxisId="revenue"
                    orientation="left"
                    tickFormatter={(value) => `PKR ${(value/1000).toFixed(0)}K`}
                    fontSize={10}
                  />
                  <YAxis 
                    yAxisId="roi"
                    orientation="right"
                    tickFormatter={(value) => `${value}%`}
                    fontSize={10}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      if (name === 'roi') return [`${value}%`, 'ROI'];
                      return [`PKR ${value.toLocaleString()}`, 'Revenue'];
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    wrapperStyle={{ paddingBottom: '20px' }}
                  />
                  <Bar yAxisId="revenue" dataKey="revenue" fill="#14B8A6" name="Monthly Revenue" />
                  <Line 
                    yAxisId="roi"
                    type="monotone" 
                    dataKey="roi" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    name="ROI %"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-6">
          {/* Tenant Status Overview */}
          <div className="grid lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{tenants.filter(t => t.status === 'ACTIVE').length}</p>
                    <p className="text-sm text-muted-foreground">Active Tenants</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-red-600">{tenants.filter(t => t.status === 'OVERDUE').length}</p>
                    <p className="text-sm text-muted-foreground">Overdue Tenants</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-amber-600">{tenants.filter(t => t.status === 'NOTICE_GIVEN').length}</p>
                    <p className="text-sm text-muted-foreground">Notice Given</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-amber-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary">PKR {(totalOutstanding / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-muted-foreground">Outstanding Amount</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          {/* Payment Collection Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Rent Collection Overview
              </CardTitle>
              <CardDescription>Monthly collection status and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">PKR {rentPayments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Collected This Month</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <p className="text-2xl font-bold text-amber-600">PKR {rentPayments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Pending Collection</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">PKR {rentPayments.filter(p => p.status === 'OVERDUE').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Overdue Amount</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator className="my-6" />

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Property Portfolio
              </CardTitle>
              <CardDescription>
                Complete overview of {filteredProperties.length} properties in portfolio
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <PlusCircle className="mr-2 w-4 h-4"/>
                    Record Payment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Record Rent Payment</DialogTitle>
                    <DialogDescription>
                      Enter rent payment details for tenant
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="tenant">Tenant</Label>
                      <Input id="tenant" placeholder="Select tenant"/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (PKR)</Label>
                      <Input id="amount" type="number" placeholder="e.g., 45000"/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment-date">Payment Date</Label>
                      <Input id="payment-date" type="date"/>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="submit">Record Payment</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button>
                <PlusCircle className="mr-2 w-4 h-4"/>
                Add Property
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search properties by name, code, type, or location..." 
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
                <TableHead className="w-[200px]">Property Details</TableHead>
                <TableHead>Type & Location</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead className="text-right">Monthly Revenue</TableHead>
                <TableHead className="text-right">Property Value</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{property.name}</div>
                      <div className="text-sm text-muted-foreground">{property.propertyCode}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge variant="outline" className="mb-1">{property.type}</Badge>
                      <div className="text-sm text-muted-foreground">{property.location}</div>
                      <div className="text-xs text-muted-foreground">{property.size.toLocaleString()} sq ft</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">Total: {property.totalUnits}</div>
                      <div className="text-green-600">Occupied: {property.occupiedUnits}</div>
                      <div className="text-amber-600">Available: {property.availableUnits}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {Math.round((property.occupiedUnits / property.totalUnits) * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">occupancy</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">PKR {(property.yearlyIncome / 12).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      Annual: PKR {property.yearlyIncome.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">PKR {(property.currentValue / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-muted-foreground">
                      ROI: {((property.yearlyIncome / property.currentValue) * 100).toFixed(1)}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getConditionBadgeVariant(property.condition)}>
                      {property.condition}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusBadgeVariant(property.status)}>
                      {property.status}
                    </Badge>
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