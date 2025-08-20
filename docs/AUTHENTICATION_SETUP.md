# 🔐 Rahah24 ERP Authentication Setup Guide

## Overview
This guide walks you through setting up authentication for Rahah24 ERP using Supabase Auth with custom user profiles.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase Auth  │    │   Database      │
│   (Next.js)     │────│   (auth.users)   │────│ (user_profiles) │
│                 │    │                  │    │                 │
│ - Login Form    │    │ - Password Hash  │    │ - Business Data │
│ - Auth Service  │    │ - Sessions       │    │ - Roles & Perms │
│ - Role Checks   │    │ - JWT Tokens     │    │ - Organization  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Setup Steps

### Step 1: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials from your project dashboard:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

### Step 2: Apply Database Schema

1. Run the main schema in your Supabase SQL editor:
   ```sql
   -- Copy and paste contents of database/enhanced-erp-schema.sql
   ```

2. Verify tables are created:
   - `organization_units`
   - `user_profiles` 
   - All other ERP tables

### Step 3: Create Initial Users in Supabase Auth

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Users**
3. Click **"Add user"**
4. Create these demo users:

   **Admin User:**
   - Email: `admin@rahah24.com`
   - Password: `Admin123!@#`
   - Email Confirm: ✅ Yes
   
   **Manager User:**
   - Email: `manager@rahah24.com`
   - Password: `Manager123!@#`
   - Email Confirm: ✅ Yes
   
   **Staff User:**
   - Email: `staff@rahah24.com`
   - Password: `Staff123!@#`
   - Email Confirm: ✅ Yes

5. **Copy the User UUIDs** from each created user

**Option B: Using Supabase CLI (Advanced)**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Create users via API calls
curl -X POST 'https://your-project-id.supabase.co/auth/v1/admin/users' \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@rahah24.com",
    "password": "Admin123!@#",
    "email_confirm": true
  }'
```

### Step 4: Seed User Profiles

1. Open `database/seed-initial-users.sql`

2. Replace the placeholder UUIDs with actual UUIDs from Step 3:
   ```sql
   -- Replace these with actual UUIDs from Supabase Auth
   'ADMIN-USER-UUID-FROM-SUPABASE'::uuid,   -- Replace with admin user UUID
   'MANAGER-USER-UUID-FROM-SUPABASE'::uuid, -- Replace with manager user UUID  
   'STAFF-USER-UUID-FROM-SUPABASE'::uuid,   -- Replace with staff user UUID
   ```

3. Run the updated SQL script in Supabase SQL editor

4. Verify with the verification queries at the end of the script

### Step 5: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. Test login with demo credentials:
   - **Admin**: admin@rahah24.com / Admin123!@#
   - **Manager**: manager@rahah24.com / Manager123!@#  
   - **Staff**: staff@rahah24.com / Staff123!@#

4. Verify you can access the dashboard after login

## 🔒 Security Features

### Password Requirements
- Minimum 12 characters
- Must contain: uppercase, lowercase, numbers, special characters
- Handled by Supabase Auth with bcrypt hashing

### Role-Based Access Control
- **Admin**: Full system access
- **Manager**: Operations, reports, approvals
- **Staff**: Basic POS and operations

### Session Management
- JWT tokens managed by Supabase
- Automatic session refresh
- Secure logout functionality

## 🛠️ Troubleshooting

### Issue: "Invalid login credentials"
**Solution**: Ensure users are created in Supabase Auth and email is confirmed

### Issue: "User profile not found"
**Solution**: Run the user profile seeding script with correct UUIDs

### Issue: "Environment variables not found"
**Solution**: Ensure `.env.local` exists with correct Supabase credentials

### Issue: Login works but dashboard access denied
**Solution**: Check user_profiles table has correct role and permissions

## 📊 User Management

### Adding New Users

1. **Create in Supabase Auth** (via dashboard or API)
2. **Add profile record**:
   ```sql
   INSERT INTO user_profiles (
       id, employee_code, full_name, role, email, 
       job_title, is_active, assigned_units, permissions
   ) VALUES (
       'user-uuid-from-auth',
       'EMP004', 
       'New User Name',
       'staff',
       'user@rahah24.com',
       'Job Title',
       true,
       ARRAY(SELECT id FROM organization_units WHERE code = 'REST'),
       '{"dashboard": true, "pos": true}'::jsonb
   );
   ```

### Role Permissions Matrix

| Role | Dashboard | Finance | POS | Academic | Events | Admin |
|------|-----------|---------|-----|----------|--------|-------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manager | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Accountant | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Teacher | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Staff | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |

## 🎯 Next Steps

1. **Test thoroughly** with all user roles
2. **Customize permissions** as needed for your organization
3. **Add more users** following the process above
4. **Set up password reset** flow (already implemented in auth service)
5. **Configure email templates** in Supabase for user communications

---

**✅ Your authentication system is now ready for production use!**

For support, check the logs in browser console and Supabase dashboard.
