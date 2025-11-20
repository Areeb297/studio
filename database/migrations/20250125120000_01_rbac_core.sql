-- =============================================
-- MIGRATION: 01 - RBAC Core (Role-Based Access Control)
-- =============================================
-- Creates roles, permissions, and role_permissions tables
-- Updates user_profiles with role_id, approval_limit, department
-- Creates has_perm() helper function for RLS policies
-- =============================================
-- Created: 2025-01-25
-- Version: 1.0
-- Dependencies: Requires user_profiles table to exist
-- =============================================

-- =============================================
-- STEP 1: CREATE ROLES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS roles (
  role_id SERIAL PRIMARY KEY,
  role_name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE roles IS 'System roles for RBAC (e.g., admin, store_keeper, purchasing_officer)';
COMMENT ON COLUMN roles.role_name IS 'Unique role identifier matching user_profiles.role';

-- =============================================
-- STEP 2: CREATE PERMISSIONS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS permissions (
  perm_id SERIAL PRIMARY KEY,
  perm_key TEXT UNIQUE NOT NULL,
  perm_category TEXT NOT NULL,  -- e.g., 'inventory', 'procurement', 'finance'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE permissions IS 'Granular permissions for specific actions (e.g., inventory.view, pr.create)';
COMMENT ON COLUMN permissions.perm_key IS 'Dot-notation permission key (module.action format)';

-- =============================================
-- STEP 3: CREATE ROLE_PERMISSIONS JUNCTION TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INT NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
  perm_id INT NOT NULL REFERENCES permissions(perm_id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (role_id, perm_id)
);

COMMENT ON TABLE role_permissions IS 'Many-to-many mapping between roles and permissions';

-- Create index for faster permission lookups
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_perm ON role_permissions(perm_id);

-- =============================================
-- STEP 4: UPDATE USER_PROFILES TABLE
-- =============================================

-- Add new columns to existing user_profiles table
DO $$
BEGIN
  -- Add role_id foreign key
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public'
                 AND table_name = 'user_profiles'
                 AND column_name = 'role_id') THEN
    ALTER TABLE public.user_profiles ADD COLUMN role_id INT REFERENCES roles(role_id);
  END IF;

  -- Add approval_limit (NULL = unlimited for GM)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public'
                 AND table_name = 'user_profiles'
                 AND column_name = 'approval_limit') THEN
    ALTER TABLE public.user_profiles ADD COLUMN approval_limit NUMERIC NULL;
  END IF;

  -- Add department
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public'
                 AND table_name = 'user_profiles'
                 AND column_name = 'department') THEN
    ALTER TABLE public.user_profiles ADD COLUMN department TEXT;
  END IF;
END $$;

COMMENT ON COLUMN user_profiles.role_id IS 'Foreign key to roles table';
COMMENT ON COLUMN user_profiles.approval_limit IS 'Maximum approval amount (NULL = unlimited for GM)';
COMMENT ON COLUMN user_profiles.department IS 'Department name (Kitchen, Store, Procurement, Finance, etc.)';

-- Create index for role lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_role_id ON public.user_profiles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_approval_limit ON public.user_profiles(approval_limit);

-- =============================================
-- STEP 5: INSERT BASE ROLES
-- =============================================

INSERT INTO roles (role_name, description) VALUES
  ('admin', 'System Administrator - Full access to all modules and settings'),
  ('store_keeper', 'Store Keeper - Manages inventory, GRNs, stock issues'),
  ('dept_head_kitchen', 'Department Head Kitchen - Manages department requisitions and approvals'),
  ('purchasing_officer', 'Purchasing Officer - Creates POs, manages vendors'),
  ('approver_l1', 'Approver Level 1 - Approves PRs/POs up to PKR 50,000'),
  ('approver_l2', 'Approver Level 2 - Approves PRs/POs up to PKR 200,000'),
  ('gm', 'General Manager - Unlimited approval authority (Level 3)'),
  ('finance_officer', 'Finance Officer - Invoice matching, GL entries, payments'),
  ('auditor', 'Internal Auditor - Read-only access to financial and inventory data'),
  ('manager', 'Manager - Access to business operations and reports'),
  ('staff', 'Staff - Limited access to business operations')
ON CONFLICT (role_name) DO NOTHING;

-- =============================================
-- STEP 6: INSERT BASE PERMISSIONS
-- =============================================

