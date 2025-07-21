
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, BookCopy, Sparkles, Utensils, Tag, DollarSign, Scale } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"
import { Textarea } from '@/components/ui/textarea';
import { suggestOptimalPricing, SuggestOptimalPricingInput } from '@/ai/flows/suggest-optimal-pricing';

type Ingredient = {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  cost: string;
};

type MenuItem = {
  id: string;
  name: string;
  category: string;
  recipeCost: number;
  menuPrice: number;
  status: 'Draft' | 'Priced';
  ingredients: Ingredient[];
  yield: string;
};

const initialMenuItems: MenuItem[] = [
  { id: 'item-1', name: 'Chicken Biryani', category: 'Main Course', recipeCost: 350.75, menuPrice: 850, status: 'Priced', yield: "1 plate", ingredients: [
    { id: 'ing-1', name: 'Basmati Rice', quantity: '200', unit: 'g', cost: '80' },
    { id: 'ing-2', name: 'Chicken', quantity: '250', unit: 'g', cost: '150' },
    { id: 'ing-3', name: 'Spices', quantity: '50', unit: 'g', cost: '120.75' },
  ]},
  { id: 'item-2', name: 'Mutton Karahi', category: 'Main Course', recipeCost: 750.50, menuPrice: 1800, status: 'Priced', yield: "1 kg", ingredients: []},
  { id: 'item-3', name: 'Mint Margarita', category: 'Beverage', recipeCost: 80, menuPrice: 0, status: 'Draft', yield: "1 glass", ingredients: []},
  { id: 'item-4', name: 'BBQ Platter', category: 'BBQ', recipeCost: 1200, menuPrice: 2500, status: 'Priced', yield: "4 persons", ingredients: []},
];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [targetMultiplier, setTargetMultiplier] = useState('2.5');
  const [suggestedPrice, setSuggestedPrice] = useState<{ price: number; reasoning: string } | null>(null);
  const [isPricingLoading, setIsPricingLoading] = useState(false);

  const handleAddNewItem = () => {
    setSelectedItem(null);
    setSuggestedPrice(null);
    setIsSheetOpen(true);
  };
  
  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setSuggestedPrice(null);
    setIsSheetOpen(true);
  };

  const handleGetPriceSuggestion = async () => {
    if (!selectedItem || selectedItem.recipeCost <= 0) {
        setSuggestedPrice({ price: 0, reasoning: "Please calculate recipe cost first." });
        return;
    }
    setIsPricingLoading(true);
    setSuggestedPrice(null);
    try {
        const input: SuggestOptimalPricingInput = {
            recipeName: selectedItem.name,
            recipeCost: selectedItem.recipeCost,
            marketAnalysis: "Mid-tier casual dining restaurant in a metropolitan area.",
            targetGrossProfitMultiplier: parseFloat(targetMultiplier)
        };
        const result = await suggestOptimalPricing(input);
        setSuggestedPrice({ price: result.suggestedPrice, reasoning: result.reasoning });
    } catch (error) {
        console.error("Failed to get AI suggestion:", error);
        setSuggestedPrice({ price: 0, reasoning: "Sorry, I was unable to get a suggestion." });
    } finally {
        setIsPricingLoading(false);
    }
  };

  const calculateTotalCost = (ingredients: Ingredient[]) => {
    return ingredients.reduce((total, ing) => total + parseFloat(ing.cost || '0'), 0);
  }

  const renderBadge = (status: 'Draft' | 'Priced') => {
    const variant = status === 'Priced' ? 'default' : 'secondary';
    const className = status === 'Priced' 
      ? "bg-green-500/20 text-green-700 dark:text-green-300 dark:border-green-500/50 dark:bg-green-500/10"
      : "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 dark:border-yellow-500/50 dark:bg-yellow-500/10";
    return <Badge variant={variant} className={className}>{status}</Badge>;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Menu &amp; Recipe Management</h1>
        <Button onClick={handleAddNewItem}>
            <PlusCircle className="mr-2" /> Add New Item
        </Button>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-3xl w-full p-0">
          <form className="flex flex-col h-full">
            <SheetHeader className="p-6">
              <SheetTitle className="text-2xl flex items-center gap-2">
                <BookCopy /> {selectedItem ? 'Edit' : 'Add'} Menu Item
              </SheetTitle>
              <SheetDescription>
                {selectedItem ? 'Edit the details of the menu item and its recipe.' : 'Define a new item, its recipe, and calculate its price.'}
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Utensils className="w-5 h-5"/>Item Details</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="item-name">Item Name</Label>
                      <Input id="item-name" placeholder="e.g., Chicken Biryani" defaultValue={selectedItem?.name} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="item-category">Category</Label>
                      <Select defaultValue={selectedItem?.category}>
                          <SelectTrigger id="item-category">
                              <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Main Course">Main Course</SelectItem>
                              <SelectItem value="Appetizer">Appetizer</SelectItem>
                              <SelectItem value="Dessert">Dessert</SelectItem>
                              <SelectItem value="Beverage">Beverage</SelectItem>
                              <SelectItem value="BBQ">BBQ</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Scale className="w-5 h-5" />Recipe & Costing</CardTitle>
                    <CardDescription>Input ingredients to automatically calculate recipe cost. All costs are per yield.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ingredient</TableHead>
                                    <TableHead className="w-[120px]">Quantity</TableHead>
                                    <TableHead className="w-[120px]">Unit</TableHead>
                                    <TableHead className="w-[120px]">Cost (PKR)</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedItem?.ingredients.map(ing => (
                                    <TableRow key={ing.id}>
                                        <TableCell><Input defaultValue={ing.name} placeholder="e.g., Basmati Rice"/></TableCell>
                                        <TableCell><Input type="number" defaultValue={ing.quantity} placeholder="e.g., 200"/></TableCell>
                                        <TableCell>
                                            <Select defaultValue={ing.unit}>
                                                <SelectTrigger><SelectValue/></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="g">gram (g)</SelectItem>
                                                    <SelectItem value="kg">kilogram (kg)</SelectItem>
                                                    <SelectItem value="ml">milliliter (ml)</SelectItem>
                                                    <SelectItem value="l">liter (l)</SelectItem>
                                                    <SelectItem value="pcs">pieces (pcs)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell><Input type="number" defaultValue={ing.cost} placeholder="e.g., 80.00"/></TableCell>
                                        <TableCell><Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-destructive"/></Button></TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <Button variant="outline" size="sm" className="w-full">
                                            <PlusCircle className="mr-2 h-4 w-4" /> Add Ingredient
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <div className="grid grid-cols-2 gap-4 items-end pt-4">
                             <div className="space-y-2">
                                <Label htmlFor="yield">Portion Size / Yield</Label>
                                <Input id="yield" defaultValue={selectedItem?.yield} placeholder="e.g., 1 plate or 1 kg" />
                            </div>
                            <Card className="bg-muted/50">
                                <CardHeader className="p-4">
                                    <CardDescription>Total Recipe Cost</CardDescription>
                                    <CardTitle className="text-3xl">
                                        PKR {selectedItem ? calculateTotalCost(selectedItem.ingredients).toFixed(2) : '0.00'}
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5"/>Menu Pricing</CardTitle>
                     <CardDescription>Use our AI to suggest a price or set one manually.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-end gap-4 p-4 border rounded-lg">
                        <div className="flex-1 space-y-2">
                             <Label htmlFor="multiplier">Target Gross Profit Multiplier</Label>
                             <Input id="multiplier" type="number" value={targetMultiplier} onChange={(e) => setTargetMultiplier(e.target.value)} placeholder="e.g., 2.5"/>
                        </div>
                        <Button variant="outline" onClick={handleGetPriceSuggestion} disabled={isPricingLoading}>
                            <Sparkles className="mr-2" /> {isPricingLoading ? "Calculating..." : "Suggest Price"}
                        </Button>
                    </div>
                     {suggestedPrice && (
                        <div className="p-4 bg-accent/20 border-accent/50 border rounded-lg space-y-2">
                             <p className="text-sm font-semibold text-accent-foreground/80">AI Suggestion</p>
                            <p className="text-2xl font-bold text-accent-foreground">
                                Suggested Price: PKR {suggestedPrice.price.toFixed(2)}
                            </p>
                             <p className="text-xs text-muted-foreground">{suggestedPrice.reasoning}</p>
                        </div>
                    )}
                    <div className="space-y-2 pt-4">
                      <Label htmlFor="menu-price">Final Menu Price (PKR)</Label>
                      <Input id="menu-price" type="number" placeholder="Enter final price" className="text-lg font-bold" defaultValue={selectedItem?.menuPrice || ''}/>
                    </div>
                </CardContent>
              </Card>

            </div>
            <SheetFooter className="p-6 bg-muted/50 border-t">
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button type="submit">Save Changes</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
          <CardDescription>A list of all menu items and their current pricing status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Recipe Cost</TableHead>
                <TableHead className="text-right">Menu Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map((item) => (
                <TableRow key={item.id} className="cursor-pointer" onClick={() => handleEditItem(item)}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{renderBadge(item.status)}</TableCell>
                  <TableCell className="text-right">PKR {item.recipeCost.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-bold">PKR {item.status === 'Priced' ? item.menuPrice.toFixed(2) : '---'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleEditItem(item); }}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

    