'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Star, Users, Gift, TrendingUp, Search, Plus, Phone, Crown, Award } from "lucide-react";
import { cn } from "@/lib/utils";

type Tier = 'Silver' | 'Gold' | 'Platinum';

interface LoyaltyMember {
  id: number;
  name: string;
  phone: string;
  cardNo: string;
  tier: Tier;
  points: number;
  totalSpent: number;
  visits: number;
  joined: string;
  lastVisit: string;
}

const TIER_CONFIG: Record<Tier, { color: string; bg: string; icon: string; minPoints: number; nextTier?: string; nextPoints?: number; }> = {
  Silver:   { color: "text-gray-600",   bg: "bg-gray-100 border-gray-300",   icon: "🥈", minPoints: 0,    nextTier: "Gold",     nextPoints: 5000 },
  Gold:     { color: "text-amber-600",  bg: "bg-amber-50 border-amber-300",  icon: "🥇", minPoints: 5000, nextTier: "Platinum", nextPoints: 15000 },
  Platinum: { color: "text-purple-600", bg: "bg-purple-50 border-purple-300",icon: "💎", minPoints: 15000 },
};

const TIER_BENEFITS: Record<Tier, string[]> = {
  Silver:   ["5% discount on every order", "Birthday free dessert", "Priority queue"],
  Gold:     ["10% discount on every order", "Free drink on every 5th visit", "Birthday free meal (up to Rs.500)", "Dedicated cashier"],
  Platinum: ["15% discount on every order", "Monthly free meal (up to Rs.1,500)", "Free delivery on all orders", "VIP table reservation", "Personal account manager"],
};

const mockMembers: LoyaltyMember[] = [
  { id: 1,  name: "Muhammad Tariq",  phone: "0300-1234567", cardNo: "LYL-2026-0001", tier: "Platinum", points: 18450, totalSpent: 184500, visits: 62, joined: "2024-01-15", lastVisit: "2026-03-14" },
  { id: 2,  name: "Ayesha Siddiqui", phone: "0321-9876543", cardNo: "LYL-2026-0002", tier: "Gold",     points: 9200,  totalSpent: 92000,  visits: 41, joined: "2024-03-22", lastVisit: "2026-03-12" },
  { id: 3,  name: "Hassan Raza",     phone: "0333-5551234", cardNo: "LYL-2026-0003", tier: "Gold",     points: 6750,  totalSpent: 67500,  visits: 29, joined: "2024-06-10", lastVisit: "2026-03-10" },
  { id: 4,  name: "Fatima Malik",    phone: "0345-7788990", cardNo: "LYL-2026-0004", tier: "Silver",   points: 3200,  totalSpent: 32000,  visits: 18, joined: "2025-01-05", lastVisit: "2026-03-08" },
  { id: 5,  name: "Ahmed Khan",      phone: "0311-2233445", cardNo: "LYL-2026-0005", tier: "Silver",   points: 1850,  totalSpent: 18500,  visits: 11, joined: "2025-04-20", lastVisit: "2026-02-28" },
  { id: 6,  name: "Zainab Hussain",  phone: "0322-8899001", cardNo: "LYL-2026-0006", tier: "Platinum", points: 22100, totalSpent: 221000, visits: 84, joined: "2023-09-11", lastVisit: "2026-03-13" },
  { id: 7,  name: "Omar Farooq",     phone: "0301-4455667", cardNo: "LYL-2026-0007", tier: "Gold",     points: 7400,  totalSpent: 74000,  visits: 33, joined: "2024-07-30", lastVisit: "2026-03-05" },
  { id: 8,  name: "Sana Baig",       phone: "0313-6677889", cardNo: "LYL-2026-0008", tier: "Silver",   points: 4100,  totalSpent: 41000,  visits: 22, joined: "2024-11-12", lastVisit: "2026-03-01" },
];

