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
import { GraduationCap, PlusCircle, Search, UserCheck, UserX, Users, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addYears, subYears } from "date-fns";

const students = [
  {
    id: 1,
    rollNumber: 'MDS-2023-001',
    name: 'Muhammad Ahmed Khan',
    fatherName: 'Abdul Rahman Khan',
    class: 'Dars-e-Nizami Year 3',
    section: 'A',
    dateOfBirth: subYears(new Date(), 18),
    admissionDate: new Date('2023-08-15'),
    feeStatus: 'PAID',
    sponsorshipStatus: 'SPONSORED',
    sponsorName: 'Donor A',
    contact: '+92-300-1234567',
    address: 'Block A, Gulshan-e-Iqbal, Karachi',
    status: 'ACTIVE',
  },
  {
    id: 2,
    rollNumber: 'MDS-2023-002',
    name: 'Ali Hassan',
    fatherName: 'Hassan Mahmood',
    class: 'Dars-e-Nizami Year 2',
    section: 'B',
    dateOfBirth: subYears(new Date(), 17),
    admissionDate: new Date('2023-08-20'),
    feeStatus: 'PENDING',
    sponsorshipStatus: 'NOT_SPONSORED',
    sponsorName: null,
    contact: '+92-321-9876543',
    address: 'North Nazimabad, Karachi',
    status: 'ACTIVE',
  },
  {
    id: 3,
    rollNumber: 'MDS-2024-003',
    name: 'Usman Farooq',
    fatherName: 'Farooq Ahmad',
    class: 'Dars-e-Nizami Year 1',
    section: 'A',
    dateOfBirth: subYears(new Date(), 16),
    admissionDate: new Date('2024-09-01'),
    feeStatus: 'PAID',
    sponsorshipStatus: 'PARTIAL',
    sponsorName: 'Donor B (50%)',
    contact: '+92-333-5556677',
    address: 'Malir, Karachi',
    status: 'ACTIVE',
  },
  {
    id: 4,
    rollNumber: 'MDS-2022-015',
    name: 'Abdullah Tariq',
    fatherName: 'Tariq Mehmood',
    class: 'Dars-e-Nizami Year 4',
    section: 'A',
    dateOfBirth: subYears(new Date(), 19),
    admissionDate: new Date('2022-08-10'),
    feeStatus: 'OVERDUE',
    sponsorshipStatus: 'NOT_SPONSORED',
    sponsorName: null,
    contact: '+92-300-7778888',
    address: 'Korangi, Karachi',
    status: 'ACTIVE',
  },
  {
    id: 5,
    rollNumber: 'MDS-2021-022',
    name: 'Bilal Hussain',
    fatherName: 'Hussain Ali',
    class: 'Dars-e-Nizami Year 5',
    section: 'B',
    dateOfBirth: subYears(new Date(), 20),
    admissionDate: new Date('2021-08-12'),
    feeStatus: 'PAID',
    sponsorshipStatus: 'SPONSORED',
    sponsorName: 'Donor C',
    contact: '+92-345-1112233',
    address: 'Saddar, Karachi',
    status: 'GRADUATED',
  },
];

