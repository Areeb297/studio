'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, CalendarDays, Users, Plus, CheckCircle } from "lucide-react";

// Mock existing bookings
const bookedDates: Record<string, 'partial' | 'full'> = {
  '2026-03-19': 'partial',
  '2026-03-22': 'partial',
  '2026-03-26': 'full',
  '2026-03-28': 'full',
  '2026-04-01': 'partial',
  '2026-04-05': 'full',
};

const mockBookings = [
  { id: 1, ref: "BKG-0001", eventType: "Wedding Reception",  date: "2026-03-19", hall: "Grand Ballroom (Hall A)", persons: 350, amount: 250000, status: "Confirmed" },
  { id: 2, ref: "BKG-0002", eventType: "Corporate Dinner",   date: "2026-03-22", hall: "Crystal Hall (Hall B)",   persons: 150, amount: 150000, status: "Confirmed" },
  { id: 3, ref: "BKG-0003", eventType: "Birthday Party",     date: "2026-03-26", hall: "Grand Ballroom (Hall A)", persons: 200, amount: 180000, status: "Confirmed" },
  { id: 4, ref: "BKG-0004", eventType: "Nikah Ceremony",     date: "2026-03-26", hall: "Jasmine Garden",          persons: 100, amount: 80000,  status: "Confirmed" },
  { id: 5, ref: "BKG-0005", eventType: "Bulk Catering Order", date: "2026-04-01", hall: "—",                      persons: 500, amount: 120000, status: "Pending" },
];

