# USER ROLES & PERMISSIONS MATRIX
**Inventory & Procurement Module - Phase 1**

---

## 📋 Overview

This document defines all 9 user roles for the Inventory & Procurement module, their access levels, permissions, and responsibilities. All users must use the **@rahah24.com** email domain.

**Total Users**: 9 (1 existing + 8 new)
**Access Control**: Row-Level Security (RLS) via Supabase policies
**Authentication**: Supabase Auth with JWT tokens

---

## 👥 USER ROLES SUMMARY

| # | Role | Email | Access Level | Primary Functions |
|---|------|-------|--------------|-------------------|
| 1 | **System Administrator** | admin@rahah24.com | Full System Access | System config, all modules, user management |
| 2 | **Store Keeper** | storekeeper@rahah24.com | Department Stock Only | Stock management, issues, department requisitions |
| 3 | **Department Head** | deptheadkitchen@rahah24.com | Department Approvals | Approve requisitions <50K, view dept reports |
| 4 | **Purchasing Officer** | purchasing@rahah24.com | Procurement Operations | Vendor mgmt, PO creation, GRN processing |
| 5 | **Approver Level 1** | approverl1@rahah24.com | Approvals <50K | Approve PRs and POs under PKR 50,000 |
| 6 | **Approver Level 2** | approverl2@rahah24.com | Approvals <200K | Approve PRs and POs under PKR 200,000 |
| 7 | **General Manager (L3)** | gm@rahah24.com | Unlimited Approvals | Approve all PRs/POs, final authority |
| 8 | **Finance Officer** | finance@rahah24.com | Financial Data | GL integration, invoice matching, budgets |
| 9 | **Auditor** | auditor@rahah24.com | Read-Only All | Audit trails, compliance, reports only |

---

## 🔐 ROLE 1: System Administrator

### **User Details:**
- **Email**: admin@rahah24.com *(Already exists)*
- **Employee Code**: ADMIN-001
- **Department**: IT / Administration
- **Job Title**: System Administrator

### **Access Level:**
- ✅ **Full system access** - All modules (Executive, Business, Financial, HR, Operations, Islamic)
- ✅ **User management** - Create, edit, disable users
- ✅ **System configuration** - Settings, workflows, approval rules
- ✅ **All data access** - No RLS restrictions

### **Permissions:**
```json
{
  "inventory": {
    "items": ["create", "read", "update", "delete"],
    "stock": ["create", "read", "update", "delete", "adjust"],
    "transfers": ["create", "read", "update", "delete", "approve"],
    "counts": ["create", "read", "update", "delete", "approve"]
  },
  "procurement": {
    "requisitions": ["create", "read", "update", "delete", "approve"],
    "purchase_orders": ["create", "read", "update", "delete", "approve"],
    "grn": ["create", "read", "update", "delete", "approve"],
    "vendors": ["create", "read", "update", "delete", "approve"]
  },
  "financial": {
    "gl_entries": ["read", "post", "reverse"],
    "invoices": ["read", "match", "approve"],
    "budgets": ["create", "read", "update", "delete"]
  },
  "reports": ["all"],
  "alerts": ["configure", "view", "acknowledge"],
  "system": ["configure", "manage_users", "manage_roles"]
}
```

### **Responsibilities:**
- System maintenance and configuration
- User account management
- Troubleshooting and support
- System upgrades and patches
- Backup verification
- Security monitoring

### **Dashboard Access:**
- Executive Dashboard ✅
- All Business Dashboards ✅
- Financial Management ✅
- HR Management ✅
- Operations Management ✅
- Islamic Services ✅
- Settings & Configuration ✅

---

## 🔐 ROLE 2: Store Keeper

### **User Details:**
- **Email**: storekeeper@rahah24.com *(To be created)*
- **Employee Code**: STK-001
- **Department**: Main Store / Warehouse
- **Job Title**: Store Keeper

### **Access Level:**
- ✅ **Department stock only** - Items assigned to their store/location
- ✅ **Stock operations** - Receive, issue, adjust, transfer
- ❌ **No procurement** - Cannot create PRs, POs, or GRNs
- ❌ **No financial data** - Cannot view GL entries or budgets

### **Permissions:**
```json
{
  "inventory": {
    "items": ["read"],
    "stock": ["read", "issue", "receive"],
    "adjustments": ["create", "read"],
    "transfers": ["create", "read"],
    "counts": ["create", "read", "update"],
    "batches": ["create", "read", "update"]
  },
  "procurement": {
    "requisitions": ["create", "read"],
    "purchase_orders": ["read"],
    "grn": ["read"],
    "vendors": ["read"]
  },
  "reports": ["stock_ledger", "stock_status", "low_stock", "expiry_report"]
}
```

