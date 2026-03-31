'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChefHat, PlusCircle, Calculator, TrendingUp, AlertTriangle, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const recipes = [
  {
    id: 1,
    code: 'RCP-BIRYANI-001',
    name: 'Chicken Biryani',
    portionSize: '1 Plate',
    portions: 1,
    sellingPrice: 350,
    ingredients: [
      { name: 'Basmati Rice', quantity: 250, unit: 'g', unitCost: 0.30, totalCost: 75 },
      { name: 'Chicken (with bone)', quantity: 300, unit: 'g', unitCost: 0.35, totalCost: 105 },
      { name: 'Onions', quantity: 100, unit: 'g', unitCost: 0.08, totalCost: 8 },
      { name: 'Tomatoes', quantity: 80, unit: 'g', unitCost: 0.10, totalCost: 8 },
      { name: 'Spices Mix', quantity: 50, unit: 'g', unitCost: 0.50, totalCost: 25 },
      { name: 'Cooking Oil', quantity: 50, unit: 'ml', unitCost: 0.15, totalCost: 7.5 },
      { name: 'Yogurt', quantity: 100, unit: 'g', unitCost: 0.12, totalCost: 12 },
    ],
  },
  {
    id: 2,
    code: 'RCP-KARAHI-001',
    name: 'Chicken Karahi',
    portionSize: '1 Serving',
    portions: 1,
    sellingPrice: 550,
    ingredients: [
      { name: 'Chicken (boneless)', quantity: 400, unit: 'g', unitCost: 0.45, totalCost: 180 },
      { name: 'Tomatoes', quantity: 200, unit: 'g', unitCost: 0.10, totalCost: 20 },
      { name: 'Ginger Garlic Paste', quantity: 30, unit: 'g', unitCost: 0.40, totalCost: 12 },
      { name: 'Green Chilies', quantity: 50, unit: 'g', unitCost: 0.20, totalCost: 10 },
      { name: 'Spices', quantity: 40, unit: 'g', unitCost: 0.60, totalCost: 24 },
      { name: 'Cooking Oil', quantity: 80, unit: 'ml', unitCost: 0.15, totalCost: 12 },
      { name: 'Coriander (garnish)', quantity: 20, unit: 'g', unitCost: 0.30, totalCost: 6 },
    ],
  },
  {
    id: 3,
    code: 'RCP-LASSI-001',
    name: 'Sweet Lassi',
    portionSize: '1 Glass (300ml)',
    portions: 1,
    sellingPrice: 80,
    ingredients: [
      { name: 'Yogurt', quantity: 200, unit: 'ml', unitCost: 0.12, totalCost: 24 },
      { name: 'Milk', quantity: 100, unit: 'ml', unitCost: 0.10, totalCost: 10 },
      { name: 'Sugar', quantity: 30, unit: 'g', unitCost: 0.08, totalCost: 2.4 },
      { name: 'Ice', quantity: 50, unit: 'g', unitCost: 0.02, totalCost: 1 },
      { name: 'Cardamom (ground)', quantity: 2, unit: 'g', unitCost: 2.00, totalCost: 4 },
    ],
  },
];

const costVarianceData = [
  { recipe: 'Chicken Biryani', idealCost: 235.5, actualCost: 245, variance: -9.5, variancePct: -4.0, lastUpdated: '2025-10-20' },
  { recipe: 'Chicken Karahi', idealCost: 264, actualCost: 280, variance: -16, variancePct: -6.1, lastUpdated: '2025-10-21' },
  { recipe: 'Sweet Lassi', idealCost: 41.4, actualCost: 43, variance: -1.6, variancePct: -3.9, lastUpdated: '2025-10-22' },
];

const formatPKR = (amount: number) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 2 }).format(amount);

