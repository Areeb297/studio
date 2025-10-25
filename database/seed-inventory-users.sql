-- =============================================
-- INVENTORY & PROCUREMENT MODULE USERS
-- Phase 1 - User Creation Script
-- =============================================
-- This script creates 8 new users for the Inventory & Procurement module
-- Admin user (admin@rahah24.com) already exists and is not recreated
--
-- IMPORTANT: This script requires Supabase Service Role Key for execution
-- Run this script via Supabase Dashboard SQL Editor OR Supabase CLI
--
-- Usage via Supabase Dashboard:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Create new query
-- 4. Copy and paste this script
-- 5. Execute
--
-- Usage via Supabase CLI:
-- supabase db execute -f database/seed-inventory-users.sql
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- STEP 1: CREATE AUTH USERS
-- =============================================
-- These users will be created in auth.users table with email confirmation
-- Default password for all users: "Rahah24@2025"
-- Users should change password on first login

-- Note: In production, use Supabase Dashboard to create users manually
-- OR use Supabase Admin API with service role key
-- This script shows the user profile setup assuming users are created

-- =============================================
-- STEP 2: CREATE USER PROFILES
-- =============================================
-- Create user profiles for all 9 users (including existing admin)

-- Insert user_profiles records
-- Note: Replace UUID placeholders with actual user IDs from auth.users after creation

INSERT INTO user_profiles (
    id,
    employee_code,
    full_name,
    role,
    assigned_units,
    permissions,
    phone,
    email,
    department,
    job_title,
    is_active,
    hire_date,
    created_at
) VALUES

-- =============================================
-- USER 1: System Administrator (ALREADY EXISTS)
-- =============================================
-- Email: admin@rahah24.com
-- UUID: Get from auth.users table
(
    (SELECT id FROM auth.users WHERE email = 'admin@rahah24.com'),
    'ADMIN-001',
    'System Administrator',
    'admin',
    ARRAY[]::uuid[], -- Access to all units
    '{
        "inventory": {"items": ["create", "read", "update", "delete"], "stock": ["create", "read", "update", "delete", "adjust"], "transfers": ["create", "read", "update", "delete", "approve"], "counts": ["create", "read", "update", "delete", "approve"]},
        "procurement": {"requisitions": ["create", "read", "update", "delete", "approve"], "purchase_orders": ["create", "read", "update", "delete", "approve"], "grn": ["create", "read", "update", "delete", "approve"], "vendors": ["create", "read", "update", "delete", "approve"]},
        "financial": {"gl_entries": ["read", "post", "reverse"], "invoices": ["read", "match", "approve"], "budgets": ["create", "read", "update", "delete"]},
        "reports": ["all"],
        "alerts": ["configure", "view", "acknowledge"],
        "system": ["configure", "manage_users", "manage_roles"]
    }'::jsonb,
    '+92-300-1234567',
    'admin@rahah24.com',
    'IT / Administration',
    'System Administrator',
    true,
    '2024-01-01',
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    employee_code = EXCLUDED.employee_code,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions,
    updated_at = NOW();

-- =============================================
-- USER 2: Store Keeper
-- =============================================
-- Email: storekeeper@rahah24.com
-- CREATE THIS USER FIRST IN SUPABASE DASHBOARD, THEN UPDATE UUID BELOW
-- Dashboard > Authentication > Users > Add User
--   Email: storekeeper@rahah24.com
--   Password: Rahah24@2025
--   Confirm Email: Yes
-- Then copy the user ID and replace 'REPLACE-WITH-STOREKEEPER-UUID' below

-- INSERT INTO user_profiles (
--     id,
--     employee_code,
--     full_name,
--     role,
--     assigned_units,
--     permissions,
--     phone,
--     email,
--     department,
--     job_title,
--     is_active,
--     hire_date,
--     created_at
-- ) VALUES (
--     'REPLACE-WITH-STOREKEEPER-UUID'::uuid,
--     'STK-001',
--     'Store Keeper - Main Store',
--     'store_keeper',
--     ARRAY[]::uuid[], -- Assign specific locations after location table is created
--     '{
--         "inventory": {"items": ["read"], "stock": ["read", "issue", "receive"], "adjustments": ["create", "read"], "transfers": ["create", "read"], "counts": ["create", "read", "update"], "batches": ["create", "read", "update"]},
--         "procurement": {"requisitions": ["create", "read"], "purchase_orders": ["read"], "grn": ["read"], "vendors": ["read"]},
--         "reports": ["stock_ledger", "stock_status", "low_stock", "expiry_report"]
--     }'::jsonb,
--     '+92-300-2234567',
--     'storekeeper@rahah24.com',
--     'Main Store / Warehouse',
--     'Store Keeper',
--     true,
--     '2024-06-01',
--     NOW()
-- );