### **RLS Policy:**
```sql
-- Store Keeper can only see items in their assigned location
CREATE POLICY "store_keeper_stock_access" ON inventory_stock_levels
FOR SELECT USING (
  auth.uid() IN (
    SELECT id FROM user_profiles
    WHERE role = 'store_keeper'
    AND assigned_locations @> ARRAY[location_id]
  )
);
```

### **Responsibilities:**
- Daily stock management (receive, issue, adjust)
- Physical stock counts and cycle counts
- Maintain stock records and batch tracking
- Issue stock to departments upon approval
- Report low stock and expiry issues
- Maintain store cleanliness and organization

### **Dashboard Access:**
- Inventory Dashboard ✅ (filtered by assigned location)
- Stock Levels ✅
- Department Requisitions ✅ (create only)
- Expiry & Warranty Tracking ✅

---

## 🔐 ROLE 3: Department Head (Kitchen)

### **User Details:**
- **Email**: deptheadkitchen@rahah24.com *(To be created)*
- **Employee Code**: DH-KIT-001
- **Department**: Kitchen / Food Production
- **Job Title**: Kitchen Manager / Head Chef

### **Access Level:**
- ✅ **Department data** - Kitchen items, requisitions, consumption
- ✅ **Approval authority** - Requisitions <PKR 50,000
- ✅ **Recipe costing** - View and manage kitchen recipes
- ❌ **Other departments** - Cannot view other department data

### **Permissions:**
```json
{
  "inventory": {
    "items": ["read"],
    "stock": ["read"],
    "requisitions": ["create", "read", "update", "approve_own_dept"],
    "issues": ["read", "request"]
  },
  "procurement": {
    "requisitions": ["create", "read", "approve_under_50k"],
    "purchase_orders": ["read"],
    "grn": ["read"]
  },
  "restaurant": {
    "recipes": ["create", "read", "update"],
    "recipe_costing": ["read", "analyze"]
  },
  "reports": ["dept_consumption", "dept_budget", "recipe_cost_report"]
}
```

### **Approval Workflow:**
- **Can Approve**: Department requisitions <PKR 50,000
- **Cannot Approve**: PRs >PKR 50,000 (escalates to L2)
- **Notification**: Email + in-app when new PR awaits approval
- **SLA**: 24 hours for approval/rejection

### **Responsibilities:**
- Create requisitions for kitchen supplies
- Approve department requisitions <50K
- Monitor kitchen inventory consumption
- Track recipe costs and variances
- Manage kitchen staff requisitions
- Ensure stock availability for menu items

### **Dashboard Access:**
- Restaurant Dashboard ✅
- Recipe Costing ✅
- Department Requisitions ✅
- Consumption Reports ✅ (kitchen only)

---

## 🔐 ROLE 4: Purchasing Officer

### **User Details:**
- **Email**: purchasing@rahah24.com *(To be created)*
- **Employee Code**: PUR-001
- **Department**: Procurement
- **Job Title**: Purchasing Officer

### **Access Level:**
- ✅ **All procurement operations** - PRs, POs, GRNs, vendors
- ✅ **Vendor management** - Create, evaluate, manage vendors
- ✅ **Price negotiation** - Update prices, manage contracts
- ❌ **Cannot approve** - No approval authority, only processing

### **Permissions:**
```json
{
  "inventory": {
    "items": ["read"],
    "stock": ["read"],
    "reorder_levels": ["read", "suggest"]
  },
  "procurement": {
    "requisitions": ["read", "convert_to_po"],
    "purchase_orders": ["create", "read", "update", "send_to_vendor"],
    "grn": ["create", "read", "update", "post"],
    "vendors": ["create", "read", "update", "evaluate"],
    "price_history": ["read", "analyze"],
    "contracts": ["create", "read", "update"]
  },
  "financial": {
    "invoice_matching": ["create", "read", "update"]
  },
  "reports": ["purchase_register", "vendor_performance", "price_variance", "spend_analysis"]
}
```

### **Workflow Responsibilities:**
1. **PR Processing**: Review approved PRs, prepare POs
2. **Vendor Selection**: Choose vendor based on price, quality, delivery
3. **PO Creation**: Generate POs from approved PRs
4. **Price Negotiation**: Negotiate prices, manage contracts
5. **GRN Processing**: Receive goods, match with PO
6. **Invoice Matching**: 3-way match (PO-GRN-Invoice)
7. **Vendor Evaluation**: Rate vendors on performance

### **Responsibilities:**
- Convert approved PRs to POs
- Vendor selection and negotiation
- Issue POs to vendors
- Track PO delivery status
- Process GRNs (receive goods)
- Maintain vendor relationships
- Conduct vendor evaluations
- Manage procurement analytics

