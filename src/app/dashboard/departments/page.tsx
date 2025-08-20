
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Building2, TrendingDown, TrendingUp, Sparkles, Lightbulb, AlertCircle, DollarSign, Filter, Users, ChefHat, GraduationCap, CalendarDays, Heart } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { analyzeDepartmentCosts, AnalyzeDepartmentCostsInput, AnalyzeDepartmentCostsOutput } from '@/ai/flows/analyze-department-costs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { HRKPICard } from "@/components/hr/hr-kpi-card";

const businessLines = [
  { id: 'all', name: 'All Business Lines', icon: Building2 },
  { id: 'restaurant', name: 'Restaurant & Catering', icon: ChefHat },
  { id: 'madrasa', name: 'Academic (Madrasa)', icon: GraduationCap },
  { id: 'shadi-lawn', name: 'Events (Shadi Lawn)', icon: CalendarDays },
  { id: 'gym-time', name: 'Fitness (Gym Time)', icon: Heart },
];

const departmentData = [
  // Restaurant & Catering
  { department: 'Kitchen', businessLine: 'restaurant', currentMonthCost: 1250000, previousMonthCost: 1180000, employeeCount: 12, notes: 'Ingredient prices for meat increased by 5%' },
  { department: 'Service Staff', businessLine: 'restaurant', currentMonthCost: 850000, previousMonthCost: 820000, employeeCount: 18, notes: 'Overtime hours for weekend shifts' },
  { department: 'Restaurant Admin', businessLine: 'restaurant', currentMonthCost: 200000, previousMonthCost: 190000, employeeCount: 3, notes: 'New POS system maintenance' },
  
  // Academic (Madrasa)
  { department: 'Teaching Staff', businessLine: 'madrasa', currentMonthCost: 950000, previousMonthCost: 920000, employeeCount: 25, notes: 'Salary increments for senior teachers' },
  { department: 'Academic Admin', businessLine: 'madrasa', currentMonthCost: 180000, previousMonthCost: 175000, employeeCount: 5, notes: 'New student management system' },
  { department: 'Facilities', businessLine: 'madrasa', currentMonthCost: 220000, previousMonthCost: 240000, employeeCount: 8, notes: 'Energy-efficient lighting installation' },
  
  // Events (Shadi Lawn)
  { department: 'Event Management', businessLine: 'shadi-lawn', currentMonthCost: 450000, previousMonthCost: 380000, employeeCount: 8, notes: 'Wedding season peak costs' },
  { department: 'Landscaping', businessLine: 'shadi-lawn', currentMonthCost: 180000, previousMonthCost: 160000, employeeCount: 6, notes: 'New garden decorations and maintenance' },
  { department: 'Catering Support', businessLine: 'shadi-lawn', currentMonthCost: 320000, previousMonthCost: 290000, employeeCount: 12, notes: 'Additional catering staff for events' },
  
  // Fitness (Gym Time)
  { department: 'Fitness Trainers', businessLine: 'gym-time', currentMonthCost: 380000, previousMonthCost: 360000, employeeCount: 8, notes: 'New certified trainers hired' },
  { department: 'Equipment Maintenance', businessLine: 'gym-time', currentMonthCost: 120000, previousMonthCost: 150000, employeeCount: 3, notes: 'Preventive maintenance program implemented' },
  { department: 'Gym Admin', businessLine: 'gym-time', currentMonthCost: 95000, previousMonthCost: 85000, employeeCount: 2, notes: 'Membership management software' },
  
  // General/Cross-functional
  { department: 'IT Support', businessLine: 'all', currentMonthCost: 280000, previousMonthCost: 250000, employeeCount: 4, notes: 'Network infrastructure upgrades' },
  { department: 'Security', businessLine: 'all', currentMonthCost: 200000, previousMonthCost: 200000, employeeCount: 12, notes: 'Regular security services' },
  { department: 'General Maintenance', businessLine: 'all', currentMonthCost: 150000, previousMonthCost: 160000, employeeCount: 6, notes: 'Switched to cost-effective suppliers' },
];

