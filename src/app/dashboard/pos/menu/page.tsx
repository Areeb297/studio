'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Edit, TrendingUp, Package, Star } from "lucide-react";

const CATEGORIES = ['All', 'Rice', 'Biryani', 'Curry', 'BBQ', 'Bread', 'Drinks', 'Dessert', 'Sides', 'Breakfast', 'Soups'];

const menuItems = [
  // Rice / Biryani
  { id: 1,  emoji: '🍛', name: 'Chicken Biryani',       urdu: 'چکن بریانی',       category: 'Biryani',   price: 350,  cost: 240,  spicy: 2, rating: 4.8, active: true,  bestseller: true  },
  { id: 2,  emoji: '🍖', name: 'Mutton Biryani',        urdu: 'مٹن بریانی',       category: 'Biryani',   price: 550,  cost: 380,  spicy: 2, rating: 4.9, active: true,  bestseller: true  },
  { id: 3,  emoji: '🍚', name: 'Daal Chawal',           urdu: 'دال چاول',         category: 'Rice',      price: 150,  cost: 80,   spicy: 1, rating: 4.2, active: true,  bestseller: false },
  { id: 4,  emoji: '🍚', name: 'Pulao',                 urdu: 'پلاؤ',             category: 'Rice',      price: 300,  cost: 190,  spicy: 1, rating: 4.5, active: true,  bestseller: false },
  { id: 5,  emoji: '🍛', name: 'Beef Biryani',          urdu: 'بیف بریانی',       category: 'Biryani',   price: 450,  cost: 310,  spicy: 3, rating: 4.7, active: true,  bestseller: false },
  { id: 6,  emoji: '🍛', name: 'Kabuli Pulao',          urdu: 'قابلی پلاؤ',       category: 'Rice',      price: 400,  cost: 260,  spicy: 1, rating: 4.6, active: true,  bestseller: false },
  // Curry
  { id: 7,  emoji: '🍲', name: 'Chicken Karahi',        urdu: 'چکن کڑاہی',        category: 'Curry',     price: 900,  cost: 580,  spicy: 3, rating: 4.9, active: true,  bestseller: true  },
  { id: 8,  emoji: '🍲', name: 'Mutton Karahi',         urdu: 'مٹن کڑاہی',        category: 'Curry',     price: 1400, cost: 950,  spicy: 3, rating: 5.0, active: true,  bestseller: true  },
  { id: 9,  emoji: '🥘', name: 'Aloo Gosht',            urdu: 'آلو گوشت',         category: 'Curry',     price: 600,  cost: 380,  spicy: 2, rating: 4.4, active: true,  bestseller: false },
  { id: 10, emoji: '🍲', name: 'Chicken Haleem',        urdu: 'حلیم',             category: 'Curry',     price: 250,  cost: 150,  spicy: 2, rating: 4.3, active: true,  bestseller: false },
  { id: 11, emoji: '🥘', name: 'Daal Makhani',          urdu: 'دال مکھنی',        category: 'Curry',     price: 350,  cost: 180,  spicy: 1, rating: 4.5, active: true,  bestseller: false },
  { id: 12, emoji: '🍲', name: 'Nihari',                urdu: 'نہاری',            category: 'Curry',     price: 450,  cost: 290,  spicy: 3, rating: 4.8, active: true,  bestseller: true  },
  { id: 13, emoji: '🥘', name: 'Saag Gosht',            urdu: 'ساگ گوشت',         category: 'Curry',     price: 700,  cost: 430,  spicy: 2, rating: 4.6, active: true,  bestseller: false },
  { id: 14, emoji: '🍲', name: 'Beef Korma',            urdu: 'بیف قورمہ',        category: 'Curry',     price: 750,  cost: 480,  spicy: 1, rating: 4.7, active: true,  bestseller: false },
  { id: 15, emoji: '🥘', name: 'Chicken Handi',         urdu: 'چکن ہانڈی',        category: 'Curry',     price: 850,  cost: 540,  spicy: 2, rating: 4.8, active: true,  bestseller: false },
  { id: 16, emoji: '🍲', name: 'Paya (Trotters)',       urdu: 'پائے',             category: 'Curry',     price: 400,  cost: 240,  spicy: 2, rating: 4.5, active: true,  bestseller: false },
  // BBQ
  { id: 17, emoji: '🍢', name: 'Seekh Kabab',           urdu: 'سیخ کباب',         category: 'BBQ',       price: 600,  cost: 380,  spicy: 2, rating: 4.8, active: true,  bestseller: true  },
  { id: 18, emoji: '🍗', name: 'Chicken Tikka',         urdu: 'چکن تکہ',          category: 'BBQ',       price: 750,  cost: 460,  spicy: 3, rating: 4.9, active: true,  bestseller: true  },
  { id: 19, emoji: '🥩', name: 'Beef Boti Kabab',       urdu: 'بوٹی کباب',        category: 'BBQ',       price: 800,  cost: 520,  spicy: 2, rating: 4.7, active: true,  bestseller: false },
  { id: 20, emoji: '🍢', name: 'Shami Kabab',           urdu: 'شامی کباب',        category: 'BBQ',       price: 400,  cost: 240,  spicy: 2, rating: 4.6, active: true,  bestseller: false },
  { id: 21, emoji: '🍗', name: 'Malai Boti',            urdu: 'ملائی بوٹی',       category: 'BBQ',       price: 850,  cost: 540,  spicy: 1, rating: 4.9, active: true,  bestseller: false },
  { id: 22, emoji: '🍗', name: 'BBQ Platter (4 pcs)',   urdu: 'بی بی کیو پلیٹر', category: 'BBQ',       price: 1200, cost: 760,  spicy: 2, rating: 4.8, active: true,  bestseller: false },
  // Bread
  { id: 23, emoji: '🫓', name: 'Naan',                  urdu: 'نان',              category: 'Bread',     price: 30,   cost: 12,   spicy: 0, rating: 4.5, active: true,  bestseller: false },
  { id: 24, emoji: '🫓', name: 'Roghni Naan',           urdu: 'روغنی نان',        category: 'Bread',     price: 50,   cost: 22,   spicy: 0, rating: 4.6, active: true,  bestseller: false },
  { id: 25, emoji: '🫓', name: 'Paratha',               urdu: 'پراٹھا',           category: 'Bread',     price: 60,   cost: 25,   spicy: 0, rating: 4.4, active: true,  bestseller: false },
  { id: 26, emoji: '🫓', name: 'Tandoori Roti',         urdu: 'تندوری روٹی',      category: 'Bread',     price: 20,   cost: 8,    spicy: 0, rating: 4.3, active: true,  bestseller: false },
  { id: 27, emoji: '🫓', name: 'Kulcha',                urdu: 'کلچہ',             category: 'Bread',     price: 70,   cost: 30,   spicy: 0, rating: 4.5, active: true,  bestseller: false },
  { id: 28, emoji: '🫓', name: 'Sheermal',              urdu: 'شیرمال',           category: 'Bread',     price: 80,   cost: 35,   spicy: 0, rating: 4.7, active: false, bestseller: false },
  // Drinks
  { id: 29, emoji: '🥛', name: 'Lassi (Sweet)',         urdu: 'لسی میٹھی',        category: 'Drinks',    price: 80,   cost: 30,   spicy: 0, rating: 4.7, active: true,  bestseller: true  },
  { id: 30, emoji: '☕', name: 'Chai (Doodh Patti)',    urdu: 'چائے',             category: 'Drinks',    price: 40,   cost: 12,   spicy: 0, rating: 4.8, active: true,  bestseller: true  },
  { id: 31, emoji: '🥤', name: 'Cold Drink (330ml)',    urdu: 'کولڈ ڈرنک',        category: 'Drinks',    price: 60,   cost: 35,   spicy: 0, rating: 4.0, active: true,  bestseller: false },
  { id: 32, emoji: '💧', name: 'Water Bottle (1.5L)',   urdu: 'پانی کی بوتل',     category: 'Drinks',    price: 50,   cost: 25,   spicy: 0, rating: 4.0, active: true,  bestseller: false },
  { id: 33, emoji: '🍹', name: 'Fresh Juice (Glass)',   urdu: 'تازہ جوس',         category: 'Drinks',    price: 120,  cost: 60,   spicy: 0, rating: 4.6, active: true,  bestseller: false },
  { id: 34, emoji: '🥛', name: 'Lassi (Salty)',         urdu: 'نمکین لسی',        category: 'Drinks',    price: 70,   cost: 25,   spicy: 0, rating: 4.5, active: true,  bestseller: false },
  { id: 35, emoji: '🫖', name: 'Kashmiri Chai',         urdu: 'کشمیری چائے',      category: 'Drinks',    price: 150,  cost: 70,   spicy: 0, rating: 4.9, active: true,  bestseller: false },
  // Desserts
  { id: 36, emoji: '🍮', name: 'Gulab Jamun (2 pcs)',   urdu: 'گلاب جامن',        category: 'Dessert',   price: 80,   cost: 35,   spicy: 0, rating: 4.7, active: true,  bestseller: false },
  { id: 37, emoji: '🍚', name: 'Kheer',                 urdu: 'کھیر',             category: 'Dessert',   price: 70,   cost: 30,   spicy: 0, rating: 4.5, active: true,  bestseller: false },
  { id: 38, emoji: '🍮', name: 'Shahi Tukra',           urdu: 'شاہی ٹکڑا',        category: 'Dessert',   price: 120,  cost: 55,   spicy: 0, rating: 4.8, active: true,  bestseller: false },
  { id: 39, emoji: '🍮', name: 'Halwa Sooji',           urdu: 'حلوہ سوجی',        category: 'Dessert',   price: 60,   cost: 25,   spicy: 0, rating: 4.4, active: true,  bestseller: false },
  { id: 40, emoji: '🍨', name: 'Kulfi (Mango)',         urdu: 'کلفی',             category: 'Dessert',   price: 100,  cost: 45,   spicy: 0, rating: 4.9, active: true,  bestseller: false },
  // Sides
  { id: 41, emoji: '🥗', name: 'Salad',                 urdu: 'سلاد',             category: 'Sides',     price: 60,   cost: 25,   spicy: 0, rating: 4.2, active: true,  bestseller: false },
  { id: 42, emoji: '🫙', name: 'Raita',                 urdu: 'رائتہ',            category: 'Sides',     price: 60,   cost: 20,   spicy: 0, rating: 4.3, active: true,  bestseller: false },
  { id: 43, emoji: '🫙', name: 'Achaar (Mixed)',        urdu: 'اچار',             category: 'Sides',     price: 40,   cost: 15,   spicy: 3, rating: 4.5, active: true,  bestseller: false },
  { id: 44, emoji: '🫙', name: 'Chutney Plate',         urdu: 'چٹنی',             category: 'Sides',     price: 50,   cost: 18,   spicy: 2, rating: 4.4, active: true,  bestseller: false },
  // Breakfast
  { id: 45, emoji: '🍳', name: 'Halwa Puri (Full)',     urdu: 'حلوہ پوری',        category: 'Breakfast', price: 250,  cost: 130,  spicy: 0, rating: 4.9, active: true,  bestseller: true  },
  { id: 46, emoji: '🥚', name: 'Anda Paratha',          urdu: 'انڈہ پراٹھا',      category: 'Breakfast', price: 120,  cost: 55,   spicy: 1, rating: 4.6, active: true,  bestseller: false },
  { id: 47, emoji: '🫘', name: 'Channay (Chana)',       urdu: 'چنے',              category: 'Breakfast', price: 150,  cost: 70,   spicy: 2, rating: 4.7, active: true,  bestseller: false },
  // Soups
  { id: 48, emoji: '🍜', name: 'Chicken Corn Soup',     urdu: 'چکن کورن سوپ',     category: 'Soups',     price: 180,  cost: 90,   spicy: 1, rating: 4.5, active: true,  bestseller: false },
  { id: 49, emoji: '🍜', name: 'Hot & Sour Soup',       urdu: 'ہاٹ اینڈ سور',    category: 'Soups',     price: 200,  cost: 100,  spicy: 3, rating: 4.4, active: true,  bestseller: false },
  { id: 50, emoji: '🍲', name: 'Aalo Yakhni Shorba',   urdu: 'یخنی شوربہ',       category: 'Soups',     price: 160,  cost: 80,   spicy: 1, rating: 4.6, active: true,  bestseller: false },
];

