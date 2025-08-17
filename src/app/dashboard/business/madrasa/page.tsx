'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap,
  DollarSign, 
  TrendingUp, 
  Users, 
  BookOpen,
  Clock,
  Trophy,
  Star,
  Calendar,
  UserCheck,
  AlertCircle,
  PlusCircle,
  Award,
  Target,
  CheckCircle,
  Heart,
  Building2,
  ScrollText,
  BookMarked,
  
  TrendingDown,
  Activity,
  Timer,
  Percent
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Area, AreaChart, Pie, PieChart, Cell } from "recharts";

// Comprehensive Islamic Education Analytics Data
const madrasaMetrics = {
  totalStudents: 387,
  activeStudents: 362,
  totalTeachers: 24,
  monthlyFeeCollection: 645000,
  averageJuzzCompleted: 8.4,
  hifzCompletionRate: 78.5,
  averageAttendance: 94.2,
  prayerAttendance: 89.6,
  parentSatisfaction: 4.6,
  staffRetention: 92.3,
  scholarshipStudents: 67,
  graduatedHuffaz: 23
};

// Quran Memorization Progress Data
const quranProgressData = [
  { juzz: "Juzz 1", completed: 95, inProgress: 8, total: 103 },
  { juzz: "Juzz 2", completed: 89, inProgress: 12, total: 101 },
  { juzz: "Juzz 3", completed: 82, inProgress: 15, total: 97 },
  { juzz: "Juzz 4", completed: 78, inProgress: 11, total: 89 },
  { juzz: "Juzz 5", completed: 71, inProgress: 9, total: 80 },
  { juzz: "Last 10", completed: 23, inProgress: 12, total: 35 }
];

// Hadith Memorization Progress
const hadithProgress = [
  { collection: "40 Nawawi", students: 145, completed: 89, percentage: 61.4 },
  { collection: "Riyad as-Salihin", students: 89, completed: 67, percentage: 75.3 },
  { collection: "Sahih Bukhari (Selected)", students: 67, completed: 34, percentage: 50.7 },
  { collection: "Sahih Muslim (Selected)", students: 45, completed: 23, percentage: 51.1 }
];

// Student Performance by Age Group
const ageGroupPerformance = [
  { ageGroup: "5-8 years", students: 89, averageProgress: 65, attendance: 92 },
  { ageGroup: "9-12 years", students: 134, averageProgress: 78, attendance: 95 },
  { ageGroup: "13-16 years", students: 112, averageProgress: 84, attendance: 93 },
  { ageGroup: "17+ years", students: 52, averageProgress: 91, attendance: 97 }
];

// Monthly Academic Progress
const monthlyProgress = [
  { month: "Jan", newHifz: 3, juzzCompleted: 234, attendance: 93.5, fees: 590000 },
  { month: "Feb", newHifz: 2, juzzCompleted: 267, attendance: 94.2, fees: 615000 },
  { month: "Mar", newHifz: 4, juzzCompleted: 289, attendance: 92.8, fees: 635000 },
  { month: "Apr", newHifz: 5, juzzCompleted: 312, attendance: 95.1, fees: 645000 },
  { month: "May", newHifz: 3, juzzCompleted: 298, attendance: 93.9, fees: 625000 },
  { month: "Jun", newHifz: 6, juzzCompleted: 334, attendance: 94.2, fees: 645000 }
];

// Individual Student Progress (Top Performers)
const topStudents = [
  { name: "Ahmad Ali", class: "Hifz Advanced", juzzCompleted: 28, hafithProgress: 93.3, attendance: 98, trend: "up" },
  { name: "Fatima Hassan", class: "Hifz Intermediate", juzzCompleted: 22, hafithProgress: 73.3, attendance: 97, trend: "up" },
  { name: "Muhammad Omar", class: "Hifz Advanced", juzzCompleted: 27, hafithProgress: 90.0, attendance: 95, trend: "stable" },
  { name: "Aisha Khan", class: "Nazra Advanced", juzzCompleted: 15, hafithProgress: 50.0, attendance: 99, trend: "up" },
  { name: "Abdullah Sheikh", class: "Hifz Advanced", juzzCompleted: 29, hafithProgress: 96.7, attendance: 94, trend: "up" }
];

// Class Distribution and Performance
const classPerformance = [
  { class: "Hifz-e-Quran", students: 127, avgProgress: 68.5, fees: 190500, completion: 78, color: "hsl(25 95% 53%)" },
  { class: "Nazra Quran", students: 89, avgProgress: 82.3, fees: 133500, completion: 92, color: "hsl(30 90% 60%)" },
  { class: "Islamic Studies", students: 98, avgProgress: 76.8, fees: 147000, completion: 85, color: "hsl(35 85% 65%)" },
  { class: "Arabic Language", students: 73, avgProgress: 71.2, fees: 109500, completion: 88, color: "hsl(40 80% 70%)" }
];

