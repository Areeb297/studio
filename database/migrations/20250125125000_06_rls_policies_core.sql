-- =============================================
-- MIGRATION: 06 - RLS Policies (Row-Level Security)
-- =============================================
-- Enables RLS on all tables and creates permission-based policies
-- Uses has_perm() function from migration 01 for access control
-- =============================================
-- Created: 2025-01-25
-- Version: 1.0
-- Dependencies: All previous migrations (01-05)
-- =============================================

-- =============================================
-- IMPORTANT: RLS PHILOSOPHY
-- =============================================
-- 1. Enable RLS on ALL tables (default deny)
-- 2. Grant access explicitly using has_perm()
-- 3. Use separate policies for SELECT, INSERT, UPDATE, DELETE
-- 4. Admin gets full access via admin role check
-- 5. Other roles get specific permissions via has_perm()
-- =============================================

-- =============================================
-- STEP 1: ENABLE RLS ON ALL TABLES
-- =============================================

-- Inventory Masters
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_stock_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_item_prices ENABLE ROW LEVEL SECURITY;

-- P2P Workflow
ALTER TABLE purchase_requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_requisition_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_received_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE grn_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Inventory Ledger
ALTER TABLE inventory_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_adjustment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transfer_items ENABLE ROW LEVEL SECURITY;

-- Approvals
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_thresholds ENABLE ROW LEVEL SECURITY;

-- RBAC Tables (already have RLS from migration 01)
-- roles, permissions, role_permissions - already secured

-- =============================================
-- STEP 2: ITEMS TABLE POLICIES
-- =============================================

-- SELECT: Users with inventory.view permission
CREATE POLICY "items_select_policy" ON items
  FOR SELECT
  USING (has_perm('inventory.view'));

-- INSERT: Users with inventory.create permission
CREATE POLICY "items_insert_policy" ON items
  FOR INSERT
  WITH CHECK (has_perm('inventory.create'));

-- UPDATE: Users with inventory.update permission
CREATE POLICY "items_update_policy" ON items
  FOR UPDATE
  USING (has_perm('inventory.update'));

-- DELETE: Admin only
CREATE POLICY "items_delete_policy" ON items
  FOR DELETE
  USING (has_perm('inventory.delete'));

-- =============================================
-- STEP 3: ITEM CATEGORIES TABLE POLICIES
-- =============================================

CREATE POLICY "item_categories_select_policy" ON item_categories
  FOR SELECT
  USING (has_perm('inventory.view'));

CREATE POLICY "item_categories_insert_policy" ON item_categories
  FOR INSERT
  WITH CHECK (has_perm('inventory.create'));

CREATE POLICY "item_categories_update_policy" ON item_categories
  FOR UPDATE
  USING (has_perm('inventory.update'));

CREATE POLICY "item_categories_delete_policy" ON item_categories
  FOR DELETE
  USING (has_perm('inventory.delete'));

-- =============================================
-- STEP 4: VENDORS TABLE POLICIES
-- =============================================

-- SELECT: Users with vendor.view permission
CREATE POLICY "vendors_select_policy" ON vendors
  FOR SELECT
  USING (has_perm('vendor.view'));

-- INSERT: Users with vendor.create permission
CREATE POLICY "vendors_insert_policy" ON vendors
  FOR INSERT
  WITH CHECK (has_perm('vendor.create'));

-- UPDATE: Users with vendor.update permission
CREATE POLICY "vendors_update_policy" ON vendors
  FOR UPDATE
  USING (has_perm('vendor.update'));

-- DELETE: Admin only
CREATE POLICY "vendors_delete_policy" ON vendors
  FOR DELETE
  USING (public.is_admin());

-- =============================================
-- STEP 5: ITEM STOCK LEVELS TABLE POLICIES
-- =============================================

CREATE POLICY "item_stock_levels_select_policy" ON item_stock_levels
  FOR SELECT
  USING (has_perm('inventory.view'));

-- INSERT/UPDATE handled by triggers, but allow admin manual override
CREATE POLICY "item_stock_levels_insert_policy" ON item_stock_levels
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "item_stock_levels_update_policy" ON item_stock_levels
  FOR UPDATE
  USING (public.is_admin() OR has_perm('stock.adjust'));

-- =============================================
-- STEP 6: PURCHASE REQUISITIONS TABLE POLICIES
-- =============================================

