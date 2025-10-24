# Technical Design Document (TDD)
## Inventory Management System - Rahah24 ERP

**Document Version**: 1.0
**Date**: October 25, 2025
**Status**: Design Phase
**Project**: Rahah24 ERP - Operations Module
**Module**: Inventory Management System

---

## 📑 Document Control

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | October 25, 2025 | Rahah24 Development Team | Initial TDD based on BRD and requirements |

### **Document Purpose**
This Technical Design Document (TDD) provides a comprehensive technical specification for the Inventory Management System implementation. It translates business requirements from the BRD into technical architecture, database design, API specifications, and implementation guidelines.

### **Reference Documents**
- BRD Inventory Management Module (15_10_25.pdf)
- INVENTORY MODULE (15_10_25.pdf)
- Inventory Management System Proposal (15_10_25.pdf)
- SCOPE.md - Complete scope definition
- README.md - System overview

---

## 🎯 Executive Summary

### **System Overview**
The Inventory Management System is a comprehensive, full-featured inventory control solution designed for Jamia Binoria Aalamia, implementing 14 core modules with advanced features including:
- Multi-location stock tracking with Zone-Aisle-Rack-Bin precision
- 3-level approval workflow (L1/L2/L3) based on amount and price variance
- FEFO (First Expired, First Out) enforcement for perishables
- Recipe costing with ideal vs actual variance tracking
- AI-powered purchase anomaly detection
- Comprehensive reporting (16 report types)
- Real-time alerts and notifications (10 alert types)

### **Technical Stack**
- **Frontend**: Next.js 15.3.3, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL 17.4.1), Row Level Security (RLS)
- **AI/ML**: Google Genkit with Gemini 2.0 Flash
- **State Management**: Tanstack React Query
- **Visualization**: Recharts (donut charts, bar charts, composed charts)
- **Database**: PostgreSQL 17.4.1 on Supabase (Project: bfewxhtlrxedlifiakok)

### **Key Metrics**
- **30+ Database Tables**: Comprehensive data model
- **80+ API Endpoints**: RESTful API architecture
- **14 Sub-Modules**: Complete feature coverage
- **7 User Roles**: Granular access control
- **99.9% Uptime**: High availability target
- **< 2s Response Time**: Performance target

---

## 🏗️ System Architecture

### **High-Level Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                   │
│  Next.js 15.3.3 + React 18 + TypeScript + Tailwind CSS     │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTPS / WebSocket
                  │
┌─────────────────▼───────────────────────────────────────────┐
│              Application Server Layer                        │
│         Next.js API Routes + Server Components              │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Inventory  │  │  Procurement │  │   Reporting  │     │
│  │    Module    │  │    Module    │  │    Module    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Workflow   │  │     Alerts   │  │      AI      │     │
│  │    Engine    │  │    Engine    │  │    Engine    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼──────┐    ┌──────▼────────┐
│   Supabase   │    │  Google       │
│  PostgreSQL  │    │  Genkit AI    │
│              │    │               │
│  - Auth      │    │ - Gemini 2.0  │
│  - RLS       │    │ - Insights    │
│  - Real-time │    │ - Anomaly     │
│  - Storage   │    │   Detection   │
└──────────────┘    └───────────────┘
```

### **Component Architecture**

#### **1. Frontend Components**

```typescript
src/
├── app/
│   ├── dashboard/
│   │   ├── inventory/
│   │   │   ├── page.tsx                    // Main inventory dashboard
│   │   │   ├── items/
│   │   │   │   ├── page.tsx                // Item list
│   │   │   │   ├── [id]/page.tsx           // Item detail
│   │   │   │   └── new/page.tsx            // Create item
│   │   │   ├── stock-movements/
│   │   │   │   └── page.tsx                // Stock movement history
│   │   │   ├── physical-counts/
│   │   │   │   └── page.tsx                // Physical count management
│   │   │   └── reports/
│   │   │       └── page.tsx                // Inventory reports
│   │   ├── procurement/
│   │   │   ├── requisitions/page.tsx       // Purchase requisitions
│   │   │   ├── purchase-orders/page.tsx    // Purchase orders
│   │   │   ├── grn/page.tsx                // Goods receipt notes
│   │   │   └── vendors/page.tsx            // Vendor management
│   │   └── settings/
│   │       └── inventory/page.tsx          // Inventory settings
│   └── api/
│       ├── inventory/
│       │   ├── items/route.ts              // Item CRUD operations
│       │   ├── stock-movements/route.ts    // Stock movement operations
│       │   ├── categories/route.ts         // Category operations
│       │   └── locations/route.ts          // Location operations
│       ├── procurement/
│       │   ├── requisitions/route.ts       // PR operations
│       │   ├── purchase-orders/route.ts    // PO operations
│       │   ├── grn/route.ts                // GRN operations
│       │   └── vendors/route.ts            // Vendor operations
│       └── reports/
│           ├── stock-status/route.ts       // Stock status report
│           ├── variance/route.ts           // Variance report
│           └── vendor-performance/route.ts // Vendor performance
│
├── components/
│   ├── inventory/
│   │   ├── ItemForm.tsx                    // Item create/edit form
│   │   ├── StockMovementForm.tsx           // Stock movement form
│   │   ├── PhysicalCountForm.tsx           // Physical count form
│   │   ├── ItemTable.tsx                   // Item listing table
│   │   ├── StockLevelIndicator.tsx         // Visual stock level
│   │   └── LocationPicker.tsx              // Location selector
│   ├── procurement/
│   │   ├── RequisitionForm.tsx             // PR form
│   │   ├── PurchaseOrderForm.tsx           // PO form
│   │   ├── GRNForm.tsx                     // GRN form
│   │   ├── VendorForm.tsx                  // Vendor form
│   │   └── ApprovalWorkflow.tsx            // Approval component
│   ├── charts/
│   │   ├── DonutChart.tsx                  // Reusable donut chart
│   │   ├── BarChart.tsx                    // Reusable bar chart
│   │   └── ComposedChart.tsx               // Multi-series chart
│   └── ui/                                 // shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── table.tsx
│       └── ...
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                       // Supabase client
│   │   ├── server.ts                       // Server-side client
│   │   └── database.types.ts               // Generated types
│   ├── inventory/
│   │   ├── calculations.ts                 // Business logic
│   │   ├── validations.ts                  // Validation rules
│   │   └── helpers.ts                      // Utility functions
│   └── hooks/
│       ├── useInventoryItems.ts            // Items hook
│       ├── useStockMovements.ts            // Stock movements hook
│       └── usePurchaseOrders.ts            // PO hook
│
└── types/
    ├── inventory.ts                        // Inventory types
    ├── procurement.ts                      // Procurement types
    └── workflow.ts                         // Workflow types
