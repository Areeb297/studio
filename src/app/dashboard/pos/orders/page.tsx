'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye, Printer, Receipt, TrendingUp, ShoppingBag, Banknote, Users } from "lucide-react";

const mockOrders = [
  { id: 1, orderNo: "#381", date: "2026-03-14", time: "13:45", type: "Dine-in", table: "12", cashier: "admin",
    items: [{ name: "Chicken Karahi", qty: 1, price: 850 }, { name: "Mutton Karahi", qty: 1, price: 1400 }, { name: "Naan", qty: 4, price: 40 }, { name: "Lassi", qty: 2, price: 120 }],
    subtotal: 2650, discount: 0, tax: 0, total: 2650, payment: "Cash", status: "Paid" },
  { id: 2, orderNo: "#380", date: "2026-03-14", time: "13:32", type: "Takeaway", table: "—", cashier: "admin",
    items: [{ name: "Chicken Biryani", qty: 2, price: 350 }, { name: "Raita", qty: 2, price: 60 }, { name: "Water Bottle", qty: 2, price: 50 }],
    subtotal: 920, discount: 0, tax: 0, total: 920, payment: "JazzCash", status: "Paid" },
  { id: 3, orderNo: "#379", date: "2026-03-14", time: "13:18", type: "Dine-in", table: "7", cashier: "developer",
    items: [{ name: "Mutton Biryani", qty: 1, price: 450 }, { name: "Naan", qty: 2, price: 40 }, { name: "Chai", qty: 2, price: 80 }],
    subtotal: 610, discount: 50, tax: 0, total: 560, payment: "Card", status: "Paid" },
  { id: 4, orderNo: "#378", date: "2026-03-14", time: "13:05", type: "Delivery", table: "—", cashier: "developer",
    items: [{ name: "Daal Makhani", qty: 2, price: 280 }, { name: "Tandoori Roti", qty: 4, price: 30 }, { name: "Lassi", qty: 2, price: 120 }, { name: "Gulab Jamun", qty: 2, price: 100 }],
    subtotal: 1040, discount: 0, tax: 0, total: 1040, payment: "Easypaisa", status: "Paid" },
  { id: 5, orderNo: "#377", date: "2026-03-14", time: "12:50", type: "Dine-in", table: "3", cashier: "admin",
    items: [{ name: "Nihari", qty: 2, price: 550 }, { name: "Naan", qty: 4, price: 40 }, { name: "Chai", qty: 2, price: 80 }],
    subtotal: 1420, discount: 100, tax: 0, total: 1320, payment: "Cash", status: "Paid" },
  { id: 6, orderNo: "#376", date: "2026-03-14", time: "12:38", type: "Mess", table: "—", cashier: "PRUSER",
    items: [{ name: "Daal Chawal", qty: 10, price: 150 }, { name: "Water Bottle", qty: 10, price: 50 }],
    subtotal: 2000, discount: 200, tax: 0, total: 1800, payment: "Cash", status: "Paid" },
  { id: 7, orderNo: "#375", date: "2026-03-14", time: "12:22", type: "Takeaway", table: "—", cashier: "admin",
    items: [{ name: "Pulao", qty: 3, price: 300 }, { name: "Chicken Haleem", qty: 2, price: 350 }, { name: "Roghni Naan", qty: 3, price: 60 }],
    subtotal: 1780, discount: 0, tax: 0, total: 1780, payment: "Cash", status: "Cancelled" },
  { id: 8, orderNo: "#374", date: "2026-03-14", time: "12:10", type: "Dine-in", table: "5", cashier: "developer",
    items: [{ name: "Aloo Gosht", qty: 2, price: 450 }, { name: "Paratha", qty: 4, price: 50 }, { name: "Fresh Juice", qty: 2, price: 200 }],
    subtotal: 1500, discount: 0, tax: 0, total: 1500, payment: "Card", status: "Paid" },
  { id: 9, orderNo: "#373", date: "2026-03-14", time: "11:55", type: "Dine-in", table: "9", cashier: "admin",
    items: [{ name: "Chicken Tikka", qty: 1, price: 750 }, { name: "Seekh Kabab", qty: 2, price: 600 }, { name: "Naan", qty: 4, price: 40 }, { name: "Raita", qty: 1, price: 60 }],
    subtotal: 2110, discount: 110, tax: 0, total: 2000, payment: "Cash", status: "Paid" },
  { id: 10, orderNo: "#372", date: "2026-03-14", time: "11:40", type: "Takeaway", table: "—", cashier: "developer",
    items: [{ name: "Halwa Puri", qty: 2, price: 250 }, { name: "Chai", qty: 2, price: 80 }, { name: "Lassi", qty: 1, price: 120 }],
    subtotal: 780, discount: 0, tax: 0, total: 780, payment: "Cash", status: "Paid" },
  { id: 11, orderNo: "#371", date: "2026-03-14", time: "11:20", type: "Booking", table: "Banquet Hall", cashier: "admin",
    items: [{ name: "Mutton Biryani", qty: 50, price: 450 }, { name: "Chicken Karahi", qty: 10, price: 850 }, { name: "Naan", qty: 100, price: 40 }, { name: "Cold Drinks", qty: 50, price: 80 }],
    subtotal: 37000, discount: 2000, tax: 0, total: 35000, payment: "Bank Transfer", status: "Paid" },
  { id: 12, orderNo: "#370", date: "2026-03-14", time: "11:05", type: "Staff", table: "—", cashier: "admin",
    items: [{ name: "Daal Chawal", qty: 3, price: 150 }, { name: "Roti", qty: 6, price: 20 }],
    subtotal: 570, discount: 570, tax: 0, total: 0, payment: "—", status: "Complimentary" },
  { id: 13, orderNo: "#369", date: "2026-03-13", time: "19:45", type: "Dine-in", table: "2", cashier: "admin",
    items: [{ name: "Paya", qty: 2, price: 600 }, { name: "Naan", qty: 4, price: 40 }, { name: "Kashmiri Chai", qty: 2, price: 150 }],
    subtotal: 1660, discount: 0, tax: 0, total: 1660, payment: "Cash", status: "Paid" },
  { id: 14, orderNo: "#368", date: "2026-03-13", time: "19:20", type: "Delivery", table: "—", cashier: "developer",
    items: [{ name: "Chicken Biryani", qty: 4, price: 350 }, { name: "Mutton Karahi", qty: 1, price: 1400 }, { name: "Cold Drinks", qty: 4, price: 80 }],
    subtotal: 3120, discount: 120, tax: 0, total: 3000, payment: "JazzCash", status: "Paid" },
  { id: 15, orderNo: "#367", date: "2026-03-13", time: "19:00", type: "Dine-in", table: "11", cashier: "admin",
    items: [{ name: "Sajji", qty: 1, price: 2500 }, { name: "Naan", qty: 6, price: 40 }, { name: "Cold Drinks", qty: 3, price: 80 }],
    subtotal: 3000, discount: 0, tax: 0, total: 3000, payment: "Card", status: "Refunded" },
];