-- SELECT: Users with pr.view permission
CREATE POLICY "pr_select_policy" ON purchase_requisitions
  FOR SELECT
  USING (has_perm('pr.view') OR requested_by = auth.uid());

-- INSERT: Users with pr.create permission
CREATE POLICY "pr_insert_policy" ON purchase_requisitions
  FOR INSERT
  WITH CHECK (has_perm('pr.create'));

-- UPDATE: Creator or approvers can update
CREATE POLICY "pr_update_policy" ON purchase_requisitions
  FOR UPDATE
  USING (
    requested_by = auth.uid() OR
    has_perm('approve.l1') OR
    has_perm('approve.l2') OR
    has_perm('approve.l3') OR
    public.is_admin()
  );

-- DELETE: Creator or admin only
CREATE POLICY "pr_delete_policy" ON purchase_requisitions
  FOR DELETE
  USING (requested_by = auth.uid() OR public.is_admin());

-- =============================================
-- STEP 7: PR ITEMS TABLE POLICIES
-- =============================================

CREATE POLICY "pr_items_select_policy" ON purchase_requisition_items
  FOR SELECT
  USING (
    has_perm('pr.view') OR
    pr_id IN (SELECT pr_id FROM purchase_requisitions WHERE requested_by = auth.uid())
  );

CREATE POLICY "pr_items_insert_policy" ON purchase_requisition_items
  FOR INSERT
  WITH CHECK (
    has_perm('pr.create') OR
    pr_id IN (SELECT pr_id FROM purchase_requisitions WHERE requested_by = auth.uid())
  );

CREATE POLICY "pr_items_update_policy" ON purchase_requisition_items
  FOR UPDATE
  USING (
    pr_id IN (SELECT pr_id FROM purchase_requisitions WHERE requested_by = auth.uid()) OR
    public.is_admin()
  );

CREATE POLICY "pr_items_delete_policy" ON purchase_requisition_items
  FOR DELETE
  USING (
    pr_id IN (SELECT pr_id FROM purchase_requisitions WHERE requested_by = auth.uid()) OR
    public.is_admin()
  );

-- =============================================
-- STEP 8: PURCHASE ORDERS TABLE POLICIES
-- =============================================

-- SELECT: Users with po.view permission
CREATE POLICY "po_select_policy" ON purchase_orders
  FOR SELECT
  USING (has_perm('po.view') OR created_by = auth.uid());

-- INSERT: Users with po.create permission
CREATE POLICY "po_insert_policy" ON purchase_orders
  FOR INSERT
  WITH CHECK (has_perm('po.create'));

-- UPDATE: Creator or admin
CREATE POLICY "po_update_policy" ON purchase_orders
  FOR UPDATE
  USING (
    created_by = auth.uid() OR
    has_perm('approve.l1') OR
    has_perm('approve.l2') OR
    has_perm('approve.l3') OR
    public.is_admin()
  );

-- DELETE: Admin only
CREATE POLICY "po_delete_policy" ON purchase_orders
  FOR DELETE
  USING (public.is_admin());

-- =============================================
-- STEP 9: PO ITEMS TABLE POLICIES
-- =============================================

CREATE POLICY "po_items_select_policy" ON purchase_order_items
  FOR SELECT
  USING (
    has_perm('po.view') OR
    po_id IN (SELECT po_id FROM purchase_orders WHERE created_by = auth.uid())
  );

CREATE POLICY "po_items_insert_policy" ON purchase_order_items
  FOR INSERT
  WITH CHECK (
    has_perm('po.create') OR
    po_id IN (SELECT po_id FROM purchase_orders WHERE created_by = auth.uid())
  );

CREATE POLICY "po_items_update_policy" ON purchase_order_items
  FOR UPDATE
  USING (
    po_id IN (SELECT po_id FROM purchase_orders WHERE created_by = auth.uid()) OR
    public.is_admin()
  );

CREATE POLICY "po_items_delete_policy" ON purchase_order_items
  FOR DELETE
  USING (
    po_id IN (SELECT po_id FROM purchase_orders WHERE created_by = auth.uid()) OR
    public.is_admin()
  );

-- =============================================
-- STEP 10: GOODS RECEIVED NOTES TABLE POLICIES
-- =============================================

-- SELECT: Users with grn.view permission
CREATE POLICY "grn_select_policy" ON goods_received_notes
  FOR SELECT
  USING (has_perm('grn.view') OR received_by = auth.uid());

