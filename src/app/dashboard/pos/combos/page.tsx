'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coffee, Plus, Tag, TrendingUp, Package, Pencil, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComboItem { name: string; qty: number; }
interface Combo {
  id: number;
  name: string;
  urduName: string;
  emoji: string;
  items: ComboItem[];
  originalPrice: number;
  comboPrice: number;
  category: string;
  active: boolean;
  popular: boolean;
  sold: number;
}

const initialCombos: Combo[] = [
  { id: 1, name: "Family Biryani Deal",     urduName: "فیملی بریانی ڈیل",    emoji: "🍚", category: "Rice",   originalPrice: 1800, comboPrice: 1499, active: true,  popular: true,  sold: 142,
    items: [{ name: "Chicken Biryani", qty: 4 }, { name: "Raita", qty: 2 }, { name: "Cold Drink", qty: 4 }] },
  { id: 2, name: "Karahi Combo",            urduName: "کڑاہی کمبو",           emoji: "🫕", category: "Curry",  originalPrice: 1200, comboPrice: 999,  active: true,  popular: true,  sold: 98,
    items: [{ name: "Chicken Karahi", qty: 1 }, { name: "Naan", qty: 4 }, { name: "Lassi", qty: 2 }, { name: "Raita", qty: 1 }] },
  { id: 3, name: "BBQ Platter",             urduName: "بی بی کیو پلیٹر",     emoji: "🔥", category: "BBQ",    originalPrice: 2200, comboPrice: 1799, active: true,  popular: true,  sold: 76,
    items: [{ name: "Seekh Kabab", qty: 4 }, { name: "Chicken Tikka", qty: 4 }, { name: "Naan", qty: 6 }, { name: "Raita", qty: 2 }, { name: "Cold Drink", qty: 4 }] },
  { id: 4, name: "Student Lunch Box",       urduName: "اسٹوڈنٹ لنچ",         emoji: "🎒", category: "Rice",   originalPrice: 350,  comboPrice: 270,  active: true,  popular: false, sold: 210,
    items: [{ name: "Daal Chawal", qty: 1 }, { name: "Roti", qty: 2 }, { name: "Water Bottle", qty: 1 }] },
  { id: 5, name: "Nihari Morning Deal",     urduName: "نہاری مارننگ ڈیل",    emoji: "🌅", category: "Curry",  originalPrice: 720,  comboPrice: 580,  active: true,  popular: false, sold: 89,
    items: [{ name: "Nihari", qty: 1 }, { name: "Naan", qty: 3 }, { name: "Chai", qty: 1 }] },
  { id: 6, name: "Dessert Bundle",          urduName: "مٹھائی پیکج",          emoji: "🍮", category: "Dessert",originalPrice: 350,  comboPrice: 280,  active: true,  popular: false, sold: 55,
    items: [{ name: "Gulab Jamun", qty: 2 }, { name: "Kheer", qty: 1 }, { name: "Kulfi Mango", qty: 2 }] },
  { id: 7, name: "Mutton Feast",            urduName: "مٹن فیسٹ",            emoji: "🐑", category: "Curry",  originalPrice: 3800, comboPrice: 2999, active: false, popular: false, sold: 34,
    items: [{ name: "Mutton Karahi", qty: 2 }, { name: "Mutton Biryani", qty: 2 }, { name: "Naan", qty: 8 }, { name: "Lassi", qty: 4 }] },
  { id: 8, name: "Breakfast Deal",          urduName: "ناشتہ ڈیل",           emoji: "🍳", category: "Breakfast", originalPrice: 450, comboPrice: 350, active: true,  popular: true,  sold: 167,
    items: [{ name: "Halwa Puri", qty: 2 }, { name: "Chai", qty: 2 }] },
];

const CATEGORIES = ["All", "Rice", "Curry", "BBQ", "Breakfast", "Dessert"];

