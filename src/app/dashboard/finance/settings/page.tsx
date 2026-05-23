'use client';

import { Save, Settings, Lock, Mail, Calendar, FileText, DollarSign } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FinanceSettingsPage() {
  return (
    <PageShell
      eyebrow="Setup · Finance config"
      title="Finance Settings"
      description="Org-wide defaults for the finance module — base currency, fiscal year, approval thresholds, document numbering."
      breadcrumb={[{ label: 'Setup' }, { label: 'Finance Settings' }]}
      actions={<Button size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Save settings</Button>}
      kpis={
        <>
          <KpiCard label="Base currency"  value="PKR" tone="info"  icon={DollarSign} />
          <KpiCard label="Fiscal start"    value="01 Jul" tone="accent" icon={Calendar} hint="July – June" />
          <KpiCard label="Approval rules" value={3} tone="warning" icon={Lock} />
          <KpiCard label="Doc series"     value={6} tone="success" icon={FileText} />
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <SectionHeader eyebrow="Currency & locale" title="Defaults" />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Base currency</Label>
              <Select defaultValue="PKR">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PKR">PKR · Pakistani Rupee</SelectItem>
                  <SelectItem value="USD">USD · US Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Decimal places</Label>
              <Select defaultValue="0"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{['0','2'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs">Number format</Label>
              <Select defaultValue="EN-PK"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EN-PK">en-PK · 1,23,456 (lakh)</SelectItem>
                  <SelectItem value="EN-US">en-US · 123,456</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader eyebrow="Fiscal calendar" title="Year & periods" />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">FY start month</Label>
              <Select defaultValue="JUL"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{['JAN','APR','JUL','OCT'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Period granularity</Label>
              <Select defaultValue="MONTHLY"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="MONTHLY">Monthly</SelectItem><SelectItem value="QUARTERLY">Quarterly</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between col-span-2 mt-2">
              <Label htmlFor="autoClose" className="text-xs">Auto-prompt month-end close</Label>
              <Switch id="autoClose" defaultChecked />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader eyebrow="Approvals" title="JV & payment thresholds" />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">JV auto-post under</Label>
              <Input type="number" defaultValue={50_000} className="tabular-nums" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Payment requires CFO over</Label>
              <Input type="number" defaultValue={500_000} className="tabular-nums" />
            </div>
            <div className="flex items-center justify-between col-span-2 mt-2">
              <Label htmlFor="dualSign" className="text-xs">Dual-signature on cheques &gt; Rs 1M</Label>
              <Switch id="dualSign" defaultChecked />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader eyebrow="Document numbering" title="Voucher series" />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">JV prefix</Label><Input defaultValue="JV-{YYYY}-{MM}-{####}" className="font-mono text-xs" /></div>
            <div className="space-y-1.5"><Label className="text-xs">CPV prefix</Label><Input defaultValue="CPV-{YYYY}-{MM}-{####}" className="font-mono text-xs" /></div>
            <div className="space-y-1.5"><Label className="text-xs">BPV prefix</Label><Input defaultValue="BPV-{YYYY}-{MM}-{####}" className="font-mono text-xs" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Invoice prefix</Label><Input defaultValue="CI-{YYYY}-{MM}-{####}" className="font-mono text-xs" /></div>
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <SectionHeader eyebrow="Notifications" title="Automated messaging" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-sm font-semibold">Email donor receipts</div>
                  <div className="text-xs text-muted-foreground">Sends a PDF receipt on every collection</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-sm font-semibold">SMS donor reminders</div>
                  <div className="text-xs text-muted-foreground">For overdue pledges + bounce-back follow-ups</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-sm font-semibold">Customer statements (monthly)</div>
                  <div className="text-xs text-muted-foreground">Auto-email on 1st of each month</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-sm font-semibold">Supplier payment advice</div>
                  <div className="text-xs text-muted-foreground">One-click email after Batch Run</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
