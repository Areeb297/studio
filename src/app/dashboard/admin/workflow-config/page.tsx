'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Settings2, Save, CheckCircle2, AlertTriangle, ChevronRight,
  ArrowRight, ShieldCheck, FileText, Zap, Bell, RotateCcw,
  DollarSign, Clock, Users, Workflow
} from "lucide-react";
import Link from "next/link";

// ── Approval tiers ───────────────────────────────────────────────────────────
const approvalTiers = [
  {
    level: 'L1',
    role: 'Approver Level 1',
    roleCode: 'APPROVER_L1',
    color: 'bg-teal-500',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
    limitKey: 'l1Limit',
    default: '50000',
    slaHours: 24,
    escalateTo: 'L2',
    desc: 'First-level review for low-value PRs and POs',
  },
  {
    level: 'L2',
    role: 'Approver Level 2',
    roleCode: 'APPROVER_L2',
    color: 'bg-indigo-500',
    badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
    limitKey: 'l2Limit',
    default: '200000',
    slaHours: 48,
    escalateTo: 'GM',
    desc: 'Second-level review for mid-value transactions',
  },
  {
    level: 'GM',
    role: 'General Manager',
    roleCode: 'GM',
    color: 'bg-purple-500',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
    limitKey: 'gmLimit',
    default: 'Unlimited',
    slaHours: 72,
    escalateTo: '—',
    desc: 'Final authority — all amounts above L2 threshold',
  },
];

// ── Procurement steps ────────────────────────────────────────────────────────
const procurementSteps = [
  { step: 1, name: 'Purchase Requisition (PR)', owner: 'Dept Head / Store Keeper', desc: 'Raise PR with item, qty, estimated cost, cost center' },
  { step: 2, name: 'PR Approval', owner: 'L1 / L2 / GM', desc: 'Routed by value to the appropriate approval level' },
  { step: 3, name: 'Vendor Quotation (RFQ)', owner: 'Purchasing Officer', desc: 'Request and compare quotes from approved vendors' },
  { step: 4, name: 'Purchase Order (PO)', owner: 'Purchasing Officer', desc: 'Create PO against approved PR and selected vendor' },
  { step: 5, name: 'PO Approval', owner: 'L1 / L2 / GM', desc: 'Re-approval if PO value differs from PR estimate' },
  { step: 6, name: 'Goods Receipt Note (GRN)', owner: 'Store Keeper', desc: 'Receive goods, verify qty/quality, create GRN' },
  { step: 7, name: 'Invoice Matching', owner: 'Finance Officer', desc: '3-way match: PO ↔ GRN ↔ Vendor Invoice' },
  { step: 8, name: 'Payment Processing', owner: 'Finance Officer', desc: 'Approve payment against matched invoice' },
];

