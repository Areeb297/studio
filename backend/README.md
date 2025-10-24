# Rahah24 ERP - Backend API

FastAPI-based backend for Rahah24 ERP system.

## Quick Start

### 1. Create Virtual Environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 4. Run Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Access API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

See `backend.md` for detailed documentation.

## API Endpoints

### Health Check
```
GET /health
```

### Inventory
```
GET    /api/v1/inventory/items
POST   /api/v1/inventory/items
GET    /api/v1/inventory/items/{id}
PUT    /api/v1/inventory/items/{id}
DELETE /api/v1/inventory/items/{id}
```

### Procurement
```
GET    /api/v1/procurement/requisitions
POST   /api/v1/procurement/requisitions
GET    /api/v1/procurement/purchase-orders
POST   /api/v1/procurement/purchase-orders
```

### Vendors
```
GET    /api/v1/vendors
POST   /api/v1/vendors
GET    /api/v1/vendors/{id}
```

## Development

```bash
# Format code
black app/

# Lint
flake8 app/

# Type check
mypy app/

# Run tests
pytest
```

## Documentation

- Full backend documentation: `backend.md`
- API design: `../docs/architecture/API_DESIGN.md`
- Project structure: `../docs/architecture/PROJECT_STRUCTURE.md`

---

**Version**: 1.0.0
**Last Updated**: January 25, 2025
