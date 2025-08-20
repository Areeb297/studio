-- =============================================
-- RAHAH24 ERP - MINIMAL USER PROFILES SEEDING
-- Simple user profiles for authentication testing
-- =============================================

-- IMPORTANT: Create these users in Supabase Auth Dashboard first:
-- 1. admin@rahah24.com (password: Admin123!@#)
-- 2. manager@rahah24.com (password: Manager123!@#)
-- 3. staff@rahah24.com (password: Staff123!@#)

-- Admin profile (upsert)
INSERT INTO user_profiles (
    id,
    employee_code,
    full_name,
    role,
    email,
    phone,
    job_title,
    department,
    is_active,
    assigned_units,
    permissions
)
SELECT
    u.id,
    'EMP001',
    'System Administrator',
    'admin',
    u.email,
    '+92-300-1234567',
    'System Administrator',
    'Information Technology',
    true,
    ARRAY(SELECT id FROM organization_units),
    '{
      "all_modules": true,
      "user_management": true,
      "system_settings": true
    }'::jsonb
FROM auth.users u
WHERE u.email = 'admin@rahah24.com'
ON CONFLICT (id) DO UPDATE SET
  employee_code = EXCLUDED.employee_code,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  job_title = EXCLUDED.job_title,
  department = EXCLUDED.department,
  is_active = EXCLUDED.is_active,
  assigned_units = EXCLUDED.assigned_units,
  permissions = EXCLUDED.permissions;

-- Manager profile (upsert)
INSERT INTO user_profiles (
    id,
    employee_code,
    full_name,
    role,
    email,
    phone,
    job_title,
    department,
    is_active,
    assigned_units,
    permissions
)
SELECT
    u.id,
    'EMP002',
    'Operations Manager',
    'manager',
    u.email,
    '+92-300-2345678',
    'Operations Manager',
    'Operations',
    true,
    ARRAY(SELECT id FROM organization_units WHERE code IN ('REST','TAHF','LAWN')),
    '{
      "dashboard": true,
      "reports": true,
      "finance": true
    }'::jsonb
FROM auth.users u
WHERE u.email = 'manager@rahah24.com'
ON CONFLICT (id) DO UPDATE SET
  employee_code = EXCLUDED.employee_code,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  job_title = EXCLUDED.job_title,
  department = EXCLUDED.department,
  is_active = EXCLUDED.is_active,
  assigned_units = EXCLUDED.assigned_units,
  permissions = EXCLUDED.permissions;

-- Staff profile (upsert)
INSERT INTO user_profiles (
    id,
    employee_code,
    full_name,
    role,
    email,
    phone,
    job_title,
    department,
    is_active,
    assigned_units,
    permissions
)
SELECT
    u.id,
    'EMP003',
    'Restaurant Staff',
    'staff',
    u.email,
    '+92-300-3456789',
    'Restaurant Cashier',
    'Restaurant Operations',
    true,
    ARRAY(SELECT id FROM organization_units WHERE code = 'REST'),
    '{
      "dashboard": true,
      "pos": true
    }'::jsonb
FROM auth.users u
WHERE u.email = 'staff@rahah24.com'
ON CONFLICT (id) DO UPDATE SET
  employee_code = EXCLUDED.employee_code,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  job_title = EXCLUDED.job_title,
  department = EXCLUDED.department,
  is_active = EXCLUDED.is_active,
  assigned_units = EXCLUDED.assigned_units,
  permissions = EXCLUDED.permissions;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check if profiles were created
SELECT 
    up.employee_code,
    up.full_name,
    up.role,
    up.email,
    up.is_active,
    array_length(up.assigned_units, 1) as unit_count
FROM user_profiles up
WHERE up.email IN ('admin@rahah24.com', 'manager@rahah24.com', 'staff@rahah24.com')
ORDER BY up.role;

-- Check organization unit assignments
SELECT 
    up.full_name,
    up.role,
    ou.name as organization_unit,
    ou.type
FROM user_profiles up
CROSS JOIN unnest(up.assigned_units) as unit_id
JOIN organization_units ou ON ou.id = unit_id
WHERE up.email IN ('admin@rahah24.com', 'manager@rahah24.com', 'staff@rahah24.com')
ORDER BY up.role, ou.name;
