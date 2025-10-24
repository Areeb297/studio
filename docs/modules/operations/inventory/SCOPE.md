# Inventory Management System - Complete Scope Definition
## Rahah24 ERP - Operations Module

**Document Version**: 1.0
**Date**: October 25, 2025
**Status**: Approved for Implementation
**Phase**: Phase 1 - Core Foundation

---

## 📋 Executive Summary

This document defines the complete scope for the **Inventory Management System**, the first module to be implemented in **Phase 1** of the Rahah24 ERP development. The scope encompasses **14 comprehensive sub-modules** as defined by the requirements gathered by the Pakistani team from Jamia Binoria Aalamia.

### **Scope Overview**
- **Total Sub-Modules**: 14
- **Database Tables**: 30+ tables
- **API Endpoints**: 80+ endpoints
- **User Roles**: 7 roles with granular permissions
- **Reports**: 16 different report types
- **Alerts**: 10 automated alert types
- **Workflows**: 6 major approval workflows
- **Timeline**: 12 weeks
- **Investment**: PKR 500,000
- **Expected ROI**: 600% in first year

---

## 🎯 Business Objectives

### **Primary Objectives**
1. **Accurate Stock Tracking**: Real-time inventory visibility across multiple locations with 99%+ accuracy
2. **Cost Control**: Reduce waste by 30% and save PKR 200,000/month through automated controls
3. **Process Efficiency**: Reduce purchase cycle time by 60% through workflow automation
4. **Compliance**: Ensure 100% audit trail and regulatory compliance
5. **Intelligence**: AI-powered insights for purchase anomalies and demand forecasting

### **Success Criteria**
- [ ] Inventory accuracy reaches 99%+ (up from current 85%)
- [ ] Stock-out incidents reduced by 75%
- [ ] Purchase approval time reduced to < 2 days (from 5 days)
- [ ] Vendor on-time delivery rate > 95%
- [ ] Emergency orders reduced by 70%
- [ ] User adoption rate > 95% within 30 days
- [ ] System uptime > 99.9%

---

## 📦 Module 1: Stock Level Controls

### **Scope**
Automated stock level management with intelligent reorder suggestions and excess stock handling.

### **Features IN SCOPE** ✅
1. **Min/Max/Reorder Level Configuration**
   - Per item configuration
   - Per store location configuration
   - Automatic calculation based on historical consumption
   - Seasonal adjustment factors

2. **Automated Reorder Suggestions**
   - Daily batch process to check stock levels
   - Generate reorder suggestions when stock <= reorder level
   - Suggested quantity based on max level minus current stock
   - Email/SMS notifications to purchasing team

3. **Excess Stock Handling**
   - Automatic detection when stock > max level
   - Require reason code for excess purchases
   - Route to L2/L3 approval for quantities above max
   - Excess stock aging report

4. **Multi-Location Stock Tracking**
   - Track stock across multiple stores/warehouses
   - Inter-location transfer management
   - Location-specific min/max/reorder levels
   - Consolidated and location-wise stock reports

### **Features OUT OF SCOPE** ❌
- Automatic purchase order creation (requires Module 2)
- Barcode/RFID scanning (future phase)
- Integration with external vendor systems (future phase)

### **Acceptance Criteria**
- [ ] System automatically generates reorder suggestions daily
- [ ] Purchasing team receives email notifications for low stock
- [ ] System blocks or requires approval for purchases exceeding max stock
- [ ] All stock movements logged with user, date, and reason
- [ ] Stock status visible in real-time across all locations

---

## 📋 Module 2: Purchase & Approval Workflow

### **Scope**
Complete purchase lifecycle management from requisition to invoice, with 3-level approval workflow.

### **Features IN SCOPE** ✅
1. **Purchase Requisition (PR)**
   - Department-wise PR creation
   - Item selection with quantity and justification
   - Budget checking against department budget
   - PR approval workflow (Department Head → Procurement)
   - PR status tracking (Draft, Pending, Approved, Rejected, Completed)

2. **Purchase Order (PO)**
   - Convert approved PR to PO
   - Vendor selection from approved vendors
   - Price negotiation and recording
   - PO terms and conditions
   - PO approval based on amount and price variance
   - Send PO to vendor via email/print

3. **3-Level Approval System**
   - **Level 1 (L1)**: Approve up to PKR 50,000
   - **Level 2 (L2)**: Approve PKR 50,001 to PKR 200,000, and price variance up to 5%
   - **Level 3 (L3)**: Approve above PKR 200,000, price variance > 5%, unlimited approval

4. **Price Variance Detection**
   - Compare PO price with last purchase price
   - Calculate variance percentage
   - If variance > threshold, route to higher approval level
   - Block or flag unusual price increases
   - Maintain price history for all items

5. **Goods Receipt Note (GRN)**
   - Receive goods against PO
   - Quality inspection at GRN
   - Partial receipt handling
   - GRN approval by store keeper
   - Automatic stock update on GRN approval

6. **Invoice Matching**
   - Three-way matching: PO + GRN + Invoice
   - Detect quantity and price discrepancies
   - Route discrepancies to finance for resolution
   - Approve invoices for payment
   - Integration with accounts payable

### **Features OUT OF SCOPE** ❌
- Vendor portal for PO acknowledgment (future phase)
- EDI integration (future phase)
- Automatic payment processing (handled by Finance module)

