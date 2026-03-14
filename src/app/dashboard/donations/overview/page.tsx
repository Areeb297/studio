'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Users,
  Target,
  Heart,
  AlertCircle,
  Clock,
} from "lucide-react";

const phaseTimeline = [
  { task: 'Requirements Gathering', description: 'Gather and document all finance & donation requirements', start: 'Mar 14', end: 'Mar 21', status: 'In Progress' },
  { task: 'Chart of Accounts & GL', description: 'Define general ledger structure and account codes', start: 'Mar 22', end: 'Apr 5', status: 'Not Started' },
  { task: 'Income Module', description: 'Implement income recording, categorisation and reporting', start: 'Mar 22', end: 'Apr 19', status: 'Not Started' },
  { task: 'Expense Module', description: 'Implement expense entry, approval and reporting', start: 'Apr 6', end: 'Apr 26', status: 'Not Started' },
  { task: 'Donation Management', description: 'Record and track monetary & in-kind donations', start: 'Mar 29', end: 'Apr 19', status: 'Not Started' },
  { task: 'Donor Database', description: 'Build donor profiles, history and segmentation', start: 'Apr 6', end: 'Apr 26', status: 'Not Started' },
  { task: 'AR / AP', description: 'Accounts receivable and payable management', start: 'Apr 13', end: 'May 3', status: 'Not Started' },
  { task: 'Cashbook & Petty Cash', description: 'Daily cashbook entries and petty cash float management', start: 'Apr 13', end: 'Apr 26', status: 'Not Started' },
  { task: 'Bank Reconciliation', description: 'Automated bank statement matching and reconciliation', start: 'Apr 20', end: 'May 10', status: 'Not Started' },
  { task: 'Budget vs Actual', description: 'Compare budgeted vs actual income and expenses', start: 'Apr 27', end: 'May 17', status: 'Not Started' },
  { task: 'Financial Reports', description: 'P&L, balance sheet and cash-flow statements', start: 'May 4', end: 'May 24', status: 'Not Started' },
  { task: 'Auto Reports', description: 'Scheduled report generation and email delivery', start: 'May 11', end: 'May 31', status: 'Not Started' },
  { task: 'Multi-Branch Sync', description: 'Consolidate financials across all branches', start: 'May 18', end: 'Jun 7', status: 'Not Started' },
  { task: 'UAT & Testing', description: 'User acceptance testing, fixes and go-live', start: 'Jun 1', end: 'Jun 21', status: 'Not Started' },
];

function getStatusBadge(status: string) {
  if (status === 'In Progress') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400">
        <Clock className="h-3 w-3" />
        In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-800 dark:text-gray-400">
      Not Started
    </span>
  );
}

export default function DonationsOverviewPage() {
  const kpis = [
    { label: 'Total Donations MTD', value: 'Rs. 0.00', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/20' },
    { label: 'Expenses MTD', value: 'Rs. 0.00', icon: DollarSign, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/20' },
    { label: 'Donor Count', value: '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20' },
    { label: 'Active Campaigns', value: '0', icon: Target, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/20' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <Heart className="h-7 w-7 text-red-500" />
            Finance &amp; Donations
          </h1>
          <p className="text-muted-foreground mt-1">
            Phase 2 — In Development (Requirements Gathering: Mar 14 – Mar 21, 2026)
          </p>
        </div>
        <Badge variant="outline" className="text-xs whitespace-nowrap">
          Phase 2
        </Badge>
      </div>

      {/* Status Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-700 p-4">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-amber-800 dark:text-amber-400 text-sm">
            IN PROGRESS — Phase 2 starts today (March 14, 2026)
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">
            Requirements gathering is underway. Financial modules will be available once Phase 2 development begins (est. Mar 22, 2026).
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
                  <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${kpi.bg}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Phase 2 Timeline Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-primary" />
            Phase 2 Development Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Task</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">Description</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Start</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">End</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {phaseTimeline.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${
                      row.status === 'In Progress' ? 'bg-amber-50/50 dark:bg-amber-950/10' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{idx + 6}</td>
                    <td className="px-4 py-3 font-medium">{row.task}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">{row.description}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{row.start}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{row.end}</td>
                    <td className="px-4 py-3">{getStatusBadge(row.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
