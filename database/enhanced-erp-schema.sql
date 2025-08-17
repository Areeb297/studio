-- =============================================
-- RAHAH24 COMPLETE ERP DATABASE SCHEMA
-- Enhanced Multi-Business Restaurant Management System
-- Jamia Binoria Aalamia - Complete ERP Replacement
-- =============================================

-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- =============================================
-- 1. ENHANCED ORGANIZATION STRUCTURE
-- =============================================

-- Organization Units (Restaurant, Tahfeez, Shadi Lawn, Gym Time)
CREATE TABLE organization_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'restaurant', 'academic', 'events', 'fitness', 'headquarters'
    parent_id UUID REFERENCES organization_units(id),
    is_active BOOLEAN DEFAULT true,
    cost_center_code VARCHAR(20) UNIQUE,
    manager_id UUID REFERENCES auth.users(id),
    settings JSONB DEFAULT '{}',
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
    address TEXT,
    hire_date DATE,
    job_title VARCHAR(100),
    department VARCHAR(100),
    salary_grade VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    profile_image_url TEXT,
    emergency_contact JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 2. ENHANCED CHART OF ACCOUNTS & GENERAL LEDGER
-- =============================================

-- Enhanced Chart of Accounts
CREATE TABLE chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- 'asset', 'liability', 'equity', 'revenue', 'expense'
    account_category VARCHAR(100), -- 'current_asset', 'fixed_asset', 'cogs', etc.
    parent_account_id UUID REFERENCES chart_of_accounts(id),
    organization_unit_id UUID REFERENCES organization_units(id),
    cost_center_codes VARCHAR(100)[], -- Multiple cost centers
    is_active BOOLEAN DEFAULT true,
    is_system_account BOOLEAN DEFAULT false,
    opening_balance_debit DECIMAL(15,2) DEFAULT 0,
    opening_balance_credit DECIMAL(15,2) DEFAULT 0,
    current_balance DECIMAL(15,2) DEFAULT 0,
    account_description TEXT,
    bank_details JSONB DEFAULT '{}', -- For bank accounts
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Periods (for proper accounting periods)
CREATE TABLE financial_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period_name VARCHAR(100) NOT NULL,
    period_type VARCHAR(50) NOT NULL, -- 'monthly', 'quarterly', 'yearly'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    organization_unit_id UUID REFERENCES organization_units(id),
    is_closed BOOLEAN DEFAULT false,
    closing_date TIMESTAMP WITH TIME ZONE,
    closed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget Planning
CREATE TABLE budget_planning (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_name VARCHAR(255) NOT NULL,
    financial_period_id UUID REFERENCES financial_periods(id),
    account_id UUID REFERENCES chart_of_accounts(id),
    organization_unit_id UUID REFERENCES organization_units(id),
    budgeted_amount DECIMAL(15,2) NOT NULL,
    actual_amount DECIMAL(15,2) DEFAULT 0,
    variance_amount DECIMAL(15,2) DEFAULT 0,
    variance_percentage DECIMAL(5,2) DEFAULT 0,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced General Ledger Transactions
CREATE TABLE gl_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    transaction_date DATE NOT NULL,
    description TEXT,
    reference_type VARCHAR(50), -- 'sale', 'purchase', 'payment', 'receipt', 'journal', 'payroll', 'adjustment'
    reference_id UUID,
    reference_number VARCHAR(100),
    organization_unit_id UUID REFERENCES organization_units(id),
    financial_period_id UUID REFERENCES financial_periods(id),
    created_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    total_amount DECIMAL(15,2) NOT NULL,
    is_posted BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    posted_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    tags VARCHAR(100)[],
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced General Ledger Entries (Double Entry)
CREATE TABLE gl_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES gl_transactions(id) ON DELETE CASCADE,
    account_id UUID REFERENCES chart_of_accounts(id),
    debit_amount DECIMAL(15,2) DEFAULT 0,
    credit_amount DECIMAL(15,2) DEFAULT 0,
    description TEXT,
    cost_center VARCHAR(100),
    project_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. ENHANCED CUSTOMER & SUPPLIER MANAGEMENT
-- =============================================

-- Enhanced Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_code VARCHAR(20) UNIQUE,
    name VARCHAR(255) NOT NULL,
    customer_type VARCHAR(50), -- 'restaurant', 'event', 'student', 'member', 'donor'
    email VARCHAR(255),
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    associated_units UUID[] DEFAULT '{}',
    credit_limit DECIMAL(15,2) DEFAULT 0,
    current_balance DECIMAL(15,2) DEFAULT 0,
    loyalty_points INTEGER DEFAULT 0,
    membership_level VARCHAR(50), -- 'bronze', 'silver', 'gold', 'platinum'
    date_of_birth DATE,
    anniversary_date DATE,
    preferences JSONB DEFAULT '{}',
    communication_preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Suppliers/Vendors
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_code VARCHAR(20) UNIQUE,
    name VARCHAR(255) NOT NULL,
    supplier_type VARCHAR(50), -- 'food', 'equipment', 'books', 'fitness', 'services'
    email VARCHAR(255),
    phone VARCHAR(50),
    contact_person VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    supplier_categories VARCHAR(100)[],
    payment_terms INTEGER DEFAULT 30,
    tax_number VARCHAR(50),
    bank_details JSONB DEFAULT '{}',
    current_balance DECIMAL(15,2) DEFAULT 0,
    rating DECIMAL(2,1), -- 1.0 to 5.0
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. ENHANCED INVENTORY MANAGEMENT
-- =============================================

-- Enhanced Inventory Categories
CREATE TABLE inventory_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category_code VARCHAR(20) UNIQUE,
    organization_unit_id UUID REFERENCES organization_units(id),
    parent_category_id UUID REFERENCES inventory_categories(id),
    category_type VARCHAR(50), -- 'raw_material', 'finished_goods', 'equipment', 'supplies'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Inventory Items
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES inventory_categories(id),
    unit_of_measure VARCHAR(50) NOT NULL,
    alternative_units JSONB DEFAULT '[]', -- Conversion factors
    current_stock DECIMAL(10,3) DEFAULT 0,
    minimum_stock DECIMAL(10,3) DEFAULT 0,
    maximum_stock DECIMAL(10,3) DEFAULT 0,
    reorder_level DECIMAL(10,3) DEFAULT 0,
    average_cost DECIMAL(10,2) DEFAULT 0,
    last_purchase_rate DECIMAL(10,2) DEFAULT 0,
    selling_price DECIMAL(10,2) DEFAULT 0,
    location VARCHAR(100),
    shelf_life_days INTEGER,
    organization_unit_id UUID REFERENCES organization_units(id),
    supplier_id UUID REFERENCES suppliers(id),
    item_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    specifications JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Stock Movements
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    movement_number VARCHAR(50) UNIQUE,
    item_id UUID REFERENCES inventory_items(id),
    movement_type VARCHAR(50) NOT NULL, -- 'purchase', 'sale', 'adjustment', 'transfer', 'waste', 'return'
    quantity DECIMAL(10,3) NOT NULL,
    unit_cost DECIMAL(10,2),
    total_value DECIMAL(15,2),
    reference_type VARCHAR(50),
    reference_id UUID,
    from_location VARCHAR(100),
    to_location VARCHAR(100),
    organization_unit_id UUID REFERENCES organization_units(id),
    movement_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date DATE,
    batch_number VARCHAR(100),
    created_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    notes TEXT,
    is_approved BOOLEAN DEFAULT false
);

