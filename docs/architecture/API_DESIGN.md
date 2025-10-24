# API Design - Rahah24 ERP

## Overview

This document outlines the API design principles, endpoint structure, and data formats for the Rahah24 ERP backend API.

---

## Base URL

- **Development**: `http://localhost:8000/api/v1`
- **Production**: `https://api.rahah24.com/api/v1`

---

## Authentication

### JWT Bearer Token
All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Login Endpoint
```http
POST /api/v1/auth/login

Request:
{
  "email": "admin@rahah24.com",
  "password": "Admin123!@#"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {
      "id": 1,
      "email": "admin@rahah24.com",
      "role": "admin",
      "name": "Admin User"
    }
  }
}
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "data": null,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 150,
    "page": 1,
    "per_page": 50,
    "pages": 3,
    "has_next": true,
    "has_prev": false
  }
}
```

---

## Inventory Management API

### 1. Inventory Items

#### List Items
```http
GET /api/v1/inventory/items

Query Parameters:
  - category_id: integer (optional)
  - search: string (optional)
  - status: string (optional) - active, low_stock, out_of_stock
  - page: integer (default: 1)
  - per_page: integer (default: 50, max: 100)
  - sort_by: string (default: name) - name, sku, current_stock
  - sort_order: string (default: asc) - asc, desc

Response: 200 OK
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Basmati Rice",
        "sku": "RICE-001",
        "category_id": 5,
        "category_name": "Grains",
        "unit_of_measure": "kg",
        "current_stock": 150.5,
        "min_level": 50,
        "max_level": 500,
        "reorder_level": 100,
        "unit_cost": 120.00,
        "total_value": 18060.00,
        "status": "active",
        "location": "Warehouse A, Zone 1, Rack 3",
        "supplier_id": 10,
        "supplier_name": "ABC Suppliers",
        "last_restocked": "2025-01-20T10:00:00Z",
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-20T10:00:00Z"
      }
    ],
    "total": 150,
    "page": 1,
    "per_page": 50,
    "pages": 3
  }
}
```

#### Get Item by ID
```http
GET /api/v1/inventory/items/{item_id}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Basmati Rice",
    ...
    "stock_movements": [
      {
        "id": 100,
        "movement_type": "in",
        "quantity": 50,
        "reference_type": "purchase_order",
        "reference_id": 456,
        "notes": "Received from supplier",
        "created_by": "admin@rahah24.com",
        "created_at": "2025-01-20T10:00:00Z"
      }
    ]
  }
}
```

#### Create Item
```http
POST /api/v1/inventory/items
Content-Type: application/json

Request:
{
  "name": "Basmati Rice",
  "sku": "RICE-001",
  "category_id": 5,
  "unit_of_measure": "kg",
  "min_level": 50,
  "max_level": 500,
  "reorder_level": 100,
  "unit_cost": 120.00,
  "location": "Warehouse A",
  "supplier_id": 10
}

Response: 201 Created
{
  "success": true,
  "data": { ... },
  "message": "Item created successfully"
}
```

#### Update Item
```http
PUT /api/v1/inventory/items/{item_id}

Request: (same as create)
Response: 200 OK
```

#### Partial Update Item
```http
PATCH /api/v1/inventory/items/{item_id}

Request:
{
  "min_level": 60,
  "reorder_level": 110
}

Response: 200 OK
```

#### Delete Item
```http
DELETE /api/v1/inventory/items/{item_id}

Response: 200 OK
{
  "success": true,
  "message": "Item deleted successfully"
}
```

### 2. Stock Movements

#### Record Stock Movement
```http
POST /api/v1/inventory/stock-movements

Request:
{
  "item_id": 1,
  "movement_type": "in",  // in, out, adjustment
  "quantity": 50,
  "reference_type": "purchase_order",  // Optional
  "reference_id": 456,  // Optional
  "notes": "Received from supplier"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "movement": { ... },
    "updated_stock": 200.5
  }
}
```

#### Get Item Movement History
```http
GET /api/v1/inventory/items/{item_id}/movements

Query Parameters:
  - movement_type: string (optional)
  - from_date: date (optional)
  - to_date: date (optional)
  - page: integer
  - per_page: integer

Response: 200 OK
```

### 3. Stock Alerts

#### Get Low Stock Items
```http
GET /api/v1/inventory/alerts/low-stock

Response: 200 OK
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 5,
        "name": "Olive Oil",
        "current_stock": 15,
        "min_level": 20,
        "reorder_level": 30,
        "shortage": 5,
        "days_until_out": 3
      }
    ],
    "count": 3
  }
}
```

#### Get Reorder Items
```http
GET /api/v1/inventory/alerts/reorder

Response: 200 OK
```

#### Get Expiring Items
```http
GET /api/v1/inventory/alerts/expiring

Query Parameters:
  - days: integer (default: 30) - items expiring in N days

Response: 200 OK
```

### 4. Categories

```http
GET    /api/v1/inventory/categories
POST   /api/v1/inventory/categories
GET    /api/v1/inventory/categories/{id}
PUT    /api/v1/inventory/categories/{id}
DELETE /api/v1/inventory/categories/{id}
```

---

## Procurement API

### 1. Purchase Requisitions (PR)

