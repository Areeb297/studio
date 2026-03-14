'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, ChefHat, PlusCircle, Info, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

// ── Production workflow steps ─────────────────────────────────────────────────
const WORKFLOW_STEPS = [
  { id: 1, label: 'Stock Issue',     desc: 'Store issues items to kitchen'     },
  { id: 2, label: 'BOM Definition',  desc: 'Kitchen maps stock to dishes'      },
  { id: 3, label: 'Work Order',       desc: 'Production quantities confirmed'   },
  { id: 4, label: 'Quality Control', desc: 'Yield & quality verified'           },
  { id: 5, label: 'Stock Entry',      desc: 'Finished product recorded'         },
];

// ── Active BOM entries ────────────────────────────────────────────────────────
const bomEntries = [
  {
    ref: 'BOM-202603-0012',
    issueRef: 'ISS-202603-0023',
    date: '04 Mar 2026',
    kitchen: 'Chinese Kitchen',
    step: 2,
    issued: { item: 'CHICKEN WHOLE', qty: '20 kg', cost: 'PKR 6,400' },
    dishes: [
      { dish: 'Chicken Biryani', qty: '6 kg',  portions: 8,  sellPrice: 350,  totalRev: 2800 },
      { dish: 'Soup',            qty: '4 kg',  portions: 16, sellPrice: 120,  totalRev: 1920 },
      { dish: 'Manchurian',      qty: '8 kg',  portions: 12, sellPrice: 250,  totalRev: 3000 },
      { dish: 'Yield Loss',      qty: '~2 kg', portions: 0,  sellPrice: 0,    totalRev: 0    },
    ],
    yieldLoss: '10%',
  },
  {
    ref: 'BOM-202603-0011',
    issueRef: 'ISS-202603-0022',
    date: '04 Mar 2026',
    kitchen: 'BBQ Kitchen',
    step: 3,
    issued: { item: 'GOAT BAKRA A', qty: '15 kg', cost: 'PKR 12,750' },
    dishes: [
      { dish: 'BBQ Mix Platter', qty: '10 kg', portions: 5, sellPrice: 1200, totalRev: 6000 },
      { dish: 'Karahi (1KG)',    qty: '4 kg',  portions: 4, sellPrice: 800,  totalRev: 3200 },
      { dish: 'Yield Loss',      qty: '~1 kg', portions: 0, sellPrice: 0,    totalRev: 0    },
    ],
    yieldLoss: '6.7%',
  },
  {
    ref: 'BOM-202603-0010',
    issueRef: 'ISS-202603-0021',
    date: '03 Mar 2026',
    kitchen: 'Desi Kitchen',
    step: 4,
    issued: { item: 'BEEF UNDERCUT', qty: '12 kg', cost: 'PKR 9,600' },
    dishes: [
      { dish: 'Nihari (1KG)',  qty: '8 kg', portions: 8, sellPrice: 480, totalRev: 3840 },
      { dish: 'Haleem mix',   qty: '4 kg', portions: 5, sellPrice: 350, totalRev: 1750 },
    ],
    yieldLoss: '0%',
  },
];

// ── Standard BOM recipes (chef-defined) ──────────────────────────────────────
const standardBOMs = [
  {
    id: 'BOM-STD-001', dish: 'Chicken Biryani', kitchen: 'Chinese / Desi',
    sellingPrice: 350,
    ingredients: [
      { item: 'BASMATI RICE',  qty: 250, unit: 'g',  cost: 0.30, total: 75   },
      { item: 'CHICKEN WHOLE', qty: 300, unit: 'g',  cost: 0.35, total: 105  },
      { item: 'COOKING OIL',   qty: 50,  unit: 'ml', cost: 0.15, total: 7.5  },
      { item: 'ONION',         qty: 100, unit: 'g',  cost: 0.08, total: 8    },
      { item: 'TOMATO PASTE',  qty: 60,  unit: 'g',  cost: 0.10, total: 6    },
      { item: 'SPICES MIX',    qty: 50,  unit: 'g',  cost: 0.50, total: 25   },
      { item: 'YOGURT',        qty: 100, unit: 'g',  cost: 0.12, total: 12   },
    ],
    stdCost: 238.5, foodCostPct: 31,
  },
  {
    id: 'BOM-STD-002', dish: 'Haleem (1KG)', kitchen: 'Desi',
    sellingPrice: 316,
    ingredients: [
      { item: 'BEEF UNDERCUT', qty: 500, unit: 'g',  cost: 0.80, total: 400 },
      { item: 'ATTA FLOUR',    qty: 200, unit: 'g',  cost: 0.08, total: 16  },
      { item: 'RED CHILLI',    qty: 30,  unit: 'g',  cost: 0.30, total: 9   },
      { item: 'COOKING OIL',   qty: 80,  unit: 'ml', cost: 0.15, total: 12  },
      { item: 'SPICES MIX',    qty: 60,  unit: 'g',  cost: 0.50, total: 30  },
      { item: 'GINGER GARLIC', qty: 50,  unit: 'g',  cost: 0.12, total: 6   },
    ],
    stdCost: 473, foodCostPct: 42,
  },
];

