'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, AlertTriangle, TrendingDown, Package, ArrowRight, Info, Calculator, PlusCircle, Download } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart, BarChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Cell,
} from 'recharts';

const tooltipStyle = { backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' };

// ── Reconciliation: Actual vs Theoretical per dept ────────────────────────────
const reconciliationData = [
  { dept: 'Chinese', issued: 82000,  theoretical: 65000,  variance: 17000 },
  { dept: 'Desi',    issued: 74000,  theoretical: 63000,  variance: 11000 },
  { dept: 'BBQ',     issued: 58000,  theoretical: 51000,  variance: 7000  },
  { dept: 'Rest.Store', issued: 40000, theoretical: 37000, variance: 3000 },
  { dept: 'Kitchen', issued: 30000,  theoretical: 20000,  variance: 10000 },
];

// ── Food Cost % per recipe ────────────────────────────────────────────────────
const recipeFoodCost = [
  { name: 'Haleem (1KG)',    foodCostPct: 42, stdCost: 665,  selling: 1580, portions: 5, status: 'critical' },
  { name: 'Nihari (1KG)',    foodCostPct: 38, stdCost: 730,  selling: 1920, portions: 4, status: 'warning'  },
  { name: 'Desi Karahi',     foodCostPct: 36, stdCost: 570,  selling: 1580, portions: 3, status: 'warning'  },
  { name: 'Manchurian',      foodCostPct: 35, stdCost: 280,  selling: 800,  portions: 4, status: 'warning'  },
  { name: '1KG Biryani',     foodCostPct: 31, stdCost: 710,  selling: 2290, portions: 4, status: 'ok'       },
  { name: 'BBQ Mix Platter', foodCostPct: 29, stdCost: 650,  selling: 2240, portions: 2, status: 'ok'       },
  { name: 'Dal Makhani',     foodCostPct: 24, stdCost: 180,  selling: 750,  portions: 6, status: 'ok'       },
  { name: 'Soup',            foodCostPct: 22, stdCost: 120,  selling: 545,  portions: 8, status: 'good'     },
];

// ── Stock Issue → Recipe linkage ──────────────────────────────────────────────
const issueLinkage = [
  {
    ref: 'ISS-202603-0023', date: '04 Mar 2026', dept: 'Chinese Kitchen',
    item: 'CHICKEN WHOLE', issued: '20 kg', cost: 'PKR 6,400',
    dishes: ['Chicken Biryani (6 kg)', 'Soup (4 kg)', 'Manchurian (8 kg)', 'Yield Loss ~2 kg'],
    bomRef: 'BOM-202603-0012', wastePct: '10%', status: 'Linked',
  },
  {
    ref: 'ISS-202603-0022', date: '04 Mar 2026', dept: 'BBQ Kitchen',
    item: 'GOAT BAKRA A', issued: '15 kg', cost: 'PKR 12,750',
    dishes: ['BBQ Mix (10 kg)', 'Karahi (4 kg)', 'Yield Loss ~1 kg'],
    bomRef: 'BOM-202603-0011', wastePct: '6.7%', status: 'Linked',
  },
  {
    ref: 'ISS-202603-0021', date: '03 Mar 2026', dept: 'Desi Kitchen',
    item: 'BEEF UNDERCUT', issued: '12 kg', cost: 'PKR 9,600',
    dishes: ['Nihari (8 kg)', 'Haleem mix (4 kg)'],
    bomRef: 'BOM-202603-0010', wastePct: '0%', status: 'Linked',
  },
  {
    ref: 'ISS-202603-0020', date: '03 Mar 2026', dept: 'Chinese Kitchen',
    item: 'KALEJI', issued: '5 kg', cost: 'PKR 1,750',
    dishes: [],
    bomRef: '—', wastePct: '—', status: 'Pending BOM',
  },
  {
    ref: 'ISS-202603-0019', date: '02 Mar 2026', dept: 'Desi Kitchen',
    item: 'COOKING OIL 16L', issued: '2 can', cost: 'PKR 7,600',
    dishes: ['Multiple recipes'],
    bomRef: 'BOM-202603-0009', wastePct: '5%', status: 'Linked',
  },
];

// ── Full recipe list ──────────────────────────────────────────────────────────
const recipes = [
  { code: 'RCP-001', name: '1KG Biryani',     product: 'BIRYANI FIN',    ingredients: 12, stdCost: 710,  selling: 2290, yield: '4 portions', foodCostPct: 31, status: 'Active' },
  { code: 'RCP-002', name: 'Desi Karahi',      product: 'KARAHI FIN',     ingredients: 8,  stdCost: 570,  selling: 1580, yield: '3 portions', foodCostPct: 36, status: 'Active' },
  { code: 'RCP-003', name: 'BBQ Mix Platter',  product: 'BBQ PLATTER',    ingredients: 9,  stdCost: 650,  selling: 2240, yield: '2 portions', foodCostPct: 29, status: 'Active' },
  { code: 'RCP-004', name: 'Dal Makhani',      product: 'DAL MAKHANI FIN',ingredients: 7,  stdCost: 180,  selling: 750,  yield: '6 portions', foodCostPct: 24, status: 'Active' },
  { code: 'RCP-005', name: 'Nihari (1KG)',      product: 'NIHARI FIN',     ingredients: 10, stdCost: 730,  selling: 1920, yield: '4 portions', foodCostPct: 38, status: 'Active' },
  { code: 'RCP-006', name: 'Haleem (1KG)',      product: 'HALEEM FIN',     ingredients: 11, stdCost: 665,  selling: 1580, yield: '5 portions', foodCostPct: 42, status: 'Active' },
  { code: 'RCP-007', name: 'Manchurian',        product: 'MANCHURIAN FIN', ingredients: 9,  stdCost: 280,  selling: 800,  yield: '4 portions', foodCostPct: 35, status: 'Active' },
  { code: 'RCP-008', name: 'Shami Kebab (1DZ)', product: 'SHAMI FIN',      ingredients: 8,  stdCost: 420,  selling: 1440, yield: '12 pieces', foodCostPct: 29, status: 'Draft'  },
];

const foodCostColor = (pct: number) =>
  pct > 40 ? '#EF4444' : pct > 33 ? '#F59E0B' : '#10B981';

const foodCostLabel = (pct: number) =>
  pct > 40 ? { text: 'Critical', cls: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300' } :
  pct > 33 ? { text: 'Above Target', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' } :
             { text: 'OK', cls: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300' };

// ── Month-over-month trending ─────────────────────────────────────────────────
const monthlyFoodCost = [
  { month: 'Oct', pct: 31.2, target: 33 },
  { month: 'Nov', pct: 33.8, target: 33 },
  { month: 'Dec', pct: 35.1, target: 33 },
  { month: 'Jan', pct: 36.4, target: 33 },
  { month: 'Feb', pct: 37.9, target: 33 },
  { month: 'Mar', pct: 38.4, target: 33 },
];

// ── Totals ────────────────────────────────────────────────────────────────────
const totalIssued      = reconciliationData.reduce((s, d) => s + d.issued, 0);        // 284,000
const totalTheoretical = reconciliationData.reduce((s, d) => s + d.theoretical, 0);   // 236,000
const totalVariance    = totalIssued - totalTheoretical;                                // 48,000
const variancePct      = ((totalVariance / totalIssued) * 100).toFixed(1);

export default function RecipeCostingPage() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-primary" />Recipe Costing & Food Cost Analytics
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Monitor food cost %, reconcile actual vs theoretical consumption, and detect waste
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <Download className="h-3 w-3" />Export
          </Button>
          <Button size="sm" className="gap-1 text-xs">
            <PlusCircle className="h-3 w-3" />Add Recipe
          </Button>
        </div>
      </div>

      {/* ── Food Cost Alert ── */}
      {parseFloat(variancePct) > 10 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20 px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <span className="font-semibold">Food cost alert:</span> Current avg food cost is{' '}
            <span className="font-bold">38.4%</span> — above the 33% target.
            Chinese Kitchen and Desi Kitchen show the highest variance ({variancePct}% overall).
            Review recipe yields and portion control.
          </p>
          <span className="ml-auto shrink-0 text-xs bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full font-medium">
            Action Required
          </span>
        </div>
      )}

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Avg Food Cost %', value: '38.4%', sub: 'Target: 33%', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/20' },
          { label: 'Total Issued (Mar)', value: 'PKR 284K', sub: '5 kitchens', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20' },
          { label: 'Theoretical Cost', value: 'PKR 236K', sub: 'Based on recipes', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/20' },
          { label: 'Waste Variance', value: `PKR ${(totalVariance/1000).toFixed(0)}K`, sub: `${variancePct}% of issued stock`, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/20' },
          { label: 'Active Recipes', value: '24', sub: '7 above 33% target', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/20' },
        ].map((k, i) => (
          <div key={i} className={`rounded-lg p-3 ${k.bg}`}>
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className={`text-lg font-bold tabular-nums ${k.color}`}>{k.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-8">
          <TabsTrigger value="analytics" className="text-xs">Food Cost Analytics</TabsTrigger>
          <TabsTrigger value="reconciliation" className="text-xs">Reconciliation</TabsTrigger>
          <TabsTrigger value="issues" className="text-xs">Issue → BOM Linkage</TabsTrigger>
          <TabsTrigger value="recipes" className="text-xs">Recipe Management</TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Analytics ── */}
        <TabsContent value="analytics" className="space-y-5 mt-4">

          {/* Reconciliation Formula Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center">
                    <Package className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actual Consumption</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">Opening Stock + Purchases − Closing Stock</p>
                <div className="flex items-center gap-1.5 text-xs mt-2">
                  <span className="px-2 py-0.5 rounded bg-muted font-mono">PKR 84K</span>
                  <span>+</span>
                  <span className="px-2 py-0.5 rounded bg-muted font-mono">PKR 484K</span>
                  <span>−</span>
                  <span className="px-2 py-0.5 rounded bg-muted font-mono">PKR 284K</span>
                  <span>=</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/40 font-mono font-bold text-blue-700 dark:text-blue-300">PKR 284K</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-950/40 flex items-center justify-center">
                    <Calculator className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Theoretical Consumption</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">Menu Items Sold × Recipe Ingredient Qty</p>
                <div className="flex items-center gap-1.5 text-xs mt-2">
                  <span className="px-2 py-0.5 rounded bg-muted font-mono">Dishes Sold</span>
                  <span>×</span>
                  <span className="px-2 py-0.5 rounded bg-muted font-mono">Recipe Cost</span>
                  <span>=</span>
                  <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-950/40 font-mono font-bold text-green-700 dark:text-green-300">PKR 236K</span>
                </div>
              </CardContent>
            </Card>

            <Card className={totalVariance > 0 ? 'border-red-200 dark:border-red-800' : 'border-green-200 dark:border-green-800'}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${totalVariance > 0 ? 'bg-red-100 dark:bg-red-950/40' : 'bg-green-100 dark:bg-green-950/40'}`}>
                    <TrendingDown className={`h-4 w-4 ${totalVariance > 0 ? 'text-red-600' : 'text-green-600'}`} />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Variance (Waste Risk)</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">Actual − Theoretical = Unexplained difference</p>
                <div className="flex items-center gap-1.5 text-xs mt-2">
                  <span className="px-2 py-0.5 rounded bg-muted font-mono">PKR 284K</span>
                  <span>−</span>
                  <span className="px-2 py-0.5 rounded bg-muted font-mono">PKR 236K</span>
                  <span>=</span>
                  <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/40 font-mono font-bold text-red-700 dark:text-red-300">
                    +PKR 48K ({variancePct}%)
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Food cost % trend */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Food Cost % Trend</CardTitle>
                <CardDescription className="text-xs">Monthly avg vs 33% target — rising trend since Oct</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyFoodCost} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={11} />
                      <YAxis axisLine={false} tickLine={false} fontSize={10} unit="%" domain={[25, 45]} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`]} />
                      <ReferenceLine y={33} stroke="#EF4444" strokeDasharray="4 4" label={{ value: '33% Target', position: 'right', fontSize: 10, fill: '#EF4444' }} />
                      <Bar dataKey="pct" fill="#F59E0B" name="Food Cost %" radius={[3,3,0,0]} fillOpacity={0.85} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Food cost % by recipe */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Food Cost % by Recipe</CardTitle>
                <CardDescription className="text-xs">Red line = 33% target — above = review required</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={recipeFoodCost} layout="vertical" margin={{ top: 5, right: 40, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-20" horizontal={false} />
                      <XAxis type="number" axisLine={false} tickLine={false} fontSize={10} unit="%" domain={[0, 50]} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} fontSize={9} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, 'Food Cost']} />
                      <ReferenceLine x={33} stroke="#EF4444" strokeDasharray="4 4" />
                      <Bar dataKey="foodCostPct" name="Food Cost %" radius={[0, 3, 3, 0]}>
                        {recipeFoodCost.map((r, i) => <Cell key={i} fill={foodCostColor(r.foodCostPct)} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Tab 2: Reconciliation ── */}
        <TabsContent value="reconciliation" className="space-y-5 mt-4">

          <div className="flex items-start gap-3 rounded-xl border bg-muted/40 p-3">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Audit every 15 days:</span> If{' '}
              <span className="text-red-600 font-medium">Actual &gt; Theoretical</span>, the kitchen is consuming more than recipes require — indicates waste, over-portioning, theft, or spoilage.
              If <span className="text-green-600 font-medium">Actual &lt; Theoretical</span>, recipe quantities may need updating or POS data may have errors.
            </p>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Actual vs Theoretical Consumption by Kitchen</CardTitle>
              <CardDescription className="text-xs">March 2026 · Issued from store vs what recipes should have used</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={reconciliationData} margin={{ top: 5, right: 25, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                    <XAxis dataKey="dept" axisLine={false} tickLine={false} fontSize={11} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} fontSize={10} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}K`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`PKR ${v.toLocaleString()}`]} />
                    <Legend iconSize={9} wrapperStyle={{ fontSize: 11 }} />
                    <Bar yAxisId="left" dataKey="issued" fill="#3B82F6" name="Actual Issued (PKR)" radius={[3,3,0,0]} />
                    <Bar yAxisId="left" dataKey="theoretical" fill="#10B981" name="Theoretical (PKR)" radius={[3,3,0,0]} />
                    <Bar yAxisId="left" dataKey="variance" fill="#EF4444" name="Variance (PKR)" radius={[3,3,0,0]} fillOpacity={0.7} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Dept breakdown table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Department Waste Summary — March 2026</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-muted/60">
                  <tr>
                    {['Kitchen', 'Issued (Actual)', 'Theoretical', 'Variance', 'Waste %', 'Status'].map(h => (
                      <th key={h} className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reconciliationData.map((d, i) => {
                    const pct = ((d.variance / d.issued) * 100).toFixed(1);
                    const alert = parseFloat(pct) > 15;
                    return (
                      <tr key={i} className="border-t hover:bg-muted/20">
                        <td className="px-4 py-2 text-sm font-medium">{d.dept} Kitchen</td>
                        <td className="px-4 py-2 text-sm tabular-nums">PKR {d.issued.toLocaleString()}</td>
                        <td className="px-4 py-2 text-sm tabular-nums text-green-600">PKR {d.theoretical.toLocaleString()}</td>
                        <td className="px-4 py-2 text-sm tabular-nums text-red-600">+PKR {d.variance.toLocaleString()}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            parseFloat(pct) > 15 ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300' :
                            parseFloat(pct) > 8  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' :
                                                   'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300'
                          }`}>{pct}%</span>
                        </td>
                        <td className="px-4 py-2">
                          {alert
                            ? <span className="inline-flex items-center gap-1 text-xs text-red-600"><AlertTriangle className="h-3 w-3" />Investigate</span>
                            : <span className="text-xs text-green-600">Normal</span>
                          }
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="border-t bg-muted/30 font-semibold">
                    <td className="px-4 py-2 text-sm">Total</td>
                    <td className="px-4 py-2 text-sm tabular-nums">PKR {totalIssued.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm tabular-nums text-green-600">PKR {totalTheoretical.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm tabular-nums text-red-600">+PKR {totalVariance.toLocaleString()}</td>
                    <td className="px-4 py-2"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">{variancePct}%</span></td>
                    <td className="px-4 py-2 text-xs text-amber-600 font-medium">Review Required</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 3: Issue → BOM Linkage ── */}
        <TabsContent value="issues" className="space-y-4 mt-4">

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-xl px-4 py-3 border">
            <Info className="h-3.5 w-3.5 shrink-0" />
            Stock issues to departments are tracked here. Each issue note must be linked to a BOM entry, which records what dishes were prepared and how the issued stock was consumed. This enables the Theoretical vs Actual reconciliation above.
          </div>

          {/* Workflow arrow */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-medium">
            {['Issue Note Created', 'Dept Links to BOM', 'Dishes & Qty Recorded', 'Yield Loss Noted', 'Cost Reconciled'].map((s, i, arr) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-full border ${i === 0 ? 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-700' : i <= 2 ? 'bg-primary/10 text-primary border-primary/30' : 'bg-muted text-muted-foreground'}`}>{s}</span>
                {i < arr.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {issueLinkage.map((iss, i) => (
              <Card key={i} className={`${iss.status === 'Pending BOM' ? 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/10' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-semibold">{iss.ref}</span>
                        <span className="text-xs text-muted-foreground">{iss.date}</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{iss.dept}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          iss.status === 'Linked' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}>{iss.status}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span><span className="font-medium">Item:</span> {iss.item}</span>
                        <span><span className="font-medium">Issued:</span> {iss.issued}</span>
                        <span><span className="font-medium">Cost:</span> {iss.cost}</span>
                        {iss.wastePct !== '—' && (
                          <span className={parseFloat(iss.wastePct) > 8 ? 'text-amber-600 font-medium' : 'text-green-600'}>
                            Yield Loss: {iss.wastePct}
                          </span>
                        )}
                      </div>
                      {iss.dishes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {iss.dishes.map((d, j) => (
                            <span key={j} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{d}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">BOM Ref</p>
                      <p className="font-mono text-xs font-semibold">{iss.bomRef}</p>
                      {iss.status === 'Pending BOM' && (
                        <Button size="sm" className="mt-2 h-6 text-xs px-2">Link BOM</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Tab 4: Recipe Management ── */}
        <TabsContent value="recipes" className="space-y-4 mt-4">
          <div className="overflow-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/60">
                <tr>
                  {['Code', 'Recipe Name', 'Finished Product', 'Ingredients', 'Std Cost', 'Selling Price', 'Food Cost %', 'Yield', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-3 py-2.5 text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recipes.map((r, i) => {
                  const fc = foodCostLabel(r.foodCostPct);
                  return (
                    <tr key={i} className="border-t hover:bg-muted/20 transition-colors">
                      <td className="px-3 py-2 font-mono text-xs">{r.code}</td>
                      <td className="px-3 py-2 font-medium text-sm whitespace-nowrap">{r.name}</td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{r.product}</td>
                      <td className="px-3 py-2 text-xs text-center">{r.ingredients}</td>
                      <td className="px-3 py-2 text-xs tabular-nums">PKR {r.stdCost}</td>
                      <td className="px-3 py-2 text-xs tabular-nums">PKR {r.selling}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${fc.cls}`}>
                          {r.foodCostPct}% · {fc.text}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs">{r.yield}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs ${r.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>{r.status}</span>
                      </td>
                      <td className="px-3 py-2">
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Edit</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

    </div>
  );
}
