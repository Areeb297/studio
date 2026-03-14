'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

type ApprovalType = 'requisitions' | 'returns' | 'finance' | 'payments' | 'inventory';
type DocStatus = 'Pending' | 'Approved' | 'Rejected';

interface ApprovalItem {
  docNo: string;
  date: string;
  requestedBy: string;
  dept: string;
  details: string;
  daysPending: number;
  status: DocStatus;
}

function generateItems(type: ApprovalType): ApprovalItem[] {
  const depts = ['DESI KITCHEN', 'CHINESE KITCHEN', 'BBQ KITCHEN', 'RESTAURANT STORE DEPT', 'ADMIN', 'GENERAL STORE', 'KITCHEN STORE', 'COLD STORE', 'DRY STORE', 'ACCOUNTS'];
  const requestors = ['Store Keeper', 'Head Chef A', 'Head Chef B', 'Head Chef C', 'Admin Manager', 'Finance Officer', 'Purchasing Officer', 'Warehouse Mgr'];
  const prefixes: Record<ApprovalType, string> = {
    requisitions: 'PR', returns: 'RET', finance: 'FIN', payments: 'PAY', inventory: 'GRN',
  };
  const detailsMap: Record<ApprovalType, (i: number) => string> = {
    requisitions: (i) => `${5 + i} items — PKR ${(8000 + i * 3400).toLocaleString()}`,
    returns: (i) => `Return of ${2 + i} items from ${depts[i % 5]}`,
    finance: (i) => `Invoice INV-202603-${String(i + 1).padStart(4, '0')} — PKR ${(12000 + i * 8500).toLocaleString()}`,
    payments: (i) => `Payment to ${['ALI', 'LOCAL SUPPLIER', 'SALEEM BHAI', 'Al-Madina', 'CHICKEN SUPPLIER'][i % 5]} — PKR ${(18000 + i * 6200).toLocaleString()}`,
    inventory: (i) => `GRN ${5 + i} items from ${['ALI', 'SALEEM BHAI', 'Al-Madina', 'CHICKEN SUPPLIER', 'LOCAL SUPPLIER'][i % 5]}`,
  };

  const counts: Record<ApprovalType, number> = { requisitions: 12, returns: 4, finance: 7, payments: 14, inventory: 10 };
  const total = counts[type];

  return Array.from({ length: total }, (_, i) => ({
    docNo: `${prefixes[type]}-202603-${String(i + 1).padStart(4, '0')}`,
    date: `${Math.max(1, 14 - Math.floor(i / 3))} Mar 2026`,
    requestedBy: requestors[i % requestors.length],
    dept: depts[i % depts.length],
    details: detailsMap[type](i),
    daysPending: Math.floor(i / 3) + 1,
    status: i === 0 ? 'Approved' : i === 1 ? 'Rejected' : 'Pending',
  }));
}

const statusStyle: Record<DocStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700 border-amber-300',
  Approved: 'bg-green-100 text-green-700 border-green-300',
  Rejected: 'bg-red-100 text-red-700 border-red-300',
};

type TabType = 'All' | DocStatus;

interface ApprovalListProps {
  title: string;
  type: ApprovalType;
  description: string;
}

export function ApprovalList({ title, type, description }: ApprovalListProps) {
  const [items, setItems] = useState(() => generateItems(type));
  const [activeTab, setActiveTab] = useState<TabType>('All');

  const approve = (docNo: string) => setItems((prev) => prev.map((i) => i.docNo === docNo ? { ...i, status: 'Approved' as DocStatus } : i));
  const reject = (docNo: string) => setItems((prev) => prev.map((i) => i.docNo === docNo ? { ...i, status: 'Rejected' as DocStatus } : i));

  const filtered = items.filter((i) => activeTab === 'All' || i.status === activeTab);

  const pending = items.filter((i) => i.status === 'Pending').length;
  const approvedToday = items.filter((i) => i.status === 'Approved').length;
  const escalated = items.filter((i) => i.daysPending >= 3 && i.status === 'Pending').length;
  const avgResponse = items.filter((i) => i.status !== 'Pending').length > 0
    ? (items.filter((i) => i.status !== 'Pending').reduce((a, i) => a + i.daysPending, 0) / items.filter((i) => i.status !== 'Pending').length).toFixed(1)
    : '—';

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending', value: pending.toString(), icon: Clock, color: 'text-amber-600' },
          { label: 'Approved', value: approvedToday.toString(), icon: CheckCircle2, color: 'text-green-600' },
          { label: 'Avg Response Time', value: `${avgResponse} days`, icon: Clock, color: 'text-blue-600' },
          { label: 'Escalated (>3 days)', value: escalated.toString(), icon: AlertTriangle, color: 'text-red-600' },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2">
        {(['All', 'Pending', 'Approved', 'Rejected'] as TabType[]).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab !== 'All' && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-white/20' : 'bg-muted'}`}>
                {items.filter((i) => i.status === tab).length}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Approvals Table */}
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Showing {filtered.length} of {items.length} documents</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doc No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Amount / Details</TableHead>
                <TableHead className="text-center">Days Pending</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.docNo}>
                  <TableCell className="font-mono text-sm font-medium">{row.docNo}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.date}</TableCell>
                  <TableCell className="text-sm">{row.requestedBy}</TableCell>
                  <TableCell className="text-sm font-medium">{row.dept}</TableCell>
                  <TableCell className="text-sm">{row.details}</TableCell>
                  <TableCell className="text-center">
                    <span className={`text-sm font-medium ${row.daysPending >= 3 ? 'text-red-600' : row.daysPending >= 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                      {row.status === 'Pending' ? `${row.daysPending}d` : '—'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={statusStyle[row.status]}>{row.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {row.status === 'Pending' ? (
                      <div className="flex gap-1 justify-center">
                        <Button variant="outline" size="sm" className="text-green-600 border-green-300 hover:bg-green-50" onClick={() => approve(row.docNo)}>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50" onClick={() => reject(row.docNo)}>
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" className="w-full justify-center">View</Button>
                    )}
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
