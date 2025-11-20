-- =============================================
-- MIGRATION: 02 - Inventory Masters
-- =============================================
-- Creates item categories, items, vendors, and item stock levels
-- Establishes foundation for inventory management
-- =============================================
-- Created: 2025-01-25
-- Version: 1.0
-- Dependencies: 01_rbac_core.sql
-- =============================================

-- =============================================
-- STEP 1: CREATE ITEM CATEGORIES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS item_categories (
  category_id SERIAL PRIMARY KEY,
  category_name TEXT NOT NULL,
  parent_category_id INT REFERENCES item_categories(category_id) ON DELETE CASCADE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_category_name_not_empty CHECK (LENGTH(TRIM(category_name)) > 0)
);

COMMENT ON TABLE item_categories IS 'Hierarchical categorization of inventory items (e.g., Raw Materials > Rice, Consumables > Spices)';
COMMENT ON COLUMN item_categories.parent_category_id IS 'Nullable FK for hierarchical categories (NULL = root category)';

-- Prevent circular references in category hierarchy
CREATE OR REPLACE FUNCTION check_category_circular_reference()
RETURNS TRIGGER AS $$
DECLARE
  v_parent_id INT;
  v_depth INT := 0;
BEGIN
  v_parent_id := NEW.parent_category_id;

  WHILE v_parent_id IS NOT NULL AND v_depth < 10 LOOP
    IF v_parent_id = NEW.category_id THEN
      RAISE EXCEPTION 'Circular reference detected in category hierarchy';
    END IF;

    SELECT parent_category_id INTO v_parent_id
    FROM item_categories
    WHERE category_id = v_parent_id;

    v_depth := v_depth + 1;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_category_circular_reference
  BEFORE INSERT OR UPDATE ON item_categories
  FOR EACH ROW
  EXECUTE FUNCTION check_category_circular_reference();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_item_categories_parent ON item_categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_item_categories_active ON item_categories(is_active);

-- =============================================
-- STEP 2: CREATE ITEMS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS items (
  item_id SERIAL PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  item_name TEXT NOT NULL,
  category_id INT REFERENCES item_categories(category_id) ON DELETE RESTRICT,
  uom TEXT NOT NULL,  -- Unit of Measure (KG, L, PCS, BOX, etc.)
  description TEXT,
  is_batch_tracked BOOLEAN DEFAULT false,
  is_warranty_tracked BOOLEAN DEFAULT false,
  is_donation_eligible BOOLEAN DEFAULT true,
  reorder_days INT DEFAULT 7,  -- Lead time for reordering
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_sku_format CHECK (sku ~ '^[A-Z0-9\-]+$'),
  CONSTRAINT chk_item_name_not_empty CHECK (LENGTH(TRIM(item_name)) > 0),
  CONSTRAINT chk_uom_valid CHECK (uom IN ('KG', 'G', 'L', 'ML', 'PCS', 'BOX', 'BAG', 'DOZEN', 'BUNDLE'))
);

COMMENT ON TABLE items IS 'Master inventory items table with SKU, UoM, and tracking flags';
COMMENT ON COLUMN items.sku IS 'Stock Keeping Unit - Unique identifier (e.g., RICE-001, OIL-002)';
COMMENT ON COLUMN items.uom IS 'Unit of Measure for stock transactions';
COMMENT ON COLUMN items.is_batch_tracked IS 'Enable batch/lot number tracking for this item';
COMMENT ON COLUMN items.is_warranty_tracked IS 'Enable warranty expiry tracking';
COMMENT ON COLUMN items.is_donation_eligible IS 'Item can be received as donation';
COMMENT ON COLUMN items.reorder_days IS 'Lead time in days for procurement';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_sku ON items(sku);
CREATE INDEX IF NOT EXISTS idx_items_active ON items(is_active);
CREATE INDEX IF NOT EXISTS idx_items_name ON items(item_name);

-- Full-text search index for item names
CREATE INDEX IF NOT EXISTS idx_items_name_trgm ON items USING gin(item_name gin_trgm_ops);

-- =============================================
-- STEP 3: CREATE VENDORS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS vendors (
  vendor_id SERIAL PRIMARY KEY,
  vendor_code TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  ntn TEXT,  -- National Tax Number (Pakistan)
  strn TEXT,  -- Sales Tax Registration Number
  bank_name TEXT,
  bank_account TEXT,
  payment_terms TEXT DEFAULT 'Net 30',
  credit_limit NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Blocked', 'Suspended')),
  rating NUMERIC(3, 2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5.00),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  approved_by UUID REFERENCES user_profiles(id),
  approved_at TIMESTAMPTZ,
  CONSTRAINT chk_vendor_code_format CHECK (vendor_code ~ '^VEN-[0-9]+$'),
  CONSTRAINT chk_company_name_not_empty CHECK (LENGTH(TRIM(company_name)) > 0),
  CONSTRAINT chk_email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$' OR email IS NULL)
);