```

#### **2. Backend Services**

```typescript
// Service Layer Architecture
services/
├── inventory/
│   ├── itemService.ts
│   │   ├── createItem()
│   │   ├── updateItem()
│   │   ├── deleteItem()
│   │   ├── checkStockLevel()
│   │   └── generateReorderSuggestion()
│   ├── stockMovementService.ts
│   │   ├── recordMovement()
│   │   ├── adjustStock()
│   │   ├── transferStock()
│   │   └── calculateValue()
│   └── locationService.ts
│       ├── assignLocation()
│       ├── findItemLocation()
│       └── checkCapacity()
│
├── procurement/
│   ├── requisitionService.ts
│   │   ├── createRequisition()
│   │   ├── approveRequisition()
│   │   └── convertToPO()
│   ├── purchaseOrderService.ts
│   │   ├── createPO()
│   │   ├── checkPriceVariance()
│   │   ├── routeForApproval()
│   │   └── sendToVendor()
│   └── grnService.ts
│       ├── receiveGoods()
│       ├── performQC()
│       └── updateStock()
│
├── workflow/
│   ├── approvalService.ts
│   │   ├── routeApproval()
│   │   ├── checkApprovalLimit()
│   │   ├── sendNotification()
│   │   └── recordApproval()
│   └── alertService.ts
│       ├── checkLowStock()
│       ├── checkExpiry()
│       ├── checkPriceVariance()
│       └── sendAlert()
│
└── reporting/
    ├── reportService.ts
    │   ├── generateStockReport()
    │   ├── generateVarianceReport()
    │   └── exportReport()
    └── analyticsService.ts
        ├── calculateABC()
        ├── analyzeMovement()
        └── predictDemand()
```

---

## 💾 Database Design

### **Database Schema Overview**

**Total Tables**: 32 tables organized in 6 functional groups

#### **Table Groups**

1. **Core Inventory** (8 tables)
   - inventory_categories
   - inventory_items
   - item_batches
   - storage_locations
   - stock_movements
   - item_warranties
   - item_alternates
   - uom_conversions

2. **Procurement** (10 tables)
   - vendors
   - purchase_requisitions
   - purchase_requisition_items
   - purchase_orders
   - purchase_order_items
   - goods_receipt_notes
   - grn_items
   - price_history
   - vendor_contracts
   - vendor_performance

3. **Department & Requisitions** (4 tables)
   - departments
   - department_requisitions
   - department_requisition_items
   - issue_slips
   - issue_slip_items

4. **Recipe & Costing** (3 tables)
   - recipes
   - recipe_ingredients
   - consumption_variance

5. **Physical Counts & Auditing** (4 tables)
   - physical_counts
   - physical_count_items
   - theft_incidents
   - stock_adjustments

6. **Donations & Tracking** (3 tables)
   - donors
   - donations
   - donation_items

### **Detailed Table Specifications**

#### **1. inventory_items**

```sql
CREATE TABLE inventory_items (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Basic Information
    item_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES inventory_categories(id),
    sub_category VARCHAR(100),
    item_type VARCHAR(50) NOT NULL, -- 'RAW_MATERIAL', 'FINISHED_GOODS', 'CONSUMABLE', 'EQUIPMENT', 'FIXED_ASSET'

    -- Unit of Measure
    base_unit VARCHAR(50) NOT NULL, -- 'KG', 'LITER', 'PCS', 'BOX', etc.
    alternative_units JSONB DEFAULT '[]', -- [{unit: 'BOX', conversion: 12}]

    -- Stock Levels
    current_stock DECIMAL(15,3) DEFAULT 0 NOT NULL,
    reserved_stock DECIMAL(15,3) DEFAULT 0 NOT NULL,
    available_stock DECIMAL(15,3) GENERATED ALWAYS AS (current_stock - reserved_stock) STORED,
    opening_stock DECIMAL(15,3) DEFAULT 0,

    -- Control Levels (Min/Max/Reorder)
    minimum_stock DECIMAL(15,3) DEFAULT 0 NOT NULL,
    maximum_stock DECIMAL(15,3) DEFAULT 0 NOT NULL,
    reorder_level DECIMAL(15,3) DEFAULT 0 NOT NULL,
    reorder_quantity DECIMAL(15,3) DEFAULT 0 NOT NULL,

    -- Costing
    unit_cost DECIMAL(15,2) DEFAULT 0 NOT NULL,
    average_cost DECIMAL(15,2) DEFAULT 0 NOT NULL,
    last_purchase_price DECIMAL(15,2) DEFAULT 0,
    standard_cost DECIMAL(15,2) DEFAULT 0,
    selling_price DECIMAL(15,2) DEFAULT 0,
    total_value DECIMAL(18,2) GENERATED ALWAYS AS (current_stock * average_cost) STORED,

    -- Location & Storage
    primary_location_id UUID REFERENCES storage_locations(id),
    storage_location_code VARCHAR(100), -- Format: ZONE-AISLE-RACK-BIN
    bin_location VARCHAR(100),

    -- Lifecycle & Tracking
    has_expiry BOOLEAN DEFAULT false,
    shelf_life_days INTEGER,
    has_batch BOOLEAN DEFAULT false,
    has_serial BOOLEAN DEFAULT false,
    has_warranty BOOLEAN DEFAULT false,
    warranty_period_days INTEGER,

    -- Vendor & Procurement
    preferred_vendor_id UUID REFERENCES vendors(id),
    alternate_vendor_ids UUID[],
    lead_time_days INTEGER DEFAULT 0,
    last_purchase_date DATE,
    last_grn_date DATE,
    last_issue_date DATE,

    -- Classification
    abc_classification VARCHAR(1), -- 'A', 'B', 'C'
    movement_type VARCHAR(50), -- 'FAST_MOVING', 'SLOW_MOVING', 'NON_MOVING', 'DEAD_STOCK'
    criticality VARCHAR(50), -- 'CRITICAL', 'ESSENTIAL', 'NON_ESSENTIAL'

    -- Status & Flags
    is_active BOOLEAN DEFAULT true,
    is_perishable BOOLEAN DEFAULT false,
    is_hazardous BOOLEAN DEFAULT false,
    is_controlled BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- 'ACTIVE', 'INACTIVE', 'DISCONTINUED', 'OBSOLETE'

    -- Metadata
    tags VARCHAR(100)[],
    custom_fields JSONB DEFAULT '{}',
    notes TEXT,

    -- Images & Documents
    primary_image_url TEXT,
    additional_images TEXT[],
    documents JSONB DEFAULT '[]', -- [{name: 'spec.pdf', url: 'https://...'}]

    -- Organization
    organization_unit_id UUID REFERENCES organization_units(id),

    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id),

    -- Constraints
    CONSTRAINT check_stock_positive CHECK (current_stock >= 0),
    CONSTRAINT check_reorder_logic CHECK (reorder_level >= minimum_stock),
    CONSTRAINT check_max_logic CHECK (maximum_stock >= minimum_stock)
);

-- Indexes for Performance
CREATE INDEX idx_inventory_items_code ON inventory_items(item_code);
CREATE INDEX idx_inventory_items_category ON inventory_items(category_id);
CREATE INDEX idx_inventory_items_location ON inventory_items(primary_location_id);
CREATE INDEX idx_inventory_items_vendor ON inventory_items(preferred_vendor_id);
CREATE INDEX idx_inventory_items_status ON inventory_items(status) WHERE is_active = true;
CREATE INDEX idx_inventory_items_stock_level ON inventory_items(current_stock, reorder_level) WHERE is_active = true;
CREATE INDEX idx_inventory_items_abc ON inventory_items(abc_classification) WHERE is_active = true;

