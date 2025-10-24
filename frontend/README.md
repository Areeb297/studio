# Rahah24 ERP - Frontend

Next.js 15 frontend application for Rahah24 ERP system.

## Quick Start

### 1. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Configure Environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Access Application
Open http://localhost:9002 in your browser

### Demo Credentials
- Admin: admin@rahah24.com / Admin123!@#
- Manager: manager@rahah24.com / Manager123!@#

## Project Structure

See `frontend.md` for detailed documentation.

## Key Features

- **Server-Side Rendering** - Fast initial loads
- **Type Safety** - Full TypeScript support
- **React Query** - Efficient data fetching
- **shadcn/ui** - Beautiful UI components
- **Tailwind CSS** - Utility-first styling
- **Real-time Updates** - Supabase subscriptions

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

## Documentation

- Full frontend documentation: `frontend.md`
- Project structure: `../docs/architecture/PROJECT_STRUCTURE.md`
- Component library: shadcn/ui docs

---

**Version**: 1.0.0
**Last Updated**: January 25, 2025
