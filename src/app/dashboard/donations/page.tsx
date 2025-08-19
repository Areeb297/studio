'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Target,
  Gift,
  UserPlus,
  FileText,
  BarChart3,
  Calendar,
  MapPin,
  Phone,
  Mail,
  GraduationCap
} from "lucide-react";

export default function DonationsPage() {
  const donationStats = [
    {
      title: "Total Donations",
      value: "₨ 8,547,325",
      change: "+18%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      title: "Active Donors",
      value: "1,834",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "Campaigns Active",
      value: "7",
      change: "+2",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      title: "This Month",
      value: "₨ 1,247,890",
      change: "+23%",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/20"
    }
  ];

  const donationTypes = [
    { type: "Zakat", amount: 3247890, percentage: 38, color: "bg-green-500" },
    { type: "Sadaqah", amount: 2158470, percentage: 25, color: "bg-blue-500" },
    { type: "General Fund", amount: 1847320, percentage: 22, color: "bg-purple-500" },
    { type: "Education Fund", amount: 876145, percentage: 10, color: "bg-orange-500" },
    { type: "Emergency Relief", amount: 417500, percentage: 5, color: "bg-red-500" }
  ];

  const campaigns = [
    {
      name: "Ramadan Food Drive 2025",
      target: 5000000,
      raised: 3785400,
      donors: 267,
      status: "active",
      endDate: "April 15, 2025"
    },
    {
      name: "Education Scholarship Fund",
      target: 2000000,
      raised: 1245780,
      donors: 89,
      status: "active",
      endDate: "May 30, 2025"
    },
    {
      name: "Mosque Construction",
      target: 10000000,
      raised: 6847290,
      donors: 456,
      status: "active",
      endDate: "December 31, 2025"
    }
  ];

  const recentDonations = [
    { donor: "Ahmed Hassan", amount: 25000, type: "Zakat", time: "5 minutes ago", verified: true },
    { donor: "Fatima Khan", amount: 15000, type: "Sadaqah", time: "12 minutes ago", verified: true },
    { donor: "Muhammad Ali", amount: 50000, type: "General Fund", time: "1 hour ago", verified: true },
    { donor: "Aisha Rahman", amount: 8000, type: "Education Fund", time: "2 hours ago", verified: false },
    { donor: "Omar Farooq", amount: 35000, type: "Zakat", time: "3 hours ago", verified: true }
  ];

  const topDonors = [
    { name: "Muhammad Ibrahim", total: 485000, donations: 12, lastDonation: "2 days ago" },
    { name: "Khadija Bibi", total: 367500, donations: 8, lastDonation: "1 week ago" },
    { name: "Ali Hassan", total: 298750, donations: 15, lastDonation: "3 days ago" },
    { name: "Fatima Sheikh", total: 265000, donations: 6, lastDonation: "5 days ago" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Donation Management</h1>
          <p className="text-muted-foreground">Track and manage Zakat, Sadaqah, and general donations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Donor
          </Button>
          <Button variant="outline">
            <Target className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Receipt
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {donationStats.map((stat, index) => (
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
        {/* Donation Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Donation Distribution by Type
            </CardTitle>
            <CardDescription>
              Breakdown of donations by Islamic categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {donationTypes.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.type}</span>
                    <div className="text-right">
                      <span className="font-bold">₨ {item.amount.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground ml-2">({item.percentage}%)</span>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-semibold">Compliance Status</span>
              </div>
              <p className="text-sm text-muted-foreground">
                All donations are properly categorized and comply with Islamic finance principles. 
                Zakat calculations verified by Islamic scholars.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Donations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Donations
            </CardTitle>
            <CardDescription>
              Latest donation activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDonations.map((donation, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-950/20">
                    <Heart className="h-3 w-3 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{donation.donor}</p>
                    <p className="text-xs text-muted-foreground">
                      ₨ {donation.amount.toLocaleString()} - {donation.type}
                    </p>
                  </div>
                  <div className="text-right">
                    {donation.verified ? (
                      <CheckCircle className="h-3 w-3 text-green-600 mb-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-orange-600 mb-1" />
                    )}
                    <p className="text-xs text-muted-foreground">{donation.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Active Campaigns
            </CardTitle>
            <CardDescription>
              Ongoing fundraising campaigns and their progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-sm">{campaign.name}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        Ends: {campaign.endDate}
                      </p>
                    </div>
                    <Badge variant="secondary">{campaign.status}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>₨ {campaign.raised.toLocaleString()}</span>
                      <span className="text-muted-foreground">₨ {campaign.target.toLocaleString()}</span>
                    </div>
                    <Progress value={(campaign.raised / campaign.target) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{Math.round((campaign.raised / campaign.target) * 100)}% funded</span>
                      <span>{campaign.donors} donors</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="w-full mt-4" variant="outline">
              <Target className="h-4 w-4 mr-2" />
              View All Campaigns
            </Button>
          </CardContent>
        </Card>

        {/* Top Donors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Top Donors
            </CardTitle>
            <CardDescription>
              Most generous contributors this year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDonors.map((donor, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{donor.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {donor.donations} donations • Last: {donor.lastDonation}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">₨ {donor.total.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Gift className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Recognition Program</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Top donors will be honored at the annual appreciation ceremony in December.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fund Utilization Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Fund Utilization Overview
          </CardTitle>
          <CardDescription>
            How collected donations are being utilized across programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20 rounded-lg">
              <Heart className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-blue-600">65%</p>
              <p className="text-xs text-muted-foreground">Direct Aid</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
              <GraduationCap className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-green-600">20%</p>
              <p className="text-xs text-muted-foreground">Education</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg">
              <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-purple-600">10%</p>
              <p className="text-xs text-muted-foreground">Infrastructure</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-orange-600">5%</p>
              <p className="text-xs text-muted-foreground">Emergency</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}