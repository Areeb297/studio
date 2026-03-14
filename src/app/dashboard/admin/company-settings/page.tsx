'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Building2, MapPin, Phone, Mail, Globe, Calendar, DollarSign,
  Settings2, Save, CheckCircle2, AlertTriangle, Plus, Edit2, ChevronRight,
  Banknote, FileText, Printer, Clock, Languages
} from "lucide-react";

const companies = [
  {
    id: 1,
    code: 'JBA-MAIN',
    name: 'Jamia Binoria Aalamia',
    nameUrdu: 'جامعہ بنوریہ عالمیہ',
    type: 'Main Entity',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    status: 'Active',
    address: 'S.I.T.E., Karachi, Pakistan',
    phone: '+92-21-32571111',
    email: 'info@binoria.org',
    website: 'www.binoria.org',
    taxNumber: '7654321-8',
    ntn: 'NTN-0012345-6',
    currency: 'PKR',
    fiscalStart: 'July',
    fiscalEnd: 'June',
    timezone: 'Asia/Karachi (PKT +5:00)',
    logo: 'JB',
    color: 'bg-blue-600',
  },
  {
    id: 2,
    code: 'JBA-REST',
    name: 'Rahah24 Restaurant',
    nameUrdu: 'راحہ ریسٹورنٹ',
    type: 'Business Unit',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
    status: 'Active',
    address: 'Karachi, Pakistan',
    phone: '+92-21-32571222',
    email: 'restaurant@binoria.org',
    website: '—',
    taxNumber: '7654321-8',
    ntn: 'NTN-0012345-6',
    currency: 'PKR',
    fiscalStart: 'July',
    fiscalEnd: 'June',
    timezone: 'Asia/Karachi (PKT +5:00)',
    logo: 'R',
    color: 'bg-orange-500',
  },
  {
    id: 3,
    code: 'JBA-GYM',
    name: 'Gym Time Fitness',
    nameUrdu: 'جم ٹائم فٹنس',
    type: 'Business Unit',
    badge: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
    status: 'Active',
    address: 'Karachi, Pakistan',
    phone: '+92-21-32571333',
    email: 'gym@binoria.org',
    website: '—',
    taxNumber: '7654321-8',
    ntn: 'NTN-0012345-6',
    currency: 'PKR',
    fiscalStart: 'July',
    fiscalEnd: 'June',
    timezone: 'Asia/Karachi (PKT +5:00)',
    logo: 'G',
    color: 'bg-green-600',
  },
  {
    id: 4,
    code: 'JBA-LAWN',
    name: 'Shadi Lawn Events',
    nameUrdu: 'شادی لان ایونٹس',
    type: 'Business Unit',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
    status: 'Active',
    address: 'Karachi, Pakistan',
    phone: '+92-21-32571444',
    email: 'events@binoria.org',
    website: '—',
    taxNumber: '7654321-8',
    ntn: 'NTN-0012345-6',
    currency: 'PKR',
    fiscalStart: 'July',
    fiscalEnd: 'June',
    timezone: 'Asia/Karachi (PKT +5:00)',
    logo: 'SL',
    color: 'bg-purple-500',
  },
  {
    id: 5,
    code: 'JBA-ACM',
    name: 'Madrasa Academic',
    nameUrdu: 'مدرسہ تعلیمی',
    type: 'Business Unit',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
    status: 'Active',
    address: 'Karachi, Pakistan',
    phone: '+92-21-32571555',
    email: 'academic@binoria.org',
    website: '—',
    taxNumber: '7654321-8',
    ntn: 'NTN-0012345-6',
    currency: 'PKR',
    fiscalStart: 'July',
    fiscalEnd: 'June',
    timezone: 'Asia/Karachi (PKT +5:00)',
    logo: 'MA',
    color: 'bg-teal-600',
  },
];

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function CompanySettingsPage() {
  const [selectedId, setSelectedId] = useState(1);
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const company = companies.find(c => c.id === selectedId)!;

  const handleSave = () => {
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />Company Settings
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Configure company profile, fiscal year, currency, and multi-entity setup
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />Saved
            </span>
          )}
          {editMode ? (
            <>
              <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => setEditMode(false)}>Cancel</Button>
              <Button size="sm" className="text-xs gap-1 h-8" onClick={handleSave}>
                <Save className="h-3 w-3" />Save Changes
              </Button>
            </>
          ) : (
            <Button size="sm" className="text-xs gap-1 h-8" onClick={() => setEditMode(true)}>
              <Edit2 className="h-3 w-3" />Edit
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">

        {/* ── Entity List ── */}
        <div className="col-span-12 md:col-span-3 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Entities</p>
            <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 text-primary">
              <Plus className="h-3 w-3" />Add
            </Button>
          </div>
          {companies.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors border ${
                selectedId === c.id
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-transparent hover:bg-muted/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 ${c.color}`}>
                {c.logo}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">{c.code}</p>
              </div>
              {selectedId === c.id && <ChevronRight className="h-3 w-3 text-primary ml-auto shrink-0" />}
            </button>
          ))}

          <div className="pt-3 border-t">
            <div className="rounded-lg bg-muted/40 px-3 py-2.5 space-y-1.5 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Multi-Entity</p>
              <p>All entities share a <span className="text-primary font-medium">single database</span> with entity-level segregation.</p>
              <p>Transactions are tagged by entity code for consolidated reporting.</p>
            </div>
          </div>
        </div>

        {/* ── Detail Panel ── */}
        <div className="col-span-12 md:col-span-9">
          <Tabs defaultValue="general">
            <TabsList className="h-8 text-xs">
              <TabsTrigger value="general" className="text-xs h-7">General</TabsTrigger>
              <TabsTrigger value="fiscal" className="text-xs h-7">Fiscal & Currency</TabsTrigger>
              <TabsTrigger value="print" className="text-xs h-7">Print & Documents</TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs h-7">Advanced</TabsTrigger>
            </TabsList>

            {/* ── GENERAL ── */}
            <TabsContent value="general" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-base font-bold ${company.color}`}>
                      {company.logo}
                    </div>
                    <div>
                      <CardTitle className="text-sm">{company.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${company.badge}`}>{company.type}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300">Active</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{company.code}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Company Name (English)</Label>
                      <Input defaultValue={company.name} disabled={!editMode} className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Company Name (Urdu)</Label>
                      <Input defaultValue={company.nameUrdu} disabled={!editMode} className="h-8 text-xs" dir="rtl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Company Code</Label>
                      <Input defaultValue={company.code} disabled={!editMode} className="h-8 text-xs font-mono" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Entity Type</Label>
                      <Select defaultValue={company.type} disabled={!editMode}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Main Entity" className="text-xs">Main Entity</SelectItem>
                          <SelectItem value="Business Unit" className="text-xs">Business Unit</SelectItem>
                          <SelectItem value="Branch" className="text-xs">Branch</SelectItem>
                          <SelectItem value="Project" className="text-xs">Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <p className="text-xs font-semibold">Contact & Address</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-2">
                      <Label className="text-xs flex items-center gap-1"><MapPin className="h-3 w-3" />Address</Label>
                      <Input defaultValue={company.address} disabled={!editMode} className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs flex items-center gap-1"><Phone className="h-3 w-3" />Phone</Label>
                      <Input defaultValue={company.phone} disabled={!editMode} className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs flex items-center gap-1"><Mail className="h-3 w-3" />Email</Label>
                      <Input defaultValue={company.email} disabled={!editMode} className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs flex items-center gap-1"><Globe className="h-3 w-3" />Website</Label>
                      <Input defaultValue={company.website} disabled={!editMode} className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs flex items-center gap-1"><FileText className="h-3 w-3" />NTN Number</Label>
                      <Input defaultValue={company.ntn} disabled={!editMode} className="h-8 text-xs font-mono" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs flex items-center gap-1"><FileText className="h-3 w-3" />Sales Tax Reg. No.</Label>
                      <Input defaultValue={company.taxNumber} disabled={!editMode} className="h-8 text-xs font-mono" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── FISCAL & CURRENCY ── */}
            <TabsContent value="fiscal" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />Fiscal Year
                  </CardTitle>
                  <CardDescription className="text-xs">Define the financial year start and end for {company.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Fiscal Year Start</Label>
                      <Select defaultValue={company.fiscalStart} disabled={!editMode}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {months.map(m => <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Fiscal Year End</Label>
                      <Select defaultValue={company.fiscalEnd} disabled={!editMode}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {months.map(m => <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Current Period</Label>
                      <Input defaultValue="Jul 2025 – Jun 2026" disabled className="h-8 text-xs bg-muted/30" />
                    </div>
                  </div>

                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 px-3 py-2.5 text-xs text-blue-800 dark:text-blue-300">
                    <p className="font-medium mb-0.5">Current Fiscal Year</p>
                    <p>July 1, 2025 → June 30, 2026 · Period 9 of 12 active</p>
                  </div>

                  <Separator />

                  <p className="text-xs font-semibold flex items-center gap-1.5"><Banknote className="h-3.5 w-3.5 text-primary" />Currency Settings</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Base Currency</Label>
                      <Select defaultValue="PKR" disabled={!editMode}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PKR" className="text-xs">PKR — Pakistani Rupee</SelectItem>
                          <SelectItem value="USD" className="text-xs">USD — US Dollar</SelectItem>
                          <SelectItem value="AED" className="text-xs">AED — UAE Dirham</SelectItem>
                          <SelectItem value="SAR" className="text-xs">SAR — Saudi Riyal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Currency Symbol</Label>
                      <Input defaultValue="Rs." disabled={!editMode} className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Number Format</Label>
                      <Select defaultValue="pk" disabled={!editMode}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pk" className="text-xs">1,00,000.00 (Pakistan)</SelectItem>
                          <SelectItem value="intl" className="text-xs">100,000.00 (International)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Decimal Places</Label>
                      <Select defaultValue="2" disabled={!editMode}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0" className="text-xs">0 — No decimals</SelectItem>
                          <SelectItem value="2" className="text-xs">2 — Standard (Rs. 100.00)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />Locale & Timezone
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs flex items-center gap-1"><Clock className="h-3 w-3" />Timezone</Label>
                      <Select defaultValue="pkt" disabled={!editMode}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pkt" className="text-xs">Asia/Karachi (PKT +05:00)</SelectItem>
                          <SelectItem value="gmt" className="text-xs">UTC (GMT +00:00)</SelectItem>
                          <SelectItem value="ist" className="text-xs">Asia/Kolkata (IST +05:30)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs flex items-center gap-1"><Languages className="h-3 w-3" />Default Language</Label>
                      <Select defaultValue="en" disabled={!editMode}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en" className="text-xs">English</SelectItem>
                          <SelectItem value="ur" className="text-xs">اردو (Urdu)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Date Format</Label>
                      <Select defaultValue="dmy" disabled={!editMode}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dmy" className="text-xs">DD/MM/YYYY</SelectItem>
                          <SelectItem value="mdy" className="text-xs">MM/DD/YYYY</SelectItem>
                          <SelectItem value="ymd" className="text-xs">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Calendar Type</Label>
                      <Select defaultValue="gregorian" disabled={!editMode}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gregorian" className="text-xs">Gregorian</SelectItem>
                          <SelectItem value="hijri" className="text-xs">Hijri (Islamic)</SelectItem>
                          <SelectItem value="both" className="text-xs">Both (dual display)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── PRINT & DOCUMENTS ── */}
            <TabsContent value="print" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Printer className="h-4 w-4 text-primary" />Document Printing
                  </CardTitle>
                  <CardDescription className="text-xs">Configure header, footer, and auto-print settings for all document types</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Print company logo on documents', defaultOn: true },
                    { label: 'Print company address on header', defaultOn: true },
                    { label: 'Print NTN / Sales Tax number', defaultOn: true },
                    { label: 'Show "Original / Duplicate / Triplicate" on GRN', defaultOn: true },
                    { label: 'Auto-print GRN on approval', defaultOn: false },
                    { label: 'Auto-print PO on approval', defaultOn: false },
                    { label: 'Print Urdu name alongside English', defaultOn: true },
                    { label: 'Include QR code on invoices', defaultOn: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Label className="text-xs cursor-pointer">{item.label}</Label>
                      <Switch defaultChecked={item.defaultOn} disabled={!editMode} />
                    </div>
                  ))}

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Document Header Text</Label>
                      <Input defaultValue="Jamia Binoria Aalamia — Official Document" disabled={!editMode} className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Document Footer Text</Label>
                      <Input defaultValue="This is a computer-generated document" disabled={!editMode} className="h-8 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">PO Number Prefix</Label>
                      <Input defaultValue="PO-JBA-" disabled={!editMode} className="h-8 text-xs font-mono" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">GRN Number Prefix</Label>
                      <Input defaultValue="GRN-JBA-" disabled={!editMode} className="h-8 text-xs font-mono" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── ADVANCED ── */}
            <TabsContent value="advanced" className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-primary" />Advanced Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Allow inter-company transactions', desc: 'Transfer stock between entities', defaultOn: true },
                    { label: 'Consolidated financial reports', desc: 'Merge all entities in group reports', defaultOn: true },
                    { label: 'Enforce entity-level user restrictions', desc: 'Users can only see their entity data', defaultOn: false },
                    { label: 'Entity-level cost centers', desc: 'Separate cost center trees per entity', defaultOn: false },
                    { label: 'Shared vendor master', desc: 'Vendors available to all entities', defaultOn: true },
                    { label: 'Shared item master', desc: 'Items and UoMs shared across entities', defaultOn: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border px-3 py-2.5">
                      <div>
                        <Label className="text-xs font-medium cursor-pointer">{item.label}</Label>
                        <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch defaultChecked={item.defaultOn} disabled={!editMode} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 px-4 py-3">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <div className="text-xs text-red-800 dark:text-red-300">
                  <p className="font-medium mb-0.5">Danger Zone</p>
                  <p>Changing fiscal year settings after transactions have been posted will require re-running period close. Contact your system administrator before making changes.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
