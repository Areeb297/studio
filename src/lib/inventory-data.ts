// Inventory Data - Real items from Current Jamia Binoria Aalamiah System
// Based on the screenshots of their current inventory management system

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'CONSUMABLE' | 'FIXED_ASSET' | 'RAW_MATERIAL' | 'FINISHED_GOODS';
  subCategory: string;
  store: string;
  unit: string;
  openingQuantity: number;
  currentQuantity: number;
  rate: number;
  amount: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreLocation {
  id: string;
  code: string;
  name: string;
  address: string;
  manager?: string;
  isActive: boolean;
}

// Store Locations from Current System
export const storeLocations: StoreLocation[] = [
  {
    id: 'store-1',
    code: 'JAMIA_STORE',
    name: 'JAMIA STORE',
    address: 'Main Campus, Jamia Binoria Aalamiah',
    manager: 'Store Keeper',
    isActive: true
  },
  {
    id: 'store-2', 
    code: 'RESTAURANT',
    name: 'RESTAURANT STORE',
    address: 'Restaurant Department, Jamia Binoria Aalamiah',
    manager: 'Restaurant Manager',
    isActive: true
  }
];

// Real Inventory Items from Current System
export const inventoryItems: InventoryItem[] = [
  // CONSUMABLE - CROCKERY ITEMS (from screenshot)
  {
    id: 'CONCROCKERY-001',
    code: 'CONCROCKERY-0004/0009',
    name: 'LASSI GLASS',
    category: 'CONSUMABLE',
    subCategory: 'CROCKERY ITEMS',
    store: 'JAMIA STORE',
    unit: 'NO',
    openingQuantity: 21.00,
    currentQuantity: 21.00,
    rate: 139.00,
    amount: 2778.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'CONCROCKERY-002', 
    code: 'CONCROCKERY-0004/0003',
    name: 'GLASS',
    category: 'CONSUMABLE',
    subCategory: 'CROCKERY ITEMS',
    store: 'JAMIA STORE',
    unit: 'PCS',
    openingQuantity: 300.00,
    currentQuantity: 300.00,
    rate: 21.00,
    amount: 2778.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },

  // CONSUMABLE - HYGIENE ITEMS (from screenshot)
  {
    id: 'CONHYG-001',
    code: 'CONHYG-0003/0009',
    name: 'SHAMPOO (PHYSOL)',
    category: 'CONSUMABLE',
    subCategory: 'HYGIENE ITEMS',
    store: 'JAMIA STORE',
    unit: 'PCS',
    openingQuantity: 5.00,
    currentQuantity: 5.00,
    rate: 948.71,
    amount: 5578.88,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'CONHYG-002',
    code: 'CONHYG-0003/0102',
    name: 'LIQUID SOAP MAX',
    category: 'CONSUMABLE',
    subCategory: 'HYGIENE ITEMS',
    store: 'JAMIA STORE',
    unit: 'BTL',
    openingQuantity: 1.00,
    currentQuantity: 1.00,
    rate: 250.00,
    amount: 250.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'CONHYG-003',
    code: 'CONHYG-0003/0115',
    name: 'HYPER (SMALL)',
    category: 'CONSUMABLE',
    subCategory: 'HYGIENE ITEMS',  
    store: 'JAMIA STORE',
    unit: 'NO',
    openingQuantity: 15.00,
    currentQuantity: 15.00,
    rate: 80.00,
    amount: 1500.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'CONHYG-004',
    code: 'CONHYG-0003/0006',
    name: 'SHAMPOO (TIKKA)',
    category: 'CONSUMABLE',
    subCategory: 'HYGIENE ITEMS',
    store: 'JAMIA STORE',
    unit: 'PCS',
    openingQuantity: 10.00,
    currentQuantity: 10.00,
    rate: 80.00,
    amount: 800.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'CONHYG-005',
    code: 'CONHYG-0003/0002',
    name: 'AIR FRESHENER SPRAY',
    category: 'CONSUMABLE',
    subCategory: 'HYGIENE ITEMS',
    store: 'JAMIA STORE', 
    unit: 'PCS',
    openingQuantity: 1.00,
    currentQuantity: 1.00,
    rate: 600.00,
    amount: 600.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'CONHYG-006',
    code: 'CONHYG-0003/0197',
    name: 'FLY KILLER SPRAY',
    category: 'CONSUMABLE',
    subCategory: 'HYGIENE ITEMS',
    store: 'JAMIA STORE',
    unit: 'PCS',
    openingQuantity: 1.00,
    currentQuantity: 1.00,
    rate: 0.00,
    amount: 1570.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'CONHYG-007',
    code: 'CONHYG-0003/0192',
    name: 'DUSTER SAFI',
    category: 'CONSUMABLE',
    subCategory: 'HYGIENE ITEMS',
    store: 'JAMIA STORE',
    unit: 'PCS',
    openingQuantity: 1.00,
    currentQuantity: 1.00,
    rate: 100.00,
    amount: 100.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'CONHYG-008',
    code: 'CONHYG-0003/0194',
    name: 'TOILET SOAP',
    category: 'CONSUMABLE',
    subCategory: 'HYGIENE ITEMS',
    store: 'JAMIA STORE',
    unit: 'NO',
    openingQuantity: 1.00,
    currentQuantity: 1.00,
    rate: 250.00,
    amount: 1000.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'CONHYG-009',
    code: 'CONHYG-0003/0195',
    name: 'DUSTING BRUSH',
    category: 'CONSUMABLE',
    subCategory: 'HYGIENE ITEMS',
    store: 'JAMIA STORE',
    unit: 'LTR',
    openingQuantity: 2.00,
    currentQuantity: 2.00,
    rate: 25.00,
    amount: 675.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'CONHYG-010',
    code: 'CONHYG-0003/0196',
    name: 'BLEACH',
    category: 'CONSUMABLE',
    subCategory: 'HYGIENE ITEMS',
    store: 'JAMIA STORE',
    unit: '',
    openingQuantity: 0.00,
    currentQuantity: 0.00,
    rate: 164.00,
    amount: 2614.10,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },

  // ELECTRICAL/CONSTRUCTION ITEMS (from purchase order screenshots)
  {
    id: 'CONOTH-001',
    code: 'CONOTH-0006/1717',
    name: 'DOUBLE LIGHT PLUG',
    category: 'CONSUMABLE',
    subCategory: 'ELECTRICAL ITEMS',
    store: 'JAMIA STORE',
    unit: 'NO',
    openingQuantity: 14.00,
    currentQuantity: 14.00,
    rate: 950.00,
    amount: 13300.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'CONOTH-002',
    code: 'CONSTA-2644',
    name: 'MIRROR',
    category: 'CONSUMABLE',
    subCategory: 'CONSTRUCTION MATERIAL',
    store: 'JAMIA STORE',
    unit: 'NO',
    openingQuantity: 12.00,
    currentQuantity: 12.00,
    rate: 12.00,
    amount: 12000.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'CONOTH-003',
    code: 'CONOTH-0006/0342',
    name: 'LED LIGHT (5W)',
    category: 'CONSUMABLE',
    subCategory: 'ELECTRICAL ITEMS',
    store: 'JAMIA STORE',
    unit: 'NO',
    openingQuantity: 5.00,
    currentQuantity: 5.00,
    rate: 950.00,
    amount: 4750.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'CONOTH-004',
    code: 'CONSTA-4388',
    name: 'CONCEALED 25W LED',
    category: 'CONSUMABLE',
    subCategory: 'ELECTRICAL ITEMS',
    store: 'JAMIA STORE',
    unit: 'NO',
    openingQuantity: 1.00,
    currentQuantity: 1.00,
    rate: 850.00,
    amount: 850.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'CONOTH-005',
    code: 'CONOTH-0060/0047',
    name: 'WIRE CLIP',
    category: 'CONSUMABLE',
    subCategory: 'ELECTRICAL ITEMS',
    store: 'JAMIA STORE',
    unit: 'PCS',
    openingQuantity: 50.00,
    currentQuantity: 50.00,
    rate: 18.00,
    amount: 6000.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'CONOTH-006',
    code: 'CONSTA-9191',
    name: 'ELECTRIC BEND 3/4',
    category: 'CONSUMABLE',
    subCategory: 'ELECTRICAL ITEMS',
    store: 'JAMIA STORE',
    unit: 'PCS',
    openingQuantity: 60.00,
    currentQuantity: 60.00,
    rate: 10.00,
    amount: 1500.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'CONOTH-007',
    code: 'CONSTA-9196',
    name: 'ELECTRIC SOCKET 3/4',
    category: 'CONSUMABLE',
    subCategory: 'ELECTRICAL ITEMS',
    store: 'JAMIA STORE',
    unit: 'PCS',
    openingQuantity: 50.00,
    currentQuantity: 50.00,
    rate: 55.00,
    amount: 3300.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'CONOTH-008',
    code: 'CONSTA-0015',
    name: 'JUNCTION BOX 3/4',
    category: 'CONSUMABLE',
    subCategory: 'ELECTRICAL ITEMS',
    store: 'JAMIA STORE',
    unit: 'NO',
    openingQuantity: 4.00,
    currentQuantity: 4.00,
    rate: 650.00,
    amount: 1600.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'CONOTH-009',
    code: 'CONOTH-0060/4786',
    name: 'SOLUTION',
    category: 'CONSUMABLE',
    subCategory: 'CHEMICAL ITEMS',
    store: 'JAMIA STORE',
    unit: '',
    openingQuantity: 0.00,
    currentQuantity: 0.00,
    rate: 0.00,
    amount: 0.00,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },

  // WIRE ITEMS (from purchase order screenshots)
  {
    id: 'WIRE-001',
    code: 'CONOTH-0060/0351',
    name: 'WIRE (40/76)',
    category: 'CONSUMABLE',
    subCategory: 'ELECTRICAL ITEMS',
    store: 'JAMIA STORE',
    unit: 'MTR',
    openingQuantity: 4.00,
    currentQuantity: 4.00,
    rate: 950.00,
    amount: 100.58,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'WIRE-002',  
    code: 'CONSTA-2837',
    name: 'WIRE CLIP (5MM)',
    category: 'CONSUMABLE',
    subCategory: 'ELECTRICAL ITEMS',
    store: 'JAMIA STORE',
    unit: 'PKT',
    openingQuantity: 1.00,
    currentQuantity: 1.00,
    rate: 540.83,
    amount: 540.83,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'WIRE-003',
    code: 'CONOTH-0060/0492',
    name: 'PLUG (MALE FEMALE)',
    category: 'CONSUMABLE',
    subCategory: 'ELECTRICAL ITEMS',
    store: 'JAMIA STORE',
    unit: 'NOS',
    openingQuantity: 1.00,
    currentQuantity: 1.00,
    rate: 118.60,
    amount: 118.60,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  }
];

