import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Banknote } from "lucide-react";

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Financials</h1>
       <Card>
        <CardHeader>
          <CardTitle>Financial Reports</CardTitle>
          <CardDescription>Access Balance Sheets, P&L Statements, and other financial reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <Banknote className="w-16 h-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Detailed financial reports and ERP data will be displayed here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