COMMENT ON TABLE vendors IS 'Vendor/supplier master with approval workflow and ratings';
COMMENT ON COLUMN vendors.status IS 'Pending: Under review, Approved: Can transact, Blocked: Cannot create POs, Suspended: Temporarily blocked';
COMMENT ON COLUMN vendors.rating IS 'Performance rating (0-5) based on delivery, quality, price';
COMMENT ON COLUMN vendors.payment_terms IS 'e.g., Net 30, Net 45, COD, Advance Payment';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vendors_code ON vendors(vendor_code);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendors_company_name ON vendors(company_name);
CREATE INDEX IF NOT EXISTS idx_vendors_rating ON vendors(rating);

-- =============================================
-- STEP 4: CREATE ITEM_STOCK_LEVELS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS item_stock_levels (
  item_id INT REFERENCES items(item_id) ON DELETE CASCADE,
  store_id INT NOT NULL DEFAULT 1,  -- 1 = Main Store, future: multiple stores
  qty_on_hand NUMERIC DEFAULT 0 CHECK (qty_on_hand >= 0),
  qty_allocated NUMERIC DEFAULT 0 CHECK (qty_allocated >= 0),  -- Reserved for orders
  qty_available NUMERIC GENERATED ALWAYS AS (qty_on_hand - qty_allocated) STORED,
  min_level NUMERIC DEFAULT 0 CHECK (min_level >= 0),
  max_level NUMERIC DEFAULT 0 CHECK (max_level >= 0),
  reorder_level NUMERIC DEFAULT 0 CHECK (reorder_level >= 0),
  last_counted_at TIMESTAMPTZ,
  last_counted_qty NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (item_id, store_id),
  CONSTRAINT chk_max_gte_min CHECK (max_level >= min_level),
  CONSTRAINT chk_reorder_between_min_max CHECK (reorder_level BETWEEN min_level AND max_level)
);

COMMENT ON TABLE item_stock_levels IS 'Current stock on hand and reorder thresholds per item per store';
COMMENT ON COLUMN item_stock_levels.qty_on_hand IS 'Physical quantity available in store';
COMMENT ON COLUMN item_stock_levels.qty_allocated IS 'Quantity reserved for pending orders/issues';
COMMENT ON COLUMN item_stock_levels.qty_available IS 'Auto-calculated: qty_on_hand - qty_allocated';
COMMENT ON COLUMN item_stock_levels.reorder_level IS 'Trigger point for auto-generating purchase requisitions';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_item_stock_levels_item ON item_stock_levels(item_id);
CREATE INDEX IF NOT EXISTS idx_item_stock_levels_store ON item_stock_levels(store_id);
CREATE INDEX IF NOT EXISTS idx_item_stock_levels_below_reorder ON item_stock_levels(item_id)
  WHERE qty_available <= reorder_level;

