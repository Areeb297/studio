import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";

export default function ForecastingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Demand Forecasting</h1>
       <Card>
        <CardHeader>
          <CardTitle>AI-Powered Forecasts</CardTitle>
          <CardDescription>Predict demand patterns and get stock recommendations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <BrainCircuit className="w-16 h-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Demand forecasts and stock recommendations will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