### **Dashboard Access:**
- Procurement Dashboard ✅
- Purchase Requisitions ✅
- Purchase Orders ✅
- GRN Management ✅
- Vendor Management ✅
- Procurement Analytics ✅

---

## 🔐 ROLE 5: Approver Level 1

### **User Details:**
- **Email**: approverl1@rahah24.com *(To be created)*
- **Employee Code**: APR-L1-001
- **Department**: Administration / Finance
- **Job Title**: Procurement Coordinator

### **Access Level:**
- ✅ **Approve PRs <PKR 50,000** only
- ✅ **View own approval history**
- ❌ **Cannot create** PRs, POs, or GRNs
- ❌ **Cannot approve** >50K (escalates to L2)

### **Permissions:**
```json
{
  "procurement": {
    "requisitions": ["read", "approve_under_50k", "reject", "comment"],
    "purchase_orders": ["read"],
    "approval_history": ["read_own"]
  },
  "reports": ["approval_dashboard", "pending_approvals"]
}
```

### **Approval Rules:**
```javascript
// Auto-routing logic
if (requisition.total_amount < 50000) {
  assignApprover("approverl1@rahah24.com");
  sendNotification("approverl1@rahah24.com", "New PR awaiting approval");
}
```

### **Responsibilities:**
- Review and approve PRs <PKR 50,000
- Verify requisition justification
- Check budget availability
- Approve/reject within 24 hours
- Add comments for rejections
- Monitor pending approval queue

### **Dashboard Access:**
- Procurement Dashboard ✅ (limited view)
- Pending Approvals ✅
- Approval History ✅ (own only)

---

## 🔐 ROLE 6: Approver Level 2

### **User Details:**
- **Email**: approverl2@rahah24.com *(To be created)*
- **Employee Code**: APR-L2-001
- **Department**: Finance
- **Job Title**: Finance Manager

### **Access Level:**
- ✅ **Approve PRs PKR 50K - 200K**
- ✅ **Approve price variances 5-10%**
- ✅ **View department budgets**
- ❌ **Cannot approve** >200K (escalates to L3/GM)

### **Permissions:**
```json
{
  "procurement": {
    "requisitions": ["read", "approve_50k_to_200k", "reject", "comment"],
    "purchase_orders": ["read", "approve_price_variance_5_to_10"],
    "approval_history": ["read_own"]
  },
  "financial": {
    "budgets": ["read"],
    "department_spending": ["read", "analyze"]
  },
  "reports": ["approval_dashboard", "budget_variance", "spend_analysis"]
}
```

### **Approval Rules:**
```javascript
// Auto-routing logic
if (requisition.total_amount >= 50000 && requisition.total_amount < 200000) {
  assignApprover("approverl2@rahah24.com");
  sendNotification("approverl2@rahah24.com", "New PR awaiting L2 approval");
}

// Price variance approval
if (price_variance >= 5 && price_variance < 10) {
  requireApproval("approverl2@rahah24.com");
}
```

### **Responsibilities:**
- Review and approve PRs PKR 50K-200K
- Verify budget availability
- Approve price variances 5-10%
- Review department spending patterns
- Approve/reject within 48 hours
- Escalate unusual requests to GM
- Monitor budget compliance

### **Dashboard Access:**
- Procurement Dashboard ✅
- Finance Dashboard ✅ (budgets only)
- Pending Approvals ✅
- Budget Variance Reports ✅

---

## 🔐 ROLE 7: General Manager (Approver L3)

### **User Details:**
- **Email**: gm@rahah24.com *(To be created)*
- **Employee Code**: GM-001
- **Department**: Executive Management
- **Job Title**: General Manager

### **Access Level:**
- ✅ **Unlimited approval authority** - All PRs regardless of amount
- ✅ **Final approval** - Price variances >10%, policy exceptions
- ✅ **Executive dashboard** - KPIs, analytics, all modules
- ✅ **Policy override** - Can approve out-of-policy requests

### **Permissions:**
```json
{
  "inventory": {
    "all": ["read"]
  },
  "procurement": {
    "requisitions": ["read", "approve_unlimited", "reject", "comment"],
    "purchase_orders": ["read", "approve_unlimited", "approve_price_variance_any"],
    "vendors": ["read", "approve"],
    "approval_history": ["read_all"]
  },
  "financial": {
    "budgets": ["read", "approve"],
    "gl_entries": ["read"],
    "spending": ["read", "analyze"]
  },
  "reports": ["all"],
  "executive": {
    "dashboards": ["all"],
    "analytics": ["all"],
    "kpis": ["all"]
  }
}
```

