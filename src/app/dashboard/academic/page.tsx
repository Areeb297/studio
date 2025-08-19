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
  Clock, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  UserCheck,
  Calendar,
  Award,
  FileText,
  UserPlus,
  BarChart3,
  School,
  Target,
  Star
} from "lucide-react";

export default function AcademicPage() {
  const academicStats = [
    {
      title: "Total Students",
      value: "2,847",
      change: "+127",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "Fee Collection",
      value: "₨ 14,567,890",
      change: "+8.5%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      title: "Attendance Rate",
      value: "92.4%",
      change: "+2.1%",
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      title: "Active Classes",
      value: "156",
      change: "+12",
      icon: School,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20"
    }
  ];

  const classDistribution = [
    { level: "Hifz-e-Quran", students: 987, percentage: 35, color: "bg-green-500" },
    { level: "Qirat & Tajweed", students: 654, percentage: 23, color: "bg-blue-500" },
    { level: "Islamic Studies", students: 542, percentage: 19, color: "bg-purple-500" },
    { level: "Arabic Language", students: 398, percentage: 14, color: "bg-orange-500" },
    { level: "Advanced Studies", students: 266, percentage: 9, color: "bg-red-500" }
  ];

  const recentEnrollments = [
    { student: "Muhammad Hassan", class: "Hifz-e-Quran Level 3", guardian: "Ahmed Hassan", status: "confirmed" },
    { student: "Fatima Khan", class: "Qirat & Tajweed", guardian: "Omar Khan", status: "pending" },
    { student: "Ali Rahman", class: "Islamic Studies", guardian: "Abdullah Rahman", status: "confirmed" },
    { student: "Aisha Malik", class: "Arabic Language", guardian: "Yusuf Malik", status: "confirmed" },
    { student: "Ibrahim Sheikh", class: "Advanced Studies", guardian: "Hassan Sheikh", status: "pending" }
  ];

  const feeStatus = [
    { month: "January 2025", collected: 2456780, pending: 234560, total: 2691340 },
    { month: "February 2025", collected: 2387450, pending: 456780, total: 2844230 },
    { month: "March 2025", collected: 2567890, pending: 123450, total: 2691340 }
  ];

  const topPerformers = [
    { name: "Muhammad Usman", class: "Hifz Level 5", completion: 95, rank: 1 },
    { name: "Fatima Bibi", class: "Qirat Advanced", completion: 93, rank: 2 },
    { name: "Ahmed Ali", class: "Islamic Studies", completion: 91, rank: 3 },
    { name: "Khadija Sheikh", class: "Arabic Advanced", completion: 89, rank: 4 }
  ];

  const upcomingExams = [
    { subject: "Hifz Completion Test", date: "March 15, 2025", students: 45, type: "Major" },
    { subject: "Qirat Assessment", date: "March 20, 2025", students: 78, type: "Regular" },
    { subject: "Arabic Grammar", date: "March 25, 2025", students: 92, type: "Regular" },
    { subject: "Islamic History", date: "March 30, 2025", students: 156, type: "Major" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Academic Management</h1>
          <p className="text-muted-foreground">Comprehensive Islamic education management system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <UserPlus className="h-4 w-4 mr-2" />
            New Enrollment
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Award className="h-4 w-4 mr-2" />
            Issue Certificate
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {academicStats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Student Distribution by Class Level
            </CardTitle>
            <CardDescription>
              Enrollment breakdown across different Islamic education programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classDistribution.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.level}</span>
                    <div className="text-right">
                      <span className="font-bold">{item.students}</span>
                      <span className="text-sm text-muted-foreground ml-2">({item.percentage}%)</span>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="font-semibold">Academic Year 2024-25</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Currently in the second semester. New admissions for 2025-26 will open in May 2025.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Recent Enrollments
            </CardTitle>
            <CardDescription>
              Latest student registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEnrollments.map((enrollment, index) => (
                <div key={index} className="p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-sm">{enrollment.student}</p>
                    <Badge variant={enrollment.status === 'confirmed' ? 'default' : 'secondary'}>
                      {enrollment.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{enrollment.class}</p>
                  <p className="text-xs text-muted-foreground">Guardian: {enrollment.guardian}</p>
                </div>
              ))}
            </div>
            
            <Button className="w-full mt-4" variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              View All Enrollments
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Collection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Fee Collection Status
            </CardTitle>
            <CardDescription>
              Monthly fee collection progress and pending amounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feeStatus.map((month, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm">{month.month}</h4>
                    <Badge variant="outline">
                      {Math.round((month.collected / month.total) * 100)}% collected
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Collected: ₨ {month.collected.toLocaleString()}</span>
                      <span className="text-red-600">Pending: ₨ {month.pending.toLocaleString()}</span>
                    </div>
                    <Progress value={(month.collected / month.total) * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Collection Rate</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Overall collection rate: 91.2% - Above institutional target of 85%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Top Academic Performers
            </CardTitle>
            <CardDescription>
              Students excelling in their studies this semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((student, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {student.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.class}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-green-600">{student.completion}%</p>
                    <p className="text-xs text-muted-foreground">completion</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Recognition</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Top performers will receive certificates at the quarterly assembly on March 31st.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Examinations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Examinations & Assessments
          </CardTitle>
          <CardDescription>
            Scheduled tests and evaluations for the current semester
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingExams.map((exam, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-sm">{exam.subject}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      {exam.date}
                    </p>
                  </div>
                  <Badge variant={exam.type === 'Major' ? 'default' : 'secondary'}>
                    {exam.type}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{exam.students} students</span>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Academic Calendar & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Attendance Analytics
            </CardTitle>
            <CardDescription>
              Class-wise attendance trends and patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-green-600">94.2%</p>
                <p className="text-xs text-muted-foreground">Hifz Classes</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20 rounded-lg">
                <UserCheck className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-blue-600">91.8%</p>
                <p className="text-xs text-muted-foreground">Qirat Classes</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg">
                <UserCheck className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-purple-600">89.5%</p>
                <p className="text-xs text-muted-foreground">Arabic Classes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Student
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report Card
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Award className="h-4 w-4 mr-2" />
              Issue Certificate
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Exam
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}