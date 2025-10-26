# Guide du Système de Menus

Ce guide explique comment utiliser le système de menus modulaire dans votre application Next.js.

## Vue d'Ensemble

Le système de menus permet à chaque module de déclarer ses propres menus et sous-menus avec des permissions. Il y a deux types de menus :

1. **Menus Principaux** - Affichés dans la barre latérale de navigation
2. **Sous-menus de Paramètres** - Affichés dans la page de paramètres et occupent toute une page

## Comment Ajouter un Menu à un Module

### Étape 1 : Créer le Fichier de Configuration

Dans votre module, créez un dossier `config` et un fichier `menu.config.ts` :

```bash
mkdir src/modules/VotreModule/admin/config
```

Exemple : `src/modules/VotreModule/admin/config/menu.config.ts`

```typescript
import { ModuleMenuConfig } from '@/src/modules/MenuRegistry';

export const votreModuleMenuConfig: ModuleMenuConfig = {
  module: 'VotreModule',

  // Menus principaux (sidebar)
  menuItems: [
    {
      id: 'votre-menu',
      label: 'Votre Menu',
      path: '/admin/votre-path',
      icon: {
        type: 'emoji',
        value: '📦',
      },
      order: 30,
      module: 'VotreModule',
      permission: ['votre-module.view'],
    },
  ],

  // Sous-menus de paramètres
  settingsItems: [
    {
      id: 'settings-votre-module',
      label: 'Configuration Votre Module',
      description: 'Configurer les paramètres de votre module',
      path: '/admin/settings/votre-module',
      icon: {
        type: 'emoji',
        value: '⚙️',
      },
      order: 40,
      category: 'Modules',
      module: 'VotreModule',
      permission: ['settings.votre-module.manage'],
    },
  ],
};
```

### Étape 2 : Créer le Fichier d'Initialisation

Créez `src/modules/VotreModule/admin/init.ts` :

```typescript
import { menuRegistryService } from '@/src/modules/MenuRegistry';
import { votreModuleMenuConfig } from './config/menu.config';

export const initVotreModule = () => {
  menuRegistryService.registerModule(votreModuleMenuConfig);
};
```

### Étape 3 : Exporter l'Initialisation

Mettez à jour `src/modules/VotreModule/index.ts` :

```typescript
export { initVotreModule } from './admin/init';
```

### Étape 4 : Enregistrer le Module

Ajoutez votre module dans `src/shared/lib/init-modules.ts` :

```typescript
import { initUsersGuardModule } from '@/src/modules/UsersGuard';
import { initVotreModule } from '@/src/modules/VotreModule';

export const initializeModules = () => {
  initUsersGuardModule();
  initVotreModule(); // ← Ajoutez cette ligne

  console.log('All modules initialized successfully');
};
```

### Étape 5 : Créer les Pages

Créez les pages correspondantes à vos menus :

**Page du menu principal** : `app/admin/votre-path/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/modules/UsersGuard';

export default function VotrePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Votre Page</h1>
          {/* Votre contenu ici */}
        </div>
      </div>
    </div>
  );
}
```

**Page de paramètres** : `app/admin/settings/votre-module/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/modules/UsersGuard';

export default function VotreModuleSettingsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Configuration Votre Module
          </h1>
          {/* Vos paramètres ici */}
        </div>
      </div>
    </div>
  );
}
```

## Options de Configuration

### Icons

Trois types d'icônes sont supportés :

#### 1. Emoji (Recommandé)
```typescript
icon: {
  type: 'emoji',
  value: '📁'
}
```

#### 2. Classe CSS (FontAwesome, etc.)
```typescript
icon: {
  type: 'icon-class',
  value: 'fas fa-folder'
}
```

#### 3. SVG
```typescript
icon: {
  type: 'svg',
  value: '<svg width="20" height="20">...</svg>'
}
```

### Permissions

#### Format Simple
```typescript
permission: ['users.view', 'users.edit']
```
L'utilisateur doit avoir TOUTES les permissions.

#### Format Avancé
```typescript
permission: {
  key: 'users.view',
  mode: 'all' // ou 'any'
}
```

- `mode: 'all'` - Toutes les permissions requises
- `mode: 'any'` - Au moins une permission requise

### Badges

Ajoutez des badges pour afficher des notifications :

```typescript
{
  id: 'messages',
  label: 'Messages',
  path: '/admin/messages',
  badge: {
    value: 5,              // Nombre ou texte
    variant: 'danger'      // 'primary' | 'success' | 'warning' | 'danger'
  }
}
```

### Ordre d'Affichage

```typescript
{
  order: 10  // Plus le nombre est petit, plus l'élément apparaît en premier
}
```

**Recommandation** : Espacez par 10 pour permettre l'insertion future
- 10, 20, 30, 40, etc.

### Catégories de Paramètres

```typescript
{
  category: 'Sécurité'  // Groupe les paramètres ensemble
}
```

Catégories suggérées :
- Général
- Sécurité
- Modules
- Intégrations
- Avancé

## Exemple Complet : Module Produits

Voici un exemple complet pour un module de gestion de produits :

### 1. Configuration du Menu

`src/modules/Products/admin/config/menu.config.ts`

