'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing customer or vendor feedback.
 *
 * - analyzeFeedback - A function that triggers the feedback analysis flow.
 * - AnalyzeFeedbackInput - The input type for the analyzeFeedback function.
 * - AnalyzeFeedbackOutput - The return type for the analyzeFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeFeedbackInputSchema = z.object({
  feedbackText: z.string().describe('The raw text of the feedback provided by a customer or vendor.'),
  source: z.string().describe('The source of the feedback (e.g., "Digital Comment Card", "Google Form", "Vendor Email").'),
});
export type AnalyzeFeedbackInput = z.infer<typeof AnalyzeFeedbackInputSchema>;

export const AnalyzeFeedbackOutputSchema = z.object({
  sentiment: z
    .enum(['Positive', 'Negative', 'Neutral'])
    .describe('The overall sentiment of the feedback.'),
  summary: z
    .string()
    .describe('A concise summary of the key points mentioned in the feedback.'),
  keyTopics: z
    .array(z.string())
    .describe('A list of the main topics or categories discussed (e.g., "Food Quality", "Service", "Ambiance", "Pricing").'),
  suggestedAction: z
    .string()
    .describe('A specific, actionable recommendation for the restaurant staff based on the feedback.'),
});
export type AnalyzeFeedbackOutput = z.infer<typeof AnalyzeFeedbackOutputSchema>;


export async function analyzeFeedback(input: AnalyzeFeedbackInput): Promise<AnalyzeFeedbackOutput> {
    return analyzeFeedbackFlow(input);
}

const analyzeFeedbackPrompt = ai.definePrompt({
    name: 'analyzeFeedbackPrompt',
    input: { schema: AnalyzeFeedbackInputSchema },
    output: { schema: AnalyzeFeedbackOutputSchema },
    prompt: `You are an expert restaurant operations analyst. Your task is to analyze a piece of feedback and extract structured insights.

    Feedback Source: {{{source}}}
    Feedback Text:
    "{{{feedbackText}}}"

    Analyze the feedback and perform the following actions:
    1.  **Determine Sentiment**: Classify the overall sentiment as 'Positive', 'Negative', or 'Neutral'.
    2.  **Summarize Feedback**: Provide a one-sentence summary of the core message.
    3.  **Identify Key Topics**: List the main topics mentioned. Topics can include Food Quality, Service, Ambiance, Pricing, Cleanliness, Staff Behavior, etc.
    4.  **Suggest Action**: Recommend a concrete next step for the management or staff. For example, "Share positive feedback with Chef Ali," "Investigate slow service claims during peak hours," or "No action needed for neutral comment."

    Provide the output in a structured JSON format.
    `,
});

const analyzeFeedbackFlow = ai.defineFlow(
    {
        name: 'analyzeFeedbackFlow',
        inputSchema: AnalyzeFeedbackInputSchema,
        outputSchema: AnalyzeFeedbackOutputSchema,
    },
    async (input) => {
        const { output } = await analyzeFeedbackPrompt(input);
        return output!;
    }
);