### **Approval Rules:**
```javascript
// Auto-routing logic
if (requisition.total_amount >= 200000) {
  assignApprover("gm@rahah24.com");
  sendNotification("gm@rahah24.com", "High-value PR awaiting GM approval");
  notifyCFO(); // Also notify CFO
}

// Price variance approval
if (price_variance >= 10) {
  requireApproval("gm@rahah24.com");
}

// Policy exceptions
if (requisition.is_exception) {
  requireApproval("gm@rahah24.com");
}
```

### **Responsibilities:**
- Approve all high-value PRs (>PKR 200K)
- Approve price variances >10%
- Final authority on policy exceptions
- Review procurement trends and spending
- Monitor budget utilization
- Strategic vendor relationships
- Mobile approval support (urgent items)

### **Dashboard Access:**
- Executive Dashboard ✅
- All Business Dashboards ✅
- All Financial Dashboards ✅
- Procurement Dashboard ✅
- All Analytics & Reports ✅

---

## 🔐 ROLE 8: Finance Officer

### **User Details:**
- **Email**: finance@rahah24.com *(To be created)*
- **Employee Code**: FIN-001
- **Department**: Finance & Accounting
- **Job Title**: Finance Officer

### **Access Level:**
- ✅ **Financial data** - GL entries, budgets, spending
- ✅ **Invoice matching** - 3-way match (PO-GRN-Invoice)
- ✅ **Budget tracking** - Monitor budget vs actual
- ❌ **No approval authority** - Cannot approve PRs or POs

### **Permissions:**
```json
{
  "inventory": {
    "items": ["read"],
    "stock_value": ["read", "analyze"]
  },
  "procurement": {
    "requisitions": ["read"],
    "purchase_orders": ["read"],
    "grn": ["read"],
    "invoice_matching": ["create", "read", "update", "post"]
  },
  "financial": {
    "gl_entries": ["read", "post", "verify"],
    "budgets": ["create", "read", "update"],
    "accounts_payable": ["create", "read", "update"],
    "vendor_payments": ["read", "process"],
    "cost_accounting": ["read", "analyze"]
  },
  "reports": ["financial_statements", "budget_reports", "ap_aging", "spend_analysis", "gl_reports"]
}
```

### **Responsibilities:**
- Process invoice matching (PO-GRN-Invoice)
- Post GL entries for inventory transactions
- Monitor budget vs actual spending
- Process vendor payments
- Reconcile inventory accounts
- Generate financial reports
- Track cost variances
- Ensure accounting compliance

### **Workflow Integration:**
```javascript
// On GRN posting
onGRNPost(grn) {
  // Auto-create GL entry
  createGLEntry({
    debit: "Inventory Account",
    credit: "Accounts Payable",
    amount: grn.total_amount,
    reference: grn.grn_no
  });

  // Notify finance
  notifyFinanceOfficer("New GRN posted, GL entry created");
}

// On invoice receipt
onInvoiceReceived(invoice) {
  // Auto-match with PO and GRN
  matchInvoice(invoice);
  notifyFinanceOfficer("Invoice awaiting 3-way match");
}
```

### **Dashboard Access:**
- Finance Dashboard ✅
- Accounts Payable ✅
- Budget Management ✅
- GL Transactions ✅
- Invoice Matching ✅
- Financial Reports ✅

---

## 🔐 ROLE 9: Auditor

### **User Details:**
- **Email**: auditor@rahah24.com *(To be created)*
- **Employee Code**: AUD-001
- **Department**: Internal Audit / Compliance
- **Job Title**: Internal Auditor

### **Access Level:**
- ✅ **Read-only access** - All modules, all data
- ✅ **Audit trails** - Track all user actions
- ✅ **Compliance reports** - Generate audit reports
- ❌ **No write access** - Cannot create, edit, or delete anything

### **Permissions:**
```json
{
  "inventory": {
    "all": ["read"]
  },
  "procurement": {
    "all": ["read"]
  },
  "financial": {
    "all": ["read"]
  },
  "audit": {
    "audit_trails": ["read", "export"],
    "user_actions": ["read", "analyze"],
    "compliance_reports": ["generate", "export"]
  },
  "reports": ["all_read_only"]
}
```

### **Audit Trail Access:**
```sql
-- Auditor can see all audit logs
CREATE POLICY "auditor_full_audit_access" ON audit_logs
FOR SELECT USING (
  auth.uid() IN (
    SELECT id FROM user_profiles WHERE role = 'auditor'
  )
);
```

### **Responsibilities:**
- Review audit trails and user actions
- Monitor compliance with policies
- Generate audit reports
- Identify anomalies and irregularities
- Review approval workflows
- Track policy adherence
- Report findings to management
- Verify internal controls

