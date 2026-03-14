# Rahah24 ERP — AI-Enabled Enterprise Resource Planning Platform

> **راحت آپ کے لئے، حساب ہمارے لئے**
> *Comfort for you, accountability for us.*

Rahah24 ERP is a comprehensive, AI-enabled management platform designed for **Jamia Binoria Aalamia** (SITE, Karachi). It unifies restaurant operations, inventory, procurement, donations, finance, HR, and Islamic services into a single cloud-based system.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.3.3 (App Router) |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS + shadcn/ui (Radix UI) |
| Charts | Recharts |
| AI | Google Genkit (Gemini 2.0 Flash) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + RBAC |
| State | Tanstack React Query |
| Dev Server | Turbopack (port 9002) |

---

## How the ERP Works

```mermaid
flowchart TD
    subgraph INPUT["📥 Inputs"]
        POS_IN[Restaurant Orders\nDine-in · Takeaway · Delivery]
        PROC_IN[Purchase Requisitions\nFrom Departments]
        DON_IN[Donations\nCash + In-Kind]
        QUR_IN[Qurbani Bookings\nAnimal + Share Requests]
        SAL_IN[Sales Orders\nCustomer Invoices]
    end

    subgraph OPS["⚙️ Core Operations"]
        APPROVAL[3-Level\nApproval Workflow]
        INVENTORY[Inventory\nStock Management]
        RECIPE[Recipe Costing\nFood Cost %]
        KITCHEN[Kitchen Display\nKOT Management]
        LOYALTY[Loyalty Program\nPoints & Tiers]
    end

    subgraph FINANCE["💰 Financial Layer"]
        GL[General Ledger]
        AP[Accounts Payable\nSupplier Payments]
        AR[Accounts Receivable\nCustomer Receipts]
        BUDGET[Budget &\nCost Centers]
    end

    subgraph OUTPUT["📊 Outputs"]
        REPORTS[16 Report Types\nAP Aging · Stock · GRN History]
        ALERTS[Automated Alerts\nLow Stock · Expiry · Cost Variance]
        AI_OUT[AI Insights\nForecasting · Anomaly Detection]
        RECEIPTS[Receipts & Slips\nDonation · Qurbani · POS]
    end

    POS_IN --> KITCHEN --> INVENTORY --> RECIPE
    PROC_IN --> APPROVAL --> INVENTORY
    APPROVAL --> AP
    DON_IN --> GL
    QUR_IN --> INVENTORY
    SAL_IN --> AR

    RECIPE --> FINANCE
    INVENTORY --> FINANCE
    LOYALTY --> POS_IN

    FINANCE --> GL --> REPORTS
    FINANCE --> BUDGET --> ALERTS
    REPORTS --> AI_OUT
    GL --> RECEIPTS

    style INPUT fill:#f0f9ff,stroke:#0ea5e9
    style OPS fill:#f0fdf4,stroke:#22c55e
    style FINANCE fill:#fefce8,stroke:#eab308
    style OUTPUT fill:#fdf4ff,stroke:#a855f7
```

---

## System Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        UI[Next.js 15 App Router]
        TW[Tailwind CSS + shadcn/ui]
    end

    subgraph Modules["Business Modules"]
        POS[🍽️ Restaurant POS]
        INV[📦 Inventory]
        PRO[🛒 Procurement]
        FIN[💰 Finance & Donations]
        QUR[🐑 Qurbani]
        SAL[🧾 Sales]
        HR[👥 HR]
        RPT[📊 Reports]
        ADM[⚙️ Admin]
    end

    subgraph Backend["Backend & Services"]
        SB[(Supabase PostgreSQL)]
        AUTH[Supabase Auth RBAC]
        AI[Google Genkit AI]
    end

    UI --> Modules
    Modules --> SB
    Modules --> AUTH
    Modules --> AI
```

---

## Procurement Workflow

```mermaid
flowchart LR
    PR[📋 Purchase\nRequisition] -->|3-level approval| APR{Approvals}
    APR -->|Approved| PO[🛍️ Purchase\nOrder]
    APR -->|Rejected| REJ[❌ Rejected]
    PO -->|Goods received| GRN[📦 Goods Receipt\nNote GRN]
    GRN -->|Invoice matched| INV[🧾 Purchase\nInvoice]
    INV -->|Finance approved| PAY[💳 Supplier\nPayment]
    PAY --> LED[📒 GL Ledger\nPosting]

    style PR fill:#e0f2fe,stroke:#0284c7
    style PO fill:#fef3c7,stroke:#d97706
    style GRN fill:#dcfce7,stroke:#16a34a
    style INV fill:#f3e8ff,stroke:#9333ea
    style PAY fill:#d1fae5,stroke:#059669
