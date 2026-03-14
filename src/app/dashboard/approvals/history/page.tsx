'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { History, Printer, Filter } from "lucide-react";

const allHistory = [
  { id: 1,  type: "Purchase Invoice", docNumber: "PINV-202603-0009", date: "2026-03-04", party: "ALI",          amount: 289100.00, status: "Paid",     approvedBy: "developer",  approvedDate: "2026-03-04 14:48", rejectedBy: null, rejectedDate: null, rejectReason: null },
  { id: 2,  type: "GRN",              docNumber: "GRN-202603-0012",  date: "2026-03-04", party: "ALI",          amount: 0,         status: "Approved", approvedBy: null,         approvedDate: null,             rejectedBy: null, rejectedDate: null, rejectReason: null },
  { id: 3,  type: "GRN",              docNumber: "GRN-202603-0009",  date: "2026-03-04", party: "ALI",          amount: 0,         status: "Approved", approvedBy: null,         approvedDate: null,             rejectedBy: null, rejectedDate: null, rejectReason: null },
  { id: 4,  type: "Purchase Order",   docNumber: "PO-202603-0004",   date: "2026-03-04", party: "ALI",          amount: 0,         status: "Approved", approvedBy: null,         approvedDate: null,             rejectedBy: null, rejectedDate: null, rejectReason: null },
  { id: 5,  type: "Requisition",      docNumber: "PR-202603-0007",   date: "2026-03-04", party: "TEST Dep",     amount: 0,         status: "Closed",   approvedBy: "developer",  approvedDate: "2026-03-04 11:18", rejectedBy: null, rejectedDate: null, rejectReason: null },
  { id: 6,  type: "GRN",              docNumber: "GRN-202603-0008",  date: "2026-03-04", party: "ALI",          amount: 0,         status: "Approved", approvedBy: null,         approvedDate: null,             rejectedBy: null, rejectedDate: null, rejectReason: null },
  { id: 7,  type: "Purchase Order",   docNumber: "PO-202603-0003",   date: "2026-03-04", party: "ALI",          amount: 0,         status: "Approved", approvedBy: null,         approvedDate: null,             rejectedBy: null, rejectedDate: null, rejectReason: null },
  { id: 8,  type: "Requisition",      docNumber: "PR-202603-0006",   date: "2026-03-04", party: "TEST Dep",     amount: 0,         status: "Closed",   approvedBy: "developer",  approvedDate: "2026-03-04 11:03", rejectedBy: null, rejectedDate: null, rejectReason: null },
  { id: 9,  type: "Purchase Invoice", docNumber: "PINV-202603-0006", date: "2026-03-04", party: "ALI",          amount: 1427.80,   status: "Unpaid",   approvedBy: null,         approvedDate: null,             rejectedBy: null, rejectedDate: null, rejectReason: null },
  { id: 10, type: "Purchase Invoice", docNumber: "PINV-202603-0007", date: "2026-03-04", party: "ALI",          amount: 7327.80,   status: "Unpaid",   approvedBy: null,         approvedDate: null,             rejectedBy: null, rejectedDate: null, rejectReason: null },
  { id: 11, type: "Supplier Payment", docNumber: "PMT-202603-0001",  date: "2026-03-04", party: "ALI",          amount: 289100.00, status: "Pending",  approvedBy: null,         approvedDate: null,             rejectedBy: null, rejectedDate: null, rejectReason: null },
  { id: 12, type: "Requisition",      docNumber: "PR-202603-0005",   date: "2026-03-03", party: "TEST Dep",     amount: 0,         status: "Pending",  approvedBy: null,         approvedDate: null,             rejectedBy: null, rejectedDate: null, rejectReason: null },
  { id: 13, type: "Requisition",      docNumber: "PR-202603-0004",   date: "2026-03-03", party: "TEST Dep",     amount: 0,         status: "Approved", approvedBy: "developer",  approvedDate: "2026-03-03 13:31", rejectedBy: null, rejectedDate: null, rejectReason: null },
  { id: 14, type: "Purchase Order",   docNumber: "PO-202602-0002",   date: "2026-02-28", party: "LOCAL SUPPLIER", amount: 125000, status: "Approved", approvedBy: "admin",      approvedDate: "2026-02-28 10:05", rejectedBy: null, rejectedDate: null, rejectReason: null },
  { id: 15, type: "Requisition",      docNumber: "PR-202602-0010",   date: "2026-02-25", party: "DESI KITCHEN", amount: 0,         status: "Rejected", approvedBy: null,         approvedDate: null,             rejectedBy: "developer", rejectedDate: "2026-02-25 09:15", rejectReason: "Budget exceeded" },
];

