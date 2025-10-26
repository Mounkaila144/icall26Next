# Modular Architecture Guide

This Next.js project uses a modular architecture that mirrors the Laravel backend structure.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Access Admin Login

Navigate to: `http://localhost:3000/admin/login`

## Project Structure

```
icall26/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin routes (tenant-specific)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── superadmin/               # Superadmin routes (central)
│   └── (public)/                 # Public routes
│
├── src/
│   ├── modules/                  # Feature modules
│   │   ├── UsersGuard/           # Authentication module
│   │   │   ├── admin/            # Admin layer
│   │   │   │   ├── components/
│   │   │   │   │   └── LoginForm.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useAuth.ts
│   │   │   │   └── services/
│   │   │   │       └── authService.ts
│   │   │   ├── types/
│   │   │   │   └── auth.types.ts
│   │   │   └── index.ts          # Barrel export
│   │   └── README.md
│   │
│   └── shared/                   # Shared utilities
│       ├── lib/
│       │   ├── api-client.ts     # API client with tenant support
│       │   └── tenant-context.tsx # Tenant context provider
│       └── types/
│           └── api.types.ts
│
└── .env.local                    # Environment variables
```

## Module System

### Architecture Principles

1. **Layer Separation**: Each module has three layers
   - **Admin**: Tenant-specific administration
   - **Superadmin**: Central/global administration
   - **Frontend**: Public and user-facing features

2. **Self-Contained**: Each module contains its own:
   - Components
   - Hooks
   - Services
   - Types
   - Utils

3. **Barrel Exports**: Modules expose their public API via `index.ts`

### Example: UsersGuard Module

```typescript
// Import from module
import { LoginForm, useAuth, User } from '@/src/modules/UsersGuard';

// Use in your component
function MyPage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <p>Welcome {user?.user_login}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Multi-Tenancy

### Tenant Context

The application supports multi-tenancy via the `TenantProvider`:

```typescript
import { TenantProvider } from '@/src/shared/lib/tenant-context';

export default function Layout({ children }) {
  return (
    <TenantProvider>
      {children}
    </TenantProvider>
  );
}
```

### Using Tenant Context

```typescript
import { useTenant } from '@/src/shared/lib/tenant-context';

function MyComponent() {
  const { tenantId, setTenantId, domain, setDomain } = useTenant();

  // Tenant ID is automatically added to API calls
  // and persisted in localStorage
}
```

## API Integration

### API Client

All API calls use the shared client with automatic tenant header injection:

```typescript
import { createApiClient } from '@/src/shared/lib/api-client';

// For tenant-specific calls (admin/frontend)
const { tenantId } = useTenant();
const client = createApiClient(tenantId || undefined);

// For central calls (superadmin)
const client = createApiClient();

// Make requests
const response = await client.get('/admin/users');
```

### Features

- Automatic `X-Tenant-ID` header injection
- Automatic `Authorization: Bearer` token handling
- 401 error handling (auto-redirect to login)
- Base URL from environment variable

## Authentication Flow

### Admin Login

1. User enters Tenant ID, username, and password
2. Tenant ID is stored in context and localStorage
3. API call to `/api/admin/auth/login` with `X-Tenant-ID` header
4. Token is stored in localStorage
5. User is redirected to `/admin/dashboard`

### Protected Routes

```typescript
'use client';

import { useAuth } from '@/src/modules/UsersGuard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <div>Protected Content</div>;
}
```

## Creating New Modules

See `src/modules/README.md` for detailed instructions on creating new modules.

### Quick Template

```bash
# Create module structure
mkdir -p src/modules/YourModule/{admin,superadmin,frontend}/{components,hooks,services,utils}
mkdir src/modules/YourModule/types

# Create barrel export
touch src/modules/YourModule/index.ts
```

## TypeScript Path Aliases

Configured in `tsconfig.json`:

```json
{
  "paths": {
    "@/*": ["./*"],
    "@/modules/*": ["./src/modules/*"],
    "@/shared/*": ["./src/shared/*"]
  }
}
```

Usage:

```typescript
import { LoginForm } from '@/src/modules/UsersGuard';
import { useTenant } from '@/src/shared/lib/tenant-context';
```

## Connecting to Laravel Backend

### Prerequisites

1. Laravel backend running on `http://localhost:8000`
2. CORS configured in Laravel backend
3. Sanctum configured for API authentication

### Backend Setup (Laravel)

```php
// config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,

// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:3000')),
```

### Testing Login

1. Ensure Laravel backend is running
2. Navigate to `http://localhost:3000/admin/login`
3. Enter:
   - **Tenant ID**: Your tenant ID (e.g., `1`)
   - **Username**: Your admin username
   - **Password**: Your admin password
4. Click "Sign in"

## Available Pages

- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin dashboard (protected)

## Next Steps

1. Create more modules (Users, Settings, etc.)
2. Add middleware for route protection
3. Add Superadmin layer
4. Add Frontend layer
5. Add more features to existing modules

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript](https://www.typescriptlang.org/docs/)
- Backend API: `C:\laragon\www\backend-api\CLAUDE.md`