// Inventory Categories Summary
export const inventoryCategories = [
  {
    category: 'CONSUMABLE',
    subCategories: [
      'CROCKERY ITEMS',
      'HYGIENE ITEMS', 
      'ELECTRICAL ITEMS',
      'CONSTRUCTION MATERIAL',
      'CHEMICAL ITEMS'
    ]
  },
  {
    category: 'FIXED_ASSET',
    subCategories: [
      'KITCHEN EQUIPMENT',
      'COMPUTER EQUIPMENT',
      'FURNITURE'
    ]
  }
];

// Inventory Summary Calculations
export const getInventorySummary = () => {
  const totalItems = inventoryItems.length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + item.amount, 0);
  const lowStock = inventoryItems.filter(item => item.currentQuantity < 5).length;
  const outOfStock = inventoryItems.filter(item => item.currentQuantity === 0).length;

  return {
    totalItems,
    totalValue,
    lowStock,
    outOfStock,
    categories: inventoryCategories.length
  };
};

// Get items by category
export const getItemsByCategory = (category: string) => {
  return inventoryItems.filter(item => item.category === category);
};

// Get items by store
export const getItemsByStore = (store: string) => {
  return inventoryItems.filter(item => item.store === store);
};

export default {
  inventoryItems,
  storeLocations,
  inventoryCategories,
  getInventorySummary,
  getItemsByCategory,
  getItemsByStore
};