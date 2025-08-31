'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Target,
  AlertCircle,
  CheckCircle,
  Heart,
  Building2,
  HandHeart,
  Receipt,
  Wallet,
  PiggyBank,
  AlertTriangle,
  CreditCard,
  Percent,
  BarChart3,
  FileText
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Area, AreaChart } from "recharts";
import { donors, sponsorships, financialKPIs } from "@/lib/academic-data";

// Business & Financial KPIs for Madrasa
const madrasaBusinessMetrics = {
  totalStudents: 387,
  activeStudents: 362,
  monthlyRevenue: 645000,
  collectionRate: 89.5,
  sponsoredStudents: 156,
  totalDonorContributions: 850000,
  outstandingAmount: 68000,
  averageFeePerStudent: 3200,
  revenueGrowth: 12.3,
  donorRetentionRate: 94.2
};

// Monthly Financial Performance
const monthlyFinancialData = [
  { month: "Jan", revenue: 590000, collection: 91.2, sponsored: 145000, outstanding: 52000 },
  { month: "Feb", revenue: 615000, collection: 88.7, sponsored: 158000, outstanding: 69000 },
  { month: "Mar", revenue: 635000, collection: 92.1, sponsored: 162000, outstanding: 51000 },
  { month: "Apr", revenue: 645000, collection: 89.5, sponsored: 175000, outstanding: 68000 },
  { month: "May", revenue: 625000, collection: 87.3, sponsored: 168000, outstanding: 79000 },
  { month: "Jun", revenue: 645000, collection: 89.5, sponsored: 182000, outstanding: 68000 }
];

// Revenue Streams Analysis
const revenueStreams = [
  { stream: "Monthly Fees", amount: 580000, percentage: 73.2, growth: "+8.5%", color: "bg-green-500" },
  { stream: "Donor Contributions", amount: 89000, percentage: 11.2, growth: "+15.3%", color: "bg-blue-500" },
  { stream: "Registration Fees", amount: 67000, percentage: 8.4, growth: "+5.7%", color: "bg-purple-500" },
  { stream: "Books & Materials", amount: 45000, percentage: 5.7, growth: "+12.2%", color: "bg-orange-500" },
  { stream: "Special Programs", amount: 12000, percentage: 1.5, growth: "+3.1%", color: "bg-red-500" }
];

// Fee Collection Status by Program
const feeCollectionByProgram = [
  { program: "HIFZ", students: 198, collected: 594000, outstanding: 32000, rate: 94.9 },
  { program: "NAZRA", students: 89, collected: 178000, outstanding: 12000, rate: 93.7 },
  { program: "ALIM", students: 67, collected: 167500, outstanding: 18000, rate: 90.3 },
  { program: "FAZIL", students: 33, collected: 99000, outstanding: 6000, rate: 94.3 }
];

// Top Donors and Sponsors
const topDonorsData = [
  { name: "Muhammad Ahmed Foundation", students: 12, monthlyAmount: 36000, totalContributed: 432000, type: "Foundation" },
  { name: "Al-Khair Trust", students: 8, monthlyAmount: 24000, totalContributed: 288000, type: "Organization" },
  { name: "Zakat Foundation", students: 15, monthlyAmount: 45000, totalContributed: 540000, type: "Foundation" },
  { name: "Fatima Bibi", students: 3, monthlyAmount: 9000, totalContributed: 108000, type: "Individual" }
];

// Recent Financial Activities
const recentFinancialActivities = [
  { type: "payment", description: "Monthly fee collection - HIFZ Program", amount: 189000, time: "Today", status: "completed" },
  { type: "donation", description: "Al-Khair Trust - Quarterly Contribution", amount: 72000, time: "Yesterday", status: "received" },
  { type: "sponsorship", description: "New student sponsorship - Muhammad Foundation", amount: 3000, time: "2 days ago", status: "active" },
  { type: "overdue", description: "Follow-up required - 12 students", amount: 38000, time: "3 days ago", status: "pending" }
];

// Outstanding Analysis
const outstandingAnalysis = [
  { category: "1-30 days", amount: 28000, students: 8, percentage: 41.2 },
  { category: "31-60 days", amount: 22000, students: 4, percentage: 32.4 },
  { category: "61-90 days", amount: 12000, students: 2, percentage: 17.6 },
  { category: "90+ days", amount: 6000, students: 1, percentage: 8.8 }
];

const chartConfig = {
  revenue: {
    label: "Revenue (PKR)",
    color: "hsl(25 95% 53%)",
  },
  collection: {
    label: "Collection Rate %",
    color: "hsl(30 90% 60%)",
  },
  sponsored: {
    label: "Sponsored Amount (PKR)",
    color: "hsl(35 85% 65%)",
  },
  outstanding: {
    label: "Outstanding (PKR)",
    color: "hsl(0 70% 60%)",
  }
} satisfies ChartConfig;

