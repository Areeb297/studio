
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip, Line, LineChart } from "recharts";
import { BrainCircuit, Sparkles, Lightbulb, TrendingUp, DollarSign } from "lucide-react";
import { forecastDemand, ForecastDemandInput, ForecastDemandOutput } from '@/ai/flows/forecast-demand';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data representing historical sales
const mockHistoricalSales = [
  { "menu_item": "Chicken Biryani", "date": "2024-07-20", "quantity": 50 },
  { "menu_item": "Mutton Karahi", "date": "2024-07-20", "quantity": 30 },
  { "menu_item": "BBQ Platter", "date": "2024-07-20", "quantity": 25 },
  { "menu_item": "Chicken Biryani", "date": "2024-07-21", "quantity": 55 },
  { "menu_item": "Mutton Karahi", "date": "2024-07-21", "quantity": 32 },
  { "menu_item": "Mint Margarita", "date": "2024-07-21", "quantity": 60 },
];

const menuItemsToForecast = "Chicken Biryani, Mutton Karahi, BBQ Platter, Mint Margarita";

// Mock AI response structure
const mockForecastData: ForecastDemandOutput = {
  demandForecasts: [
    { item: 'Chicken Biryani', predicted_sales: 350 },
    { item: 'Mutton Karahi', predicted_sales: 210 },
    { item: 'BBQ Platter', predicted_sales: 150 },
    { item: 'Mint Margarita', predicted_sales: 400 },
  ],
  stockRecommendations: [
    { item: 'Chicken Biryani', recommendation: 'Order 250 units of chicken and rice.' },
    { item: 'Mutton Karahi', recommendation: 'Order 160 units of mutton.' },
    { item: 'BBQ Platter', recommendation: 'Order 110 units of mixed grill items.' },
    { item: 'Mint Margarita', recommendation: 'Order 200 units of mint and lemons.' },
  ],
  weeklyRevenueForecast: [
      { day: 'Mon', revenue: 120000 },
      { day: 'Tue', revenue: 135000 },
      { day: 'Wed', revenue: 140000 },
      { day: 'Thu', revenue: 160000 },
      { day: 'Fri', revenue: 220000 },
      { day: 'Sat', revenue: 280000 },
      { day: 'Sun', revenue: 250000 },
  ],
  overallInsight: "Expect a high demand for Chicken Biryani and Mint Margaritas this week, likely due to warm weather. Revenue is projected to peak on Saturday. Ensure key ingredients are well-stocked by Wednesday to meet the weekend rush and maximize profitability."
};


export default function ForecastingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [forecastResult, setForecastResult] = useState<ForecastDemandOutput | null>(null);

  const handleGenerateForecast = async () => {
    setIsLoading(true);
    setForecastResult(null);
    try {
      // To use the real AI flow, uncomment the following lines.
      // const input: ForecastDemandInput = {
      //   historicalSalesData: JSON.stringify(mockHistoricalSales),
      //   menuItems: menuItemsToForecast,
      // };
      // const result = await forecastDemand(input);
      // setForecastResult(result);
      
      // Using mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      setForecastResult(mockForecastData);

    } catch (error) {
      console.error("Failed to generate forecast:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGenerateForecast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Demand & Revenue Forecasting</h1>
        <Button onClick={handleGenerateForecast} disabled={isLoading}>
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? 'Generating Forecast...' : 'Generate AI Forecast'}
        </Button>
      </div>

      {isLoading && (
        <div className="grid lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="w-full h-[300px]" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="w-full h-[300px]" />
                </CardContent>
            </Card>
        </div>
      )}

      {!isLoading && !forecastResult && (
         <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center h-96 w-full border-2 border-dashed rounded-lg">
                <BrainCircuit className="w-16 h-16 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Click "Generate AI Forecast" to predict demand, revenue, and stock needs.</p>
              </div>
            </CardContent>
        </Card>
      )}

      {forecastResult && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Lightbulb className="text-primary"/>AI-Powered Insights</CardTitle>
              <CardDescription>A high-level summary of the demand and revenue forecast for the upcoming week.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{forecastResult.overallInsight}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><DollarSign />Weekly Revenue Forecast</CardTitle>
                <CardDescription>Projected daily revenue for the next 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={forecastResult.weeklyRevenueForecast}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis tickFormatter={(value) => `PKR ${value/1000}k`}/>
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                            formatter={(value: number) => [`PKR ${value.toLocaleString()}`, "Revenue"]}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} name="Predicted Revenue" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp/>Predicted Sales Volume</CardTitle>
                <CardDescription>Forecasted sales for top menu items for the next 7 days.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={forecastResult.demandForecasts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="item" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                    <Legend />
                    <Bar dataKey="predicted_sales" fill="hsl(var(--primary))" name="Predicted Sales (Units)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Stock Recommendations</CardTitle>
                <CardDescription>AI-driven suggestions to meet predicted demand.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Recommendation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forecastResult.stockRecommendations.map((rec) => (
                      <TableRow key={rec.item}>
                        <TableCell className="font-medium">{rec.item}</TableCell>
                        <TableCell>{rec.recommendation}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

    </div>
  );
}