### **Acceptance Criteria**
- [ ] Complete PR → PO → GRN → Invoice flow functional
- [ ] Approval routing based on amount and price variance working correctly
- [ ] Email notifications sent at each stage
- [ ] Three-way invoice matching operational
- [ ] Complete audit trail of all approvals and actions

---

## 🏢 Module 3: Vendor & Purchasing Management

### **Scope**
Comprehensive vendor master data management with performance tracking and approval workflow.

### **Features IN SCOPE** ✅
1. **Vendor Master (15+ Fields)**
   - Vendor Code (unique identifier)
   - Company Name
   - Contact Person
   - Phone, Email, Address
   - Categories (array of product categories supplied)
   - Payment Terms (Cash, Bank Transfer, Credit)
   - Credit Days (Net 15, Net 30, Net 45, etc.)
   - Excess Charges (late payment penalty percentage)
   - Contract Terms (text)
   - Bank Details (IBAN, Account Title, Branch)
   - Vendor Rating (out of 5)
   - Status (Pending, Approved, Blocked)
   - Created/Updated timestamps

2. **Vendor Approval Workflow**
   - New vendor submission
   - Document upload (registration, tax certificates, bank details)
   - L2/L3 approval required for new vendors
   - Vendor verification checklist
   - Approved vendor list

3. **Payment Terms Management**
   - **Cash**: Pay at delivery
   - **Bank Transfer**: Pay within specified days
   - **Credit**: Net 15/30/45/60 days
   - Late payment charges automatic calculation
   - Payment due date tracking

4. **Vendor Performance Tracking**
   - On-time delivery percentage
   - Quality rating (based on GRN inspections)
   - Price competitiveness
   - Response time to RFQs
   - Overall vendor rating (1-5 stars)
   - Vendor performance reports
   - Vendor ranking and comparison

5. **Purchase Types**
   - **Open Market**: Ad-hoc purchases from new/unregistered vendors
   - **Cash Purchase**: Immediate payment at purchase
   - **Credit Purchase**: Payment as per payment terms
   - Track purchase type in PO

### **Features OUT OF SCOPE** ❌
- Vendor self-service portal (future phase)
- Vendor RFQ system (future phase)
- Vendor contract management (future phase)

### **Acceptance Criteria**
- [ ] Vendor master with all 15+ fields operational
- [ ] Vendor approval workflow functional
- [ ] Vendor performance metrics calculated correctly
- [ ] Vendor rating visible on vendor master and selection screens
- [ ] Payment terms enforced in accounts payable

---

## 🏭 Module 4: Department Requisitions & Issues

### **Scope**
Department-specific requisition and issue management with FEFO (First Expired, First Out) enforcement.

### **Features IN SCOPE** ✅
1. **Department Master**
   - **Restaurant Departments**: Continental, Chinese, BBQ, Tandoor, Beverages, Dessert
   - **General Organization**: Education, Administration, Construction, Kitchen, Security, Maintenance, Janitorial
   - Department Code, Name, Type
   - Department Head assignment
   - Active/Inactive status

2. **Department Requisition**
   - Department-wise requisition creation
   - Item selection with quantity needed
   - Justification/purpose of requisition
   - Requisition approval by Department Head
   - Conversion to Issue Slip after approval

3. **Issue Slip Workflow**
   - Generate Issue Slip from approved requisition
   - Store Keeper approval
   - Stock deduction on issue
   - FEFO enforcement for expiry items
   - Issue slip printing

4. **FEFO (First Expired, First Out)**
   - For items with expiry dates, system suggests oldest batch first
   - Warning if trying to issue non-FEFO batch
   - Block override without approval
   - FEFO compliance report

5. **Stat/Par Levels**
   - Department-specific minimum/maximum stock levels for commonly used items
   - Auto-generate requisition when department stock < stat level
   - Stat level consumption tracking
   - Stat level vs actual usage variance

### **Features OUT OF SCOPE** ❌
- Mobile app for requisition submission (future phase)
- Integration with department budgets (handled by Finance module)

### **Acceptance Criteria**
- [ ] All restaurant and general departments configured
- [ ] Requisition → Issue Slip workflow operational
- [ ] FEFO logic enforced for all expiry items
- [ ] Stat/Par levels configured and monitored
- [ ] Department-wise consumption reports available

---

## 👨‍🍳 Module 5: Recipes & Costing Link

### **Scope**
Recipe management with ingredient costing and ideal vs actual consumption variance tracking.

### **Features IN SCOPE** ✅
1. **Recipe Management**
   - Recipe Code (unique identifier)
   - Recipe Name
   - Associated Menu Item (if applicable)
   - Department (Continental, Chinese, etc.)
   - Portion Size
   - Total Cost (sum of ingredient costs)
   - Selling Price
   - Food Cost Percentage (auto-calculated)
   - Active/Inactive status

2. **Recipe Ingredients**
   - Link recipe to inventory items
   - Quantity per ingredient
   - Unit of measure
   - Cost per unit (from inventory)
   - Total cost (quantity × cost per unit)
   - Optional ingredients flag
   - Preparation notes

3. **Ideal vs Actual Consumption**
   - **Ideal Consumption**: Based on recipes × number of dishes sold
   - **Actual Consumption**: Based on actual stock issues
   - **Variance**: Actual - Ideal
   - Variance tolerance percentage
   - Variance alerts when tolerance exceeded
   - Variance investigation workflow

4. **Food Cost Percentage Calculation**
   - Auto-calculate food cost % = (Total Cost / Selling Price) × 100
   - Target food cost % configuration
   - Alert when food cost % exceeds target
   - Food cost trend analysis

