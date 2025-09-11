// Enhanced Inventory Data - Based on INVENTORY MODULE.pdf & Current Binoria System
// Complete implementation of all 14 modules for frontend display

export interface EnhancedInventoryItem {
  // Core Identity (Module 1)
  id: string;
  code: string;
  name: string;
  description?: string;
  barcode?: string;
  qrCode?: string;
  
  // Classification
  category: 'CONSUMABLE' | 'FIXED_ASSET' | 'RAW_MATERIAL' | 'FINISHED_GOODS';
  subCategory: string;
  department: string[];
  tags: string[];
  
  // Location & Storage (Module 6)
  primaryStore: string;
  storageLocation: string; // Zone-Aisle-Rack-Bin
  binLocation: string;
  
  // Quantities & Units
  unit: string;
  currentQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  openingQuantity: number;
  
  // Stock Levels (Module 1)
  minStock: number;
  maxStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  
  // Financial
  unitCost: number;
  avgCost: number;
  lastPurchasePrice: number;
  totalValue: number;
  
  // Lifecycle (Module 7)
  shelfLife?: string;
  expiryDate?: Date;
  batchNumber?: string;
  serialNumbers?: string[];
  
  // Vendor & Procurement (Module 3)
  preferredVendor: string;
  alternateVendors: string[];
  lastPurchaseDate: Date;
  
  // Status & Tracking
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
  condition: 'NEW' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED';
  