INSERT INTO permissions (perm_key, perm_category, description) VALUES
  -- Inventory Permissions
  ('inventory.view', 'inventory', 'View inventory items and stock levels'),
  ('inventory.create', 'inventory', 'Create new inventory items'),
  ('inventory.update', 'inventory', 'Update inventory item details'),
  ('inventory.delete', 'inventory', 'Delete inventory items'),

  -- Stock Management Permissions
  ('stock.adjust', 'inventory', 'Create stock adjustments'),
  ('stock.transfer', 'inventory', 'Transfer stock between locations'),
  ('stock.count', 'inventory', 'Perform physical stock counts'),

  -- Purchase Requisition Permissions
  ('pr.create', 'procurement', 'Create purchase requisitions'),
  ('pr.update', 'procurement', 'Update own purchase requisitions'),
  ('pr.view', 'procurement', 'View purchase requisitions'),
  ('pr.delete', 'procurement', 'Delete purchase requisitions'),

  -- Purchase Order Permissions
  ('po.create', 'procurement', 'Create purchase orders'),
  ('po.update', 'procurement', 'Update purchase orders'),
  ('po.view', 'procurement', 'View purchase orders'),
  ('po.send', 'procurement', 'Send purchase orders to vendors'),

  -- Goods Received Note Permissions
  ('grn.create', 'procurement', 'Create goods received notes'),
  ('grn.update', 'procurement', 'Update goods received notes'),
  ('grn.view', 'procurement', 'View goods received notes'),
  ('grn.post', 'procurement', 'Post GRNs to inventory ledger'),

  -- Invoice Permissions
  ('invoice.match', 'finance', 'Perform 3-way invoice matching'),
  ('invoice.view', 'finance', 'View invoices'),
  ('invoice.approve', 'finance', 'Approve invoices for payment'),

  -- Vendor Permissions
  ('vendor.create', 'procurement', 'Create vendor records'),
  ('vendor.update', 'procurement', 'Update vendor information'),
  ('vendor.approve', 'procurement', 'Approve/block vendors'),
  ('vendor.view', 'procurement', 'View vendor information'),

  -- Approval Permissions
  ('approve.l1', 'approvals', 'Approve documents up to PKR 50,000'),
  ('approve.l2', 'approvals', 'Approve documents up to PKR 200,000'),
  ('approve.l3', 'approvals', 'Approve documents with unlimited amount'),

  -- Report Permissions
  ('reports.inventory', 'reports', 'View inventory reports'),
  ('reports.procurement', 'reports', 'View procurement reports'),
  ('reports.financial', 'reports', 'View financial reports'),
  ('reports.audit', 'reports', 'View audit trails and compliance reports'),

  -- System Permissions
  ('system.settings', 'system', 'Manage system settings'),
  ('system.users', 'system', 'Manage user accounts and roles')
ON CONFLICT (perm_key) DO NOTHING;

-- =============================================
-- STEP 7: MAP ROLES TO PERMISSIONS
-- =============================================

-- Admin: All permissions
INSERT INTO role_permissions (role_id, perm_id)
SELECT r.role_id, p.perm_id
FROM roles r, permissions p
WHERE r.role_name = 'admin'
ON CONFLICT DO NOTHING;

-- Store Keeper: Inventory + GRN + Stock operations
INSERT INTO role_permissions (role_id, perm_id)
SELECT r.role_id, p.perm_id
FROM roles r, permissions p
WHERE r.role_name = 'store_keeper'
  AND p.perm_key IN (
    'inventory.view',
    'stock.adjust',
    'stock.transfer',
    'stock.count',
    'pr.create',
    'pr.view',
    'grn.create',
    'grn.view',
    'grn.post',
    'po.view',
    'vendor.view',
    'reports.inventory'
  )
ON CONFLICT DO NOTHING;

-- Department Head (Kitchen): Requisitions + Approvals (L1)
INSERT INTO role_permissions (role_id, perm_id)
SELECT r.role_id, p.perm_id
FROM roles r, permissions p
WHERE r.role_name = 'dept_head_kitchen'
  AND p.perm_key IN (
    'inventory.view',
    'pr.create',
    'pr.update',
    'pr.view',
    'po.view',
    'grn.view',
    'approve.l1',
    'reports.inventory',
    'reports.procurement'
  )
ON CONFLICT DO NOTHING;

-- Purchasing Officer: POs + Vendors
INSERT INTO role_permissions (role_id, perm_id)
SELECT r.role_id, p.perm_id
FROM roles r, permissions p
WHERE r.role_name = 'purchasing_officer'
  AND p.perm_key IN (
    'inventory.view',
    'pr.view',
    'po.create',
    'po.update',
    'po.view',
    'po.send',
    'grn.create',
    'grn.view',
    'vendor.create',
    'vendor.update',
    'vendor.view',
    'reports.inventory',
    'reports.procurement'
  )
ON CONFLICT DO NOTHING;

-- Approver L1: View + Approve <50K
INSERT INTO role_permissions (role_id, perm_id)
SELECT r.role_id, p.perm_id
FROM roles r, permissions p
WHERE r.role_name = 'approver_l1'
  AND p.perm_key IN (
    'inventory.view',
    'pr.view',
    'po.view',
    'approve.l1',
    'reports.procurement'
  )
ON CONFLICT DO NOTHING;

-- Approver L2: View + Approve <200K
INSERT INTO role_permissions (role_id, perm_id)
SELECT r.role_id, p.perm_id
FROM roles r, permissions p
WHERE r.role_name = 'approver_l2'
  AND p.perm_key IN (
    'inventory.view',
    'pr.view',
    'po.view',
    'approve.l2',
    'reports.procurement',
    'reports.financial'
  )
