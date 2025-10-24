# Inventory Management System - Architecture Documentation
## Rahah24 ERP - Operations Module

---

**Document Version**: 1.0
**Last Updated**: October 25, 2025
**Status**: Active Development
**Author**: Rahah24 Development Team

---

## 📋 Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Component Architecture](#component-architecture)
3. [Data Flow Architecture](#data-flow-architecture)
4. [Deployment Architecture](#deployment-architecture)
5. [Security Architecture](#security-architecture)
6. [Integration Architecture](#integration-architecture)
7. [Scalability & Performance](#scalability--performance)

---

## 🏗️ System Architecture Overview

### High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Browser<br/>Next.js 15.3.3]
        MOBILE[Mobile Browser<br/>Responsive UI]
    end

    subgraph "Presentation Layer"
        NEXTJS[Next.js App Router<br/>React 18 + TypeScript]
        UI[shadcn/ui Components<br/>Tailwind CSS]
        CHARTS[Recharts<br/>Data Visualization]
        FORMS[React Hook Form<br/>Zod Validation]
    end

    subgraph "Application Layer"
        API[API Routes<br/>/api/v1/inventory/*]
        AUTH[Authentication<br/>Supabase Auth]
        RBAC[Role-Based Access Control<br/>7 User Roles]
        WORKFLOWS[Approval Workflows<br/>3-Level System]
    end

    subgraph "Business Logic Layer"
        INV[Inventory Management<br/>14 Modules]
        PURCHASE[Purchase & Procurement<br/>PR → PO → GRN]
        VENDOR[Vendor Management<br/>Performance Tracking]
        ALERTS[Alert System<br/>10 Alert Types]
        REPORTS[Reporting Engine<br/>16 Report Types]
    end

    subgraph "AI & Analytics Layer"
        GENKIT[Google Genkit<br/>Gemini 2.0 Flash]
        INSIGHTS[AI Insights<br/>Anomaly Detection]
        FORECAST[Demand Forecasting<br/>Predictive Analytics]
    end

    subgraph "Data Layer"
        SUPABASE[Supabase PostgreSQL<br/>32 Tables]
        RLS[Row Level Security<br/>Policy Enforcement]
        CACHE[React Query Cache<br/>State Management]
    end

    subgraph "External Systems"
        EMAIL[Email Service<br/>Notifications]
        SMS[SMS Gateway<br/>Alerts]
        ACCOUNTING[Accounting Module<br/>GL Integration]
    end

    WEB --> NEXTJS
    MOBILE --> NEXTJS
    NEXTJS --> UI
    NEXTJS --> CHARTS
    NEXTJS --> FORMS
    UI --> API
    CHARTS --> API
    FORMS --> API
    API --> AUTH
    API --> RBAC
    API --> WORKFLOWS
    AUTH --> INV
    RBAC --> INV
    WORKFLOWS --> PURCHASE
    INV --> PURCHASE
    INV --> VENDOR
    INV --> ALERTS
    INV --> REPORTS
    PURCHASE --> GENKIT
    VENDOR --> GENKIT
    GENKIT --> INSIGHTS
    GENKIT --> FORECAST
    INV --> SUPABASE
    PURCHASE --> SUPABASE
    VENDOR --> SUPABASE
    SUPABASE --> RLS
    API --> CACHE
    ALERTS --> EMAIL
    ALERTS --> SMS
    INV --> ACCOUNTING
```

### Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15.3.3 + React 18 | Server-side rendering, routing |
| **UI Framework** | Tailwind CSS + shadcn/ui | Component library, styling |
| **State Management** | Tanstack React Query | Server state, caching |
| **Database** | Supabase PostgreSQL 17.4.1 | Primary data store |
| **Authentication** | Supabase Auth | User authentication |
| **AI/ML** | Google Genkit + Gemini 2.0 | Insights, forecasting |
| **Charts** | Recharts | Data visualization |
| **Forms** | React Hook Form + Zod | Form handling, validation |
| **Icons** | Lucide React | Icon library |

---

## 🧩 Component Architecture

### Frontend Component Hierarchy

```mermaid
graph TD
    subgraph "Root Layout"
        APP[app/layout.tsx<br/>Theme Provider]
    end

    subgraph "Dashboard Module"
        DASH[dashboard/page.tsx<br/>Executive Dashboard]
        DASHKPI[KPI Cards Component]
        DASHCHARTS[Chart Components]
        DASHTABLE[Data Tables]
    end

    subgraph "Inventory Module"
        INV_LAYOUT[inventory/layout.tsx<br/>Inventory Navigation]

        subgraph "Stock Management"
            STOCK_LIST[Stock List View]
            STOCK_DETAIL[Item Detail View]
            STOCK_ADJ[Stock Adjustment Form]
            STOCK_LEVELS[Min/Max Configuration]
        end

        subgraph "Purchase Management"
            PR_LIST[Purchase Requisitions]
            PR_FORM[Create PR Form]
            PO_LIST[Purchase Orders]
            PO_FORM[Create PO Form]
            GRN_LIST[Goods Receipt Notes]
            GRN_FORM[GRN Processing]
        end

        subgraph "Vendor Management"
            VENDOR_LIST[Vendor Directory]
            VENDOR_DETAIL[Vendor Profile]
            VENDOR_PERF[Performance Dashboard]
            VENDOR_FORM[Vendor Registration]
        end

        subgraph "Department Requisitions"
            DEPT_REQ[Requisition List]
            DEPT_FORM[Create Requisition]
            DEPT_ISSUE[Issue Slip]
            DEPT_APPROVE[Approval Workflow]
        end

        subgraph "Reporting"
            REPORT_LIST[Report Directory]
            REPORT_VIEW[Report Viewer]
            REPORT_EXPORT[Export Manager]
        end
    end

    subgraph "Shared Components"
        UI_BUTTON[Button]
        UI_FORM[Form Controls]
        UI_TABLE[Data Table]
        UI_DIALOG[Dialog/Modal]
        UI_CARD[Card]
        UI_CHART[Chart Wrapper]
        UI_ALERT[Alert/Toast]
    end

    APP --> DASH
    APP --> INV_LAYOUT
    DASH --> DASHKPI
    DASH --> DASHCHARTS
    DASH --> DASHTABLE
    INV_LAYOUT --> STOCK_LIST
    INV_LAYOUT --> PR_LIST
    INV_LAYOUT --> VENDOR_LIST
    INV_LAYOUT --> DEPT_REQ
    INV_LAYOUT --> REPORT_LIST
    STOCK_LIST --> STOCK_DETAIL
    STOCK_DETAIL --> STOCK_ADJ
    STOCK_DETAIL --> STOCK_LEVELS
    PR_LIST --> PR_FORM
    PR_LIST --> PO_LIST
    PO_LIST --> PO_FORM
    PO_LIST --> GRN_LIST
    GRN_LIST --> GRN_FORM
    VENDOR_LIST --> VENDOR_DETAIL
    VENDOR_DETAIL --> VENDOR_PERF
    VENDOR_LIST --> VENDOR_FORM
    DEPT_REQ --> DEPT_FORM
    DEPT_REQ --> DEPT_ISSUE
    DEPT_REQ --> DEPT_APPROVE
    REPORT_LIST --> REPORT_VIEW
    REPORT_VIEW --> REPORT_EXPORT
    DASHKPI --> UI_CARD
    PR_FORM --> UI_FORM
    STOCK_LIST --> UI_TABLE
    STOCK_ADJ --> UI_DIALOG
    DASHCHARTS --> UI_CHART
    DEPT_APPROVE --> UI_ALERT
```

### API Route Architecture

```mermaid
graph LR
    subgraph "API Routes /api/v1/inventory/"
        subgraph "Items API"
            ITEMS_GET[GET /items<br/>List items]
            ITEMS_POST[POST /items<br/>Create item]
            ITEMS_PATCH[PATCH /items/:id<br/>Update item]
            ITEMS_DELETE[DELETE /items/:id<br/>Delete item]
        end

        subgraph "Stock API"
            STOCK_GET[GET /stock/:id<br/>Get stock levels]
            STOCK_ADJ[POST /stock/adjust<br/>Adjust stock]
            STOCK_TRANSFER[POST /stock/transfer<br/>Transfer stock]
            STOCK_COUNT[POST /stock/count<br/>Physical count]
        end

        subgraph "Purchase API"
            PR_GET[GET /purchases/requisitions<br/>List PRs]
            PR_POST[POST /purchases/requisitions<br/>Create PR]
            PR_APPROVE[POST /purchases/requisitions/:id/approve<br/>Approve PR]
            PO_POST[POST /purchases/orders<br/>Convert PR → PO]
            GRN_POST[POST /purchases/grn<br/>Create GRN]
        end

        subgraph "Vendor API"
            VENDOR_GET[GET /vendors<br/>List vendors]
            VENDOR_POST[POST /vendors<br/>Create vendor]
            VENDOR_PERF[GET /vendors/:id/performance<br/>Performance metrics]
        end

        subgraph "Reports API"
            REPORT_STOCK[GET /reports/stock-status<br/>Stock report]
            REPORT_LOW[GET /reports/low-stock<br/>Low stock report]
            REPORT_EXPIRY[GET /reports/expiry<br/>Expiry report]
            REPORT_MOVEMENT[GET /reports/movement<br/>Movement report]
        end

        subgraph "Alerts API"
            ALERT_GET[GET /alerts<br/>Get alerts]
            ALERT_CONFIG[POST /alerts/config<br/>Configure alerts]
            ALERT_ACK[POST /alerts/:id/acknowledge<br/>Acknowledge alert]
        end
    end

    subgraph "Middleware"
        AUTH_MW[Authentication<br/>Verify JWT]
        RBAC_MW[Authorization<br/>Check permissions]
        VALIDATE_MW[Validation<br/>Zod schemas]
        RATE_MW[Rate Limiting<br/>Prevent abuse]
    end

    subgraph "Services"
        INV_SERVICE[Inventory Service]
        PURCHASE_SERVICE[Purchase Service]
        VENDOR_SERVICE[Vendor Service]
        ALERT_SERVICE[Alert Service]
        REPORT_SERVICE[Report Service]
    end

    ITEMS_GET --> AUTH_MW
    PR_POST --> AUTH_MW
    VENDOR_POST --> AUTH_MW
    AUTH_MW --> RBAC_MW
    RBAC_MW --> VALIDATE_MW
    VALIDATE_MW --> RATE_MW
    RATE_MW --> INV_SERVICE
    RATE_MW --> PURCHASE_SERVICE
    RATE_MW --> VENDOR_SERVICE
    RATE_MW --> ALERT_SERVICE
    RATE_MW --> REPORT_SERVICE
```

---

## 🔄 Data Flow Architecture

### Purchase Requisition to Invoice Flow

```mermaid
sequenceDiagram
    participant User as Department Head
    participant PR as Purchase Requisition
    participant Approver as Approver (L1/L2/L3)
    participant PO as Purchase Order
    participant Vendor as Vendor
    participant GRN as Goods Receipt Note
    participant Invoice as Invoice Matching
    participant GL as General Ledger
    participant Payment as Payment Processing

    User->>PR: Create PR with items
    PR->>PR: Calculate total amount
    PR->>Approver: Route based on amount

    alt Amount < PKR 50,000
        Approver->>PR: L1 Approver reviews
    else Amount < PKR 200,000
        Approver->>PR: L2 Approver reviews
    else Amount >= PKR 200,000
        Approver->>PR: L3 Approver reviews
    end

    Approver->>PR: Approve PR
    PR->>PO: Convert to PO
    PO->>PO: Check price variance

    alt Variance > 10%
        PO->>Approver: Route to L3 for variance approval
        Approver->>PO: Approve variance
    else Variance 5-10%
        PO->>Approver: Route to L2 for variance approval
        Approver->>PO: Approve variance
    end

    PO->>Vendor: Send PO
    Vendor->>GRN: Deliver goods
    GRN->>GRN: Inspect quality
    GRN->>GRN: Update stock levels

    Vendor->>Invoice: Send invoice
    Invoice->>Invoice: Match with PO & GRN

    alt 3-way match successful
        Invoice->>GL: Create journal entry
        GL->>Payment: Schedule payment
        Payment->>Vendor: Process payment
    else Mismatch detected
        Invoice->>Approver: Flag for review
        Approver->>Invoice: Resolve discrepancy
    end
```

### Stock Movement Flow

```mermaid
flowchart TD
    START[Stock Movement Initiated]

    START --> TYPE{Movement Type?}

    TYPE -->|Purchase| GRN[Goods Receipt Note]
    TYPE -->|Transfer| TRANSFER[Inter-location Transfer]
    TYPE -->|Adjustment| ADJUST[Stock Adjustment]
    TYPE -->|Issue| ISSUE[Department Issue]
    TYPE -->|Return| RETURN[Stock Return]
    TYPE -->|Count| COUNT[Physical Count]

    GRN --> GRN_APPROVE{Approval<br/>Required?}
    GRN_APPROVE -->|Yes| GRN_WORKFLOW[Approval Workflow]
    GRN_APPROVE -->|No| GRN_POST
    GRN_WORKFLOW --> GRN_POST[Post GRN]

    TRANSFER --> TRANSFER_VALIDATE{Validate<br/>Stock Availability?}
    TRANSFER_VALIDATE -->|Available| TRANSFER_POST[Post Transfer]
    TRANSFER_VALIDATE -->|Not Available| TRANSFER_ERROR[Error: Insufficient Stock]

    ADJUST --> ADJUST_REASON{Reason?}
    ADJUST_REASON -->|Theft| ADJUST_THEFT[Theft Report Workflow]
    ADJUST_REASON -->|Damage| ADJUST_DAMAGE[Damage Report]
    ADJUST_REASON -->|Expiry| ADJUST_EXPIRY[Expiry Disposal]
    ADJUST_REASON -->|Other| ADJUST_APPROVE[Approval Required]
    ADJUST_THEFT --> ADJUST_POST
    ADJUST_DAMAGE --> ADJUST_POST
    ADJUST_EXPIRY --> ADJUST_POST
    ADJUST_APPROVE --> ADJUST_POST[Post Adjustment]

    ISSUE --> ISSUE_FEFO{FEFO<br/>Enforcement?}
    ISSUE_FEFO -->|Yes| ISSUE_BATCH[Select Expiring Batch]
    ISSUE_FEFO -->|No| ISSUE_REGULAR[Regular Issue]
    ISSUE_BATCH --> ISSUE_POST[Post Issue]
    ISSUE_REGULAR --> ISSUE_POST

    RETURN --> RETURN_VALIDATE{Validate<br/>Original Issue?}
    RETURN_VALIDATE -->|Valid| RETURN_POST[Post Return]
    RETURN_VALIDATE -->|Invalid| RETURN_ERROR[Error: Invalid Return]

    COUNT --> COUNT_VARIANCE{Variance<br/>Detected?}
    COUNT_VARIANCE -->|Yes| COUNT_APPROVE[Approval Required]
    COUNT_VARIANCE -->|No| COUNT_POST[Post Count]
    COUNT_APPROVE --> COUNT_POST

    GRN_POST --> UPDATE_STOCK[Update Stock Levels]
    TRANSFER_POST --> UPDATE_STOCK
    ADJUST_POST --> UPDATE_STOCK
    ISSUE_POST --> UPDATE_STOCK
    RETURN_POST --> UPDATE_STOCK
    COUNT_POST --> UPDATE_STOCK

    UPDATE_STOCK --> UPDATE_COST[Update Costing<br/>Weighted Average]
    UPDATE_COST --> UPDATE_GL[Update GL<br/>Journal Entry]
    UPDATE_GL --> TRIGGER_ALERTS{Trigger<br/>Alerts?}

    TRIGGER_ALERTS -->|Low Stock| ALERT_LOW[Low Stock Alert]
    TRIGGER_ALERTS -->|Reorder| ALERT_REORDER[Reorder Alert]
    TRIGGER_ALERTS -->|Over Stock| ALERT_OVER[Over Stock Alert]
    TRIGGER_ALERTS -->|None| END

    ALERT_LOW --> END[Movement Complete]
    ALERT_REORDER --> END
    ALERT_OVER --> END
    TRANSFER_ERROR --> END
    RETURN_ERROR --> END
```

### Alert System Flow

```mermaid
flowchart LR
    subgraph "Trigger Sources"
        STOCK_CHANGE[Stock Level Change]
        EXPIRY_CHECK[Daily Expiry Check]
        APPROVAL_PENDING[Approval Pending]
        PRICE_VARIANCE[Price Variance Detected]
        COUNT_DUE[Physical Count Due]
    end

    subgraph "Alert Engine"
        MONITOR[Alert Monitor<br/>Background Job]
        RULES[Alert Rules<br/>Threshold Configuration]
        QUEUE[Alert Queue]
    end

    subgraph "Alert Types"
        LOW_STOCK[Low Stock Alert]
        REORDER[Reorder Alert]
        EXPIRY[Expiry Alert<br/>30/60 days]
        VARIANCE[Price Variance Alert]
        APPROVAL[Approval Pending Alert]
        OVER_STOCK[Over Stock Alert]
        WARRANTY[Warranty Expiry Alert]
        COUNT[Count Due Alert]
        VENDOR[Vendor Performance Alert]
        BUDGET[Budget Variance Alert]
    end

    subgraph "Notification Channels"
        EMAIL[Email Notification]
        SMS[SMS Notification]
        INAPP[In-App Notification]
        DASHBOARD[Dashboard Alert]
    end

    subgraph "Alert Actions"
        ACK[Acknowledge Alert]
        ESCALATE[Escalate to Manager]
        AUTO_ACTION[Auto Action<br/>Create PR]
        DISMISS[Dismiss Alert]
    end

    STOCK_CHANGE --> MONITOR
    EXPIRY_CHECK --> MONITOR
    APPROVAL_PENDING --> MONITOR
    PRICE_VARIANCE --> MONITOR
    COUNT_DUE --> MONITOR

    MONITOR --> RULES
    RULES --> QUEUE

    QUEUE --> LOW_STOCK
    QUEUE --> REORDER
    QUEUE --> EXPIRY
    QUEUE --> VARIANCE
    QUEUE --> APPROVAL
    QUEUE --> OVER_STOCK
    QUEUE --> WARRANTY
    QUEUE --> COUNT
    QUEUE --> VENDOR
    QUEUE --> BUDGET

    LOW_STOCK --> EMAIL
    LOW_STOCK --> INAPP
    REORDER --> EMAIL
    REORDER --> AUTO_ACTION
    EXPIRY --> EMAIL
    EXPIRY --> SMS
    VARIANCE --> EMAIL
    VARIANCE --> DASHBOARD
    APPROVAL --> EMAIL
    APPROVAL --> INAPP

    EMAIL --> ACK
    INAPP --> ACK
    ACK --> ESCALATE
    ACK --> DISMISS
```

---

## 🚀 Deployment Architecture

### Cloud Infrastructure (Vercel + Supabase)

```mermaid
graph TB
    subgraph "Client Layer"
        USERS[End Users<br/>Web Browsers]
    end

    subgraph "CDN Layer"
        VERCEL_CDN[Vercel Edge Network<br/>Global CDN]
    end

    subgraph "Application Layer - Vercel"
        NEXTJS_SERVER[Next.js Server<br/>Vercel Functions]
        STATIC[Static Assets<br/>Images, CSS, JS]
        API_ROUTES[API Routes<br/>Serverless Functions]
        SSR[Server-Side Rendering<br/>React Components]
    end

    subgraph "Database Layer - Supabase"
        POSTGRES[PostgreSQL 17.4.1<br/>Primary Database]
        REALTIME[Realtime Server<br/>WebSocket Subscriptions]
        AUTH_SERVER[Auth Server<br/>JWT Management]
        STORAGE[Storage Bucket<br/>File Uploads]
    end

    subgraph "AI Layer - Google Cloud"
        GENKIT_SERVER[Genkit Runtime<br/>AI Processing]
        GEMINI[Gemini 2.0 Flash<br/>LLM API]
    end

    subgraph "External Services"
        EMAIL_SERVICE[Email Service<br/>SendGrid/AWS SES]
        SMS_SERVICE[SMS Gateway<br/>Twilio]
        MONITORING[Monitoring<br/>Vercel Analytics]
    end

    subgraph "Backup & Security"
        BACKUP[Automated Backups<br/>30-day Retention]
        WAF[Web Application Firewall<br/>DDoS Protection]
    end

    USERS --> VERCEL_CDN
    VERCEL_CDN --> NEXTJS_SERVER
    VERCEL_CDN --> STATIC
    NEXTJS_SERVER --> API_ROUTES
    NEXTJS_SERVER --> SSR
    API_ROUTES --> POSTGRES
    API_ROUTES --> AUTH_SERVER
    API_ROUTES --> REALTIME
    API_ROUTES --> STORAGE
    API_ROUTES --> GENKIT_SERVER
    GENKIT_SERVER --> GEMINI
    API_ROUTES --> EMAIL_SERVICE
    API_ROUTES --> SMS_SERVICE
    NEXTJS_SERVER --> MONITORING
    POSTGRES --> BACKUP
    VERCEL_CDN --> WAF
```

### Deployment Pipeline

```mermaid
flowchart LR
    subgraph "Development"
        DEV_CODE[Local Development<br/>npm run dev]
        DEV_TEST[Unit Tests<br/>Jest + RTL]
        DEV_LINT[Linting<br/>ESLint]
        DEV_TYPE[Type Check<br/>TypeScript]
    end

    subgraph "Version Control"
        GIT[Git Repository<br/>GitHub]
        BRANCH[Feature Branch]
        PR[Pull Request]
        REVIEW[Code Review]
    end

    subgraph "CI/CD Pipeline"
        CI[GitHub Actions<br/>Continuous Integration]
        BUILD[Build<br/>next build]
        TEST[Test Suite<br/>Integration Tests]
        ANALYZE[Bundle Analysis<br/>Size Check]
    end

    subgraph "Staging Environment"
        STAGE_DEPLOY[Deploy to Staging<br/>Vercel Preview]
        STAGE_TEST[E2E Testing<br/>Playwright]
        STAGE_QA[QA Review<br/>Manual Testing]
    end

    subgraph "Production Environment"
        PROD_APPROVE[Production Approval<br/>Manual Gate]
        PROD_DEPLOY[Deploy to Production<br/>Vercel]
        PROD_MONITOR[Production Monitoring<br/>Error Tracking]
        PROD_ROLLBACK[Rollback Strategy<br/>Previous Version]
    end

    DEV_CODE --> DEV_TEST
    DEV_TEST --> DEV_LINT
    DEV_LINT --> DEV_TYPE
    DEV_TYPE --> GIT
    GIT --> BRANCH
    BRANCH --> PR
    PR --> REVIEW
    REVIEW --> CI
    CI --> BUILD
    BUILD --> TEST
    TEST --> ANALYZE
    ANALYZE --> STAGE_DEPLOY
    STAGE_DEPLOY --> STAGE_TEST
    STAGE_TEST --> STAGE_QA
    STAGE_QA --> PROD_APPROVE
    PROD_APPROVE --> PROD_DEPLOY
    PROD_DEPLOY --> PROD_MONITOR
    PROD_MONITOR -->|Error Detected| PROD_ROLLBACK
    PROD_ROLLBACK -->|Rollback| PROD_DEPLOY
```

---

## 🔒 Security Architecture

### Authentication & Authorization Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant NextJS as Next.js Server
    participant Supabase as Supabase Auth
    participant DB as PostgreSQL
    participant API as API Routes

    User->>Browser: Enter credentials
    Browser->>NextJS: POST /api/auth/login
    NextJS->>Supabase: signInWithPassword()
    Supabase->>Supabase: Validate credentials
    Supabase->>Supabase: Generate JWT token
    Supabase->>NextJS: Return JWT + user data
    NextJS->>Browser: Set httpOnly cookie
    Browser->>Browser: Store session

    User->>Browser: Request protected resource
    Browser->>NextJS: GET /api/v1/inventory/items<br/>(with JWT cookie)
    NextJS->>NextJS: Extract JWT from cookie
    NextJS->>Supabase: Verify JWT signature
    Supabase->>NextJS: JWT valid + user role
    NextJS->>NextJS: Check RBAC permissions

    alt User has permission
        NextJS->>DB: Query with RLS policies
        DB->>DB: Enforce row-level security
        DB->>NextJS: Return filtered data
        NextJS->>Browser: Return data
    else User lacks permission
        NextJS->>Browser: 403 Forbidden
    end
```

### Row-Level Security (RLS) Architecture

```mermaid
flowchart TD
    subgraph "User Request"
        REQUEST[API Request<br/>User ID + Role]
    end

    subgraph "RLS Policy Evaluation"
        POLICY_CHECK{Check RLS<br/>Policies}
    end

    subgraph "Role-Based Policies"
        STORE_KEEPER[Store Keeper Policy<br/>Own department only]
        DEPT_HEAD[Department Head Policy<br/>Own department + reports]
        PURCHASING[Purchasing Officer Policy<br/>All vendors + POs]
        APPROVER_L1[Approver L1 Policy<br/>Approvals < PKR 50K]
        APPROVER_L2[Approver L2 Policy<br/>Approvals < PKR 200K]
        APPROVER_L3[Approver L3 Policy<br/>Unlimited access]
        FINANCE[Finance Policy<br/>All financial data]
        ADMIN[Admin Policy<br/>Full access]
        AUDITOR[Auditor Policy<br/>Read-only access]
    end

    subgraph "Data Filtering"
        FILTER[Apply Row Filters]
        DEPT_FILTER[Filter by department_id]
        APPROVAL_FILTER[Filter by approval_level]
        READONLY_FILTER[Read-only enforcement]
    end

    subgraph "Query Result"
        RESULT[Filtered Dataset<br/>Return to User]
    end

    REQUEST --> POLICY_CHECK

    POLICY_CHECK -->|Store Keeper| STORE_KEEPER
    POLICY_CHECK -->|Dept Head| DEPT_HEAD
    POLICY_CHECK -->|Purchasing| PURCHASING
    POLICY_CHECK -->|Approver L1| APPROVER_L1
    POLICY_CHECK -->|Approver L2| APPROVER_L2
    POLICY_CHECK -->|Approver L3| APPROVER_L3
    POLICY_CHECK -->|Finance| FINANCE
    POLICY_CHECK -->|Admin| ADMIN
    POLICY_CHECK -->|Auditor| AUDITOR

    STORE_KEEPER --> DEPT_FILTER
    DEPT_HEAD --> DEPT_FILTER
    APPROVER_L1 --> APPROVAL_FILTER
    APPROVER_L2 --> APPROVAL_FILTER
    AUDITOR --> READONLY_FILTER

    DEPT_FILTER --> FILTER
    APPROVAL_FILTER --> FILTER
    READONLY_FILTER --> FILTER
    PURCHASING --> FILTER
    APPROVER_L3 --> FILTER
    FINANCE --> FILTER
    ADMIN --> FILTER

    FILTER --> RESULT
```

### Data Encryption Architecture

```mermaid
graph TB
    subgraph "Data at Rest"
        DB_DATA[Database Data<br/>PostgreSQL]
        ENCRYPT_REST[AES-256 Encryption<br/>Supabase Managed]
        BACKUP_DATA[Backup Data<br/>30-day Retention]
    end

    subgraph "Data in Transit"
        CLIENT[Client Application]
        TLS[TLS 1.3<br/>Encryption]
        SERVER[Server Application]
    end

    subgraph "Data in Use"
        MEMORY[Server Memory<br/>Runtime Data]
        TEMP_FILES[Temporary Files<br/>Auto-deletion]
        CACHE[Cache Layer<br/>React Query]
    end

    subgraph "Sensitive Data"
        PASSWORDS[Passwords<br/>bcrypt Hashing]
        JWT[JWT Tokens<br/>HMAC SHA-256]
        API_KEYS[API Keys<br/>Environment Variables]
    end

    subgraph "Key Management"
        KEY_STORAGE[Key Storage<br/>Vercel Env Variables]
        KEY_ROTATION[Key Rotation<br/>90-day Policy]
    end

    DB_DATA --> ENCRYPT_REST
    ENCRYPT_REST --> BACKUP_DATA

    CLIENT --> TLS
    TLS --> SERVER

    SERVER --> MEMORY
    SERVER --> TEMP_FILES
    MEMORY --> CACHE

    PASSWORDS --> DB_DATA
    JWT --> CLIENT
    API_KEYS --> KEY_STORAGE
    KEY_STORAGE --> KEY_ROTATION
```

---

## 🔗 Integration Architecture

### External System Integrations

```mermaid
graph TB
    subgraph "Inventory System"
        INV_CORE[Inventory Core<br/>14 Modules]
    end

    subgraph "Internal Integrations"
        ACCOUNTING[Accounting Module<br/>General Ledger]
        FINANCE[Finance Module<br/>Budget Management]
        HR[HR Module<br/>Employee Data]
        RESTAURANT[Restaurant Module<br/>Recipe Integration]
    end

    subgraph "External Integrations"
        EMAIL_INT[Email Service<br/>SendGrid/AWS SES]
        SMS_INT[SMS Gateway<br/>Twilio]
        AI_INT[AI Service<br/>Google Genkit]
        ANALYTICS[Analytics<br/>Vercel Analytics]
    end

    subgraph "Integration Patterns"
        REST_API[REST API Calls<br/>HTTP/JSON]
        WEBHOOKS[Webhooks<br/>Event-driven]
        MESSAGE_QUEUE[Message Queue<br/>Async Processing]
        REALTIME[Realtime Subscriptions<br/>WebSocket]
    end

    INV_CORE --> REST_API
    INV_CORE --> WEBHOOKS
    INV_CORE --> MESSAGE_QUEUE
    INV_CORE --> REALTIME

    REST_API --> ACCOUNTING
    REST_API --> EMAIL_INT
    REST_API --> SMS_INT
    REST_API --> AI_INT

    WEBHOOKS --> FINANCE
    WEBHOOKS --> ANALYTICS

    MESSAGE_QUEUE --> HR

    REALTIME --> RESTAURANT

    ACCOUNTING --> |Journal Entries| INV_CORE
    FINANCE --> |Budget Alerts| INV_CORE
    HR --> |User Data| INV_CORE
    RESTAURANT --> |Recipe Costing| INV_CORE
```

### Event-Driven Architecture

```mermaid
sequenceDiagram
    participant Source as Event Source<br/>(Stock Movement)
    participant EventBus as Event Bus
    participant Accounting as Accounting Listener
    participant Alerts as Alert Listener
    participant Analytics as Analytics Listener
    participant AI as AI Listener

    Source->>EventBus: Publish Event<br/>STOCK_LEVEL_CHANGED
    EventBus->>Accounting: Trigger journal entry
    EventBus->>Alerts: Check alert thresholds
    EventBus->>Analytics: Update KPI metrics
    EventBus->>AI: Analyze for anomalies

    Accounting->>Accounting: Create GL entry
    Accounting->>EventBus: Publish GL_ENTRY_CREATED

    Alerts->>Alerts: Evaluate rules
    alt Low Stock Detected
        Alerts->>EventBus: Publish LOW_STOCK_ALERT
        EventBus->>Source: Send notification
    end

    Analytics->>Analytics: Update dashboard
    Analytics->>EventBus: Publish METRICS_UPDATED

    AI->>AI: Run anomaly detection
    alt Anomaly Detected
        AI->>EventBus: Publish ANOMALY_DETECTED
        EventBus->>Source: Flag for review
    end
```

---

## 📈 Scalability & Performance

### Caching Strategy

```mermaid
graph TB
    subgraph "Client-Side Caching"
        BROWSER_CACHE[Browser Cache<br/>Static Assets]
        REACT_QUERY[React Query Cache<br/>Server State]
        LOCAL_STORAGE[Local Storage<br/>User Preferences]
    end

    subgraph "Application-Level Caching"
        API_CACHE[API Response Cache<br/>Stale-While-Revalidate]
        COMPUTED_CACHE[Computed Values Cache<br/>Memoization]
    end

    subgraph "Database-Level Caching"
        QUERY_CACHE[Query Result Cache<br/>PostgreSQL]
        MATERIALIZED_VIEW[Materialized Views<br/>Complex Reports]
    end

    subgraph "CDN Caching"
        EDGE_CACHE[Edge Network Cache<br/>Vercel CDN]
    end

    subgraph "Cache Invalidation"
        INVALIDATE[Cache Invalidation<br/>On Data Change]
        TTL[Time-To-Live<br/>Auto-expiration]
    end

    BROWSER_CACHE --> EDGE_CACHE
    REACT_QUERY --> API_CACHE
    API_CACHE --> QUERY_CACHE
    COMPUTED_CACHE --> QUERY_CACHE
    QUERY_CACHE --> MATERIALIZED_VIEW

    INVALIDATE --> REACT_QUERY
    INVALIDATE --> API_CACHE
    INVALIDATE --> QUERY_CACHE
    TTL --> REACT_QUERY
    TTL --> API_CACHE
```

### Database Optimization Strategy

```mermaid
flowchart TD
    subgraph "Query Optimization"
        INDEXES[Strategic Indexes<br/>B-tree, GIN, BRIN]
        QUERY_PLAN[Query Execution Plans<br/>EXPLAIN ANALYZE]
        DENORM[Selective Denormalization<br/>Computed Columns]
    end

    subgraph "Data Partitioning"
        TIME_PARTITION[Time-based Partitioning<br/>stock_movements by month]
        RANGE_PARTITION[Range Partitioning<br/>Large tables]
    end

    subgraph "Connection Pooling"
        POOL[Connection Pool<br/>Supabase Pooler]
        POOL_SIZE[Pool Size: 20 connections]
    end

    subgraph "Read Replicas"
        PRIMARY[Primary Database<br/>Write Operations]
        REPLICA[Read Replica<br/>Read Operations]
        LOAD_BALANCE[Load Balancing<br/>Read Distribution]
    end

    subgraph "Monitoring"
        SLOW_QUERY[Slow Query Log<br/>Threshold: 100ms]
        PERF_METRICS[Performance Metrics<br/>Response Time]
    end

    INDEXES --> QUERY_PLAN
    QUERY_PLAN --> DENORM

    TIME_PARTITION --> PRIMARY
    RANGE_PARTITION --> PRIMARY

    PRIMARY --> POOL
    POOL --> POOL_SIZE

    PRIMARY --> REPLICA
    REPLICA --> LOAD_BALANCE

    QUERY_PLAN --> SLOW_QUERY
    SLOW_QUERY --> PERF_METRICS
```

### Scalability Model

```mermaid
graph LR
    subgraph "Current Capacity"
        USERS_100[100 Concurrent Users]
        ITEMS_10K[10,000 Inventory Items]
        TRANS_1K[1,000 Transactions/day]
    end

    subgraph "Phase 1: 6 Months"
        USERS_500[500 Concurrent Users]
        ITEMS_50K[50,000 Inventory Items]
        TRANS_5K[5,000 Transactions/day]
    end

    subgraph "Phase 2: 12 Months"
        USERS_1K[1,000 Concurrent Users]
        ITEMS_100K[100,000 Inventory Items]
        TRANS_10K[10,000 Transactions/day]
    end

    subgraph "Phase 3: 24 Months"
        USERS_5K[5,000 Concurrent Users]
        ITEMS_500K[500,000 Inventory Items]
        TRANS_50K[50,000 Transactions/day]
    end

    subgraph "Scaling Strategy"
        VERTICAL[Vertical Scaling<br/>Database Tier Upgrade]
        HORIZONTAL[Horizontal Scaling<br/>Read Replicas]
        CACHING[Enhanced Caching<br/>Redis/Memcached]
        OPTIMIZATION[Code Optimization<br/>Query Tuning]
    end

    USERS_100 --> USERS_500
    USERS_500 --> USERS_1K
    USERS_1K --> USERS_5K

    ITEMS_10K --> ITEMS_50K
    ITEMS_50K --> ITEMS_100K
    ITEMS_100K --> ITEMS_500K

    USERS_500 --> VERTICAL
    USERS_1K --> HORIZONTAL
    USERS_5K --> CACHING
    USERS_5K --> OPTIMIZATION
```

---

## 📊 Performance Targets

### Response Time SLAs

| Operation | Target | Acceptable | Critical |
|-----------|--------|------------|----------|
| **Page Load** | < 1s | < 2s | < 3s |
| **API Call (Simple)** | < 100ms | < 200ms | < 500ms |
| **API Call (Complex)** | < 500ms | < 1s | < 2s |
| **Report Generation** | < 2s | < 5s | < 10s |
| **Search Results** | < 200ms | < 500ms | < 1s |
| **Dashboard Refresh** | < 1s | < 2s | < 3s |

### Availability Targets

- **Uptime SLA**: 99.9% (8.76 hours/year downtime)
- **Planned Maintenance**: < 2 hours/month
- **MTTR (Mean Time To Recovery)**: < 1 hour
- **RPO (Recovery Point Objective)**: < 1 hour
- **RTO (Recovery Time Objective)**: < 4 hours

---

## 🔄 Disaster Recovery Plan

```mermaid
flowchart TD
    START[Incident Detected]

    START --> ASSESS{Assess Severity}

    ASSESS -->|Minor| MINOR[Minor Incident<br/>Single Component]
    ASSESS -->|Major| MAJOR[Major Incident<br/>Service Disruption]
    ASSESS -->|Critical| CRITICAL[Critical Incident<br/>Complete Outage]

    MINOR --> MINOR_FIX[Apply Fix<br/>Roll Forward]
    MINOR_FIX --> MINOR_TEST[Test Fix]
    MINOR_TEST --> MINOR_DEPLOY[Deploy Fix]
    MINOR_DEPLOY --> MONITOR

    MAJOR --> MAJOR_ROLLBACK{Can Rollback?}
    MAJOR_ROLLBACK -->|Yes| ROLLBACK[Rollback to<br/>Previous Version]
    MAJOR_ROLLBACK -->|No| MAJOR_FIX[Emergency Fix]
    ROLLBACK --> MONITOR
    MAJOR_FIX --> MAJOR_TEST[Rapid Testing]
    MAJOR_TEST --> MAJOR_DEPLOY[Deploy Fix]
    MAJOR_DEPLOY --> MONITOR

    CRITICAL --> CRITICAL_NOTIFY[Notify Stakeholders<br/>Status Page Update]
    CRITICAL_NOTIFY --> CRITICAL_DR{Trigger DR Plan?}
    CRITICAL_DR -->|Yes| DR_ACTIVATE[Activate DR Site<br/>Restore from Backup]
    CRITICAL_DR -->|No| CRITICAL_FIX[Emergency Fix]
    DR_ACTIVATE --> DR_VERIFY[Verify Data Integrity]
    DR_VERIFY --> DR_SWITCH[Switch Traffic to DR]
    DR_SWITCH --> MONITOR
    CRITICAL_FIX --> CRITICAL_TEST[Rapid Testing]
    CRITICAL_TEST --> CRITICAL_DEPLOY[Deploy Fix]
    CRITICAL_DEPLOY --> MONITOR

    MONITOR[Monitor Service<br/>Health Checks]
    MONITOR --> STABLE{Service<br/>Stable?}
    STABLE -->|Yes| POST_MORTEM[Post-Mortem<br/>Root Cause Analysis]
    STABLE -->|No| ASSESS

    POST_MORTEM --> DOCUMENT[Document Incident<br/>Update Runbooks]
    DOCUMENT --> END[Incident Resolved]
```

---

## 📝 Architecture Decision Records (ADRs)

### ADR-001: Next.js App Router vs Pages Router

**Status**: Accepted
**Date**: October 25, 2025

**Context**: Need to choose between Next.js App Router (new) and Pages Router (legacy).

**Decision**: Use Next.js App Router with React Server Components.

**Rationale**:
- Better performance with server-side rendering
- Improved data fetching patterns
- Built-in loading states and error handling
- Future-proof architecture

**Consequences**:
- Steeper learning curve for developers
- Some third-party libraries may need compatibility updates
- Better long-term maintainability

---

### ADR-002: Supabase vs Self-Hosted PostgreSQL

**Status**: Accepted
**Date**: October 25, 2025

**Context**: Need to choose database hosting strategy.

**Decision**: Use Supabase managed PostgreSQL.

**Rationale**:
- Built-in authentication and authorization
- Automatic backups and point-in-time recovery
- Row-level security (RLS) out of the box
- Realtime subscriptions for live updates
- Reduced operational overhead

**Consequences**:
- Vendor lock-in to Supabase
- Dependency on Supabase availability
- Cost increases with scale (predictable pricing)

---

### ADR-003: REST API vs GraphQL

**Status**: Accepted
**Date**: October 25, 2025

**Context**: Need to choose API architecture pattern.

**Decision**: Use REST API with standardized JSON responses.

**Rationale**:
- Simpler to implement and maintain
- Better caching with HTTP standards
- Supabase client already provides efficient querying
- Team familiarity with REST patterns
- Easier to version and evolve

**Consequences**:
- May require multiple API calls for complex queries
- Over-fetching of data in some scenarios
- Simpler debugging and monitoring

---

### ADR-004: Client-Side vs Server-Side Rendering

**Status**: Accepted
**Date**: October 25, 2025

**Context**: Need to balance performance and interactivity.

**Decision**: Use hybrid approach - SSR for initial load, CSR for interactions.

**Rationale**:
- Fast initial page load with SSR
- Interactive features with client-side state
- SEO benefits for dashboards and reports
- Leverage Next.js strengths

**Consequences**:
- More complex data fetching patterns
- Need to manage client/server state separately
- Better user experience overall

---

### ADR-005: AI Integration with Google Genkit vs Direct API

**Status**: Accepted
**Date**: October 25, 2025

**Context**: Need to integrate AI for insights and forecasting.

**Decision**: Use Google Genkit with Gemini 2.0 Flash model.

**Rationale**:
- Structured AI workflows with type safety
- Built-in tracing and debugging
- Easy integration with Next.js
- Cost-effective pricing
- High-quality results from Gemini

**Consequences**:
- Learning curve for Genkit framework
- Dependency on Google AI infrastructure
- Excellent developer experience for AI features

---

## 🎯 Future Architecture Enhancements

### Planned Improvements (Next 6 Months)

1. **Microservices Architecture**
   - Split inventory system into independent services
   - Implement message queue (RabbitMQ/AWS SQS)
   - Enable independent scaling

2. **Enhanced Caching**
   - Implement Redis for distributed caching
   - Add CDN edge caching for API responses
   - Optimize cache invalidation strategies

3. **Multi-Tenancy Support**
   - Implement tenant isolation at database level
   - Add tenant-specific configurations
   - Support multiple organizations

4. **Mobile Applications**
   - Native iOS/Android apps for inventory management
   - Offline-first architecture with sync
   - Barcode scanning integration

5. **Advanced Analytics**
   - Real-time dashboard with WebSocket updates
   - Predictive analytics for demand forecasting
   - Machine learning for price optimization

6. **Integration Marketplace**
   - Plugin architecture for third-party integrations
   - Webhook management interface
   - API marketplace for extensions

---

## 📞 Architecture Review & Governance

### Architecture Review Board

- **Frequency**: Quarterly
- **Participants**: Tech Lead, Senior Developers, Product Owner
- **Scope**: Review ADRs, assess technical debt, plan improvements

### Architecture Documentation

- **Location**: `docs/modules/operations/inventory/ARCHITECTURE.md`
- **Update Frequency**: On major changes
- **Review Process**: Peer review required for architecture changes

---

**Document Version**: 1.0
**Last Updated**: October 25, 2025
**Next Review**: January 25, 2026
**Owner**: Rahah24 Development Team

---

*InshAllah, this architecture will provide a solid foundation for scaling the inventory management system while maintaining security, performance, and reliability.*
