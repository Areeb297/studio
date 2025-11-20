-- =============================================
-- MIGRATION: 04 - Inventory Ledger (Immutable Audit Trail)
-- =============================================
-- Creates immutable inventory ledger with automatic posting triggers
-- Updates stock levels automatically on GRN, Issues, Adjustments
-- =============================================
-- Created: 2025-01-25
-- Version: 1.0
-- Dependencies: 01_rbac_core.sql, 02_inventory_masters.sql, 03_p2p_workflow.sql
-- =============================================

-- =============================================
-- STEP 1: CREATE INVENTORY LEDGER TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS inventory_ledger (
  ledger_id BIGSERIAL PRIMARY KEY,
  item_id INT NOT NULL REFERENCES items(item_id) ON DELETE RESTRICT,
  store_id INT NOT NULL DEFAULT 1,
  batch_no TEXT,
  txn_type TEXT NOT NULL CHECK (txn_type IN ('GRN', 'ISSUE', 'ADJUSTMENT', 'TRANSFER_OUT', 'TRANSFER_IN', 'OPENING_BALANCE')),
  source_doc_type TEXT CHECK (source_doc_type IN ('GRN', 'ISSUE_SLIP', 'ADJUSTMENT', 'TRANSFER', 'OPENING')),
  source_doc_id BIGINT,  -- ID of source document (GRN ID, Issue ID, etc.)
  reference_number TEXT,  -- Document number (GRN-2025-0001, etc.)
  delta_qty NUMERIC NOT NULL,  -- Positive for IN, Negative for OUT
  qty_before NUMERIC NOT NULL CHECK (qty_before >= 0),
  qty_after NUMERIC NOT NULL CHECK (qty_after >= 0),
  unit_cost NUMERIC CHECK (unit_cost >= 0),
  total_value NUMERIC GENERATED ALWAYS AS (ABS(delta_qty) * COALESCE(unit_cost, 0)) STORED,
  txn_date TIMESTAMPTZ DEFAULT now(),
  actor UUID NOT NULL REFERENCES user_profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_delta_not_zero CHECK (delta_qty != 0),
  CONSTRAINT chk_qty_after_calc CHECK (qty_after = qty_before + delta_qty)
);

COMMENT ON TABLE inventory_ledger IS 'Immutable append-only ledger for all inventory movements with full audit trail';
COMMENT ON COLUMN inventory_ledger.delta_qty IS 'Positive = stock increase (GRN, Transfer In), Negative = stock decrease (Issue, Transfer Out)';
COMMENT ON COLUMN inventory_ledger.qty_before IS 'Stock quantity before transaction';
COMMENT ON COLUMN inventory_ledger.qty_after IS 'Stock quantity after transaction (auto-validated)';

-- Prevent updates and deletes on ledger (immutable)
CREATE RULE prevent_ledger_update AS ON UPDATE TO inventory_ledger DO INSTEAD NOTHING;
CREATE RULE prevent_ledger_delete AS ON DELETE TO inventory_ledger DO INSTEAD NOTHING;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ledger_item ON inventory_ledger(item_id);
CREATE INDEX IF NOT EXISTS idx_ledger_store ON inventory_ledger(store_id);
CREATE INDEX IF NOT EXISTS idx_ledger_txn_type ON inventory_ledger(txn_type);
CREATE INDEX IF NOT EXISTS idx_ledger_txn_date ON inventory_ledger(txn_date);
CREATE INDEX IF NOT EXISTS idx_ledger_batch ON inventory_ledger(batch_no) WHERE batch_no IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ledger_actor ON inventory_ledger(actor);
CREATE INDEX IF NOT EXISTS idx_ledger_source ON inventory_ledger(source_doc_type, source_doc_id);

-- =============================================
-- STEP 2: CREATE TRIGGER - GRN TO LEDGER
-- =============================================

CREATE OR REPLACE FUNCTION trg_grn_post_to_ledger()
RETURNS TRIGGER AS $$
DECLARE
  v_qty_before NUMERIC;
  v_qty_after NUMERIC;
  v_grn_number TEXT;
  v_unit_price NUMERIC;