-- Trigger for updated_at
CREATE TRIGGER update_inventory_items_updated_at
    BEFORE UPDATE ON inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comment
COMMENT ON TABLE inventory_items IS 'Master table for all inventory items with comprehensive tracking';
```

#### **2. vendors**

```sql
CREATE TABLE vendors (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Basic Information
    vendor_code VARCHAR(50) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_legal_name VARCHAR(255),
    vendor_type VARCHAR(50) NOT NULL, -- 'SUPPLIER', 'MANUFACTURER', 'DISTRIBUTOR', 'CONTRACTOR'

    -- Contact Information
    contact_person VARCHAR(100),
    designation VARCHAR(100),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),

    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Pakistan',

    -- Business Details
    tax_registration_number VARCHAR(100), -- NTN in Pakistan
    sales_tax_registration VARCHAR(100), -- STRN
    company_registration VARCHAR(100),

    -- Categories & Products
    product_categories VARCHAR(100)[], -- ['FOOD', 'ELECTRICAL', 'HYGIENE']
    primary_category VARCHAR(100),

    -- Financial Terms
    payment_terms VARCHAR(50) NOT NULL, -- 'CASH', 'BANK_TRANSFER', 'CREDIT'
    credit_days INTEGER DEFAULT 0, -- Net 15, Net 30, Net 45
    credit_limit DECIMAL(15,2) DEFAULT 0,
    excess_charges_percentage DECIMAL(5,2) DEFAULT 0, -- Late payment penalty
    discount_percentage DECIMAL(5,2) DEFAULT 0,

    -- Banking Information
    bank_name VARCHAR(100),
    account_title VARCHAR(100),
    account_number VARCHAR(50),
    iban VARCHAR(50),
    branch_name VARCHAR(100),
    branch_code VARCHAR(20),

    -- Contract & Legal
    contract_start_date DATE,
    contract_end_date DATE,
    contract_terms TEXT,
    contract_document_url TEXT,

    -- Performance Metrics
    vendor_rating DECIMAL(3,2) DEFAULT 0, -- Out of 5.00
    quality_rating DECIMAL(3,2) DEFAULT 0,
    delivery_rating DECIMAL(3,2) DEFAULT 0,
    price_rating DECIMAL(3,2) DEFAULT 0,
    service_rating DECIMAL(3,2) DEFAULT 0,

    total_orders INTEGER DEFAULT 0,
    total_order_value DECIMAL(18,2) DEFAULT 0,
    on_time_deliveries INTEGER DEFAULT 0,
    late_deliveries INTEGER DEFAULT 0,
    on_time_delivery_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE
            WHEN total_orders > 0 THEN (on_time_deliveries::DECIMAL / total_orders * 100)
            ELSE 0
        END
    ) STORED,

    average_delivery_days DECIMAL(5,2) DEFAULT 0,
    average_lead_time_days DECIMAL(5,2) DEFAULT 0,

    -- Approval & Status
    status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED', 'BLOCKED', 'BLACKLISTED'
    approval_status VARCHAR(50) DEFAULT 'PENDING',
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,

    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    verification_documents JSONB DEFAULT '[]',

    -- Additional Information
    notes TEXT,
    tags VARCHAR(100)[],
    custom_fields JSONB DEFAULT '{}',

    -- Metadata
    is_active BOOLEAN DEFAULT true,
    organization_unit_id UUID REFERENCES organization_units(id),

    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id),

    -- Constraints
    CONSTRAINT check_rating_range CHECK (vendor_rating >= 0 AND vendor_rating <= 5),
    CONSTRAINT check_credit_days CHECK (credit_days >= 0)
);

-- Indexes
CREATE INDEX idx_vendors_code ON vendors(vendor_code);
CREATE INDEX idx_vendors_company ON vendors(company_name);
CREATE INDEX idx_vendors_status ON vendors(status) WHERE is_active = true;
CREATE INDEX idx_vendors_rating ON vendors(vendor_rating DESC) WHERE is_active = true;
CREATE INDEX idx_vendors_category ON vendors USING GIN(product_categories);

-- Comment
COMMENT ON TABLE vendors IS 'Comprehensive vendor master with performance tracking';
```

#### **3. purchase_orders**

```sql
CREATE TABLE purchase_orders (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- PO Information
    po_number VARCHAR(50) UNIQUE NOT NULL,
    po_date DATE NOT NULL DEFAULT CURRENT_DATE,
    requisition_id UUID REFERENCES purchase_requisitions(id),
    vendor_id UUID REFERENCES vendors(id) NOT NULL,

    -- Delivery Information
    expected_delivery_date DATE,
    delivery_location_id UUID REFERENCES storage_locations(id),
    delivery_address TEXT,

    -- Financial Information
    currency VARCHAR(10) DEFAULT 'PKR',
    exchange_rate DECIMAL(10,4) DEFAULT 1.0,
    subtotal DECIMAL(18,2) DEFAULT 0,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(18,2) DEFAULT 0,
    tax_percentage DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(18,2) DEFAULT 0,
    freight_charges DECIMAL(18,2) DEFAULT 0,
    other_charges DECIMAL(18,2) DEFAULT 0,
    total_amount DECIMAL(18,2) DEFAULT 0,

    -- Payment Terms
    payment_terms VARCHAR(50),
    payment_due_date DATE,
    advance_payment_percentage DECIMAL(5,2) DEFAULT 0,
    advance_payment_amount DECIMAL(18,2) DEFAULT 0,

    -- Price Variance
    has_price_variance BOOLEAN DEFAULT false,
    price_variance_percentage DECIMAL(5,2) DEFAULT 0,
    price_variance_reason TEXT,
    variance_approved_by UUID REFERENCES auth.users(id),
    variance_approved_at TIMESTAMP WITH TIME ZONE,

    -- Approval Workflow
    approval_level INTEGER DEFAULT 1, -- 1, 2, or 3
    current_approver_id UUID REFERENCES auth.users(id),
    approval_status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'L1_APPROVED', 'L2_APPROVED', 'L3_APPROVED', 'REJECTED'

    l1_approver_id UUID REFERENCES auth.users(id),
    l1_approved_at TIMESTAMP WITH TIME ZONE,
    l1_comments TEXT,

    l2_approver_id UUID REFERENCES auth.users(id),
    l2_approved_at TIMESTAMP WITH TIME ZONE,
    l2_comments TEXT,

    l3_approver_id UUID REFERENCES auth.users(id),
    l3_approved_at TIMESTAMP WITH TIME ZONE,
    l3_comments TEXT,

    rejection_reason TEXT,
    rejected_by UUID REFERENCES auth.users(id),
    rejected_at TIMESTAMP WITH TIME ZONE,

    -- Status Tracking
    status VARCHAR(50) DEFAULT 'DRAFT', -- 'DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'SENT', 'ACKNOWLEDGED', 'PARTIALLY_RECEIVED', 'FULLY_RECEIVED', 'CANCELLED', 'CLOSED'
    sent_to_vendor_at TIMESTAMP WITH TIME ZONE,
    vendor_acknowledged_at TIMESTAMP WITH TIME ZONE,

    -- Receipt Tracking
    total_items_ordered INTEGER DEFAULT 0,
    total_items_received INTEGER DEFAULT 0,
    total_quantity_ordered DECIMAL(15,3) DEFAULT 0,
    total_quantity_received DECIMAL(15,3) DEFAULT 0,
    receipt_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE
            WHEN total_quantity_ordered > 0 THEN (total_quantity_received / total_quantity_ordered * 100)
            ELSE 0
        END
    ) STORED,

    -- Additional Information
    reference_number VARCHAR(100),
    quotation_number VARCHAR(100),
    quotation_date DATE,
    terms_and_conditions TEXT,
    special_instructions TEXT,
    notes TEXT,

    -- Department & Organization
    requesting_department_id UUID REFERENCES departments(id),
    organization_unit_id UUID REFERENCES organization_units(id),

    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id),

    -- Constraints
    CONSTRAINT check_po_total CHECK (total_amount >= 0),
    CONSTRAINT check_approval_level CHECK (approval_level BETWEEN 1 AND 3)
);