-- INSERT: Users with grn.create permission
CREATE POLICY "grn_insert_policy" ON goods_received_notes
  FOR INSERT
  WITH CHECK (has_perm('grn.create'));

-- UPDATE: Receiver or admin
CREATE POLICY "grn_update_policy" ON goods_received_notes
  FOR UPDATE
  USING (received_by = auth.uid() OR public.is_admin());

-- DELETE: Admin only
CREATE POLICY "grn_delete_policy" ON goods_received_notes
  FOR DELETE
  USING (public.is_admin());

-- =============================================
-- STEP 11: GRN ITEMS TABLE POLICIES
-- =============================================

CREATE POLICY "grn_items_select_policy" ON grn_items
  FOR SELECT
  USING (
    has_perm('grn.view') OR
    grn_id IN (SELECT grn_id FROM goods_received_notes WHERE received_by = auth.uid())
  );

CREATE POLICY "grn_items_insert_policy" ON grn_items
  FOR INSERT
  WITH CHECK (
    has_perm('grn.create') OR
    grn_id IN (SELECT grn_id FROM goods_received_notes WHERE received_by = auth.uid())
  );

CREATE POLICY "grn_items_update_policy" ON grn_items
  FOR UPDATE
  USING (
    grn_id IN (SELECT grn_id FROM goods_received_notes WHERE received_by = auth.uid()) OR
    public.is_admin()
  );

CREATE POLICY "grn_items_delete_policy" ON grn_items
  FOR DELETE
  USING (public.is_admin());

-- =============================================
-- STEP 12: INVOICES TABLE POLICIES
-- =============================================

-- SELECT: Users with invoice.view permission
CREATE POLICY "invoices_select_policy" ON invoices
  FOR SELECT
  USING (has_perm('invoice.view'));

-- INSERT: Users with invoice.match permission
CREATE POLICY "invoices_insert_policy" ON invoices
  FOR INSERT
  WITH CHECK (has_perm('invoice.match'));

-- UPDATE: Users with invoice.match or invoice.approve permission
CREATE POLICY "invoices_update_policy" ON invoices
  FOR UPDATE
  USING (has_perm('invoice.match') OR has_perm('invoice.approve'));

-- DELETE: Admin only
CREATE POLICY "invoices_delete_policy" ON invoices
  FOR DELETE
  USING (public.is_admin());

-- =============================================
-- STEP 13: INVOICE ITEMS TABLE POLICIES
-- =============================================

CREATE POLICY "invoice_items_select_policy" ON invoice_items
  FOR SELECT
  USING (has_perm('invoice.view'));

CREATE POLICY "invoice_items_insert_policy" ON invoice_items
  FOR INSERT
  WITH CHECK (has_perm('invoice.match'));

CREATE POLICY "invoice_items_update_policy" ON invoice_items
  FOR UPDATE
  USING (has_perm('invoice.match'));

CREATE POLICY "invoice_items_delete_policy" ON invoice_items
  FOR DELETE
  USING (public.is_admin());

-- =============================================
-- STEP 14: INVENTORY LEDGER TABLE POLICIES
-- =============================================

-- SELECT: Users with inventory.view permission
CREATE POLICY "inventory_ledger_select_policy" ON inventory_ledger
  FOR SELECT
  USING (has_perm('inventory.view') OR has_perm('reports.inventory'));

-- INSERT: System only (via triggers), admin manual override
CREATE POLICY "inventory_ledger_insert_policy" ON inventory_ledger
  FOR INSERT
  WITH CHECK (public.is_admin());

-- No UPDATE/DELETE allowed (immutable ledger enforced by RULES)

-- =============================================
-- STEP 15: STOCK ADJUSTMENTS TABLE POLICIES
-- =============================================

-- SELECT: Users with inventory.view permission
CREATE POLICY "adjustments_select_policy" ON stock_adjustments
  FOR SELECT
  USING (has_perm('inventory.view') OR created_by = auth.uid());

-- INSERT: Users with stock.adjust permission
CREATE POLICY "adjustments_insert_policy" ON stock_adjustments
  FOR INSERT
  WITH CHECK (has_perm('stock.adjust'));

-- UPDATE: Creator or approvers
CREATE POLICY "adjustments_update_policy" ON stock_adjustments
  FOR UPDATE
  USING (
    created_by = auth.uid() OR
    has_perm('approve.l1') OR
    has_perm('approve.l2') OR
    has_perm('approve.l3') OR
    public.is_admin()
  );