### **Dashboard Access:**
- All Dashboards ✅ (Read-Only)
- Audit Trail Viewer ✅
- Compliance Reports ✅
- User Activity Logs ✅

---

## 📊 PERMISSIONS MATRIX

### Inventory Module

| Permission | Admin | Store Keeper | Dept Head | Purchasing | L1 | L2 | GM | Finance | Auditor |
|------------|-------|--------------|-----------|------------|----|----|----|---------|---------||
| Create Items | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Items | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Edit Items | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete Items | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Stock | ✅ | ✅* | ✅* | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Adjust Stock | ✅ | ✅* | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Transfer Stock | ✅ | ✅* | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Physical Count | ✅ | ✅* | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

\* *Limited to assigned location/department*

### Procurement Module

| Permission | Admin | Store Keeper | Dept Head | Purchasing | L1 | L2 | GM | Finance | Auditor |
|------------|-------|--------------|-----------|------------|----|----|----|---------|---------||
| Create PR | ✅ | ✅* | ✅* | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View PR | ✅ | ✅* | ✅* | ✅ | ✅† | ✅† | ✅ | ✅ | ✅ |
| Edit PR | ✅ | ✅* | ✅* | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Approve PR <50K | ✅ | ❌ | ✅* | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Approve PR 50-200K | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Approve PR >200K | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Create PO | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| View PO | ✅ | ✅* | ✅* | ✅ | ✅† | ✅† | ✅ | ✅ | ✅ |
| Edit PO | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Create GRN | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| View GRN | ✅ | ✅* | ✅* | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Manage Vendors | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |

\* *Limited to own department*
† *Only items awaiting their approval*

### Financial Module

| Permission | Admin | Store Keeper | Dept Head | Purchasing | L1 | L2 | GM | Finance | Auditor |
|------------|-------|--------------|-----------|------------|----|----|----|---------|---------||
| View GL | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Post GL | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| View Budgets | ✅ | ❌ | ✅* | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Edit Budgets | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Invoice Match | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Process Payments | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |

\* *Department budget only*

---

## 🔄 WORKFLOW SCENARIOS

### Scenario 1: Purchase Requisition <PKR 50,000

```
1. Store Keeper creates PR for "Office Supplies - PKR 15,000"
2. System auto-routes to Department Head (Kitchen)
3. Dept Head reviews and approves PR
4. System routes to Approver L1
5. L1 approves PR (under 50K limit)
6. PR status: APPROVED
7. Purchasing Officer converts PR to PO
8. PO sent to vendor
9. Vendor delivers goods
10. Purchasing Officer creates GRN
11. Finance Officer matches Invoice-PO-GRN
12. Finance Officer posts GL entry
13. Finance processes payment to vendor
```

### Scenario 2: Purchase Requisition PKR 50K-200K

```
1. Department Head creates PR for "Kitchen Equipment - PKR 125,000"
2. System auto-routes to Approver L2 (bypasses L1)
3. L2 reviews budget and approves PR
4. PR status: APPROVED
5. Purchasing Officer converts PR to PO
6. (Rest of workflow same as Scenario 1)
```

### Scenario 3: Purchase Requisition >PKR 200K

```
1. Department Head creates PR for "Industrial Oven - PKR 350,000"
2. System auto-routes to General Manager (L3)
3. GM reviews business case and approves PR
4. PR status: APPROVED
5. Purchasing Officer converts PR to PO
6. Price variance detected: 12% higher than estimate
7. System requires GM approval for price variance >10%
8. GM approves price variance
9. PO sent to vendor
10. (Rest of workflow same as Scenario 1)
```

### Scenario 4: Stock Adjustment >PKR 10,000

```
1. Store Keeper creates stock adjustment for "Theft - Rice 50kg - PKR 12,500"
2. System requires approval (threshold >10K)
3. System routes to General Manager
4. GM reviews incident report and approves adjustment
5. System updates stock levels
6. Finance Officer posts GL entry (Dr. Loss, Cr. Inventory)
7. Auditor reviews audit trail for compliance
```

---

## 📱 MOBILE ACCESS

### Approval on Mobile

All approvers (L1, L2, L3/GM) have mobile-optimized approval interface:
- ✅ Email notification with approve/reject links
- ✅ In-app notifications
- ✅ Mobile-responsive approval dashboard
- ✅ One-click approve/reject
- ✅ Quick comment entry
- ✅ Document preview

### Mobile Workflows:
```javascript
// Email notification template
Subject: [ACTION REQUIRED] PR-2025-001 awaits your approval

Dear [Approver Name],

A new purchase requisition requires your approval:

PR Number: PR-2025-001
Requestor: Ahmed Hassan (Kitchen)
Amount: PKR 45,000
Description: Monthly kitchen supplies

[APPROVE] [REJECT] [VIEW DETAILS]

This PR will auto-escalate if not approved within 48 hours.
```

