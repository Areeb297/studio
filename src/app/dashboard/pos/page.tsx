'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingBag, UtensilsCrossed, Truck, CalendarDays, Users, Shield,
  Search, Printer, X, Minus, Plus, Percent, FileText, Tag, Phone,
  MapPin, BookOpen, Layers, PlusCircle, RotateCw, Trash2, Copy,
  Lock, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ClipboardList, Timer, AlertCircle, Receipt, Pencil, UserCheck,
  CreditCard, Ticket, ChefHat,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ─────────────────────────────────────────────────────────────────

type OrderType = 'takeaway' | 'dine-in' | 'delivery' | 'booking' | 'mess' | 'staff';
type Category  = 'All' | 'Rice' | 'Curry' | 'Bread' | 'Drinks' | 'Sides' | 'Dessert' | 'BBQ';

const ORDER_TYPE_COLORS: Record<OrderType, string> = {
  'takeaway': 'bg-orange-500/15 text-orange-700 border-orange-200',
  'dine-in':  'bg-purple-500/15 text-purple-700 border-purple-200',
  'delivery': 'bg-blue-500/15   text-blue-700   border-blue-200',
  'booking':  'bg-teal-500/15   text-teal-700   border-teal-200',
  'mess':     'bg-gray-500/15   text-gray-700   border-gray-200',
  'staff':    'bg-pink-500/15   text-pink-700   border-pink-200',
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
  discountPct: number; // per-line discount %
  note: string;
}

// ─── Static Data ────────────────────────────────────────────────────────────

const ORDER_TYPES: { id: OrderType; label: string; sub: string; icon: React.ReactNode }[] = [
  { id: 'takeaway', label: 'Takeaway', sub: 'Counter pickup',   icon: <ShoppingBag     className="h-5 w-5" /> },
  { id: 'dine-in',  label: 'Dine-in',  sub: 'Table service',    icon: <UtensilsCrossed className="h-5 w-5" /> },
  { id: 'delivery', label: 'Delivery', sub: 'Rider dispatch',   icon: <Truck           className="h-5 w-5" /> },
  { id: 'booking',  label: 'Booking',  sub: 'Events & parties', icon: <CalendarDays    className="h-5 w-5" /> },
  { id: 'mess',     label: 'Mess',     sub: 'Student meals',    icon: <Users           className="h-5 w-5" /> },
  { id: 'staff',    label: 'Staff',    sub: 'Staff meals',      icon: <Shield          className="h-5 w-5" /> },
];

const CATEGORIES: Category[] = ['All', 'Rice', 'Curry', 'Bread', 'Drinks', 'Sides', 'Dessert', 'BBQ'];

const COST_CENTRES = [
  'Binoria Restaurant',
  'Binoria Restaurant (Take Away)',
  'KOT-2 Beverage',
  'Counter C',
];

const CUSTOMERS = [
  'Walking Customer',
  'JBA Staff',
  'VIP Guest',
  'Corporate Account',
];

const MENU_ITEMS: MenuItem[] = [
  // Rice
  { id: 1,  name: 'Chicken Biryani',   price: 350,  category: 'Rice'    },
  { id: 2,  name: 'Mutton Biryani',    price: 550,  category: 'Rice'    },
  { id: 3,  name: 'Daal Chawal',       price: 150,  category: 'Rice'    },
  { id: 4,  name: 'Pulao',             price: 300,  category: 'Rice'    },
  // Curry
  { id: 5,  name: 'Chicken Karahi',    price: 900,  category: 'Curry'   },
  { id: 6,  name: 'Mutton Karahi',     price: 1400, category: 'Curry'   },
  { id: 7,  name: 'Aloo Gosht',        price: 600,  category: 'Curry'   },
  { id: 8,  name: 'Chicken Haleem',    price: 250,  category: 'Curry'   },
  { id: 9,  name: 'Daal Makhani',      price: 350,  category: 'Curry'   },
  { id: 10, name: 'Nihari',            price: 450,  category: 'Curry'   },
  { id: 11, name: 'Mutton Qeema',      price: 780,  category: 'Curry'   },
  { id: 12, name: 'Chicken Tikka',     price: 650,  category: 'Curry'   },
  // Bread
  { id: 13, name: 'Naan',              price: 30,   category: 'Bread'   },
  { id: 14, name: 'Roghni Naan',       price: 50,   category: 'Bread'   },
  { id: 15, name: 'Paratha',           price: 60,   category: 'Bread'   },
  { id: 16, name: 'Tandoori Roti',     price: 20,   category: 'Bread'   },
  { id: 17, name: 'Chapati',           price: 40,   category: 'Bread'   },
  // Drinks
  { id: 18, name: 'Lassi',             price: 80,   category: 'Drinks'  },
  { id: 19, name: 'Chai',              price: 40,   category: 'Drinks'  },
  { id: 20, name: 'Pakola (500ml)',     price: 90,   category: 'Drinks'  },
  { id: 21, name: 'Pakola (L)',         price: 130,  category: 'Drinks'  },
  { id: 22, name: 'Fresh Juice',        price: 120,  category: 'Drinks'  },
  // Sides
  { id: 23, name: 'Raita',             price: 60,   category: 'Sides'   },
  { id: 24, name: 'Green Salad',       price: 190,  category: 'Sides'   },
  { id: 25, name: 'Chatni',            price: 40,   category: 'Sides'   },
  // Dessert
  { id: 26, name: 'Gulab Jamun',       price: 80,   category: 'Dessert' },
  { id: 27, name: 'Kheer',             price: 70,   category: 'Dessert' },
  // BBQ
  { id: 28, name: 'BBQ Matka Biryani', price: 650,  category: 'BBQ'     },
  { id: 29, name: 'Malai Boti',        price: 560,  category: 'BBQ'     },
  { id: 30, name: 'Seekh Kabab',       price: 600,  category: 'BBQ'     },
  { id: 31, name: 'Chicken Tikka BBQ', price: 750,  category: 'BBQ'     },
];

