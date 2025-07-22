
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

const emptyMenuItem: Omit<MenuItem, 'id'> = {
    name: '',
    category: '',
    recipeCost: 0,
    menuPrice: 0,
    status: 'Draft',
    ingredients: [],
    yield: ''
};

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // State for the item being edited in the sheet
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [targetMultiplier, setTargetMultiplier] = useState('2.5');
  const [suggestedPrice, setSuggestedPrice] = useState<{ price: number; reasoning: string } | null>(null);
  const [isPricingLoading, setIsPricingLoading] = useState(false);

  const handleAddNewItem = () => {
    setEditingItem({ id: `item-${Date.now()}`, ...emptyMenuItem });
    setSuggestedPrice(null);
    setIsSheetOpen(true);
  };
  
  const handleEditItem = (item: MenuItem) => {
    setEditingItem({ ...item });
    setSuggestedPrice(null);
    setIsSheetOpen(true);
  };

  const handleGetPriceSuggestion = async () => {
    if (!editingItem || editingItem.recipeCost <= 0) {
        setSuggestedPrice({ price: 0, reasoning: "Please calculate recipe cost first." });
        return;
    }
    setIsPricingLoading(true);
    setSuggestedPrice(null);
    try {
        const input: SuggestOptimalPricingInput = {
            recipeName: editingItem.name,
            recipeCost: editingItem.recipeCost,
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
  
  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    if (!editingItem) return;
    const updatedIngredients = [...editingItem.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
    
    const newCost = calculateTotalCost(updatedIngredients);
    setEditingItem({ ...editingItem, ingredients: updatedIngredients, recipeCost: newCost });
  };
  
  const handleAddIngredient = () => {
    if (!editingItem) return;
    const newIngredient: Ingredient = { id: `ing-${Date.now()}`, name: '', quantity: '', unit: 'g', cost: '' };
    setEditingItem({ ...editingItem, ingredients: [...editingItem.ingredients, newIngredient] });
  };

  const handleRemoveIngredient = (index: number) => {
    if (!editingItem) return;
    const updatedIngredients = editingItem.ingredients.filter((_, i) => i !== index);
    const newCost = calculateTotalCost(updatedIngredients);
    setEditingItem({ ...editingItem, ingredients: updatedIngredients, recipeCost: newCost });
  };

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
                <BookCopy /> {editingItem && editingItem.name ? 'Edit' : 'Add'} Menu Item
              </SheetTitle>
              <SheetDescription>
                {editingItem && editingItem.name ? 'Edit the details of the menu item and its recipe.' : 'Define a new item, its recipe, and calculate its price.'}
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
                      <Input id="item-name" placeholder="e.g., Chicken Biryani" value={editingItem?.name || ''} onChange={(e) => setEditingItem(prev => prev ? {...prev, name: e.target.value} : null)} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="item-category">Category</Label>
                      <Select value={editingItem?.category || ''} onValueChange={(value) => setEditingItem(prev => prev ? {...prev, category: value} : null)}>
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
                                {editingItem?.ingredients.map((ing, index) => (
                                    <TableRow key={ing.id}>
                                        <TableCell><Input value={ing.name} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} placeholder="e.g., Basmati Rice"/></TableCell>
                                        <TableCell><Input type="number" value={ing.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} placeholder="e.g., 200"/></TableCell>
                                        <TableCell>
                                            <Select value={ing.unit} onValueChange={(value) => handleIngredientChange(index, 'unit', value)}>
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
                                        <TableCell><Input type="number" value={ing.cost} onChange={(e) => handleIngredientChange(index, 'cost', e.target.value)} placeholder="e.g., 80.00"/></TableCell>
                                        <TableCell><Button variant="ghost" size="icon" onClick={() => handleRemoveIngredient(index)}><Trash2 className="w-4 h-4 text-destructive"/></Button></TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <Button variant="outline" size="sm" className="w-full" type="button" onClick={handleAddIngredient}>
                                            <PlusCircle className="mr-2 h-4 w-4" /> Add Ingredient
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <div className="grid grid-cols-2 gap-4 items-end pt-4">
                             <div className="space-y-2">
                                <Label htmlFor="yield">Portion Size / Yield</Label>
                                <Input id="yield" value={editingItem?.yield || ''} onChange={(e) => setEditingItem(prev => prev ? {...prev, yield: e.target.value} : null)} placeholder="e.g., 1 plate or 1 kg" />
                            </div>
                            <Card className="bg-muted/50">
                                <CardHeader className="p-4">
                                    <CardDescription>Total Recipe Cost</CardDescription>
                                    <CardTitle className="text-3xl">
                                        PKR {editingItem ? editingItem.recipeCost.toFixed(2) : '0.00'}
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
                        <Button variant="outline" onClick={handleGetPriceSuggestion} disabled={isPricingLoading} type="button">
                            <Sparkles className="mr-2" /> {isPricingLoading ? "Calculating..." : "Suggest Price"}
                        </Button>
                    </div>
                    {suggestedPrice && (
                        <div className="p-4 bg-primary/10 border-primary/20 border rounded-lg space-y-2">
                            <p className="text-sm font-semibold text-foreground">AI Suggestion</p>
                            <p className="text-2xl font-bold text-foreground">
                                Suggested Price: PKR {suggestedPrice.price.toFixed(2)}
                            </p>
                            <p className="text-xs text-foreground">{suggestedPrice.reasoning}</p>
                        </div>
                    )}
                    <div className="space-y-2 pt-4">
                      <Label htmlFor="menu-price">Final Menu Price (PKR)</Label>
                      <Input id="menu-price" type="number" placeholder="Enter final price" className="text-lg font-bold" value={editingItem?.menuPrice || ''} onChange={(e) => setEditingItem(prev => prev ? {...prev, menuPrice: parseFloat(e.target.value) || 0} : null)}/>
                    </div>
                </CardContent>
              </Card>

            </div>
            <SheetFooter className="p-6 bg-muted/50 border-t">
              <SheetClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
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
}
