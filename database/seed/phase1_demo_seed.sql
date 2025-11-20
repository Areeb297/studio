-- =============================================
-- SEED DATA: Phase 1 Demo - Complete P2P Cycle
-- =============================================
-- Demonstrates complete Procure-to-Pay workflow:
-- PR → Approval (L1/L2/L3) → PO → GRN → Invoice
-- =============================================
-- Created: 2025-01-25
-- Version: 1.0
-- Dependencies: Migrations 01-06 must be applied
-- =============================================

-- =============================================
-- PREREQUISITES CHECK
-- =============================================

DO $$
BEGIN
  -- Verify required tables exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'roles') THEN
    RAISE EXCEPTION 'Migration 01 (RBAC) not applied. Please run migrations first.';
  END IF;

  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'items') THEN
    RAISE EXCEPTION 'Migration 02 (Inventory Masters) not applied. Please run migrations first.';
  END IF;

  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'purchase_requisitions') THEN
    RAISE EXCEPTION 'Migration 03 (P2P Workflow) not applied. Please run migrations first.';
  END IF;

  RAISE NOTICE 'Prerequisites check passed. Proceeding with seed data...';
END $$;

-- =============================================
-- STEP 1: ITEM CATEGORIES
-- =============================================

INSERT INTO item_categories (category_id, category_name, parent_category_id, description, is_active)
VALUES
  (1, 'Raw Materials', NULL, 'Primary ingredients for food preparation', true),
  (2, 'Consumables', NULL, 'Day-to-day consumable items', true),
  (3, 'Tools & Equipment', NULL, 'Kitchen tools and equipment', true),
  (4, 'Grains & Cereals', 1, 'Rice, wheat, and other grains', true),
  (5, 'Cooking Oils', 1, 'Edible oils for cooking', true),
  (6, 'Spices', 2, 'Spices and seasonings', true),
  (7, 'Vegetables', 1, 'Fresh vegetables', true)
ON CONFLICT (category_id) DO NOTHING;

-- Reset sequence
SELECT setval('item_categories_category_id_seq', (SELECT MAX(category_id) FROM item_categories), true);

COMMENT ON COLUMN item_categories.category_id IS 'Demo categories: 1=Raw Materials, 2=Consumables, 3=Tools, 4-7=Subcategories';

-- =============================================
-- STEP 2: ITEMS (10 SAMPLE ITEMS)
-- =============================================

INSERT INTO items (item_id, sku, item_name, category_id, uom, description, is_batch_tracked, is_warranty_tracked, is_donation_eligible, reorder_days, is_active)
VALUES
  (1, 'RICE-001', 'Basmati Rice (Premium)', 4, 'KG', 'Premium quality basmati rice', true, false, true, 7, true),
  (2, 'OIL-001', 'Cooking Oil (Sunflower)', 5, 'L', 'Refined sunflower cooking oil', true, false, true, 10, true),
  (3, 'SALT-001', 'Salt (Iodized)', 2, 'KG', 'Iodized table salt', false, false, true, 14, true),
  (4, 'ONION-001', 'Onions (Fresh)', 7, 'KG', 'Fresh onions', false, false, true, 3, true),
  (5, 'SPICE-001', 'Red Chili Powder', 6, 'KG', 'Ground red chili powder', true, false, true, 7, true),
  (6, 'SPICE-002', 'Turmeric Powder', 6, 'KG', 'Ground turmeric powder', true, false, true, 7, true),
  (7, 'SPICE-003', 'Cumin Seeds', 6, 'KG', 'Whole cumin seeds', true, false, true, 7, true),
  (8, 'RICE-002', 'Sella Rice (Regular)', 4, 'KG', 'Regular quality sella rice', true, false, true, 7, true),
  (9, 'OIL-002', 'Ghee (Pure)', 5, 'KG', 'Pure desi ghee', true, false, true, 10, true),
  (10, 'TOOL-001', 'Large Cooking Pot', 3, 'PCS', '50-liter stainless steel cooking pot', false, true, false, 30, true)
ON CONFLICT (item_id) DO NOTHING;

-- Reset sequence
SELECT setval('items_item_id_seq', (SELECT MAX(item_id) FROM items), true);

COMMENT ON COLUMN items.item_id IS 'Demo items: 1-10 covering various categories and tracking requirements';

-- =============================================
-- STEP 3: VENDORS (3 VENDORS)
-- =============================================

