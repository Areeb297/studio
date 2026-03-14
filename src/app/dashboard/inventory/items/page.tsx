'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';

const tooltipStyle = { backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' };

const TREEMAP_COLORS = ['#14B8A6', '#8B5CF6', '#3B82F6', '#F59E0B', '#EF4444', '#10B981', '#F97316', '#EC4899', '#6366F1', '#84CC16'];

const categoryData = [
  { name: 'MEAT & POULTRY', size: 284 },
  { name: 'GRAINS & PULSES', size: 198 },
  { name: 'VEGETABLES & FRESH', size: 176 },
  { name: 'SPICES & CONDIMENTS', size: 154 },
  { name: 'COOKING ESSENTIALS', size: 143 },
  { name: 'CROCKERY & UTENSILS', size: 112 },
  { name: 'CLEANING & HYGIENE', size: 98 },
  { name: 'ELECTRICAL ITEMS', size: 87 },
  { name: 'CONSTRUCTION MATL.', size: 64 },
  { name: 'OTHER', size: 798 },
];

const typeBadgeStyle: Record<string, string> = {
  CON: 'bg-blue-100 text-blue-700 border-blue-300',
  RAW: 'bg-amber-100 text-amber-700 border-amber-300',
  FIN: 'bg-green-100 text-green-700 border-green-300',
  PAK: 'bg-purple-100 text-purple-700 border-purple-300',
};

const items = [
  { code: 'ITEM-0001', name: 'GOAT BAKRA A', type: 'RAW', category: 'MEAT & POULTRY', unit: 'KG', reorder: 20, status: 'Active' },
  { code: 'ITEM-0002', name: 'KALEJI', type: 'RAW', category: 'MEAT & POULTRY', unit: 'KG', reorder: 5, status: 'Active' },
  { code: 'ITEM-0003', name: 'CHICKEN WHOLE', type: 'RAW', category: 'MEAT & POULTRY', unit: 'KG', reorder: 50, status: 'Active' },
  { code: 'ITEM-0004', name: 'BRAIN', type: 'RAW', category: 'MEAT & POULTRY', unit: 'KG', reorder: 3, status: 'Active' },
  { code: 'ITEM-0005', name: 'COW (GAI)', type: 'RAW', category: 'MEAT & POULTRY', unit: 'KG', reorder: 30, status: 'Active' },
  { code: 'ITEM-0006', name: 'COOKING OIL 16L', type: 'CON', category: 'COOKING ESSENTIALS', unit: 'TIN', reorder: 10, status: 'Active' },
  { code: 'ITEM-0007', name: 'BASMATI RICE', type: 'CON', category: 'GRAINS & PULSES', unit: 'KG', reorder: 100, status: 'Active' },
  { code: 'ITEM-0008', name: 'ATTA FLOUR', type: 'CON', category: 'GRAINS & PULSES', unit: 'KG', reorder: 80, status: 'Active' },
  { code: 'ITEM-0009', name: 'RED CHILLI', type: 'CON', category: 'SPICES & CONDIMENTS', unit: 'KG', reorder: 10, status: 'Active' },
  { code: 'ITEM-0010', name: 'SALT', type: 'CON', category: 'SPICES & CONDIMENTS', unit: 'KG', reorder: 20, status: 'Active' },
  { code: 'ITEM-0011', name: 'SUGAR', type: 'CON', category: 'COOKING ESSENTIALS', unit: 'KG', reorder: 50, status: 'Active' },
  { code: 'ITEM-0012', name: 'ONION', type: 'CON', category: 'VEGETABLES & FRESH', unit: 'KG', reorder: 30, status: 'Active' },
  { code: 'ITEM-0013', name: 'TOMATO PASTE', type: 'CON', category: 'VEGETABLES & FRESH', unit: 'TIN', reorder: 15, status: 'Active' },
  { code: 'ITEM-0014', name: 'BEEF UNDERCUT', type: 'RAW', category: 'MEAT & POULTRY', unit: 'KG', reorder: 25, status: 'Active' },
  { code: 'ITEM-0015', name: 'TUKH MALANGA', type: 'CON', category: 'SPICES & CONDIMENTS', unit: 'KG', reorder: 5, status: 'Active' },
];

const CustomContent = (props: any) => {
  const { x, y, width, height, name, index, value } = props;
  if (width < 30 || height < 20) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={TREEMAP_COLORS[index % TREEMAP_COLORS.length]} rx={4} opacity={0.85} />
      {width > 60 && height > 30 && (
        <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={11} fontWeight="600">
          {name.length > 14 ? name.slice(0, 13) + '…' : name}
        </text>
      )}
      {width > 60 && height > 50 && (
        <text x={x + width / 2} y={y + height / 2 + 16} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={10} opacity={0.85}>
          {value} items
        </text>
      )}
    </g>
  );
};

export default function ItemsMasterPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = items.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || i.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Items Master</h1>
          <p className="text-muted-foreground mt-1">2,114 items · 47 categories · 4 types (CON, RAW, FIN, PAK)</p>
        </div>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Treemap */}
      <Card>
        <CardHeader>
          <CardTitle>Items by Category</CardTitle>
          <CardDescription>Area represents item count per category (top 10 categories)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <Treemap
              data={categoryData}
              dataKey="size"
              aspectRatio={4 / 3}
              content={<CustomContent />}
            >
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(val: number, _name: string, props: any) => [props.payload?.name ? `${props.payload.name}: ${val} items` : `${val} items`]}
              />
            </Treemap>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Search + Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or code..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['All', 'CON', 'RAW', 'FIN', 'PAK'].map((t) => (
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

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Item Catalog</CardTitle>
          <CardDescription>Showing {filtered.length} of 2,114 items</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Unit</TableHead>
                <TableHead className="text-center">Reorder Level</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.code}>
                  <TableCell className="font-mono text-sm">{row.code}</TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={typeBadgeStyle[row.type]}>{row.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{row.category}</TableCell>
                  <TableCell className="text-center text-sm">{row.unit}</TableCell>
                  <TableCell className="text-center text-sm">{row.reorder}</TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-green-100 text-green-700 border-green-300">{row.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
