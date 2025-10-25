'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Receipt, Plus, Minus, Trash2, CreditCard, DollarSign } from "lucide-react";

const menuItems = [
  { id: 1, name: 'Chicken Biryani', price: 350, category: 'Main Course' },
  { id: 2, name: 'Chicken Karahi', price: 550, category: 'Main Course' },
  { id: 3, name: 'Lassi', price: 80, category: 'Beverages' },
  { id: 4, name: 'Naan', price: 20, category: 'Bread' },
];

export default function POSPage() {
  const [cart, setCart] = useState<any[]>([]);
  const subtotal = cart.reduce((s, item) => s + item.price * item.qty, 0);
  const tax = subtotal * 0.10;
  const total = subtotal + tax;

  const addToCart = (item: any) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Point of Sale (POS)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Menu Items</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {menuItems.map((item) => (
                <Button key={item.id} variant="outline" className="h-24 flex flex-col items-start justify-between" onClick={() => addToCart(item)}>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-lg font-bold">PKR {item.price}</div>
                  <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Current Order</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No items added</p>
              ) : (
                <div className="space-y-2">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">PKR {item.price} x {item.qty}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty - 1 } : c).filter(c => c.qty > 0))}><Minus className="h-3 w-3" /></Button>
                        <span className="w-8 text-center font-bold">{item.qty}</span>
                        <Button variant="outline" size="sm" onClick={() => setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c))}><Plus className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => setCart(cart.filter(c => c.id !== item.id))}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">PKR {subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm text-muted-foreground"><span>Tax (10%)</span><span className="font-mono">PKR {tax.toFixed(2)}</span></div>
                <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Total</span><span className="font-mono">PKR {total.toFixed(2)}</span></div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-4">
                <Button variant="outline" className="w-full" onClick={() => setCart([])}><Trash2 className="h-4 w-4 mr-2" />Clear</Button>
                <Button className="w-full"><CreditCard className="h-4 w-4 mr-2" />Pay</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