5. **Recipe Version Control**
   - Track recipe changes over time
   - Version history
   - Compare versions
   - Revert to previous version if needed

### **Features OUT OF SCOPE** ❌
- Recipe scaling (adjust ingredient quantities for different batch sizes) - future phase
- Recipe multimedia (images, videos) - future phase
- Nutrition information - future phase

### **Acceptance Criteria**
- [ ] Recipes with all ingredients configured
- [ ] Food cost % auto-calculated and visible
- [ ] Ideal vs actual variance calculated daily
- [ ] Alerts generated for excessive variance
- [ ] Variance reports available for analysis

---

## 📍 Module 6: Item Location & Storage

### **Scope**
Physical location management with Zone → Aisle → Rack → Bin hierarchical mapping.

### **Features IN SCOPE** ✅
1. **Storage Location Hierarchy**
   - **Zone**: Major area (e.g., Dry Goods, Refrigerated, Frozen)
   - **Aisle**: Specific aisle within zone (e.g., A1, A2, B1)
   - **Rack**: Rack or shelf within aisle (e.g., R1, R2, R3)
   - **Bin**: Specific bin or slot within rack (e.g., B1, B2, B3)
   - Full location code: Zone-Aisle-Rack-Bin (e.g., DRY-A1-R2-B5)

2. **Location Master**
   - Location Code (unique)
   - Location Description
   - Store/Warehouse association
   - Capacity (volume/weight)
   - Current utilization
   - Temperature control (if applicable)
   - Active/Inactive status

3. **Item Location Assignment**
   - Primary location per item
   - Secondary/overflow locations
   - Bulk storage location
   - Location history tracking

4. **Physical Location Search**
   - Search by item to find location
   - Search by location to find items
   - Visual location map (future enhancement)
   - Bin location labels for printing

5. **Department Stat/Par Levels**
   - Minimum and maximum stock levels per department
   - Auto-replenishment triggers
   - Department-specific storage locations

### **Features OUT OF SCOPE** ❌
- Warehouse management system (WMS) features like pick/pack/ship - future phase
- Barcode scanning for location verification - future phase
- 3D warehouse visualization - future phase

### **Acceptance Criteria**
- [ ] Complete Zone-Aisle-Rack-Bin hierarchy configured
- [ ] All items assigned to primary locations
- [ ] Location search functional
- [ ] Location utilization reports available
- [ ] Bin labels printable

---

## ⏰ Module 7: Expiry & Warranty Tracking

### **Scope**
Batch-wise expiry date management and equipment warranty tracking with automated alerts.

### **Features IN SCOPE** ✅
1. **Batch Management**
   - Batch Number (from supplier or internal)
   - Manufacturing Date
   - Expiry Date
   - Shelf Life (days)
   - Quantity in batch
   - Supplier association
   - Batch status (Available, Expired, Quarantined)

2. **Expiry Alerts**
   - **30-Day Alert**: Items expiring in 30 days
   - **60-Day Alert**: Items expiring in 60 days
   - Automated email/SMS notifications
   - Dashboard widget showing near-expiry items
   - Expiry report (daily, weekly, monthly)

3. **Expired Item Handling**
   - Automatic status change to "Expired" on expiry date
   - Block issuance of expired items
   - Expired item disposal workflow
   - Expired item write-off process
   - Expired item register

4. **Warranty Tracking**
   - Warranty start and end dates
   - Warranty type (Manufacturer, Extended, Service)
   - Warranty terms and conditions
   - Vendor/supplier association
   - Warranty expiry alerts (30/60 days before)
   - Warranty claim tracking

5. **Shelf Life Management**
   - Define standard shelf life per item
   - Calculate expiry date from manufacturing date + shelf life
   - Alert if shelf life is nearing end
   - Shelf life vs actual usage analysis

### **Features OUT OF SCOPE** ❌
- Automatic disposal of expired items (requires manual approval)
- Warranty claim portal integration with vendors - future phase

### **Acceptance Criteria**
- [ ] All items with expiry dates have batch records
- [ ] 30-day and 60-day expiry alerts generated automatically
- [ ] Expired items blocked from issuance
- [ ] Warranty expiry alerts generated
- [ ] Expiry and warranty reports available

---

## ♻️ Module 8: Reusable/Saleable Items

### **Scope**
Tracking and sale of reusable items like used oil, scrap materials with margin analysis.

### **Features IN SCOPE** ✅
1. **Reusable Item Master**
   - Item identification (e.g., Used Cooking Oil, Scrap Metal, Cardboard)
   - Source (which operations generate this)
   - Expected quantity per month
   - Unit of measure
   - Market rate

2. **Collection Tracking**
   - Record collection of reusable items
   - Quantity collected
   - Collection date
   - Source department
   - Storage location

3. **Sale Management**
   - Record sale of reusable items
   - Sale date
   - Quantity sold
   - Sale price per unit
   - Total sale value
   - Buyer details
   - Payment receipt

4. **Accounts Receivable (AR) Entry**
   - Auto-generate AR entry on sale
   - Link to accounts receivable module
   - Payment tracking

5. **Margin Analysis**
   - Calculate total collection quantity
   - Calculate total sales value
   - Compare with market rates
   - Identify best buyers
   - Reusable item profitability report

### **Features OUT OF SCOPE** ❌
- Marketplace integration for selling reusables - future phase
- Automatic pricing based on market rates - future phase

