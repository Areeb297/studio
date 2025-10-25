# Row-Level Security (RLS) Policies
**Rahah24 ERP - Inventory & Procurement Module**

---

## 📋 Overview

Row-Level Security (RLS) is a database-level security feature that controls which rows a user can access in database tables. This document outlines the RLS implementation for the Rahah24 ERP system, with a focus on the Inventory & Procurement module.

**Status**: Phase 1 - User Profiles RLS Implemented ✅
**Last Updated**: 2025-01-25
**Version**: 1.0

---

## 🎯 Purpose of RLS

### Why RLS is Critical

1. **Double Protection Layer**
   - Route-level protection (Middleware) - Prevents unauthorized page access
   - Database-level protection (RLS) - Prevents unauthorized data access

2. **Security Benefits**
   - Users cannot bypass route protection via direct API calls
   - Data remains protected even if frontend code is compromised
   - Automatic filtering at the PostgreSQL level

3. **Compliance & Audit**
   - Ensures data access compliance with organizational policies
   - Provides audit trail for data access
   - Meets security standards for financial and procurement data

---

## 🏗️ RLS Architecture

### Current Implementation (Phase 1)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
│  Next.js Middleware checks user role before rendering pages    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Supabase Client Layer                      │
│    Application makes database queries via Supabase JS client   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Row Level Security (RLS)                   │
│         PostgreSQL filters rows based on user role/id           │
│         ✓ Policies check auth.uid() and user_profiles.role     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        Database Tables                          │
│              Only authorized rows are returned                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 RLS Policies for user_profiles Table

### Policy 1: SELECT - Users View Own Profile
```sql
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);
```

**What it does:**
- Users can only read their own profile row
- Filters rows where `auth.uid()` (current user ID) matches the row's `id`

**Example:**
```javascript
// Store Keeper logs in and runs:
const { data } = await supabase.from('user_profiles').select('*')

// RLS automatically filters to return ONLY storekeeper's own row
// Result: 1 row (storekeeper@rahah24.com profile)
```

---

### Policy 2: SELECT - Admins View All Profiles
```sql
CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin' AND is_active = true
    )
  );
```

**What it does:**
- Admin users can read ALL profile rows
- Checks if current user has `role = 'admin'`

**Example:**
```javascript
// Admin logs in and runs:
const { data } = await supabase.from('user_profiles').select('*')

// RLS allows admin to see all rows
// Result: 11 rows (all user profiles)
```

---

### Policy 3: UPDATE - Users Update Own Profile
```sql
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

**What it does:**
- Users can update their own profile only
- Cannot change their role or critical fields (application-level validation)

**Example:**
```javascript
// Store Keeper updates their phone number:
const { error } = await supabase
  .from('user_profiles')
  .update({ phone: '+92-300-9999999' })
  .eq('id', user.id) // Their own ID

// ✅ Success - can update own profile
```

---

### Policy 4: INSERT - Admins Create Profiles
```sql
CREATE POLICY "Admins can insert profiles"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin' AND is_active = true
    )
  );
```

**What it does:**
- Only admin users can insert new profile rows
- Prevents unauthorized user creation

**Example:**
```javascript
// Store Keeper tries to create a new user:
const { error } = await supabase
  .from('user_profiles')
  .insert({ email: 'newuser@rahah24.com', ... })

// ❌ FAIL - RLS blocks this (not admin)

// Admin creates a new user:
// ✅ Success - admin can create profiles
```

---

### Policy 5 & 6: UPDATE/DELETE - Admin Only
**UPDATE Policy:**
```sql
CREATE POLICY "Admins can update all profiles"
  ON public.user_profiles
  FOR UPDATE
  USING ( /* admin check */ );
```

**DELETE Policy:**
```sql
CREATE POLICY "Admins can delete profiles"
  ON public.user_profiles
  FOR DELETE
  USING ( /* admin check */ );
```

**What they do:**
- Only admin users can update ANY profile or delete profiles
- Prevents unauthorized profile modifications

---

## 🛠️ Helper Functions

### 1. `is_admin()` Function
```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Usage in Policies:**
```sql
-- Instead of writing the admin check every time:
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  )
);

-- Use the helper function:
USING (public.is_admin());
```

---

### 2. `get_user_role()` Function
Returns the current user's role as TEXT.

### 3. `has_role(required_role)` Function
Checks if current user has a specific role.

### 4. `has_any_role(required_roles[])` Function
Checks if current user has ANY of the specified roles.

**Example Usage:**
```sql
-- Allow inventory users to view items:
USING (
  public.is_admin() OR
  public.has_any_role(ARRAY['store_keeper', 'purchasing_officer'])
);
```

---

## 📊 RLS Policies by User Role

