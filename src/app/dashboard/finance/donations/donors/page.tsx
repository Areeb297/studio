'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Users, HandCoins, Heart, Phone, MapPin,
  Mail, Eye, FileText, Star,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { donors, donationStats } from '@/lib/finance/donations-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

export default function DonorRegistryPage() {
  const [q, setQ] = useState('');
  const [zakat, setZakat] = useState('ALL');

  const rows = donors.filter(d => {
    if (q && !(d.name.toLowerCase().includes(q.toLowerCase()) || d.code.includes(q) || d.cnic.includes(q) || d.phone.includes(q))) return false;
    if (zakat === 'YES' && !d.zakatEligible) return false;
    if (zakat === 'NO' && d.zakatEligible) return false;
    return true;
  });

  const totalLifetime = donors.reduce((s, d) => s + d.totalGiving, 0);
  const topDonor = [...donors].sort((a, b) => b.totalGiving - a.totalGiving)[0];

  return (
    <PageShell
      eyebrow="Donations · Master"
      title="Donor Registry"
      description="Active donor profiles with lifetime giving and last donation date. Each profile aggregates Zakat / Sadqah / Mosque / Madrassah giving."
      breadcrumb={[{ label: 'Donations' }, { label: 'Donors' }]}
      actions={
        <>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/finance/donations/collect"><HandCoins className="mr-1.5 h-3.5 w-3.5" /> Collect</Link>
          </Button>
          <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New donor</Button>
        </>
      }
      kpis={
        <>
          <KpiCard label="Active donors" value={donationStats.activeDonors} tone="info" icon={Users} />
          <KpiCard label="Lifetime giving" value={formatPKR(totalLifetime)} tone="success" icon={Heart} />
          <KpiCard label="Active pledges" value={donationStats.activePledges} tone="accent" icon={Star} />
          <KpiCard label="Top donor" value={topDonor.name} tone="violet" hint={`${formatPKR(topDonor.totalGiving)} lifetime`} />
        </>
      }
    >
      {/* Photo-style donor cards grid (highlights) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
        {donors.slice(0, 4).map(d => (
          <Card key={d.id} className="p-4 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer">
            <div className={cn(
              'absolute inset-0 pointer-events-none',
              d.zakatEligible ? 'kpi-blob-violet' : 'kpi-blob-accent',
            )} />
            <div className="relative">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold uppercase shrink-0">
                  {d.name.split(' ').slice(0,2).map(w => w[0]).join('')}
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{d.name}</div>
                  <div className="text-[11px] text-muted-foreground font-mono">{d.code}</div>
                </div>
                {d.zakatEligible && (
                  <span className="text-[10px] font-bold uppercase bg-violet-100 text-violet-700 rounded px-1.5 py-0.5 dark:bg-violet-950 dark:text-violet-300">
                    Zakat
                  </span>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Lifetime giving</div>
                <div className="text-lg font-bold tabular-nums">{formatPKR(d.totalGiving)}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Last: {d.lastDonationDate}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search name, code, CNIC, phone…" value={q} onChange={e => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={zakat} onValueChange={setZakat}>
            <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All donors</SelectItem>
              <SelectItem value="YES">Zakat eligible</SelectItem>
              <SelectItem value="NO">Non-zakat</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground ml-auto">{rows.length} of {donors.length}</div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[40px]" />
                <TableHead>Donor</TableHead>
                <TableHead className="w-[160px]">CNIC</TableHead>
                <TableHead className="w-[160px]">Phone</TableHead>
                <TableHead className="text-center w-[100px]">Dependents</TableHead>
                <TableHead className="text-right w-[140px]">Lifetime giving</TableHead>
                <TableHead className="w-[110px]">Last gift</TableHead>
                <TableHead className="w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(d => (
                <TableRow key={d.id} className="hover:bg-primary/5 cursor-pointer">
                  <TableCell>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
                      {d.name.split(' ').slice(0,2).map(w => w[0]).join('')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{d.name}</span>
                      {d.zakatEligible && <span className="text-[9px] font-bold bg-violet-100 text-violet-700 rounded px-1.5 py-0.5 dark:bg-violet-950 dark:text-violet-300">ZAKAT</span>}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">{d.code}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{d.cnic}</TableCell>
                  <TableCell className="text-xs">{d.phone}</TableCell>
                  <TableCell className="text-center">
                    {d.dependents > 0 ? <span className="text-xs font-semibold">{d.dependents}</span> : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{formatPKR(d.totalGiving)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.lastDonationDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><FileText className="h-3 w-3" /></Button>
                      {d.email && <Button variant="ghost" size="icon" className="h-7 w-7"><Mail className="h-3 w-3" /></Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
