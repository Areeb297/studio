'use client';

import { useState } from 'react';
import {
  AlertTriangle, ArrowRight, Building2, Calendar, Coins, FileText,
  TrendingDown, TrendingUp, Upload, Trash2,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { StatusBadge } from '@/components/finance/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { fixedAssets, samplePendingDisposal } from '@/lib/finance/assets-data';
import { getCostCenter } from '@/lib/finance/seed';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

export default function AssetDisposalPage() {
  const [assetId, setAssetId] = useState(samplePendingDisposal.asset.id);
  const [proceeds, setProceeds] = useState(samplePendingDisposal.proceeds);
  const [method, setMethod] = useState<'SOLD' | 'SCRAPPED' | 'DONATED'>('SOLD');

  const asset = fixedAssets.find(a => a.id === assetId)!;
  const gainLoss = proceeds - asset.nbv;
  const isLoss = gainLoss < 0;

  return (
    <PageShell
      eyebrow="Fixed Assets · Disposal"
      title="Asset Disposal"
      description="Retire an asset from the register. The system computes gain/loss against current NBV and posts the disposal journal on approval."
      breadcrumb={[
        { label: 'Fixed Assets', href: '/dashboard/finance/assets' },
        { label: 'Disposal' },
      ]}
      actions={
        <>
          <Button variant="outline" size="sm">Cancel</Button>
          <Button size="sm" className={isLoss ? 'bg-rose-600 hover:bg-rose-700' : ''}>
            Submit for approval <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form */}
        <Card className="lg:col-span-2 p-6 space-y-6">
          <SectionHeader eyebrow="Disposal record" title="Asset & proceeds" />

          {/* Asset picker */}
          <div className="space-y-2">
            <Label>Asset</Label>
            <Select value={assetId} onValueChange={setAssetId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {fixedAssets.filter(a => a.status === 'ACTIVE').map(a => (
                  <SelectItem key={a.id} value={a.id}>
                    <span className="font-mono text-xs mr-2">{a.code}</span>{a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Asset preview */}
          <div className="rounded-lg border border-border bg-muted/30 p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Code</div>
              <div className="font-mono font-semibold mt-0.5">{asset.code}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Category</div>
              <div className="font-semibold mt-0.5">{asset.categoryCode}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Cost centre</div>
              <div className="font-semibold mt-0.5 inline-flex items-center gap-1">
                <Building2 className="h-3 w-3 text-muted-foreground" />
                {getCostCenter(asset.costCenterId)?.name}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Acquired</div>
              <div className="font-semibold mt-0.5">
                {new Date(asset.acquisitionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Disposal details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Disposal date</Label>
              <Input type="date" defaultValue="2026-05-23" />
            </div>
            <div className="space-y-2">
              <Label>Disposal method</Label>
              <RadioGroup value={method} onValueChange={(v) => setMethod(v as any)} className="flex gap-3">
                {(['SOLD', 'SCRAPPED', 'DONATED'] as const).map(m => (
                  <Label key={m} htmlFor={m} className={cn(
                    'flex-1 flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer text-xs font-semibold uppercase',
                    method === m ? 'border-primary bg-primary/10 text-primary' : 'border-border',
                  )}>
                    <RadioGroupItem id={m} value={m} className="sr-only" />
                    {m}
                  </Label>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>Proceeds (PKR)</Label>
              <Input type="number" value={proceeds} onChange={e => setProceeds(Number(e.target.value))} className="tabular-nums font-semibold" />
            </div>
            <div className="space-y-2">
              <Label>Buyer / Recipient</Label>
              <Input placeholder="e.g. Karachi Air Conditioning Resellers" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Reason / notes</Label>
              <Textarea rows={2} placeholder="Upgrade to inverter ACs — old units sold to local trader." />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Supporting documents</Label>
              <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-6 text-sm text-muted-foreground hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors">
                <Upload className="h-4 w-4" />
                Drop sale receipt, scrap certificate, or donation letter…
              </div>
            </div>
          </div>
        </Card>

        {/* Right: live computation */}
        <div className="space-y-4">
          <Card className={cn('p-5 border-l-4', isLoss ? 'border-l-rose-500' : 'border-l-emerald-500')}>
            <SectionHeader eyebrow="Live calculation" title={isLoss ? 'Loss on disposal' : 'Gain on disposal'} />
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Acquisition cost</span>
                <span className="tabular-nums font-medium">{formatPKR(asset.acquisitionCost)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Acc. depreciation</span>
                <span className="tabular-nums font-medium">({formatPKR(asset.accDep)})</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2">
                <span className="font-semibold">Net book value</span>
                <span className="tabular-nums font-bold">{formatPKR(asset.nbv)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Proceeds</span>
                <span className="tabular-nums font-medium text-emerald-700">{formatPKR(proceeds)}</span>
              </div>
              <div className={cn(
                'flex items-center justify-between rounded-lg px-3 py-2.5 mt-2',
                isLoss ? 'bg-rose-50 dark:bg-rose-950/30' : 'bg-emerald-50 dark:bg-emerald-950/30',
              )}>
                <span className="font-bold uppercase text-xs tracking-wide inline-flex items-center gap-1.5">
                  {isLoss ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
                  {isLoss ? 'Loss' : 'Gain'} on disposal
                </span>
                <span className={cn(
                  'tabular-nums font-bold text-base',
                  isLoss ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300',
                )}>
                  {isLoss ? `(${formatPKR(Math.abs(gainLoss))})` : formatPKR(gainLoss)}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeader eyebrow="Posting preview" title="GL entries" />
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-border pb-1">
                <span>Dr 1001 Cash / Bank</span>
                <span className="tabular-nums font-semibold">{formatPKR(proceeds)}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-1">
                <span>Dr 1610 Acc. Depreciation</span>
                <span className="tabular-nums font-semibold">{formatPKR(asset.accDep)}</span>
              </div>
              {isLoss && (
                <div className="flex justify-between border-b border-border pb-1 text-rose-700">
                  <span>Dr 5700 Loss on Disposal</span>
                  <span className="tabular-nums font-semibold">{formatPKR(Math.abs(gainLoss))}</span>
                </div>
              )}
              {!isLoss && gainLoss > 0 && (
                <div className="flex justify-between border-b border-border pb-1 text-emerald-700">
                  <span>Cr 4099 Gain on Disposal</span>
                  <span className="tabular-nums font-semibold">{formatPKR(gainLoss)}</span>
                </div>
              )}
              <div className="flex justify-between text-rose-700 pt-1">
                <span>Cr {asset.categoryCode === 'BLD' ? '1500' : asset.categoryCode === 'VEH' ? '1700' : '1600'} Asset Cost</span>
                <span className="tabular-nums font-semibold">{formatPKR(asset.acquisitionCost)}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
              <StatusBadge status="DRAFT" />
              Will be posted on GM approval
            </div>
          </Card>

          <Card className="p-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
            <div className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Asset disposals are <strong>irreversible</strong> once approved. Asset moves to <code className="font-mono">DISPOSED</code> status
                and cannot be depreciated further.
              </span>
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
