'use client';

import { useState } from 'react';
import {
  Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle,
  ArrowRight, FileText, X,
} from 'lucide-react';
import Link from 'next/link';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { SectionHeader } from '@/components/finance/section-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { uploadPreview } from '@/lib/finance/budget-data';
import { cn } from '@/lib/utils';

export default function BudgetUploadPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(2);
  const [dragOver, setDragOver] = useState(false);

  const steps = [
    { n: 1, label: 'Download template' },
    { n: 2, label: 'Upload file' },
    { n: 3, label: 'Preview & validate' },
    { n: 4, label: 'Confirm import' },
  ];

  const validCount = uploadPreview.ready;
  const errorCount = uploadPreview.warnings.length;

  return (
    <PageShell
      eyebrow="Budgeting · Bulk import"
      title="Excel Upload"
      description="Drop a filled budget template — the system parses, validates, and previews before any write."
      breadcrumb={[
        { label: 'Budgeting', href: '/dashboard/finance/budgets' },
        { label: 'Excel Upload' },
      ]}
    >
      {/* Stepper */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between gap-2">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center gap-3 flex-1">
              <span className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full font-bold text-sm shrink-0',
                step > s.n ? 'bg-emerald-500 text-white' :
                step === s.n ? 'bg-primary text-primary-foreground' :
                'bg-muted text-muted-foreground',
              )}>
                {step > s.n ? <CheckCircle2 className="h-4 w-4" /> : s.n}
              </span>
              <div className="flex-1 min-w-0">
                <div className={cn(
                  'text-xs font-semibold uppercase tracking-wide',
                  step >= s.n ? 'text-foreground' : 'text-muted-foreground',
                )}>{s.label}</div>
              </div>
              {i < steps.length - 1 && (
                <div className={cn('h-[2px] w-12 hidden md:block', step > s.n ? 'bg-emerald-500' : 'bg-border')} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Step content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Drop zone */}
        <Card
          className={cn(
            'lg:col-span-2 p-6 border-dashed transition-colors',
            dragOver && 'border-primary bg-primary/5',
          )}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); setStep(3); }}
        >
          <SectionHeader
            eyebrow="Step 1"
            title="Get the template"
            actions={
              <Button variant="outline" size="sm">
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Template_FY2026.xlsx
              </Button>
            }
          />
          <p className="text-sm text-muted-foreground mb-4">
            Excel sheet with columns: <code className="font-mono text-xs bg-muted px-1 rounded">CostCenter</code> ·
            <code className="font-mono text-xs bg-muted px-1 rounded ml-1">AccountCode</code> ·
            <code className="font-mono text-xs bg-muted px-1 rounded ml-1">AccountName</code> · 12 monthly columns · Notes.
          </p>

          <SectionHeader eyebrow="Step 2" title="Drop your filled file" className="mt-6" />
          <div
            onClick={() => setStep(3)}
            className={cn(
              'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-12 cursor-pointer transition-colors',
              dragOver ? 'border-primary bg-primary/10' : 'border-border bg-muted/30 hover:border-primary/40 hover:bg-primary/5',
            )}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Upload className="h-6 w-6" />
            </span>
            <div className="text-center">
              <div className="font-semibold text-sm">Drop your Excel here</div>
              <div className="text-xs text-muted-foreground mt-1">…or click to browse · .xlsx · max 5 MB</div>
            </div>
          </div>

          {/* Uploaded file (mock state) */}
          {step >= 3 && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <FileSpreadsheet className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">FY2026_BWT_Budget_v3.xlsx</div>
                <div className="text-xs text-muted-foreground">142 rows · 84 KB · uploaded just now</div>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7"><X className="h-3.5 w-3.5" /></Button>
            </div>
          )}
        </Card>

        {/* Validation summary */}
        <Card className="p-5 space-y-4">
          <SectionHeader eyebrow="Step 3" title="Validation" />

          <div className="space-y-3">
            <KpiCard label="Total rows"      value={uploadPreview.totalRows} tone="info"    icon={FileText} />
            <KpiCard label="Ready to import" value={validCount}              tone="success" icon={CheckCircle2} />
            <KpiCard label="Needs review"    value={errorCount}              tone="warning" icon={AlertCircle} />
          </div>

          <Progress value={(validCount / uploadPreview.totalRows) * 100} className="h-2" />
          <div className="text-xs text-muted-foreground text-center">
            {((validCount / uploadPreview.totalRows) * 100).toFixed(1)}% rows pass validation
          </div>
        </Card>
      </div>

      {/* Validation issues */}
      {step >= 3 && (
        <Card className="p-4 mt-4">
          <SectionHeader
            eyebrow="Review"
            title="Rows needing attention"
            description="Fix in your Excel and re-upload, or skip these rows and import the rest."
            actions={
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Skip & continue</Button>
                <Button size="sm" onClick={() => setStep(4)}>
                  Confirm import ({validCount} rows) <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            }
          />

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-[100px]">Row #</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadPreview.warnings.map((w, i) => (
                  <TableRow key={i} className="bg-amber-50/40 dark:bg-amber-950/10">
                    <TableCell className="font-mono">{w.row}</TableCell>
                    <TableCell className="font-medium">{w.field}</TableCell>
                    <TableCell className="font-mono text-xs">{w.value}</TableCell>
                    <TableCell className="text-amber-800 dark:text-amber-200 text-xs">{w.msg}</TableCell>
                    <TableCell><Button variant="ghost" size="sm" className="h-7">Fix inline</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {step === 4 && (
        <Card className="p-6 mt-4 text-center bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white mb-3">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <div className="text-base font-semibold">{validCount} budget rows imported successfully</div>
          <div className="text-xs text-muted-foreground mt-1">FY2026 budgets updated across 3 cost centres.</div>
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/finance/budgets">Back to setup</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard/finance/budgets/variance">View variance →</Link>
            </Button>
          </div>
        </Card>
      )}
    </PageShell>
  );
}
