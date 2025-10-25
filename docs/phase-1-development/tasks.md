# Phase 1 Development Tasks

## Task 1: Remove Pricing Plans from Login Page

**Status**: Completed
**Priority**: Medium
**Module**: Authentication/Landing

### Description
Remove the pricing plans display from the login page. The current login page shows three pricing tiers (Starter $49/month, Professional $149/month, Enterprise $399/month) which should be removed.

### Requirements
- Remove all pricing plan cards from the login page
- Update the pricing mention to show contact information instead
- Add text: "For pricing, please contact us at sales@rahah24.com"

### Files to Modify
- ✅ `src/app/page.tsx` - Main landing page component

### Acceptance Criteria
- [x] Pricing cards are completely removed from login page
- [x] Contact email is displayed for pricing inquiries (sales@rahah24.com)
- [x] Page layout remains clean and professional
- [x] No broken UI or styling issues

### Implementation Details
- Removed pricingPlans array (lines 103-148)
- Replaced entire pricing section with custom contact card
- Added prominent email link to sales@rahah24.com
- Included benefit highlights: Custom Modules, Flexible Scaling, Transparent Costs
- Maintained professional design with gradient backgrounds and proper spacing
- Added CTA buttons for "Try Demo Version" and "Schedule Consultation"

---

## Task 2: Reorganize Sidebar Navigation to Include All Rahah24 Modules

**Status**: Completed
**Priority**: High
**Module**: Navigation/UI

### Description
Update the dashboard sidebar navigation to comprehensively reflect all Rahah24 ERP modules as defined in the business requirements and coverage analysis. The current sidebar is missing several key modules that are part of the Rahah24 offering.

### Requirements
Based on the RAHAH24-COVERAGE-ANALYSIS.md and ERP_SCOPE_AND_MODULES.md, the sidebar should include:

#### Missing Modules to Add:
1. **Point of Sale (POS) System** - Currently under Restaurant but needs standalone visibility
2. **Recipe Costing & Menu Pricing** - Currently missing
3. **Rental & Asset Income Management** - Currently listed as "Rent & Properties" needs enhancement
4. **Donation & Welfare System** - Partially present but needs proper organization

#### Sidebar Structure Updates:

**Executive Section** (Keep as is)
- Dashboard Overview
- KPI Analytics
- AI Insights

**Business Operations Section** (Expand)
- Restaurant & Catering
  - POS System (NEW - separate link)
  - Menu Management (NEW)
  - Recipe Costing (NEW)
  - Kitchen Orders
- Academic (Madrasa)
- Events (Shadi Lawn)
- Fitness (Gym Time)

**Financial Management Section** (Keep but reorganize)
- General Ledger
- Chart of Accounts
- Journal Entries
- Trial Balance
- Accounts Receivable
- Accounts Payable
- Bank Reconciliation
- Financial Reports
- Sales Management

**Academic Affairs Section** (Rename from "academic")
- Fee Collection Management
- Student Registration (NEW)
- Donor-Student Sponsorship (NEW)

**Human Resources Section** (Keep as is)
- HR Overview
- Employee Management
- Attendance & Leave
- Talent Management
- Payroll & Benefits
- Departments

**Inventory & Procurement Section** (Rename from "Operations")
- Inventory Management Dashboard
- Stock Level Controls
- Purchase Requisitions
- Purchase Orders
- Goods Receipt Notes (GRN)
- Vendor Management
- Vendor Approvals
- Procurement Analytics
- Department Requisitions (NEW)
- Expiry & Warranty Tracking (NEW)

**Facilities & Operations Section** (NEW)
- Facilities Management
- Utilities Management (Electric & Gas)
- Rental & Asset Income
- Maintenance Management (NEW)

**Islamic Services Section** (Keep but expand)
- Qurbani Management
- Donation Campaigns
- Zakat Management (NEW)
- Islamic Events Calendar
- Community Feedback

**System Section** (Keep as is)
- Settings & Configuration

### Files to Modify
- `src/app/dashboard/layout.tsx` (main navigation structure)

### Acceptance Criteria
- [x] All 8 core Rahah24 modules are visible in sidebar
- [x] Operations renamed to "Inventory & Procurement"
- [x] New "Facilities & Operations" section added
- [x] POS System has standalone visibility under Business Operations
- [x] Recipe Costing module added under Business Operations
- [x] Rental & Asset Income properly labeled
- [x] Academic Affairs section properly renamed and expanded
- [x] Navigation is organized logically by business function
- [x] All existing links continue to work
- [x] Section icons are appropriate for content
- [x] Expandable sections work properly

### Implementation Details
**File Modified**: `src/app/dashboard/layout.tsx`

