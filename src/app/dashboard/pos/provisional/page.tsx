'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Printer, Receipt, ArrowRight, Clock, Users, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock provisional bills (running open tables) ────────────────────────────

const provisionalBills = [
  {
    invoiceNo:   "PROV-2026-001",
    table:       "T-4",
    guests:      3,
    costCentre:  "Binoria Restaurant",
    customer:    "Walking Customer",
    openedAt:    "02:36 PM",
    waiter:      "Ahmed",
    items: [
      { name: "B.B.Q Matka Biryani",   qty: 3, price: 650  },
      { name: "Raita",                  qty: 1, price: 200  },
      { name: "Green Salad",            qty: 1, price: 190  },
      { name: "Pakola M. Water (L)",    qty: 1, price: 130  },
      { name: "B.B.Q Matka Biryani",   qty: 2, price: 650  },
    ],
  },
  {
    invoiceNo:   "PROV-2026-002",
    table:       "T-12",
    guests:      4,
    costCentre:  "Binoria Restaurant",
    customer:    "Walking Customer",
    openedAt:    "03:02 PM",
    waiter:      "Bilal",
    items: [
      { name: "Pakola M. Water (L)",    qty: 1, price: 130 },
      { name: "Raita",                  qty: 1, price: 200 },
      { name: "Green Salad",            qty: 1, price: 190 },
      { name: "Mutton Qeema Hara Masala", qty: 1, price: 950 },
      { name: "Chicken Biryani (1 PC)", qty: 1, price: 480 },
    ],
  },
  {
    invoiceNo:   "PROV-2026-003",
    table:       "T-3",
    guests:      3,
    costCentre:  "Binoria Restaurant",
    customer:    "Walking Customer",
    openedAt:    "03:15 PM",
    waiter:      "Kamran",
    items: [
      { name: "Chicken Karahi",        qty: 1, price: 900 },
      { name: "Naan",                   qty: 6, price: 30  },
      { name: "Lassi",                  qty: 2, price: 80  },
    ],
  },
];

function calcTotal(items: { qty: number; price: number }[]) {
  return items.reduce((s, i) => s + i.qty * i.price, 0);
}

export default function ProvisionalInvoicePage() {
  const [selectedBill, setSelectedBill] = useState(provisionalBills[0].invoiceNo);
  const bill = provisionalBills.find(b => b.invoiceNo === selectedBill) ?? provisionalBills[0];
  const subtotal = calcTotal(bill.items);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" /> Provisional Invoice
          </h1>
          <p className="text-muted-foreground text-sm">Running bills for open tables — print for customer without closing</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-500/15 text-amber-700 border-amber-200 font-medium">
            {provisionalBills.length} Open Tables
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">

        {/* ── Left: table selector ──────────────────────────────────────── */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Open Tables</p>
          {provisionalBills.map(b => {
            const total = calcTotal(b.items);
            const isSelected = b.invoiceNo === selectedBill;
            return (
              <button
                key={b.invoiceNo}
                onClick={() => setSelectedBill(b.invoiceNo)}
                className={cn(
                  "w-full rounded-lg border p-3 text-left transition-all duration-150",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-primary/40 hover:bg-muted/30",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <span className="font-bold text-sm">{b.table}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Users className="h-2.5 w-2.5" />{b.guests}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-primary">Rs.{total.toLocaleString()}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{b.openedAt}</span>
                  <span>{b.items.length} items · {b.waiter}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Right: bill preview ──────────────────────────────────────── */}
        <Card>
          <CardContent className="pt-4">
            {/* Bill header */}
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-bold px-2">{bill.invoiceNo}</Badge>
                  <Badge className="bg-amber-500/15 text-amber-700 text-[10px] px-2">Provisional</Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> {bill.table}</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {bill.guests} guests</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Opened {bill.openedAt}</span>
                </div>
                <p className="text-xs text-muted-foreground">{bill.costCentre} · Waiter: {bill.waiter}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Printer className="h-3.5 w-3.5" /> Print Bill
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5">
                  <ArrowRight className="h-3.5 w-3.5" /> Convert to Invoice
                </Button>
              </div>
            </div>

            <Separator />

            {/* Item columns header */}
            <div className="grid grid-cols-[1fr_64px_80px_80px] gap-2 py-2 text-xs font-bold uppercase tracking-wide text-muted-foreground border-b">
              <span>Item Description</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Rate</span>
              <span className="text-right">Amount</span>
            </div>

            {/* Items */}
            <div className="space-y-0.5 py-2">
              {bill.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_64px_80px_80px] gap-2 py-1.5 text-sm hover:bg-muted/20 rounded px-1 transition-colors">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-center text-muted-foreground">×{item.qty}</span>
                  <span className="text-right text-muted-foreground tabular-nums">{item.price.toLocaleString()}</span>
                  <span className="text-right font-semibold tabular-nums">{(item.qty * item.price).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2 pt-3">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{bill.items.reduce((s, i) => s + i.qty, 0)} items</span>
                <span className="tabular-nums">Rs.{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base font-bold">Subtotal</span>
                <span className="text-xl font-extrabold text-primary tabular-nums">Rs.{subtotal.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-muted-foreground italic">* This is a provisional bill. Final amount may vary after discount/tax at checkout.</p>
            </div>

            {/* Action bar */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <Printer className="h-3.5 w-3.5" /> Print (Customer Copy)
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <Printer className="h-3.5 w-3.5" /> Print (Kitchen Copy)
                </Button>
              </div>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1.5 text-xs font-bold">
                <ArrowRight className="h-3.5 w-3.5" /> Open in POS
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
