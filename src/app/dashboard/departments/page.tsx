import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function DepartmentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Department-Wise Cost Control</h1>
      <Card>
        <CardHeader>
          <CardTitle>Departments Overview</CardTitle>
          <CardDescription>Monitor consumption and costs for each department.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <Building2 className="w-16 h-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Department-specific data and controls will be displayed here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
