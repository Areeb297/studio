// Enhanced Inventory Data — Based on real ERP_New SQL Server data (March 2026)
// Aligned with dashboard-mock-data.ts for consistent numbers across dashboards

export interface EnhancedInventoryItem {
  id: string;
  code: string;
  name: string;
  description?: string;
  barcode?: string;
  qrCode?: string;
  category: 'CONSUMABLE' | 'FIXED_ASSET' | 'RAW_MATERIAL' | 'FINISHED_GOODS';
  subCategory: string;
  department: string[];
  tags: string[];
  primaryStore: string;
  storageLocation: string;
  binLocation: string;
  unit: string;
  currentQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  openingQuantity: number;
  minStock: number;
  maxStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  unitCost: number;
  avgCost: number;
  lastPurchasePrice: number;
  totalValue: number;
  shelfLife?: string;
  expiryDate?: Date;
  batchNumber?: string;
  serialNumbers?: string[];
  preferredVendor: string;
  alternateVendors: string[];
  lastPurchaseDate: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
  condition: 'NEW' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED';
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}

export interface Vendor {
  id: string;
  vendorCode: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  categories: string[];
  paymentTerms: 'CASH' | 'BANK_TRANSFER' | 'CREDIT';
  creditDays: number;
  excessCharges: number;
  contractTerms: string;
  iban: string;
  accountTitle: string;
  branch: string;
  vendorRating: number;
  status: 'PENDING' | 'APPROVED' | 'BLOCKED';
  totalOrders: number;
  onTimeDelivery: number;
  createdAt: Date;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  type: 'RESTAURANT' | 'GENERAL';
  parentDept?: string;
  isActive: boolean;
}

