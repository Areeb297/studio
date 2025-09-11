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
  Zap, 
  Flame,
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  PlusCircle, 
  Search, 
  BarChart3,
  Clock,
  MapPin,
  FileText,
  Settings,
  Download,
  Activity,
  Gauge,
  Calendar,
  Building2
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
  Area
} from 'recharts';

// Utilities Management Data Structure
interface UtilityMeter {
  id: string;
  meterNumber: string;
  type: 'ELECTRICITY' | 'GAS';
  location: string;
  building: string;
  department: string;
  installationDate: Date;
  lastReadingDate: Date;
  currentReading: number;
  previousReading: number;
  consumption: number;
  rate: number;
  amount: number;
  status: 'ACTIVE' | 'FAULTY' | 'DISCONNECTED';
  tariffType: 'DOMESTIC' | 'COMMERCIAL' | 'INDUSTRIAL';
  connectionLoad: number; // KW or BTU
}

interface UtilityBill {
  id: string;
  meterId: string;
  meterNumber: string;
  type: 'ELECTRICITY' | 'GAS';
  billMonth: string;
  billYear: number;
  unitsConsumed: number;
  rate: number;
  baseAmount: number;
  taxes: number;
  surcharges: number;
  totalAmount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIAL';
  department: string;
  location: string;
}

interface EnergyEfficiency {
  department: string;
  building: string;
  electricityUsage: number;
  gasUsage: number;
  targetUsage: number;
  efficiency: number;
  savings: number;
  month: string;
}

// Sample data based on Jamia Binoria campus
const electricityMeters: UtilityMeter[] = [
  {
    id: 'ELE-001',
    meterNumber: 'K-ELECTRIC-2024-001',
    type: 'ELECTRICITY',
    location: 'Main Campus',
    building: 'Academic Block A',
    department: 'Administration',
    installationDate: new Date('2022-01-15'),
    lastReadingDate: new Date('2024-10-01'),
    currentReading: 125680,
    previousReading: 124250,
    consumption: 1430,
    rate: 22.5,
    amount: 32175,
    status: 'ACTIVE',
    tariffType: 'COMMERCIAL',
    connectionLoad: 50
  },
  {
    id: 'ELE-002',
    meterNumber: 'K-ELECTRIC-2024-002',
    type: 'ELECTRICITY',
    location: 'Main Campus',
    building: 'Library Block',
    department: 'Academic Affairs',
    installationDate: new Date('2022-03-20'),
    lastReadingDate: new Date('2024-10-01'),
    currentReading: 98420,
    previousReading: 97180,
    consumption: 1240,
    rate: 22.5,
    amount: 27900,
    status: 'ACTIVE',
    tariffType: 'COMMERCIAL',
    connectionLoad: 35
  },
  {
    id: 'ELE-003',
    meterNumber: 'K-ELECTRIC-2024-003',
    type: 'ELECTRICITY',
    location: 'Main Campus',
    building: 'Restaurant Block',
    department: 'Restaurant Operations',
    installationDate: new Date('2021-11-10'),
    lastReadingDate: new Date('2024-10-01'),
    currentReading: 156890,
    previousReading: 154750,
    consumption: 2140,
    rate: 24.8,
    amount: 53072,
    status: 'ACTIVE',
    tariffType: 'COMMERCIAL',
    connectionLoad: 75
  },
  {
    id: 'ELE-004',
    meterNumber: 'K-ELECTRIC-2024-004',
    type: 'ELECTRICITY',
    location: 'Main Campus',
    building: 'Residential Block',
    department: 'Student Housing',
    installationDate: new Date('2023-02-05'),
    lastReadingDate: new Date('2024-10-01'),
    currentReading: 67340,
    previousReading: 66120,
    consumption: 1220,
    rate: 20.2,
    amount: 24644,
    status: 'ACTIVE',
    tariffType: 'DOMESTIC',
    connectionLoad: 40
  }
];

const gasMeters: UtilityMeter[] = [
  {
    id: 'GAS-001',
    meterNumber: 'SSGC-2024-001',
    type: 'GAS',
    location: 'Main Campus',
    building: 'Kitchen Block',
    department: 'Restaurant Operations',
    installationDate: new Date('2022-05-15'),
    lastReadingDate: new Date('2024-10-01'),
    currentReading: 45620,
    previousReading: 44180,
    consumption: 1440,
    rate: 2.85,
    amount: 4104,
    status: 'ACTIVE',
    tariffType: 'COMMERCIAL',
    connectionLoad: 25
  },
  {
    id: 'GAS-002',
    meterNumber: 'SSGC-2024-002',
    type: 'GAS',
    location: 'Main Campus',
    building: 'Residential Block',
    department: 'Student Housing',
    installationDate: new Date('2023-01-20'),
    lastReadingDate: new Date('2024-10-01'),
    currentReading: 28750,
    previousReading: 27920,
    consumption: 830,
    rate: 2.65,
    amount: 2199.5,
    status: 'ACTIVE',
    tariffType: 'DOMESTIC',
    connectionLoad: 15
  }
];

