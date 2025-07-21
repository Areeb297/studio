import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function FeedbackPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Customer Feedback</h1>
       <Card>
        <CardHeader>
          <CardTitle>Feedback Analysis</CardTitle>
          <CardDescription>Analyze customer feedback from digital comment cards.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <MessageSquare className="w-16 h-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Customer feedback and sentiment analysis will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