  // Metadata
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

export interface Vendor {
  // Module 3 - Complete Vendor Master
  id: string;
  vendorCode: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  categories: string[];
  paymentTerms: 'CASH' | 'BANK_TRANSFER' | 'CREDIT';
  creditDays: number; // Net 15, Net 30
  excessCharges: number; // Late fee %
  contractTerms: string;
  iban: string;
  accountTitle: string;
  branch: string;
  vendorRating: number; // Out of 5
  status: 'PENDING' | 'APPROVED' | 'BLOCKED';
  totalOrders: number;
  onTimeDelivery: number; // Percentage
  createdAt: Date;
}

export interface Department {
  // Module 4 - Department Requisitions
  id: string;
  code: string;
  name: string;
  type: 'RESTAURANT' | 'GENERAL';
  parentDept?: string;
  isActive: boolean;
}

export interface PurchaseOrder {
  // Module 2 - Purchase & Approval Workflow
  id: string;
  poNumber: string;
  vendorId: string;
  orderDate: Date;
  expectedDelivery: Date;
  status: 'DRAFT' | 'PENDING_L1' | 'PENDING_L2' | 'PENDING_L3' | 'APPROVED' | 'REJECTED';
  totalAmount: number;
  approvalLevel: number;
  createdBy: string;
  approvedBy?: string;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Realistic Jamia Binoria Aalamia inventory data (from current system images)
export const enhancedInventory: EnhancedInventoryItem[] = [
  {
    id: 'INV-CROCKERY-001',
    code: 'CONCROCKERY-0004/0009',
    name: 'LASSI GLASS',
    description: 'Traditional glass for lassi serving - 300ml capacity',
    category: 'CONSUMABLE',
    subCategory: 'CROCKERY ITEMS',
    department: ['BEVERAGES', 'RESTAURANT'],
    tags: ['glass', 'serving', 'beverages', 'traditional'],
    primaryStore: 'JAMIA STORE',
    storageLocation: 'A1-R2-B5',
    binLocation: 'CROCKERY-SECTION-A',
    unit: 'NO',
    currentQuantity: 21,
    reservedQuantity: 5,
    availableQuantity: 16,
    openingQuantity: 25,
    minStock: 10,
    maxStock: 50,
    reorderLevel: 15,
    reorderQuantity: 30,
    unitCost: 139.00,
    avgCost: 135.50,
    lastPurchasePrice: 142.00,
    totalValue: 2919.00,
    shelfLife: 'N/A',
    preferredVendor: 'Metro Cash & Carry',
    alternateVendors: ['Al-Fatah Suppliers', 'Local Market'],
    lastPurchaseDate: new Date('2024-12-15'),
    status: 'ACTIVE',
    condition: 'GOOD',
    isActive: true,
    createdBy: 'USR-STOREKEEPER-001',
    createdAt: new Date('2024-01-01'),
    updatedBy: 'USR-STOREKEEPER-001',
    updatedAt: new Date('2024-12-20')
  },
  {
    id: 'INV-HYGIENE-001',
    code: 'CONHYG-0003/0009',
    name: 'SHAMPOO (PHYSOL)',
    description: 'Premium quality shampoo for guest accommodation - 500ml bottle',
    category: 'CONSUMABLE',
    subCategory: 'HYGIENE ITEMS',
    department: ['ACCOMMODATION', 'MAINTENANCE'],
    tags: ['hygiene', 'guest-supplies', 'accommodation', 'premium'],
    primaryStore: 'JAMIA STORE',
    storageLocation: 'B2-R1-B3',
    binLocation: 'HYGIENE-SECTION-B',
    unit: 'PCS',
    currentQuantity: 5,
    reservedQuantity: 2,
    availableQuantity: 3,
    openingQuantity: 8,
    minStock: 3,
    maxStock: 20,
    reorderLevel: 5,
    reorderQuantity: 15,
    unitCost: 948.71,
    avgCost: 950.00,
    lastPurchasePrice: 965.00,
    totalValue: 4743.55,
    shelfLife: '2 years',
    expiryDate: new Date('2025-12-31'),
    batchNumber: 'PHYSOL-2024-001',
    preferredVendor: 'Physol Industries',
    alternateVendors: ['Hygiene Suppliers Ltd'],
    lastPurchaseDate: new Date('2024-11-20'),
    status: 'ACTIVE',
    condition: 'NEW',
    isActive: true,
    createdBy: 'USR-STOREKEEPER-001',
    createdAt: new Date('2024-01-01'),
    updatedBy: 'USR-STOREKEEPER-001',
    updatedAt: new Date('2024-12-18')
  },
  {
    id: 'INV-ELECTRICAL-001',
    code: 'CONOTH-0006/1717',
    name: 'DOUBLE LIGHT PLUG',
    description: 'High quality electrical double plug for mosque and classroom lighting',
    category: 'CONSUMABLE',
    subCategory: 'ELECTRICAL ITEMS',
    department: ['MAINTENANCE', 'CONSTRUCTION'],
    tags: ['electrical', 'lighting', 'maintenance', 'mosque'],
    primaryStore: 'JAMIA STORE',
    storageLocation: 'C1-R3-B2',
    binLocation: 'ELECTRICAL-SECTION-C',
    unit: 'NO',
    currentQuantity: 14,
    reservedQuantity: 2,
    availableQuantity: 12,
    openingQuantity: 20,
    minStock: 5,
    maxStock: 30,
    reorderLevel: 8,
    reorderQuantity: 20,
    unitCost: 950.00,
    avgCost: 945.00,
    lastPurchasePrice: 975.00,
    totalValue: 13300.00,
    shelfLife: 'N/A',
    preferredVendor: 'Karachi Electric Suppliers',
    alternateVendors: ['Electric World', 'Power Solutions'],
    lastPurchaseDate: new Date('2024-10-15'),
    status: 'ACTIVE',
    condition: 'NEW',
    isActive: true,
    createdBy: 'USR-MAINTENANCE-001',
    createdAt: new Date('2024-01-01'),
    updatedBy: 'USR-MAINTENANCE-001',
    updatedAt: new Date('2024-12-10')
  },
  {
    id: 'INV-HYGIENE-002',
    code: 'CONHYG-0003/0102',
    name: 'LIQUID SOAP MAX',
    description: 'High-quality liquid soap for washrooms and guest facilities',
    category: 'CONSUMABLE',
    subCategory: 'HYGIENE ITEMS',
    department: ['JANITORIAL', 'ACCOMMODATION'],
    tags: ['hygiene', 'soap', 'washroom', 'guest-facilities'],
    primaryStore: 'JAMIA STORE',
    storageLocation: 'B2-R1-B4',
    binLocation: 'HYGIENE-SECTION-B',
    unit: 'BTL',
    currentQuantity: 1,
    reservedQuantity: 0,
    availableQuantity: 1,
    openingQuantity: 3,
    minStock: 2,
    maxStock: 15,
    reorderLevel: 3,
    reorderQuantity: 12,
    unitCost: 250.00,
    avgCost: 248.00,
    lastPurchasePrice: 255.00,
    totalValue: 250.00,
    shelfLife: '1 year',
    expiryDate: new Date('2025-11-30'),
    batchNumber: 'SOAP-2024-002',
    preferredVendor: 'Local Supplier',
    alternateVendors: ['Hygiene Plus', 'Clean Solutions'],
    lastPurchaseDate: new Date('2024-12-01'),
    status: 'ACTIVE',
    condition: 'NEW',
    isActive: true,
    createdBy: 'USR-JANITOR-001',
    createdAt: new Date('2024-01-01'),
    updatedBy: 'USR-JANITOR-001',
    updatedAt: new Date('2024-12-15')
  },
  {
    id: 'INV-ELECTRICAL-002',
    code: 'CONOTH-0006/0342',
    name: 'LED LIGHT (5W)',
    description: 'Energy-efficient 5W LED light for classrooms and corridors',
    category: 'CONSUMABLE',
    subCategory: 'ELECTRICAL ITEMS',
    department: ['MAINTENANCE', 'MADRASA'],
    tags: ['led', 'lighting', 'energy-efficient', 'classroom'],
    primaryStore: 'JAMIA STORE',
    storageLocation: 'C1-R3-B1',
    binLocation: 'ELECTRICAL-SECTION-C',
    unit: 'NO',
    currentQuantity: 5,
    reservedQuantity: 1,
    availableQuantity: 4,
    openingQuantity: 10,
    minStock: 3,
    maxStock: 25,
    reorderLevel: 6,
    reorderQuantity: 20,
    unitCost: 950.00,
    avgCost: 948.00,
    lastPurchasePrice: 965.00,
    totalValue: 4750.00,
    shelfLife: 'N/A',
    preferredVendor: 'Karachi Electric Suppliers',
    alternateVendors: ['LED World', 'Bright Solutions'],
    lastPurchaseDate: new Date('2024-11-10'),
    status: 'ACTIVE',
    condition: 'NEW',
    isActive: true,
    createdBy: 'USR-ELECTRICIAN-001',
    createdAt: new Date('2024-01-01'),
    updatedBy: 'USR-ELECTRICIAN-001',
    updatedAt: new Date('2024-12-05')
  },
  {
    id: 'INV-CONSTRUCTION-001',
    code: 'CONSTA-2644',
    name: 'MIRROR',
    description: 'High-quality mirror for washrooms and accommodation facilities',
    category: 'CONSUMABLE',
    subCategory: 'CONSTRUCTION MATERIAL',
    department: ['CONSTRUCTION', 'ACCOMMODATION'],
    tags: ['mirror', 'washroom', 'construction', 'facilities'],
    primaryStore: 'JAMIA STORE',
    storageLocation: 'D1-R1-B1',
    binLocation: 'CONSTRUCTION-SECTION-D',
    unit: 'NO',
    currentQuantity: 12,
    reservedQuantity: 0,
    availableQuantity: 12,
    openingQuantity: 15,
    minStock: 5,
    maxStock: 25,
    reorderLevel: 8,
    reorderQuantity: 15,
    unitCost: 1000.00,
    avgCost: 995.00,
    lastPurchasePrice: 1025.00,
    totalValue: 12000.00,
    shelfLife: 'N/A',
    preferredVendor: 'Construction Suppliers',
    alternateVendors: ['Glass Works', 'Building Materials Co'],
    lastPurchaseDate: new Date('2024-09-15'),
    status: 'ACTIVE',
    condition: 'GOOD',
    isActive: true,
    createdBy: 'USR-CONSTRUCTOR-001',
    createdAt: new Date('2024-01-01'),
    updatedBy: 'USR-CONSTRUCTOR-001',
    updatedAt: new Date('2024-11-30')
  },
  {
    id: 'INV-HYGIENE-003',
    code: 'CONHYG-0003/0115',
    name: 'HYPER (SMALL)',
    description: 'Small hyper cleaning solution for general cleaning purposes',
    category: 'CONSUMABLE',
    subCategory: 'HYGIENE ITEMS',
    department: ['JANITORIAL', 'MAINTENANCE'],
    tags: ['cleaning', 'solution', 'janitorial', 'small-size'],
    primaryStore: 'JAMIA STORE',
    storageLocation: 'B2-R2-B1',
    binLocation: 'CLEANING-SOLUTIONS',
    unit: 'NO',
    currentQuantity: 15,
    reservedQuantity: 3,
    availableQuantity: 12,
    openingQuantity: 20,
    minStock: 8,
    maxStock: 35,
    reorderLevel: 10,
    reorderQuantity: 25,
    unitCost: 80.00,
    avgCost: 82.00,
    lastPurchasePrice: 85.00,
    totalValue: 1200.00,
    shelfLife: '18 months',
    expiryDate: new Date('2025-06-30'),
    batchNumber: 'HYPER-2024-001',
    preferredVendor: 'Cleaning Supplies Ltd',
    alternateVendors: ['Hyper Solutions', 'Clean Max'],
    lastPurchaseDate: new Date('2024-10-20'),
    status: 'ACTIVE',
    condition: 'NEW',
    isActive: true,
    createdBy: 'USR-JANITOR-002',
    createdAt: new Date('2024-01-01'),
    updatedBy: 'USR-JANITOR-002',
    updatedAt: new Date('2024-12-01')
  }
];

// Enhanced vendor data with complete Module 3 requirements
export const vendors: Vendor[] = [
  {
    id: 'VEN-001',
    vendorCode: 'METRO-001',
    companyName: 'Metro Cash & Carry',
    contactPerson: 'Ahmed Khan',
    phone: '+92-21-35301234',
    email: 'ahmed.khan@metro.pk',
    address: 'Gulshan-e-Iqbal, Karachi, Sindh, Pakistan',
    categories: ['CROCKERY ITEMS', 'HYGIENE ITEMS', 'FOOD ITEMS'],
    paymentTerms: 'CREDIT',
    creditDays: 30,
    excessCharges: 2.5,
    contractTerms: 'Standard corporate supply agreement with volume discounts',
    iban: 'PK36MEZN0005410123456709',
    accountTitle: 'Metro Cash & Carry Pakistan Limited',
    branch: 'Gulshan-e-Iqbal Branch',
    vendorRating: 4.5,
    status: 'APPROVED',
    totalOrders: 125,
    onTimeDelivery: 95,
    createdAt: new Date('2023-06-01')
  },
  {
    id: 'VEN-002',
    vendorCode: 'PHYSOL-001',
    companyName: 'Physol Industries',
    contactPerson: 'Muhammad Tariq',
    phone: '+92-42-35876543',
    email: 'tariq@physol.com',
    address: 'Industrial Area, Lahore, Punjab, Pakistan',
    categories: ['HYGIENE ITEMS', 'CLEANING SUPPLIES'],
    paymentTerms: 'CREDIT',
    creditDays: 15,
    excessCharges: 3.0,
    contractTerms: 'Premium hygiene products supplier with quality guarantee',
    iban: 'PK24ABNA0012340001234567',
    accountTitle: 'Physol Industries (Pvt) Limited',
    branch: 'Johar Town Branch Lahore',
    vendorRating: 4.8,
    status: 'APPROVED',
    totalOrders: 89,
    onTimeDelivery: 98,
    createdAt: new Date('2023-08-15')
  },
  {
    id: 'VEN-003',
    vendorCode: 'ELECT-001',
    companyName: 'Karachi Electric Suppliers',
    contactPerson: 'Ali Hassan',
    phone: '+92-21-34567890',
    email: 'ali@kes.com.pk',
    address: 'Saddar, Karachi, Sindh, Pakistan',
    categories: ['ELECTRICAL ITEMS', 'CONSTRUCTION MATERIAL'],
    paymentTerms: 'CASH',
    creditDays: 0,
    excessCharges: 0,
    contractTerms: 'Cash purchases only with immediate delivery',
    iban: 'PK86HABB0025410987654321',
    accountTitle: 'Karachi Electric Suppliers',
    branch: 'Saddar Branch',
    vendorRating: 4.2,
    status: 'APPROVED',
    totalOrders: 156,
    onTimeDelivery: 87,
    createdAt: new Date('2023-09-10')
  },
  {
    id: 'VEN-004',
    vendorCode: 'LOCAL-001',
    companyName: 'Local Sabzi Mandi',
    contactPerson: 'Usman Ahmed',
    phone: '+92-21-32145678',
    email: 'usman@localmandi.pk',
    address: 'New Sabzi Mandi, Karachi, Sindh, Pakistan',
    categories: ['FRESH PRODUCE', 'VEGETABLES', 'FRUITS'],
    paymentTerms: 'CASH',
    creditDays: 0,
    excessCharges: 0,
    contractTerms: 'Daily fresh supply with cash payment',
    iban: 'PK12STAN0041000005678901',
    accountTitle: 'Local Sabzi Mandi',
    branch: 'New Mandi Branch',
    vendorRating: 3.8,
    status: 'APPROVED',
    totalOrders: 234,
    onTimeDelivery: 75,
    createdAt: new Date('2023-04-20')
  },
  {
    id: 'VEN-005',
    vendorCode: 'ALFATAH-001',
    companyName: 'Al-Fatah Meats',
    contactPerson: 'Khalid Malik',
    phone: '+92-21-34912345',
    email: 'khalid@alfatahmeats.com',
    address: 'Nazimabad, Karachi, Sindh, Pakistan',
    categories: ['MEAT PRODUCTS', 'FROZEN ITEMS', 'POULTRY'],
    paymentTerms: 'CREDIT',
    creditDays: 7,
    excessCharges: 1.5,
    contractTerms: 'Fresh meat supply with weekly credit terms',
    iban: 'PK45HBL0983204000012345',
    accountTitle: 'Al-Fatah Meat Products',
    branch: 'Nazimabad Branch',
    vendorRating: 4.6,
    status: 'APPROVED',
    totalOrders: 67,
    onTimeDelivery: 92,
    createdAt: new Date('2023-07-01')
  }
];

// Department data per Module 4
export const departments: Department[] = [
  // Restaurant Departments (Module 4)
  { id: 'DEPT-REST-001', code: 'CONTINENTAL', name: 'Continental Kitchen', type: 'RESTAURANT', isActive: true },
  { id: 'DEPT-REST-002', code: 'CHINESE', name: 'Chinese Kitchen', type: 'RESTAURANT', isActive: true },
  { id: 'DEPT-REST-003', code: 'BBQ', name: 'BBQ Section', type: 'RESTAURANT', isActive: true },
  { id: 'DEPT-REST-004', code: 'TANDOOR', name: 'Tandoor Section', type: 'RESTAURANT', isActive: true },
  { id: 'DEPT-REST-005', code: 'BEVERAGES', name: 'Beverages Section', type: 'RESTAURANT', isActive: true },
  { id: 'DEPT-REST-006', code: 'DESSERT', name: 'Dessert Section', type: 'RESTAURANT', isActive: true },
  
  // General Organization Departments (Module 4)
  { id: 'DEPT-GEN-001', code: 'EDUCATION', name: 'Education Department', type: 'GENERAL', isActive: true },
  { id: 'DEPT-GEN-002', code: 'ADMIN', name: 'Administration', type: 'GENERAL', isActive: true },
  { id: 'DEPT-GEN-003', code: 'CONSTRUCTION', name: 'Construction Department', type: 'GENERAL', isActive: true },
  { id: 'DEPT-GEN-004', code: 'KITCHEN', name: 'Main Kitchen', type: 'GENERAL', isActive: true },
  { id: 'DEPT-GEN-005', code: 'SECURITY', name: 'Security Department', type: 'GENERAL', isActive: true },
  { id: 'DEPT-GEN-006', code: 'MAINTENANCE', name: 'Maintenance Department', type: 'GENERAL', isActive: true },
  { id: 'DEPT-GEN-007', code: 'JANITORIAL', name: 'Janitorial Services', type: 'GENERAL', isActive: true }
];

// Sample Purchase Orders for Module 2
export const samplePurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-001',
    poNumber: 'PO-2025-001',
    vendorId: 'VEN-001',
    orderDate: new Date('2025-01-15'),
    expectedDelivery: new Date('2025-01-22'),
    status: 'PENDING_L2',
    totalAmount: 45000,
    approvalLevel: 2,
    createdBy: 'USR-PURCHASER-001',
    items: [
      { itemId: 'INV-ELECTRICAL-001', itemName: 'DOUBLE LIGHT PLUG', quantity: 20, unitPrice: 950, totalPrice: 19000 },
      { itemId: 'INV-ELECTRICAL-002', itemName: 'LED LIGHT (5W)', quantity: 15, unitPrice: 950, totalPrice: 14250 }
    ]
  },
  {
    id: 'PO-002',
    poNumber: 'PO-2025-002',
    vendorId: 'VEN-002',
    orderDate: new Date('2025-01-16'),
    expectedDelivery: new Date('2025-01-23'),
    status: 'PENDING_L1',
    totalAmount: 12500,
    approvalLevel: 1,
    createdBy: 'USR-PURCHASER-002',
    items: [
      { itemId: 'INV-HYGIENE-001', itemName: 'SHAMPOO (PHYSOL)', quantity: 10, unitPrice: 948.71, totalPrice: 9487.10 },
      { itemId: 'INV-HYGIENE-002', itemName: 'LIQUID SOAP MAX', quantity: 12, unitPrice: 250, totalPrice: 3000 }
    ]
  }
];

