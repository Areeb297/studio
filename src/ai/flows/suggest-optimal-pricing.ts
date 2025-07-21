'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting optimal menu pricing based on recipe costs and market analysis.
 *
 * - suggestOptimalPricing - A function that handles the optimal pricing suggestion process.
 * - SuggestOptimalPricingInput - The input type for the suggestOptimalPricing function.
 * - SuggestOptimalPricingOutput - The return type for the suggestOptimalPricing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalPricingInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  recipeCost: z.number().describe('The total cost of the recipe.'),
  marketAnalysis: z.string().describe('The market analysis of similar meals.'),
  targetGrossProfitMultiplier: z
    .number()
    .optional()
    .describe(
      'The target gross profit multiplier (e.g., 2.25x or 2.5x). Defaults to 2.5x if not provided.'
    ),
});
export type SuggestOptimalPricingInput = z.infer<
  typeof SuggestOptimalPricingInputSchema
>;

const SuggestOptimalPricingOutputSchema = z.object({
  suggestedPrice: z.number().describe('The suggested menu price.'),
  reasoning: z.string().describe('The reasoning behind the suggested price.'),
});
export type SuggestOptimalPricingOutput = z.infer<
  typeof SuggestOptimalPricingOutputSchema
>;

export async function suggestOptimalPricing(
  input: SuggestOptimalPricingInput
): Promise<SuggestOptimalPricingOutput> {
  return suggestOptimalPricingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalPricingPrompt',
  input: {schema: SuggestOptimalPricingInputSchema},
  output: {schema: SuggestOptimalPricingOutputSchema},
  prompt: `You are a pricing expert for restaurants. Given the recipe cost, market analysis, and target gross profit multiplier, suggest an optimal menu price for the recipe.

Recipe Name: {{{recipeName}}}
Recipe Cost: {{{recipeCost}}}
Market Analysis: {{{marketAnalysis}}}
Target Gross Profit Multiplier: {{targetGrossProfitMultiplier}}

Consider the market analysis and the target gross profit multiplier to suggest a price that maximizes profit while remaining competitive.

Reason your suggested price.
`,
});

const suggestOptimalPricingFlow = ai.defineFlow(
  {
    name: 'suggestOptimalPricingFlow',
    inputSchema: SuggestOptimalPricingInputSchema,
    outputSchema: SuggestOptimalPricingOutputSchema,
  },
  async input => {
    const {
      recipeCost,
      marketAnalysis,
      targetGrossProfitMultiplier = 2.5, // Default value
    } = input;

    const {output} = await prompt({
      ...input,
      targetGrossProfitMultiplier,
    });

    return output!;
  }
);
