'use server';

/**
 * @fileOverview Forecasts demand for menu items and overall revenue based on historical sales data.
 *
 * - forecastDemand - A function that forecasts demand for menu items and revenue.
 * - ForecastDemandInput - The input type for the forecastDemand function.
 * - ForecastDemandOutput - The return type for the forecastDemand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastDemandInputSchema = z.object({
  historicalSalesData: z
    .string()
    .describe(
      'Historical sales data in JSON format. Each object represents a sale and must contain the menu item name, sale date, and quantity.'
    ),
  menuItems: z
    .string()
    .describe('A list of menu items to forecast demand for, comma separated.'),
});
export type ForecastDemandInput = z.infer<typeof ForecastDemandInputSchema>;

const WeeklyRevenueForecastSchema = z.object({
    day: z.string().describe("Day of the week (e.g., 'Mon', 'Tue')"),
    revenue: z.number().describe("Predicted revenue for that day"),
});

const DemandForecastSchema = z.object({
    item: z.string(),
    predicted_sales: z.number(),
});

const StockRecommendationSchema = z.object({
    item: z.string(),
    recommendation: z.string(),
});

const ForecastDemandOutputSchema = z.object({
  demandForecasts: z.array(DemandForecastSchema)
    .describe(
      'A JSON array containing demand forecasts for each menu item, with projected sales volume.'
    ),
  stockRecommendations: z.array(StockRecommendationSchema)
    .describe(
      'A JSON array containing stock recommendations for each menu item, including quantity to order.'
    ),
  weeklyRevenueForecast: z.array(WeeklyRevenueForecastSchema)
    .describe(
      'A JSON array containing the predicted revenue for each day of the upcoming week.'
    ),
  overallInsight: z.string().describe("A high-level summary of the forecast, including key trends and actionable advice."),
});
export type ForecastDemandOutput = z.infer<typeof ForecastDemandOutputSchema>;

export async function forecastDemand(input: ForecastDemandInput): Promise<ForecastDemandOutput> {
  return forecastDemandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastDemandPrompt',
  input: {schema: ForecastDemandInputSchema},
  output: {schema: ForecastDemandOutputSchema},
  prompt: `You are an expert restaurant consultant specializing in demand and revenue forecasting.

You will receive historical sales data and a list of menu items.
Your goal is to forecast demand for each menu item, provide stock recommendations, and predict the total revenue for the upcoming week.

Historical Sales Data: {{{historicalSalesData}}}
Menu Items: {{{menuItems}}}

Based on this data, perform the following tasks:
1.  **Demand Forecast**: Generate a demand forecast for each specified menu item, predicting the sales volume in units for the next 7 days.
2.  **Stock Recommendations**: Provide specific stock ordering recommendations for each menu item to meet the forecasted demand.
3.  **Weekly Revenue Forecast**: Predict the total revenue for each day of the upcoming week (Monday to Sunday).
4.  **Overall Insight**: Write a concise, high-level summary of the forecast. Include key trends (e.g., "expect a 15% increase in sales this weekend"), mention best-selling items, and provide actionable advice for management.

Ensure that the entire output is a single JSON object that strictly conforms to the provided output schema.
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
