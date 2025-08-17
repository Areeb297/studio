'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dumbbell,
  DollarSign, 
  TrendingUp, 
  Users, 
  Activity,
  Clock,
  Trophy,
  Heart,
  Target,
  Calendar,
  UserCheck,
  AlertCircle,
  PlusCircle,
  Timer
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Area, AreaChart } from "recharts";

// Gym Analytics Data
const gymMetrics = {
  monthlyRevenue: 890000,
  totalMembers: 245,
  activeMembers: 187,
  averageMembershipValue: 3500,
  memberRetentionRate: 82.5,
  equipmentUtilization: 78,
  classAttendance: 156,
  personalTrainers: 8
};

const membershipTrends = [
  { month: "Jan", newMembers: 12, revenue: 720000, retention: 85 },
  { month: "Feb", newMembers: 18, revenue: 780000, retention: 83 },
  { month: "Mar", newMembers: 22, revenue: 820000, retention: 86 },
  { month: "Apr", newMembers: 15, revenue: 890000, retention: 81 },
  { month: "May", newMembers: 25, revenue: 950000, retention: 84 },
  { month: "Jun", newMembers: 20, revenue: 890000, retention: 82 },
];

const membershipPlans = [
  { plan: "Basic Monthly", price: 2500, members: 89, revenue: 222500, popularity: 76 },
  { plan: "Premium Monthly", price: 4500, members: 67, revenue: 301500, popularity: 58 },
  { plan: "VIP Monthly", price: 7500, members: 34, revenue: 255000, popularity: 92 },
  { plan: "Annual Basic", price: 25000, members: 28, revenue: 700000, popularity: 45 },
  { plan: "Annual Premium", price: 45000, members: 27, revenue: 1215000, popularity: 87 },
];

const equipmentUsage = [
  { equipment: "Treadmills", utilization: 92, condition: "Excellent", lastService: "2024-01-15" },
  { equipment: "Dumbbells", utilization: 87, condition: "Good", lastService: "2024-01-10" },
  { equipment: "Rowing Machine", utilization: 65, condition: "Good", lastService: "2024-01-20" },
  { equipment: "Elliptical", utilization: 78, condition: "Fair", lastService: "2023-12-28" },
  { equipment: "Strength Machines", utilization: 81, condition: "Excellent", lastService: "2024-01-18" },
];

const fitnessClasses = [
  { 
    class: "Morning Yoga", 
    instructor: "Aisha Khan", 
    time: "7:00 AM", 
    capacity: 20, 
    enrolled: 18,
    rating: 4.8 
  },
  { 
    class: "HIIT Training", 
    instructor: "Ahmed Ali", 
    time: "6:00 PM", 
    capacity: 15, 
    enrolled: 15,
    rating: 4.9 
  },
  { 
    class: "Strength Building", 
    instructor: "Hassan Sheikh", 
    time: "8:00 AM", 
    capacity: 12, 
    enrolled: 10,
    rating: 4.7 
  },
  { 
    class: "Cardio Blast", 
    instructor: "Fatima Malik", 
    time: "5:30 PM", 
    capacity: 25, 
    enrolled: 22,
    rating: 4.6 
  },
];

const recentActivities = [
  { member: "Ali Hassan", activity: "Completed 5km run", time: "2 hours ago", achievement: "New PR!" },
  { member: "Sara Ahmed", activity: "Attended Yoga class", time: "3 hours ago", achievement: "10th class" },
  { member: "Omar Khan", activity: "Bench Press 80kg", time: "5 hours ago", achievement: "Personal Best" },
  { member: "Zainab Ali", activity: "HIIT Training session", time: "1 day ago", achievement: "Week streak" },
  { member: "Hassan Malik", activity: "Weight loss milestone", time: "2 days ago", achievement: "5kg lost" },
];

