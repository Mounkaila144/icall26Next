# Menu Configuration Guide

This guide explains how to configure menus in the application using the new **file-based menu system**.

## Overview

The application now uses a **modular menu configuration system** where each module can define its own menus in a `menu.config.ts` file. This approach:

- ✅ **Eliminates the need for database-managed menus**
- ✅ **Keeps menus versioned with your code** (Git-tracked)
- ✅ **Makes menu configuration explicit and easy to modify**
- ✅ **Follows the modular architecture** of the application

## Architecture

```
src/
├── modules/
│   ├── Dashboard/
│   │   └── menu.config.ts          # Dashboard menus
│   ├── UsersGuard/
│   │   └── menu.config.ts          # Users & Settings menus
│   └── {YourModule}/
│       └── menu.config.ts          # Your module's menus
├── shared/
│   ├── config/
│   │   └── menu-registry.ts        # Aggregates all menus
│   ├── hooks/
│   │   └── useConfigMenus.ts       # Hook to access menus
│   └── types/
│       └── menu-config.types.ts    # TypeScript types
```

## Creating Menu Configuration

### Step 1: Create `menu.config.ts` in Your Module

Create a file at `src/modules/{YourModule}/menu.config.ts`:

```typescript
import { ModuleMenuConfig } from '@/src/shared/types/menu-config.types';

export const yourModuleMenuConfig: ModuleMenuConfig = {
  module: 'YourModule',
  menus: [
    {
      id: 'your-menu-id',
      label: 'Your Menu Label',
      route: '/admin/your-route',
      icon: {
        type: 'emoji',
        value: '🎯',
      },
      order: 20,
      module: 'YourModule',
      isVisible: true,
      isActive: true,
    },
  ],
};
```

### Step 2: Register Your Menu Configuration

Edit `src/shared/config/menu-registry.ts` to import and register your menu:

```typescript
// Add your import
import { yourModuleMenuConfig } from '@/src/modules/YourModule/menu.config';

// Add to the registry array
const moduleMenuConfigs: ModuleMenuConfig[] = [
  dashboardMenuConfig,
  usersGuardMenuConfig,
  yourModuleMenuConfig,  // ← Add here
];
```

### Step 3: Verify Your Menus

Your menus will now appear in the sidebar! The system automatically:
- Loads and aggregates all registered menus
- Sorts them by `order` property
- Filters by `isVisible` and `isActive` flags
- Builds the hierarchical structure

## Menu Configuration Options

### Basic Menu Item

```typescript
{
  id: 'unique-menu-id',           // Unique identifier
  label: 'Menu Label',            // Display text (English, will be translated)
  route: '/admin/path',           // Navigation route
  order: 10,                      // Display order (lower = earlier)
  module: 'ModuleName',           // Module that owns this menu
  isVisible: true,                // Show/hide menu
  isActive: true,                 // Enable/disable menu
}
```

### Menu with Icon

```typescript
{
  id: 'menu-with-icon',
  label: 'Dashboard',
  route: '/admin/dashboard',
  icon: {
    type: 'emoji',               // Icon type
    value: '📊',                 // Icon value
  },
  order: 1,
  module: 'Dashboard',
}
```

**Icon Types:**
- `emoji`: Use any emoji (e.g., `'📊'`, `'👥'`, `'⚙️'`)
- `svg`: Inline SVG string
- `icon-class`: CSS class name (e.g., `'fa fa-dashboard'`)
- `lucide`: Lucide icon name (fallback generated if not found)

### Menu with Badge

```typescript
{
  id: 'menu-with-badge',
  label: 'Notifications',
  route: '/admin/notifications',
  order: 5,
  module: 'Notifications',
  badge: {
    value: '12',                  // Badge content
    variant: 'primary',           // Badge color
  },
}
```

**Badge Variants:**
- `primary`: Blue (default)
- `success`: Green
- `warning`: Yellow/Orange
- `danger`: Red

### Parent Menu with Children

```typescript
{
  id: 'users',
  label: 'Users',
  icon: { type: 'emoji', value: '👥' },
  order: 10,
  module: 'UsersGuard',
  isVisible: true,
  isActive: true,
  children: [
    {
      id: 'users-list',
      label: 'User Management',
      route: '/admin/users',
      order: 1,
      module: 'UsersGuard',
      parentId: 'users',
    },
    {
      id: 'users-roles',
      label: 'Roles & Permissions',
      route: '/admin/users/roles',
      order: 2,
      module: 'UsersGuard',
      parentId: 'users',
    },
  ],
}
```

**Notes:**
- Parent menus can have a `route` or be navigation-only
- `parentId` creates the hierarchy (automatic when using `children`)
- Children inherit visibility/active state from parent

### Menu with Permission

```typescript
{
  id: 'admin-settings',
  label: 'Admin Settings',
  route: '/admin/settings',
  order: 100,
  module: 'Settings',
  permission: 'admin.settings.view',  // Required permission
}
```

## Menu Ordering

Menus are sorted by the `order` property (ascending). Recommended ranges:

- **1-10**: Primary navigation (Dashboard, Analytics)
- **11-50**: Feature modules (Users, Products, Orders)
- **51-90**: Secondary features (Reports, Tools)
- **91-100**: Settings and Configuration

## Examples

### Example 1: Simple Menu

