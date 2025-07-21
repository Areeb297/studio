'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing event booking performance over a year.
 *
 * - summarizeEventBookings - A function that triggers the event summary flow.
 * - SummarizeEventBookingsInput - The input type for the summarizeEventBookings function.
 * - SummarizeEventBookingsOutput - The return type for the summarizeEventBookings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEventBookingsInputSchema = z.object({
  year: z.number().describe('The year for which to generate the summary.'),
  bookings: z.string().describe('A JSON string representing the list of booked events for the year. Each event should have a date.'),
  totalHalls: z.number().describe('The total number of halls available for booking.'),
});
export type SummarizeEventBookingsInput = z.infer<typeof SummarizeEventBookingsInputSchema>;

const MonthlySummarySchema = z.object({
    month: z.string(),
    bookedEvents: z.number(),
    occupancyRate: z.string(),
    popularEventType: z.string().optional(),
    insight: z.string(),
});

const SummarizeEventBookingsOutputSchema = z.object({
  yearlySummary: z.array(MonthlySummarySchema).describe('An array of monthly booking summaries.'),
  overallInsight: z.string().describe('An overall insight for the entire year.'),
});
export type SummarizeEventBookingsOutput = z.infer<typeof SummarizeEventBookingsOutputSchema>;

export async function summarizeEventBookings(input: SummarizeEventBookingsInput): Promise<SummarizeEventBookingsOutput> {
  return summarizeEventBookingsFlow(input);
}

const summarizeEventBookingsPrompt = ai.definePrompt({
  name: 'summarizeEventBookingsPrompt',
  input: {schema: SummarizeEventBookingsInputSchema},
  output: {schema: SummarizeEventBookingsOutputSchema},
  prompt: `You are a restaurant management consultant AI. Your task is to analyze event booking data for a given year and provide a month-by-month performance summary.

Year: {{{year}}}
Total Available Halls: {{{totalHalls}}}
Bookings Data (JSON):
{{{bookings}}}

There are 3 time slots per day: Day, Night, Full Day. For occupancy calculation, consider that a 'Full Day' booking uses 2 slots. Assume each month has 30 days.
The total possible booking slots for a month are: {{{totalHalls}}} * 30 days * 2 main slots (Day/Night).

For each month of the year, please provide the following analysis:
1.  **Month**: The name of the month.
2.  **Booked Events**: The total number of events booked in that month.
3.  **Occupancy Rate**: The percentage of booking slots filled for the month.
4.  **Popular Event Type**: The most frequently booked event type for that month (e.g., Wedding, Conference).
5.  **Insight**: A brief, one-sentence insight about the month's performance. For example: "Strong start to the year", "Seasonal dip in bookings", "Weddings drove peak performance", or "Low occupancy suggests a need for marketing focus."

After analyzing all months, provide an 'overallInsight' for the entire year's performance.

Structure your entire response as a single JSON object conforming to the output schema.
`,
});

const summarizeEventBookingsFlow = ai.defineFlow(
  {
    name: 'summarizeEventBookingsFlow',
    inputSchema: SummarizeEventBookingsInputSchema,
    outputSchema: SummarizeEventBookingsOutputSchema,
  },
  async (input) => {
    const {output} = await summarizeEventBookingsPrompt(input);
    return output!;
  }
);