const statusConfig: Record<string, { className: string }> = {
  Approved:  { className: "bg-green-500/15 text-green-700 border-green-200" },
  Closed:    { className: "bg-teal-500/15 text-teal-700 border-teal-200" },
  Paid:      { className: "bg-green-500/15 text-green-700 border-green-200" },
  Unpaid:    { className: "bg-yellow-500/15 text-yellow-700 border-yellow-200" },
  Pending:   { className: "bg-orange-500/15 text-orange-700 border-orange-200" },
  Rejected:  { className: "bg-red-500/15 text-red-700 border-red-200" },
};

const fmt = (n: number) => n > 0 ? `${n.toLocaleString('en-PK', { minimumFractionDigits: 2 })}` : '0.00';

export default function ApprovalHistoryPage() {
  const [fromDate, setFromDate] = useState('2026-02-12');
  const [toDate, setToDate]     = useState('2026-03-14');
  const [docType, setDocType]   = useState('All Types');
  const [status, setStatus]     = useState('All Statuses');

  const filtered = allHistory.filter(h => {
    const matchType = docType === 'All Types' || h.type === docType;
    const matchStatus = status === 'All Statuses' || h.status === status;
    const matchFrom = !fromDate || h.date >= fromDate;
    const matchTo   = !toDate   || h.date <= toDate;
    return matchType && matchStatus && matchFrom && matchTo;
  });

  const docTypes = ['All Types', ...Array.from(new Set(allHistory.map(h => h.type)))];
  const statuses = ['All Statuses', ...Array.from(new Set(allHistory.map(h => h.status)))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Unified Approval History</h1>
          <p className="text-muted-foreground text-sm">View and filter approval history across all modules.</p>
        </div>
        <Button variant="outline" size="sm">
          ← Back to Dashboard
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">FROM DATE</label>
              <Input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">TO DATE</label>
              <Input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">DOCUMENT TYPE</label>
              <Select value={docType} onValueChange={setDocType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {docTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">STATUS</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="mt-3 bg-teal-600 hover:bg-teal-700">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4" />
            History Records
            <Badge variant="secondary" className="ml-auto">{filtered.length} records</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Doc Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Party / Dept</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead>Approved Date</TableHead>
                <TableHead>Rejected By</TableHead>
                <TableHead>Rejected Date</TableHead>
                <TableHead>Reject Reason</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(h => {
                const cfg = statusConfig[h.status] ?? { className: '' };
                return (
                  <TableRow key={h.id} className="text-sm">
                    <TableCell>{h.type}</TableCell>
                    <TableCell className="font-mono text-xs font-semibold text-primary">{h.docNumber}</TableCell>
                    <TableCell>{h.date}</TableCell>
                    <TableCell>{h.party}</TableCell>
                    <TableCell className="text-right font-semibold">{fmt(h.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${cfg.className}`}>{h.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{h.approvedBy ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{h.approvedDate ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{h.rejectedBy ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{h.rejectedDate ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{h.rejectReason ?? '—'}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="outline" size="sm" className="h-6 text-xs px-2">
                        <Printer className="h-3 w-3 mr-1" /> Print
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
