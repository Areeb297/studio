-- =============================================
-- RAHAH24 ERP - MINIMAL AUTHENTICATION SCHEMA
-- Essential tables for login functionality only
-- =============================================

-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. ORGANIZATION STRUCTURE (Minimal)
-- =============================================

-- Organization Units (just the basics we need)
CREATE TABLE organization_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'restaurant', 'academic', 'events', 'fitness', 'headquarters'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced User Profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    employee_code VARCHAR(20) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user', -- 'admin', 'manager', 'accountant', 'staff', 'teacher', 'student'
    assigned_units UUID[] DEFAULT '{}',
    permissions JSONB DEFAULT '{}',
    phone VARCHAR(50),
    email VARCHAR(255),
    job_title VARCHAR(100),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. INSERT INITIAL DATA
-- =============================================

-- Insert Organization Units
INSERT INTO organization_units (code, name, type) VALUES 
('MAIN', 'Jamia Binoria Aalamia', 'headquarters'),
('REST', 'Binoria Restaurant', 'restaurant'),
('TAHF', 'Tahfeez Madrasa', 'academic'),
('LAWN', 'Shadi Lawn', 'events'),
('GYM', 'Gym Time', 'fitness');

-- =============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_units ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to read organization units
CREATE POLICY "Authenticated users can view organization units" ON organization_units
    FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_employee_code ON user_profiles(employee_code);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- Organization units indexes
CREATE INDEX idx_organization_units_code ON organization_units(code);
CREATE INDEX idx_organization_units_type ON organization_units(type);

-- =============================================
-- 5. VERIFICATION QUERIES
-- =============================================

-- Check if tables were created successfully
SELECT 
    schemaname, 
    tablename, 
    tableowner 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'organization_units')
ORDER BY tablename;

-- Check if organization units were inserted
SELECT * FROM organization_units ORDER BY code;

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'organization_units');

-- Check policies
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'organization_units')
ORDER BY tablename, policyname;