const foodCostCls = (pct: number) =>
  pct > 40 ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300' :
  pct > 33 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' :
             'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300';

function WorkflowStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-0 overflow-x-auto py-1">
      {WORKFLOW_STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center">
          <div className={`flex flex-col items-center px-3 min-w-[90px] ${s.id <= currentStep ? 'opacity-100' : 'opacity-35'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
              s.id < currentStep  ? 'bg-green-500 border-green-500 text-white' :
              s.id === currentStep ? 'bg-primary border-primary text-primary-foreground' :
                                     'bg-muted border-border text-muted-foreground'
            }`}>
              {s.id < currentStep ? '✓' : s.id}
            </div>
            <p className={`text-[10px] font-semibold mt-0.5 text-center leading-tight ${s.id === currentStep ? 'text-primary' : 'text-muted-foreground'}`}>{s.label}</p>
          </div>
          {i < WORKFLOW_STEPS.length - 1 && (
            <div className={`h-px w-6 shrink-0 ${s.id < currentStep ? 'bg-green-400' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function BOMPage() {
  const [expandedBOM, setExpandedBOM] = useState<string | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />Bill of Materials
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Track ingredient consumption per recipe · Link issued stock to prepared dishes
          </p>
        </div>
        <Button size="sm" className="gap-1 text-xs">
          <PlusCircle className="h-3 w-3" />New BOM Entry
        </Button>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active BOM Entries',   value: '24',   sub: 'This month',          color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-950/20'    },
          { label: 'Pending BOM Linkage',  value: '3',    sub: 'Issues awaiting BOM', color: 'text-amber-600',  bg: 'bg-amber-50 dark:bg-amber-950/20'  },
          { label: 'Standard Recipes',     value: '24',   sub: 'Chef-defined BOMs',   color: 'text-green-600',  bg: 'bg-green-50 dark:bg-green-950/20'  },
          { label: 'Avg Yield Loss',        value: '6.8%', sub: 'Acceptable < 10%',   color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/20' },
        ].map((k, i) => (
          <div key={i} className={`rounded-lg p-3 ${k.bg}`}>
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className={`text-lg font-bold tabular-nums ${k.color}`}>{k.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Collapsible: How BOM Works ── */}
      <div className="rounded-xl border overflow-hidden">
        <button
          onClick={() => setShowHowItWorks(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">How BOM Works</span>
            <span className="text-xs text-muted-foreground">· Click to {showHowItWorks ? 'collapse' : 'expand'}</span>
          </div>
          {showHowItWorks ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>

        {showHowItWorks && (
          <div className="px-4 pb-4 pt-1 border-t bg-muted/20 space-y-3">
            {/* Workflow steps */}
            <div className="overflow-x-auto">
              <div className="flex items-center gap-0 py-2">
                {WORKFLOW_STEPS.map((s, i) => (
                  <div key={s.id} className="flex items-center">
                    <div className="flex flex-col items-center px-4 min-w-[110px]">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 bg-primary border-primary text-primary-foreground">
                        {s.id}
                      </div>
                      <p className="text-xs font-semibold mt-1 text-center leading-tight">{s.label}</p>
                      <p className="text-[10px] text-muted-foreground text-center leading-tight mt-0.5">{s.desc}</p>
                    </div>
                    {i < WORKFLOW_STEPS.length - 1 && <div className="h-px w-8 shrink-0 bg-border" />}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The store issues raw materials to a kitchen department (Step 1). The kitchen user then creates a BOM entry linking that issue to the specific dishes they prepared and the quantities used per dish (Step 2). Work orders confirm production volume (Step 3), quality is verified (Step 4), and finished goods are entered into stock (Step 5). This chain enables Theoretical vs Actual consumption reconciliation and food cost % tracking per recipe.
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Future POS integration:</span> The same Dish IDs will be reused. System will then automatically calculate Revenue (POS) − Ingredient Cost (BOM) = Actual Kitchen Profit per dish.
            </p>
          </div>
        )}
      </div>

      {/* ── Active BOM Entries ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Active BOM Entries — March 2026</h2>
          <span className="text-xs text-muted-foreground">{bomEntries.length} entries · click to view details</span>
        </div>
        <div className="space-y-3">
          {bomEntries.map((bom) => {
            const isOpen = expandedBOM === bom.ref;
            const totalRev = bom.dishes.reduce((s, d) => s + d.totalRev, 0);
            const issuedCostNum = parseInt(bom.issued.cost.replace(/[^0-9]/g, ''));

            return (
              <Card key={bom.ref}
                className={`cursor-pointer transition-all hover:shadow-md ${isOpen ? 'ring-1 ring-primary/30' : ''}`}
                onClick={() => setExpandedBOM(isOpen ? null : bom.ref)}
              >
                <CardContent className="p-4">
                  {/* Summary: stepper + meta on same row */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <WorkflowStepper currentStep={bom.step} />
                    <div className="flex items-center gap-4 text-xs shrink-0">
                      <span className="font-mono font-semibold">{bom.ref}</span>
                      <span className="text-muted-foreground">{bom.date}</span>
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">{bom.kitchen}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-xs mt-2 pl-1 flex-wrap">
                    <span><span className="text-muted-foreground">Issue:</span> <span className="font-mono">{bom.issueRef}</span></span>
                    <span><span className="text-muted-foreground">Item:</span> <span className="font-medium">{bom.issued.item}</span></span>
                    <span><span className="text-muted-foreground">Issued:</span> <span className="font-medium">{bom.issued.qty}</span></span>
                    <span><span className="text-muted-foreground">Cost:</span> <span className="font-medium">{bom.issued.cost}</span></span>
                    <span className={`font-medium ${parseFloat(bom.yieldLoss) > 8 ? 'text-amber-600' : 'text-green-600'}`}>
                      Yield Loss: {bom.yieldLoss}
                    </span>
                    <span className="text-muted-foreground ml-auto">{isOpen ? '▲ collapse' : '▼ view details'}</span>
                  </div>

                  {/* Expanded: dish breakdown */}
                  {isOpen && (
                    <div className="mt-4 pt-4 border-t" onClick={e => e.stopPropagation()}>
                      <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
                        Dishes prepared from {bom.issued.qty} of {bom.issued.item}
                      </p>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b">
                            {['Dish', 'Qty Used', 'Portions', 'Sell Price / Portion', 'Total Revenue'].map(h => (
                              <th key={h} className="text-left py-1.5 px-2 font-medium text-muted-foreground">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {bom.dishes.map((d, i) => (
                            <tr key={i} className={`border-t ${d.dish === 'Yield Loss' ? 'text-red-500' : ''}`}>
                              <td className="py-1.5 px-2 font-medium">{d.dish}</td>
                              <td className="py-1.5 px-2">{d.qty}</td>
                              <td className="py-1.5 px-2">{d.portions > 0 ? d.portions : '—'}</td>
                              <td className="py-1.5 px-2">{d.sellPrice > 0 ? `PKR ${d.sellPrice}` : '—'}</td>
                              <td className="py-1.5 px-2 font-medium">{d.totalRev > 0 ? `PKR ${d.totalRev.toLocaleString()}` : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t bg-muted/20 font-semibold">
                            <td className="py-1.5 px-2" colSpan={4}>Estimated Revenue</td>
                            <td className="py-1.5 px-2 text-green-600">PKR {totalRev.toLocaleString()}</td>
                          </tr>
                          <tr className="font-medium">
                            <td className="py-1.5 px-2 text-muted-foreground" colSpan={4}>Ingredient Cost</td>
                            <td className="py-1.5 px-2 text-red-600">{bom.issued.cost}</td>
                          </tr>
                          <tr className="border-t font-bold">
                            <td className="py-1.5 px-2 text-muted-foreground" colSpan={4}>Gross Margin</td>
                            <td className={`py-1.5 px-2 ${totalRev - issuedCostNum > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              PKR {(totalRev - issuedCostNum).toLocaleString()} ({(((totalRev - issuedCostNum) / totalRev) * 100).toFixed(0)}%)
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ── Standard Recipes (Chef-Defined) ── */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ChefHat className="h-4 w-4 text-primary" />Standard Recipes (Chef-Defined)
              </CardTitle>
              <CardDescription className="text-xs">
                Ingredient list, rates, and quantities provided by kitchen staff — basis for theoretical consumption
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="text-xs gap-1 h-7">
              <PlusCircle className="h-3 w-3" />Add Recipe
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {standardBOMs.map((bom) => (
            <div key={bom.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{bom.dish}</span>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{bom.kitchen}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${foodCostCls(bom.foodCostPct)}`}>
                    Food Cost: {bom.foodCostPct}%
                    {bom.foodCostPct > 33 && <AlertTriangle className="h-3 w-3 inline ml-1" />}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span><span className="text-muted-foreground">Std Cost:</span> <span className="font-medium">PKR {bom.stdCost}</span></span>
                  <span><span className="text-muted-foreground">Selling:</span> <span className="font-medium">PKR {bom.sellingPrice} / portion</span></span>
                </div>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    {['Ingredient', 'Qty', 'Unit', 'Unit Cost', 'Total Cost'].map(h => (
                      <th key={h} className="text-left py-1 px-2 font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bom.ingredients.map((ing, j) => (
                    <tr key={j} className="border-t hover:bg-muted/10">
                      <td className="py-1 px-2">{ing.item}</td>
                      <td className="py-1 px-2 tabular-nums">{ing.qty}</td>
                      <td className="py-1 px-2 text-muted-foreground">{ing.unit}</td>
                      <td className="py-1 px-2 tabular-nums">{ing.cost}</td>
                      <td className="py-1 px-2 font-medium tabular-nums">PKR {ing.total}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t font-semibold bg-muted/20">
                    <td className="py-1.5 px-2" colSpan={4}>Total Ingredient Cost per Portion</td>
                    <td className="py-1.5 px-2 text-primary">PKR {bom.stdCost}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}
