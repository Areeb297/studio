'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import { PlusCircle, Search, ChevronRight, ArrowLeft, LayoutGrid } from "lucide-react";

// ── Styles ────────────────────────────────────────────────────────────────────
const tooltipStyle = {
  backgroundColor: 'hsl(var(--background))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '12px',
};

const TREEMAP_COLORS = [
  '#14B8A6','#8B5CF6','#3B82F6','#F59E0B',
  '#EF4444','#10B981','#F97316','#EC4899','#6366F1','#84CC16',
];

const typeBadgeStyle: Record<string, string> = {
  CON: 'bg-blue-100 text-blue-700 border-blue-300',
  RAW: 'bg-amber-100 text-amber-700 border-amber-300',
  FIN: 'bg-green-100 text-green-700 border-green-300',
  PAK: 'bg-purple-100 text-purple-700 border-purple-300',
};

// ── Top-level category data (real DB counts) ──────────────────────────────────
const categoryData = [
  { name: 'CONSUMABLE ITEMS',  size: 1106 },
  { name: 'CONSUMABLE-OTHERS', size: 414  },
  { name: 'RAW-SPICES',        size: 70   },
  { name: 'CON-CROCKERY',      size: 68   },
  { name: 'CON-HYGIENE',       size: 40   },
  { name: 'RAW-GROCERY',       size: 40   },
  { name: 'FIN-BEVERAGES',     size: 37   },
  { name: 'RAW-VEGETABLES',    size: 36   },
  { name: 'CON-STATIONERY',    size: 35   },
  { name: 'RAW-FRUITS/DRY',    size: 26   },
];

// ── Drill-down items per category (real DB data) ──────────────────────────────
type DrillItem = { code: string; name: string; type: string; unit: string; reorder: number };

