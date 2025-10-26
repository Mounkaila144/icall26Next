# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

The `.env.local` file has already been created with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Update the URL if your Laravel backend is running on a different port.

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

### 4. Test the Login

1. Navigate to: `http://localhost:3000/admin/login`

2. Enter your credentials:
   - **Tenant ID**: Your tenant ID (e.g., `1`)
   - **Username**: Your admin username
   - **Password**: Your admin password

3. Click "Sign in"

4. You'll be redirected to the dashboard at `/admin/dashboard`

## 📁 Project Structure

```
icall26/
├── app/                          # Next.js routes
│   └── admin/
│       ├── login/                # Login page
│       ├── dashboard/            # Dashboard page
│       └── layout.tsx            # Admin layout
│
├── src/
│   ├── modules/                  # Feature modules
│   │   └── UsersGuard/           # Authentication module
│   │       ├── admin/            # Admin layer
│   │       │   ├── components/   # LoginForm
│   │       │   ├── hooks/        # useAuth
│   │       │   └── services/     # authService
│   │       ├── types/            # TypeScript types
│   │       └── index.ts          # Public API
│   │
│   └── shared/                   # Shared utilities
│       ├── lib/
│       │   ├── api-client.ts     # HTTP client
│       │   └── tenant-context.tsx # Tenant context
│       └── types/
│
└── .env.local                    # Environment config
```

## 🎯 What's Included

### ✅ UsersGuard Module

Complete authentication module with:
- Login form component
- Authentication hook (`useAuth`)
- Auth service with API integration
- TypeScript types
- Multi-tenant support

### ✅ Shared Utilities

- **API Client**: Axios client with auto tenant header injection
- **Tenant Context**: React context for tenant management
- **Type Definitions**: Shared TypeScript types

### ✅ Pages

- `/admin/login` - Login page
- `/admin/dashboard` - Protected dashboard page

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📖 Documentation

- **[MODULES.md](./MODULES.md)** - Complete guide to the modular architecture
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture diagrams and patterns
- **[src/modules/README.md](./src/modules/README.md)** - How to create new modules
- **[create-module-example.md](./create-module-example.md)** - Step-by-step module creation

## 🏗️ Creating New Modules

### Quick Template

```bash
# Create module structure
mkdir -p src/modules/YourModule/{admin,superadmin,frontend}/{components,hooks,services,utils}
mkdir src/modules/YourModule/types
```

See [create-module-example.md](./create-module-example.md) for a complete example.

## 🔐 Authentication Flow

1. User enters credentials + tenant ID
2. API call to Laravel backend with `X-Tenant-ID` header
3. Token received and stored in localStorage
4. Future requests include token in Authorization header
5. Automatic redirect to dashboard on success

## 🌐 Multi-Tenancy

The application supports multi-tenancy through:

### Tenant Context

```typescript
import { useTenant } from '@/src/shared/lib/tenant-context';

function MyComponent() {
  const { tenantId, setTenantId } = useTenant();
  // tenantId is automatically used in API calls
}
```

### API Client

```typescript
import { createApiClient } from '@/src/shared/lib/api-client';

const client = createApiClient(tenantId);
// X-Tenant-ID header is automatically added
```

## 🎨 Styling

The project uses **Tailwind CSS** for styling. All components are styled with Tailwind utility classes.

## 🔍 Type Safety

Full TypeScript support with:
- Strict mode enabled
- Type definitions for all data
- Path aliases configured

```typescript
// Import aliases
import { LoginForm } from '@/src/modules/UsersGuard';
import { useTenant } from '@/src/shared/lib/tenant-context';
```

## 🐛 Troubleshooting

### Cannot connect to API

Check that:
1. Laravel backend is running on `http://localhost:8000`
2. `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. CORS is configured in Laravel backend

### Login fails

Check that:
1. Tenant ID exists in the database
2. User exists in the tenant database
3. Password is correct
4. Laravel API route `/api/admin/auth/login` is working

### Page not found

Make sure you're using the correct routes:
- Login: `/admin/login` (not `/login`)
- Dashboard: `/admin/dashboard`

## 📝 Next Steps

1. ✅ Test the login functionality
2. 🔨 Create additional modules (Users, Settings, etc.)
3. 🎨 Customize the UI/styling
4. 🔒 Add route protection middleware
5. 📊 Add more features to dashboard
6. 🌟 Create Superadmin layer
7. 🎭 Create Frontend layer

## 🤝 Laravel Backend Integration

### Required Backend Configuration

Your Laravel backend should have:

1. **CORS configured** in `config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

2. **Sanctum configured** in `config/sanctum.php`:
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:3000')),
```

3. **Auth routes** available:
   - `POST /api/admin/auth/login` - Admin login
   - `POST /api/admin/auth/logout` - Admin logout
   - `GET /api/admin/auth/me` - Get current user

## 📊 Module Architecture Benefits

1. **Scalability** - Easy to add new features
2. **Maintainability** - Clear separation of concerns
3. **Reusability** - Modules can be shared
4. **Type Safety** - Full TypeScript support
5. **Multi-tenancy** - Built-in tenant isolation
6. **Testability** - Easy to unit test

## 💡 Tips

- Always use the `useAuth` hook for authentication state
- Always use `useTenant` hook for tenant context
- Always use `createApiClient` for API calls
- Mark interactive components with `'use client'`
- Define types in the `types/` directory
- Use barrel exports (`index.ts`) for public API

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## ✨ Features

- ✅ Modular architecture
- ✅ Multi-tenancy support
- ✅ TypeScript strict mode
- ✅ Tailwind CSS styling
- ✅ API client with interceptors
- ✅ Authentication system
- ✅ Protected routes
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design

---

**Ready to build?** Start by testing the login, then create your first module! 🚀