

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Sparkles } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, isValid, getMonth, getYear, isBefore, startOfDay, getDate } from "date-fns";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { suggestHallSize, SuggestHallSizeInput } from '@/ai/flows/suggest-hall-size';
import { summarizeEventBookings, SummarizeEventBookingsInput, SummarizeEventBookingsOutput } from '@/ai/flows/summarize-event-bookings';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";


const availableHalls = [
  { id: 'hall-a', name: 'Grand Ballroom (Hall A)', capacity: 500, rate: 'PKR 250,000' },
  { id: 'hall-b', name: 'Crystal Hall (Hall B)', capacity: 200, rate: 'PKR 150,000' },
  { id: 'hall-c', name: 'Jasmine Garden (Outdoor)', capacity: 150, rate: 'PKR 100,000' },
];

const getInitialBookedEvents = () => {
    const today = new Date();
    const currentYear = getYear(today);
    return [
        // Past Completed Events
        { date: new Date(currentYear, 4, 15), hallId: 'hall-a', time: 'Day', eventType: 'Wedding' }, // May
        { date: new Date(currentYear, 4, 20), hallId: 'hall-b', time: 'Night', eventType: 'Conference' },
        { date: new Date(currentYear, 5, 5), hallId: 'hall-c', time: 'Day', eventType: 'Birthday' }, // June
        { date: new Date(currentYear, 5, 12), hallId: 'hall-a', time: 'Full Day', eventType: 'Wedding' },

        // Future Booked Events
        { date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5), hallId: 'hall-a', time: 'Day', eventType: 'Wedding' },
        { date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8), hallId: 'hall-b', time: 'Night', eventType: 'Conference' },
        { date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 8), hallId: 'hall-c', time: 'Day', eventType: 'Birthday' },
        { date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12), hallId: 'hall-a', time: 'Full Day', eventType: 'Wedding' },
        { date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12), hallId: 'hall-b', time: 'Full Day', eventType: 'Conference' },
        { date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 12), hallId: 'hall-c', time: 'Full Day', eventType: 'Exhibition' },
    ];
};

type TimeSlot = 'Day' | 'Night' | 'Full Day';
const timeSlots: TimeSlot[] = ['Day', 'Night', 'Full Day'];