#### List Requisitions
```http
GET /api/v1/procurement/requisitions

Query Parameters:
  - status: string (draft, submitted, approved, rejected)
  - department: string
  - from_date: date
  - to_date: date
  - page: integer
  - per_page: integer

Response: 200 OK
```

#### Create Requisition
```http
POST /api/v1/procurement/requisitions

Request:
{
  "department": "Kitchen",
  "requested_by": "chef@rahah24.com",
  "required_date": "2025-02-01",
  "priority": "normal",  // low, normal, high, urgent
  "notes": "Monthly stock replenishment",
  "items": [
    {
      "item_id": 1,
      "quantity": 100,
      "estimated_cost": 12000.00,
      "notes": "Premium quality required"
    }
  ]
}

Response: 201 Created
```

#### Submit for Approval
```http
POST /api/v1/procurement/requisitions/{pr_id}/submit

Response: 200 OK
```

#### Approve/Reject Requisition
```http
POST /api/v1/procurement/requisitions/{pr_id}/approve

Request:
{
  "action": "approve",  // approve, reject
  "approval_level": 1,  // 1, 2, 3
  "comments": "Approved as per budget"
}

Response: 200 OK
```

### 2. Purchase Orders (PO)

#### Create Purchase Order from PR
```http
POST /api/v1/procurement/purchase-orders

Request:
{
  "pr_id": 10,
  "vendor_id": 5,
  "delivery_date": "2025-02-05",
  "payment_terms": "NET_30",
  "notes": "Deliver to Warehouse A",
  "items": [
    {
      "item_id": 1,
      "quantity": 100,
      "unit_price": 120.00,
      "tax_rate": 0.15,
      "discount": 0
    }
  ]
}

Response: 201 Created
```

#### Send PO to Vendor
```http
POST /api/v1/procurement/purchase-orders/{po_id}/send

Request:
{
  "email": "vendor@supplier.com",
  "cc": ["purchasing@rahah24.com"]
}

Response: 200 OK
```

### 3. Goods Receipt Notes (GRN)

#### Create GRN
```http
POST /api/v1/procurement/grn

Request:
{
  "po_id": 15,
  "received_date": "2025-02-05",
  "received_by": "warehouse@rahah24.com",
  "notes": "All items in good condition",
  "items": [
    {
      "po_item_id": 50,
      "received_quantity": 98,  // May differ from ordered
      "rejected_quantity": 2,
      "rejection_reason": "Damaged packaging",
      "batch_number": "BATCH-2025-001",
      "expiry_date": "2026-02-05",
      "quality_check": "passed"
    }
  ]
}

Response: 201 Created
```

---

## Vendor Management API

### List Vendors
```http
GET /api/v1/vendors

Query Parameters:
  - status: string (active, inactive, pending_approval)
  - search: string
  - payment_terms: string
  - page: integer
  - per_page: integer

Response: 200 OK
```

### Create Vendor
```http
POST /api/v1/vendors

Request:
{
  "name": "ABC Suppliers",
  "code": "VEN-001",
  "email": "contact@abcsuppliers.com",
  "phone": "+92-300-1234567",
  "address": "123 Main Street, Karachi",
  "city": "Karachi",
  "country": "Pakistan",
  "payment_terms": "NET_30",  // CASH, NET_15, NET_30, NET_45, NET_60
  "credit_limit": 500000.00,
  "tax_number": "NTN-123456",
  "bank_details": {
    "bank_name": "HBL",
    "account_number": "1234567890",
    "iban": "PK12HABB1234567890"
  },
  "contact_person": {
    "name": "John Doe",
    "email": "john@abcsuppliers.com",
    "phone": "+92-300-9876543"
  }
}

Response: 201 Created
```

### Vendor Performance
```http
GET /api/v1/vendors/{vendor_id}/performance

Response: 200 OK
{
  "success": true,
  "data": {
    "vendor_id": 5,
    "vendor_name": "ABC Suppliers",
    "metrics": {
      "total_orders": 45,
      "total_value": 2500000.00,
      "on_time_delivery_rate": 92.5,
      "quality_acceptance_rate": 95.0,
      "average_response_time_hours": 12,
      "rating": 4.5
    },
    "recent_issues": [...]
  }
}
```

---

## Approval Workflows API

### Get Pending Approvals
```http
GET /api/v1/approvals/pending

Query Parameters:
  - type: string (pr, po, vendor, expense)
  - level: integer (1, 2, 3)

Response: 200 OK
```

### Approve/Reject
```http
POST /api/v1/approvals/{approval_id}/action

Request:
{
  "action": "approve",  // approve, reject, request_changes
  "comments": "Approved as per policy",
  "conditions": "Deliver within 7 days"
}

Response: 200 OK
```

---

## Reports API

### Inventory Reports
```http
GET /api/v1/reports/inventory/stock-status
GET /api/v1/reports/inventory/movement-summary
GET /api/v1/reports/inventory/valuation
GET /api/v1/reports/inventory/abc-analysis
GET /api/v1/reports/inventory/slow-moving
GET /api/v1/reports/inventory/dead-stock
```

### Procurement Reports
```http
GET /api/v1/reports/procurement/purchase-analysis
GET /api/v1/reports/procurement/vendor-performance
GET /api/v1/reports/procurement/price-variance
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

## Rate Limiting

- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour

Response headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1643724000
```

---

**Document Version**: 1.0
**Last Updated**: January 25, 2025
