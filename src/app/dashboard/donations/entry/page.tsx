'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, Plus, Trash2 } from "lucide-react";

interface DonatedItem {
  id: number;
  item: string;
  qty: string;
  value: string;
  expiry: string;
}

const WAREHOUSES = [
  'TEST Store',
  'RESTAURANT STORE',
  'JAMIA STORE',
  'EVENTS STORE',
  'GYM STORE',
];

const STOCK_ITEMS = [
  'Rice (Basmati) - 50kg bag',
  'Wheat Flour - 20kg bag',
  'Cooking Oil - 5L tin',
  'Sugar - 50kg bag',
  'Lentils (Dal Masoor) - 1kg',
  'Chickpeas - 1kg',
  'Dates (Khajoor) - 1kg',
  'Milk Powder - 500g',
  'Tea Leaves - 200g',
  'Other (Manual Entry)',
];

export default function DonationEntryPage() {
  const [donorName, setDonorName] = useState('');
  const [contact, setContact] = useState('');
  const [dateReceived, setDateReceived] = useState('2026-03-14');
  const [warehouse, setWarehouse] = useState('');
  const [items, setItems] = useState<DonatedItem[]>([
    { id: 1, item: '', qty: '', value: '', expiry: '' },
  ]);

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), item: '', qty: '', value: '', expiry: '' },
    ]);
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateItem(id: number, field: keyof DonatedItem, value: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Donation Entry</h1>
          <p className="text-muted-foreground mt-1">
            Record in-kind donations and add them to inventory.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-sm font-medium dark:bg-red-950/30 dark:text-red-400">
          <Heart className="h-3.5 w-3.5" />
          Charitable Giving
        </span>
      </div>

      {/* Main Form Card */}
      <Card>
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <div className="p-1.5 rounded-md bg-red-50 dark:bg-red-950/30">
              <Heart className="h-4 w-4 text-red-500" />
            </div>
            Donation Receipt (In-Kind)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Donor Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="donor-name">Donor Name / Organization</Label>
              <Input
                id="donor-name"
                placeholder="e.g. Ahmed Khan or Al-Madina Foundation"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                type="tel"
                placeholder="+92 300 0000000"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date-received">Date Received</Label>
              <Input
                id="date-received"
                type="date"
                value={dateReceived}
                onChange={(e) => setDateReceived(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="warehouse">Receiving Warehouse</Label>
              <Select value={warehouse} onValueChange={setWarehouse}>
                <SelectTrigger id="warehouse">
                  <SelectValue placeholder="Select warehouse..." />
                </SelectTrigger>
                <SelectContent>
                  {WAREHOUSES.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Donated Items Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Donated Items
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="text-teal-600 border-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/20"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Item
              </Button>
            </div>

            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-2 px-3 py-2 bg-muted/50 rounded-t-md border border-b-0 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <div className="col-span-4">Item (map to stock)</div>
              <div className="col-span-2">Qty Received</div>
              <div className="col-span-3">Est. Market Value</div>
              <div className="col-span-2">Expiry (if any)</div>
              <div className="col-span-1"></div>
            </div>

            <div className="border rounded-b-md rounded-t-none md:rounded-t-none overflow-hidden divide-y">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 bg-background hover:bg-muted/20 transition-colors"
                >
                  {/* Item Select */}
                  <div className="md:col-span-4">
                    <Label className="md:hidden text-xs text-muted-foreground mb-1 block">Item</Label>
                    <Select
                      value={item.item}
                      onValueChange={(v) => updateItem(item.id, 'item', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select stock item..." />
                      </SelectTrigger>
                      <SelectContent>
                        {STOCK_ITEMS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Qty */}
                  <div className="md:col-span-2">
                    <Label className="md:hidden text-xs text-muted-foreground mb-1 block">Quantity</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                    />
                  </div>

                  {/* Value */}
                  <div className="md:col-span-3">
                    <Label className="md:hidden text-xs text-muted-foreground mb-1 block">Est. Market Value</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                        Rs
                      </span>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0.00"
                        className="pl-8"
                        value={item.value}
                        onChange={(e) => updateItem(item.id, 'value', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Expiry */}
                  <div className="md:col-span-2">
                    <Label className="md:hidden text-xs text-muted-foreground mb-1 block">Expiry (if any)</Label>
                    <Input
                      type="date"
                      value={item.expiry}
                      onChange={(e) => updateItem(item.id, 'expiry', e.target.value)}
                    />
                  </div>

                  {/* Remove */}
                  <div className="md:col-span-1 flex items-center justify-end md:justify-center">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Item row button (mobile-friendly duplicate) */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addItem}
              className="mt-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/20 w-full border border-dashed border-teal-300"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Item
            </Button>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              className="bg-teal-600 hover:bg-teal-700 text-white px-8"
            >
              <Heart className="h-4 w-4 mr-2" />
              Record Donation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