export interface PurchaseOrder {
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

// ── Inventory items (representative sample with real item names from ERP_New) ─
export const enhancedInventory: EnhancedInventoryItem[] = [
  {
    id: 'INV-001',
    code: 'RAW-MEAT-0001',
    name: 'GOAT BAKRA A',
    description: 'Whole goat (Grade A) for kitchen operations',
    category: 'RAW_MATERIAL',
    subCategory: 'MEAT & POULTRY',
    department: ['DESI KITCHEN', 'BBQ KITCHEN'],
    tags: ['meat', 'goat', 'grade-a'],
    primaryStore: 'COLD STORE',
    storageLocation: 'CS-R1-B1',
    binLocation: 'MEAT-SECTION',
    unit: 'KG',
    currentQuantity: 85,
    reservedQuantity: 20,
    availableQuantity: 65,
    openingQuantity: 100,
    minStock: 30,
    maxStock: 150,
    reorderLevel: 50,
    reorderQuantity: 80,
    unitCost: 1800,
    avgCost: 1750,
    lastPurchasePrice: 1850,
    totalValue: 153000,
    preferredVendor: 'ALI',
    alternateVendors: ['LOCAL SUPPLIER'],
    lastPurchaseDate: new Date('2026-03-02'),
    status: 'ACTIVE',
    condition: 'NEW',
    isActive: true,
    createdBy: 'storekeeper@rahah24.com',
    createdAt: new Date('2025-01-01'),
    updatedBy: 'storekeeper@rahah24.com',
    updatedAt: new Date('2026-03-02'),
  },
  {
    id: 'INV-002',
    code: 'RAW-MEAT-0002',
    name: 'KALEJI (LIVER)',
    description: 'Fresh liver for kitchen preparations',
    category: 'RAW_MATERIAL',
    subCategory: 'MEAT & POULTRY',
    department: ['DESI KITCHEN'],
    tags: ['meat', 'liver', 'offal'],
    primaryStore: 'COLD STORE',
    storageLocation: 'CS-R1-B2',
    binLocation: 'MEAT-SECTION',
    unit: 'KG',
    currentQuantity: 25,
    reservedQuantity: 5,
    availableQuantity: 20,
    openingQuantity: 40,
    minStock: 10,
    maxStock: 60,
    reorderLevel: 15,
    reorderQuantity: 30,
    unitCost: 1200,
    avgCost: 1180,
    lastPurchasePrice: 1250,
    totalValue: 30000,
    preferredVendor: 'ALI',
    alternateVendors: ['SALEEM BHAI'],
    lastPurchaseDate: new Date('2026-03-01'),
    status: 'ACTIVE',
    condition: 'NEW',
    isActive: true,
    createdBy: 'storekeeper@rahah24.com',
    createdAt: new Date('2025-01-01'),
    updatedBy: 'storekeeper@rahah24.com',
    updatedAt: new Date('2026-03-01'),
  },
  {
    id: 'INV-003',
    code: 'RAW-CHKN-0001',
    name: 'CHICKEN WHOLE',
    description: 'Whole dressed chicken for multiple kitchens',
    category: 'RAW_MATERIAL',
    subCategory: 'MEAT & POULTRY',
    department: ['CHINESE KITCHEN', 'DESI KITCHEN', 'BBQ KITCHEN'],
    tags: ['chicken', 'poultry', 'whole'],
    primaryStore: 'COLD STORE',
    storageLocation: 'CS-R2-B1',
    binLocation: 'POULTRY-SECTION',
    unit: 'KG',
    currentQuantity: 120,
    reservedQuantity: 40,
    availableQuantity: 80,
    openingQuantity: 150,
    minStock: 50,
    maxStock: 200,
    reorderLevel: 70,
    reorderQuantity: 100,
    unitCost: 480,
    avgCost: 470,
    lastPurchasePrice: 490,
    totalValue: 57600,
    preferredVendor: 'CHICKEN SUPPLIER',
    alternateVendors: ['LOCAL SUPPLIER'],
    lastPurchaseDate: new Date('2026-03-03'),
    status: 'ACTIVE',
    condition: 'NEW',
    isActive: true,
    createdBy: 'storekeeper@rahah24.com',
    createdAt: new Date('2025-01-01'),
    updatedBy: 'storekeeper@rahah24.com',
    updatedAt: new Date('2026-03-03'),
  },
  {
    id: 'INV-004',
    code: 'CON-OIL-0001',
    name: 'COOKING OIL (5L)',
    description: 'Cooking oil 5-litre cans for all kitchens',
    category: 'CONSUMABLE',
    subCategory: 'COOKING ESSENTIALS',
    department: ['DESI KITCHEN', 'CHINESE KITCHEN', 'BBQ KITCHEN'],
    tags: ['oil', 'cooking', 'essential'],
    primaryStore: 'DRY STORE',
    storageLocation: 'DS-R1-B1',
    binLocation: 'OIL-SECTION',
    unit: 'CAN',
    currentQuantity: 45,
    reservedQuantity: 10,
    availableQuantity: 35,
    openingQuantity: 60,
    minStock: 15,
    maxStock: 80,
    reorderLevel: 25,
    reorderQuantity: 40,
    unitCost: 3200,
    avgCost: 3150,
    lastPurchasePrice: 3250,
    totalValue: 144000,
    preferredVendor: 'LOCAL SUPPLIER',
    alternateVendors: ['Al-Madina'],
    lastPurchaseDate: new Date('2026-02-28'),
    status: 'ACTIVE',
    condition: 'NEW',
    isActive: true,
    createdBy: 'storekeeper@rahah24.com',
    createdAt: new Date('2025-01-01'),
    updatedBy: 'storekeeper@rahah24.com',
    updatedAt: new Date('2026-02-28'),
  },
  {
    id: 'INV-005',
    code: 'CON-RICE-0001',
    name: 'BASMATI RICE (25KG)',
    description: 'Premium basmati rice 25kg bags',
    category: 'CONSUMABLE',
    subCategory: 'GRAINS & PULSES',
    department: ['DESI KITCHEN'],
    tags: ['rice', 'basmati', 'grain'],
    primaryStore: 'DRY STORE',
    storageLocation: 'DS-R2-B1',
    binLocation: 'GRAIN-SECTION',
    unit: 'BAG',
    currentQuantity: 30,
    reservedQuantity: 5,
    availableQuantity: 25,
    openingQuantity: 40,
    minStock: 10,
    maxStock: 50,
    reorderLevel: 15,
    reorderQuantity: 25,
    unitCost: 4500,
    avgCost: 4400,
    lastPurchasePrice: 4600,
    totalValue: 135000,
    preferredVendor: 'Al-Madina',
    alternateVendors: ['LOCAL SUPPLIER'],
    lastPurchaseDate: new Date('2026-02-25'),
    status: 'ACTIVE',
    condition: 'NEW',
    isActive: true,
    createdBy: 'storekeeper@rahah24.com',
    createdAt: new Date('2025-01-01'),
    updatedBy: 'storekeeper@rahah24.com',
    updatedAt: new Date('2026-02-25'),
  },
  {
    id: 'INV-006',
    code: 'CON-FLOUR-0001',
    name: 'ATTA FLOUR (10KG)',
    description: 'Wheat flour 10kg bags for chapati and naan',
    category: 'CONSUMABLE',
    subCategory: 'GRAINS & PULSES',
    department: ['DESI KITCHEN'],
    tags: ['flour', 'wheat', 'atta'],
    primaryStore: 'DRY STORE',
    storageLocation: 'DS-R2-B2',
    binLocation: 'GRAIN-SECTION',
    unit: 'BAG',
    currentQuantity: 55,
    reservedQuantity: 10,
    availableQuantity: 45,
    openingQuantity: 70,
    minStock: 20,
    maxStock: 100,
    reorderLevel: 30,
    reorderQuantity: 40,
    unitCost: 1200,
    avgCost: 1180,
    lastPurchasePrice: 1220,
    totalValue: 66000,
    preferredVendor: 'LOCAL SUPPLIER',
    alternateVendors: ['Al-Madina'],
    lastPurchaseDate: new Date('2026-02-27'),
    status: 'ACTIVE',
    condition: 'NEW',
    isActive: true,
    createdBy: 'storekeeper@rahah24.com',
    createdAt: new Date('2025-01-01'),
    updatedBy: 'storekeeper@rahah24.com',
    updatedAt: new Date('2026-02-27'),
  },
  {
    id: 'INV-007',
    code: 'CON-SPICE-0001',
    name: 'RED CHILLI POWDER',
    description: 'Premium red chilli powder for cooking',
    category: 'CONSUMABLE',
    subCategory: 'SPICES & CONDIMENTS',
    department: ['DESI KITCHEN', 'CHINESE KITCHEN', 'BBQ KITCHEN'],
    tags: ['spice', 'chilli', 'powder'],
    primaryStore: 'DRY STORE',
    storageLocation: 'DS-R3-B1',
    binLocation: 'SPICE-SECTION',
    unit: 'KG',
    currentQuantity: 8,
    reservedQuantity: 2,
    availableQuantity: 6,
    openingQuantity: 15,
    minStock: 5,
    maxStock: 25,
    reorderLevel: 8,
    reorderQuantity: 15,
    unitCost: 850,
    avgCost: 830,
    lastPurchasePrice: 870,
    totalValue: 6800,
    preferredVendor: 'SALEEM BHAI',
    alternateVendors: ['LOCAL SUPPLIER'],
    lastPurchaseDate: new Date('2026-02-20'),
    status: 'ACTIVE',
    condition: 'NEW',
    isActive: true,
    createdBy: 'storekeeper@rahah24.com',
    createdAt: new Date('2025-01-01'),
    updatedBy: 'storekeeper@rahah24.com',
    updatedAt: new Date('2026-02-20'),
  },
];

// ── 5 Real Suppliers from ERP_New ───────────────────────────────────────────
export const vendors: Vendor[] = [
  {
    id: 'VEN-001',
    vendorCode: 'LOCAL-001',
    companyName: 'LOCAL SUPPLIER',
    contactPerson: 'Usman Ahmed',
    phone: '+92-21-32145678',
    email: 'usman@localsupplier.pk',
    address: 'Saddar, Karachi, Sindh, Pakistan',
    categories: ['COOKING ESSENTIALS', 'GRAINS & PULSES', 'GENERAL'],
    paymentTerms: 'CASH',
    creditDays: 0,
    excessCharges: 0,
    contractTerms: 'Cash purchases with immediate delivery',
    iban: 'PK36MEZN0005410123456709',
    accountTitle: 'Local Supplier',
    branch: 'Saddar Branch',
    vendorRating: 4.2,
    status: 'APPROVED',
    totalOrders: 12,
    onTimeDelivery: 92,
    createdAt: new Date('2025-06-01'),
  },
  {
    id: 'VEN-002',
    vendorCode: 'SALEEM-001',
    companyName: 'SALEEM BHAI',
    contactPerson: 'Saleem Khan',
    phone: '+92-21-34567890',
    email: 'saleem@saleembhai.pk',
    address: 'New Sabzi Mandi, Karachi, Sindh, Pakistan',
    categories: ['SPICES & CONDIMENTS', 'VEGETABLES', 'GENERAL'],
    paymentTerms: 'CASH',
    creditDays: 0,
    excessCharges: 0,
    contractTerms: 'Daily fresh supply with cash payment',
    iban: 'PK24ABNA0012340001234567',
    accountTitle: 'Saleem Bhai Traders',
    branch: 'Mandi Branch',
    vendorRating: 4.0,
    status: 'APPROVED',
    totalOrders: 8,
    onTimeDelivery: 88,
    createdAt: new Date('2025-08-15'),
  },
  {
    id: 'VEN-003',
    vendorCode: 'CHKN-001',
    companyName: 'CHICKEN SUPPLIER',
    contactPerson: 'Rashid Ali',
    phone: '+92-21-35876543',
    email: 'rashid@chickensupplier.pk',
    address: 'Super Highway, Karachi, Sindh, Pakistan',
    categories: ['MEAT & POULTRY', 'FROZEN ITEMS'],
    paymentTerms: 'CREDIT',
    creditDays: 7,
    excessCharges: 1.5,
    contractTerms: 'Weekly credit terms for fresh poultry',
    iban: 'PK86HABB0025410987654321',
    accountTitle: 'Chicken Supplier (Pvt) Ltd',
    branch: 'Super Highway Branch',
    vendorRating: 4.5,
    status: 'APPROVED',
    totalOrders: 9,
    onTimeDelivery: 95,
    createdAt: new Date('2025-09-10'),
  },
  {
    id: 'VEN-004',
    vendorCode: 'ALMAD-001',
    companyName: 'Al-Madina',
    contactPerson: 'Muhammad Tariq',
    phone: '+92-21-34912345',
    email: 'tariq@almadina.pk',
    address: 'Nazimabad, Karachi, Sindh, Pakistan',
    categories: ['GRAINS & PULSES', 'COOKING ESSENTIALS', 'GENERAL'],
    paymentTerms: 'CREDIT',
    creditDays: 15,
    excessCharges: 2.0,
    contractTerms: 'Bi-weekly credit terms for bulk supplies',
    iban: 'PK45HBL0983204000012345',
    accountTitle: 'Al-Madina Trading Co.',
    branch: 'Nazimabad Branch',
    vendorRating: 4.3,
    status: 'APPROVED',
    totalOrders: 6,
    onTimeDelivery: 90,
    createdAt: new Date('2025-07-01'),
  },
  {
    id: 'VEN-005',
    vendorCode: 'ALI-001',
    companyName: 'ALI',
    contactPerson: 'Ali Hassan',
    phone: '+92-21-32456789',
    email: 'ali@alimeats.pk',
    address: 'Gulshan, Karachi, Sindh, Pakistan',
    categories: ['MEAT & POULTRY', 'OFFAL'],
    paymentTerms: 'CASH',
    creditDays: 0,
    excessCharges: 0,
    contractTerms: 'Cash on delivery for fresh meat',
    iban: 'PK12STAN0041000005678901',
    accountTitle: 'Ali Meat Suppliers',
    branch: 'Gulshan Branch',
    vendorRating: 3.8,
    status: 'APPROVED',
    totalOrders: 5,
    onTimeDelivery: 85,
    createdAt: new Date('2025-10-01'),
  },
];

// ── 13 Real Departments from ERP_New ────────────────────────────────────────
export const departments: Department[] = [
  { id: 'DEPT-001', code: 'CHN-KITCHEN', name: 'CHINESE KITCHEN', type: 'RESTAURANT', isActive: true },
  { id: 'DEPT-002', code: 'DESI-KITCHEN', name: 'DESI KITCHEN', type: 'RESTAURANT', isActive: true },
  { id: 'DEPT-003', code: 'BBQ-KITCHEN', name: 'BBQ KITCHEN', type: 'RESTAURANT', isActive: true },
  { id: 'DEPT-004', code: 'REST-STORE', name: 'RESTAURANT STORE DEPT', type: 'RESTAURANT', isActive: true },
  { id: 'DEPT-005', code: 'STORE', name: 'STORE DEPT', type: 'GENERAL', isActive: true },
  { id: 'DEPT-006', code: 'GEN-STORE', name: 'GENERAL STORE', type: 'GENERAL', isActive: true },
  { id: 'DEPT-007', code: 'KTCH-STORE', name: 'KITCHEN STORE', type: 'GENERAL', isActive: true },
  { id: 'DEPT-008', code: 'DRY-STORE', name: 'DRY STORE', type: 'GENERAL', isActive: true },
  { id: 'DEPT-009', code: 'COLD-STORE', name: 'COLD STORE', type: 'GENERAL', isActive: true },
  { id: 'DEPT-010', code: 'RM', name: 'REPAIR & MAINTENANCE', type: 'GENERAL', isActive: true },
  { id: 'DEPT-011', code: 'ADMIN', name: 'ADMIN', type: 'GENERAL', isActive: true },
  { id: 'DEPT-012', code: 'ACCT', name: 'ACCOUNTS', type: 'GENERAL', isActive: true },
  { id: 'DEPT-013', code: 'BFMS', name: 'BFMS', type: 'GENERAL', isActive: true },
];

// ── Sample POs (real doc number format) ─────────────────────────────────────
export const samplePurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-001',
    poNumber: 'PO-202603-0006',
    vendorId: 'VEN-002',
    orderDate: new Date('2026-03-03'),
    expectedDelivery: new Date('2026-03-05'),
    status: 'APPROVED',
    totalAmount: 35000,
    approvalLevel: 2,
    createdBy: 'purchasing@rahah24.com',
    approvedBy: 'gm@rahah24.com',
    items: [
      { itemId: 'INV-007', itemName: 'RED CHILLI POWDER', quantity: 15, unitPrice: 850, totalPrice: 12750 },
      { itemId: 'INV-004', itemName: 'COOKING OIL (5L)', quantity: 7, unitPrice: 3200, totalPrice: 22400 },
    ],
  },
  {
    id: 'PO-002',
    poNumber: 'PO-202603-0005',
    vendorId: 'VEN-001',
    orderDate: new Date('2026-03-01'),
    expectedDelivery: new Date('2026-03-04'),
    status: 'PENDING_L2',
    totalAmount: 28500,
    approvalLevel: 2,
    createdBy: 'purchasing@rahah24.com',
    items: [
      { itemId: 'INV-005', itemName: 'BASMATI RICE (25KG)', quantity: 5, unitPrice: 4500, totalPrice: 22500 },
      { itemId: 'INV-006', itemName: 'ATTA FLOUR (10KG)', quantity: 5, unitPrice: 1200, totalPrice: 6000 },
    ],
  },
  {
    id: 'PO-003',
    poNumber: 'PO-202603-0004',
    vendorId: 'VEN-003',
    orderDate: new Date('2026-02-28'),
    expectedDelivery: new Date('2026-03-02'),
    status: 'PENDING_L1',
    totalAmount: 48000,
    approvalLevel: 1,
    createdBy: 'purchasing@rahah24.com',
    items: [
      { itemId: 'INV-003', itemName: 'CHICKEN WHOLE', quantity: 100, unitPrice: 480, totalPrice: 48000 },
    ],
  },
];