const drilldownData: Record<string, DrillItem[]> = {
  'CONSUMABLE ITEMS': [
    { code: 'CONSTA-0006',  name: 'WALL CLOCK',              type: 'CON', unit: 'NO.',  reorder: 20 },
    { code: 'CONSTA-0009',  name: 'PUNCH MACHINE',           type: 'CON', unit: 'NO.',  reorder: 20 },
    { code: 'CONSTA-0014',  name: 'MOUSE PAD',               type: 'CON', unit: 'NO.',  reorder: 20 },
    { code: 'CONSTA-0034',  name: 'REVOLVE CHAIR',           type: 'CON', unit: 'NO.',  reorder: 20 },
    { code: 'CONSTA-0046',  name: 'FERTILIZER',              type: 'CON', unit: 'KG',   reorder: 20 },
    { code: 'CONSTA-0051',  name: 'TARPAL',                  type: 'CON', unit: 'PCS',  reorder: 20 },
    { code: 'CONSTA-0060',  name: 'KIDS BISCUITS & CHOC.',   type: 'CON', unit: 'PKT',  reorder: 20 },
    { code: 'CONSTA-0067',  name: 'LED BULB 30W',            type: 'CON', unit: 'PCS',  reorder: 20 },
  ],
  'CONSUMABLE-OTHERS': [
    { code: 'CONOTH-00060004', name: 'READY MADE SUIT (GENTS)',   type: 'CON', unit: 'PCS',  reorder: 20 },
    { code: 'CONOTH-00060005', name: 'LONG COURT COOK BLUE',      type: 'CON', unit: 'PCS',  reorder: 20 },
    { code: 'CONOTH-00060010', name: 'TAKE AWAY MENU',            type: 'CON', unit: 'PCS',  reorder: 20 },
    { code: 'CONOTH-00060012', name: 'MOP STICK (POONCHA)',       type: 'CON', unit: 'PCS',  reorder: 20 },
    { code: 'CONOTH-00060013', name: 'CAP COOK',                  type: 'CON', unit: 'PKT',  reorder: 20 },
    { code: 'CONOTH-00060015', name: 'REQUISITION BOOK (STORE)',  type: 'CON', unit: 'NO.',  reorder: 20 },
    { code: 'CONOTH-00060016', name: 'COMMENTS CARD',             type: 'CON', unit: 'NO.',  reorder: 20 },
    { code: 'CONOTH-00060018', name: 'NAPKIN BROWN',              type: 'CON', unit: 'NO.',  reorder: 20 },
  ],
  'RAW-SPICES': [
    { code: 'RAWSPI-00100001', name: 'CHICKEN POWDER',                        type: 'RAW', unit: 'KG',  reorder: 10 },
    { code: 'RAWSPI-00100002', name: 'BLACK PEPPER POWDER (KALI MIRCH)',      type: 'RAW', unit: 'KG',  reorder: 10 },
    { code: 'RAWSPI-00100003', name: 'COCONUT POWDER',                        type: 'RAW', unit: 'KG',  reorder: 10 },
    { code: 'RAWSPI-00100004', name: 'CORIANDER POWDER (DHANIA)',             type: 'RAW', unit: 'KG',  reorder: 10 },
    { code: 'RAWSPI-00100006', name: 'MUSTARD POWDER 100GMS',                 type: 'RAW', unit: 'PKT', reorder: 10 },
    { code: 'RAWSPI-00100007', name: 'RED CHILLI POWDER (LAL MIRCH)',         type: 'RAW', unit: 'KG',  reorder: 10 },
    { code: 'RAWSPI-00100008', name: 'CORIANDER WHOLE (DHANIA SABIT)',        type: 'RAW', unit: 'KG',  reorder: 10 },
    { code: 'RAWSPI-00100009', name: 'WHITE PEPPER POWDER (SAFED MIRCH)',     type: 'RAW', unit: 'KG',  reorder: 10 },
  ],
  'CON-CROCKERY': [
    { code: 'CONCRO-00040001', name: 'DINNER PLATE',      type: 'CON', unit: 'PCS', reorder: 20 },
    { code: 'CONCRO-00040002', name: 'QUARTER PLATE',     type: 'CON', unit: 'PCS', reorder: 20 },
    { code: 'CONCRO-00040003', name: 'GLASS',             type: 'CON', unit: 'PCS', reorder: 20 },
    { code: 'CONCRO-00040004', name: 'TABLE SPOONS',      type: 'CON', unit: 'PCS', reorder: 20 },
    { code: 'CONCRO-00040005', name: 'TEA SPOONS',        type: 'CON', unit: 'PCS', reorder: 20 },
    { code: 'CONCRO-00040006', name: 'TEA CUP & SAUCER',  type: 'CON', unit: 'PCS', reorder: 20 },
    { code: 'CONCRO-00040007', name: 'TEA MUG',           type: 'CON', unit: 'PCS', reorder: 20 },
    { code: 'CONCRO-00040009', name: 'TEA POTS',          type: 'CON', unit: 'PCS', reorder: 20 },
  ],
  'CON-HYGIENE': [
    { code: 'CONHYG-00030001', name: 'TOILET ROLL',         type: 'CON', unit: 'PCS', reorder: 20 },
    { code: 'CONHYG-00030002', name: 'AIR FRESHENER SPRAY', type: 'CON', unit: 'PCS', reorder: 20 },
    { code: 'CONHYG-00030003', name: 'FLY KILLER SPRAY',    type: 'CON', unit: 'PCS', reorder: 20 },
    { code: 'CONHYG-00030004', name: 'LIQUID SOAP',         type: 'CON', unit: 'LTR', reorder: 20 },
    { code: 'CONHYG-00030005', name: 'TOILET SOAP',         type: 'CON', unit: 'PCS', reorder: 20 },
    { code: 'CONHYG-00030006', name: 'PHENYLE',             type: 'CON', unit: 'LTR', reorder: 20 },
    { code: 'CONHYG-00030007', name: 'MOP (POCHA)',         type: 'CON', unit: 'PCS', reorder: 20 },
    { code: 'CONHYG-00030008', name: 'JHAROO (TINKA)',      type: 'CON', unit: 'PCS', reorder: 20 },
  ],
  'RAW-GROCERY': [
    { code: 'RAWGRO-00110001', name: 'ICING SUGAR 1 KG PACK', type: 'RAW', unit: 'PKT', reorder: 10 },
    { code: 'RAWGRO-00110002', name: 'WHITE CHANA WHOLE',     type: 'RAW', unit: 'KG',  reorder: 10 },
    { code: 'RAWGRO-00110003', name: 'WHITE CHANA POWDER',    type: 'RAW', unit: 'KG',  reorder: 10 },
    { code: 'RAWGRO-00110004', name: 'CORN FLOUR',            type: 'RAW', unit: 'KG',  reorder: 10 },
    { code: 'RAWGRO-00110005', name: 'DAAL CHANNA',           type: 'RAW', unit: 'KG',  reorder: 10 },
    { code: 'RAWGRO-00110006', name: 'DAAL MASOOR',           type: 'RAW', unit: 'KG',  reorder: 10 },
    { code: 'RAWGRO-00110007', name: 'DAAL MASH',             type: 'RAW', unit: 'KG',  reorder: 10 },
    { code: 'RAWGRI-00110014', name: 'KEWERA ESSENCE',        type: 'RAW', unit: 'BTL', reorder: 10 },
  ],
  'FIN-BEVERAGES': [
    { code: 'FINBEV-00010001', name: 'COLD DRINK REGULAR PEPSI',   type: 'FIN', unit: 'BTL', reorder: 10 },
    { code: 'FINBEV-00010002', name: 'COLD DRINK N/R PEPSI',       type: 'FIN', unit: 'BTL', reorder: 10 },
    { code: 'FINBEV-00010003', name: 'COLD DRINK 1.5 LTR PEPSI',   type: 'FIN', unit: 'BTL', reorder: 10 },
    { code: 'FINBEV-00010004', name: 'COLD DRINK 2.25 LTR PEPSI',  type: 'FIN', unit: 'BTL', reorder: 10 },
    { code: 'FINBEV-00010008', name: 'COLD DRINK 2.25 LTR COKE',   type: 'FIN', unit: 'BTL', reorder: 10 },
    { code: 'FINBEV-00010009', name: 'MINERAL WATER NESTLE (L)',    type: 'FIN', unit: 'BTL', reorder: 10 },
    { code: 'FINBEV-00010010', name: 'MINERAL WATER NESTLE (S)',    type: 'FIN', unit: 'BTL', reorder: 10 },
    { code: 'FINBEV-00010011', name: 'CAN 300 ML PEPSI',           type: 'FIN', unit: 'PCS', reorder: 10 },
  ],
  'RAW-VEGETABLES': [
    { code: 'RAWVEG-00130001', name: 'ONION (PIAZ)',          type: 'RAW', unit: 'KG', reorder: 10 },
    { code: 'RAWVEG-00130002', name: 'POTATO (AALOO)',        type: 'RAW', unit: 'KG', reorder: 10 },
    { code: 'RAWVEG-00130004', name: 'GINGER (ADRAK)',        type: 'RAW', unit: 'KG', reorder: 10 },
    { code: 'RAWVEG-00130005', name: 'GARLIC (LAHSAN)',       type: 'RAW', unit: 'KG', reorder: 10 },
    { code: 'RAWVEG-00130006', name: 'CARROT (GAJAR)',        type: 'RAW', unit: 'KG', reorder: 10 },
    { code: 'RAWVEG-00130007', name: 'CABBAGE (BUND GOBHI)',  type: 'RAW', unit: 'KG', reorder: 10 },
  ],
  'CON-STATIONERY': [
    { code: 'CONSTA-00010002', name: 'ROUGH PHOTOCOPY PAPER', type: 'CON', unit: 'KG',  reorder: 20 },
    { code: 'CONSTA-00010006', name: 'ENVELOPES (LEGAL)',     type: 'CON', unit: 'NO.', reorder: 20 },
    { code: 'CONSTA-00010007', name: 'MARKERS (CHOTA)',       type: 'CON', unit: 'PCS', reorder: 20 },
    { code: 'CONSTA-00010008', name: 'MARKERS (BARA)',        type: 'CON', unit: 'PCS', reorder: 20 },
    { code: 'CONSTA-00010010', name: 'BOX FILE',              type: 'CON', unit: 'NO.', reorder: 20 },
    { code: 'CONSTA-00010011', name: 'WHITE NOTEBOOK',        type: 'CON', unit: 'PCS', reorder: 20 },
    { code: 'CONSTA-00010014', name: 'PENCIL',                type: 'CON', unit: 'PCS', reorder: 20 },
    { code: 'CONSTA-00010016', name: 'RAZOR',                 type: 'CON', unit: 'PCS', reorder: 20 },
  ],
  'RAW-FRUITS/DRY': [
    { code: 'RAWFRU-00120001', name: 'KAJOO',                    type: 'RAW', unit: 'KG',  reorder: 10 },
    { code: 'RAWFRU-00120003', name: 'MIX FRUIT 836GMS TIN',     type: 'RAW', unit: 'PCS', reorder: 10 },
    { code: 'RAWFRU-00120004', name: 'MUSHROOM 400GMS TIN',      type: 'RAW', unit: 'PCS', reorder: 10 },
    { code: 'RAWFRU-00120005', name: 'PINE APPLE 565GMS TIN',    type: 'RAW', unit: 'PCS', reorder: 10 },
    { code: 'RAWFRU-00120007', name: 'OLIVE BLACK 920 GMS TIN',  type: 'RAW', unit: 'PCS', reorder: 10 },
    { code: 'RAWFRU-00120008', name: 'DATES (KHAJOOR)',          type: 'RAW', unit: 'KG',  reorder: 10 },
  ],
};

