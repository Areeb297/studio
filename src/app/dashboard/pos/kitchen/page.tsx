'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Flame, ChevronDown, Clock, AlertTriangle,
  CheckCircle2, ChefHat, Utensils, Timer,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Station    = 'Grill' | 'Fry' | 'Cold' | 'Bakery' | 'Curry';
type OrderType  = 'Dine-in' | 'Takeaway' | 'Delivery' | 'Mess';
type TicketStatus = 'NEW' | 'PREPARING' | 'READY';

interface KOTItem   { name: string; qty: number; station: Station; }
interface KOTTicket {
  id: string; kotNumber: string; orderType: OrderType;
  table?: string; elapsedMin: number; items: KOTItem[]; status: TicketStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const initialTickets: KOTTicket[] = [
  { id:'382', kotNumber:'KOT-0382', orderType:'Dine-in',  table:'T-8',  elapsedMin:1,
    items:[{name:'Mutton Biryani',qty:2,station:'Curry'},{name:'Naan',qty:4,station:'Bakery'},{name:'Lassi',qty:2,station:'Cold'}], status:'NEW' },
  { id:'383', kotNumber:'KOT-0383', orderType:'Takeaway', elapsedMin:2,
    items:[{name:'Seekh Kabab',qty:3,station:'Grill'},{name:'Naan',qty:6,station:'Bakery'},{name:'Raita',qty:2,station:'Cold'}], status:'NEW' },
  { id:'384', kotNumber:'KOT-0384', orderType:'Delivery', elapsedMin:3,
    items:[{name:'Daal Makhani',qty:2,station:'Curry'},{name:'Roti',qty:4,station:'Bakery'}], status:'NEW' },
  { id:'381', kotNumber:'KOT-0381', orderType:'Dine-in',  table:'T-12', elapsedMin:7,
    items:[{name:'Chicken Karahi',qty:1,station:'Curry'},{name:'Mutton Karahi',qty:1,station:'Curry'},{name:'Naan',qty:4,station:'Bakery'}], status:'PREPARING' },
  { id:'380', kotNumber:'KOT-0380', orderType:'Takeaway', elapsedMin:9,
    items:[{name:'Chicken Biryani',qty:2,station:'Curry'},{name:'Raita',qty:2,station:'Cold'}], status:'PREPARING' },
  { id:'379', kotNumber:'KOT-0379', orderType:'Mess',     elapsedMin:11,
    items:[{name:'Daal Tadka',qty:4,station:'Curry'},{name:'Roti',qty:8,station:'Bakery'},{name:'Salad',qty:4,station:'Cold'}], status:'PREPARING' },
  { id:'378', kotNumber:'KOT-0378', orderType:'Dine-in',  table:'T-7',  elapsedMin:14,
    items:[{name:'Nihari',qty:2,station:'Curry'},{name:'Naan',qty:4,station:'Bakery'},{name:'Chai',qty:2,station:'Cold'}], status:'READY' },
  { id:'377', kotNumber:'KOT-0377', orderType:'Takeaway', elapsedMin:18,
    items:[{name:'Grilled Chicken',qty:1,station:'Grill'},{name:'French Fries',qty:2,station:'Fry'},{name:'Soft Drink',qty:2,station:'Cold'}], status:'READY' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getElapsedColor(min: number) {
  if (min < 5)  return 'bg-green-500 text-white';
  if (min <= 10) return 'bg-amber-500 text-white';
  return 'bg-red-600 text-white';
}

function getOrderTypeBadge(type: OrderType) {
  switch (type) {
    case 'Dine-in':  return 'bg-blue-600 text-white';
    case 'Takeaway': return 'bg-purple-600 text-white';
    case 'Delivery': return 'bg-orange-500 text-white';
    case 'Mess':     return 'bg-teal-600 text-white';
    default:         return 'bg-muted text-muted-foreground';
  }
}

// Dual-mode station badges — light bg in light theme, dark bg in dark theme
function getStationBadge(station: Station) {
  switch (station) {
    case 'Grill':  return 'bg-red-100    text-red-700    border border-red-300    dark:bg-red-900    dark:text-red-300    dark:border-red-700';
    case 'Fry':    return 'bg-yellow-100 text-yellow-700 border border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700';
    case 'Cold':   return 'bg-cyan-100   text-cyan-700   border border-cyan-300   dark:bg-cyan-900   dark:text-cyan-300   dark:border-cyan-700';
    case 'Bakery': return 'bg-amber-100  text-amber-700  border border-amber-300  dark:bg-amber-900  dark:text-amber-300  dark:border-amber-700';
    case 'Curry':  return 'bg-orange-100 text-orange-700 border border-orange-300 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-700';
    default:       return 'bg-muted text-muted-foreground';
  }
}

const STATIONS = ['All', 'Grill', 'Fry', 'Cold', 'Bakery'] as const;
type StationFilter = (typeof STATIONS)[number];

// ─── KOT Card ─────────────────────────────────────────────────────────────────
function KOTCard({ ticket, onAction }: { ticket: KOTTicket; onAction: (id: string) => void }) {
  const isOverdue = ticket.elapsedMin > 10;
  return (
    <Card className={`mb-3 rounded-xl overflow-hidden shadow-sm border border-border bg-card ${isOverdue ? 'ring-2 ring-red-500' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/60 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground text-sm tracking-wide">{ticket.kotNumber}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getOrderTypeBadge(ticket.orderType)}`}>
            {ticket.orderType}
          </span>
          {ticket.table && (
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border">
              {ticket.table}
            </span>
          )}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getElapsedColor(ticket.elapsedMin)}`}>
          {ticket.elapsedMin} min
        </span>
      </div>

      {/* Items */}
      <CardContent className="px-4 py-3 bg-card">
        <ul className="space-y-2 mb-3">
          {ticket.items.map((item, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <span className="text-foreground text-sm">
                {item.name} <span className="font-bold">×{item.qty}</span>
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStationBadge(item.station)}`}>
                {item.station}
              </span>
            </li>
          ))}
        </ul>

        {ticket.status === 'NEW' && (
          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold" onClick={() => onAction(ticket.id)}>
            <ChefHat className="w-4 h-4 mr-1" />Start
          </Button>
        )}
        {ticket.status === 'PREPARING' && (
          <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold" onClick={() => onAction(ticket.id)}>
            <CheckCircle2 className="w-4 h-4 mr-1" />Mark Ready
          </Button>
        )}
        {ticket.status === 'READY' && (
          <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold" onClick={() => onAction(ticket.id)}>
            <Utensils className="w-4 h-4 mr-1" />Served
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function KitchenDisplayPage() {
  const [tickets, setTickets] = useState<KOTTicket[]>(initialTickets);
  const [stationFilter, setStationFilter] = useState<StationFilter>('All');
  const [showStationDropdown, setShowStationDropdown] = useState(false);

  const handleAction = (id: string) => {
    setTickets(prev =>
      prev
        .map(t => {
          if (t.id !== id) return t;
          if (t.status === 'NEW')      return { ...t, status: 'PREPARING' as TicketStatus };
          if (t.status === 'PREPARING') return { ...t, status: 'READY' as TicketStatus };
          return t;
        })
        .filter(t => !(t.id === id && t.status === 'READY'))
    );
  };

  const filteredTickets = tickets.filter(t =>
    stationFilter === 'All' || t.items.some(i => i.station === stationFilter)
  );

  const newTickets      = filteredTickets.filter(t => t.status === 'NEW');
  const preparingTickets = filteredTickets.filter(t => t.status === 'PREPARING');
  const readyTickets    = filteredTickets.filter(t => t.status === 'READY');

  const avgWait = tickets.length
    ? Math.round(tickets.reduce((s, t) => s + t.elapsedMin, 0) / tickets.length)
    : 0;
  const overdueCount = tickets.filter(t => t.elapsedMin > 10).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* ── Top Bar ── */}
      <div className="bg-card border-b border-border px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Flame className="w-6 h-6 text-orange-500" />
          <span className="text-xl font-bold tracking-wide">Kitchen Display</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-1.5 border border-border">
            <Timer className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Active:</span>
            <span className="text-sm font-bold text-foreground">{tickets.length}</span>
          </div>
          <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-1.5 border border-border">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Avg Wait:</span>
            <span className="text-sm font-bold text-foreground">{avgWait} min</span>
          </div>
          <div className={`flex items-center gap-2 rounded-lg px-4 py-1.5 border ${
            overdueCount > 0
              ? 'bg-red-50 border-red-300 dark:bg-red-950/40 dark:border-red-800'
              : 'bg-muted border-border'
          }`}>
            <AlertTriangle className={`w-4 h-4 ${overdueCount > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
            <span className="text-sm text-muted-foreground">Overdue:</span>
            <span className={`text-sm font-bold ${overdueCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
              {overdueCount}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-1.5 border border-border">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono font-bold text-lg text-foreground">13:45</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowStationDropdown(!showStationDropdown)}
              className="flex items-center gap-2 bg-muted hover:bg-muted/80 border border-border rounded-lg px-4 py-1.5 text-sm font-medium text-foreground transition-colors"
            >
              {stationFilter === 'All' ? 'All Stations' : stationFilter}
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
            {showStationDropdown && (
              <div className="absolute right-0 top-full mt-1 z-50 bg-popover border border-border rounded-lg shadow-xl overflow-hidden min-w-[140px]">
                {STATIONS.map(s => (
                  <button
                    key={s}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                      stationFilter === s ? 'text-primary font-semibold' : 'text-foreground'
                    }`}
                    onClick={() => { setStationFilter(s); setShowStationDropdown(false); }}
                  >
                    {s === 'All' ? 'All Stations' : s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Column Headers ── */}
      <div className="grid grid-cols-3 flex-shrink-0">
        <div className="bg-red-600 px-6 py-2 flex items-center justify-between">
          <span className="font-bold text-white text-sm uppercase tracking-wider">New</span>
          <span className="bg-red-800 text-red-100 text-xs font-bold px-2 py-0.5 rounded-full">{newTickets.length}</span>
        </div>
        <div className="bg-amber-500 px-6 py-2 flex items-center justify-between border-x border-white/20">
          <span className="font-bold text-white text-sm uppercase tracking-wider">Preparing</span>
          <span className="bg-amber-700 text-amber-100 text-xs font-bold px-2 py-0.5 rounded-full">{preparingTickets.length}</span>
        </div>
        <div className="bg-green-600 px-6 py-2 flex items-center justify-between">
          <span className="font-bold text-white text-sm uppercase tracking-wider">Ready</span>
          <span className="bg-green-800 text-green-100 text-xs font-bold px-2 py-0.5 rounded-full">{readyTickets.length}</span>
        </div>
      </div>

      {/* ── Ticket Columns ── */}
      <div className="grid grid-cols-3 flex-1 overflow-hidden">
        <div className="bg-muted/30 border-r border-border p-4 overflow-y-auto">
          {newTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <ChefHat className="w-8 h-8 mb-2" />
              <span className="text-sm">No new orders</span>
            </div>
          ) : newTickets.map(t => <KOTCard key={t.id} ticket={t} onAction={handleAction} />)}
        </div>

        <div className="bg-muted/30 border-r border-border p-4 overflow-y-auto">
          {preparingTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Flame className="w-8 h-8 mb-2" />
              <span className="text-sm">Nothing in preparation</span>
            </div>
          ) : preparingTickets.map(t => <KOTCard key={t.id} ticket={t} onAction={handleAction} />)}
        </div>

        <div className="bg-muted/30 p-4 overflow-y-auto">
          {readyTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <CheckCircle2 className="w-8 h-8 mb-2" />
              <span className="text-sm">No ready orders</span>
            </div>
          ) : readyTickets.map(t => <KOTCard key={t.id} ticket={t} onAction={handleAction} />)}
        </div>
      </div>
    </div>
  );
}
