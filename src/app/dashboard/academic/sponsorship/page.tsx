'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, PlusCircle, Users, DollarSign, UserCheck, TrendingUp, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addMonths } from "date-fns";
import { Progress } from "@/components/ui/progress";

const sponsorships = [
  {
    id: 1,
    sponsorshipId: 'SPNSR-2024-001',
    donorName: 'Abdul Karim Sheikh',
    donorEmail: 'abdulkarim@example.com',
    donorPhone: '+92-321-1112233',
    studentName: 'Muhammad Ahmed Khan',
    studentRoll: 'MDS-2023-001',
    studentClass: 'Dars-e-Nizami Year 3',
    sponsorshipType: 'FULL',
    monthlyAmount: 5000,
    totalPaid: 45000,
    startDate: new Date('2024-01-01'),
    endDate: addMonths(new Date('2024-01-01'), 12),
    status: 'ACTIVE',
    paymentStatus: 'UP_TO_DATE',
  },
  {
    id: 2,
    sponsorshipId: 'SPNSR-2024-002',
    donorName: 'Fatima Hassan',
    donorEmail: 'fatima.h@example.com',
    donorPhone: '+92-300-5556677',
    studentName: 'Usman Farooq',
    studentRoll: 'MDS-2024-003',
    studentClass: 'Dars-e-Nizami Year 1',
    sponsorshipType: 'PARTIAL',
    monthlyAmount: 2500,
    totalPaid: 17500,
    startDate: new Date('2024-03-01'),
    endDate: addMonths(new Date('2024-03-01'), 12),
    status: 'ACTIVE',
    paymentStatus: 'UP_TO_DATE',
  },
  {
    id: 3,
    sponsorshipId: 'SPNSR-2023-015',
    donorName: 'Muhammad Tariq',
    donorEmail: 'mtariq@example.com',
    donorPhone: '+92-333-9998877',
    studentName: 'Bilal Hussain',
    studentRoll: 'MDS-2021-022',
    studentClass: 'Dars-e-Nizami Year 5',
    sponsorshipType: 'FULL',
    monthlyAmount: 5000,
    totalPaid: 60000,
    startDate: new Date('2023-08-01'),
    endDate: addMonths(new Date('2023-08-01'), 12),
    status: 'COMPLETED',
    paymentStatus: 'COMPLETED',
  },
  {
    id: 4,
    sponsorshipId: 'SPNSR-2024-008',
    donorName: 'Ahmed Corporation',
    donorEmail: 'contact@ahmedcorp.com',
    donorPhone: '+92-21-34567890',
    studentName: 'Hassan Ali',
    studentRoll: 'MDS-2023-012',
    studentClass: 'Dars-e-Nizami Year 2',
    sponsorshipType: 'FULL',
    monthlyAmount: 5000,
    totalPaid: 10000,
    startDate: new Date('2024-08-01'),
    endDate: addMonths(new Date('2024-08-01'), 12),
    status: 'ACTIVE',
    paymentStatus: 'DELAYED',
  },
];

const unsponsoredStudents = [
  { id: 1, rollNumber: 'MDS-2023-002', name: 'Ali Hassan', class: 'Dars-e-Nizami Year 2', monthlyFee: 5000, priority: 'HIGH' },
  { id: 2, rollNumber: 'MDS-2022-015', name: 'Abdullah Tariq', class: 'Dars-e-Nizami Year 4', monthlyFee: 5000, priority: 'URGENT' },
  { id: 3, rollNumber: 'MDS-2024-018', name: 'Zain Abbas', class: 'Dars-e-Nizami Year 1', monthlyFee: 4500, priority: 'MEDIUM' },
];

const donors = [
  { id: 1, name: 'Abdul Karim Sheikh', email: 'abdulkarim@example.com', totalContributions: 45000, activeSponsors: 1, status: 'ACTIVE' },
  { id: 2, name: 'Fatima Hassan', email: 'fatima.h@example.com', totalContributions: 17500, activeSponsors: 1, status: 'ACTIVE' },
  { id: 3, name: 'Ahmed Corporation', email: 'contact@ahmedcorp.com', totalContributions: 120000, activeSponsors: 3, status: 'ACTIVE' },
];

const formatPKR = (amount: number) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);

