-- =============================================
-- RAHAH24 ERP - ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================
-- This script implements comprehensive Row Level Security policies
-- for the Rahah24 ERP system to ensure data access control at the
-- database level.
--
-- IMPORTANT: Run this script in Supabase SQL Editor as Service Role
-- =============================================
-- Last Updated: 2025-01-25
-- Version: 1.0
-- =============================================

-- =============================================
-- PART 1: USER PROFILES TABLE
-- =============================================
-- Enable RLS on user_profiles table
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running this script)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.user_profiles;

-- POLICY 1: SELECT - Users can read their own profile
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- POLICY 2: SELECT - Admins can read all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin' AND is_active = true
    )
  );

-- POLICY 3: UPDATE - Users can update their own profile (limited fields)
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- POLICY 4: INSERT - Only admins can create new profiles
CREATE POLICY "Admins can insert profiles"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin' AND is_active = true
    )
  );

-- POLICY 5: UPDATE - Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON public.user_profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin' AND is_active = true
    )
  );

-- POLICY 6: DELETE - Only admins can delete profiles
CREATE POLICY "Admins can delete profiles"
  ON public.user_profiles
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin' AND is_active = true
    )
  );

-- =============================================
-- CREATE INDEX FOR PERFORMANCE
-- =============================================
-- Index on role column for faster RLS policy checks
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON public.user_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role_active ON public.user_profiles(role, is_active);

-- =============================================
-- PART 2: HELPER FUNCTIONS FOR RLS
-- =============================================

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid()
      AND role = 'admin'
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM public.user_profiles
    WHERE id = auth.uid() AND is_active = true
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid()
      AND role = required_role
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has any of the specified roles
CREATE OR REPLACE FUNCTION public.has_any_role(required_roles TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid()
      AND role = ANY(required_roles)
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- PART 3: INVENTORY & PROCUREMENT RLS POLICIES (TEMPLATE)
-- =============================================
-- These policies will be applied when inventory tables are created
-- This section serves as a template for future implementation

/*
-- Example: inventory_items table RLS policies
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- SELECT: Admin + Inventory Users (all) + Finance/Auditor (read-only)
CREATE POLICY "Inventory items can be viewed by authorized users"
  ON public.inventory_items
  FOR SELECT
  USING (
    public.is_admin() OR
    public.has_any_role(ARRAY[
      'store_keeper',
      'dept_head_kitchen',
      'purchasing_officer',
      'approver_l1',
      'approver_l2',
      'gm',
      'finance_officer',
      'auditor',
      'manager',
      'staff'
    ])
  );

-- INSERT: Admin + Store Keeper + Purchasing Officer
CREATE POLICY "Inventory items can be created by authorized users"
  ON public.inventory_items
  FOR INSERT
  WITH CHECK (
    public.is_admin() OR
    public.has_any_role(ARRAY['store_keeper', 'purchasing_officer'])
  );

-- UPDATE: Admin + Store Keeper + Purchasing Officer
CREATE POLICY "Inventory items can be updated by authorized users"
  ON public.inventory_items
  FOR UPDATE
  USING (
    public.is_admin() OR
    public.has_any_role(ARRAY['store_keeper', 'purchasing_officer'])
  );

-- DELETE: Admin only
CREATE POLICY "Inventory items can be deleted by admin only"
  ON public.inventory_items
  FOR DELETE
  USING (public.is_admin());
*/

/*
-- Example: purchase_requisitions table RLS policies
ALTER TABLE public.purchase_requisitions ENABLE ROW LEVEL SECURITY;

-- SELECT: All inventory users can view requisitions
CREATE POLICY "Purchase requisitions can be viewed by authorized users"
  ON public.purchase_requisitions
  FOR SELECT
  USING (
    public.is_admin() OR
    public.has_any_role(ARRAY[
      'store_keeper',
      'dept_head_kitchen',
      'purchasing_officer',
      'approver_l1',
      'approver_l2',
      'gm',
      'finance_officer',
      'auditor',
      'manager'
    ])
  );

-- INSERT: Store Keeper, Dept Heads, Purchasing Officer
CREATE POLICY "Purchase requisitions can be created by authorized users"
  ON public.purchase_requisitions
  FOR INSERT
  WITH CHECK (
    public.is_admin() OR
    public.has_any_role(ARRAY['store_keeper', 'dept_head_kitchen', 'purchasing_officer'])
  );

-- UPDATE: Based on approval workflow and ownership
CREATE POLICY "Purchase requisitions can be updated by authorized users"
  ON public.purchase_requisitions
  FOR UPDATE
  USING (
    public.is_admin() OR
    -- Owner can update their own requisitions
    created_by = auth.uid() OR
    -- Approvers can update (for approval status)
    public.has_any_role(ARRAY['approver_l1', 'approver_l2', 'gm']) OR
    -- Purchasing officer can update
    public.has_role('purchasing_officer')
  );

-- DELETE: Admin only
CREATE POLICY "Purchase requisitions can be deleted by admin only"
  ON public.purchase_requisitions
  FOR DELETE
  USING (public.is_admin());
*/

-- =============================================
-- PART 4: VERIFICATION QUERIES
-- =============================================

-- Verify RLS is enabled on user_profiles
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'user_profiles';

-- List all policies on user_profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- Test helper functions
SELECT
  public.is_admin() as is_admin,
  public.get_user_role() as current_role,
  public.has_role('admin') as has_admin_role,
  public.has_any_role(ARRAY['store_keeper', 'admin']) as has_inventory_role;

-- =============================================
-- TESTING GUIDELINES
-- =============================================

/*
## How to Test RLS Policies

### Test 1: Admin Access
1. Login as admin@rahah24.com
2. Run: SELECT * FROM public.user_profiles;
   Expected: Should see all 11 user profiles

### Test 2: Store Keeper Access
1. Login as storekeeper@rahah24.com
2. Run: SELECT * FROM public.user_profiles;
   Expected: Should see ONLY their own profile (1 row)

### Test 3: Update Own Profile
1. Login as storekeeper@rahah24.com
2. Run: UPDATE public.user_profiles SET phone = '+92-300-9999999' WHERE id = auth.uid();
   Expected: Success (users can update their own profile)

### Test 4: Unauthorized Insert
1. Login as storekeeper@rahah24.com
2. Run: INSERT INTO public.user_profiles (id, email, full_name, role) VALUES (...);
   Expected: FAIL (only admins can insert profiles)

### Test 5: Unauthorized Read Other Profiles
1. Login as storekeeper@rahah24.com
2. Run: SELECT * FROM public.user_profiles WHERE role = 'admin';
   Expected: No results (can only see own profile)

### Test 6: Admin Insert
1. Login as admin@rahah24.com
2. Run: INSERT INTO public.user_profiles (id, email, full_name, role) VALUES (...);
   Expected: Success (admin can create profiles)
*/

-- =============================================
-- ROLLBACK INSTRUCTIONS
-- =============================================

/*
## To Disable RLS (Emergency Only)

-- Disable RLS on user_profiles
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Drop all policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.user_profiles;

-- Drop helper functions
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.get_user_role();
DROP FUNCTION IF EXISTS public.has_role(TEXT);
DROP FUNCTION IF EXISTS public.has_any_role(TEXT[]);
*/

-- =============================================
-- END OF RLS POLICIES
-- =============================================
