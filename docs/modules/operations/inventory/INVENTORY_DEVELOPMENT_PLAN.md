# Comprehensive Inventory Development Plan
## Rahah24 ERP - Jamia Binoria Aalamia
**Based on INVENTORY MODULE.pdf & Current System Analysis**

---

## 🎯 **EXECUTIVE SUMMARY**

This comprehensive development plan implements ALL 14 modules from the INVENTORY MODULE.pdf specification, transforming the current basic inventory tracking into a world-class ERP inventory system. The plan includes realistic Jamia Binoria Aalamia data, advanced charts, and seamless integration with existing operations.

### **Key Deliverables**
- **Complete Feature Coverage**: 100% of PDF requirements implemented
- **Advanced Dashboard**: Donut charts, bar charts, interactive analytics  
- **Realistic Data Integration**: Based on actual Binoria inventory items
- **Mobile-First Design**: Responsive across all devices
- **Role-Based Access**: 7 user roles with granular permissions

---

## 📋 **REQUIREMENTS ANALYSIS FROM PDF**

### **Core Modules to Implement (14 Total)**

#### **1. Stock Level Controls** ✅
- Min/Max/Reorder levels per item & store
- Auto reorder suggestions 
- Excess handling with approval workflows
- Multi-location stock tracking

#### **2. Purchase & Approval Workflow** ✅
- Purchase Requisition → PO → GRN → Invoice flow
- 3-Level approval (L1/L2/L3) based on value/category
- Price variance detection and blocking
- Automated approval routing

#### **3. Vendor & Purchasing Management** ✅
- Complete vendor master with 15+ fields
- Open Market, Cash, Credit purchase types
- Vendor approval workflow
- Payment terms and credit management
- Vendor performance ratings

#### **4. Department Requisitions & Issues** ✅
- Restaurant-specific: Continental, Chinese, BBQ, Tandoor, Beverages, Dessert
- General Organization: Education, Administration, Construction, Kitchen
- FEFO (First Expired, First Out) enforcement
- Issue slip workflow with approvals

#### **5. Recipes & Costing Link** ✅
- Ideal vs Actual consumption variance
- Food cost % auto-calculation
- Recipe-based consumption tracking
- Variance tolerance monitoring

#### **6. Item Location & Storage** ✅
- Zone → Aisle → Rack → Bin mapping
- Physical location search
- Stat/Par levels by department
- Bin location tracking

#### **7. Expiry & Warranty** ✅
- Batch-wise expiry tracking
- 30/60 day expiry alerts
- Warranty tracking for equipment
- Automated alert system

#### **8. Reusable/Saleable Items** ✅
- Used oil, scrap materials tracking
- Store → Market sale transactions
- AR entry generation
- Margin analysis reports

#### **9. Theft & Physical Checks** ✅
- Theft reporting with incident logs
- Scheduled physical stock counts
- Variance posting with approvals
- Photo attachment support

#### **10. Store Staff KPI & Donation Tracking** ✅
- Transaction count per user
- Working hours vs expected
- Utilization dashboard
- Donation GRN with donor management

#### **11. Comprehensive Reporting** ✅
- 16 different report types
- Daily/Weekly/Monthly/Quarterly frequencies
- Custom date ranges
- Export capabilities (PDF/Excel/CSV)

#### **12. Alerts & Automation** ✅
- 10 different alert types
- Real-time notifications
- Email/SMS integration
- Configurable thresholds

#### **13. Roles & Permissions** ✅
- 7 distinct user roles
- Granular permission matrix
- Department-based access control
- Audit trail for all actions

#### **14. Test Cases for QA** ✅
- 14 comprehensive test scenarios
- Automated testing framework
- Integration test coverage
- User acceptance testing

---

## 🏗️ **TECHNICAL ARCHITECTURE**

### **Frontend Technology Stack**
```typescript
// Core Framework
- Next.js 15.3.3 with App Router
- React 18 with TypeScript
- Tailwind CSS + shadcn/ui components

// Charts & Visualization
- Recharts for donut/pie/bar charts
- React Query for state management
- Framer Motion for animations

// Additional Libraries
- React Hook Form + Zod validation
- Date-fns for date handling
- Lucide React for icons
- Recharts responsive containers
```

### **Backend Integration**
```sql
-- Core Tables Structure
enhanced_inventory_items (30+ fields)
purchase_orders (full PO workflow)
purchase_order_items (line items)
stock_movements (complete audit trail)
vendors (15+ vendor fields)
departments (restaurant + general)
recipes (costing integration)
physical_counts (stock check)
donations (donor tracking)
alerts_notifications (system alerts)
user_activities (KPI tracking)
approval_workflows (3-level approvals)
```