function SpicyDots({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3].map(i => (
        <div key={i} className={`w-2 h-2 rounded-full ${i <= level ? 'bg-red-500' : 'bg-muted'}`} />
      ))}
    </div>
  );
}

export default function MenuManagementPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [editItem, setEditItem] = useState<typeof menuItems[0] | null>(null);
  const [items, setItems] = useState(menuItems);

  const filtered = items.filter(item => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.urdu.includes(search);
    return matchCat && matchSearch;
  });

  const toggleActive = (id: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, active: !i.active } : i));
  };

  const totalActive = items.filter(i => i.active).length;
  const totalBestsellers = items.filter(i => i.bestseller).length;
  const avgMargin = Math.round(items.reduce((s, i) => s + ((i.price - i.cost) / i.price * 100), 0) / items.length);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground text-sm">Pakistani & Indian cuisine — {items.length} items across {CATEGORIES.length - 1} categories</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" /> Add Menu Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Items", value: items.length, sub: `${totalActive} active`, icon: Package, color: "text-foreground" },
          { label: "Bestsellers", value: totalBestsellers, sub: "marked items", icon: Star, color: "text-yellow-600" },
          { label: "Avg Margin", value: `${avgMargin}%`, sub: "across all items", icon: TrendingUp, color: "text-green-600" },
          { label: "Categories", value: CATEGORIES.length - 1, sub: "item groups", icon: Package, color: "text-blue-600" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4 flex items-center gap-3">
              <s.icon className={`h-5 w-5 ${s.color} shrink-0`} />
              <div>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-[10px] text-muted-foreground">{s.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Category Filter */}
      <div className="space-y-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search items or اردو نام..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                activeCategory === cat
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-background border-muted-foreground/20 hover:bg-muted'
              }`}>
              {cat}
              {cat !== 'All' && (
                <span className="ml-1 text-[10px] opacity-70">
                  ({items.filter(i => i.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filtered.map(item => {
          const margin = Math.round((item.price - item.cost) / item.price * 100);
          return (
            <Card key={item.id}
              className={`group hover:shadow-md transition-all cursor-pointer relative overflow-hidden ${!item.active ? 'opacity-50' : ''}`}>
              {item.bestseller && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 flex items-center gap-0.5">
                    <Star className="h-2.5 w-2.5 fill-white" /> Best
                  </Badge>
                </div>
              )}
              <CardContent className="p-3">
                {/* Emoji placeholder for image */}
                <div className={`w-full h-20 rounded-lg flex items-center justify-center text-4xl mb-2
                  ${item.category === 'Biryani' ? 'bg-orange-50 dark:bg-orange-950/30'
                    : item.category === 'Curry' ? 'bg-red-50 dark:bg-red-950/30'
                    : item.category === 'BBQ' ? 'bg-amber-50 dark:bg-amber-950/30'
                    : item.category === 'Bread' ? 'bg-yellow-50 dark:bg-yellow-950/30'
                    : item.category === 'Drinks' ? 'bg-blue-50 dark:bg-blue-950/30'
                    : item.category === 'Dessert' ? 'bg-pink-50 dark:bg-pink-950/30'
                    : 'bg-muted/50'}`}>
                  {item.emoji}
                </div>

                <div className="space-y-1">
                  <div>
                    <p className="font-semibold text-sm leading-tight">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground font-noto-nastaliq" dir="rtl">{item.urdu}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{item.category}</Badge>
                    {item.spicy > 0 && <SpicyDots level={item.spicy} />}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <p className="font-bold text-green-600">Rs. {item.price.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Cost: Rs. {item.cost} · {margin}% margin</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{item.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t mt-1.5">
                    <div className="flex items-center gap-1.5">
                      <Switch
                        checked={item.active}
                        onCheckedChange={() => toggleActive(item.id)}
                        className="scale-75 origin-left"
                      />
                      <span className="text-[10px] text-muted-foreground">{item.active ? 'Active' : 'Off'}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditItem(item)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-4xl mb-2">🔍</p>
          <p>No items found for "{search}"</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{editItem?.emoji}</span>
              {editItem?.name}
            </DialogTitle>
          </DialogHeader>
          {editItem && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Item Name</Label>
                  <Input defaultValue={editItem.name} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Category</Label>
                  <Select defaultValue={editItem.category}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.filter(c => c !== 'All').map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Selling Price (Rs.)</Label>
                  <Input type="number" defaultValue={editItem.price} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Cost Price (Rs.)</Label>
                  <Input type="number" defaultValue={editItem.cost} />
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Profit</span>
                  <span className="font-semibold text-green-600">Rs. {editItem.price - editItem.cost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Margin</span>
                  <span className="font-semibold">{Math.round((editItem.price - editItem.cost) / editItem.price * 100)}%</span>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => setEditItem(null)}>Save Changes</Button>
                <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
