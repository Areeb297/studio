# TASKS & BUGS - Inventory & Procurement Module
**Phase 1 Implementation Tracking**

---

## 📋 Format Guidelines

**Task Entry Format:**
```markdown
### [PRIORITY] Task Title (1-5 words)
**Desc**: Brief description (1-2 sentences, 20-30 words max)
**Status**: Not Started | In Progress | Completed | Blocked
**Assigned**: Developer name
**Week**: Week number (1-12)
**Related**: Links to BRD/TDD sections or related tasks
```

**Bug Entry Format:**
```markdown
### [SEVERITY] Bug Title (1-5 words)
**Desc**: Brief description (1-2 sentences, 20-30 words max)
**Status**: Open | In Progress | Fixed | Verified
**Reported**: Date + Reporter name
**Assigned**: Developer name
**Related**: Task ID or feature affected
```

**Priority Levels**: `[P0]` Critical | `[P1]` High | `[P2]` Medium | `[P3]` Low
**Severity Levels**: `[S0]` Critical | `[S1]` High | `[S2]` Medium | `[S3]` Low

---

## ✅ COMPLETED TASKS

### [P1] Update CLAUDE.md Guidelines
**Desc**: Add inventory-specific guidelines, user email domain rules, incremental table approach, TASKS_AND_BUGS format.
**Status**: Completed
**Assigned**: Claude
**Week**: 1
**Completed**: 2025-10-25

### [P0] Create USER_ROLES.md Documentation
**Desc**: Document all 9 user roles with permissions matrix, access levels, and navigation restrictions.
**Status**: Completed
**Assigned**: Claude
**Week**: 1
**Completed**: 2025-10-25
**Related**: docs/modules/operations/inventory/USER_ROLES.md

### [P0] Create SQL Script for 9 Inventory Users
**Desc**: Generate SQL script to create user_profiles for 8 new inventory users with permissions and role assignments.
**Status**: Completed
**Assigned**: Claude
**Week**: 1
**Completed**: 2025-10-25
**Related**: database/seed-inventory-users.sql

### [P0] Document Navigation Access Control
**Desc**: Add comprehensive navigation access matrix and implementation guidelines to USER_ROLES.md for sidebar filtering.
**Status**: Completed
**Assigned**: Claude
**Week**: 1
**Completed**: 2025-10-25
**Related**: USER_ROLES.md Section: Navigation Access Control

### [P0] Create 8 Inventory Users in Supabase Auth
**Desc**: Create auth.users records for storekeeper, depthead, purchasing, approvers L1-L3, finance, auditor in Supabase.
**Status**: Completed
**Assigned**: Claude
**Week**: 1
**Completed**: 2025-10-25
**Related**: auth.users table, Password: Rahah24@2025

### [P1] Create User Profiles Seed Data
**Desc**: Insert user_profiles records for all 9 users with correct roles, permissions, and employee codes.
**Status**: Completed
**Assigned**: Claude
**Week**: 1
**Completed**: 2025-10-25
**Related**: public.user_profiles table

---

## 🚧 IN PROGRESS TASKS

_No tasks in progress_

---

## 📝 PENDING TASKS - WEEK 1 (Foundation Setup)

### [P0] Implement Role-Based Navigation Filtering
**Desc**: Update dashboard layout to filter sidebar sections based on user role (inventory users see ONLY inventory/procurement).
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 1
**Related**: src/app/dashboard/layout.tsx, USER_ROLES.md Section: Navigation Access Control

### [P1] Define Role-Based Access Control (RBAC) Policies
**Desc**: Create Supabase RLS policies for inventory tables based on 9 user roles.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 1
**Related**: ARCHITECTURE.md Section: Row-Level Security

---

## 📝 PENDING TASKS - WEEK 2 (Core Database Tables)

### [P0] Create Inventory Items Table
**Desc**: Table for item master data with fields: code, name, category, UoM, cost, reorder levels, batch tracking.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 2
**Related**: BRD Section 4.1: Item Master Module