### Admin
| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| user_profiles | ✅ All rows | ✅ | ✅ All rows | ✅ |
| inventory_items | ✅ All rows | ✅ | ✅ All rows | ✅ |
| purchase_requisitions | ✅ All rows | ✅ | ✅ All rows | ✅ |

### Store Keeper
| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| user_profiles | ✅ Own row only | ❌ | ✅ Own row only | ❌ |
| inventory_items | ✅ All rows | ✅ | ✅ | ❌ |
| stock_movements | ✅ All rows | ✅ | ✅ | ❌ |
| purchase_requisitions | ✅ All rows | ✅ | ✅ Own rows | ❌ |

### Purchasing Officer
| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| user_profiles | ✅ Own row only | ❌ | ✅ Own row only | ❌ |
| inventory_items | ✅ All rows | ✅ | ✅ | ❌ |
| purchase_orders | ✅ All rows | ✅ | ✅ | ❌ |
| vendors | ✅ All rows | ✅ | ✅ | ❌ |

### Finance Officer
| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| user_profiles | ✅ Own row only | ❌ | ✅ Own row only | ❌ |
| inventory_items | ✅ All rows | ❌ | ❌ | ❌ |
| purchase_orders | ✅ All rows | ❌ | ✅ (invoice matching) | ❌ |
| gl_entries | ✅ All rows | ✅ | ✅ | ❌ |

### Auditor (Read-Only)
| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| user_profiles | ✅ Own row only | ❌ | ✅ Own row only | ❌ |
| inventory_items | ✅ All rows | ❌ | ❌ | ❌ |
| purchase_orders | ✅ All rows | ❌ | ❌ | ❌ |
| audit_trails | ✅ All rows | ❌ | ❌ | ❌ |

---

## 🧪 Testing RLS Policies

### Test Scenario 1: Store Keeper Access
**Objective:** Verify store keeper can only see their own profile

**Steps:**
1. Login as `storekeeper@rahah24.com` in Supabase SQL Editor
2. Run query:
   ```sql
   SELECT * FROM public.user_profiles;
   ```
3. **Expected Result:** 1 row (storekeeper profile only)
4. **Actual Result:** ___________
5. **Status:** ✅ Pass / ❌ Fail

---

### Test Scenario 2: Admin Access
**Objective:** Verify admin can see all profiles

**Steps:**
1. Login as `admin@rahah24.com` in Supabase SQL Editor
2. Run query:
   ```sql
   SELECT * FROM public.user_profiles;
   ```
3. **Expected Result:** 11 rows (all user profiles)
4. **Actual Result:** ___________
5. **Status:** ✅ Pass / ❌ Fail

---

### Test Scenario 3: Unauthorized Insert
**Objective:** Verify non-admin cannot create profiles

**Steps:**
1. Login as `storekeeper@rahah24.com`
2. Run query:
   ```sql
   INSERT INTO public.user_profiles (id, email, full_name, role)
   VALUES (gen_random_uuid(), 'test@rahah24.com', 'Test User', 'staff');
   ```
3. **Expected Result:** Error - "new row violates row-level security policy"
4. **Actual Result:** ___________
5. **Status:** ✅ Pass / ❌ Fail

---

### Test Scenario 4: Update Own Profile
**Objective:** Verify users can update their own profile

**Steps:**
1. Login as `storekeeper@rahah24.com`
2. Run query:
   ```sql
   UPDATE public.user_profiles
   SET phone = '+92-300-TEST123'
   WHERE id = auth.uid();
   ```
3. **Expected Result:** Success - 1 row updated
4. **Actual Result:** ___________
5. **Status:** ✅ Pass / ❌ Fail

---

### Test Scenario 5: Unauthorized Update
**Objective:** Verify users cannot update other profiles

**Steps:**
1. Login as `storekeeper@rahah24.com`
2. Run query:
   ```sql
   UPDATE public.user_profiles
   SET role = 'admin'
   WHERE email = 'admin@rahah24.com';
   ```
