'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Info, AlertOctagon, CheckCircle2 } from "lucide-react";

type AlertLevel = 'Critical' | 'High' | 'Medium' | 'Info';
type TabType = 'All' | AlertLevel;

interface AlertItem {
  id: number;
  level: AlertLevel;
  title: string;
  details: string;
  ts: string;
  acknowledged: boolean;
}

const initialAlerts: AlertItem[] = [
  { id: 1, level: 'Critical', title: 'GOAT BAKRA A — Stock Critical', details: 'Current stock 2 KG below minimum threshold of 20 KG. Immediate replenishment required.', ts: '14 Mar 2026, 10:45', acknowledged: false },
  { id: 2, level: 'Critical', title: 'COW (GAI) — Out of Stock', details: 'Current stock 0 KG. All outstanding orders for this item are on hold.', ts: '14 Mar 2026, 09:30', acknowledged: false },
  { id: 3, level: 'Critical', title: 'BBQ KITCHEN — Budget at 93%', details: 'BBQ KITCHEN cost center utilized PKR 261K of PKR 280K budget (93%). Review pending orders.', ts: '14 Mar 2026, 08:15', acknowledged: false },
  { id: 4, level: 'Critical', title: 'Cold Chain Failure Risk', details: 'COLD STORE temperature log variance detected. 3 items flagged for quality review.', ts: '13 Mar 2026, 23:42', acknowledged: false },
  { id: 5, level: 'High', title: 'CHICKEN WHOLE — Low Stock', details: 'Current stock 12 KG, reorder level is 50 KG. PO recommended from CHICKEN SUPPLIER.', ts: '14 Mar 2026, 10:02', acknowledged: false },
  { id: 6, level: 'High', title: 'BEEF UNDERCUT — Low Stock', details: 'Current stock 8 KG, reorder level is 25 KG. Contact ALI supplier.', ts: '14 Mar 2026, 09:48', acknowledged: false },
  { id: 7, level: 'High', title: '10 GRNs Awaiting Approval', details: 'GRN-202603-0005 through GRN-202603-0014 are pending manager approval for more than 24 hours.', ts: '14 Mar 2026, 07:00', acknowledged: false },
  { id: 8, level: 'High', title: 'BRAIN — Near Reorder Level', details: 'Current stock 3 KG approaching reorder level of 3 KG. Plan purchase requisition.', ts: '13 Mar 2026, 18:30', acknowledged: false },
  { id: 9, level: 'High', title: '3 POs Pending Approval', details: 'PO-202603-0018, 0019, 0020 awaiting Level 2 approval. Oldest is 36 hours pending.', ts: '13 Mar 2026, 16:00', acknowledged: false },
  { id: 10, level: 'High', title: 'KALEJI — Expiry Warning', details: '5 KG of KALEJI (Batch B2603-04) expires in 2 days. Prioritize for kitchen use or write-off.', ts: '14 Mar 2026, 06:30', acknowledged: false },
  { id: 11, level: 'Medium', title: 'TUKH MALANGA — Below Min', details: 'Current stock 1 KG below minimum 2 KG. Non-critical; order with next replenishment run.', ts: '14 Mar 2026, 09:00', acknowledged: false },
  { id: 12, level: 'Medium', title: 'Physical Count Variance', details: 'CNT-202603-0002: 8 items show variance in JAMIA STORE. Reconciliation required.', ts: '14 Mar 2026, 08:45', acknowledged: false },
  { id: 13, level: 'Info', title: 'PR-202603-0040 Created', details: 'Purchase requisition PR-202603-0040 submitted by DESI KITCHEN for COOKING OIL 16L (10 TIN).', ts: '14 Mar 2026, 10:55', acknowledged: false },
  { id: 14, level: 'Info', title: 'PR-202603-0039 Approved', details: 'Purchase requisition PR-202603-0039 approved at Level 1 by approverl1@rahah24.com.', ts: '14 Mar 2026, 10:20', acknowledged: false },
  { id: 15, level: 'Info', title: 'PO-202603-0020 Created', details: 'Purchase order PO-202603-0020 created for CHICKEN SUPPLIER. Value: PKR 18,400.', ts: '14 Mar 2026, 10:12', acknowledged: false },
  { id: 16, level: 'Info', title: 'GRN-202603-0014 Approved', details: 'GRN-202603-0014 from ALI supplier approved. Stock updated in COLD STORE.', ts: '14 Mar 2026, 10:18', acknowledged: false },
  { id: 17, level: 'Info', title: 'Work Order WO-202603-0009 Completed', details: 'Desi Karahi (1KG) production completed — 40 units produced in DESI KITCHEN.', ts: '14 Mar 2026, 09:45', acknowledged: false },
  { id: 18, level: 'Info', title: 'Stock Transfer TRF-202603-0012 Completed', details: 'Transfer of 6 items from JAMIA STORE to COLD STORE completed successfully.', ts: '14 Mar 2026, 09:15', acknowledged: false },
];

