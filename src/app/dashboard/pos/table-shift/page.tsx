'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { ArrowRight, Layers, Users, Check, History, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock data ────────────────────────────────────────────────────────────────

const occupiedTables = [
  { no: "T-4",  guests: 3, amount: 5620, waiter: "Ahmed",  openedAt: "02:36 PM", items: ["B.B.Q Matka Biryani ×3", "Raita ×1", "Green Salad ×1", "Pakola (L) ×1", "B.B.Q Matka Biryani ×2"] },
  { no: "T-12", guests: 4, amount: 3480, waiter: "Bilal",  openedAt: "03:02 PM", items: ["Pakola M. Water (L) ×1", "Raita ×1", "Green Salad ×1", "Mutton Qeema ×1", "Chicken Biryani ×1"] },
  { no: "T-3",  guests: 3, amount: 1920, waiter: "Kamran", openedAt: "03:15 PM", items: ["Chicken Karahi ×1", "Naan ×6", "Lassi ×2"] },
  { no: "T-21", guests: 2, amount: 2070, waiter: "Ahmed",  openedAt: "02:27 PM", items: ["Mutton Karahi ×1", "Tandoori Roti ×4"] },
  { no: "T-26", guests: 5, amount: 2030, waiter: "Bilal",  openedAt: "02:15 PM", items: ["Chicken Biryani ×2", "Raita ×2", "Lassi ×1"] },
];

const allTables = ["T-1","T-2","T-5","T-6","T-7","T-8","T-9","T-10","T-11","T-13","T-14","T-15","T-16","T-17","T-18","T-19","T-20","T-22","T-23","T-24","T-25","T-27","T-28","T-29","T-30"];

const shiftHistory = [
  { time: "01:45 PM", from: "T-6",  to: "T-2",  guests: 2, reason: "Customer preference", by: "admin"   },
  { time: "01:12 PM", from: "T-15", to: "T-21", guests: 4, reason: "Larger group arrived", by: "admin"   },
  { time: "12:30 PM", from: "T-8",  to: "T-5",  guests: 1, reason: "Waiter zone change",   by: "manager" },
];

export default function TableShiftPage() {
  const [sourceTable, setSourceTable] = useState('');
  const [targetTable, setTargetTable] = useState('');
  const [shifted, setShifted] = useState(false);

  const sourceBill = occupiedTables.find(t => t.no === sourceTable);
  const isValid    = sourceTable && targetTable && sourceTable !== targetTable;

  const handleShift = () => {
    if (!isValid) return;
    setShifted(true);
    setTimeout(() => {
      setShifted(false);
      setSourceTable('');
      setTargetTable('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ArrowRight className="h-6 w-6 text-primary" /> Table Shifting
        </h1>
        <p className="text-muted-foreground text-sm">Move a running order from one table to another</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── Shift form ──────────────────────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Shift Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Source table */}
            <div>
              <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">From Table (Occupied)</Label>
              <Select value={sourceTable} onValueChange={v => { setSourceTable(v); setShifted(false); }}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select occupied table…" />
                </SelectTrigger>
                <SelectContent>
                  {occupiedTables.map(t => (
                    <SelectItem key={t.no} value={t.no}>
                      <span className="flex items-center gap-2">
                        <span className="font-bold">{t.no}</span>
                        <span className="text-muted-foreground text-xs">{t.guests} guests · Rs.{t.amount.toLocaleString()}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Arrow visual */}
            <div className="flex items-center justify-center">
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all",
                sourceTable && targetTable ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
              )}>
                <span>{sourceTable || "Source"}</span>
                <ArrowRight className="h-4 w-4" />
                <span>{targetTable || "Target"}</span>
              </div>
            </div>

            {/* Target table */}
            <div>
              <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5 block">To Table (Available)</Label>
              <Select value={targetTable} onValueChange={v => { setTargetTable(v); setShifted(false); }}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select available table…" />
                </SelectTrigger>
                <SelectContent>
                  {allTables.filter(t => t !== sourceTable).map(t => (
                    <SelectItem key={t} value={t}>
                      <span className="flex items-center gap-2">
                        <span className="font-bold">{t}</span>
                        <Badge variant="outline" className="text-[10px] text-green-600 border-green-200 px-1">Free</Badge>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preview of source items */}
            {sourceBill && (
              <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Layers className="h-4 w-4 text-primary" />
                    <span className="font-bold">{sourceBill.no}</span>
                    <span className="text-muted-foreground text-xs flex items-center gap-0.5"><Users className="h-3 w-3" />{sourceBill.guests}</span>
                  </div>
                  <span className="text-sm font-bold text-primary">Rs.{sourceBill.amount.toLocaleString()}</span>
                </div>
                <ul className="space-y-0.5">
                  {sourceBill.items.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground">{item}</li>
                  ))}
                </ul>
                <div className="text-xs text-muted-foreground pt-1 border-t flex justify-between">
                  <span>Opened: {sourceBill.openedAt}</span>
                  <span>Waiter: {sourceBill.waiter}</span>
                </div>
              </div>
            )}

            {/* Validation error */}
            {sourceTable && targetTable && sourceTable === targetTable && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Source and target table cannot be the same.
              </div>
            )}

            {/* Success state */}
            {shifted && (
              <div className="flex items-center gap-2 rounded-md bg-green-500/10 border border-green-300 dark:border-green-700 px-3 py-2 text-xs text-green-700 dark:text-green-400 font-medium">
                <Check className="h-4 w-4 shrink-0" />
                Order shifted from {sourceTable} to {targetTable} successfully!
              </div>
            )}

            <Button
              className={cn("w-full gap-2 font-bold", shifted ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90")}
              disabled={!isValid || shifted}
              onClick={handleShift}
            >
              {shifted ? <><Check className="h-4 w-4" /> Shifted!</> : <><ArrowRight className="h-4 w-4" /> Confirm Shift</>}
            </Button>
          </CardContent>
        </Card>

        {/* ── Today's shift history ─────────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" /> Today&apos;s Shift History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {shiftHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                <History className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-sm">No shifts today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {shiftHistory.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="font-bold px-2">{h.from}</Badge>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      <Badge className="bg-primary/15 text-primary font-bold px-2">{h.to}</Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground truncate">{h.reason}</p>
                      <p className="text-[11px] text-muted-foreground/60">{h.guests} guests · {h.by}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{h.time}</span>
                  </div>
                ))}

                <Separator />
                <p className="text-xs text-muted-foreground text-center">{shiftHistory.length} shifts performed today</p>
              </div>
            )}

            {/* Occupied tables quick view */}
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">Currently Occupied</p>
              <div className="grid grid-cols-3 gap-2">
                {occupiedTables.map(t => (
                  <div key={t.no} className="rounded-lg border bg-amber-500/5 border-amber-200 dark:border-amber-800 p-2 text-center">
                    <p className="text-sm font-bold text-amber-700 dark:text-amber-400">{t.no}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-0.5"><Users className="h-2.5 w-2.5" />{t.guests}</p>
                    <p className="text-[10px] font-semibold text-foreground">Rs.{t.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