// Pending KOTs waiting to be pulled into an invoice
const PENDING_KOTS = [
  { id: 'KOT-126-1', table: 'T-1',  items: [{ name: 'Chicken Sandwich', qty: 1, price: 280 }, { name: 'Fajita Pizza 12"', qty: 1, price: 850 }] },
  { id: 'KOT-128-1', table: 'T-2',  items: [{ name: 'Palak Paneer', qty: 1, price: 420 }, { name: 'Malai Boti', qty: 2, price: 560 }, { name: 'Chapati', qty: 5, price: 40 }] },
  { id: 'KOT-129-1', table: 'T-5',  items: [{ name: 'French Fries', qty: 1, price: 220 }, { name: 'Chicken Biryani', qty: 2, price: 350 }] },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number) { return `Rs.\u00a0${n.toLocaleString('en-PK')}`; }

function useElapsedTime(startRef: React.MutableRefObject<Date | null>) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      if (startRef.current) {
        setElapsed(Math.floor((Date.now() - startRef.current.getTime()) / 1000));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [startRef]);
  return elapsed;
}

function formatElapsed(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ─── MenuItemCard ────────────────────────────────────────────────────────────

function MenuItemCard({ item, onAdd }: { item: MenuItem; onAdd: (item: MenuItem) => void }) {
  return (
    <button
      onClick={() => onAdd(item)}
      className={cn(
        'group relative flex flex-col items-start gap-1 rounded-lg border bg-card p-3 text-left',
        'transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:border-primary/50',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      )}
      aria-label={`Add ${item.name} to cart`}
    >
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{item.category}</span>
      <span className="text-sm font-semibold leading-snug text-foreground line-clamp-2">{item.name}</span>
      <span className="mt-auto pt-1 text-sm font-bold text-primary">{fmt(item.price)}</span>
      <span aria-hidden className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <Plus className="h-3 w-3" />
      </span>
    </button>
  );
}

// ─── POSPage ─────────────────────────────────────────────────────────────────

export default function POSPage() {

  // ── Order meta ──────────────────────────────────────────────────────────
  const [orderType,     setOrderType]     = useState<OrderType>('dine-in');
  const [tableNumber,   setTableNumber]   = useState('');
  const [numGuests,     setNumGuests]     = useState('');
  const [customer,      setCustomer]      = useState('Walking Customer');
  const [costCentre,    setCostCentre]    = useState(COST_CENTRES[0]);
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [deliveryAddr,  setDeliveryAddr]  = useState('');
  const [bookingRef,    setBookingRef]    = useState('');
  const [messGroup,     setMessGroup]     = useState('');

  // ── Menu / search ────────────────────────────────────────────────────────
  const [searchQuery,       setSearchQuery]       = useState('');
  const [selectedCategory,  setSelectedCategory]  = useState<Category>('All');

  // ── Cart ─────────────────────────────────────────────────────────────────
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ── Order-level discount ─────────────────────────────────────────────────
  const [discountOpen,   setDiscountOpen]   = useState(false);
  const [discountType,   setDiscountType]   = useState<'flat' | 'percent'>('flat');
  const [discountInput,  setDiscountInput]  = useState('');
  const [orderDiscount,  setOrderDiscount]  = useState(0);
  const [discountApprovedBy, setDiscountApprovedBy] = useState('');

  // ── Tax / tip ────────────────────────────────────────────────────────────
  const [taxPct, setTaxPct] = useState(0);
  const [tip,    setTip]    = useState(0);

  // ── Order note ───────────────────────────────────────────────────────────
  const [noteOpen,    setNoteOpen]    = useState(false);
  const [noteInput,   setNoteInput]   = useState('');
  const [appliedNote, setAppliedNote] = useState('');

  // ── Payment dialog ───────────────────────────────────────────────────────
  const [payOpen,      setPayOpen]      = useState(false);
  const [payCash,      setPayCash]      = useState('');
  const [payCredit,    setPayCredit]    = useState('');
  const [payCreditCard,setPayCreditCard]= useState('');
  const [payVoucher,   setPayVoucher]   = useState('');

  // ── Pick KOT dialog ──────────────────────────────────────────────────────
  const [kotOpen, setKotOpen] = useState(false);

  // ── Waiter item-note dialog ──────────────────────────────────────────────
  const [itemNoteOpen,  setItemNoteOpen]  = useState(false);
  const [itemNoteTarget,setItemNoteTarget]= useState<number | null>(null);
  const [itemNoteInput, setItemNoteInput] = useState('');

  // ── Order tracking ───────────────────────────────────────────────────────
  const [editCount, setEditCount]       = useState(0);
  const [heldCount] = useState(2);
  const orderStartRef = useRef<Date | null>(null);
  const ORDER_NO = 'INV-509784';
  const invoiceDate = new Date().toLocaleDateString('en-PK', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const invoiceTime = new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: true });

  // Start timer when first item is added
  useEffect(() => {
    if (cartItems.length > 0 && !orderStartRef.current) {
      orderStartRef.current = new Date();
    }
    if (cartItems.length === 0) {
      orderStartRef.current = null;
    }
  }, [cartItems.length]);

  const elapsed = useElapsedTime(orderStartRef);
  const elapsedMin = Math.floor(elapsed / 60);
  const waitingColor = elapsedMin < 10
    ? 'text-green-600 bg-green-500/10'
    : elapsedMin < 20
      ? 'text-amber-600 bg-amber-500/10'
      : 'text-red-600 bg-red-500/10 animate-pulse';

  // ── Filtered items ───────────────────────────────────────────────────────
  const filteredItems = useMemo(() => MENU_ITEMS.filter(item => {
    const cat = selectedCategory === 'All' || item.category === selectedCategory;
    const q   = !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return cat && q;
  }), [selectedCategory, searchQuery]);

  // ── Cart helpers ─────────────────────────────────────────────────────────
  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const exists = prev.find(ci => ci.menuItem.id === item.id);
      if (exists) return prev.map(ci => ci.menuItem.id === item.id ? { ...ci, qty: ci.qty + 1 } : ci);
      return [...prev, { menuItem: item, qty: 1, discountPct: 0, note: '' }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCartItems(prev => prev.map(ci => ci.menuItem.id === id ? { ...ci, qty: ci.qty + delta } : ci).filter(ci => ci.qty > 0));
  };

  const removeFromCart = (id: number) => setCartItems(prev => prev.filter(ci => ci.menuItem.id !== id));
  const clearCart = () => { setCartItems([]); setOrderDiscount(0); setAppliedNote(''); setEditCount(0); setTaxPct(0); setTip(0); };

  const updateLineDiscount = (id: number, pct: number) => {
    setCartItems(prev => prev.map(ci => ci.menuItem.id === id ? { ...ci, discountPct: Math.min(100, Math.max(0, pct)) } : ci));
  };

  const openItemNote = (id: number) => {
    const ci = cartItems.find(c => c.menuItem.id === id);
    setItemNoteInput(ci?.note || '');
    setItemNoteTarget(id);
    setItemNoteOpen(true);
  };

  // ── Totals ───────────────────────────────────────────────────────────────
  const lineSubtotals = useMemo(() =>
    cartItems.map(ci => {
      const gross   = ci.menuItem.price * ci.qty;
      const lineDis = Math.round(gross * ci.discountPct / 100);
      return gross - lineDis;
    })
  , [cartItems]);

  const cartSubtotal = useMemo(() => lineSubtotals.reduce((a, b) => a + b, 0), [lineSubtotals]);

  const orderDiscountAmt = useMemo(() => {
    if (discountType === 'flat') return Math.min(orderDiscount, cartSubtotal);
    return Math.round(cartSubtotal * orderDiscount / 100);
  }, [orderDiscount, discountType, cartSubtotal]);

  const afterDiscount = cartSubtotal - orderDiscountAmt;
  const taxAmount     = Math.round(afterDiscount * taxPct / 100);
  const grandTotal    = afterDiscount + taxAmount + tip;

  const totalPaid = useMemo(() =>
    (Number(payCash) || 0) + (Number(payCredit) || 0) + (Number(payCreditCard) || 0) + (Number(payVoucher) || 0)
  , [payCash, payCredit, payCreditCard, payVoucher]);
  const returnCash = Math.max(0, totalPaid - grandTotal);
  const underpaid  = totalPaid < grandTotal && totalPaid > 0;

  const totalItemCount = useMemo(() => cartItems.reduce((s, ci) => s + ci.qty, 0), [cartItems]);

  const openPayDialog = () => {
    setPayCash(String(grandTotal));
    setPayCredit('');
    setPayCreditCard('');
    setPayVoucher('');
    setPayOpen(true);
  };

  const pullKOT = (kot: typeof PENDING_KOTS[0]) => {
    kot.items.forEach(item => {
      const menuItem: MenuItem = { id: 1000 + Math.random(), name: item.name, price: item.price, category: 'Curry' };
      addToCart(menuItem);
    });
    setKotOpen(false);
  };

  const handleSave = () => {
    setEditCount(c => c + 1);
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-4 sm:-m-6 overflow-hidden bg-background">

      {/* ── CRUD Toolbar ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b bg-card px-3 py-1.5 shrink-0 flex-wrap">
        <Button size="sm" variant="default"  className="h-7 gap-1 px-2 text-xs bg-green-600 hover:bg-green-700 text-white" aria-label="New invoice"><PlusCircle className="h-3.5 w-3.5" /> New</Button>
        <Button size="sm" variant="outline"  className="h-7 gap-1 px-2 text-xs text-teal-600 border-teal-200 hover:bg-teal-50 dark:hover:bg-teal-950" aria-label="Refresh"><RotateCw className="h-3.5 w-3.5" /> Refresh</Button>
        <Button size="sm" variant="outline"  className="h-7 gap-1 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950" onClick={clearCart} aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
        <Button size="sm" variant="outline"  className="h-7 gap-1 px-2 text-xs" aria-label="Search invoice"><Search className="h-3.5 w-3.5" /> Search</Button>
        <Button size="sm" variant="outline"  className="h-7 gap-1 px-2 text-xs" aria-label="Copy invoice"><Copy className="h-3.5 w-3.5" /> Copy</Button>
        <Button size="sm" variant="outline"  className="h-7 gap-1 px-2 text-xs" aria-label="Print invoice"><Printer className="h-3.5 w-3.5" /> Print</Button>
        <Button size="sm" variant="outline"  className="h-7 gap-1 px-2 text-xs text-amber-600 border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950" aria-label="Lock"><Lock className="h-3.5 w-3.5" /> Lock</Button>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <div className="flex items-center gap-0.5">
          <Button size="icon" variant="outline" className="h-7 w-7" aria-label="First"><ChevronsLeft className="h-3.5 w-3.5" /></Button>
          <Button size="icon" variant="outline" className="h-7 w-7" aria-label="Previous"><ChevronLeft className="h-3.5 w-3.5" /></Button>
          <Button size="icon" variant="outline" className="h-7 w-7" aria-label="Next"><ChevronRight className="h-3.5 w-3.5" /></Button>
          <Button size="icon" variant="outline" className="h-7 w-7" aria-label="Last"><ChevronsRight className="h-3.5 w-3.5" /></Button>
        </div>

        <Separator orientation="vertical" className="h-5 mx-1" />
        <Button size="icon" variant="outline" className="h-7 w-7 text-destructive" aria-label="Close"><X className="h-3.5 w-3.5" /></Button>

        {/* Waiting time — shown once order has items */}
        {cartItems.length > 0 && (
          <div className={cn('ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold', waitingColor)}>
            <Timer className="h-3.5 w-3.5" />
            Waiting: {formatElapsed(elapsed)}
          </div>
        )}

        {/* Edit count badge */}
        {editCount > 0 && (
          <Badge variant="outline" className="ml-1 text-[10px] font-bold text-muted-foreground">
            Edit #{editCount}
          </Badge>
        )}
      </div>

      {/* Three-panel row */}
      <div className="flex flex-1 min-h-0">

        {/* ══ LEFT — Order Type ══════════════════════════════════════════════ */}
        <aside className="flex w-[190px] shrink-0 flex-col border-r bg-card">
          <div className="border-b px-3 py-2.5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Order Type</p>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2" aria-label="Order types">
            {ORDER_TYPES.map(ot => {
              const active = orderType === ot.id;
              return (
                <button
                  key={ot.id}
                  onClick={() => setOrderType(ot.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-left',
                    'transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground hover:bg-muted',
                  )}
                  aria-pressed={active}
                >
                  <span className={cn('shrink-0', active ? 'text-primary-foreground' : 'text-muted-foreground')}>{ot.icon}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-tight">{ot.label}</span>
                    <span className={cn('block text-[11px] leading-tight', active ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{ot.sub}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Contextual fields */}
          {orderType === 'dine-in' && (
            <div className="border-t p-3 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Table & Guests</p>
              <div className="relative">
                <Layers className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={tableNumber} onChange={e => setTableNumber(e.target.value)} placeholder="Table # (e.g. 12)" className="h-8 text-xs pl-8" />
              </div>
              <div className="relative">
                <Users className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input type="number" value={numGuests} onChange={e => setNumGuests(e.target.value)} placeholder="No. of guests" className="h-8 text-xs pl-8" min={1} />
              </div>
            </div>
          )}
          {orderType === 'delivery' && (
            <div className="border-t p-3 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Delivery Info</p>
              <div className="relative">
                <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={deliveryPhone} onChange={e => setDeliveryPhone(e.target.value)} placeholder="Phone" className="h-8 text-xs pl-8" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={deliveryAddr} onChange={e => setDeliveryAddr(e.target.value)} placeholder="Address" className="h-8 text-xs pl-8" />
              </div>
            </div>
          )}
          {orderType === 'booking' && (
            <div className="border-t p-3 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Booking Ref</p>
              <div className="relative">
                <BookOpen className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={bookingRef} onChange={e => setBookingRef(e.target.value)} placeholder="BKG-0006" className="h-8 text-xs pl-8" />
              </div>
            </div>
          )}
          {orderType === 'mess' && (
            <div className="border-t p-3 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Group / Batch</p>
              <div className="relative">
                <Users className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input value={messGroup} onChange={e => setMessGroup(e.target.value)} placeholder="Batch A" className="h-8 text-xs pl-8" />
              </div>
            </div>
          )}
        </aside>

        {/* ══ MIDDLE — Menu ══════════════════════════════════════════════════ */}
        <section className="flex flex-1 flex-col min-w-0 border-r bg-secondary/30">
          {/* Search */}
          <div className="border-b bg-card p-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search menu items…" className="pl-9 h-9 text-sm bg-background" />
            </div>
          </div>
          {/* Category pills */}
          <div className="flex gap-1.5 overflow-x-auto border-b bg-card px-3 py-2" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map(cat => {
              const active = selectedCategory === cat;
              return (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-150',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    active ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                  )}
                  aria-pressed={active}
                >{cat}</button>
              );
            })}
          </div>
          {/* Item grid */}
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-4">
              {filteredItems.length > 0
                ? filteredItems.map(item => <MenuItemCard key={item.id} item={item} onAdd={addToCart} />)
                : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                    <Search className="mb-3 h-10 w-10 text-muted-foreground/30" />
                    <p className="text-sm font-medium text-muted-foreground">No items found</p>
                  </div>
                )
              }
            </div>
          </ScrollArea>
        </section>

        {/* ══ RIGHT — Invoice / Cart ══════════════════════════════════════════ */}
        <aside className="flex w-[340px] shrink-0 flex-col bg-card">

          {/* Invoice meta header */}
          <div className="border-b bg-muted/40 px-3 py-2 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <Receipt className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] font-bold text-muted-foreground">Invoice#</span>
                <span className="text-xs font-bold text-foreground">{ORDER_NO}</span>
              </div>
              <Separator orientation="vertical" className="h-3" />
              <span className="text-[11px] text-muted-foreground">{invoiceDate} {invoiceTime}</span>
              <Badge variant="outline" className={cn('text-[10px] font-semibold px-2 py-0.5 capitalize ml-auto', ORDER_TYPE_COLORS[orderType])}>
                {ORDER_TYPES.find(o => o.id === orderType)?.label}
              </Badge>
            </div>

            {/* Customer + Cost Centre row */}
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1 block">Customer</Label>
                <Select value={customer} onValueChange={setCustomer}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CUSTOMERS.map(c => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1 block">Cost Centre</Label>
                <Select value={costCentre} onValueChange={setCostCentre}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COST_CENTRES.map(c => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {orderType === 'dine-in' && tableNumber && (
              <div className="flex items-center gap-2 text-[11px]">
                <Layers className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Table:</span>
                <span className="font-bold">{tableNumber}{numGuests ? ` (${numGuests} guests)` : ''}</span>
              </div>
            )}
          </div>

          {/* Cart column headers */}
          <div className="grid grid-cols-[1fr_52px_64px_60px_24px] gap-1 border-b bg-muted/30 px-2 py-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Item</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground text-center">Amt</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground text-center">Disc%</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground text-right">Total</span>
            <span />
          </div>

          {/* Cart items */}
          <ScrollArea className="flex-1 px-2 py-1">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <UtensilsCrossed className="mb-3 h-10 w-10 text-muted-foreground/20" />
                <p className="text-sm font-medium text-muted-foreground">Cart is empty</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">Select items from the menu</p>

                {/* Pick from KOT FAB area */}
                <button
                  onClick={() => setKotOpen(true)}
                  className="mt-4 flex items-center gap-2 rounded-full border border-dashed border-primary/40 px-3 py-1.5 text-xs text-primary hover:bg-primary/5 transition-colors"
                >
                  <ClipboardList className="h-3.5 w-3.5" />
                  Pick and select Orders
                </button>
              </div>
            ) : (
              <ul className="space-y-1 py-1" aria-label="Cart items">
                {cartItems.map((ci, idx) => {
                  const gross    = ci.menuItem.price * ci.qty;
                  const lineDis  = Math.round(gross * ci.discountPct / 100);
                  const lineTotal = gross - lineDis;
                  return (
                    <li key={ci.menuItem.id} className="rounded-lg border bg-background">
                      {/* Main row */}
                      <div className="grid grid-cols-[1fr_52px_64px_60px_24px] items-center gap-1 px-2 py-2">
                        {/* Item + qty stepper */}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold leading-tight truncate">{ci.menuItem.name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <button onClick={() => updateQty(ci.menuItem.id, -1)} className="flex h-5 w-5 items-center justify-center rounded border bg-muted text-muted-foreground hover:bg-muted/60 transition-colors" aria-label="Decrease qty">
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold">{ci.qty}</span>
                            <button onClick={() => updateQty(ci.menuItem.id, +1)} className="flex h-5 w-5 items-center justify-center rounded border bg-muted text-muted-foreground hover:bg-muted/60 transition-colors" aria-label="Increase qty">
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        </div>
                        {/* Amount */}
                        <span className="text-[11px] text-center text-muted-foreground tabular-nums">{(ci.menuItem.price * ci.qty).toLocaleString()}</span>
                        {/* Discount % */}
                        <div className="flex items-center gap-0.5">
                          <Input
                            type="number"
                            value={ci.discountPct || ''}
                            onChange={e => updateLineDiscount(ci.menuItem.id, Number(e.target.value))}
                            placeholder="0"
                            className="h-6 w-10 text-center text-[11px] p-1"
                            min={0} max={100}
                            aria-label={`Discount for ${ci.menuItem.name}`}
                          />
                          <span className="text-[10px] text-muted-foreground">%</span>
                        </div>
                        {/* Line total */}
                        <span className="text-xs font-bold text-right text-primary tabular-nums">{lineTotal.toLocaleString()}</span>
                        {/* Remove */}
                        <button onClick={() => removeFromCart(ci.menuItem.id)} className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-destructive transition-colors" aria-label={`Remove ${ci.menuItem.name}`}>
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      {/* Item note row (if set) */}
                      {ci.note && (
                        <div className="px-2 pb-1.5 flex items-center gap-1">
                          <FileText className="h-3 w-3 text-blue-500 shrink-0" />
                          <span className="text-[11px] text-blue-600 truncate">{ci.note}</span>
                          <button onClick={() => openItemNote(ci.menuItem.id)} className="ml-auto shrink-0 text-[10px] text-muted-foreground hover:text-foreground">edit</button>
                        </div>
                      )}
                      {/* Item note button (if not set) */}
                      {!ci.note && (
                        <div className="px-2 pb-1.5">
                          <button onClick={() => openItemNote(ci.menuItem.id)} className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                            <Pencil className="h-2.5 w-2.5" /> Add note
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}

                {/* Pick KOT button at bottom of list */}
                <li>
                  <button
                    onClick={() => setKotOpen(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-primary/30 px-3 py-2 text-xs text-primary hover:bg-primary/5 transition-colors"
                  >
                    <ClipboardList className="h-3.5 w-3.5" />
                    Pick and select Orders
                  </button>
                </li>
              </ul>
            )}
          </ScrollArea>

          {/* ── Totals & payment controls ──────────────────────────────────── */}
          <div className="border-t p-3 space-y-2 bg-card">

            {/* Order-level discount + note row */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm"
                className={cn('flex-1 h-8 gap-1.5 text-xs font-semibold', orderDiscount > 0 && 'border-primary text-primary bg-primary/5')}
                onClick={() => { setDiscountInput(orderDiscount > 0 ? String(orderDiscount) : ''); setDiscountOpen(true); }}
              >
                <Percent className="h-3.5 w-3.5" />
                {orderDiscount > 0 ? (discountType === 'flat' ? `-Rs.${orderDiscount}` : `-${orderDiscount}%`) : 'Discount'}
              </Button>
              <Button variant="outline" size="sm"
                className={cn('flex-1 h-8 gap-1.5 text-xs font-semibold', appliedNote && 'border-blue-400 text-blue-700 bg-blue-50 dark:bg-blue-950')}
                onClick={() => { setNoteInput(appliedNote); setNoteOpen(true); }}
              >
                <FileText className="h-3.5 w-3.5" />
                {appliedNote ? 'Note ✓' : 'Note'}
              </Button>
            </div>

            {/* Tax + Tip row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1 block">Sale Tax %</Label>
                <Input type="number" value={taxPct || ''} onChange={e => setTaxPct(Math.max(0, Number(e.target.value)))} placeholder="0" className="h-7 text-xs" min={0} max={100} />
              </div>
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1 block">Tip (Rs.)</Label>
                <Input type="number" value={tip || ''} onChange={e => setTip(Math.max(0, Number(e.target.value)))} placeholder="0" className="h-7 text-xs" min={0} />
              </div>
            </div>

            {/* Totals summary */}
            <div className="rounded-lg border bg-muted/30 px-3 py-2 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Subtotal ({totalItemCount} items)</span>
                <span className="tabular-nums">{fmt(cartSubtotal)}</span>
              </div>
              {orderDiscountAmt > 0 && (
                <div className="flex justify-between text-xs text-destructive">
                  <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> Order Discount</span>
                  <span className="tabular-nums">-{fmt(orderDiscountAmt)}</span>
                </div>
              )}
              {taxAmount > 0 && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tax ({taxPct}%)</span>
                  <span className="tabular-nums">+{fmt(taxAmount)}</span>
                </div>
              )}
              {tip > 0 && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tip</span>
                  <span className="tabular-nums">+{fmt(tip)}</span>
                </div>
              )}
              <Separator className="my-1" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold">Grand Total</span>
                <span className="text-xl font-extrabold text-primary tabular-nums">{fmt(grandTotal)}</span>
              </div>
            </div>

            {/* Discount approved by */}
            {orderDiscount > 0 && (
              <div className="flex items-center gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-2.5 py-1.5">
                <UserCheck className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide shrink-0">Approved By</span>
                <Input
                  value={discountApprovedBy}
                  onChange={e => setDiscountApprovedBy(e.target.value)}
                  placeholder="Enter name…"
                  className="h-6 text-[11px] border-amber-300 bg-transparent flex-1 min-w-0"
                />
              </div>
            )}

            {/* Order note preview */}
            {appliedNote && (
              <div className="rounded-md border border-blue-200 bg-blue-50 dark:bg-blue-950/30 px-2.5 py-1.5 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-1.5">
                <FileText className="h-3 w-3 mt-0.5 shrink-0" />
                <span className="line-clamp-2 flex-1">{appliedNote}</span>
                <button onClick={() => setAppliedNote('')} className="ml-auto shrink-0 text-blue-400 hover:text-blue-600"><X className="h-3 w-3" /></button>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 h-9 gap-1.5 text-xs font-semibold" aria-label="Print KOT">
                <ChefHat className="h-4 w-4" /> Print KOT
              </Button>
              <Button variant="outline" size="sm" className="h-9 px-3 text-xs font-semibold text-teal-600 border-teal-200 hover:bg-teal-50 dark:hover:bg-teal-950" onClick={handleSave} aria-label="Save order">
                Save
              </Button>
              <Button size="sm" className="flex-1 h-9 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold gap-1.5"
                disabled={cartItems.length === 0}
                onClick={openPayDialog}
                aria-label="Open payment"
              >
                <CreditCard className="h-4 w-4" /> Payment
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Bottom bar — held orders ──────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-t bg-card px-4 py-1.5 shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Held Orders</span>
        <Badge className="rounded-full bg-amber-500 text-white font-bold text-[11px] px-2 py-0.5">{heldCount}</Badge>
        <span className="text-xs text-muted-foreground">orders on hold</span>
        <Button variant="ghost" size="sm" className="ml-auto h-7 gap-1 text-xs text-muted-foreground hover:text-foreground" aria-label="View held orders">
          <ClipboardList className="h-3.5 w-3.5" /> View Held
        </Button>
      </div>

      {/* ════════════════════════════ DIALOGS ════════════════════════════════ */}

      {/* Order-level Discount */}
      <Dialog open={discountOpen} onOpenChange={setDiscountOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Percent className="h-4 w-4 text-primary" /> Apply Discount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <div className="flex rounded-lg border overflow-hidden">
              <button onClick={() => setDiscountType('flat')}
                className={cn('flex-1 py-2 text-xs font-semibold transition-colors', discountType === 'flat' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted')}>
                Flat (Rs.)
              </button>
              <button onClick={() => setDiscountType('percent')}
                className={cn('flex-1 py-2 text-xs font-semibold transition-colors', discountType === 'percent' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted')}>
                Percentage (%)
              </button>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{discountType === 'flat' ? 'Discount Amount (PKR)' : 'Percentage'}</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-muted-foreground font-medium">{discountType === 'flat' ? 'Rs.' : '%'}</span>
                <Input type="number" value={discountInput} onChange={e => setDiscountInput(e.target.value)} placeholder="0" className="pl-10 text-sm" min={0} max={discountType === 'percent' ? 100 : cartSubtotal} autoFocus />
              </div>
              {discountInput && !isNaN(Number(discountInput)) && cartSubtotal > 0 && (
                <p className="text-xs text-muted-foreground">
                  Saves Rs.{' '}{discountType === 'flat'
                    ? Math.min(Number(discountInput), cartSubtotal).toLocaleString()
                    : Math.round(cartSubtotal * Number(discountInput) / 100).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            {orderDiscount > 0 && (
              <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/5"
                onClick={() => { setOrderDiscount(0); setDiscountInput(''); setDiscountApprovedBy(''); setDiscountOpen(false); }}>
                Remove
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setDiscountOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => { const v = Number(discountInput); if (!isNaN(v) && v >= 0) setOrderDiscount(v); setDiscountOpen(false); }}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Note */}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileText className="h-4 w-4 text-blue-600" /> Order Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-1">
            <Label className="text-xs">Special instructions for this order</Label>
            <Textarea value={noteInput} onChange={e => setNoteInput(e.target.value)} placeholder="e.g. Extra spicy, no onions…" rows={4} className="text-sm resize-none" autoFocus />
            <p className="text-[11px] text-muted-foreground">{noteInput.length}/200</p>
          </div>
          <DialogFooter className="gap-2">
            {appliedNote && <Button variant="outline" size="sm" className="text-destructive" onClick={() => { setAppliedNote(''); setNoteInput(''); setNoteOpen(false); }}>Clear</Button>}
            <Button variant="outline" size="sm" onClick={() => setNoteOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setAppliedNote(noteInput.trim()); setNoteOpen(false); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Note */}
      <Dialog open={itemNoteOpen} onOpenChange={setItemNoteOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm">
              <Pencil className="h-4 w-4 text-primary" />
              Item Note
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-1">
            <Label className="text-xs">Note for this item (cooking preference, allergies…)</Label>
            <Textarea value={itemNoteInput} onChange={e => setItemNoteInput(e.target.value)} placeholder="e.g. well done, no chilli…" rows={3} className="text-sm resize-none" autoFocus />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setItemNoteOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => {
                if (itemNoteTarget !== null) {
                  setCartItems(prev => prev.map(ci => ci.menuItem.id === itemNoteTarget ? { ...ci, note: itemNoteInput.trim() } : ci));
                }
                setItemNoteOpen(false);
              }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pick KOT Dialog */}
      <Dialog open={kotOpen} onOpenChange={setKotOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ClipboardList className="h-4 w-4 text-primary" /> Pending KOTs</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground -mt-2">Select a KOT to pull its items into this invoice.</p>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {PENDING_KOTS.map(kot => (
              <div key={kot.id} className="rounded-lg border p-3 hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => pullKOT(kot)}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-foreground">{kot.id}</span>
                  <Badge variant="outline" className="text-[10px] px-1.5">{kot.table}</Badge>
                </div>
                <ul className="space-y-0.5">
                  {kot.items.map((item, i) => (
                    <li key={i} className="flex justify-between text-[11px] text-muted-foreground">
                      <span>{item.name} ×{item.qty}</span>
                      <span>Rs.{(item.price * item.qty).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setKotOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Split Payment Dialog ──────────────────────────────────────────── */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Payment</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-1">
            {/* Total due */}
            <div className="flex items-center justify-between rounded-lg bg-primary/5 border border-primary/20 px-3 py-2">
              <span className="text-sm font-bold text-foreground">Total Due</span>
              <span className="text-xl font-extrabold text-primary tabular-nums">{fmt(grandTotal)}</span>
            </div>

            {/* Payment method inputs — Cash FIRST (Pakistan is cash-dominant) */}
            <div className="space-y-2">
              {[
                { label: 'Cash',          icon: <Receipt className="h-4 w-4 text-green-600" />,  value: payCash,       setter: setPayCash,       primary: true },
                { label: 'Credit',        icon: <UserCheck className="h-4 w-4 text-blue-600" />,  value: payCredit,     setter: setPayCredit,     primary: false },
                { label: 'Credit Card',   icon: <CreditCard className="h-4 w-4 text-purple-600" />, value: payCreditCard, setter: setPayCreditCard, primary: false },
                { label: 'Food Voucher',  icon: <Ticket className="h-4 w-4 text-amber-600" />,   value: payVoucher,    setter: setPayVoucher,    primary: false },
              ].map(({ label, icon, value, setter, primary }) => (
                <div key={label} className={cn('flex items-center gap-3 rounded-lg border px-3 py-2', primary && 'border-green-300 bg-green-50 dark:bg-green-950/20 dark:border-green-800')}>
                  {icon}
                  <span className={cn('text-sm font-semibold w-24 shrink-0', primary && 'text-green-700 dark:text-green-400')}>{label}</span>
                  <Input
                    type="number"
                    value={value}
                    onChange={e => setter(e.target.value)}
                    placeholder="0"
                    className={cn('flex-1 h-8 text-sm tabular-nums font-medium', primary && 'border-green-300 dark:border-green-700')}
                    min={0}
                    autoFocus={primary}
                  />
                </div>
              ))}
            </div>

            <Separator />

            {/* Return cash + total row */}
            <div className="grid grid-cols-2 gap-2">
              <div className={cn('rounded-lg border px-3 py-2 text-center', returnCash > 0 ? 'bg-green-50 border-green-300 dark:bg-green-950/20 dark:border-green-700' : 'bg-muted')}>
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-0.5">Return Cash</p>
                <p className={cn('text-xl font-extrabold tabular-nums', returnCash > 0 ? 'text-green-600' : 'text-muted-foreground')}>{returnCash.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border bg-primary/5 border-primary/20 px-3 py-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-0.5">Total</p>
                <p className="text-xl font-extrabold tabular-nums text-primary">{grandTotal.toLocaleString()}</p>
              </div>
            </div>

            {/* Underpaid warning */}
            {underpaid && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Short by Rs.{(grandTotal - totalPaid).toLocaleString()} — please collect the full amount.
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setPayOpen(false)}>Cancel</Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6"
              disabled={totalPaid < grandTotal}
              onClick={() => setPayOpen(false)}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