---

## 🔒 SECURITY & COMPLIANCE

### Password Policy
- Minimum 12 characters
- Must include: uppercase, lowercase, number, special character
- Password expiry: 90 days
- Cannot reuse last 5 passwords
- 2FA optional for L2, L3, Finance, Auditor roles

### Session Management
- Session timeout: 30 minutes of inactivity
- Concurrent sessions: Maximum 2 per user
- Force logout on password change
- IP whitelisting option for sensitive roles

### Audit Trail
All user actions are logged:
- Login/logout
- Create/edit/delete operations
- Approval/rejection actions
- Report generation
- Export data
- Configuration changes

### Row-Level Security (RLS)
All tables have RLS policies enforcing role-based access:
```sql
-- Example: Store Keeper can only see their location's stock
CREATE POLICY "storekeeper_location_access"
ON inventory_stock_levels FOR SELECT
USING (
  location_id IN (
    SELECT unnest(assigned_locations)
    FROM user_profiles
    WHERE id = auth.uid() AND role = 'store_keeper'
  )
);
```

---

## 🧭 NAVIGATION ACCESS CONTROL

### **CRITICAL: Role-Based Sidebar Filtering** 🚨

**Requirement**: Inventory & Procurement users should ONLY see Inventory & Procurement modules in the sidebar. They must NOT see Executive, Business, Financial, HR, Facilities, or Islamic Services dashboards.

**Implementation**: The sidebar navigation in `src/app/dashboard/layout.tsx` must filter menu items based on `user_profiles.role` using Row-Level Security (RLS) or client-side filtering.

---

### Sidebar Sections Overview

The Rahah24 dashboard has the following sidebar sections:

1. **Executive** - Dashboard Overview, KPI Analytics, AI Insights
2. **Business Operations** - Restaurant, Madrasa, Events, Gym
3. **Financial Management** - General Ledger, Accounts, Journal Entries, Reports
4. **Academic Affairs** - Fee Collection, Students, Sponsorship
5. **Human Resources** - Employees, Attendance, Payroll, Departments
6. **Inventory & Procurement** - Inventory, Stock, PRs, POs, GRN, Vendors
7. **Facilities & Operations** - Facilities, Utilities, Rent, Maintenance
8. **Islamic Services** - Qurbani, Donations, Zakat, Events, Feedback
9. **Settings** - System Settings & Configuration

---

### Navigation Access Matrix

| Sidebar Section | Admin | Store Keeper | Dept Head | Purchasing | L1 | L2 | GM | Finance | Auditor |
|----------------|-------|--------------|-----------|------------|----|----|----|---------|---------||
| **1. Executive** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **2. Business Operations** | ✅ | ❌ | ✅* | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **3. Financial Management** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **4. Academic Affairs** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **5. Human Resources** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **6. Inventory & Procurement** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **7. Facilities & Operations** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **8. Islamic Services** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **9. Settings** | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |

**Legend:**
- ✅ = Full access to section
- ❌ = No access (section hidden in sidebar)
- ⚠️ = Limited access (profile settings only, no system config)
- \* = Department Head (Kitchen) sees only Restaurant > Recipe Costing

---

### Detailed Access by Role

#### **ROLE 1: System Administrator**
**Sidebar Access**: ALL sections ✅

```typescript
allowedSections: [
  'executive',
  'business',
  'financial',
  'academic_affairs',
  'hr',
  'inventory_procurement',
  'facilities_operations',
  'islamic',
  'settings'
]
```

---

#### **ROLE 2: Store Keeper**
**Sidebar Access**: Inventory & Procurement ONLY ✅

```typescript
allowedSections: [
  'inventory_procurement'
]

visibleMenuItems: [
  '/dashboard/inventory',
  '/dashboard/inventory/stock-levels',
  '/dashboard/inventory/department-requisitions',
  '/dashboard/inventory/expiry-warranty',
]
```

**Hidden Sections**: Executive, Business, Financial, Academic, HR, Facilities, Islamic ❌

---

#### **ROLE 3: Department Head (Kitchen)**
**Sidebar Access**: Inventory & Procurement + Recipe Costing ✅

```typescript
allowedSections: [
  'business.restaurant.recipe-costing', // Special access
  'inventory_procurement'
]

visibleMenuItems: [
  '/dashboard/business/restaurant/menu', // Recipe viewing only
  '/dashboard/inventory/recipe-costing',
  '/dashboard/procurement/requisitions',
  '/dashboard/inventory/department-requisitions',
]
```

