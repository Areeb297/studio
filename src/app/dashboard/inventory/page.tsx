'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Warehouse,
  DollarSign,
  Users,
  AlertTriangle,
  PlusCircle,
  Search,
  Sparkles,
  Clock,
  ShoppingCart,
  TrendingUp,
  Package,
  FileText,
  Settings,
  Download,
  PackageCheck,
  Building2,
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
import { alertUnusualPurchases, AlertUnusualPurchasesInput, AlertUnusualPurchasesOutput } from '@/ai/flows/alert-unusual-purchases';
import { Skeleton } from '@/components/ui/skeleton';
import { InventoryFormsContainer } from '@/components/inventory/InventoryForms';
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
  ComposedChart,
  Line,
  Area,
  AreaChart,
  ReferenceLine
} from 'recharts';

import {
  enhancedInventory,
  vendors,
  inventoryByCategory,
  stockStatusData,
  topItemsByValue,
  vendorPerformance,
  procurementSpendingTrends,
  COLORS,
  STATUS_COLORS,
  getStockStatus,
  calculateInventorySummary,
  type EnhancedInventoryItem
} from '@/lib/inventory-enhanced-data';

import {
  grnProcessingTrends,
  departmentRequisitions,
} from '@/lib/dashboard-mock-data';

const tooltipStyle = {
  backgroundColor: 'hsl(var(--background))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
};

// KPI Card Component
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
    warning: "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800",
    critical: "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
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

