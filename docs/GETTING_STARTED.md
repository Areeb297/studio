# Getting Started - Rahah24 ERP

Welcome to Rahah24 ERP! This guide will help you set up the complete development environment for both backend and frontend.

---

## 📋 Prerequisites

### Required Software
- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+ or 20+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/downloads)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com/)

### Accounts Needed
- **Supabase Account** - [Sign up](https://supabase.com/)
- **Vercel Account** (optional, for deployment) - [Sign up](https://vercel.com/)

---

## 🚀 Quick Setup (Development)

### Step 1: Clone Repository
```bash
cd "C:\Users\areeb\OneDrive\Documents\Rahah 24 Project\Rahah24 App\studio"
```

---

## 🔧 Backend Setup (FastAPI)

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Python Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### 3. Install Python Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure Environment Variables
```bash
# Copy example file
copy .env.example .env

# Edit .env file with your Supabase credentials
# Use VS Code or any text editor
code .env
```

**Required Environment Variables:**
```env
SUPABASE_URL=https://bfewxhtlrxedlifiakok.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
SECRET_KEY=generate-a-secure-random-key-here
```

### 5. Create Initial Backend Structure
```bash
# Create app directories
mkdir app
cd app
mkdir api core models schemas services utils
mkdir api\v1
mkdir api\v1\endpoints
cd ..

# Create __init__.py files
type nul > app\__init__.py
type nul > app\api\__init__.py
type nul > app\api\v1\__init__.py
type nul > app\api\v1\endpoints\__init__.py
type nul > app\core\__init__.py
type nul > app\models\__init__.py
type nul > app\schemas\__init__.py
type nul > app\services\__init__.py
type nul > app\utils\__init__.py
```

### 6. Run Backend Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 7. Verify Backend is Running
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

---

## 💻 Frontend Setup (Next.js)

### 1. Navigate to Frontend Directory
```bash
cd ../frontend
# Note: frontend is currently the root studio/ directory
# For now, we're in the current directory structure
```

### 2. Install Node Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables
```bash
# Copy example file (if exists)
copy .env.local.example .env.local

# Or create new .env.local file
code .env.local
```

**Required Environment Variables:**
```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://bfewxhtlrxedlifiakok.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Frontend Development Server
```bash
npm run dev
```

### 5. Verify Frontend is Running
- Open http://localhost:9002 in your browser
- You should see the Rahah24 landing page

---

## 🗄️ Database Setup (Supabase)

### 1. Access Supabase Dashboard
- Go to https://supabase.com/dashboard
- Select your project: **Rahah24** (bfewxhtlrxedlifiakok)

### 2. Verify Database Tables
Navigate to SQL Editor and run:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### 3. Required Tables (for Phase 1 - Inventory)
If tables don't exist, create them using SQL migrations in `database/schemas/`

Key tables needed:
- `inventory_items`
- `inventory_categories`
- `stock_movements`
- `vendors`
- `purchase_requisitions`
- `purchase_orders`
- `goods_receipt_notes`

### 4. Enable Row Level Security (RLS)
Ensure RLS is enabled for all tables:
```sql
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
```

---

## 🧪 Testing the Setup

### Backend Testing
```bash
# In backend directory with venv activated
cd backend
pytest

# Or test specific endpoint
curl http://localhost:8000/health
```

### Frontend Testing
```bash
# In frontend directory
cd frontend
npm run lint
npm run typecheck
```

### API Integration Testing
1. Start backend: `http://localhost:8000`
2. Start frontend: `http://localhost:9002`
3. Login with demo credentials
4. Navigate to Inventory Management
5. Try creating a new item

---

## 📁 Project Structure Overview

```
rahah24-erp/
├── backend/                 # FastAPI Backend
│   ├── app/                # Application code
│   ├── tests/              # Backend tests
│   ├── venv/               # Virtual environment
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Backend config
│
├── frontend/               # Next.js Frontend (current structure)
│   ├── src/
│   │   ├── app/           # Next.js routes
│   │   ├── components/    # React components
│   │   └── lib/           # Utilities
│   ├── package.json       # Node dependencies
│   └── .env.local         # Frontend config
│
└── docs/                   # Documentation
    ├── architecture/      # Architecture docs
    ├── modules/           # Module-specific docs
    └── phase-1-development/ # Development tasks
```

---

## 🔑 Demo Credentials

### Admin Account
- **Email**: admin@rahah24.com
- **Password**: Admin123!@#
- **Role**: Full system access

### Manager Account
- **Email**: manager@rahah24.com
- **Password**: Manager123!@#
- **Role**: Limited access

---

## 🛠️ Development Workflow

### 1. Start Development Session
```bash
# Terminal 1 - Backend
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 2. Make Changes
- Backend: Edit files in `backend/app/`
- Frontend: Edit files in `src/`
- Both will hot-reload automatically

### 3. Test Changes
- Backend: http://localhost:8000/docs
- Frontend: http://localhost:9002

---

## 📚 Next Steps

### Phase 1: Inventory System Development

1. **Backend Development**
   - [ ] Create `app/main.py` - FastAPI entry point
   - [ ] Create `app/core/config.py` - Configuration
   - [ ] Create `app/core/database.py` - Supabase connection
   - [ ] Create inventory endpoints in `app/api/v1/endpoints/inventory.py`
   - [ ] Create inventory schemas in `app/schemas/inventory.py`
   - [ ] Create inventory service in `app/services/inventory_service.py`

2. **Frontend Development**
   - [ ] Create API client in `src/lib/api/client.ts`
   - [ ] Create inventory API client in `src/lib/api/inventory.ts`
   - [ ] Create inventory types in `src/types/inventory.ts`
   - [ ] Create inventory hooks in `src/hooks/useInventory.ts`
   - [ ] Update inventory pages to use backend API

3. **Database**
   - [ ] Create missing tables
   - [ ] Set up RLS policies
   - [ ] Create initial seed data

4. **Testing**
   - [ ] Write backend unit tests
   - [ ] Write frontend component tests
   - [ ] Integration testing

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'app'`
**Solution**: Ensure you're running from backend/ directory and venv is activated

**Problem**: `Connection refused to Supabase`
**Solution**: Check `.env` file has correct `SUPABASE_URL` and `SUPABASE_KEY`

**Problem**: `Port 8000 already in use`
**Solution**:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Change port
uvicorn app.main:app --reload --port 8001
```

### Frontend Issues

**Problem**: `Module not found` errors
**Solution**:
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem**: `API calls failing`
**Solution**: Verify `NEXT_PUBLIC_API_URL` in `.env.local` is correct

### Database Issues

**Problem**: `Table does not exist`
**Solution**: Run database migrations or create tables manually

**Problem**: `RLS policy violation`
**Solution**: Check Supabase RLS policies are configured correctly

---

## 📖 Documentation Links

- [Backend Documentation](../backend/backend.md)
- [Frontend Documentation](../frontend/frontend.md)
- [API Design](./architecture/API_DESIGN.md)
- [Project Structure](./architecture/PROJECT_STRUCTURE.md)
- [Inventory Module](./modules/operations/inventory/README.md)

---

## 💬 Support

For questions or issues:
- Check documentation in `/docs`
- Review GitHub issues
- Contact development team

---

**Document Version**: 1.0
**Last Updated**: January 25, 2025
**Status**: Initial Setup Guide