### [P0] Create Inventory Locations Table
**Desc**: Table for stores/warehouses with fields: code, name, type, address, manager, is_active.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 2
**Related**: BRD Section 4.2: Location Management

### [P0] Create Inventory Categories Table
**Desc**: Table for categories/subcategories with hierarchical structure and GL account mapping.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 2
**Related**: BRD Section 4.3: Category Management

### [P0] Create Units of Measure Table
**Desc**: Table for UoM definitions with conversion factors between units (kg↔gm, ltr↔ml, etc).
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 2
**Related**: BRD Section 4.4: UoM Management

### [P0] Create Stock Levels Table
**Desc**: Table for current stock by item+location with qty, reserved, available, last_update_date.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 2
**Related**: BRD Section 4.5: Stock Level Tracking

### [P1] Generate TypeScript Types for Week 2 Tables
**Desc**: Run Supabase CLI to generate database.types.ts for new inventory tables.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 2
**Related**: src/lib/supabase/database.types.ts

### [P2] Create Test Data Seed for Week 2
**Desc**: Insert sample data for items, locations, categories, UoMs, stock levels (awaiting vendor list from client).
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 2
**Related**: database/seed-inventory-week2.sql

---

## 📝 PENDING TASKS - WEEK 3 (Stock Management Forms)

### [P0] Build Item Master Form Component
**Desc**: React form for add/edit items with validation, category dropdown, UoM selection, batch tracking toggle.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 3
**Related**: src/components/inventory/ItemMasterForm.tsx

### [P0] Build Stock Adjustment Form Component
**Desc**: Form for stock adjustments with reason codes, batch selection, approval workflow, GL posting.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 3
**Related**: src/components/inventory/StockAdjustmentForm.tsx

### [P0] Create Stock Adjustments Table
**Desc**: Table for adjustment transactions with fields: item, location, qty, reason, batch, approver, GL_ref.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 3
**Related**: BRD Section 4.6: Stock Adjustments

### [P0] Create Adjustment Reasons Table
**Desc**: Table for predefined reasons (theft, damage, expiry, miscount, etc) with GL account mapping.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 3
**Related**: BRD Section 4.6: Adjustment Reasons

### [P0] Create Batch Tracking Table
**Desc**: Table for batch/lot tracking with fields: batch_no, item, location, qty, mfg_date, expiry_date.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 3
**Related**: BRD Section 4.7: Batch & Expiry Tracking

### [P1] Integrate Stock Level Updates
**Desc**: Connect forms to Supabase, implement real-time stock updates, trigger GL entries on adjustment posting.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 3
**Related**: src/lib/inventory/stock-management.ts

---

## 📝 PENDING TASKS - WEEK 4 (Stock Transfers & Counts)

### [P0] Build Stock Transfer Form Component
**Desc**: Form for inter-location transfers with from/to location, item selection, qty validation, approval workflow.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 4
**Related**: src/components/inventory/StockTransferForm.tsx

### [P0] Build Physical Count Form Component
**Desc**: Form for stock counting with batch selection, variance calculation, approval for large variances.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 4
**Related**: src/components/inventory/PhysicalCountForm.tsx

### [P0] Create Stock Transfers Table
**Desc**: Table for transfer transactions with fields: from/to location, item, qty, status, approver, transfer_date.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 4
**Related**: BRD Section 4.8: Stock Transfers

### [P0] Create Physical Counts Table
**Desc**: Table for count sessions with fields: count_date, location, counter, status, variance_value.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 4
**Related**: BRD Section 4.9: Physical Counts

### [P0] Create Count Variances Table
**Desc**: Table for count discrepancies with fields: item, system_qty, counted_qty, variance, reason, approved_by.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 4
**Related**: BRD Section 4.9: Variance Tracking

---

## 📝 PENDING TASKS - WEEK 5 (Purchase Requisitions)

### [P0] Build Purchase Requisition Form
**Desc**: Form for creating PRs with item selection, qty, required_date, justification, auto-routing to approvers.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 5
**Related**: src/app/dashboard/procurement/requisitions/page.tsx

