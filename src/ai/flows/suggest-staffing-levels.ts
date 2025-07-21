 'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting optimal staffing levels based on predicted sales volume.
 *
 * - suggestStaffingLevels - A function that handles the process of suggesting staffing levels.
 * - SuggestStaffingLevelsInput - The input type for the suggestStaffingLevels function.
 * - SuggestStaffingLevelsOutput - The return type for the suggestStaffingLevels function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestStaffingLevelsInputSchema = z.object({
  predictedSalesVolume: z
    .number()
    .describe('The predicted sales volume for the day.'),
  historicalSalesData: z
    .string()
    .describe(
      'Historical sales data, including dates, sales volume, and staffing levels.'
    ),
  currentStaffingLevels: z
    .string()
    .describe('The current staffing levels, including roles and numbers.'),
  restaurantType: z
    .string()
    .describe(
      'Restaurant type which can be fine dining, casual dining, fast food, cafe etc.'
    ),
});
export type SuggestStaffingLevelsInput = z.infer<typeof SuggestStaffingLevelsInputSchema>;

const SuggestStaffingLevelsOutputSchema = z.object({
  suggestedStaffingLevels: z
    .string()
    .describe(
      'The suggested staffing levels, including roles and numbers, with reasoning.'
    ),
});
export type SuggestStaffingLevelsOutput = z.infer<typeof SuggestStaffingLevelsOutputSchema>;

export async function suggestStaffingLevels(
  input: SuggestStaffingLevelsInput
): Promise<SuggestStaffingLevelsOutput> {
  return suggestStaffingLevelsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestStaffingLevelsPrompt',
  input: {schema: SuggestStaffingLevelsInputSchema},
  output: {schema: SuggestStaffingLevelsOutputSchema},
  prompt: `You are an experienced restaurant manager. Based on the predicted sales volume, historical sales data, 
  current staffing levels and restaurant type, suggest optimal staffing levels.

  Predicted Sales Volume: {{{predictedSalesVolume}}}
  Historical Sales Data: {{{historicalSalesData}}}
  Current Staffing Levels: {{{currentStaffingLevels}}}
  Restaurant Type: {{{restaurantType}}}

  Consider factors like peak hours, customer service standards, and labor costs. 
  Provide a clear and concise suggestion for staffing levels, including roles and numbers, with a brief reasoning.
  The response should be formatted as:

  Suggested Staffing Levels:
  - Role 1: Number
  - Role 2: Number
  ...and so on.

  Reasoning: [Brief explanation of why these staffing levels are recommended.]`,
});

const suggestStaffingLevelsFlow = ai.defineFlow(
  {
    name: 'suggestStaffingLevelsFlow',
    inputSchema: SuggestStaffingLevelsInputSchema,
    outputSchema: SuggestStaffingLevelsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);