### **Acceptance Criteria**
- [ ] Reusable items configured and tracked
- [ ] Collection process documented
- [ ] Sale transactions recorded
- [ ] AR entries generated automatically
- [ ] Margin analysis reports available

---

## 🔍 Module 9: Theft & Physical Stock Checks

### **Scope**
Theft incident reporting and scheduled physical stock count management with variance handling.

### **Features IN SCOPE** ✅
1. **Theft Reporting**
   - Theft incident creation
   - Date, time, location of incident
   - Item(s) stolen with quantities
   - Estimated value
   - Incident description
   - Photo upload support
   - Witness information
   - Police report reference (if applicable)
   - Status (Reported, Investigating, Resolved, Closed)

2. **Physical Stock Count**
   - Schedule physical counts (daily, weekly, monthly, quarterly, annual)
   - **Cycle Count**: Specific items or locations
   - **Full Count**: All items across all locations
   - Count date and time
   - Assigned counters (users)
   - Count status (Scheduled, In Progress, Completed, Approved)

3. **Count Process**
   - System generates count sheets with current system quantities
   - Counters enter physical quantities
   - System calculates variances (Physical - System)
   - Variance value calculation
   - Reason codes for variances (Theft, Damage, Counting Error, System Error, Evaporation, Spillage, etc.)
   - Photo upload for variances

4. **Variance Approval**
   - Small variances (< threshold) approved by Store Keeper
   - Medium variances approved by Department Head
   - Large variances require L2/L3 approval
   - Investigation required for theft-related variances

5. **Variance Posting**
   - Post approved variances to update system quantities
   - Generate stock adjustment transactions
   - Update inventory value
   - Maintain variance history

### **Features OUT OF SCOPE** ❌
- Mobile app for physical counting - future phase
- Barcode scanning for counting - future phase
- Integration with security cameras - future phase

### **Acceptance Criteria**
- [ ] Theft incidents can be reported with all details
- [ ] Physical counts can be scheduled and conducted
- [ ] Variance calculation and approval workflow operational
- [ ] Variances can be posted to adjust stock
- [ ] Complete audit trail of all counts and variances

---

## 👥 Module 10: Store Staff KPI & Donation Tracking

### **Scope**
Store staff productivity tracking and donation management with donor relationships.

### **Features IN SCOPE** ✅
1. **User Activity Tracking**
   - Transaction count per user per day
   - Transaction types (GRN, Issue, Transfer, Adjustment, Count)
   - Login/logout time
   - Total working hours
   - Expected working hours (from HR system or manual entry)
   - Overtime hours

2. **Staff KPI Dashboard**
   - Transactions per hour
   - Utilization percentage (Working Hours / Expected Hours)
   - Productivity score
   - Error rate (incorrect transactions)
   - User performance comparison
   - Top performers ranking

3. **Donor Master**
   - Donor Code (unique)
   - Donor Name
   - Contact Person
   - Phone, Email, Address
   - Total Donations Value (lifetime)
   - Last Donation Date
   - Donation Frequency
   - Donor Status (Active, Inactive)
   - Created/Updated timestamps

4. **Donation GRN**
   - Donation Number (unique)
   - Donor association
   - Donation Date
   - Donation Type (Food, Equipment, Supplies, Cash equivalent)
   - Total Market Value
   - Received By (user)
   - Status (Received, Verified, Posted)
   - Notes

5. **Donation Items**
   - Item association (from inventory master)
   - Quantity donated
   - Market value per unit
   - Total value
   - Condition (New, Used - Good, Used - Fair)

6. **Donor Tracking**
   - Donation history per donor
   - Frequency analysis (monthly, quarterly, annual donors)
   - Donor value ranking
   - Donor engagement metrics
   - Thank you letter/receipt generation

### **Features OUT OF SCOPE** ❌
- Donor portal for self-service - future phase
- Tax receipt generation (handled by Donations module)
- Integration with CRM - future phase

### **Acceptance Criteria**
- [ ] User activity tracked for all store transactions
- [ ] Staff KPI dashboard shows key metrics
- [ ] Donor master operational
- [ ] Donation GRN process functional
- [ ] Donor reports and analytics available

---

## 📊 Module 11: Comprehensive Reporting

### **Scope**
16 different report types covering all aspects of inventory management.

### **Reports IN SCOPE** ✅

1. **Stock Status Report**
   - Current stock levels for all items
   - Available vs Reserved quantities
   - Stock value by item/category/location
   - ABC analysis (high, medium, low value items)

2. **Low Stock Alert Report**
   - Items at or below reorder level
   - Reorder suggestions
   - Expected delivery dates
   - Priority ranking

3. **Expiry Report**
   - Items expiring in 30/60/90 days
   - Expired items not yet disposed
   - Expiry value and quantity
   - FEFO compliance report

4. **Stock Movement Report**
   - All stock movements (IN/OUT) by date range
   - Movement type breakdown
   - Movement by item/category/location
   - Movement value analysis

5. **Purchase Analysis Report**
   - Purchase volume by item/category/vendor
   - Purchase value by period
   - Price trend analysis
   - Purchase order status summary

6. **Vendor Performance Report**
   - On-time delivery rate by vendor
   - Quality rating by vendor
   - Price competitiveness analysis
   - Vendor ranking and comparison

7. **Department Consumption Report**
   - Consumption by department and item
   - Consumption trends (monthly, quarterly)
   - Department budget vs actual consumption
   - Top consuming departments

8. **Recipe Costing Report**
   - Recipe cost breakdown
   - Food cost percentage by recipe
   - Cost vs selling price analysis
   - Recipe profitability ranking