// Chart data for enhanced dashboard
export const inventoryByCategory = [
  { name: 'Consumables', value: 185000, percentage: 72, color: '#14B8A6' },
  { name: 'Fixed Assets', value: 45000, percentage: 18, color: '#3B82F6' },
  { name: 'Raw Materials', value: 15000, percentage: 6, color: '#8B5CF6' },
  { name: 'Finished Goods', value: 10000, percentage: 4, color: '#F59E0B' }
];

export const stockStatusData = [
  { name: 'In Stock', value: 850, color: '#10B981' },
  { name: 'Low Stock', value: 23, color: '#F59E0B' },
  { name: 'Out of Stock', value: 8, color: '#EF4444' },
  { name: 'Excess Stock', value: 12, color: '#8B5CF6' }
];

export const topItemsByValue = enhancedInventory
  .sort((a, b) => b.totalValue - a.totalValue)
  .slice(0, 6)
  .map(item => ({
    name: item.name,
    value: item.totalValue,
    category: item.subCategory
  }));

export const vendorPerformance = vendors.map(v => ({
  name: v.companyName,
  rating: v.vendorRating,
  orders: v.totalOrders,
  onTime: v.onTimeDelivery,
  onTimePercentage: v.onTimeDelivery, // For chart visualization
  totalOrders: v.totalOrders,
  totalValue: v.totalOrders * 25000 + (Math.random() * 50000) // Estimated value based on orders
}));

