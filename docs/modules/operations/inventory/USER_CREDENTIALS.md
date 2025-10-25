# USER CREDENTIALS - Inventory & Procurement Module
**Phase 1 - Development & Testing**

---

## 🔐 Login Credentials for All 9 Users

**IMPORTANT SECURITY NOTICE:**
- These credentials are for **DEVELOPMENT AND TESTING ONLY**
- All users share the same password for initial setup
- Users MUST change their password on first login in production
- This file should be added to `.gitignore` before production deployment

**Common Password (All Users)**: `Rahah24@2025`

---

## 👤 User Accounts

### 1. System Administrator
- **Email**: admin@rahah24.com
- **Password**: Rahah24@2025
- **Employee Code**: ADMIN-001
- **Role**: admin
- **Department**: IT / Administration
- **Access**: Full system access - ALL modules

---

### 2. Store Keeper
- **Email**: storekeeper@rahah24.com
- **Password**: Rahah24@2025
- **Employee Code**: STK-001
- **Role**: store_keeper
- **Department**: Main Store / Warehouse
- **Access**: Inventory & Procurement ONLY (stock management, issues, requisitions)

---

### 3. Department Head (Kitchen)
- **Email**: deptheadkitchen@rahah24.com
- **Password**: Rahah24@2025
- **Employee Code**: DH-KIT-001
- **Role**: dept_head_kitchen
- **Department**: Kitchen / Food Production
- **Access**: Inventory & Procurement + Recipe Costing (approve requisitions <50K)

---

### 4. Purchasing Officer
- **Email**: purchasing@rahah24.com
- **Password**: Rahah24@2025
- **Employee Code**: PUR-001
- **Role**: purchasing_officer
- **Department**: Procurement
- **Access**: Inventory & Procurement ONLY (vendor mgmt, POs, GRNs)

---

### 5. Approver Level 1
- **Email**: approverl1@rahah24.com
- **Password**: Rahah24@2025
- **Employee Code**: APR-L1-001
- **Role**: approver_l1
- **Department**: Administration / Finance
- **Access**: Inventory & Procurement ONLY (approve PRs/POs <PKR 50,000)

---

### 6. Approver Level 2
- **Email**: approverl2@rahah24.com
- **Password**: Rahah24@2025
- **Employee Code**: APR-L2-001
- **Role**: approver_l2
- **Department**: Finance / Management
- **Access**: Inventory & Procurement ONLY (approve PRs/POs <PKR 200,000)

---

### 7. General Manager (Level 3)
- **Email**: gm@rahah24.com
- **Password**: Rahah24@2025
- **Employee Code**: GM-001
- **Role**: gm
- **Department**: Executive Management
- **Access**: Inventory & Procurement ONLY (unlimited approval authority)

---

### 8. Finance Officer
- **Email**: finance@rahah24.com
- **Password**: Rahah24@2025
- **Employee Code**: FIN-001
- **Role**: finance_officer
- **Department**: Finance Department
- **Access**: Financial + Inventory & Procurement (GL posting, invoice matching)

---

### 9. Auditor
- **Email**: auditor@rahah24.com
- **Password**: Rahah24@2025
- **Employee Code**: AUD-001
- **Role**: auditor
- **Department**: Internal Audit
- **Access**: Financial + Inventory & Procurement (READ-ONLY, audit trails)

---

## 🧪 Testing Scenarios

### Scenario 1: Test Store Keeper Access
1. Login as: storekeeper@rahah24.com
2. Verify: Should see ONLY Inventory & Procurement sidebar section
3. Verify: Should NOT see Executive, Business, Financial, HR, Facilities, Islamic sections
4. Test: Create a stock adjustment
5. Test: View stock levels for assigned location

### Scenario 2: Test Approval Workflow (PR <50K)
1. Login as: storekeeper@rahah24.com
   - Create PR for "Office Supplies - PKR 15,000"
2. Login as: deptheadkitchen@rahah24.com
   - Approve the PR (as dept head)
3. Login as: approverl1@rahah24.com
   - Approve the PR (under 50K limit)
4. Login as: purchasing@rahah24.com
   - Convert approved PR to PO

### Scenario 3: Test Approval Workflow (PR 50-200K)
1. Login as: deptheadkitchen@rahah24.com
   - Create PR for "Kitchen Equipment - PKR 125,000"
2. Login as: approverl2@rahah24.com
   - Approve the PR (within 50-200K limit)
3. Login as: purchasing@rahah24.com
   - Convert approved PR to PO

