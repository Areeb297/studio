'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CheckSquare,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  ShoppingBag,
  PackageCheck,
  Receipt,
  Search,
  Eye,
} from "lucide-react";

const mockPendingApprovals = [
  {
    id: 1,
    type: "Requisition",
    docNumber: "PR-202603-0008",
    date: "2026-03-13",
    party: "TEST Dep",
    amount: 0,
    requestedBy: "store_keeper",
    priority: "High",
    description: "Monthly stock replenishment for COLD STORE",
    items: [
      { name: "GOAT (BAKRA) A", qty: 10, unit: "KG", rate: 1800 },
      { name: "CHICKEN WHOLE", qty: 25, unit: "KG", rate: 480 },
      { name: "BEEF UNDERCUT", qty: 15, unit: "KG", rate: 1200 },
    ],
    slaHours: 24,
    ageHours: 6,
  },
  {
    id: 2,
    type: "Purchase Order",
    docNumber: "PO-202603-0005",
    date: "2026-03-12",
    party: "LOCAL SUPPLIER",
    amount: 125000,
    requestedBy: "purchasing_officer",
    priority: "Medium",
    description: "PO for dry goods replenishment",
    items: [
      { name: "BASMATI RICE (25KG)", qty: 20, unit: "BAG", rate: 3200 },
      { name: "COOKING OIL (5L)", qty: 30, unit: "TIN", rate: 1850 },
      { name: "ATTA FLOUR (10KG)", qty: 40, unit: "BAG", rate: 900 },
    ],
    slaHours: 48,
    ageHours: 18,
  },
  {
    id: 3,
    type: "GRN",
    docNumber: "GRN-202603-0015",
    date: "2026-03-13",
    party: "SALEEM BHAI",
    amount: 43200,
    requestedBy: "store_keeper",
    priority: "Medium",
    description: "Meat delivery received at restaurant store",
    items: [
      { name: "KALEJI (LIVER)", qty: 20, unit: "KG", rate: 850 },
      { name: "TUKH MALANGA (PKT)", qty: 50, unit: "PKT", rate: 180 },
    ],
    slaHours: 24,
    ageHours: 4,
  },
  {
    id: 4,
    type: "Purchase Invoice",
    docNumber: "PINV-202603-0010",
    date: "2026-03-13",
    party: "Al-Madina",
    amount: 33600,
    requestedBy: "purchasing_officer",
    priority: "Low",
    description: "Invoice for dry goods PO-202602-0007",
    items: [],
    slaHours: 72,
    ageHours: 12,
  },
];

const typeIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "Requisition": FileText,
  "Purchase Order": ShoppingBag,
  "GRN": PackageCheck,
  "Purchase Invoice": Receipt,
};

const typeBadgeColor: Record<string, string> = {
  "Requisition": "bg-blue-500/15 text-blue-700 border-blue-200 dark:text-blue-400",
  "Purchase Order": "bg-purple-500/15 text-purple-700 border-purple-200 dark:text-purple-400",
  "GRN": "bg-teal-500/15 text-teal-700 border-teal-200 dark:text-teal-400",
  "Purchase Invoice": "bg-orange-500/15 text-orange-700 border-orange-200 dark:text-orange-400",
};

const fmt = (n: number) => n > 0 ? `Rs. ${n.toLocaleString('en-PK', { minimumFractionDigits: 2 })}` : '—';

