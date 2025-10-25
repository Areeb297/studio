-- =============================================
-- INVENTORY & PROCUREMENT MODULE USERS - COMPLETE WORKING SCRIPT
-- Phase 1 - User Creation with Auth Identities
-- =============================================
-- This script creates 8 new users + updates 1 admin for Inventory & Procurement module
-- All users use @rahah24.com email domain
-- Default password: Rahah24@2025 (users must change on first login)
--
-- IMPORTANT: Run this script in Supabase SQL Editor as Service Role
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- STEP 1: CREATE AUTH USERS
-- =============================================
-- Create 8 new users in auth.users table with encrypted passwords

INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  aud,
  role
) VALUES
  -- User 2: Store Keeper
  (gen_random_uuid(), 'storekeeper@rahah24.com', crypt('Rahah24@2025', gen_salt('bf')), now(), '{"full_name": "Store Keeper"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),

  -- User 3: Department Head (Kitchen)
  (gen_random_uuid(), 'deptheadkitchen@rahah24.com', crypt('Rahah24@2025', gen_salt('bf')), now(), '{"full_name": "Department Head - Kitchen"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),

  -- User 4: Purchasing Officer
  (gen_random_uuid(), 'purchasing@rahah24.com', crypt('Rahah24@2025', gen_salt('bf')), now(), '{"full_name": "Purchasing Officer"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),

  -- User 5: Approver Level 1
  (gen_random_uuid(), 'approverl1@rahah24.com', crypt('Rahah24@2025', gen_salt('bf')), now(), '{"full_name": "Approver Level 1"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),

  -- User 6: Approver Level 2
  (gen_random_uuid(), 'approverl2@rahah24.com', crypt('Rahah24@2025', gen_salt('bf')), now(), '{"full_name": "Approver Level 2"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),

  -- User 7: General Manager (L3)
  (gen_random_uuid(), 'gm@rahah24.com', crypt('Rahah24@2025', gen_salt('bf')), now(), '{"full_name": "General Manager"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),

  -- User 8: Finance Officer
  (gen_random_uuid(), 'finance@rahah24.com', crypt('Rahah24@2025', gen_salt('bf')), now(), '{"full_name": "Finance Officer"}'::jsonb, now(), now(), 'authenticated', 'authenticated'),

  -- User 9: Auditor
  (gen_random_uuid(), 'auditor@rahah24.com', crypt('Rahah24@2025', gen_salt('bf')), now(), '{"full_name": "Auditor"}'::jsonb, now(), now(), 'authenticated', 'authenticated');

-- =============================================
-- STEP 2: CREATE AUTH IDENTITIES
-- =============================================
-- CRITICAL: Create identity records for email/password authentication
-- Without this, users CANNOT login even with correct credentials

INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  provider,
  identity_data,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  u.id,
  u.id::text,
  'email',
  jsonb_build_object(
    'sub', u.id::text,
    'email', u.email,
    'email_verified', true,
    'phone_verified', false
  ),
  now(),
  now(),
  now()
FROM auth.users u
WHERE u.email IN (
  'storekeeper@rahah24.com',
  'deptheadkitchen@rahah24.com',
  'purchasing@rahah24.com',
  'approverl1@rahah24.com',
  'approverl2@rahah24.com',
  'gm@rahah24.com',
  'finance@rahah24.com',
  'auditor@rahah24.com'
)
AND NOT EXISTS (
  SELECT 1 FROM auth.identities i
  WHERE i.user_id = u.id AND i.provider = 'email'
);

-- =============================================
-- STEP 3: CREATE USER PROFILES
-- =============================================
-- Insert user_profiles for all 9 users with detailed permissions

INSERT INTO public.user_profiles (
  id, employee_code, full_name, role, assigned_units, permissions,
  phone, email, department, job_title, is_active, created_at, updated_at
) VALUES
  -- 1. Admin (update existing or insert)
  ((SELECT id FROM auth.users WHERE email = 'admin@rahah24.com'), 'ADMIN-001', 'System Administrator', 'admin', '{}',
   '{"inventory":{"items":["create","read","update","delete"],"stock":["create","read","update","delete","adjust"],"transfers":["create","read","update","delete","approve"],"counts":["create","read","update","delete","approve"]},"procurement":{"requisitions":["create","read","update","delete","approve"],"purchase_orders":["create","read","update","delete","approve"],"grn":["create","read","update","delete","approve"],"vendors":["create","read","update","delete","approve"]},"financial":{"gl_entries":["read","post","reverse"],"invoices":["read","match","approve"],"budgets":["create","read","update","delete"]},"reports":["all"],"alerts":["configure","view","acknowledge"],"system":["configure","manage_users","manage_roles"]}'::jsonb,
   '+92-300-1234567', 'admin@rahah24.com', 'IT / Administration', 'System Administrator', true, now(), now()),

  -- 2. Store Keeper
  ((SELECT id FROM auth.users WHERE email = 'storekeeper@rahah24.com'), 'STK-001', 'Store Keeper', 'store_keeper', '{}',
   '{"inventory":{"items":["read"],"stock":["read","issue","receive"],"adjustments":["create","read"],"transfers":["create","read"],"counts":["create","read","update"],"batches":["create","read","update"]},"procurement":{"requisitions":["create","read"],"purchase_orders":["read"],"grn":["read"],"vendors":["read"]},"reports":["stock_ledger","stock_status","low_stock","expiry_report"]}'::jsonb,
   '+92-300-1234568', 'storekeeper@rahah24.com', 'Main Store / Warehouse', 'Store Keeper', true, now(), now()),

  -- 3. Department Head (Kitchen)
  ((SELECT id FROM auth.users WHERE email = 'deptheadkitchen@rahah24.com'), 'DH-KIT-001', 'Department Head - Kitchen', 'dept_head_kitchen', '{}',
   '{"inventory":{"items":["read"],"stock":["read"],"requisitions":["create","read","update","approve_own_dept"],"issues":["read","request"]},"procurement":{"requisitions":["create","read","approve_under_50k"],"purchase_orders":["read"],"grn":["read"]},"restaurant":{"recipes":["create","read","update"],"recipe_costing":["read","analyze"]},"reports":["dept_consumption","dept_budget","recipe_cost_report"]}'::jsonb,
   '+92-300-1234569', 'deptheadkitchen@rahah24.com', 'Kitchen / Food Production', 'Kitchen Manager', true, now(), now()),

  -- 4. Purchasing Officer
  ((SELECT id FROM auth.users WHERE email = 'purchasing@rahah24.com'), 'PUR-001', 'Purchasing Officer', 'purchasing_officer', '{}',
   '{"inventory":{"items":["read"],"stock":["read"],"reorder_levels":["read","suggest"]},"procurement":{"requisitions":["read","convert_to_po"],"purchase_orders":["create","read","update","send_to_vendor"],"grn":["create","read","update","post"],"vendors":["create","read","update","evaluate"],"price_history":["read","analyze"],"contracts":["create","read","update"]},"financial":{"invoice_matching":["create","read","update"]},"reports":["purchase_register","vendor_performance","price_variance","spend_analysis"]}'::jsonb,
   '+92-300-1234570', 'purchasing@rahah24.com', 'Procurement', 'Purchasing Officer', true, now(), now()),

  -- 5. Approver Level 1
  ((SELECT id FROM auth.users WHERE email = 'approverl1@rahah24.com'), 'APR-L1-001', 'Approver Level 1', 'approver_l1', '{}',
   '{"procurement":{"requisitions":["read","approve_under_50k","reject","comment"],"purchase_orders":["read"],"approval_history":["read_own"]},"reports":["approval_summary","pending_approvals"]}'::jsonb,
   '+92-300-1234571', 'approverl1@rahah24.com', 'Administration / Finance', 'Procurement Coordinator', true, now(), now()),

  -- 6. Approver Level 2
  ((SELECT id FROM auth.users WHERE email = 'approverl2@rahah24.com'), 'APR-L2-001', 'Approver Level 2', 'approver_l2', '{}',
   '{"procurement":{"requisitions":["read","approve_under_200k","reject","comment"],"purchase_orders":["read"],"approval_history":["read_own","read_team"],"budget_tracking":["read","analyze"]},"reports":["approval_summary","pending_approvals","budget_variance"]}'::jsonb,
   '+92-300-1234572', 'approverl2@rahah24.com', 'Finance / Management', 'Finance Manager', true, now(), now()),

  -- 7. General Manager (Level 3)
  ((SELECT id FROM auth.users WHERE email = 'gm@rahah24.com'), 'GM-001', 'General Manager', 'gm', '{}',
   '{"inventory":{"items":["read"],"stock":["read"],"all_operations":["read","approve"]},"procurement":{"requisitions":["read","approve_unlimited","reject","comment"],"purchase_orders":["read","approve_unlimited"],"vendors":["read","approve"],"approval_history":["read_all"]},"financial":{"budgets":["read","approve"],"high_value_transactions":["read","approve"]},"reports":["all"]}'::jsonb,
   '+92-300-1234573', 'gm@rahah24.com', 'Executive Management', 'General Manager', true, now(), now()),

  -- 8. Finance Officer
  ((SELECT id FROM auth.users WHERE email = 'finance@rahah24.com'), 'FIN-001', 'Finance Officer', 'finance_officer', '{}',
   '{"inventory":{"items":["read"],"stock":["read"],"valuations":["read","calculate"]},"procurement":{"requisitions":["read"],"purchase_orders":["read"],"grn":["read"],"vendors":["read"]},"financial":{"gl_entries":["create","read","post"],"invoice_matching":["create","read","update","approve"],"budgets":["create","read","update"],"payments":["process","approve"]},"reports":["financial_all","procurement_financial"]}'::jsonb,
   '+92-300-1234574', 'finance@rahah24.com', 'Finance Department', 'Finance Officer', true, now(), now()),

  -- 9. Auditor
  ((SELECT id FROM auth.users WHERE email = 'auditor@rahah24.com'), 'AUD-001', 'Auditor', 'auditor', '{}',
   '{"inventory":{"items":["read"],"stock":["read"],"adjustments":["read"],"transfers":["read"],"counts":["read"]},"procurement":{"requisitions":["read"],"purchase_orders":["read"],"grn":["read"],"vendors":["read"]},"financial":{"gl_entries":["read"],"invoices":["read"],"budgets":["read"]},"audit":{"trails":["read","export"],"compliance":["read","report"]},"reports":["all_readonly"]}'::jsonb,
   '+92-300-1234575', 'auditor@rahah24.com', 'Internal Audit', 'Internal Auditor', true, now(), now())

ON CONFLICT (id) DO UPDATE SET
  employee_code = EXCLUDED.employee_code,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  department = EXCLUDED.department,
  job_title = EXCLUDED.job_title,
  updated_at = now();

-- =============================================
-- VERIFICATION QUERY
-- =============================================
-- Run this to verify all users were created successfully

SELECT
  up.employee_code,
  up.full_name,
  up.role,
  up.email,
  up.department,
  au.email_confirmed_at IS NOT NULL as email_confirmed,
  ai.provider as identity_provider,
  up.is_active
FROM public.user_profiles up
JOIN auth.users au ON up.id = au.id
LEFT JOIN auth.identities ai ON up.id = ai.user_id
WHERE up.role IN ('admin', 'store_keeper', 'dept_head_kitchen', 'purchasing_officer',
                   'approver_l1', 'approver_l2', 'gm', 'finance_officer', 'auditor')
ORDER BY
  CASE up.role
    WHEN 'admin' THEN 1
    WHEN 'store_keeper' THEN 2
    WHEN 'dept_head_kitchen' THEN 3
    WHEN 'purchasing_officer' THEN 4
    WHEN 'approver_l1' THEN 5
    WHEN 'approver_l2' THEN 6
    WHEN 'gm' THEN 7
    WHEN 'finance_officer' THEN 8
    WHEN 'auditor' THEN 9
  END;

-- =============================================
-- EXPECTED OUTPUT
-- =============================================
-- All 9 users should show:
-- - email_confirmed: true
-- - identity_provider: email
-- - is_active: true
--
-- Login credentials:
-- Email: <any user email above>
-- Password: Rahah24@2025
-- =============================================
