'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronDown, ChevronRight, Plus, Edit, Building2,
  Activity, Shield, ArrowLeft,
} from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { accounts, getChildren, getRoots, type Account } from '@/lib/finance/coa-data';
import { formatPKR } from '@/utils/accounting';
import { cn } from '@/lib/utils';

const typeChip: Record<string, string> = {
  ASSET:     'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  LIABILITY: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  EQUITY:    'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  INCOME:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  EXPENSE:   'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
};

function TreeNode({
  account, expanded, onToggle, selected, onSelect, depth = 0,
}: {
  account: Account;
  expanded: Set<string>;
  onToggle: (code: string) => void;
  selected: string;
  onSelect: (code: string) => void;
  depth?: number;
}) {
  const kids = getChildren(account.code);
  const hasKids = kids.length > 0;
  const isOpen = expanded.has(account.code);
  const isSel = selected === account.code;

  return (
    <div>
      <button
        onClick={() => { onSelect(account.code); if (hasKids) onToggle(account.code); }}
        style={{ paddingLeft: depth * 16 + 8 }}
        className={cn(
          'w-full flex items-center gap-1.5 py-1.5 pr-2 rounded-md text-left text-sm transition-colors',
          isSel ? 'bg-primary/15 text-primary font-semibold' : 'hover:bg-muted/50',
        )}
      >
        {hasKids ? (
          isOpen ? <ChevronDown className="h-3 w-3 shrink-0" /> : <ChevronRight className="h-3 w-3 shrink-0" />
        ) : (
          <span className="w-3 shrink-0" />
        )}
        <span className="font-mono text-[11px] text-muted-foreground w-[90px] shrink-0">{account.code}</span>
        <span className={cn('truncate flex-1', !account.isPosting && 'font-semibold uppercase tracking-wide text-xs')}>{account.name}</span>
        {account.currentBalance !== 0 && (
          <span className={cn(
            'text-[11px] tabular-nums font-semibold shrink-0',
            account.currentBalance < 0 ? 'text-rose-700' : 'text-emerald-700',
          )}>
            {account.currentBalance < 0 ? `(${formatPKR(Math.abs(account.currentBalance))})` : formatPKR(account.currentBalance)}
          </span>
        )}
      </button>
      {isOpen && kids.map(k => (
        <TreeNode key={k.code} account={k} expanded={expanded} onToggle={onToggle} selected={selected} onSelect={onSelect} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function ChartOfAccountsTreePage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['1','2','3','4','5','11','12','13','21','31','41','42','51','52','53']));
  const [selected, setSelected] = useState<string>('1100');

  const sel = useMemo(() => accounts.find(a => a.code === selected), [selected]);

  const toggle = (code: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });

  return (
    <PageShell
      eyebrow="Setup · Hierarchy"
      title="Chart of Accounts — Tree"
      description="Three-pane hierarchy view. Pick a node to inspect, edit security, or jump to its movement."
      breadcrumb={[
        { label: 'Setup' },
        { label: 'Chart of Accounts', href: '/dashboard/finance/accounts' },
        { label: 'Tree' },
      ]}
      actions={
        <>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/finance/accounts"><ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to table</Link>
          </Button>
          <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New account</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT: tree */}
        <Card className="lg:col-span-4 p-3">
          <div className="px-2 pb-2 mb-2 border-b flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Hierarchy</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setExpanded(new Set(accounts.map(a => a.code)))}>Expand all</Button>
              <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setExpanded(new Set())}>Collapse</Button>
            </div>
          </div>
          <ScrollArea className="h-[600px]">
            {getRoots().map(r => (
              <TreeNode key={r.code} account={r} expanded={expanded} onToggle={toggle} selected={selected} onSelect={setSelected} />
            ))}
          </ScrollArea>
        </Card>

        {/* MIDDLE: details */}
        <Card className="lg:col-span-5 p-5">
          {sel ? (
            <>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Selected node</div>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="font-mono text-base text-muted-foreground">{sel.code}</span>
                    <h2 className="text-xl font-bold tracking-tight">{sel.name}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm"><Edit className="mr-1 h-3 w-3" /> Edit</Button>
                  <Button variant="outline" size="sm"><Plus className="mr-1 h-3 w-3" /> Child</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <Detail label="Type" value={sel.type[0] + sel.type.slice(1).toLowerCase()} tone={typeChip[sel.type]} />
                <Detail label="Sub-type" value={sel.subType ?? '—'} />
                <Detail label="Normal balance" value={sel.normalBalance} />
                <Detail label="Posting" value={sel.isPosting ? 'Yes' : 'No (header)'} />
                <Detail label="Control account" value={sel.isControl ? sel.controlType ?? 'Yes' : 'No'} />
                <Detail label="Fund code" value={sel.fundCode ?? '—'} />
                <Detail label="Currency" value={sel.currency} />
                <Detail label="Companies" value={`${sel.companies.length} of 5`} />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <Card className="p-3 bg-muted/30">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Opening balance</div>
                  <div className="text-base font-bold tabular-nums mt-1">
                    {sel.openingBalance === 0 ? '—' :
                      sel.openingBalance < 0 ? `(${formatPKR(Math.abs(sel.openingBalance))})` : formatPKR(sel.openingBalance)}
                  </div>
                </Card>
                <Card className="p-3 bg-primary/5 border-primary/30">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-primary">Current balance</div>
                  <div className="text-base font-bold tabular-nums mt-1 text-primary">
                    {sel.currentBalance === 0 ? '—' :
                      sel.currentBalance < 0 ? `(${formatPKR(Math.abs(sel.currentBalance))})` : formatPKR(sel.currentBalance)}
                  </div>
                </Card>
              </div>

              {/* Security */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Account security</span>
                </div>
                <ul className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { k: 'canView',      label: 'View',      roles: 'All finance' },
                    { k: 'canPost',      label: 'Post',      roles: 'Accountant + above' },
                    { k: 'canReverse',   label: 'Reverse',   roles: 'Finance Mgr + CFO' },
                    { k: 'canReconcile', label: 'Reconcile', roles: 'Accountant + Finance Mgr' },
                  ].map(p => (
                    <li key={p.k} className="rounded-md border border-border bg-muted/30 px-3 py-2">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{p.label}</div>
                      <div className="text-sm font-medium mt-0.5">{p.roles}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground py-12">Pick a node from the tree to inspect.</div>
          )}
        </Card>

        {/* RIGHT: movement preview */}
        <Card className="lg:col-span-3 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Last 5 movements</span>
          </div>
          {sel && sel.isPosting ? (
            <>
              <ul className="space-y-2">
                {[
                  { d: '23 May', v: 'CR-2026-05-0103', desc: 'Green Valley',    amt:  35_000 },
                  { d: '22 May', v: 'CI-2026-05-0042', desc: 'Catering invoice', amt: -57_650 },
                  { d: '20 May', v: 'CR-2026-05-0089', desc: 'Noor Hostel',     amt:  50_000 },
                  { d: '18 May', v: 'CI-2026-05-0035', desc: 'Madrasa fees',    amt: -120_000 },
                  { d: '15 May', v: 'WO-2026-05-0002', desc: 'Write-off',       amt: -25_000 },
                ].map((m, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground w-12">{m.d}</span>
                    <span className="font-mono text-[10px] w-28 truncate">{m.v}</span>
                    <span className="truncate flex-1">{m.desc}</span>
                    <span className={cn('font-semibold tabular-nums shrink-0', m.amt < 0 ? 'text-rose-700' : 'text-emerald-700')}>
                      {m.amt < 0 ? `(${formatPKR(Math.abs(m.amt))})` : formatPKR(m.amt)}
                    </span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                <Link href={`/dashboard/finance/account-movement?account=${sel.code}`}>
                  Open full movement →
                </Link>
              </Button>
            </>
          ) : (
            <div className="text-center text-xs text-muted-foreground py-8">
              {sel && !sel.isPosting ? 'Header account — see children for movement.' : 'Pick a posting account.'}
            </div>
          )}
        </Card>
      </div>
    </PageShell>
  );
}

function Detail({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{label}</div>
      {tone ? (
        <span className={cn('inline-flex mt-1 rounded-md px-2 py-0.5 text-[11px] font-bold', tone)}>
          {value}
        </span>
      ) : (
        <div className="text-sm font-medium mt-1">{value}</div>
      )}
    </div>
  );
}
