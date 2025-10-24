# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rahah24 ERP is a comprehensive Islamic educational institution management system built for Jamia Binoria Aalamia. It's a Next.js 15.3.3 application with multiple business modules including restaurant management, academic (madrasa), events (shadi lawn), and fitness (gym time).

## Development Commands

### Core Development
- `npm run dev` - Start development server on port 9002 with Turbopack
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run analyze` - Build with bundle analyzer

### AI Development
- `npm run genkit:dev` - Start Genkit AI development server
- `npm run genkit:watch` - Start Genkit with file watching

### Authentication Setup
- `npm run create-demo-users` - Create full demo user accounts
- `npm run create-minimal-users` - Create minimal user accounts for testing
- `npm run setup-auth` - Full authentication setup with demo users
- `npm run setup-minimal-auth` - Minimal authentication setup

## Architecture

### Tech Stack
- **Frontend**: Next.js 15.3.3 with React 18, TypeScript
- **UI**: Tailwind CSS + Radix UI components (shadcn/ui)
- **Database**: Supabase (PostgreSQL) with comprehensive ERP schema
- **AI**: Google Genkit with Gemini 2.0 Flash model
- **State**: Tanstack React Query for server state
- **Auth**: Supabase Auth with role-based access control

### Key Libraries
- `@supabase/auth-helpers-nextjs` - Authentication integration
- `@tanstack/react-query` - Server state management  
- `recharts` - Chart components
- `lucide-react` - Icon library
- `next-themes` - Theme switching
- `zod` - Schema validation
- `react-hook-form` - Form handling

### Directory Structure
- `src/app/` - Next.js app router pages and API routes
- `src/components/` - Reusable React components (including shadcn/ui)
- `src/lib/` - Utility libraries and Supabase configuration
- `src/types/` - TypeScript type definitions
- `src/ai/` - AI/Genkit integration and flows
- `database/` - SQL schemas and seed data
- `docs/` - Project documentation

## Key Architecture Patterns

### Supabase Integration
- Client component access via `@/lib/supabase/client.ts`
- Server component access via `@/lib/supabase/server.ts`
- Database types generated in `@/lib/supabase/database.types.ts`
- Helper functions in client.ts for common operations

### Component Architecture
- Modular shadcn/ui components in `@/components/ui/`
- Business logic components in `@/components/[module]/`
- Layout components with collapsible sidebar navigation
- Theme provider with dark/light mode support

### AI Integration
- Genkit flows in `src/ai/flows/` for specific business logic
- Main AI instance configured in `src/ai/genkit.ts`
- Integration points throughout the application for insights

### Business Modules
The application supports multiple business lines:
- **Restaurant**: POS system, menu management, order tracking
- **Academic (Madrasa)**: Student management, fee collection, attendance
- **Events (Shadi Lawn)**: Event booking, venue management
- **Fitness (Gym Time)**: Membership management, trainer assignments

### Navigation Structure
Organized into sections:
- Executive (Dashboard, Analytics, AI Insights)
- Business Operations (Restaurant, Madrasa, Events, Gym)
- Financial Management (Accounting, Donations, Sales)
- Academic Affairs (Students, Fees, Attendance)
- Human Resources (Employees, Payroll, Departments)
- Operations (Inventory, Procurement, Facilities)
- Islamic Services (Qurbani, Donations, Events)

## Important Development Rules

### Currency Standard
**CRITICAL**: This application is for a Pakistani institution and uses Pakistani Rupees (PKR) as the primary currency.

1. **ALWAYS use PKR (Pakistani Rupees)** for all financial values
2. **NEVER use USD ($)** or other currencies unless explicitly specified
3. **Currency formatting**: Use "PKR" prefix or "Rs." prefix for Pakistani Rupees
4. **Example formats**:
   - ✅ CORRECT: "PKR 18,750" or "Rs. 18,750"
   - ❌ WRONG: "$18,750" or "USD 18,750"

**Important**: All financial displays, reports, dashboards, and documentation should default to PKR. This includes:
- Dashboard KPIs and metrics
- Financial reports and statements
- Invoice and receipt generation
- Budget and expense tracking
- Revenue and cost analysis

### Getting Current Date/Time
**CRITICAL**: When you need the current date or time for any purpose (documentation, timestamps, date calculations, etc.):

1. **NEVER use your knowledge cutoff date** (January 2025)
2. **ALWAYS use one of these methods**:
   - **WebSearch**: Perform a web search to get today's date
   - **Bash Command**: Run `date` command on the system
   - **Python**: Use `from datetime import datetime; datetime.now()`

**Example Scenarios**:
- ❌ WRONG: "Document Date: January 2025" (based on knowledge cutoff)
- ✅ CORRECT: Use WebSearch or `date` command, then "Document Date: January 21, 2025"

**Rationale**: Your knowledge cutoff is January 2025, but the actual current date may be different. Always fetch the real current date dynamically.

---

## Development Guidelines

### File Naming
- Use kebab-case for page files: `page.tsx`
- Use PascalCase for components: `FinancePage.tsx`
- Use lowercase for utilities: `accounting.ts`

### Import Paths
- Use `@/` alias for src/ imports
- Group imports: React, Next.js, third-party, local components, utilities

### Component Patterns
- Use shadcn/ui components as base building blocks
- Implement loading states and error boundaries
- Follow responsive design patterns with Tailwind CSS
- Use React Query for data fetching with proper cache keys

### Database Access
- Prefer Supabase helpers in client.ts for common operations
- Use proper TypeScript types from database.types.ts
- Implement proper error handling for database operations
- Follow row-level security (RLS) patterns

### AI Integration
- Use existing Genkit flows when possible
- Follow the pattern in `src/ai/flows/` for new AI features
- Integrate AI insights contextually within business workflows

## Development Phases & Current Focus

### **Phase 1 Focus: Operations Management & Inventory System** 🎯
**Status**: Active Development | **Priority**: HIGHEST

The primary focus for Phase 1 is implementing the comprehensive **Operations Management module**, specifically the **Inventory Management System** with all 14 sub-modules as defined in the requirements gathered by the Pakistani team.

**Why Operations/Inventory First?**
- ✅ Complete requirements documentation available
- ✅ Detailed BRD, TDD, and specifications ready
- ✅ 14 clearly defined sub-modules with scope
- ✅ Database schema designed (30+ tables)
- ✅ Immediate business impact and ROI
- ✅ Foundation for other modules (Procurement, Facilities)

**Phase 1 Deliverables** (12 weeks):
1. Complete database schema implementation (30+ tables)
2. All 14 inventory sub-modules
3. Purchase & Approval workflows (3-level)
4. Vendor management (15+ fields)
5. Recipe costing and variance tracking
6. Comprehensive reporting (16 report types)
7. Automated alerts (10 alert types)
8. Role-based permissions (7 user roles)
9. Testing and deployment
10. User training and documentation

**Investment**: PKR 500,000 | **Timeline**: 12 weeks | **ROI**: 600%

**Other modules** (Financial, Academic, HR, Islamic Services, Events) will be implemented in subsequent phases after Operations/Inventory is fully functional.

---

## Rube MCP & Database Configuration

### Default Database Credentials
**IMPORTANT**: When the user mentions "database" or asks to connect via Rube MCP, always refer to these credentials by default:

- **Project Name**: Rahah24
- **Project Reference ID**: `bfewxhtlrxedlifiakok`
- **Database Host**: `db.bfewxhtlrxedlifiakok.supabase.co`
- **Region**: `us-east-2`
- **PostgreSQL Version**: 17.4.1.074
- **Status**: ACTIVE_HEALTHY
- **Organization ID**: `fosvxczfygemwxfmejhu`

### Database Access via Rube MCP
- Supabase toolkit is connected and active
- Use `RUBE_SEARCH_TOOLS` to discover available database operations
- Use `RUBE_MULTI_EXECUTE_TOOL` to execute Supabase tools
- Session ID for workflow continuity: Always pass session_id in meta tool calls
- Available Supabase tools:
  - `SUPABASE_LIST_TABLES` - List all tables in the database
  - `SUPABASE_GET_TABLE_SCHEMAS` - Get detailed schema information
  - `SUPABASE_SELECT_FROM_TABLE` - Query data from tables
  - `SUPABASE_BETA_RUN_SQL_QUERY` - Execute custom SQL queries
  - `SUPABASE_GENERATE_TYPE_SCRIPT_TYPES` - Generate TypeScript types

### Database Schema Overview
- **auth** schema: 19 tables (user authentication, sessions, tokens)
- **public** schema: 2 tables (organization_units, user_profiles)
- **storage** schema: 7 tables (file storage infrastructure)