```

---

## POS Order Flow

```mermaid
sequenceDiagram
    participant C as Cashier
    participant POS as POS Terminal
    participant KDS as Kitchen Display
    participant K as Kitchen Staff

    C->>POS: Select Order Type + Items
    C->>POS: Apply Discount / Note
    C->>POS: Print KOT
    POS->>KDS: KOT appears in NEW column
    K->>KDS: Click "Start" → PREPARING
    K->>KDS: Click "Mark Ready" → READY
    C->>POS: Pay & Close
    POS-->>C: Receipt printed
```

---

## User Role Hierarchy

```mermaid
graph TD
    ADMIN[👑 Admin\nFull Access]
    MGR[🏢 Manager\nAll except Admin]
    GM[🎯 General Manager\nOperations + Finance]
    FIN[💰 Finance Officer\nFinance + Reports]
    PUR[🛒 Purchasing Officer\nProcurement + Returns]
    APL1[✅ Approver L1]
    APL2[✅ Approver L2]
    SK[🏪 Store Keeper\nInventory + GRN]
    DH[🍳 Dept Head Kitchen\nPOS + Production]
    AUD[🔍 Auditor\nRead Only]

    ADMIN --> MGR
    ADMIN --> GM
    GM --> FIN
    GM --> PUR
    PUR --> APL1
    APL1 --> APL2
    APL2 --> SK
    GM --> DH
    FIN --> AUD
