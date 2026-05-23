'use client';

import { Plus, Users, Search } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { donors } from '@/lib/finance/donations-data';

const dependents = donors.flatMap(d => Array.from({ length: d.dependents }).map((_, i) => ({
  donorCode: d.code,
  donorName: d.name,
  name: `${d.name.split(' ')[1] ?? d.name} dependent ${i + 1}`,
  relationship: ['Spouse', 'Son', 'Daughter', 'Mother', 'Father'][i % 5],
  cnic: i === 0 ? d.cnic.replace(/(.{5}-)\d{7}/, '$11234567') : '—',
  ageGroup: i === 0 ? 'Adult' : i % 2 === 0 ? 'Minor' : 'Adult',
})));

export default function DonorDependentsPage() {
  return (
    <PageShell
      eyebrow="Donations · Cross-donor"
      title="Donor Dependents"
      description="All dependents recorded against any donor profile — useful for Zakat-eligibility audits."
      breadcrumb={[
        { label: 'Donations' },
        { label: 'Donors', href: '/dashboard/finance/donations/donors' },
        { label: 'Dependents' },
      ]}
      actions={<Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> Add dependent</Button>}
      kpis={
        <>
          <KpiCard label="Total dependents" value={dependents.length} tone="info" icon={Users} />
          <KpiCard label="Donors with deps"  value={donors.filter(d => d.dependents > 0).length} tone="accent" />
          <KpiCard label="Largest family"    value={Math.max(...donors.map(d => d.dependents))} tone="warning" hint="dependents" />
          <KpiCard label="Minors"            value={dependents.filter(d => d.ageGroup === 'Minor').length} tone="success" />
        </>
      }
    >
      <Card className="p-4">
        <div className="mb-4 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search name, donor, CNIC…" className="pl-9" />
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[110px] font-mono">Donor code</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Dependent name</TableHead>
                <TableHead className="w-[120px]">Relationship</TableHead>
                <TableHead className="w-[160px] font-mono">CNIC</TableHead>
                <TableHead className="w-[110px]">Age group</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dependents.slice(0, 30).map((d, i) => (
                <TableRow key={i} className="hover:bg-primary/5">
                  <TableCell className="font-mono text-xs">{d.donorCode}</TableCell>
                  <TableCell className="font-medium">{d.donorName}</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell className="text-xs">{d.relationship}</TableCell>
                  <TableCell className="font-mono text-xs">{d.cnic}</TableCell>
                  <TableCell><span className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded">{d.ageGroup}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