-- =============================================
-- USER 3: Department Head (Kitchen)
-- =============================================
-- Email: deptheadkitchen@rahah24.com

-- INSERT INTO user_profiles (
--     id,
--     employee_code,
--     full_name,
--     role,
--     assigned_units,
--     permissions,
--     phone,
--     email,
--     department,
--     job_title,
--     is_active,
--     hire_date,
--     created_at
-- ) VALUES (
--     'REPLACE-WITH-DEPTHEAD-KITCHEN-UUID'::uuid,
--     'DH-KIT-001',
--     'Department Head - Kitchen',
--     'department_head',
--     ARRAY[]::uuid[], -- Assign kitchen unit after organization_units table
--     '{
--         "inventory": {"items": ["read"], "stock": ["read"], "requisitions": ["create", "read", "update", "approve_own_dept"], "issues": ["read", "request"]},
--         "procurement": {"requisitions": ["create", "read", "approve_under_50k"], "purchase_orders": ["read"], "grn": ["read"]},
--         "restaurant": {"recipes": ["create", "read", "update"], "recipe_costing": ["read", "analyze"]},
--         "reports": ["dept_consumption", "dept_budget", "recipe_cost_report"]
--     }'::jsonb,
--     '+92-300-3234567',
--     'deptheadkitchen@rahah24.com',
--     'Kitchen / Food Production',
--     'Kitchen Manager / Head Chef',
--     true,
--     '2023-03-15',
--     NOW()
-- );

-- =============================================
-- USER 4: Purchasing Officer
-- =============================================
-- Email: purchasing@rahah24.com

-- INSERT INTO user_profiles (
--     id,
--     employee_code,
--     full_name,
--     role,
--     assigned_units,
--     permissions,
--     phone,
--     email,
--     department,
--     job_title,
--     is_active,
--     hire_date,
--     created_at
-- ) VALUES (
--     'REPLACE-WITH-PURCHASING-UUID'::uuid,
--     'PUR-001',
--     'Purchasing Officer',
--     'purchasing_officer',
--     ARRAY[]::uuid[], -- Access to all units for procurement
--     '{
--         "inventory": {"items": ["read"], "stock": ["read"], "reorder_levels": ["read", "suggest"]},
--         "procurement": {"requisitions": ["read", "convert_to_po"], "purchase_orders": ["create", "read", "update", "send_to_vendor"], "grn": ["create", "read", "update", "post"], "vendors": ["create", "read", "update", "evaluate"], "price_history": ["read", "analyze"], "contracts": ["create", "read", "update"]},
--         "financial": {"invoice_matching": ["create", "read", "update"]},
--         "reports": ["purchase_register", "vendor_performance", "price_variance", "spend_analysis"]
--     }'::jsonb,
--     '+92-300-4234567',
--     'purchasing@rahah24.com',
--     'Procurement',
--     'Purchasing Officer',
--     true,
--     '2023-07-01',
--     NOW()
-- );

-- =============================================
-- USER 5: Approver Level 1
-- =============================================
-- Email: approverl1@rahah24.com

-- INSERT INTO user_profiles (
--     id,
--     employee_code,
--     full_name,
--     role,
--     assigned_units,
--     permissions,
--     phone,
--     email,
--     department,
--     job_title,
--     is_active,
--     hire_date,
--     created_at
-- ) VALUES (
--     'REPLACE-WITH-APPROVER-L1-UUID'::uuid,
--     'APR-L1-001',
--     'Approver Level 1',
--     'approver_l1',
--     ARRAY[]::uuid[],
--     '{
--         "procurement": {"requisitions": ["read", "approve_under_50k", "reject", "comment"], "purchase_orders": ["read"], "approval_history": ["read_own"]},
--         "reports": ["approval_dashboard", "pending_approvals"]
--     }'::jsonb,
--     '+92-300-5234567',
--     'approverl1@rahah24.com',
--     'Administration / Finance',
--     'Procurement Coordinator',
--     true,
--     '2023-09-01',
--     NOW()
-- );

