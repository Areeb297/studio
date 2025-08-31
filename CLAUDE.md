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