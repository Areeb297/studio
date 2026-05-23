'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield, TrendingUp, Package, ShoppingCart, Factory, UtensilsCrossed,
  Heart, Wallet, FileText, Settings, Check, User, Lock,
  Eye, EyeOff, Linkedin, Twitter, Github, ArrowRight, Sparkles,
  Activity, Layers, Banknote, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const modules = [
  { icon: Wallet,           bg: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',          title: 'Integrated Finance',  desc: 'Chart of Accounts · AR / AP · Bank reconciliation · Trial Balance · P&L · Cash Flow.', tag: 'New in v8.0' },
  { icon: Heart,            bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',          title: 'Donations',           desc: 'Donor registry, Zakat / Sadqah / Mosque funds, pledges, statutory registers, donor statements.' },
  { icon: Package,          bg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',          title: 'Smart Inventory',     desc: 'Multi-warehouse, batch tracking, FEFO, low-stock alerts.' },
  { icon: ShoppingCart,     bg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',  title: 'Advanced Procurement', desc: 'PR → PO → GRN with three-level approvals and supplier management.' },
  { icon: Factory,          bg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',      title: 'Production & BOM',    desc: 'Recipe management, BOM costing, work-order planning, yield management.' },
  { icon: UtensilsCrossed,  bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300', title: 'Restaurant POS',   desc: 'Real-time orders, kitchen display, loyalty cards, dine-in / takeaway / delivery.' },
];

const processSteps = [
  { icon: ShoppingCart, num: 1, title: 'Procure',  desc: 'Requisitions and POs to stock up materials.' },
  { icon: Factory,      num: 2, title: 'Process',  desc: 'Convert raw materials to finished goods.' },
  { icon: UtensilsCrossed, num: 3, title: 'Sell',  desc: 'Fulfil orders and generate tax-compliant invoices.' },
  { icon: TrendingUp,   num: 4, title: 'Report',   desc: 'Real-time financial statements and analytics.' },
];

export default function LoginLandingPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin@rahah24.com');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push('/portal'), 700);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link href="#" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-teal-600 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-primary/20">R</div>
            <span className="font-bold text-base tracking-tight">Rahah24 ERP</span>
          </Link>
          <div className="hidden lg:flex items-center gap-2 text-sm">
            <Link href="#features"  className="px-3 py-1.5 rounded-md font-semibold text-slate-700 dark:text-slate-300 hover:text-primary">Platform</Link>
            <Link href="#process"   className="px-3 py-1.5 rounded-md font-semibold text-slate-700 dark:text-slate-300 hover:text-primary">How it works</Link>
            <Link href="#solutions" className="px-3 py-1.5 rounded-md font-semibold text-slate-700 dark:text-slate-300 hover:text-primary">Solutions</Link>
          </div>
          <Link href="#login">
            <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">Client Portal</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section id="login" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
        {/* radial glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-3xl" />
        </div>
        {/* dot grid */}
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero copy */}
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                  <span className="relative rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Enterprise v8.0 · Live
              </span>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
                Unified control for{' '}
                <span className="bg-gradient-to-r from-primary via-teal-500 to-teal-400 bg-clip-text text-transparent">
                  intelligent operations
                </span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
                Rahah24 integrates advanced inventory, procurement, financial reporting, and donations
                into a single, secure cloud platform — built for Pakistani enterprises and charitable trusts.
              </p>

              {/* Trust stats — photo style cards */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Shield,    title: 'Enterprise Grade', sub: 'RBAC + Account Security' },
                  { icon: Activity,  title: 'Real-time Data',   sub: 'Instant analytics' },
                  { icon: Layers,    title: '78 Modules',       sub: 'Across 11 sub-systems' },
                ].map(s => (
                  <div key={s.title} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 hover:-translate-y-0.5 hover:border-primary/30 transition-all shadow-sm">
                    <span className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <s.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-bold text-sm">{s.title}</div>
                      <div className="text-xs text-muted-foreground">{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Login card */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* gradient top stripe */}
                <div className="absolute -top-px inset-x-6 h-1 bg-gradient-to-r from-primary via-teal-400 to-emerald-300 rounded-full" />

                <div className="bg-card border border-border rounded-2xl shadow-xl shadow-primary/5 p-8 relative overflow-hidden">
                  {/* corner blob */}
                  <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/8 blur-3xl pointer-events-none" />

                  <div className="relative">
                    {/* Brand + secure pill */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-teal-600 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-primary/25">R</div>
                        <div>
                          <div className="font-bold text-base">Rahah24 ERP</div>
                          <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-muted-foreground">Enterprise Portal</div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900">
                        <Shield className="h-3 w-3" /> Encrypted
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
                    <p className="text-sm text-muted-foreground mb-6">Sign in to access your operations workspace.</p>

                    <form onSubmit={submit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Username or email</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin@rahah24.com"
                            className="pl-10 h-12 text-sm font-medium"
                            autoComplete="username"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={show ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="pl-10 pr-10 h-12 text-sm font-medium"
                            autoComplete="current-password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShow(s => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                          >
                            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                          <span className="text-muted-foreground text-xs">Remember username</span>
                        </label>
                        <Link href="#" className="text-primary font-semibold text-xs hover:underline">
                          Forgot password?
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-gradient-to-r from-primary to-teal-600 hover:from-teal-700 hover:to-primary text-white shadow-lg shadow-primary/25 font-semibold text-sm"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 rounded-full border-2 border-white/50 border-t-white animate-spin" />
                            Signing in…
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Sign in securely
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        )}
                      </Button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-center gap-4 text-[11px] font-semibold text-muted-foreground">
                      <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-primary" /> SSL</span>
                      <span className="text-border">·</span>
                      <span className="flex items-center gap-1"><FileText className="h-3 w-3 text-primary" /> Audit logged</span>
                      <span className="text-border">·</span>
                      <span className="flex items-center gap-1"><Check className="h-3 w-3 text-primary" /> RBAC</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics strip */}
      <section className="relative py-14 bg-gradient-to-br from-primary to-teal-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-1/3 w-96 h-96 rounded-full bg-teal-400 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-emerald-400 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { num: '500+',  label: 'Locations' },
              { num: '99.9%', label: 'Uptime SLA' },
              { num: '24×7',  label: 'Support' },
              { num: '8.0',   label: 'Latest release' },
            ].map(m => (
              <div key={m.label}>
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-br from-white to-teal-200 bg-clip-text text-transparent tracking-tight">
                  {m.num}
                </div>
                <div className="text-xs uppercase tracking-[0.12em] font-semibold text-white/70 mt-1">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules grid */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="eyebrow">System capabilities</span>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mt-3 mb-4">Complete modules suite</h2>
            <p className="text-muted-foreground">
              A fully integrated ecosystem — every aspect of your business from procurement to profitability,
              with a finance module finally able to close the books in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map(m => (
              <Link href={m.title === 'Integrated Finance' ? '/dashboard/finance' : '#'} key={m.title}>
                <div className="group bg-card border border-border rounded-2xl p-6 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 transition-all relative overflow-hidden cursor-pointer h-full">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start justify-between mb-4">
                    <span className={cn('h-12 w-12 rounded-xl flex items-center justify-center', m.bg)}>
                      <m.icon className="h-5 w-5" />
                    </span>
                    <span className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{m.title}</h3>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                  {m.tag && (
                    <span className="inline-flex items-center gap-1 mt-4 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                      <Sparkles className="h-3 w-3" /> {m.tag}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow">How it works</span>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mt-3">Seamless workflow</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((s, i) => (
              <div key={s.num} className="text-center relative">
                <div className="relative inline-flex">
                  <span className="h-16 w-16 rounded-2xl bg-gradient-to-br from-white to-teal-50 dark:from-teal-950 dark:to-slate-900 border-2 border-teal-300/40 text-primary flex items-center justify-center shadow-lg shadow-primary/10">
                    <s.icon className="h-7 w-7" />
                  </span>
                  <span className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center border-2 border-background">
                    {s.num}
                  </span>
                </div>
                <h4 className="font-bold mt-4 mb-1">{s.title}</h4>
                <p className="text-xs text-muted-foreground max-w-[180px] mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="solutions" className="py-20 relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-teal-500 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-amber-500 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 text-center relative">
          <span className="inline-flex items-center gap-2 bg-white/10 text-teal-200 border border-white/20 text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full mb-6">
            <Sparkles className="h-3 w-3" /> Get started today
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Ready to optimise your{' '}
            <span className="bg-gradient-to-r from-teal-300 to-emerald-200 bg-clip-text text-transparent">operations?</span>
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Join 500+ locations using Rahah24 to drive efficiency, close their books with confidence, and accelerate growth.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="#login">
              <Button size="lg" className="bg-gradient-to-r from-teal-500 to-primary hover:from-primary hover:to-teal-700 shadow-lg shadow-primary/40">
                Sign in to portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
              Schedule a demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 py-12 border-t border-white/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-teal-600 text-white font-bold text-lg flex items-center justify-center">R</div>
                <span className="font-bold text-base text-white">Rahah24 ERP</span>
              </div>
              <p className="text-xs text-slate-400 max-w-xs">
                The comprehensive ERP solution for modern hospitality, retail, and charitable operations in Pakistan.
              </p>
              <div className="flex gap-3 mt-4">
                <Link href="#" className="text-slate-400 hover:text-white"><Linkedin className="h-4 w-4" /></Link>
                <Link href="#" className="text-slate-400 hover:text-white"><Twitter className="h-4 w-4" /></Link>
                <Link href="#" className="text-slate-400 hover:text-white"><Github className="h-4 w-4" /></Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-3">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="#" className="hover:text-white">Inventory</Link></li>
                <li><Link href="#" className="hover:text-white">Procurement</Link></li>
                <li><Link href="/dashboard/finance" className="hover:text-white">Finance</Link></li>
                <li><Link href="/dashboard/finance/donations/collect" className="hover:text-white">Donations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Careers</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-3">Contact</h4>
              <p className="text-xs text-slate-400">enterprise@rahah24.com</p>
              <p className="text-xs text-slate-400 mt-1">+92 21 35555 0199</p>
              <p className="text-xs text-slate-400 mt-2">Korangi, Karachi, Pakistan</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-xs text-slate-500">
            © 2026 Rahah24 ERP. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