**Hidden Sections**: Executive, Financial, Academic, HR, Facilities, Islamic ❌

---

#### **ROLE 4: Purchasing Officer**
**Sidebar Access**: Inventory & Procurement ONLY ✅

```typescript
allowedSections: [
  'inventory_procurement'
]

visibleMenuItems: [
  '/dashboard/inventory',
  '/dashboard/procurement/requisitions',
  '/dashboard/procurement/purchase-orders',
  '/dashboard/procurement/grn',
  '/dashboard/procurement/vendors',
  '/dashboard/procurement/analytics',
]
```

**Hidden Sections**: Executive, Business, Financial, Academic, HR, Facilities, Islamic ❌

---

#### **ROLE 5: Approver Level 1**
**Sidebar Access**: Procurement Approvals ONLY ✅

```typescript
allowedSections: [
  'inventory_procurement'
]

visibleMenuItems: [
  '/dashboard/procurement/requisitions', // Approval interface only
  '/dashboard/procurement/purchase-orders', // View only
]
```

**Hidden Sections**: Executive, Business, Financial, Academic, HR, Facilities, Islamic ❌

---

#### **ROLE 6: Approver Level 2**
**Sidebar Access**: Procurement Approvals ONLY ✅

```typescript
allowedSections: [
  'inventory_procurement'
]

visibleMenuItems: [
  '/dashboard/procurement/requisitions', // Approval interface only
  '/dashboard/procurement/purchase-orders', // View only
  '/dashboard/procurement/analytics', // Budget tracking
]
```

**Hidden Sections**: Executive, Business, Financial, Academic, HR, Facilities, Islamic ❌

---

#### **ROLE 7: General Manager (Level 3)**
**Sidebar Access**: Inventory & Procurement ONLY ✅

```typescript
allowedSections: [
  'inventory_procurement'
]

visibleMenuItems: [
  '/dashboard/inventory', // Full inventory access
  '/dashboard/procurement/requisitions',
  '/dashboard/procurement/purchase-orders',
  '/dashboard/procurement/grn',
  '/dashboard/procurement/vendors',
  '/dashboard/procurement/analytics',
]
```

**Hidden Sections**: Executive, Business, Financial, Academic, HR, Facilities, Islamic ❌

---

#### **ROLE 8: Finance Officer**
**Sidebar Access**: Financial + Inventory & Procurement ✅

```typescript
allowedSections: [
  'financial',
  'inventory_procurement'
]

visibleMenuItems: [
  // Financial Section
  '/dashboard/finance',
  '/dashboard/finance/accounts',
  '/dashboard/finance/journal-entries',
  '/dashboard/finance/accounts-payable',
  '/dashboard/finance/reports',

  // Inventory Section
  '/dashboard/procurement/grn', // For invoice matching
  '/dashboard/procurement/purchase-orders', // For GL posting
  '/dashboard/procurement/analytics',
]
```

**Hidden Sections**: Executive, Business, Academic, HR, Facilities, Islamic ❌

---

#### **ROLE 9: Auditor**
**Sidebar Access**: Financial + Inventory & Procurement (Read-Only) ✅

```typescript
allowedSections: [
  'financial',
  'inventory_procurement'
]

visibleMenuItems: [
  // Financial Section (Read-Only)
  '/dashboard/finance',
  '/dashboard/finance/accounts',
  '/dashboard/finance/journal-entries',
  '/dashboard/finance/reports',

  // Inventory Section (Read-Only)
  '/dashboard/inventory',
  '/dashboard/procurement/requisitions',
  '/dashboard/procurement/purchase-orders',
  '/dashboard/procurement/grn',
  '/dashboard/procurement/vendors',
  '/dashboard/procurement/analytics',
]
```

**Hidden Sections**: Executive, Business, Academic, HR, Facilities, Islamic ❌

---

### Implementation Guidelines

#### **1. Client-Side Filtering (Recommended)**

