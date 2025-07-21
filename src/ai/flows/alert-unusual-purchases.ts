'use server';

/**
 * @fileOverview This file defines a Genkit flow for alerting storekeepers about unusual purchases or spikes in consumption/wastage.
 *
 * - alertUnusualPurchases - A function that triggers the unusual purchase alert flow.
 * - AlertUnusualPurchasesInput - The input type for the alertUnusualPurchases function.
 * - AlertUnusualPurchasesOutput - The return type for the alertUnusualPurchases function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AlertUnusualPurchasesInputSchema = z.object({
  item: z.string().describe('The name of the item purchased or consumed.'),
  quantity: z.number().describe('The quantity of the item purchased or consumed.'),
  purchaseRate: z.number().optional().describe('The rate at which the item was purchased, if applicable.'),
  agreedRate: z.number().optional().describe('The agreed rate for the item, if applicable.'),
  consumptionRate: z.number().optional().describe('The current consumption rate of the item.'),
  averageConsumptionRate: z.number().optional().describe('The average consumption rate of the item over a period.'),
  wastageRate: z.number().optional().describe('The current wastage rate of the item.'),
  averageWastageRate: z.number().optional().describe('The average wastage rate of the item over a period.'),
  period: z.string().optional().describe('The period over which consumption/wastage is being measured (e.g., daily, weekly).'),
  thresholdMultiplier: z
    .number()
    .default(2)
    .describe(
      'The multiplier to determine the threshold for unusual spikes (e.g., 2 for twice the average).'
    ),
});
export type AlertUnusualPurchasesInput = z.infer<typeof AlertUnusualPurchasesInputSchema>;

const AlertUnusualPurchasesOutputSchema = z.object({
  isUnusual: z.boolean().describe('Whether the purchase or consumption/wastage is considered unusual.'),
  reason: z.string().describe('The reason why the purchase or consumption/wastage is considered unusual.'),
  recommendation: z.string().describe('A recommendation for the storekeeper based on the unusual activity.'),
});
export type AlertUnusualPurchasesOutput = z.infer<typeof AlertUnusualPurchasesOutputSchema>;

export async function alertUnusualPurchases(input: AlertUnusualPurchasesInput): Promise<AlertUnusualPurchasesOutput> {
  return alertUnusualPurchasesFlow(input);
}

const alertUnusualPurchasesPrompt = ai.definePrompt({
  name: 'alertUnusualPurchasesPrompt',
  input: {schema: AlertUnusualPurchasesInputSchema},
  output: {schema: AlertUnusualPurchasesOutputSchema},
  prompt: `You are an AI assistant that helps storekeepers identify unusual purchases, consumption, or wastage of items in their inventory.

You will receive data about an item, its purchase rate (if applicable), agreed rate (if applicable), consumption rate, average consumption rate, wastage rate, and average wastage rate.

Your task is to determine if the purchase or consumption/wastage is unusual and provide a reason and recommendation.

Here's the data:

Item: {{{item}}}
Quantity: {{{quantity}}}
{{~#if purchaseRate}}Purchase Rate: {{{purchaseRate}}}{{/if}}
{{~#if agreedRate}}Agreed Rate: {{{agreedRate}}}{{/if}}
{{~#if consumptionRate}}Consumption Rate ({{period}}): {{{consumptionRate}}}{{/if}}
{{~#if averageConsumptionRate}}Average Consumption Rate ({{period}}): {{{averageConsumptionRate}}}{{/if}}
{{~#if wastageRate}}Wastage Rate ({{period}}): {{{wastageRate}}}{{/if}}
{{~#if averageWastageRate}}Average Wastage Rate ({{period}}): {{{averageWastageRate}}}{{/if}}
Threshold Multiplier: {{{thresholdMultiplier}}}

Consider the following factors to determine if the activity is unusual:

*   **Purchase Rate vs. Agreed Rate:** If the purchase rate is significantly higher than the agreed rate, it might be a sign of overpaying or unauthorized purchasing.
*   **Consumption/Wastage Rate vs. Average:** If the consumption or wastage rate is significantly higher than the average, it might indicate inefficiencies, spoilage, or theft.
*   **Quantity:** A large purchase quantity could also trigger an alert if it exceeds typical order sizes.

Based on your analysis, set the 
isUnusual field to 
true or false. Provide a concise 
reason explaining why the activity is considered unusual or normal.  Also provide a short recommendation for the storekeeper.

Example:

{
  "isUnusual": true,
  "reason": "The purchase rate (PKR 320) is significantly higher than the agreed rate (PKR 300), indicating a potential overpayment.",
  "recommendation": "Investigate the purchase to ensure the agreed rate was applied correctly and identify any unauthorized purchases."
}

Output:`,}
);

const alertUnusualPurchasesFlow = ai.defineFlow(
  {
    name: 'alertUnusualPurchasesFlow',
    inputSchema: AlertUnusualPurchasesInputSchema,
    outputSchema: AlertUnusualPurchasesOutputSchema,
  },
  async input => {
    const {output} = await alertUnusualPurchasesPrompt(input);
    return output!;
  }
);
