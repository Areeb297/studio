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