**New Icons Added**:
- Receipt (POS System)
- UtensilsCrossed (Menu Management)
- Calculator (Recipe Costing)
- Truck (Maintenance)
- PackageCheck (GRN)
- AlertCircle (Expiry/Warranty)
- HandCoins (Zakat/Sponsorship)
- Calendar (Islamic Events)

**Sidebar Sections Restructured**:

1. **Executive** (unchanged)
   - Dashboard Overview
   - KPI Analytics
   - AI Insights

2. **Business Operations** (expanded)
   - Restaurant & Catering
   - POS System ✨ NEW
   - Menu Management ✨ NEW
   - Recipe Costing ✨ NEW
   - Academic (Madrasa)
   - Events (Shadi Lawn)
   - Fitness (Gym Time)

3. **Financial Management** (refined)
   - Removed duplicate Donations entry
   - Kept Sales Management

4. **Academic Affairs** ✨ RENAMED (was "academic")
   - Fee Collection
   - Student Registration ✨ NEW
   - Donor-Student Sponsorship ✨ NEW

5. **Human Resources** (unchanged)

6. **Inventory & Procurement** ✨ RENAMED (was "operations")
   - Inventory Dashboard
   - Stock Level Controls ✨ NEW
   - Purchase Requisitions
   - Purchase Orders
   - Goods Receipt Notes (GRN) ✨ NEW
   - Vendor Management
   - Vendor Approvals
   - Procurement Analytics
   - Department Requisitions ✨ NEW
   - Expiry & Warranty Tracking ✨ NEW

7. **Facilities & Operations** ✨ NEW SECTION
   - Facilities Management
   - Utilities Management
   - Rental & Asset Income (properly labeled)
   - Maintenance Management ✨ NEW

8. **Islamic Services** (expanded)
   - Qurbani Management
   - Donation Campaigns
   - Zakat Management ✨ NEW
   - Islamic Events Calendar
   - Community Feedback

**Label Display Logic Updated**:
- Added custom label mappings for underscore-separated section names
- Proper capitalization for "Human Resources", "Academic Affairs", "Inventory & Procurement", "Facilities & Operations"

---

## Task 3: Create All Missing UI Pages with Sample Data

**Status**: Completed
**Priority**: High
**Module**: UI/Frontend

### Description
Create all missing dashboard pages shown in the navigation sidebar to eliminate 404 errors. Each page must have a complete UI with sample/prototype data following the current design theme from globals.css. No blank pages allowed.

### Requirements
Based on the navigation structure, create functional UI pages for all modules with:
- Sample data that matches the business context
- Responsive design using Tailwind CSS
- shadcn/ui component library
- Charts using Recharts library
- Consistent design patterns across all pages
- No database integration (UI only with hardcoded sample data)

### Modules and Pages Created

#### Finance Module (7 pages)
1. **Chart of Accounts** (`/dashboard/finance/accounts`)
   - 38 sample accounts with hierarchical structure
   - Account type filtering (Asset, Liability, Equity, Revenue, Expense)
   - Account balance equation validation
   - Tree view with parent-child relationships
   - Add account dialog with account type and subtype selection

2. **Journal Entries** (`/dashboard/finance/journal-entries`)
   - 7 sample journal entries with double-entry bookkeeping
   - Debit/Credit validation (must balance)
   - Add line functionality for multi-line entries
   - Real-time balance calculation
   - Entry status tracking (Draft, Posted)

3. **Trial Balance** (`/dashboard/finance/trial-balance`)
   - Trial balance report grouped by account type
   - Debit/Credit columns with totals
   - Balance verification (Debits = Credits)
   - Export functionality
   - Period selection

4. **Accounts Receivable** (`/dashboard/finance/accounts-receivable`)
   - AR aging analysis (0-30, 31-60, 61-90, 90+ days)
   - Customer invoice tracking
   - Payment status (Paid, Pending, Overdue)
   - Days overdue calculation using date-fns
   - Current vs Overdue pie chart

5. **Accounts Payable** (`/dashboard/finance/accounts-payable`)
   - Vendor bill tracking
   - AP aging buckets
   - Payment scheduling
   - Vendor management
   - Due date alerts

6. **Bank Reconciliation** (`/dashboard/finance/bank-reconciliation`)
   - Bank statement vs GL comparison
   - 3-column reconciliation table
   - Matched/Unmatched status tracking
   - Reconciliation summary with adjustments
   - Variance calculation

7. **Financial Reports** (`/dashboard/finance/reports`)
   - Profit & Loss statement
   - Monthly revenue/expense/profit trends chart
   - Cash flow statement
   - **AI-Powered Financial Insights** section with Google Gemini integration
   - Comprehensive financial KPIs

#### Inventory Module (3 pages)
8. **Stock Level Controls** (`/dashboard/inventory/stock-levels`)
   - Min/Max/Reorder level configuration
   - Current stock status (In Stock, Low Stock, Out of Stock)
   - Reorder suggestions with estimated costs
   - Stock status distribution chart
   - Search and filter functionality
   - Item-level configuration dialog

