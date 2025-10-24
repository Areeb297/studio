# Inventory Management System - Database Design Document
## Rahah24 ERP - Operations Module

---

**Document Version**: 1.0
**Last Updated**: October 25, 2025
**Status**: Ready for Implementation
**Database**: Supabase PostgreSQL 17.4.1
**Project**: bfewxhtlrxedlifiakok (us-east-2)

---

## 📋 Table of Contents

1. [Database Overview](#database-overview)
2. [Schema Design Principles](#schema-design-principles)
3. [Table Specifications](#table-specifications)
4. [Indexes & Performance](#indexes--performance)
5. [Row-Level Security (RLS) Policies](#row-level-security-rls-policies)
6. [Migration Scripts](#migration-scripts)
7. [Seed Data](#seed-data)
8. [Database Functions & Triggers](#database-functions--triggers)

---

## 🗄️ Database Overview

### Current State
- **Existing Tables**: 3 tables (inventory_categories, inventory_items, stock_movements)
- **New Tables Required**: 29 additional tables
- **Total Tables**: 32 tables across 6 functional groups

### Functional Groups

| Group | Tables | Purpose |
|-------|--------|---------|
| **Core Inventory** | 5 tables | Items, categories, batches, serials, locations |
| **Stock Movements** | 2 tables | Movement headers and line items |
| **Vendor Management** | 3 tables | Vendors, contacts, performance |
| **Purchase & Procurement** | 7 tables | PR, PO, GRN, requisitions |
| **Departments** | 5 tables | Departments, requisitions, issues, stat levels |
| **Recipe Management** | 3 tables | Recipes, ingredients, versions |
| **Physical Counts** | 2 tables | Count headers and line items |
| **Donations** | 3 tables | Donors, donations, donation items |
| **Configuration** | 2 tables | Alerts, workflows, user activities |

---

## 🎯 Schema Design Principles

### 1. Normalization
- **3rd Normal Form (3NF)** for transactional tables
- **Selective Denormalization** for reporting and calculated fields
- **Generated Columns** for computed values (e.g., `available_stock`, `total_value`)

### 2. Audit Trail
- All tables include:
  - `created_at timestamp DEFAULT now()`
  - `updated_at timestamp DEFAULT now()`
  - `created_by uuid REFERENCES auth.users(id)` (where applicable)
  - `updated_by uuid REFERENCES auth.users(id)` (where applicable)

### 3. Data Integrity
- **Foreign Keys** with appropriate ON DELETE actions
- **Check Constraints** for business rules
- **Unique Constraints** for codes and numbers
- **Not Null Constraints** for required fields

### 4. Performance
- **Strategic Indexes** on frequently queried columns
- **Partial Indexes** for filtered queries
- **GIN Indexes** for JSONB columns
- **BRIN Indexes** for time-series data

### 5. Security
- **Row Level Security (RLS)** enabled on all tables
- **Role-based Policies** for 7 user roles
- **Department-based Isolation** where applicable

---

## 📊 Table Specifications

### Group 1: Core Inventory Tables

#### 1.1 inventory_categories (EXISTING - Enhance)

```sql
-- Enhance existing table
ALTER TABLE inventory_categories
ADD COLUMN IF NOT EXISTS parent_category_id UUID REFERENCES inventory_categories(id),
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_inv_cat_parent ON inventory_categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_inv_cat_active ON inventory_categories(is_active) WHERE is_active = true;
```

#### 1.2 inventory_items (EXISTING - Enhance)

```sql
-- Enhance existing table with new columns
ALTER TABLE inventory_items
ADD COLUMN IF NOT EXISTS item_code VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS unit_of_measure VARCHAR(20) DEFAULT 'PCS',
ADD COLUMN IF NOT EXISTS reserved_stock DECIMAL(15,3) DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS available_stock DECIMAL(15,3) GENERATED ALWAYS AS (current_stock - reserved_stock) STORED,
ADD COLUMN IF NOT EXISTS minimum_stock DECIMAL(15,3) DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS maximum_stock DECIMAL(15,3) DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS reorder_level DECIMAL(15,3) DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS reorder_quantity DECIMAL(15,3) DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS unit_cost DECIMAL(15,2) DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS average_cost DECIMAL(15,2) DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS last_purchase_price DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS total_value DECIMAL(18,2) GENERATED ALWAYS AS (current_stock * average_cost) STORED,
ADD COLUMN IF NOT EXISTS primary_location_id UUID REFERENCES storage_locations(id),
ADD COLUMN IF NOT EXISTS storage_location_code VARCHAR(100),
ADD COLUMN IF NOT EXISTS has_expiry BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS shelf_life_days INTEGER,
ADD COLUMN IF NOT EXISTS has_batch BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_serial BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stock_status VARCHAR(20),
ADD COLUMN IF NOT EXISTS is_perishable BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_consumable BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_asset BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS barcode VARCHAR(100),
ADD COLUMN IF NOT EXISTS sku VARCHAR(100),
ADD COLUMN IF NOT EXISTS hsn_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS gst_rate DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_inv_items_code ON inventory_items(item_code);
CREATE INDEX IF NOT EXISTS idx_inv_items_category ON inventory_items(category_id);
CREATE INDEX IF NOT EXISTS idx_inv_items_status ON inventory_items(stock_status);
CREATE INDEX IF NOT EXISTS idx_inv_items_location ON inventory_items(primary_location_id);
CREATE INDEX IF NOT EXISTS idx_inv_items_active ON inventory_items(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_inv_items_barcode ON inventory_items(barcode);
CREATE INDEX IF NOT EXISTS idx_inv_items_low_stock ON inventory_items(current_stock) WHERE current_stock <= reorder_level;
CREATE INDEX IF NOT EXISTS idx_inv_items_metadata ON inventory_items USING gin(metadata);

-- Add check constraints
ALTER TABLE inventory_items
ADD CONSTRAINT chk_stock_positive CHECK (current_stock >= 0),
ADD CONSTRAINT chk_reserved_positive CHECK (reserved_stock >= 0),
ADD CONSTRAINT chk_min_max_valid CHECK (minimum_stock <= maximum_stock),
ADD CONSTRAINT chk_reorder_valid CHECK (reorder_level >= minimum_stock),
ADD CONSTRAINT chk_stock_status CHECK (stock_status IN ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'OVER_STOCK', 'DISCONTINUED'));
```

#### 1.3 item_batches (NEW)

```sql
CREATE TABLE item_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    batch_number VARCHAR(100) UNIQUE NOT NULL,
    manufacturing_date DATE,
    expiry_date DATE,
    quantity_received DECIMAL(15,3) NOT NULL,
    quantity_remaining DECIMAL(15,3) NOT NULL,
    unit_cost DECIMAL(15,2) NOT NULL,
    supplier_batch_number VARCHAR(100),
    vendor_id UUID REFERENCES vendors(id),
    grn_id UUID REFERENCES goods_receipt_notes(id),
    status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),

    CONSTRAINT chk_batch_status CHECK (status IN ('ACTIVE', 'EXPIRED', 'DISPOSED', 'QUARANTINE')),
    CONSTRAINT chk_batch_quantity CHECK (quantity_remaining >= 0 AND quantity_remaining <= quantity_received),
    CONSTRAINT chk_batch_dates CHECK (manufacturing_date IS NULL OR expiry_date IS NULL OR manufacturing_date < expiry_date)
);

CREATE INDEX idx_batches_item ON item_batches(item_id);
CREATE INDEX idx_batches_vendor ON item_batches(vendor_id);
CREATE INDEX idx_batches_expiry ON item_batches(expiry_date) WHERE status = 'ACTIVE';
CREATE INDEX idx_batches_status ON item_batches(status);
CREATE INDEX idx_batches_active_qty ON item_batches(quantity_remaining) WHERE status = 'ACTIVE' AND quantity_remaining > 0;

COMMENT ON TABLE item_batches IS 'Batch-level tracking for items with expiry dates';
```

#### 1.4 item_serials (NEW)

```sql
CREATE TABLE item_serials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    batch_id UUID REFERENCES item_batches(id),
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    warranty_start_date DATE,
    warranty_end_date DATE,
    warranty_months INTEGER,
    status VARCHAR(20) DEFAULT 'IN_STOCK' NOT NULL,
    current_location_id UUID REFERENCES storage_locations(id),
    assigned_to UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),

    CONSTRAINT chk_serial_status CHECK (status IN ('IN_STOCK', 'ISSUED', 'DAMAGED', 'UNDER_REPAIR', 'DISPOSED')),
    CONSTRAINT chk_warranty_dates CHECK (warranty_start_date IS NULL OR warranty_end_date IS NULL OR warranty_start_date < warranty_end_date)
);

CREATE INDEX idx_serials_item ON item_serials(item_id);
CREATE INDEX idx_serials_batch ON item_serials(batch_id);
CREATE INDEX idx_serials_location ON item_serials(current_location_id);
CREATE INDEX idx_serials_status ON item_serials(status);
CREATE INDEX idx_serials_warranty ON item_serials(warranty_end_date) WHERE status != 'DISPOSED';

COMMENT ON TABLE item_serials IS 'Serial number tracking for assets with warranties';
```

#### 1.5 storage_locations (NEW)

```sql
CREATE TABLE storage_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL,
    parent_location_id UUID REFERENCES storage_locations(id),
    full_path VARCHAR(500),
    capacity DECIMAL(15,3),
    occupied DECIMAL(15,3) DEFAULT 0,
    available DECIMAL(15,3) GENERATED ALWAYS AS (COALESCE(capacity, 0) - COALESCE(occupied, 0)) STORED,
    is_temperature_controlled BOOLEAN DEFAULT false,
    temperature_min DECIMAL(5,2),
    temperature_max DECIMAL(5,2),
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),

    CONSTRAINT chk_location_type CHECK (type IN ('ZONE', 'AISLE', 'RACK', 'BIN')),
    CONSTRAINT chk_location_capacity CHECK (capacity IS NULL OR (occupied >= 0 AND occupied <= capacity))
);

CREATE INDEX idx_locations_parent ON storage_locations(parent_location_id);
CREATE INDEX idx_locations_type ON storage_locations(type);
CREATE INDEX idx_locations_active ON storage_locations(is_active) WHERE is_active = true;
CREATE INDEX idx_locations_path ON storage_locations(full_path);

COMMENT ON TABLE storage_locations IS 'Hierarchical storage location mapping: Zone → Aisle → Rack → Bin';
```

---

### Group 2: Stock Movement Tables

#### 2.1 stock_movements (EXISTING - Enhance)

```sql
-- Enhance existing table
ALTER TABLE stock_movements
ADD COLUMN IF NOT EXISTS movement_number VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS movement_type VARCHAR(20),
ADD COLUMN IF NOT EXISTS movement_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS from_location_id UUID REFERENCES storage_locations(id),
ADD COLUMN IF NOT EXISTS to_location_id UUID REFERENCES storage_locations(id),
ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id),
ADD COLUMN IF NOT EXISTS reference_id UUID,
ADD COLUMN IF NOT EXISTS reference_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'DRAFT',
ADD COLUMN IF NOT EXISTS reason TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS posted_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS posted_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_stock_mov_number ON stock_movements(movement_number);
CREATE INDEX IF NOT EXISTS idx_stock_mov_type ON stock_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_stock_mov_date ON stock_movements(movement_date);
CREATE INDEX IF NOT EXISTS idx_stock_mov_status ON stock_movements(status);
CREATE INDEX IF NOT EXISTS idx_stock_mov_reference ON stock_movements(reference_id, reference_type);

ALTER TABLE stock_movements
ADD CONSTRAINT chk_mov_type CHECK (movement_type IN ('PURCHASE', 'TRANSFER', 'ADJUSTMENT', 'ISSUE', 'RETURN', 'COUNT')),
ADD CONSTRAINT chk_mov_status CHECK (status IN ('DRAFT', 'PENDING', 'APPROVED', 'POSTED', 'CANCELLED'));
```

#### 2.2 stock_movement_items (NEW)

```sql
CREATE TABLE stock_movement_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    movement_id UUID NOT NULL REFERENCES stock_movements(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    batch_id UUID REFERENCES item_batches(id),
    quantity DECIMAL(15,3) NOT NULL,
    unit_cost DECIMAL(15,2) NOT NULL,
    total_cost DECIMAL(18,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
    from_bin_id UUID REFERENCES storage_locations(id),
    to_bin_id UUID REFERENCES storage_locations(id),
    notes TEXT,

    CONSTRAINT chk_mov_item_qty CHECK (quantity != 0)
);

CREATE INDEX idx_mov_items_movement ON stock_movement_items(movement_id);
CREATE INDEX idx_mov_items_item ON stock_movement_items(item_id);
CREATE INDEX idx_mov_items_batch ON stock_movement_items(batch_id);

COMMENT ON TABLE stock_movement_items IS 'Line items for stock movements';
```

---

### Group 3: Vendor Management Tables

#### 3.1 vendors (NEW)

```sql
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_code VARCHAR(50) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    mobile VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Pakistan',
    postal_code VARCHAR(20),
    tax_id VARCHAR(50),
    gst_number VARCHAR(50),
    payment_terms VARCHAR(20) DEFAULT 'CASH' NOT NULL,
    credit_days INTEGER DEFAULT 0,
    credit_limit DECIMAL(15,2) DEFAULT 0,
    late_fee_percentage DECIMAL(5,2) DEFAULT 0,
    vendor_type VARCHAR(20) DEFAULT 'OPEN_MARKET' NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING_APPROVAL' NOT NULL,
    performance_rating DECIMAL(3,2) DEFAULT 0,
    on_time_delivery_count INTEGER DEFAULT 0,
    total_delivery_count INTEGER DEFAULT 0,
    on_time_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE
            WHEN total_delivery_count > 0
            THEN (on_time_delivery_count * 100.0 / total_delivery_count)
            ELSE 0
        END
    ) STORED,
    bank_name VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_branch VARCHAR(255),
    ifsc_code VARCHAR(20),
    is_approved BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP,
    approval_notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),

    CONSTRAINT chk_vendor_payment_terms CHECK (payment_terms IN ('CASH', 'CREDIT', 'BANK_TRANSFER')),
    CONSTRAINT chk_vendor_type CHECK (vendor_type IN ('OPEN_MARKET', 'CREDIT', 'CASH')),
    CONSTRAINT chk_vendor_status CHECK (status IN ('ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'BLACKLISTED')),
    CONSTRAINT chk_vendor_rating CHECK (performance_rating >= 0 AND performance_rating <= 5)
);

CREATE INDEX idx_vendors_code ON vendors(vendor_code);
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_vendors_type ON vendors(vendor_type);
CREATE INDEX idx_vendors_active ON vendors(status, is_approved) WHERE status = 'ACTIVE' AND is_approved = true;
CREATE INDEX idx_vendors_metadata ON vendors USING gin(metadata);

COMMENT ON TABLE vendors IS 'Vendor master with 15+ fields and performance tracking';
```

#### 3.2 vendor_contacts (NEW)

```sql
CREATE TABLE vendor_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    is_primary BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_vendor_contacts_vendor ON vendor_contacts(vendor_id);
CREATE INDEX idx_vendor_contacts_primary ON vendor_contacts(vendor_id, is_primary) WHERE is_primary = true;

COMMENT ON TABLE vendor_contacts IS 'Multiple contact persons per vendor';
```

#### 3.3 vendor_performance (NEW)

```sql
CREATE TABLE vendor_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    evaluation_date DATE DEFAULT CURRENT_DATE NOT NULL,
    quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
    delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
    price_rating INTEGER CHECK (price_rating >= 1 AND price_rating <= 5),
    service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
    overall_rating DECIMAL(3,2) GENERATED ALWAYS AS (
        (COALESCE(quality_rating, 0) + COALESCE(delivery_rating, 0) +
         COALESCE(price_rating, 0) + COALESCE(service_rating, 0)) / 4.0
    ) STORED,
    comments TEXT,
    evaluated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_vendor_perf_vendor ON vendor_performance(vendor_id);
CREATE INDEX idx_vendor_perf_date ON vendor_performance(evaluation_date);

COMMENT ON TABLE vendor_performance IS 'Vendor performance evaluation history';
```

---

### Group 4: Purchase & Procurement Tables

#### 4.1 purchase_requisitions (NEW)

```sql
CREATE TABLE purchase_requisitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pr_number VARCHAR(50) UNIQUE NOT NULL,
    pr_date DATE DEFAULT CURRENT_DATE NOT NULL,
    department_id UUID REFERENCES departments(id),
    requested_by UUID REFERENCES auth.users(id),
    pr_type VARCHAR(20) DEFAULT 'REGULAR' NOT NULL,
    priority VARCHAR(20) DEFAULT 'MEDIUM' NOT NULL,
    required_date DATE,
    justification TEXT,
    status VARCHAR(30) DEFAULT 'DRAFT' NOT NULL,
    total_amount DECIMAL(15,2) DEFAULT 0,
    current_approver_id UUID REFERENCES auth.users(id),
    approval_level INTEGER,
    rejection_reason TEXT,
    converted_to_po_id UUID REFERENCES purchase_orders(id),
    converted_at TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),

    CONSTRAINT chk_pr_type CHECK (pr_type IN ('REGULAR', 'URGENT', 'CAPITAL')),
    CONSTRAINT chk_pr_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    CONSTRAINT chk_pr_status CHECK (status IN ('DRAFT', 'PENDING_L1', 'PENDING_L2', 'PENDING_L3', 'APPROVED', 'REJECTED', 'CONVERTED')),
    CONSTRAINT chk_pr_approval_level CHECK (approval_level IN (1, 2, 3))
);

CREATE INDEX idx_pr_number ON purchase_requisitions(pr_number);
CREATE INDEX idx_pr_status ON purchase_requisitions(status);
CREATE INDEX idx_pr_department ON purchase_requisitions(department_id);
CREATE INDEX idx_pr_requested_by ON purchase_requisitions(requested_by);
CREATE INDEX idx_pr_date ON purchase_requisitions(pr_date);
CREATE INDEX idx_pr_pending ON purchase_requisitions(current_approver_id) WHERE status LIKE 'PENDING%';

COMMENT ON TABLE purchase_requisitions IS 'Purchase requisitions with 3-level approval';
```

#### 4.2 requisition_items (NEW)

```sql
CREATE TABLE requisition_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pr_id UUID NOT NULL REFERENCES purchase_requisitions(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    quantity_requested DECIMAL(15,3) NOT NULL,
    unit_of_measure VARCHAR(20) NOT NULL,
    estimated_unit_price DECIMAL(15,2),
    estimated_total DECIMAL(18,2) GENERATED ALWAYS AS (quantity_requested * COALESCE(estimated_unit_price, 0)) STORED,
    specification TEXT,
    notes TEXT,

    CONSTRAINT chk_req_item_qty CHECK (quantity_requested > 0)
);

CREATE INDEX idx_req_items_pr ON requisition_items(pr_id);
CREATE INDEX idx_req_items_item ON requisition_items(item_id);

COMMENT ON TABLE requisition_items IS 'PR line items';
```

#### 4.3 purchase_orders (NEW)

```sql
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_number VARCHAR(50) UNIQUE NOT NULL,
    po_date DATE DEFAULT CURRENT_DATE NOT NULL,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    pr_id UUID REFERENCES purchase_requisitions(id),
    delivery_date DATE,
    delivery_address TEXT,
    payment_terms VARCHAR(20) DEFAULT 'CASH' NOT NULL,
    credit_days INTEGER DEFAULT 0,
    subtotal DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    shipping_charges DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(30) DEFAULT 'DRAFT' NOT NULL,
    price_variance_percentage DECIMAL(5,2) DEFAULT 0,
    variance_approved BOOLEAN DEFAULT false,
    variance_approved_by UUID REFERENCES auth.users(id),
    variance_approved_at TIMESTAMP,
    approval_level INTEGER,
    current_approver_id UUID REFERENCES auth.users(id),
    terms_and_conditions TEXT,
    notes TEXT,
    sent_to_vendor_at TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),

    CONSTRAINT chk_po_payment_terms CHECK (payment_terms IN ('CASH', 'CREDIT', 'BANK_TRANSFER')),
    CONSTRAINT chk_po_status CHECK (status IN ('DRAFT', 'PENDING_L1', 'PENDING_L2', 'PENDING_L3', 'APPROVED', 'SENT', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CLOSED', 'CANCELLED')),
    CONSTRAINT chk_po_approval_level CHECK (approval_level IN (1, 2, 3))
);

CREATE INDEX idx_po_number ON purchase_orders(po_number);
CREATE INDEX idx_po_vendor ON purchase_orders(vendor_id);
CREATE INDEX idx_po_pr ON purchase_orders(pr_id);
CREATE INDEX idx_po_status ON purchase_orders(status);
CREATE INDEX idx_po_date ON purchase_orders(po_date);
CREATE INDEX idx_po_pending ON purchase_orders(current_approver_id) WHERE status LIKE 'PENDING%';
CREATE INDEX idx_po_variance ON purchase_orders(price_variance_percentage) WHERE variance_approved = false;

COMMENT ON TABLE purchase_orders IS 'Purchase orders with price variance detection';
```

#### 4.4 purchase_order_items (NEW)

```sql
CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    pr_item_id UUID REFERENCES requisition_items(id),
    quantity_ordered DECIMAL(15,3) NOT NULL,
    unit_of_measure VARCHAR(20) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    line_total DECIMAL(18,2) GENERATED ALWAYS AS (
        (quantity_ordered * unit_price) + tax_amount - discount_amount
    ) STORED,
    last_purchase_price DECIMAL(15,2),
    price_variance_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE
            WHEN last_purchase_price > 0 AND last_purchase_price IS NOT NULL
            THEN ((unit_price - last_purchase_price) / last_purchase_price * 100)
            ELSE 0
        END
    ) STORED,
    specification TEXT,
    notes TEXT,

    CONSTRAINT chk_po_item_qty CHECK (quantity_ordered > 0),
    CONSTRAINT chk_po_item_price CHECK (unit_price >= 0)
);

CREATE INDEX idx_po_items_po ON purchase_order_items(po_id);
CREATE INDEX idx_po_items_item ON purchase_order_items(item_id);
CREATE INDEX idx_po_items_variance ON purchase_order_items(price_variance_percentage);

COMMENT ON TABLE purchase_order_items IS 'PO line items with price variance calculation';
```

#### 4.5 goods_receipt_notes (NEW)

```sql
CREATE TABLE goods_receipt_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grn_number VARCHAR(50) UNIQUE NOT NULL,
    grn_date DATE DEFAULT CURRENT_DATE NOT NULL,
    po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE RESTRICT,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    vendor_invoice_number VARCHAR(100),
    vendor_invoice_date DATE,
    received_by UUID REFERENCES auth.users(id),
    inspected_by UUID REFERENCES auth.users(id),
    inspection_status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
    inspection_notes TEXT,
    storage_location_id UUID REFERENCES storage_locations(id),
    status VARCHAR(20) DEFAULT 'DRAFT' NOT NULL,
    total_accepted_value DECIMAL(15,2) DEFAULT 0,
    total_rejected_value DECIMAL(15,2) DEFAULT 0,
    rejection_reason TEXT,
    posted_by UUID REFERENCES auth.users(id),
    posted_at TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),

    CONSTRAINT chk_grn_inspection CHECK (inspection_status IN ('PENDING', 'PASSED', 'FAILED', 'PARTIAL')),
    CONSTRAINT chk_grn_status CHECK (status IN ('DRAFT', 'INSPECTED', 'POSTED', 'CANCELLED'))
);

CREATE INDEX idx_grn_number ON goods_receipt_notes(grn_number);
CREATE INDEX idx_grn_po ON goods_receipt_notes(po_id);
CREATE INDEX idx_grn_vendor ON goods_receipt_notes(vendor_id);
CREATE INDEX idx_grn_date ON goods_receipt_notes(grn_date);
CREATE INDEX idx_grn_status ON goods_receipt_notes(status);

COMMENT ON TABLE goods_receipt_notes IS 'GRN with quality inspection';
```

#### 4.6 grn_items (NEW)

```sql
CREATE TABLE grn_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grn_id UUID NOT NULL REFERENCES goods_receipt_notes(id) ON DELETE CASCADE,
    po_item_id UUID NOT NULL REFERENCES purchase_order_items(id) ON DELETE RESTRICT,
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    batch_id UUID REFERENCES item_batches(id),
    quantity_ordered DECIMAL(15,3) NOT NULL,
    quantity_received DECIMAL(15,3) NOT NULL,
    quantity_accepted DECIMAL(15,3) NOT NULL,
    quantity_rejected DECIMAL(15,3) GENERATED ALWAYS AS (quantity_received - quantity_accepted) STORED,
    unit_price DECIMAL(15,2) NOT NULL,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    line_total DECIMAL(18,2) GENERATED ALWAYS AS (quantity_accepted * unit_price + tax_amount) STORED,
    quality_status VARCHAR(20) DEFAULT 'ACCEPTED' NOT NULL,
    quality_notes TEXT,
    rejection_reason TEXT,

    CONSTRAINT chk_grn_item_qty CHECK (quantity_accepted >= 0 AND quantity_accepted <= quantity_received),
    CONSTRAINT chk_grn_quality CHECK (quality_status IN ('ACCEPTED', 'REJECTED', 'HOLD'))
);

CREATE INDEX idx_grn_items_grn ON grn_items(grn_id);
CREATE INDEX idx_grn_items_po_item ON grn_items(po_item_id);
CREATE INDEX idx_grn_items_item ON grn_items(item_id);
CREATE INDEX idx_grn_items_batch ON grn_items(batch_id);

COMMENT ON TABLE grn_items IS 'GRN line items with quality control';
```

---

### Group 5: Department Tables

#### 5.1 departments (NEW)

```sql
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    parent_department_id UUID REFERENCES departments(id),
    department_head_id UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),

    CONSTRAINT chk_dept_type CHECK (type IN ('RESTAURANT', 'EDUCATION', 'ADMIN', 'CONSTRUCTION', 'KITCHEN'))
);

CREATE INDEX idx_dept_code ON departments(code);
CREATE INDEX idx_dept_parent ON departments(parent_department_id);
CREATE INDEX idx_dept_head ON departments(department_head_id);
CREATE INDEX idx_dept_active ON departments(is_active) WHERE is_active = true;

COMMENT ON TABLE departments IS 'Department master for requisitions and issues';
```

#### 5.2 department_requisitions (NEW)

```sql
CREATE TABLE department_requisitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requisition_number VARCHAR(50) UNIQUE NOT NULL,
    requisition_date DATE DEFAULT CURRENT_DATE NOT NULL,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    requested_by UUID REFERENCES auth.users(id),
    required_date DATE,
    priority VARCHAR(20) DEFAULT 'MEDIUM' NOT NULL,
    status VARCHAR(30) DEFAULT 'DRAFT' NOT NULL,
    purpose TEXT,
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),

    CONSTRAINT chk_dept_req_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    CONSTRAINT chk_dept_req_status CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'PARTIALLY_ISSUED', 'ISSUED', 'CLOSED', 'REJECTED'))
);

CREATE INDEX idx_dept_req_number ON department_requisitions(requisition_number);
CREATE INDEX idx_dept_req_department ON department_requisitions(department_id);
CREATE INDEX idx_dept_req_status ON department_requisitions(status);
CREATE INDEX idx_dept_req_date ON department_requisitions(requisition_date);

COMMENT ON TABLE department_requisitions IS 'Department requisitions for internal issues';
```

#### 5.3 department_requisition_items (NEW)

```sql
CREATE TABLE department_requisition_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requisition_id UUID NOT NULL REFERENCES department_requisitions(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    quantity_requested DECIMAL(15,3) NOT NULL,
    quantity_approved DECIMAL(15,3) DEFAULT 0,
    quantity_issued DECIMAL(15,3) DEFAULT 0,
    unit_of_measure VARCHAR(20) NOT NULL,
    notes TEXT,

    CONSTRAINT chk_dept_req_item_qty CHECK (
        quantity_requested > 0 AND
        quantity_approved >= 0 AND
        quantity_issued >= 0 AND
        quantity_issued <= quantity_approved
    )
);

CREATE INDEX idx_dept_req_items_req ON department_requisition_items(requisition_id);
CREATE INDEX idx_dept_req_items_item ON department_requisition_items(item_id);

COMMENT ON TABLE department_requisition_items IS 'Department requisition line items';
```

#### 5.4 department_stat_levels (NEW)

```sql
CREATE TABLE department_stat_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    stat_level DECIMAL(15,3) DEFAULT 0 NOT NULL,
    par_level DECIMAL(15,3) DEFAULT 0 NOT NULL,
    current_stock DECIMAL(15,3) DEFAULT 0,
    auto_reorder BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),

    UNIQUE(department_id, item_id),
    CONSTRAINT chk_stat_par_valid CHECK (stat_level <= par_level)
);

CREATE INDEX idx_dept_stat_department ON department_stat_levels(department_id);
CREATE INDEX idx_dept_stat_item ON department_stat_levels(item_id);
CREATE INDEX idx_dept_stat_low ON department_stat_levels(department_id, item_id)
    WHERE current_stock < stat_level;

COMMENT ON TABLE department_stat_levels IS 'Department-specific stat (min) and par (max) levels';
```

#### 5.5 issue_slips (NEW)

```sql
CREATE TABLE issue_slips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_number VARCHAR(50) UNIQUE NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE NOT NULL,
    department_requisition_id UUID REFERENCES department_requisitions(id),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    issued_by UUID REFERENCES auth.users(id),
    received_by UUID REFERENCES auth.users(id),
    storage_location_id UUID REFERENCES storage_locations(id),
    status VARCHAR(20) DEFAULT 'DRAFT' NOT NULL,
    fefo_enforced BOOLEAN DEFAULT false,
    acknowledged_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),

    CONSTRAINT chk_issue_status CHECK (status IN ('DRAFT', 'ISSUED', 'ACKNOWLEDGED', 'CANCELLED'))
);

CREATE INDEX idx_issue_number ON issue_slips(issue_number);
CREATE INDEX idx_issue_department ON issue_slips(department_id);
CREATE INDEX idx_issue_requisition ON issue_slips(department_requisition_id);
CREATE INDEX idx_issue_date ON issue_slips(issue_date);
CREATE INDEX idx_issue_status ON issue_slips(status);

COMMENT ON TABLE issue_slips IS 'Issue slips with FEFO enforcement';
```

#### 5.6 issue_slip_items (NEW)

```sql
CREATE TABLE issue_slip_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_slip_id UUID NOT NULL REFERENCES issue_slips(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    batch_id UUID REFERENCES item_batches(id),
    requisition_item_id UUID REFERENCES department_requisition_items(id),
    quantity_issued DECIMAL(15,3) NOT NULL,
    unit_cost DECIMAL(15,2) NOT NULL,
    batch_expiry_date DATE,
    bin_location VARCHAR(100),
    notes TEXT,

    CONSTRAINT chk_issue_item_qty CHECK (quantity_issued > 0)
);

CREATE INDEX idx_issue_items_slip ON issue_slip_items(issue_slip_id);
CREATE INDEX idx_issue_items_item ON issue_slip_items(item_id);
CREATE INDEX idx_issue_items_batch ON issue_slip_items(batch_id);

COMMENT ON TABLE issue_slip_items IS 'Issue slip line items with batch tracking';
```

---

### Group 6: Recipe Management Tables

#### 6.1 recipes (NEW)

```sql
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    department_id UUID REFERENCES departments(id),
    description TEXT,
    portion_size INTEGER DEFAULT 1 NOT NULL,
    ideal_food_cost_percentage DECIMAL(5,2),
    actual_food_cost_percentage DECIMAL(5,2),
    variance_tolerance_percentage DECIMAL(5,2) DEFAULT 5.0,
    status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL,
    version_number INTEGER DEFAULT 1,
    preparation_notes TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),

    CONSTRAINT chk_recipe_status CHECK (status IN ('ACTIVE', 'DRAFT', 'ARCHIVED')),
    CONSTRAINT chk_recipe_portion CHECK (portion_size > 0)
);

CREATE INDEX idx_recipes_code ON recipes(recipe_code);
CREATE INDEX idx_recipes_department ON recipes(department_id);
CREATE INDEX idx_recipes_status ON recipes(status);
CREATE INDEX idx_recipes_variance ON recipes(department_id)
    WHERE ABS(actual_food_cost_percentage - ideal_food_cost_percentage) > variance_tolerance_percentage;

COMMENT ON TABLE recipes IS 'Recipe master with costing and variance tracking';
```

#### 6.2 recipe_ingredients (NEW)

```sql
CREATE TABLE recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    quantity_required DECIMAL(15,3) NOT NULL,
    unit_of_measure VARCHAR(20) NOT NULL,
    unit_cost DECIMAL(15,2) NOT NULL,
    ingredient_cost DECIMAL(18,2) GENERATED ALWAYS AS (quantity_required * unit_cost) STORED,
    preparation_notes TEXT,

    CONSTRAINT chk_recipe_ing_qty CHECK (quantity_required > 0)
);

CREATE INDEX idx_recipe_ing_recipe ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ing_item ON recipe_ingredients(item_id);

COMMENT ON TABLE recipe_ingredients IS 'Recipe ingredients with costing';
```

#### 6.3 recipe_versions (NEW)

```sql
CREATE TABLE recipe_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    effective_date DATE DEFAULT CURRENT_DATE NOT NULL,
    ingredients_snapshot JSONB NOT NULL,
    total_cost_snapshot DECIMAL(15,2) NOT NULL,
    change_notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT now(),

    UNIQUE(recipe_id, version_number)
);

CREATE INDEX idx_recipe_versions_recipe ON recipe_versions(recipe_id);
CREATE INDEX idx_recipe_versions_date ON recipe_versions(effective_date);

COMMENT ON TABLE recipe_versions IS 'Recipe version control for historical tracking';
```

---

### Group 7: Physical Count & Theft Tables

#### 7.1 physical_counts (NEW)

```sql
CREATE TABLE physical_counts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    count_number VARCHAR(50) UNIQUE NOT NULL,
    count_type VARCHAR(20) NOT NULL,
    count_date DATE DEFAULT CURRENT_DATE NOT NULL,
    scheduled_date DATE,
    storage_location_id UUID REFERENCES storage_locations(id),
    department_id UUID REFERENCES departments(id),
    counted_by UUID REFERENCES auth.users(id),
    verified_by UUID REFERENCES auth.users(id),
    status VARCHAR(20) DEFAULT 'SCHEDULED' NOT NULL,
    total_variance_value DECIMAL(15,2) DEFAULT 0,
    has_variances BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP,
    posted_by UUID REFERENCES auth.users(id),
    posted_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),

    CONSTRAINT chk_count_type CHECK (count_type IN ('CYCLE', 'FULL', 'SPOT')),
    CONSTRAINT chk_count_status CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'POSTED', 'CANCELLED'))
);

CREATE INDEX idx_count_number ON physical_counts(count_number);
CREATE INDEX idx_count_type ON physical_counts(count_type);
CREATE INDEX idx_count_date ON physical_counts(count_date);
CREATE INDEX idx_count_status ON physical_counts(status);
CREATE INDEX idx_count_location ON physical_counts(storage_location_id);
CREATE INDEX idx_count_variance ON physical_counts(has_variances) WHERE has_variances = true;

COMMENT ON TABLE physical_counts IS 'Physical stock count headers (Cycle, Full, Spot)';
```

#### 7.2 physical_count_items (NEW)

```sql
CREATE TABLE physical_count_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    count_id UUID NOT NULL REFERENCES physical_counts(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    batch_id UUID REFERENCES item_batches(id),
    system_quantity DECIMAL(15,3) NOT NULL,
    counted_quantity DECIMAL(15,3) NOT NULL,
    variance_quantity DECIMAL(15,3) GENERATED ALWAYS AS (counted_quantity - system_quantity) STORED,
    unit_cost DECIMAL(15,2) NOT NULL,
    variance_value DECIMAL(18,2) GENERATED ALWAYS AS ((counted_quantity - system_quantity) * unit_cost) STORED,
    variance_type VARCHAR(20) GENERATED ALWAYS AS (
        CASE
            WHEN counted_quantity > system_quantity THEN 'OVERAGE'
            WHEN counted_quantity < system_quantity THEN 'SHORTAGE'
            ELSE 'MATCH'
        END
    ) STORED,
    variance_reason TEXT,
    bin_location VARCHAR(100),
    notes TEXT
);

CREATE INDEX idx_count_items_count ON physical_count_items(count_id);
CREATE INDEX idx_count_items_item ON physical_count_items(item_id);
CREATE INDEX idx_count_items_batch ON physical_count_items(batch_id);
CREATE INDEX idx_count_items_variance ON physical_count_items(count_id) WHERE variance_quantity != 0;

COMMENT ON TABLE physical_count_items IS 'Physical count line items with variance calculation';
```

#### 7.3 theft_reports (NEW)

```sql
CREATE TABLE theft_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_number VARCHAR(50) UNIQUE NOT NULL,
    incident_date DATE NOT NULL,
    reported_date DATE DEFAULT CURRENT_DATE NOT NULL,
    storage_location_id UUID REFERENCES storage_locations(id),
    department_id UUID REFERENCES departments(id),
    reported_by UUID REFERENCES auth.users(id),
    status VARCHAR(30) DEFAULT 'REPORTED' NOT NULL,
    incident_description TEXT NOT NULL,
    estimated_value DECIMAL(15,2),
    photo_attachments TEXT,
    investigating_officer_id UUID REFERENCES auth.users(id),
    investigation_notes TEXT,
    resolution TEXT,
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),

    CONSTRAINT chk_theft_status CHECK (status IN ('REPORTED', 'UNDER_INVESTIGATION', 'RESOLVED', 'CLOSED'))
);

CREATE INDEX idx_theft_number ON theft_reports(report_number);
CREATE INDEX idx_theft_incident_date ON theft_reports(incident_date);
CREATE INDEX idx_theft_status ON theft_reports(status);
CREATE INDEX idx_theft_location ON theft_reports(storage_location_id);
CREATE INDEX idx_theft_department ON theft_reports(department_id);

COMMENT ON TABLE theft_reports IS 'Theft incident reports requiring L3 approval';
```

---

### Group 8: Donation Tables

#### 8.1 donors (NEW)

```sql
CREATE TABLE donors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Pakistan',
    donor_type VARCHAR(20) DEFAULT 'INDIVIDUAL' NOT NULL,
    is_recurring BOOLEAN DEFAULT false,
    total_donations_count INTEGER DEFAULT 0,
    total_donations_value DECIMAL(15,2) DEFAULT 0,
    last_donation_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),

    CONSTRAINT chk_donor_type CHECK (donor_type IN ('INDIVIDUAL', 'CORPORATE', 'ORGANIZATION'))
);

CREATE INDEX idx_donors_code ON donors(donor_code);
CREATE INDEX idx_donors_type ON donors(donor_type);
CREATE INDEX idx_donors_recurring ON donors(is_recurring) WHERE is_recurring = true;

COMMENT ON TABLE donors IS 'Donor master for donation tracking';
```

#### 8.2 donations (NEW)

```sql
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donation_number VARCHAR(50) UNIQUE NOT NULL,
    donation_date DATE DEFAULT CURRENT_DATE NOT NULL,
    donor_id UUID NOT NULL REFERENCES donors(id) ON DELETE RESTRICT,
    received_by UUID REFERENCES auth.users(id),
    storage_location_id UUID REFERENCES storage_locations(id),
    total_estimated_value DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'RECEIVED' NOT NULL,
    purpose TEXT,
    acknowledgement_sent BOOLEAN DEFAULT false,
    posted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),

    CONSTRAINT chk_donation_status CHECK (status IN ('RECEIVED', 'INSPECTED', 'POSTED'))
);

CREATE INDEX idx_donations_number ON donations(donation_number);
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_donations_date ON donations(donation_date);
CREATE INDEX idx_donations_status ON donations(status);

COMMENT ON TABLE donations IS 'Donation GRNs from donors';
```

#### 8.3 donation_items (NEW)

```sql
CREATE TABLE donation_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donation_id UUID NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    batch_id UUID REFERENCES item_batches(id),
    quantity_received DECIMAL(15,3) NOT NULL,
    estimated_unit_value DECIMAL(15,2),
    total_estimated_value DECIMAL(18,2) GENERATED ALWAYS AS (quantity_received * COALESCE(estimated_unit_value, 0)) STORED,
    item_condition TEXT,
    notes TEXT,

    CONSTRAINT chk_donation_item_qty CHECK (quantity_received > 0)
);

CREATE INDEX idx_donation_items_donation ON donation_items(donation_id);
CREATE INDEX idx_donation_items_item ON donation_items(item_id);
CREATE INDEX idx_donation_items_batch ON donation_items(batch_id);

COMMENT ON TABLE donation_items IS 'Donation line items';
```

---

### Group 9: Configuration & Activity Tables

#### 9.1 user_activities (NEW)

```sql
CREATE TABLE user_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_date DATE DEFAULT CURRENT_DATE NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    reference_id UUID,
    reference_type VARCHAR(50),
    transaction_count INTEGER DEFAULT 1,
    hours_worked DECIMAL(5,2),
    expected_hours DECIMAL(5,2),
    utilization_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE
            WHEN expected_hours > 0
            THEN (hours_worked / expected_hours * 100)
            ELSE 0
        END
    ) STORED,
    created_at TIMESTAMP DEFAULT now(),

    CONSTRAINT chk_activity_type CHECK (activity_type IN ('GRN', 'ISSUE', 'ADJUSTMENT', 'COUNT', 'REQUISITION', 'APPROVAL'))
);

CREATE INDEX idx_user_activities_user ON user_activities(user_id);
CREATE INDEX idx_user_activities_date ON user_activities(activity_date);
CREATE INDEX idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX idx_user_activities_reference ON user_activities(reference_id, reference_type);

COMMENT ON TABLE user_activities IS 'Store staff KPI tracking';
```

#### 9.2 approval_workflows (NEW)

```sql
CREATE TABLE approval_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(50) NOT NULL,
    approval_level INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
    approver_id UUID REFERENCES auth.users(id),
    submitted_at TIMESTAMP DEFAULT now(),
    responded_at TIMESTAMP,
    comments TEXT,
    rejection_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT now(),

    CONSTRAINT chk_approval_level CHECK (approval_level IN (1, 2, 3)),
    CONSTRAINT chk_approval_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    CONSTRAINT chk_approval_doc_type CHECK (document_type IN ('PR', 'PO', 'VARIANCE', 'THEFT', 'COUNT_VARIANCE', 'STOCK_ADJUSTMENT'))
);

CREATE INDEX idx_approvals_document ON approval_workflows(document_id, document_type);
CREATE INDEX idx_approvals_approver ON approval_workflows(approver_id);
CREATE INDEX idx_approvals_status ON approval_workflows(status);
CREATE INDEX idx_approvals_level ON approval_workflows(approval_level);
CREATE INDEX idx_approvals_pending ON approval_workflows(approver_id, status) WHERE status = 'PENDING';

COMMENT ON TABLE approval_workflows IS 'Approval workflow tracking for all document types';
```

#### 9.3 alert_configurations (NEW)

```sql
CREATE TABLE alert_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type VARCHAR(50) UNIQUE NOT NULL,
    alert_name VARCHAR(255) NOT NULL,
    description TEXT,
    threshold_config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    notification_channels VARCHAR(100) DEFAULT 'EMAIL,IN_APP',
    recipient_roles JSONB DEFAULT '[]'::jsonb,
    frequency_minutes INTEGER DEFAULT 60,
    last_run_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),

    CONSTRAINT chk_alert_type CHECK (alert_type IN (
        'LOW_STOCK', 'REORDER', 'EXPIRY', 'PRICE_VARIANCE', 'APPROVAL_PENDING',
        'OVER_STOCK', 'WARRANTY_EXPIRY', 'COUNT_DUE', 'VENDOR_PERFORMANCE', 'BUDGET_VARIANCE'
    ))
);

CREATE INDEX idx_alert_configs_type ON alert_configurations(alert_type);
CREATE INDEX idx_alert_configs_active ON alert_configurations(is_active) WHERE is_active = true;

COMMENT ON TABLE alert_configurations IS 'Alert configuration for 10 alert types';
```

#### 9.4 alerts (NEW)

```sql
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID REFERENCES alert_configurations(id),
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) DEFAULT 'INFO' NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    item_id UUID REFERENCES inventory_items(id),
    department_id UUID REFERENCES departments(id),
    assigned_to UUID REFERENCES auth.users(id),
    status VARCHAR(20) DEFAULT 'NEW' NOT NULL,
    acknowledged_at TIMESTAMP,
    acknowledged_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMP,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT now(),

    CONSTRAINT chk_alert_severity CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL')),
    CONSTRAINT chk_alert_status CHECK (status IN ('NEW', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED'))
);

CREATE INDEX idx_alerts_type ON alerts(alert_type);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_assigned ON alerts(assigned_to) WHERE status NOT IN ('RESOLVED', 'DISMISSED');
CREATE INDEX idx_alerts_item ON alerts(item_id);
CREATE INDEX idx_alerts_created ON alerts(created_at);

COMMENT ON TABLE alerts IS 'Real-time alerts with notification tracking';
```

---

## 🚀 Migration Scripts

### Migration 001: Create UUID Extension

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Migration 002: Create All New Tables

```sql
-- Execute all CREATE TABLE statements from above in order
-- Start with tables with no dependencies, then add dependent tables

-- Order:
-- 1. departments
-- 2. storage_locations
-- 3. vendors
-- 4. vendor_contacts
-- 5. vendor_performance
-- 6. item_batches
-- 7. item_serials
-- 8. stock_movement_items
-- 9. purchase_requisitions
-- 10. requisition_items
-- 11. purchase_orders
-- 12. purchase_order_items
-- 13. goods_receipt_notes
-- 14. grn_items
-- 15. department_requisitions
-- 16. department_requisition_items
-- 17. department_stat_levels
-- 18. issue_slips
-- 19. issue_slip_items
-- 20. recipes
-- 21. recipe_ingredients
-- 22. recipe_versions
-- 23. physical_counts
-- 24. physical_count_items
-- 25. theft_reports
-- 26. donors
-- 27. donations
-- 28. donation_items
-- 29. user_activities
-- 30. approval_workflows
-- 31. alert_configurations
-- 32. alerts
```

### Migration 003: Create Update Triggers

```sql
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply to all other tables...
-- (repeat for each table with updated_at column)
```

### Migration 004: Create Stock Level Update Function

```sql
-- Function to update stock levels on GRN posting
CREATE OR REPLACE FUNCTION update_stock_on_grn_post()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'POSTED' AND OLD.status != 'POSTED' THEN
        -- Update inventory_items current_stock from GRN items
        UPDATE inventory_items i
        SET current_stock = current_stock + gi.quantity_accepted,
            average_cost = (
                (current_stock * average_cost + gi.quantity_accepted * gi.unit_price) /
                (current_stock + gi.quantity_accepted)
            ),
            last_purchase_price = gi.unit_price
        FROM grn_items gi
        WHERE gi.grn_id = NEW.id
        AND gi.item_id = i.id;

        -- Update batch quantities
        UPDATE item_batches b
        SET quantity_remaining = gi.quantity_accepted
        FROM grn_items gi
        WHERE gi.grn_id = NEW.id
        AND gi.batch_id = b.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stock_on_grn_post
AFTER UPDATE ON goods_receipt_notes
FOR EACH ROW EXECUTE FUNCTION update_stock_on_grn_post();
```

### Migration 005: Create Automated PR Number Generation

```sql
-- Function to generate PR numbers
CREATE OR REPLACE FUNCTION generate_pr_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.pr_number IS NULL THEN
        NEW.pr_number := 'PR-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' ||
                         LPAD(NEXTVAL('pr_number_seq')::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE pr_number_seq;

CREATE TRIGGER trigger_generate_pr_number
BEFORE INSERT ON purchase_requisitions
FOR EACH ROW EXECUTE FUNCTION generate_pr_number();

-- Similar functions for PO, GRN, ISSUE, COUNT, etc.
```

---

## 🛡️ Row-Level Security (RLS) Policies

### Enable RLS on All Tables

```sql
-- Enable RLS
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
-- ... enable on all tables
```

### Policy Examples

#### Store Keeper: Access own department only

```sql
CREATE POLICY store_keeper_inventory_items ON inventory_items
FOR ALL
TO authenticated
USING (
    auth.jwt() ->> 'role' = 'STORE_KEEPER'
    AND (
        auth.jwt() ->> 'department_id'
    )::uuid = department_id
);
```

#### Department Head: Access own department + subordinates

```sql
CREATE POLICY dept_head_requisitions ON department_requisitions
FOR ALL
TO authenticated
USING (
    auth.jwt() ->> 'role' = 'DEPT_HEAD'
    AND (
        department_id = (auth.jwt() ->> 'department_id')::uuid
        OR department_id IN (
            SELECT id FROM departments
            WHERE parent_department_id = (auth.jwt() ->> 'department_id')::uuid
        )
    )
);
```

#### Approver L3: Unlimited access

```sql
CREATE POLICY approver_l3_full_access ON purchase_orders
FOR ALL
TO authenticated
USING (
    auth.jwt() ->> 'role' IN ('APPROVER_L3', 'ADMIN')
);
```

#### Auditor: Read-only access

```sql
CREATE POLICY auditor_read_only ON inventory_items
FOR SELECT
TO authenticated
USING (
    auth.jwt() ->> 'role' = 'AUDITOR'
);
```

---

## 📝 Seed Data

### Seed Categories

```sql
INSERT INTO inventory_categories (code, name, is_active) VALUES
('FOOD', 'Food & Beverages', true),
('CROCKERY', 'Crockery & Utensils', true),
('CLEANING', 'Cleaning Supplies', true),
('STATIONERY', 'Stationery & Office', true),
('EQUIPMENT', 'Equipment & Machinery', true);
```

### Seed Departments

```sql
INSERT INTO departments (code, name, type, is_active) VALUES
('CONT', 'Continental Kitchen', 'RESTAURANT', true),
('CHINESE', 'Chinese Kitchen', 'RESTAURANT', true),
('BBQ', 'BBQ Kitchen', 'RESTAURANT', true),
('TANDOOR', 'Tandoor Kitchen', 'RESTAURANT', true),
('BEVERAGES', 'Beverages Department', 'RESTAURANT', true),
('DESSERT', 'Dessert Department', 'RESTAURANT', true),
('EDUCATION', 'Education Department', 'EDUCATION', true),
('ADMIN', 'Administration', 'ADMIN', true);
```

### Seed Storage Locations

```sql
-- Zones
INSERT INTO storage_locations (code, name, type, parent_location_id, is_active) VALUES
('ZONE-A', 'Zone A - Main Warehouse', 'ZONE', NULL, true),
('ZONE-B', 'Zone B - Cold Storage', 'ZONE', NULL, true);

-- Aisles in Zone A
INSERT INTO storage_locations (code, name, type, parent_location_id, full_path, is_active)
SELECT
    'A-AISLE-' || i,
    'Zone A - Aisle ' || i,
    'AISLE',
    (SELECT id FROM storage_locations WHERE code = 'ZONE-A'),
    'ZONE-A/AISLE-' || i,
    true
FROM generate_series(1, 5) AS i;
```

### Seed Alert Configurations

```sql
INSERT INTO alert_configurations (alert_type, alert_name, threshold_config, notification_channels, recipient_roles) VALUES
('LOW_STOCK', 'Low Stock Alert', '{"threshold_percentage": 20}', 'EMAIL,IN_APP', '["STORE_KEEPER", "PURCHASING"]'),
('REORDER', 'Reorder Level Alert', '{"auto_create_pr": true}', 'EMAIL,IN_APP', '["PURCHASING"]'),
('EXPIRY', 'Expiry Warning', '{"days_before": 30}', 'EMAIL,SMS,IN_APP', '["STORE_KEEPER"]'),
('PRICE_VARIANCE', 'Price Variance Alert', '{"variance_threshold": 10}', 'EMAIL,IN_APP', '["APPROVER_L2", "APPROVER_L3"]');
```

---

## 📊 Database Statistics

### Expected Table Sizes (1 Year)

| Table | Estimated Rows | Growth Rate |
|-------|---------------|-------------|
| inventory_items | 10,000 | Low (100/year) |
| item_batches | 50,000 | Medium (500/month) |
| stock_movements | 100,000 | High (300/day) |
| stock_movement_items | 500,000 | High (1,500/day) |
| purchase_orders | 10,000 | Medium (30/day) |
| goods_receipt_notes | 10,000 | Medium (30/day) |
| vendors | 500 | Low (50/year) |
| alerts | 50,000 | High (auto-cleanup old) |

---

## 🔍 Query Performance Guidelines

### Recommended Indexes Created

- **Primary Keys**: Automatic B-tree indexes
- **Foreign Keys**: Explicit indexes for joins
- **Status Fields**: Partial indexes for active records
- **Date Fields**: B-tree indexes for range queries
- **JSONB Fields**: GIN indexes for metadata
- **Computed Fields**: Generated columns (no index needed)

### Query Optimization Tips

1. Use `WHERE is_active = true` with partial indexes
2. Filter by date ranges using indexed date columns
3. Join using indexed foreign keys
4. Use `LIMIT` and `OFFSET` for pagination
5. Use `EXPLAIN ANALYZE` to verify index usage

---

**Document Version**: 1.0
**Last Updated**: October 25, 2025
**Ready for Implementation**: Yes
**Estimated Setup Time**: 2-3 hours

---

*InshAllah, this database design will provide a solid foundation for the inventory management system with performance, security, and scalability in mind.*