-- =============================================
-- STEP 5: CREATE STORES/LOCATIONS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS stores (
  store_id SERIAL PRIMARY KEY,
  store_code TEXT UNIQUE NOT NULL,
  store_name TEXT NOT NULL,
  location TEXT,
  store_type TEXT CHECK (store_type IN ('Main', 'Branch', 'Kitchen', 'Warehouse')),
  is_active BOOLEAN DEFAULT true,
  manager_id UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE stores IS 'Physical storage locations (stores/warehouses)';

-- Insert default main store
INSERT INTO stores (store_id, store_code, store_name, location, store_type)
VALUES (1, 'STORE-MAIN', 'Main Store', 'Ground Floor', 'Main')
ON CONFLICT (store_id) DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_stores_code ON stores(store_code);
CREATE INDEX IF NOT EXISTS idx_stores_active ON stores(is_active);

-- =============================================
-- STEP 6: CREATE VENDOR_ITEM_PRICES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS vendor_item_prices (
  price_id SERIAL PRIMARY KEY,
  vendor_id INT REFERENCES vendors(vendor_id) ON DELETE CASCADE,
  item_id INT REFERENCES items(item_id) ON DELETE CASCADE,
  unit_price NUMERIC NOT NULL CHECK (unit_price >= 0),
  currency TEXT DEFAULT 'PKR',
  valid_from DATE DEFAULT CURRENT_DATE,
  valid_to DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_valid_date_range CHECK (valid_to IS NULL OR valid_to >= valid_from),
  CONSTRAINT uq_vendor_item_active UNIQUE (vendor_id, item_id, is_active)
);

COMMENT ON TABLE vendor_item_prices IS 'Historical pricing per vendor per item for price variance tracking';
COMMENT ON COLUMN vendor_item_prices.valid_to IS 'NULL = current/active price';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vendor_item_prices_vendor ON vendor_item_prices(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_item_prices_item ON vendor_item_prices(item_id);
CREATE INDEX IF NOT EXISTS idx_vendor_item_prices_active ON vendor_item_prices(is_active);

-- =============================================
-- STEP 7: CREATE UPDATED_AT TRIGGER FUNCTION
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at column
CREATE TRIGGER trg_item_categories_updated_at
  BEFORE UPDATE ON item_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_item_stock_levels_updated_at
  BEFORE UPDATE ON item_stock_levels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- STEP 8: CREATE HELPER VIEWS
-- =============================================

-- View: Low stock items
CREATE OR REPLACE VIEW v_low_stock_items AS
SELECT
  i.item_id,
  i.sku,
  i.item_name,
  ic.category_name,
  isl.store_id,
  s.store_name,
  isl.qty_available,
  isl.reorder_level,
  isl.min_level,
  (isl.reorder_level - isl.qty_available) AS shortage_qty,
  i.reorder_days,
  CASE
    WHEN isl.qty_available <= isl.min_level THEN 'CRITICAL'
    WHEN isl.qty_available <= isl.reorder_level THEN 'LOW'
    ELSE 'OK'
  END AS status
FROM items i
JOIN item_stock_levels isl ON i.item_id = isl.item_id
JOIN item_categories ic ON i.category_id = ic.category_id
JOIN stores s ON isl.store_id = s.store_id
WHERE i.is_active = true
  AND isl.qty_available <= isl.reorder_level
ORDER BY
  CASE
    WHEN isl.qty_available <= isl.min_level THEN 1
    WHEN isl.qty_available <= isl.reorder_level THEN 2
    ELSE 3
  END,
  isl.qty_available ASC;

COMMENT ON VIEW v_low_stock_items IS 'Items below reorder level requiring procurement action';

-- View: Vendor performance summary
CREATE OR REPLACE VIEW v_vendor_summary AS
SELECT
  v.vendor_id,
  v.vendor_code,
  v.company_name,
  v.status,
  v.rating,
  v.payment_terms,
  COUNT(DISTINCT vip.item_id) AS items_supplied,
  v.created_at,
  v.approved_at
FROM vendors v
LEFT JOIN vendor_item_prices vip ON v.vendor_id = vip.vendor_id AND vip.is_active = true
GROUP BY v.vendor_id, v.vendor_code, v.company_name, v.status, v.rating, v.payment_terms, v.created_at, v.approved_at;

COMMENT ON VIEW v_vendor_summary IS 'Summary of vendor status and item coverage';

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Count tables created
SELECT
  'item_categories' AS table_name, COUNT(*) AS row_count FROM item_categories
UNION ALL
SELECT 'items', COUNT(*) FROM items
UNION ALL
SELECT 'vendors', COUNT(*) FROM vendors
UNION ALL
SELECT 'item_stock_levels', COUNT(*) FROM item_stock_levels
UNION ALL
SELECT 'stores', COUNT(*) FROM stores
UNION ALL
SELECT 'vendor_item_prices', COUNT(*) FROM vendor_item_prices;

-- Verify indexes
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('items', 'vendors', 'item_categories', 'item_stock_levels')
ORDER BY tablename, indexname;

-- =============================================
-- ROLLBACK INSTRUCTIONS
-- =============================================

/*
-- To rollback this migration:

DROP VIEW IF EXISTS v_low_stock_items;
DROP VIEW IF EXISTS v_vendor_summary;

DROP TRIGGER IF EXISTS trg_item_categories_updated_at ON item_categories;
DROP TRIGGER IF EXISTS trg_items_updated_at ON items;
DROP TRIGGER IF EXISTS trg_vendors_updated_at ON vendors;
DROP TRIGGER IF EXISTS trg_item_stock_levels_updated_at ON item_stock_levels;
DROP TRIGGER IF EXISTS trg_check_category_circular_reference ON item_categories;

DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS check_category_circular_reference();

DROP TABLE IF EXISTS vendor_item_prices CASCADE;
DROP TABLE IF EXISTS item_stock_levels CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS item_categories CASCADE;
*/

-- =============================================
-- END OF MIGRATION
-- =============================================