const classes = ['Dars-e-Nizami Year 1', 'Dars-e-Nizami Year 2', 'Dars-e-Nizami Year 3', 'Dars-e-Nizami Year 4', 'Dars-e-Nizami Year 5'];

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const activeStudents = students.filter(s => s.status === 'ACTIVE').length;
  const graduatedStudents = students.filter(s => s.status === 'GRADUATED').length;
  const sponsoredStudents = students.filter(s => s.sponsorshipStatus === 'SPONSORED' || s.sponsorshipStatus === 'PARTIAL').length;
  const pendingFees = students.filter(s => s.feeStatus === 'PENDING' || s.feeStatus === 'OVERDUE').length;

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.fatherName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Student Management</h1>
        <p className="text-muted-foreground">Manage student registrations, attendance, and academic records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">{activeStudents} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sponsored</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{sponsoredStudents}</div>
            <p className="text-xs text-muted-foreground">{((sponsoredStudents/students.length)*100).toFixed(0)}% coverage</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{pendingFees}</div>
            <p className="text-xs text-muted-foreground">Need collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graduated</CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{graduatedStudents}</div>
            <p className="text-xs text-muted-foreground">Alumni</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full sm:w-64"
            />
          </div>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map(cls => (
                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="GRADUATED">Graduated</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="h-4 w-4 mr-2" />Add Student</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Register New Student</DialogTitle>
              <DialogDescription>Add a new student to the madrasa</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Student Name</Label>
                  <Input placeholder="Full name" />
                </div>
                <div className="grid gap-2">
                  <Label>Father's Name</Label>
                  <Input placeholder="Father's full name" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Roll Number</Label>
                  <Input placeholder="Auto-generated" disabled />
                </div>
                <div className="grid gap-2">
                  <Label>Date of Birth</Label>
                  <Input type="date" />
                </div>
                <div className="grid gap-2">
                  <Label>Admission Date</Label>
                  <Input type="date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Class</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Section</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Section A</SelectItem>
                      <SelectItem value="B">Section B</SelectItem>
                      <SelectItem value="C">Section C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Contact Number</Label>
                <Input placeholder="+92-XXX-XXXXXXX" />
              </div>
              <div className="grid gap-2">
                <Label>Address</Label>
                <Input placeholder="Complete address" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Register Student</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Students</TabsTrigger>
          <TabsTrigger value="details">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Directory ({filteredStudents.length})</CardTitle>
              <CardDescription>Complete list of registered students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No.</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Father Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Fee Status</TableHead>
                      <TableHead>Sponsorship</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-mono text-sm">{student.rollNumber}</TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{student.fatherName}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell className="text-center">{student.section}</TableCell>
                        <TableCell>
                          <Badge variant={
                            student.feeStatus === 'PAID' ? 'default' :
                            student.feeStatus === 'PENDING' ? 'secondary' :
                            'destructive'
                          }>
                            {student.feeStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            student.sponsorshipStatus === 'SPONSORED' ? 'default' :
                            student.sponsorshipStatus === 'PARTIAL' ? 'secondary' :
                            'outline'
                          }>
                            {student.sponsorshipStatus === 'SPONSORED' ? 'Full' :
                             student.sponsorshipStatus === 'PARTIAL' ? 'Partial' :
                             'None'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.status === 'ACTIVE' ? 'default' : 'outline'}>
                            {student.status}
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

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map((student) => (
              <Card key={student.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{student.name}</CardTitle>
                      <CardDescription className="font-mono">{student.rollNumber}</CardDescription>
                    </div>
                    <Badge variant={student.status === 'ACTIVE' ? 'default' : 'outline'}>
                      {student.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-muted-foreground">Father's Name</div>
                      <div className="font-medium">{student.fatherName}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Class & Section</div>
                      <div className="font-medium">{student.class} - {student.section}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Date of Birth</div>
                      <div className="font-medium">{format(student.dateOfBirth, 'MMM dd, yyyy')}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Admission Date</div>
                      <div className="font-medium">{format(student.admissionDate, 'MMM dd, yyyy')}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Contact</div>
                      <div className="font-medium text-xs">{student.contact}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Fee Status</div>
                      <Badge variant={
                        student.feeStatus === 'PAID' ? 'default' :
                        student.feeStatus === 'PENDING' ? 'secondary' :
                        'destructive'
                      } className="text-xs">
                        {student.feeStatus}
                      </Badge>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-muted-foreground text-sm mb-1">Sponsorship</div>
                    {student.sponsorshipStatus === 'NOT_SPONSORED' ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Not Sponsored</Badge>
                        <Button size="sm" variant="outline">Find Sponsor</Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge variant={student.sponsorshipStatus === 'SPONSORED' ? 'default' : 'secondary'}>
                          {student.sponsorshipStatus === 'SPONSORED' ? 'Fully Sponsored' : 'Partially Sponsored'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">by {student.sponsorName}</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-muted-foreground text-sm mb-1">Address</div>
                    <div className="text-sm">{student.address}</div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                    <Button variant="outline" size="sm" className="flex-1">Attendance</Button>
                    <Button variant="outline" size="sm" className="flex-1">Fees</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