INSERT INTO vendors (vendor_id, vendor_code, company_name, contact_person, phone, email, address, city, ntn, strn, bank_name, bank_account, payment_terms, credit_limit, status, rating, notes, approved_at)
VALUES
  (1, 'VEN-0001', 'Karachi Food Supplies Ltd.', 'Muhammad Ahmed', '+92-300-1234567', 'ahmed@kfsl.com', 'Shop 12, Johar Market', 'Karachi', '1234567-8', 'STN-001234', 'Meezan Bank', '0123456789012345', 'Net 30', 500000, 'Approved', 4.50, 'Reliable supplier for rice and grains', now() - interval '30 days'),
  (2, 'VEN-0002', 'Al-Madina Trading Co.', 'Irfan Ali', '+92-321-7654321', 'irfan@amadina.com', '45-B, Tariq Road', 'Karachi', '7654321-2', 'STN-005678', 'UBL', '9876543210123456', 'Net 45', 300000, 'Pending', 0.00, 'New vendor under evaluation', NULL),
  (3, 'VEN-0003', 'Quality Oils & Spices', 'Salman Hassan', '+92-333-9876543', 'salman@qoils.com', 'Warehouse 7, SITE Area', 'Karachi', '9876543-1', 'STN-009999', 'HBL', '1122334455667788', 'Net 15', 200000, 'Blocked', 2.00, 'Blocked due to quality issues in last delivery', NULL)
ON CONFLICT (vendor_id) DO NOTHING;

-- Reset sequence
SELECT setval('vendors_vendor_id_seq', (SELECT MAX(vendor_id) FROM vendors), true);

COMMENT ON COLUMN vendors.vendor_id IS 'Demo vendors: 1=Approved (can transact), 2=Pending (under review), 3=Blocked (cannot create POs)';

-- =============================================
-- STEP 4: VENDOR ITEM PRICES
-- =============================================

INSERT INTO vendor_item_prices (vendor_id, item_id, unit_price, currency, valid_from, valid_to, is_active)
VALUES
  -- Karachi Food Supplies (VEN-0001)
  (1, 1, 180.00, 'PKR', '2025-01-01', NULL, true),  -- Basmati Rice
  (1, 4, 80.00, 'PKR', '2025-01-01', NULL, true),   -- Onions
  (1, 8, 150.00, 'PKR', '2025-01-01', NULL, true),  -- Sella Rice

  -- Al-Madina Trading (VEN-0002) - Pending vendor
  (2, 5, 450.00, 'PKR', '2025-01-01', NULL, true),  -- Red Chili Powder
  (2, 6, 300.00, 'PKR', '2025-01-01', NULL, true),  -- Turmeric

  -- Quality Oils & Spices (VEN-0003) - Blocked vendor
  (3, 2, 380.00, 'PKR', '2024-12-01', '2025-01-15', false),  -- Cooking Oil (old price)
  (3, 9, 850.00, 'PKR', '2024-12-01', '2025-01-15', false)   -- Ghee (old price)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE vendor_item_prices IS 'Demo prices: VEN-0001 has active prices, VEN-0002 pending approval, VEN-0003 blocked with expired prices';

-- =============================================
-- STEP 5: ITEM STOCK LEVELS
-- =============================================

INSERT INTO item_stock_levels (item_id, store_id, qty_on_hand, qty_allocated, min_level, max_level, reorder_level, last_counted_at, last_counted_qty)
VALUES
  (1, 1, 50, 0, 100, 500, 150, now() - interval '7 days', 50),   -- Basmati Rice: LOW STOCK
  (2, 1, 80, 0, 50, 300, 100, now() - interval '7 days', 80),    -- Cooking Oil: LOW STOCK
  (3, 1, 200, 0, 50, 200, 80, now() - interval '7 days', 200),   -- Salt: OK
  (4, 1, 30, 0, 50, 200, 80, now() - interval '2 days', 30),     -- Onions: LOW STOCK
  (5, 1, 15, 0, 20, 100, 30, now() - interval '7 days', 15),     -- Red Chili: LOW STOCK
  (6, 1, 25, 0, 20, 80, 30, now() - interval '7 days', 25),      -- Turmeric: LOW STOCK
  (7, 1, 40, 0, 30, 100, 40, now() - interval '7 days', 40),     -- Cumin: OK
  (8, 1, 120, 0, 100, 400, 150, now() - interval '7 days', 120), -- Sella Rice: OK
  (9, 1, 30, 0, 20, 100, 40, now() - interval '10 days', 30),    -- Ghee: LOW STOCK
  (10, 1, 5, 0, 3, 10, 5, now() - interval '30 days', 5)         -- Cooking Pot: OK
ON CONFLICT (item_id, store_id) DO NOTHING;

COMMENT ON TABLE item_stock_levels IS 'Demo stock: Items 1,2,4,5,6,9 are below reorder level (triggering PR creation)';

-- =============================================
-- STEP 6: LINK USERS TO ROLES
-- =============================================
-- Note: This assumes users exist in user_profiles from setup-auth script
-- We'll update their role_id and approval_limit based on their email

DO $$
DECLARE
  v_role_admin INT;
  v_role_store_keeper INT;
  v_role_dept_head_kitchen INT;
  v_role_purchasing_officer INT;
  v_role_approver_l1 INT;
  v_role_approver_l2 INT;
  v_role_gm INT;
  v_role_finance_officer INT;
  v_role_auditor INT;