-- =============================================
-- 5. ENHANCED RESTAURANT MODULE
-- =============================================

-- Enhanced Menu Categories
CREATE TABLE menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category_code VARCHAR(20) UNIQUE,
    description TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    available_hours JSONB DEFAULT '{}', -- Breakfast, lunch, dinner availability
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Menu Items
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_code VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES menu_categories(id),
    description TEXT,
    selling_price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2),
    margin_percentage DECIMAL(5,2),
    portion_size DECIMAL(10,2),
    unit_of_measure VARCHAR(50),
    preparation_time INTEGER, -- in minutes
    calories INTEGER,
    allergens VARCHAR(100)[],
    dietary_info VARCHAR(100)[], -- 'halal', 'vegetarian', 'vegan', 'gluten_free'
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    popularity_score INTEGER DEFAULT 0,
    availability_status VARCHAR(50) DEFAULT 'available', -- 'available', 'out_of_stock', 'seasonal'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Recipes
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_code VARCHAR(50) UNIQUE,
    menu_item_id UUID REFERENCES menu_items(id),
    name VARCHAR(255) NOT NULL,
    instructions TEXT,
    preparation_steps JSONB DEFAULT '[]',
    cooking_method VARCHAR(100),
    yield_quantity DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    chef_notes TEXT,
    difficulty_level VARCHAR(50), -- 'easy', 'medium', 'hard'
    is_locked BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1,
    created_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Recipe Ingredients
CREATE TABLE recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES inventory_items(id),
    quantity DECIMAL(10,3) NOT NULL,
    unit VARCHAR(50),
    cost_per_unit DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    is_optional BOOLEAN DEFAULT false,
    preparation_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Sales Orders
CREATE TABLE sales_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    order_type VARCHAR(50), -- 'dine_in', 'takeaway', 'delivery', 'catering'
    table_number VARCHAR(20),
    waiter_id UUID REFERENCES auth.users(id),
    kitchen_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'preparing', 'ready', 'served'
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    service_charge DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    delivery_charges DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'partial', 'refunded'
    order_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'preparing', 'completed', 'cancelled'
    delivery_address TEXT,
    delivery_time TIMESTAMP WITH TIME ZONE,
    special_instructions TEXT,
    loyalty_points_earned INTEGER DEFAULT 0,
    loyalty_points_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Sales Order Items
CREATE TABLE sales_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sales_order_id UUID REFERENCES sales_orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id),
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2),
    margin_amount DECIMAL(10,2),
    special_instructions TEXT,
    modification_details JSONB DEFAULT '{}',
    kitchen_notes TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'preparing', 'ready', 'served'
    prepared_by UUID REFERENCES auth.users(id),
    served_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kitchen Orders (for order management)
CREATE TABLE kitchen_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sales_order_id UUID REFERENCES sales_orders(id),
    order_items JSONB NOT NULL,
    priority_level INTEGER DEFAULT 5, -- 1=highest, 10=lowest
    estimated_time INTEGER, -- in minutes
    actual_time INTEGER,
    chef_assigned UUID REFERENCES auth.users(id),
    status VARCHAR(50) DEFAULT 'pending',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 6. ENHANCED ACADEMIC MODULE (TAHFEEZ)
-- =============================================

-- Academic Terms/Periods
CREATE TABLE academic_terms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    term_name VARCHAR(100) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Academic Classes
CREATE TABLE academic_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_code VARCHAR(20) UNIQUE,
    class_name VARCHAR(100) NOT NULL,
    description TEXT,
    class_level INTEGER,
    monthly_fee DECIMAL(10,2) NOT NULL,
    admission_fee DECIMAL(10,2) DEFAULT 0,
    security_deposit DECIMAL(10,2) DEFAULT 0,
    max_students INTEGER DEFAULT 30,
    current_enrollment INTEGER DEFAULT 0,
    teacher_id UUID REFERENCES auth.users(id),
    assistant_teacher_id UUID REFERENCES auth.users(id),
    classroom VARCHAR(100),
    schedule JSONB DEFAULT '{}', -- Weekly schedule
    syllabus JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Students
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(10),
    blood_group VARCHAR(10),
    nationality VARCHAR(100),
    religion VARCHAR(100),
    guardian_name VARCHAR(255) NOT NULL,
    guardian_relationship VARCHAR(50),
    guardian_phone VARCHAR(50) NOT NULL,
    guardian_email VARCHAR(255),
    guardian_cnic VARCHAR(20),
    address TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    medical_conditions TEXT,
    enrollment_date DATE NOT NULL,
    admission_fee_paid DECIMAL(10,2) DEFAULT 0,
    security_deposit_paid DECIMAL(10,2) DEFAULT 0,
    current_class_id UUID REFERENCES academic_classes(id),
    previous_education TEXT,
    transport_required BOOLEAN DEFAULT false,
    lunch_required BOOLEAN DEFAULT false,
    student_status VARCHAR(50) DEFAULT 'active', -- 'active', 'graduated', 'dropped', 'suspended', 'transferred'
    student_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Class History