```

---

## Module Dependency Map

```mermaid
graph LR
    INV[Inventory] --> POS[POS Terminal]
    INV --> REC[Recipe Costing]
    REC --> POS
    PRO[Procurement\nPR→PO→GRN] --> INV
    PRO --> FIN[Finance & GL]
    POS --> FIN
    POS --> KDS[Kitchen Display]
    POS --> LOY[Loyalty Program]
    DON[Donations] --> FIN
    QUR[Qurbani] --> INV
    SAL[Sales] --> FIN
    FIN --> RPT[Reports\n16 types]
    INV --> RPT
    PRO --> RPT
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
npm run dev        # http://localhost:9002
npm run build      # Production build
npm run typecheck  # TypeScript check
```

### Demo Login
```
Email:    admin@rahah24.com
Password: Admin123!@#
```
Or use the quick-login chips on the landing page (Admin / Manager / Finance).

---

## Implemented Modules

### 1. Restaurant POS & Operations
Full point-of-sale system for a Pakistani restaurant.

| Page | Description |
|---|---|
| POS Terminal | 3-panel terminal: order types, menu grid, cart + payment |
| Kitchen Display | Live KDS — NEW / PREPARING / READY columns with timers |
| Table Management | Visual floor plan, zone filters, status tracking |
| Order History | 15+ orders, all 6 types, receipt dialog |
| KOT History | Kitchen Order Ticket log with reprint |
| Menu Management | 50 Pakistani dishes, Urdu names, spicy dots, margin calc |
| Combo Deals | 8 combo bundles with save %, bestseller badges |
| Loyalty Program | Silver / Gold / Platinum tiers, points, redeem dialog |
| Cashier Shift | Open/close shift, cash count, variance, Z-report |
| Voids & Refunds | Manager PIN auth, audit trail |
| Event Booking | Calendar UI, hall selector |

**Order Types**: Takeaway · Dine-in · Delivery · Booking · Mess · Staff
**Payments**: Cash · Card · JazzCash · Easypaisa · Bank Transfer

---

### 2. Inventory Management (14 Sub-Modules)
Complete warehouse and stock management system.

- Inventory Dashboard with KPIs
- Stock Levels (multi-location)
- Stock Issues, Transfers, Adjustments
- Physical Stock Count with variance
- Items Master & Categories
- Recipe Costing (BOM, ideal vs actual, food cost %)
- Reports & Alerts

---

### 3. Procurement & Purchasing
End-to-end purchasing workflow: PR → PO → GRN → Invoice → Payment.

- Purchase Requisitions (PR-YYYYMM-NNNN)
- Purchase Orders (PO-YYYYMM-NNNN)
- Goods Receipt Notes (GRN-YYYYMM-NNNN)
- Purchase Invoices (PINV-YYYYMM-NNNN)
- Supplier Payments
- Vendor / Supplier Master

---

### 4. Approvals
Multi-level approval workflow system.

- Pending Approvals queue (SLA progress bars)
- Approve Requisitions, Returns, Finance, Payments, Inventory
- Approval History (unified log matching real ERP)

---

### 5. Finance & Donations
- Finance Overview (Cost Centers)
- Donation Entry (cash + in-kind)
- Donor Management
- Income, Expenses, Cashbook, Budget
- Zakat Management

---

### 6. Qurbani Management (Islamic Services)
- Animal tracking (Cow, Goat) with share allocation
- Booking, Slips, Costing, Distribution

---

### 7. Sales
- Customer Orders, Delivery Notes
- Sales Invoices, Customer Receipts
- Customer Master

---

### 8. Production
- Bill of Materials (BOM)
- Work Orders with yield management

---

### 9. Returns
- Purchase Returns (PR-2026-NNNN workflow)
- Sales Returns

---

### 10. Reports (16 types)
AP Aging · Stock Position · Stock Ledger · Low Stock · Expiry Alerts · Price History · Dept Performance · Recipe Variance · PO List · GRN History · Invoice History · Internal Requisitions · Stock Valuation · Vendor Performance · Report Builder

---

### 11. Admin Panel
- Company Settings (multi-entity)
- Role Master & Permissions Matrix
- User Management
- Warehouse Configuration
- Workflow Configuration
- Audit Log

---

## Navigation Structure

```
Dashboard
├── Point of Sale
│   ├── POS Terminal
│   ├── Kitchen Display
│   ├── Table Management
│   ├── Order History
│   ├── KOT History
│   ├── Menu Management
│   ├── Combo Deals
│   ├── Loyalty Program
│   ├── Cashier Shift
│   ├── Voids & Refunds
│   └── Event Booking
├── Procurement
│   ├── Purchase Requisitions
│   ├── Purchase Orders
│   ├── Goods Receipt Notes
│   ├── Purchase Invoices
│   ├── Supplier Payments
│   └── Vendors / Suppliers
├── Approvals
│   ├── Pending Approvals
│   ├── Approve Requisitions / Returns / Finance / Payments / Inventory
│   └── Approval History
├── Inventory (14 sub-modules)
├── Production (BOM, Work Orders)
├── Sales (Orders, Invoices, Receipts)
├── Returns (Purchase, Sales)
├── Finance & Donations
├── Qurbani Management
├── Reports (16 types)
├── Alerts
└── Admin (Users, Roles, Settings, Audit)
```

---

## User Roles

| Role | Access |
|---|---|
| admin | Full system access |
| manager | All modules except admin |
| gm | Procurement, Approvals, Finance, POS, Sales, Reports |
| purchasing_officer | Procurement, Approvals, Inventory, Returns |
| approver_l1 / l2 | Procurement, Approvals, Inventory |
| store_keeper | Procurement, Approvals, Inventory |
| finance_officer | Finance, Donations, Procurement, Reports |
| dept_head_kitchen | POS, Inventory, Production, Procurement |
| auditor | Read-only: Finance, Inventory, Reports |

---

## Multi-Company Architecture

The system supports multiple entities under one installation:
- Main System Company
- JAMIA COMMERCIAL BUSINESS
- JAMIA BINORIA AALAMIA
- MADERSA TEHFEEZUL QURAN

---

## AI Features

- Predictive inventory forecasting
- Food cost variance alerts
- KPI insights per department
- Pattern-based fraud monitoring
- AI chatbot assistant (Rahah24 bot)

---

## Document Numbering (Real ERP Format)

```
PR-YYYYMM-NNNN    Purchase Requisition
PO-YYYYMM-NNNN    Purchase Order
GRN-YYYYMM-NNNN   Goods Receipt Note
PINV-YYYYMM-NNNN  Purchase Invoice
LYL-YYYY-NNNN     Loyalty Card
BKG-NNNN          Event Booking
KOT-NNNN          Kitchen Order Ticket
```

---

## Currency

All financial values are displayed in **PKR (Pakistani Rupees)**. Format: `Rs. 18,750` or `PKR 18,750`.

---

## License

Proprietary software developed for Jamia Binoria Aalamia. All rights reserved.
© 2026 Rahah24 ERP Systems.

---
