import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookCopy } from "lucide-react";

export default function MenuPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Menu &amp; Recipe Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recipe Costing</CardTitle>
          <CardDescription>Define menu items, manage recipes, and calculate costs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <BookCopy className="w-16 h-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Menu items and recipe costing tools will be available here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
