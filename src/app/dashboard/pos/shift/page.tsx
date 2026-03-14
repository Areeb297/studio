'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Clock, DollarSign, TrendingUp, Users, Printer, LogIn, LogOut, Banknote, CreditCard, Smartphone, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ShiftStatus = 'open' | 'closed';

interface ShiftSummary {
  cashier: string;
  openTime: string;
  openFloat: number;
  orders: { no: string; time: string; type: string; payment: string; amount: number; }[];
}

const currentShift: ShiftSummary = {
  cashier: "admin",
  openTime: "08:00",
  openFloat: 5000,
  orders: [
    { no: "#367", time: "08:25", type: "Dine-in",  payment: "Cash",      amount: 1660 },
    { no: "#368", time: "09:10", type: "Delivery", payment: "JazzCash",  amount: 3000 },
    { no: "#369", time: "09:45", type: "Dine-in",  payment: "Cash",      amount: 2000 },
    { no: "#370", time: "10:20", type: "Staff",    payment: "—",         amount: 0    },
    { no: "#371", time: "11:20", type: "Booking",  payment: "Bank Transfer", amount: 35000 },
    { no: "#372", time: "11:40", type: "Takeaway", payment: "Cash",      amount: 780  },
    { no: "#373", time: "11:55", type: "Dine-in",  payment: "Cash",      amount: 2000 },
    { no: "#374", time: "12:10", type: "Dine-in",  payment: "Card",      amount: 1500 },
    { no: "#375", time: "12:50", type: "Dine-in",  payment: "Cash",      amount: 1320 },
    { no: "#376", time: "12:38", type: "Mess",     payment: "Cash",      amount: 1800 },
    { no: "#377", time: "13:05", type: "Delivery", payment: "Easypaisa", amount: 1040 },
    { no: "#378", time: "13:18", type: "Dine-in",  payment: "Card",      amount: 560  },
    { no: "#379", time: "13:32", type: "Takeaway", payment: "JazzCash",  amount: 920  },
    { no: "#380", time: "13:45", type: "Dine-in",  payment: "Cash",      amount: 2650 },
  ],
};

const pastShifts = [
  { id: 1, cashier: "developer", date: "2026-03-13", open: "08:00", close: "20:00", float: 5000, cash: 48200, card: 12500, digital: 9300, total: 70000, orders: 32 },
  { id: 2, cashier: "admin",     date: "2026-03-13", open: "20:00", close: "00:00", float: 5000, cash: 22400, card: 6800,  digital: 4100, total: 33300, orders: 16 },
  { id: 3, cashier: "PRUSER",    date: "2026-03-12", open: "08:00", close: "20:00", float: 5000, cash: 41000, card: 9200,  digital: 8600, total: 58800, orders: 28 },
];

