'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield, TrendingUp, Package, ShoppingCart, Factory, UtensilsCrossed,
  Heart, Wallet, Users, FileText, Settings, Check, User, Lock,
  Info, Linkedin, Twitter, Github, Phone, Mail, Zap, BarChart3,
  ArrowRight, Eye, Target, MessageSquare, DollarSign, Globe
} from "lucide-react";

// ─── Module Data ──────────────────────────────────────────────────────────────

const modules = [
  {
    icon: Package,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    title: "Smart Inventory",
    desc: "Complete warehouse management with batch tracking and FEFO (First Expired, First Out) logic.",
    features: ["Multi-warehouse Support", "Stock Audit & Variances", "Low Stock Alerts"],
  },
  {
    icon: ShoppingCart,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Advanced Procurement",
    desc: "Streamlined purchasing workflow from Requisition (PR) to Goods Receipt (GRN).",
    features: ["Approval Workflows", "Supplier Management", "Purchase Returns"],
  },
  {
    icon: Factory,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    title: "Production & BOM",
    desc: "Detailed recipe management and Bill of Materials for accurate cost calculation.",
    features: ["Yield Management", "Work Order Planning", "Raw Material Consumption"],
  },
  {
    icon: UtensilsCrossed,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "Restaurant POS & Operations",
    desc: "Real-time sales, kitchen display, and loyalty cards for dine-in, takeaway, and delivery.",
    features: ["KOT & Kitchen Display", "Loyalty Cards (Silver/Gold)", "Table Management"],
  },
  {
    icon: Heart,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    title: "Donation & Welfare",
    desc: "Cash and in-kind donation management with Qurbani booking and transparent donor reporting.",
    features: ["Donor History & Receipts", "Qurbani Allocation", "In-Kind Tracking"],
  },
  {
    icon: Wallet,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    title: "Integrated Finance",
    desc: "Real-time General Ledger integration for accurate financial position monitoring.",
    features: ["Chart of Accounts", "AP / AR Aging", "Profit & Loss Reports"],
  },
  {
    icon: Users,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    title: "HR & Staff Management",
    desc: "Staff lifecycle management from appointment to payroll, attendance, and performance.",
    features: ["Biometric Attendance", "Leave Management", "KPI Evaluations"],
  },
  {
    icon: FileText,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "Sales & Invoicing",
    desc: "Manage customer orders, deliveries, and tax-compliant invoicing efficiently.",
    features: ["Sales Quotations", "Delivery Challans", "Sales Returns"],
  },
  {
    icon: Settings,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    title: "System Control",
    desc: "Robust administrative tools for user management, roles, and system integrity.",
    features: ["Dynamic RBAC", "Audit Trails", "Data Import Utility"],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => router.push('/dashboard'), 600);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center shrink-0">
              <span className="text-white font-extrabold text-lg">R</span>
            </div>
            <span className="font-bold text-lg text-gray-900">Rahah24 ERP</span>
          </div>
          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#modules" className="hover:text-teal-600 transition-colors">Platform</a>
            <a href="#how" className="hover:text-teal-600 transition-colors">How it Works</a>
            <a href="#modules" className="hover:text-teal-600 transition-colors">Solutions</a>
          </nav>
          {/* CTA */}
          <button
            onClick={() => document.getElementById('login-card')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold transition-colors"
          >
            Client Portal
          </button>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-20 lg:py-28" id="how">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — Headline */}
          <div className="space-y-8">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 border border-teal-300 text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-full bg-teal-50">
              <Zap className="h-3.5 w-3.5" />
              Enterprise Version 9.0 Live
            </span>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              Unified Control for<br />
              <span className="text-teal-600">Intelligent Operations</span>
            </h1>

            <p className="text-lg text-gray-500 max-w-md leading-relaxed">
              Rahah24 integrates advanced inventory forecasting, procurement automation, restaurant POS,
              donation management, and financial reporting into a single, secure cloud platform.
            </p>

            {/* Mini feature cards */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Shield,    label: "Enterprise Grade",  sub: "RBAC Security" },
                { icon: TrendingUp,label: "Real-time Data",    sub: "Instant Analytics" },
                { icon: BarChart3, label: "AI Insights",       sub: "Smart Forecasting" },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                  <f.icon className="h-5 w-5 text-teal-600 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{f.label}</p>
                    <p className="text-xs text-gray-500">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 pt-2">
              {[
                { n: "9+",    l: "Integrated Modules" },
                { n: "500+",  l: "Active Users" },
                { n: "99.9%", l: "Uptime SLA" },
                { n: "24/7",  l: "Support" },
              ].map(s => (
                <div key={s.l}>
                  <p className="text-2xl font-extrabold text-teal-600">{s.n}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Login Card */}
          <div id="login-card">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 max-w-sm mx-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Sign In</h2>
              <p className="text-sm text-gray-500 mb-6">Secure access for authorized personnel only.</p>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Username */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Username / Email"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  {isLoading ? 'Signing in...' : 'Access Dashboard'}
                </button>
              </form>

              {/* Demo hint */}
              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <Info className="h-3.5 w-3.5" />
                <span>Demo: <strong className="text-gray-600">admin</strong> / <strong className="text-gray-600">123</strong></span>
              </div>

              {/* Quick login chips */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[11px] text-gray-400 mb-2 text-center">Quick demo access</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    { label: "Admin",    email: "admin@rahah24.com",    pass: "Admin123" },
                    { label: "Manager",  email: "manager@rahah24.com",  pass: "Manager123" },
                    { label: "Finance",  email: "finance@rahah24.com",  pass: "Finance123" },
                  ].map(u => (
                    <button key={u.label}
                      onClick={() => { setUsername(u.email); setPassword(u.pass); }}
                      className="text-[11px] px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-600 transition-colors">
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modules Suite ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-white" id="modules">
        <div className="max-w-7xl mx-auto px-6">
          {/* Heading */}
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">System Capabilities</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">Complete Modules Suite</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base">
              A fully integrated ecosystem designed to handle every aspect of your business — from procurement to profitability, donations to distribution.
            </p>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map(m => (
              <div key={m.title}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-teal-200 transition-all duration-200 group">
                <div className={`w-12 h-12 rounded-xl ${m.iconBg} flex items-center justify-center mb-4`}>
                  <m.icon className={`h-6 w-6 ${m.iconColor}`} />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{m.title}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{m.desc}</p>
                <ul className="space-y-1.5">
                  {m.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="h-4 w-4 text-teal-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Rahah24 ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2">Why Choose Us</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Built for Jamia Binoria & Beyond</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Shield,    title: "100% Secure",          desc: "End-to-end encryption and zero-trust access control" },
              { icon: Zap,       title: "AI-Powered",           desc: "Predictive forecasting and smart alerts built-in" },
              { icon: Users,     title: "Multi-Role Access",    desc: "9 user roles with granular permission matrices" },
              { icon: BarChart3, title: "Comprehensive Reports",desc: "16+ report types across all modules" },
            ].map(f => (
              <div key={f.title} className="bg-white border border-gray-200 rounded-2xl p-5 text-center hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mx-auto mb-3">
                  <f.icon className="h-5 w-5 text-teal-600" />
                </div>
                <h4 className="font-bold text-sm text-gray-900 mb-1">{f.title}</h4>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vision & Mission ───────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-full bg-white mb-4">
              <Target className="h-3.5 w-3.5" /> Our Purpose
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">Vision &amp; Mission of RAHAH24</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Vision */}
            <div className="bg-white border border-teal-100 rounded-2xl p-8 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Vision Statement</h3>
              </div>
              <p className="text-gray-500 leading-relaxed text-sm">
                To become the leading AI-enabled digital ecosystem that empowers organizations in welfare, education,
                financial, and food/business related sectors to operate with <strong className="text-gray-700">transparency, efficiency, and ease</strong> —
                eliminating manual workload, reducing errors, and driving smart, data-backed decisions.
              </p>
            </div>
            {/* Mission */}
            <div className="bg-white border border-teal-100 rounded-2xl p-8 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                  <Target className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Mission Statement</h3>
              </div>
              <p className="text-gray-500 leading-relaxed text-sm">
                RAHAH24 aims to deliver a <strong className="text-gray-700">unified, secure, and scalable management platform</strong> that
                streamlines financial, operational, and administrative workflows — providing intelligent AI insights and alerts,
                supporting restaurants, welfare, education, and financial sectors, and ensuring real-time data integrity
                for informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-50 mb-4">
              <DollarSign className="h-3.5 w-3.5" /> Pricing Information
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">Flexible Solutions Tailored to Your Needs</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              Every business is unique. Our pricing is customized based on your specific requirements, scale, and modules needed.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-10">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-7 w-7 text-teal-600" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Get a Personalized Quote</h3>
              <p className="text-gray-500 text-sm">Contact our sales team to discuss your requirements and receive a custom pricing proposal tailored to your organization.</p>
            </div>

            {/* Contact box */}
            <div className="bg-teal-50 rounded-xl p-6 text-center mb-8">
              <p className="text-teal-700 font-bold mb-1">Contact Sales</p>
              <p className="text-gray-500 text-sm mb-4">For pricing information, please contact us at:</p>
              <a href="mailto:sales@rahah24.com"
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors">
                <MessageSquare className="h-4 w-4" /> sales@rahah24.com
              </a>
              <p className="text-xs text-gray-400 mt-3">Our team typically responds within 24 hours</p>
            </div>

            {/* Three features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Custom Modules",   sub: "Choose only what you need" },
                { label: "Flexible Scaling", sub: "Grow at your own pace" },
                { label: "Transparent Costs",sub: "No hidden fees" },
              ].map(f => (
                <div key={f.label} className="text-center">
                  <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Check className="h-4 w-4 text-teal-600" />
                  </div>
                  <p className="text-xs font-bold text-gray-900">{f.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-400 mb-4">Interested in learning more about our solutions?</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => document.getElementById('login-card')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                <Globe className="h-4 w-4" /> Try Demo Version
              </button>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                <MessageSquare className="h-4 w-4" /> Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
            Ready to optimize your operations?
          </h2>
          <p className="text-gray-400 mb-8 text-base">
            Join over 500+ locations using Rahah24 to drive efficiency and growth.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 rounded-lg border border-white text-white text-sm font-semibold hover:bg-white hover:text-gray-900 transition-colors">
              Schedule Demo
            </button>
            <button
              onClick={() => document.getElementById('login-card')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors flex items-center gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                  <span className="text-white font-extrabold text-sm">R</span>
                </div>
                <span className="font-bold text-white">Rahah24 ERP</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                The comprehensive enterprise resource planning solution designed for modern hospitality, welfare, and retail businesses.
              </p>
              <div className="flex gap-3">
                {[Linkedin, Twitter, Github].map((Icon, i) => (
                  <div key={i} className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                    <Icon className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2.5">
                {["Inventory Management", "Procurement", "Restaurant POS", "Financials", "Donations & Welfare", "Security (RBAC)"].map(l => (
                  <li key={l}><a href="#" className="text-sm text-gray-400 hover:text-teal-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2.5">
                {["About Us", "Case Studies", "Careers", "Contact"].map(l => (
                  <li key={l}><a href="#" className="text-sm text-gray-400 hover:text-teal-400 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-gray-400"><Mail className="h-4 w-4 text-teal-500" /> enterprise@rahah24.com</li>
                <li className="flex items-center gap-2 text-sm text-gray-400"><Phone className="h-4 w-4 text-teal-500" /> +92 (21) 111-RAHAH</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
            © 2026 Rahah24 ERP Systems. All rights reserved. · Privacy Policy · Terms of Service
          </div>
        </div>
      </footer>

    </div>
  );
}