CREATE TABLE student_class_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    class_id UUID REFERENCES academic_classes(id),
    academic_term_id UUID REFERENCES academic_terms(id),
    enrollment_date DATE NOT NULL,
    completion_date DATE,
    final_grade VARCHAR(10),
    performance_rating DECIMAL(3,2), -- 0.00 to 5.00
    teacher_remarks TEXT,
    promoted_to_class_id UUID REFERENCES academic_classes(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Examinations
CREATE TABLE examinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_code VARCHAR(20) UNIQUE,
    exam_name VARCHAR(255) NOT NULL,
    exam_type VARCHAR(50), -- 'monthly', 'quarterly', 'mid_term', 'final', 'annual'
    academic_term_id UUID REFERENCES academic_terms(id),
    class_id UUID REFERENCES academic_classes(id),
    exam_date DATE NOT NULL,
    total_marks INTEGER NOT NULL,
    passing_marks INTEGER NOT NULL,
    duration_minutes INTEGER,
    examiner_id UUID REFERENCES auth.users(id),
    syllabus_covered JSONB DEFAULT '{}',
    instructions TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Marks/Results
CREATE TABLE student_marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    examination_id UUID REFERENCES examinations(id),
    obtained_marks INTEGER NOT NULL,
    total_marks INTEGER NOT NULL,
    percentage DECIMAL(5,2),
    grade VARCHAR(10),
    remarks TEXT,
    teacher_comments TEXT,
    improvement_areas TEXT,
    recorded_by UUID REFERENCES auth.users(id),
    verified_by UUID REFERENCES auth.users(id),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Progress Tracking
CREATE TABLE student_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    class_id UUID REFERENCES academic_classes(id),
    academic_term_id UUID REFERENCES academic_terms(id),
    progress_date DATE NOT NULL,
    chapters_completed INTEGER DEFAULT 0,
    total_chapters INTEGER,
    verses_memorized INTEGER DEFAULT 0,
    revision_verses INTEGER DEFAULT 0,
    sabaq_progress VARCHAR(255), -- Current lesson
    sabqi_progress VARCHAR(255), -- Previous lessons
    manzil_progress VARCHAR(255), -- Review sections
    performance_score DECIMAL(5,2),
    attendance_percentage DECIMAL(5,2),
    behavior_rating DECIMAL(3,2), -- 1.0 to 5.0
    teacher_notes TEXT,
    parent_feedback TEXT,
    recorded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Attendance
CREATE TABLE student_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    class_id UUID REFERENCES academic_classes(id),
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'present', 'absent', 'late', 'excused'
    check_in_time TIME,
    check_out_time TIME,
    marked_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, attendance_date)
);

-- Enhanced Student Fees
CREATE TABLE student_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    fee_type VARCHAR(50) NOT NULL, -- 'monthly', 'admission', 'exam', 'transport', 'lunch', 'books'
    fee_month DATE, -- For monthly fees
    academic_term_id UUID REFERENCES academic_terms(id),
    class_id UUID REFERENCES academic_classes(id),
    fee_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    discount_reason VARCHAR(255),
    fine_amount DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'partial', 'overdue', 'waived'
    payment_date DATE,
    payment_amount DECIMAL(10,2) DEFAULT 0,
    payment_method VARCHAR(50),
    receipt_number VARCHAR(50),
    collected_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 7. ENHANCED EVENT MANAGEMENT (SHADI LAWN)
-- =============================================

-- Event Packages
CREATE TABLE event_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_code VARCHAR(20) UNIQUE,
    package_name VARCHAR(255) NOT NULL,
    description TEXT,
    package_type VARCHAR(50), -- 'wedding', 'conference', 'birthday', 'corporate'
    base_price DECIMAL(15,2) NOT NULL,
    guest_capacity INTEGER NOT NULL,
    duration_hours INTEGER DEFAULT 6,
    includes JSONB DEFAULT '{}', -- What's included in the package
    excludes JSONB DEFAULT '{}', -- What's not included
    seasonal_pricing JSONB DEFAULT '{}', -- Different pricing for peak seasons
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Halls/Venues
CREATE TABLE event_venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_code VARCHAR(20) UNIQUE,
    venue_name VARCHAR(255) NOT NULL,
    venue_type VARCHAR(50), -- 'indoor_hall', 'outdoor_lawn', 'conference_room'
    capacity INTEGER NOT NULL,
    area_sqft INTEGER,
    location VARCHAR(255),
    facilities JSONB DEFAULT '{}', -- Air conditioning, sound system, etc.
    hourly_rate DECIMAL(10,2),
    daily_rate DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Event Bookings
CREATE TABLE event_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    package_id UUID REFERENCES event_packages(id),
    venue_id UUID REFERENCES event_venues(id),
    event_date DATE NOT NULL,
    event_start_time TIME NOT NULL,
    event_end_time TIME NOT NULL,
    event_type VARCHAR(100),
    event_title VARCHAR(255),
    guest_count INTEGER NOT NULL,
    special_requirements TEXT,
    catering_required BOOLEAN DEFAULT false,
    decoration_required BOOLEAN DEFAULT false,
    photography_required BOOLEAN DEFAULT false,
    sound_system_required BOOLEAN DEFAULT false,
    package_amount DECIMAL(15,2) NOT NULL,
    additional_services_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    advance_payment DECIMAL(15,2) DEFAULT 0,
    remaining_balance DECIMAL(15,2) DEFAULT 0,
    security_deposit DECIMAL(15,2) DEFAULT 0,
    payment_status VARCHAR(50) DEFAULT 'pending',
    booking_status VARCHAR(50) DEFAULT 'confirmed', -- 'confirmed', 'completed', 'cancelled', 'postponed'
    contact_person VARCHAR(255),
    contact_phone VARCHAR(50),
    event_coordinator_id UUID REFERENCES auth.users(id),
    setup_instructions TEXT,
    cleanup_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Additional Services
CREATE TABLE event_additional_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES event_bookings(id),
    service_name VARCHAR(255) NOT NULL,
    service_type VARCHAR(50), -- 'catering', 'decoration', 'photography', 'sound', 'other'
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Equipment
CREATE TABLE event_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_code VARCHAR(20) UNIQUE,
    equipment_name VARCHAR(255) NOT NULL,
    equipment_type VARCHAR(50), -- 'sound_system', 'lighting', 'furniture', 'decoration'
    rental_rate_per_day DECIMAL(10,2),
    rental_rate_per_hour DECIMAL(10,2),
    purchase_cost DECIMAL(15,2),
    current_condition VARCHAR(50), -- 'excellent', 'good', 'fair', 'poor'
    maintenance_schedule JSONB DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    location VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 8. GYM MANAGEMENT MODULE
-- =============================================