-- Indexes
CREATE INDEX idx_po_number ON purchase_orders(po_number);
CREATE INDEX idx_po_vendor ON purchase_orders(vendor_id);
CREATE INDEX idx_po_requisition ON purchase_orders(requisition_id);
CREATE INDEX idx_po_status ON purchase_orders(status) WHERE status != 'CANCELLED';
CREATE INDEX idx_po_approval ON purchase_orders(approval_status, current_approver_id) WHERE approval_status = 'PENDING';
CREATE INDEX idx_po_date ON purchase_orders(po_date DESC);

-- Comment
COMMENT ON TABLE purchase_orders IS 'Purchase orders with 3-level approval workflow and price variance tracking';
```

### **Additional Tables** (Abbreviated)

Due to length constraints, here are the remaining critical tables in abbreviated form:

#### **4. stock_movements**
- Tracks all IN/OUT movements (GRN, Issues, Transfers, Adjustments)
- Links to reference documents (PO, Requisition, Physical Count)
- Includes batch/serial tracking
- Automatic inventory value calculation

#### **5. recipes & recipe_ingredients**
- Recipe master with portion size and cost
- Ingredient linkage to inventory items
- Ideal consumption calculation
- Food cost percentage auto-calc

#### **6. physical_counts & physical_count_items**
- Scheduled count management
- Variance calculation (Physical - System)
- Photo attachment support
- Approval workflow for variances

#### **7. departments**
- Restaurant departments (Continental, Chinese, BBQ, Tandoor, Beverages, Dessert)
- General departments (Education, Admin, Construction, etc.)
- Department head assignment

#### **8. storage_locations**
- Zone → Aisle → Rack → Bin hierarchy
- Capacity tracking
- Location code: ZONE-AISLE-RACK-BIN

---

## 🔌 API Specifications

### **RESTful API Design Principles**

1. **Base URL**: `/api/v1/inventory/`
2. **Authentication**: Supabase Auth with JWT tokens
3. **Authorization**: Row Level Security (RLS) + Role-based permissions
4. **Request Format**: JSON
5. **Response Format**: JSON with consistent structure
6. **HTTP Methods**: GET, POST, PUT, PATCH, DELETE
7. **Status Codes**: Standard HTTP codes (200, 201, 400, 401, 403, 404, 500)

### **Standard Response Format**

```typescript
// Success Response
{
  "success": true,
  "data": {...} | [...],
  "message": "Operation successful",
  "timestamp": "2025-10-25T01:00:00Z"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "Inventory item not found",
    "details": {}
  },
  "timestamp": "2025-10-25T01:00:00Z"
}

// Paginated Response
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total": 1247,
    "total_pages": 25,
    "has_next": true,
    "has_prev": false
  },
  "timestamp": "2025-10-25T01:00:00Z"
}
```

### **Core API Endpoints**

#### **Inventory Items**

```typescript
// GET /api/v1/inventory/items
// List all inventory items with filtering and pagination
GET /api/v1/inventory/items?page=1&per_page=50&category=FOOD&status=ACTIVE&low_stock=true

Response: {
  success: true,
  data: [
    {
      id: "uuid",
      item_code: "CONCROCKERY-0004/0009",
      name: "LASSI GLASS",
      category: {
        id: "uuid",
        name: "CONSUMABLE - CROCKERY ITEMS"
      },
      current_stock: 21.00,
      available_stock: 16.00,
      reorder_level: 15.00,
      minimum_stock: 10.00,
      maximum_stock: 50.00,
      unit_cost: 139.00,
      total_value: 2778.00,
      stock_status: "LOW_STOCK", // ADEQUATE, LOW_STOCK, OUT_OF_STOCK, EXCESS
      location: {
        code: "A1-R2-B5",
        name: "JAMIA STORE"
      },
      vendor: {
        id: "uuid",
        name: "Metro Cash & Carry"
      },
      last_purchase_date: "2024-12-15"
    }
  ],
  pagination: {...}
}

// POST /api/v1/inventory/items
// Create new inventory item
POST /api/v1/inventory/items
Body: {
  item_code: "CONCROCKERY-0010/0009",
  name: "DINNER PLATE",
  description: "10-inch ceramic dinner plate",
  category_id: "uuid",
  base_unit: "PCS",
  minimum_stock: 20,
  maximum_stock: 100,
  reorder_level: 30,
  reorder_quantity: 50,
  unit_cost: 250.00,
  preferred_vendor_id: "uuid",
  primary_location_id: "uuid"
}

// PUT /api/v1/inventory/items/:id
// Update inventory item (full replacement)

// PATCH /api/v1/inventory/items/:id
// Partial update inventory item

// DELETE /api/v1/inventory/items/:id
// Soft delete (set is_active = false)

// GET /api/v1/inventory/items/:id
// Get single item details with related data
Response: {
  success: true,
  data: {
    ...item_data,
    stock_movements: [...], // Recent 10 movements
    batches: [...], // Active batches
    locations: [...], // All locations
    purchase_history: [...] // Recent purchases
  }
}

// GET /api/v1/inventory/items/:id/stock-history
// Get complete stock movement history for an item

// POST /api/v1/inventory/items/:id/adjust-stock
// Adjust stock quantity with reason
Body: {
  adjustment_type: "INCREASE" | "DECREASE",
  quantity: 10,
  reason_code: "PHYSICAL_COUNT_VARIANCE",
  reason_notes: "Physical count variance approved",
  approved_by: "uuid"
}
```

#### **Stock Movements**

```typescript
// POST /api/v1/inventory/stock-movements
// Record stock movement
Body: {
  movement_type: "GRN" | "ISSUE" | "TRANSFER" | "ADJUSTMENT" | "RETURN",
  movement_date: "2025-10-25",
  items: [
    {
      item_id: "uuid",
      quantity: 50,
      unit_cost: 139.00,
      batch_number: "BATCH-2025-001",
      expiry_date: "2026-10-25",
      from_location: "uuid",
      to_location: "uuid"
    }
  ],
  reference_type: "PURCHASE_ORDER",
  reference_id: "uuid",
  notes: "GRN for PO-2025-001"
}