export default function CombosPage() {
  const [combos, setCombos] = useState<Combo[]>(initialCombos);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);

  const filtered = combos.filter(c => categoryFilter === "All" || c.category === categoryFilter);

  const toggleActive = (id: number) => {
    setCombos(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const totalRevenue = combos.reduce((s, c) => s + c.comboPrice * c.sold, 0);
  const activeCombos = combos.filter(c => c.active).length;
  const avgDiscount = Math.round(combos.reduce((s, c) => s + ((c.originalPrice - c.comboPrice) / c.originalPrice) * 100, 0) / combos.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Coffee className="h-6 w-6 text-orange-600" /> Combo Deals & Promotions
          </h1>
          <p className="text-muted-foreground text-sm">Create and manage meal combos, bundle deals, and promotional pricing</p>
        </div>
        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white gap-1.5">
          <Plus className="h-4 w-4" /> New Combo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Combos",   value: activeCombos,                          icon: Coffee,    color: "text-orange-600" },
          { label: "Total Sold",      value: combos.reduce((s,c)=>s+c.sold,0),      icon: Package,   color: "text-blue-600" },
          { label: "Avg Discount",    value: `${avgDiscount}%`,                     icon: Tag,       color: "text-red-600" },
          { label: "Combo Revenue",   value: `Rs. ${(totalRevenue/1000).toFixed(0)}K`, icon: TrendingUp,color: "text-green-600" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4 flex items-start gap-3">
              <s.icon className={cn("h-8 w-8 mt-0.5", s.color)} />
              <div>
                <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategoryFilter(cat)}
            className={cn("px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
              categoryFilter === cat ? "bg-orange-600 text-white border-orange-600" : "bg-background text-muted-foreground border-border hover:bg-muted")}>
            {cat}
          </button>
        ))}
      </div>

      {/* Combo cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(combo => {
          const saving = combo.originalPrice - combo.comboPrice;
          const pct = Math.round((saving / combo.originalPrice) * 100);
          return (
            <Card key={combo.id} className={cn("transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer", !combo.active && "opacity-60")}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{combo.emoji}</span>
                  <div className="flex items-center gap-1.5">
                    {combo.popular && <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 gap-0.5"><Star className="h-2.5 w-2.5" /> Popular</Badge>}
                    <Switch checked={combo.active} onCheckedChange={() => toggleActive(combo.id)} className="scale-75" />
                  </div>
                </div>

                <h3 className="font-bold text-sm leading-tight">{combo.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 text-right" dir="rtl">{combo.urduName}</p>

                <div className="mt-2 space-y-0.5">
                  {combo.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs text-muted-foreground">
                      <span>{item.name}</span>
                      <span className="font-medium">×{item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t flex items-end justify-between">
                  <div>
                    <p className="text-[10px] line-through text-muted-foreground">Rs. {combo.originalPrice.toLocaleString()}</p>
                    <p className="text-lg font-extrabold text-green-700">Rs. {combo.comboPrice.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-red-500 text-white text-[10px] px-1.5">Save {pct}%</Badge>
                    <p className="text-[10px] text-muted-foreground mt-1">{combo.sold} sold</p>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full mt-3 text-xs gap-1.5" onClick={() => setSelectedCombo(combo)}>
                  <Pencil className="h-3 w-3" /> Edit Combo
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!selectedCombo} onOpenChange={() => setSelectedCombo(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Combo — {selectedCombo?.name}</DialogTitle>
          </DialogHeader>
          {selectedCombo && (
            <div className="space-y-3 py-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">Combo Name</Label><Input defaultValue={selectedCombo.name} className="text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">Category</Label><Input defaultValue={selectedCombo.category} className="text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">Original Price (PKR)</Label><Input type="number" defaultValue={selectedCombo.originalPrice} className="text-sm" /></div>
                <div className="space-y-1"><Label className="text-xs">Combo Price (PKR)</Label><Input type="number" defaultValue={selectedCombo.comboPrice} className="text-sm" /></div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Items in Combo</Label>
                {selectedCombo.items.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <Input defaultValue={item.name} className="text-xs flex-1" />
                    <Input type="number" defaultValue={item.qty} className="text-xs w-16" />
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full text-xs gap-1 mt-1"><Plus className="h-3 w-3" /> Add Item</Button>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedCombo(null)}>Cancel</Button>
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => setSelectedCombo(null)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