9. **Department Requisitions** (`/dashboard/inventory/department-requisitions`)
   - Department requisition workflow
   - Status tracking (Draft, Pending Approval, Approved, Issued)
   - Priority levels (High, Medium, Low, Urgent)
   - Department-wise requisition management
   - Approval workflow

10. **Expiry & Warranty Tracking** (`/dashboard/inventory/expiry-warranty`)
    - Batch expiry tracking with FEFO enforcement
    - Equipment warranty monitoring
    - 30/60 day expiry alerts
    - Tabs for Batch Expiry vs Equipment Warranty
    - Days remaining calculation
    - Urgent action alerts

#### Procurement Module (1 page)
11. **Goods Receipt Notes (GRN)** (`/dashboard/procurement/grn`)
    - GRN processing workflow
    - PO matching functionality
    - Quality inspection status (Draft, Inspected, Posted)
    - Stock update on posting
    - Vendor tracking
    - Total value calculation

#### Restaurant Module (3 pages)
12. **Point of Sale (POS)** (`/dashboard/business/restaurant/pos`)
    - Complete POS interface with menu items
    - Shopping cart with quantity controls
    - Real-time total calculation (subtotal + 10% tax)
    - Add/Remove/Update cart items
    - Payment processing button
    - Category-based menu organization

13. **Menu Management** (`/dashboard/business/restaurant/menu`)
    - Menu item catalog (10 sample items)
    - Category organization (Main Course, Beverages, Bread, Desserts, Starters)
    - Pricing and cost management
    - Profit margin calculation (48-68%)
    - Preparation time tracking
    - Availability toggle
    - Search and filter by category
    - Add new item dialog

14. **Recipe Costing** (`/dashboard/business/restaurant/recipe-costing`)
    - Recipe builder with ingredient breakdown
    - Cost analysis (ingredient cost, selling price, margin %)
    - Cost percentage visualization
    - Ingredient-level costing with unit costs
    - Ideal vs Actual cost variance analysis
    - Recipe profitability tracking
    - AI insights for cost optimization

#### Academic Module (2 pages)
15. **Student Management** (`/dashboard/academic/students`)
    - Student directory with 5 sample students
    - Dars-e-Nizami class structure (Year 1-5)
    - Fee status tracking (Paid, Pending, Overdue)
    - Sponsorship status (Sponsored, Partial, Not Sponsored)
    - Student registration form
    - Detailed student profiles with contact info
    - Filter by class, status
    - Search functionality

16. **Student Sponsorship** (`/dashboard/academic/sponsorship`)
    - Donor-student matching system
    - Active sponsorships tracking (4 sample sponsorships)
    - Unsponsored students list (3 students needing sponsors)
    - Donor database management
    - Sponsorship types (Full, Partial)
    - Monthly commitment tracking
    - Payment status monitoring (Up to Date, Delayed)
    - Impact summary dashboard
    - AI-powered matching suggestion

#### Facilities Module (1 page)
17. **Maintenance Management** (`/dashboard/facilities/maintenance`)
    - Work order tracking system (5 sample work orders)
    - Categories (HVAC, Plumbing, Electrical, General, Carpentry, Painting)
    - Priority levels (Urgent, High, Medium, Low)
    - Status workflow (Open, Scheduled, In Progress, Completed, Cancelled)
    - Due date tracking with overdue alerts
    - Estimated vs Actual cost tracking
    - Technician assignment
    - Completion rate dashboard
    - Detailed vs List view tabs

#### Islamic Services Module (1 page)
18. **Zakat Management** (`/dashboard/donations/zakat`)
    - **Zakat Calculator** with Nisab threshold calculation
    - Gold/Silver Nisab rates display
    - Zakatable wealth calculation (cash, bank, gold, silver, investments, business assets, debts)
    - 2.5% Zakat calculation
    - Zakat donation tracking (4 sample donations)
    - Fund allocation by category (Student Support, Food Distribution, Medical Assistance, Emergency Relief)
    - Distribution tracking with beneficiary count
    - Payment method tracking (Cash, Bank Transfer, Online, Check)
    - Impact summary dashboard
    - Receipt generation

#### Settings Module (1 page)
19. **System Settings** (`/dashboard/settings`)
    - 4 main tabs: General, Financial, Notifications, Security
    - **General Settings**:
      - Organization details (name, code, address, phone, email, website)
      - Timezone and language selection
      - Hijri calendar toggle
      - Regional settings (currency, date format)
    - **Financial Settings**:
      - Fiscal year start configuration
      - Default tax rate
      - Payment terms and late fee settings
      - Multi-currency support
      - Auto-reconciliation toggle
      - Expense approval workflow
      - Inventory settings (reorder threshold, expiry alerts, FEFO)
    - **Notification Preferences**:
      - Communication channels (Email, SMS, In-App)
      - Alert types (Low Stock, Payment Reminders, Expiry Warnings, Maintenance, Fee Collection)
    - **Security Settings**:
      - Two-Factor Authentication
      - Session timeout configuration
      - Password policy selection
      - Role-Based Access Control (RBAC)
      - IP whitelist
      - Audit logging
      - Automatic backup configuration
      - Data encryption settings
      - User management (self-registration, email verification, default roles)

