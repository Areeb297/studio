# Frontend - Next.js Application

## Overview

The Rahah24 ERP frontend is built with Next.js 15, React 18, and TypeScript, providing a modern, responsive user interface for all business operations. The frontend communicates with both the FastAPI backend and Supabase directly for optimal performance.

---

## Quick Start

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn or pnpm
- Git

### Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

4. **Run development server**
```bash
npm run dev
```

5. **Access the application**
- Open http://localhost:9002 in your browser
- Login with demo credentials

---

## Project Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js 15 App Router
│   │   ├── (auth)/                   # Auth routes group
│   │   │   └── login/
│   │   ├── dashboard/                # Protected dashboard routes
│   │   │   ├── inventory/
│   │   │   ├── procurement/
│   │   │   ├── business/
│   │   │   ├── finance/
│   │   │   └── ...
│   │   ├── api/                      # API routes (Next.js)
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing page
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── inventory/                # Inventory-specific components
│   │   ├── procurement/              # Procurement components
│   │   ├── forms/                    # Form components
│   │   ├── tables/                   # Table components
│   │   └── charts/                   # Chart components
│   │
│   ├── lib/                          # Libraries & utilities
│   │   ├── api/                      # API client functions
│   │   │   ├── client.ts            # Base API client
│   │   │   ├── inventory.ts         # Inventory API calls
│   │   │   ├── procurement.ts       # Procurement API calls
│   │   │   └── vendors.ts           # Vendor API calls
│   │   ├── supabase/                # Supabase configuration
│   │   │   ├── client.ts            # Client-side Supabase
│   │   │   ├── server.ts            # Server-side Supabase
│   │   │   └── database.types.ts    # Generated types
│   │   ├── utils.ts                 # Utility functions
│   │   └── constants.ts             # Constants
│   │
│   ├── types/                        # TypeScript types
│   │   ├── inventory.ts
│   │   ├── procurement.ts
│   │   ├── api.ts
│   │   └── database.ts
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useInventory.ts
│   │   ├── useProcurement.ts
│   │   └── useAuth.ts
│   │
│   └── styles/                       # Global styles
│       └── globals.css
│
├── public/                           # Static assets
│   ├── images/
│   └── icons/
│
├── .env.local                        # Environment variables (gitignored)
├── .env.local.example                # Example environment file
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS config
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependencies
├── frontend.md                       # This file
└── README.md                         # Setup instructions
```

---

## Environment Variables

### .env.local.example
```env
# Next.js
NEXT_PUBLIC_APP_NAME=Rahah24 ERP
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=development

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1

# Supabase (Direct Access)
NEXT_PUBLIC_SUPABASE_URL=https://bfewxhtlrxedlifiakok.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_INSIGHTS=true
NEXT_PUBLIC_ENABLE_REAL_TIME=true

# Development
NEXT_PUBLIC_DEV_MODE=true
```

---

## API Client Setup

### Base API Client (src/lib/api/client.ts)

```typescript
// src/lib/api/client.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/${API_VERSION}`;
  }

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return response.json();
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return response.json();
  }
}

export const apiClient = new ApiClient();
```

### Inventory API Client (src/lib/api/inventory.ts)

```typescript
// src/lib/api/inventory.ts

import { apiClient, ApiResponse } from './client';
import type { InventoryItem, InventoryItemCreate, InventoryItemUpdate } from '@/types/inventory';

export interface InventoryListResponse {
  items: InventoryItem[];
  total: number;
  page: number;
  pages: number;
}