// Staff Performance and Monitoring
const staffPerformance = [
  { name: "Qari Abdullah Mahmood", role: "Senior Hifz Teacher", students: 32, rating: 4.9, experience: "18 years", hifzGraduated: 47 },
  { name: "Ustadha Khadija Ahmad", role: "Nazra Specialist", students: 28, rating: 4.8, experience: "12 years", hifzGraduated: 0 },
  { name: "Ustadh Hassan Ali", role: "Islamic Studies", students: 35, rating: 4.7, experience: "15 years", hifzGraduated: 0 },
  { name: "Qari Muhammad Yusuf", role: "Hifz Teacher", students: 25, rating: 4.9, experience: "10 years", hifzGraduated: 23 },
  { name: "Teacher Fatima Zahra", role: "Arabic Language", students: 30, rating: 4.6, experience: "8 years", hifzGraduated: 0 }
];

// Recent Islamic Achievements
const recentAchievements = [
  { student: "Abdullah Malik", achievement: "Completed Full Hifz (30 Juzz)", date: "2024-01-28", milestone: "Hafiz" },
  { student: "Zainab Fatima", achievement: "Mastered 40 Hadith Nawawi", date: "2024-01-26", milestone: "Hadith" },
  { student: "Muhammad Usman", achievement: "Perfect Tajweed Evaluation", date: "2024-01-24", milestone: "Tajweed" },
  { student: "Aisha Siddiqui", achievement: "Arabic Grammar Excellence", date: "2024-01-22", milestone: "Arabic" },
  { student: "Ali Hassan", achievement: "25 Juzz Memorization", date: "2024-01-20", milestone: "Progress" },
  { student: "Hafsa Ahmed", achievement: "6 Months Perfect Attendance", date: "2024-01-18", milestone: "Attendance" }
];

// Business Revenue Streams
const revenueStreams = [
  { stream: "Monthly Fees", amount: 580000, percentage: 73.2, growth: "+8.5%" },
  { stream: "Registration Fees", amount: 89000, percentage: 11.2, growth: "+12.3%" },
  { stream: "Books & Materials", amount: 67000, percentage: 8.4, growth: "+5.7%" },
  { stream: "Special Programs", amount: 45000, percentage: 5.7, growth: "+15.2%" },
  { stream: "Donations", amount: 12000, percentage: 1.5, growth: "+3.1%" }
];

const chartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(25 95% 53%)",
  },
  inProgress: {
    label: "In Progress", 
    color: "hsl(30 90% 60%)",
  },
  attendance: {
    label: "Attendance %",
    color: "hsl(35 85% 65%)",
  },
  fees: {
    label: "Fee Collection (PKR)",
    color: "hsl(40 80% 70%)",
  }
} satisfies ChartConfig;

