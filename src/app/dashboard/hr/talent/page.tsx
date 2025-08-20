'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HRKPICard } from "@/components/hr/hr-kpi-card";
import { EmployeeCard } from "@/components/hr/employee-card";
import { 
  Users, 
  Award, 
  TrendingUp, 
  Briefcase,
  Calendar,
  Clock,
  Search,
  Filter,
  Star,
  Target,
  BookOpen,
  UserPlus
} from "lucide-react";
import { 
  employees, 
  hrMetrics, 
  leaveBalances,
  meetings,
  tasks,
  jobApplications
} from "@/lib/hr-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format } from "date-fns";

export default function TalentManagementPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const teamKPIData = [
    { month: 'Jan', kpi: 68 },
    { month: 'Feb', kpi: 72 },
    { month: 'Mar', kpi: 70 },
    { month: 'Apr', kpi: 75 },
    { month: 'May', kpi: 78 },
    { month: 'Jun', kpi: 82 },
    { month: 'Jul', kpi: 85 }
  ];

  const performanceDistribution = [
    { rating: '5.0', count: 8, percentage: 12 },
    { rating: '4.0-4.9', count: 25, percentage: 36 },
    { rating: '3.0-3.9', count: 28, percentage: 41 },
    { rating: '2.0-2.9', count: 6, percentage: 9 },
    { rating: '< 2.0', count: 1, percentage: 2 }
  ];

  const upcomingMeetings = meetings.filter(m => m.status === 'Scheduled').slice(0, 3);
  const activeTasks = tasks.filter(t => t.status === 'In Progress').slice(0, 3);
  
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || emp.department.name === selectedDepartment;
    return matchesSearch && matchesDepartment && emp.status === 'Active';
  });

  const topPerformers = employees
    .filter(emp => emp.performanceRating && emp.performanceRating >= 4.5)
    .sort((a, b) => (b.performanceRating || 0) - (a.performanceRating || 0))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Talent Management</h1>
          <p className="text-muted-foreground">
            {format(new Date(), "EEEE, dd MMMM yyyy")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Top KPI Cards - Talenan Style */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <HRKPICard
          title="Total Employees"
          value={employees.filter(emp => emp.status === 'Active').length}
          subtitle="Active staff members"
          icon={Users}
          trend={{
            value: 3.5,
            isPositive: true,
            label: "than last month"
          }}
          iconColor="text-blue-600"
        />
        <HRKPICard
          title="Total Payrolls"
          value="24"
          subtitle="Monthly payrolls"
          icon={Award}
          trend={{
            value: 5,
            isPositive: true,
            label: "than last month"
          }}
          iconColor="text-green-600"
        />
        <HRKPICard
          title="Turnover Rate"
          value="8%"
          subtitle="Annual rate"
          icon={TrendingUp}
          trend={{
            value: 1,
            isPositive: false,
            label: "than last month"
          }}
          iconColor="text-red-500"
        />
        <HRKPICard
          title="Job Applicants"
          value={jobApplications.length}
          subtitle="This month"
          icon={Briefcase}
          trend={{
            value: 6,
            isPositive: true,
            label: "than last month"
          }}
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Schedule Section - Talenan Style */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schedule</CardTitle>
            <Tabs defaultValue="meetings" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="meetings">Meetings</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>
              <TabsContent value="meetings" className="mt-4 space-y-3">
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{meeting.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {meeting.organizer.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(meeting.startTime, 'HH:mm')} - {format(meeting.endTime, 'HH:mm')}
                        </p>
                      </div>
                      <Badge className="bg-primary/20 text-primary text-xs">
                        {meeting.type}
                      </Badge>
                    </div>
                    <Button size="sm" variant="ghost" className="mt-2 h-6 text-xs">
                      Go to link →
                    </Button>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="tasks" className="mt-4 space-y-3">
                {activeTasks.map((task) => (
                  <div key={task.id} className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {task.assignedTo.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due: {format(task.dueDate, 'MMM dd')}
                        </p>
                      </div>
                      <Badge 
                        variant={task.priority === 'High' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="events" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No upcoming events</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>

        {/* Average Team KPI Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Team KPI</CardTitle>
            <div className="text-3xl font-bold">70.32%</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              6% than last year
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={teamKPIData}>
                <defs>
                  <linearGradient id="kpiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="kpi" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#kpiGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Employment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Employment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{backgroundColor: 'hsl(var(--chart-1))'}} />
                    <span className="text-sm font-medium">Permanent</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">232</div>
                    <div className="text-xs text-muted-foreground">49%</div>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all"
                    style={{backgroundColor: 'hsl(var(--chart-1))', width: '49%'}}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{backgroundColor: 'hsl(var(--chart-2))'}} />
                    <span className="text-sm font-medium">Contract</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">112</div>
                    <div className="text-xs text-muted-foreground">31%</div>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all"
                    style={{backgroundColor: 'hsl(var(--chart-2))', width: '31%'}}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{backgroundColor: 'hsl(var(--chart-3))'}} />
                    <span className="text-sm font-medium">Probation</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">46</div>
                    <div className="text-xs text-muted-foreground">20%</div>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all"
                    style={{backgroundColor: 'hsl(var(--chart-3))', width: '20%'}}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-sm mb-3">Leave Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Annual Leave</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-muted-foreground">Sick Leave Used</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  Request Leave →
                </Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  Request Leave →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Search and List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">List Employees</CardTitle>
          <div className="flex gap-4 items-center mt-4">
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
                <SelectItem value="Management">Management</SelectItem>
                <SelectItem value="Academic">Academic</SelectItem>
                <SelectItem value="Kitchen">Kitchen</SelectItem>
                <SelectItem value="Service">Service</SelectItem>
                <SelectItem value="Administration">Administration</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                showStatus={true}
                showContact={false}
              />
            ))}
          </div>
          {filteredEmployees.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No employees found matching your criteria</p>
            </div>
          )}
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Showing 1-7 of {filteredEmployees.length}
          </div>
        </CardContent>
      </Card>

      {/* Additional Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((employee, index) => (
                <div key={employee.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-sm">{employee.performanceRating}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Employee Satisfaction */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Employee Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="text-muted stroke-current"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-primary stroke-current"
                    strokeWidth="3"
                    strokeDasharray="84, 100"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">84%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Overall satisfaction</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Work-life balance</span>
                <span className="font-medium">4.2/5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Management support</span>
                <span className="font-medium">4.0/5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Career development</span>
                <span className="font-medium">3.8/5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Compensation</span>
                <span className="font-medium">4.1/5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}