```typescript
import { ModuleMenuConfig } from '@/src/modules/MenuRegistry';

export const productsMenuConfig: ModuleMenuConfig = {
  module: 'Products',

  menuItems: [
    {
      id: 'products-list',
      label: 'Produits',
      path: '/admin/products',
      icon: {
        type: 'emoji',
        value: '📦',
      },
      order: 30,
      module: 'Products',
      permission: ['products.view'],
      badge: {
        value: 'Nouveau',
        variant: 'success',
      },
    },
    {
      id: 'products-categories',
      label: 'Catégories',
      path: '/admin/categories',
      icon: {
        type: 'emoji',
        value: '📂',
      },
      order: 40,
      module: 'Products',
      permission: ['categories.view'],
    },
  ],

  settingsItems: [
    {
      id: 'settings-products-general',
      label: 'Paramètres Produits',
      description: 'Configurer l\'affichage et le comportement des produits',
      path: '/admin/settings/products',
      icon: {
        type: 'emoji',
        value: '⚙️',
      },
      order: 10,
      category: 'Modules',
      module: 'Products',
      permission: ['settings.products.manage'],
    },
    {
      id: 'settings-products-inventory',
      label: 'Gestion Stock',
      description: 'Configurer les alertes de stock et les niveaux minimum',
      path: '/admin/settings/inventory',
      icon: {
        type: 'emoji',
        value: '📊',
      },
      order: 20,
      category: 'Modules',
      module: 'Products',
      permission: ['settings.inventory.manage'],
    },
  ],
};
```

### 2. Initialisation

`src/modules/Products/admin/init.ts`

```typescript
import { menuRegistryService } from '@/src/modules/MenuRegistry';
import { productsMenuConfig } from './config/menu.config';

export const initProductsModule = () => {
  menuRegistryService.registerModule(productsMenuConfig);
};
```

### 3. Export

`src/modules/Products/index.ts`

```typescript
export { initProductsModule } from './admin/init';
```

### 4. Enregistrement

`src/shared/lib/init-modules.ts`

```typescript
import { initUsersGuardModule } from '@/src/modules/UsersGuard';
import { initProductsModule } from '@/src/modules/Products';

export const initializeModules = () => {
  initUsersGuardModule();
  initProductsModule();
};
```

## Variantes du Menu de Paramètres

Le composant `SettingsMenu` supporte 3 variantes :

### Tabs (Onglets)
```typescript
<SettingsMenu
  userPermissions={userPermissions}
  variant="tabs"
  showCategories={false}
/>
```
Navigation horizontale avec onglets.

### List (Liste)
```typescript
<SettingsMenu
  userPermissions={userPermissions}
  variant="list"
  showCategories={true}
/>
```
Liste verticale avec descriptions.

### Grid (Grille)
```typescript
<SettingsMenu
  userPermissions={userPermissions}
  variant="grid"
  showCategories={true}
/>
```
Grille de cartes (recommandé).

## Hooks Disponibles

### useMenu
```typescript
import { useMenu } from '@/src/modules/MenuRegistry';

const {
  menuItems,          // Tous les menus principaux
  settingsItems,      // Tous les sous-menus
  settingsByCategory, // Sous-menus groupés par catégorie
  isLoading,          // État de chargement
  refresh,            // Rafraîchir les menus
  hasPermission,      // Vérifier une permission
} = useMenu(userPermissions);
```

### useMenuItem
```typescript
import { useMenuItem } from '@/src/modules/MenuRegistry';

const menuItem = useMenuItem('products-list');
```

### useSettingsItem
```typescript
import { useSettingsItem } from '@/src/modules/MenuRegistry';

const settingsItem = useSettingsItem('settings-products-general');
```

## Bonnes Pratiques

1. **Préfixez les IDs** avec le nom du module pour éviter les conflits
   - ✅ `products-list`
   - ❌ `list`

2. **Espacez les valeurs d'ordre** par 10 pour permettre l'insertion future
   - ✅ `10, 20, 30, 40`
   - ❌ `1, 2, 3, 4`

3. **Utilisez des noms de permissions descriptifs**
   - ✅ `products.view`, `settings.products.manage`
   - ❌ `view`, `manage`

4. **Ajoutez des descriptions aux paramètres**
   - Aide les utilisateurs à comprendre à quoi sert chaque paramètre

5. **Groupez les paramètres par catégorie**
   - Facilite la navigation

## Dépannage

### Les menus n'apparaissent pas
1. Vérifiez que `initializeModules()` est appelé dans le layout
2. Vérifiez que votre module est enregistré dans `init-modules.ts`
3. Vérifiez les permissions de l'utilisateur dans la console

### Les permissions ne fonctionnent pas
1. Vérifiez que `userPermissions` est passé au composant
2. Vérifiez le format des permissions dans la config
3. Utilisez `hasPermission()` du hook `useMenu` pour déboguer

### L'ordre ne fonctionne pas
- Les menus sont triés automatiquement par la propriété `order`
- Assurez-vous que `order` est un nombre, pas une chaîne

## Ressources

- **Documentation complète** : `src/modules/MenuRegistry/README.md`
- **Exemple de référence** : `src/modules/UsersGuard/admin/config/menu.config.ts`
- **Types TypeScript** : `src/modules/MenuRegistry/types/menu.types.ts`