const levelConfig: Record<AlertLevel, { icon: any; badge: string; bg: string; border: string; iconColor: string }> = {
  Critical: { icon: AlertOctagon, badge: 'bg-red-100 text-red-700 border-red-300', bg: 'bg-red-50 dark:bg-red-950/20', border: 'border-red-200 dark:border-red-800', iconColor: 'text-red-600' },
  High: { icon: AlertTriangle, badge: 'bg-amber-100 text-amber-700 border-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-800', iconColor: 'text-amber-600' },
  Medium: { icon: Bell, badge: 'bg-blue-100 text-blue-700 border-blue-300', bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-200 dark:border-blue-800', iconColor: 'text-blue-600' },
  Info: { icon: Info, badge: 'bg-gray-100 text-gray-600 border-gray-300', bg: 'bg-muted/30', border: 'border-border', iconColor: 'text-muted-foreground' },
};

const TABS: TabType[] = ['All', 'Critical', 'High', 'Medium', 'Info'];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [activeTab, setActiveTab] = useState<TabType>('All');

  const acknowledge = (id: number) => setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, acknowledged: true } : a));

  const filtered = alerts.filter((a) => activeTab === 'All' || a.level === activeTab);

  const counts: Record<TabType, number> = {
    All: alerts.filter((a) => !a.acknowledged).length,
    Critical: alerts.filter((a) => a.level === 'Critical' && !a.acknowledged).length,
    High: alerts.filter((a) => a.level === 'High' && !a.acknowledged).length,
    Medium: alerts.filter((a) => a.level === 'Medium' && !a.acknowledged).length,
    Info: alerts.filter((a) => a.level === 'Info' && !a.acknowledged).length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Alerts</h1>
          <p className="text-muted-foreground mt-1">Inventory, procurement, and operational alerts</p>
        </div>
        <Button variant="outline" onClick={() => setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })))}>
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Acknowledge All
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Alerts', value: alerts.length.toString(), color: 'text-blue-600', icon: Bell },
          { label: 'Critical', value: counts.Critical.toString(), color: 'text-red-600', icon: AlertOctagon },
          { label: 'High', value: counts.High.toString(), color: 'text-amber-600', icon: AlertTriangle },
          { label: 'Info', value: counts.Info.toString(), color: 'text-gray-600', icon: Info },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {counts[tab] > 0 && (
              <span className={`ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-white/20' : 'bg-muted'}`}>
                {counts[tab]}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-500" />
              <p>No active alerts in this category.</p>
            </CardContent>
          </Card>
        )}
        {filtered.map((alert) => {
          const cfg = levelConfig[alert.level];
          const Icon = cfg.icon;
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border flex gap-4 items-start transition-opacity ${cfg.bg} ${cfg.border} ${alert.acknowledged ? 'opacity-40' : ''}`}
            >
              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${cfg.iconColor}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm">{alert.title}</p>
                  <Badge className={cfg.badge}>{alert.level}</Badge>
                  {alert.acknowledged && <Badge className="bg-gray-100 text-gray-500 border-gray-300">Acknowledged</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{alert.details}</p>
                <p className="text-xs text-muted-foreground mt-1.5 font-medium">{alert.ts}</p>
              </div>
              {!alert.acknowledged && (
                <Button variant="outline" size="sm" className="flex-shrink-0" onClick={() => acknowledge(alert.id)}>
                  Acknowledge
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