const typeColors: Record<string, string> = {
  "Dine-in":  "bg-purple-500/15 text-purple-700",
  "Takeaway": "bg-orange-500/15 text-orange-700",
  "Delivery": "bg-blue-500/15 text-blue-700",
  "Mess":     "bg-gray-500/15 text-gray-700",
  "Booking":  "bg-teal-500/15 text-teal-700",
  "Staff":    "bg-pink-500/15 text-pink-700",
};

const statusColors: Record<string, string> = {
  Paid:          "bg-green-500/15 text-green-700",
  Cancelled:     "bg-red-500/15 text-red-700",
  Complimentary: "bg-amber-500/15 text-amber-700",
  Refunded:      "bg-slate-500/15 text-slate-700",
};

const paymentColors: Record<string, string> = {
  Cash:           "text-green-700",
  Card:           "text-blue-700",
  JazzCash:       "text-red-600",
  Easypaisa:      "text-emerald-700",
  "Bank Transfer":"text-indigo-700",
  "—":            "text-muted-foreground",
};

export default function OrderHistoryPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);

  const filtered = mockOrders.filter(o => {
    const matchSearch = o.orderNo.toLowerCase().includes(search.toLowerCase()) ||
      o.cashier.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === 'all' || o.type === typeFilter;
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchPayment = paymentFilter === 'all' || o.payment === paymentFilter;
    return matchSearch && matchType && matchStatus && matchPayment;
  });

  const todayOrders = mockOrders.filter(o => o.date === '2026-03-14');
  const todayRevenue = todayOrders.filter(o => o.status === 'Paid').reduce((s, o) => s + o.total, 0);
  const todayCount = todayOrders.filter(o => o.status === 'Paid').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Receipt className="h-6 w-6 text-green-600" /> Order History
          </h1>
          <p className="text-muted-foreground text-sm">View all past orders by type, cashier, date, and payment method</p>
        </div>
        <Badge variant="secondary" className="text-sm">{filtered.length} orders shown</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Today's Revenue", value: `Rs. ${todayRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-green-600" },
          { label: "Orders Today", value: todayCount, icon: ShoppingBag, color: "text-blue-600" },
          { label: "Cash Sales", value: `Rs. ${todayOrders.filter(o => o.payment === 'Cash' && o.status === 'Paid').reduce((s,o) => s + o.total, 0).toLocaleString()}`, icon: Banknote, color: "text-amber-600" },
          { label: "Avg Order Value", value: todayCount ? `Rs. ${Math.round(todayRevenue / todayCount).toLocaleString()}` : '—', icon: Users, color: "text-purple-600" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4 flex items-start gap-3">
              <s.icon className={`h-8 w-8 mt-0.5 ${s.color}`} />
              <div>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search order #, cashier, items..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Order Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Dine-in">Dine-in</SelectItem>
            <SelectItem value="Takeaway">Takeaway</SelectItem>
            <SelectItem value="Delivery">Delivery</SelectItem>
            <SelectItem value="Mess">Mess</SelectItem>
            <SelectItem value="Booking">Booking</SelectItem>
            <SelectItem value="Staff">Staff</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
            <SelectItem value="Refunded">Refunded</SelectItem>
            <SelectItem value="Complimentary">Complimentary</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Payment" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="Card">Card</SelectItem>
            <SelectItem value="JazzCash">JazzCash</SelectItem>
            <SelectItem value="Easypaisa">Easypaisa</SelectItem>
            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Order #</th>
                  <th className="text-left p-3 font-semibold">Date & Time</th>
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Table</th>
                  <th className="text-left p-3 font-semibold">Items</th>
                  <th className="text-left p-3 font-semibold">Cashier</th>
                  <th className="text-left p-3 font-semibold">Payment</th>
                  <th className="text-right p-3 font-semibold">Discount</th>
                  <th className="text-right p-3 font-semibold">Total</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-center p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono text-xs font-semibold text-primary">{order.orderNo}</td>
                    <td className="p-3">
                      <div className="text-xs font-medium">{order.date}</div>
                      <div className="text-xs text-muted-foreground">{order.time}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className={`text-xs ${typeColors[order.type] ?? ''}`}>{order.type}</Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{order.table}</td>
                    <td className="p-3 text-xs text-muted-foreground max-w-[180px] truncate">
                      {order.items.map(i => `${i.name} ×${i.qty}`).join(', ')}
                    </td>
                    <td className="p-3 text-sm">{order.cashier}</td>
                    <td className={`p-3 text-sm font-medium ${paymentColors[order.payment] ?? ''}`}>{order.payment}</td>
                    <td className="p-3 text-right text-sm">
                      {order.discount > 0 ? <span className="text-red-600">-Rs. {order.discount.toLocaleString()}</span> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="p-3 text-right font-semibold">
                      {order.total === 0 ? <span className="text-muted-foreground">Free</span> : `Rs. ${order.total.toLocaleString()}`}
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] ?? ''}`}>{order.status}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="View Receipt" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" title="Reprint">
                          <Printer className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t bg-muted/30">
                  <td colSpan={8} className="p-3 text-sm font-semibold text-right">
                    Total ({filtered.filter(o => o.status === 'Paid').length} paid orders):
                  </td>
                  <td className="p-3 text-right font-bold text-green-700">
                    Rs. {filtered.filter(o => o.status === 'Paid').reduce((s, o) => s + o.total, 0).toLocaleString()}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Receipt — {selectedOrder?.orderNo}</span>
              <Badge variant="outline" className={`text-xs ${selectedOrder ? typeColors[selectedOrder.type] ?? '' : ''}`}>{selectedOrder?.type}</Badge>
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="text-center border-b pb-3">
                <p className="font-bold text-base">Jamia Binoria Aalamia</p>
                <p className="text-xs text-muted-foreground">Restaurant POS</p>
                <p className="text-xs text-muted-foreground">{selectedOrder.date} {selectedOrder.time} • Cashier: {selectedOrder.cashier}</p>
                {selectedOrder.table !== '—' && <p className="text-xs">Table: {selectedOrder.table}</p>}
              </div>

              <div className="space-y-1.5">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name} <span className="font-medium text-foreground">×{item.qty}</span></span>
                    <span className="font-medium">Rs. {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rs. {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount</span>
                    <span>-Rs. {selectedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t pt-1 mt-1">
                  <span>Total</span>
                  <span className="text-green-700">
                    {selectedOrder.total === 0 ? 'Free' : `Rs. ${selectedOrder.total.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground text-xs pt-1">
                  <span>Payment Method</span>
                  <span className={`font-medium ${paymentColors[selectedOrder.payment]}`}>{selectedOrder.payment}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" size="sm" onClick={() => setSelectedOrder(null)}>Close</Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" size="sm">
                  <Printer className="h-3.5 w-3.5 mr-1.5" /> Print Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
