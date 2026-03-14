'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { XCircle, RotateCcw, Search, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type ActionType = 'void' | 'refund';

interface VoidRecord {
  id: number;
  orderNo: string;
  date: string;
  time: string;
  type: ActionType;
  amount: number;
  reason: string;
  authorizedBy: string;
  cashier: string;
  status: 'approved' | 'pending';
  items: string;
}

const mockRecords: VoidRecord[] = [
  { id: 1, orderNo: "#367", date: "2026-03-13", time: "20:12", type: "refund", amount: 3000, reason: "Customer complaint - wrong order", authorizedBy: "admin", cashier: "developer", status: "approved", items: "Mutton Karahi ×1, Chicken Biryani ×4" },
  { id: 2, orderNo: "#345", date: "2026-03-13", time: "14:45", type: "void",   amount: 560,  reason: "Item entered in error", authorizedBy: "admin", cashier: "admin", status: "approved", items: "Chicken Tikka ×1, Naan ×2" },
  { id: 3, orderNo: "#312", date: "2026-03-12", time: "19:30", type: "void",   amount: 1200, reason: "Customer cancelled before preparation", authorizedBy: "gm", cashier: "developer", status: "approved", items: "Mutton Biryani ×2, Lassi ×2" },
  { id: 4, orderNo: "#298", date: "2026-03-11", time: "13:20", type: "refund", amount: 850,  reason: "Food quality issue", authorizedBy: "admin", cashier: "PRUSER", status: "approved", items: "Chicken Karahi ×1" },
  { id: 5, orderNo: "#381", date: "2026-03-14", time: "13:47", type: "void",   amount: 280,  reason: "Duplicate entry", authorizedBy: "",     cashier: "admin", status: "pending", items: "Naan ×4, Raita ×2" },
];

const VOID_REASONS = [
  "Item entered in error",
  "Customer cancelled before preparation",
  "Duplicate entry",
  "Wrong table assigned",
  "Test order",
  "Other",
];

const REFUND_REASONS = [
  "Customer complaint - wrong order",
  "Food quality issue",
  "Long wait time - customer left",
  "Incorrect charge",
  "Partial refund agreed",
  "Other",
];

