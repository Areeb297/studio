
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Building2, TrendingDown, TrendingUp, Sparkles, Lightbulb, AlertCircle, DollarSign } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { analyzeDepartmentCosts, AnalyzeDepartmentCostsInput, AnalyzeDepartmentCostsOutput } from '@/ai/flows/analyze-department-costs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const departmentData = [
    { department: 'Kitchen', currentMonthCost: 1250000, previousMonthCost: 1180000, notes: 'Ingredient prices for meat increased by 5%' },
    { department: 'Service Staff', currentMonthCost: 850000, previousMonthCost: 820000, notes: 'Overtime hours for weekend shifts' },
    { department: 'Janitorial', currentMonthCost: 150000, previousMonthCost: 160000, notes: 'Switched to a more cost-effective cleaning supplier' },
    { department: 'Marketing', currentMonthCost: 200000, previousMonthCost: 150000, notes: 'New social media campaign launched' },
    { department: 'Admin', currentMonthCost: 300000, previousMonthCost: 300000, notes: '' },
];

export default function DepartmentsPage() {
    const [aiAnalysis, setAiAnalysis] = useState<AnalyzeDepartmentCostsOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const totalCurrentCost = departmentData.reduce((acc, dept) => acc + dept.currentMonthCost, 0);
    const topSpender = departmentData.reduce((prev, current) => (prev.currentMonthCost > current.currentMonthCost) ? prev : current);

    const handleRunAnalysis = async () => {
        setIsLoading(true);
        setAiAnalysis(null);
        try {
            const input: AnalyzeDepartmentCostsInput = { departmentCosts: departmentData };
            const result = await analyzeDepartmentCosts(input);
            setAiAnalysis(result);
        } catch (error) {
            console.error("Failed to run AI analysis:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getChange = (current: number, previous: number) => {
        if (previous === 0) return { percent: 100, isIncrease: true };
        const change = ((current - previous) / previous) * 100;
        return { percent: Math.abs(change), isIncrease: change > 0 };
    };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Department-Wise Cost Control</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Monthly Cost</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {totalCurrentCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Top Spender</CardTitle>
            <Building2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topSpender.department}</div>
            <p className="text-xs text-muted-foreground">PKR {topSpender.currentMonthCost.toLocaleString()} this month</p>
          </CardContent>
        </Card>
         <Card className="bg-destructive/10 border-destructive/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Departments Over Budget</CardTitle>
            <AlertCircle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentData.filter(d => d.currentMonthCost > d.previousMonthCost).length}</div>
            <p className="text-xs text-muted-foreground">Showing increased spending</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Department Cost Breakdown (Current Month)</CardTitle>
                    <CardDescription>Visualize the cost distribution across departments.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={departmentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="department" />
                            <YAxis tickFormatter={(value) => `PKR ${value/1000}k`} />
                            <Tooltip formatter={(value: number) => [`PKR ${value.toLocaleString()}`, "Cost"]} />
                            <Legend />
                            <Bar dataKey="currentMonthCost" fill="hsl(var(--primary))" name="Current Month Cost" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/>AI Cost Analysis</CardTitle>
                    <CardDescription>AI-generated insights and recommendations for cost optimization.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading && <div className="space-y-4"><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></div>}
                    {aiAnalysis ? (
                        <div className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-semibold mb-1">Overall Analysis</h4>
                                <p className="text-muted-foreground">{aiAnalysis.costAnalysis}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Departments to Watch</h4>
                                <div className="flex flex-wrap gap-2">
                                    {aiAnalysis.strugglingDepartments.map(dept => <Badge key={dept} variant="destructive">{dept}</Badge>)}
                                </div>
                            </div>
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <Lightbulb className="w-12 h-12 mb-2" />
                            <p>Click the button below to generate AI-powered insights and recommendations on departmental spending.</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleRunAnalysis} disabled={isLoading} className="w-full">
                         <Sparkles className="mr-2 h-4 w-4" />
                        {isLoading ? "Analyzing Costs..." : "Generate AI Analysis"}
                    </Button>
                </CardFooter>
            </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Department Performance</CardTitle>
          <CardDescription>Monitor consumption and cost changes for each department.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Current Month Cost</TableHead>
                    <TableHead className="text-right">Previous Month Cost</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                    <TableHead>Notes</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {departmentData.map((dept) => {
                    const { percent, isIncrease } = getChange(dept.currentMonthCost, dept.previousMonthCost);
                    return (
                        <TableRow key={dept.department}>
                            <TableCell className="font-medium">{dept.department}</TableCell>
                            <TableCell className="text-right">PKR {dept.currentMonthCost.toLocaleString()}</TableCell>
                            <TableCell className="text-right">PKR {dept.previousMonthCost.toLocaleString()}</TableCell>
                            <TableCell className={`text-right font-medium ${isIncrease ? 'text-red-600' : 'text-green-600'}`}>
                                <span className='flex items-center justify-end gap-1'>
                                    {isIncrease ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    {percent.toFixed(2)}%
                                </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs">{dept.notes}</TableCell>
                        </TableRow>
                    )
                })}
                 <TableRow className="font-bold bg-muted/50">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">PKR {totalCurrentCost.toLocaleString()}</TableCell>
                    <TableCell className="text-right">PKR {departmentData.reduce((acc, dept) => acc + dept.previousMonthCost, 0).toLocaleString()}</TableCell>
                    <TableCell colSpan={2}></TableCell>
                 </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {aiAnalysis && aiAnalysis.recommendations.length > 0 && (
         <Card>
            <CardHeader>
                <CardTitle>AI-Powered Recommendations</CardTitle>
                <CardDescription>Actionable suggestions from the AI to optimize costs across departments.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {aiAnalysis.recommendations.map((rec, index) => (
                        <div key={index} className="p-4 bg-secondary/50 rounded-lg border">
                            <h4 className="font-semibold">{rec.department}</h4>
                            <p className="text-muted-foreground text-sm">{rec.suggestion}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      )}

    </div>
  );
}