BEGIN
  -- Get GRN number
  SELECT grn_number INTO v_grn_number
  FROM goods_received_notes
  WHERE grn_id = NEW.grn_id;

  -- Get current stock level (lock row for update)
  SELECT qty_on_hand INTO v_qty_before
  FROM item_stock_levels
  WHERE item_id = NEW.item_id AND store_id = 1
  FOR UPDATE;

  -- If no stock record exists, create one
  IF v_qty_before IS NULL THEN
    INSERT INTO item_stock_levels (item_id, store_id, qty_on_hand)
    VALUES (NEW.item_id, 1, 0);
    v_qty_before := 0;
  END IF;

  -- Calculate new quantity (use qty_accepted if quality check done, else qty_received)
  v_qty_after := v_qty_before + COALESCE(NEW.qty_accepted, NEW.qty_received);

  -- Update stock level
  UPDATE item_stock_levels
  SET qty_on_hand = v_qty_after,
      updated_at = now()
  WHERE item_id = NEW.item_id AND store_id = 1;

  -- Get unit price (from GRN or fallback to 0)
  v_unit_price := COALESCE(NEW.unit_price, 0);

  -- Insert ledger entry
  INSERT INTO inventory_ledger (
    item_id,
    store_id,
    batch_no,
    txn_type,
    source_doc_type,
    source_doc_id,
    reference_number,
    delta_qty,
    qty_before,
    qty_after,
    unit_cost,
    actor,
    notes
  ) VALUES (
    NEW.item_id,
    1,  -- Main store
    NEW.batch_no,
    'GRN',
    'GRN',
    NEW.grn_id,
    v_grn_number,
    COALESCE(NEW.qty_accepted, NEW.qty_received),
    v_qty_before,
    v_qty_after,
    v_unit_price,
    COALESCE(auth.uid(), (SELECT received_by FROM goods_received_notes WHERE grn_id = NEW.grn_id)),
    'Goods received from GRN'
  );

  -- Update PO item qty_received
  IF NEW.po_item_id IS NOT NULL THEN
    UPDATE purchase_order_items
    SET qty_received = qty_received + COALESCE(NEW.qty_accepted, NEW.qty_received)
    WHERE po_item_id = NEW.po_item_id;

    -- Update PO status if all items received
    UPDATE purchase_orders po
    SET status = CASE
      WHEN (SELECT SUM(qty_pending) FROM purchase_order_items WHERE po_id = po.po_id) = 0 THEN 'Received'
      ELSE 'Partial'
    END
    WHERE po_id = (SELECT po_id FROM purchase_order_items WHERE po_item_id = NEW.po_item_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_grn_items_to_ledger
  AFTER INSERT ON grn_items
  FOR EACH ROW
  EXECUTE FUNCTION trg_grn_post_to_ledger();

COMMENT ON FUNCTION trg_grn_post_to_ledger() IS 'Automatically posts GRN items to inventory ledger and updates stock levels';

-- =============================================
-- STEP 3: CREATE STOCK ADJUSTMENTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS stock_adjustments (
  adjustment_id BIGSERIAL PRIMARY KEY,
  adjustment_number TEXT UNIQUE NOT NULL,
  store_id INT NOT NULL DEFAULT 1,
  adjustment_type TEXT NOT NULL CHECK (adjustment_type IN ('Theft', 'Spoilage', 'Damage', 'Correction', 'Write-Off', 'Found')),
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Posted')),
  adjustment_date DATE DEFAULT CURRENT_DATE,
  reason TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  approved_by UUID REFERENCES user_profiles(id),
  approved_at TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_reason_not_empty CHECK (LENGTH(TRIM(reason)) > 0)
);

COMMENT ON TABLE stock_adjustments IS 'Stock adjustments for theft, spoilage, damage, corrections';
COMMENT ON COLUMN stock_adjustments.adjustment_type IS 'Theft/Spoilage/Damage = decrease stock, Found = increase stock, Correction = either';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_adjustments_status ON stock_adjustments(status);
CREATE INDEX IF NOT EXISTS idx_adjustments_type ON stock_adjustments(adjustment_type);
CREATE INDEX IF NOT EXISTS idx_adjustments_date ON stock_adjustments(adjustment_date);
CREATE INDEX IF NOT EXISTS idx_adjustments_created_by ON stock_adjustments(created_by);

-- =============================================
-- STEP 4: CREATE STOCK ADJUSTMENT ITEMS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS stock_adjustment_items (
  adjustment_item_id BIGSERIAL PRIMARY KEY,
  adjustment_id BIGINT NOT NULL REFERENCES stock_adjustments(adjustment_id) ON DELETE CASCADE,
  item_id INT NOT NULL REFERENCES items(item_id) ON DELETE RESTRICT,
  batch_no TEXT,
  qty_before NUMERIC NOT NULL CHECK (qty_before >= 0),
  qty_adjusted NUMERIC NOT NULL CHECK (qty_adjusted != 0),  -- Positive = increase, Negative = decrease
  qty_after NUMERIC GENERATED ALWAYS AS (qty_before + qty_adjusted) STORED,
  unit_cost NUMERIC CHECK (unit_cost >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE stock_adjustment_items IS 'Line items for stock adjustments';
COMMENT ON COLUMN stock_adjustment_items.qty_adjusted IS 'Positive = stock increase (Found), Negative = stock decrease (Theft/Spoilage/Damage)';

-- Prevent duplicate items in same adjustment
CREATE UNIQUE INDEX IF NOT EXISTS uq_adjustment_item ON stock_adjustment_items(adjustment_id, item_id, COALESCE(batch_no, ''));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_adj_items_adjustment ON stock_adjustment_items(adjustment_id);
CREATE INDEX IF NOT EXISTS idx_adj_items_item ON stock_adjustment_items(item_id);

-- =============================================
-- STEP 5: CREATE TRIGGER - ADJUSTMENT TO LEDGER
-- =============================================

CREATE OR REPLACE FUNCTION trg_adjustment_post_to_ledger()
RETURNS TRIGGER AS $$
DECLARE
  v_adjustment_number TEXT;
  v_adjustment_type TEXT;
  v_current_qty NUMERIC;
  v_new_qty NUMERIC;
BEGIN
  -- Only post if adjustment is approved
  SELECT adjustment_number, adjustment_type INTO v_adjustment_number, v_adjustment_type
  FROM stock_adjustments
  WHERE adjustment_id = NEW.adjustment_id AND status = 'Approved';

  IF v_adjustment_number IS NULL THEN
    RETURN NEW;  -- Not approved yet
  END IF;

  -- Get current stock (lock row)
  SELECT qty_on_hand INTO v_current_qty
  FROM item_stock_levels
  WHERE item_id = NEW.item_id AND store_id = 1
  FOR UPDATE;

  -- Calculate new quantity
  v_new_qty := v_current_qty + NEW.qty_adjusted;

  -- Prevent negative stock
  IF v_new_qty < 0 THEN
    RAISE EXCEPTION 'Adjustment would result in negative stock for item_id %', NEW.item_id;
  END IF;

  -- Update stock level
  UPDATE item_stock_levels
  SET qty_on_hand = v_new_qty,
      updated_at = now()
  WHERE item_id = NEW.item_id AND store_id = 1;

  -- Insert ledger entry
  INSERT INTO inventory_ledger (
    item_id,
    store_id,
    batch_no,
    txn_type,
    source_doc_type,
    source_doc_id,
    reference_number,
    delta_qty,
    qty_before,
    qty_after,
    unit_cost,
    actor,
    notes
  ) VALUES (
    NEW.item_id,
    1,
    NEW.batch_no,
    'ADJUSTMENT',
    'ADJUSTMENT',
    NEW.adjustment_id,
    v_adjustment_number,
    NEW.qty_adjusted,
    v_current_qty,
    v_new_qty,
    NEW.unit_cost,
    COALESCE(auth.uid(), (SELECT created_by FROM stock_adjustments WHERE adjustment_id = NEW.adjustment_id)),
    'Stock adjustment: ' || v_adjustment_type
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_adjustment_items_to_ledger
  AFTER INSERT ON stock_adjustment_items
  FOR EACH ROW
  EXECUTE FUNCTION trg_adjustment_post_to_ledger();

-- =============================================
-- STEP 6: CREATE STOCK TRANSFERS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS stock_transfers (
  transfer_id BIGSERIAL PRIMARY KEY,
  transfer_number TEXT UNIQUE NOT NULL,
  from_store_id INT NOT NULL REFERENCES stores(store_id),
  to_store_id INT NOT NULL REFERENCES stores(store_id),
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'In-Transit', 'Received', 'Rejected')),
  transfer_date DATE DEFAULT CURRENT_DATE,
  reason TEXT NOT NULL,
  requested_by UUID NOT NULL REFERENCES user_profiles(id),
  approved_by UUID REFERENCES user_profiles(id),
  approved_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  received_by UUID REFERENCES user_profiles(id),
  received_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_different_stores CHECK (from_store_id != to_store_id)
);

COMMENT ON TABLE stock_transfers IS 'Transfer stock between stores/locations';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_transfers_from_store ON stock_transfers(from_store_id);
CREATE INDEX IF NOT EXISTS idx_transfers_to_store ON stock_transfers(to_store_id);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON stock_transfers(status);

-- =============================================
-- STEP 7: CREATE STOCK TRANSFER ITEMS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS stock_transfer_items (
  transfer_item_id BIGSERIAL PRIMARY KEY,
  transfer_id BIGINT NOT NULL REFERENCES stock_transfers(transfer_id) ON DELETE CASCADE,
  item_id INT NOT NULL REFERENCES items(item_id) ON DELETE RESTRICT,
  batch_no TEXT,
  qty_transferred NUMERIC NOT NULL CHECK (qty_transferred > 0),
  qty_received NUMERIC CHECK (qty_received >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE stock_transfer_items IS 'Line items for stock transfers';

-- Prevent duplicate items in same transfer
CREATE UNIQUE INDEX IF NOT EXISTS uq_transfer_item ON stock_transfer_items(transfer_id, item_id, COALESCE(batch_no, ''));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_transfer_items_transfer ON stock_transfer_items(transfer_id);
CREATE INDEX IF NOT EXISTS idx_transfer_items_item ON stock_transfer_items(item_id);

-- =============================================
-- STEP 8: CREATE AUTO-NUMBERING FOR ADJUSTMENTS/TRANSFERS
-- =============================================

-- Generate adjustment number
CREATE OR REPLACE FUNCTION generate_adjustment_number()
RETURNS TEXT AS $$
DECLARE
  v_year TEXT;
  v_seq INT;
BEGIN
  v_year := TO_CHAR(CURRENT_DATE, 'YYYY');
  SELECT COALESCE(MAX(CAST(SUBSTRING(adjustment_number FROM 9) AS INT)), 0) + 1 INTO v_seq
  FROM stock_adjustments
  WHERE adjustment_number LIKE 'ADJ-' || v_year || '-%';
  RETURN 'ADJ-' || v_year || '-' || LPAD(v_seq::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Generate transfer number
CREATE OR REPLACE FUNCTION generate_transfer_number()
RETURNS TEXT AS $$
DECLARE
  v_year TEXT;
  v_seq INT;
BEGIN
  v_year := TO_CHAR(CURRENT_DATE, 'YYYY');
  SELECT COALESCE(MAX(CAST(SUBSTRING(transfer_number FROM 10) AS INT)), 0) + 1 INTO v_seq
  FROM stock_transfers
  WHERE transfer_number LIKE 'XFER-' || v_year || '-%';
  RETURN 'XFER-' || v_year || '-' || LPAD(v_seq::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-numbering
CREATE OR REPLACE FUNCTION trg_set_adjustment_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.adjustment_number IS NULL OR NEW.adjustment_number = '' THEN
    NEW.adjustment_number := generate_adjustment_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_adjustment_auto_number
  BEFORE INSERT ON stock_adjustments
  FOR EACH ROW
  EXECUTE FUNCTION trg_set_adjustment_number();

CREATE OR REPLACE FUNCTION trg_set_transfer_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.transfer_number IS NULL OR NEW.transfer_number = '' THEN
    NEW.transfer_number := generate_transfer_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_transfer_auto_number
  BEFORE INSERT ON stock_transfers
  FOR EACH ROW
  EXECUTE FUNCTION trg_set_transfer_number();

-- =============================================
-- STEP 9: CREATE LEDGER SUMMARY VIEWS
-- =============================================

-- Stock Ledger Summary per Item
CREATE OR REPLACE VIEW v_stock_ledger_summary AS
SELECT
  i.item_id,
  i.sku,
  i.item_name,
  isl.store_id,
  s.store_name,
  isl.qty_on_hand,
  COUNT(il.ledger_id) AS total_transactions,
  SUM(CASE WHEN il.delta_qty > 0 THEN il.delta_qty ELSE 0 END) AS total_in,
  SUM(CASE WHEN il.delta_qty < 0 THEN ABS(il.delta_qty) ELSE 0 END) AS total_out,
  SUM(il.total_value) AS total_value,
  MAX(il.txn_date) AS last_transaction_date
FROM items i
JOIN item_stock_levels isl ON i.item_id = isl.item_id
JOIN stores s ON isl.store_id = s.store_id
LEFT JOIN inventory_ledger il ON i.item_id = il.item_id AND isl.store_id = il.store_id
GROUP BY i.item_id, i.sku, i.item_name, isl.store_id, s.store_name, isl.qty_on_hand;

COMMENT ON VIEW v_stock_ledger_summary IS 'Summary of stock movements per item with total IN/OUT quantities';

-- Stock Valuation View (FIFO method)
CREATE OR REPLACE VIEW v_stock_valuation AS
SELECT
  i.item_id,
  i.sku,
  i.item_name,
  isl.store_id,
  isl.qty_on_hand,
  COALESCE(AVG(il.unit_cost), 0) AS avg_unit_cost,
  COALESCE(isl.qty_on_hand * AVG(il.unit_cost), 0) AS total_value
FROM items i
JOIN item_stock_levels isl ON i.item_id = isl.item_id
LEFT JOIN inventory_ledger il ON i.item_id = il.item_id AND il.unit_cost > 0
WHERE isl.qty_on_hand > 0
GROUP BY i.item_id, i.sku, i.item_name, isl.store_id, isl.qty_on_hand;

COMMENT ON VIEW v_stock_valuation IS 'Current stock valuation using average cost method';

-- =============================================
-- STEP 10: CREATE UPDATED_AT TRIGGERS
-- =============================================

CREATE TRIGGER trg_adjustments_updated_at
  BEFORE UPDATE ON stock_adjustments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_transfers_updated_at
  BEFORE UPDATE ON stock_transfers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Verify ledger is immutable
-- SELECT tablename, rulename, definition FROM pg_rules WHERE tablename = 'inventory_ledger';

-- Count ledger entries
SELECT COUNT(*) AS ledger_entries FROM inventory_ledger;

-- Verify stock levels match ledger
SELECT
  i.item_name,
  isl.qty_on_hand AS stock_level,
  COALESCE(SUM(il.delta_qty), 0) AS ledger_calculated,
  CASE
    WHEN isl.qty_on_hand = COALESCE(SUM(il.delta_qty), 0) THEN 'MATCH'
    ELSE 'MISMATCH'
  END AS validation_status
FROM items i
JOIN item_stock_levels isl ON i.item_id = isl.item_id
LEFT JOIN inventory_ledger il ON i.item_id = il.item_id AND isl.store_id = il.store_id
GROUP BY i.item_id, i.item_name, isl.qty_on_hand;

-- =============================================
-- ROLLBACK INSTRUCTIONS
-- =============================================

/*
-- To rollback this migration:

DROP VIEW IF EXISTS v_stock_ledger_summary;
DROP VIEW IF EXISTS v_stock_valuation;

DROP TRIGGER IF EXISTS trg_grn_items_to_ledger ON grn_items;
DROP TRIGGER IF EXISTS trg_adjustment_items_to_ledger ON stock_adjustment_items;
DROP TRIGGER IF EXISTS trg_adjustment_auto_number ON stock_adjustments;
DROP TRIGGER IF EXISTS trg_transfer_auto_number ON stock_transfers;
DROP TRIGGER IF EXISTS trg_adjustments_updated_at ON stock_adjustments;
DROP TRIGGER IF EXISTS trg_transfers_updated_at ON stock_transfers;

DROP FUNCTION IF EXISTS trg_grn_post_to_ledger();
DROP FUNCTION IF EXISTS trg_adjustment_post_to_ledger();
DROP FUNCTION IF EXISTS generate_adjustment_number();
DROP FUNCTION IF EXISTS generate_transfer_number();
DROP FUNCTION IF EXISTS trg_set_adjustment_number();
DROP FUNCTION IF EXISTS trg_set_transfer_number();

DROP RULE IF EXISTS prevent_ledger_update ON inventory_ledger;
DROP RULE IF EXISTS prevent_ledger_delete ON inventory_ledger;

DROP TABLE IF EXISTS stock_transfer_items CASCADE;
DROP TABLE IF EXISTS stock_transfers CASCADE;
DROP TABLE IF EXISTS stock_adjustment_items CASCADE;
DROP TABLE IF EXISTS stock_adjustments CASCADE;
DROP TABLE IF EXISTS inventory_ledger CASCADE;
*/

-- =============================================
-- END OF MIGRATION
-- =============================================
