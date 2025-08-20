'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HRKPICard } from "@/components/hr/hr-kpi-card";
import { AttendanceChart } from "@/components/hr/attendance-chart";
import { AttendanceStatusWidget } from "@/components/hr/attendance-status-widget";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Calendar,
  AlertTriangle,
  TrendingUp,
  Download,
  Filter,
  Search
} from "lucide-react";
import { 
  attendanceMetrics, 
  attendanceRecords, 
  attendanceTrendData,
  leaveRequests,
  employees,
  departments
} from "@/lib/hr-data";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

export default function AttendancePage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const attendanceStatusData = [
    { name: 'Present', value: attendanceMetrics.present, color: 'hsl(var(--chart-1))' },
    { name: 'Absent', value: attendanceMetrics.absent, color: 'hsl(var(--chart-2))' },
    { name: 'Late', value: attendanceMetrics.late, color: 'hsl(var(--chart-3))' },
    { name: 'On Leave', value: attendanceMetrics.onLeave, color: 'hsl(var(--chart-4))' }
  ];

  const overtimeData = [
    { day: 'Mon', hours: 12 },
    { day: 'Tue', hours: 8 },
    { day: 'Wed', hours: 15 },
    { day: 'Thu', hours: 10 },
    { day: 'Fri', hours: 18 },
    { day: 'Sat', hours: 5 },
    { day: 'Sun', hours: 2 }
  ];

  const pendingRequests = leaveRequests.filter(req => req.status === 'Pending');
  const approvedLeaves = leaveRequests.filter(req => req.status === 'Approved');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Present':
        return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Present</Badge>;
      case 'Late':
        return <Badge className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Late</Badge>;
      case 'Absent':
        return <Badge className="bg-red-500/20 text-red-700 hover:bg-red-500/30">Absent</Badge>;
      case 'Leave':
        return <Badge className="bg-blue-500/20 text-blue-700 hover:bg-blue-500/30">On Leave</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Attendance & Leave</h1>
          <p className="text-muted-foreground">Monitor employee attendance and manage leave requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Attendance KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <HRKPICard
          title="Total Employees"
          value={attendanceMetrics.totalEmployees}
          subtitle="All staff members"
          icon={Users}
          iconColor="text-blue-600"
        />
        <HRKPICard
          title="Present Today"
          value={attendanceMetrics.present}
          subtitle={`${((attendanceMetrics.present / attendanceMetrics.totalEmployees) * 100).toFixed(1)}% attendance`}
          icon={UserCheck}
          trend={{
            value: 3.2,
            isPositive: true,
            label: "vs yesterday"
          }}
          iconColor="text-green-600"
        />
        <HRKPICard
          title="Absent"
          value={attendanceMetrics.absent}
          subtitle="Not present today"
          icon={UserX}
          trend={{
            value: 1.5,
            isPositive: false,
            label: "vs yesterday"
          }}
          iconColor="text-red-600"
        />
        <HRKPICard
          title="Late Arrivals"
          value={attendanceMetrics.late}
          subtitle="Late check-ins"
          icon={Clock}
          iconColor="text-yellow-600"
        />
        <HRKPICard
          title="On Leave"
          value={attendanceMetrics.onLeave}
          subtitle="Approved leaves"
          icon={Calendar}
          iconColor="text-purple-600"
        />
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Attendance Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Attendance Status Donut Chart */}
        <AttendanceChart
          data={attendanceStatusData}
          type="pie"
          title="Today's Attendance Status"
          height={280}
        />

        {/* Weekly Attendance Trend */}
        <div className="lg:col-span-2">
          <AttendanceChart
            data={attendanceTrendData}
            type="bar"
            title="Weekly Attendance Trend"
            height={280}
          />
        </div>
      </div>

      {/* Department-wise Attendance Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* On-Time Check-ins by Department */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">On-Time Check-ins</CardTitle>
            <CardDescription>Department-wise punctuality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { dept: 'Academic', onTime: 23, total: 25, percentage: 92 },
                { dept: 'Kitchen', onTime: 11, total: 12, percentage: 92 },
                { dept: 'Service', onTime: 16, total: 18, percentage: 89 },
                { dept: 'Admin', onTime: 7, total: 8, percentage: 88 },
                { dept: 'Maintenance', onTime: 5, total: 6, percentage: 83 }
              ].map((item) => (
                <div key={item.dept} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.dept}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.onTime}/{item.total}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-green-500 transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {item.percentage}% on time
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Late Arrivals by Department */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Late Arrivals</CardTitle>
            <CardDescription>Department-wise tardiness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { dept: 'Service', late: 2, total: 18, percentage: 11 },
                { dept: 'Kitchen', late: 1, total: 12, percentage: 8 },
                { dept: 'Academic', late: 2, total: 25, percentage: 8 },
                { dept: 'Maintenance', late: 1, total: 6, percentage: 17 },
                { dept: 'Admin', late: 1, total: 8, percentage: 13 }
              ].map((item) => (
                <div key={item.dept} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.dept}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.late}/{item.total}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-orange-500 transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {item.percentage}% late
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overtime & Attendance Source */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Attendance Sources</CardTitle>
            <CardDescription>How employees check in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">2000</div>
                  <div className="text-xs text-blue-600">Device Check-ins</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="text-2xl font-bold text-green-600">2500</div>
                  <div className="text-xs text-green-600">App Check-ins</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Active Devices</span>
                  <span className="font-medium">145</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Inactive Devices</span>
                  <span className="font-medium">5</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-muted/50">
                <h4 className="font-medium text-sm mb-2">Exceptions</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">250</div>
                    <div className="text-xs text-muted-foreground">Late Coming</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">500</div>
                    <div className="text-xs text-muted-foreground">Early Going</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Attendance Status */}
        <AttendanceStatusWidget 
          attendanceRecords={attendanceRecords}
          title="Today's Check-in Status"
        />

        {/* Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Leave Requests</span>
              {pendingRequests.length > 0 && (
                <Badge className="bg-orange-500/20 text-orange-700">
                  {pendingRequests.length} Pending
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaveRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={request.employee.photo} alt={request.employee.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {request.employee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{request.employee.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {request.type} • {request.days} days
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(request.startDate, 'MMM dd')} - {format(request.endDate, 'MMM dd')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={request.status === 'Approved' ? 'default' : 
                               request.status === 'Pending' ? 'secondary' : 'destructive'}
                      className={request.status === 'Approved' ? 'bg-green-500/20 text-green-700' : 
                                request.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-700' : ''}
                    >
                      {request.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {leaveRequests.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No leave requests</p>
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">
              View All Requests
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detailed Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Hours Worked</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Device</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record) => (
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
                  <TableCell>
                    <Badge variant="outline">{record.employee.department.name}</Badge>
                  </TableCell>
                  <TableCell>
                    {record.checkIn ? format(record.checkIn, 'HH:mm') : '--'}
                  </TableCell>
                  <TableCell>
                    {record.checkOut ? format(record.checkOut, 'HH:mm') : '--'}
                  </TableCell>
                  <TableCell>
                    {record.hoursWorked ? `${record.hoursWorked}h` : '--'}
                    {record.overtimeHours && record.overtimeHours > 0 && (
                      <span className="text-xs text-orange-600 ml-1">
                        (+{record.overtimeHours}h OT)
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {record.deviceType}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <HRKPICard
          title="On-time Arrivals"
          value={attendanceMetrics.onTime}
          subtitle={`${((attendanceMetrics.onTime / attendanceMetrics.totalEmployees) * 100).toFixed(1)}% punctual`}
          icon={UserCheck}
          trend={{
            value: 4.2,
            isPositive: true,
            label: "vs last week"
          }}
          iconColor="text-green-600"
        />
        <HRKPICard
          title="Early Departures"
          value={attendanceMetrics.earlyDepartures}
          subtitle="Left early today"
          icon={AlertTriangle}
          iconColor="text-orange-600"
        />
        <HRKPICard
          title="Overtime Hours"
          value={attendanceMetrics.overtime}
          subtitle="Extra hours today"
          icon={Clock}
          trend={{
            value: 8.5,
            isPositive: false,
            label: "vs yesterday"
          }}
          iconColor="text-blue-600"
        />
        <HRKPICard
          title="Avg. Hours Worked"
          value={`${attendanceMetrics.averageHoursWorked}h`}
          subtitle="Per employee daily"
          icon={TrendingUp}
          trend={{
            value: 2.1,
            isPositive: true,
            label: "vs target"
          }}
          iconColor="text-purple-600"
        />
      </div>
    </div>
  );
}