const allMeters = [...electricityMeters, ...gasMeters];

const utilityBills: UtilityBill[] = [
  {
    id: 'BILL-001',
    meterId: 'ELE-001',
    meterNumber: 'K-ELECTRIC-2024-001',
    type: 'ELECTRICITY',
    billMonth: 'September',
    billYear: 2024,
    unitsConsumed: 1430,
    rate: 22.5,
    baseAmount: 32175,
    taxes: 5148,
    surcharges: 1608,
    totalAmount: 38931,
    dueDate: new Date('2024-10-15'),
    paidDate: new Date('2024-10-12'),
    status: 'PAID',
    department: 'Administration',
    location: 'Academic Block A'
  },
  {
    id: 'BILL-002',
    meterId: 'ELE-002',
    meterNumber: 'K-ELECTRIC-2024-002',
    type: 'ELECTRICITY',
    billMonth: 'September',
    billYear: 2024,
    unitsConsumed: 1240,
    rate: 22.5,
    baseAmount: 27900,
    taxes: 4464,
    surcharges: 1395,
    totalAmount: 33759,
    dueDate: new Date('2024-10-15'),
    status: 'PENDING',
    department: 'Academic Affairs',
    location: 'Library Block'
  },
  {
    id: 'BILL-003',
    meterId: 'GAS-001',
    meterNumber: 'SSGC-2024-001',
    type: 'GAS',
    billMonth: 'September',
    billYear: 2024,
    unitsConsumed: 1440,
    rate: 2.85,
    baseAmount: 4104,
    taxes: 328,
    surcharges: 205,
    totalAmount: 4637,
    dueDate: new Date('2024-10-20'),
    paidDate: new Date('2024-10-18'),
    status: 'PAID',
    department: 'Restaurant Operations',
    location: 'Kitchen Block'
  },
  {
    id: 'BILL-004',
    meterId: 'ELE-003',
    meterNumber: 'K-ELECTRIC-2024-003',
    type: 'ELECTRICITY',
    billMonth: 'September',
    billYear: 2024,
    unitsConsumed: 2140,
    rate: 24.8,
    baseAmount: 53072,
    taxes: 8491,
    surcharges: 2654,
    totalAmount: 64217,
    dueDate: new Date('2024-10-18'),
    status: 'OVERDUE',
    department: 'Restaurant Operations',
    location: 'Restaurant Block'
  }
];

// Chart data
const consumptionByDepartment = [
  { name: 'Restaurant', electricity: 2140, gas: 1440, color: '#3B82F6' },
  { name: 'Administration', electricity: 1430, gas: 0, color: '#10B981' },
  { name: 'Academic', electricity: 1240, gas: 0, color: '#F59E0B' },
  { name: 'Housing', electricity: 1220, gas: 830, color: '#EF4444' }
];

const monthlyConsumption = [
  { month: 'Jun', electricity: 18500, gas: 6200 },
  { month: 'Jul', electricity: 22100, gas: 7800 },
  { month: 'Aug', electricity: 24800, gas: 8400 },
  { month: 'Sep', electricity: 23200, gas: 7900 },
  { month: 'Oct', electricity: 19800, gas: 6500 }
];

const costAnalysis = [
  { month: 'Jun', electricityCost: 425000, gasCost: 18500, total: 443500 },
  { month: 'Jul', electricityCost: 508000, gasCost: 23200, total: 531200 },
  { month: 'Aug', electricityCost: 570000, gasCost: 25000, total: 595000 },
  { month: 'Sep', electricityCost: 533000, gasCost: 23500, total: 556500 },
  { month: 'Oct', electricityCost: 455000, gasCost: 19400, total: 474400 }
];

