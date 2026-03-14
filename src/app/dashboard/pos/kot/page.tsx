'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flame, Printer, Search, Filter, Eye } from "lucide-react";

const mockKOTs = [
  { id: 1, kotNo: "KOT-0381", orderNo: "#381", time: "2026-03-14 13:45", type: "Dine-in", table: "12", items: ["Chicken Karahi ×1", "Mutton Karahi ×1", "Naan ×4", "Lassi ×2"], cashier: "admin", status: "Served" },
  { id: 2, kotNo: "KOT-0380", orderNo: "#380", time: "2026-03-14 13:32", type: "Takeaway", table: "—", items: ["Chicken Biryani ×2", "Raita ×2", "Water Bottle ×2"], cashier: "admin", status: "Ready" },
  { id: 3, kotNo: "KOT-0379", orderNo: "#379", time: "2026-03-14 13:18", type: "Dine-in", table: "7", items: ["Mutton Biryani ×1", "Naan ×2", "Chai ×2"], cashier: "developer", status: "Served" },
  { id: 4, kotNo: "KOT-0378", orderNo: "#378", time: "2026-03-14 13:05", type: "Delivery", table: "—", items: ["Daal Makhani ×2", "Tandoori Roti ×4", "Lassi ×2", "Gulab Jamun ×2"], cashier: "developer", status: "Delivered" },
  { id: 5, kotNo: "KOT-0377", orderNo: "#377", time: "2026-03-14 12:50", type: "Dine-in", table: "3", items: ["Nihari ×2", "Naan ×4", "Chai ×2"], cashier: "admin", status: "Served" },
  { id: 6, kotNo: "KOT-0376", orderNo: "#376", time: "2026-03-14 12:38", type: "Mess", table: "—", items: ["Daal Chawal ×10", "Water Bottle ×10"], cashier: "PRUSER", status: "Served" },
  { id: 7, kotNo: "KOT-0375", orderNo: "#375", time: "2026-03-14 12:22", type: "Takeaway", table: "—", items: ["Pulao ×3", "Chicken Haleem ×2", "Roghni Naan ×3"], cashier: "admin", status: "Cancelled" },
  { id: 8, kotNo: "KOT-0374", orderNo: "#374", time: "2026-03-14 12:10", type: "Dine-in", table: "5", items: ["Aloo Gosht ×2", "Paratha ×4", "Fresh Juice ×2"], cashier: "developer", status: "Served" },
];

const statusColors: Record<string, string> = {
  Served:    "bg-green-500/15 text-green-700 border-green-200",
  Ready:     "bg-blue-500/15 text-blue-700 border-blue-200",
  Delivered: "bg-teal-500/15 text-teal-700 border-teal-200",
  Cancelled: "bg-red-500/15 text-red-700 border-red-200",
};

const typeColors: Record<string, string> = {
  "Dine-in":  "bg-purple-500/15 text-purple-700",
  "Takeaway": "bg-orange-500/15 text-orange-700",
  "Delivery": "bg-blue-500/15 text-blue-700",
  "Mess":     "bg-gray-500/15 text-gray-700",
};

export default function KOTHistoryPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = mockKOTs.filter(k => {
    const matchSearch = k.kotNo.toLowerCase().includes(search.toLowerCase()) ||
      k.orderNo.toLowerCase().includes(search.toLowerCase()) ||
      k.items.some(i => i.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === 'all' || k.type === typeFilter;
    const matchStatus = statusFilter === 'all' || k.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" /> KOT History
          </h1>
          <p className="text-muted-foreground text-sm">Kitchen Order Ticket history and reprint</p>
        </div>
        <Badge variant="secondary" className="text-sm">{filtered.length} KOTs today</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total KOTs", value: mockKOTs.length, color: "text-foreground" },
          { label: "Served", value: mockKOTs.filter(k => k.status === 'Served').length, color: "text-green-600" },
          { label: "Ready/Delivered", value: mockKOTs.filter(k => ['Ready','Delivered'].includes(k.status)).length, color: "text-blue-600" },
          { label: "Cancelled", value: mockKOTs.filter(k => k.status === 'Cancelled').length, color: "text-red-600" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search KOT #, order #, items..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Order Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Dine-in">Dine-in</SelectItem>
            <SelectItem value="Takeaway">Takeaway</SelectItem>
            <SelectItem value="Delivery">Delivery</SelectItem>
            <SelectItem value="Mess">Mess</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Served">Served</SelectItem>
            <SelectItem value="Ready">Ready</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>KOT #</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(kot => (
                <TableRow key={kot.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-xs font-semibold text-primary">{kot.kotNo}</TableCell>
                  <TableCell className="font-semibold">{kot.orderNo}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{kot.time}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${typeColors[kot.type] ?? ''}`}>{kot.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{kot.table}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                    {kot.items.join(', ')}
                  </TableCell>
                  <TableCell className="text-sm">{kot.cashier}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${statusColors[kot.status] ?? ''}`}>{kot.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="View">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Reprint KOT">
                        <Printer className="h-3.5 w-3.5" />
                      </Button>
                    </div>
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
