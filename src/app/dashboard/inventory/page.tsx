import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Warehouse } from "lucide-react";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Inventory Management</h1>
       <Card>
        <CardHeader>
          <CardTitle>Stock Levels</CardTitle>
          <CardDescription>Manage daily stock, vendors, and purchasing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <Warehouse className="w-16 h-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Inventory data and management tools will be displayed here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