export default function EventsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [eventType, setEventType] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthlyBookingCount, setMonthlyBookingCount] = useState(0);
  
  const [bookedEvents, setBookedEvents] = useState(getInitialBookedEvents);
  
  const [yearlySummary, setYearlySummary] = useState<SummarizeEventBookingsOutput | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const getBookingsForDate = (d: Date | undefined) => {
    if (!d || !isValid(d)) return [];
    return bookedEvents.filter(event => isValid(event.date) && format(event.date, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd'));
  }

  const { partiallyBookedDates, fullyBookedDates, completedDates } = useMemo(() => {
    const bookingsByDate: { [key: string]: { count: number, isPast: boolean } } = {};
    const today = startOfDay(new Date());

    bookedEvents.forEach(event => {
        if (isValid(event.date)) {
            const dateStr = format(event.date, 'yyyy-MM-dd');
            if (!bookingsByDate[dateStr]) {
                bookingsByDate[dateStr] = { count: 0, isPast: isBefore(startOfDay(event.date), today) };
            }
            bookingsByDate[dateStr].count++;
        }
    });

    const partially: Date[] = [];
    const fully: Date[] = [];
    const completed: Date[] = [];

    Object.keys(bookingsByDate).forEach(dateStr => {
        const date = new Date(dateStr + 'T00:00:00'); // Ensure correct date object creation
        if (bookingsByDate[dateStr].isPast) {
            completed.push(date);
        }
        if (bookingsByDate[dateStr].count >= availableHalls.length) {
            fully.push(date);
        } else if (bookingsByDate[dateStr].count > 0) {
            partially.push(date);
        }
    });

    return { partiallyBookedDates: partially, fullyBookedDates: fully, completedDates: completed };
  }, [bookedEvents]);

  useEffect(() => {
    const count = bookedEvents.filter(event => 
      isValid(event.date) &&
      getMonth(event.date) === getMonth(currentMonth) &&
      getYear(event.date) === getYear(currentMonth)
    ).length;
    setMonthlyBookingCount(count);
  }, [currentMonth, bookedEvents]);


  const handleGetSuggestion = async () => {
    if (!numberOfGuests || !eventType) {
      setAiSuggestion('Please select event type and enter number of guests first.');
      return;
    }
    setIsLoading(true);
    setAiSuggestion('');
    try {
      const input: SuggestHallSizeInput = {
        numberOfGuests: parseInt(numberOfGuests, 10),
        eventType: eventType,
      };
      const result = await suggestHallSize(input);
      setAiSuggestion(`${result.suggestion}. ${result.reasoning}`);
    } catch (error) {
      console.error("Failed to get AI suggestion:", error);
      setAiSuggestion('Sorry, I was unable to get a suggestion at this time.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsSummaryLoading(true);
    setYearlySummary(null);
    try {
        const input: SummarizeEventBookingsInput = {
            year: getYear(new Date()),
            bookings: JSON.stringify(bookedEvents.map(e => ({ date: format(e.date, 'yyyy-MM-dd'), eventType: e.eventType, time: e.time }))),
            totalHalls: availableHalls.length
        };
        const result = await summarizeEventBookings(input);
        setYearlySummary(result);
    } catch (error) {
        console.error("Failed to generate yearly summary:", error);
    } finally {
        setIsSummaryLoading(false);
    }
  }

  const CustomDayComponent = (props: any) => {
    const day = props.date;
    const bookings = getBookingsForDate(day);
    const dayNumber = getDate(day);
    
    // Determine the state of this day
    const isCompleted = completedDates.some(d => format(d, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
    const isFullyBooked = fullyBookedDates.some(d => format(d, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
    const isPartiallyBooked = partiallyBookedDates.some(d => format(d, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
    
    // Determine background color and text color
    let bgColor = '';
    let textColor = '';
    
    if (isCompleted) {
      bgColor = 'hsl(var(--muted))';
      textColor = 'hsl(var(--muted-foreground))';
    } else if (isFullyBooked) {
      bgColor = 'hsl(var(--destructive))';
      textColor = 'hsl(var(--destructive-foreground))';
    } else if (isPartiallyBooked) {
      bgColor = 'hsl(var(--accent))';
      textColor = 'hsl(var(--foreground))';
    }

    return (
      <div 
        className="relative h-full w-full flex items-center justify-center rounded-md"
        style={{
          backgroundColor: bgColor,
          color: textColor,
          opacity: isCompleted ? 0.8 : isPartiallyBooked ? 0.7 : 1
        }}
      >
        <span className="text-sm font-medium z-10">{dayNumber}</span>
        {bookings.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <div className="absolute inset-0 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent>
              <h4 className="font-semibold text-sm mb-2">Bookings for {format(day, 'PPP')}</h4>
              <ul className="space-y-1 text-xs">
                {bookings.map((booking, i) => (
                  <li key={i}>
                    <span className="font-medium">{availableHalls.find(h => h.id === booking.hallId)?.name || 'Unknown Hall'}:</span> {booking.eventType} ({booking.time})
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        )}
      </div>
    );
  };
  
  const selectedDateBookings = getBookingsForDate(date);
  const getAvailableSlots = () => {
    if (!date) return [];
    
    const bookedSlots = new Set(selectedDateBookings.map(b => b.time));
    
    if(bookedSlots.has('Full Day')) {
        bookedSlots.add('Day');
        bookedSlots.add('Night');
    }

    return timeSlots.filter(slot => !bookedSlots.has(slot));
  }
  const availableSlots = getAvailableSlots();

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">Events Booking</h1>
        <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Create a New Event Booking</CardTitle>
                    <CardDescription>Fill out the form below to book an event. All fields are required.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="event-type">Event Type</Label>
                            <Select onValueChange={setEventType}>
                            <SelectTrigger id="event-type">
                                <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Wedding">Wedding</SelectItem>
                                <SelectItem value="Birthday">Birthday Party</SelectItem>
                                <SelectItem value="Conference">Conference</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="persons">Number of Persons</Label>
                            <Input id="persons" type="number" placeholder="e.g., 150" value={numberOfGuests} onChange={(e) => setNumberOfGuests(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Event Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>Available Venues/Halls</Label>
                            <div className="space-y-4 rounded-md border p-4">
                                <RadioGroup defaultValue="hall-a">
                                {availableHalls.map((hall) => (
                                    <div key={hall.id} className="flex items-center justify-between">
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value={hall.id} id={hall.id} />
                                            <Label htmlFor={hall.id} className="font-normal">
                                                {hall.name} (Capacity: {hall.capacity})
                                            </Label>
                                        </div>
                                        <span className="text-sm font-medium">{hall.rate}</span>
                                    </div>
                                ))}
                                </RadioGroup>
                                <div className="flex items-start gap-4 pt-4">
                                    <Button variant="outline" size="sm" onClick={handleGetSuggestion} disabled={isLoading}>
                                        <Sparkles className="mr-2 h-4 w-4" /> {isLoading ? 'Getting Suggestion...' : 'Get AI Suggestion'}
                                    </Button>
                                    {aiSuggestion && <p className="text-sm text-muted-foreground pt-1.5">{aiSuggestion}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="menu-details">Menu Details & Special Requests</Label>
                        <Textarea id="menu-details" placeholder="e.g., Buffet style with Pakistani & Chinese cuisine. Special request for a live BBQ station." rows={4} />
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="price-quoted">Price Quoted (PKR)</Label>
                            <Input id="price-quoted" type="number" placeholder="e.g., 500000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="discount">Discount (PKR)</Label>
                            <Input id="discount" type="number" placeholder="e.g., 25000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="advance">Advance Payment (PKR)</Label>
                            <Input id="advance" type="number" placeholder="e.g., 200000" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="terms">Specific Terms & Conditions</Label>
                        <Textarea id="terms" placeholder="e.g., Full payment required 7 days before the event. No outside food or drinks allowed." rows={3} />
                    </div>

                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={async () => {
                        const persons = Number((document.getElementById('persons') as HTMLInputElement | null)?.value || 0)
                        const priceQuoted = Number((document.getElementById('price-quoted') as HTMLInputElement | null)?.value || 0)
                        const discount = Number((document.getElementById('discount') as HTMLInputElement | null)?.value || 0)
                        const advance = Number((document.getElementById('advance') as HTMLInputElement | null)?.value || 0)
                        const terms = (document.getElementById('terms') as HTMLTextAreaElement | null)?.value || ''
                        await fetch('/api/events/bookings', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                eventType,
                                eventDate: date ? format(date, 'yyyy-MM-dd') : undefined,
                                persons,
                                priceQuoted,
                                discount,
                                advance,
                                terms,
                            })
                        })
                    }}>Save Booking</Button>
                </CardFooter>
            </Card>

            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <div className='flex justify-between items-start'>
                            <div>
                                <CardTitle>Events Calendar</CardTitle>
                                <CardDescription>View hall availability at a glance.</CardDescription>
                            </div>
                            <Badge variant="secondary">{monthlyBookingCount} bookings this month</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            month={currentMonth}
                            onMonthChange={setCurrentMonth}
                            className="p-0"
                            modifiers={{ 
                                partiallyBooked: partiallyBookedDates,
                                fullyBooked: fullyBookedDates,
                                completed: completedDates
                            }}
                            modifiersStyles={{
                                partiallyBooked: {
                                    backgroundColor: 'hsl(var(--accent))',
                                    color: 'hsl(var(--foreground))',
                                    opacity: 0.7
                                },
                                fullyBooked: {
                                    backgroundColor: 'hsl(var(--destructive))',
                                    color: 'hsl(var(--destructive-foreground))',
                                },
                                completed: {
                                    backgroundColor: 'hsl(var(--muted))',
                                    color: 'hsl(var(--muted-foreground))',
                                    opacity: 0.8
                                }
                            }}
                            components={{
                                Day: CustomDayComponent
                            }}
                        />
                        {date && !isBefore(startOfDay(date), startOfDay(new Date())) && (
                            <div className='mt-4 space-y-2'>
                                <h4 className='font-semibold text-sm'>
                                    Availability for {format(date, "PPP")}
                                </h4>
                                {availableSlots.length > 0 ? (
                                    <div className='flex flex-wrap gap-2'>
                                        {availableSlots.map(slot => (
                                            <Badge key={slot} variant='secondary' className='border-green-500/30 bg-green-500/20 text-green-800 dark:text-green-300 dark:border-green-500/50 dark:bg-green-500/10'>{slot}</Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className='text-sm text-muted-foreground'>No available slots on this day.</p>
                                )}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <div className="w-full space-y-2 text-sm text-muted-foreground">
                             <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(var(--muted))', opacity: 0.5 }} />
                                <span>Completed Event</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(var(--accent))', opacity: 0.7 }} />
                                <span>Partially Booked</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(var(--destructive))' }} />
                                <span>Fully Booked</span>
                            </div>
                            <p className="pt-2 text-xs">* Hover over a booked date to see details.</p>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Yearly Booking Summary</CardTitle>
                <CardDescription>AI-generated summary of event booking performance for the current year.</CardDescription>
            </CardHeader>
            <CardContent>
                {isSummaryLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-1/4" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-5/6" />
                        </div>
                    </div>
                ) : yearlySummary ? (
                    <div className="space-y-4">
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Month</TableHead>
                                    <TableHead className="text-center">Bookings</TableHead>
                                    <TableHead className="text-center">Occupancy</TableHead>
                                    <TableHead>Popular Event</TableHead>
                                    <TableHead>AI Insight</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {yearlySummary.yearlySummary.map((summary) => (
                                <TableRow key={summary.month}>
                                    <TableCell className="font-medium">{summary.month}</TableCell>
                                    <TableCell className="text-center">{summary.bookedEvents}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={parseFloat(summary.occupancyRate) > 50 ? "default" : "secondary"} className={parseFloat(summary.occupancyRate) > 50 ? "bg-green-500/20 text-green-700 dark:text-green-300 dark:border-green-500/50 dark:bg-green-500/10" : ""}>
                                            {summary.occupancyRate}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{summary.popularEventType || 'N/A'}</TableCell>
                                    <TableCell className="text-muted-foreground">{summary.insight}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="pt-4">
                            <h4 className="font-semibold">Overall Yearly Insight</h4>
                            <p className="text-muted-foreground">{yearlySummary.overallInsight}</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        <p>Click the button to generate the yearly performance summary.</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button onClick={handleGenerateSummary} disabled={isSummaryLoading}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isSummaryLoading ? 'Generating Summary...' : 'Generate AI Yearly Summary'}
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