export default function MadrasaDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-orange-500">Tahfeez Madrasa</h1>
          <p className="text-muted-foreground">Comprehensive Islamic education management and student progress tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-orange-500 text-orange-500">
            <Building2 className="w-3 h-3 mr-1" />
            Islamic Education
          </Badge>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Core Islamic Education KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{madrasaMetrics.activeStudents}/{madrasaMetrics.totalStudents}</div>
            <p className="text-xs text-green-600">94% attendance rate</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-400">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Avg Juzz Memorized</CardTitle>
            <BookOpen className="w-4 h-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{madrasaMetrics.averageJuzzCompleted}</div>
            <p className="text-xs text-green-600">Per student progress</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Hifz Completion Rate</CardTitle>
            <Trophy className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{madrasaMetrics.hifzCompletionRate}%</div>
            <p className="text-xs text-green-600">Above industry standard</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Monthly Fees</CardTitle>
            <DollarSign className="w-4 h-4 text-orange-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {madrasaMetrics.monthlyFeeCollection.toLocaleString()}</div>
            <p className="text-xs text-green-600">+4.2% this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Islamic Education KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Graduated Huffaz</CardTitle>
            <Award className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{madrasaMetrics.graduatedHuffaz}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Prayer Attendance</CardTitle>
            <Building2 className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{madrasaMetrics.prayerAttendance}%</div>
            <p className="text-xs text-green-600">Daily Salah participation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Parent Satisfaction</CardTitle>
            <Heart className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{madrasaMetrics.parentSatisfaction}/5.0</div>
            <p className="text-xs text-green-600">Excellent rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Scholarship Students</CardTitle>
            <GraduationCap className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{madrasaMetrics.scholarshipStudents}</div>
            <p className="text-xs text-muted-foreground">17% of total students</p>
          </CardContent>
        </Card>
      </div>

      {/* Quran & Academic Progress Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quran Memorization Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-orange-500" />
              Quran Memorization Progress
            </CardTitle>
            <CardDescription>Student progress across different Juzz (sections)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[300px]">
              <BarChart data={quranProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="juzz" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completed" fill="hsl(25 95% 53%)" radius={4} />
                <Bar dataKey="inProgress" fill="hsl(30 90% 60%)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Class Performance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-orange-500" />
              Class Performance
            </CardTitle>
            <CardDescription>Student distribution by class</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[300px]">
              <PieChart>
                <Pie
                  data={classPerformance}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="students"
                  label={({ class: className, students }) => `${className}: ${students}`}
                >
                  {classPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Academic Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            Monthly Academic Performance & Financial Trends
          </CardTitle>
          <CardDescription>Hifz graduates, Juzz completion, attendance, and fee collection</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="w-full h-[350px]">
            <LineChart data={monthlyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line yAxisId="left" type="monotone" dataKey="juzzCompleted" stroke="hsl(25 95% 53%)" strokeWidth={3} />
              <Line yAxisId="left" type="monotone" dataKey="newHifz" stroke="hsl(30 90% 60%)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="fees" stroke="hsl(35 85% 65%)" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Student Performance & Staff Management */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Performing Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-orange-500" />
              Top Performing Students
            </CardTitle>
            <CardDescription>Highest achieving students in Hifz program</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStudents.map((student, index) => (
                <div key={student.name} className="flex items-center justify-between p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-orange-500">#{index + 1}</div>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-xs text-muted-foreground">{student.class}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{student.juzzCompleted}/30 Juzz</div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-orange-500">{student.hafithProgress.toFixed(1)}% Hifz</span>
                      {student.trend === 'up' ? <TrendingUp className="h-3 w-3 text-green-500" /> : 
                       student.trend === 'down' ? <TrendingDown className="h-3 w-3 text-red-500" /> : 
                       <div className="h-3 w-3 rounded-full bg-yellow-500"></div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hadith Memorization Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-orange-500" />
              Hadith Memorization Progress
            </CardTitle>
            <CardDescription>Progress in various Hadith collections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hadithProgress.map((hadith) => (
                <div key={hadith.collection} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{hadith.collection}</span>
                    <div className="text-right">
                      <div className="text-sm font-bold">{hadith.completed}/{hadith.students}</div>
                      <div className="text-xs text-muted-foreground">{hadith.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                  <Progress value={hadith.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Performance & Recent Achievements */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Staff Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-orange-500" />
              Teaching Staff Performance
            </CardTitle>
            <CardDescription>Faculty ratings and student outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {staffPerformance.slice(0, 4).map((staff) => (
                <div key={staff.name} className="p-3 rounded-lg border bg-gradient-to-r from-orange-500/5 to-orange-300/5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{staff.name}</h4>
                      <p className="text-sm text-muted-foreground">{staff.role}</p>
                      <p className="text-xs text-muted-foreground">{staff.experience} experience</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{staff.rating}</span>
                      </div>
                      <div className="text-sm text-orange-500">{staff.students} students</div>
                      {staff.hifzGraduated > 0 && (
                        <div className="text-xs text-green-600">{staff.hifzGraduated} Huffaz graduated</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Islamic Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-orange-500" />
              Recent Islamic Achievements
            </CardTitle>
            <CardDescription>Latest student milestones and accomplishments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-orange-500/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs">
                      {achievement.milestone === 'Hafiz' ? '🏆' : 
                       achievement.milestone === 'Hadith' ? '📜' :
                       achievement.milestone === 'Tajweed' ? '🎵' :
                       achievement.milestone === 'Arabic' ? '📚' : '⭐'}
                    </div>
                    <div>
                      <div className="font-medium">{achievement.student}</div>
                      <div className="text-sm text-muted-foreground">{achievement.achievement}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500/20 text-green-700 mb-1">
                      {achievement.milestone}
                    </Badge>
                    <div className="text-xs text-muted-foreground">{achievement.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Streams Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-orange-500" />
            Revenue Streams & Business Performance
          </CardTitle>
          <CardDescription>Financial performance across different income sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            {revenueStreams.map((stream) => (
              <div key={stream.stream} className="text-center p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
                <div className="text-lg font-bold text-orange-500">PKR {(stream.amount / 1000).toFixed(0)}K</div>
                <div className="text-sm font-medium">{stream.stream}</div>
                <div className="text-xs text-muted-foreground">{stream.percentage}% of total</div>
                <div className="text-xs text-green-600 font-medium mt-1">{stream.growth}</div>
                <Progress value={stream.percentage * 5} className="mt-2 h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights for Islamic Education */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-orange-300/10 border-orange-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-500">
            <CheckCircle className="h-5 w-5" />
            AI-Powered Islamic Education Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-semibold text-orange-500 mb-2">Hifz Progress Alert</h4>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-orange-500">15 students</span> in advanced Hifz showing slower 
                progress. Recommend additional Muraja'ah sessions and one-on-one guidance.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-semibold text-orange-500 mb-2">Fee Collection Optimization</h4>
              <p className="text-sm text-muted-foreground">
                Monthly fee collection at 89%. Consider implementing 
                <span className="font-medium text-orange-500"> automated reminders</span> to improve collection rate.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-semibold text-orange-500 mb-2">Teaching Efficiency</h4>
              <p className="text-sm text-muted-foreground">
                Student-teacher ratio optimal at 16:1. <span className="font-medium text-orange-500">Qari Abdullah</span> 
                achieves highest Hifz graduation rate - consider mentoring program.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}