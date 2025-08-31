'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Users, 
  Target,
  AlertCircle,
  CheckCircle,
  HandHeart,
  Wallet,
  PiggyBank,
  CreditCard,
  Receipt,
  Percent
} from "lucide-react";
import { financialKPIs } from "@/lib/academic-data";

interface FinancialKPICardsProps {
  className?: string;
  showDetailed?: boolean;
}

export function FinancialKPICards({ className, showDetailed = false }: FinancialKPICardsProps) {
  // Calculate additional metrics
  const collectionEfficiency = (financialKPIs.totalMonthlyRevenue - financialKPIs.outstandingAmount) / financialKPIs.totalMonthlyRevenue * 100;
  const sponsorshipPercentage = (financialKPIs.sponsoredStudents / financialKPIs.totalStudents) * 100;
  const revenuePerStudent = financialKPIs.totalMonthlyRevenue / financialKPIs.activeStudents;

  const kpiData = [
    {
      title: "Total Students",
      value: financialKPIs.totalStudents.toString(),
      subValue: `${financialKPIs.activeStudents} active`,
      change: "+5.2%",
      trend: "up",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-l-primary"
    },
    {
      title: "Monthly Revenue",
      value: `₨ ${(financialKPIs.totalMonthlyRevenue / 1000).toFixed(0)}K`,
      subValue: `₨ ${financialKPIs.totalMonthlyRevenue.toLocaleString()}`,
      change: "+12.3%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-l-green-500"
    },
    {
      title: "Collection Rate",
      value: `${financialKPIs.collectionRate}%`,
      subValue: "Above 85% target",
      change: "+2.1%",
      trend: "up",
      icon: Target,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-l-accent"
    },
    {
      title: "Outstanding Amount",
      value: `₨ ${(financialKPIs.outstandingAmount / 1000).toFixed(0)}K`,
      subValue: `${((financialKPIs.outstandingAmount / financialKPIs.totalMonthlyRevenue) * 100).toFixed(1)}% of revenue`,
      change: "-8.7%",
      trend: "down",
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      borderColor: "border-l-yellow-500"
    }
  ];

  const detailedKPIs = [
    {
      title: "Sponsored Students",
      value: financialKPIs.sponsoredStudents.toString(),
      subValue: `${sponsorshipPercentage.toFixed(1)}% of total`,
      change: "+15.4%",
      trend: "up",
      icon: HandHeart,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-l-purple-500"
    },
    {
      title: "Donor Contributions",
      value: `₨ ${(financialKPIs.totalDonorContributions / 1000).toFixed(0)}K`,
      subValue: "Monthly total",
      change: "+18.9%",
      trend: "up",
      icon: PiggyBank,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-l-blue-500"
    },
    {
      title: "Average Fee/Student",
      value: `₨ ${financialKPIs.averageFeePerStudent.toLocaleString()}`,
      subValue: "Per month",
      change: "+3.2%",
      trend: "up",
      icon: Wallet,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
      borderColor: "border-l-indigo-500"
    },
    {
      title: "Revenue/Student",
      value: `₨ ${revenuePerStudent.toFixed(0)}`,
      subValue: "Monthly average",
      change: "+7.1%",
      trend: "up",
      icon: CreditCard,
      color: "text-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-950/20",
      borderColor: "border-l-teal-500"
    }
  ];

  const allKPIs = showDetailed ? [...kpiData, ...detailedKPIs] : kpiData;

  return (
    <div className={className}>
      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {allKPIs.map((kpi, index) => (
          <Card key={index} className={`relative overflow-hidden border-l-4 ${kpi.borderColor} hover:shadow-md transition-shadow`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="text-xs text-muted-foreground">{kpi.subValue}</div>
                <div className={`text-sm flex items-center ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {kpi.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Financial Health Summary */}
      <Card className="mt-6 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <CheckCircle className="h-5 w-5" />
            Financial Health Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Collection Efficiency */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Collection Efficiency</span>
                <span className="text-sm font-bold text-primary">{collectionEfficiency.toFixed(1)}%</span>
              </div>
              <Progress value={collectionEfficiency} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Excellent collection performance - well above industry standard of 80%
              </p>
            </div>

            {/* Sponsorship Coverage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sponsorship Coverage</span>
                <span className="text-sm font-bold text-accent">{sponsorshipPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={sponsorshipPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Strong donor support - {financialKPIs.sponsoredStudents} students receive sponsorship
              </p>
            </div>

            {/* Revenue Growth */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Revenue Growth</span>
                <span className="text-sm font-bold text-green-600">+12.3%</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Consistent growth trajectory with strong enrollment and donor support
              </p>
            </div>
          </div>

          {/* Key Insights */}
          <div className="mt-6 p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-primary/10">
            <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Key Financial Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Badge variant="outline" className="mb-2 border-green-500 text-green-700">
                  Positive Trend
                </Badge>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Collection rate exceeds 85% target</li>
                  <li>• Strong donor retention and growth</li>
                  <li>• Healthy revenue per student ratio</li>
                </ul>
              </div>
              <div>
                <Badge variant="outline" className="mb-2 border-yellow-500 text-yellow-700">
                  Areas for Attention
                </Badge>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Outstanding amount needs follow-up</li>
                  <li>• Opportunity to expand sponsorship program</li>
                  <li>• Consider automated payment reminders</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
