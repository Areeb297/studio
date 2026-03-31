'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  TableProperties, Users, Clock, Utensils, RefreshCw, Plus,
  Timer, Receipt, ChefHat, ArrowRight, Layers, UserCheck,
  CheckCircle2, AlertCircle, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type TableStatus = 'free' | 'occupied' | 'reserved' | 'cleaning';

interface OrderLine { name: string; qty: number; price: number; }

interface RestaurantTable {
  id: number;
  number: string;
  zone: string;
  seats: number;
  status: TableStatus;
  orderNo?: string;
  guestName?: string;
  sinceMin?: number;       // minutes ago the table was occupied/reserved
  amount?: number;
  waiter?: string;
  guests?: number;
  items?: OrderLine[];
  kotStatus?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialTables: RestaurantTable[] = [
  // Main Hall
  { id: 1,  number: "T-01", zone: "Main Hall", seats: 4,  status: "occupied",
    orderNo: "INV-509775", sinceMin: 52, amount: 5620, waiter: "Ahmed",   guests: 3, kotStatus: "PREPARING",
    items: [
      { name: "B.B.Q Matka Biryani", qty: 3, price: 650 },
      { name: "Raita",               qty: 1, price: 200 },
      { name: "Green Salad",         qty: 1, price: 190 },
      { name: "Pakola (L)",          qty: 1, price: 130 },
    ]},
  { id: 2,  number: "T-02", zone: "Main Hall", seats: 4,  status: "free" },
  { id: 3,  number: "T-03", zone: "Main Hall", seats: 6,  status: "occupied",
    orderNo: "INV-509770", sinceMin: 35, amount: 3520, waiter: "Bilal",   guests: 3, kotStatus: "READY",
    items: [
      { name: "Chicken Karahi",   qty: 1, price: 900 },
      { name: "Mutton Karahi",    qty: 1, price: 1400 },
      { name: "Naan",             qty: 4, price: 30  },
      { name: "Lassi",            qty: 2, price: 80  },
    ]},
  { id: 4,  number: "T-04", zone: "Main Hall", seats: 4,  status: "reserved",
    guestName: "Mr. Tariq", sinceMin: -30 },
  { id: 5,  number: "T-05", zone: "Main Hall", seats: 2,  status: "free" },
  { id: 6,  number: "T-06", zone: "Main Hall", seats: 4,  status: "occupied",
    orderNo: "INV-509763", sinceMin: 48, amount: 2030, waiter: "Ahmed",   guests: 2, kotStatus: "PREPARING",
    items: [
      { name: "Nihari",           qty: 2, price: 450 },
      { name: "Tandoori Roti",    qty: 6, price: 20  },
    ]},
  { id: 7,  number: "T-07", zone: "Main Hall", seats: 6,  status: "cleaning" },
  { id: 8,  number: "T-08", zone: "Main Hall", seats: 4,  status: "occupied",
    orderNo: "INV-509783", sinceMin: 18, amount: 1920, waiter: "Bilal",   guests: 2, kotStatus: "NEW",
    items: [
      { name: "Chicken Biryani",  qty: 2, price: 350 },
      { name: "Raita",            qty: 2, price: 60  },
      { name: "Cold Drink",       qty: 2, price: 60  },
    ]},
  // VIP Section
  { id: 9,  number: "V-01", zone: "VIP", seats: 8,  status: "occupied",
    orderNo: "INV-509756", sinceMin: 62, amount: 7620, waiter: "Usman",   guests: 5, kotStatus: "READY",
    items: [
      { name: "Mutton Karahi",    qty: 2, price: 1400 },
      { name: "BBQ Matka Biryani",qty: 2, price: 650  },
      { name: "Naan",             qty: 8, price: 30   },
      { name: "Lassi",            qty: 4, price: 80   },
    ]},
  { id: 10, number: "V-02", zone: "VIP", seats: 8,  status: "reserved",
    guestName: "Dr. Hassan", sinceMin: -60 },
  { id: 11, number: "V-03", zone: "VIP", seats: 6,  status: "free" },
  { id: 12, number: "V-04", zone: "VIP", seats: 10, status: "free" },
  // Outdoor
  { id: 13, number: "O-01", zone: "Outdoor", seats: 4, status: "free" },
  { id: 14, number: "O-02", zone: "Outdoor", seats: 4, status: "occupied",
    orderNo: "INV-509750", sinceMin: 28, amount: 2365, waiter: "Kamran",  guests: 2, kotStatus: "PREPARING",
    items: [
      { name: "Chicken Haleem",   qty: 2, price: 250 },
      { name: "Roghni Naan",      qty: 4, price: 50  },
      { name: "Chai",             qty: 2, price: 40  },
    ]},
  { id: 15, number: "O-03", zone: "Outdoor", seats: 6, status: "free" },
  { id: 16, number: "O-04", zone: "Outdoor", seats: 4, status: "cleaning" },
  // Banquet
  { id: 17, number: "B-01", zone: "Banquet", seats: 50, status: "reserved",
    guestName: "Wedding — Khalid Family", sinceMin: -120 },
  { id: 18, number: "B-02", zone: "Banquet", seats: 100, status: "free" },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<TableStatus, { label: string; cardClass: string; dotClass: string; textClass: string }> = {
  free:     { label: "Free",     cardClass: "border-green-200  bg-green-50/50  hover:border-green-400  dark:bg-green-950/10  dark:border-green-800",  dotClass: "bg-green-500",  textClass: "text-green-700  dark:text-green-400"  },
  occupied: { label: "Occupied", cardClass: "border-red-200    bg-red-50/50    hover:border-red-400    dark:bg-red-950/10    dark:border-red-800",    dotClass: "bg-red-500",    textClass: "text-red-700    dark:text-red-400"    },
  reserved: { label: "Reserved", cardClass: "border-amber-200  bg-amber-50/50  hover:border-amber-400  dark:bg-amber-950/10  dark:border-amber-800",  dotClass: "bg-amber-500",  textClass: "text-amber-700  dark:text-amber-400"  },
  cleaning: { label: "Cleaning", cardClass: "border-blue-200   bg-blue-50/50   hover:border-blue-400   dark:bg-blue-950/10   dark:border-blue-800",   dotClass: "bg-blue-500",   textClass: "text-blue-700   dark:text-blue-400"   },
};

const KOT_STATUS: Record<string, { label: string; cls: string }> = {
  NEW:        { label: "New",       cls: "bg-blue-500/15 text-blue-700 dark:text-blue-300"   },
  PREPARING:  { label: "Preparing", cls: "bg-amber-500/15 text-amber-700 dark:text-amber-300"},
  READY:      { label: "Ready",     cls: "bg-green-500/15 text-green-700 dark:text-green-300"},
};

const ZONES = ["All", "Main Hall", "VIP", "Outdoor", "Banquet"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function waitColor(min: number) {
  if (min < 20)  return "text-green-600 bg-green-500/10";
  if (min < 40)  return "text-amber-600 bg-amber-500/10";
  return "text-red-600 bg-red-500/10";
}

function waitLabel(min: number) {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function tableTotal(items?: OrderLine[]) {
  return items?.reduce((s, i) => s + i.qty * i.price, 0) ?? 0;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TableManagementPage() {
  const [tables,       setTables]       = useState<RestaurantTable[]>(initialTables);
  const [selectedZone, setSelectedZone] = useState("All");
  const [statusFilter, setStatusFilter] = useState<TableStatus | 'all'>('all');
  const [selected,     setSelected]     = useState<RestaurantTable | null>(null);
  const [tick,         setTick]         = useState(0);

  // Live 60-second tick so waiting times visually refresh
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const updateStatus = useCallback((id: number, status: TableStatus) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, status, sinceMin: status === 'occupied' ? 0 : t.sinceMin } : t));
    setSelected(null);
  }, []);

  const filtered = tables.filter(t => {
    const z = selectedZone === "All" || t.zone === selectedZone;
    const s = statusFilter === 'all'  || t.status === statusFilter;
    return z && s;
  });

  const zones = [...new Set(tables.map(t => t.zone))];

  const counts = {
    free:     tables.filter(t => t.status === 'free').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    cleaning: tables.filter(t => t.status === 'cleaning').length,
  };

  const totalRevenue    = tables.filter(t => t.status === 'occupied').reduce((s, t) => s + (t.amount ?? 0), 0);
  const occupancyPct    = Math.round((counts.occupied / tables.length) * 100);
  const avgWait         = (() => {
    const occ = tables.filter(t => t.status === 'occupied' && (t.sinceMin ?? 0) > 0);
    return occ.length ? Math.round(occ.reduce((s, t) => s + (t.sinceMin ?? 0), 0) / occ.length) : 0;
  })();

  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <TableProperties className="h-6 w-6 text-purple-600" /> Table Management
          </h1>
          <p className="text-muted-foreground text-sm">
            Live floor plan — {counts.occupied} of {tables.length} tables occupied · {occupancyPct}% occupancy
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3" /> Live
          </div>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1.5">
            <Plus className="h-4 w-4" /> New Dine-in
          </Button>
        </div>
      </div>

      {/* ── KPI Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Status filter cards */}
        {(Object.entries(counts) as [TableStatus, number][]).map(([status, count]) => {
          const cfg = STATUS_CONFIG[status];
          const active = statusFilter === status;
          return (
            <button key={status}
              onClick={() => setStatusFilter(prev => prev === status ? 'all' : status)}
              className={cn(
                'rounded-xl border-2 p-3 text-left transition-all duration-150 focus:outline-none',
                active ? `${cfg.cardClass} ring-2 ring-offset-1 ring-current` : 'bg-card border-border hover:border-muted-foreground/30',
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={cn('w-2.5 h-2.5 rounded-full', cfg.dotClass)} />
                <span className={cn('text-xs font-semibold uppercase tracking-wide', cfg.textClass)}>{cfg.label}</span>
              </div>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs text-muted-foreground">tables</p>
            </button>
          );
        })}
      </div>

      {/* ── Summary metrics ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground font-medium mb-0.5">Running Revenue</p>
          <p className="text-lg font-extrabold text-primary">Rs.{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground font-medium mb-0.5">Avg Wait Time</p>
          <p className={cn("text-lg font-extrabold", avgWait < 30 ? "text-green-600" : avgWait < 50 ? "text-amber-600" : "text-red-600")}>
            {avgWait}m
          </p>
        </div>
        <div className="rounded-xl border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground font-medium mb-0.5">Occupancy</p>
          <p className="text-lg font-extrabold text-foreground">{occupancyPct}%</p>
        </div>
      </div>

      {/* ── Zone filter pills ────────────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        {ZONES.map(zone => (
          <button key={zone} onClick={() => setSelectedZone(zone)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border',
              selectedZone === zone
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground hover:bg-muted border-border',
            )}>
            {zone}
          </button>
        ))}
      </div>

      {/* ── Floor plan by zone ───────────────────────────────────────────── */}
      {(selectedZone === "All" ? zones : [selectedZone]).map(zone => {
        const zoneTables = filtered.filter(t => t.zone === zone);
        if (!zoneTables.length) return null;
        return (
          <div key={zone}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">{zone}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {zoneTables.map(table => {
                const cfg      = STATUS_CONFIG[table.status];
                const elapsed  = table.sinceMin ?? 0;
                const wColor   = elapsed > 0 ? waitColor(elapsed) : '';
                const lineTotal = tableTotal(table.items);
                const kot      = table.kotStatus ? KOT_STATUS[table.kotStatus] : null;

                return (
                  <button key={table.id}
                    onClick={() => setSelected(table)}
                    className={cn(
                      'rounded-xl border-2 p-3 text-left transition-all duration-200',
                      'hover:scale-[1.03] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      cfg.cardClass,
                    )}
                  >
                    {/* Row 1: number + status dot */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">{table.number}</span>
                      <div className={cn('w-2 h-2 rounded-full shrink-0', cfg.dotClass)} />
                    </div>

                    {/* Seats */}
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-1.5">
                      <Users className="h-3 w-3" />
                      <span>{table.seats} seats</span>
                      {table.guests && table.status === 'occupied' && (
                        <span className="ml-auto font-semibold text-foreground">{table.guests} guests</span>
                      )}
                    </div>

                    {/* Occupied state */}
                    {table.status === 'occupied' && (
                      <>
                        <p className="text-[11px] font-mono font-bold text-primary truncate">{table.orderNo}</p>

                        {/* Waiting time badge */}
                        <div className={cn('inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold mt-1', wColor)}>
                          <Timer className="h-2.5 w-2.5" />
                          {waitLabel(elapsed)}
                        </div>

                        {/* Amount */}
                        {lineTotal > 0 && (
                          <p className="text-xs font-extrabold text-primary mt-1 tabular-nums">
                            Rs.{lineTotal.toLocaleString()}
                          </p>
                        )}

                        {/* Items preview (up to 2) */}
                        {table.items && table.items.length > 0 && (
                          <div className="mt-1.5 space-y-0.5">
                            {table.items.slice(0, 2).map((item, i) => (
                              <p key={i} className="text-[10px] text-muted-foreground truncate">
                                {item.qty}× {item.name}
                              </p>
                            ))}
                            {table.items.length > 2 && (
                              <p className="text-[10px] text-muted-foreground/60">+{table.items.length - 2} more</p>
                            )}
                          </div>
                        )}

                        {/* KOT status */}
                        {kot && (
                          <span className={cn("mt-1.5 inline-flex text-[10px] font-semibold px-1.5 py-0.5 rounded", kot.cls)}>
                            {kot.label}
                          </span>
                        )}

                        {/* Waiter */}
                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-0.5">
                          <UserCheck className="h-2.5 w-2.5" />{table.waiter}
                        </p>
                      </>
                    )}

                    {/* Reserved state */}
                    {table.status === 'reserved' && (
                      <>
                        <p className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 truncate mt-1">{table.guestName}</p>
                        {table.sinceMin && table.sinceMin < 0 && (
                          <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                            <Clock className="h-2.5 w-2.5" />
                            In {Math.abs(table.sinceMin)}m
                          </p>
                        )}
                      </>
                    )}

                    {/* Cleaning */}
                    {table.status === 'cleaning' && (
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-1">Being cleaned</p>
                    )}

                    {/* Free */}
                    {table.status === 'free' && (
                      <p className="text-[10px] text-green-600 dark:text-green-400 font-semibold mt-1">Available</p>
                    )}

                    {/* Status label bottom */}
                    <div className={cn('mt-2 text-[10px] font-bold uppercase tracking-wide', cfg.textClass)}>
                      {cfg.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ════════════════════ TABLE DETAIL DIALOG ════════════════════════ */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Utensils className="h-4 w-4 text-primary" />
              Table {selected?.number}
              <span className="text-sm font-normal text-muted-foreground">— {selected?.zone}</span>
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-3">

              {/* Status + seats row */}
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className={cn("font-semibold", STATUS_CONFIG[selected.status].textClass)}>
                  <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", STATUS_CONFIG[selected.status].dotClass)} />
                  {STATUS_CONFIG[selected.status].label}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> {selected.seats} seats
                </span>
                {selected.guests && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <UserCheck className="h-3.5 w-3.5" /> {selected.guests} guests
                  </span>
                )}
                {selected.kotStatus && KOT_STATUS[selected.kotStatus] && (
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", KOT_STATUS[selected.kotStatus].cls)}>
                    KOT: {KOT_STATUS[selected.kotStatus].label}
                  </span>
                )}
              </div>

              {/* Occupied — invoice + wait + items */}
              {selected.status === 'occupied' && (
                <>
                  {/* Invoice meta */}
                  <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/30 border p-3 text-sm">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide">Invoice</p>
                      <p className="font-bold text-primary text-xs">{selected.orderNo}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide">Waiter</p>
                      <p className="font-semibold text-xs">{selected.waiter}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide">Wait Time</p>
                      <p className={cn("font-bold text-sm", waitColor(selected.sinceMin ?? 0).split(' ')[0])}>
                        {waitLabel(selected.sinceMin ?? 0)}
                        {(selected.sinceMin ?? 0) >= 40 && <AlertCircle className="inline h-3.5 w-3.5 ml-1" />}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide">Running Total</p>
                      <p className="font-extrabold text-primary text-sm">Rs.{tableTotal(selected.items).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Items ordered */}
                  {selected.items && selected.items.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Order Items</p>
                      <div className="rounded-lg border overflow-hidden">
                        {/* Header */}
                        <div className="grid grid-cols-[1fr_40px_80px_80px] gap-2 px-3 py-1.5 bg-muted/40 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                          <span>Item</span>
                          <span className="text-center">Qty</span>
                          <span className="text-right">Rate</span>
                          <span className="text-right">Total</span>
                        </div>
                        {selected.items.map((item, i) => (
                          <div key={i} className={cn(
                            "grid grid-cols-[1fr_40px_80px_80px] gap-2 px-3 py-2 text-sm",
                            i < selected.items!.length - 1 && "border-b",
                          )}>
                            <span className="font-medium truncate">{item.name}</span>
                            <span className="text-center text-muted-foreground">×{item.qty}</span>
                            <span className="text-right text-muted-foreground tabular-nums">{item.price.toLocaleString()}</span>
                            <span className="text-right font-semibold tabular-nums">{(item.qty * item.price).toLocaleString()}</span>
                          </div>
                        ))}
                        {/* Total row */}
                        <div className="grid grid-cols-[1fr_40px_80px_80px] gap-2 px-3 py-2 border-t-2 bg-muted/30 font-bold text-sm">
                          <span className="text-muted-foreground col-span-3">Grand Total</span>
                          <span className="text-right text-primary tabular-nums">
                            {tableTotal(selected.items).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Reserved */}
              {selected.status === 'reserved' && (
                <div className="rounded-lg bg-muted/30 border p-3 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guest</span>
                    <span className="font-semibold">{selected.guestName}</span>
                  </div>
                  {selected.sinceMin && selected.sinceMin < 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected in</span>
                      <span className="font-semibold text-amber-600">{Math.abs(selected.sinceMin)} minutes</span>
                    </div>
                  )}
                </div>
              )}

              {/* Cleaning */}
              {selected.status === 'cleaning' && (
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-3 text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  Table is currently being cleaned and prepared for next guests.
                </div>
              )}

              <Separator />

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                {selected.status === 'occupied' && (
                  <>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 gap-1.5">
                      <Receipt className="h-3.5 w-3.5" /> View / Edit Order
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => updateStatus(selected.id, 'free')}>
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> Close Table
                    </Button>
                  </>
                )}
                {selected.status === 'free' && (
                  <>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white flex-1 gap-1.5">
                      <Plus className="h-3.5 w-3.5" /> Open New Order
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5 text-amber-700" onClick={() => updateStatus(selected.id, 'reserved')}>
                      <Clock className="h-3.5 w-3.5" /> Reserve
                    </Button>
                  </>
                )}
                {selected.status === 'reserved' && (
                  <>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 gap-1.5">
                      <ArrowRight className="h-3.5 w-3.5" /> Start Order
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5 text-green-700" onClick={() => updateStatus(selected.id, 'free')}>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Mark Free
                    </Button>
                  </>
                )}
                {selected.status === 'cleaning' && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white flex-1 gap-1.5" onClick={() => updateStatus(selected.id, 'free')}>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Mark Clean &amp; Free
                  </Button>
                )}
                {selected.status !== 'cleaning' && (
                  <Button size="sm" variant="outline" className="gap-1.5 text-blue-700 border-blue-200" onClick={() => updateStatus(selected.id, 'cleaning')}>
                    <Sparkles className="h-3.5 w-3.5" /> Send to Cleaning
                  </Button>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