// Luxury Procurement Spending Trends Data
export const procurementSpendingTrends = [
  { 
    month: 'Jun', 
    consumables: 185000, 
    fixedAssets: 325000, 
    rawMaterials: 145000,
    totalSpending: 655000,
    budget: 700000,
    variance: 45000,
    approvalTime: 3.2,
    emergencyOrders: 8
  },
  { 
    month: 'Jul', 
    consumables: 220000, 
    fixedAssets: 180000, 
    rawMaterials: 210000,
    totalSpending: 610000,
    budget: 650000,
    variance: 40000,
    approvalTime: 2.8,
    emergencyOrders: 5
  },
  { 
    month: 'Aug', 
    consumables: 195000, 
    fixedAssets: 450000, 
    rawMaterials: 175000,
    totalSpending: 820000,
    budget: 750000,
    variance: -70000,
    approvalTime: 4.1,
    emergencyOrders: 12
  },
  { 
    month: 'Sep', 
    consumables: 245000, 
    fixedAssets: 280000, 
    rawMaterials: 190000,
    totalSpending: 715000,
    budget: 700000,
    variance: -15000,
    approvalTime: 3.5,
    emergencyOrders: 7
  },
  { 
    month: 'Oct', 
    consumables: 210000, 
    fixedAssets: 320000, 
    rawMaterials: 165000,
    totalSpending: 695000,
    budget: 725000,
    variance: 30000,
    approvalTime: 2.9,
    emergencyOrders: 4
  },
  { 
    month: 'Nov', 
    consumables: 235000, 
    fixedAssets: 395000, 
    rawMaterials: 185000,
    totalSpending: 815000,
    budget: 800000,
    variance: -15000,
    approvalTime: 3.3,
    emergencyOrders: 6
  }
];

