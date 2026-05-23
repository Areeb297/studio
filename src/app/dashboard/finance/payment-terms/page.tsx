'use client';

import { Plus, Clock, Edit, Trash2 } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { StatusBadge } from '@/components/finance/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const terms = [
  { code: 'NET15',  name: 'Net 15',         days: 15,  discount: 0,  earlyDays: 0,  description: 'Payment due in 15 days, no early-pay discount.',                                isActive: true,  used: 12 },
  { code: 'NET30',  name: 'Net 30',         days: 30,  discount: 0,  earlyDays: 0,  description: 'Standard 30-day terms.',                                                       isActive: true,  used: 42 },
  { code: 'NET45',  name: 'Net 45',         days: 45,  discount: 0,  earlyDays: 0,  description: 'Used for institutional customers.',                                            isActive: true,  used:  8 },
  { code: 'NET60',  name: 'Net 60',         days: 60,  discount: 0,  earlyDays: 0,  description: 'Extended terms for select suppliers (e.g. COOLPRO).',                          isActive: true,  used:  4 },
  { code: '2/10N30', name: '2/10 Net 30',    days: 30,  discount: 2,  earlyDays: 10, description: '2% discount if paid within 10 days, otherwise net 30.',                       isActive: true,  used:  6 },
  { code: 'COD',    name: 'Cash on Delivery', days: 0,   discount: 0,  earlyDays: 0,  description: 'Pay immediately on receipt — used for new accounts.',                       isActive: true,  used: 18 },
  { code: 'ADV',    name: 'Advance',         days: -7,  discount: 0,  earlyDays: 0,  description: 'Customer pays before service delivery (catering bookings).',                 isActive: true,  used: 14 },
  { code: 'NET90',  name: 'Net 90',         days: 90,  discount: 0,  earlyDays: 0,  description: 'Legacy term — being phased out.',                                              isActive: false, used:  2 },
];

export default function PaymentTermsPage() {
  return (
    <PageShell
      eyebrow="Setup · Master"
      title="Payment Terms"
      description="Configurable payment-due windows for customer invoices and supplier bills. Drives ageing buckets + due-date calculation."
      breadcrumb={[{ label: 'Setup' }, { label: 'Payment Terms' }]}
      actions={<Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New term</Button>}
      kpis={
        <>
          <KpiCard label="Total terms"   value={terms.length}                              tone="info"    icon={Clock} />
          <KpiCard label="Active"        value={terms.filter(t => t.isActive).length}      tone="success" icon={Clock} />
          <KpiCard label="With discount" value={terms.filter(t => t.discount > 0).length}  tone="accent"  hint="Early-pay incentive" />
          <KpiCard label="Most used"     value="NET30"                                      tone="warning" hint="42 active documents" />
        </>
      }
    >
      <Card className="p-4">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[100px] font-mono">Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-center w-[100px]">Due (days)</TableHead>
                <TableHead className="text-center w-[120px]">Discount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center w-[100px]">In use</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {terms.map(t => (
                <TableRow key={t.code} className="hover:bg-primary/5">
                  <TableCell className="font-mono text-xs font-bold">{t.code}</TableCell>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-center tabular-nums font-semibold">{t.days < 0 ? `${t.days} (advance)` : t.days}</TableCell>
                  <TableCell className="text-center tabular-nums">{t.discount > 0 ? `${t.discount}% / ${t.earlyDays}d` : '—'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.description}</TableCell>
                  <TableCell className="text-center text-xs font-semibold">{t.used}</TableCell>
                  <TableCell><StatusBadge status={t.isActive ? 'ACTIVE' : 'DRAFT'} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-600"><Trash2 className="h-3 w-3" /></Button>
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
