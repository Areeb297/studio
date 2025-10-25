'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addDays, differenceInDays } from "date-fns";

const expiryItems = [
  { id: 1, item: 'Basmati Rice Batch#123', batch: 'BATCH-2025-001', expiry: addDays(new Date(), 15), qty: 25, status: 'EXPIRING_SOON' },
  { id: 2, item: 'Cooking Oil Batch#456', batch: 'BATCH-2025-002', expiry: addDays(new Date(), 45), qty: 50, status: 'WARNING' },
  { id: 3, item: 'Milk Powder Batch#789', batch: 'BATCH-2025-003', expiry: addDays(new Date(), -5), qty: 10, status: 'EXPIRED' },
  { id: 4, item: 'Spices Mix Batch#321', batch: 'BATCH-2025-004', expiry: addDays(new Date(), 60), qty: 30, status: 'NORMAL' },
];

const warrantyItems = [
  { id: 1, equipment: 'Commercial Blender Pro', serial: 'SN-BL-001', warranty: addDays(new Date(), 30), status: 'EXPIRING' },
  { id: 2, equipment: 'Industrial Oven XL', serial: 'SN-OV-002', warranty: addDays(new Date(), 180), status: 'ACTIVE' },
  { id: 3, equipment: 'Refrigerator Unit 5', serial: 'SN-RF-003', warranty: addDays(new Date(), -10), status: 'EXPIRED' },
];

export default function ExpiryWarrantyPage() {
  const expiring30 = expiryItems.filter(i => differenceInDays(i.expiry, new Date()) <= 30 && differenceInDays(i.expiry, new Date()) > 0).length;
  const expired = expiryItems.filter(i => differenceInDays(i.expiry, new Date()) < 0).length;
  const warrantyExpiring = warrantyItems.filter(w => differenceInDays(w.warranty, new Date()) <= 30 && differenceInDays(w.warranty, new Date()) > 0).length;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Expiry & Warranty Tracking</h1>
        <p className="text-muted-foreground">Track batch expiry dates and equipment warranties</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-red-50 border-red-200"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Expiring (30 days)</CardTitle><AlertCircle className="h-4 w-4 text-red-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-red-700">{expiring30}</div><p className="text-xs text-muted-foreground">Urgent action</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Expired Items</CardTitle><Calendar className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{expired}</div><p className="text-xs text-muted-foreground">Dispose/Return</p></CardContent></Card>
        <Card className="bg-yellow-50 border-yellow-200"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Warranty Expiring</CardTitle><Shield className="h-4 w-4 text-yellow-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-yellow-700">{warrantyExpiring}</div><p className="text-xs text-muted-foreground">Renew soon</p></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Batches</CardTitle><Calendar className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{expiryItems.length}</div><p className="text-xs text-muted-foreground">Active batches</p></CardContent></Card>
      </div>

      <Tabs defaultValue="expiry" className="w-full">
        <TabsList><TabsTrigger value="expiry">Batch Expiry</TabsTrigger><TabsTrigger value="warranty">Equipment Warranty</TabsTrigger></TabsList>

        <TabsContent value="expiry" className="space-y-4">
          <Card><CardHeader><CardTitle>Batch Expiry Tracking</CardTitle><CardDescription>Monitor perishable inventory</CardDescription></CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Batch #</TableHead><TableHead>Expiry Date</TableHead><TableHead>Days Left</TableHead><TableHead>Quantity</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {expiryItems.map((item) => {
                      const daysLeft = differenceInDays(item.expiry, new Date());
                      return (
                        <TableRow key={item.id}>
                          <TableCell>{item.item}</TableCell>
                          <TableCell className="font-mono">{item.batch}</TableCell>
                          <TableCell>{format(item.expiry, 'MMM dd, yyyy')}</TableCell>
                          <TableCell className={daysLeft < 0 ? 'text-red-600 font-bold' : daysLeft <= 30 ? 'text-yellow-600 font-bold' : ''}>{daysLeft < 0 ? 'EXPIRED' : `${daysLeft} days`}</TableCell>
                          <TableCell>{item.qty} units</TableCell>
                          <TableCell><Badge variant={item.status === 'EXPIRED' ? 'destructive' : item.status === 'EXPIRING_SOON' ? 'destructive' : item.status === 'WARNING' ? 'secondary' : 'outline'}>{item.status.replace('_', ' ')}</Badge></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warranty" className="space-y-4">
          <Card><CardHeader><CardTitle>Equipment Warranty Tracking</CardTitle><CardDescription>Monitor warranty expiration dates</CardDescription></CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader><TableRow><TableHead>Equipment</TableHead><TableHead>Serial Number</TableHead><TableHead>Warranty End Date</TableHead><TableHead>Days Left</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {warrantyItems.map((item) => {
                      const daysLeft = differenceInDays(item.warranty, new Date());
                      return (
                        <TableRow key={item.id}>
                          <TableCell>{item.equipment}</TableCell>
                          <TableCell className="font-mono">{item.serial}</TableCell>
                          <TableCell>{format(item.warranty, 'MMM dd, yyyy')}</TableCell>
                          <TableCell className={daysLeft < 0 ? 'text-red-600 font-bold' : daysLeft <= 30 ? 'text-yellow-600 font-bold' : ''}>{daysLeft < 0 ? 'EXPIRED' : `${daysLeft} days`}</TableCell>
                          <TableCell><Badge variant={item.status === 'EXPIRED' ? 'destructive' : item.status === 'EXPIRING' ? 'secondary' : 'default'}>{item.status}</Badge></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
