'use client';

import { useState } from 'react';
import { Save, Plus, Boxes, PackageCheck, FileText, Sparkles } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { CostCenterPicker } from '@/components/finance/cost-center-picker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { assetCategories } from '@/lib/finance/assets-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const pendingCapex = [
  { invoice: 'SI-2026-05-0091', supplier: 'COMPUTER MARKETING',  desc: 'Dell Latitude 5530 × 8',          amount: 1_280_000, date: '2026-05-04' },
  { invoice: 'SI-2026-05-0102', supplier: 'COOLPRO REFRIGERATION', desc: 'Walk-in cold storage upgrade', amount:   320_000, date: '2026-05-11' },
];

export default function AssetAcquisitionPage() {
  const [mode, setMode] = useState<'DIRECT' | 'FROM_SI'>('DIRECT');
  const [cat, setCat] = useState('EQP');
  const [cost, setCost] = useState(180_000);
  const category = assetCategories.find(c => c.code === cat)!;
  const monthlyDep = Math.round((cost - cost * 0.1) / (category.lifeMonths ?? 60));

  return (
    <PageShell
      eyebrow="Fixed Assets · Acquisition"
      title="Acquire Asset"
      description="Add a new fixed asset — type the details directly, or promote a capex line from a posted Supplier Invoice."
      breadcrumb={[
        { label: 'Fixed Assets', href: '/dashboard/finance/assets' },
        { label: 'Acquisition' },
      ]}
      actions={
        <>
          <Button variant="outline" size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Save draft</Button>
          <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> Add to register</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Mode" value={mode === 'DIRECT' ? 'Direct entry' : 'From SI'} tone="info" />
          <KpiCard label="Acquisition cost" value={formatPKR(cost)}   tone="accent"  icon={Boxes} />
          <KpiCard label="Monthly dep"      value={formatPKR(monthlyDep)} tone="warning" hint={`${category.lifeMonths ?? '—'} months life`} />
          <KpiCard label="Category"          value={category.name}     tone="success" hint={category.method.replace('_', ' ').toLowerCase()} />
        </>
      }
    >
      <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="mb-4">
        <TabsList className="grid grid-cols-2 max-w-sm">
          <TabsTrigger value="DIRECT"><FileText className="h-3.5 w-3.5 mr-1.5" /> Direct entry</TabsTrigger>
          <TabsTrigger value="FROM_SI"><PackageCheck className="h-3.5 w-3.5 mr-1.5" /> From Supplier Invoice</TabsTrigger>
        </TabsList>
      </Tabs>

      {mode === 'FROM_SI' && (
        <Card className="p-5 mb-4">
          <SectionHeader eyebrow="Step 0" title="Pick capex line from posted Supplier Invoice" />
          <div className="space-y-2">
            {pendingCapex.map(c => (
              <label key={c.invoice} className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3 hover:border-primary cursor-pointer">
                <input type="radio" name="capex" className="h-4 w-4" />
                <div className="flex-1">
                  <div className="font-mono text-xs font-bold">{c.invoice}</div>
                  <div className="text-xs text-muted-foreground">{c.supplier} · {c.date}</div>
                  <div className="text-sm font-medium mt-0.5">{c.desc}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold tabular-nums">{formatPKR(c.amount)}</div>
                </div>
              </label>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5">
        <SectionHeader eyebrow={mode === 'FROM_SI' ? 'Step 2' : 'Step 1'} title="Asset details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Asset code</Label>
            <Input value="FA-2026-0102" readOnly className="font-mono bg-muted/30" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Asset name</Label>
            <Input defaultValue="Hobart 60Qt Industrial Mixer" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Category</Label>
            <Select value={cat} onValueChange={setCat}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{assetCategories.map(c => <SelectItem key={c.code} value={c.code}>{c.code} · {c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Cost centre</Label>
            <CostCenterPicker value="2" onChange={() => {}} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Acquisition date</Label>
            <Input type="date" defaultValue="2026-05-23" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Acquisition cost (PKR)</Label>
            <Input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} className="tabular-nums font-bold text-lg" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Salvage value</Label>
            <Input type="number" defaultValue={Math.round(cost * 0.1)} className="tabular-nums" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Useful life (months)</Label>
            <Input type="number" defaultValue={category.lifeMonths ?? 60} className="tabular-nums" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Vendor</Label>
            <Input defaultValue="COMPUTER MARKETING" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Serial number</Label>
            <Input className="font-mono" defaultValue="HB-6QT-441" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Location</Label>
            <Input defaultValue="Main Kitchen" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Notes</Label>
            <Textarea rows={2} />
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-border">
          <SectionHeader eyebrow="Posting preview" title="GL entries" />
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b pb-1"><span>Dr {category.assetAcc} Asset</span><span className="tabular-nums">{formatPKR(cost)}</span></div>
            <div className="flex justify-between text-rose-700 pt-1"><span>Cr 2100 Accounts Payable / 1002 Bank</span><span className="tabular-nums">{formatPKR(cost)}</span></div>
          </div>
          <div className="mt-3 flex items-start gap-2 text-xs text-blue-900 dark:text-blue-200 bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-md p-3">
            <Sparkles className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>Monthly depreciation of <strong>{formatPKR(monthlyDep)}</strong> will auto-post via the depreciation run starting next month-end.</span>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}