export default function RecipeCostingPage() {
  const [selectedRecipe, setSelectedRecipe] = useState(recipes[0]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const totalCost = selectedRecipe.ingredients.reduce((sum, ing) => sum + ing.totalCost, 0);
  const grossProfit = selectedRecipe.sellingPrice - totalCost;
  const marginPct = ((grossProfit / selectedRecipe.sellingPrice) * 100).toFixed(1);
  const costPct = ((totalCost / selectedRecipe.sellingPrice) * 100).toFixed(1);

  const totalRecipes = recipes.length;
  const avgMargin = recipes.reduce((sum, r) => {
    const cost = r.ingredients.reduce((s, i) => s + i.totalCost, 0);
    const profit = r.sellingPrice - cost;
    return sum + (profit / r.sellingPrice) * 100;
  }, 0) / totalRecipes;

  const highCostVariance = costVarianceData.filter(v => Math.abs(v.variancePct) > 5).length;
  const totalVariance = costVarianceData.reduce((sum, v) => sum + v.variance, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Recipe Costing</h1>
        <p className="text-muted-foreground">Track ingredient costs and recipe profitability</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecipes}</div>
            <p className="text-xs text-muted-foreground">Active recipes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{avgMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Profit margin</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Variance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{highCostVariance}</div>
            <p className="text-xs text-muted-foreground">Need adjustment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Variance</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalVariance < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatPKR(Math.abs(totalVariance))}
            </div>
            <p className="text-xs text-muted-foreground">{totalVariance < 0 ? 'Over budget' : 'Under budget'}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recipe-builder" className="w-full">
        <TabsList>
          <TabsTrigger value="recipe-builder">Recipe Builder</TabsTrigger>
          <TabsTrigger value="cost-variance">Cost Variance Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="recipe-builder" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Select Recipe</CardTitle>
                <CardDescription>Choose a recipe to view costing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {recipes.map((recipe) => {
                  const cost = recipe.ingredients.reduce((sum, ing) => sum + ing.totalCost, 0);
                  const margin = ((recipe.sellingPrice - cost) / recipe.sellingPrice) * 100;
                  return (
                    <Button
                      key={recipe.id}
                      variant={selectedRecipe.id === recipe.id ? 'default' : 'outline'}
                      className="w-full justify-between h-auto py-3"
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      <div className="text-left">
                        <div className="font-semibold">{recipe.name}</div>
                        <div className="text-xs opacity-80">{formatPKR(cost)} cost</div>
                      </div>
                      <Badge variant={margin > 50 ? 'default' : 'secondary'}>{margin.toFixed(0)}%</Badge>
                    </Button>
                  );
                })}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full mt-2">
                      <PlusCircle className="h-4 w-4 mr-2" />New Recipe
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Recipe</DialogTitle>
                      <DialogDescription>Add a new recipe with ingredients</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Recipe Name</Label>
                        <Input placeholder="e.g., Beef Nihari" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Portion Size</Label>
                          <Input placeholder="e.g., 1 Bowl" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Selling Price</Label>
                          <Input type="number" placeholder="0" />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                      <Button onClick={() => setIsAddDialogOpen(false)}>Create Recipe</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedRecipe.name}</CardTitle>
                    <CardDescription>
                      {selectedRecipe.code} • {selectedRecipe.portionSize}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Cost</div>
                    <div className="text-2xl font-bold">{formatPKR(totalCost)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Selling Price</div>
                    <div className="text-2xl font-bold text-primary">{formatPKR(selectedRecipe.sellingPrice)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Gross Profit</div>
                    <div className="text-2xl font-bold text-green-600">{formatPKR(grossProfit)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Margin %</div>
                    <div className="text-2xl font-bold text-green-600">{marginPct}%</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Cost Percentage</span>
                    <span className="font-mono font-bold">{costPct}%</span>
                  </div>
                  <Progress value={parseFloat(costPct)} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {parseFloat(costPct) < 30 ? 'Excellent' : parseFloat(costPct) < 40 ? 'Good' : parseFloat(costPct) < 50 ? 'Acceptable' : 'High cost - review pricing'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Ingredients Breakdown</h3>
                    <Button size="sm" variant="outline">
                      <PlusCircle className="h-4 w-4 mr-2" />Add Ingredient
                    </Button>
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ingredient</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Unit Cost</TableHead>
                          <TableHead className="text-right">Total Cost</TableHead>
                          <TableHead className="text-right">% of Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedRecipe.ingredients.map((ing, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{ing.name}</TableCell>
                            <TableCell className="text-right font-mono">
                              {ing.quantity} {ing.unit}
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm text-muted-foreground">
                              {formatPKR(ing.unitCost)}/{ing.unit}
                            </TableCell>
                            <TableCell className="text-right font-mono font-bold">
                              {formatPKR(ing.totalCost)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm">
                              {((ing.totalCost / totalCost) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={3} className="font-bold">Total Recipe Cost</TableCell>
                          <TableCell className="text-right font-mono font-bold text-lg">
                            {formatPKR(totalCost)}
                          </TableCell>
                          <TableCell className="text-right font-mono font-bold">100%</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cost-variance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ideal vs Actual Cost Analysis</CardTitle>
              <CardDescription>Track cost variances to identify pricing issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipe</TableHead>
                      <TableHead className="text-right">Ideal Cost</TableHead>
                      <TableHead className="text-right">Actual Cost</TableHead>
                      <TableHead className="text-right">Variance (PKR)</TableHead>
                      <TableHead className="text-right">Variance %</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {costVarianceData.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.recipe}</TableCell>
                        <TableCell className="text-right font-mono">{formatPKR(item.idealCost)}</TableCell>
                        <TableCell className="text-right font-mono font-bold">{formatPKR(item.actualCost)}</TableCell>
                        <TableCell className={`text-right font-mono font-bold ${item.variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {item.variance > 0 ? '+' : ''}{formatPKR(item.variance)}
                        </TableCell>
                        <TableCell className={`text-right font-mono font-bold ${item.variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {item.variancePct > 0 ? '+' : ''}{item.variancePct.toFixed(1)}%
                        </TableCell>
                        <TableCell>
                          <Badge variant={Math.abs(item.variancePct) < 3 ? 'default' : Math.abs(item.variancePct) < 5 ? 'secondary' : 'destructive'}>
                            {Math.abs(item.variancePct) < 3 ? 'On Track' : Math.abs(item.variancePct) < 5 ? 'Monitor' : 'Action Required'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.lastUpdated}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Cost Variance Insights</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Chicken Karahi has highest variance (-6.1%) - review ingredient sourcing</li>
                  <li>• Overall cost trend is slightly above ideal - negotiate with vendors</li>
                  <li>• Consider portion size adjustments for high-variance recipes</li>
                  <li>• Update standard costs weekly to reflect market prices</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
