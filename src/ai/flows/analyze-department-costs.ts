'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing departmental costs and providing optimization suggestions.
 *
 * - analyzeDepartmentCosts - A function that triggers the cost analysis flow.
 * - AnalyzeDepartmentCostsInput - The input type for the analyzeDepartmentCosts function.
 * - AnalyzeDepartmentCostsOutput - The return type for the analyzeDepartmentCosts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DepartmentCostSchema = z.object({
  department: z.string().describe('The name of the department (e.g., Kitchen, Service Staff, Janitorial).'),
  currentMonthCost: z.number().describe("The department's total cost for the current month."),
  previousMonthCost: z.number().describe("The department's total cost for the previous month."),
  notes: z.string().optional().describe("Any relevant notes, like 'Increased ingredient prices' or 'New staff hired'."),
});

const AnalyzeDepartmentCostsInputSchema = z.object({
  departmentCosts: z.array(DepartmentCostSchema).describe('An array of cost data for various departments.'),
});
export type AnalyzeDepartmentCostsInput = z.infer<typeof AnalyzeDepartmentCostsInputSchema>;

const AnalyzeDepartmentCostsOutputSchema = z.object({
  costAnalysis: z.string().describe('A high-level summary of the overall cost performance and key trends.'),
  strugglingDepartments: z.array(z.string()).describe('A list of departments that are struggling or showing significant negative trends.'),
  recommendations: z.array(z.object({
    department: z.string(),
    suggestion: z.string(),
  })).describe('A list of specific, actionable recommendations for management to optimize costs in each department.'),
});
export type AnalyzeDepartmentCostsOutput = z.infer<typeof AnalyzeDepartmentCostsOutputSchema>;

export async function analyzeDepartmentCosts(input: AnalyzeDepartmentCostsInput): Promise<AnalyzeDepartmentCostsOutput> {
  return analyzeDepartmentCostsFlow(input);
}

const analyzeDepartmentCostsPrompt = ai.definePrompt({
  name: 'analyzeDepartmentCostsPrompt',
  input: { schema: AnalyzeDepartmentCostsInputSchema },
  output: { schema: AnalyzeDepartmentCostsOutputSchema },
  prompt: `You are an expert restaurant operations consultant specializing in cost control and departmental efficiency.

You will receive cost data for several restaurant departments for the current and previous months.

Department Cost Data:
{{{json departmentCosts}}}

Your task is to analyze this data and provide a comprehensive report for management.

1.  **Cost Analysis:** Write a high-level summary (2-3 sentences) of the overall cost situation. Identify the biggest spending departments and any significant month-over-month changes.
2.  **Identify Struggling Departments:** Based on significant cost increases or high sustained costs, identify which departments are "struggling" and need management's attention.
3.  **Provide Actionable Recommendations:** For each department, provide one specific, actionable recommendation to help control or optimize their costs. Recommendations could include renegotiating with suppliers, optimizing recipes, adjusting staffing schedules, improving inventory management, or implementing new cleaning protocols.

Structure your entire output as a single JSON object that strictly conforms to the provided output schema.
`,
});

const analyzeDepartmentCostsFlow = ai.defineFlow(
  {
    name: 'analyzeDepartmentCostsFlow',
    inputSchema: AnalyzeDepartmentCostsInputSchema,
    outputSchema: AnalyzeDepartmentCostsOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeDepartmentCostsPrompt(input);
    return output!;
  }
);
