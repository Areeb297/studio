# Backend - FastAPI Python Server

## Overview

The Rahah24 ERP backend is built with FastAPI, providing a robust, high-performance REST API for all business operations. This backend handles complex business logic, data validation, multi-table transactions, and serves as the single source of truth for all write operations.

---

## Quick Start

### Prerequisites
- Python 3.11 or higher
- pip (Python package manager)
- PostgreSQL client tools (optional, for direct DB access)
- Git

### Installation

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

5. **Run the server**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

6. **Access API documentation**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py           # Authentication endpoints
│   │   │   │   ├── inventory.py      # Inventory CRUD
│   │   │   │   ├── stock_levels.py   # Min/Max/Reorder levels
│   │   │   │   ├── procurement.py    # PR, PO, GRN
│   │   │   │   ├── vendors.py        # Vendor management
│   │   │   │   ├── approvals.py      # Approval workflows
│   │   │   │   └── reports.py        # Report generation
│   │   │   └── api.py                # API router aggregator
│   │   └── deps.py                   # Dependency injection
│   ├── core/
│   │   ├── config.py                 # Settings & environment
│   │   ├── security.py               # JWT, password hashing
│   │   └── database.py               # Supabase connection
│   ├── models/
│   │   ├── inventory.py              # Inventory models
│   │   ├── procurement.py            # Procurement models
│   │   └── user.py                   # User models
│   ├── schemas/
│   │   ├── inventory.py              # Request/response schemas
│   │   ├── procurement.py
│   │   └── common.py                 # Shared schemas
│   ├── services/
│   │   ├── inventory_service.py      # Business logic
│   │   ├── procurement_service.py
│   │   └── approval_service.py
│   ├── utils/
│   │   ├── helpers.py                # Helper functions
│   │   └── validators.py             # Custom validators
│   └── main.py                       # FastAPI app entry point
├── tests/
│   ├── __init__.py
│   ├── test_inventory.py
│   └── test_procurement.py
├── alembic/                          # Database migrations (optional)
├── venv/                             # Virtual environment (gitignored)
├── .env                              # Environment variables (gitignored)
├── .env.example                      # Example env file
├── requirements.txt                  # Python dependencies
├── backend.md                        # This file
└── README.md                         # Setup instructions
```

---

## Core Dependencies

### requirements.txt
```txt
# FastAPI Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6

# Supabase & Database
supabase==2.0.3
postgrest-py==0.13.0
psycopg2-binary==2.9.9

# Authentication & Security
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.0

# Data Validation & Serialization
pydantic==2.5.0
pydantic-settings==2.1.0
email-validator==2.1.0

# HTTP Client
httpx==0.25.2

# Date/Time handling
python-dateutil==2.8.2

# Testing
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2

# Code Quality
black==23.12.0
flake8==6.1.0
mypy==1.7.1

# CORS
fastapi-cors==0.0.6
```

---

## Environment Variables

### .env.example
```env
# Application
APP_NAME=Rahah24 ERP Backend
APP_VERSION=1.0.0
DEBUG=True
ENVIRONMENT=development

# Server
HOST=0.0.0.0
PORT=8000

# Supabase Configuration
SUPABASE_URL=https://bfewxhtlrxedlifiakok.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here

# Database
DATABASE_URL=postgresql://postgres:[password]@db.bfewxhtlrxedlifiakok.supabase.co:5432/postgres

# JWT Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# CORS Origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:9002,http://localhost:3000

# Logging
LOG_LEVEL=INFO
```

---

## API Structure

### Main Application (app/main.py)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    openapi_url="/api/v1/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Rahah24 ERP API",
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "environment": settings.ENVIRONMENT}
```

---

## Inventory Module API Endpoints

### Inventory Items

#### List All Items
```http
GET /api/v1/inventory/items
Query Parameters:
  - category_id: int (optional)
  - search: string (optional)
  - status: string (optional) - active, low_stock, out_of_stock
  - page: int (default: 1)
  - limit: int (default: 50)

Response: 200 OK
{
  "success": true,
  "data": {
    "items": [...],
    "total": 150,
    "page": 1,
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
    "sku": "RICE-001",
    "category_id": 5,
    "unit_of_measure": "kg",
    "current_stock": 150.5,
    "min_level": 50,
    "max_level": 500,
    "reorder_level": 100,
    "unit_cost": 120.00,
    "status": "active",
    "created_at": "2025-01-20T10:00:00Z"
  }
}
```

#### Create Item
```http
POST /api/v1/inventory/items
Content-Type: application/json

Request Body:
{
  "name": "Basmati Rice",
  "sku": "RICE-001",
  "category_id": 5,
  "unit_of_measure": "kg",
  "min_level": 50,
  "max_level": 500,
  "reorder_level": 100,
  "unit_cost": 120.00
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

Request Body: (same as create)
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

### Stock Movements

```http
POST /api/v1/inventory/stock-movements

Request Body:
{
  "item_id": 1,
  "movement_type": "in",  # in, out, adjustment
  "quantity": 50,
  "reference_type": "purchase_order",
  "reference_id": 123,
  "notes": "Received from supplier"
}