// Color arrays for charts
export const COLORS = ['#14B8A6', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981'];
export const STATUS_COLORS = { 
  'In Stock': '#10B981', 
  'Low Stock': '#F59E0B', 
  'Out of Stock': '#EF4444',
  'Excess Stock': '#8B5CF6'
};

// Helper functions
export const getStockStatus = (item: EnhancedInventoryItem): { 
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Excess Stock', 
  variant: 'default' | 'secondary' | 'destructive' | 'outline' 
} => {
  if (item.currentQuantity <= 0) return { status: 'Out of Stock', variant: 'destructive' };
  if (item.currentQuantity <= item.reorderLevel) return { status: 'Low Stock', variant: 'secondary' };
  if (item.currentQuantity >= item.maxStock) return { status: 'Excess Stock', variant: 'outline' };
  return { status: 'In Stock', variant: 'default' };
};

export const calculateInventorySummary = () => {
  const totalValue = enhancedInventory.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = enhancedInventory.filter(item => item.currentQuantity <= item.reorderLevel).length;
  const outOfStockItems = enhancedInventory.filter(item => item.currentQuantity === 0).length;
  const totalItems = enhancedInventory.length;
  const activeVendors = vendors.filter(v => v.status === 'APPROVED').length;
  
  return {
    totalValue,
    lowStockItems,
    outOfStockItems,
    totalItems,
    activeVendors,
    pendingApprovals: samplePurchaseOrders.filter(po => po.status.includes('PENDING')).length,
    monthlyPurchases: 1250000 // Sample data
  };
};

export default {
  enhancedInventory,
  vendors,
  departments,
  samplePurchaseOrders,
  inventoryByCategory,
  stockStatusData,
  topItemsByValue,
  vendorPerformance,
  procurementSpendingTrends,
  COLORS,
  STATUS_COLORS,
  getStockStatus,
  calculateInventorySummary
};