### [P0] Build Requisition Approval Interface
**Desc**: Interface for L1/L2/L3 approvers to review, approve/reject PRs with comments and mobile support.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 5
**Related**: src/components/procurement/ApprovalInterface.tsx

### [P0] Create Purchase Requisitions Table
**Desc**: Table for PR headers with fields: pr_no, requestor, department, total_amount, status, required_date.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 5
**Related**: BRD Section 5.1: Purchase Requisitions

### [P0] Create Requisition Items Table
**Desc**: Table for PR line items with fields: pr_id, item, qty, estimated_price, justification.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 5
**Related**: BRD Section 5.1: PR Line Items

### [P0] Create Requisition Approvals Table
**Desc**: Table for approval workflow tracking with fields: pr_id, approver, level, status, comments, approved_date.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 5
**Related**: BRD Section 5.2: Approval Workflow

### [P0] Create Approval Workflow Config Table
**Desc**: Table for 3-level routing rules with fields: min_amount, max_amount, approver_role, notification_template.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 5
**Related**: BRD Section 5.2: Approval Rules

### [P1] Implement Auto-Routing Logic
**Desc**: Function to route PRs based on amount: <50K→L1, 50-200K→L2, >200K→L3. Send email notifications.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 5
**Related**: src/lib/procurement/approval-workflow.ts

---

## 📝 PENDING TASKS - WEEK 6 (Purchase Orders)

### [P0] Build Purchase Order Form
**Desc**: Form to convert approved PRs to POs with vendor selection, price entry, delivery date, terms.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 6
**Related**: src/app/dashboard/procurement/purchase-orders/page.tsx

### [P0] Build Price Variance Approval Interface
**Desc**: Interface to approve price changes: 5-10% variance→L2, >10%→L3 with justification required.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 6
**Related**: src/components/procurement/PriceVarianceApproval.tsx

### [P0] Create Purchase Orders Table
**Desc**: Table for PO headers with fields: po_no, vendor, pr_id, total_amount, status, delivery_date, payment_terms.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 6
**Related**: BRD Section 5.3: Purchase Orders

### [P0] Create Purchase Order Items Table
**Desc**: Table for PO line items with fields: po_id, item, qty, unit_price, discount, tax, total.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 6
**Related**: BRD Section 5.3: PO Line Items

### [P0] Create PO Price Variances Table
**Desc**: Table for price change tracking with fields: po_id, item, pr_price, po_price, variance%, approver, approved_date.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 6
**Related**: BRD Section 5.4: Price Variance Management

### [P1] Implement PR→PO Conversion Logic
**Desc**: Function to copy approved PR items to new PO, check for price variance, trigger approval if needed.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 6
**Related**: src/lib/procurement/pr-to-po-conversion.ts

---

## 📝 PENDING TASKS - WEEK 7 (Goods Receipt Notes & 3-Way Matching)

### [P0] Build GRN Entry Form
**Desc**: Form for receiving goods with PO reference, item selection, received qty vs ordered, batch/expiry entry.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 7
**Related**: src/app/dashboard/procurement/grn/page.tsx

### [P0] Build Quality Inspection Form
**Desc**: Form for quality checks with pass/fail, rejection reasons, photos, inspector signature.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 7
**Related**: src/components/procurement/QualityInspectionForm.tsx

### [P0] Build 3-Way Matching Interface
**Desc**: Dashboard to match PO-GRN-Invoice with discrepancy highlighting and approval workflow for mismatches.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 7
**Related**: src/components/procurement/ThreeWayMatching.tsx

### [P0] Create Goods Receipt Notes Table
**Desc**: Table for GRN headers with fields: grn_no, po_id, vendor, received_date, status, inspector, remarks.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 7
**Related**: BRD Section 5.5: Goods Receipt

### [P0] Create GRN Items Table
**Desc**: Table for GRN line items with fields: grn_id, po_item_id, item, ordered_qty, received_qty, batch, expiry.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 7
**Related**: BRD Section 5.5: GRN Line Items

