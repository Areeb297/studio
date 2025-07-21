import { config } from 'dotenv';
config();

import '@/ai/flows/generate-ai-insights.ts';
import '@/ai/flows/suggest-optimal-pricing.ts';
import '@/ai/flows/alert-unusual-purchases.ts';
import '@/ai/flows/forecast-demand.ts';
import '@/ai/flows/suggest-staffing-levels.ts';
import '@/ai/flows/suggest-hall-size.ts';
import '@/ai/flows/summarize-event-bookings.ts';
