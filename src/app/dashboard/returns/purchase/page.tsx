'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle,
  Clock,
  FileText,
  RefreshCcw,
  ArrowRight,
  BookOpen,
  ChevronRight,
} from "lucide-react";

interface ReturnItem {
  id: number;
  item: string;
  qty: string;
  unitPrice: string;
  batchNumber: string;
}

const SUPPLIERS = [
  'ALI',
  'SALEEM BHAI',
  'CHICKEN SUPPLIER',
  'Al-Madina Enterprises',
  'Other Supplier',
];

const STOCK_ITEMS = [
  'Rice (Basmati)',
  'Wheat Flour',
  'Cooking Oil',
  'Sugar',
  'Chicken (Frozen)',
  'Beef (Boneless)',
  'Vegetables Mix',
  'Spices Pack',
];

const WORKFLOW_STEPS = [
  { label: 'Return Request', icon: RotateCcw, active: true },
  { label: 'Manager Approval', icon: CheckCircle, active: false },
  { label: 'Debit Note', icon: FileText, active: false },
  { label: 'Refund / Adjustment', icon: RefreshCcw, active: false },
];

export default function PurchaseReturnPage() {
  const [supplier, setSupplier] = useState('');
  const [returnDate, setReturnDate] = useState('2026-03-14');
  const [reason, setReason] = useState('');
  const [status] = useState('Pending');
  const [items, setItems] = useState<ReturnItem[]>([
    { id: 1, item: '', qty: '', unitPrice: '', batchNumber: '' },
  ]);

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), item: '', qty: '', unitPrice: '', batchNumber: '' },
    ]);
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateItem(id: number, field: keyof ReturnItem, value: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  }

  const lineTotal = (item: ReturnItem) => {
    const q = parseFloat(item.qty) || 0;
    const p = parseFloat(item.unitPrice) || 0;
    return q * p;
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold font-headline">Purchase Return</h1>
          <p className="text-muted-foreground mt-1">Manage supplier returns and debit notes.</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <a
            href="/dashboard/returns"
            className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium hover:underline underline-offset-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Returns Module
          </a>
          <a
            href="/dashboard/inventory/stock-ledger"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline underline-offset-2"
          >
            View Stock Ledger
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Return Details Card */}
      <Card>
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-1.5 rounded-md bg-orange-50 dark:bg-orange-950/30">
                <RotateCcw className="h-4 w-4 text-orange-500" />
              </div>
              Return Details
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Current Status:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400">
                <Clock className="h-3 w-3" />
                {status}
              </span>
            </div>
          </div>

          {/* Workflow Stepper */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {WORKFLOW_STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <React.Fragment key={idx}>
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors ${
                        step.active
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-muted text-muted-foreground border-border'
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      {idx + 1}. {step.label}
                    </div>
                    {idx < WORKFLOW_STEPS.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              NEXT STEP: Manager Approval (Pending with Manager)
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="return-no">Return Number</Label>
              <Input
                id="return-no"
                value="PR-2026-0001"
                readOnly
                className="bg-muted/50 font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="return-date">Return Date</Label>
              <Input
                id="return-date"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="supplier">
                Supplier <span className="text-red-500">*</span>
              </Label>
              <Select value={supplier} onValueChange={setSupplier}>
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Select supplier..." />
                </SelectTrigger>
                <SelectContent>
                  {SUPPLIERS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" value="PKR" readOnly className="bg-muted/50" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="exchange-rate">Exchange Rate</Label>
              <Input id="exchange-rate" value="1.00" readOnly className="bg-muted/50" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="return-status">Status</Label>
              <Select defaultValue="pending">
                <SelectTrigger id="return-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
              <Label htmlFor="reason">
                Return Reason <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Describe the reason for this return (e.g., damaged goods, quality issues, wrong items delivered)..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Return Items Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Return Items
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
              <div className="col-span-3">Item Code / Name</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Unit Price (Rs)</div>
              <div className="col-span-2">Batch Number</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>

            <div className="border rounded-b-md rounded-t-none overflow-hidden divide-y">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 bg-background hover:bg-muted/20 transition-colors"
                >
                  <div className="md:col-span-3">
                    <Label className="md:hidden text-xs text-muted-foreground mb-1 block">Item</Label>
                    <Select
                      value={item.item}
                      onValueChange={(v) => updateItem(item.id, 'item', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select item..." />
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
                  <div className="md:col-span-2">
                    <Label className="md:hidden text-xs text-muted-foreground mb-1 block">Qty</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="md:hidden text-xs text-muted-foreground mb-1 block">Unit Price</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0.00"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="md:hidden text-xs text-muted-foreground mb-1 block">Batch #</Label>
                    <Input
                      placeholder="BATCH-001"
                      value={item.batchNumber}
                      onChange={(e) => updateItem(item.id, 'batchNumber', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center justify-end md:justify-end">
                    <span className="text-sm font-semibold tabular-nums">
                      Rs {lineTotal(item).toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
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

            {/* Grand Total */}
            <div className="flex justify-end mt-3 pr-1">
              <div className="flex items-center gap-4 px-4 py-2 bg-muted/50 rounded-lg border">
                <span className="text-sm font-semibold text-muted-foreground">Grand Total:</span>
                <span className="text-base font-bold tabular-nums">
                  Rs {items.reduce((s, i) => s + lineTotal(i), 0).toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              className="bg-teal-600 hover:bg-teal-700 text-white px-8"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Submit Return
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