Update `src/app/dashboard/layout.tsx` to filter `navItems` based on user role:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUserRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        setUserRole(profile?.role || null);
      }
    }
    getUserRole();
  }, []);

  // Define role-based section visibility
  const getSectionVisibility = (sectionLabel: string): boolean => {
    if (userRole === 'admin') return true;

    const rolePermissions: Record<string, string[]> = {
      'store_keeper': ['inventory_procurement'],
      'dept_head_kitchen': ['inventory_procurement', 'business'],
      'purchasing_officer': ['inventory_procurement'],
      'approver_l1': ['inventory_procurement'],
      'approver_l2': ['inventory_procurement'],
      'gm': ['inventory_procurement'],
      'finance_officer': ['financial', 'inventory_procurement'],
      'auditor': ['financial', 'inventory_procurement'],
    };

    const allowedSections = rolePermissions[userRole || ''] || [];
    return allowedSections.includes(sectionLabel);
  };

  // Filter navItems based on role
  const filteredNavItems = navItems.filter(item => {
    if ('type' in item && item.type === 'section') {
      return getSectionVisibility(item.label);
    }
    if ('type' in item && item.type === 'divider') {
      return userRole === 'admin'; // Only show dividers for admin
    }
    return true; // Individual items (like Settings)
  });

  // ... rest of layout code using filteredNavItems instead of navItems
}
```

#### **2. Row-Level Security (RLS) Policies**

While sidebar filtering is client-side, ensure RLS policies prevent unauthorized API access:

```sql
-- Example: Prevent non-admin users from accessing executive dashboard data
CREATE POLICY "inventory_users_no_executive_data"
ON executive_kpis FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM user_profiles WHERE role = 'admin'
  )
);

-- Example: Ensure inventory users can only query their module tables
CREATE POLICY "inventory_module_access"
ON inventory_items FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM user_profiles
    WHERE role IN ('admin', 'store_keeper', 'dept_head_kitchen', 'purchasing_officer', 'approver_l1', 'approver_l2', 'gm', 'finance_officer', 'auditor')
  )
);
```

#### **3. Menu Item Filtering (Granular)**

For fine-grained control within sections, filter individual menu items:

```typescript
const getMenuItemVisibility = (href: string): boolean => {
  if (userRole === 'admin') return true;

  const roleMenuItems: Record<string, string[]> = {
    'store_keeper': [
      '/dashboard/inventory',
      '/dashboard/inventory/stock-levels',
      '/dashboard/inventory/department-requisitions',
      '/dashboard/inventory/expiry-warranty',
    ],
    'purchasing_officer': [
      '/dashboard/inventory',
      '/dashboard/procurement/requisitions',
      '/dashboard/procurement/purchase-orders',
      '/dashboard/procurement/grn',
      '/dashboard/procurement/vendors',
      '/dashboard/procurement/analytics',
    ],
    // ... other roles
  };

  const allowedMenuItems = roleMenuItems[userRole || ''] || [];
  return allowedMenuItems.some(allowedHref =>
    href === allowedHref || href.startsWith(allowedHref + '/')
  );
};
```

#### **4. Redirect on Unauthorized Access**

Add middleware to redirect users accessing unauthorized routes:

```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(/* ... */);
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role;
    const pathname = request.nextUrl.pathname;

    // Inventory users trying to access non-inventory routes
    const inventoryRoles = ['store_keeper', 'purchasing_officer', 'approver_l1', 'approver_l2', 'gm'];
    if (inventoryRoles.includes(role) && !pathname.startsWith('/dashboard/inventory') && !pathname.startsWith('/dashboard/procurement')) {
      return NextResponse.redirect(new URL('/dashboard/inventory', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
```

---

### Testing Navigation Restrictions

**Test Plan**:
1. Login as `storekeeper@rahah24.com`
   - ✅ Should see: Inventory & Procurement section only
   - ❌ Should NOT see: Executive, Business, Financial, HR, etc.

2. Login as `purchasing@rahah24.com`
   - ✅ Should see: Full Inventory & Procurement menu
   - ❌ Should NOT see: Executive, Business, Financial, HR, etc.

3. Login as `finance@rahah24.com`
   - ✅ Should see: Financial + Inventory & Procurement
   - ❌ Should NOT see: Executive, Business, HR, etc.

4. Login as `admin@rahah24.com`
   - ✅ Should see: ALL sections

5. Try accessing restricted URLs directly (e.g., `/dashboard/hr` as store keeper)
   - ❌ Should redirect to `/dashboard/inventory` or show 403 error

---

## 📞 SUPPORT & TRAINING

### User Training Plan
- **Week 1**: Admin, Purchasing Officer, Finance Officer
- **Week 2**: Store Keeper, Department Heads
- **Week 3**: Approvers L1-L3
- **Week 4**: Auditor, refresher for all roles

### Training Materials
- Video tutorials for each role
- User manuals (role-specific)
- Quick reference cards
- FAQ documents
- Live demo sessions

### Support Channels
- **Email**: support@rahah24.com
- **Phone**: +92-XXX-XXXXXXX
- **In-app**: Help center with searchable knowledge base
- **Escalation**: Admin can create support tickets

---

**Document Version**: 1.1
**Last Updated**: 2025-10-25
**Next Review**: 2025-11-25
**Owner**: Rahah24 Development Team
**Changes**: v1.1 - Added Navigation Access Control section with comprehensive sidebar filtering guidelines
