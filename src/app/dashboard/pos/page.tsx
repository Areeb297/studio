'use client';

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  ShoppingBag,
  UtensilsCrossed,
  Truck,
  CalendarDays,
  Users,
  Shield,
  Search,
  Printer,
  X,
  Minus,
  Plus,
  Percent,
  FileText,
  ChevronDown,
  Tag,
  Phone,
  MapPin,
  BookOpen,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ─────────────────────────────────────────────────────────────────

type OrderType = 'takeaway' | 'dine-in' | 'delivery' | 'booking' | 'mess' | 'staff';
type PaymentMethod = 'cash' | 'card' | 'jazzcash' | 'easypaisa';
type Category = 'All' | 'Rice' | 'Curry' | 'Bread' | 'Drinks' | 'Sides' | 'Dessert' | 'BBQ';

const ORDER_TYPE_COLORS: Record<OrderType, string> = {
  'takeaway': 'bg-orange-500/15 text-orange-700 border-orange-200',
  'dine-in':  'bg-purple-500/15 text-purple-700 border-purple-200',
  'delivery': 'bg-blue-500/15 text-blue-700 border-blue-200',
  'booking':  'bg-teal-500/15 text-teal-700 border-teal-200',
  'mess':     'bg-gray-500/15 text-gray-700 border-gray-200',
  'staff':    'bg-pink-500/15 text-pink-700 border-pink-200',
};

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: Exclude<Category, 'All'>;
}

interface CartItem {
  menuItem: MenuItem;
  qty: number;
}

// ─── Static Data ────────────────────────────────────────────────────────────

const ORDER_TYPES: { id: OrderType; label: string; sub: string; icon: React.ReactNode }[] = [
  { id: 'takeaway',  label: 'Takeaway', sub: 'Counter pickup',  icon: <ShoppingBag      className="h-5 w-5" /> },
  { id: 'dine-in',   label: 'Dine-in',  sub: 'Table service',   icon: <UtensilsCrossed  className="h-5 w-5" /> },
  { id: 'delivery',  label: 'Delivery', sub: 'Rider dispatch',  icon: <Truck            className="h-5 w-5" /> },
  { id: 'booking',   label: 'Booking',  sub: 'Events & parties',icon: <CalendarDays     className="h-5 w-5" /> },
  { id: 'mess',      label: 'Mess',     sub: 'Student meals',   icon: <Users            className="h-5 w-5" /> },
  { id: 'staff',     label: 'Staff',    sub: 'Staff meals',     icon: <Shield           className="h-5 w-5" /> },
];

const CATEGORIES: Category[] = [
  'All', 'Rice', 'Curry', 'Bread', 'Drinks', 'Sides', 'Dessert', 'BBQ',
];

const MENU_ITEMS: MenuItem[] = [
  // Rice
  { id: 1,  name: 'Chicken Biryani', price: 350,  category: 'Rice'    },
  { id: 2,  name: 'Mutton Biryani',  price: 550,  category: 'Rice'    },
  { id: 3,  name: 'Daal Chawal',     price: 150,  category: 'Rice'    },
  { id: 4,  name: 'Pulao',           price: 300,  category: 'Rice'    },
  // Curry
  { id: 5,  name: 'Chicken Karahi',  price: 900,  category: 'Curry'   },
  { id: 6,  name: 'Mutton Karahi',   price: 1400, category: 'Curry'   },
  { id: 7,  name: 'Aloo Gosht',      price: 600,  category: 'Curry'   },
  { id: 8,  name: 'Chicken Haleem',  price: 250,  category: 'Curry'   },
  { id: 9,  name: 'Daal Makhani',    price: 350,  category: 'Curry'   },
  { id: 10, name: 'Nihari',          price: 450,  category: 'Curry'   },
  // Bread
  { id: 11, name: 'Naan',            price: 30,   category: 'Bread'   },
  { id: 12, name: 'Roghni Naan',     price: 50,   category: 'Bread'   },
  { id: 13, name: 'Paratha',         price: 60,   category: 'Bread'   },
  { id: 14, name: 'Tandoori Roti',   price: 20,   category: 'Bread'   },
  // Drinks
  { id: 15, name: 'Lassi',           price: 80,   category: 'Drinks'  },
  { id: 16, name: 'Chai',            price: 40,   category: 'Drinks'  },
  { id: 17, name: 'Cold Drink',      price: 60,   category: 'Drinks'  },
  { id: 18, name: 'Water Bottle',    price: 50,   category: 'Drinks'  },
  { id: 19, name: 'Fresh Juice',     price: 120,  category: 'Drinks'  },
  // Sides
  { id: 20, name: 'Raita',           price: 60,   category: 'Sides'   },
  // Dessert
  { id: 21, name: 'Gulab Jamun',     price: 80,   category: 'Dessert' },
  { id: 22, name: 'Kheer',           price: 70,   category: 'Dessert' },
  { id: 23, name: 'Salad',           price: 60,   category: 'Dessert' },
];

const PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: 'cash',      label: 'Cash'      },
  { id: 'card',      label: 'Card'      },
  { id: 'jazzcash',  label: 'JazzCash'  },
  { id: 'easypaisa', label: 'Easypaisa' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatPrice(amount: number): string {
  return `Rs.\u00a0${amount.toLocaleString('en-PK')}`;
}

// ─── MenuItemCard ────────────────────────────────────────────────────────────

function MenuItemCard({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}) {
  return (
    <button
      onClick={() => onAdd(item)}
      className={cn(
        'group relative flex flex-col items-start gap-1 rounded-lg border bg-card p-3 text-left',
        'transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:border-green-500',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500',
      )}
      aria-label={`Add ${item.name} to cart`}
    >
      {/* Category chip */}
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {item.category}
      </span>
      {/* Name */}
      <span className="text-sm font-semibold leading-snug text-foreground line-clamp-2">
        {item.name}
      </span>
      {/* Price */}
      <span className="mt-auto pt-1 text-sm font-bold text-green-600">
        {formatPrice(item.price)}
      </span>
      {/* Hover "+" badge */}
      <span
        aria-hidden
        className={cn(
          'absolute top-2 right-2 flex h-5 w-5 items-center justify-center',
          'rounded-full bg-green-600 text-white',
          'opacity-0 transition-opacity duration-150 group-hover:opacity-100',
        )}
      >
        <Plus className="h-3 w-3" />
      </span>
    </button>
  );
}

// ─── POSPage ─────────────────────────────────────────────────────────────────

export default function POSPage() {
  // ── State ────────────────────────────────────────────────────────────────
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber]             = useState('');
  const [deliveryPhone, setDeliveryPhone]         = useState('');
  const [deliveryAddress, setDeliveryAddress]     = useState('');
  const [bookingRef, setBookingRef]               = useState('');
  const [messGroup, setMessGroup]                 = useState('');
  const [searchQuery, setSearchQuery]             = useState('');
  const [selectedCategory, setSelectedCategory]   = useState<Category>('All');
  const [cartItems, setCartItems]                 = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod]         = useState<PaymentMethod>('cash');

  // Discount dialog
  const [discountOpen, setDiscountOpen]           = useState(false);
  const [discountType, setDiscountType]           = useState<'flat' | 'percent'>('flat');
  const [discountInput, setDiscountInput]         = useState('');
  const [appliedDiscount, setAppliedDiscount]     = useState(0);

  // Note dialog
  const [noteOpen, setNoteOpen]                   = useState(false);
  const [noteInput, setNoteInput]                 = useState('');
  const [appliedNote, setAppliedNote]             = useState('');

  const heldOrdersCount                           = 2;
  const ORDER_NUMBER                              = '381';

  // ── Filtered menu items ──────────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCat    = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // ── Cart helpers ─────────────────────────────────────────────────────────
  const addToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItem.id === item.id ? { ...ci, qty: ci.qty + 1 } : ci,
        );
      }
      return [...prev, { menuItem: item, qty: 1 }];
    });
  };

  const updateQty = (itemId: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((ci) =>
          ci.menuItem.id === itemId ? { ...ci, qty: ci.qty + delta } : ci,
        )
        .filter((ci) => ci.qty > 0),
    );
  };

  const removeFromCart = (itemId: number) => {
    setCartItems((prev) => prev.filter((ci) => ci.menuItem.id !== itemId));
  };

  const clearCart = () => setCartItems([]);

  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, ci) => sum + ci.menuItem.price * ci.qty, 0),
    [cartItems],
  );
  const discountAmount = useMemo(() => {
    if (discountType === 'flat') return Math.min(appliedDiscount, cartSubtotal);
    return Math.round((cartSubtotal * appliedDiscount) / 100);
  }, [appliedDiscount, discountType, cartSubtotal]);
  const cartTotal = cartSubtotal - discountAmount;

  const totalItemCount = useMemo(
    () => cartItems.reduce((sum, ci) => sum + ci.qty, 0),
    [cartItems],
  );

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-4 sm:-m-6 overflow-hidden bg-background">

      {/* Three-panel row */}
      <div className="flex flex-1 min-h-0">

        {/* ══════════════════════════════════════════════════════════════════
            LEFT PANEL — Order Type Selector (~200 px)
        ══════════════════════════════════════════════════════════════════ */}
        <aside className="flex w-[200px] shrink-0 flex-col border-r bg-card">

          {/* Section heading */}
          <div className="border-b px-3 py-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Order Type
            </p>
          </div>

          {/* Order type buttons */}
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2" aria-label="Order types">
            {ORDER_TYPES.map((ot) => {
              const isActive = selectedOrderType === ot.id;
              return (
                <button
                  key={ot.id}
                  onClick={() => setSelectedOrderType(ot.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-left',
                    'transition-all duration-150',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500',
                    isActive
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'text-foreground hover:bg-muted',
                  )}
                  aria-pressed={isActive}
                  aria-label={`Select ${ot.label} order type`}
                >
                  <span className={cn('shrink-0', isActive ? 'text-white' : 'text-muted-foreground')}>
                    {ot.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-tight">
                      {ot.label}
                    </span>
                    <span
                      className={cn(
                        'block text-[11px] leading-tight',
                        isActive ? 'text-green-100' : 'text-muted-foreground',
                      )}
                    >
                      {ot.sub}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Contextual fields per order type */}
          {selectedOrderType === 'dine-in' && (
            <div className="border-t p-3 space-y-2">
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Table #</label>
              <div className="relative">
                <Layers className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={tableNumber} onChange={e => setTableNumber(e.target.value)} placeholder="e.g. 5" className="h-9 text-sm pl-8" />
              </div>
            </div>
          )}
          {selectedOrderType === 'delivery' && (
            <div className="border-t p-3 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Delivery Info</p>
              <div className="relative">
                <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={deliveryPhone} onChange={e => setDeliveryPhone(e.target.value)} placeholder="Phone number" className="h-9 text-sm pl-8" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} placeholder="Delivery address" className="h-9 text-sm pl-8" />
              </div>
            </div>
          )}
          {selectedOrderType === 'booking' && (
            <div className="border-t p-3 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Booking Ref</p>
              <div className="relative">
                <BookOpen className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={bookingRef} onChange={e => setBookingRef(e.target.value)} placeholder="e.g. BKG-0006" className="h-9 text-sm pl-8" />
              </div>
            </div>
          )}
          {selectedOrderType === 'mess' && (
            <div className="border-t p-3 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Group / Batch</p>
              <div className="relative">
                <Users className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={messGroup} onChange={e => setMessGroup(e.target.value)} placeholder="e.g. Batch A" className="h-9 text-sm pl-8" />
              </div>
            </div>
          )}
        </aside>

        {/* ══════════════════════════════════════════════════════════════════
            MIDDLE PANEL — Search + Categories + Item Grid
        ══════════════════════════════════════════════════════════════════ */}
        <section className="flex flex-1 flex-col min-w-0 border-r bg-secondary/30">

          {/* Search bar */}
          <div className="border-b bg-card p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items..."
                className="pl-9 h-9 text-sm bg-background"
                aria-label="Search menu items"
              />
            </div>
          </div>

          {/* Category filter pills */}
          <div
            className="flex gap-1.5 overflow-x-auto border-b bg-card px-3 py-2"
            style={{ scrollbarWidth: 'none' }}
            aria-label="Category filters"
          >
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'shrink-0 rounded-full px-3 py-1 text-xs font-semibold',
                    'transition-all duration-150',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500',
                    isActive
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                  )}
                  aria-pressed={isActive}
                  aria-label={`Filter by ${cat}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Menu item grid */}
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} onAdd={addToCart} />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <Search className="mb-3 h-10 w-10 text-muted-foreground/30" />
                  <p className="text-sm font-medium text-muted-foreground">No items found</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    Try a different search term or category
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            RIGHT PANEL — Cart + Payment (~320 px)
        ══════════════════════════════════════════════════════════════════ */}
        <aside className="flex w-[320px] shrink-0 flex-col bg-card">

          {/* Cart header */}
          <div className="flex items-center gap-2 border-b px-3 py-3">
            <span className="text-sm font-bold">Order</span>
            <Badge className="rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 font-bold px-2">
              {totalItemCount}
            </Badge>
            <span className="text-xs font-medium text-muted-foreground">#{ORDER_NUMBER}</span>
            <Badge variant="outline" className={cn('text-[10px] font-semibold px-2 py-0.5 capitalize', ORDER_TYPE_COLORS[selectedOrderType])}>
              {ORDER_TYPES.find(o => o.id === selectedOrderType)?.label}
            </Badge>
            <div className="ml-auto flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs font-semibold"
                aria-label="Hold order"
              >
                Hold
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs font-semibold text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950"
                onClick={clearCart}
                aria-label="Clear order"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Cart item list */}
          <ScrollArea className="flex-1 px-3 py-2">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <UtensilsCrossed className="mb-3 h-10 w-10 text-muted-foreground/20" />
                <p className="text-sm font-medium text-muted-foreground">Cart is empty</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  Tap menu items to add them
                </p>
              </div>
            ) : (
              <ul className="space-y-1.5" aria-label="Cart items">
                {cartItems.map(({ menuItem, qty }) => (
                  <li
                    key={menuItem.id}
                    className="flex items-center gap-2 rounded-lg border bg-background px-2.5 py-2"
                  >
                    {/* Item info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold leading-tight truncate">
                        {menuItem.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {formatPrice(menuItem.price)} × {qty}
                      </p>
                    </div>

                    {/* Qty stepper */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => updateQty(menuItem.id, -1)}
                        className="flex h-6 w-6 items-center justify-center rounded border bg-muted text-muted-foreground hover:bg-muted/70 transition-colors"
                        aria-label={`Decrease quantity of ${menuItem.name}`}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold select-none">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateQty(menuItem.id, +1)}
                        className="flex h-6 w-6 items-center justify-center rounded border bg-muted text-muted-foreground hover:bg-muted/70 transition-colors"
                        aria-label={`Increase quantity of ${menuItem.name}`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="shrink-0 w-[56px] text-right text-xs font-bold text-green-600">
                      {formatPrice(menuItem.price * qty)}
                    </span>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(menuItem.id)}
                      className="shrink-0 flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-red-500 transition-colors"
                      aria-label={`Remove ${menuItem.name} from cart`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>

          {/* ── Bottom section: discount / note / payment / total / actions */}
          <div className="border-t p-3 space-y-3 bg-card">

            {/* Discount & Note */}
            <div className="flex gap-2">
              <Button
                variant="outline" size="sm"
                className={cn('flex-1 h-8 gap-1.5 text-xs font-semibold', appliedDiscount > 0 && 'border-green-500 text-green-700 bg-green-50')}
                onClick={() => { setDiscountInput(appliedDiscount > 0 ? String(appliedDiscount) : ''); setDiscountOpen(true); }}
              >
                <Percent className="h-3.5 w-3.5" />
                {appliedDiscount > 0 ? (discountType === 'flat' ? `-Rs.${appliedDiscount}` : `-${appliedDiscount}%`) : 'Discount'}
              </Button>
              <Button
                variant="outline" size="sm"
                className={cn('flex-1 h-8 gap-1.5 text-xs font-semibold', appliedNote && 'border-blue-400 text-blue-700 bg-blue-50')}
                onClick={() => { setNoteInput(appliedNote); setNoteOpen(true); }}
              >
                <FileText className="h-3.5 w-3.5" />
                {appliedNote ? 'Note ✓' : 'Note'}
              </Button>
            </div>

            {/* Order note preview */}
            {appliedNote && (
              <div className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs text-blue-700 flex items-start gap-1.5">
                <FileText className="h-3 w-3 mt-0.5 shrink-0" />
                <span className="line-clamp-2">{appliedNote}</span>
                <button onClick={() => setAppliedNote('')} className="ml-auto shrink-0 text-blue-400 hover:text-blue-600"><X className="h-3 w-3" /></button>
              </div>
            )}

            {/* Payment method selector */}
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Payment</p>
              <div className="grid grid-cols-2 gap-1.5">
                {PAYMENT_METHODS.map((pm) => {
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={cn(
                        'rounded-md border px-2 py-1.5 text-xs font-semibold transition-all duration-150',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500',
                        isSelected
                          ? 'border-green-600 bg-green-600 text-white shadow-sm'
                          : 'bg-background text-foreground hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-950',
                      )}
                      aria-pressed={isSelected}
                    >
                      {pm.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Total display */}
            <div className="rounded-lg bg-muted px-3 py-2.5 space-y-1">
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartSubtotal)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-xs text-red-600">
                  <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">Total</span>
                <span className="text-xl font-extrabold text-green-600 tabular-nums">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-10 gap-1.5 text-xs font-semibold"
                aria-label="Print Kitchen Order Ticket"
              >
                <Printer className="h-4 w-4" />
                Print KOT
              </Button>
              <Button
                size="sm"
                className="flex-1 h-10 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-xs font-bold"
                disabled={cartItems.length === 0}
                aria-label="Pay and close order"
              >
                Pay &amp; Close
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Discount Dialog ─────────────────────────────────────────────── */}
      <Dialog open={discountOpen} onOpenChange={setDiscountOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Percent className="h-4 w-4 text-green-600" /> Apply Discount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-1">
            {/* Type toggle */}
            <div className="flex rounded-lg border overflow-hidden">
              <button
                onClick={() => setDiscountType('flat')}
                className={cn('flex-1 py-2 text-xs font-semibold transition-colors',
                  discountType === 'flat' ? 'bg-green-600 text-white' : 'bg-background text-muted-foreground hover:bg-muted')}
              >
                Flat (Rs.)
              </button>
              <button
                onClick={() => setDiscountType('percent')}
                className={cn('flex-1 py-2 text-xs font-semibold transition-colors',
                  discountType === 'percent' ? 'bg-green-600 text-white' : 'bg-background text-muted-foreground hover:bg-muted')}
              >
                Percentage (%)
              </button>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{discountType === 'flat' ? 'Discount Amount (PKR)' : 'Discount Percentage'}</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-muted-foreground font-medium">
                  {discountType === 'flat' ? 'Rs.' : '%'}
                </span>
                <Input
                  type="number"
                  value={discountInput}
                  onChange={e => setDiscountInput(e.target.value)}
                  placeholder={discountType === 'flat' ? '0' : '0'}
                  className="pl-9 text-sm"
                  min={0}
                  max={discountType === 'percent' ? 100 : cartSubtotal}
                  autoFocus
                />
              </div>
              {discountInput && !isNaN(Number(discountInput)) && cartSubtotal > 0 && (
                <p className="text-xs text-muted-foreground">
                  Saves: Rs. {discountType === 'flat'
                    ? Math.min(Number(discountInput), cartSubtotal).toLocaleString()
                    : Math.round(cartSubtotal * Number(discountInput) / 100).toLocaleString()}
                  {' '}· New total: Rs. {discountType === 'flat'
                    ? Math.max(0, cartSubtotal - Number(discountInput)).toLocaleString()
                    : Math.round(cartSubtotal * (1 - Number(discountInput) / 100)).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            {appliedDiscount > 0 && (
              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => { setAppliedDiscount(0); setDiscountInput(''); setDiscountOpen(false); }}>
                Remove
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setDiscountOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                const val = Number(discountInput);
                if (!isNaN(val) && val >= 0) setAppliedDiscount(val);
                setDiscountOpen(false);
              }}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Note Dialog ──────────────────────────────────────────────────── */}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileText className="h-4 w-4 text-blue-600" /> Order Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-1">
            <Label className="text-xs">Special instructions or remarks for this order</Label>
            <Textarea
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              placeholder="e.g. Extra spicy, no onions, pack separately..."
              rows={4}
              className="text-sm resize-none"
              autoFocus
            />
            <p className="text-[11px] text-muted-foreground">{noteInput.length}/200 characters</p>
          </div>
          <DialogFooter className="gap-2">
            {appliedNote && (
              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => { setAppliedNote(''); setNoteInput(''); setNoteOpen(false); }}>
                Clear
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setNoteOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => { setAppliedNote(noteInput.trim()); setNoteOpen(false); }}>
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════════════
          BOTTOM BAR — Held Orders
      ══════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3 border-t bg-card px-4 py-2 shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Held Orders
        </span>
        <Badge className="rounded-full bg-amber-500 text-white font-bold text-[11px] px-2 py-0.5">
          {heldOrdersCount}
        </Badge>
        <span className="text-xs text-muted-foreground">orders on hold</span>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
          aria-label="View held orders"
        >
          View all
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