const peakUsageData = [
  { time: '6 AM', usage: 45 },
  { time: '9 AM', usage: 78 },
  { time: '12 PM', usage: 95 },
  { time: '3 PM', usage: 88 },
  { time: '6 PM', usage: 102 },
  { time: '9 PM', usage: 76 },
  { time: '12 AM', usage: 32 }
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

export default function UtilitiesManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Calculations
  const totalElectricityConsumption = electricityMeters.reduce((sum, meter) => sum + meter.consumption, 0);
  const totalGasConsumption = gasMeters.reduce((sum, meter) => sum + meter.consumption, 0);
  const totalElectricityCost = utilityBills.filter(b => b.type === 'ELECTRICITY').reduce((sum, bill) => sum + bill.totalAmount, 0);
  const totalGasCost = utilityBills.filter(b => b.type === 'GAS').reduce((sum, bill) => sum + bill.totalAmount, 0);
  const overdueBills = utilityBills.filter(b => b.status === 'OVERDUE').length;

  // Filter meters based on search term
  const filteredMeters = useMemo(() => {
    if (!searchTerm) return allMeters;
    return allMeters.filter(meter => 
      meter.meterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meter.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meter.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meter.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getStatusBadgeVariant = (status: UtilityMeter['status']) => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'FAULTY': return 'destructive';
      case 'DISCONNECTED': return 'secondary';
      default: return 'secondary';
    }
  };

  const getBillStatusBadgeVariant = (status: UtilityBill['status']) => {
    switch (status) {
      case 'PAID': return 'default';
      case 'PENDING': return 'secondary';
      case 'OVERDUE': return 'destructive';
      case 'PARTIAL': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Utilities Management</h1>
          <p className="text-muted-foreground mt-1">
            Electric and gas monitoring across {allMeters.length} meters and {new Set(allMeters.map(m => m.building)).size} buildings
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Total Electricity Usage"
          value={`${totalElectricityConsumption.toLocaleString()} kWh`}
          icon={Zap}
          trend="Current month consumption"
        />
        
        <KPICard
          title="Total Gas Usage"
          value={`${totalGasConsumption.toLocaleString()} m³`}
          icon={Flame}
          trend="Current month consumption"
        />
        
        <KPICard
          title="Electricity Cost"
          value={`PKR ${(totalElectricityCost / 1000).toFixed(0)}K`}
          icon={DollarSign}
          trend="Current month bills"
        />
        
        <KPICard
          title="Gas Cost"
          value={`PKR ${(totalGasCost / 1000).toFixed(0)}K`}
          icon={DollarSign}
          trend="Current month bills"
        />
        
        <KPICard
          title="Overdue Bills"
          value={overdueBills.toString()}
          icon={AlertTriangle}
          status={overdueBills > 0 ? "critical" : "default"}
          trend="Requiring immediate payment"
        />
      </div>

      {/* Tabs for Different Views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="electricity">Electricity</TabsTrigger>
          <TabsTrigger value="gas">Gas</TabsTrigger>
          <TabsTrigger value="bills">Bills & Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Department-wise Consumption */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Department-wise Consumption
                </CardTitle>
                <CardDescription>Electricity and gas usage by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={consumptionByDepartment}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `${value} ${name === 'electricity' ? 'kWh' : 'm³'}`,
                        name === 'electricity' ? 'Electricity' : 'Gas'
                      ]}
                    />
                    <Legend 
                      verticalAlign="top" 
                      align="right"
                      wrapperStyle={{ paddingBottom: '20px' }}
                    />
                    <Bar dataKey="electricity" fill="#3B82F6" name="Electricity (kWh)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="gas" fill="#F59E0B" name="Gas (m³)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Monthly Consumption Trends
                </CardTitle>
                <CardDescription>5-month consumption pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyConsumption}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `${value.toLocaleString()} ${name === 'electricity' ? 'kWh' : 'm³'}`,
                        name === 'electricity' ? 'Electricity' : 'Gas'
                      ]}
                    />
                    <Legend 
                      verticalAlign="top" 
                      align="right"
                      wrapperStyle={{ paddingBottom: '20px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="electricity" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="Electricity"
                      dot={{ r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="gas" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      name="Gas"
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Cost Analysis Area Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Monthly Cost Analysis
              </CardTitle>
              <CardDescription>Utility expenses breakdown over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={costAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis 
                    tickFormatter={(value: number) => `PKR ${(value/1000).toFixed(0)}K`}
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`PKR ${value.toLocaleString()}`, '']}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    wrapperStyle={{ paddingBottom: '20px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="electricityCost" 
                    stackId="1" 
                    stroke="#3B82F6" 
                    fill="#3B82F6"
                    fillOpacity={0.6}
                    name="Electricity Cost"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="gasCost" 
                    stackId="1" 
                    stroke="#F59E0B" 
                    fill="#F59E0B"
                    fillOpacity={0.6}
                    name="Gas Cost"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="electricity" className="space-y-6">
          {/* Electricity-specific content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Electricity Usage Donut */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Electricity Usage Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={consumptionByDepartment}
                      dataKey="electricity"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {consumptionByDepartment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value} kWh`, 'Consumption']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Peak Usage Times */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Daily Peak Usage Pattern
                </CardTitle>
                <CardDescription>Electricity consumption throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={peakUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Usage']} />
                    <Area 
                      type="monotone" 
                      dataKey="usage" 
                      stroke="#3B82F6" 
                      fill="#3B82F6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gas" className="space-y-6">
          {/* Gas-specific content */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5" />
                  Gas Consumption by Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={consumptionByDepartment.filter(d => d.gas > 0)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(value: number) => [`${value} m³`, 'Gas Consumption']} />
                    <Bar dataKey="gas" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="w-5 h-5" />
                  Gas Meters Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {gasMeters.map((meter) => (
                  <div key={meter.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{meter.building}</p>
                      <p className="text-sm text-muted-foreground">{meter.meterNumber}</p>
                      <p className="text-xs text-muted-foreground">{meter.consumption} m³ this month</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(meter.status)}>
                      {meter.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bills" className="space-y-6">
          {/* Bills and Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Utility Bills Overview
              </CardTitle>
              <CardDescription>Current month bills and payment status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bill Details</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Consumption</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {utilityBills.map((bill) => (
                    <TableRow key={bill.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {bill.type === 'ELECTRICITY' ? <Zap className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                            {bill.type}
                          </div>
                          <div className="text-sm text-muted-foreground">{bill.meterNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{bill.department}</div>
                          <div className="text-sm text-muted-foreground">{bill.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {bill.unitsConsumed} {bill.type === 'ELECTRICITY' ? 'kWh' : 'm³'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          @ PKR {bill.rate}/{bill.type === 'ELECTRICITY' ? 'kWh' : 'm³'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-medium">PKR {bill.totalAmount.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          Base: PKR {bill.baseAmount.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {bill.dueDate.toLocaleDateString()}
                        </div>
                        {bill.paidDate && (
                          <div className="text-xs text-muted-foreground">
                            Paid: {bill.paidDate.toLocaleDateString()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getBillStatusBadgeVariant(bill.status)}>
                          {bill.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator className="my-6" />

      {/* Meters Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="w-5 h-5" />
                Utility Meters
              </CardTitle>
              <CardDescription>
                All {filteredMeters.length} utility meters across campus
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <PlusCircle className="mr-2 w-4 h-4"/>
                    Record Reading
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Record Meter Reading</DialogTitle>
                    <DialogDescription>
                      Enter the current meter reading for utilities billing
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="meter-number">Meter Number</Label>
                      <Input id="meter-number" placeholder="e.g., K-ELECTRIC-2024-001"/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reading">Current Reading</Label>
                      <Input id="reading" type="number" placeholder="e.g., 125680"/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reading-date">Reading Date</Label>
                      <Input id="reading-date" type="date"/>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="submit">Save Reading</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button>
                <PlusCircle className="mr-2 w-4 h-4"/>
                Add Meter
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search meters by number, building, department, or type..." 
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
                <TableHead className="w-[200px]">Meter Details</TableHead>
                <TableHead>Type & Tariff</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Consumption</TableHead>
                <TableHead className="text-right">Current Bill</TableHead>
                <TableHead>Last Reading</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMeters.map((meter) => (
                <TableRow key={meter.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {meter.type === 'ELECTRICITY' ? <Zap className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                        {meter.meterNumber}
                      </div>
                      <div className="text-sm text-muted-foreground">{meter.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge variant="outline">{meter.type}</Badge>
                      <div className="text-sm text-muted-foreground mt-1">{meter.tariffType}</div>
                      <div className="text-xs text-muted-foreground">{meter.connectionLoad} {meter.type === 'ELECTRICITY' ? 'KW' : 'BTU'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{meter.building}</div>
                      <div className="text-muted-foreground">{meter.department}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {meter.consumption} {meter.type === 'ELECTRICITY' ? 'kWh' : 'm³'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Current: {meter.currentReading.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Previous: {meter.previousReading.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">PKR {meter.amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">@ PKR {meter.rate}/{meter.type === 'ELECTRICITY' ? 'kWh' : 'm³'}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{meter.lastReadingDate.toLocaleDateString()}</div>
                      <div className="text-xs text-muted-foreground">
                        Installed: {meter.installationDate.toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusBadgeVariant(meter.status)}>
                      {meter.status}
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