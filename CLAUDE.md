# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using the App Router with a modular architecture designed to mirror a Laravel backend. It's a multi-tenant SaaS application with three distinct layers: Admin (tenant-specific), Superadmin (central), and Frontend (public).

## Development Commands

### Core Commands
```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Environment Configuration
The `.env` file uses relative API URLs (`/api`) to work across domains. For local development with a separate Laravel backend, create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Architecture Principles

### 1. Modular Structure
Each feature is isolated in `src/modules/{ModuleName}/` with three layers:
- **admin/**: Tenant-specific administration (requires tenant ID)
- **superadmin/**: Central administration (no tenant context)
- **frontend/**: Public/user-facing features (optional tenant context)

Each layer contains:
- `components/`: React UI components
- `hooks/`: Custom React hooks for state management
- `services/`: API service classes
- `utils/`: Utility functions

### 2. Module Organization Pattern
```
src/modules/{ModuleName}/
├── admin/
│   ├── components/     # Admin-specific UI
│   ├── hooks/          # Admin-specific state logic
│   ├── services/       # Admin API calls
│   └── utils/          # Admin utilities
├── superadmin/         # Same structure for superadmin
├── frontend/           # Same structure for frontend
├── types/              # Shared TypeScript types
└── index.ts            # Barrel export (public API)
```

### 3. Multi-Tenancy
**TenantProvider** (`src/shared/lib/tenant-context.tsx`) manages tenant context globally:
- Stores `tenantId` and `domain` in React Context
- Persists to localStorage
- Used by admin and frontend layers (NOT superadmin)

**API Client** (`src/shared/lib/api-client.ts`):
- When `tenantId` is provided, adds `X-Tenant-ID` header to all requests
- Automatically injects `Authorization: Bearer` token from localStorage
- Automatically adds `Accept-Language` header with current locale (fr, en, ar)
- Handles 401 errors by clearing auth state and redirecting to login
- Base URL from `NEXT_PUBLIC_API_URL` environment variable

### 4. Data Flow Pattern
Component → Hook → Service → API Client → Laravel Backend

Example:
```typescript
LoginForm (UI)
  → useAuth (state management)
  → authService (API layer)
  → createApiClient(tenantId) (HTTP client)
  → Laravel API
```

### 5. TypeScript Path Aliases
```json
{
  "@/*": ["./*"],
  "@/modules/*": ["./src/modules/*"],
  "@/shared/*": ["./src/shared/*"]
}
```

## Creating New Modules

### Directory Structure
```bash
mkdir -p src/modules/{ModuleName}/{admin,superadmin,frontend}/{components,hooks,services,utils}
mkdir src/modules/{ModuleName}/types
```

### Required Files
1. **Types** (`types/{name}.types.ts`): TypeScript interfaces for all data structures
2. **Service** (`{layer}/services/{name}Service.ts`): API communication class
3. **Hook** (`{layer}/hooks/use{Name}.ts`): React hook managing state and calling service
4. **Component** (`{layer}/components/{Name}.tsx`): UI component using the hook
5. **Barrel Export** (`index.ts`): Re-export public API

### Module Checklist
- Use `useTenant()` hook to get tenant context in admin/frontend layers
- Use `createApiClient(tenantId)` for all API calls
- Mark interactive components with `'use client'`
- Define all TypeScript types in `types/` directory
- Export public API through `index.ts` barrel file
- Implement loading and error states in hooks
- Use try-catch blocks in service methods
- Create module-specific translations in `translations/` directory

## Internationalization (i18n)

### Translation System Architecture

The application uses a **modular translation system** with **English as the default language** and automatic fallback.

**Philosophy:**
- All text in code is written in **English**
- Translations are **only created for other languages** (French, Arabic)
- **No English translation files needed** - English text in code IS the translation
- Automatic fallback to English text if translation not found

**Directory Structure:**
```
src/shared/i18n/
├── translations/          # Global translations (non-English only)
│   ├── fr.json           # French
│   └── ar.json           # Arabic
├── translation-provider.tsx
├── use-translation.ts
└── types.ts

src/modules/{ModuleName}/translations/  # Module translations (non-English only)
├── fr.json
└── ar.json
```

### Translation Fallback Priority

1. **English Check**: If locale is 'en', return English text immediately (no file lookup)
2. **Module Translation**: `src/modules/{ModuleName}/translations/{locale}.json`
3. **Global Translation**: `src/shared/i18n/translations/{locale}.json`
4. **English Fallback**: Return the original English text if not found

### Integration with LanguageProvider

The translation system integrates with the existing `LanguageProvider` (`src/shared/lib/language-context.tsx`):
- `LanguageProvider` manages the current language state
- `TranslationProvider` wraps the translation logic
- Both must be used together in the app layout

### Usage Examples

#### 1. Global Translations (English text as default)
```typescript
'use client';
import { useTranslation } from '@/src/shared/i18n';

export function SaveButton() {
  const { t } = useTranslation();

  return <button>{t('Save')}</button>;
  // EN: "Save" | FR: "Enregistrer" | AR: "حفظ"
}
```

#### 2. Module-Specific Translations with Fallback
```typescript
'use client';
import { useTranslation } from '@/src/shared/i18n';

export function LoginForm() {
  const { t } = useTranslation('UsersGuard');

  return (
    <div>
      <h1>{t('Login')}</h1>           {/* Module: "Connexion" (FR) */}
      <button>{t('Cancel')}</button>  {/* Fallback to global: "Annuler" (FR) */}
    </div>
  );
}
```

#### 3. Translations with Parameters
```typescript
const { t } = useTranslation();

// English text with parameters
t('Welcome, {name}!', { name: 'Marie' });
// EN: "Welcome, Marie!" | FR: "Bienvenue, Marie!"
```

#### 4. Language Switcher
```typescript
import { LanguageSwitcher } from '@/src/shared/components';

