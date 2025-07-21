'use server';

/**
 * @fileOverview Forecasts demand for menu items based on historical sales data.
 *
 * - forecastDemand - A function that forecasts demand for menu items.
 * - ForecastDemandInput - The input type for the forecastDemand function.
 * - ForecastDemandOutput - The return type for the forecastDemand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastDemandInputSchema = z.object({
  historicalSalesData: z
    .string()
    .describe(
      'Historical sales data in JSON format.  Each object represents a sale and must contain the menu item name and sale date.'
    ),
  menuItems: z
    .string()
    .describe('A list of menu items to forecast demand for, comma separated.'),
});
export type ForecastDemandInput = z.infer<typeof ForecastDemandInputSchema>;

const ForecastDemandOutputSchema = z.object({
  demandForecasts: z
    .string()
    .describe(
      'A JSON array containing demand forecasts for each menu item, with projected sales volume.'
    ),
  stockRecommendations: z
    .string()
    .describe(
      'A JSON array containing stock recommendations for each menu item, including quantity to order.'
    ),
});
export type ForecastDemandOutput = z.infer<typeof ForecastDemandOutputSchema>;

export async function forecastDemand(input: ForecastDemandInput): Promise<ForecastDemandOutput> {
  return forecastDemandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastDemandPrompt',
  input: {schema: ForecastDemandInputSchema},
  output: {schema: ForecastDemandOutputSchema},
  prompt: `You are an expert restaurant consultant specializing in demand forecasting.

You will receive historical sales data and a list of menu items.
Your goal is to forecast demand for each menu item and provide stock recommendations.

Historical Sales Data: {{{historicalSalesData}}}
Menu Items: {{{menuItems}}}

Based on this data, generate a demand forecast for each menu item, predicting the sales volume.
Also, provide stock recommendations for each menu item, including the quantity to order to meet the forecasted demand.

Ensure that both the demand forecasts and stock recommendations are returned in JSON format.
`,
});

const forecastDemandFlow = ai.defineFlow(
  {
    name: 'forecastDemandFlow',
    inputSchema: ForecastDemandInputSchema,
    outputSchema: ForecastDemandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
