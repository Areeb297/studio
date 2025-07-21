import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Sales Recording</h1>
       <Card>
        <CardHeader>
          <CardTitle>Manual Sales Entry</CardTitle>
          <CardDescription>Record sales transactions manually or view POS data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <ShoppingCart className="w-16 h-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Sales recording forms and transaction lists will be here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
