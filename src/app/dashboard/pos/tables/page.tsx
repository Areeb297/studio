'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TableProperties, Users, Clock, Utensils, RefreshCw, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type TableStatus = 'free' | 'occupied' | 'reserved' | 'cleaning';

interface RestaurantTable {
  id: number;
  number: string;
  zone: string;
  seats: number;
  status: TableStatus;
  orderNo?: string;
  guestName?: string;
  since?: string;
  amount?: number;
  waiter?: string;
}

const initialTables: RestaurantTable[] = [
  // Main Hall
  { id: 1,  number: "T-01", zone: "Main Hall",  seats: 4, status: "occupied",  orderNo: "#381", since: "13:20", amount: 2650, waiter: "Ahmed" },
  { id: 2,  number: "T-02", zone: "Main Hall",  seats: 4, status: "free" },
  { id: 3,  number: "T-03", zone: "Main Hall",  seats: 6, status: "occupied",  orderNo: "#379", since: "13:05", amount: 1320, waiter: "Bilal" },
  { id: 4,  number: "T-04", zone: "Main Hall",  seats: 4, status: "reserved",  guestName: "Mr. Tariq", since: "14:00" },
  { id: 5,  number: "T-05", zone: "Main Hall",  seats: 2, status: "free" },
  { id: 6,  number: "T-06", zone: "Main Hall",  seats: 4, status: "occupied",  orderNo: "#377", since: "12:45", amount: 960,  waiter: "Ahmed" },
  { id: 7,  number: "T-07", zone: "Main Hall",  seats: 6, status: "cleaning" },
  { id: 8,  number: "T-08", zone: "Main Hall",  seats: 4, status: "occupied",  orderNo: "#383", since: "13:38", amount: 580,  waiter: "Bilal" },
  // VIP Section
  { id: 9,  number: "V-01", zone: "VIP",        seats: 8, status: "occupied",  orderNo: "#376", since: "12:30", amount: 5800, waiter: "Usman" },
  { id: 10, number: "V-02", zone: "VIP",        seats: 8, status: "reserved",  guestName: "Dr. Hassan", since: "15:00" },
  { id: 11, number: "V-03", zone: "VIP",        seats: 6, status: "free" },
  { id: 12, number: "V-04", zone: "VIP",        seats: 10, status: "free" },
  // Outdoor
  { id: 13, number: "O-01", zone: "Outdoor",    seats: 4, status: "free" },
  { id: 14, number: "O-02", zone: "Outdoor",    seats: 4, status: "occupied",  orderNo: "#374", since: "13:50", amount: 1500, waiter: "Kamran" },
  { id: 15, number: "O-03", zone: "Outdoor",    seats: 6, status: "free" },
  { id: 16, number: "O-04", zone: "Outdoor",    seats: 4, status: "cleaning" },
  // Banquet
  { id: 17, number: "B-01", zone: "Banquet",    seats: 50, status: "reserved", guestName: "Wedding - Khalid Family", since: "18:00" },
  { id: 18, number: "B-02", zone: "Banquet",    seats: 100, status: "free" },
];

const STATUS_CONFIG: Record<TableStatus, { label: string; color: string; bg: string; dot: string }> = {
  free:     { label: "Free",     color: "text-green-700",  bg: "bg-green-50 border-green-200 hover:border-green-400",   dot: "bg-green-500" },
  occupied: { label: "Occupied", color: "text-red-700",    bg: "bg-red-50 border-red-200 hover:border-red-400",         dot: "bg-red-500" },
  reserved: { label: "Reserved", color: "text-amber-700",  bg: "bg-amber-50 border-amber-200 hover:border-amber-400",   dot: "bg-amber-500" },
  cleaning: { label: "Cleaning", color: "text-blue-700",   bg: "bg-blue-50 border-blue-200 hover:border-blue-400",      dot: "bg-blue-500" },
};

const ZONES = ["All", "Main Hall", "VIP", "Outdoor", "Banquet"];

