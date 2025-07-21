import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Events Booking</h1>
       <Card>
        <CardHeader>
          <CardTitle>Manage Bookings</CardTitle>
          <CardDescription>Oversee all event bookings for weddings, conferences, and parties.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <CalendarDays className="w-16 h-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Event booking forms and calendars will be available here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