export default function PendingApprovalsPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof mockPendingApprovals[0] | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approved, setApproved] = useState<number[]>([]);
  const [rejected, setRejected] = useState<number[]>([]);

  const pending = mockPendingApprovals.filter(
    a => !approved.includes(a.id) && !rejected.includes(a.id)
  );

  const filtered = pending.filter(a =>
    a.docNumber.toLowerCase().includes(search.toLowerCase()) ||
    a.type.toLowerCase().includes(search.toLowerCase()) ||
    a.party.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = () => {
    if (!selected || !action) return;
    if (action === 'approve') setApproved(prev => [...prev, selected.id]);
    else setRejected(prev => [...prev, selected.id]);
    setSelected(null);
    setAction(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pending Approvals</h1>
        <p className="text-muted-foreground text-sm">Review and act on documents awaiting your approval</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending", value: pending.length, icon: Clock, color: "text-yellow-600" },
          { label: "Approved Today", value: approved.length, icon: CheckCircle, color: "text-green-600" },
          { label: "Rejected Today", value: rejected.length, icon: XCircle, color: "text-red-600" },
          { label: "Overdue SLA", value: pending.filter(a => a.ageHours > a.slaHours).length, icon: AlertTriangle, color: "text-orange-600" },
        ].map(card => (
          <Card key={card.label}>
            <CardContent className="pt-4 flex items-center gap-3">
              <card.icon className={`h-6 w-6 ${card.color}`} />
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by doc #, type, party..."
          className="pl-9"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Approval cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <p className="font-semibold">All clear!</p>
              <p className="text-sm text-muted-foreground">No pending approvals at this time.</p>
            </CardContent>
          </Card>
        )}
        {filtered.map(item => {
          const Icon = typeIconMap[item.type] ?? FileText;
          const slaPercent = Math.min((item.ageHours / item.slaHours) * 100, 100);
          const slaColor = slaPercent >= 90 ? 'bg-red-500' : slaPercent >= 60 ? 'bg-yellow-500' : 'bg-green-500';
          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-muted">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-semibold text-primary">{item.docNumber}</span>
                        <Badge variant="outline" className={`text-xs ${typeBadgeColor[item.type]}`}>{item.type}</Badge>
                        {item.priority === 'High' && (
                          <Badge variant="outline" className="text-xs bg-red-500/10 text-red-600 border-red-200">High Priority</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
                      <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                        <span>Party: <strong className="text-foreground">{item.party}</strong></span>
                        <span>Date: {item.date}</span>
                        {item.amount > 0 && <span>Amount: <strong className="text-foreground">{fmt(item.amount)}</strong></span>}
                      </div>
                      {/* SLA indicator */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[120px]">
                          <div className={`h-full rounded-full ${slaColor}`} style={{ width: `${slaPercent}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {item.ageHours}h / {item.slaHours}h SLA
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:flex-col">
                    <Button size="sm" variant="outline" onClick={() => setSelected(item)}>
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => { setSelected(item); setAction('approve'); }}>
                      <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive"
                      onClick={() => { setSelected(item); setAction('reject'); }}>
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detail / Action Dialog */}
      <Dialog open={!!selected} onOpenChange={() => { setSelected(null); setAction(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selected && (() => { const Icon = typeIconMap[selected.type] ?? FileText; return <Icon className="h-5 w-5 text-primary" />; })()}
              {selected?.docNumber}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Type</span><p className="font-semibold">{selected.type}</p></div>
                <div><span className="text-muted-foreground">Date</span><p className="font-semibold">{selected.date}</p></div>
                <div><span className="text-muted-foreground">Party / Dept</span><p className="font-semibold">{selected.party}</p></div>
                <div><span className="text-muted-foreground">Amount</span><p className="font-semibold">{fmt(selected.amount)}</p></div>
                <div className="col-span-2"><span className="text-muted-foreground">Description</span><p className="font-semibold">{selected.description}</p></div>
              </div>

              {selected.items.length > 0 && (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-right">Rate</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selected.items.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs">{item.name}</TableCell>
                          <TableCell className="text-right text-xs">{item.qty}</TableCell>
                          <TableCell className="text-xs">{item.unit}</TableCell>
                          <TableCell className="text-right text-xs">Rs. {item.rate.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-xs font-semibold">Rs. {(item.qty * item.rate).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {action === 'reject' && (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Rejection Reason <span className="text-red-500">*</span></label>
                  <Textarea
                    placeholder="Enter reason for rejection..."
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelected(null); setAction(null); }}>Cancel</Button>
            {action === 'approve' && (
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleAction}>
                <CheckCircle className="h-4 w-4 mr-1" /> Confirm Approve
              </Button>
            )}
            {action === 'reject' && (
              <Button variant="destructive" onClick={handleAction} disabled={!rejectionReason}>
                <XCircle className="h-4 w-4 mr-1" /> Confirm Reject
              </Button>
            )}
            {!action && (
              <div className="flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => setAction('approve')}>Approve</Button>
                <Button variant="destructive" onClick={() => setAction('reject')}>Reject</Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