// GET /api/v1/inventory/stock-movements
// List all stock movements with filters
GET /api/v1/inventory/stock-movements?
  start_date=2025-10-01&
  end_date=2025-10-25&
  movement_type=GRN&
  item_id=uuid

// GET /api/v1/inventory/stock-movements/:id
// Get movement details
```

#### **Purchase Orders**

```typescript
// POST /api/v1/procurement/purchase-orders
// Create purchase order
Body: {
  requisition_id: "uuid",
  vendor_id: "uuid",
  po_date: "2025-10-25",
  expected_delivery_date: "2025-11-05",
  payment_terms: "NET_30",
  items: [
    {
      item_id: "uuid",
      quantity: 100,
      unit_price: 150.00,
      last_purchase_price: 145.00, // For variance calculation
      discount_percentage: 5,
      tax_percentage: 17,
      total: 15750.00
    }
  ],
  freight_charges: 500.00,
  notes: "Urgent requirement"
}

Response: {
  success: true,
  data: {
    id: "uuid",
    po_number: "PO-2025-001",
    total_amount: 16250.00,
    approval_required: true,
    approval_level: 2, // Based on amount and price variance
    current_approver_id: "uuid",
    price_variance_detected: true,
    price_variance_percentage: 3.45,
    status: "PENDING_APPROVAL"
  }
}

// PUT /api/v1/procurement/purchase-orders/:id/approve
// Approve PO (L1/L2/L3)
Body: {
  approval_level: 2,
  comments: "Approved - price variance justified",
  approver_id: "uuid"
}

// PUT /api/v1/procurement/purchase-orders/:id/reject
// Reject PO
Body: {
  rejection_reason: "Price too high - negotiate better rate",
  rejected_by: "uuid"
}

// GET /api/v1/procurement/purchase-orders/pending-approval
// Get all POs pending approval for current user
```

#### **Goods Receipt Notes (GRN)**

```typescript
// POST /api/v1/procurement/grn
// Create GRN
Body: {
  purchase_order_id: "uuid",
  receipt_date: "2025-10-25",
  items: [
    {
      po_item_id: "uuid",
      item_id: "uuid",
      ordered_quantity: 100,
      received_quantity: 98, // Partial receipt
      rejected_quantity: 2,
      rejection_reason: "Damaged packaging",
      batch_number: "BATCH-2025-001",
      expiry_date: "2026-10-25",
      unit_cost: 150.00,
      location_id: "uuid",
      quality_check_passed: true,
      qc_notes: "Good condition"
    }
  ],
  received_by: "uuid",
  notes: "2 items damaged, rest accepted"
}

Response: {
  success: true,
  data: {
    grn_number: "GRN-2025-001",
    po_number: "PO-2025-001",
    vendor: "Metro Cash & Carry",
    total_received: 98,
    total_rejected: 2,
    receipt_percentage: 98,
    stock_updated: true,
    invoice_matching_pending: true
  }
}
```

### **Complete API Endpoint List** (80+ endpoints)

```
Inventory Items: 12 endpoints
Stock Movements: 8 endpoints
Categories: 6 endpoints
Locations: 8 endpoints
Batches: 6 endpoints

Procurement:
- Purchase Requisitions: 10 endpoints
- Purchase Orders: 12 endpoints
- GRN: 8 endpoints
- Vendors: 10 endpoints

Departments:
- Department Master: 6 endpoints
- Department Requisitions: 8 endpoints
- Issue Slips: 8 endpoints

Recipes:
- Recipe Master: 8 endpoints
- Recipe Ingredients: 6 endpoints
- Consumption Variance: 4 endpoints

Physical Counts:
- Physical Count: 10 endpoints
- Theft Incidents: 6 endpoints

Donations:
- Donor Master: 6 endpoints
- Donations: 8 endpoints

Reports: 16 endpoints (one per report type)
Alerts: 10 endpoints (configure and manage alerts)
Dashboard: 6 endpoints (KPIs and charts)

TOTAL: 186 endpoints
```

---

## 🔐 Security Architecture

### **Authentication**
- **Method**: Supabase Auth with JWT tokens
- **Token Storage**: HTTP-only cookies + localStorage
- **Token Refresh**: Automatic refresh on expiry
- **Session Management**: 24-hour sessions with auto-refresh

### **Authorization - Row Level Security (RLS)**

```sql
-- Example RLS Policy for inventory_items
CREATE POLICY "Users can view items in their organization"
ON inventory_items FOR SELECT
USING (
  organization_unit_id IN (
    SELECT organization_unit_id
    FROM user_profiles
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Only admins and store managers can insert items"
ON inventory_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND role IN ('ADMIN', 'STORE_MANAGER')
  )
);

CREATE POLICY "Approvers can update POs pending their approval"
ON purchase_orders FOR UPDATE
USING (
  current_approver_id = auth.uid()
  AND approval_status = 'PENDING'
);
```

### **Role-Based Access Control**

```typescript
// Permission Matrix
enum Permission {
  // Inventory
  INVENTORY_VIEW = 'inventory.view',
  INVENTORY_CREATE = 'inventory.create',
  INVENTORY_UPDATE = 'inventory.update',
  INVENTORY_DELETE = 'inventory.delete',
  INVENTORY_ADJUST_STOCK = 'inventory.adjust_stock',

  // Purchase Orders
  PO_VIEW = 'po.view',
  PO_CREATE = 'po.create',
  PO_APPROVE_L1 = 'po.approve.l1',
  PO_APPROVE_L2 = 'po.approve.l2',
  PO_APPROVE_L3 = 'po.approve.l3',

  // GRN
  GRN_CREATE = 'grn.create',
  GRN_APPROVE = 'grn.approve',

  // Reports
  REPORTS_VIEW = 'reports.view',
  REPORTS_EXPORT = 'reports.export',

  // Admin
  ADMIN_USERS = 'admin.users',
  ADMIN_CONFIG = 'admin.config'
}

const rolePermissions: Record<UserRole, Permission[]> = {
  ADMIN: [/* ALL PERMISSIONS */],

  STORE_KEEPER: [
    Permission.INVENTORY_VIEW,
    Permission.GRN_CREATE,
    Permission.GRN_APPROVE,
    Permission.INVENTORY_ADJUST_STOCK, // with limits
  ],

  PURCHASING_OFFICER: [
    Permission.INVENTORY_VIEW,
    Permission.PO_VIEW,
    Permission.PO_CREATE,
  ],

  APPROVER_L1: [
    Permission.PO_VIEW,
    Permission.PO_APPROVE_L1,
  ],

  APPROVER_L2: [
    Permission.PO_VIEW,
    Permission.PO_APPROVE_L1,
    Permission.PO_APPROVE_L2,
  ],

  APPROVER_L3: [
    Permission.PO_VIEW,
    Permission.PO_APPROVE_L1,
    Permission.PO_APPROVE_L2,
    Permission.PO_APPROVE_L3,
  ],

  FINANCE: [
    Permission.INVENTORY_VIEW,
    Permission.PO_VIEW,
    Permission.REPORTS_VIEW,
    Permission.REPORTS_EXPORT,
  ]
};
```

---

## 🔄 Business Logic & Workflows

### **1. Purchase Approval Workflow**

```typescript
/**
 * Determines approval level based on PO amount and price variance
 */
