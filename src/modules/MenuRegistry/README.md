# MenuRegistry Module

Le module MenuRegistry gère le système de menus et de navigation de l'application. Il permet à chaque module de déclarer ses propres menus et sous-menus avec des permissions.

## Types de Menus

### 1. Menu Principal (MenuItem)
Les menus principaux apparaissent dans la barre latérale (sidebar) de navigation.

### 2. Sous-menu Paramètres (SettingsMenuItem)
Les sous-menus de paramètres apparaissent dans la page de paramètres et occupent toute une page.

## Structure

```
MenuRegistry/
├── types/
│   └── menu.types.ts          # Définitions TypeScript
├── admin/
│   ├── components/
│   │   ├── Sidebar.tsx        # Barre latérale avec menus
│   │   └── SettingsMenu.tsx   # Menus de paramètres
│   ├── hooks/
│   │   └── useMenu.ts         # Hook pour accéder aux menus
│   └── services/
│       └── menuRegistryService.ts  # Service de gestion
└── index.ts                   # Exports publics
```

## Utilisation

### 1. Créer une Configuration de Menu

Créez un fichier `menu.config.ts` dans votre module :

```typescript
import { ModuleMenuConfig } from '@/src/modules/MenuRegistry';

export const myModuleMenuConfig: ModuleMenuConfig = {
  module: 'MyModule',

  // Menus principaux (sidebar)
  menuItems: [
    {
      id: 'my-menu',
      label: 'Mon Menu',
      path: '/admin/my-path',
      icon: {
        type: 'emoji',
        value: '📁',
      },
      order: 10,
      module: 'MyModule',
      permission: ['my-module.view'],
    },
  ],

  // Sous-menus de paramètres
  settingsItems: [
    {
      id: 'my-settings',
      label: 'Mes Paramètres',
      description: 'Description de mes paramètres',
      path: '/admin/settings/my-settings',
      icon: {
        type: 'emoji',
        value: '⚙️',
      },
      order: 10,
      category: 'Ma Catégorie',
      module: 'MyModule',
      permission: ['my-module.settings.manage'],
    },
  ],
};
```

### 2. Initialiser le Module

Créez un fichier `init.ts` dans votre module :

```typescript
import { menuRegistryService } from '@/src/modules/MenuRegistry';
import { myModuleMenuConfig } from './config/menu.config';

export const initMyModule = () => {
  menuRegistryService.registerModule(myModuleMenuConfig);
};
```

### 3. Enregistrer le Module

Ajoutez l'initialisation dans `src/shared/lib/init-modules.ts` :

```typescript
import { initMyModule } from '@/src/modules/MyModule';

export const initializeModules = () => {
  initUsersGuardModule();
  initMyModule(); // ← Ajoutez votre module ici
};
```

### 4. Exporter l'Initialisation

Mettez à jour l'`index.ts` de votre module :

```typescript
export { initMyModule } from './admin/init';
```

## Permissions

### Format Simple (Array)
```typescript
permission: ['users.view', 'users.edit']
```
Tous les permissions sont requis (mode 'all').

### Format Avancé (Object)
```typescript
permission: {
  key: 'users.view',
  mode: 'all' // ou 'any'
}
```

- `mode: 'all'` - L'utilisateur doit avoir TOUTES les permissions
- `mode: 'any'` - L'utilisateur doit avoir AU MOINS UNE permission

## Types d'Icônes

### Emoji
```typescript
icon: {
  type: 'emoji',
  value: '📁'
}
```

### Classe CSS
```typescript
icon: {
  type: 'icon-class',
  value: 'fas fa-folder'
}
```

### SVG
```typescript
icon: {
  type: 'svg',
  value: '<svg>...</svg>'
}
```

## Composants

### Sidebar
Affiche les menus principaux dans la barre latérale.

```typescript
import { Sidebar } from '@/src/modules/MenuRegistry';

<Sidebar
  userPermissions={['users.view', 'settings.manage']}
  onMenuClick={(item) => console.log('Clicked:', item)}
/>
```

### SettingsMenu
Affiche les menus de paramètres.

```typescript
import { SettingsMenu } from '@/src/modules/MenuRegistry';

<SettingsMenu
  userPermissions={['settings.manage']}
  variant="grid"        // 'tabs' | 'list' | 'grid'
  showCategories={true}
/>
```

**Variants:**
- `tabs` - Navigation horizontale avec onglets
- `list` - Liste verticale avec descriptions
- `grid` - Grille de cartes

## Hooks

### useMenu
```typescript
import { useMenu } from '@/src/modules/MenuRegistry';

const { menuItems, settingsItems, settingsByCategory, isLoading, refresh } = useMenu(
  userPermissions
);
```

### useMenuItem
```typescript
import { useMenuItem } from '@/src/modules/MenuRegistry';

const menuItem = useMenuItem('my-menu-id');
```

### useSettingsItem
```typescript
import { useSettingsItem } from '@/src/modules/MenuRegistry';

const settingsItem = useSettingsItem('my-settings-id');
```

## Service

### menuRegistryService

```typescript
import { menuRegistryService } from '@/src/modules/MenuRegistry';

// Enregistrer un module
menuRegistryService.registerModule(config);

// Désenregistrer un module
menuRegistryService.unregisterModule('ModuleName');

// Obtenir tous les menus
const menus = menuRegistryService.getAllMenuItems();

// Obtenir les menus filtrés par permissions
const menus = menuRegistryService.getMenuItemsForUser(userPermissions);

// Obtenir un menu par ID
const menu = menuRegistryService.getMenuItemById('menu-id');
```

## Badges

Ajoutez des badges aux menus pour afficher des notifications :

```typescript
{
  id: 'messages',
  label: 'Messages',
  path: '/admin/messages',
  badge: {
    value: 5,
    variant: 'danger' // 'primary' | 'success' | 'warning' | 'danger'
  }
}
```

## Ordre d'Affichage

Les menus sont triés par la propriété `order` (ordre croissant).

```typescript
{
  order: 10  // Apparaît en premier
}

{
  order: 20  // Apparaît en deuxième
}
```

## Catégories de Paramètres

Groupez les paramètres par catégorie :

```typescript
{
  category: 'Sécurité'  // Les paramètres seront groupés par catégorie
}
```

## Exemple Complet

Voir `src/modules/UsersGuard/admin/config/menu.config.ts` pour un exemple complet de configuration.

## Bonnes Pratiques

1. **Nommage des IDs** - Utilisez un préfixe avec le nom du module (ex: `usersguard-users`)
2. **Order** - Espacez les valeurs d'ordre par 10 pour permettre l'insertion future
3. **Permissions** - Utilisez des noms descriptifs (ex: `users.view`, `settings.security.manage`)
4. **Icônes** - Préférez les emojis pour la simplicité ou les classes CSS pour la cohérence
5. **Descriptions** - Ajoutez toujours une description aux items de paramètres

## Dépannage

### Les menus n'apparaissent pas
- Vérifiez que `initializeModules()` est appelé dans le layout
- Vérifiez que votre module est enregistré dans `init-modules.ts`
- Vérifiez les permissions de l'utilisateur

### Les permissions ne fonctionnent pas
- Vérifiez que `userPermissions` est passé correctement
- Vérifiez le format des permissions dans la configuration
- Vérifiez que l'utilisateur a les bonnes permissions

### L'ordre ne fonctionne pas
- Vérifiez que la propriété `order` est un nombre
- Les menus sont triés automatiquement, pas besoin de les trier manuellement
