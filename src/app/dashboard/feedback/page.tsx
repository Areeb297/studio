
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { analyzeFeedback, AnalyzeFeedbackInput, AnalyzeFeedbackOutput } from '@/ai/flows/analyze-feedback';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, Smile, Frown, Meh, Lightbulb } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

type Feedback = {
  id: string;
  author: string;
  source: string;
  feedbackText: string;
  analysis?: AnalyzeFeedbackOutput;
};

const mockFeedback: Omit<Feedback, 'id' | 'analysis'>[] = [
  { author: "Aisha Khan", source: "QR Code Scan", feedbackText: "The Chicken Biryani was absolutely delicious, best I've had in ages! The service was a bit slow during peak hours, but the staff was very polite." },
  { author: "Bilal Ahmed", source: "Google Form", feedbackText: "The ambiance is fantastic and very clean. However, the price for the BBQ platter felt a little high for the portion size." },
  { author: "Fatima Ali (Vendor)", source: "Vendor Email", feedbackText: "The delivery process was smooth and your receiving staff was very professional and efficient. A pleasure doing business." },
  { author: "John Doe", source: "QR Code Scan", feedbackText: "The restrooms could have been cleaner. It's an important detail that affects the whole experience." },
  { author: "Anonymous", source: "Digital Comment Card", feedbackText: "Just wanted to say the music was at a perfect volume. Made for a great dining experience." },
  { author: "Maria Garcia", source: "QR Code Scan", feedbackText: "I waited 15 minutes just to get a menu. The waiter, Areeb, seemed overwhelmed. Management needs to staff up."}
];


export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const processFeedback = async () => {
      setIsLoading(true);
      const processedFeedback = await Promise.all(
        mockFeedback.map(async (item, index) => {
          try {
            const analysis = await analyzeFeedback({ feedbackText: item.feedbackText, source: item.source });
            return { ...item, id: `fb-${index}`, analysis };
          } catch (error) {
            console.error("Failed to analyze feedback:", error);
            toast({
              title: "AI Analysis Failed",
              description: "Could not process a feedback item.",
              variant: "destructive",
            });
            return { ...item, id: `fb-${index}`, analysis: undefined };
          }
        })
      );
      setFeedbackList(processedFeedback);
      setIsLoading(false);
    };

    processFeedback();
  }, [toast]);

  const sentimentCounts = feedbackList.reduce((acc, item) => {
    if (item.analysis) {
      acc[item.analysis.sentiment] = (acc[item.analysis.sentiment] || 0) + 1;
    }
    return acc;
  }, {} as Record<AnalyzeFeedbackOutput['sentiment'], number>);
  
  const totalFeedback = feedbackList.length;
  const positivePercentage = totalFeedback > 0 ? ((sentimentCounts.Positive || 0) / totalFeedback) * 100 : 0;
  const negativePercentage = totalFeedback > 0 ? ((sentimentCounts.Negative || 0) / totalFeedback) * 100 : 0;
  const neutralPercentage = totalFeedback > 0 ? ((sentimentCounts.Neutral || 0) / totalFeedback) * 100 : 0;
  
  const overallInsight = "Overall sentiment is positive, with customers praising food quality (Kitchen) and ambiance. Key areas for improvement are service speed during peak times (Service Staff) and restroom cleanliness (Janitorial). Acknowledge staff politeness and address the operational concerns with respective department heads.";
  
  const allDepartments = [...new Set(feedbackList.flatMap(fb => fb.analysis?.relevantDepartments || []))];

  const getSentimentBadge = (sentiment?: AnalyzeFeedbackOutput['sentiment']) => {
     switch (sentiment) {
      case 'Positive': return <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 dark:border-green-500/50 dark:bg-green-500/10">Positive</Badge>;
      case 'Negative': return <Badge variant="destructive">Negative</Badge>;
      case 'Neutral': return <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 dark:border-yellow-500/50 dark:bg-yellow-500/10">Neutral</Badge>;
      default: return <Badge variant="secondary">N/A</Badge>;
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Customer Feedback Analysis</h1>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFeedback}</div>
            <p className="text-xs text-muted-foreground">From all sources</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Positive</CardTitle>
            <Smile className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentimentCounts.Positive || 0}</div>
            <p className="text-xs text-muted-foreground">{positivePercentage.toFixed(1)}% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Negative</CardTitle>
            <Frown className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentimentCounts.Negative || 0}</div>
            <p className="text-xs text-muted-foreground">{negativePercentage.toFixed(1)}% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Neutral</CardTitle>
            <Meh className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentimentCounts.Neutral || 0}</div>
            <p className="text-xs text-muted-foreground">{neutralPercentage.toFixed(1)}% of total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
            <CardHeader>
            <CardTitle>Feedback Inbox</CardTitle>
            <CardDescription>Live feed of customer and vendor feedback with AI analysis.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Author</TableHead>
                            <TableHead>Summary</TableHead>
                            <TableHead>Departments</TableHead>
                            <TableHead className="text-center">Sentiment</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {feedbackList.map((fb) => (
                        <TableRow key={fb.id}>
                            <TableCell className="font-medium">{fb.author}</TableCell>
                            <TableCell className="max-w-xs truncate text-muted-foreground">{fb.analysis?.summary || fb.feedbackText}</TableCell>
                             <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {fb.analysis?.relevantDepartments?.map(dep => <Badge key={dep} variant="secondary">{dep}</Badge>) || 'N/A'}
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                {getSentimentBadge(fb.analysis?.sentiment)}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lightbulb className="text-primary"/>AI Analysis & Recommendations</CardTitle>
                <CardDescription>High-level insights from all feedback.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="text-sm font-semibold mb-2">Overall Sentiment</h4>
                    <div className="space-y-2">
                        <div className='space-y-1'>
                            <div className="flex justify-between text-xs text-muted-foreground"><span>Positive</span><span>{positivePercentage.toFixed(0)}%</span></div>
                            <Progress value={positivePercentage} className="h-2 bg-green-500/20 [&>div]:bg-green-500" />
                        </div>
                        <div className='space-y-1'>
                            <div className="flex justify-between text-xs text-muted-foreground"><span>Negative</span><span>{negativePercentage.toFixed(0)}%</span></div>
                            <Progress value={negativePercentage} className="h-2 bg-red-500/20 [&>div]:bg-red-500" />
                        </div>
                         <div className='space-y-1'>
                             <div className="flex justify-between text-xs text-muted-foreground"><span>Neutral</span><span>{neutralPercentage.toFixed(0)}%</span></div>
                            <Progress value={neutralPercentage} className="h-2 bg-yellow-500/20 [&>div]:bg-yellow-500" />
                        </div>
                    </div>
                </div>

                 <div>
                    <h4 className="text-sm font-semibold mb-2">Impacted Departments</h4>
                    <div className="flex flex-wrap gap-2">
                        {isLoading ? <Skeleton className="w-full h-10" /> :
                         allDepartments.length > 0 ? allDepartments.map(dep => <Badge key={dep} variant="outline">{dep}</Badge>) : <p className="text-xs text-muted-foreground">No departments identified yet.</p>}
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold mb-2">Summary & Recommendation</h4>
                    <p className="text-sm text-muted-foreground">{isLoading ? <Skeleton className="w-full h-16" /> : overallInsight}</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