// ── All items for top-level table ─────────────────────────────────────────────
const allItems: DrillItem[] = [
  { code: 'RAWLIV-00170006', name: 'GOAT (BAKRA) A',            type: 'RAW', unit: 'NO.',  reorder: 10 },
  { code: 'RAWBAK-00160001', name: 'BUN',                       type: 'RAW', unit: 'PCS',  reorder: 10 },
  { code: 'RAWBAK-00160002', name: 'BREAD',                     type: 'RAW', unit: 'PCS',  reorder: 10 },
  { code: 'RAWBAK-00160003', name: 'SMALL BUN',                 type: 'RAW', unit: 'PCS',  reorder: 10 },
  { code: 'RAWBAK-00160004', name: 'BIG BUN',                   type: 'RAW', unit: 'PCS',  reorder: 10 },
  { code: 'CONCRO-00040001', name: 'DINNER PLATE',              type: 'CON', unit: 'PCS',  reorder: 20 },
  { code: 'CONCRO-00040002', name: 'QUARTER PLATE',             type: 'CON', unit: 'PCS',  reorder: 20 },
  { code: 'CONCRO-00040003', name: 'GLASS',                     type: 'CON', unit: 'PCS',  reorder: 20 },
  { code: 'CONCRO-00040004', name: 'TABLE SPOONS',              type: 'CON', unit: 'PCS',  reorder: 20 },
  { code: 'CONCRO-00040005', name: 'TEA SPOONS',                type: 'CON', unit: 'PCS',  reorder: 20 },
  { code: 'CONCRO-00040006', name: 'TEA CUP & SAUCER',          type: 'CON', unit: 'PCS',  reorder: 20 },
  { code: 'FINBEV-00010001', name: 'COLD DRINK REGULAR PEPSI',  type: 'FIN', unit: 'BTL',  reorder: 10 },
  { code: 'FINBEV-00010002', name: 'COLD DRINK N/R PEPSI',      type: 'FIN', unit: 'BTL',  reorder: 10 },
  { code: 'PAKBOX-00020001', name: 'PIZZA BOX (L)',             type: 'PAK', unit: 'BOX',  reorder: 10 },
  { code: 'PAKBOX-00020002', name: 'PIZZA BOX (M)',             type: 'PAK', unit: 'BOX',  reorder: 10 },
];

