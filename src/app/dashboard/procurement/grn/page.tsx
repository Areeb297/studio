'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackageCheck, PlusCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { format, addDays } from "date-fns";

const grns = [
  { id: 1, grnNumber: 'GRN-2025-001', poNumber: 'PO-2025-001', vendor: 'ABC Suppliers', items: 5, totalValue: 85000, status: 'POSTED', date: addDays(new Date(), -3) },
  { id: 2, grnNumber: 'GRN-2025-002', poNumber: 'PO-2025-002', vendor: 'XYZ Equipment', items: 3, totalValue: 150000, status: 'INSPECTED', date: addDays(new Date(), -1) },
  { id: 3, grnNumber: 'GRN-2025-003', poNumber: 'PO-2025-003', vendor: 'Food Distributors', items: 8, totalValue: 45000, status: 'DRAFT', date: addDays(new Date(), 0) },
];

const formatPKR = (amount: number) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount);

export default function GRNPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Goods Receipt Notes (GRN)</h1>
        <p className="text-muted-foreground">Process incoming goods and match with purchase orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total GRNs</CardTitle><PackageCheck className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{grns.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Posted</CardTitle><CheckCircle className="h-4 w-4 text-green-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{grns.filter(g => g.status === 'POSTED').length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Inspected</CardTitle><Clock className="h-4 w-4 text-yellow-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-yellow-600">{grns.filter(g => g.status === 'INSPECTED').length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Value</CardTitle><PackageCheck className="h-4 w-4 text-primary" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatPKR(grns.reduce((s, g) => s + g.totalValue, 0))}</div></CardContent></Card>
      </div>

      <div className="flex justify-end">
        <Button><PlusCircle className="h-4 w-4 mr-2" />New GRN</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>All GRNs</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader><TableRow><TableHead>GRN #</TableHead><TableHead>PO #</TableHead><TableHead>Vendor</TableHead><TableHead>Items</TableHead><TableHead className="text-right">Total Value</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {grns.map((grn) => (
                  <TableRow key={grn.id}>
                    <TableCell className="font-mono">{grn.grnNumber}</TableCell>
                    <TableCell className="font-mono">{grn.poNumber}</TableCell>
                    <TableCell>{grn.vendor}</TableCell>
                    <TableCell>{grn.items} items</TableCell>
                    <TableCell className="text-right font-mono">{formatPKR(grn.totalValue)}</TableCell>
                    <TableCell>{format(grn.date, 'MMM dd, yyyy')}</TableCell>
                    <TableCell><Badge variant={grn.status === 'POSTED' ? 'default' : grn.status === 'INSPECTED' ? 'secondary' : 'outline'}>{grn.status}</Badge></TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="sm">View</Button><Button size="sm" className="ml-2">Post</Button></TableCell>
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