-- DELETE: Admin only
CREATE POLICY "adjustments_delete_policy" ON stock_adjustments
  FOR DELETE
  USING (public.is_admin());

-- =============================================
-- STEP 16: ADJUSTMENT ITEMS TABLE POLICIES
-- =============================================

CREATE POLICY "adjustment_items_select_policy" ON stock_adjustment_items
  FOR SELECT
  USING (
    has_perm('inventory.view') OR
    adjustment_id IN (SELECT adjustment_id FROM stock_adjustments WHERE created_by = auth.uid())
  );

CREATE POLICY "adjustment_items_insert_policy" ON stock_adjustment_items
  FOR INSERT
  WITH CHECK (
    has_perm('stock.adjust') OR
    adjustment_id IN (SELECT adjustment_id FROM stock_adjustments WHERE created_by = auth.uid())
  );

CREATE POLICY "adjustment_items_update_policy" ON stock_adjustment_items
  FOR UPDATE
  USING (
    adjustment_id IN (SELECT adjustment_id FROM stock_adjustments WHERE created_by = auth.uid()) OR
    public.is_admin()
  );

CREATE POLICY "adjustment_items_delete_policy" ON stock_adjustment_items
  FOR DELETE
  USING (
    adjustment_id IN (SELECT adjustment_id FROM stock_adjustments WHERE created_by = auth.uid()) OR
    public.is_admin()
  );

-- =============================================
-- STEP 17: STOCK TRANSFERS TABLE POLICIES
-- =============================================

CREATE POLICY "transfers_select_policy" ON stock_transfers
  FOR SELECT
  USING (has_perm('inventory.view') OR requested_by = auth.uid() OR received_by = auth.uid());

CREATE POLICY "transfers_insert_policy" ON stock_transfers
  FOR INSERT
  WITH CHECK (has_perm('stock.transfer'));

CREATE POLICY "transfers_update_policy" ON stock_transfers
  FOR UPDATE
  USING (
    requested_by = auth.uid() OR
    received_by = auth.uid() OR
    public.is_admin()
  );

CREATE POLICY "transfers_delete_policy" ON stock_transfers
  FOR DELETE
  USING (public.is_admin());

-- =============================================
-- STEP 18: TRANSFER ITEMS TABLE POLICIES
-- =============================================

CREATE POLICY "transfer_items_select_policy" ON stock_transfer_items
  FOR SELECT
  USING (
    has_perm('inventory.view') OR
    transfer_id IN (SELECT transfer_id FROM stock_transfers WHERE requested_by = auth.uid() OR received_by = auth.uid())
  );

CREATE POLICY "transfer_items_insert_policy" ON stock_transfer_items
  FOR INSERT
  WITH CHECK (
    has_perm('stock.transfer') OR
    transfer_id IN (SELECT transfer_id FROM stock_transfers WHERE requested_by = auth.uid())
  );

CREATE POLICY "transfer_items_update_policy" ON stock_transfer_items
  FOR UPDATE
  USING (
    transfer_id IN (SELECT transfer_id FROM stock_transfers WHERE requested_by = auth.uid() OR received_by = auth.uid()) OR
    public.is_admin()
  );

CREATE POLICY "transfer_items_delete_policy" ON stock_transfer_items
  FOR DELETE
  USING (public.is_admin());

-- =============================================
-- STEP 19: APPROVALS TABLE POLICIES
-- =============================================

-- SELECT: Approvers can see their assigned approvals, everyone else with permission
CREATE POLICY "approvals_select_policy" ON approvals
  FOR SELECT
  USING (
    approver = auth.uid() OR
    has_perm('pr.view') OR
    has_perm('po.view') OR
    public.is_admin()
  );

-- INSERT: System only (via triggers)
CREATE POLICY "approvals_insert_policy" ON approvals
  FOR INSERT
  WITH CHECK (public.is_admin());

-- UPDATE: Assigned approver with matching permission level
CREATE POLICY "approvals_update_policy" ON approvals
  FOR UPDATE
  USING (
    (approver = auth.uid() AND (
      (level = 1 AND has_perm('approve.l1')) OR
      (level = 2 AND has_perm('approve.l2')) OR
      (level = 3 AND has_perm('approve.l3'))
    )) OR
    public.is_admin()
  );