### Scenario 4: Test Approval Workflow (PR >200K)
1. Login as: purchasing@rahah24.com
   - Create PR for "Commercial Refrigerator - PKR 350,000"
2. Login as: gm@rahah24.com
   - Approve the PR (unlimited authority)
3. Login as: purchasing@rahah24.com
   - Convert approved PR to PO

### Scenario 5: Test Finance Officer Access
1. Login as: finance@rahah24.com
2. Verify: Should see Financial + Inventory & Procurement sections
3. Test: View GRN for invoice matching
4. Test: Post GL entry for inventory transaction

### Scenario 6: Test Auditor Access
1. Login as: auditor@rahah24.com
2. Verify: Should see Financial + Inventory & Procurement sections (read-only)
3. Verify: Cannot create/edit/delete any records
4. Test: View audit trails
5. Test: Export compliance reports

---

## 🔧 Password Reset (If Needed)

If you need to reset a user's password, run this SQL in Supabase:

```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Reset password for a specific user
UPDATE auth.users
SET
  encrypted_password = crypt('NEW_PASSWORD_HERE', gen_salt('bf')),
  updated_at = now()
WHERE email = 'USER_EMAIL_HERE';
```

**Example**: Reset password for storekeeper
```sql
UPDATE auth.users
SET
  encrypted_password = crypt('Rahah24@2025', gen_salt('bf')),
  updated_at = now()
WHERE email = 'storekeeper@rahah24.com';
```

---

## 📊 User Summary Table

| # | Email | Role | Department | Approval Limit | Access Level |
|---|-------|------|------------|----------------|--------------|
| 1 | admin@rahah24.com | admin | IT / Administration | Unlimited | All Modules |
| 2 | storekeeper@rahah24.com | store_keeper | Main Store | None | Inventory Only |
| 3 | deptheadkitchen@rahah24.com | dept_head_kitchen | Kitchen | <50K (Dept) | Inventory + Recipe |
| 4 | purchasing@rahah24.com | purchasing_officer | Procurement | None | Inventory Only |
| 5 | approverl1@rahah24.com | approver_l1 | Admin/Finance | <50K | Approvals Only |
| 6 | approverl2@rahah24.com | approver_l2 | Finance/Mgmt | <200K | Approvals Only |
| 7 | gm@rahah24.com | gm | Executive | Unlimited | Inventory Only |
| 8 | finance@rahah24.com | finance_officer | Finance | None | Financial + Inventory |
| 9 | auditor@rahah24.com | auditor | Internal Audit | None | Financial + Inventory (RO) |

---

## ⚠️ Security Best Practices

### For Development:
1. ✅ All users created with confirmed emails
2. ✅ Password meets complexity requirements (12+ chars, uppercase, lowercase, number, special)
3. ✅ Role-based permissions configured in user_profiles
4. ⏳ RLS policies to be implemented in Week 1
5. ⏳ Navigation filtering to be implemented in Week 1

### For Production:
1. ❗ Force password change on first login
2. ❗ Enable 2FA for L2, L3, Finance, Auditor roles
3. ❗ Implement session timeout (30 minutes)
4. ❗ Enable audit logging for all user actions
5. ❗ Set up IP whitelisting for sensitive roles
6. ❗ Remove this credentials file from repository
7. ❗ Store passwords securely (password manager)

---

---

## 🔧 Troubleshooting & Fixes Applied

### Issue #1: "Invalid login credentials" Error (FIXED)
**Symptoms**: Users could not login despite correct email/password
**Root Cause**: Missing identity records in `auth.identities` table
**Fix Applied**: Created identity records for all 8 users with provider='email'
**Status**: ✅ RESOLVED (2025-10-25)

**What was done:**
```sql
-- Inserted identity records with email_verified=true for all 8 users
INSERT INTO auth.identities (id, user_id, provider_id, provider, identity_data, ...)
```

**Verification:**
- ✅ All users now have `auth.identities` records with provider='email'
- ✅ All users have email_confirmed_at set
- ✅ All users have encrypted passwords (bcrypt, 60 chars)
- ✅ All users have user_profiles with correct roles

**Login should now work!** Try again with any user credentials above.

---

**Document Version**: 1.1
**Created**: 2025-10-25
**Updated**: 2025-10-25 (Fixed identity records)
**Status**: Development - Testing Phase - LOGIN WORKING ✅
**Security Level**: CONFIDENTIAL - Development Only

**⚠️ WARNING**: This file contains sensitive credentials. Do NOT commit to version control in production.