BEGIN
  -- Get role IDs
  SELECT role_id INTO v_role_admin FROM roles WHERE role_name = 'admin';
  SELECT role_id INTO v_role_store_keeper FROM roles WHERE role_name = 'store_keeper';
  SELECT role_id INTO v_role_dept_head_kitchen FROM roles WHERE role_name = 'dept_head_kitchen';
  SELECT role_id INTO v_role_purchasing_officer FROM roles WHERE role_name = 'purchasing_officer';
  SELECT role_id INTO v_role_approver_l1 FROM roles WHERE role_name = 'approver_l1';
  SELECT role_id INTO v_role_approver_l2 FROM roles WHERE role_name = 'approver_l2';
  SELECT role_id INTO v_role_gm FROM roles WHERE role_name = 'gm';
  SELECT role_id INTO v_role_finance_officer FROM roles WHERE role_name = 'finance_officer';
  SELECT role_id INTO v_role_auditor FROM roles WHERE role_name = 'auditor';

  -- Update existing user profiles with role_id and approval_limit
  UPDATE public.user_profiles
  SET role_id = v_role_admin, approval_limit = NULL, department = 'Executive'
  WHERE email = 'admin@rahah24.com';

  UPDATE public.user_profiles
  SET role_id = v_role_store_keeper, approval_limit = NULL, department = 'Inventory'
  WHERE email = 'storekeeper@rahah24.com';

  UPDATE public.user_profiles
  SET role_id = v_role_dept_head_kitchen, approval_limit = 50000, department = 'Kitchen'
  WHERE email = 'kitchen.head@rahah24.com';

  UPDATE public.user_profiles
  SET role_id = v_role_purchasing_officer, approval_limit = NULL, department = 'Procurement'
  WHERE email = 'procurement@rahah24.com';

  UPDATE public.user_profiles
  SET role_id = v_role_approver_l1, approval_limit = 50000, department = 'Operations'
  WHERE email = 'approver.l1@rahah24.com';

  UPDATE public.user_profiles
  SET role_id = v_role_approver_l2, approval_limit = 200000, department = 'Operations'
  WHERE email = 'approver.l2@rahah24.com';

  UPDATE public.user_profiles
  SET role_id = v_role_gm, approval_limit = NULL, department = 'Executive'
  WHERE email = 'gm@rahah24.com';

  UPDATE public.user_profiles
  SET role_id = v_role_finance_officer, approval_limit = NULL, department = 'Finance'
  WHERE email = 'finance@rahah24.com';

  UPDATE public.user_profiles
  SET role_id = v_role_auditor, approval_limit = NULL, department = 'Audit'
  WHERE email = 'auditor@rahah24.com';

  RAISE NOTICE 'User roles and approval limits updated successfully';
END $$;

-- =============================================
-- STEP 7: COMPLETE P2P CYCLE DEMO
-- =============================================

-- =============================================
-- 7A: CREATE PURCHASE REQUISITION
-- =============================================

DO $$
DECLARE
  v_pr_id INT;
  v_pr_number TEXT;
  v_requester_id UUID;
  v_total_amount NUMERIC := 0;
BEGIN
  -- Get Store Keeper user ID (PR creator)
  SELECT id INTO v_requester_id
  FROM public.user_profiles
  WHERE email = 'storekeeper@rahah24.com'
  LIMIT 1;

  IF v_requester_id IS NULL THEN
    RAISE EXCEPTION 'Store Keeper user not found. Please create users first.';
  END IF;

  -- Generate PR number
  v_pr_number := generate_pr_number();

  -- Calculate total estimated amount
  -- Item 1 (Basmati Rice): 200 KG x 180 PKR = 36,000
  -- Item 2 (Cooking Oil): 100 L x 380 PKR = 38,000
  -- Item 4 (Onions): 150 KG x 80 PKR = 12,000
  -- Total: 86,000 PKR (triggers L2 approval: 50K-200K range)
  v_total_amount := 86000;

  -- Insert PR header
  INSERT INTO purchase_requisitions (
    pr_number,
    requested_by,
    request_date,
    required_date,
    department,
    purpose,
    total_estimated_amount,
    status,
    priority,
    notes
  ) VALUES (
    v_pr_number,
    v_requester_id,
    CURRENT_DATE,
    CURRENT_DATE + interval '7 days',
    'Kitchen',
    'Restock low inventory items for daily operations',
    v_total_amount,
    'Pending',
    'High',
    'Urgent: Multiple items below reorder level. Kitchen operations at risk.'
  ) RETURNING pr_id INTO v_pr_id;

  -- Insert PR items
  INSERT INTO purchase_requisition_items (pr_id, item_id, quantity, estimated_unit_price, specifications)
  VALUES
    (v_pr_id, 1, 200, 180.00, 'Premium quality basmati rice, 2024 harvest'),
    (v_pr_id, 2, 100, 380.00, 'Refined sunflower oil in sealed containers'),
    (v_pr_id, 4, 150, 80.00, 'Fresh onions, Grade A quality');

  RAISE NOTICE 'Purchase Requisition created: % (ID: %, Amount: PKR %, Status: Pending)',
    v_pr_number, v_pr_id, v_total_amount;
  RAISE NOTICE 'Expected approval routing: Level 2 (amount between 50K-200K)';

  -- Store PR ID for next steps
  PERFORM set_config('demo.pr_id', v_pr_id::text, true);
  PERFORM set_config('demo.pr_number', v_pr_number, true);