ON CONFLICT DO NOTHING;

-- GM: View + Approve unlimited
INSERT INTO role_permissions (role_id, perm_id)
SELECT r.role_id, p.perm_id
FROM roles r, permissions p
WHERE r.role_name = 'gm'
  AND p.perm_key IN (
    'inventory.view',
    'pr.view',
    'po.view',
    'grn.view',
    'approve.l3',
    'reports.inventory',
    'reports.procurement',
    'reports.financial'
  )
ON CONFLICT DO NOTHING;

-- Finance Officer: Invoice matching + Financial reports
INSERT INTO role_permissions (role_id, perm_id)
SELECT r.role_id, p.perm_id
FROM roles r, permissions p
WHERE r.role_name = 'finance_officer'
  AND p.perm_key IN (
    'inventory.view',
    'pr.view',
    'po.view',
    'grn.view',
    'invoice.match',
    'invoice.view',
    'invoice.approve',
    'vendor.view',
    'reports.inventory',
    'reports.procurement',
    'reports.financial'
  )
ON CONFLICT DO NOTHING;

-- Auditor: Read-only access to all data
INSERT INTO role_permissions (role_id, perm_id)
SELECT r.role_id, p.perm_id
FROM roles r, permissions p
WHERE r.role_name = 'auditor'
  AND p.perm_key IN (
    'inventory.view',
    'pr.view',
    'po.view',
    'grn.view',
    'invoice.view',
    'vendor.view',
    'reports.inventory',
    'reports.procurement',
    'reports.financial',
    'reports.audit'
  )
ON CONFLICT DO NOTHING;

-- Manager: Business operations + reports (no approvals)
INSERT INTO role_permissions (role_id, perm_id)
SELECT r.role_id, p.perm_id
FROM roles r, permissions p
WHERE r.role_name = 'manager'
  AND p.perm_key IN (
    'inventory.view',
    'pr.view',
    'po.view',
    'grn.view',
    'vendor.view',
    'reports.inventory',
    'reports.procurement',
    'reports.financial'
  )
ON CONFLICT DO NOTHING;

-- Staff: Basic inventory + procurement view
INSERT INTO role_permissions (role_id, perm_id)
SELECT r.role_id, p.perm_id
FROM roles r, permissions p
WHERE r.role_name = 'staff'
  AND p.perm_key IN (
    'inventory.view',
    'pr.view',
    'reports.inventory'
  )
ON CONFLICT DO NOTHING;

-- =============================================
-- STEP 8: CREATE HAS_PERM() HELPER FUNCTION
-- =============================================

CREATE OR REPLACE FUNCTION has_perm(p_perm TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_profiles up
    JOIN roles r ON up.role_id = r.role_id
    JOIN role_permissions rp ON r.role_id = rp.role_id
    JOIN permissions p ON rp.perm_id = p.perm_id
    WHERE up.id = auth.uid()
      AND up.is_active = true
      AND p.perm_key = p_perm
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION has_perm(TEXT) IS 'Check if current user has a specific permission. Used in RLS policies.';

-- =============================================
-- STEP 9: CREATE HELPER FUNCTIONS
-- =============================================

-- Function to get user's role name
CREATE OR REPLACE FUNCTION get_user_role_name()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT r.role_name
    FROM user_profiles up
    JOIN roles r ON up.role_id = r.role_id
    WHERE up.id = auth.uid() AND up.is_active = true
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's approval limit
CREATE OR REPLACE FUNCTION get_user_approval_limit()
RETURNS NUMERIC AS $$
BEGIN
  RETURN (
    SELECT approval_limit
    FROM user_profiles
    WHERE id = auth.uid() AND is_active = true
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- View all roles
SELECT role_id, role_name, description FROM roles ORDER BY role_id;

-- View all permissions
SELECT perm_key, perm_category, description FROM permissions ORDER BY perm_category, perm_key;

-- View role-permission mappings
SELECT
  r.role_name,
  COUNT(rp.perm_id) as permission_count,
  STRING_AGG(p.perm_key, ', ' ORDER BY p.perm_key) as permissions
FROM roles r
LEFT JOIN role_permissions rp ON r.role_id = rp.role_id
LEFT JOIN permissions p ON rp.perm_id = p.perm_id
GROUP BY r.role_id, r.role_name
ORDER BY r.role_name;

-- Test has_perm() function (run as specific user)
-- SELECT has_perm('inventory.view');
-- SELECT has_perm('po.create');

-- =============================================
-- ROLLBACK INSTRUCTIONS
-- =============================================

/*
-- To rollback this migration:

DROP FUNCTION IF EXISTS has_perm(TEXT);
DROP FUNCTION IF EXISTS get_user_role_name();
DROP FUNCTION IF EXISTS get_user_approval_limit();

ALTER TABLE user_profiles DROP COLUMN IF EXISTS role_id;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS approval_limit;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS department;

DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
*/

-- =============================================
-- END OF MIGRATION
-- =============================================
