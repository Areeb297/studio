# 🛠️ Rahah24 ERP Scripts

This directory contains utility scripts for managing the Rahah24 ERP system.

## Available Scripts

### `create-demo-users.js`
Automatically creates demo users in Supabase Auth and corresponding user profiles.

**Prerequisites:**
- Supabase project set up
- `.env.local` configured with Supabase credentials
- Database schema applied (`enhanced-erp-schema.sql`)

**Usage:**
```bash
# Install dependencies (if not already done)
npm install

# Run the user creation script
node scripts/create-demo-users.js

# Or use the npm script
npm run create-demo-users
```

**Creates these demo users:**
- **Admin**: admin@rahah24.com / Admin123!@#
- **Manager**: manager@rahah24.com / Manager123!@#
- **Staff**: staff@rahah24.com / Staff123!@#

## Manual Alternative

If you prefer to create users manually, follow the guide in `docs/AUTHENTICATION_SETUP.md`.

## Troubleshooting

### "Missing environment variables"
Ensure `.env.local` exists with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### "Table doesn't exist"
Run the database schema first:
1. Copy contents of `database/enhanced-erp-schema.sql`
2. Paste in Supabase SQL Editor
3. Execute the script

### "User already exists"
The script will skip existing users and continue with others.
