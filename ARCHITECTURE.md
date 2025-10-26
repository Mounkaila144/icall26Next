# Architecture Overview

## Modular Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js Application                       │
│                        (icall26 Project)                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
        ┌───────▼───────┐              ┌────────▼────────┐
        │   App Router  │              │  Src Directory  │
        │   (Routing)   │              │    (Logic)      │
        └───────┬───────┘              └────────┬────────┘
                │                               │
    ┌───────────┼───────────┐      ┌───────────┼───────────┐
    │           │           │      │           │           │
┌───▼────┐ ┌───▼────┐ ┌────▼───┐ ┌▼─────┐ ┌──▼──────┐
│ Admin  │ │Super-  │ │Frontend│ │Module│ │ Shared  │
│ Routes │ │admin   │ │Routes  │ │  s   │ │Utilities│
│        │ │Routes  │ │        │ │      │ │         │
└────────┘ └────────┘ └────────┘ └──────┘ └─────────┘
```

## Layer Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYERS                         │
└──────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Superadmin  │  │    Admin     │  │   Frontend   │
│    Layer     │  │    Layer     │  │    Layer     │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ Central DB   │  │  Tenant DB   │  │  Tenant DB   │
│              │  │              │  │              │
│ /superadmin/*│  │  /admin/*    │  │    /*        │
│              │  │              │  │              │
│ auth:sanctum │  │auth:sanctum  │  │  tenant      │
│              │  │  + tenant    │  │  (optional   │
│              │  │              │  │    auth)     │
└──────────────┘  └──────────────┘  └──────────────┘
       │                 │                  │
       └─────────────────┴──────────────────┘
                         │
            ┌────────────▼────────────┐
            │   Laravel Backend API   │
            │   (Multi-tenant)        │
            └─────────────────────────┘
```

## Module Structure (UsersGuard Example)

```
UsersGuard Module
│
├── Admin Layer (Tenant-Specific)
│   ├── Components
│   │   └── LoginForm.tsx ──────────► User Interface
│   │
│   ├── Hooks
│   │   └── useAuth.ts ─────────────► State Management
│   │       │
│   │       ├── Uses: useTenant()
│   │       └── Manages: login, logout, user state
│   │
│   └── Services
│       └── authService.ts ─────────► API Communication
│           │
│           ├── login()
│           ├── logout()
│           ├── getCurrentUser()
│           └── Uses: createApiClient(tenantId)
│
├── Types
│   └── auth.types.ts ──────────────► TypeScript Definitions
│       ├── User
│       ├── LoginCredentials
│       └── AuthState
│
└── index.ts ───────────────────────► Public API (Barrel Export)
    └── Exports: LoginForm, useAuth, adminAuthService, types
```

## Data Flow - Admin Login

```
┌──────────────┐
│ User enters  │
│ credentials  │
│ + Tenant ID  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  LoginForm   │ Component
│ (User Input) │
└──────┬───────┘
       │ calls login()
       ▼
┌──────────────┐
│   useAuth    │ Hook
│  (State Mgr) │
└──────┬───────┘
       │ calls authService.login()
       ▼
┌──────────────┐
│authService   │ Service
│ (API Layer)  │
└──────┬───────┘
       │ uses createApiClient(tenantId)
       ▼
┌──────────────┐
│ API Client   │ HTTP Client
│ (Axios)      │
└──────┬───────┘
       │ POST /api/admin/auth/login
       │ Header: X-Tenant-ID: {tenantId}
       ▼
┌──────────────┐
│ Laravel API  │
│   Backend    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Response   │
│ {user, token}│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ localStorage │
│ - auth_token │
│ - user       │
│ - tenant_id  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Redirect to │
│  Dashboard   │
└──────────────┘
```

## Tenant Context Flow

```
┌──────────────────────────────────────┐
│      TenantProvider (Context)        │
│  ┌────────────────────────────────┐  │
│  │  State:                        │  │
│  │  - tenantId                    │  │
│  │  - domain                      │  │
│  │                                │  │
│  │  Methods:                      │  │
│  │  - setTenantId()               │  │
│  │  - setDomain()                 │  │
│  └────────────────────────────────┘  │
└──────────────┬───────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐
│Component│ │Component│ │Component│
│   A    │ │   B    │ │   C    │
└────────┘ └────────┘ └────────┘
    │          │          │
    │ useTenant()         │
    └──────────┴──────────┘
               │
               ▼
       ┌──────────────┐
       │ API Calls    │
       │ with tenantId│
       └──────────────┘
```

## API Client Configuration

