'use client';

import { useState } from 'react';
import {
  Save, Plus, Heart, HandCoins, Banknote, CreditCard, Receipt,
  ArrowRight, Paperclip, Sparkles, Printer,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { donors, donations, donationStats } from '@/lib/finance/donations-data';
import { DONATION_FUNDS } from '@/lib/finance/seed';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

type Mode = 'CASH' | 'CHEQUE' | 'BANK_TRANSFER' | 'PAY_ORDER';

const fundTone: Record<string, string> = {
  ZAKAT:     'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  SADQAH:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  MOSQUE:    'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  MADRASSAH: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  GENERAL:   'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
};

export default function DonationCollectionPage() {
  const [donorId, setDonorId] = useState('d13');
  const [fund, setFund] = useState('ZAKAT');
  const [mode, setMode] = useState<Mode>('CASH');
  const [amount, setAmount] = useState(25_000);

  const donor = donors.find(d => d.id === donorId)!;
  const fundDef = DONATION_FUNDS.find(f => f.id === fund)!;
  const deposit = mode === 'CASH' ? '1001' : '1002';

  return (
    <PageShell
      eyebrow="Donations · Kiosk entry"
      title="Donation Collection"
      description="Single-screen entry — pick donor, pick fund, pick mode, save. Receipt prints automatically and the donor is notified by SMS."
      breadcrumb={[{ label: 'Donations' }, { label: 'Collection' }]}
      actions={
        <>
          <Button variant="outline" size="sm"><Printer className="mr-1.5 h-3.5 w-3.5" /> Save & print</Button>
          <Button size="sm"><Save className="mr-1.5 h-3.5 w-3.5" /> Save & new</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Today's collections" value={donationStats.todayCount} tone="success" icon={Receipt} hint={formatPKR(donationStats.todayAmount)} />
          <KpiCard label="Selected fund" value={fundDef.name} tone="violet" icon={Heart} hint={`Posts to ${fundDef.account}`} />
          <KpiCard label="Donor balance"     value={formatPKR(donor.totalGiving)} tone="info" icon={HandCoins} hint={donor.name} />
          <KpiCard label="Active pledges"    value={donationStats.activePledges} tone="warning" icon={Sparkles} />
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: form */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <SectionHeader eyebrow="Step 1" title="Donor & fund" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Donor</Label>
                <Select value={donorId} onValueChange={setDonorId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {donors.map(d => <SelectItem key={d.id} value={d.id}><span className="font-mono text-xs mr-2 text-muted-foreground">{d.code}</span>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Date</Label>
                <Input type="date" defaultValue="2026-05-23" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Fund</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {DONATION_FUNDS.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFund(f.id)}
                      className={cn(
                        'rounded-xl border p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md',
                        fund === f.id ? 'border-primary ring-2 ring-primary/30 bg-primary/5' : 'border-border',
                      )}
                    >
                      <span className={cn('inline-flex items-center justify-center h-7 w-7 rounded-lg mb-1.5', fundTone[f.id])}>
                        <Heart className="h-3.5 w-3.5" />
                      </span>
                      <div className="text-xs font-bold">{f.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{f.account}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeader eyebrow="Step 2" title="Mode & amount" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Payment mode</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {([
                    { k: 'CASH',          icon: Banknote,    label: 'Cash' },
                    { k: 'CHEQUE',        icon: Receipt,     label: 'Cheque' },
                    { k: 'BANK_TRANSFER', icon: CreditCard,  label: 'Transfer' },
                    { k: 'PAY_ORDER',     icon: Receipt,     label: 'Pay Order' },
                  ] as { k: Mode; icon: any; label: string }[]).map(m => (
                    <button
                      key={m.k}
                      onClick={() => setMode(m.k)}
                      className={cn(
                        'rounded-xl border p-3 flex items-center gap-2 transition-colors',
                        mode === m.k ? 'border-primary bg-primary/10 text-primary' : 'border-border',
                      )}
                    >
                      <m.icon className="h-4 w-4" />
                      <span className="text-sm font-semibold">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {mode === 'CHEQUE' && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Cheque #</Label>
                    <Input placeholder="HBL ch#10488" className="font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Cheque date</Label>
                    <Input type="date" defaultValue="2026-05-22" />
                  </div>
                </>
              )}
              {mode === 'BANK_TRANSFER' && (
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Bank reference</Label>
                  <Input placeholder="IBT-22052-…" className="font-mono" />
                </div>
              )}
              {mode === 'PAY_ORDER' && (
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">PO number</Label>
                  <Input placeholder="PO-9912" className="font-mono" />
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Deposit account</Label>
                <Select value={deposit}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1001">1001 · Cash on Hand</SelectItem>
                    <SelectItem value="1002">1002 · Bank — HBL Current</SelectItem>
                    <SelectItem value="1003">1003 · Bank — MCB Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Amount (PKR)</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="tabular-nums font-bold text-lg h-12"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Remarks</Label>
                <Textarea rows={2} placeholder="Optional — for the donor's record" />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Deposit slip</Label>
                <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 py-6 text-xs text-muted-foreground hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors">
                  <Paperclip className="h-4 w-4" />
                  Attach slip photo (optional)
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: live receipt + recent */}
        <div className="space-y-4">
          <Card className="p-5">
            <SectionHeader eyebrow="Live preview" title="Receipt" />
            <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-5 space-y-3 text-sm">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-bold uppercase tracking-wide">BINORIA WELFARE TRUST</span>
                <span className="font-mono">DC-2026-05-0124</span>
              </div>
              <div className="border-t border-dashed border-border" />
              <div className="space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground text-xs">Donor</span><span className="font-semibold">{donor.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-xs">CNIC</span><span className="font-mono text-xs">{donor.cnic}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-xs">Fund</span><span className={cn('font-semibold inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs', fundTone[fund])}>{fundDef.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-xs">Mode</span><span className="font-semibold capitalize">{mode.replace('_', ' ').toLowerCase()}</span></div>
              </div>
              <div className="border-t border-dashed border-border" />
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">Amount received</span>
                <span className="text-2xl font-bold tabular-nums">{formatPKR(amount)}</span>
              </div>
              <div className="text-[11px] text-muted-foreground text-center pt-2 italic">May Allah accept and reward your generosity</div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              GL: Dr {deposit} · Cr <span className="font-mono">{fundDef.account}</span>
            </div>
          </Card>

          <Card className="p-4">
            <SectionHeader eyebrow="Today" title="Recent collections" />
            <ul className="space-y-2">
              {donations.slice(0, 4).map(d => (
                <li key={d.id} className="flex items-center gap-2 text-xs">
                  <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', d.status === 'BOUNCED_REVERSED' ? 'bg-rose-500' : 'bg-emerald-500')} />
                  <span className="font-medium truncate flex-1">{d.donorName}</span>
                  <span className={cn('text-[9px] font-bold rounded px-1.5 py-0.5', fundTone[d.fundCode])}>{d.fundCode}</span>
                  <span className="tabular-nums font-semibold shrink-0">{formatPKR(d.amount)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