-- Gym Equipment
CREATE TABLE gym_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_code VARCHAR(20) UNIQUE,
    equipment_name VARCHAR(255) NOT NULL,
    equipment_type VARCHAR(50), -- 'cardio', 'strength', 'free_weights', 'functional'
    brand VARCHAR(100),
    model VARCHAR(100),
    purchase_date DATE,
    purchase_cost DECIMAL(15,2),
    warranty_expiry DATE,
    maintenance_schedule VARCHAR(100), -- 'daily', 'weekly', 'monthly'
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    current_condition VARCHAR(50), -- 'excellent', 'good', 'fair', 'out_of_order'
    location VARCHAR(100),
    usage_instructions TEXT,
    safety_notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gym Membership Plans
CREATE TABLE gym_membership_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_code VARCHAR(20) UNIQUE,
    plan_name VARCHAR(255) NOT NULL,
    duration_months INTEGER NOT NULL,
    monthly_fee DECIMAL(10,2) NOT NULL,
    registration_fee DECIMAL(10,2) DEFAULT 0,
    features JSONB DEFAULT '{}', -- Gym access, classes, personal training, etc.
    restrictions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Gym Memberships
CREATE TABLE gym_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    membership_plan_id UUID REFERENCES gym_membership_plans(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    membership_fee DECIMAL(10,2) NOT NULL,
    registration_fee_paid DECIMAL(10,2) DEFAULT 0,
    security_deposit DECIMAL(10,2) DEFAULT 0,
    membership_status VARCHAR(50) DEFAULT 'active', -- 'active', 'expired', 'suspended', 'cancelled'
    trainer_assigned_id UUID REFERENCES auth.users(id),
    fitness_goals TEXT,
    medical_conditions TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gym Member Check-ins
CREATE TABLE gym_member_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    membership_id UUID REFERENCES gym_memberships(id),
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    check_out_time TIMESTAMP WITH TIME ZONE,
    activity_type VARCHAR(100), -- 'general_workout', 'group_class', 'personal_training'
    trainer_id UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gym Classes Schedule
CREATE TABLE gym_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_name VARCHAR(255) NOT NULL,
    class_type VARCHAR(100), -- 'yoga', 'aerobics', 'strength_training', 'cardio'
    instructor_id UUID REFERENCES auth.users(id),
    class_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_participants INTEGER DEFAULT 20,
    current_registrations INTEGER DEFAULT 0,
    fees_per_session DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    equipment_required VARCHAR(255)[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 9. PAYROLL & HR MANAGEMENT
-- =============================================

-- Employee Contracts
CREATE TABLE employee_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES user_profiles(id),
    contract_number VARCHAR(50) UNIQUE,
    contract_type VARCHAR(50), -- 'permanent', 'contract', 'part_time', 'internship'
    start_date DATE NOT NULL,
    end_date DATE,
    basic_salary DECIMAL(15,2) NOT NULL,
    allowances JSONB DEFAULT '{}', -- Housing, transport, medical, etc.
    deductions JSONB DEFAULT '{}', -- Tax, insurance, provident fund
    benefits JSONB DEFAULT '{}', -- Vacation days, sick leave, etc.
    work_hours_per_week INTEGER DEFAULT 40,
    probation_period_months INTEGER DEFAULT 3,
    notice_period_days INTEGER DEFAULT 30,
    reporting_manager_id UUID REFERENCES auth.users(id),
    contract_status VARCHAR(50) DEFAULT 'active', -- 'active', 'expired', 'terminated'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee Attendance
CREATE TABLE employee_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES user_profiles(id),
    attendance_date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    break_time_minutes INTEGER DEFAULT 0,
    total_hours DECIMAL(4,2),
    overtime_hours DECIMAL(4,2) DEFAULT 0,
    status VARCHAR(20) NOT NULL, -- 'present', 'absent', 'half_day', 'leave', 'holiday'
    location VARCHAR(100),
    marked_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(employee_id, attendance_date)
);

-- Payroll Calculations
CREATE TABLE payroll_calculations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payroll_number VARCHAR(50) UNIQUE,
    employee_id UUID REFERENCES user_profiles(id),
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    basic_salary DECIMAL(15,2) NOT NULL,
    allowances_total DECIMAL(15,2) DEFAULT 0,
    overtime_amount DECIMAL(15,2) DEFAULT 0,
    bonus_amount DECIMAL(15,2) DEFAULT 0,
    gross_salary DECIMAL(15,2) NOT NULL,
    tax_deduction DECIMAL(15,2) DEFAULT 0,
    other_deductions DECIMAL(15,2) DEFAULT 0,
    total_deductions DECIMAL(15,2) DEFAULT 0,
    net_salary DECIMAL(15,2) NOT NULL,
    working_days INTEGER,
    present_days INTEGER,
    leave_days INTEGER,
    calculation_details JSONB DEFAULT '{}',
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processed', 'paid'
    payment_date DATE,
    processed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 10. RELIGIOUS ORGANIZATION MODULES
-- =============================================

-- Donations Management
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donation_number VARCHAR(50) UNIQUE,
    donor_customer_id UUID REFERENCES customers(id),
    donor_name VARCHAR(255) NOT NULL,
    donor_phone VARCHAR(50),
    donor_email VARCHAR(255),
    donation_type VARCHAR(50), -- 'zakat', 'sadaqah', 'general', 'construction', 'education'
    donation_category VARCHAR(100), -- 'mosque', 'madrasa', 'orphanage', 'food_distribution'
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'PKR',
    donation_date DATE NOT NULL,
    payment_method VARCHAR(50), -- 'cash', 'bank_transfer', 'cheque', 'online'
    payment_reference VARCHAR(100),
    is_recurring BOOLEAN DEFAULT false,
    recurrence_frequency VARCHAR(50), -- 'monthly', 'quarterly', 'yearly'
    next_due_date DATE,
    purpose TEXT,
    acknowledgment_sent BOOLEAN DEFAULT false,
    receipt_number VARCHAR(50),
    tax_exemption_applicable BOOLEAN DEFAULT false,
    collected_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Qurbani Management
CREATE TABLE qurbani_management (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    qurbani_number VARCHAR(50) UNIQUE,
    customer_id UUID REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    animal_type VARCHAR(50) NOT NULL, -- 'goat', 'sheep', 'cow', 'buffalo', 'camel'
    animal_age VARCHAR(20),
    animal_weight DECIMAL(6,2),
    price_per_kg DECIMAL(10,2),
    total_amount DECIMAL(15,2) NOT NULL,
    advance_payment DECIMAL(15,2) DEFAULT 0,
    remaining_balance DECIMAL(15,2) DEFAULT 0,
    qurbani_date DATE NOT NULL,
    qurbani_location VARCHAR(255),
    special_instructions TEXT,
    meat_distribution JSONB DEFAULT '{}', -- How meat should be distributed
    status VARCHAR(50) DEFAULT 'booked', -- 'booked', 'slaughtered', 'distributed', 'completed'
    handled_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Islamic Calendar Events
CREATE TABLE islamic_calendar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(50), -- 'eid', 'ramadan', 'hajj', 'special_prayer', 'lecture'
    hijri_date VARCHAR(20),
    gregorian_date DATE,
    is_recurring BOOLEAN DEFAULT true,
    description TEXT,
    special_arrangements TEXT,
    is_holiday BOOLEAN DEFAULT false,
    organization_unit_id UUID REFERENCES organization_units(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 11. FINANCIAL REPORTING VIEWS
-- =============================================

-- Trial Balance View
CREATE VIEW trial_balance AS
SELECT 
    coa.code,
    coa.title,
    coa.account_type,
    coa.account_category,
    ou.name as organization_unit,
    SUM(gle.debit_amount) as total_debits,
    SUM(gle.credit_amount) as total_credits,
    CASE 
        WHEN coa.account_type IN ('asset', 'expense') 
        THEN coa.opening_balance_debit + SUM(gle.debit_amount) - SUM(gle.credit_amount)
        ELSE coa.opening_balance_credit + SUM(gle.credit_amount) - SUM(gle.debit_amount)
    END as current_balance
FROM chart_of_accounts coa
LEFT JOIN gl_entries gle ON coa.id = gle.account_id
LEFT JOIN organization_units ou ON coa.organization_unit_id = ou.id
WHERE coa.is_active = true
GROUP BY coa.id, coa.code, coa.title, coa.account_type, coa.account_category, 
         ou.name, coa.opening_balance_debit, coa.opening_balance_credit;

-- Income Statement View
CREATE VIEW income_statement AS
SELECT 
    coa.account_type,
    coa.account_category,
    ou.name as organization_unit,
    SUM(CASE 
        WHEN coa.account_type = 'revenue' THEN gle.credit_amount - gle.debit_amount
        WHEN coa.account_type = 'expense' THEN gle.debit_amount - gle.credit_amount
        ELSE 0 
    END) as amount,
    EXTRACT(YEAR FROM glt.transaction_date) as year,
    EXTRACT(MONTH FROM glt.transaction_date) as month
FROM chart_of_accounts coa
JOIN gl_entries gle ON coa.id = gle.account_id
JOIN gl_transactions glt ON gle.transaction_id = glt.id
LEFT JOIN organization_units ou ON coa.organization_unit_id = ou.id
WHERE coa.account_type IN ('revenue', 'expense') 
AND glt.is_posted = true
GROUP BY coa.account_type, coa.account_category, ou.name, 
         EXTRACT(YEAR FROM glt.transaction_date), 
         EXTRACT(MONTH FROM glt.transaction_date);

-- Balance Sheet View
CREATE VIEW balance_sheet AS
SELECT 
    coa.account_type,
    coa.account_category,
    ou.name as organization_unit,
    SUM(CASE 
        WHEN coa.account_type IN ('asset', 'expense') 
        THEN coa.opening_balance_debit + gle.debit_amount - gle.credit_amount
        ELSE coa.opening_balance_credit + gle.credit_amount - gle.debit_amount
    END) as balance,
    CURRENT_DATE as as_of_date
FROM chart_of_accounts coa
LEFT JOIN gl_entries gle ON coa.id = gle.account_id
LEFT JOIN gl_transactions glt ON gle.transaction_id = glt.id
LEFT JOIN organization_units ou ON coa.organization_unit_id = ou.id
WHERE coa.account_type IN ('asset', 'liability', 'equity')
AND (glt.is_posted = true OR glt.id IS NULL)
GROUP BY coa.account_type, coa.account_category, ou.name,
         coa.opening_balance_debit, coa.opening_balance_credit;

-- =============================================
-- 12. INSERT INITIAL DATA
-- =============================================

-- Insert Organization Units
INSERT INTO organization_units (code, name, type, cost_center_code) VALUES 
('MAIN', 'Jamia Binoria Aalamia', 'headquarters', 'CC-MAIN'),
('REST', 'Binoria Restaurant', 'restaurant', 'CC-REST'),
('TAHF', 'Tahfeez Madrasa', 'academic', 'CC-TAHF'),
('LAWN', 'Shadi Lawn', 'events', 'CC-LAWN'),
('GYM', 'Gym Time', 'fitness', 'CC-GYM');

-- Insert Financial Periods
INSERT INTO financial_periods (period_name, period_type, start_date, end_date, organization_unit_id) 
SELECT 
    'FY 2024-25',
    'yearly',
    '2024-04-01',
    '2025-03-31',
    id
FROM organization_units;

-- Insert Enhanced Chart of Accounts
INSERT INTO chart_of_accounts (code, title, account_type, account_category, is_system_account) VALUES 
-- Assets
('1001', 'Cash in Hand', 'asset', 'current_asset', true),
('1002', 'Bank Account - HBL', 'asset', 'current_asset', true),
('1003', 'Bank Account - UBL', 'asset', 'current_asset', true),
('1004', 'Bank Account - MCB', 'asset', 'current_asset', true),
('1101', 'Accounts Receivable', 'asset', 'current_asset', true),
('1102', 'Student Fee Receivable', 'asset', 'current_asset', true),
('1103', 'Event Booking Receivable', 'asset', 'current_asset', true),
('1201', 'Inventory - Raw Materials', 'asset', 'current_asset', true),
('1202', 'Inventory - Finished Goods', 'asset', 'current_asset', true),
('1203', 'Inventory - Books & Stationery', 'asset', 'current_asset', true),
('1301', 'Prepaid Expenses', 'asset', 'current_asset', true),
('1302', 'Security Deposits', 'asset', 'current_asset', true),
('1501', 'Kitchen Equipment', 'asset', 'fixed_asset', true),
('1502', 'Furniture & Fixtures', 'asset', 'fixed_asset', true),
('1503', 'Computer Equipment', 'asset', 'fixed_asset', true),
('1504', 'Gym Equipment', 'asset', 'fixed_asset', true),
('1505', 'Event Equipment', 'asset', 'fixed_asset', true),
('1506', 'Building & Improvements', 'asset', 'fixed_asset', true),
('1507', 'Vehicles', 'asset', 'fixed_asset', true),

-- Liabilities
('2001', 'Accounts Payable', 'liability', 'current_liability', true),
('2002', 'Accrued Salaries', 'liability', 'current_liability', true),
('2003', 'Accrued Utilities', 'liability', 'current_liability', true),
('2004', 'Student Security Deposits', 'liability', 'current_liability', true),
('2005', 'Event Advance Payments', 'liability', 'current_liability', true),
('2006', 'Taxes Payable', 'liability', 'current_liability', true),
('2101', 'Bank Loan - Long Term', 'liability', 'long_term_liability', true),
('2102', 'Equipment Financing', 'liability', 'long_term_liability', true),

-- Equity
('3001', 'Capital Account', 'equity', 'equity', true),
('3002', 'Retained Earnings', 'equity', 'equity', true),
('3003', 'Current Year Earnings', 'equity', 'equity', true),

-- Revenue
('4001', 'Restaurant Sales - Food', 'revenue', 'operating_revenue', true),
('4002', 'Restaurant Sales - Beverages', 'revenue', 'operating_revenue', true),
('4003', 'Academic Fees - Monthly', 'revenue', 'operating_revenue', true),
('4004', 'Academic Fees - Admission', 'revenue', 'operating_revenue', true),
('4005', 'Event Bookings Revenue', 'revenue', 'operating_revenue', true),
('4006', 'Gym Membership Revenue', 'revenue', 'operating_revenue', true),
('4007', 'Donations - Zakat', 'revenue', 'operating_revenue', true),
('4008', 'Donations - Sadaqah', 'revenue', 'operating_revenue', true),
('4009', 'Donations - General', 'revenue', 'operating_revenue', true),
('4010', 'Qurbani Revenue', 'revenue', 'operating_revenue', true),
('4011', 'Other Income', 'revenue', 'other_income', true),

-- Cost of Goods Sold
('5001', 'COGS - Food Items', 'expense', 'cogs', true),
('5002', 'COGS - Beverages', 'expense', 'cogs', true),
('5003', 'COGS - Event Catering', 'expense', 'cogs', true),

-- Operating Expenses
('6001', 'Salaries & Wages - Teaching Staff', 'expense', 'operating_expense', true),
('6002', 'Salaries & Wages - Administrative', 'expense', 'operating_expense', true),
('6003', 'Salaries & Wages - Restaurant', 'expense', 'operating_expense', true),
('6004', 'Salaries & Wages - Support Staff', 'expense', 'operating_expense', true),
('6005', 'Employee Benefits', 'expense', 'operating_expense', true),
('6006', 'Utilities - Electricity', 'expense', 'operating_expense', true),
('6007', 'Utilities - Gas', 'expense', 'operating_expense', true),
('6008', 'Utilities - Water', 'expense', 'operating_expense', true),
('6009', 'Utilities - Internet & Phone', 'expense', 'operating_expense', true),
('6010', 'Rent Expense', 'expense', 'operating_expense', true),
('6011', 'Marketing & Advertising', 'expense', 'operating_expense', true),
('6012', 'Maintenance & Repairs', 'expense', 'operating_expense', true),
('6013', 'Office Supplies', 'expense', 'operating_expense', true),
('6014', 'Academic Supplies', 'expense', 'operating_expense', true),
('6015', 'Cleaning Supplies', 'expense', 'operating_expense', true),
('6016', 'Security Services', 'expense', 'operating_expense', true),
('6017', 'Insurance', 'expense', 'operating_expense', true),
('6018', 'Professional Services', 'expense', 'operating_expense', true),
('6019', 'Bank Charges', 'expense', 'operating_expense', true),
('6020', 'Travel & Transportation', 'expense', 'operating_expense', true),
('6021', 'Depreciation Expense', 'expense', 'operating_expense', true);

-- Insert Sample Menu Categories
INSERT INTO menu_categories (name, category_code, description, sort_order) VALUES 
('Pakistani Cuisine', 'PAK', 'Traditional Pakistani dishes', 1),
('BBQ & Grills', 'BBQ', 'Grilled and barbecue items', 2),
('Chinese Cuisine', 'CHN', 'Chinese dishes', 3),
('Beverages', 'BEV', 'Hot and cold drinks', 4),
('Desserts', 'DES', 'Sweet treats and desserts', 5),
('Fast Food', 'FF', 'Quick service items', 6);

-- Insert Sample Academic Classes
INSERT INTO academic_classes (class_code, class_name, description, monthly_fee, class_level) VALUES 
('HQ-BEG', 'Hifz-e-Quran - Beginner', 'Beginning level Quran memorization', 5000.00, 1),
('HQ-INT', 'Hifz-e-Quran - Intermediate', 'Intermediate level Quran memorization', 6000.00, 2),
('HQ-ADV', 'Hifz-e-Quran - Advanced', 'Advanced level Quran memorization', 7000.00, 3),
('QR-BAS', 'Quran Reading - Basic', 'Basic Quran reading with Tajweed', 3000.00, 1),
('AR-BAS', 'Arabic Language - Basic', 'Basic Arabic language learning', 4000.00, 1),
('IS-STU', 'Islamic Studies', 'General Islamic studies program', 3500.00, 1);

-- Insert Sample Event Packages
INSERT INTO event_packages (package_code, package_name, package_type, base_price, guest_capacity, duration_hours) VALUES 
('WED-BAS', 'Basic Wedding Package', 'wedding', 150000.00, 300, 8),
('WED-PRM', 'Premium Wedding Package', 'wedding', 250000.00, 500, 10),
('WED-LUX', 'Luxury Wedding Package', 'wedding', 400000.00, 800, 12),
('CONF-SM', 'Small Conference Package', 'conference', 50000.00, 100, 6),
('CONF-LG', 'Large Conference Package', 'conference', 100000.00, 300, 8),
('BIRTH-KID', 'Kids Birthday Package', 'birthday', 25000.00, 50, 4);

-- Insert Sample Gym Membership Plans
INSERT INTO gym_membership_plans (plan_code, plan_name, duration_months, monthly_fee, registration_fee) VALUES 
('GYM-1M', 'Monthly Membership', 1, 3000.00, 2000.00),
('GYM-3M', 'Quarterly Membership', 3, 2500.00, 1500.00),
('GYM-6M', 'Half-Yearly Membership', 6, 2200.00, 1000.00),
('GYM-12M', 'Annual Membership', 12, 2000.00, 500.00),
('GYM-STU', 'Student Membership', 3, 1500.00, 500.00);

-- Daily Financial Summary (used by generate_daily_summary function)
CREATE TABLE daily_financial_summary (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	summary_date DATE NOT NULL,
	organization_unit_id UUID REFERENCES organization_units(id),
	total_revenue DECIMAL(15,2) DEFAULT 0,
	total_expenses DECIMAL(15,2) DEFAULT 0,
	gross_profit DECIMAL(15,2) DEFAULT 0,
	net_profit DECIMAL(15,2) DEFAULT 0,
	total_orders INTEGER DEFAULT 0,
	average_order_value DECIMAL(15,2) DEFAULT 0,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	UNIQUE(summary_date, organization_unit_id)
);

-- =============================================
-- 13. CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- Enhanced Chart of Accounts indexes
CREATE INDEX idx_coa_code ON chart_of_accounts(code);
CREATE INDEX idx_coa_type_category ON chart_of_accounts(account_type, account_category);
CREATE INDEX idx_coa_org_unit ON chart_of_accounts(organization_unit_id);
CREATE INDEX idx_coa_parent ON chart_of_accounts(parent_account_id);

-- Enhanced GL Transactions indexes
CREATE INDEX idx_gl_trans_date ON gl_transactions(transaction_date);
CREATE INDEX idx_gl_trans_number ON gl_transactions(transaction_number);
CREATE INDEX idx_gl_trans_org_unit ON gl_transactions(organization_unit_id);
CREATE INDEX idx_gl_trans_reference ON gl_transactions(reference_type, reference_id);
CREATE INDEX idx_gl_trans_period ON gl_transactions(financial_period_id);

-- Enhanced GL Entries indexes
CREATE INDEX idx_gl_entries_transaction ON gl_entries(transaction_id);
CREATE INDEX idx_gl_entries_account ON gl_entries(account_id);
CREATE INDEX idx_gl_entries_cost_center ON gl_entries(cost_center);

-- Enhanced Sales indexes
CREATE INDEX idx_sales_date ON sales_orders(order_date);
CREATE INDEX idx_sales_status ON sales_orders(order_status);
CREATE INDEX idx_sales_payment_status ON sales_orders(payment_status);
CREATE INDEX idx_sales_customer ON sales_orders(customer_id);
CREATE INDEX idx_sales_waiter ON sales_orders(waiter_id);

-- Enhanced Students indexes
CREATE INDEX idx_students_number ON students(student_number);
CREATE INDEX idx_students_class ON students(current_class_id);
CREATE INDEX idx_students_status ON students(student_status);
CREATE INDEX idx_students_guardian_phone ON students(guardian_phone);

-- Enhanced Inventory indexes
CREATE INDEX idx_inventory_code ON inventory_items(item_code);
CREATE INDEX idx_inventory_org_unit ON inventory_items(organization_unit_id);
CREATE INDEX idx_inventory_category ON inventory_items(category_id);
CREATE INDEX idx_stock_movements_item ON stock_movements(item_id);
CREATE INDEX idx_stock_movements_date ON stock_movements(movement_date);
CREATE INDEX idx_stock_movements_type ON stock_movements(movement_type);

-- Enhanced Customer indexes
CREATE INDEX idx_customers_code ON customers(customer_code);
CREATE INDEX idx_customers_type ON customers(customer_type);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);

-- Enhanced Employee indexes
CREATE INDEX idx_user_profiles_employee_code ON user_profiles(employee_code);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_employee_attendance_date ON employee_attendance(attendance_date);
CREATE INDEX idx_employee_attendance_emp ON employee_attendance(employee_id);

-- Enhanced Academic indexes
CREATE INDEX idx_student_attendance_date ON student_attendance(attendance_date);
CREATE INDEX idx_student_fees_due_date ON student_fees(due_date);
CREATE INDEX idx_student_fees_status ON student_fees(payment_status);
CREATE INDEX idx_examinations_date ON examinations(exam_date);
CREATE INDEX idx_student_marks_exam ON student_marks(examination_id);

-- Enhanced Event indexes
CREATE INDEX idx_event_bookings_date ON event_bookings(event_date);
CREATE INDEX idx_event_bookings_status ON event_bookings(booking_status);
CREATE INDEX idx_event_bookings_customer ON event_bookings(customer_id);

-- Enhanced Gym indexes
CREATE INDEX idx_gym_memberships_status ON gym_memberships(membership_status);
CREATE INDEX idx_gym_memberships_dates ON gym_memberships(start_date, end_date);
CREATE INDEX idx_gym_checkins_date ON gym_member_checkins(check_in_time);

-- Financial summary indexes
CREATE INDEX idx_daily_summary_date ON daily_financial_summary(summary_date);
CREATE INDEX idx_daily_summary_org_unit ON daily_financial_summary(organization_unit_id);

-- Donations indexes
CREATE INDEX idx_donations_date ON donations(donation_date);
CREATE INDEX idx_donations_type ON donations(donation_type);
CREATE INDEX idx_donations_donor ON donations(donor_customer_id);

-- =============================================
-- 14. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gl_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gl_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_financial_summary ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to read chart of accounts
CREATE POLICY "Authenticated users can view chart of accounts" ON chart_of_accounts
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to view transactions
CREATE POLICY "Authenticated users can view GL transactions" ON gl_transactions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to view GL entries
CREATE POLICY "Authenticated users can view GL entries" ON gl_entries
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to view customers based on their assigned units
CREATE POLICY "Users can view customers" ON customers
    FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================
-- 15. AUTOMATED FUNCTIONS & TRIGGERS
-- =============================================

-- Enhanced function to update account balances
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the account balance when GL entries are inserted/updated/deleted
    UPDATE chart_of_accounts 
    SET 
        current_balance = (
            SELECT COALESCE(SUM(
                CASE WHEN account_type IN ('asset', 'expense') 
                THEN debit_amount - credit_amount
                ELSE credit_amount - debit_amount
                END
            ), 0) + 
            CASE WHEN account_type IN ('asset', 'expense')
            THEN opening_balance_debit - opening_balance_credit
            ELSE opening_balance_credit - opening_balance_debit
            END
            FROM gl_entries 
            WHERE account_id = COALESCE(NEW.account_id, OLD.account_id)
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.account_id, OLD.account_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Enhanced trigger to automatically update account balances
DROP TRIGGER IF EXISTS trigger_update_account_balance ON gl_entries;
CREATE TRIGGER trigger_update_account_balance
    AFTER INSERT OR UPDATE OR DELETE ON gl_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_account_balance();

-- Function to update inventory levels on stock movements
CREATE OR REPLACE FUNCTION update_inventory_levels()
RETURNS TRIGGER AS $$
BEGIN
    -- Update inventory levels based on stock movements
    UPDATE inventory_items 
    SET 
        current_stock = current_stock + 
            CASE 
                WHEN NEW.movement_type IN ('purchase', 'adjustment_in', 'return_in') THEN NEW.quantity
                WHEN NEW.movement_type IN ('sale', 'adjustment_out', 'waste', 'transfer_out') THEN -NEW.quantity
                ELSE 0
            END,
        average_cost = 
            CASE 
                WHEN NEW.movement_type = 'purchase' AND NEW.unit_cost > 0 THEN
                    ((current_stock * average_cost) + (NEW.quantity * NEW.unit_cost)) / 
                    NULLIF(current_stock + NEW.quantity, 0)
                ELSE average_cost
            END,
        last_purchase_rate = 
            CASE 
                WHEN NEW.movement_type = 'purchase' AND NEW.unit_cost > 0 THEN NEW.unit_cost
                ELSE last_purchase_rate
            END,
        updated_at = NOW()
    WHERE id = NEW.item_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update inventory levels
CREATE TRIGGER trigger_update_inventory_levels
    AFTER INSERT ON stock_movements
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_levels();

-- Function to generate sales GL entries
CREATE OR REPLACE FUNCTION create_sales_gl_entries()
RETURNS TRIGGER AS $$
DECLARE
    revenue_account_id UUID;
    cash_account_id UUID;
    transaction_id UUID;
BEGIN
    -- Only process when order is marked as paid
    IF NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'paid') THEN
        
        -- Get account IDs
        SELECT id INTO revenue_account_id FROM chart_of_accounts WHERE code = '4001' LIMIT 1;
        SELECT id INTO cash_account_id FROM chart_of_accounts WHERE code = '1001' LIMIT 1;
        
        -- Create GL Transaction
        INSERT INTO gl_transactions (
            transaction_number,
            transaction_date,
            description,
            reference_type,
            reference_id,
            organization_unit_id,
            total_amount,
            is_posted,
            created_by
        ) VALUES (
            'SA-' || NEW.order_number,
            NEW.order_date::DATE,
            'Restaurant Sale - Order #' || NEW.order_number,
            'sale',
            NEW.id,
            (SELECT id FROM organization_units WHERE code = 'REST' LIMIT 1),
            NEW.total_amount,
            true,
            NEW.waiter_id
        ) RETURNING id INTO transaction_id;
        
        -- Debit Cash Account
        INSERT INTO gl_entries (transaction_id, account_id, debit_amount, description)
        VALUES (transaction_id, cash_account_id, NEW.total_amount, 'Cash received from sale');
        
        -- Credit Revenue Account
        INSERT INTO gl_entries (transaction_id, account_id, credit_amount, description)
        VALUES (transaction_id, revenue_account_id, NEW.total_amount, 'Restaurant sales revenue');
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create GL entries for sales
CREATE TRIGGER trigger_create_sales_gl_entries
    AFTER INSERT OR UPDATE ON sales_orders
    FOR EACH ROW
    EXECUTE FUNCTION create_sales_gl_entries();

-- Function to generate daily financial summary
CREATE OR REPLACE FUNCTION generate_daily_summary(summary_date DATE, org_unit_id UUID)
RETURNS VOID AS $$
DECLARE
    revenue_total DECIMAL(15,2);
    expense_total DECIMAL(15,2);
    order_count INTEGER;
BEGIN
    -- Calculate revenue for the day
    SELECT COALESCE(SUM(total_amount), 0), COUNT(*) 
    INTO revenue_total, order_count
    FROM sales_orders 
    WHERE DATE(order_date) = summary_date 
    AND payment_status = 'paid';
    
    -- Calculate expenses for the day (simplified)
    SELECT COALESCE(SUM(gle.debit_amount), 0) 
    INTO expense_total
    FROM gl_entries gle
    JOIN gl_transactions glt ON gle.transaction_id = glt.id
    JOIN chart_of_accounts coa ON gle.account_id = coa.id
    WHERE DATE(glt.transaction_date) = summary_date 
    AND coa.account_type = 'expense'
    AND glt.organization_unit_id = org_unit_id;
    
    -- Insert or update daily summary
    INSERT INTO daily_financial_summary (
        summary_date, 
        organization_unit_id, 
        total_revenue,
        total_expenses,
        gross_profit,
        net_profit,
        total_orders,
        average_order_value
    ) VALUES (
        summary_date,
        org_unit_id,
        revenue_total,
        expense_total,
        revenue_total - expense_total,
        revenue_total - expense_total,
        order_count,
        CASE WHEN order_count > 0 THEN revenue_total / order_count ELSE 0 END
    ) ON CONFLICT (summary_date, organization_unit_id) 
    DO UPDATE SET 
        total_revenue = EXCLUDED.total_revenue,
        total_expenses = EXCLUDED.total_expenses,
        gross_profit = EXCLUDED.gross_profit,
        net_profit = EXCLUDED.net_profit,
        total_orders = EXCLUDED.total_orders,
        average_order_value = EXCLUDED.average_order_value,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to check low stock and create alerts
CREATE OR REPLACE FUNCTION check_low_stock_alerts()
RETURNS VOID AS $$
BEGIN
    -- Create alerts for items below minimum stock
    INSERT INTO system_alerts (
        alert_type,
        title,
        message,
        severity,
        organization_unit_id,
        reference_table,
        reference_id
    )
    SELECT 
        'low_stock',
        'Low Stock Alert: ' || name,
        'Item "' || name || '" (Code: ' || item_code || ') is below minimum stock level. Current: ' || 
        current_stock || ', Minimum: ' || minimum_stock,
        CASE 
            WHEN current_stock <= 0 THEN 'critical'
            WHEN current_stock < (minimum_stock * 0.5) THEN 'high'
            ELSE 'medium'
        END,
        organization_unit_id,
        'inventory_items',
        id
    FROM inventory_items
    WHERE current_stock <= minimum_stock 
    AND is_active = true
    AND NOT EXISTS (
        SELECT 1 FROM system_alerts 
        WHERE reference_table = 'inventory_items' 
        AND reference_id = inventory_items.id 
        AND alert_type = 'low_stock'
        AND is_read = false
        AND created_at > NOW() - INTERVAL '24 hours'
    );
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run low stock check (you'll need to set this up in your application)
-- SELECT cron.schedule('check-low-stock', '0 9 * * *', 'SELECT check_low_stock_alerts();');