```
createApiClient(tenantId?)
    │
    ├─► Base URL: process.env.NEXT_PUBLIC_API_URL
    │
    ├─► Default Headers:
    │   ├── Content-Type: application/json
    │   ├── Accept: application/json
    │   └── X-Tenant-ID: {tenantId} (if provided)
    │
    ├─► Request Interceptor:
    │   └── Add Authorization: Bearer {token}
    │       (from localStorage)
    │
    └─► Response Interceptor:
        └── On 401 Error:
            ├── Clear localStorage
            └── Redirect to /admin/login
```

## File Organization Pattern

```
src/
├── modules/                    # Feature Modules
│   └── {ModuleName}/
│       ├── admin/             # Admin layer
│       │   ├── components/    # UI components
│       │   ├── hooks/         # React hooks
│       │   ├── services/      # API services
│       │   └── utils/         # Utilities
│       │
│       ├── superadmin/        # Superadmin layer
│       │   └── (same structure)
│       │
│       ├── frontend/          # Frontend layer
│       │   └── (same structure)
│       │
│       ├── types/             # Shared types
│       │   └── *.types.ts
│       │
│       └── index.ts           # Public API
│
└── shared/                    # Shared utilities
    ├── lib/                   # Libraries
    │   ├── api-client.ts      # HTTP client
    │   └── tenant-context.tsx # Tenant context
    │
    ├── components/            # Shared components
    ├── hooks/                 # Shared hooks
    ├── utils/                 # Shared utilities
    └── types/                 # Shared types
```

## Routing Structure

```
app/
├── admin/                     # Admin routes (tenant)
│   ├── layout.tsx            # Admin layout with TenantProvider
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard (protected)
│   └── [...other routes]
│
├── superadmin/               # Superadmin routes (central)
│   ├── layout.tsx
│   └── [...routes]
│
└── (public)/                 # Public routes
    └── [...routes]
```

## Environment & Configuration

```
┌─────────────────────────────────────────┐
│         Environment Variables            │
├─────────────────────────────────────────┤
│ .env.local                               │
│ └── NEXT_PUBLIC_API_URL                  │
│     └── http://localhost:8000/api        │
└─────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│         TypeScript Configuration         │
├─────────────────────────────────────────┤
│ tsconfig.json                            │
│ └── paths:                               │
│     ├── @/* → ./*                        │
│     ├── @/modules/* → ./src/modules/*    │
│     └── @/shared/* → ./src/shared/*      │
└─────────────────────────────────────────┘
```

## State Management

```
┌──────────────────────────────────────────┐
│         Application State                 │
├──────────────────────────────────────────┤
│                                           │
│  React Context (Global)                   │
│  └── TenantProvider                       │
│      ├── tenantId                         │
│      └── domain                           │
│                                           │
│  Custom Hooks (Feature)                   │
│  └── useAuth                              │
│      ├── user                             │
│      ├── token                            │
│      ├── isAuthenticated                  │
│      └── isLoading                        │
│                                           │
│  localStorage (Persistence)               │
│  ├── auth_token                           │
│  ├── user                                 │
│  ├── tenant_id                            │
│  └── tenant_domain                        │
│                                           │
└──────────────────────────────────────────┘
```

## Security Flow

```
┌─────────────────────────────────────────┐
│         Authentication Flow              │
└─────────────────────────────────────────┘
         │
         ├─► 1. User provides credentials
         │   └── username, password, tenant_id
         │
         ├─► 2. API call to Laravel
         │   └── POST /api/admin/auth/login
         │       Header: X-Tenant-ID: {tenantId}
         │
         ├─► 3. Laravel validates
         │   ├── Tenant exists?
         │   ├── User exists in tenant DB?
         │   └── Password correct?
         │
         ├─► 4. Returns JWT token
         │   └── {token, user}
         │
         ├─► 5. Store in localStorage
         │   ├── auth_token
         │   └── user
         │
         └─► 6. Future requests include
             └── Authorization: Bearer {token}
                 X-Tenant-ID: {tenantId}
```

## Benefits of This Architecture

1. **Modularity**: Each feature is self-contained
2. **Scalability**: Easy to add new modules
3. **Maintainability**: Clear separation of concerns
4. **Reusability**: Modules can be shared across projects
5. **Type Safety**: Full TypeScript support
6. **Multi-tenancy**: Built-in tenant isolation
7. **Testability**: Easy to unit test each layer

## Comparison with Laravel Backend

| Next.js Frontend        | Laravel Backend              |
|------------------------|------------------------------|
| `src/modules/`         | `Modules/`                   |
| `admin/components/`    | `Http/Controllers/Admin/`    |
| `admin/services/`      | `Repositories/`              |
| `admin/hooks/`         | `Services/`                  |
| `types/`               | `Entities/` (Models)         |
| `shared/lib/`          | `app/Services/`              |
| `app/admin/*`          | `routes/admin.php`           |
| `app/superadmin/*`     | `routes/superadmin.php`      |