export default function SponsorshipPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);

  const activeSponsors = sponsorships.filter(s => s.status === 'ACTIVE').length;
  const totalMonthlyCommitment = sponsorships.filter(s => s.status === 'ACTIVE').reduce((sum, s) => sum + s.monthlyAmount, 0);
  const totalCollected = sponsorships.reduce((sum, s) => sum + s.totalPaid, 0);
  const unsponsoredCount = unsponsoredStudents.length;
  const delayedPayments = sponsorships.filter(s => s.paymentStatus === 'DELAYED').length;

  const filteredSponsors = sponsorships.filter(s =>
    s.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.sponsorshipId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Student Sponsorship</h1>
        <p className="text-muted-foreground">Match donors with students and manage sponsorship commitments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sponsors</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSponsors}</div>
            <p className="text-xs text-muted-foreground">Current matches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatPKR(totalMonthlyCommitment)}</div>
            <p className="text-xs text-muted-foreground">Per month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPKR(totalCollected)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unsponsored</CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{unsponsoredCount}</div>
            <p className="text-xs text-muted-foreground">Need sponsors</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed</CardTitle>
            <UserCheck className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{delayedPayments}</div>
            <p className="text-xs text-muted-foreground">Payment delays</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Sponsorships</TabsTrigger>
          <TabsTrigger value="unsponsored">Unsponsored Students</TabsTrigger>
          <TabsTrigger value="donors">Donor Database</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sponsorships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full sm:w-64"
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="h-4 w-4 mr-2" />Create Sponsorship</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Sponsorship</DialogTitle>
                  <DialogDescription>Match a donor with a student</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Select Donor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose donor" />
                      </SelectTrigger>
                      <SelectContent>
                        {donors.map(donor => (
                          <SelectItem key={donor.id} value={donor.id.toString()}>{donor.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Select Student</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose student" />
                      </SelectTrigger>
                      <SelectContent>
                        {unsponsoredStudents.map(student => (
                          <SelectItem key={student.id} value={student.id.toString()}>
                            {student.name} ({student.rollNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Sponsorship Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FULL">Full Sponsorship</SelectItem>
                          <SelectItem value="PARTIAL">Partial Sponsorship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Monthly Amount (PKR)</Label>
                      <Input type="number" placeholder="5000" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Start Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Duration (months)</Label>
                      <Input type="number" placeholder="12" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>Create Sponsorship</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Sponsorships ({filteredSponsors.length})</CardTitle>
              <CardDescription>Current donor-student matches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Donor</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Monthly</TableHead>
                      <TableHead className="text-right">Total Paid</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSponsors.map((sponsor) => (
                      <TableRow key={sponsor.id}>
                        <TableCell className="font-mono text-sm">{sponsor.sponsorshipId}</TableCell>
                        <TableCell>
                          <div className="font-medium">{sponsor.donorName}</div>
                          <div className="text-xs text-muted-foreground">{sponsor.donorPhone}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{sponsor.studentName}</div>
                          <div className="text-xs text-muted-foreground font-mono">{sponsor.studentRoll}</div>
                        </TableCell>
                        <TableCell className="text-sm">{sponsor.studentClass}</TableCell>
                        <TableCell>
                          <Badge variant={sponsor.sponsorshipType === 'FULL' ? 'default' : 'secondary'}>
                            {sponsor.sponsorshipType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold">{formatPKR(sponsor.monthlyAmount)}</TableCell>
                        <TableCell className="text-right font-mono">{formatPKR(sponsor.totalPaid)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            sponsor.paymentStatus === 'UP_TO_DATE' ? 'default' :
                            sponsor.paymentStatus === 'DELAYED' ? 'destructive' :
                            'outline'
                          }>
                            {sponsor.paymentStatus === 'UP_TO_DATE' ? 'On Time' :
                             sponsor.paymentStatus === 'DELAYED' ? 'Delayed' :
                             'Completed'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={sponsor.status === 'ACTIVE' ? 'default' : 'outline'}>
                            {sponsor.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unsponsored" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Students Needing Sponsorship</CardTitle>
                  <CardDescription>Help these students continue their education</CardDescription>
                </div>
                <Dialog open={isMatchDialogOpen} onOpenChange={setIsMatchDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Heart className="h-4 w-4 mr-2" />Quick Match
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>AI-Powered Matching</DialogTitle>
                      <DialogDescription>Let AI suggest the best donor-student matches</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground">
                        Our AI analyzes donor preferences, giving capacity, and student needs to suggest optimal sponsorship matches.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsMatchDialogOpen(false)}>Cancel</Button>
                      <Button onClick={() => setIsMatchDialogOpen(false)}>Run AI Matching</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unsponsoredStudents.map((student) => (
                  <Card key={student.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-semibold text-lg">{student.name}</div>
                              <div className="text-sm text-muted-foreground font-mono">{student.rollNumber}</div>
                            </div>
                            <Badge variant={
                              student.priority === 'URGENT' ? 'destructive' :
                              student.priority === 'HIGH' ? 'secondary' :
                              'outline'
                            }>
                              {student.priority} Priority
                            </Badge>
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Class:</span> {student.class}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Monthly Fee:</span> <span className="font-mono font-bold">{formatPKR(student.monthlyFee)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View Profile</Button>
                          <Button size="sm">
                            <Heart className="h-4 w-4 mr-2" />Find Sponsor
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Donor Database</CardTitle>
              <CardDescription>Manage donor relationships and contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Total Contributions</TableHead>
                      <TableHead className="text-center">Active Sponsorships</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donors.map((donor) => (
                      <TableRow key={donor.id}>
                        <TableCell className="font-medium">{donor.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{donor.email}</TableCell>
                        <TableCell className="text-right font-mono font-bold">{formatPKR(donor.totalContributions)}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="default">{donor.activeSponsors}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={donor.status === 'ACTIVE' ? 'default' : 'outline'}>
                            {donor.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="outline" size="sm" className="ml-2">
                            <PlusCircle className="h-4 w-4 mr-1" />New Match
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-green-900 mb-3">Impact Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-green-700 mb-1">Students Sponsored</div>
              <div className="text-3xl font-bold text-green-900">{activeSponsors}</div>
              <Progress value={(activeSponsors / (activeSponsors + unsponsoredCount)) * 100} className="mt-2 h-2" />
            </div>
            <div>
              <div className="text-sm text-green-700 mb-1">Monthly Support Value</div>
              <div className="text-3xl font-bold text-green-900">{formatPKR(totalMonthlyCommitment)}</div>
              <p className="text-xs text-green-700 mt-1">Committed per month</p>
            </div>
            <div>
              <div className="text-sm text-green-700 mb-1">Total Lifetime Impact</div>
              <div className="text-3xl font-bold text-green-900">{formatPKR(totalCollected)}</div>
              <p className="text-xs text-green-700 mt-1">All-time contributions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
