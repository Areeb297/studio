# Rahah24 ERP - Project Structure

## Overview

Rahah24 ERP is transitioning from a prototype to a production-ready, full-fledged application with clear separation between backend and frontend layers.

## Architecture

```
rahah24-erp/
├── backend/                    # FastAPI Python Backend
│   ├── app/
│   │   ├── api/               # API route handlers
│   │   │   ├── v1/           # API version 1
│   │   │   │   ├── endpoints/ # Individual endpoint modules
│   │   │   │   │   ├── inventory.py
│   │   │   │   │   ├── procurement.py
│   │   │   │   │   ├── vendors.py
│   │   │   │   │   ├── auth.py
│   │   │   │   │   └── ...
│   │   │   │   └── api.py    # API router aggregator
│   │   │   └── deps.py       # Dependencies (DB, auth, etc.)
│   │   ├── core/             # Core configuration
│   │   │   ├── config.py     # Settings & environment variables
│   │   │   ├── security.py   # Authentication & authorization
│   │   │   └── database.py   # Database connection
│   │   ├── models/           # SQLAlchemy/Pydantic models
│   │   │   ├── inventory.py
│   │   │   ├── procurement.py
│   │   │   ├── vendors.py
│   │   │   └── ...
│   │   ├── schemas/          # Pydantic schemas (request/response)
│   │   │   ├── inventory.py
│   │   │   ├── procurement.py
│   │   │   └── ...
│   │   ├── services/         # Business logic layer
│   │   │   ├── inventory_service.py
│   │   │   ├── procurement_service.py
│   │   │   └── ...
│   │   ├── utils/            # Utility functions
│   │   │   ├── helpers.py
│   │   │   └── validators.py
│   │   └── main.py           # FastAPI application entry point
│   ├── tests/                # Backend tests
│   │   ├── test_inventory.py
│   │   └── ...
│   ├── alembic/              # Database migrations
│   │   └── versions/
│   ├── venv/                 # Python virtual environment (gitignored)
│   ├── requirements.txt      # Python dependencies
│   ├── .env                  # Environment variables (gitignored)
│   ├── .env.example          # Example environment variables
│   ├── backend.md            # Backend documentation
│   └── README.md             # Backend setup instructions
│
├── frontend/                  # Next.js Frontend (current studio/)
│   ├── src/
│   │   ├── app/              # Next.js 15 app router
│   │   ├── components/       # React components
│   │   ├── lib/              # Utilities & configurations
│   │   │   ├── api/         # API client functions
│   │   │   │   ├── inventory.ts
│   │   │   │   ├── procurement.ts
│   │   │   │   └── ...
│   │   │   └── supabase/    # Supabase client
│   │   ├── types/            # TypeScript types
│   │   └── hooks/            # Custom React hooks
│   ├── public/               # Static assets
│   ├── frontend.md           # Frontend documentation
│   ├── package.json
│   └── README.md
│
├── docs/                      # Project documentation
│   ├── architecture/         # Architecture documentation
│   │   ├── PROJECT_STRUCTURE.md (this file)
│   │   ├── API_DESIGN.md
│   │   └── DATABASE_SCHEMA.md
│   ├── phase-1-development/  # Development tasks
│   ├── modules/              # Module-specific docs
│   │   └── operations/
│   │       └── inventory/
│   └── ...
│
└── database/                  # Database scripts & migrations
    ├── schemas/              # SQL schemas
    ├── seeds/                # Seed data
    └── migrations/           # Manual migration scripts
```

## Technology Stack

### Backend
- **Framework**: FastAPI 0.104+
- **Language**: Python 3.11+
- **API Documentation**: OpenAPI (Swagger) auto-generated
- **Authentication**: JWT tokens via Supabase Auth
- **Database ORM**: SQLAlchemy (optional, for complex queries)
- **Database**: Supabase (PostgreSQL 17.4)
- **Server**: Uvicorn (ASGI server)
- **Testing**: pytest
- **Code Quality**: black, flake8, mypy

### Frontend
- **Framework**: Next.js 15.3.3
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query (TanStack Query)
- **API Client**: Fetch API / Axios
- **Authentication**: Supabase Auth Helpers

### Database
- **Provider**: Supabase
- **Database**: PostgreSQL 17.4.1.074
- **Region**: us-east-2
- **Features**: Row Level Security (RLS), Real-time subscriptions

## Development Workflow

### 1. Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Development
```bash
cd frontend
npm install
npm run dev  # Runs on port 9002
```

### 3. API Communication
- Backend exposes REST API on `http://localhost:8000`
- Frontend makes API calls to backend
- Alternatively, frontend can directly query Supabase for read operations
- Backend handles complex business logic, writes, and validations

## API Design Principles

### RESTful Endpoints
```
GET    /api/v1/inventory/items          # List all items
GET    /api/v1/inventory/items/{id}     # Get item by ID
POST   /api/v1/inventory/items          # Create new item
PUT    /api/v1/inventory/items/{id}     # Update item
DELETE /api/v1/inventory/items/{id}     # Delete item
PATCH  /api/v1/inventory/items/{id}     # Partial update
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "errors": null
}
```

### Error Format
```json
{
  "success": false,
  "data": null,
  "message": "Validation error",
  "errors": [
    {
      "field": "quantity",
      "message": "Quantity must be greater than 0"
    }
  ]
}
```

## Security

### Authentication Flow
1. User logs in via Supabase Auth (frontend)
2. Frontend receives JWT token
3. Frontend includes token in API requests: `Authorization: Bearer <token>`
4. Backend validates token with Supabase
5. Backend checks user permissions via RLS

### Environment Variables
- Backend: `.env` file with Supabase credentials
- Frontend: `.env.local` with API endpoints and Supabase public keys
- Never commit `.env` files to version control

## Database Access

### Hybrid Approach
1. **Direct Supabase Access** (Frontend):
   - Read operations for dashboards and listings
   - Real-time subscriptions
   - Simple CRUD operations

2. **Backend API** (FastAPI):
   - Complex business logic
   - Multi-table transactions
   - Data validation and processing
   - Approval workflows
   - Calculations and aggregations

## Deployment Strategy

### Development
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:9002`
- Database: Supabase hosted

### Production
- Backend: Vercel / Railway / AWS Lambda
- Frontend: Vercel (Next.js optimized)
- Database: Supabase production instance

## Next Steps

1. Set up backend FastAPI structure
2. Create initial API endpoints for Inventory module
3. Configure database connections
4. Implement authentication middleware
5. Build API client in frontend
6. Migrate existing components to use backend APIs

---

**Document Version**: 1.0
**Last Updated**: January 25, 2025
**Status**: Transition from Prototype to Production