export default function CashierShiftPage() {
  const [shiftStatus, setShiftStatus] = useState<ShiftStatus>('open');
  const [closeOpen, setCloseOpen] = useState(false);
  const [openOpen, setOpenOpen] = useState(false);
  const [cashCount, setCashCount] = useState('');
  const [float, setFloat] = useState('5000');
  const [tab, setTab] = useState<'current' | 'history'>('current');
  const [closeDone, setCloseDone] = useState(false);

  const cashSales  = currentShift.orders.filter(o => o.payment === 'Cash').reduce((s, o) => s + o.amount, 0);
  const cardSales  = currentShift.orders.filter(o => o.payment === 'Card').reduce((s, o) => s + o.amount, 0);
  const digitalSales = currentShift.orders.filter(o => ['JazzCash','Easypaisa','Bank Transfer'].includes(o.payment)).reduce((s, o) => s + o.amount, 0);
  const totalSales = cashSales + cardSales + digitalSales;
  const expectedCash = currentShift.openFloat + cashSales;
  const variance = cashCount ? Number(cashCount) - expectedCash : null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Clock className="h-6 w-6 text-blue-600" /> Cashier Shift
          </h1>
          <p className="text-muted-foreground text-sm">Open / close shifts, cash float, and daily reconciliation</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn("font-semibold", shiftStatus === 'open' ? "bg-green-500 text-white" : "bg-red-500 text-white")}>
            Shift {shiftStatus === 'open' ? 'OPEN' : 'CLOSED'}
          </Badge>
          {shiftStatus === 'open'
            ? <Button size="sm" variant="outline" className="text-red-600 border-red-200 gap-1.5" onClick={() => setCloseOpen(true)}><LogOut className="h-4 w-4" /> Close Shift</Button>
            : <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1.5" onClick={() => setOpenOpen(true)}><LogIn className="h-4 w-4" /> Open Shift</Button>
          }
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {(['current', 'history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors capitalize",
              tab === t ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground hover:text-foreground")}>
            {t === 'current' ? 'Current Shift' : 'Shift History'}
          </button>
        ))}
      </div>

      {tab === 'current' && (
        <>
          {/* Shift info banner */}
          <div className="rounded-xl border bg-blue-50 border-blue-200 p-4 flex flex-wrap gap-4 items-center">
            <div><p className="text-xs text-muted-foreground">Cashier</p><p className="font-bold">{currentShift.cashier}</p></div>
            <div><p className="text-xs text-muted-foreground">Shift Opened</p><p className="font-bold">2026-03-14 · {currentShift.openTime}</p></div>
            <div><p className="text-xs text-muted-foreground">Opening Float</p><p className="font-bold text-green-700">Rs. {currentShift.openFloat.toLocaleString()}</p></div>
            <div><p className="text-xs text-muted-foreground">Orders</p><p className="font-bold">{currentShift.orders.filter(o => o.amount > 0).length}</p></div>
            <div className="ml-auto">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Printer className="h-3.5 w-3.5" /> Print Z-Report</Button>
            </div>
          </div>

          {/* Sales breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Cash Sales",    value: cashSales,    icon: Banknote,    color: "text-green-600" },
              { label: "Card Sales",    value: cardSales,    icon: CreditCard,  color: "text-blue-600" },
              { label: "Digital Sales", value: digitalSales, icon: Smartphone,  color: "text-purple-600" },
              { label: "Total Revenue", value: totalSales,   icon: TrendingUp,  color: "text-amber-600" },
            ].map(s => (
              <Card key={s.label}>
                <CardContent className="pt-4 flex items-start gap-3">
                  <s.icon className={cn("h-7 w-7 mt-0.5", s.color)} />
                  <div>
                    <p className={cn("text-lg font-bold", s.color)}>Rs. {s.value.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order log */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Orders This Shift</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="text-left p-2.5 text-xs font-semibold">Order #</th>
                      <th className="text-left p-2.5 text-xs font-semibold">Time</th>
                      <th className="text-left p-2.5 text-xs font-semibold">Type</th>
                      <th className="text-left p-2.5 text-xs font-semibold">Payment</th>
                      <th className="text-right p-2.5 text-xs font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentShift.orders.map(o => (
                      <tr key={o.no} className="border-b hover:bg-muted/20">
                        <td className="p-2.5 font-mono text-xs font-semibold text-primary">{o.no}</td>
                        <td className="p-2.5 text-xs text-muted-foreground">{o.time}</td>
                        <td className="p-2.5 text-xs">{o.type}</td>
                        <td className="p-2.5 text-xs">{o.payment}</td>
                        <td className="p-2.5 text-right text-xs font-semibold">{o.amount > 0 ? `Rs. ${o.amount.toLocaleString()}` : <span className="text-muted-foreground">Free</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t bg-muted/30">
                      <td colSpan={4} className="p-2.5 text-xs font-bold text-right">Total</td>
                      <td className="p-2.5 text-right text-sm font-bold text-green-700">Rs. {totalSales.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {tab === 'history' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-semibold text-xs">Date</th>
                    <th className="text-left p-3 font-semibold text-xs">Cashier</th>
                    <th className="text-left p-3 font-semibold text-xs">Open / Close</th>
                    <th className="text-right p-3 font-semibold text-xs">Cash</th>
                    <th className="text-right p-3 font-semibold text-xs">Card</th>
                    <th className="text-right p-3 font-semibold text-xs">Digital</th>
                    <th className="text-right p-3 font-semibold text-xs">Total</th>
                    <th className="text-right p-3 font-semibold text-xs">Orders</th>
                    <th className="text-center p-3 font-semibold text-xs">Report</th>
                  </tr>
                </thead>
                <tbody>
                  {pastShifts.map(s => (
                    <tr key={s.id} className="border-b hover:bg-muted/20">
                      <td className="p-3 text-xs text-muted-foreground">{s.date}</td>
                      <td className="p-3 text-sm font-medium">{s.cashier}</td>
                      <td className="p-3 text-xs text-muted-foreground">{s.open} → {s.close}</td>
                      <td className="p-3 text-right text-xs">Rs. {s.cash.toLocaleString()}</td>
                      <td className="p-3 text-right text-xs">Rs. {s.card.toLocaleString()}</td>
                      <td className="p-3 text-right text-xs">Rs. {s.digital.toLocaleString()}</td>
                      <td className="p-3 text-right font-bold text-green-700">Rs. {s.total.toLocaleString()}</td>
                      <td className="p-3 text-right">{s.orders}</td>
                      <td className="p-3 text-center">
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1"><Printer className="h-3 w-3" /> Z</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Close Shift Dialog */}
      <Dialog open={closeOpen} onOpenChange={() => { setCloseOpen(false); setCloseDone(false); setCashCount(''); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><LogOut className="h-4 w-4 text-red-600" /> Close Shift</DialogTitle>
          </DialogHeader>
          {!closeDone ? (
            <div className="space-y-4 py-1">
              <div className="rounded-lg bg-muted p-3 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Opening Float</span><span>Rs. {currentShift.openFloat.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Cash Sales</span><span>Rs. {cashSales.toLocaleString()}</span></div>
                <div className="flex justify-between font-semibold"><span>Expected Cash</span><span className="text-green-700">Rs. {expectedCash.toLocaleString()}</span></div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Actual Cash Count in Drawer</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">Rs.</span>
                  <Input type="number" value={cashCount} onChange={e => setCashCount(e.target.value)} className="pl-10 text-sm" placeholder="0" />
                </div>
                {variance !== null && (
                  <p className={cn("text-xs font-semibold", variance === 0 ? "text-green-600" : variance > 0 ? "text-amber-600" : "text-red-600")}>
                    {variance === 0 ? "✓ Balanced" : variance > 0 ? `▲ Over by Rs. ${Math.abs(variance).toLocaleString()}` : `▼ Short by Rs. ${Math.abs(variance).toLocaleString()}`}
                  </p>
                )}
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded bg-muted p-2"><p className="text-muted-foreground">Card</p><p className="font-bold">Rs. {cardSales.toLocaleString()}</p></div>
                <div className="rounded bg-muted p-2"><p className="text-muted-foreground">Digital</p><p className="font-bold">Rs. {digitalSales.toLocaleString()}</p></div>
                <div className="rounded bg-muted p-2 col-span-2"><p className="text-muted-foreground">Total Revenue</p><p className="font-bold text-green-700 text-base">Rs. {totalSales.toLocaleString()}</p></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-6 gap-3 text-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="font-bold text-lg">Shift Closed</p>
              <p className="text-sm text-muted-foreground">Z-Report has been printed. Have a great day!</p>
            </div>
          )}
          <DialogFooter className="gap-2">
            {!closeDone && <>
              <Button variant="outline" size="sm" onClick={() => setCloseOpen(false)}>Cancel</Button>
              <Button variant="outline" size="sm" className="gap-1"><Printer className="h-3.5 w-3.5" /> Print Z-Report</Button>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => { setShiftStatus('closed'); setCloseDone(true); }}>Close & Submit</Button>
            </>}
            {closeDone && <Button size="sm" className="w-full" onClick={() => { setCloseOpen(false); setCloseDone(false); }}>Done</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Open Shift Dialog */}
      <Dialog open={openOpen} onOpenChange={setOpenOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><LogIn className="h-4 w-4 text-green-600" /> Open New Shift</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="space-y-1.5">
              <Label className="text-xs">Opening Float (Cash in Drawer)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">Rs.</span>
                <Input type="number" value={float} onChange={e => setFloat(e.target.value)} className="pl-10 text-sm" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Cashier: admin · Time: 14:00</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpenOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => { setShiftStatus('open'); setOpenOpen(false); }}>Open Shift</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
