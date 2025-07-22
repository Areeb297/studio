
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Users, UserCheck, UserX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";


type StaffMember = {
    id: string;
    name: string;
    role: string;
    department: 'Management' | 'Kitchen' | 'Service' | 'Janitorial' | 'Admin';
    appointmentDate: Date;
    status: 'Active' | 'Resigned';
};

const initialStaff: StaffMember[] = [
    { id: 'staff-1', name: 'Areeb Shafqat', role: 'General Manager', department: 'Management', appointmentDate: new Date('2022-08-15'), status: 'Active' },
    { id: 'staff-2', name: 'Fatima Khan', role: 'Head Chef', department: 'Kitchen', appointmentDate: new Date('2023-01-20'), status: 'Active' },
    { id: 'staff-3', name: 'Ali Hassan', role: 'Sous Chef', department: 'Kitchen', appointmentDate: new Date('2023-05-10'), status: 'Active' },
    { id: 'staff-4', name: 'Zainab Ahmed', role: 'Floor Manager', department: 'Service', appointmentDate: new Date('2022-11-01'), status: 'Active' },
    { id: 'staff-5', name: 'Bilal Chaudhry', role: 'Senior Waiter', department: 'Service', appointmentDate: new Date('2023-03-12'), status: 'Active' },
    { id: 'staff-6', name: 'Sana Iqbal', role: 'Accountant', department: 'Admin', appointmentDate: new Date('2023-09-01'), status: 'Resigned' },
];


export default function StaffPage() {
    const [staffList, setStaffList] = useState<StaffMember[]>(initialStaff);
    const activeStaffCount = staffList.filter(s => s.status === 'Active').length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Staff Management</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{staffList.length}</div>
                <p className="text-xs text-muted-foreground">Includes active and resigned staff</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                <UserCheck className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{activeStaffCount}</div>
                 <p className="text-xs text-muted-foreground">Currently on payroll</p>
            </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Team Overview</CardTitle>
                    <CardDescription>Manage staff records, assign roles, and track employment status.</CardDescription>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2"/> Add Employee</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Staff Member</DialogTitle>
                            <DialogDescription>Enter the details for the new employee.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" placeholder="e.g., Areeb Shafqat"/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role / Designation</Label>
                                <Input id="role" placeholder="e.g., Waiter"/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Select>
                                    <SelectTrigger id="department">
                                        <SelectValue placeholder="Select a department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Management">Management</SelectItem>
                                        <SelectItem value="Kitchen">Kitchen</SelectItem>
                                        <SelectItem value="Service">Service Staff</SelectItem>
                                        <SelectItem value="Janitorial">Janitorial</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="appointmentDate">Appointment Date</Label>
                                <Input id="appointmentDate" type="date"/>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="submit">Save Employee</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Appointment Date</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {staffList.map(staff => (
                    <TableRow key={staff.id}>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell>{staff.role}</TableCell>
                        <TableCell><Badge variant="outline">{staff.department}</Badge></TableCell>
                        <TableCell>{format(staff.appointmentDate, 'PPP')}</TableCell>
                        <TableCell className="text-center">
                            <Badge variant={staff.status === 'Active' ? 'default' : 'secondary'} className={staff.status === 'Active' ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700'}>
                                {staff.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>Edit Record</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">Mark as Resigned</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
