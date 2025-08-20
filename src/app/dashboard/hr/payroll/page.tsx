'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HRKPICard } from "@/components/hr/hr-kpi-card";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calculator,
  CreditCard,
  FileText,
  Download,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { 
  employees, 
  payrollTrendData,
  hrMetrics
} from "@/lib/hr-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

export default function PayrollPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-01");

  // Mock payroll data
  const payrollRecords = [
    {
      id: "pay-1",
      employee: employees[0],
      period: { month: 1, year: 2024 },
      basicSalary: 80000,
      allowances: [
        { name: "Housing", amount: 15000 },
        { name: "Transport", amount: 5000 }
      ],
      deductions: [
        { name: "Income Tax", amount: 12000 },
        { name: "Social Security", amount: 4000 }
      ],
      grossPay: 100000,
      netPay: 84000,
      overtime: { hours: 8, rate: 500, amount: 4000 },
      status: 'Paid'
    },
    {
      id: "pay-2",
      employee: employees[1],
      period: { month: 1, year: 2024 },
      basicSalary: 45000,
      allowances: [
        { name: "Meal", amount: 3000 }
      ],
      deductions: [
        { name: "Income Tax", amount: 6000 },
        { name: "Social Security", amount: 2250 }
      ],
      grossPay: 48000,
      netPay: 39750,
      overtime: { hours: 12, rate: 300, amount: 3600 },
      status: 'Processed'
    },
    {
      id: "pay-3",
      employee: employees[2],
      period: { month: 1, year: 2024 },
      basicSalary: 55000,
      allowances: [
        { name: "Academic", amount: 8000 }
      ],
      deductions: [
        { name: "Income Tax", amount: 8500 },
        { name: "Social Security", amount: 2750 }
      ],
      grossPay: 63000,
      netPay: 51750,
      overtime: { hours: 0, rate: 400, amount: 0 },
      status: 'Draft'
    }
  ];

  const departmentPayroll = [
    { department: 'Management', budget: 500000, used: 480000, employees: 5 },
    { department: 'Academic', budget: 800000, used: 720000, employees: 25 },
    { department: 'Kitchen', budget: 300000, used: 285000, employees: 12 },
    { department: 'Service', budget: 400000, used: 365000, employees: 18 },
    { department: 'Administration', budget: 350000, used: 330000, employees: 8 }
  ];

  const benefitsData = [
    { benefit: 'Health Insurance', enrolled: 65, eligible: 68, coverage: 95.6 },
    { benefit: 'Life Insurance', enrolled: 58, eligible: 68, coverage: 85.3 },
    { benefit: 'Retirement Plan', enrolled: 45, eligible: 68, coverage: 66.2 },
    { benefit: 'Dental Care', enrolled: 38, eligible: 68, coverage: 55.9 }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <Badge className="bg-green-500/20 text-green-700">Paid</Badge>;
      case 'Processed':
        return <Badge className="bg-blue-500/20 text-blue-700">Processed</Badge>;
      case 'Draft':
        return <Badge className="bg-yellow-500/20 text-yellow-700">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalPayroll = payrollRecords.reduce((sum, record) => sum + record.netPay, 0);
  const totalOvertime = payrollRecords.reduce((sum, record) => sum + record.overtime.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Payroll & Benefits</h1>
          <p className="text-muted-foreground">Manage employee compensation and benefits</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Payroll
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Process Payroll
          </Button>
        </div>
      </div>

      {/* Payroll KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <HRKPICard
          title="Total Payroll"
          value={`₨${(totalPayroll * 278 / 1000).toFixed(0)}K`}
          subtitle="This month"
          icon={DollarSign}
          trend={{
            value: 5.2,
            isPositive: true,
            label: "vs last month"
          }}
          iconColor="text-green-600"
        />
        <HRKPICard
          title="Average Salary"
          value={`₨${(hrMetrics.averageSalary * 278 / 1000).toFixed(0)}K`}
          subtitle="Per employee"
          icon={Calculator}
          trend={{
            value: 2.1,
            isPositive: true,
            label: "vs last month"
          }}
          iconColor="text-blue-600"
        />
        <HRKPICard
          title="Overtime Pay"
          value={`₨${(totalOvertime * 278 / 1000).toFixed(0)}K`}
          subtitle="Additional compensation"
          icon={Clock}
          trend={{
            value: 8.3,
            isPositive: false,
            label: "vs last month"
          }}
          iconColor="text-orange-600"
        />
        <HRKPICard
          title="Processed Records"
          value={`${payrollRecords.filter(r => r.status === 'Processed' || r.status === 'Paid').length}/${payrollRecords.length}`}
          subtitle="Payroll completion"
          icon={CheckCircle}
          iconColor="text-purple-600"
        />
      </div>

      {/* Period Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payroll Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-01">January 2024</SelectItem>
                <SelectItem value="2023-12">December 2023</SelectItem>
                <SelectItem value="2023-11">November 2023</SelectItem>
                <SelectItem value="2023-10">October 2023</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              Generate Report
            </Button>
            <Button variant="outline">
              Bulk Actions
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Payroll Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payroll Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={payrollTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `₨${(value * 278 / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(value: any) => [`₨${(value * 278 / 1000).toFixed(0)}K`, 'Amount']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Budget Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Department Budget Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentPayroll.map((dept) => {
                const utilization = (dept.used / dept.budget) * 100;
                return (
                  <div key={dept.department} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{dept.department}</span>
                      <span className="text-xs text-muted-foreground">
                        ₨{(dept.used * 278 / 1000).toFixed(0)}K / ₨{(dept.budget * 278 / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          utilization > 90 ? 'bg-red-500' : 
                          utilization > 75 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{dept.employees} employees</span>
                      <span>{utilization.toFixed(1)}% utilized</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payroll Records - January 2024</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Basic Salary</TableHead>
                <TableHead>Allowances</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Net Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={record.employee.photo} alt={record.employee.name} />
                        <AvatarFallback className="text-xs">
                          {record.employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{record.employee.name}</p>
                        <p className="text-xs text-muted-foreground">{record.employee.role}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>₨{(record.basicSalary * 278).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      ₨{(record.allowances.reduce((sum, a) => sum + a.amount, 0) * 278).toLocaleString()}
                      {record.allowances.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {record.allowances.map(a => a.name).join(', ')}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      ₨{(record.deductions.reduce((sum, d) => sum + d.amount, 0) * 278).toLocaleString()}
                      {record.deductions.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {record.deductions.map(d => d.name).join(', ')}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.overtime.hours > 0 ? (
                      <div className="text-sm">
                        ₨{(record.overtime.amount * 278).toLocaleString()}
                        <div className="text-xs text-muted-foreground">
                          {record.overtime.hours}h @ ₨{(record.overtime.rate * 278).toFixed(0)}
                        </div>
                      </div>
                    ) : (
                      '--'
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    ₨{(record.netPay * 278).toLocaleString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm">
                        <FileText className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Benefits Enrollment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Benefits Enrollment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {benefitsData.map((benefit) => (
              <div key={benefit.benefit} className="p-4 rounded-lg border">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">{benefit.benefit}</h4>
                  <Badge variant="outline" className="text-xs">
                    {benefit.coverage.toFixed(1)}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Enrolled</span>
                    <span className="font-medium">{benefit.enrolled} employees</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Eligible</span>
                    <span>{benefit.eligible} employees</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 bg-primary rounded-full transition-all"
                      style={{ width: `${benefit.coverage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <HRKPICard
          title="Payroll Processing Time"
          value="2.5 days"
          subtitle="Average processing time"
          icon={Clock}
          trend={{
            value: 12.5,
            isPositive: false,
            label: "improvement needed"
          }}
          iconColor="text-orange-600"
        />
        <HRKPICard
          title="Tax Compliance"
          value="100%"
          subtitle="Compliant filings"
          icon={CheckCircle}
          iconColor="text-green-600"
        />
        <HRKPICard
          title="Benefits Cost"
          value="₨79M"
          subtitle="Total benefits cost"
          icon={CreditCard}
          trend={{
            value: 3.2,
            isPositive: true,
            label: "vs budget"
          }}
          iconColor="text-purple-600"
        />
        <HRKPICard
          title="Payroll Errors"
          value="0.2%"
          subtitle="Error rate this month"
          icon={AlertTriangle}
          trend={{
            value: 45.8,
            isPositive: false,
            label: "vs last month"
          }}
          iconColor="text-red-600"
        />
      </div>
    </div>
  );
}