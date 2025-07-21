import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Reports &amp; Analytics</h1>
       <Card>
        <CardHeader>
          <CardTitle>Business Intelligence</CardTitle>
          <CardDescription>Analyze sales, profitability, and cost metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <LineChart className="w-16 h-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Detailed reports and analytics dashboards will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