### [P0] Create GRN Discrepancies Table
**Desc**: Table for qty/quality issues with fields: grn_id, item, discrepancy_type, notes, resolution, resolved_by.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 7
**Related**: BRD Section 5.6: Discrepancy Management

### [P0] Create Invoice Matching Table
**Desc**: Table for 3-way match with fields: po_id, grn_id, invoice_no, match_status, discrepancies, approved_by.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 7
**Related**: BRD Section 5.7: Invoice Matching

### [P1] Implement GRN Posting Logic
**Desc**: Function to update stock levels, post GL entries (Inventory DR, AP CR), trigger alerts on discrepancies.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 7
**Related**: src/lib/procurement/grn-posting.ts

---

## 📝 PENDING TASKS - WEEK 8-11 (Vendor, Reports, Alerts)

### [P1] Build Vendor Registration Form
**Desc**: Form for vendor master with 15+ fields, document uploads, approval workflow, evaluation criteria.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 8
**Related**: src/app/dashboard/procurement/vendors/page.tsx

### [P1] Build Vendor Performance Dashboard
**Desc**: Dashboard with charts for on-time delivery, price variance, quality rating, spend analysis.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 9
**Related**: src/app/dashboard/procurement/analytics/page.tsx

### [P1] Build 16 Inventory Reports
**Desc**: Create Stock Ledger, Low Stock, Expiry, Movement, Purchase Register, GRN Register, Vendor Performance reports.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 10
**Related**: BRD Section 6: Reporting Module

### [P1] Implement 10 Alert Types
**Desc**: Low stock, reorder, expiry (30/60 days), pending approvals, price variance, budget variance, count due alerts.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 11
**Related**: BRD Section 7: Alert System

---

## 📝 PENDING TASKS - WEEK 12 (Testing & Deployment)

### [P0] End-to-End Workflow Testing
**Desc**: Test complete PR→PO→GRN→Invoice flow with all approvals, GL postings, stock updates, alerts.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 12
**Related**: All modules

### [P0] User Acceptance Testing (UAT)
**Desc**: Client testing with real scenarios, feedback collection, bug fixes, training preparation.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 12
**Related**: All modules

### [P1] Create User Training Materials
**Desc**: Video tutorials, user guides, FAQ documents for all 9 user roles.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 12
**Related**: docs/training/

### [P1] Production Deployment
**Desc**: Deploy to production Supabase, configure backups, set up monitoring, enable RLS policies.
**Status**: Not Started
**Assigned**: Unassigned
**Week**: 12
**Related**: DEPLOYMENT_GUIDE.md

---

## 🐛 OPEN BUGS

_No bugs reported yet_

---

## 🐛 FIXED BUGS

_No bugs fixed yet_

---

## 📊 Progress Summary

**Week 1**: 6/8 tasks completed (75.0%)
  - ✅ Update CLAUDE.md Guidelines
  - ✅ Create USER_ROLES.md Documentation
  - ✅ Create SQL Script for 9 Inventory Users
  - ✅ Document Navigation Access Control
  - ✅ Create 8 Inventory Users in Supabase Auth
  - ✅ Create User Profiles Seed Data
  - ⏳ Implement Role-Based Navigation Filtering
  - ⏳ Define RBAC Policies

**Week 2**: 0/7 tasks completed (0%)
**Week 3**: 0/6 tasks completed (0%)
**Week 4**: 0/5 tasks completed (0%)
**Week 5**: 0/7 tasks completed (0%)
**Week 6**: 0/6 tasks completed (0%)
**Week 7**: 0/8 tasks completed (0%)
**Week 8-11**: 0/4 tasks completed (0%)
**Week 12**: 0/4 tasks completed (0%)

**Overall Progress**: 6/58 tasks (10.3%)

---

**Last Updated**: 2025-10-25
**Phase**: 1 - Inventory & Procurement
**Status**: Active Development
**Target Go-Live**: December 2025
