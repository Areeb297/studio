
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

const AnalyzeFeedbackInputSchema = z.object({
  feedbackText: z.string().describe('The raw text of the feedback provided by a customer or vendor.'),
  source: z.string().describe('The source of the feedback (e.g., "Digital Comment Card", "Google Form", "Vendor Email").'),
});
export type AnalyzeFeedbackInput = z.infer<typeof AnalyzeFeedbackInputSchema>;

const AnalyzeFeedbackOutputSchema = z.object({
  sentiment: z
    .enum(['Positive', 'Negative', 'Neutral'])
    .describe('The overall sentiment of the feedback.'),
  summary: z
    .string()
    .describe('A concise summary of the key points mentioned in the feedback.'),
  keyTopics: z
    .array(z.string())
    .describe('A list of the main topics or categories discussed (e.g., "Food Quality", "Service", "Ambiance", "Pricing").'),
  relevantDepartments: z
    .array(z.string())
    .describe('A list of the departments this feedback is relevant to (e.g., "Kitchen (Pakistani)", "Janitorial", "Service Staff", "Management").'),
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
    4.  **Identify Relevant Departments**: Identify which department(s) the feedback pertains to. Use specific tags like "Kitchen (Pakistani)", "Kitchen (Chinese)", "Kitchen (BBQ)", "Janitorial", "Service Staff", "Management", "Front Desk". If it's about general atmosphere, use "Ambiance".
    5.  **Suggest Action**: Recommend a concrete next step for the management or staff. For example, "Share positive feedback with Chef Ali," "Forward cleanliness issue to the janitorial supervisor," or "Discuss slow service with the floor manager."

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