export function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
}
```

### Creating Module Translations

#### Step 1: Write Your Code in English

```typescript
'use client';
import { useTranslation } from '@/src/shared/i18n';

export function ProductForm() {
  const { t } = useTranslation('Products');

  return (
    <div>
      <h1>{t('Create Product')}</h1>
      <button>{t('Save')}</button>
      <button>{t('Cancel')}</button>
    </div>
  );
}
```

#### Step 2: Create Translation Files (Non-English Only)

```bash
# Create translation directory
mkdir src/modules/Products/translations

# Create translation files (NO en.json needed!)
touch src/modules/Products/translations/{fr,ar}.json
```

**Example** (`src/modules/Products/translations/fr.json`):
```json
{
  "Create Product": "Créer un produit",
  "Product created successfully": "Produit créé avec succès",
  "Product updated": "Produit mis à jour",
  "Product deleted": "Produit supprimé"
}
```

**Note:** The English text in your code (`'Create Product'`) is used as the key to look up translations. No `en.json` file needed!

### Translation Best Practices

**Global Translations (shared/i18n/translations/):**
- Common UI labels: save, cancel, delete, edit
- Navigation items: home, dashboard, settings
- Generic errors and messages
- Shared validation messages

**Module Translations (modules/{ModuleName}/translations/):**
- Feature-specific labels
- Module-specific errors
- Business logic messages
- Domain-specific terminology

**Naming Conventions:**
- Use natural English sentences: `'Save'`, `'Create new product'`
- Use the exact same English text throughout your app for consistency
- Avoid abbreviations: `'Delete'` not `'Del'`
- English text serves as both the UI text and the translation key

**Supported Languages:**
- `en`: English (default, no translation files needed)
- `fr`: Français (French) - create `fr.json` files
- `ar`: العربية (Arabic) - create `ar.json` files

### Setup in Layouts

The app should wrap routes with both providers:

```typescript
// app/layout.tsx or app/admin/layout.tsx
import { LanguageProvider } from '@/src/shared/lib/language-context';
import { TranslationProvider } from '@/src/shared/i18n';

export default function Layout({ children }) {
  return (
    <LanguageProvider>
      <TranslationProvider>
        {children}
      </TranslationProvider>
    </LanguageProvider>
  );
}
```

### Additional Resources

- `TRANSLATION_EXAMPLE.md`: Comprehensive usage guide with examples
- `src/shared/i18n/`: Translation system implementation
- `src/modules/UsersGuard/translations/`: Example module translations

## Existing Modules

### UsersGuard (Authentication)
Location: `src/modules/UsersGuard/`

**Admin Layer Components:**
- `LoginForm.tsx`: Tenant-aware login form
- `useAuth.ts`: Authentication state management hook
- `authService.ts`: Login/logout/user API calls

**Usage:**
```typescript
import { useAuth } from '@/src/modules/UsersGuard';

const { user, isAuthenticated, login, logout, isLoading } = useAuth();
```

**Authentication Flow:**
1. User provides tenant ID, username, password
2. Tenant ID stored in TenantProvider and localStorage
3. API POST to `/api/admin/auth/login` with `X-Tenant-ID` header
4. Token stored in localStorage
5. Redirect to `/admin/dashboard`

## Routing Structure

```
app/
├── admin/              # Tenant-specific admin routes
│   ├── layout.tsx      # Wraps with TenantProvider
│   ├── login/
│   └── dashboard/
├── superadmin/         # Central admin routes
└── (public routes)
```

**Protected Routes Pattern:**
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

## Laravel Backend Integration

### Expected Backend Routes
- `POST /api/admin/auth/login` - Admin login (requires X-Tenant-ID header)
- `POST /api/admin/auth/logout` - Admin logout
- `GET /api/admin/auth/me` - Get current user

### CORS Configuration
Backend must allow `http://localhost:3000` origin with credentials support.

### Request Headers
All API requests automatically include:
- `X-Tenant-ID: {tenantId}` (when tenant context available)
- `Authorization: Bearer {token}` (after login)
- `Accept-Language: {locale}` (current language: fr, en, or ar)
- `Content-Type: application/json`
- `Accept: application/json`

## State Management

**Global State (React Context):**
- `TenantProvider`: tenantId, domain

**Feature State (Custom Hooks):**
- `useAuth`: user, token, isAuthenticated, isLoading

**Persistence (localStorage):**
- `auth_token`: JWT token
- `user`: User object
- `tenant_id`: Current tenant ID
- `tenant_domain`: Current tenant domain

## Key Files

- `src/shared/lib/api-client.ts`: HTTP client factory with tenant and auth interceptors
- `src/shared/lib/tenant-context.tsx`: Global tenant state management
- `src/shared/types/api.types.ts`: Shared API response types
- `app/admin/layout.tsx`: Admin layout with TenantProvider wrapper
- `src/modules/UsersGuard/`: Complete authentication module example

## Common Patterns

### Service Class
```typescript
import { createApiClient } from '@/src/shared/lib/api-client';

class MyService {
  async getData(tenantId?: string) {
    const client = createApiClient(tenantId);
    const response = await client.get('/endpoint');
    return response.data.data;
  }
}

export const myService = new MyService();
```

### Custom Hook
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useTenant } from '@/src/shared/lib/tenant-context';

export const useMyData = () => {
  const { tenantId } = useTenant();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data
  }, [tenantId]);

  return { data, loading, error };
};
```

## Documentation Files

- `ARCHITECTURE.md`: Detailed architecture diagrams and data flows
- `MODULES.md`: Complete modular architecture guide
- `QUICK-START.md`: Getting started guide
- `create-module-example.md`: Step-by-step module creation example