-- DELETE: Admin only
CREATE POLICY "approvals_delete_policy" ON approvals
  FOR DELETE
  USING (public.is_admin());

-- =============================================
-- STEP 20: OTHER TABLES (READ-MOSTLY)
-- =============================================

-- Stores
CREATE POLICY "stores_select_policy" ON stores
  FOR SELECT
  USING (has_perm('inventory.view'));

CREATE POLICY "stores_insert_policy" ON stores
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "stores_update_policy" ON stores
  FOR UPDATE
  USING (public.is_admin());

-- Vendor Item Prices
CREATE POLICY "vendor_prices_select_policy" ON vendor_item_prices
  FOR SELECT
  USING (has_perm('vendor.view') OR has_perm('po.view'));

CREATE POLICY "vendor_prices_insert_policy" ON vendor_item_prices
  FOR INSERT
  WITH CHECK (has_perm('vendor.create') OR has_perm('vendor.update'));

CREATE POLICY "vendor_prices_update_policy" ON vendor_item_prices
  FOR UPDATE
  USING (has_perm('vendor.update'));

-- Approval Thresholds (Admin only)
CREATE POLICY "approval_thresholds_select_policy" ON approval_thresholds
  FOR SELECT
  USING (TRUE);  -- Everyone can read thresholds

CREATE POLICY "approval_thresholds_insert_policy" ON approval_thresholds
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "approval_thresholds_update_policy" ON approval_thresholds
  FOR UPDATE
  USING (public.is_admin());

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- List all tables with RLS enabled
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = true
ORDER BY tablename;

-- Count policies per table
SELECT
  schemaname,
  tablename,
  COUNT(*) AS policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

-- List all policies
SELECT
  tablename,
  policyname,
  cmd,
  permissive
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;

-- =============================================
-- TESTING GUIDE
-- =============================================

/*
## RLS Policy Testing

### Test 1: Store Keeper - View Items
-- Login as storekeeper@rahah24.com
-- Should succeed (has inventory.view permission)
SELECT * FROM items LIMIT 5;

### Test 2: Store Keeper - Create PO
-- Should FAIL (no po.create permission)
INSERT INTO purchase_orders (vendor_id, created_by)
VALUES (1, auth.uid());

### Test 3: Purchasing Officer - Create PO
-- Login as purchasing@rahah24.com
-- Should succeed (has po.create permission)
INSERT INTO purchase_orders (vendor_id, created_by)
VALUES (1, auth.uid());

### Test 4: Auditor - Read-Only
-- Login as auditor@rahah24.com
-- Should succeed (has inventory.view)
SELECT * FROM items;
-- Should FAIL (no insert permission)
INSERT INTO items (sku, item_name, category_id, uom)
VALUES ('TEST-001', 'Test Item', 1, 'PCS');

### Test 5: Approver L1 - Update Approval
-- Login as approverl1@rahah24.com
-- Should succeed (can update own pending approval)
UPDATE approvals
SET status = 'Approved', comments = 'Approved by L1'
WHERE approval_id = 1 AND approver = auth.uid();

### Test 6: Unauthorized Approval Update
-- Login as storekeeper@rahah24.com
-- Should FAIL (not assigned approver)
UPDATE approvals
SET status = 'Approved'
WHERE approval_id = 1;
*/

-- =============================================
-- ROLLBACK INSTRUCTIONS
-- =============================================

/*
-- To disable RLS (emergency only):

ALTER TABLE items DISABLE ROW LEVEL SECURITY;
ALTER TABLE item_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE vendors DISABLE ROW LEVEL SECURITY;
ALTER TABLE item_stock_levels DISABLE ROW LEVEL SECURITY;
ALTER TABLE stores DISABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_item_prices DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_requisitions DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_requisition_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE goods_received_notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE grn_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_ledger DISABLE ROW LEVEL SECURITY;
ALTER TABLE stock_adjustments DISABLE ROW LEVEL SECURITY;
ALTER TABLE stock_adjustment_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transfers DISABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transfer_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE approvals DISABLE ROW LEVEL SECURITY;
ALTER TABLE approval_thresholds DISABLE ROW LEVEL SECURITY;

-- Drop all policies (use pg_policies to generate DROP statements)
SELECT 'DROP POLICY IF EXISTS ' || policyname || ' ON ' || tablename || ';'
FROM pg_policies
WHERE schemaname = 'public';
*/

-- =============================================
-- END OF MIGRATION
-- =============================================