export default function MadrasaDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-orange-500">Tahfeez Madrasa Business</h1>
          <p className="text-muted-foreground">Financial performance, fee collection, and donor management</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-orange-500 text-orange-500">
            <Building2 className="w-3 h-3 mr-1" />
            Business Operations
          </Badge>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Core Financial KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">₨ {madrasaBusinessMetrics.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600">+{madrasaBusinessMetrics.revenueGrowth}% this month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <Target className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{madrasaBusinessMetrics.collectionRate}%</div>
            <p className="text-xs text-green-600">Above 85% target</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Sponsored Students</CardTitle>
            <HandHeart className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{madrasaBusinessMetrics.sponsoredStudents}</div>
            <p className="text-xs text-muted-foreground">40% of total students</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{madrasaBusinessMetrics.activeStudents}</div>
            <p className="text-xs text-green-600">+23 new enrollments</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Financial KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Donor Contributions</CardTitle>
            <Heart className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">₨ {madrasaBusinessMetrics.totalDonorContributions.toLocaleString()}</div>
            <p className="text-xs text-green-600">Monthly total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">₨ {madrasaBusinessMetrics.outstandingAmount.toLocaleString()}</div>
            <p className="text-xs text-red-600">Needs follow-up</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Average Fee/Student</CardTitle>
            <Wallet className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-500">₨ {madrasaBusinessMetrics.averageFeePerStudent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Per month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Donor Retention</CardTitle>
            <PiggyBank className="w-4 h-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-500">{madrasaBusinessMetrics.donorRetentionRate}%</div>
            <p className="text-xs text-green-600">Excellent retention</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Performance Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Financial Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              Monthly Financial Performance
            </CardTitle>
            <CardDescription>Revenue, collection rate, and sponsored amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[300px]">
              <LineChart data={monthlyFinancialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(25 95% 53%)" strokeWidth={3} />
                <Line yAxisId="left" type="monotone" dataKey="collection" stroke="hsl(30 90% 60%)" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="sponsored" stroke="hsl(35 85% 65%)" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Revenue Streams */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              Revenue Streams
            </CardTitle>
            <CardDescription>Income sources breakdown and growth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueStreams.map((stream, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${stream.color}`}></div>
                      <span className="font-medium">{stream.stream}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">₨ {stream.amount.toLocaleString()}</span>
                      <span className="text-sm text-green-600 ml-2">{stream.growth}</span>
                    </div>
                  </div>
                  <Progress value={stream.percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground">{stream.percentage}% of total revenue</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Collection by Program & Top Donors */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Fee Collection by Program */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-orange-500" />
              Fee Collection by Program
            </CardTitle>
            <CardDescription>Collection performance across academic programs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feeCollectionByProgram.map((program) => (
                <div key={program.program} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{program.program}</h4>
                      <p className="text-sm text-muted-foreground">{program.students} students</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={program.rate > 90 ? 'default' : 'secondary'}>
                        {program.rate}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Collected:</span>
                      <div className="font-bold text-green-600">₨ {program.collected.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Outstanding:</span>
                      <div className="font-bold text-red-600">₨ {program.outstanding.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Donors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HandHeart className="h-5 w-5 text-orange-500" />
              Top Donors & Sponsors
            </CardTitle>
            <CardDescription>Major contributors and their impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDonorsData.map((donor, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{donor.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {donor.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{donor.students} students</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₨ {donor.monthlyAmount.toLocaleString()}/month</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Contributed:</span>
                    <span className="font-medium">₨ {donor.totalContributed.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Financial Activities & Outstanding Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Financial Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-orange-500" />
              Recent Financial Activities
            </CardTitle>
            <CardDescription>Latest payments, donations, and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentFinancialActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${
                      activity.type === 'payment' ? 'bg-green-500' :
                      activity.type === 'donation' ? 'bg-blue-500' :
                      activity.type === 'sponsorship' ? 'bg-purple-500' : 'bg-red-500'
                    }`}>
                      {activity.type === 'payment' ? '💰' : 
                       activity.type === 'donation' ? '❤️' :
                       activity.type === 'sponsorship' ? '🤝' : '⚠️'}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{activity.description}</div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      activity.status === 'completed' ? 'default' : 
                      activity.status === 'pending' ? 'destructive' : 'secondary'
                    }>
                      ₨ {activity.amount.toLocaleString()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Outstanding Payments Analysis
            </CardTitle>
            <CardDescription>Aging analysis of pending payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {outstandingAnalysis.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.category}</span>
                    <div className="text-right">
                      <span className="font-bold text-red-600">₨ {item.amount.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground ml-2">({item.students} students)</span>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}% of total outstanding</div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">Priority Action</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Focus on 1-30 days outstanding (₨ 28,000) for quick recovery.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Intelligence & Actions */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-orange-300/10 border-orange-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-500">
            <CheckCircle className="h-5 w-5" />
            Financial Management Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Button className="h-16 flex-col" variant="outline">
              <Receipt className="h-5 w-5 mb-1" />
              <span className="text-sm">Record Payment</span>
            </Button>
            <Button className="h-16 flex-col" variant="outline">
              <HandHeart className="h-5 w-5 mb-1" />
              <span className="text-sm">Add Donor</span>
            </Button>
            <Button className="h-16 flex-col" variant="outline">
              <AlertTriangle className="h-5 w-5 mb-1" />
              <span className="text-sm">Follow Up Overdue</span>
            </Button>
            <Button className="h-16 flex-col" variant="outline">
              <FileText className="h-5 w-5 mb-1" />
              <span className="text-sm">Financial Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}