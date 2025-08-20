'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HRKPICard } from "@/components/hr/hr-kpi-card";
import { AttendanceChart } from "@/components/hr/attendance-chart";
import { AttendanceStatusWidget } from "@/components/hr/attendance-status-widget";
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  Briefcase, 
  Calendar,
  Clock,
  Award,
  DollarSign,
  UserPlus,
  FileText,
  CheckCircle,
  UserX
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { 
  hrMetrics, 
  employmentStatusData, 
  departmentData, 
  attendanceRecords,
  meetings,
  tasks,
  jobApplications
} from "@/lib/hr-data";
import Link from "next/link";
import { format } from "date-fns";

export default function HROverviewPage() {
  const recentActivities = [
    {
      id: 1,
      type: 'hire',
      message: 'New employee Ayesha Malik joined as Assistant Teacher',
      timestamp: new Date('2024-01-15T09:30:00'),
      icon: UserPlus
    },
    {
      id: 2,
      type: 'leave',
      message: 'Ali Hassan submitted sick leave request for 2 days',
      timestamp: new Date('2024-01-14T16:20:00'),
      icon: Calendar
    },
    {
      id: 3,
      type: 'payroll',
      message: 'December 2023 payroll processed successfully',
      timestamp: new Date('2024-01-12T11:45:00'),
      icon: DollarSign
    },
    {
      id: 4,
      type: 'task',
      message: 'Employee handbook update assigned to Sana Iqbal',
      timestamp: new Date('2024-01-10T14:15:00'),
      icon: FileText
    }
  ];

  const upcomingEvents = meetings.slice(0, 3);
  const pendingTasks = tasks.filter(task => task.status !== 'Completed').slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Human Resources</h1>
          <p className="text-muted-foreground">Comprehensive HR management and analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/hr/employees">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Employee
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/hr/attendance">
              <Clock className="w-4 h-4 mr-2" />
              View Attendance
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <HRKPICard
          title="Total Employees"
          value={hrMetrics.totalEmployees}
          subtitle="All staff members"
          icon={Users}
          trend={{
            value: 8.2,
            isPositive: true,
            label: "vs last month"
          }}
          iconColor="text-blue-600"
        />
        <HRKPICard
          title="Active Staff"
          value={hrMetrics.activeEmployees}
          subtitle="Currently employed"
          icon={UserCheck}
          trend={{
            value: 3.5,
            isPositive: true,
            label: "vs last month"
          }}
          iconColor="text-green-600"
        />
        <HRKPICard
          title="Turnover Rate"
          value={`${hrMetrics.turnoverRate}%`}
          subtitle="Annual turnover"
          icon={TrendingUp}
          trend={{
            value: 1.2,
            isPositive: false,
            label: "vs last year"
          }}
          iconColor="text-orange-600"
        />
        <HRKPICard
          title="Job Applications"
          value={hrMetrics.jobApplications}
          subtitle="This month"
          icon={Briefcase}
          trend={{
            value: 25.3,
            isPositive: true,
            label: "vs last month"
          }}
          iconColor="text-purple-600"
        />
      </div>

      {/* Enhanced Attendance & Employee Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <HRKPICard
          title="Checked In"
          value="54"
          subtitle="Currently online"
          icon={CheckCircle}
          trend={{
            value: 5.2,
            isPositive: true,
            label: "vs yesterday"
          }}
          iconColor="text-green-600"
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
        />
        <HRKPICard
          title="Not Checked In"
          value="14"
          subtitle="Pending check-in"
          icon={Clock}
          iconColor="text-orange-600"
          className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
        />
        <HRKPICard
          title="On Leave"
          value="5"
          subtitle="Approved leaves"
          icon={Calendar}
          iconColor="text-blue-600"
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
        />
        <HRKPICard
          title="Checked Out"
          value="3"
          subtitle="Early departures"
          icon={UserX}
          iconColor="text-purple-600"
          className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
        />
        <HRKPICard
          title="Device Check-ins"
          value="62"
          subtitle="App & biometric"
          icon={UserCheck}
          iconColor="text-teal-600"
          className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200"
        />
        <HRKPICard
          title="On Time"
          value="48"
          subtitle="Punctual today"
          icon={Award}
          trend={{
            value: 12.3,
            isPositive: true,
            label: "vs target"
          }}
          iconColor="text-emerald-600"
          className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Employment Status Donut Chart */}
        <AttendanceChart
          data={employmentStatusData}
          type="pie"
          title="Employment Status Distribution"
          height={280}
        />

        {/* Department Distribution Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Department-wise Employee Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart 
                data={departmentData} 
                margin={{ top: 20, right: 30, left: 40, bottom: 80 }}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="department" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  width={60}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} employees`, 'Count']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar 
                  dataKey="employees" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Attendance */}
        <AttendanceStatusWidget 
          attendanceRecords={attendanceRecords.slice(0, 4)}
          title="Recent Check-ins"
        />

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <div className="p-2 rounded-full bg-primary/10">
                    <activity.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(activity.timestamp, 'MMM dd, HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">
              View All Activities
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions & Upcoming */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/dashboard/hr/employees">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Employee
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/dashboard/hr/attendance">
                  <Clock className="w-4 h-4 mr-2" />
                  Manage Attendance
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/dashboard/hr/payroll">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Process Payroll
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/dashboard/hr/talent">
                  <Award className="w-4 h-4 mr-2" />
                  Talent Management
                </Link>
              </Button>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-sm mb-3">Upcoming Events</h4>
              <div className="space-y-2">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-2 rounded bg-muted/50">
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(event.startTime, 'MMM dd, HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* HR Metrics Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <HRKPICard
          title="Average Salary"
          value={`₨${(hrMetrics.averageSalary * 278 / 1000).toFixed(0)}K`}
          subtitle="Monthly average"
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <HRKPICard
          title="Attendance Rate"
          value={`${hrMetrics.attendanceRate}%`}
          subtitle="This month"
          icon={UserCheck}
          trend={{
            value: 2.1,
            isPositive: true,
            label: "vs last month"
          }}
          iconColor="text-blue-600"
        />
        <HRKPICard
          title="New Hires"
          value={hrMetrics.newHires}
          subtitle="This quarter"
          icon={UserPlus}
          trend={{
            value: 15.8,
            isPositive: true,
            label: "vs last quarter"
          }}
          iconColor="text-purple-600"
        />
        <HRKPICard
          title="Employee Satisfaction"
          value={hrMetrics.employeeSatisfaction ? `${hrMetrics.employeeSatisfaction}/5` : 'N/A'}
          subtitle="Latest survey"
          icon={Award}
          trend={{
            value: 5.2,
            isPositive: true,
            label: "vs last survey"
          }}
          iconColor="text-orange-600"
        />
      </div>
    </div>
  );
}