// ── Custom treemap tile ───────────────────────────────────────────────────────
const CustomContent = (props: any) => {
  const { x, y, width, height, name, index, value } = props;
  if (!name || width < 30 || height < 20) return null;
  return (
    <g style={{ cursor: 'pointer' }}>
      <rect
        x={x} y={y} width={width} height={height}
        fill={TREEMAP_COLORS[index % TREEMAP_COLORS.length]}
        rx={4} opacity={0.88}
      />
      {/* hover overlay */}
      <rect x={x} y={y} width={width} height={height} fill="transparent" rx={4}
        className="treemap-tile-hover"
        style={{ transition: 'opacity 150ms' }}
      />
      {width > 60 && height > 30 && (
        <text x={x + width / 2} y={y + height / 2 - (height > 50 ? 8 : 0)}
          textAnchor="middle" dominantBaseline="middle"
          fill="#fff" fontSize={11} fontWeight="600">
          {name.length > 14 ? name.slice(0, 13) + '…' : name}
        </text>
      )}
      {width > 60 && height > 50 && (
        <text x={x + width / 2} y={y + height / 2 + 10}
          textAnchor="middle" dominantBaseline="middle"
          fill="#fff" fontSize={10} opacity={0.85}>
          {value.toLocaleString()} items
        </text>
      )}
      {width > 80 && height > 65 && (
        <text x={x + width / 2} y={y + height / 2 + 24}
          textAnchor="middle" dominantBaseline="middle"
          fill="#fff" fontSize={9} opacity={0.7}>
          click to drill down
        </text>
      )}
    </g>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ItemsMasterPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // resolve display items: drilldown OR top-level
  const displayItems: DrillItem[] = selectedCategory
    ? (drilldownData[selectedCategory] ?? [])
    : allItems;

  const categoryTotal = selectedCategory
    ? categoryData.find(c => c.name === selectedCategory)?.size ?? 0
    : 2114;

  const filtered = displayItems.filter(i => {
    const matchSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.code.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || i.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleTreemapClick = (node: any) => {
    if (node?.name) setSelectedCategory(node.name);
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setSearch('');
    setTypeFilter('All');
  };

  const catColor = selectedCategory
    ? TREEMAP_COLORS[categoryData.findIndex(c => c.name === selectedCategory) % TREEMAP_COLORS.length]
    : '#14B8A6';

  return (
    <div className="space-y-6 p-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          {selectedCategory ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <button onClick={handleBack} className="hover:text-foreground transition-colors">
                All Categories
              </button>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-semibold text-foreground">{selectedCategory}</span>
            </div>
          ) : null}
          <h1 className="text-3xl font-bold">
            {selectedCategory ?? 'Items Master'}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {selectedCategory
              ? `${categoryTotal.toLocaleString()} items in this category · showing ${filtered.length} sample records`
              : '2,114 items · 47 categories · 4 types (CON, RAW, FIN, PAK)'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedCategory && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleBack}>
              <ArrowLeft className="h-3.5 w-3.5" />Back to All
            </Button>
          )}
          <Button size="sm" className="gap-1.5">
            <PlusCircle className="h-4 w-4" />Add Item
          </Button>
        </div>
      </div>

      {/* ── Treemap (top-level) or Drilldown Banner ── */}
      {!selectedCategory ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-primary" />Items by Category
            </CardTitle>
            <CardDescription className="text-xs">
              Click any tile to drill down into that category · top 10 of 47 categories · real data from ERP_New
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <Treemap
                data={categoryData}
                dataKey="size"
                aspectRatio={4 / 3}
                content={<CustomContent />}
                onClick={handleTreemapClick}
                style={{ cursor: 'pointer' }}
              >
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(val: number, _: string, props: any) => [
                    `${props.payload?.name ?? ''}: ${Number(val).toLocaleString()} items`,
                  ]}
                />
              </Treemap>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : (
        /* Drilldown category banner */
        <div
          className="rounded-xl px-5 py-4 flex items-center justify-between"
          style={{ background: catColor, opacity: 0.92 }}
        >
          <div>
            <p className="text-white/80 text-xs font-medium uppercase tracking-wide">Category</p>
            <p className="text-white text-xl font-bold mt-0.5">{selectedCategory}</p>
            <p className="text-white/80 text-sm mt-0.5">{categoryTotal.toLocaleString()} total items</p>
          </div>
          <div className="flex gap-4 text-white text-center">
            {['CON','RAW','FIN','PAK'].map(t => {
              const cnt = displayItems.filter(i => i.type === t).length;
              return cnt > 0 ? (
                <div key={t}>
                  <p className="text-lg font-bold">{cnt}</p>
                  <p className="text-white/70 text-xs">{t}</p>
                </div>
              ) : null;
            })}
            <div>
              <p className="text-lg font-bold">{displayItems.length}</p>
              <p className="text-white/70 text-xs">shown</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Category mini-treemap (drilldown level) ── */}
      {selectedCategory && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-primary" />All Categories
              <span className="text-muted-foreground font-normal">— click to switch</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <Treemap
                data={categoryData}
                dataKey="size"
                aspectRatio={4 / 3}
                content={<CustomContent />}
                onClick={handleTreemapClick}
                style={{ cursor: 'pointer' }}
              >
                <Tooltip contentStyle={tooltipStyle}
                  formatter={(val: number, _: string, props: any) => [
                    `${props.payload?.name ?? ''}: ${Number(val).toLocaleString()} items`,
                  ]}
                />
              </Treemap>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* ── Search + Filter ── */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or code..."
            className="pl-8"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['All', 'CON', 'RAW', 'FIN', 'PAK'].map(t => (
            <Button
              key={t}
              variant={typeFilter === t ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter(t)}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Items Table ── */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">
                {selectedCategory ? `${selectedCategory} — Items` : 'Item Catalog'}
              </CardTitle>
              <CardDescription className="text-xs">
                {selectedCategory
                  ? `Showing ${filtered.length} sample records of ${categoryTotal.toLocaleString()} in this category`
                  : `Showing ${filtered.length} of 2,114 items`}
              </CardDescription>
            </div>
            {selectedCategory && (
              <Badge
                className="text-xs px-2 py-1"
                style={{ background: catColor, color: '#fff', border: 'none' }}
              >
                {selectedCategory}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="text-center">Unit</TableHead>
                <TableHead className="text-center">Reorder Level</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10 text-sm">
                    No items found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(row => (
                  <TableRow key={row.code} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs">{row.code}</TableCell>
                    <TableCell className="font-medium text-sm">{row.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={typeBadgeStyle[row.type]}>{row.type}</Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm">{row.unit}</TableCell>
                    <TableCell className="text-center text-sm tabular-nums">{row.reorder}</TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-green-100 text-green-700 border-green-300">Active</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