function determineApprovalLevel(po: PurchaseOrder): {
  level: 1 | 2 | 3;
  approver_id: string;
  reason: string;
} {
  const { total_amount, price_variance_percentage } = po;

  // L3: Unlimited approval required
  if (total_amount > 200000 || price_variance_percentage > 10) {
    return {
      level: 3,
      approver_id: getL3Approver(),
      reason: total_amount > 200000
        ? `Amount exceeds PKR 200,000`
        : `Price variance ${price_variance_percentage}% exceeds 10%`
    };
  }

  // L2: Up to PKR 200,000 or variance 5-10%
  if (total_amount > 50000 || price_variance_percentage > 5) {
    return {
      level: 2,
      approver_id: getL2Approver(),
      reason: total_amount > 50000
        ? `Amount exceeds PKR 50,000`
        : `Price variance ${price_variance_percentage}% exceeds 5%`
    };
  }

  // L1: Up to PKR 50,000 and variance <= 5%
  return {
    level: 1,
    approver_id: getL1Approver(),
    reason: 'Standard approval'
  };
}

/**
 * Calculate price variance for each PO item
 */
function calculatePriceVariance(
  currentPrice: number,
  lastPrice: number
): {
  variance: number;
  variancePercentage: number;
  requiresApproval: boolean;
} {
  const variance = currentPrice - lastPrice;
  const variancePercentage = (variance / lastPrice) * 100;
  const requiresApproval = Math.abs(variancePercentage) > 5;

  return { variance, variancePercentage, requiresApproval };
}
```

### **2. Stock Level Monitoring**

```typescript
/**
 * Daily batch job to check stock levels and generate reorder suggestions
 */
async function checkStockLevelsAndGenerateReorders() {
  const lowStockItems = await db.query(`
    SELECT * FROM inventory_items
    WHERE is_active = true
    AND current_stock <= reorder_level
  `);

  for (const item of lowStockItems) {
    // Calculate reorder quantity
    const reorderQty = item.maximum_stock - item.current_stock;

    // Check if reorder suggestion already exists
    const existingSuggestion = await db.query(`
      SELECT * FROM reorder_suggestions
      WHERE item_id = $1 AND status = 'PENDING'
    `, [item.id]);

    if (!existingSuggestion) {
      // Create reorder suggestion
      await db.query(`
        INSERT INTO reorder_suggestions
        (item_id, suggested_quantity, reason, status)
        VALUES ($1, $2, $3, $4)
      `, [
        item.id,
        reorderQty,
        'Stock at or below reorder level',
        'PENDING'
      ]);

      // Send notification
      await sendLowStockAlert({
        item: item,
        currentStock: item.current_stock,
        reorderLevel: item.reorder_level,
        suggestedQuantity: reorderQty
      });
    }
  }
}
```

### **3. FEFO (First Expired First Out) Logic**

```typescript
/**
 * When issuing items with expiry dates, suggest oldest batch first
 */
async function suggestBatchForIssue(
  itemId: string,
  quantityNeeded: number
): Promise<{
  batches: Array<{
    batch_id: string;
    batch_number: string;
    quantity_available: number;
    expiry_date: Date;
    suggested_quantity: number;
  }>;
  fefo_compliant: boolean;
}> {
  // Get all available batches for this item, ordered by expiry date (FEFO)
  const batches = await db.query(`
    SELECT id, batch_number, quantity, expiry_date
    FROM item_batches
    WHERE item_id = $1
    AND quantity > 0
    AND expiry_date > CURRENT_DATE
    ORDER BY expiry_date ASC
  `, [itemId]);

  let remainingQty = quantityNeeded;
  const suggestions = [];

  for (const batch of batches) {
    if (remainingQty <= 0) break;

    const qtyFromBatch = Math.min(batch.quantity, remainingQty);
    suggestions.push({
      batch_id: batch.id,
      batch_number: batch.batch_number,
      quantity_available: batch.quantity,
      expiry_date: batch.expiry_date,
      suggested_quantity: qtyFromBatch
    });

    remainingQty -= qtyFromBatch;
  }

  return {
    batches: suggestions,
    fefo_compliant: true
  };
}
```

### **4. Recipe Variance Calculation**

```typescript
/**
 * Calculate ideal vs actual consumption variance for recipes
 */
async function calculateConsumptionVariance(
  recipeId: string,
  period: { start: Date; end: Date }
): Promise<{
  ideal_consumption: Array<{item: string; quantity: number}>;
  actual_consumption: Array<{item: string; quantity: number}>;
  variance: Array<{item: string; variance: number; variance_pct: number}>;
  total_variance_value: number;
}> {
  // Get number of dishes sold in period
  const dishesSold = await db.query(`
    SELECT COUNT(*) as count
    FROM sales_order_items soi
    JOIN sales_orders so ON soi.order_id = so.id
    WHERE soi.menu_item_id = (
      SELECT menu_item_id FROM recipes WHERE id = $1
    )
    AND so.order_date BETWEEN $2 AND $3
  `, [recipeId, period.start, period.end]);

  const count = dishesSold[0].count;

  // Get ideal consumption (recipe × count)
  const idealConsumption = await db.query(`
    SELECT
      ii.name as item,
      ri.quantity * $1 as ideal_quantity,
      ii.average_cost
    FROM recipe_ingredients ri
    JOIN inventory_items ii ON ri.inventory_item_id = ii.id
    WHERE ri.recipe_id = $2
  `, [count, recipeId]);

  // Get actual consumption from issue slips
  const actualConsumption = await db.query(`
    SELECT
      ii.name as item,
      SUM(isi.quantity) as actual_quantity,
      ii.average_cost
    FROM issue_slip_items isi
    JOIN issue_slips iss ON isi.issue_slip_id = iss.id
    JOIN inventory_items ii ON isi.item_id = ii.id
    WHERE iss.department_id = (
      SELECT department_id FROM recipes WHERE id = $1
    )
    AND iss.issue_date BETWEEN $2 AND $3
    GROUP BY ii.id, ii.name, ii.average_cost
  `, [recipeId, period.start, period.end]);

  // Calculate variance
  const variance = idealConsumption.map(ideal => {
    const actual = actualConsumption.find(a => a.item === ideal.item);
    const actualQty = actual?.actual_quantity || 0;
    const varianceQty = actualQty - ideal.ideal_quantity;
    const variancePct = (varianceQty / ideal.ideal_quantity) * 100;
    const varianceValue = varianceQty * ideal.average_cost;

    return {
      item: ideal.item,
      ideal_qty: ideal.ideal_quantity,
      actual_qty: actualQty,
      variance: varianceQty,
      variance_pct: variancePct,
      variance_value: varianceValue
    };
  });

  const totalVarianceValue = variance.reduce((sum, v) => sum + v.variance_value, 0);

  return {
    ideal_consumption: idealConsumption,
    actual_consumption: actualConsumption,
    variance: variance,
    total_variance_value: totalVarianceValue
  };
}
```

---

## 📊 Reporting & Analytics

### **Report Generation Architecture**

```typescript
interface ReportConfig {
  type: ReportType;
  filters: ReportFilters;
  format: 'PDF' | 'EXCEL' | 'CSV' | 'JSON';
  schedule?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    recipients: string[];
  };
}

