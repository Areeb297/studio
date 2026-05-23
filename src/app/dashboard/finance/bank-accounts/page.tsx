'use client';

import { Plus, PiggyBank, Banknote, Eye, Edit, Scale, Building2 } from 'lucide-react';
import Link from 'next/link';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { StatusBadge } from '@/components/finance/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const accounts = [
  { glCode: '1001', name: 'Cash on Hand',                 bank: 'Cash drawer', branch: '—',            accountNo: '—',                iban: '—',                     currency: 'PKR', balance:   450_000, lastRecon: 'Today',   active: true,  isCash: true },
  { glCode: '1002', name: 'HBL Current',                  bank: 'HBL',         branch: 'Korangi',       accountNo: '01-22-3344-55',   iban: 'PK36HABB0000123456789012', currency: 'PKR', balance: 2_850_000, lastRecon: '31 Apr',  active: true,  isCash: false },
  { glCode: '1003', name: 'MCB Savings',                  bank: 'MCB',         branch: 'SITE',          accountNo: '22-44-6677-88',   iban: 'PK22MUCB0000789456123789', currency: 'PKR', balance: 1_250_000, lastRecon: '31 Apr',  active: true,  isCash: false },
  { glCode: '1004', name: 'UBL USD',                       bank: 'UBL',         branch: 'I.I. Chundrigar', accountNo: '44-99-1234-22', iban: 'PK44UNIL0000654321098765', currency: 'USD', balance:    12_500, lastRecon: '30 Apr',  active: true,  isCash: false },
  { glCode: '1005', name: 'Meezan Donations',              bank: 'Meezan',      branch: 'Tariq Road',    accountNo: '55-11-2233-99',   iban: 'PK55MEZN0000111223399000', currency: 'PKR', balance:   875_000, lastRecon: '31 Apr',  active: true,  isCash: false },
  { glCode: '1006', name: 'HBL Madrasa Fees',              bank: 'HBL',         branch: 'Defence',       accountNo: '01-77-5544-33',   iban: 'PK36HABB0000555544333000', currency: 'PKR', balance:   320_000, lastRecon: '31 Apr',  active: true,  isCash: false },
];

export default function BankAccountsPage() {
  const totalCash = accounts.filter(a => a.isCash).reduce((s, a) => s + a.balance, 0);
  const totalBankPKR = accounts.filter(a => !a.isCash && a.currency === 'PKR').reduce((s, a) => s + a.balance, 0);
  const totalUSD = accounts.filter(a => a.currency === 'USD').reduce((s, a) => s + a.balance, 0);

  return (
    <PageShell
      eyebrow="Setup · Cash & Bank"
      title="Bank Accounts"
      description="Every cash drawer + bank account in the system. Each maps to a GL control account and feeds the bank reconciliation screen."
      breadcrumb={[{ label: 'Setup' }, { label: 'Bank Accounts' }]}
      actions={<Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New bank account</Button>}
      kpis={
        <>
          <KpiCard label="Total accounts" value={accounts.length}        tone="info"    icon={PiggyBank} />
          <KpiCard label="Cash on hand"    value={formatPKR(totalCash)}    tone="warning" icon={Banknote} />
          <KpiCard label="Bank PKR"        value={formatPKR(totalBankPKR)} tone="success" icon={PiggyBank} />
          <KpiCard label="USD position"    value={`$ ${totalUSD.toLocaleString()}`} tone="accent" icon={Banknote} hint="UBL" />
        </>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {accounts.map(a => (
          <Link key={a.glCode} href="/dashboard/finance/bank-reconciliation">
            <Card className="p-4 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer h-full">
              <div className={cn('absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl pointer-events-none', a.isCash ? 'bg-amber-200/40' : 'bg-teal-200/40')} />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <span className={cn(
                    'inline-flex h-8 w-8 items-center justify-center rounded-lg',
                    a.isCash ? 'bg-amber-100 text-amber-700' : 'bg-teal-100 text-teal-700',
                  )}>
                    {a.isCash ? <Banknote className="h-4 w-4" /> : <PiggyBank className="h-4 w-4" />}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">{a.glCode}</span>
                </div>
                <div className="text-sm font-semibold mt-2">{a.name}</div>
                <div className="mt-2 text-base font-bold tabular-nums">
                  {a.currency === 'USD' ? `$ ${a.balance.toLocaleString()}` : formatPKR(a.balance)}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  Recon {a.lastRecon}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="p-4">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[80px] font-mono">GL</TableHead>
                <TableHead>Account name</TableHead>
                <TableHead className="w-[100px]">Bank</TableHead>
                <TableHead className="w-[140px]">Branch</TableHead>
                <TableHead className="w-[160px] font-mono">Account #</TableHead>
                <TableHead className="font-mono">IBAN</TableHead>
                <TableHead className="text-center w-[80px]">Cur</TableHead>
                <TableHead className="text-right w-[140px]">Balance</TableHead>
                <TableHead className="w-[100px]">Last recon</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map(a => (
                <TableRow key={a.glCode} className="hover:bg-primary/5">
                  <TableCell className="font-mono text-xs">{a.glCode}</TableCell>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell><span className="inline-flex items-center gap-1 text-xs"><Building2 className="h-3 w-3 text-muted-foreground" />{a.bank}</span></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.branch}</TableCell>
                  <TableCell className="font-mono text-[10px]">{a.accountNo}</TableCell>
                  <TableCell className="font-mono text-[10px] text-muted-foreground">{a.iban}</TableCell>
                  <TableCell className="text-center text-xs font-semibold">{a.currency}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">
                    {a.currency === 'USD' ? `$ ${a.balance.toLocaleString()}` : formatPKR(a.balance)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.lastRecon}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-muted/60">
              <TableRow>
                <TableCell colSpan={7} className="text-right text-xs uppercase tracking-wide font-bold">Total PKR position</TableCell>
                <TableCell className="text-right tabular-nums font-bold">{formatPKR(totalCash + totalBankPKR)}</TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