9. **Physical Count Variance Report**
   - Variances from physical counts
   - Variance value and percentage
   - Variance by reason code
   - Variance trend analysis

10. **Theft & Loss Report**
    - Theft incidents summary
    - Total theft value by period
    - Theft by location/item
    - Loss analysis and prevention recommendations

11. **Donation Summary Report**
    - Donations by donor and period
    - Donation value and quantity
    - Donor frequency and engagement
    - Top donors ranking

12. **Staff KPI Report**
    - Staff productivity metrics
    - Transaction volume by user
    - Utilization percentage
    - Performance comparison

13. **ABC Analysis Report**
    - Classify items by value (A: 80% value, B: 15% value, C: 5% value)
    - Inventory investment by category
    - Control recommendations by category

14. **Slow Moving Items Report**
    - Items with no movement in 90/180/365 days
    - Slow moving value
    - Recommended actions (discount, dispose, transfer)

15. **Dead Stock Report**
    - Items with zero movement in > 365 days
    - Obsolete items
    - Dead stock value
    - Write-off recommendations

16. **Inventory Valuation Report**
    - Total inventory value
    - Valuation by category/location
    - Value trend over time
    - Inventory turnover ratio

### **Report Formats**
- On-screen display with filters and drill-down
- PDF export for printing
- Excel export for further analysis
- CSV export for data integration
- Scheduled reports via email

### **Features OUT OF SCOPE** ❌
- Custom report builder (users define their own reports) - future phase
- Dashboard widgets for key reports - included in dashboards, not separate reports
- Integration with BI tools like Power BI - future phase

### **Acceptance Criteria**
- [ ] All 16 reports available and functional
- [ ] Reports can be filtered by date range, item, category, location, etc.
- [ ] Reports can be exported to PDF, Excel, CSV
- [ ] Reports are accurate and match data in database
- [ ] Report performance is acceptable (< 5 seconds for most reports)

---

## 🔔 Module 12: Alerts & Automation

### **Scope**
10 different alert types with automated notifications and configurable thresholds.

### **Alerts IN SCOPE** ✅

1. **Low Stock Alert**
   - Trigger: Stock level <= reorder level
   - Notification: Email to Purchasing team
   - Frequency: Daily batch process
   - Escalation: If not resolved in 3 days, escalate to manager

2. **Reorder Level Alert**
   - Similar to Low Stock but specifically for automated reorder
   - Trigger: Generate reorder suggestion

3. **Expiry Alert (30/60 Days)**
   - Trigger: Item expiry date - current date <= 30 or 60 days
   - Notification: Email to Store Keeper and Department Head
   - Frequency: Daily
   - Escalation: Repeated alerts as expiry approaches

4. **Price Variance Alert**
   - Trigger: PO price vs last purchase price variance > threshold
   - Notification: Email to Approver (L2/L3)
   - Frequency: Real-time when PO created
   - Action Required: Approval or rejection

5. **Approval Pending Alert**
   - Trigger: PR/PO pending approval for > 2 days
   - Notification: Email reminder to assigned approver
   - Frequency: Daily
   - Escalation: After 5 days, escalate to next level approver

6. **Over Stock Alert**
   - Trigger: Stock level > max level
   - Notification: Email to Purchasing team and Store Keeper
   - Frequency: Daily
   - Action: Investigate reason, consider transfer or return

7. **Warranty Expiry Alert**
   - Trigger: Warranty end date - current date <= 30 or 60 days
   - Notification: Email to Maintenance team
   - Frequency: Weekly
   - Action: Consider extending warranty or preparing for replacement

8. **Physical Count Due Alert**
   - Trigger: Scheduled physical count date approaching
   - Notification: Email to Store Keeper and assigned counters
   - Frequency: Weekly before count date
   - Reminder: Daily when count date is within 3 days

9. **Vendor Performance Alert**
   - Trigger: Vendor on-time delivery < 80% or quality rating < 3/5
   - Notification: Email to Purchasing Manager
   - Frequency: Monthly
   - Action: Review vendor relationship, consider alternatives

10. **Budget Variance Alert**
    - Trigger: Department consumption > budget by X%
    - Notification: Email to Department Head and Finance
    - Frequency: Monthly
    - Action: Investigate overspending, request budget revision

### **Alert Configuration**
- Configurable thresholds per alert type
- Enable/disable individual alerts
- Configure recipients per alert
- Configure frequency (real-time, hourly, daily, weekly, monthly)
- Alert history and audit trail

### **Notification Channels**
- **Email**: Primary notification method
- **SMS**: For critical alerts (requires SMS gateway integration)
- **In-App**: Dashboard notifications and badges
- **Mobile Push**: If mobile app available (future phase)

### **Features OUT OF SCOPE** ❌
- SMS gateway integration (depends on client SMS provider)
- Mobile push notifications (requires mobile app)
- Webhook integration for third-party systems - future phase

### **Acceptance Criteria**
- [ ] All 10 alert types configured and operational
- [ ] Email notifications sent correctly
- [ ] Alert thresholds configurable by administrators
- [ ] Alert history visible in system
- [ ] Users can manage their alert preferences

---

## 🔐 Module 13: Roles & Permissions

### **Scope**
7 user roles with granular permission matrix and department-based access control.

### **Roles IN SCOPE** ✅

