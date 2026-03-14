'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Flame,
  ChevronDown,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChefHat,
  Utensils,
  Timer,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Station = 'Grill' | 'Fry' | 'Cold' | 'Bakery' | 'Curry';
type OrderType = 'Dine-in' | 'Takeaway' | 'Delivery' | 'Mess';
type TicketStatus = 'NEW' | 'PREPARING' | 'READY';

interface KOTItem {
  name: string;
  qty: number;
  station: Station;
}

interface KOTTicket {
  id: string;
  kotNumber: string;
  orderType: OrderType;
  table?: string;
  elapsedMin: number;
  items: KOTItem[];
  status: TicketStatus;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialTickets: KOTTicket[] = [
  // NEW
  {
    id: '382',
    kotNumber: 'KOT-0382',
    orderType: 'Dine-in',
    table: 'T-8',
    elapsedMin: 1,
    items: [
      { name: 'Mutton Biryani', qty: 2, station: 'Curry' },
      { name: 'Naan', qty: 4, station: 'Bakery' },
      { name: 'Lassi', qty: 2, station: 'Cold' },
    ],
    status: 'NEW',
  },
  {
    id: '383',
    kotNumber: 'KOT-0383',
    orderType: 'Takeaway',
    elapsedMin: 2,
    items: [
      { name: 'Seekh Kabab', qty: 3, station: 'Grill' },
      { name: 'Naan', qty: 6, station: 'Bakery' },
      { name: 'Raita', qty: 2, station: 'Cold' },
    ],
    status: 'NEW',
  },
  {
    id: '384',
    kotNumber: 'KOT-0384',
    orderType: 'Delivery',
    elapsedMin: 3,
    items: [
      { name: 'Daal Makhani', qty: 2, station: 'Curry' },
      { name: 'Roti', qty: 4, station: 'Bakery' },
    ],
    status: 'NEW',
  },
  // PREPARING
  {
    id: '381',
    kotNumber: 'KOT-0381',
    orderType: 'Dine-in',
    table: 'T-12',
    elapsedMin: 7,
    items: [
      { name: 'Chicken Karahi', qty: 1, station: 'Curry' },
      { name: 'Mutton Karahi', qty: 1, station: 'Curry' },
      { name: 'Naan', qty: 4, station: 'Bakery' },
    ],
    status: 'PREPARING',
  },
  {
    id: '380',
    kotNumber: 'KOT-0380',
    orderType: 'Takeaway',
    elapsedMin: 9,
    items: [
      { name: 'Chicken Biryani', qty: 2, station: 'Curry' },
      { name: 'Raita', qty: 2, station: 'Cold' },
    ],
    status: 'PREPARING',
  },
  {
    id: '379',
    kotNumber: 'KOT-0379',
    orderType: 'Mess',
    elapsedMin: 11,
    items: [
      { name: 'Daal Tadka', qty: 4, station: 'Curry' },
      { name: 'Roti', qty: 8, station: 'Bakery' },
      { name: 'Salad', qty: 4, station: 'Cold' },
    ],
    status: 'PREPARING',
  },
  // READY
  {
    id: '378',
    kotNumber: 'KOT-0378',
    orderType: 'Dine-in',
    table: 'T-7',
    elapsedMin: 14,
    items: [
      { name: 'Nihari', qty: 2, station: 'Curry' },
      { name: 'Naan', qty: 4, station: 'Bakery' },
      { name: 'Chai', qty: 2, station: 'Cold' },
    ],
    status: 'READY',
  },
  {
    id: '377',
    kotNumber: 'KOT-0377',
    orderType: 'Takeaway',
    elapsedMin: 18,
    items: [
      { name: 'Grilled Chicken', qty: 1, station: 'Grill' },
      { name: 'French Fries', qty: 2, station: 'Fry' },
      { name: 'Soft Drink', qty: 2, station: 'Cold' },
    ],
    status: 'READY',
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

function getElapsedColor(min: number): string {
  if (min < 5) return 'bg-green-600 text-white';
  if (min <= 10) return 'bg-amber-500 text-white';
  return 'bg-red-600 text-white';
}

function getOrderTypeBadgeColor(type: OrderType): string {
  switch (type) {
    case 'Dine-in':
      return 'bg-blue-600 text-white';
    case 'Takeaway':
      return 'bg-purple-600 text-white';
    case 'Delivery':
      return 'bg-orange-500 text-white';
    case 'Mess':
      return 'bg-teal-600 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
}

function getStationBadgeColor(station: Station): string {
  switch (station) {
    case 'Grill':
      return 'bg-red-900 text-red-300 border border-red-700';
    case 'Fry':
      return 'bg-yellow-900 text-yellow-300 border border-yellow-700';
    case 'Cold':
      return 'bg-cyan-900 text-cyan-300 border border-cyan-700';
    case 'Bakery':
      return 'bg-amber-900 text-amber-300 border border-amber-700';
    case 'Curry':
      return 'bg-orange-900 text-orange-300 border border-orange-700';
    default:
      return 'bg-gray-700 text-gray-300';
  }
}

const STATIONS = ['All', 'Grill', 'Fry', 'Cold', 'Bakery'] as const;
type StationFilter = (typeof STATIONS)[number];

// ─── KOT Card Component ───────────────────────────────────────────────────────

interface KOTCardProps {
  ticket: KOTTicket;
  onAction: (id: string) => void;
}

function KOTCard({ ticket, onAction }: KOTCardProps) {
  const isOverdue = ticket.elapsedMin > 10;

  return (
    <Card
      className={`
        mb-3 border-0 shadow-lg rounded-xl overflow-hidden
        ${isOverdue ? 'ring-2 ring-red-500' : ''}
        bg-gray-800
      `}
    >
      {/* Card header */}
      <div
        className={`
          flex items-center justify-between px-4 py-2
          ${ticket.status === 'NEW'
            ? 'bg-gray-700'
            : ticket.status === 'PREPARING'
            ? 'bg-gray-700'
            : 'bg-gray-700'}
        `}
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm tracking-wide">
            {ticket.kotNumber}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getOrderTypeBadgeColor(
              ticket.orderType
            )}`}
          >
            {ticket.orderType}
          </span>
          {ticket.table && (
            <span className="text-xs bg-gray-600 text-gray-200 px-2 py-0.5 rounded-full">
              {ticket.table}
            </span>
          )}
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-bold ${getElapsedColor(
            ticket.elapsedMin
          )}`}
        >
          {ticket.elapsedMin} min
        </span>
      </div>

      {/* Items */}
      <CardContent className="px-4 py-3 bg-gray-800">
        <ul className="space-y-2 mb-3">
          {ticket.items.map((item, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <span className="text-gray-100 text-sm">
                {item.name}{' '}
                <span className="font-bold text-white">×{item.qty}</span>
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStationBadgeColor(
                  item.station
                )}`}
              >
                {item.station}
              </span>
            </li>
          ))}
        </ul>

        {/* Action button */}
        {ticket.status === 'NEW' && (
          <Button
            size="sm"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            onClick={() => onAction(ticket.id)}
          >
            <ChefHat className="w-4 h-4 mr-1" />
            Start
          </Button>
        )}
        {ticket.status === 'PREPARING' && (
          <Button
            size="sm"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
            onClick={() => onAction(ticket.id)}
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Mark Ready
          </Button>
        )}
        {ticket.status === 'READY' && (
          <Button
            size="sm"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
            onClick={() => onAction(ticket.id)}
          >
            <Utensils className="w-4 h-4 mr-1" />
            Served
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main KDS Page ────────────────────────────────────────────────────────────

export default function KitchenDisplayPage() {
  const [tickets, setTickets] = useState<KOTTicket[]>(initialTickets);
  const [stationFilter, setStationFilter] = useState<StationFilter>('All');
  const [showStationDropdown, setShowStationDropdown] = useState(false);

  // Status transition
  const handleAction = (id: string) => {
    setTickets((prev) =>
      prev
        .map((t) => {
          if (t.id !== id) return t;
          if (t.status === 'NEW') return { ...t, status: 'PREPARING' as TicketStatus };
          if (t.status === 'PREPARING') return { ...t, status: 'READY' as TicketStatus };
          return t; // READY → remove handled below
        })
        .filter((t) => !(t.id === id && t.status === 'READY'))
    );
  };

  // Filter by station (show ticket if any item matches station)
  const filteredTickets = tickets.filter((t) => {
    if (stationFilter === 'All') return true;
    return t.items.some((item) => item.station === stationFilter);
  });

  const newTickets = filteredTickets.filter((t) => t.status === 'NEW');
  const preparingTickets = filteredTickets.filter((t) => t.status === 'PREPARING');
  const readyTickets = filteredTickets.filter((t) => t.status === 'READY');

  const totalActive = tickets.length;
  const allElapsed = tickets.map((t) => t.elapsedMin);
  const avgWait =
    allElapsed.length > 0
      ? Math.round(allElapsed.reduce((a, b) => a + b, 0) / allElapsed.length)
      : 0;
  const overdueCount = tickets.filter((t) => t.elapsedMin > 10).length;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* ── Top Bar ── */}
      <div className="bg-gray-950 border-b border-gray-700 px-6 py-3 flex items-center justify-between flex-shrink-0">
        {/* Left: Title */}
        <div className="flex items-center gap-3">
          <Flame className="w-6 h-6 text-orange-400" />
          <span className="text-xl font-bold tracking-wide text-white">
            Kitchen Display
          </span>
        </div>

        {/* Center: Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-1.5">
            <Timer className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Total Active:</span>
            <span className="text-sm font-bold text-white">{totalActive}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Avg Wait:</span>
            <span className="text-sm font-bold text-white">{avgWait} min</span>
          </div>
          <div
            className={`flex items-center gap-2 rounded-lg px-4 py-1.5 ${
              overdueCount > 0 ? 'bg-red-900' : 'bg-gray-800'
            }`}
          >
            <AlertTriangle
              className={`w-4 h-4 ${overdueCount > 0 ? 'text-red-400' : 'text-gray-400'}`}
            />
            <span className="text-sm text-gray-300">Overdue:</span>
            <span
              className={`text-sm font-bold ${
                overdueCount > 0 ? 'text-red-300' : 'text-white'
              }`}
            >
              {overdueCount}
            </span>
          </div>
        </div>

        {/* Right: Clock + Station Filter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="font-mono font-bold text-lg text-white">13:45</span>
          </div>

          {/* Station Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStationDropdown(!showStationDropdown)}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-4 py-1.5 text-sm font-medium text-white transition-colors"
            >
              {stationFilter === 'All' ? 'All Stations' : stationFilter}
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showStationDropdown && (
              <div className="absolute right-0 top-full mt-1 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl overflow-hidden min-w-[140px]">
                {STATIONS.map((s) => (
                  <button
                    key={s}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                      stationFilter === s
                        ? 'text-orange-400 font-semibold'
                        : 'text-gray-200'
                    }`}
                    onClick={() => {
                      setStationFilter(s);
                      setShowStationDropdown(false);
                    }}
                  >
                    {s === 'All' ? 'All Stations' : s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Column Headers ── */}
      <div className="grid grid-cols-3 gap-0 flex-shrink-0">
        {/* NEW */}
        <div className="bg-red-700 px-6 py-2 flex items-center justify-between">
          <span className="font-bold text-white text-sm uppercase tracking-wider">
            New
          </span>
          <span className="bg-red-900 text-red-100 text-xs font-bold px-2 py-0.5 rounded-full">
            {newTickets.length}
          </span>
        </div>
        {/* PREPARING */}
        <div className="bg-amber-600 px-6 py-2 flex items-center justify-between border-x border-gray-700">
          <span className="font-bold text-white text-sm uppercase tracking-wider">
            Preparing
          </span>
          <span className="bg-amber-800 text-amber-100 text-xs font-bold px-2 py-0.5 rounded-full">
            {preparingTickets.length}
          </span>
        </div>
        {/* READY */}
        <div className="bg-green-700 px-6 py-2 flex items-center justify-between">
          <span className="font-bold text-white text-sm uppercase tracking-wider">
            Ready
          </span>
          <span className="bg-green-900 text-green-100 text-xs font-bold px-2 py-0.5 rounded-full">
            {readyTickets.length}
          </span>
        </div>
      </div>

      {/* ── Ticket Columns ── */}
      <div className="grid grid-cols-3 gap-0 flex-1 overflow-hidden">
        {/* NEW Column */}
        <div className="bg-gray-900 border-r border-gray-700 p-4 overflow-y-auto">
          {newTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-600">
              <ChefHat className="w-8 h-8 mb-2" />
              <span className="text-sm">No new orders</span>
            </div>
          ) : (
            newTickets.map((ticket) => (
              <KOTCard key={ticket.id} ticket={ticket} onAction={handleAction} />
            ))
          )}
        </div>

        {/* PREPARING Column */}
        <div className="bg-gray-900 border-r border-gray-700 p-4 overflow-y-auto">
          {preparingTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-600">
              <Flame className="w-8 h-8 mb-2" />
              <span className="text-sm">Nothing in preparation</span>
            </div>
          ) : (
            preparingTickets.map((ticket) => (
              <KOTCard key={ticket.id} ticket={ticket} onAction={handleAction} />
            ))
          )}
        </div>

        {/* READY Column */}
        <div className="bg-gray-900 p-4 overflow-y-auto">
          {readyTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-600">
              <CheckCircle2 className="w-8 h-8 mb-2" />
              <span className="text-sm">No ready orders</span>
            </div>
          ) : (
            readyTickets.map((ticket) => (
              <KOTCard key={ticket.id} ticket={ticket} onAction={handleAction} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
