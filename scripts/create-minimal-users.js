#!/usr/bin/env node

/**
 * Rahah24 ERP - Minimal Demo User Creation Script
 * 
 * Creates only essential demo users for authentication testing
 * Run this after setting up your new Supabase project
 * 
 * Usage: node scripts/create-minimal-users.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Demo user credentials (minimal set)
const DEMO_USERS = [
  {
    email: 'admin@rahah24.com',
    password: 'admin123',
    profile: {
      employee_code: 'EMP001',
      full_name: 'System Administrator',
      role: 'admin',
      job_title: 'System Administrator',
      department: 'Information Technology',
      permissions: {
        all_modules: true,
        user_management: true,
        system_settings: true
      }
    }
  },
  {
    email: 'manager@rahah24.com',
    password: 'Manager123!@#',
    profile: {
      employee_code: 'EMP002',
      full_name: 'Operations Manager',
      role: 'manager',
      job_title: 'Operations Manager',
      department: 'Operations',
      permissions: {
        dashboard: true,
        reports: true,
        finance: true
      }
    }
  },
  {
    email: 'staff@rahah24.com',
    password: 'Staff123!@#',
    profile: {
      employee_code: 'EMP003',
      full_name: 'Restaurant Staff',
      role: 'staff',
      job_title: 'Restaurant Cashier',
      department: 'Restaurant Operations',
      permissions: {
        dashboard: true,
        pos: true
      }
    }
  }
];

async function createMinimalUsers() {
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Missing environment variables!');
    console.log('Please ensure these are set in .env.local:');
    console.log('- NEXT_PUBLIC_SUPABASE_URL');
    console.log('- SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Create Supabase admin client
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('🚀 Creating minimal demo users for Rahah24 ERP...\n');

  for (const user of DEMO_USERS) {
    try {
      console.log(`Creating user: ${user.email}`);
      
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true
      });

      if (authError) {
        console.error(`❌ Failed to create auth user ${user.email}:`, authError.message);
        continue;
      }

      console.log(`✅ Auth user created with ID: ${authData.user.id}`);

      // Get organization units for assignment
      const { data: orgUnits, error: orgError } = await supabase
        .from('organization_units')
        .select('id, code')
        .in('code', user.profile.role === 'admin' ? 
          ['MAIN', 'REST', 'TAHF', 'LAWN', 'GYM'] : 
          user.profile.role === 'manager' ?
          ['REST', 'TAHF', 'LAWN'] :
          ['REST']
        );

      if (orgError) {
        console.error(`⚠️  Could not fetch organization units:`, orgError.message);
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          employee_code: user.profile.employee_code,
          full_name: user.profile.full_name,
          role: user.profile.role,
          email: user.email,
          job_title: user.profile.job_title,
          department: user.profile.department,
          phone: user.profile.role === 'admin' ? '+92-300-1234567' : 
                user.profile.role === 'manager' ? '+92-300-2345678' : '+92-300-3456789',
          is_active: true,
          assigned_units: orgUnits?.map(unit => unit.id) || [],
          permissions: user.profile.permissions
        });

      if (profileError) {
        console.error(`❌ Failed to create profile for ${user.email}:`, profileError.message);
        continue;
      }

      console.log(`✅ Profile created for ${user.profile.full_name} (${user.profile.role})\n`);

    } catch (error) {
      console.error(`❌ Unexpected error creating ${user.email}:`, error.message);
    }
  }

  console.log('🎉 Minimal demo user creation completed!');
  console.log('\n📋 Demo Credentials:');
  DEMO_USERS.forEach(user => {
    console.log(`${user.profile.role.toUpperCase()}: ${user.email} / ${user.password}`);
  });
  
  console.log('\n🔗 Next steps:');
  console.log('1. Start your development server: npm run dev');
  console.log('2. Navigate to http://localhost:3000');
  console.log('3. Test login with the credentials above');
}

// Run the script
if (require.main === module) {
  createMinimalUsers().catch(console.error);
}

module.exports = { createMinimalUsers, DEMO_USERS };