### Files Created
```
src/app/dashboard/finance/accounts/page.tsx
src/app/dashboard/finance/journal-entries/page.tsx
src/app/dashboard/finance/trial-balance/page.tsx
src/app/dashboard/finance/accounts-receivable/page.tsx
src/app/dashboard/finance/accounts-payable/page.tsx
src/app/dashboard/finance/bank-reconciliation/page.tsx
src/app/dashboard/finance/reports/page.tsx
src/app/dashboard/inventory/stock-levels/page.tsx
src/app/dashboard/inventory/department-requisitions/page.tsx
src/app/dashboard/inventory/expiry-warranty/page.tsx
src/app/dashboard/procurement/grn/page.tsx
src/app/dashboard/business/restaurant/pos/page.tsx
src/app/dashboard/business/restaurant/menu/page.tsx
src/app/dashboard/business/restaurant/recipe-costing/page.tsx
src/app/dashboard/academic/students/page.tsx
src/app/dashboard/academic/sponsorship/page.tsx
src/app/dashboard/facilities/maintenance/page.tsx
src/app/dashboard/donations/zakat/page.tsx
src/app/dashboard/settings/page.tsx
```

### Acceptance Criteria
- [x] All 20 missing pages created with complete UI
- [x] No 404 errors for any navigation links
- [x] All pages have realistic sample data
- [x] Consistent design theme matching globals.css (teal/green primary colors)
- [x] All pages use shadcn/ui components (Card, Table, Badge, Button, Dialog, Input, Select, Tabs, etc.)
- [x] Charts implemented using Recharts (PieChart, BarChart, LineChart, ComposedChart)
- [x] Responsive design with Tailwind CSS
- [x] Currency formatting using formatPKR utility (Intl.NumberFormat)
- [x] Date formatting using date-fns library
- [x] Status badges with appropriate color coding
- [x] Search and filter functionality where applicable
- [x] Add/Edit dialogs for data entry
- [x] KPI cards displaying key metrics
- [x] No database integration (sample data only)
- [x] Professional UI matching existing pages

### Technical Patterns Used
- **Component Structure**: KPI cards at top, charts in middle, data tables at bottom
- **Currency Formatting**: `formatPKR()` utility function using `Intl.NumberFormat('en-PK')`
- **Date Handling**: `date-fns` library for formatting and calculations
- **Status Management**: Badge components with variant-based color coding
- **Form Validation**: React Hook Form + Zod patterns (structure in place)
- **State Management**: React useState hooks for local component state
- **Data Visualization**: Recharts library for charts and graphs
- **Responsive Design**: Tailwind CSS grid and flex layouts
- **Dialog Management**: shadcn/ui Dialog component for modals
- **Tab Navigation**: shadcn/ui Tabs component for multi-view pages

### Key Features Implemented
1. **Financial Management**:
   - Complete double-entry accounting UI
   - Trial balance verification
   - AR/AP aging analysis
   - Bank reconciliation workflow
   - AI-powered financial insights

2. **Inventory Control**:
   - Min/Max/Reorder level automation
   - Stock status tracking
   - Department requisition workflow
   - Batch expiry and warranty monitoring
   - Automated reorder suggestions

3. **Restaurant Operations**:
   - Full POS system with cart management
   - Menu catalog with profitability analysis
   - Recipe costing with ingredient-level breakdown
   - Cost variance tracking

4. **Academic Management**:
   - Student registration with fee tracking
   - Sponsorship matching system
   - Donor management
   - Impact measurement dashboard

5. **Facilities**:
   - Work order lifecycle management
   - Multi-category maintenance tracking
   - Priority and status workflows
   - Cost tracking (estimated vs actual)

6. **Islamic Services**:
   - Zakat calculator with Nisab threshold
   - Fund allocation and distribution tracking
   - Beneficiary impact measurement

7. **System Configuration**:
   - Comprehensive settings across 4 categories
   - Security and access control
   - Notification preferences
   - Financial parameter configuration

### Design Consistency
- All pages follow the same visual hierarchy
- Consistent spacing using Tailwind CSS utilities
- Primary color scheme: Teal/Green (hsl(172 82% 40%))
- Typography: System font stack with proper heading hierarchy
- Icon library: Lucide React icons
- Component library: shadcn/ui with Radix UI primitives
- All pages are fully responsive (mobile, tablet, desktop)

---