#### **1. Store Keeper**
**Permissions:**
- Create and approve GRN (Goods Receipt Notes)
- Create and approve Issue Slips
- Perform stock adjustments (with limits)
- Conduct physical stock counts
- View inventory reports

**Restrictions:**
- Cannot approve Purchase Orders
- Cannot delete inventory items
- Cannot change item master data (only Store Manager can)
- Cannot approve physical count variances > threshold

**Department Access:** All departments

---

#### **2. Department Head**
**Permissions:**
- Create purchase requisitions for own department
- Approve requisitions from own department staff
- View department consumption reports
- Create issue acknowledgement

**Restrictions:**
- Cannot create Purchase Orders
- Cannot adjust stock directly
- Cannot access other department's data
- Cannot approve requisitions above approval limit

**Department Access:** Own department only

---

#### **3. Purchasing Officer**
**Permissions:**
- Create Purchase Orders from approved requisitions
- Manage vendor master data
- Compare vendor prices and performance
- Negotiate prices with vendors
- View all purchase-related reports

**Restrictions:**
- Cannot approve Purchase Orders (only create)
- Cannot adjust stock
- Cannot perform GRN (that's Store Keeper's role)

**Department Access:** All departments (view only)

---

#### **4. Approver L1 (First Level Approver)**
**Permissions:**
- Approve purchase requisitions (all amounts)
- Approve Purchase Orders up to PKR 50,000
- Approve Issue Slips
- View approval history

**Restrictions:**
- Cannot approve POs above PKR 50,000
- Cannot approve price variances > 5%
- Cannot approve physical count variances related to theft

**Approval Limit:** PKR 50,000

---

#### **5. Approver L2 (Second Level Approver)**
**Permissions:**
- Approve Purchase Orders up to PKR 200,000
- Approve price variances up to 10%
- Approve physical count variances
- Approve new vendor registrations

**Restrictions:**
- Cannot approve POs above PKR 200,000
- Cannot approve theft-related variances (requires L3)

**Approval Limit:** PKR 200,000

---

#### **6. Approver L3 (Third Level Approver / Executive)**
**Permissions:**
- Unlimited approval authority for all transactions
- Approve theft reports and investigations
- Approve system configuration changes
- Approve user access requests
- Override any restrictions

**Restrictions:** None

**Approval Limit:** Unlimited

---

#### **7. Finance Officer**
**Permissions:**
- View all financial reports
- Perform invoice matching (PO + GRN + Invoice)
- Review and post price variances
- Conduct cost analysis
- Approve write-offs

**Restrictions:**
- Cannot modify stock directly
- Cannot create or approve POs (only review for finance purposes)
- Cannot access HR data beyond cost information

**Department Access:** All (view only, except finance operations)

---

#### **8. Admin (System Administrator)**
**Permissions:**
- Full system access
- Manage all master data (items, categories, vendors, departments, locations)
- User management (create, modify, deactivate users)
- Role assignment
- System configuration
- View all reports and audit logs

**Restrictions:** None (superuser)

**Department Access:** All

---

#### **9. Auditor**
**Permissions:**
- Read-only access to all data
- View all reports
- Export data for audit purposes
- View audit logs and trails
- View compliance reports

**Restrictions:**
- No modification or creation permissions
- Cannot approve any transactions
- Cannot configure system
- Cannot manage users

**Department Access:** All (read-only)

---

### **Permission Matrix**

| Permission | Store Keeper | Dept Head | Purchasing | L1 | L2 | L3 | Finance | Admin | Auditor |
|-----------|-------------|-----------|-----------|----|----|----|---------| ------|---------|
| Create PR | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Approve PR | ❌ | ✅ (own dept) | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Create PO | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Approve PO | ❌ | ❌ | ❌ | ✅ (<50K) | ✅ (<200K) | ✅ | ❌ | ✅ | ❌ |
| Create GRN | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Approve GRN | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Create Issue | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Approve Issue | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Stock Adjustment | ✅ (limit) | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Physical Count | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Approve Variance | ✅ (limit) | ✅ (dept) | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Manage Items | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Manage Vendors | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ |
| View Reports | ✅ (limited) | ✅ (dept) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Export Data | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| System Config | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| User Management | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Audit Logs | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

### **Features OUT OF SCOPE** ❌
- Dynamic role creation (custom roles) - future phase
- Permission inheritance and hierarchies - future phase
- Temporary permission grants - future phase

### **Acceptance Criteria**
- [ ] All 9 roles configured in system
- [ ] Permission matrix enforced at API and UI level
- [ ] Role assignment functional
- [ ] Department-based access control working
- [ ] Audit trail of permission changes maintained

---

## ✅ Module 14: Test Cases for QA

### **Scope**
Comprehensive testing strategy with 14+ automated test scenarios and full coverage.

### **Test Coverage IN SCOPE** ✅

#### **1. Unit Tests**
- Test individual functions and methods
- Test data validation logic
- Test calculation functions (food cost %, variance, etc.)
- Test business rules enforcement
- **Target**: 80% code coverage

#### **2. Integration Tests**
- Test PR → PO → GRN → Invoice workflow
- Test approval routing logic
- Test stock movement and inventory updates
- Test notification triggers
- Test report generation
- **Target**: All critical workflows covered

#### **3. User Acceptance Tests (UAT)**
14 main test scenarios as defined in requirements:

**TC-001: Item Below Reorder Level**
- Setup: Create item with reorder level = 10, current stock = 8
- Expected: System generates reorder suggestion notification
- Status: Automated

