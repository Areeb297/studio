-- =============================================
-- MIGRATION: 03 - P2P Workflow (Procure-to-Pay)
-- =============================================
-- Creates Purchase Requisitions, Purchase Orders, GRNs, and Invoices
-- Implements complete P2P cycle with status tracking
-- =============================================
-- Created: 2025-01-25
-- Version: 1.0
-- Dependencies: 01_rbac_core.sql, 02_inventory_masters.sql
-- =============================================

-- =============================================
-- STEP 1: CREATE PURCHASE REQUISITIONS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS purchase_requisitions (
  pr_id BIGSERIAL PRIMARY KEY,
  pr_number TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending', 'Approved', 'Rejected', 'Converted', 'Cancelled')),
  requested_by UUID NOT NULL REFERENCES user_profiles(id),
  justification TEXT,
  urgency TEXT DEFAULT 'Medium' CHECK (urgency IN ('Low', 'Medium', 'High', 'Critical')),
  required_by_date DATE,
  total_estimated_amount NUMERIC DEFAULT 0 CHECK (total_estimated_amount >= 0),
  approved_by UUID REFERENCES user_profiles(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_approval_data_consistency CHECK (
    (status = 'Approved' AND approved_by IS NOT NULL AND approved_at IS NOT NULL) OR
    (status != 'Approved')
  )
);

COMMENT ON TABLE purchase_requisitions IS 'Purchase requisitions raised by departments for procurement';
COMMENT ON COLUMN purchase_requisitions.pr_number IS 'Auto-generated: PR-YYYY-#### format';
COMMENT ON COLUMN purchase_requisitions.status IS 'Draft: Not submitted, Pending: Awaiting approval, Approved: Ready for PO, Rejected: Denied, Converted: PO created, Cancelled: Withdrawn';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pr_status ON purchase_requisitions(status);
CREATE INDEX IF NOT EXISTS idx_pr_requested_by ON purchase_requisitions(requested_by);
CREATE INDEX IF NOT EXISTS idx_pr_created_at ON purchase_requisitions(created_at);
CREATE INDEX IF NOT EXISTS idx_pr_department ON purchase_requisitions(department);

-- =============================================
-- STEP 2: CREATE PURCHASE REQUISITION ITEMS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS purchase_requisition_items (
  pr_item_id BIGSERIAL PRIMARY KEY,
  pr_id BIGINT NOT NULL REFERENCES purchase_requisitions(pr_id) ON DELETE CASCADE,
  item_id INT NOT NULL REFERENCES items(item_id) ON DELETE RESTRICT,
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  estimated_unit_price NUMERIC DEFAULT 0 CHECK (estimated_unit_price >= 0),
  estimated_total NUMERIC GENERATED ALWAYS AS (quantity * estimated_unit_price) STORED,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE purchase_requisition_items IS 'Line items for each purchase requisition';

-- Prevent duplicate items in same PR
CREATE UNIQUE INDEX IF NOT EXISTS uq_pr_item ON purchase_requisition_items(pr_id, item_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pri_pr ON purchase_requisition_items(pr_id);
CREATE INDEX IF NOT EXISTS idx_pri_item ON purchase_requisition_items(item_id);

-- =============================================
-- STEP 3: CREATE PURCHASE ORDERS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS purchase_orders (
  po_id BIGSERIAL PRIMARY KEY,
  po_number TEXT UNIQUE NOT NULL,
  pr_id BIGINT REFERENCES purchase_requisitions(pr_id),
  vendor_id INT NOT NULL REFERENCES vendors(vendor_id) ON DELETE RESTRICT,
  status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending', 'Approved', 'Sent', 'Partial', 'Received', 'Completed', 'Cancelled')),
  po_date DATE DEFAULT CURRENT_DATE,
  expected_delivery_date DATE,
  payment_terms TEXT DEFAULT 'Net 30',
  delivery_address TEXT,
  total_amount NUMERIC DEFAULT 0 CHECK (total_amount >= 0),
  tax_amount NUMERIC DEFAULT 0 CHECK (tax_amount >= 0),
  discount_amount NUMERIC DEFAULT 0 CHECK (discount_amount >= 0),
  final_amount NUMERIC GENERATED ALWAYS AS (total_amount + tax_amount - discount_amount) STORED,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  approved_by UUID REFERENCES user_profiles(id),
  approved_at TIMESTAMPTZ,
  sent_to_vendor_at TIMESTAMPTZ,
  sent_by UUID REFERENCES user_profiles(id),
  notes TEXT,
  terms_and_conditions TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE purchase_orders IS 'Purchase orders sent to vendors for procurement';
COMMENT ON COLUMN purchase_orders.po_number IS 'Auto-generated: PO-YYYY-#### format';
COMMENT ON COLUMN purchase_orders.status IS 'Draft: Not finalized, Pending: Awaiting approval, Approved: Ready to send, Sent: Sent to vendor, Partial: Partially received, Received: Fully received, Completed: All processed';

-- Prevent PO to non-approved vendors
ALTER TABLE purchase_orders
  ADD CONSTRAINT chk_vendor_approved CHECK (
    vendor_id IN (SELECT vendor_id FROM vendors WHERE status = 'Approved')
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_po_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_po_vendor ON purchase_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_po_pr ON purchase_orders(pr_id);
CREATE INDEX IF NOT EXISTS idx_po_created_by ON purchase_orders(created_by);
CREATE INDEX IF NOT EXISTS idx_po_date ON purchase_orders(po_date);

-- =============================================
-- STEP 4: CREATE PURCHASE ORDER ITEMS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS purchase_order_items (
  po_item_id BIGSERIAL PRIMARY KEY,
  po_id BIGINT NOT NULL REFERENCES purchase_orders(po_id) ON DELETE CASCADE,
  item_id INT NOT NULL REFERENCES items(item_id) ON DELETE RESTRICT,
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC NOT NULL CHECK (unit_price >= 0),
  line_total NUMERIC GENERATED ALWAYS AS (quantity * unit_price) STORED,
  qty_received NUMERIC DEFAULT 0 CHECK (qty_received >= 0),
  qty_pending NUMERIC GENERATED ALWAYS AS (quantity - qty_received) STORED,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE purchase_order_items IS 'Line items for each purchase order';
COMMENT ON COLUMN purchase_order_items.qty_received IS 'Updated by GRN trigger automatically';

-- Prevent duplicate items in same PO
CREATE UNIQUE INDEX IF NOT EXISTS uq_po_item ON purchase_order_items(po_id, item_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_poi_po ON purchase_order_items(po_id);
CREATE INDEX IF NOT EXISTS idx_poi_item ON purchase_order_items(item_id);

-- =============================================
-- STEP 5: CREATE GOODS RECEIVED NOTES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS goods_received_notes (
  grn_id BIGSERIAL PRIMARY KEY,
  grn_number TEXT UNIQUE NOT NULL,
  po_id BIGINT NOT NULL REFERENCES purchase_orders(po_id) ON DELETE RESTRICT,
  received_by UUID NOT NULL REFERENCES user_profiles(id),
  received_at TIMESTAMPTZ DEFAULT now(),
  vehicle_number TEXT,
  driver_name TEXT,
  driver_phone TEXT,
  is_donation BOOLEAN DEFAULT false,
  donor_name TEXT,
  donor_contact TEXT,
  quality_check_status TEXT DEFAULT 'Pending' CHECK (quality_check_status IN ('Pending', 'Passed', 'Failed', 'Partial')),
  quality_checked_by UUID REFERENCES user_profiles(id),
  quality_checked_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE goods_received_notes IS 'Goods received from vendors or donors with quality check';
COMMENT ON COLUMN goods_received_notes.grn_number IS 'Auto-generated: GRN-YYYY-#### format';
COMMENT ON COLUMN goods_received_notes.is_donation IS 'True if received as donation (no payment required)';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_grn_po ON goods_received_notes(po_id);
CREATE INDEX IF NOT EXISTS idx_grn_received_by ON goods_received_notes(received_by);
CREATE INDEX IF NOT EXISTS idx_grn_date ON goods_received_notes(received_at);
CREATE INDEX IF NOT EXISTS idx_grn_donation ON goods_received_notes(is_donation);

-- =============================================
-- STEP 6: CREATE GRN ITEMS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS grn_items (
  grn_item_id BIGSERIAL PRIMARY KEY,
  grn_id BIGINT NOT NULL REFERENCES goods_received_notes(grn_id) ON DELETE CASCADE,
  item_id INT NOT NULL REFERENCES items(item_id) ON DELETE RESTRICT,
  po_item_id BIGINT REFERENCES purchase_order_items(po_item_id),
  batch_no TEXT,
  expiry_date DATE,
  warranty_end_date DATE,
  qty_ordered NUMERIC,
  qty_received NUMERIC NOT NULL CHECK (qty_received > 0),
  qty_accepted NUMERIC CHECK (qty_accepted >= 0),
  qty_rejected NUMERIC GENERATED ALWAYS AS (qty_received - COALESCE(qty_accepted, qty_received)) STORED,
  rejection_reason TEXT,
  unit_price NUMERIC CHECK (unit_price >= 0),
  line_total NUMERIC GENERATED ALWAYS AS (COALESCE(qty_accepted, qty_received) * COALESCE(unit_price, 0)) STORED,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE grn_items IS 'Line items for each goods received note with batch/expiry tracking';
COMMENT ON COLUMN grn_items.qty_accepted IS 'Quantity passed quality check (NULL = all accepted)';
COMMENT ON COLUMN grn_items.qty_rejected IS 'Auto-calculated: qty_received - qty_accepted';

-- Prevent duplicate items in same GRN
CREATE UNIQUE INDEX IF NOT EXISTS uq_grn_item ON grn_items(grn_id, item_id, COALESCE(batch_no, ''));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_grni_grn ON grn_items(grn_id);
CREATE INDEX IF NOT EXISTS idx_grni_item ON grn_items(item_id);
CREATE INDEX IF NOT EXISTS idx_grni_batch ON grn_items(batch_no) WHERE batch_no IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_grni_expiry ON grn_items(expiry_date) WHERE expiry_date IS NOT NULL;

-- =============================================
-- STEP 7: CREATE INVOICES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS invoices (
  invoice_id BIGSERIAL PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  vendor_id INT NOT NULL REFERENCES vendors(vendor_id) ON DELETE RESTRICT,
  po_id BIGINT REFERENCES purchase_orders(po_id),
  grn_id BIGINT REFERENCES goods_received_notes(grn_id),
  invoice_date DATE NOT NULL,
  due_date DATE,
  payment_terms TEXT,
  subtotal NUMERIC DEFAULT 0 CHECK (subtotal >= 0),
  tax_amount NUMERIC DEFAULT 0 CHECK (tax_amount >= 0),
  discount_amount NUMERIC DEFAULT 0 CHECK (discount_amount >= 0),
  total_amount NUMERIC GENERATED ALWAYS AS (subtotal + tax_amount - discount_amount) STORED,
  amount_paid NUMERIC DEFAULT 0 CHECK (amount_paid >= 0),
  amount_due NUMERIC GENERATED ALWAYS AS (subtotal + tax_amount - discount_amount - amount_paid) STORED,
  status TEXT DEFAULT 'Unpaid' CHECK (status IN ('Unpaid', 'Partial', 'Paid', 'Overdue', 'Disputed', 'Cancelled')),
  matched_status TEXT DEFAULT 'Pending' CHECK (matched_status IN ('Pending', 'Matched', 'Variance', 'Disputed')),
  matched_by UUID REFERENCES user_profiles(id),
  matched_at TIMESTAMPTZ,
  approved_by UUID REFERENCES user_profiles(id),
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_due_date_after_invoice CHECK (due_date IS NULL OR due_date >= invoice_date)
);

COMMENT ON TABLE invoices IS 'Vendor invoices for 3-way matching with PO and GRN';
COMMENT ON COLUMN invoices.matched_status IS 'Pending: Not matched, Matched: PO=GRN=Invoice, Variance: Discrepancies found, Disputed: Under review';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_invoice_vendor ON invoices(vendor_id);
CREATE INDEX IF NOT EXISTS idx_invoice_po ON invoices(po_id);
CREATE INDEX IF NOT EXISTS idx_invoice_grn ON invoices(grn_id);
CREATE INDEX IF NOT EXISTS idx_invoice_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_date ON invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoice_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoice_overdue ON invoices(due_date) WHERE status IN ('Unpaid', 'Partial') AND due_date < CURRENT_DATE;

-- =============================================
-- STEP 8: CREATE INVOICE ITEMS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS invoice_items (
  invoice_item_id BIGSERIAL PRIMARY KEY,
  invoice_id BIGINT NOT NULL REFERENCES invoices(invoice_id) ON DELETE CASCADE,
  item_id INT NOT NULL REFERENCES items(item_id) ON DELETE RESTRICT,
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC NOT NULL CHECK (unit_price >= 0),
  line_total NUMERIC GENERATED ALWAYS AS (quantity * unit_price) STORED,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE invoice_items IS 'Line items for each invoice';

-- Prevent duplicate items in same invoice
CREATE UNIQUE INDEX IF NOT EXISTS uq_invoice_item ON invoice_items(invoice_id, item_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_invi_invoice ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invi_item ON invoice_items(item_id);

-- =============================================
-- STEP 9: CREATE AUTO-NUMBERING FUNCTIONS
-- =============================================

-- Function to generate PR number
CREATE OR REPLACE FUNCTION generate_pr_number()
RETURNS TEXT AS $$
DECLARE
  v_year TEXT;
  v_seq INT;
  v_pr_number TEXT;
BEGIN
  v_year := TO_CHAR(CURRENT_DATE, 'YYYY');

  SELECT COALESCE(MAX(CAST(SUBSTRING(pr_number FROM 9) AS INT)), 0) + 1 INTO v_seq
  FROM purchase_requisitions
  WHERE pr_number LIKE 'PR-' || v_year || '-%';

  v_pr_number := 'PR-' || v_year || '-' || LPAD(v_seq::TEXT, 4, '0');

  RETURN v_pr_number;
END;
$$ LANGUAGE plpgsql;

-- Function to generate PO number
CREATE OR REPLACE FUNCTION generate_po_number()
RETURNS TEXT AS $$
DECLARE
  v_year TEXT;
  v_seq INT;
  v_po_number TEXT;
BEGIN
  v_year := TO_CHAR(CURRENT_DATE, 'YYYY');

  SELECT COALESCE(MAX(CAST(SUBSTRING(po_number FROM 9) AS INT)), 0) + 1 INTO v_seq
  FROM purchase_orders
  WHERE po_number LIKE 'PO-' || v_year || '-%';

  v_po_number := 'PO-' || v_year || '-' || LPAD(v_seq::TEXT, 4, '0');

  RETURN v_po_number;
END;
$$ LANGUAGE plpgsql;

-- Function to generate GRN number
CREATE OR REPLACE FUNCTION generate_grn_number()
RETURNS TEXT AS $$
DECLARE
  v_year TEXT;
  v_seq INT;
  v_grn_number TEXT;
BEGIN
  v_year := TO_CHAR(CURRENT_DATE, 'YYYY');

  SELECT COALESCE(MAX(CAST(SUBSTRING(grn_number FROM 10) AS INT)), 0) + 1 INTO v_seq
  FROM goods_received_notes
  WHERE grn_number LIKE 'GRN-' || v_year || '-%';

  v_grn_number := 'GRN-' || v_year || '-' || LPAD(v_seq::TEXT, 4, '0');

  RETURN v_grn_number;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- STEP 10: CREATE AUTO-NUMBER TRIGGERS
-- =============================================

-- Trigger for PR auto-numbering
CREATE OR REPLACE FUNCTION trg_set_pr_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.pr_number IS NULL OR NEW.pr_number = '' THEN
    NEW.pr_number := generate_pr_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pr_auto_number
  BEFORE INSERT ON purchase_requisitions
  FOR EACH ROW
  EXECUTE FUNCTION trg_set_pr_number();

-- Trigger for PO auto-numbering
CREATE OR REPLACE FUNCTION trg_set_po_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.po_number IS NULL OR NEW.po_number = '' THEN
    NEW.po_number := generate_po_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_po_auto_number
  BEFORE INSERT ON purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION trg_set_po_number();

-- Trigger for GRN auto-numbering
CREATE OR REPLACE FUNCTION trg_set_grn_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.grn_number IS NULL OR NEW.grn_number = '' THEN
    NEW.grn_number := generate_grn_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_grn_auto_number
  BEFORE INSERT ON goods_received_notes
  FOR EACH ROW
  EXECUTE FUNCTION trg_set_grn_number();

-- =============================================
-- STEP 11: CREATE UPDATED_AT TRIGGERS
-- =============================================

CREATE TRIGGER trg_pr_updated_at
  BEFORE UPDATE ON purchase_requisitions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_po_updated_at
  BEFORE UPDATE ON purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_grn_updated_at
  BEFORE UPDATE ON goods_received_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_invoice_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- STEP 12: CREATE THREE-WAY MATCH VIEW
-- =============================================

CREATE OR REPLACE VIEW v_three_way_match AS
SELECT
  po.po_id,
  po.po_number,
  poi.po_item_id,
  poi.item_id,
  i.sku,
  i.item_name,
  v.company_name AS vendor_name,

  -- PO Data
  poi.quantity AS po_qty,
  poi.unit_price AS po_unit_price,
  poi.line_total AS po_line_total,

  -- GRN Data
  COALESCE(grni.qty_accepted, grni.qty_received, 0) AS grn_qty,
  COALESCE(grni.unit_price, 0) AS grn_unit_price,
  COALESCE(grni.line_total, 0) AS grn_line_total,

  -- Invoice Data
  COALESCE(invi.quantity, 0) AS invoice_qty,
  COALESCE(invi.unit_price, 0) AS invoice_unit_price,
  COALESCE(invi.line_total, 0) AS invoice_line_total,

  -- Variance Calculations
  (poi.quantity - COALESCE(grni.qty_accepted, grni.qty_received, 0)) AS qty_variance_po_grn,
  (poi.quantity - COALESCE(invi.quantity, 0)) AS qty_variance_po_invoice,
  (poi.unit_price - COALESCE(grni.unit_price, 0)) AS price_variance_po_grn,
  (poi.unit_price - COALESCE(invi.unit_price, 0)) AS price_variance_po_invoice,

  -- Variance Percentage
  CASE
    WHEN poi.unit_price > 0 THEN
      ROUND(((poi.unit_price - COALESCE(invi.unit_price, 0)) / poi.unit_price * 100)::NUMERIC, 2)
    ELSE 0
  END AS price_variance_pct,

  -- Match Status
  CASE
    WHEN grni.grn_item_id IS NULL THEN 'NO_GRN'
    WHEN invi.invoice_item_id IS NULL THEN 'NO_INVOICE'
    WHEN poi.quantity = COALESCE(grni.qty_accepted, grni.qty_received, 0)
         AND COALESCE(grni.qty_accepted, grni.qty_received, 0) = COALESCE(invi.quantity, 0)
         AND poi.unit_price = COALESCE(invi.unit_price, 0)
    THEN 'MATCHED'
    WHEN ABS(poi.unit_price - COALESCE(invi.unit_price, 0)) / NULLIF(poi.unit_price, 0) * 100 > 10
    THEN 'HIGH_VARIANCE'
    ELSE 'VARIANCE'
  END AS match_status,

  grn.grn_id,
  grn.grn_number,
  inv.invoice_id,
  inv.invoice_number

FROM purchase_order_items poi
JOIN purchase_orders po ON poi.po_id = po.po_id
JOIN items i ON poi.item_id = i.item_id
JOIN vendors v ON po.vendor_id = v.vendor_id
LEFT JOIN grn_items grni ON grni.po_item_id = poi.po_item_id
LEFT JOIN goods_received_notes grn ON grni.grn_id = grn.grn_id
LEFT JOIN invoice_items invi ON invi.invoice_id IN (
  SELECT invoice_id FROM invoices WHERE grn_id = grn.grn_id
) AND invi.item_id = poi.item_id
LEFT JOIN invoices inv ON inv.invoice_id = invi.invoice_id;

COMMENT ON VIEW v_three_way_match IS 'Three-way matching: PO vs GRN vs Invoice with variance analysis';

-- =============================================
-- STEP 13: CREATE P2P SUMMARY VIEWS
-- =============================================

-- PR Summary View
CREATE OR REPLACE VIEW v_pr_summary AS
SELECT
  pr.pr_id,
  pr.pr_number,
  pr.department,
  pr.status,
  pr.urgency,
  up.full_name AS requested_by_name,
  pr.created_at AS request_date,
  pr.required_by_date,
  COUNT(pri.pr_item_id) AS item_count,
  pr.total_estimated_amount,
  pr.approved_at,
  CASE
    WHEN pr.status = 'Pending' AND pr.created_at < (NOW() - INTERVAL '48 hours') THEN true
    ELSE false
  END AS is_delayed
FROM purchase_requisitions pr
JOIN user_profiles up ON pr.requested_by = up.id
LEFT JOIN purchase_requisition_items pri ON pr.pr_id = pri.pr_id
GROUP BY pr.pr_id, pr.pr_number, pr.department, pr.status, pr.urgency, up.full_name, pr.created_at, pr.required_by_date, pr.total_estimated_amount, pr.approved_at;

-- PO Summary View
CREATE OR REPLACE VIEW v_po_summary AS
SELECT
  po.po_id,
  po.po_number,
  v.company_name AS vendor_name,
  po.status,
  po.po_date,
  po.expected_delivery_date,
  up.full_name AS created_by_name,
  COUNT(poi.po_item_id) AS item_count,
  SUM(poi.line_total) AS total_amount,
  COUNT(DISTINCT grn.grn_id) AS grn_count,
  CASE
    WHEN po.status IN ('Sent', 'Partial') AND po.expected_delivery_date < CURRENT_DATE THEN true
    ELSE false
  END AS is_overdue
FROM purchase_orders po
JOIN vendors v ON po.vendor_id = v.vendor_id
JOIN user_profiles up ON po.created_by = up.id
LEFT JOIN purchase_order_items poi ON po.po_id = poi.po_id
LEFT JOIN goods_received_notes grn ON grn.po_id = po.po_id
GROUP BY po.po_id, po.po_number, v.company_name, po.status, po.po_date, po.expected_delivery_date, up.full_name;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Count all P2P tables
SELECT
  'purchase_requisitions' AS table_name, COUNT(*) AS row_count FROM purchase_requisitions
UNION ALL
SELECT 'purchase_orders', COUNT(*) FROM purchase_orders
UNION ALL
SELECT 'goods_received_notes', COUNT(*) FROM goods_received_notes
UNION ALL
SELECT 'invoices', COUNT(*) FROM invoices;

-- =============================================
-- ROLLBACK INSTRUCTIONS
-- =============================================

/*
-- To rollback this migration:

DROP VIEW IF EXISTS v_three_way_match;
DROP VIEW IF EXISTS v_pr_summary;
DROP VIEW IF EXISTS v_po_summary;

DROP TRIGGER IF EXISTS trg_pr_auto_number ON purchase_requisitions;
DROP TRIGGER IF EXISTS trg_po_auto_number ON purchase_orders;
DROP TRIGGER IF EXISTS trg_grn_auto_number ON goods_received_notes;
DROP TRIGGER IF EXISTS trg_pr_updated_at ON purchase_requisitions;
DROP TRIGGER IF EXISTS trg_po_updated_at ON purchase_orders;
DROP TRIGGER IF EXISTS trg_grn_updated_at ON goods_received_notes;
DROP TRIGGER IF EXISTS trg_invoice_updated_at ON invoices;

DROP FUNCTION IF EXISTS generate_pr_number();
DROP FUNCTION IF EXISTS generate_po_number();
DROP FUNCTION IF EXISTS generate_grn_number();
DROP FUNCTION IF EXISTS trg_set_pr_number();
DROP FUNCTION IF EXISTS trg_set_po_number();
DROP FUNCTION IF EXISTS trg_set_grn_number();

DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS grn_items CASCADE;
DROP TABLE IF EXISTS goods_received_notes CASCADE;
DROP TABLE IF EXISTS purchase_order_items CASCADE;
DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS purchase_requisition_items CASCADE;
DROP TABLE IF EXISTS purchase_requisitions CASCADE;
*/

-- =============================================
-- END OF MIGRATION
-- =============================================
