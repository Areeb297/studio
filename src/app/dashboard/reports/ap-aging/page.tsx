'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CalendarDays,
  Download,
  ExternalLink,
  Play,
} from "lucide-react";

interface AgingRow {
  supplier: string;
  totalDue: number;
  bucket0_30: number;
  bucket31_60: number;
  bucket61_90: number;
  bucket90plus: number;
}

const agingData: AgingRow[] = [
  {
    supplier: 'ALI',
    totalDue: 141189.79,
    bucket0_30: 141189.79,
    bucket31_60: 0,
    bucket61_90: 0,
    bucket90plus: 0,
  },
  {
    supplier: 'SALEEM BHAI',
    totalDue: 137110.0,
    bucket0_30: 9600.0,
    bucket31_60: 0,
    bucket61_90: 0,
    bucket90plus: 0,
  },
  {
    supplier: 'CHICKEN SUPPLIER',
    totalDue: 65495.0,
    bucket0_30: 32370.0,
    bucket31_60: 0,
    bucket61_90: 0,
    bucket90plus: 0,
  },
  {
    supplier: 'Al-Madina Enterprises',
    totalDue: 34121.0,
    bucket0_30: 0,
    bucket31_60: 0,
    bucket61_90: 0,
    bucket90plus: 0,
  },
];

function fmtRs(n: number) {
  return `Rs${n.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function ApAgingPage() {
  const [reportDate, setReportDate] = useState('2026-03-14');
  const [hasRun, setHasRun] = useState(true);

  const totals: AgingRow = agingData.reduce(
    (acc, r) => ({
      supplier: 'Grand Total',
      totalDue: acc.totalDue + r.totalDue,
      bucket0_30: acc.bucket0_30 + r.bucket0_30,
      bucket31_60: acc.bucket31_60 + r.bucket31_60,
      bucket61_90: acc.bucket61_90 + r.bucket61_90,
      bucket90plus: acc.bucket90plus + r.bucket90plus,
    }),
    { supplier: '', totalDue: 0, bucket0_30: 0, bucket31_60: 0, bucket61_90: 0, bucket90plus: 0 }
  );

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">AP Aging Report</h1>
          <p className="text-muted-foreground mt-1">
            Analyze outstanding payables by aging buckets.
          </p>
        </div>
        <a
          href="/dashboard/reports"
          className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium underline-offset-2 hover:underline whitespace-nowrap"
        >
          <ExternalLink className="h-4 w-4" />
          Financial Reports
        </a>
      </div>

      {/* Report Criteria Card */}
      <Card>
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4 text-primary" />
            Report Criteria
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-1.5 flex-1 max-w-xs">
              <Label htmlFor="report-date">Report As Of Date</Label>
              <Input
                id="report-date"
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setHasRun(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Run Report
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aging Summary Table */}
      {hasRun && (
        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Aging Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Supplier</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Total Due</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">0–30 Days</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">31–60 Days</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">61–90 Days</th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">90+ Days</th>
                  </tr>
                </thead>
                <tbody>
                  {agingData.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">{row.supplier}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{fmtRs(row.totalDue)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{fmtRs(row.bucket0_30)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{fmtRs(row.bucket31_60)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{fmtRs(row.bucket61_90)}</td>
                      <td className={`px-4 py-3 text-right tabular-nums ${row.bucket90plus > 0 ? 'text-red-600 font-semibold' : ''}`}>
                        {fmtRs(row.bucket90plus)}
                      </td>
                    </tr>
                  ))}

                  {/* Grand Total Row */}
                  <tr className="bg-muted/40 border-t-2 border-border font-bold">
                    <td className="px-4 py-3">Grand Total</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmtRs(totals.totalDue)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmtRs(totals.bucket0_30)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmtRs(totals.bucket31_60)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmtRs(totals.bucket61_90)}</td>
                    <td className={`px-4 py-3 text-right tabular-nums ${totals.bucket90plus > 0 ? 'text-red-600' : ''}`}>
                      {fmtRs(totals.bucket90plus)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