export const inventoryApi = {
  // List all items with filters
  getItems: async (params?: {
    category_id?: number;
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<InventoryListResponse>> => {
    return apiClient.get('/inventory/items', params);
  },

  // Get single item by ID
  getItem: async (id: number): Promise<ApiResponse<InventoryItem>> => {
    return apiClient.get(`/inventory/items/${id}`);
  },

  // Create new item
  createItem: async (data: InventoryItemCreate): Promise<ApiResponse<InventoryItem>> => {
    return apiClient.post('/inventory/items', data);
  },

  // Update existing item
  updateItem: async (id: number, data: InventoryItemUpdate): Promise<ApiResponse<InventoryItem>> => {
    return apiClient.put(`/inventory/items/${id}`, data);
  },

  // Delete item
  deleteItem: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/inventory/items/${id}`);
  },

  // Get low stock alerts
  getLowStockItems: async (): Promise<ApiResponse<InventoryItem[]>> => {
    return apiClient.get('/inventory/alerts/low-stock');
  },

  // Get items needing reorder
  getReorderItems: async (): Promise<ApiResponse<InventoryItem[]>> => {
    return apiClient.get('/inventory/alerts/reorder');
  },
};
```

---

## TypeScript Types

### Inventory Types (src/types/inventory.ts)

```typescript
// src/types/inventory.ts

export interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category_id: number;
  category?: InventoryCategory;
  unit_of_measure: string;
  current_stock: number;
  min_level: number;
  max_level: number;
  reorder_level: number;
  unit_cost: number;
  total_value: number;
  status: 'active' | 'low_stock' | 'out_of_stock' | 'discontinued';
  location?: string;
  supplier_id?: number;
  last_restocked?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryCategory {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
}

export interface InventoryItemCreate {
  name: string;
  sku: string;
  category_id: number;
  unit_of_measure: string;
  min_level: number;
  max_level: number;
  reorder_level: number;
  unit_cost: number;
  location?: string;
  supplier_id?: number;
}

export interface InventoryItemUpdate extends Partial<InventoryItemCreate> {}

export interface StockMovement {
  id: number;
  item_id: number;
  movement_type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reference_type?: string;
  reference_id?: number;
  notes?: string;
  created_by: string;
  created_at: string;
}
```

---

## Custom React Hooks

### useInventory Hook (src/hooks/useInventory.ts)

```typescript
// src/hooks/useInventory.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '@/lib/api/inventory';
import type { InventoryItem, InventoryItemCreate, InventoryItemUpdate } from '@/types/inventory';

export const useInventoryItems = (params?: any) => {
  return useQuery({
    queryKey: ['inventory-items', params],
    queryFn: () => inventoryApi.getItems(params),
  });
};

export const useInventoryItem = (id: number) => {
  return useQuery({
    queryKey: ['inventory-item', id],
    queryFn: () => inventoryApi.getItem(id),
    enabled: !!id,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InventoryItemCreate) => inventoryApi.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: InventoryItemUpdate }) =>
      inventoryApi.updateItem(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-item', variables.id] });
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => inventoryApi.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
    },
  });
};

export const useLowStockItems = () => {
  return useQuery({
    queryKey: ['low-stock-items'],
    queryFn: () => inventoryApi.getLowStockItems(),
    refetchInterval: 60000, // Refresh every minute
  });
};
```

---

## Component Example

### Inventory Item Form Component

```typescript
// src/components/inventory/InventoryItemForm.tsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateInventoryItem } from '@/hooks/useInventory';
import type { InventoryItemCreate } from '@/types/inventory';

const inventoryItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category_id: z.number().min(1, 'Category is required'),
  unit_of_measure: z.string().min(1, 'Unit of measure is required'),
  min_level: z.number().min(0, 'Min level must be >= 0'),
  max_level: z.number().min(1, 'Max level must be > 0'),
  reorder_level: z.number().min(0, 'Reorder level must be >= 0'),
  unit_cost: z.number().min(0, 'Unit cost must be >= 0'),
});

export function InventoryItemForm({ onSuccess }: { onSuccess?: () => void }) {
  const createItem = useCreateInventoryItem();

  const form = useForm<InventoryItemCreate>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: '',
      sku: '',
      category_id: 0,
      unit_of_measure: 'kg',
      min_level: 0,
      max_level: 100,
      reorder_level: 20,
      unit_cost: 0,
    },
  });

  const onSubmit = async (data: InventoryItemCreate) => {
    try {
      await createItem.mutateAsync(data);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create item:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter item name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input placeholder="ITEM-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add more fields... */}

        <Button type="submit" disabled={createItem.isPending}>
          {createItem.isPending ? 'Creating...' : 'Create Item'}
        </Button>
      </form>
    </Form>
  );
}
```

---

## Data Fetching Strategy

### Hybrid Approach

1. **Backend API (FastAPI) for:**
   - Complex business logic
   - Write operations (CREATE, UPDATE, DELETE)
   - Multi-table transactions
   - Approval workflows
   - Calculations and aggregations

2. **Supabase Direct Access for:**
   - Simple read operations
   - Dashboard statistics
   - Real-time subscriptions
   - Quick queries

### Example Page with Both Approaches

```typescript
// src/app/dashboard/inventory/page.tsx

'use client';

import { useInventoryItems, useLowStockItems } from '@/hooks/useInventory';
import { InventoryTable } from '@/components/inventory/InventoryTable';
import { LowStockAlert } from '@/components/inventory/LowStockAlert';

export default function InventoryPage() {
  // Fetch from backend API
  const { data: items, isLoading } = useInventoryItems();

  // Fetch low stock alerts (also from backend)
  const { data: lowStockItems } = useLowStockItems();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inventory Management</h1>

      {lowStockItems && lowStockItems.data && lowStockItems.data.length > 0 && (
        <LowStockAlert items={lowStockItems.data} />
      )}

      <InventoryTable items={items?.data?.items || []} />
    </div>
  );
}
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Run type checking
npm run typecheck

# Format code
npm run format

# Analyze bundle
npm run analyze
```

---

## Key Features

### 1. Server-Side Rendering (SSR)
- Fast initial page loads
- SEO-friendly
- Better performance

### 2. Client-Side Navigation
- Instant page transitions
- Prefetching
- Smooth UX

### 3. Type Safety
- Full TypeScript support
- End-to-end type safety
- Autocomplete everywhere

### 4. Real-Time Updates
- Supabase real-time subscriptions
- Live data updates
- WebSocket connections

### 5. Optimistic Updates
- Instant UI feedback
- Automatic rollback on errors
- Better user experience

---

## Best Practices

1. **Always use TypeScript** - No `any` types
2. **Use React Query** - For all API calls
3. **Implement error boundaries** - Graceful error handling
4. **Add loading states** - Better UX
5. **Validate forms** - Zod schemas + react-hook-form
6. **Optimize images** - Next.js Image component
7. **Code splitting** - Dynamic imports for large components
8. **Accessibility** - ARIA labels, keyboard navigation
9. **Responsive design** - Mobile-first approach
10. **Testing** - Unit tests + integration tests

---

## Next Steps

1. ✅ Set up Next.js project
2. ✅ Install dependencies
3. ✅ Configure environment variables
4. ⏳ Create API client functions
5. ⏳ Build inventory components
6. ⏳ Connect to backend API
7. ⏳ Add error handling
8. ⏳ Implement real-time features

---

**Document Version**: 1.0
**Last Updated**: January 25, 2025
**Maintainer**: Rahah24 Development Team