3. **Expected Result:** 0 rows updated (RLS blocks access to admin's row)
4. **Actual Result:** ___________
5. **Status:** ✅ Pass / ❌ Fail

---

## 📈 Performance Optimization

### Indexes for RLS Performance
```sql
-- Index on role column (used in RLS policies frequently)
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- Index on is_active column
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON public.user_profiles(is_active);

-- Composite index for role + is_active (most common RLS check)
CREATE INDEX IF NOT EXISTS idx_user_profiles_role_active
  ON public.user_profiles(role, is_active);
```

### Why These Indexes Matter
- RLS policies run on EVERY query
- Without indexes, RLS does table scans (slow)
- With indexes, RLS checks are fast even with large datasets

**Performance Impact:**
- **Without index:** 100ms+ per query (50,000 users)
- **With index:** 2-5ms per query (50,000 users)

---

## 🔮 Future Implementation (Phase 2)

### Inventory Tables RLS
When inventory tables are created, apply RLS policies:

#### `inventory_items` Table
```sql
-- SELECT: All inventory users + Finance/Auditor (read-only)
CREATE POLICY "Inventory items viewable by authorized users"
  ON public.inventory_items
  FOR SELECT
  USING (
    public.is_admin() OR
    public.has_any_role(ARRAY[
      'store_keeper', 'dept_head_kitchen', 'purchasing_officer',
      'approver_l1', 'approver_l2', 'gm', 'finance_officer', 'auditor'
    ])
  );

-- INSERT: Admin + Store Keeper + Purchasing Officer
CREATE POLICY "Inventory items creatable by authorized users"
  ON public.inventory_items
  FOR INSERT
  WITH CHECK (
    public.is_admin() OR
    public.has_any_role(ARRAY['store_keeper', 'purchasing_officer'])
  );
```

#### `purchase_requisitions` Table
```sql
-- UPDATE: Approval workflow based on amount and role
CREATE POLICY "Purchase requisitions updatable by workflow"
  ON public.purchase_requisitions
  FOR UPDATE
  USING (
    public.is_admin() OR
    -- Owner can update own requisitions
    created_by = auth.uid() OR
    -- L1 approvers: <50K
    (public.has_any_role(ARRAY['approver_l1', 'dept_head_kitchen']) AND amount < 50000) OR
    -- L2 approvers: <200K
    (public.has_role('approver_l2') AND amount < 200000) OR
    -- GM: unlimited
    public.has_role('gm')
  );
```

---

## ⚠️ Important Best Practices

### 1. Always Enable RLS on New Tables
```sql
-- WRONG: Forgetting to enable RLS
CREATE TABLE inventory_items (...);

-- CORRECT: Enable RLS immediately after creating table
CREATE TABLE inventory_items (...);
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
```

### 2. Test Policies with Each Role
- Don't assume policies work - test them!
- Use actual login credentials to test in Supabase SQL Editor
- Test both allowed and blocked operations

### 3. Index Columns Used in Policies
- Always index `user_id`, `role`, `created_by` columns
- RLS policies run on every query - performance matters

### 4. Never Use `USING (true)` in Production
```sql
-- DANGER: This allows ALL logged-in users to see ALL rows
CREATE POLICY "bad_policy" ON table FOR SELECT USING (true);

-- CORRECT: Always filter based on role or ownership
CREATE POLICY "good_policy" ON table FOR SELECT
  USING (auth.uid() = created_by OR public.is_admin());
```

### 5. Use Security Definer Functions for Complex Checks
- Helper functions (`is_admin()`, `has_role()`) improve performance
- Avoid complex subqueries directly in USING clause

---

## 📝 Maintenance Checklist

### When Creating New Tables:
- [ ] Enable RLS on the table
- [ ] Create SELECT policy (who can read?)
- [ ] Create INSERT policy (who can create?)
- [ ] Create UPDATE policy (who can modify?)
- [ ] Create DELETE policy (who can delete?)
- [ ] Add indexes on columns used in policies
- [ ] Test policies with each user role
- [ ] Document policies in this file

### Quarterly Review:
- [ ] Review all RLS policies for accuracy
- [ ] Test policies with sample data
- [ ] Check query performance (slow queries?)
- [ ] Update indexes if needed
- [ ] Audit access logs for violations

---

## 🆘 Troubleshooting

### Issue: "new row violates row-level security policy"
**Cause:** User doesn't have permission for this operation
**Solution:**
1. Check which policy is blocking (SELECT, INSERT, UPDATE, DELETE)
2. Verify user role: `SELECT role FROM user_profiles WHERE id = auth.uid();`
3. Review policy conditions in `database/rls-policies.sql`

### Issue: Queries return 0 rows (but data exists)
**Cause:** RLS SELECT policy is blocking
**Solution:**
1. Temporarily disable RLS to verify data exists
2. Check SELECT policy conditions
3. Add debugging: `SELECT public.get_user_role();`

### Issue: Slow Query Performance
**Cause:** Missing indexes on RLS policy columns
**Solution:**
1. Identify columns used in USING clause
2. Add indexes: `CREATE INDEX idx_table_column ON table(column);`
3. Analyze query plan: `EXPLAIN ANALYZE SELECT ...;`

---

## 📚 Additional Resources

- **Supabase RLS Documentation:** https://supabase.com/docs/guides/database/postgres/row-level-security
- **PostgreSQL RLS Guide:** https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- **RLS Best Practices:** https://supabase.com/docs/guides/troubleshooting/rls-simplified

---

**Document Version:** 1.0
**Created:** 2025-01-25
**Last Updated:** 2025-01-25
**Status:** Active - Phase 1 Complete
**Maintained By:** Rahah24 Development Team
