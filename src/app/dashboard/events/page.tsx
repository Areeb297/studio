
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Sparkles } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { suggestHallSize, SuggestHallSizeInput } from '@/ai/flows/suggest-hall-size';

const availableHalls = [
  { id: 'hall-a', name: 'Grand Ballroom (Hall A)', capacity: 500, rate: 'PKR 250,000' },
  { id: 'hall-b', name: 'Crystal Hall (Hall B)', capacity: 200, rate: 'PKR 150,000' },
  { id: 'hall-c', name: 'Jasmine Garden (Outdoor)', capacity: 150, rate: 'PKR 100,000' },
];

export default function EventsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [numberOfGuests, setNumberOfGuests] = useState('');
  const [eventType, setEventType] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Events Booking</h1>
       <Card>
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

            <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Booking</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