export default function VoidsRefundsPage() {
  const [records, setRecords] = useState<VoidRecord[]>(mockRecords);
  const [actionType, setActionType] = useState<ActionType>('void');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [orderNo, setOrderNo] = useState('');
  const [reason, setReason] = useState('');
  const [managerPin, setManagerPin] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [pinError, setPinError] = useState(false);

  const filtered = records.filter(r =>
    r.orderNo.toLowerCase().includes(search.toLowerCase()) ||
    r.reason.toLowerCase().includes(search.toLowerCase()) ||
    r.cashier.toLowerCase().includes(search.toLowerCase())
  );

  const totalVoided  = records.filter(r => r.type === 'void'   && r.status === 'approved').reduce((s, r) => s + r.amount, 0);
  const totalRefunded = records.filter(r => r.type === 'refund' && r.status === 'approved').reduce((s, r) => s + r.amount, 0);
  const pending = records.filter(r => r.status === 'pending').length;

  const handleSubmit = () => {
    if (managerPin !== '1234') { setPinError(true); return; }
    setPinError(false);
    setSubmitted(true);
    // Approve pending if exists
    setRecords(prev => prev.map(r => r.status === 'pending' ? { ...r, status: 'approved', authorizedBy: 'admin' } : r));
  };

  const openDialog = (type: ActionType) => {
    setActionType(type); setOrderNo(''); setReason(''); setManagerPin(''); setRemarks(''); setSubmitted(false); setPinError(false);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <XCircle className="h-6 w-6 text-red-600" /> Voids & Refunds
          </h1>
          <p className="text-muted-foreground text-sm">Manager-authorized order voids and customer refunds with full audit trail</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="text-red-600 border-red-200 gap-1.5" onClick={() => openDialog('void')}>
            <XCircle className="h-4 w-4" /> Void Order
          </Button>
          <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 gap-1.5" onClick={() => openDialog('refund')}>
            <RotateCcw className="h-4 w-4" /> Process Refund
          </Button>
        </div>
      </div>

      {/* Permission note */}
      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
        <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
        <span><strong>Manager PIN required</strong> for all voids and refunds. All actions are logged with timestamp and authorizing user for audit compliance.</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Voids (Today)", value: records.filter(r => r.type === 'void' && r.date === '2026-03-14').length, icon: XCircle, color: "text-red-600" },
          { label: "Total Refunds (Today)", value: records.filter(r => r.type === 'refund' && r.date === '2026-03-14').length, icon: RotateCcw, color: "text-blue-600" },
          { label: "Voided Amount", value: `Rs. ${totalVoided.toLocaleString()}`, icon: AlertTriangle, color: "text-amber-600" },
          { label: "Refunded Amount", value: `Rs. ${totalRefunded.toLocaleString()}`, icon: RotateCcw, color: "text-purple-600" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4 flex items-start gap-3">
              <s.icon className={cn("h-7 w-7 mt-0.5", s.color)} />
              <div>
                <p className={cn("text-lg font-bold", s.color)}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending badge */}
      {pending > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4" />
          <span>{pending} void/refund request{pending > 1 ? 's' : ''} pending manager approval</span>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search order #, reason, cashier..." className="pl-9 max-w-sm" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold text-xs">Order #</th>
                  <th className="text-left p-3 font-semibold text-xs">Date & Time</th>
                  <th className="text-left p-3 font-semibold text-xs">Type</th>
                  <th className="text-left p-3 font-semibold text-xs">Items</th>
                  <th className="text-right p-3 font-semibold text-xs">Amount</th>
                  <th className="text-left p-3 font-semibold text-xs">Reason</th>
                  <th className="text-left p-3 font-semibold text-xs">Cashier</th>
                  <th className="text-left p-3 font-semibold text-xs">Auth By</th>
                  <th className="text-left p-3 font-semibold text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="border-b hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-mono text-xs font-semibold text-primary">{r.orderNo}</td>
                    <td className="p-3 text-xs text-muted-foreground">{r.date} {r.time}</td>
                    <td className="p-3">
                      <Badge variant="outline" className={cn("text-xs font-semibold",
                        r.type === 'void' ? "bg-red-50 text-red-700 border-red-200" : "bg-blue-50 text-blue-700 border-blue-200")}>
                        {r.type === 'void' ? <><XCircle className="h-3 w-3 mr-1 inline" />Void</> : <><RotateCcw className="h-3 w-3 mr-1 inline" />Refund</>}
                      </Badge>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground max-w-[180px] truncate">{r.items}</td>
                    <td className="p-3 text-right font-bold text-red-700">Rs. {r.amount.toLocaleString()}</td>
                    <td className="p-3 text-xs max-w-[160px] truncate">{r.reason}</td>
                    <td className="p-3 text-xs">{r.cashier}</td>
                    <td className="p-3 text-xs">{r.authorizedBy || <span className="text-amber-600 font-medium">Pending</span>}</td>
                    <td className="p-3">
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium",
                        r.status === 'approved' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                        {r.status === 'approved' ? '✓ Approved' : '⏳ Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Void/Refund Dialog */}
      <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className={cn("flex items-center gap-2", actionType === 'void' ? "text-red-700" : "text-blue-700")}>
              {actionType === 'void' ? <XCircle className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
              {actionType === 'void' ? 'Void Order' : 'Process Refund'}
            </DialogTitle>
          </DialogHeader>
          {!submitted ? (
            <div className="space-y-3 py-1">
              <div className="space-y-1">
                <Label className="text-xs">Order Number</Label>
                <Input placeholder="e.g. #381" value={orderNo} onChange={e => setOrderNo(e.target.value)} className="text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Reason</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="text-sm"><SelectValue placeholder="Select reason..." /></SelectTrigger>
                  <SelectContent>
                    {(actionType === 'void' ? VOID_REASONS : REFUND_REASONS).map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Remarks (optional)</Label>
                <Textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={2} className="text-sm resize-none" placeholder="Additional notes..." />
              </div>
              <div className="space-y-1">
                <Label className="text-xs flex items-center gap-1"><ShieldAlert className="h-3.5 w-3.5 text-amber-500" /> Manager PIN</Label>
                <Input type="password" placeholder="Enter manager PIN" value={managerPin} onChange={e => { setManagerPin(e.target.value); setPinError(false); }} className={cn("text-sm", pinError && "border-red-400")} maxLength={6} />
                {pinError && <p className="text-xs text-red-600">Incorrect PIN. Please try again.</p>}
                <p className="text-[10px] text-muted-foreground">Demo PIN: 1234</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-6 gap-3 text-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="font-bold text-lg">{actionType === 'void' ? 'Order Voided' : 'Refund Processed'}</p>
              <p className="text-sm text-muted-foreground">Transaction has been recorded in the audit log.</p>
            </div>
          )}
          <DialogFooter className="gap-2">
            {!submitted ? <>
              <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button size="sm" className={actionType === 'void' ? "bg-red-600 hover:bg-red-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
                disabled={!orderNo || !reason || !managerPin} onClick={handleSubmit}>
                Confirm {actionType === 'void' ? 'Void' : 'Refund'}
              </Button>
            </> : (
              <Button size="sm" className="w-full" onClick={() => setDialogOpen(false)}>Done</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