Response: 201 Created
```

### Stock Alerts

```http
GET /api/v1/inventory/alerts
GET /api/v1/inventory/alerts/low-stock
GET /api/v1/inventory/alerts/reorder
GET /api/v1/inventory/alerts/expiry
```

---

## Procurement Module API Endpoints

### Purchase Requisitions (PR)

```http
GET    /api/v1/procurement/requisitions
POST   /api/v1/procurement/requisitions
GET    /api/v1/procurement/requisitions/{pr_id}
PUT    /api/v1/procurement/requisitions/{pr_id}
POST   /api/v1/procurement/requisitions/{pr_id}/submit
POST   /api/v1/procurement/requisitions/{pr_id}/approve
POST   /api/v1/procurement/requisitions/{pr_id}/reject
```

### Purchase Orders (PO)

```http
GET    /api/v1/procurement/purchase-orders
POST   /api/v1/procurement/purchase-orders
GET    /api/v1/procurement/purchase-orders/{po_id}
PUT    /api/v1/procurement/purchase-orders/{po_id}
POST   /api/v1/procurement/purchase-orders/{po_id}/approve
POST   /api/v1/procurement/purchase-orders/{po_id}/send
```

### Goods Receipt Notes (GRN)

```http
GET    /api/v1/procurement/grn
POST   /api/v1/procurement/grn
GET    /api/v1/procurement/grn/{grn_id}
POST   /api/v1/procurement/grn/{grn_id}/receive
```

### Vendors

```http
GET    /api/v1/vendors
POST   /api/v1/vendors
GET    /api/v1/vendors/{vendor_id}
PUT    /api/v1/vendors/{vendor_id}
POST   /api/v1/vendors/{vendor_id}/approve
GET    /api/v1/vendors/{vendor_id}/performance
```

---

## Authentication & Authorization

### JWT Token Flow

1. **Login**
```http
POST /api/v1/auth/login
{
  "email": "admin@rahah24.com",
  "password": "password"
}

Response:
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": { ... }
}
```

2. **Protected Endpoints**
```http
GET /api/v1/inventory/items
Authorization: Bearer eyJ...
```

3. **Token Validation**
- Backend validates JWT token
- Checks Supabase Auth
- Verifies user permissions
- Returns 401 if unauthorized

---

## Business Logic Services

### Example: InventoryService

```python
# app/services/inventory_service.py

from typing import List, Optional
from app.core.database import supabase
from app.schemas.inventory import InventoryItemCreate, InventoryItemUpdate

class InventoryService:
    async def get_items(
        self,
        category_id: Optional[int] = None,
        search: Optional[str] = None,
        page: int = 1,
        limit: int = 50
    ) -> dict:
        """Get paginated inventory items with filters"""
        query = supabase.table('inventory_items').select('*')

        if category_id:
            query = query.eq('category_id', category_id)

        if search:
            query = query.ilike('name', f'%{search}%')

        # Pagination
        offset = (page - 1) * limit
        query = query.range(offset, offset + limit - 1)

        response = query.execute()

        return {
            "items": response.data,
            "total": len(response.data),
            "page": page,
            "limit": limit
        }

    async def create_item(self, item: InventoryItemCreate) -> dict:
        """Create new inventory item"""
        response = supabase.table('inventory_items').insert(
            item.model_dump()
        ).execute()

        return response.data[0]

    async def check_reorder_level(self, item_id: int) -> bool:
        """Check if item needs reordering"""
        response = supabase.table('inventory_items').select(
            'current_stock', 'reorder_level'
        ).eq('id', item_id).single().execute()

        item = response.data
        return item['current_stock'] <= item['reorder_level']

inventory_service = InventoryService()
```

---

## Testing

### Run Tests
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_inventory.py

# Run with verbose output
pytest -v
```

### Example Test
```python
# tests/test_inventory.py

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_inventory_items():
    response = client.get("/api/v1/inventory/items")
    assert response.status_code == 200
    assert "data" in response.json()

def test_create_inventory_item():
    item_data = {
        "name": "Test Item",
        "sku": "TEST-001",
        "category_id": 1,
        "unit_of_measure": "kg",
        "min_level": 10,
        "max_level": 100,
        "reorder_level": 20
    }
    response = client.post("/api/v1/inventory/items", json=item_data)
    assert response.status_code == 201
```

---

## Development Commands

```bash
# Activate virtual environment
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --port 8000

# Format code
black app/

# Lint code
flake8 app/

# Type checking
mypy app/

# Run tests
pytest

# Generate requirements
pip freeze > requirements.txt
```

---

## Deployment

### Production Checklist
- [ ] Update `.env` with production credentials
- [ ] Set `DEBUG=False`
- [ ] Configure production CORS origins
- [ ] Set up HTTPS
- [ ] Enable rate limiting
- [ ] Configure logging
- [ ] Set up monitoring (Sentry, DataDog)
- [ ] Database connection pooling
- [ ] Load balancing

### Deploy to Vercel (Serverless)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway up
```

---

## Next Steps

1. ✅ Set up virtual environment
2. ✅ Install dependencies
3. ✅ Configure environment variables
4. ⏳ Create database models
5. ⏳ Implement inventory endpoints
6. ⏳ Add authentication middleware
7. ⏳ Write tests
8. ⏳ Connect frontend to backend

---

**Document Version**: 1.0
**Last Updated**: January 25, 2025
**Maintainer**: Rahah24 Development Team
