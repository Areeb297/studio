'use server';

/**
 * @fileOverview AI-powered insights generation flow.
 *
 * - generateAiInsights - A function that generates AI-based suggestions, analysis, charts, and recommendations for restaurant owners.
 * - GenerateAiInsightsInput - The input type for the generateAiInsights function.
 * - GenerateAiInsightsOutput - The return type for the generateAiInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiInsightsInputSchema = z.object({
  salesData: z.string().describe('Sales data in JSON format.'),
  stockData: z.string().describe('Stock data in JSON format.'),
  menuData: z.string().describe('Menu data in JSON format.'),
  feedbackData: z.string().describe('Customer feedback data in JSON format.'),
  preferences: z
    .string()
    .optional()
    .describe(
      'Any specific preferences or areas of focus for the analysis (optional).' // Corrected the typo here
    ),
});
export type GenerateAiInsightsInput = z.infer<typeof GenerateAiInsightsInputSchema>;

const GenerateAiInsightsOutputSchema = z.object({
  suggestions: z.string().describe('AI-generated suggestions for improvement.'),
  analysis: z.string().describe('Analysis of key business metrics.'),
  chartsData: z.string().describe('Data for generating charts (e.g., in JSON format).'),
  recommendations: z.string().describe('Actionable recommendations based on the analysis.'),
});
export type GenerateAiInsightsOutput = z.infer<typeof GenerateAiInsightsOutputSchema>;

export async function generateAiInsights(input: GenerateAiInsightsInput): Promise<GenerateAiInsightsOutput> {
  return generateAiInsightsFlow(input);
}

const generateAiInsightsPrompt = ai.definePrompt({
  name: 'generateAiInsightsPrompt',
  input: {schema: GenerateAiInsightsInputSchema},
  output: {schema: GenerateAiInsightsOutputSchema},
  prompt: `You are an AI assistant for restaurant owners, providing data-driven insights.

  Analyze the following data to generate suggestions, analysis, chart data, and recommendations.

  Sales Data: {{{salesData}}}
  Stock Data: {{{stockData}}}
  Menu Data: {{{menuData}}}
  Customer Feedback Data: {{{feedbackData}}}
  Preferences: {{{preferences}}}

  Based on this data, provide actionable insights to improve the business.

  Format the chart data in a way that is suitable for generating charts using a charting library (e.g., JSON format).
  Make sure the suggestions and recommendations are specific and practical.

  Output should be formatted in JSON:
  {
    "suggestions": "...",
    "analysis": "...",
    "chartsData": "...",
    "recommendations": "..."
  }`,
});

const generateAiInsightsFlow = ai.defineFlow(
  {
    name: 'generateAiInsightsFlow',
    inputSchema: GenerateAiInsightsInputSchema,
    outputSchema: GenerateAiInsightsOutputSchema,
  },
  async input => {
    const {output} = await generateAiInsightsPrompt(input);
    return output!;
  }
);