class ReportGenerator {
  async generate(config: ReportConfig): Promise<Report> {
    // 1. Validate permissions
    await this.checkPermissions(config.type);

    // 2. Fetch data
    const data = await this.fetchReportData(config);

    // 3. Apply business logic
    const processed = await this.processData(data, config);

    // 4. Generate output
    const output = await this.formatOutput(processed, config.format);

    // 5. Store and return
    return await this.saveReport(output, config);
  }
}
```

### **16 Report Types Implementation**

Each report follows this structure:
```typescript
interface StockStatusReport {
  reportType: 'STOCK_STATUS';
  generatedAt: Date;
  filters: {
    category?: string;
    location?: string;
    stockStatus?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXCESS';
  };
  summary: {
    total_items: number;
    total_value: number;
    in_stock_items: number;
    low_stock_items: number;
    out_of_stock_items: number;
    excess_stock_items: number;
  };
  items: Array<{
    item_code: string;
    item_name: string;
    category: string;
    current_stock: number;
    min_stock: number;
    max_stock: number;
    reorder_level: number;
    stock_value: number;
    stock_status: string;
    days_to_stockout?: number;
  }>;
  charts: {
    stock_distribution: ChartData;
    value_by_category: ChartData;
    abc_analysis: ChartData;
  };
}
```

---

## 🔔 Alert & Notification System

### **Alert Engine Architecture**

```typescript
class AlertEngine {
  private alertRules: Map<AlertType, AlertRule>;

  async checkAlerts() {
    // Run all alert checks in parallel
    const alertChecks = Array.from(this.alertRules.values()).map(
      rule => this.checkAlertRule(rule)
    );

    const results = await Promise.all(alertChecks);

    // Process triggered alerts
    const triggeredAlerts = results.filter(r => r.triggered);

    // Send notifications
    await this.sendNotifications(triggeredAlerts);

    // Log alerts
    await this.logAlerts(triggeredAlerts);
  }

  private async checkAlertRule(rule: AlertRule): Promise<AlertResult> {
    switch (rule.type) {
      case 'LOW_STOCK':
        return await this.checkLowStock(rule);
      case 'EXPIRY':
        return await this.checkExpiry(rule);
      case 'PRICE_VARIANCE':
        return await this.checkPriceVariance(rule);
      // ... other alert types
    }
  }

  private async sendNotifications(alerts: AlertResult[]) {
    for (const alert of alerts) {
      // Email notification
      if (alert.recipients.email?.length > 0) {
        await this.emailService.send({
          to: alert.recipients.email,
          subject: alert.subject,
          body: alert.message,
          priority: alert.priority
        });
      }

      // SMS notification (if configured)
      if (alert.recipients.sms?.length > 0 && alert.priority === 'HIGH') {
        await this.smsService.send({
          to: alert.recipients.sms,
          message: alert.sms_message
        });
      }

      // In-app notification
      await this.createInAppNotification(alert);
    }
  }
}

// Alert configuration
const alertConfigurations: AlertRule[] = [
  {
    type: 'LOW_STOCK',
    schedule: 'DAILY',
    threshold: (item) => item.current_stock <= item.reorder_level,
    recipients: {
      email: ['purchasing@binoria.edu.pk'],
      sms: ['+92-XXX-XXXXXXX']
    },
    priority: 'MEDIUM',
    escalation: {
      after_days: 3,
      escalate_to: ['manager@binoria.edu.pk'],
      priority: 'HIGH'
    }
  },
  {
    type: 'EXPIRY_30_DAYS',
    schedule: 'DAILY',
    threshold: (batch) => {
      const daysToExpiry = daysBetween(new Date(), batch.expiry_date);
      return daysToExpiry <= 30 && daysToExpiry > 0;
    },
    recipients: {
      email: ['storekeeper@binoria.edu.pk']
    },
    priority: 'HIGH'
  }
];
```

---

## 🧪 Testing Strategy

### **Test Pyramid**

```
         /\
        /E2E\ (10%)
       /______\
      /        \
     /Integration\ (30%)
    /______________\
   /                \
  /   Unit Tests     \ (60%)
 /____________________\
```

### **Unit Testing**

```typescript
// Example: Testing stock level check function
describe('checkStockLevel', () => {
  it('should return LOW_STOCK when stock is at reorder level', () => {
    const item = {
      current_stock: 10,
      reorder_level: 10,
      minimum_stock: 5,
      maximum_stock: 50
    };

    const result = checkStockLevel(item);

    expect(result.status).toBe('LOW_STOCK');
    expect(result.reorder_suggested).toBe(true);
    expect(result.suggested_quantity).toBe(40);
  });

  it('should return EXCESS when stock exceeds maximum', () => {
    const item = {
      current_stock: 60,
      reorder_level: 15,
      minimum_stock: 10,
      maximum_stock: 50
    };

    const result = checkStockLevel(item);

    expect(result.status).toBe('EXCESS');
    expect(result.excess_quantity).toBe(10);
  });
});