export default function WorkflowConfigPage() {
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [limits, setLimits] = useState({ l1Limit: '50000', l2Limit: '200000' });
  const [sla, setSla] = useState({ l1: '24', l2: '48', gm: '72' });
  const [toggles, setToggles] = useState({
    autoInvoiceOnGrn: true,
    autoGlPosting: true,
    threeWayMatch: true,
    reApprovalOnPoVariance: true,
    skipRfqBelow: true,
    directPoAllowed: false,
    escalateOnSlaBreak: true,
    notifyOnPrSubmit: true,
    notifyOnPoApproval: true,
    notifyOnGrnReceived: true,
    notifyVendorOnPo: false,
    requireReasonOnReject: true,
    allowPartialGrn: true,
    lockPeriodClose: true,
  });

  const setToggle = (key: keyof typeof toggles) => {
    setToggles(p => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
            <Workflow className="h-6 w-6 text-primary" />Workflow Configuration
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Procurement flow · Approval thresholds · Auto-invoice · GL posting rules
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />Saved
            </span>
          )}
          {editMode ? (
            <>
              <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => setEditMode(false)}>Cancel</Button>
              <Button size="sm" className="text-xs gap-1 h-8" onClick={handleSave}>
                <Save className="h-3 w-3" />Save Changes
              </Button>
            </>
          ) : (
            <Button size="sm" className="text-xs gap-1 h-8" onClick={() => setEditMode(true)}>
              <Settings2 className="h-3 w-3" />Edit Config
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="approval">
        <TabsList className="h-8 text-xs">
          <TabsTrigger value="approval" className="text-xs h-7">Approval Thresholds</TabsTrigger>
          <TabsTrigger value="procurement" className="text-xs h-7">Procurement Flow</TabsTrigger>
          <TabsTrigger value="automation" className="text-xs h-7">Automation Rules</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs h-7">Notifications</TabsTrigger>
        </TabsList>

        {/* ── APPROVAL THRESHOLDS ── */}
        <TabsContent value="approval" className="mt-4 space-y-4">

          {/* Visual chain */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />Approval Chain
              </CardTitle>
              <CardDescription className="text-xs">
                Transactions are auto-routed to the appropriate approver based on total value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-0 overflow-x-auto py-2">
                {/* Origin */}
                <div className="flex flex-col items-center px-3 min-w-[110px]">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-[10px] font-semibold mt-1 text-center">Requester</p>
                  <p className="text-[10px] text-muted-foreground text-center">Creates PR/PO</p>
                </div>

                {approvalTiers.map((tier, i) => (
                  <div key={tier.level} className="flex items-start">
                    <div className="flex flex-col items-center mt-2">
                      <div className="h-px w-10 bg-border mt-4" />
                      <p className="text-[9px] text-muted-foreground mt-0.5">
                        {i === 0
                          ? `≤ PKR ${Number(limits.l1Limit).toLocaleString()}`
                          : i === 1
                          ? `≤ PKR ${Number(limits.l2Limit).toLocaleString()}`
                          : '> limit'}
                      </p>
                    </div>
                    <div className="flex flex-col items-center px-3 min-w-[130px]">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${tier.color}`}>
                        {tier.level}
                      </div>
                      <p className="text-[10px] font-semibold mt-1 text-center">{tier.role}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium mt-0.5 ${tier.badge}`}>
                        SLA: {tier.level === 'L1' ? sla.l1 : tier.level === 'L2' ? sla.l2 : sla.gm}h
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Threshold config */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {approvalTiers.map(tier => (
              <Card key={tier.level}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${tier.color}`}>
                      {tier.level}
                    </div>
                    <CardTitle className="text-sm">{tier.role}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">{tier.desc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {tier.level === 'GM' ? 'Approves All Above L2 Limit' : 'Approval Limit (PKR)'}
                    </Label>
                    {tier.level === 'GM' ? (
                      <Input value="Unlimited" disabled className="h-8 text-xs bg-muted/30 font-semibold text-purple-600" />
                    ) : (
                      <Input
                        type="number"
                        value={tier.limitKey === 'l1Limit' ? limits.l1Limit : limits.l2Limit}
                        onChange={e => setLimits(p => ({ ...p, [tier.limitKey]: e.target.value }))}
                        disabled={!editMode}
                        className="h-8 text-xs font-mono"
                        placeholder="e.g. 50000"
                      />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />SLA (Hours)
                    </Label>
                    <Input
                      type="number"
                      value={tier.level === 'L1' ? sla.l1 : tier.level === 'L2' ? sla.l2 : sla.gm}
                      onChange={e => setSla(p => ({
                        ...p,
                        [tier.level === 'L1' ? 'l1' : tier.level === 'L2' ? 'l2' : 'gm']: e.target.value
                      }))}
                      disabled={!editMode}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Escalate To</Label>
                    <Input value={tier.escalateTo} disabled className="h-8 text-xs bg-muted/30 text-muted-foreground" />
                  </div>
                  <div className="rounded bg-muted/30 px-2 py-1.5 text-[10px] text-muted-foreground">
                    Role assigned via{' '}
                    <Link href="/dashboard/admin/role-master" className="text-primary hover:underline">Role Master</Link>
                    {' '}→ <span className="font-mono">{tier.roleCode}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              Threshold changes apply to all <strong>new</strong> transactions. In-flight approvals retain their original routing.
              To re-route, recall and resubmit the transaction.
            </p>
          </div>
        </TabsContent>

        {/* ── PROCUREMENT FLOW ── */}
        <TabsContent value="procurement" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-primary" />Standard Procurement Flow
              </CardTitle>
              <CardDescription className="text-xs">8-step process from PR to Payment. Steps can be made optional per configuration below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-0">
              {procurementSteps.map((step, i) => (
                <div key={step.step}>
                  <div className="flex items-start gap-3 py-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {step.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold">{step.name}</p>
                      <p className="text-[10px] text-muted-foreground">{step.desc}</p>
                    </div>
                    <span className="text-[10px] text-primary font-medium shrink-0 mt-1">{step.owner}</span>
                  </div>
                  {i < procurementSteps.length - 1 && (
                    <div className="ml-3.5 flex items-center">
                      <div className="w-px h-3 bg-border ml-[10px]" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Direct Purchase Rules</CardTitle>
                <CardDescription className="text-xs">When to allow bypassing the full PR → PO flow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-medium">Allow Direct PO (skip PR)</Label>
                    <p className="text-[10px] text-muted-foreground">Purchasing Officer can create PO without PR</p>
                  </div>
                  <Switch
                    checked={toggles.directPoAllowed}
                    onCheckedChange={() => editMode && setToggle('directPoAllowed')}
                    disabled={!editMode}
                  />
                </div>
                <Separator />
                <div className="space-y-1.5">
                  <Label className="text-xs">Skip RFQ for amounts below (PKR)</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={toggles.skipRfqBelow}
                      onCheckedChange={() => editMode && setToggle('skipRfqBelow')}
                      disabled={!editMode}
                    />
                    <Input defaultValue="10000" disabled={!editMode || !toggles.skipRfqBelow}
                      className="h-8 text-xs w-32 font-mono" placeholder="Amount" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">POs below this amount skip vendor quotation step</p>
                </div>
                <Separator />
                <div className="space-y-1.5">
                  <Label className="text-xs">Re-approval required if PO value exceeds PR by (%)</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={toggles.reApprovalOnPoVariance}
                      onCheckedChange={() => editMode && setToggle('reApprovalOnPoVariance')}
                      disabled={!editMode}
                    />
                    <Input defaultValue="10" disabled={!editMode || !toggles.reApprovalOnPoVariance}
                      className="h-8 text-xs w-20 font-mono" placeholder="%" />
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">GRN Rules</CardTitle>
                <CardDescription className="text-xs">Goods receipt and invoice matching configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-medium">Allow Partial GRN</Label>
                    <p className="text-[10px] text-muted-foreground">Receive partial quantities against a PO</p>
                  </div>
                  <Switch
                    checked={toggles.allowPartialGrn}
                    onCheckedChange={() => editMode && setToggle('allowPartialGrn')}
                    disabled={!editMode}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-medium">3-Way Match (PO ↔ GRN ↔ Invoice)</Label>
                    <p className="text-[10px] text-muted-foreground">Block payment if match fails</p>
                  </div>
                  <Switch
                    checked={toggles.threeWayMatch}
                    onCheckedChange={() => editMode && setToggle('threeWayMatch')}
                    disabled={!editMode}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-medium">Require Reason on Rejection</Label>
                    <p className="text-[10px] text-muted-foreground">Mandatory comment when rejecting any step</p>
                  </div>
                  <Switch
                    checked={toggles.requireReasonOnReject}
                    onCheckedChange={() => editMode && setToggle('requireReasonOnReject')}
                    disabled={!editMode}
                  />
                </div>
                <Separator />
                <div className="space-y-1.5">
                  <Label className="text-xs">GRN Tolerance (Qty variance %)</Label>
                  <div className="flex items-center gap-2">
                    <Input defaultValue="5" disabled={!editMode} className="h-8 text-xs w-20 font-mono" />
                    <span className="text-xs text-muted-foreground">% allowed over/under PO quantity</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── AUTOMATION RULES ── */}
        <TabsContent value="automation" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />Auto-Invoice & GL Posting
              </CardTitle>
              <CardDescription className="text-xs">Configure what happens automatically on GRN approval and invoice matching</CardDescription>
            </CardHeader>
            <CardContent className="space-y-0">
              {[
                {
                  key: 'autoInvoiceOnGrn' as const,
                  label: 'Auto-create Vendor Invoice on GRN Approval',
                  desc: 'Automatically generates a vendor invoice record when GRN is fully approved. Finance Officer still reviews before payment.',
                  tag: 'Recommended',
                  tagColor: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
                },
                {
                  key: 'autoGlPosting' as const,
                  label: 'Auto-post GL Entries on Invoice Approval',
                  desc: 'Debit inventory / expense accounts and credit AP automatically when invoice is approved by Finance.',
                  tag: 'GL Integration',
                  tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
                },
                {
                  key: 'lockPeriodClose' as const,
                  label: 'Lock Transactions on Period Close',
                  desc: 'Prevent posting to a closed accounting period. Requires GM override to post backdated entries.',
                  tag: 'Control',
                  tagColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                },
                {
                  key: 'escalateOnSlaBreak' as const,
                  label: 'Auto-escalate on SLA Breach',
                  desc: 'If approver does not act within the configured SLA window, automatically notify the next level.',
                  tag: 'SLA',
                  tagColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
                },
              ].map((rule, i) => (
                <div key={rule.key}>
                  <div className="flex items-start justify-between gap-4 py-3.5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs font-semibold">{rule.label}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${rule.tagColor}`}>{rule.tag}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{rule.desc}</p>
                    </div>
                    <Switch
                      checked={toggles[rule.key]}
                      onCheckedChange={() => editMode && setToggle(rule.key)}
                      disabled={!editMode}
                      className="mt-0.5 shrink-0"
                    />
                  </div>
                  {i < 3 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-primary" />GL Account Defaults
              </CardTitle>
              <CardDescription className="text-xs">Default GL accounts for auto-posting. Override per item category in Item Master.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Inventory / Stock Account', value: '1300 — Stock in Hand' },
                  { label: 'Accounts Payable (AP)', value: '2100 — Trade Creditors' },
                  { label: 'Purchase / COGS Account', value: '5000 — Cost of Goods' },
                  { label: 'Expense Account (non-stock)', value: '6100 — Operating Expenses' },
                  { label: 'GRN Clearing Account', value: '2150 — GRN Clearing' },
                  { label: 'Purchase Variance Account', value: '5050 — Purchase Variance' },
                ].map((acc, i) => (
                  <div key={i} className="space-y-1.5">
                    <Label className="text-xs">{acc.label}</Label>
                    <Input defaultValue={acc.value} disabled={!editMode} className="h-8 text-xs font-mono" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── NOTIFICATIONS ── */}
        <TabsContent value="notifications" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />Workflow Notifications
              </CardTitle>
              <CardDescription className="text-xs">Choose which events trigger in-app and email alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-0">
              {[
                { key: 'notifyOnPrSubmit' as const, label: 'PR Submitted', who: 'Approver L1 / L2 / GM', event: 'New PR awaiting approval' },
                { key: 'notifyOnPoApproval' as const, label: 'PO Approved', who: 'Purchasing Officer', event: 'PO approved — proceed with vendor' },
                { key: 'notifyOnGrnReceived' as const, label: 'GRN Created', who: 'Finance Officer + Purchasing Officer', event: 'Goods received — invoice matching due' },
                { key: 'notifyVendorOnPo' as const, label: 'Notify Vendor on PO Issue', who: 'Vendor (email)', event: 'PO emailed to vendor automatically' },
              ].map((n, i) => (
                <div key={n.key}>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <div className="flex-1">
                      <p className="text-xs font-semibold">{n.label}</p>
                      <p className="text-[10px] text-muted-foreground">{n.event} · Notifies: {n.who}</p>
                    </div>
                    <Switch
                      checked={toggles[n.key]}
                      onCheckedChange={() => editMode && setToggle(n.key)}
                      disabled={!editMode}
                    />
                  </div>
                  {i < 3 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Reminder & Escalation Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'First Reminder (hours after submission)', value: '12' },
                  { label: 'Second Reminder (hours)', value: '24' },
                  { label: 'Escalation Trigger (hours)', value: '48' },
                ].map((r, i) => (
                  <div key={i} className="space-y-1.5">
                    <Label className="text-xs">{r.label}</Label>
                    <Input defaultValue={r.value} disabled={!editMode} className="h-8 text-xs font-mono" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 px-4 py-3">
            <Bell className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-0.5">Notification channels</p>
              <p>
                Currently using <strong>in-app alerts</strong> only. Email and SMS channels can be configured at{' '}
                <Link href="/dashboard/admin/company-settings" className="underline font-medium">Company Settings → SMTP</Link>.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