const eventTypes = ["Wedding Reception", "Nikah Ceremony", "Corporate Dinner", "Birthday Party", "Aqeeqa / Walima", "Bulk Catering Order", "Other"];
const halls = [
  { name: "Grand Ballroom (Hall A)", capacity: 500, price: 250000 },
  { name: "Crystal Hall (Hall B)",   capacity: 200, price: 150000 },
  { name: "Jasmine Garden (Outdoor)", capacity: 150, price: 100000 },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

export default function POSBookingPage() {
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(2); // March = 2
  const [selectedDate, setSelectedDate] = useState('2026-03-14');
  const [eventType, setEventType] = useState('');
  const [persons, setPersons] = useState('');
  const [selectedHall, setSelectedHall] = useState('');
  const [menuNotes, setMenuNotes] = useState('');
  const [priceQuoted, setPriceQuoted] = useState('');
  const [discount, setDiscount] = useState('');
  const [advance, setAdvance] = useState('');
  const [terms, setTerms] = useState('');
  const [activeTab, setActiveTab] = useState<'new' | 'list'>('new');
  const [saved, setSaved] = useState(false);

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const fmtDate = (d: number) => {
    const mm = String(calMonth + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${calYear}-${mm}-${dd}`;
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Event Booking</h1>
          <p className="text-muted-foreground text-sm">Book restaurant events, banquet halls, and bulk catering orders</p>
        </div>
        <Badge variant="secondary">6 bookings this month</Badge>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {(['new', 'list'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}>
            {tab === 'new' ? '+ Create New Booking' : 'Booking List'}
          </button>
        ))}
      </div>

      {activeTab === 'new' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Create a New Event Booking</CardTitle>
                <p className="text-sm text-muted-foreground">Fill out the form below to book an event. All fields marked * are required.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Event Type</Label>
                    <Select value={eventType} onValueChange={setEventType}>
                      <SelectTrigger><SelectValue placeholder="Select event type" /></SelectTrigger>
                      <SelectContent>
                        {eventTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Number of Persons</Label>
                    <Input placeholder="e.g., 150" type="number" value={persons} onChange={e => setPersons(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Event Date</Label>
                    <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                  </div>
                </div>

                {/* Halls */}
                <div className="space-y-2">
                  <Label>Available Venues / Halls</Label>
                  <div className="space-y-2">
                    {halls.map(h => (
                      <label key={h.name}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedHall === h.name ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                        }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedHall === h.name ? 'border-primary' : 'border-muted-foreground/30'
                          }`}>
                            {selectedHall === h.name && <div className="w-2 h-2 rounded-full bg-primary" />}
                          </div>
                          <input type="radio" className="sr-only" checked={selectedHall === h.name} onChange={() => setSelectedHall(h.name)} />
                          <span className="text-sm font-medium">{h.name} <span className="text-muted-foreground font-normal">(Capacity: {h.capacity})</span></span>
                        </div>
                        <span className="text-sm font-semibold text-primary">PKR {h.price.toLocaleString()}</span>
                      </label>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-1">
                    ✨ Get AI Suggestion
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <Label>Menu Details & Special Requests</Label>
                  <Textarea placeholder="e.g., Buffet style with Pakistani & Chinese cuisine. Special request for a live BBQ station."
                    rows={3} value={menuNotes} onChange={e => setMenuNotes(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label>Price Quoted (PKR)</Label>
                    <Input placeholder="e.g., 500000" type="number" value={priceQuoted} onChange={e => setPriceQuoted(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Discount (PKR)</Label>
                    <Input placeholder="e.g., 25000" type="number" value={discount} onChange={e => setDiscount(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Advance Payment (PKR)</Label>
                    <Input placeholder="e.g., 200000" type="number" value={advance} onChange={e => setAdvance(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Specific Terms & Conditions</Label>
                  <Textarea placeholder="e.g., Full payment required 7 days before the event. No outside food or drinks allowed."
                    rows={2} value={terms} onChange={e => setTerms(e.target.value)} />
                </div>

                <div className="flex gap-3 pt-2 justify-end">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSave}>
                    {saved ? <><CheckCircle className="h-4 w-4 mr-2" /> Saved!</> : 'Save Booking'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
                  <span className="text-sm font-semibold">{MONTHS[calMonth]} {calYear}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {DAYS.map(d => <div key={d} className="text-[10px] font-medium text-muted-foreground text-center py-1">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = fmtDate(day);
                    const booking = bookedDates[dateStr];
                    const isSelected = dateStr === selectedDate;
                    const isToday = dateStr === '2026-03-14';
                    return (
                      <button key={day}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`aspect-square rounded-full text-xs font-medium flex items-center justify-center transition-colors
                          ${isSelected ? 'bg-green-600 text-white'
                            : booking === 'full' ? 'bg-red-500 text-white'
                            : booking === 'partial' ? 'bg-green-500 text-white'
                            : isToday ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'}`}>
                        {day}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground text-sm">Availability for {selectedDate}</p>
                  <div className="flex gap-2 flex-wrap">
                    {['Day', 'Night', 'Full Day'].map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-full bg-muted border text-xs">{s}</span>
                    ))}
                  </div>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-muted-foreground/20 border" /><span>Completed Event</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500" /><span>Partially Booked</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500" /><span>Fully Booked</span></div>
                  </div>
                  <p className="italic text-[10px]">* Hover over a booked date to see details.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'list' && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Ref</th>
                  <th className="text-left p-3 font-semibold">Event Type</th>
                  <th className="text-left p-3 font-semibold">Date</th>
                  <th className="text-left p-3 font-semibold">Hall / Venue</th>
                  <th className="text-right p-3 font-semibold">Persons</th>
                  <th className="text-right p-3 font-semibold">Amount</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockBookings.map(b => (
                  <tr key={b.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono text-xs font-semibold text-primary">{b.ref}</td>
                    <td className="p-3 font-medium">{b.eventType}</td>
                    <td className="p-3 text-muted-foreground">{b.date}</td>
                    <td className="p-3 text-muted-foreground text-xs">{b.hall}</td>
                    <td className="p-3 text-right"><span className="flex items-center justify-end gap-1"><Users className="h-3 w-3" />{b.persons}</span></td>
                    <td className="p-3 text-right font-semibold">Rs. {b.amount.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        b.status === 'Confirmed' ? 'bg-green-500/15 text-green-700' : 'bg-yellow-500/15 text-yellow-700'
                      }`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