### **Database Schema Extensions**
Based on PDF requirements, we need these additional tables:

```sql
-- Vendor Management (Module 3)
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_code VARCHAR(20) UNIQUE NOT NULL,
  company_name VARCHAR(200) NOT NULL,
  contact_person VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  categories VARCHAR(100)[],
  payment_terms VARCHAR(50), -- 'CASH', 'BANK_TRANSFER', 'CREDIT'
  credit_days INTEGER DEFAULT 0, -- Net 15, Net 30
  excess_charges DECIMAL(5,2) DEFAULT 0, -- Late fee %
  contract_terms TEXT,
  iban VARCHAR(50),
  account_title VARCHAR(100),
  branch VARCHAR(100),
  vendor_rating DECIMAL(3,2) DEFAULT 0, -- Out of 5
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, BLOCKED
  created_at TIMESTAMP DEFAULT NOW()
);

-- Department Requisitions (Module 4)
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dept_code VARCHAR(20) UNIQUE NOT NULL,
  dept_name VARCHAR(100) NOT NULL,
  dept_type VARCHAR(50), -- 'RESTAURANT', 'GENERAL'
  parent_dept UUID REFERENCES departments(id),
  is_active BOOLEAN DEFAULT true
);

-- Restaurant Departments Data
INSERT INTO departments (dept_code, dept_name, dept_type) VALUES
('CONTINENTAL', 'Continental Kitchen', 'RESTAURANT'),
('CHINESE', 'Chinese Kitchen', 'RESTAURANT'),
('BBQ', 'BBQ Section', 'RESTAURANT'),
('TANDOOR', 'Tandoor Section', 'RESTAURANT'),
('BEVERAGES', 'Beverages Section', 'RESTAURANT'),
('DESSERT', 'Dessert Section', 'RESTAURANT'),
('EDUCATION', 'Education Department', 'GENERAL'),
('ADMIN', 'Administration', 'GENERAL'),
('CONSTRUCTION', 'Construction Department', 'GENERAL'),
('SECURITY', 'Security Department', 'GENERAL'),
('MAINTENANCE', 'Maintenance Department', 'GENERAL'),
('JANITORIAL', 'Janitorial Services', 'GENERAL');

-- Recipes & Costing (Module 5)
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_code VARCHAR(50) UNIQUE NOT NULL,
  recipe_name VARCHAR(200) NOT NULL,
  department_id UUID REFERENCES departments(id),
  portion_size DECIMAL(10,3),
  total_cost DECIMAL(10,2),
  selling_price DECIMAL(10,2),
  food_cost_percentage DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id),
  item_id UUID REFERENCES enhanced_inventory_items(id),
  quantity DECIMAL(10,3) NOT NULL,
  cost_per_unit DECIMAL(10,2),
  total_cost DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Location & Storage (Module 6)
CREATE TABLE storage_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_code VARCHAR(50) UNIQUE NOT NULL,
  zone_name VARCHAR(100),
  aisle_name VARCHAR(100),
  rack_name VARCHAR(100),
  bin_name VARCHAR(100),
  full_location VARCHAR(500), -- Computed: Zone-Aisle-Rack-Bin
  store_id UUID REFERENCES store_locations(id),
  is_active BOOLEAN DEFAULT true
);

-- Expiry & Warranty Tracking (Module 7)
CREATE TABLE item_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES enhanced_inventory_items(id),
  batch_number VARCHAR(100) NOT NULL,
  manufacturing_date DATE,
  expiry_date DATE,
  shelf_life_days INTEGER,
  quantity DECIMAL(10,3),
  supplier_id UUID REFERENCES vendors(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE warranties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID REFERENCES enhanced_inventory_items(id),
  warranty_start_date DATE NOT NULL,
  warranty_end_date DATE NOT NULL,
  warranty_type VARCHAR(100), -- 'MANUFACTURER', 'EXTENDED', 'SERVICE'
  vendor_id UUID REFERENCES vendors(id),
  warranty_terms TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Physical Counts & Theft (Module 9)
CREATE TABLE physical_counts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  count_number VARCHAR(50) UNIQUE NOT NULL,
  count_date DATE NOT NULL,
  count_type VARCHAR(50), -- 'CYCLE', 'FULL'
  status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, IN_PROGRESS, COMPLETED
  store_id UUID REFERENCES store_locations(id),
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE physical_count_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  count_id UUID REFERENCES physical_counts(id),
  item_id UUID REFERENCES enhanced_inventory_items(id),
  system_quantity DECIMAL(10,3),
  physical_quantity DECIMAL(10,3),
  variance DECIMAL(10,3),
  variance_value DECIMAL(12,2),
  reason TEXT,
  adjustment_type VARCHAR(50), -- 'THEFT', 'DAMAGE', 'COUNTING_ERROR'
  photos TEXT[], -- Array of photo URLs
  created_at TIMESTAMP DEFAULT NOW()
);

-- Donations Tracking (Module 10)
CREATE TABLE donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_code VARCHAR(50) UNIQUE NOT NULL,
  donor_name VARCHAR(200) NOT NULL,
  contact_person VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  total_donations_value DECIMAL(15,2) DEFAULT 0,
  last_donation_date DATE,
  donation_frequency INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_number VARCHAR(50) UNIQUE NOT NULL,
  donor_id UUID REFERENCES donors(id),
  donation_date DATE NOT NULL,
  donation_type VARCHAR(100),
  total_market_value DECIMAL(12,2),
  received_by UUID REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'RECEIVED',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE donation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID REFERENCES donations(id),
  item_id UUID REFERENCES enhanced_inventory_items(id),
  quantity DECIMAL(10,3),
  market_value DECIMAL(10,2),
  total_value DECIMAL(12,2),
  condition VARCHAR(50) DEFAULT 'NEW',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Staff KPI Tracking (Module 10)
CREATE TABLE user_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  activity_date DATE NOT NULL,
  activity_type VARCHAR(100), -- 'GRN', 'ISSUE', 'TRANSFER', 'ADJUSTMENT'
  transaction_count INTEGER DEFAULT 0,
  login_time TIME,
  logout_time TIME,
  total_hours DECIMAL(4,2),
  expected_hours DECIMAL(4,2) DEFAULT 8,
  overtime_hours DECIMAL(4,2) DEFAULT 0,
  utilization_percentage DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Approval Workflows (Module 2)
CREATE TABLE approval_workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_type VARCHAR(50), -- 'PO', 'REQUISITION', 'ADJUSTMENT'
  document_id UUID NOT NULL,
  approval_level INTEGER NOT NULL, -- 1, 2, 3
  approver_id UUID REFERENCES auth.users(id),
  approval_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
  approval_date TIMESTAMP,
  comments TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎨 **UI/UX DESIGN SPECIFICATIONS**

### **Enhanced Dashboard Layout**
Based on current system images and modern requirements:

```jsx
// Main Inventory Dashboard Structure
<div className="space-y-6 p-6">
  {/* Top KPI Cards Row */}
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
    <KPICard 
      title="Total Inventory Value" 
      value="PKR 2,580,150" 
      icon={<Warehouse />}
      trend="+5.2%"
      color="blue"
    />
    <KPICard 
      title="Low Stock Items" 
      value="23" 
      icon={<AlertTriangle />}
      status="warning"
      color="amber"
    />
    <KPICard 
      title="Pending Approvals" 
      value="12" 
      icon={<Clock />}
      status="critical"
      color="red"
    />
    <KPICard 
      title="Active Vendors" 
      value="156" 
      icon={<Users />}
      color="green"
    />
    <KPICard 
      title="Monthly Purchases" 
      value="PKR 1,250,000" 
      icon={<ShoppingCart />}
      trend="+12.5%"
      color="purple"
    />
  </div>

  {/* Charts Section */}
  <div className="grid lg:grid-cols-3 gap-6">
    {/* Donut Chart - Category Distribution */}
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Inventory by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={inventoryByCategory}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
            >
              {inventoryByCategory.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `PKR ${value.toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    {/* Bar Chart - Top Items */}
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Top 10 Items by Value</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topItemsByValue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              formatter={(value) => `PKR ${(value/1000).toFixed(0)}K`}
            />
            <Tooltip 
              formatter={(value) => [`PKR ${value.toLocaleString()}`, 'Value']}
            />
            <Bar dataKey="value" fill="#14B8A6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>

  {/* Second Row Charts */}
  <div className="grid lg:grid-cols-2 gap-6">
    {/* Stock Status Donut */}
    <Card>
      <CardHeader>
        <CardTitle>Stock Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={stockStatusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
            >
              {stockStatusData.map((entry, index) => (
                <Cell key={index} fill={STATUS_COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    {/* Vendor Performance Bar Chart */}
    <Card>
      <CardHeader>
        <CardTitle>Vendor Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={vendorPerformance} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 5]} />
            <YAxis type="category" dataKey="name" width={80} />
            <Tooltip formatter={(value) => [`${value}/5`, 'Rating']} />
            <Bar dataKey="rating" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>

  {/* Main Content Grid */}
  <div className="grid lg:grid-cols-4 gap-6">
    {/* Inventory Table */}
    <div className="lg:col-span-3">
      <EnhancedInventoryTable />
    </div>
    
    {/* Side Panel */}
    <div className="space-y-6">
      <RecentActivityPanel />
      <PendingApprovalsPanel />
      <AlertsPanel />
    </div>
  </div>
</div>
```

### **Color Scheme (Rahah24 Brand)**
```css
/* Primary Colors */
--primary-teal: #14B8A6;
--primary-green: #10B981;
--primary-blue: #3B82F6;

/* Status Colors */
--success-green: #10B981;
--warning-amber: #F59E0B;
--error-red: #EF4444;
--info-blue: #3B82F6;

/* Chart Colors Array */
const COLORS = ['#14B8A6', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];
const STATUS_COLORS = {
  'In Stock': '#10B981',
  'Low Stock': '#F59E0B', 
  'Out of Stock': '#EF4444',
  'Excess Stock': '#8B5CF6'
};
```

---

## 📊 **REALISTIC JAMIA BINORIA DATA INTEGRATION**

### **Enhanced Inventory Items (Based on Current System)**
```typescript
// Comprehensive inventory data with all PDF requirements
export const enhancedInventoryItems: EnhancedInventoryItem[] = [
  // CONSUMABLE - CROCKERY ITEMS (From current system)
  {
    id: 'INV-CROCKERY-001',
    code: 'CONCROCKERY-0004/0009',
    name: 'LASSI GLASS',
    description: 'Large glass for traditional lassi serving - 300ml capacity',
    category: 'CONSUMABLE',
    subCategory: 'CROCKERY ITEMS',
    department: ['BEVERAGES', 'RESTAURANT'],
    tags: ['glass', 'serving', 'beverages'],
    
    // Location & Storage
    primaryStore: 'JAMIA STORE',
    storageLocation: 'A1-R2-B5', // Zone-Aisle-Rack-Bin
    binLocation: 'CROCKERY-SECTION-A',
    
    // Quantities & Units
    unit: 'NO',
    currentQuantity: 21.00,
    reservedQuantity: 5.00,
    availableQuantity: 16.00,
    openingQuantity: 25.00,
    
    // Stock Levels (Per PDF requirements)
    minStock: 10.00,
    maxStock: 50.00,
    reorderLevel: 15.00,
    reorderQuantity: 30.00,
    
    // Financial
    unitCost: 139.00,
    avgCost: 135.50,
    lastPurchasePrice: 142.00,
    totalValue: 2778.00,
    
    // Vendor & Procurement
    preferredVendor: 'VEN-001',
    alternateVendors: ['VEN-002', 'VEN-003'],
    lastPurchaseDate: new Date('2024-12-15'),
    
    // Status & Tracking
    status: 'ACTIVE',
    condition: 'GOOD',
    
    // Metadata
    isActive: true,
    createdBy: 'USR-STOREKEEPER-001',
    createdAt: new Date('2024-01-01'),
    updatedBy: 'USR-STOREKEEPER-001',
    updatedAt: new Date('2024-12-20')
  },

  // CONSUMABLE - HYGIENE ITEMS (From current system)
  {
    id: 'INV-HYGIENE-001',
    code: 'CONHYG-0003/0009',
    name: 'SHAMPOO (PHYSOL)',
    description: 'Premium quality shampoo for guest accommodation - 500ml bottle',
    category: 'CONSUMABLE',
    subCategory: 'HYGIENE ITEMS',
    department: ['ACCOMMODATION', 'MAINTENANCE'],
    tags: ['hygiene', 'guest-supplies', 'accommodation'],
    
    // Location & Storage
    primaryStore: 'JAMIA STORE',
    storageLocation: 'B2-R1-B3',
    binLocation: 'HYGIENE-SECTION-B',
    
    // Quantities & Units
    unit: 'PCS',
    currentQuantity: 5.00,
    reservedQuantity: 2.00,
    availableQuantity: 3.00,
    openingQuantity: 8.00,
    
    // Stock Levels
    minStock: 3.00,
    maxStock: 20.00,
    reorderLevel: 5.00,
    reorderQuantity: 15.00,
    
    // Financial
    unitCost: 948.71,
    avgCost: 950.00,
    lastPurchasePrice: 965.00,
    totalValue: 5578.88,
    
    // Lifecycle (Expiry tracking per PDF)
    shelfLife: 730, // 2 years in days
    expiryDate: new Date('2025-12-31'),
    batchNumber: 'PHYSOL-2024-001',
    
    // Vendor & Procurement
    preferredVendor: 'VEN-HYGIENE-001',
    alternateVendors: ['VEN-HYGIENE-002'],
    lastPurchaseDate: new Date('2024-11-20'),
    
    // Status
    status: 'ACTIVE',
    condition: 'NEW',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-18')
  },

  // ELECTRICAL ITEMS (From current system)
  {
    id: 'INV-ELECTRICAL-001',
    code: 'CONOTH-0006/1717',
    name: 'DOUBLE LIGHT PLUG',
    description: 'High quality electrical double plug for mosque and classroom lighting',
    category: 'CONSUMABLE',
    subCategory: 'ELECTRICAL ITEMS',
    department: ['MAINTENANCE', 'CONSTRUCTION'],
    tags: ['electrical', 'lighting', 'maintenance'],
    
    // Location & Storage
    primaryStore: 'JAMIA STORE',
    storageLocation: 'C1-R3-B2',
    binLocation: 'ELECTRICAL-SECTION-C',
    
    // Quantities & Units  
    unit: 'NO',
    currentQuantity: 14.00,
    reservedQuantity: 2.00,
    availableQuantity: 12.00,
    openingQuantity: 20.00,
    
    // Stock Levels
    minStock: 5.00,
    maxStock: 30.00,
    reorderLevel: 8.00,
    reorderQuantity: 20.00,
    
    // Financial
    unitCost: 950.00,
    avgCost: 945.00,
    lastPurchasePrice: 975.00,
    totalValue: 13300.00,
    
    // Warranty Tracking (Per PDF Module 7)
    warranties: [{
      warrantyStartDate: new Date('2024-01-01'),
      warrantyEndDate: new Date('2025-01-01'),
      warrantyType: 'MANUFACTURER',
      warrantyTerms: '1 year manufacturer warranty against defects'
    }],
    
    // Vendor & Procurement
    preferredVendor: 'VEN-ELECTRICAL-001',
    alternateVendors: ['VEN-ELECTRICAL-002', 'VEN-ELECTRICAL-003'],
    lastPurchaseDate: new Date('2024-10-15'),
    
    status: 'ACTIVE',
    condition: 'NEW',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-10')
  }
];

// VENDORS (Based on PDF Module 3 requirements)
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
    creditDays: 30, // Net 30
    excessCharges: 2.5, // 2.5% late fee
    contractTerms: 'Standard corporate supply agreement with volume discounts',
    iban: 'PK36MEZN0005410123456709',
    accountTitle: 'Metro Cash & Carry Pakistan Limited',
    branch: 'Gulshan-e-Iqbal Branch',
    vendorRating: 4.5, // Out of 5
    status: 'APPROVED',
    createdAt: new Date('2023-06-01')
  },
  
  {
    id: 'VEN-HYGIENE-001',
    vendorCode: 'PHYSOL-001',
    companyName: 'Physol Industries',
    contactPerson: 'Muhammad Tariq',
    phone: '+92-42-35876543',
    email: 'tariq@physol.com',
    address: 'Industrial Area, Lahore, Punjab, Pakistan',
    categories: ['HYGIENE ITEMS', 'CLEANING SUPPLIES'],
    paymentTerms: 'CREDIT',
    creditDays: 15, // Net 15
    excessCharges: 3.0,
    contractTerms: 'Premium hygiene products supplier with quality guarantee',
    iban: 'PK24ABNA0012340001234567',
    accountTitle: 'Physol Industries (Pvt) Limited',
    branch: 'Johar Town Branch Lahore',
    vendorRating: 4.8,
    status: 'APPROVED',
    createdAt: new Date('2023-08-15')
  },
  
  {
    id: 'VEN-ELECTRICAL-001', 
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
    createdAt: new Date('2023-09-10')
  }
];

// DEPARTMENTS (Per PDF Module 4)
export const departments: Department[] = [
  // Restaurant Departments
  { id: 'DEPT-REST-001', code: 'CONTINENTAL', name: 'Continental Kitchen', type: 'RESTAURANT' },
  { id: 'DEPT-REST-002', code: 'CHINESE', name: 'Chinese Kitchen', type: 'RESTAURANT' },
  { id: 'DEPT-REST-003', code: 'BBQ', name: 'BBQ Section', type: 'RESTAURANT' },
  { id: 'DEPT-REST-004', code: 'TANDOOR', name: 'Tandoor Section', type: 'RESTAURANT' },
  { id: 'DEPT-REST-005', code: 'BEVERAGES', name: 'Beverages Section', type: 'RESTAURANT' },
  { id: 'DEPT-REST-006', code: 'DESSERT', name: 'Dessert Section', type: 'RESTAURANT' },
  
  // General Organization Departments  
  { id: 'DEPT-GEN-001', code: 'EDUCATION', name: 'Education Department', type: 'GENERAL' },
  { id: 'DEPT-GEN-002', code: 'ADMIN', name: 'Administration', type: 'GENERAL' },
  { id: 'DEPT-GEN-003', code: 'CONSTRUCTION', name: 'Construction Department', type: 'GENERAL' },
  { id: 'DEPT-GEN-004', code: 'KITCHEN', name: 'Main Kitchen', type: 'GENERAL' },
  { id: 'DEPT-GEN-005', code: 'SECURITY', name: 'Security Department', type: 'GENERAL' },
  { id: 'DEPT-GEN-006', code: 'MAINTENANCE', name: 'Maintenance Department', type: 'GENERAL' },
  { id: 'DEPT-GEN-007', code: 'JANITORIAL', name: 'Janitorial Services', type: 'GENERAL' }
];
```

### **Chart Data for Enhanced Dashboard**
```typescript
// Donut Chart Data - Inventory by Category
export const inventoryByCategory = [
  { name: 'Consumables', value: 1850000, percentage: 45 },
  { name: 'Fixed Assets', value: 950000, percentage: 25 },
  { name: 'Raw Materials', value: 650000, percentage: 18 },
  { name: 'Finished Goods', value: 480000, percentage: 12 }
];

// Stock Status Distribution (Donut Chart)
export const stockStatusData = [
  { name: 'In Stock', value: 1250, color: '#10B981' },
  { name: 'Low Stock', value: 89, color: '#F59E0B' },
  { name: 'Out of Stock', value: 23, color: '#EF4444' },
  { name: 'Excess Stock', value: 45, color: '#8B5CF6' }
];

// Top 10 Items by Value (Bar Chart)
export const topItemsByValue = [
  { name: 'Shampoo (Physol)', value: 475000 },
  { name: 'Double Light Plug', value: 385000 },
  { name: 'Lassi Glass', value: 295000 },
  { name: 'LED Light (5W)', value: 245000 },
  { name: 'Wire Clip (5MM)', value: 189000 },
  { name: 'Toilet Soap', value: 156000 },
  { name: 'Air Freshener', value: 134000 },
  { name: 'Duster Safi', value: 98000 },
  { name: 'Bleach', value: 87000 },
  { name: 'Electric Socket', value: 65000 }
];

// Vendor Performance (Horizontal Bar Chart)
export const vendorPerformance = [
  { name: 'Metro Cash & Carry', rating: 4.5 },
  { name: 'Physol Industries', rating: 4.8 },
  { name: 'KE Suppliers', rating: 4.2 },
  { name: 'Al-Fatah Meats', rating: 4.6 },
  { name: 'Local Sabzi Mandi', rating: 3.8 }
];
```

---

## 🔄 **IMPLEMENTATION PHASES**

### **Phase 1: Core Foundation (Days 1-21)**
**Investment**: PKR 200,000 | **Timeline**: 3 weeks

#### **Week 1: Database & Backend Setup**
- ✅ Complete database schema implementation (14 modules)
- ✅ API routes for all inventory operations
- ✅ Authentication & role-based access control
- ✅ Seed data with realistic Binoria inventory

#### **Week 2: Enhanced Dashboard & Charts**
- ✅ Donut charts for category & stock status distribution
- ✅ Bar charts for top items & vendor performance  
- ✅ Interactive KPI cards with real-time data
- ✅ Responsive design for mobile/tablet/desktop

#### **Week 3: Core Inventory Features**
- ✅ Item master management with 30+ fields
- ✅ Stock level controls (Min/Max/Reorder)
- ✅ Multi-location inventory tracking
- ✅ Basic search and filtering

### **Phase 2: Advanced Features (Days 22-42)**
**Investment**: PKR 150,000 | **Timeline**: 3 weeks

#### **Week 1: Purchase & Approval Workflow**
- ✅ Purchase Requisition → PO → GRN → Invoice flow
- ✅ 3-level approval system (L1/L2/L3)
- ✅ Price variance detection and blocking
- ✅ Automated email notifications

#### **Week 2: Vendor & Department Management**
- ✅ Complete vendor master with 15+ fields
- ✅ Vendor approval workflow
- ✅ Department requisitions & issue slips
- ✅ Restaurant vs General department segregation

#### **Week 3: Advanced Tracking**
- ✅ Expiry & warranty tracking
- ✅ Batch management with FEFO
- ✅ Physical location mapping (Zone-Aisle-Rack-Bin)
- ✅ Reusable/Saleable items tracking

### **Phase 3: AI & Analytics (Days 43-63)**  
**Investment**: PKR 100,000 | **Timeline**: 3 weeks

#### **Week 1: Recipe Integration & Costing**
- ✅ Recipe management with ingredient costing
- ✅ Ideal vs Actual consumption tracking
- ✅ Food cost percentage calculations
- ✅ Variance analysis and alerts

#### **Week 2: Physical Counts & Theft Management**
- ✅ Scheduled physical stock counts
- ✅ Theft reporting with incident logs
- ✅ Photo attachment support
- ✅ Variance auto-posting with approvals

#### **Week 3: Staff KPI & Donation Tracking**
- ✅ User activity tracking and KPI dashboard
- ✅ Working hours vs expected analysis
- ✅ Donation GRN with donor management
- ✅ Donor frequency and value tracking

### **Phase 4: Reporting & Final Polish (Days 64-84)**
**Investment**: PKR 50,000 | **Timeline**: 3 weeks

#### **Week 1: Comprehensive Reporting**
- ✅ All 16 report types from PDF specification
- ✅ Custom date ranges and filtering
- ✅ Export to PDF/Excel/CSV formats
- ✅ Scheduled report generation

#### **Week 2: Alerts & Automation**
- ✅ 12 different alert types implementation
- ✅ Real-time notifications system
- ✅ Email/SMS integration
- ✅ Configurable alert thresholds

#### **Week 3: Testing & Deployment**
- ✅ All 14 test cases from PDF
- ✅ User acceptance testing
- ✅ Performance optimization
- ✅ Production deployment

---

## 🧪 **TEST CASES IMPLEMENTATION**

Based on PDF Module 14, implementing all required test scenarios:

```typescript
// Test Case Implementation
export const inventoryTestCases = [
  {
    id: 'TC-001',
    name: 'Item below reorder → system generates suggestion',
    scenario: 'When item stock ≤ reorder level',
    expectedResult: 'Auto-generate reorder suggestion notification',
    status: 'AUTOMATED'
  },
  {
    id: 'TC-002', 
    name: 'GRN pushes above max → requires reason + L2/L3 approval',
    scenario: 'Goods receipt increases stock above maximum level',
    expectedResult: 'Block transaction, require reason and higher approval',
    status: 'AUTOMATED'
  },
  {
    id: 'TC-003',
    name: 'PO price variance > threshold → higher approval required',
    scenario: 'Purchase order price deviates >10% from last purchase',
    expectedResult: 'Route to L2/L3 approver based on variance amount',
    status: 'AUTOMATED'
  },
  {
    id: 'TC-004',
    name: 'Expiry items issued → system enforces FEFO',
    scenario: 'Issue request for items with multiple batches',
    expectedResult: 'System suggests oldest expiry date batch first',
    status: 'AUTOMATED'
  }
  // ... Additional 10 test cases as per PDF
];
```

---

## 📊 **SUCCESS METRICS & KPIs**

### **Technical Performance Metrics**
- **Dashboard Load Time**: <2 seconds (Target: 1.5s)
- **Chart Rendering**: <500ms for all visualizations
- **Search Response**: <300ms for inventory search
- **Mobile Performance**: <3s load time on 3G connection
- **System Uptime**: 99.9% availability

### **Business Impact Metrics**
- **Inventory Accuracy**: Target 99%+ (Current: 85%)
- **Stock-out Reduction**: 75% reduction in out-of-stock incidents
- **Purchase Cycle Time**: 60% faster PO-to-receipt process
- **Vendor Compliance**: 95% on-time delivery rate
- **Cost Savings**: PKR 200,000/month waste reduction

### **User Experience Metrics**
- **User Adoption**: 100% staff onboarding within 30 days
- **Feature Utilization**: 90%+ usage of core features
- **User Satisfaction**: 95%+ satisfaction rating
- **Training Completion**: 100% certification achievement
- **Support Tickets**: <2 tickets per user per month

---

## 🔐 **SECURITY & COMPLIANCE**

### **Role-Based Access Control (Per PDF Module 13)**
```typescript
// Complete role matrix implementation
export const rolePermissions = {
  STORE_KEEPER: {
    permissions: ['GRN', 'ISSUES', 'ADJUSTMENTS', 'STOCK_COUNT'],
    restrictions: ['CANNOT_APPROVE_PO', 'CANNOT_DELETE_ITEMS'],
    departments: ['ALL']
  },
  DEPARTMENT_HEAD: {
    permissions: ['REQUISITIONS', 'ISSUE_ACKNOWLEDGEMENT', 'VIEW_DEPT_REPORTS'],
    restrictions: ['CANNOT_CREATE_PO', 'CANNOT_ADJUST_STOCK'],
    departments: ['OWN_DEPARTMENT_ONLY']
  },
  PURCHASING_OFFICER: {
    permissions: ['PO_CREATION', 'VENDOR_MANAGEMENT', 'PRICE_COMPARISON'],
    restrictions: ['CANNOT_APPROVE_ABOVE_LIMIT'],
    departments: ['ALL']
  },
  APPROVER_L1: {
    permissions: ['APPROVE_PO_UPTO_50K', 'APPROVE_REQUISITIONS'],
    restrictions: ['CANNOT_APPROVE_PRICE_VARIANCE'],
    approvalLimit: 50000
  },
  APPROVER_L2: {
    permissions: ['APPROVE_PO_UPTO_200K', 'APPROVE_PRICE_VARIANCE_5%'],
    restrictions: ['CANNOT_APPROVE_THEFT_REPORTS'],
    approvalLimit: 200000
  },
  APPROVER_L3: {
    permissions: ['APPROVE_UNLIMITED', 'APPROVE_THEFT_REPORTS', 'SYSTEM_CONFIG'],
    restrictions: ['NONE'],
    approvalLimit: 'UNLIMITED'
  },
  FINANCE: {
    permissions: ['INVOICE_MATCHING', 'VARIANCE_REVIEW', 'COST_ANALYSIS'],
    restrictions: ['CANNOT_MODIFY_STOCK'],
    departments: ['ALL']
  },
  ADMIN: {
    permissions: ['MASTER_DATA', 'USER_MANAGEMENT', 'SYSTEM_CONFIG'],
    restrictions: ['NONE'],
    departments: ['ALL']
  },
  AUDITOR: {
    permissions: ['READ_ONLY_REPORTS', 'AUDIT_LOGS', 'COMPLIANCE_REPORTS'],
    restrictions: ['NO_MODIFICATIONS'],
    departments: ['ALL']
  }
};
```

### **Data Security Implementation**
- **Encryption**: AES-256 for data at rest, TLS 1.3 for data in transit
- **Backup Strategy**: Automated daily backups with 30-day retention
- **Audit Trail**: Complete transaction logging with user attribution
- **Compliance**: GDPR-compliant data handling with consent management

---

## 💰 **INVESTMENT & ROI BREAKDOWN**

### **Total Investment Analysis**
```typescript
// Detailed cost breakdown
export const investmentBreakdown = {
  development: {
    phase1: 200000, // Core foundation
    phase2: 150000, // Advanced features  
    phase3: 100000, // AI & analytics
    phase4: 50000,  // Reporting & polish
    total: 500000
  },
  
  expectedSavings: {
    monthly: {
      wasteReduction: 150000,
      efficiencyGains: 75000,
      complianceSavings: 25000,
      total: 250000
    },
    
    annual: {
      totalSavings: 3000000,
      roi: '600%',
      paybackPeriod: '2 months'
    }
  },
  
  businessImpact: {
    inventoryAccuracy: '99%', // Up from 85%
    stockoutReduction: '75%',
    purchaseEfficiency: '60%',
    vendorCompliance: '95%',
    staffProductivity: '40%'
  }
};
```

---

## 🚀 **DEPLOYMENT STRATEGY**

### **Production Deployment Plan**
1. **Staging Environment**: Complete testing with realistic data
2. **User Training**: Comprehensive 3-day training program
3. **Phased Rollout**: Department-by-department deployment
4. **Data Migration**: Seamless migration from current system
5. **Go-Live Support**: 24/7 support for first 2 weeks

### **Post-Deployment Support**
- **Week 1-2**: On-site support team
- **Month 1-3**: Daily monitoring and optimization
- **Month 4-6**: Weekly check-ins and user feedback
- **Ongoing**: Monthly system health reports

---

## 🎯 **CONCLUSION**

This comprehensive development plan delivers 100% of the INVENTORY MODULE.pdf requirements while maintaining seamless integration with the existing Rahah24 ERP system. The combination of advanced charts, realistic Binoria data, and world-class inventory management features will transform operations at Jamia Binoria Aalamia.

**Key Success Factors:**
1. **Complete Feature Coverage**: All 14 modules implemented
2. **Modern UI/UX**: Donut charts, bar charts, responsive design
3. **Realistic Data Integration**: Based on actual Binoria inventory
4. **Strong ROI**: 600% return on investment within 12 months
5. **Islamic Values**: Supporting the noble mission of Islamic education

**Next Steps:**
1. ✅ Final approval from stakeholders
2. ✅ Development team allocation
3. ✅ Phase 1 kickoff within 1 week
4. ✅ Weekly progress reviews
5. ✅ Target completion: April 15, 2025

*InshAllah, this inventory system will serve as the foundation for optimal resource management while supporting the noble mission of Islamic education and community service at Jamia Binoria Aalamia.*

---

**Document Prepared By**: Rahah24 Development Team  
**Date**: January 21, 2025  
**Version**: 1.0  
**Next Review**: Weekly during implementation  
**Target Completion**: April 15, 2025