export default function TableManagementPage() {
  const [tables, setTables] = useState<RestaurantTable[]>(initialTables);
  const [selectedZone, setSelectedZone] = useState("All");
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [statusFilter, setStatusFilter] = useState<TableStatus | 'all'>('all');

  const filtered = tables.filter(t => {
    const zoneMatch = selectedZone === "All" || t.zone === selectedZone;
    const statusMatch = statusFilter === 'all' || t.status === statusFilter;
    return zoneMatch && statusMatch;
  });

  const counts = {
    free:     tables.filter(t => t.status === 'free').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    cleaning: tables.filter(t => t.status === 'cleaning').length,
  };

  const updateStatus = (id: number, status: TableStatus) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    setSelectedTable(null);
  };

  const zones = [...new Set(tables.map(t => t.zone))];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <TableProperties className="h-6 w-6 text-purple-600" /> Table Management
          </h1>
          <p className="text-muted-foreground text-sm">Live floor plan — {tables.filter(t => t.status === 'occupied').length} tables occupied of {tables.length} total</p>
        </div>
        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1.5">
          <Plus className="h-4 w-4" /> New Dine-in Order
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.entries(counts) as [TableStatus, number][]).map(([status, count]) => {
          const cfg = STATUS_CONFIG[status];
          return (
            <button key={status} onClick={() => setStatusFilter(prev => prev === status ? 'all' : status)}
              className={cn('rounded-xl border-2 p-3 text-left transition-all', statusFilter === status ? `${cfg.bg} border-current` : 'bg-card border-border hover:border-muted-foreground/30')}>
              <div className="flex items-center gap-2 mb-1">
                <div className={cn('w-2.5 h-2.5 rounded-full', cfg.dot)} />
                <span className={cn('text-xs font-semibold uppercase tracking-wide', cfg.color)}>{cfg.label}</span>
              </div>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs text-muted-foreground">tables</p>
            </button>
          );
        })}
      </div>

      {/* Zone filter pills */}
      <div className="flex gap-2 flex-wrap">
        {ZONES.map(zone => (
          <button key={zone} onClick={() => setSelectedZone(zone)}
            className={cn('px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border',
              selectedZone === zone ? 'bg-purple-600 text-white border-purple-600' : 'bg-background text-muted-foreground hover:bg-muted border-border')}>
            {zone}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="h-3.5 w-3.5" /> Last updated: 13:45
        </div>
      </div>

      {/* Floor plan by zone */}
      {(selectedZone === "All" ? zones : [selectedZone]).map(zone => {
        const zoneTables = filtered.filter(t => t.zone === zone);
        if (!zoneTables.length) return null;
        return (
          <div key={zone}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">{zone}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {zoneTables.map(table => {
                const cfg = STATUS_CONFIG[table.status];
                return (
                  <button key={table.id} onClick={() => setSelectedTable(table)}
                    className={cn('rounded-xl border-2 p-3 text-left transition-all duration-200 hover:scale-[1.03] hover:shadow-md', cfg.bg)}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">{table.number}</span>
                      <div className={cn('w-2 h-2 rounded-full', cfg.dot)} />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <Users className="h-3 w-3" /> {table.seats} seats
                    </div>
                    {table.status === 'occupied' && (
                      <>
                        <p className="text-xs font-semibold text-red-700">{table.orderNo}</p>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                          <Clock className="h-3 w-3" /> {table.since}
                        </div>
                        {table.amount && <p className="text-xs font-bold text-green-700 mt-1">Rs. {table.amount.toLocaleString()}</p>}
                      </>
                    )}
                    {table.status === 'reserved' && (
                      <>
                        <p className="text-[10px] font-medium text-amber-700 truncate">{table.guestName}</p>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                          <Clock className="h-3 w-3" /> {table.since}
                        </div>
                      </>
                    )}
                    {table.status === 'cleaning' && (
                      <p className="text-[10px] text-blue-600 mt-1">Being cleaned</p>
                    )}
                    {table.status === 'free' && (
                      <p className="text-[10px] text-green-600 font-medium mt-1">Available</p>
                    )}
                    <div className={cn('mt-2 text-[10px] font-semibold uppercase tracking-wide', cfg.color)}>{cfg.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Table Detail Dialog */}
      <Dialog open={!!selectedTable} onOpenChange={() => setSelectedTable(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Table {selectedTable?.number} — {selectedTable?.zone}
            </DialogTitle>
          </DialogHeader>
          {selectedTable && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={cn('font-semibold', STATUS_CONFIG[selectedTable.status].color)}>
                  {STATUS_CONFIG[selectedTable.status].label}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {selectedTable.seats} seats</span>
              </div>

              {selectedTable.status === 'occupied' && (
                <div className="rounded-lg bg-muted p-3 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Order</span><span className="font-semibold">{selectedTable.orderNo}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Since</span><span>{selectedTable.since}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Waiter</span><span>{selectedTable.waiter}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Running Total</span><span className="font-bold text-green-700">Rs. {selectedTable.amount?.toLocaleString()}</span></div>
                </div>
              )}
              {selectedTable.status === 'reserved' && (
                <div className="rounded-lg bg-muted p-3 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Guest</span><span className="font-semibold">{selectedTable.guestName}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Booked for</span><span>{selectedTable.since}</span></div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                {selectedTable.status !== 'free' && (
                  <Button variant="outline" size="sm" className="text-green-700 border-green-200" onClick={() => updateStatus(selectedTable.id, 'free')}>Mark Free</Button>
                )}
                {selectedTable.status !== 'cleaning' && (
                  <Button variant="outline" size="sm" className="text-blue-700 border-blue-200" onClick={() => updateStatus(selectedTable.id, 'cleaning')}>Mark Cleaning</Button>
                )}
                {selectedTable.status !== 'reserved' && (
                  <Button variant="outline" size="sm" className="text-amber-700 border-amber-200" onClick={() => updateStatus(selectedTable.id, 'reserved')}>Reserve</Button>
                )}
                {selectedTable.status === 'free' && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white col-span-2" onClick={() => setSelectedTable(null)}>
                    Open New Order
                  </Button>
                )}
                {selectedTable.status === 'occupied' && (
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white col-span-2">
                    View / Edit Order
                  </Button>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setSelectedTable(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
