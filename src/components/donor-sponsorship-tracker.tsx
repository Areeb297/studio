'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  HandHeart,
  Users, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Heart,
  Building2,
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { donors, sponsorships, students } from "@/lib/academic-data";

interface DonorSponsorshipTrackerProps {
  className?: string;
}

export function DonorSponsorshipTracker({ className }: DonorSponsorshipTrackerProps) {
  // Calculate sponsorship statistics
  const totalSponsored = sponsorships.length;
  const activeSponsors = donors.filter(d => d.status === 'ACTIVE').length;
  const totalMonthlySponsorship = sponsorships.reduce((sum, s) => sum + s.monthlyAmount, 0);
  const totalContributed = donors.reduce((sum, d) => sum + d.totalContributed, 0);

  // Get sponsored students with their donor information
  const sponsoredStudents = students.filter(s => s.sponsorships && s.sponsorships.length > 0).map(student => {
    const sponsorship = student.sponsorships[0]; // Get first sponsorship
    const donor = donors.find(d => d.id === sponsorship.donorId);
    return {
      student,
      sponsorship,
      donor
    };
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Donor-Student Sponsorship Tracking</h2>
          <p className="text-muted-foreground">Comprehensive donor relationship and student sponsorship management</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary text-primary">
            <HandHeart className="w-3 h-3 mr-1" />
            {activeSponsors} Active Donors
          </Badge>
        </div>
      </div>

      {/* Sponsorship KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
            <HandHeart className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{activeSponsors}</div>
            <p className="text-xs text-green-600">Active contributors</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Sponsored Students</CardTitle>
            <Users className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{totalSponsored}</div>
            <p className="text-xs text-green-600">Students supported</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Monthly Sponsorship</CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₨ {totalMonthlySponsorship.toLocaleString()}</div>
            <p className="text-xs text-green-600">Per month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Contributed</CardTitle>
            <TrendingUp className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">₨ {totalContributed.toLocaleString()}</div>
            <p className="text-xs text-green-600">All time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Donors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Active Donors & Sponsors
            </CardTitle>
            <CardDescription>
              Current donors and their contribution details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {donors.filter(d => d.status === 'ACTIVE').map((donor) => (
                <div key={donor.id} className="p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary">{donor.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs border-primary text-primary">
                          {donor.donorType}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {donor.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent">₨ {donor.totalContributed.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total contributed</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{donor.phone}</span>
                    </div>
                    {donor.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{donor.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{donor.address}</span>
                    </div>
                    {donor.notes && (
                      <div className="text-sm text-muted-foreground italic">
                        "{donor.notes}"
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-primary/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Registered:</span>
                      <span className="text-sm font-medium">{donor.registrationDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Payment Method:</span>
                      <Badge variant="outline" className="text-xs">
                        {donor.preferredPaymentMethod.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sponsored Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Sponsored Students
            </CardTitle>
            <CardDescription>
              Students receiving donor support and sponsorship details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sponsoredStudents.map(({ student, sponsorship, donor }) => (
                <div key={student.id} className="p-4 border rounded-lg bg-gradient-to-r from-accent/5 to-primary/5 hover:from-accent/10 hover:to-primary/10 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-accent">{student.name}</h4>
                      <p className="text-sm text-muted-foreground">{student.class} • Roll: {student.rollNumber}</p>
                      <p className="text-sm text-muted-foreground">Guardian: {student.guardian.name}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        sponsorship.status === 'ACTIVE' ? 'default' : 
                        sponsorship.status === 'COMPLETED' ? 'secondary' : 'destructive'
                      } className="mb-1">
                        {sponsorship.status}
                      </Badge>
                      <p className="text-sm font-medium">₨ {sponsorship.monthlyAmount.toLocaleString()}/month</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Sponsored by:</span>
                      <span className="font-medium text-primary">{donor?.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Sponsorship Type:</span>
                      <Badge variant="outline" className="text-xs border-accent text-accent">
                        {sponsorship.sponsorshipType}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Payment Schedule:</span>
                      <span className="font-medium">{sponsorship.paymentSchedule}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Paid:</span>
                      <span className="font-bold text-green-600">₨ {sponsorship.totalPaid.toLocaleString()}</span>
                    </div>
                    {sponsorship.outstandingAmount > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Outstanding:</span>
                        <span className="font-bold text-red-600">₨ {sponsorship.outstandingAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Start Date:</span>
                      <span className="font-medium">{sponsorship.startDate.toLocaleDateString()}</span>
                    </div>
                    {sponsorship.lastPaymentDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Last Payment:</span>
                        <span className="font-medium">{sponsorship.lastPaymentDate.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {sponsorship.notes && (
                    <div className="mt-3 pt-3 border-t border-accent/20">
                      <p className="text-sm text-muted-foreground italic">"{sponsorship.notes}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sponsorship Management Actions */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <HandHeart className="h-5 w-5" />
            Sponsorship Management Actions
          </CardTitle>
          <CardDescription>
            Tools for managing donor relationships and student sponsorships
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-16 flex-col bg-primary hover:bg-primary/90" size="lg">
              <HandHeart className="h-5 w-5 mb-1" />
              <span className="text-sm">Add New Donor</span>
            </Button>
            <Button className="h-16 flex-col bg-accent hover:bg-accent/90" size="lg">
              <Users className="h-5 w-5 mb-1" />
              <span className="text-sm">Create Sponsorship</span>
            </Button>
            <Button className="h-16 flex-col" variant="outline" size="lg">
              <CreditCard className="h-5 w-5 mb-1" />
              <span className="text-sm">Record Payment</span>
            </Button>
            <Button className="h-16 flex-col" variant="outline" size="lg">
              <Calendar className="h-5 w-5 mb-1" />
              <span className="text-sm">Schedule Follow-up</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sponsorship Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Sponsorship Status Overview
          </CardTitle>
          <CardDescription>
            Summary of sponsorship statuses and payment health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-green-600">
                {sponsorships.filter(s => s.status === 'ACTIVE' && s.outstandingAmount === 0).length}
              </p>
              <p className="text-xs text-muted-foreground">Fully Paid</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <HandHeart className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-blue-600">
                {sponsorships.filter(s => s.status === 'ACTIVE').length}
              </p>
              <p className="text-xs text-muted-foreground">Active Sponsorships</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-yellow-600">
                {sponsorships.filter(s => s.outstandingAmount > 0).length}
              </p>
              <p className="text-xs text-muted-foreground">Pending Payments</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
              <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-lg font-bold text-primary">
                ₨ {sponsorships.reduce((sum, s) => sum + s.outstandingAmount, 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total Outstanding</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