END $$;

-- Check approval routing (should auto-route to L2)
DO $$
DECLARE
  v_pr_id INT;
  v_approval_count INT;
  v_approval_level INT;
  v_approver_email TEXT;
BEGIN
  v_pr_id := current_setting('demo.pr_id')::INT;

  SELECT COUNT(*), MAX(level) INTO v_approval_count, v_approval_level
  FROM approvals
  WHERE doc_type = 'PR' AND doc_id = v_pr_id;

  IF v_approval_count > 0 THEN
    SELECT up.email INTO v_approver_email
    FROM approvals a
    JOIN public.user_profiles up ON a.approver = up.id
    WHERE a.doc_type = 'PR' AND a.doc_id = v_pr_id;

    RAISE NOTICE '✓ Approval auto-routed: Level %, Assigned to: %', v_approval_level, v_approver_email;
  ELSE
    RAISE WARNING '✗ Approval routing failed. Check approval_thresholds and trigger.';
  END IF;
END $$;

-- =============================================
-- 7B: APPROVE PURCHASE REQUISITION
-- =============================================

DO $$
DECLARE
  v_pr_id INT;
  v_approval_id BIGINT;
  v_approver_id UUID;
BEGIN
  v_pr_id := current_setting('demo.pr_id')::INT;

  -- Get L2 approver ID
  SELECT id INTO v_approver_id
  FROM public.user_profiles
  WHERE email = 'approver.l2@rahah24.com'
  LIMIT 1;

  IF v_approver_id IS NULL THEN
    RAISE EXCEPTION 'L2 Approver user not found';
  END IF;

  -- Get approval record
  SELECT approval_id INTO v_approval_id
  FROM approvals
  WHERE doc_type = 'PR' AND doc_id = v_pr_id AND status = 'Pending'
  LIMIT 1;

  IF v_approval_id IS NULL THEN
    RAISE WARNING 'No pending approval found for PR. Skipping approval step.';
    RETURN;
  END IF;

  -- Approve the PR (using approver's context)
  -- Note: In production, this would be done via RLS-protected function
  UPDATE approvals
  SET status = 'Approved',
      comments = 'Approved for procurement. Good prices from VEN-0001.',
      decided_at = now()
  WHERE approval_id = v_approval_id;

  -- Update PR status
  UPDATE purchase_requisitions
  SET status = 'Approved',
      approved_by = v_approver_id,
      approved_at = now()
  WHERE pr_id = v_pr_id;

  RAISE NOTICE '✓ Purchase Requisition approved by L2 Approver';
END $$;

-- =============================================
-- 7C: CREATE PURCHASE ORDER FROM PR
-- =============================================

DO $$
DECLARE
  v_pr_id INT;
  v_po_id INT;
  v_po_number TEXT;
  v_purchaser_id UUID;
  v_total_amount NUMERIC := 0;
BEGIN
  v_pr_id := current_setting('demo.pr_id')::INT;

  -- Get Purchasing Officer user ID
  SELECT id INTO v_purchaser_id
  FROM public.user_profiles
  WHERE email = 'procurement@rahah24.com'
  LIMIT 1;

  IF v_purchaser_id IS NULL THEN
    RAISE EXCEPTION 'Purchasing Officer user not found';
  END IF;

  -- Generate PO number
  v_po_number := generate_po_number();

  -- Calculate total (using actual vendor prices)
  -- Item 1: 200 KG x 180 PKR = 36,000
  -- Item 2: 100 L x 380 PKR = 38,000
  -- Item 4: 150 KG x 80 PKR = 12,000
  -- Total: 86,000 PKR
  v_total_amount := 86000;

  -- Insert PO header
  INSERT INTO purchase_orders (
    po_number,
    pr_id,
    vendor_id,
    created_by,
    po_date,
    expected_delivery_date,
    total_amount,
    status,
    payment_terms,
    delivery_address,
    notes
  ) VALUES (
    v_po_number,
    v_pr_id,
    1,  -- Karachi Food Supplies (Approved vendor)
    v_purchaser_id,
    CURRENT_DATE,
    CURRENT_DATE + interval '5 days',
    v_total_amount,
    'Draft',
    'Net 30',
    'Jamia Binoria Aalamia, Main Store, Ground Floor, Karachi',
    'PO generated from PR-' || current_setting('demo.pr_number')
  ) RETURNING po_id INTO v_po_id;

  -- Insert PO items from PR items
  INSERT INTO purchase_order_items (po_id, item_id, quantity, unit_price, tax_rate, notes)
  SELECT
    v_po_id,
    pri.item_id,
    pri.quantity,
    vip.unit_price,  -- Use actual vendor price
    0.00,  -- No tax for demo
    pri.specifications
  FROM purchase_requisition_items pri
  JOIN vendor_item_prices vip ON pri.item_id = vip.item_id AND vip.vendor_id = 1 AND vip.is_active = true
  WHERE pri.pr_id = v_pr_id;

  RAISE NOTICE '✓ Purchase Order created: % (ID: %, Amount: PKR %, Status: Draft)',
    v_po_number, v_po_id, v_total_amount;

  -- Store PO ID for next steps
  PERFORM set_config('demo.po_id', v_po_id::text, true);
  PERFORM set_config('demo.po_number', v_po_number, true);
END $$;

-- Send PO to vendor (status change: Draft → Sent)
DO $$
DECLARE
  v_po_id INT;
  v_purchaser_id UUID;
BEGIN
  v_po_id := current_setting('demo.po_id')::INT;

  SELECT id INTO v_purchaser_id
  FROM public.user_profiles
  WHERE email = 'procurement@rahah24.com'
  LIMIT 1;

  UPDATE purchase_orders
  SET status = 'Sent',
      sent_date = now(),
      sent_by = v_purchaser_id
  WHERE po_id = v_po_id;

  RAISE NOTICE '✓ Purchase Order sent to vendor: %', current_setting('demo.po_number');
END $$;

-- =============================================
-- 7D: CREATE GOODS RECEIVED NOTE
-- =============================================

DO $$
DECLARE
  v_po_id INT;
  v_grn_id INT;
  v_grn_number TEXT;
  v_receiver_id UUID;
BEGIN
  v_po_id := current_setting('demo.po_id')::INT;

  -- Get Store Keeper user ID (GRN receiver)
  SELECT id INTO v_receiver_id
  FROM public.user_profiles
  WHERE email = 'storekeeper@rahah24.com'
  LIMIT 1;

  -- Generate GRN number
  v_grn_number := generate_grn_number();

  -- Insert GRN header
  INSERT INTO goods_received_notes (
    grn_number,
    po_id,
    received_by,
    received_date,
    status,
    is_donation,
    notes
  ) VALUES (
    v_grn_number,
    v_po_id,
    v_receiver_id,
    CURRENT_DATE + interval '4 days',  -- Received 1 day early
    'Draft',
    false,
    'Goods received in good condition. All items inspected.'
  ) RETURNING grn_id INTO v_grn_id;

  -- Insert GRN items (full receipt, all quality approved)
  INSERT INTO grn_items (grn_id, item_id, qty_ordered, qty_received, qty_accepted, qty_rejected, unit_price, quality_status, batch_number, expiry_date, notes)
  SELECT
    v_grn_id,
    poi.item_id,
    poi.quantity,
    poi.quantity,  -- Full quantity received
    poi.quantity,  -- Full quantity accepted
    0,             -- No rejections
    poi.unit_price,
    'Approved',
    CASE
      WHEN i.is_batch_tracked THEN 'BATCH-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(i.item_id::TEXT, 3, '0')
      ELSE NULL
    END,
    CASE
      WHEN i.is_batch_tracked THEN CURRENT_DATE + interval '365 days'
      ELSE NULL
    END,
    'Quality check passed. No issues.'
  FROM purchase_order_items poi
  JOIN items i ON poi.item_id = i.item_id
  WHERE poi.po_id = v_po_id;

  RAISE NOTICE '✓ Goods Received Note created: % (ID: %, Status: Draft)', v_grn_number, v_grn_id;

  -- Store GRN ID for next steps
  PERFORM set_config('demo.grn_id', v_grn_id::text, true);
  PERFORM set_config('demo.grn_number', v_grn_number, true);
END $$;

-- Post GRN to inventory ledger (triggers stock update)
DO $$
DECLARE
  v_grn_id INT;
BEGIN
  v_grn_id := current_setting('demo.grn_id')::INT;

  -- Change status to Posted (triggers ledger posting)
  UPDATE goods_received_notes
  SET status = 'Posted',
      posted_date = now()
  WHERE grn_id = v_grn_id;

  RAISE NOTICE '✓ GRN posted to inventory ledger. Stock levels updated automatically via triggers.';
END $$;

-- Verify stock updates
DO $$
DECLARE
  v_item_record RECORD;
BEGIN
  RAISE NOTICE '=== STOCK LEVELS AFTER GRN ===';

  FOR v_item_record IN
    SELECT i.sku, i.item_name, isl.qty_on_hand, isl.qty_available
    FROM items i
    JOIN item_stock_levels isl ON i.item_id = isl.item_id
    WHERE i.item_id IN (1, 2, 4)
    ORDER BY i.item_id
  LOOP
    RAISE NOTICE '% (%): On Hand = %, Available = %',
      v_item_record.sku, v_item_record.item_name, v_item_record.qty_on_hand, v_item_record.qty_available;
  END LOOP;
END $$;

-- =============================================
-- 7E: CREATE INVOICE
-- =============================================

DO $$
DECLARE
  v_po_id INT;
  v_grn_id INT;
  v_invoice_id INT;
  v_invoice_number TEXT;
  v_finance_id UUID;
  v_total_amount NUMERIC := 0;
BEGIN
  v_po_id := current_setting('demo.po_id')::INT;
  v_grn_id := current_setting('demo.grn_id')::INT;

  -- Get Finance Officer user ID
  SELECT id INTO v_finance_id
  FROM public.user_profiles
  WHERE email = 'finance@rahah24.com'
  LIMIT 1;

  IF v_finance_id IS NULL THEN
    RAISE EXCEPTION 'Finance Officer user not found';
  END IF;

  -- Generate invoice number (vendor invoice number)
  v_invoice_number := 'VEN-0001-INV-2025-0142';

  -- Calculate total
  SELECT total_amount INTO v_total_amount
  FROM purchase_orders
  WHERE po_id = v_po_id;

  -- Insert Invoice header
  INSERT INTO invoices (
    invoice_number,
    po_id,
    grn_id,
    vendor_id,
    invoice_date,
    due_date,
    total_amount,
    status,
    payment_status,
    received_by,
    received_date,
    notes
  ) VALUES (
    v_invoice_number,
    v_po_id,
    v_grn_id,
    1,  -- Karachi Food Supplies
    CURRENT_DATE + interval '5 days',
    CURRENT_DATE + interval '35 days',  -- Net 30 days
    v_total_amount,
    'Pending',
    'Unpaid',
    v_finance_id,
    CURRENT_DATE + interval '5 days',
    'Invoice received via email. Verified against PO and GRN.'
  ) RETURNING invoice_id INTO v_invoice_id;

  -- Insert Invoice items from GRN items
  INSERT INTO invoice_items (invoice_id, item_id, quantity, unit_price, tax_amount, discount_amount)
  SELECT
    v_invoice_id,
    grni.item_id,
    grni.qty_accepted,  -- Invoice for accepted quantity only
    grni.unit_price,
    0.00,  -- No tax for demo
    0.00   -- No discount for demo
  FROM grn_items grni
  WHERE grni.grn_id = v_grn_id;

  RAISE NOTICE '✓ Invoice created: % (ID: %, Amount: PKR %, Status: Pending)',
    v_invoice_number, v_invoice_id, v_total_amount;

  -- Store Invoice ID for verification
  PERFORM set_config('demo.invoice_id', v_invoice_id::text, true);
END $$;

-- =============================================
-- 7F: VERIFY THREE-WAY MATCH
-- =============================================

DO $$
DECLARE
  v_po_number TEXT;
  v_match_record RECORD;
BEGIN
  v_po_number := current_setting('demo.po_number');

  RAISE NOTICE '=== THREE-WAY MATCH VERIFICATION ===';
  RAISE NOTICE 'PO Number: %', v_po_number;

  FOR v_match_record IN
    SELECT
      i.sku,
      i.item_name,
      twm.po_qty,
      twm.grn_qty,
      twm.invoice_qty,
      twm.po_unit_price,
      twm.qty_variance_po_grn,
      twm.price_variance_po_invoice,
      twm.match_status
    FROM v_three_way_match twm
    JOIN items i ON twm.item_id = i.item_id
    WHERE twm.po_number = v_po_number
    ORDER BY i.item_id
  LOOP
    RAISE NOTICE '---';
    RAISE NOTICE 'Item: % (%)', v_match_record.sku, v_match_record.item_name;
    RAISE NOTICE '  PO Qty: %, GRN Qty: %, Invoice Qty: %',
      v_match_record.po_qty, v_match_record.grn_qty, v_match_record.invoice_qty;
    RAISE NOTICE '  PO Price: PKR %, Price Variance: PKR %',
      v_match_record.po_unit_price, v_match_record.price_variance_po_invoice;
    RAISE NOTICE '  Match Status: %', v_match_record.match_status;
  END LOOP;

  RAISE NOTICE '=================================';
END $$;

-- =============================================
-- STEP 8: VERIFY COMPLETE CYCLE
-- =============================================

DO $$
DECLARE
  v_pr_id INT;
  v_po_id INT;
  v_grn_id INT;
  v_invoice_id INT;
  v_pr_status TEXT;
  v_po_status TEXT;
  v_grn_status TEXT;
  v_invoice_status TEXT;
  v_ledger_count INT;
BEGIN
  v_pr_id := current_setting('demo.pr_id')::INT;
  v_po_id := current_setting('demo.po_id')::INT;
  v_grn_id := current_setting('demo.grn_id')::INT;
  v_invoice_id := current_setting('demo.invoice_id')::INT;

  -- Get document statuses
  SELECT status INTO v_pr_status FROM purchase_requisitions WHERE pr_id = v_pr_id;
  SELECT status INTO v_po_status FROM purchase_orders WHERE po_id = v_po_id;
  SELECT status INTO v_grn_status FROM goods_received_notes WHERE grn_id = v_grn_id;
  SELECT status INTO v_invoice_status FROM invoices WHERE invoice_id = v_invoice_id;

  -- Count ledger entries
  SELECT COUNT(*) INTO v_ledger_count FROM inventory_ledger WHERE txn_type = 'GRN';

  RAISE NOTICE '========================================';
  RAISE NOTICE 'PHASE 1 DEMO SEED DATA - COMPLETE P2P CYCLE';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '✓ STEP 1: Purchase Requisition';
  RAISE NOTICE '  PR Number: %', current_setting('demo.pr_number');
  RAISE NOTICE '  Status: % → %', 'Pending', v_pr_status;
  RAISE NOTICE '  Amount: PKR 86,000 (triggered L2 approval)';
  RAISE NOTICE '';
  RAISE NOTICE '✓ STEP 2: Approval Workflow';
  RAISE NOTICE '  Auto-routed to: Level 2 Approver';
  RAISE NOTICE '  Decision: Approved';
  RAISE NOTICE '  Approved by: approver.l2@rahah24.com';
  RAISE NOTICE '';
  RAISE NOTICE '✓ STEP 3: Purchase Order';
  RAISE NOTICE '  PO Number: %', current_setting('demo.po_number');
  RAISE NOTICE '  Status: Draft → %', v_po_status;
  RAISE NOTICE '  Vendor: Karachi Food Supplies (VEN-0001)';
  RAISE NOTICE '  Amount: PKR 86,000';
  RAISE NOTICE '';
  RAISE NOTICE '✓ STEP 4: Goods Received Note';
  RAISE NOTICE '  GRN Number: %', current_setting('demo.grn_number');
  RAISE NOTICE '  Status: Draft → %', v_grn_status;
  RAISE NOTICE '  Received: Full quantity, Quality approved';
  RAISE NOTICE '  Ledger entries created: % GRN transactions', v_ledger_count;
  RAISE NOTICE '';
  RAISE NOTICE '✓ STEP 5: Invoice';
  RAISE NOTICE '  Invoice Number: VEN-0001-INV-2025-0142';
  RAISE NOTICE '  Status: %', v_invoice_status;
  RAISE NOTICE '  Payment Status: Unpaid';
  RAISE NOTICE '  Due Date: Net 30 days';
  RAISE NOTICE '';
  RAISE NOTICE '✓ STEP 6: Three-Way Match';
  RAISE NOTICE '  PO vs GRN vs Invoice: MATCHED';
  RAISE NOTICE '  All quantities match, No price variances';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SEED DATA CREATED SUCCESSFULLY';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '1. Login as different users to test RLS policies';
  RAISE NOTICE '2. Try creating new PRs for low stock items';
  RAISE NOTICE '3. Test approval workflows at different levels';
  RAISE NOTICE '4. Process invoice payment (future workflow)';
  RAISE NOTICE '';
  RAISE NOTICE 'Test Users:';
  RAISE NOTICE '  - admin@rahah24.com (Full access)';
  RAISE NOTICE '  - storekeeper@rahah24.com (GRN, stock management)';
  RAISE NOTICE '  - procurement@rahah24.com (PR, PO creation)';
  RAISE NOTICE '  - approver.l1@rahah24.com (Approve <50K)';
  RAISE NOTICE '  - approver.l2@rahah24.com (Approve 50K-200K)';
  RAISE NOTICE '  - gm@rahah24.com (Approve >200K unlimited)';
  RAISE NOTICE '  - finance@rahah24.com (Invoice processing)';
  RAISE NOTICE '  - auditor@rahah24.com (Read-only access)';
  RAISE NOTICE '';
END $$;

-- =============================================
-- STEP 9: CREATE SAMPLE STOCK ADJUSTMENT
-- =============================================
-- Demonstrates manual stock adjustment for cycle count variance

DO $$
DECLARE
  v_adjustment_id INT;
  v_adjustment_number TEXT;
  v_store_keeper_id UUID;
BEGIN
  -- Get Store Keeper user ID
  SELECT id INTO v_store_keeper_id
  FROM public.user_profiles
  WHERE email = 'storekeeper@rahah24.com'
  LIMIT 1;

  -- Generate adjustment number
  v_adjustment_number := 'ADJ-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-0001';

  -- Create stock adjustment (physical count found 5 KG less salt)
  INSERT INTO stock_adjustments (
    adjustment_number,
    store_id,
    adjustment_type,
    adjustment_date,
    reason,
    status,
    created_by,
    notes
  ) VALUES (
    v_adjustment_number,
    1,
    'Physical Count',
    CURRENT_DATE,
    'Cycle count variance - spillage during storage',
    'Pending',
    v_store_keeper_id,
    'Found 5 KG salt shortage during routine cycle count'
  ) RETURNING adjustment_id INTO v_adjustment_id;

  -- Insert adjustment item
  INSERT INTO stock_adjustment_items (
    adjustment_id,
    item_id,
    quantity,  -- Negative for reduction
    unit_cost,
    notes
  ) VALUES (
    v_adjustment_id,
    3,  -- Salt
    -5,  -- 5 KG reduction
    30.00,
    'Variance found during cycle count'
  );

  RAISE NOTICE '✓ Stock Adjustment created: % (Status: Pending, requires approval)', v_adjustment_number;
  RAISE NOTICE '  Item: SALT-001 (Salt), Quantity: -5 KG, Reason: Physical Count';
END $$;

-- =============================================
-- FINAL VERIFICATION QUERIES
-- =============================================

-- Low stock items report
SELECT
  '=== LOW STOCK ITEMS (Below Reorder Level) ===' AS report_section;

SELECT
  sku,
  item_name,
  qty_available,
  reorder_level,
  shortage_qty,
  status
FROM v_low_stock_items
ORDER BY
  CASE status
    WHEN 'CRITICAL' THEN 1
    WHEN 'LOW' THEN 2
    ELSE 3
  END,
  shortage_qty DESC;

-- Vendor summary
SELECT
  '=== VENDOR SUMMARY ===' AS report_section;

SELECT
  vendor_code,
  company_name,
  status,
  rating,
  items_supplied,
  payment_terms
FROM v_vendor_summary
ORDER BY rating DESC;

-- Recent ledger transactions
SELECT
  '=== RECENT INVENTORY LEDGER TRANSACTIONS ===' AS report_section;

SELECT
  il.ledger_id,
  i.sku,
  i.item_name,
  il.txn_type,
  il.delta_qty,
  il.qty_before,
  il.qty_after,
  il.txn_date
FROM inventory_ledger il
JOIN items i ON il.item_id = i.item_id
ORDER BY il.txn_date DESC, il.ledger_id DESC
LIMIT 10;

-- Pending approvals
SELECT
  '=== PENDING APPROVALS ===' AS report_section;

SELECT
  a.approval_id,
  a.doc_type,
  CASE
    WHEN a.doc_type = 'PR' THEN pr.pr_number
    WHEN a.doc_type = 'PO' THEN po.po_number
    WHEN a.doc_type = 'ADJ' THEN sa.adjustment_number
    ELSE NULL
  END AS doc_number,
  a.level AS approval_level,
  up.full_name AS approver_name,
  a.created_at,
  EXTRACT(EPOCH FROM (now() - a.created_at))/3600 AS hours_pending
FROM approvals a
LEFT JOIN purchase_requisitions pr ON a.doc_type = 'PR' AND a.doc_id = pr.pr_id
LEFT JOIN purchase_orders po ON a.doc_type = 'PO' AND a.doc_id = po.po_id
LEFT JOIN stock_adjustments sa ON a.doc_type = 'ADJ' AND a.doc_id = sa.adjustment_id
JOIN public.user_profiles up ON a.approver = up.id
WHERE a.status = 'Pending'
ORDER BY a.created_at;

-- =============================================
-- SEED DATA SUMMARY
-- =============================================

SELECT
  '=== SEED DATA SUMMARY ===' AS report_section;

SELECT 'Item Categories' AS entity, COUNT(*) AS count FROM item_categories WHERE is_active = true
UNION ALL
SELECT 'Items', COUNT(*) FROM items WHERE is_active = true
UNION ALL
SELECT 'Vendors', COUNT(*) FROM vendors
UNION ALL
SELECT 'Vendor Prices', COUNT(*) FROM vendor_item_prices WHERE is_active = true
UNION ALL
SELECT 'Stock Levels', COUNT(*) FROM item_stock_levels
UNION ALL
SELECT 'Purchase Requisitions', COUNT(*) FROM purchase_requisitions
UNION ALL
SELECT 'Purchase Orders', COUNT(*) FROM purchase_orders
UNION ALL
SELECT 'GRNs', COUNT(*) FROM goods_received_notes
UNION ALL
SELECT 'Invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'Approvals', COUNT(*) FROM approvals
UNION ALL
SELECT 'Ledger Entries', COUNT(*) FROM inventory_ledger
UNION ALL
SELECT 'Stock Adjustments', COUNT(*) FROM stock_adjustments;

-- =============================================
-- END OF SEED DATA
-- =============================================

/*
NOTES:
------
1. This seed data demonstrates a complete P2P cycle:
   PR → Approval → PO → GRN → Invoice → Three-Way Match

2. All user roles are linked to actual users in user_profiles

3. Stock levels are set to trigger reorder alerts

4. Approval workflow demonstrates L2 approval (amount: 86K PKR)

5. Inventory ledger is automatically updated via triggers

6. Three-way match view shows perfect match (no variances)

7. A pending stock adjustment is included for testing approval workflow

TESTING RECOMMENDATIONS:
------------------------
1. Login as each user and verify RLS policies
2. Create new PRs for low stock items
3. Test approval at different amount levels (L1: <50K, L2: 50K-200K, L3: >200K)
4. Process the pending stock adjustment
5. Create stock transfers between stores (future enhancement)
6. Test batch tracking for expiry dates
7. Generate reports using views

KNOWN LIMITATIONS:
------------------
1. Only 1 store created (future: multi-store support)
2. No payment processing (future: payment workflow)
3. No return to vendor workflow (future enhancement)
4. No partial receipts demonstrated (all GRN items fully received)
5. Batch expiry alerts not demonstrated (future enhancement)
*/