-- =============================================
-- USER 6: Approver Level 2
-- =============================================
-- Email: approverl2@rahah24.com

-- INSERT INTO user_profiles (
--     id,
--     employee_code,
--     full_name,
--     role,
--     assigned_units,
--     permissions,
--     phone,
--     email,
--     department,
--     job_title,
--     is_active,
--     hire_date,
--     created_at
-- ) VALUES (
--     'REPLACE-WITH-APPROVER-L2-UUID'::uuid,
--     'APR-L2-001',
--     'Approver Level 2',
--     'approver_l2',
--     ARRAY[]::uuid[],
--     '{
--         "procurement": {"requisitions": ["read", "approve_50k_to_200k", "reject", "comment"], "purchase_orders": ["read", "approve_price_variance_5_to_10"], "approval_history": ["read_own"]},
--         "financial": {"budgets": ["read"], "department_spending": ["read", "analyze"]},
--         "reports": ["approval_dashboard", "budget_variance", "spend_analysis"]
--     }'::jsonb,
--     '+92-300-6234567',
--     'approverl2@rahah24.com',
--     'Finance',
--     'Finance Manager',
--     true,
--     '2023-05-15',
--     NOW()
-- );

-- =============================================
-- USER 7: General Manager (Approver Level 3)
-- =============================================
-- Email: gm@rahah24.com

-- INSERT INTO user_profiles (
--     id,
--     employee_code,
--     full_name,
--     role,
--     assigned_units,
--     permissions,
--     phone,
--     email,
--     department,
--     job_title,
--     is_active,
--     hire_date,
--     created_at
-- ) VALUES (
--     'REPLACE-WITH-GM-UUID'::uuid,
--     'GM-001',
--     'General Manager',
--     'general_manager',
--     ARRAY[]::uuid[], -- Access to all units
--     '{
--         "inventory": {"all": ["read"]},
--         "procurement": {"requisitions": ["read", "approve_unlimited", "reject", "comment"], "purchase_orders": ["read", "approve_unlimited", "approve_price_variance_any"], "vendors": ["read", "approve"], "approval_history": ["read_all"]},
--         "financial": {"budgets": ["read", "approve"], "gl_entries": ["read"], "spending": ["read", "analyze"]},
--         "reports": ["all"],
--         "executive": {"dashboards": ["all"], "analytics": ["all"], "kpis": ["all"]}
--     }'::jsonb,
--     '+92-300-7234567',
--     'gm@rahah24.com',
--     'Executive Management',
--     'General Manager',
--     true,
--     '2022-01-01',
--     NOW()
-- );

-- =============================================
-- USER 8: Finance Officer
-- =============================================
-- Email: finance@rahah24.com

-- INSERT INTO user_profiles (
--     id,
--     employee_code,
--     full_name,
--     role,
--     assigned_units,
--     permissions,
--     phone,
--     email,
--     department,
--     job_title,
--     is_active,
--     hire_date,
--     created_at
-- ) VALUES (
--     'REPLACE-WITH-FINANCE-UUID'::uuid,
--     'FIN-001',
--     'Finance Officer',
--     'finance_officer',
--     ARRAY[]::uuid[],
--     '{
--         "inventory": {"items": ["read"], "stock_value": ["read", "analyze"]},
--         "procurement": {"requisitions": ["read"], "purchase_orders": ["read"], "grn": ["read"], "invoice_matching": ["create", "read", "update", "post"]},
--         "financial": {"gl_entries": ["read", "post", "verify"], "budgets": ["create", "read", "update"], "accounts_payable": ["create", "read", "update"], "vendor_payments": ["read", "process"], "cost_accounting": ["read", "analyze"]},
--         "reports": ["financial_statements", "budget_reports", "ap_aging", "spend_analysis", "gl_reports"]
--     }'::jsonb,
--     '+92-300-8234567',
--     'finance@rahah24.com',
--     'Finance & Accounting',
--     'Finance Officer',
--     true,
--     '2023-04-01',
--     NOW()
-- );

-- =============================================
-- USER 9: Auditor
-- =============================================
-- Email: auditor@rahah24.com

