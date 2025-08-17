'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calendar,
  DollarSign, 
  TrendingUp, 
  Users, 
  Heart,
  Star,
  MapPin,
  Clock,
  Camera,
  Utensils,
  Music,
  PlusCircle,
  CheckCircle
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Area, AreaChart } from "recharts";

// Shadi Lawn Analytics Data
const venueMetrics = {
  monthlyRevenue: 1850000,
  totalBookings: 127,
  averageEventValue: 145000,
  venueUtilization: 78.5,
  customerSatisfaction: 4.8,
  repeatCustomers: 23,
  averageGuestCount: 280,
  packagesSold: 89
};

const monthlyBookingsData = [
  { month: "Jan", bookings: 8, revenue: 980000, guests: 2240 },
  { month: "Feb", bookings: 12, revenue: 1456000, guests: 3360 },
  { month: "Mar", bookings: 15, revenue: 1875000, guests: 4200 },
  { month: "Apr", bookings: 18, revenue: 2340000, guests: 5040 },
  { month: "May", bookings: 22, revenue: 2970000, guests: 6160 },
  { month: "Jun", bookings: 16, revenue: 2240000, guests: 4480 },
];

const eventTypesData = [
  { type: "Wedding", count: 45, revenue: 8100000, avgGuests: 320 },
  { type: "Valima", count: 28, revenue: 3360000, avgGuests: 240 },
  { type: "Engagement", count: 18, revenue: 1440000, avgGuests: 180 },
  { type: "Birthday", count: 22, revenue: 1100000, avgGuests: 120 },
  { type: "Corporate", count: 14, revenue: 1680000, avgGuests: 200 },
];

const venuePackages = [
  { 
    name: "Premium Wedding Package", 
    price: 250000, 
    bookings: 23, 
    includes: "Decoration, Catering, Photography, Music",
    popularity: 92
  },
  { 
    name: "Deluxe Valima Package", 
    price: 180000, 
    bookings: 18, 
    includes: "Basic Decoration, Catering, Sound System",
    popularity: 78
  },
  { 
    name: "Engagement Special", 
    price: 120000, 
    bookings: 15, 
    includes: "Floral Decoration, Light Refreshments",
    popularity: 65
  },
  { 
    name: "Birthday Celebration", 
    price: 85000, 
    bookings: 12, 
    includes: "Theme Decoration, Birthday Cake, Entertainment",
    popularity: 54
  },
];

const upcomingEvents = [
  { 
    id: "SL001", 
    date: "2024-01-28", 
    time: "6:00 PM", 
    event: "Ahmed & Fatima Wedding", 
    guests: 350, 
    package: "Premium Wedding",
    status: "Confirmed"
  },
  { 
    id: "SL002", 
    date: "2024-01-30", 
    time: "4:00 PM", 
    event: "Corporate Annual Dinner", 
    guests: 180, 
    package: "Corporate Package",
    status: "Planning"
  },
  { 
    id: "SL003", 
    date: "2024-02-02", 
    time: "7:00 PM", 
    event: "Ali's 25th Birthday", 
    guests: 120, 
    package: "Birthday Celebration",
    status: "Confirmed"
  },
  { 
    id: "SL004", 
    date: "2024-02-05", 
    time: "5:30 PM", 
    event: "Hassan & Aisha Engagement", 
    guests: 200, 
    package: "Engagement Special",
    status: "Deposit Paid"
  },
];

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "#9333ea",
  },
  revenue: {
    label: "Revenue (PKR)",
    color: "#a855f7",
  },
  guests: {
    label: "Guests",
    color: "#c084fc",
  }
} satisfies ChartConfig;

export default function ShadiLawnDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">Shadi Lawn</h1>
          <p className="text-muted-foreground">Event venue management and booking analytics</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">PKR {venueMetrics.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-purple-600">+18.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-pink-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="w-4 h-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{venueMetrics.totalBookings}</div>
            <p className="text-xs text-pink-600">+12 events this month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Venue Utilization</CardTitle>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{venueMetrics.venueUtilization}%</div>
            <p className="text-xs text-indigo-600">Optimal booking rate</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
            <Star className="w-4 h-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{venueMetrics.customerSatisfaction}/5.0</div>
            <p className="text-xs text-rose-600">Excellent rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Booking Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Monthly Booking Trends
            </CardTitle>
            <CardDescription>Revenue and booking volume analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[300px]">
              <AreaChart data={monthlyBookingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" tickFormatter={(value) => `${value/1000000}M`} />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#9333ea" fill="#9333ea" fillOpacity={0.6} />
                <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#a855f7" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Event Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-purple-600" />
              Event Types Performance
            </CardTitle>
            <CardDescription>Revenue by event category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[300px]">
              <BarChart data={eventTypesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis tickFormatter={(value) => `${value/1000000}M`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="#9333ea" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Package Performance & Upcoming Events */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Popular Packages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-purple-600" />
              Event Packages Performance
            </CardTitle>
            <CardDescription>Most popular venue packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {venuePackages.map((pkg, index) => (
                <div key={pkg.name} className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-purple-700">{pkg.name}</h4>
                      <p className="text-sm text-muted-foreground">{pkg.includes}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">PKR {pkg.price.toLocaleString()}</div>
                      <div className="text-sm text-purple-600">{pkg.bookings} bookings</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${pkg.popularity}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{pkg.popularity}% popularity</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Scheduled events and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-4 rounded-lg border bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{event.event}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.guests} guests
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant={event.status === 'Confirmed' ? 'default' : 'secondary'}
                      className={
                        event.status === 'Confirmed' ? 'bg-green-500/20 text-green-700' :
                        event.status === 'Planning' ? 'bg-yellow-500/20 text-yellow-700' :
                        'bg-blue-500/20 text-blue-700'
                      }
                    >
                      {event.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-purple-600 font-medium">{event.package}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Star className="h-5 w-5" />
            AI-Powered Venue Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-semibold text-purple-700 mb-2">Seasonal Booking Forecast</h4>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-purple-600">Wedding season peak</span> expected in March-April. 
                Recommend increasing premium package pricing by 15% and booking staff 2 weeks early.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-semibold text-purple-700 mb-2">Customer Satisfaction</h4>
              <p className="text-sm text-muted-foreground">
                95% of customers rate <span className="font-medium text-purple-600">catering quality highly</span>. 
                Consider partnering with premium caterers to increase package value and pricing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}