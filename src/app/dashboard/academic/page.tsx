'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CheckCircle, 
  AlertCircle,
  UserCheck,
  Calendar,
  Heart,
  FileText,
  UserPlus,
  CreditCard,
  Wallet,
  HandHeart,
  Target,
  PiggyBank,
  AlertTriangle,
  Receipt,
  Building2
} from "lucide-react";
import { donors, sponsorships, financialKPIs } from "@/lib/academic-data";
import { DonorSponsorshipTracker } from "@/components/donor-sponsorship-tracker";
import { FinancialKPICards } from "@/components/financial-kpi-cards";

export default function AcademicPage() {
  // Financial KPIs - Business focused
  const financialStats = [
    {
      title: "Total Students",
      value: "387",
      change: "+23 this month",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "Monthly Revenue",
      value: "₨ 1,245,000",
      change: "+12.3%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      title: "Collection Rate",
      value: "89.5%",
      change: "+4.2%",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      title: "Sponsored Students",
      value: "156",
      change: "40% of total",
      icon: HandHeart,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20"
    }
  ];

  // Fee Collection Status
  const feeCollectionStatus = [
    { status: "Paid", count: 298, percentage: 77, amount: 954000, color: "bg-green-500" },
    { status: "Sponsored", count: 56, percentage: 14, amount: 189000, color: "bg-blue-500" },
    { status: "Partial", count: 21, percentage: 5, amount: 67000, color: "bg-yellow-500" },
    { status: "Overdue", count: 12, percentage: 3, amount: 35000, color: "bg-red-500" }
  ];

  // Recent Financial Activities
  const recentActivities = [
    { 
      type: "payment", 
      description: "Muhammad Abdullah - Fee Paid", 
      amount: "₨ 3,000", 
      donor: "Muhammad Ahmed Foundation",
      time: "2 hours ago",
      status: "sponsored"
    },
    { 
      type: "enrollment", 
      description: "New Student: Fatima Khan", 
      amount: "₨ 2,500/month", 
      time: "5 hours ago",
      status: "direct"
    },
    { 
      type: "donation", 
      description: "Al-Khair Trust Payment", 
      amount: "₨ 24,000", 
      time: "1 day ago",
      status: "sponsored",
      note: "For 8 students"
    },
    { 
      type: "overdue", 
      description: "Ahmed Ali - Payment Overdue", 
      amount: "₨ 2,000", 
      time: "2 days ago",
      status: "overdue"
    }
  ];

  // Top Donors
  const topDonors = [
    { 
      name: "Muhammad Ahmed Foundation", 
      students: 12, 
      monthlyContribution: 36000, 
      totalContributed: 432000,
      type: "Foundation",
      status: "active"
    },
    { 
      name: "Al-Khair Trust", 
      students: 8, 
      monthlyContribution: 24000, 
      totalContributed: 288000,
      type: "Organization",
      status: "active"
    },
    { 
      name: "Fatima Bibi", 
      students: 3, 
      monthlyContribution: 9000, 
      totalContributed: 108000,
      type: "Individual",
      status: "active"
    },
    { 
      name: "Zakat Foundation", 
      students: 15, 
      monthlyContribution: 45000, 
      totalContributed: 540000,
      type: "Foundation",
      status: "active"
    }
  ];

  // Outstanding Payments by Program
  const outstandingByProgram = [
    { program: "HIFZ", outstanding: 45000, students: 8, color: "bg-green-500" },
    { program: "NAZRA", outstanding: 12000, students: 3, color: "bg-blue-500" },
    { program: "ALIM", outstanding: 8000, students: 2, color: "bg-purple-500" },
    { program: "FAZIL", outstanding: 3000, students: 1, color: "bg-orange-500" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Fee Collection Management</h1>
          <p className="text-muted-foreground">Student fee collection, payment tracking, and donor sponsorship management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Receipt className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Fee Reports
          </Button>
          <Button>
            <HandHeart className="h-4 w-4 mr-2" />
            Add Donor
          </Button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <FinancialKPICards showDetailed={false} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fee Collection Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Fee Collection Overview
            </CardTitle>
            <CardDescription>
              Current month payment status breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feeCollectionStatus.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="font-medium">{item.status}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{item.count} students</span>
                      <span className="text-sm text-muted-foreground ml-2">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>₨ {item.amount.toLocaleString()}</span>
                    <span className="text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-600">Collection Performance</span>
              </div>
              <p className="text-sm text-muted-foreground">
                89.5% collection rate exceeds target of 85%. Outstanding amount: ₨ 156,000
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Financial Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest payments and enrollments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                      {activity.donor && (
                        <p className="text-xs text-blue-600">by {activity.donor}</p>
                      )}
                      {activity.note && (
                        <p className="text-xs text-muted-foreground">{activity.note}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        activity.status === 'sponsored' ? 'default' : 
                        activity.status === 'overdue' ? 'destructive' : 'secondary'
                      }>
                        {activity.amount}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="w-full mt-4" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Donors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HandHeart className="h-5 w-5 text-primary" />
              Top Donors & Sponsors
            </CardTitle>
            <CardDescription>
              Major contributors supporting student education
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDonors.map((donor, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-sm">{donor.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {donor.type}
                        </Badge>
                        <Badge variant={donor.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {donor.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-green-600">₨ {donor.monthlyContribution.toLocaleString()}/month</p>
                      <p className="text-xs text-muted-foreground">{donor.students} students</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Total Contributed:</span>
                    <span className="font-medium">₨ {donor.totalContributed.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Donor Impact</span>
              </div>
              <p className="text-xs text-muted-foreground">
                156 students (40%) receive full or partial sponsorship from generous donors.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Outstanding Payments by Program */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Outstanding Payments
            </CardTitle>
            <CardDescription>
              Pending payments breakdown by academic program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {outstandingByProgram.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="font-medium">{item.program}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-red-600">₨ {item.outstanding.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground ml-2">({item.students} students)</span>
                    </div>
                  </div>
                  <Progress value={(item.outstanding / 68000) * 100} className="h-2" />
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">Action Required</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Total outstanding: ₨ 68,000 from 14 students. Follow-up needed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Collection Actions - Most Important Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Fee Collection Management
          </CardTitle>
          <CardDescription>
            Core fee collection tools and donor management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col" variant="outline">
              <Receipt className="h-6 w-6 mb-2" />
              <span className="text-sm">Record Payment</span>
            </Button>
            <Button className="h-20 flex-col" variant="outline">
              <AlertTriangle className="h-6 w-6 mb-2" />
              <span className="text-sm">Follow Up Overdue</span>
            </Button>
            <Button className="h-20 flex-col" variant="outline">
              <HandHeart className="h-6 w-6 mb-2" />
              <span className="text-sm">Add Donor</span>
            </Button>
            <Button className="h-20 flex-col" variant="outline">
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-sm">Fee Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Donor-Student Sponsorship Tracking */}
      <DonorSponsorshipTracker />
    </div>
  );
}