-- INSERT INTO user_profiles (
--     id,
--     employee_code,
--     full_name,
--     role,
--     assigned_units,
--     permissions,
--     phone,
--     email,
--     department,
--     job_title,
--     is_active,
--     hire_date,
--     created_at
-- ) VALUES (
--     'REPLACE-WITH-AUDITOR-UUID'::uuid,
--     'AUD-001',
--     'Internal Auditor',
--     'auditor',
--     ARRAY[]::uuid[],
--     '{
--         "inventory": {"all": ["read"]},
--         "procurement": {"all": ["read"]},
--         "financial": {"all": ["read"]},
--         "audit": {"audit_trails": ["read", "export"], "user_actions": ["read", "analyze"], "compliance_reports": ["generate", "export"]},
--         "reports": ["all_read_only"]
--     }'::jsonb,
--     '+92-300-9234567',
--     'auditor@rahah24.com',
--     'Internal Audit / Compliance',
--     'Internal Auditor',
--     true,
--     '2023-08-01',
--     NOW()
-- );

-- =============================================
-- STEP 3: VERIFY USER CREATION
-- =============================================

-- Verify all users are created
SELECT
    up.employee_code,
    up.full_name,
    up.role,
    up.email,
    up.department,
    up.job_title,
    up.is_active,
    au.email_confirmed_at,
    au.created_at as auth_created_at,
    up.created_at as profile_created_at
FROM user_profiles up
LEFT JOIN auth.users au ON up.id = au.id
WHERE up.email LIKE '%@rahah24.com'
ORDER BY up.employee_code;

-- =============================================
-- STEP 4: SETUP ROW-LEVEL SECURITY (RLS) POLICIES
-- =============================================
-- Note: RLS policies will be created when tables are created in Week 2+
-- This is a placeholder for reference

-- Example RLS policy for store_keeper role:
-- CREATE POLICY "store_keeper_location_access" ON inventory_stock_levels
-- FOR SELECT USING (
--   location_id IN (
--     SELECT unnest(assigned_locations)
--     FROM user_profiles
--     WHERE id = auth.uid() AND role = 'store_keeper'
--   )
-- );

-- =============================================
-- USAGE INSTRUCTIONS
-- =============================================

/*

STEP-BY-STEP GUIDE TO CREATE USERS:

1. Create users in Supabase Dashboard (Authentication > Users):

   User 2: Store Keeper
   - Email: storekeeper@rahah24.com
   - Password: Rahah24@2025
   - Confirm Email: ✅ Yes
   - Copy the UUID

   User 3: Department Head (Kitchen)
   - Email: deptheadkitchen@rahah24.com
   - Password: Rahah24@2025
   - Confirm Email: ✅ Yes
   - Copy the UUID

   User 4: Purchasing Officer
   - Email: purchasing@rahah24.com
   - Password: Rahah24@2025
   - Confirm Email: ✅ Yes
   - Copy the UUID

   User 5: Approver Level 1
   - Email: approverl1@rahah24.com
   - Password: Rahah24@2025
   - Confirm Email: ✅ Yes
   - Copy the UUID

   User 6: Approver Level 2
   - Email: approverl2@rahah24.com
   - Password: Rahah24@2025
   - Confirm Email: ✅ Yes
   - Copy the UUID

   User 7: General Manager
   - Email: gm@rahah24.com
   - Password: Rahah24@2025
   - Confirm Email: ✅ Yes
   - Copy the UUID

   User 8: Finance Officer
   - Email: finance@rahah24.com
   - Password: Rahah24@2025
   - Confirm Email: ✅ Yes
   - Copy the UUID

   User 9: Auditor
   - Email: auditor@rahah24.com
   - Password: Rahah24@2025
   - Confirm Email: ✅ Yes
   - Copy the UUID

2. Replace UUIDs in this script:
   - Uncomment each INSERT statement above
   - Replace 'REPLACE-WITH-XXX-UUID' with actual UUID from step 1

3. Run the script in Supabase SQL Editor:
   - Go to SQL Editor
   - Paste updated script
   - Execute

4. Verify users:
   - Check the SELECT query at the end of this script
   - Should show all 9 users with profiles

5. Test login for each user:
   - Go to http://localhost:9002
   - Try logging in with each user email and password
   - Verify role-based access is working

6. Update passwords on first login:
   - Each user should change their password
   - New password must follow policy: 12+ chars, upper+lower+number+special

*/

-- =============================================
-- END OF SCRIPT
-- =============================================
