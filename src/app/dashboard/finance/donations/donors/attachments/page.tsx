'use client';

import { Upload, FileText, Image, Eye, Download, Paperclip } from 'lucide-react';
import { PageShell } from '@/components/finance/page-shell';
import { KpiCard } from '@/components/finance/kpi-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { donors } from '@/lib/finance/donations-data';

const attachments = donors.flatMap((d, idx) => [
  { donor: d.name, code: d.code, type: 'CNIC scan',     filename: `${d.code}_cnic.jpg`,    size: '420 KB', uploaded: '2025-09-12' },
  ...(idx % 3 === 0 ? [{ donor: d.name, code: d.code, type: 'Photo',         filename: `${d.code}_photo.jpg`,   size: '215 KB', uploaded: '2025-09-15' }] : []),
  ...(idx % 4 === 0 ? [{ donor: d.name, code: d.code, type: 'Pledge letter', filename: `${d.code}_pledge.pdf`,  size: '188 KB', uploaded: '2025-10-01' }] : []),
]);

const typeIcon: Record<string, any> = { 'CNIC scan': Image, 'Photo': Image, 'Pledge letter': FileText };

export default function DonorAttachmentsPage() {
  const photos = attachments.filter(a => a.type === 'Photo').length;
  const cnics  = attachments.filter(a => a.type === 'CNIC scan').length;
  const docs   = attachments.filter(a => a.type === 'Pledge letter').length;

  return (
    <PageShell
      eyebrow="Donations · Cross-donor"
      title="Donor Attachments"
      description="All files uploaded across donor profiles — CNIC scans, photos, pledge letters, supporting documents."
      breadcrumb={[
        { label: 'Donations' },
        { label: 'Donors', href: '/dashboard/finance/donations/donors' },
        { label: 'Attachments' },
      ]}
      actions={<Button size="sm"><Upload className="mr-1.5 h-3.5 w-3.5" /> Upload</Button>}
      kpis={
        <>
          <KpiCard label="Total files" value={attachments.length} tone="info" icon={Paperclip} />
          <KpiCard label="CNIC scans"  value={cnics}                tone="accent" icon={Image} />
          <KpiCard label="Photos"      value={photos}               tone="success" icon={Image} />
          <KpiCard label="Documents"   value={docs}                  tone="warning" icon={FileText} />
        </>
      }
    >
      <Card className="p-4">
        <div className="mb-4">
          <Input placeholder="Search donor or filename…" />
        </div>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[40px]" />
                <TableHead>Donor</TableHead>
                <TableHead className="w-[140px]">Type</TableHead>
                <TableHead>Filename</TableHead>
                <TableHead className="w-[100px]">Size</TableHead>
                <TableHead className="w-[120px]">Uploaded</TableHead>
                <TableHead className="w-[100px] text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {attachments.slice(0, 24).map((a, i) => {
                const Icon = typeIcon[a.type] ?? FileText;
                return (
                  <TableRow key={i} className="hover:bg-primary/5">
                    <TableCell><span className="flex h-7 w-7 items-center justify-center rounded bg-muted text-muted-foreground"><Icon className="h-3.5 w-3.5" /></span></TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{a.donor}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{a.code}</div>
                    </TableCell>
                    <TableCell><span className="text-xs font-medium">{a.type}</span></TableCell>
                    <TableCell className="font-mono text-xs">{a.filename}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{a.size}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{a.uploaded}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