// Example: Testing approval level determination
describe('determineApprovalLevel', () => {
  it('should require L3 approval for amount > 200K', () => {
    const po = { total_amount: 250000, price_variance_percentage: 0 };
    const result = determineApprovalLevel(po);

    expect(result.level).toBe(3);
    expect(result.reason).toContain('200,000');
  });

  it('should require L2 approval for price variance > 5%', () => {
    const po = { total_amount: 30000, price_variance_percentage: 7.5 };
    const result = determineApprovalLevel(po);

    expect(result.level).toBe(2);
    expect(result.reason).toContain('variance');
  });
});
```

### **Integration Testing**

```typescript
// Example: Testing complete PR → PO → GRN → Stock Update flow
describe('Purchase Workflow Integration', () => {
  it('should complete full purchase flow and update stock', async () => {
    // 1. Create Purchase Requisition
    const pr = await createPurchaseRequisition({
      items: [{ item_id: testItemId, quantity: 100 }],
      requesting_department: 'KITCHEN'
    });

    expect(pr.status).toBe('PENDING');

    // 2. Approve PR
    await approvePR(pr.id, { approver_id: deptHeadId });
    const updatedPR = await getPR(pr.id);
    expect(updatedPR.status).toBe('APPROVED');

    // 3. Convert to PO
    const po = await convertPRtoPO(pr.id, {
      vendor_id: testVendorId,
      unit_price: 150
    });

    expect(po.status).toBe('PENDING_APPROVAL');
    expect(po.approval_level).toBe(1); // Amount < 50K

    // 4. Approve PO
    await approvePO(po.id, { approver_id: l1ApproverId });
    const approvedPO = await getPO(po.id);
    expect(approvedPO.status).toBe('APPROVED');

    // 5. Create GRN
    const initialStock = await getItemStock(testItemId);

    const grn = await createGRN({
      po_id: po.id,
      items: [{
        item_id: testItemId,
        received_quantity: 100,
        batch_number: 'TEST-BATCH-001',
        location_id: testLocationId
      }]
    });

    expect(grn.status).toBe('COMPLETED');

    // 6. Verify stock updated
    const finalStock = await getItemStock(testItemId);
    expect(finalStock).toBe(initialStock + 100);

    // 7. Verify batch created
    const batch = await getBatchByNumber('TEST-BATCH-001');
    expect(batch.quantity).toBe(100);
  });
});
```

### **E2E Testing**

```typescript
// Example: User journey test
test('Store Keeper can create GRN from approved PO', async ({ page }) => {
  // Login as Store Keeper
  await page.goto('/login');
  await page.fill('[name=email]', 'storekeeper@test.com');
  await page.fill('[name=password]', 'password');
  await page.click('button[type=submit]');

  // Navigate to GRN page
  await page.goto('/dashboard/procurement/grn');
  await page.click('button:has-text("Create GRN")');

  // Select PO
  await page.click('[name=po_id]');
  await page.click('text=PO-2025-001');

  // Fill GRN details
  await page.fill('[name=receipt_date]', '2025-10-25');

  // Enter received quantities
  await page.fill('[data-test=received-quantity-0]', '98');
  await page.fill('[data-test=batch-number-0]', 'BATCH-001');
  await page.fill('[data-test=expiry-date-0]', '2026-10-25');

  // Mark quality check
  await page.check('[data-test=qc-passed-0]');

  // Submit
  await page.click('button:has-text("Create GRN")');

  // Verify success
  await expect(page.locator('.toast-success')).toContainText('GRN created successfully');
  await expect(page.locator('text=GRN-2025-001')).toBeVisible();
});
```

---

## 🚀 Performance Optimization

### **Database Optimization**

1. **Indexing Strategy**
   - B-tree indexes on frequently queried columns
   - Partial indexes for active records
   - GIN indexes for JSONB and array columns
   - Covering indexes for common queries

2. **Query Optimization**
   - Use of materialized views for complex reports
   - Query result caching with React Query
   - Pagination for large datasets
   - Lazy loading of related data

3. **Connection Pooling**
   - Supabase handles connection pooling
   - Max connections: 100
   - Idle timeout: 10 minutes

### **Frontend Optimization**

1. **Code Splitting**
   - Route-based code splitting
   - Dynamic imports for heavy components
   - Lazy loading of charts

2. **Caching**
   - React Query cache with 5-minute stale time
   - Image optimization with Next.js Image
   - Static page generation where possible

3. **Bundle Optimization**
   - Tree shaking
   - Minification
   - Compression (gzip/brotli)
   - CDN for static assets

### **Performance Targets**

- **Page Load**: < 2 seconds (LCP)
- **API Response**: < 300ms (p95)
- **Report Generation**: < 5 seconds for most reports
- **Search**: < 500ms
- **Chart Rendering**: < 1 second

---

## 📦 Deployment Strategy

### **Environment Setup**

```bash
# Development
- Local PostgreSQL or Supabase local
- Next.js dev server (port 9002)
- Hot reload enabled

# Staging
- Supabase staging project
- Vercel preview deployment
- Full data migration test

# Production
- Supabase production (bfewxhtlrxedlifiakok)
- Vercel production deployment
- Auto-scaling enabled
- CDN: Vercel Edge Network
```

### **CI/CD Pipeline**

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: vercel/actions@v1
        with:
          environment: staging

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: vercel/actions@v1
        with:
          environment: production
```

---

## 📚 Documentation & Training

### **Documentation Deliverables**

1. **Technical Documentation**
   - ✅ TDD (this document)
   - Architecture Diagrams
   - API Documentation (Swagger/OpenAPI)
   - Database Schema Documentation

2. **User Documentation**
   - User Manual (PDF)
   - Video Tutorials
   - In-app Help
   - FAQs

3. **Training Materials**
   - Store Keeper Training Guide
   - Purchasing Officer Training Guide
   - Approver Training Guide
   - Admin Training Guide

### **Support Model**

- **Tier 1**: In-app help and FAQs
- **Tier 2**: Email support (support@rahah24.com)
- **Tier 3**: Phone support (business hours)
- **Tier 4**: On-site support (critical issues)

---

## 🎯 Success Criteria

The Inventory Management System will be considered successful when:

### **Technical Criteria**
- [ ] All 30+ database tables deployed
- [ ] All 80+ API endpoints functional
- [ ] All 14 modules operational
- [ ] Performance targets met (<2s page load)
- [ ] 99.9% uptime achieved
- [ ] Zero critical security vulnerabilities

### **Business Criteria**
- [ ] 99%+ inventory accuracy (up from 85%)
- [ ] 75% reduction in stock-outs
- [ ] 60% faster purchase cycle time
- [ ] 95%+ vendor on-time delivery
- [ ] PKR 200,000/month cost savings
- [ ] 95%+ user adoption within 30 days

### **User Acceptance**
- [ ] All 14 UAT test scenarios pass
- [ ] User satisfaction > 90%
- [ ] Training completion 100%
- [ ] UAT sign-off from client

---

## 📋 Appendices

### **Appendix A: Glossary**

- **FEFO**: First Expired, First Out
- **GRN**: Goods Receipt Note
- **PO**: Purchase Order
- **PR**: Purchase Requisition
- **RLS**: Row Level Security
- **UAT**: User Acceptance Testing
- **ABC Analysis**: Activity Based Costing classification

### **Appendix B: References**

1. BRD Inventory Management Module (15_10_25.pdf)
2. INVENTORY MODULE (15_10_25.pdf)
3. Inventory Management System Proposal (15_10_25.pdf)
4. SCOPE.md
5. README.md

### **Appendix C: Change Log**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Oct 25, 2025 | Initial TDD | Rahah24 Team |

---

## 📞 Contact & Sign-Off

### **Document Owner**
- **Team**: Rahah24 Development Team
- **Contact**: dev@rahah24.com
- **Date**: October 25, 2025

### **Technical Reviewer**
- **Name**: _________________
- **Role**: Technical Architect
- **Date**: _________________
- **Signature**: _________________

### **Business Reviewer**
- **Name**: _________________
- **Role**: Business Analyst
- **Date**: _________________
- **Signature**: _________________

### **Approval**
- **Name**: _________________
- **Role**: Project Sponsor
- **Date**: _________________
- **Signature**: _________________

---

**Document Status**: Draft v1.0
**Next Review**: Weekly during development
**Classification**: Internal Use Only

*InshAllah, this technical design will guide the successful implementation of a world-class inventory management system for Jamia Binoria Aalamia.*