```typescript
export const productMenuConfig: ModuleMenuConfig = {
  module: 'Products',
  menus: [
    {
      id: 'products',
      label: 'Products',
      route: '/admin/products',
      icon: { type: 'emoji', value: '📦' },
      order: 20,
      module: 'Products',
    },
  ],
};
```

### Example 2: Menu with Submenu

```typescript
export const orderMenuConfig: ModuleMenuConfig = {
  module: 'Orders',
  menus: [
    {
      id: 'orders',
      label: 'Orders',
      icon: { type: 'emoji', value: '🛒' },
      order: 30,
      module: 'Orders',
      children: [
        {
          id: 'orders-list',
          label: 'All Orders',
          route: '/admin/orders',
          order: 1,
          module: 'Orders',
          parentId: 'orders',
        },
        {
          id: 'orders-pending',
          label: 'Pending Orders',
          route: '/admin/orders/pending',
          order: 2,
          module: 'Orders',
          parentId: 'orders',
          badge: { value: '5', variant: 'warning' },
        },
        {
          id: 'orders-completed',
          label: 'Completed Orders',
          route: '/admin/orders/completed',
          order: 3,
          module: 'Orders',
          parentId: 'orders',
        },
      ],
    },
  ],
};
```

### Example 3: Multiple Root Menus

```typescript
export const reportMenuConfig: ModuleMenuConfig = {
  module: 'Reports',
  menus: [
    {
      id: 'sales-reports',
      label: 'Sales Reports',
      route: '/admin/reports/sales',
      icon: { type: 'emoji', value: '💰' },
      order: 50,
      module: 'Reports',
    },
    {
      id: 'analytics-reports',
      label: 'Analytics',
      route: '/admin/reports/analytics',
      icon: { type: 'emoji', value: '📊' },
      order: 51,
      module: 'Reports',
    },
  ],
};
```

## Using Menus in Your Code

### Access All Menus

```typescript
'use client';

import { useConfigMenus } from '@/src/shared/hooks/useConfigMenus';

export function MyComponent() {
  const { menus, isLoading } = useConfigMenus();

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {menus.map((menu) => (
        <li key={menu.id}>{menu.label}</li>
      ))}
    </ul>
  );
}
```

### Access Module-Specific Menus

```typescript
const { menus } = useConfigMenus({ module: 'Dashboard' });
```

### Access Visible Menus Only

```typescript
const { menus } = useConfigMenus({ visibleOnly: true });
```

### Check Active Menu

```typescript
'use client';

import { usePathname } from 'next/navigation';
import { useConfigMenus } from '@/src/shared/hooks/useConfigMenus';

export function Breadcrumbs() {
  const pathname = usePathname();
  const { getActiveMenu, getBreadcrumbs } = useConfigMenus();

  const activeMenu = getActiveMenu(pathname);
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <div>
      <p>Active: {activeMenu?.label}</p>
      <p>Path: {breadcrumbs.map(m => m.label).join(' > ')}</p>
    </div>
  );
}
```

## Internationalization

Menu labels are automatically translated using the i18n system:

1. **Write labels in English** in your `menu.config.ts`
2. **Add translations** in your module's `translations/` directory:

**Example** (`src/modules/Products/translations/fr.json`):
```json
{
  "Products": "Produits",
  "All Products": "Tous les produits",
  "Add Product": "Ajouter un produit"
}
```

The system automatically:
- Uses English labels as translation keys
- Falls back to English if translation not found
- Supports `fr`, `en`, and `ar` languages

## Migration from Database Menus

If you were previously using database-managed menus:

1. **Export your existing menus** from the database
2. **Convert to configuration format** using the examples above
3. **Create `menu.config.ts` files** for each module
4. **Register in `menu-registry.ts`**
5. **Remove database-based menu system** (optional)

## Best Practices

### ✅ DO

- Use descriptive, unique IDs (`users-list`, not `ul`)
- Group related menus under parent menus
- Use meaningful order numbers with gaps (10, 20, 30) for easy insertion
- Keep menu hierarchies shallow (max 2-3 levels)
- Use English labels (translated automatically)

### ❌ DON'T

- Use duplicate IDs across different modules
- Create deeply nested hierarchies (>3 levels)
- Hardcode badges (use dynamic data when possible)
- Mix route and non-route parent menus inconsistently

## Troubleshooting

### Menus not appearing?

1. Check that you imported the config in `menu-registry.ts`
2. Verify `isVisible` and `isActive` are `true`
3. Check for TypeScript errors in your `menu.config.ts`
4. Ensure `order` is set correctly

### Menu order wrong?

- Check the `order` property values
- Lower numbers appear first
- Verify no duplicate orders causing conflicts

### Children not showing?

- Verify `parentId` matches the parent's `id`
- Check that parent has `children` array defined
- Ensure children have `isVisible: true`

### Icons not displaying?

- For emojis, use the emoji directly: `value: '📊'`
- For SVG, ensure it's a valid SVG string
- For icon classes, ensure the CSS is loaded
- Lucide icons use fallback generation

## API Reference

See the full TypeScript definitions in:
- `src/shared/types/menu-config.types.ts` - Type definitions
- `src/shared/config/menu-registry.ts` - Registry functions
- `src/shared/hooks/useConfigMenus.ts` - Hook API

## Support

For questions or issues:
- Check existing module configs for examples
- Review `CLAUDE.md` for architecture details
- Create an issue if you encounter bugs