export default function LoyaltyPage() {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<Tier | 'all'>('all');
  const [selected, setSelected] = useState<LoyaltyMember | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState('');

  const filtered = mockMembers.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search) || m.cardNo.toLowerCase().includes(search.toLowerCase());
    const matchTier = tierFilter === 'all' || m.tier === tierFilter;
    return matchSearch && matchTier;
  });

  const stats = {
    total: mockMembers.length,
    platinum: mockMembers.filter(m => m.tier === 'Platinum').length,
    gold: mockMembers.filter(m => m.tier === 'Gold').length,
    silver: mockMembers.filter(m => m.tier === 'Silver').length,
    totalPoints: mockMembers.reduce((s, m) => s + m.points, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Star className="h-6 w-6 text-amber-500" /> Loyalty Program
          </h1>
          <p className="text-muted-foreground text-sm">Silver, Gold & Platinum membership cards — earn and redeem points</p>
        </div>
        <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> Add Member
        </Button>
      </div>

      {/* Tier stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Members",     value: stats.total,                          icon: Users,     color: "text-blue-600" },
          { label: "🥈 Silver Members", value: stats.silver,                         icon: Award,     color: "text-gray-600" },
          { label: "🥇 Gold Members",   value: stats.gold,                           icon: Star,      color: "text-amber-600" },
          { label: "💎 Platinum",       value: stats.platinum,                       icon: Crown,     color: "text-purple-600" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4 flex items-start gap-3">
              <s.icon className={cn("h-8 w-8 mt-0.5", s.color)} />
              <div>
                <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tier benefits overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.entries(TIER_CONFIG) as [Tier, typeof TIER_CONFIG[Tier]][]).map(([tier, cfg]) => (
          <Card key={tier} className={cn("border-2", cfg.bg)}>
            <CardHeader className="pb-2">
              <CardTitle className={cn("text-base flex items-center gap-2", cfg.color)}>
                <span className="text-xl">{cfg.icon}</span> {tier} Card
                {cfg.minPoints > 0 && <span className="text-xs font-normal text-muted-foreground ml-auto">{cfg.minPoints.toLocaleString()}+ pts</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {TIER_BENEFITS[tier].map((b, i) => (
                <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-green-500 mt-0.5">✓</span>{b}
                </p>
              ))}
              <p className={cn("text-sm font-bold mt-2", cfg.color)}>
                {mockMembers.filter(m => m.tier === tier).length} active members
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search name, phone, card no..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {(['all', 'Silver', 'Gold', 'Platinum'] as const).map(t => (
          <button key={t} onClick={() => setTierFilter(t)}
            className={cn("px-3 py-2 rounded-lg text-xs font-semibold border transition-colors",
              tierFilter === t ? "bg-amber-500 text-white border-amber-500" : "bg-background border-border text-muted-foreground hover:bg-muted")}>
            {t === 'all' ? 'All Tiers' : `${TIER_CONFIG[t].icon} ${t}`}
          </button>
        ))}
      </div>

      {/* Members table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Member</th>
                  <th className="text-left p-3 font-semibold">Card No.</th>
                  <th className="text-left p-3 font-semibold">Tier</th>
                  <th className="text-right p-3 font-semibold">Points</th>
                  <th className="text-right p-3 font-semibold">Total Spent</th>
                  <th className="text-right p-3 font-semibold">Visits</th>
                  <th className="text-left p-3 font-semibold">Last Visit</th>
                  <th className="text-center p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => {
                  const cfg = TIER_CONFIG[m.tier];
                  const nextPts = cfg.nextPoints;
                  const progress = nextPts ? Math.min(100, (m.points / nextPts) * 100) : 100;
                  return (
                    <tr key={m.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <p className="font-semibold">{m.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{m.phone}</p>
                      </td>
                      <td className="p-3 font-mono text-xs text-primary font-semibold">{m.cardNo}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={cn("text-xs font-semibold", cfg.color, cfg.bg)}>
                          {cfg.icon} {m.tier}
                        </Badge>
                        {cfg.nextTier && (
                          <div className="mt-1.5 w-24">
                            <Progress value={progress} className="h-1" />
                            <p className="text-[10px] text-muted-foreground mt-0.5">{(cfg.nextPoints! - m.points).toLocaleString()} to {cfg.nextTier}</p>
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-right font-bold text-amber-600">{m.points.toLocaleString()}</td>
                      <td className="p-3 text-right text-green-700 font-semibold">Rs. {m.totalSpent.toLocaleString()}</td>
                      <td className="p-3 text-right">{m.visits}</td>
                      <td className="p-3 text-muted-foreground text-xs">{m.lastVisit}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => { setSelected(m); setRedeemOpen(true); }}>
                            <Gift className="h-3 w-3 mr-1" /> Redeem
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={() => setSelected(m)}>
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Redeem Points Dialog */}
      <Dialog open={redeemOpen && !!selected} onOpenChange={() => { setRedeemOpen(false); setRedeemPoints(''); }}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Gift className="h-4 w-4 text-amber-500" /> Redeem Points</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 py-1">
              <div className="rounded-lg bg-muted p-3 space-y-1 text-sm">
                <p className="font-semibold">{selected.name}</p>
                <p className="text-muted-foreground">{selected.cardNo} · {TIER_CONFIG[selected.tier].icon} {selected.tier}</p>
                <p className="text-xl font-bold text-amber-600 mt-1">{selected.points.toLocaleString()} pts available</p>
                <p className="text-xs text-muted-foreground">1 point = Rs. 1 discount</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Points to Redeem</Label>
                <Input type="number" placeholder="e.g. 500" value={redeemPoints} onChange={e => setRedeemPoints(e.target.value)} max={selected.points} />
                {redeemPoints && !isNaN(Number(redeemPoints)) && (
                  <p className="text-xs text-green-700 font-medium">= Rs. {Number(redeemPoints).toLocaleString()} discount on this order</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => { setRedeemOpen(false); setRedeemPoints(''); }}>Cancel</Button>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => { setRedeemOpen(false); setRedeemPoints(''); }}>
              Apply to Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="h-4 w-4" /> Add Loyalty Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="space-y-1"><Label className="text-xs">Full Name</Label><Input placeholder="e.g. Muhammad Ali" className="text-sm" /></div>
            <div className="space-y-1"><Label className="text-xs">Phone Number</Label><Input placeholder="0300-0000000" className="text-sm" /></div>
            <div className="space-y-1">
              <Label className="text-xs">Starting Tier</Label>
              <div className="flex gap-2">
                {(['Silver', 'Gold'] as Tier[]).map(t => (
                  <button key={t} className="flex-1 py-2 rounded-lg border text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors">
                    {TIER_CONFIG[t].icon} {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => setAddOpen(false)}>Issue Card</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
