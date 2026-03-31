'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, PlusCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { format, addDays } from "date-fns";

const requisitions = [
  { id: 1, reqNumber: 'DEPT-REQ-001', department: 'Continental Kitchen', items: 5, status: 'APPROVED', date: addDays(new Date(), -2), priority: 'HIGH' },
  { id: 2, reqNumber: 'DEPT-REQ-002', department: 'Chinese Kitchen', items: 3, status: 'PENDING_APPROVAL', date: addDays(new Date(), -1), priority: 'MEDIUM' },
  { id: 3, reqNumber: 'DEPT-REQ-003', department: 'BBQ Kitchen', items: 7, status: 'ISSUED', date: addDays(new Date(), 0), priority: 'HIGH' },
  { id: 4, reqNumber: 'DEPT-REQ-004', department: 'Beverages Dept', items: 4, status: 'DRAFT', date: addDays(new Date(), 0), priority: 'LOW' },
];

export default function DepartmentRequisitionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Department Requisitions</h1>
        <p className="text-muted-foreground">Manage department stock requests and issue slips</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Requisitions</CardTitle><ClipboardList className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{requisitions.length}</div><p className="text-xs text-muted-foreground">All requests</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pending Approval</CardTitle><Clock className="h-4 w-4 text-yellow-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-yellow-600">{requisitions.filter(r => r.status === 'PENDING_APPROVAL').length}</div><p className="text-xs text-muted-foreground">Awaiting review</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Approved</CardTitle><CheckCircle className="h-4 w-4 text-green-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{requisitions.filter(r => r.status === 'APPROVED').length}</div><p className="text-xs text-muted-foreground">Ready to issue</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Issued</CardTitle><CheckCircle className="h-4 w-4 text-primary" /></CardHeader><CardContent><div className="text-2xl font-bold text-primary">{requisitions.filter(r => r.status === 'ISSUED').length}</div><p className="text-xs text-muted-foreground">Completed</p></CardContent></Card>
      </div>

      <div className="flex justify-end">
        <Button><PlusCircle className="h-4 w-4 mr-2" />New Requisition</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>All Requisitions ({requisitions.length})</CardTitle><CardDescription>Department stock requests</CardDescription></CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow><TableHead>Req #</TableHead><TableHead>Department</TableHead><TableHead>Items</TableHead><TableHead>Date</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {requisitions.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono">{req.reqNumber}</TableCell>
                    <TableCell>{req.department}</TableCell>
                    <TableCell>{req.items} items</TableCell>
                    <TableCell>{format(req.date, 'MMM dd, yyyy')}</TableCell>
                    <TableCell><Badge variant={req.priority === 'HIGH' ? 'destructive' : req.priority === 'MEDIUM' ? 'secondary' : 'outline'}>{req.priority}</Badge></TableCell>
                    <TableCell><Badge variant={req.status === 'ISSUED' ? 'default' : req.status === 'APPROVED' ? 'default' : req.status === 'PENDING_APPROVAL' ? 'secondary' : 'outline'}>{req.status.replace('_', ' ')}</Badge></TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="sm">View</Button><Button variant="default" size="sm" className="ml-2">Issue</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
