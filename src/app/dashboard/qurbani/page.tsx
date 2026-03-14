'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Package,
  Plus,
  Search,
  BookOpen,
} from "lucide-react";

const animals = [
  {
    id: 'COW-101',
    name: 'Cow #101',
    totalShares: 7,
    bookedShares: 7,
    price: 350000,
    status: 'Slaughtered',
  },
  {
    id: 'COW-102',
    name: 'Cow #102',
    totalShares: 7,
    bookedShares: 5,
    price: 380000,
    status: 'In Yard',
  },
  {
    id: 'COW-103',
    name: 'Cow #103',
    totalShares: 7,
    bookedShares: 3,
    price: 320000,
    status: 'In Yard',
  },
  {
    id: 'COW-104',
    name: 'Cow #104',
    totalShares: 7,
    bookedShares: 7,
    price: 400000,
    status: 'Ready for Pickup',
  },
  {
    id: 'COW-105',
    name: 'Cow #105',
    totalShares: 7,
    bookedShares: 0,
    price: 340000,
    status: 'In Yard',
  },
  {
    id: 'COW-106',
    name: 'Cow #106',
    totalShares: 7,
    bookedShares: 6,
    price: 370000,
    status: 'In Yard',
  },
];

const STATUS_TABS = ['All', 'In Yard', 'Slaughtered', 'Ready for Pickup', 'Distributed'];

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'Slaughtered':
      return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400';
    case 'In Yard':
      return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400';
    case 'Ready for Pickup':
      return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400';
    case 'Distributed':
      return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

function ShareBar({ booked, total }: { booked: number; total: number }) {
  return (
    <div className="flex gap-1 my-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-3 rounded-sm ${i < booked ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
        />
      ))}
    </div>
  );
}

export default function QurbaniPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const totalAnimals = animals.length;
  const totalShares = animals.reduce((s, a) => s + a.totalShares, 0);
  const bookedShares = animals.reduce((s, a) => s + a.bookedShares, 0);
  const availableShares = totalShares - bookedShares;

  const filtered = animals.filter((a) => {
    const matchesTab = activeTab === 'All' || a.status === activeTab;
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Qurbani Management</h1>
          <p className="text-muted-foreground">Animals &amp; Share Booking</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Animal
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Animals</p>
                <p className="text-3xl font-bold mt-1">{totalAnimals}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shares Booked</p>
                <p className="text-3xl font-bold mt-1">
                  {bookedShares} <span className="text-lg font-normal text-muted-foreground">/ {totalShares}</span>
                </p>
                <Progress value={(bookedShares / totalShares) * 100} className="h-1.5 mt-2 w-32" />
              </div>
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Available</p>
                <p className="text-3xl font-bold mt-1">{availableShares}</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                <Package className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Status Tabs */}
        <div className="flex gap-1 flex-wrap">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search animals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Animal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((animal) => {
          const isFull = animal.bookedShares === animal.totalShares;
          return (
            <Card key={animal.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold">{animal.name}</CardTitle>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusBadgeClass(animal.status)}`}
                  >
                    {animal.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <ShareBar booked={animal.bookedShares} total={animal.totalShares} />
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{animal.bookedShares}/{animal.totalShares}</span> shares booked
                  &nbsp;&bull;&nbsp;
                  <span className="font-semibold text-foreground">Rs. {animal.price.toLocaleString()}</span>
                </p>
                {!isFull && (
                  <Button
                    size="sm"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    Book Share
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No animals found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}