**TC-002: GRN Above Max Level**
- Setup: Create GRN that pushes stock above max level
- Expected: System requires reason and L2/L3 approval
- Status: Automated

**TC-003: Price Variance Above Threshold**
- Setup: Create PO with price 15% higher than last purchase
- Expected: System routes to L2/L3 approver
- Status: Automated

**TC-004: FEFO Enforcement**
- Setup: Issue request for item with multiple batches (different expiry dates)
- Expected: System suggests oldest expiry date batch first
- Status: Automated

**TC-005: Recipe Variance Calculation**
- Setup: Sell 100 dishes, system calculates ideal vs actual ingredient consumption
- Expected: Variance calculated correctly, alerts if > tolerance
- Status: Automated

**TC-006: Physical Location Search**
- Setup: Search for item "Double Light Plug"
- Expected: System returns location "C1-R3-B2"
- Status: Automated

**TC-007: Expiry Alert Generation**
- Setup: Item with expiry date 25 days from now
- Expected: System generates 30-day expiry alert
- Status: Automated

**TC-008: Reusable Item Sale**
- Setup: Record sale of 50 liters used cooking oil at PKR 100/liter
- Expected: Sale recorded, AR entry generated, margin calculated
- Status: Automated

**TC-009: Theft Incident Reporting**
- Setup: Report theft of 5 items worth PKR 5,000
- Expected: Incident recorded, variance approved by L3, stock adjusted
- Status: Automated

**TC-010: Donation GRN Processing**
- Setup: Process donation of 100 items from donor
- Expected: Donation GRN created, stock increased, donor record updated
- Status: Automated

**TC-011: Staff KPI Calculation**
- Setup: User processes 50 transactions in 8 hours
- Expected: KPI calculated as 6.25 transactions/hour, utilization 100%
- Status: Automated

**TC-012: Vendor Performance Calculation**
- Setup: Vendor delivered 10 POs, 8 on-time, 2 late
- Expected: On-time delivery = 80%, rating updated
- Status: Automated

**TC-013: Role Permission Enforcement**
- Setup: Store Keeper attempts to approve PO (not allowed)
- Expected: System denies access, shows permission error
- Status: Automated

**TC-014: Comprehensive Report Generation**
- Setup: Generate Stock Status Report with 1000 items
- Expected: Report generated in < 5 seconds, data accurate
- Status: Automated

#### **4. Performance Tests**
- Load testing with 100 concurrent users
- Stress testing with 10,000 inventory items
- Report generation performance
- Database query optimization
- **Target**: < 2 seconds response time for 95% of requests

#### **5. Security Tests**
- SQL injection prevention
- XSS prevention
- Authentication and authorization
- Data encryption verification
- Audit trail completeness
- **Target**: Zero critical vulnerabilities

