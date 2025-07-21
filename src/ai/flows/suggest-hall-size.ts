'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting a suitable hall size based on event type and number of guests.
 *
 * - suggestHallSize - A function that triggers the hall size suggestion flow.
 * - SuggestHallSizeInput - The input type for the suggestHallSize function.
 * - SuggestHallSizeOutput - The return type for the suggestHallSize function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHallSizeInputSchema = z.object({
  eventType: z.string().describe('The type of event (e.g., Wedding, Birthday, Conference).'),
  numberOfGuests: z.number().describe('The number of guests attending the event.'),
});
export type SuggestHallSizeInput = z.infer<typeof SuggestHallSizeInputSchema>;

const SuggestHallSizeOutputSchema = z.object({
  suggestion: z.string().describe('The suggested hall.'),
  reasoning: z.string().describe('The reasoning behind the suggestion.'),
});
export type SuggestHallSizeOutput = z.infer<typeof SuggestHallSizeOutputSchema>;

export async function suggestHallSize(input: SuggestHallSizeInput): Promise<SuggestHallSizeOutput> {
  return suggestHallSizeFlow(input);
}

const hallData = [
  { id: 'hall-a', name: 'Grand Ballroom (Hall A)', capacity: 500 },
  { id: 'hall-b', name: 'Crystal Hall (Hall B)', capacity: 200 },
  { id: 'hall-c', name: 'Jasmine Garden (Outdoor)', capacity: 150 },
];

const suggestHallSizePrompt = ai.definePrompt({
  name: 'suggestHallSizePrompt',
  input: {schema: SuggestHallSizeInputSchema},
  output: {schema: SuggestHallSizeOutputSchema},
  prompt: `You are an expert event planner for a restaurant. Your task is to suggest the best hall for an event based on its type and the number of guests.

Here are the available halls and their capacities:
${JSON.stringify(hallData, null, 2)}

Event Details:
- Event Type: {{{eventType}}}
- Number of Guests: {{{numberOfGuests}}}

Analyze the requirements and suggest the most suitable hall. 

Consider these factors:
- **Weddings** often require more space for a stage, dance floor, and elaborate decorations, so recommend a hall with a capacity at least 50-100 guests more than the guest count.
- **Conferences** need space for seating arrangements (theater, classroom), a stage, and potentially breakout areas. A comfortable margin of 20-30% extra capacity is good.
- **Birthday parties** are more flexible, but a little extra space is always good. A hall that closely matches the guest count or is slightly larger is usually sufficient.

Provide a specific suggestion and a brief, one-sentence reasoning for your choice. For example: "I suggest the Grand Ballroom. It provides ample space for a wedding of this size, including a dance floor and stage."
`,
});

const suggestHallSizeFlow = ai.defineFlow(
  {
    name: 'suggestHallSizeFlow',
    inputSchema: SuggestHallSizeInputSchema,
    outputSchema: SuggestHallSizeOutputSchema,
  },
  async (input) => {
    const {output} = await suggestHallSizePrompt(input);
    return output!;
  }
);