// ── Chart Data: Inventory by Category (47 categories grouped into types) ────
export const inventoryByCategory = [
  { name: 'Consumable', value: 1672, percentage: 79, color: '#14B8A6' },
  { name: 'Raw Material', value: 344, percentage: 16, color: '#8B5CF6' },
  { name: 'Finished Goods', value: 56, percentage: 3, color: '#3B82F6' },
  { name: 'Packaging', value: 42, percentage: 2, color: '#F59E0B' },
];

// ── Chart Data: Stock Status Distribution (across 2,114 items) ──────────────
export const stockStatusData = [
  { name: 'In Stock', value: 1780, color: '#10B981' },
  { name: 'Low Stock', value: 218, color: '#F59E0B' },
  { name: 'Out of Stock', value: 42, color: '#EF4444' },
  { name: 'Excess Stock', value: 74, color: '#8B5CF6' },
];

// ── Chart Data: Top Items by Value (real item names from ERP_New) ───────────
export const topItemsByValue = [
  { name: 'GOAT BAKRA A', value: 153000, category: 'MEAT & POULTRY' },
  { name: 'COOKING OIL (5L)', value: 144000, category: 'COOKING ESSENTIALS' },
  { name: 'BASMATI RICE', value: 135000, category: 'GRAINS & PULSES' },
  { name: 'ATTA FLOUR', value: 66000, category: 'GRAINS & PULSES' },
  { name: 'CHICKEN WHOLE', value: 57600, category: 'MEAT & POULTRY' },
  { name: 'KALEJI (LIVER)', value: 30000, category: 'MEAT & POULTRY' },
];