#### **6. Compatibility Tests**
- Browser compatibility (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness
- Different screen resolutions
- Light and dark mode
- **Target**: 100% compatibility with modern browsers

### **Testing Tools**
- **Unit Tests**: Jest, React Testing Library
- **Integration Tests**: Playwright or Cypress
- **Performance**: Lighthouse, k6
- **Security**: OWASP ZAP, SonarQube

### **Features OUT OF SCOPE** ❌
- Automated visual regression testing - future phase
- Chaos engineering - future phase

### **Acceptance Criteria**
- [ ] All 14 UAT scenarios pass
- [ ] Unit test coverage > 80%
- [ ] Integration tests cover all critical workflows
- [ ] Performance targets met
- [ ] Zero critical security vulnerabilities
- [ ] UAT sign-off from client

---

## 🚫 Out of Scope (Future Phases)

The following features are explicitly **OUT OF SCOPE** for Phase 1 and will be considered for future phases:

### **Technology Enhancements**
- Mobile application (native iOS/Android apps)
- Barcode/QR code scanning for inventory
- RFID integration for automated tracking
- IoT sensors for real-time stock monitoring
- Voice-activated commands
- Augmented Reality (AR) for warehouse navigation

### **Advanced Features**
- Vendor self-service portal
- RFQ (Request for Quotation) system
- Contract management
- EDI (Electronic Data Interchange) integration
- Marketplace integration for selling reusables
- Automatic payment processing
- Integration with external ERP systems
- Blockchain for supply chain transparency

### **AI & Machine Learning**
- Advanced demand forecasting with ML models
- Automatic price optimization
- Supplier risk assessment
- Fraud detection
- Predictive maintenance for equipment
- Image recognition for quality inspection

### **Reporting & Analytics**
- Custom report builder (drag-and-drop)
- Power BI / Tableau integration
- Data warehouse and data lakes
- Big data analytics
- Predictive analytics dashboards

### **User Experience**
- 3D warehouse visualization
- Virtual Reality (VR) training
- Gamification of inventory processes
- Social collaboration features
- Video tutorials and in-app guidance

---

## ⏱️ Timeline & Milestones

### **Phase 1: Core Foundation (Weeks 1-3)**
**Milestone 1**: Database & Backend Setup
- ✅ Complete database schema (30+ tables)
- ✅ API routes for all operations
- ✅ Authentication & RBAC
- ✅ Seed data with realistic inventory

**Milestone 2**: Enhanced Dashboard
- ✅ Donut & bar charts
- ✅ Interactive KPI cards
- ✅ Responsive design

**Milestone 3**: Core Inventory Features
- ✅ Item master (30+ fields)
- ✅ Stock level controls
- ✅ Multi-location tracking

---

### **Phase 2: Advanced Features (Weeks 4-6)**
**Milestone 4**: Purchase & Approval Workflow
- ✅ PR → PO → GRN → Invoice flow
- ✅ 3-level approval system
- ✅ Price variance detection

**Milestone 5**: Vendor & Department Management
- ✅ Vendor master (15+ fields)
- ✅ Vendor approval workflow
- ✅ Department requisitions & issues
- ✅ Restaurant vs General departments

**Milestone 6**: Advanced Tracking
- ✅ Expiry & warranty tracking
- ✅ Batch management with FEFO
- ✅ Physical location mapping
- ✅ Reusable items tracking

---

### **Phase 3: AI & Analytics (Weeks 7-9)**
**Milestone 7**: Recipe Integration
- ✅ Recipe management & costing
- ✅ Ideal vs actual consumption
- ✅ Food cost % calculations
- ✅ Variance analysis

**Milestone 8**: Physical Counts & Theft
- ✅ Scheduled physical counts
- ✅ Theft reporting with logs
- ✅ Photo attachment support
- ✅ Variance posting with approvals

**Milestone 9**: Staff KPI & Donations
- ✅ User activity tracking
- ✅ Staff KPI dashboard
- ✅ Donation GRN processing
- ✅ Donor management

---

### **Phase 4: Reporting & Final Polish (Weeks 10-12)**
**Milestone 10**: Comprehensive Reporting
- ✅ All 16 report types
- ✅ Custom date ranges
- ✅ PDF/Excel/CSV export
- ✅ Scheduled reports

**Milestone 11**: Alerts & Automation
- ✅ All 10 alert types
- ✅ Email/SMS notifications
- ✅ Configurable thresholds
- ✅ Alert history

**Milestone 12**: Testing & Deployment
- ✅ All 14 test cases
- ✅ User acceptance testing
- ✅ Performance optimization
- ✅ Production deployment
- ✅ User training
- ✅ Go-live support

---

## 💰 Investment Breakdown

### **Development Costs**
- **Phase 1**: PKR 200,000 (Core Foundation)
- **Phase 2**: PKR 150,000 (Advanced Features)
- **Phase 3**: PKR 100,000 (AI & Analytics)
- **Phase 4**: PKR 50,000 (Reporting & Polish)
- **Total**: PKR 500,000

### **Expected Savings**
- **Monthly Waste Reduction**: PKR 150,000
- **Efficiency Gains**: PKR 75,000
- **Compliance Savings**: PKR 25,000
- **Total Monthly**: PKR 250,000
- **Annual Savings**: PKR 3,000,000

### **ROI Calculation**
- **Investment**: PKR 500,000
- **Annual Savings**: PKR 3,000,000
- **ROI**: 600%
- **Payback Period**: 2 months

---

## 📋 Deliverables Checklist

### **Documentation**
- [x] README.md
- [x] SCOPE.md (this document)
- [ ] TDD.md (Technical Design Document)
- [ ] ARCHITECTURE.md
- [ ] DATABASE_DESIGN.md
- [ ] API_SPECIFICATIONS.md
- [ ] WORKFLOWS.md
- [ ] TASKS.md
- [ ] BUGS.md
- [ ] TEST_PLAN.md

### **Diagrams**
- [ ] Architecture Diagram
- [ ] Entity Relationship Diagram
- [ ] Purchase Workflow Diagram
- [ ] Approval Workflow Diagram
- [ ] Stock Movement Flow Diagram
- [ ] System Overview Diagram

### **Database**
- [ ] All 30+ tables created
- [ ] Indexes and constraints
- [ ] Seed data
- [ ] Migration scripts

### **Implementation**
- [ ] All 14 modules functional
- [ ] All API endpoints
- [ ] All UI pages
- [ ] All reports
- [ ] All alerts

### **Testing**
- [ ] Unit tests (80% coverage)
- [ ] Integration tests
- [ ] 14 UAT scenarios
- [ ] Performance tests
- [ ] Security tests

### **Deployment**
- [ ] Production environment setup
- [ ] Database migration
- [ ] User training
- [ ] Documentation
- [ ] Go-live support

---

## ✅ Acceptance Criteria (Summary)

The Inventory Management System will be considered **complete and accepted** when:

1. ✅ All 14 modules are fully functional
2. ✅ All 30+ database tables created and operational
3. ✅ All 80+ API endpoints working correctly
4. ✅ All 16 reports available and accurate
5. ✅ All 10 alerts configured and sending notifications
6. ✅ All 7 user roles with proper permissions
7. ✅ All 14 UAT test scenarios passing
8. ✅ Unit test coverage > 80%
9. ✅ Performance targets met (< 2 seconds response time)
10. ✅ Zero critical security vulnerabilities
11. ✅ Complete documentation delivered
12. ✅ User training completed
13. ✅ UAT sign-off from client
14. ✅ Go-live successful with < 5% incident rate in first week

---

## 📞 Sign-Off

### **Prepared By**
- **Team**: Rahah24 Development Team
- **Date**: October 25, 2025
- **Version**: 1.0

### **Reviewed By**
- **Client**: Jamia Binoria Aalamia
- **Pakistani Team**: Requirements Gathering Team
- **Date**: _________________
- **Signature**: _________________

### **Approved By**
- **Project Sponsor**: _________________
- **Date**: _________________
- **Signature**: _________________

---

*InshAllah, this scope document will serve as the foundation for a successful implementation of the Inventory Management System, bringing efficiency, transparency, and relief to Jamia Binoria Aalamia's operations.*
