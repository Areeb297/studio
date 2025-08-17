'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isValid, getMonth, getYear, isBefore, startOfDay, getDate } from "date-fns";

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

interface EventCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export function EventCalendar({ selectedDate, onDateSelect }: EventCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthlyBookingCount, setMonthlyBookingCount] = useState(0);
  const [bookedEvents] = useState(getInitialBookedEvents);

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
        const date = new Date(dateStr + 'T00:00:00');
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

  const CustomDayComponent = (props: any) => {
    const day = props.date;
    const bookings = getBookingsForDate(day);
    const dayNumber = getDate(day);
    
    const isCompleted = completedDates.some(d => format(d, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
    const isFullyBooked = fullyBookedDates.some(d => format(d, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
    const isPartiallyBooked = partiallyBookedDates.some(d => format(d, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
    
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
  
  const selectedDateBookings = getBookingsForDate(selectedDate);
  const getAvailableSlots = () => {
    if (!selectedDate) return [];
    
    const bookedSlots = new Set(selectedDateBookings.map(b => b.time));
    
    if(bookedSlots.has('Full Day')) {
        bookedSlots.add('Day');
        bookedSlots.add('Night');
    }

    return timeSlots.filter(slot => !bookedSlots.has(slot));
  }
  const availableSlots = getAvailableSlots();

  return (
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
          selected={selectedDate}
          onSelect={onDateSelect}
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
        {selectedDate && !isBefore(startOfDay(selectedDate), startOfDay(new Date())) && (
          <div className='mt-4 space-y-2'>
            <h4 className='font-semibold text-sm'>
              Availability for {format(selectedDate, "PPP")}
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
  );
}