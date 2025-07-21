
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Sparkles } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { suggestHallSize, SuggestHallSizeInput } from '@/ai/flows/suggest-hall-size';

const availableHalls = [
  { id: 'hall-a', name: 'Grand Ballroom (Hall A)', capacity: 500, rate: 'PKR 250,000' },
  { id: 'hall-b', name: 'Crystal Hall (Hall B)', capacity: 200, rate: 'PKR 150,000' },
  { id: 'hall-c', name: 'Jasmine Garden (Outdoor)', capacity: 150, rate: 'PKR 100,000' },
];

const getInitialBookedEvents = () => {
    const today = new Date();
    return [
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
  
  const [bookedEvents, setBookedEvents] = useState(getInitialBookedEvents);
  
  const getBookingsForDate = (d: Date | undefined) => {
    if (!d || !isValid(d)) return [];
    return bookedEvents.filter(event => isValid(event.date) && format(event.date, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd'));
  }

  const { partiallyBookedDates, fullyBookedDates } = useMemo(() => {
    const bookingsByDate: { [key: string]: number } = {};

    bookedEvents.forEach(event => {
        if (isValid(event.date)) {
            const dateStr = format(event.date, 'yyyy-MM-dd');
            if (!bookingsByDate[dateStr]) {
                bookingsByDate[dateStr] = 0;
            }
            bookingsByDate[dateStr]++;
        }
    });

    const partially: Date[] = [];
    const fully: Date[] = [];

    Object.keys(bookingsByDate).forEach(dateStr => {
        const date = new Date(dateStr + 'T00:00:00'); // Ensure correct date object creation
        if (bookingsByDate[dateStr] >= availableHalls.length) {
            fully.push(date);
        } else if (bookingsByDate[dateStr] > 0) {
            partially.push(date);
        }
    });

    return { partiallyBookedDates: partially, fullyBookedDates: fully };
  }, [bookedEvents]);


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

  const dayContent = (day: Date) => {
    const bookings = getBookingsForDate(day);
    if (bookings.length > 0) {
      return (
        <div className="relative h-full w-full">
          <Popover>
            <PopoverTrigger asChild>
                <div className="absolute inset-0 z-10"></div>
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
        </div>
      );
    }
    return null;
  };
  
  const selectedDateBookings = getBookingsForDate(date);
  const getAvailableSlots = () => {
    if (!date) return [];
    
    // For simplicity, let's assume a hall is booked for a time slot means that time slot is unavailable.
    // A more complex logic could check per-hall availability.
    const bookedSlots = new Set(selectedDateBookings.map(b => b.time));
    
    // If a 'Full Day' is booked, both 'Day' and 'Night' are implicitly booked.
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
                            <SelectItem value="wedding">Wedding</SelectItem>
                            <SelectItem value="birthday">Birthday Party</SelectItem>
                            <SelectItem value="conference">Conference</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
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
                                disabled={{ before: new Date() }}
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
                <Button>Save Booking</Button>
            </CardFooter>
        </Card>

        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Events Calendar</CardTitle>
                <CardDescription>View hall availability at a glance.</CardDescription>
            </CardHeader>
            <CardContent>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="p-0"
                    disabled={{ before: new Date() }}
                    modifiers={{ 
                        partiallyBooked: partiallyBookedDates,
                        fullyBooked: fullyBookedDates 
                    }}
                    modifiersStyles={{
                        partiallyBooked: {
                            backgroundColor: 'hsl(var(--accent))',
                            color: 'hsl(var(--accent-foreground))',
                            opacity: 0.7
                        },
                        fullyBooked: {
                            backgroundColor: 'hsl(var(--destructive))',
                            color: 'hsl(var(--destructive-foreground))',
                        }
                    }}
                    components={{
                        DayContent: dayContent
                    }}
                />
                 {date && (
                    <div className='mt-4 space-y-2'>
                        <h4 className='font-semibold text-sm'>
                            Availability for {format(date, "PPP")}
                        </h4>
                        {availableSlots.length > 0 ? (
                             <div className='flex flex-wrap gap-2'>
                                {availableSlots.map(slot => (
                                    <Badge key={slot} variant='secondary' className='border-green-500/30 bg-green-500/20 text-green-800'>{slot}</Badge>
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
  );
}

    