// ── Chart Data: Vendor Performance (5 real suppliers) ───────────────────────
export const vendorPerformance = [
  { name: 'LOCAL SUPPLIER', rating: 4.2, orders: 12, onTime: 92, onTimePercentage: 92, totalOrders: 12, totalValue: 145000 },
  { name: 'SALEEM BHAI', rating: 4.0, orders: 8, onTime: 88, onTimePercentage: 88, totalOrders: 8, totalValue: 98000 },
  { name: 'CHICKEN SUPPLIER', rating: 4.5, orders: 9, onTime: 95, onTimePercentage: 95, totalOrders: 9, totalValue: 112000 },
  { name: 'Al-Madina', rating: 4.3, orders: 6, onTime: 90, onTimePercentage: 90, totalOrders: 6, totalValue: 78000 },
  { name: 'ALI', rating: 3.8, orders: 5, onTime: 85, onTimePercentage: 85, totalOrders: 5, totalValue: 50840 },
];

// ── Chart Data: Procurement Spending Trends (real Feb-Mar + projected) ──────
export const procurementSpendingTrends = [
  {
    month: 'Oct',
    consumables: 28000,
    fixedAssets: 5000,
    rawMaterials: 9000,
    totalSpending: 42000,
    budget: 60000,
    variance: 18000,
    approvalTime: 2.5,
    emergencyOrders: 1,
  },
  {
    month: 'Nov',
    consumables: 42000,
    fixedAssets: 8000,
    rawMaterials: 18000,
    totalSpending: 68000,
    budget: 65000,
    variance: -3000,
    approvalTime: 3.0,
    emergencyOrders: 2,
  },
  {
    month: 'Dec',
    consumables: 32000,
    fixedAssets: 6000,
    rawMaterials: 17000,
    totalSpending: 55000,
    budget: 60000,
    variance: 5000,
    approvalTime: 2.8,
    emergencyOrders: 1,
  },
  {
    month: 'Jan',
    consumables: 48000,
    fixedAssets: 10000,
    rawMaterials: 20000,
    totalSpending: 78000,
    budget: 70000,
    variance: -8000,
    approvalTime: 3.2,
    emergencyOrders: 3,
  },
  {
    month: 'Feb',
    consumables: 15000,
    fixedAssets: 3000,
    rawMaterials: 8340,
    totalSpending: 26340,
    budget: 50000,
    variance: 23660,
    approvalTime: 2.2,
    emergencyOrders: 0,
  },
  {
    month: 'Mar',
    consumables: 62000,
    fixedAssets: 12000,
    rawMaterials: 31200,
    totalSpending: 105200,
    budget: 80000,
    variance: -25200,
    approvalTime: 3.5,
    emergencyOrders: 2,
  },
];

// ── Color arrays ────────────────────────────────────────────────────────────
export const COLORS = ['#14B8A6', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981'];
export const STATUS_COLORS = {
  'In Stock': '#10B981',
  'Low Stock': '#F59E0B',
  'Out of Stock': '#EF4444',
  'Excess Stock': '#8B5CF6',
};

// ── Helper functions ────────────────────────────────────────────────────────
export const getStockStatus = (item: EnhancedInventoryItem): {
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Excess Stock';
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
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

  return {
    totalValue,
    lowStockItems,
    outOfStockItems,
    totalItems: 2114,         // Real ERP_New count
    activeVendors: 5,         // Real ERP_New count
    pendingApprovals: 16,     // 3 PO + 10 GRN + 3 PR
    monthlyPurchases: 483840, // Real total PO value
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
  calculateInventorySummary,
};