export default function DepartmentsPage() {
    const [aiAnalysis, setAiAnalysis] = useState<AnalyzeDepartmentCostsOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedBusinessLine, setSelectedBusinessLine] = useState<string>('all');

    const filteredData = selectedBusinessLine === 'all' 
        ? departmentData 
        : departmentData.filter(dept => dept.businessLine === selectedBusinessLine || dept.businessLine === 'all');

    const totalCurrentCost = filteredData.reduce((acc, dept) => acc + dept.currentMonthCost, 0);
    const totalEmployees = filteredData.reduce((acc, dept) => acc + dept.employeeCount, 0);
    const topSpender = filteredData.reduce((prev, current) => (prev.currentMonthCost > current.currentMonthCost) ? prev : current);
    const selectedBusiness = businessLines.find(bl => bl.id === selectedBusinessLine);

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Department-Wise Cost Control</h1>
          <p className="text-muted-foreground">
            Monitor departmental costs and employee distribution across business lines
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedBusinessLine} onValueChange={setSelectedBusinessLine}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Business Line" />
              </SelectTrigger>
              <SelectContent>
                {businessLines.map((line) => (
                  <SelectItem key={line.id} value={line.id}>
                    <div className="flex items-center gap-2">
                      <line.icon className="w-4 h-4" />
                      {line.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {selectedBusiness && selectedBusiness.id !== 'all' && (
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/20">
                <selectedBusiness.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{selectedBusiness.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Viewing cost breakdown for this business line
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <HRKPICard
          title="Total Monthly Cost"
          value={`₨${(totalCurrentCost / 1000).toFixed(0)}K`}
          subtitle={selectedBusinessLine === 'all' ? 'Across all departments' : `${selectedBusiness?.name || ''} only`}
          icon={DollarSign}
          trend={{
            value: 6.8,
            isPositive: false,
            label: "vs last month"
          }}
          iconColor="text-green-600"
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
        />
        <HRKPICard
          title="Total Employees"
          value={totalEmployees}
          subtitle="Staff across departments"
          icon={Users}
          trend={{
            value: 3.2,
            isPositive: true,
            label: "vs last month"
          }}
          iconColor="text-blue-600"
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
        />
        <HRKPICard
          title="Top Spender"
          value={topSpender.department}
          subtitle={`₨${(topSpender.currentMonthCost / 1000).toFixed(0)}K this month`}
          icon={Building2}
          iconColor="text-purple-600"
          className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
        />
        <HRKPICard
          title="Over Budget"
          value={filteredData.filter(d => d.currentMonthCost > d.previousMonthCost).length}
          subtitle="Departments with increased spending"
          icon={AlertCircle}
          trend={{
            value: 25.0,
            isPositive: false,
            label: "departments affected"
          }}
          iconColor="text-red-600"
          className="bg-gradient-to-br from-red-50 to-red-100 border-red-200"
        />
      </div>

       <div className="grid lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Department Cost Breakdown (Current Month)</CardTitle>
                    <CardDescription>Visualize the cost distribution across departments.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ResponsiveContainer width="100%" height={400}>
                        <BarChart 
                            data={filteredData}
                            margin={{ top: 20, right: 30, left: 60, bottom: 100 }}
                            barCategoryGap="15%"
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis 
                                dataKey="department" 
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={11}
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                interval={0}
                            />
                            <YAxis 
                                tickFormatter={(value) => `₨${value/1000}K`} 
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                width={80}
                            />
                            <Tooltip 
                                formatter={(value: number) => [`₨${value.toLocaleString()}`, "Cost"]}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                                contentStyle={{ 
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '6px'
                                }}
                            />
                            <Legend />
                            <Bar 
                                dataKey="currentMonthCost" 
                                fill="hsl(var(--primary))" 
                                name="Current Month Cost" 
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                            />
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
                    <TableHead className="text-center">Employees</TableHead>
                    <TableHead className="text-right">Current Month Cost</TableHead>
                    <TableHead className="text-right">Previous Month Cost</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                    <TableHead>Notes</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredData.map((dept) => {
                    const { percent, isIncrease } = getChange(dept.currentMonthCost, dept.previousMonthCost);
                    return (
                        <TableRow key={dept.department}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    {dept.department}
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge variant="outline" className="text-xs">
                                    {dept.employeeCount}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">₨{dept.currentMonthCost.toLocaleString()}</TableCell>
                            <TableCell className="text-right">₨{dept.previousMonthCost.toLocaleString()}</TableCell>
                            <TableCell className={`text-right font-medium ${isIncrease ? 'text-red-600' : 'text-green-600'}`}>
                                <span className='flex items-center justify-end gap-1'>
                                    {isIncrease ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    {percent.toFixed(1)}%
                                </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs">{dept.notes}</TableCell>
                        </TableRow>
                    )
                })}
                 <TableRow className="font-bold bg-gradient-to-r from-primary/5 to-accent/5">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-center">
                        <Badge variant="default" className="text-xs">
                            {totalEmployees}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">₨{totalCurrentCost.toLocaleString()}</TableCell>
                    <TableCell className="text-right">₨{filteredData.reduce((acc, dept) => acc + dept.previousMonthCost, 0).toLocaleString()}</TableCell>
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
