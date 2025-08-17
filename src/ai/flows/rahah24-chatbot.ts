'use server';

/**
 * @fileOverview Rahah24 Global Chatbot AI Flow
 * 
 * - rahah24Chatbot - AI assistant for Jamia Binoria's multi-business ERP system
 * - Provides context-aware support for Restaurant, Shadi Lawn, Gym Time, and Madrasa
 * - ChatbotInput - Input schema for chatbot messages
 * - ChatbotOutput - Response schema for chatbot replies
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatbotInputSchema = z.object({
  message: z.string().describe('User message to the chatbot'),
  businessContext: z.string().optional().describe('Current business line context (restaurant, shadi-lawn, gym-time, madrasa)'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().describe('Previous conversation history'),
  currentPage: z.string().optional().describe('Current dashboard page or section'),
});

export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('AI assistant response'),
  suggestedActions: z.array(z.string()).optional().describe('Suggested follow-up actions or questions'),
});

export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function rahah24Chatbot(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const chatbotPrompt = ai.definePrompt({
  name: 'rahah24ChatbotPrompt',
  input: { schema: ChatbotInputSchema },
  output: { schema: ChatbotOutputSchema },
  prompt: `You are Rahah24 AI Assistant, a helpful AI assistant for Jamia Binoria's comprehensive ERP system.

You provide support for four main business lines:
1. **Restaurant** - Food service, menu management, sales tracking, inventory
2. **Shadi Lawn** - Event venue management, bookings, event planning
3. **Gym Time** - Fitness center operations, member management, equipment tracking
4. **Tahfeez Madrasa** - Islamic education, Quran memorization (Hifz), student progress

Current Context:
- Business Line: {{{businessContext}}}
- Current Page: {{{currentPage}}}
- User Message: {{{message}}}
- Chat History: {{{chatHistory}}}

Guidelines:
1. **Be Context-Aware**: Tailor responses based on the current business line and page
2. **Islamic Values**: Always maintain Islamic principles and respectful language
3. **Practical Help**: Provide actionable guidance for dashboard navigation, data interpretation, and business insights
4. **Educational Support**: For Madrasa context, offer Islamic education guidance
5. **Professional Tone**: Maintain a helpful, respectful, and professional demeanor

For Restaurant context: Help with sales analysis, menu optimization, inventory management, financial tracking
For Shadi Lawn context: Assist with event planning, venue management, booking coordination
For Gym Time context: Support fitness operations, member management, equipment tracking
For Madrasa context: Provide Islamic education guidance, student progress tracking, Hifz monitoring

Always end responses with relevant follow-up suggestions when appropriate.

Response format (JSON):
{
  "response": "Your helpful response here",
  "suggestedActions": ["Action 1", "Action 2", "Action 3"]
}`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'rahah24ChatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    const { output } = await chatbotPrompt(input);
    return output!;
  }
);