export default function EnhancedInventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [aiAlert, setAiAlert] = useState<AlertUnusualPurchasesOutput | null>(null);
  const [isAlertLoading, setIsAlertLoading] = useState(false);

  const summary = calculateInventorySummary();

  const filteredInventory = useMemo(() => {
    if (!searchTerm) return enhancedInventory;
    return enhancedInventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.preferredVendor.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleCheckPurchase = async () => {
    setIsAlertLoading(true);
    setAiAlert(null);
    try {
        const mockPurchase: AlertUnusualPurchasesInput = {
            item: "GOAT BAKRA A",
            quantity: 25,
            thresholdMultiplier: 1.8,
            purchaseRate: 1900,
            agreedRate: 1800
        };
        const result = await alertUnusualPurchases(mockPurchase);
        setAiAlert(result);
    } catch(error) {
        console.error("Failed to get AI alert:", error);
    } finally {
        setIsAlertLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">
            {summary.totalItems.toLocaleString()} items across {vendors.length} suppliers and {new Set(enhancedInventory.map(i => i.primaryStore)).size} store locations
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
          title="Total Items"
          value={summary.totalItems.toLocaleString()}
          icon={Package}
          trend="47 categories across 4 types"
        />

        <KPICard
          title="Low Stock Items"
          value={summary.lowStockItems.toString()}
          icon={Warehouse}
          status={summary.lowStockItems > 0 ? "warning" : "default"}
          trend="Items at or below reorder level"
        />

        <KPICard
          title="Pending Approvals"
          value={summary.pendingApprovals.toString()}
          icon={Clock}
          status={summary.pendingApprovals > 0 ? "critical" : "default"}
          trend="3 PO + 10 GRN + 3 PR pending"
        />

        <KPICard
          title="Active Suppliers"
          value={summary.activeVendors.toString()}
          icon={Users}
          trend="All 5 suppliers approved"
        />

        <KPICard
          title="Total PO Value"
          value={`PKR ${(summary.monthlyPurchases / 1000).toFixed(0)}K`}
          icon={ShoppingCart}
          trend="20 purchase orders total"
        />
      </div>

      {/* Charts Section - Primary */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Donut Chart - Inventory by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Items by Type
            </CardTitle>
            <CardDescription>{summary.totalItems.toLocaleString()} total items in catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inventoryByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {inventoryByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    'Items'
                  ]}
                  contentStyle={tooltipStyle}
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

        {/* Bar Chart - Top Items by Value */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Items by Value
            </CardTitle>
            <CardDescription>Highest value inventory items currently in stock</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topItemsByValue}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={11}
                />
                <YAxis
                  tickFormatter={(value: number) => `${(value/1000).toFixed(0)}K`}
                  fontSize={12}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `PKR ${value.toLocaleString()}`,
                    'Total Value'
                  ]}
                  contentStyle={tooltipStyle}
                />
                <Bar dataKey="value" fill="#14B8A6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Row Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Stock Status Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Stock Status Distribution
            </CardTitle>
            <CardDescription>Current stock status across {summary.totalItems.toLocaleString()} items</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stockStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [value.toLocaleString(), 'Items']}
                  contentStyle={tooltipStyle}
                />
                <Legend
                  formatter={(value, entry) => (
                    <span className="text-sm" style={{ color: entry.color }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vendor Performance Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Vendor Performance
            </CardTitle>
            <CardDescription>Rating and on-time delivery for {vendors.length} suppliers</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={vendorPerformance}
                margin={{ top: 40, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  fontSize={9}
                  interval={0}
                />
                <YAxis fontSize={10} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background p-3 shadow-lg rounded-lg border">
                          <p className="font-medium text-sm mb-2">{label}</p>
                          <div className="space-y-1 text-xs">
                            <p>Rating: {data.rating}/5</p>
                            <p>On-Time: {data.onTime}%</p>
                            <p>Total Value: PKR {data.totalValue.toLocaleString()}</p>
                            <p>Total Orders: {data.totalOrders}</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '20px' }}
                />
                <Bar
                  dataKey="rating"
                  fill="#3B82F6"
                  name="Rating (out of 5)"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="onTimePercentage"
                  fill="#10B981"
                  name="On-Time (%)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{vendors.filter(v => v.status === 'APPROVED').length}</p>
                <p className="text-xs text-muted-foreground">Approved Vendors</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{vendors.filter(v => v.onTimeDelivery >= 90).length}</p>
                <p className="text-xs text-muted-foreground">High Performers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {Math.round(vendors.reduce((acc, v) => acc + v.vendorRating, 0) / vendors.length * 10) / 10}
                </p>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NEW: GRN Trends + Department Requisitions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* GRN Processing Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageCheck className="w-5 h-5" />
              Goods Received Trends
            </CardTitle>
            <CardDescription>Monthly GRN counts — approved vs pending</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={grnProcessingTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="grnApprovedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="grnPendingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="approved"
                  stackId="1"
                  stroke="#10B981"
                  fill="url(#grnApprovedGrad)"
                  name="Approved"
                />
                <Area
                  type="monotone"
                  dataKey="pending"
                  stackId="1"
                  stroke="#F59E0B"
                  fill="url(#grnPendingGrad)"
                  name="Pending"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Requisitions (horizontal bar) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Requisitions by Department
            </CardTitle>
            <CardDescription>Purchase requisitions across {departmentRequisitions.length} departments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={departmentRequisitions.slice(0, 8)}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={110} fontSize={10} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#8B5CF6" name="Requisitions" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Procurement Spending Trends Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Procurement Spending Trends
          </CardTitle>
          <CardDescription>Category spending analysis with budget variance (Oct 2025 — Mar 2026)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={procurementSpendingTrends}
              margin={{ top: 40, right: 40, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="consumablesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="assetsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="materialsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="spending"
                orientation="left"
                fontSize={12}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${(value/1000).toFixed(0)}K`}
              />
              <YAxis
                yAxisId="time"
                orientation="right"
                fontSize={12}
                axisLine={false}
                tickLine={false}
                domain={[0, 5]}
                tickFormatter={(value) => `${value}d`}
              />

              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number, name: string, props: any) => {
                  const dataKey = props.dataKey;
                  if (dataKey === 'approvalTime') return [`${value} days`, 'Avg Approval Time'];
                  if (dataKey === 'budget') return [`PKR ${value.toLocaleString()}`, 'Budget'];
                  return [`PKR ${value.toLocaleString()}`, name];
                }}
              />

              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '30px' }}
                iconType="rect"
              />

              <ReferenceLine
                yAxisId="spending"
                y={65000}
                stroke="#94A3B8"
                strokeDasharray="8 8"
                strokeWidth={2}
                label={{ value: "Avg Budget", position: "insideTopRight", fontSize: 11 }}
              />

              <Bar
                yAxisId="spending"
                dataKey="consumables"
                stackId="spending"
                fill="url(#consumablesGradient)"
                name="Consumables"
              />
              <Bar
                yAxisId="spending"
                dataKey="fixedAssets"
                stackId="spending"
                fill="url(#assetsGradient)"
                name="Fixed Assets"
              />
              <Bar
                yAxisId="spending"
                dataKey="rawMaterials"
                stackId="spending"
                fill="url(#materialsGradient)"
                name="Raw Materials"
                radius={[4, 4, 0, 0]}
              />

              <Line
                yAxisId="spending"
                type="monotone"
                dataKey="budget"
                stroke="#F59E0B"
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Monthly Budget"
                dot={{ r: 0 }}
                activeDot={{ r: 6, fill: '#F59E0B' }}
              />

              <Line
                yAxisId="time"
                type="monotone"
                dataKey="approvalTime"
                stroke="#EF4444"
                strokeWidth={2}
                name="Approval Time (days)"
                dot={{ r: 4, fill: '#EF4444' }}
                activeDot={{ r: 6, fill: '#EF4444' }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">PKR {(procurementSpendingTrends.reduce((sum, item) => sum + item.totalSpending, 0) / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">Total Spending (6 months)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{Math.round(procurementSpendingTrends.filter(item => item.variance > 0).length / procurementSpendingTrends.length * 100)}%</p>
              <p className="text-xs text-muted-foreground">Months Under Budget</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{(procurementSpendingTrends.reduce((sum, item) => sum + item.approvalTime, 0) / procurementSpendingTrends.length).toFixed(1)}d</p>
              <p className="text-xs text-muted-foreground">Avg Approval Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{procurementSpendingTrends.reduce((sum, item) => sum + item.emergencyOrders, 0)}</p>
              <p className="text-xs text-muted-foreground">Emergency Orders</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Inventory Table */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Current Stock Levels
                </CardTitle>
                <CardDescription>
                  {filteredInventory.length} items shown — {summary.totalItems.toLocaleString()} total in system
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <PlusCircle className="mr-2 w-4 h-4"/>
                      Record Purchase
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Record Purchase Order</DialogTitle>
                      <DialogDescription>
                        Enter details of a new purchase to update inventory levels
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="item-name">Item Name</Label>
                        <Input id="item-name" placeholder="e.g., GOAT BAKRA A"/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input id="quantity" type="number" placeholder="e.g., 25"/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="total-cost">Total Cost (PKR)</Label>
                        <Input id="total-cost" type="number" placeholder="e.g., 45000"/>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="submit">Save Purchase</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button>
                  <PlusCircle className="mr-2 w-4 h-4"/>
                  Add New Item
                </Button>
              </div>
            </div>

            <div className="relative mt-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items by name, code, category, or vendor..."
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
                  <TableHead className="w-[200px]">Item Details</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Current Stock</TableHead>
                  <TableHead className="text-center">Stock Levels</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const { status, variant } = getStockStatus(item);
                  return (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.code}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{item.category}</div>
                          <div className="text-xs text-muted-foreground">{item.subCategory}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-medium">{item.currentQuantity} {item.unit}</div>
                        <div className="text-xs text-muted-foreground">
                          Available: {item.availableQuantity}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-xs space-y-1">
                          <div>Min: {item.minStock}</div>
                          <div className="text-amber-600 font-medium">Reorder: {item.reorderLevel}</div>
                          <div>Max: {item.maxStock}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <div className="font-medium">PKR {item.totalValue.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">@PKR {item.unitCost}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{item.preferredVendor}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.lastPurchaseDate.toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{item.primaryStore}</div>
                          <div className="text-xs text-muted-foreground">{item.storageLocation}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={variant}
                          className={`
                            ${status === 'Low Stock' ? 'bg-amber-100 text-amber-700 border-amber-300' : ''}
                            ${status === 'Out of Stock' ? 'bg-red-100 text-red-700 border-red-300' : ''}
                            ${status === 'In Stock' ? 'bg-green-100 text-green-700 border-green-300' : ''}
                            ${status === 'Excess Stock' ? 'bg-purple-100 text-purple-700 border-purple-300' : ''}
                          `}
                        >
                          {status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">GRN Approved</p>
                  <p className="text-muted-foreground text-xs">GRN-202603-0014 from ALI</p>
                </div>
                <div className="text-xs text-muted-foreground">2h ago</div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">PO Pending</p>
                  <p className="text-muted-foreground text-xs">PO-202603-0005 awaiting L2</p>
                </div>
                <div className="text-xs text-muted-foreground">4h ago</div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">PR Submitted</p>
                  <p className="text-muted-foreground text-xs">PR-202603-0007 from DESI KITCHEN</p>
                </div>
                <div className="text-xs text-muted-foreground">6h ago</div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Pending Approvals
              </CardTitle>
              <CardDescription>Documents awaiting approval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">Purchase Orders</p>
                  <p className="text-muted-foreground text-xs">3 POs pending approval</p>
                </div>
                <Badge variant="outline" className="text-amber-600 border-amber-300">3</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">Goods Received</p>
                  <p className="text-muted-foreground text-xs">10 GRNs pending approval</p>
                </div>
                <Badge variant="outline" className="text-red-600 border-red-300">10</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">Requisitions</p>
                  <p className="text-muted-foreground text-xs">3 PRs pending review</p>
                </div>
                <Badge variant="outline" className="text-amber-600 border-amber-300">3</Badge>
              </div>
            </CardContent>
          </Card>

          {/* AI Purchase Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Purchase Analysis
              </CardTitle>
              <CardDescription>Smart monitoring for purchasing anomalies</CardDescription>
            </CardHeader>
            <CardContent>
              {isAlertLoading && <Skeleton className="h-24 w-full" />}
              {aiAlert && (
                <div className={`p-4 rounded-lg space-y-2 ${aiAlert.isUnusual ? 'bg-destructive/10 border-destructive/30 border' : 'bg-secondary'}`}>
                  <h4 className={`font-semibold flex items-center gap-2 ${aiAlert.isUnusual ? 'text-destructive' : ''}`}>
                    <AlertTriangle className="w-4 h-4"/>
                    {aiAlert.isUnusual ? "Unusual Activity" : "Normal Activity"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Reason:</span> {aiAlert.reason}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Recommendation:</span> {aiAlert.recommendation}
                  </p>
                </div>
              )}
              {!isAlertLoading && !aiAlert && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  <p>Click below to analyze recent purchases for anomalies.</p>
                </div>
              )}
            </CardContent>
            <CardContent>
              <Button onClick={handleCheckPurchase} disabled={isAlertLoading} className="w-full" size="sm">
                {isAlertLoading ? "Analyzing..." : "Analyze Purchases"}
              </Button>
            </CardContent>
          </Card>

          {/* Top Vendors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Suppliers
              </CardTitle>
              <CardDescription>{vendors.length} active suppliers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {vendors.map(vendor => (
                <div key={vendor.id} className="flex items-center justify-between text-sm">
                  <div className="flex-1">
                    <p className="font-medium">{vendor.companyName}</p>
                    <p className="text-muted-foreground text-xs">
                      {vendor.totalOrders} orders | {vendor.onTimeDelivery}% on-time
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={vendor.status === 'APPROVED' ? 'default' : 'secondary'}>
                      {vendor.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {vendor.vendorRating}/5
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Forms Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-headline">Inventory Data Entry Forms</h2>
            <p className="text-muted-foreground mt-1">
              Complete form collection for all 14 inventory modules with validation and workflow integration
            </p>
          </div>
        </div>

        <InventoryFormsContainer />
      </div>
    </div>
  );
}