const chartConfig = {
  newMembers: {
    label: "New Members",
    color: "#3b82f6",
  },
  revenue: {
    label: "Revenue (PKR)",
    color: "#1d4ed8",
  },
  retention: {
    label: "Retention %",
    color: "#60a5fa",
  }
} satisfies ChartConfig;

export default function GymTimeDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Gym Time</h1>
          <p className="text-muted-foreground">Fitness center management and member analytics</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Member
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">PKR {gymMetrics.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-blue-600">+14.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="w-4 h-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gymMetrics.activeMembers}/{gymMetrics.totalMembers}</div>
            <p className="text-xs text-cyan-600">76% activity rate</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <Trophy className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gymMetrics.memberRetentionRate}%</div>
            <p className="text-xs text-indigo-600">Above industry average</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-sky-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Equipment Usage</CardTitle>
            <Activity className="w-4 h-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gymMetrics.equipmentUtilization}%</div>
            <p className="text-xs text-sky-600">Optimal utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Membership Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Membership Growth & Revenue
            </CardTitle>
            <CardDescription>Monthly member acquisition and revenue trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[300px]">
              <AreaChart data={membershipTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" tickFormatter={(value) => `${value/1000}k`} />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Line yAxisId="right" type="monotone" dataKey="newMembers" stroke="#1d4ed8" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Membership Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Membership Plans Performance
            </CardTitle>
            <CardDescription>Revenue by membership type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[300px]">
              <BarChart data={membershipPlans}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="plan" angle={-45} textAnchor="end" height={80} />
                <YAxis tickFormatter={(value) => `${value/1000}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Equipment & Classes */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Equipment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-blue-600" />
              Equipment Utilization
            </CardTitle>
            <CardDescription>Equipment usage and maintenance status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {equipmentUsage.map((item) => (
                <div key={item.equipment} className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{item.equipment}</h4>
                      <p className="text-sm text-muted-foreground">Last service: {item.lastService}</p>
                    </div>
                    <Badge 
                      variant={item.condition === 'Excellent' ? 'default' : item.condition === 'Good' ? 'secondary' : 'destructive'}
                      className={
                        item.condition === 'Excellent' ? 'bg-green-500/20 text-green-700' :
                        item.condition === 'Good' ? 'bg-blue-500/20 text-blue-700' :
                        'bg-yellow-500/20 text-yellow-700'
                      }
                    >
                      {item.condition}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${item.utilization}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-blue-600 mt-1">{item.utilization}% utilization</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fitness Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Fitness Classes
            </CardTitle>
            <CardDescription>Today's class schedule and enrollment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fitnessClasses.map((cls) => (
                <div key={cls.class} className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{cls.class}</h4>
                      <p className="text-sm text-muted-foreground">Instructor: {cls.instructor}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-blue-600" />
                        <span className="text-sm text-blue-600">{cls.time}</span>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-red-500" />
                          <span className="text-sm">{cls.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{cls.enrolled}/{cls.capacity}</div>
                      <div className="text-xs text-muted-foreground">enrolled</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${(cls.enrolled / cls.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Member Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            Recent Member Activities
          </CardTitle>
          <CardDescription>Latest achievements and workout milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                    {activity.member.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium">{activity.member}</div>
                    <div className="text-sm text-muted-foreground">{activity.activity}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-yellow-500/20 text-yellow-700 mb-1">
                    {activity.achievement}
                  </Badge>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Activity className="h-5 w-5" />
            AI-Powered Fitness Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-semibold text-blue-700 mb-2">Member Retention Alert</h4>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-blue-600">15 members</span> showing low activity patterns. 
                Recommend personalized workout plans and check-ins to improve retention.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-semibold text-blue-700 mb-2">Equipment Optimization</h4>
              <p className="text-sm text-muted-foreground">
                Peak hours are 6-8 PM. Consider adding <span className="font-medium text-blue-600">2 more treadmills</span> 
                to reduce wait times and improve member satisfaction.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}