# Template pour Ajouter des Menus à un Module

Ce fichier sert de template pour créer rapidement des menus dans vos modules.

## Étape 1 : Créer le fichier de configuration

**Emplacement** : `src/modules/[VotreModule]/admin/config/menu.config.ts`

```typescript
import { ModuleMenuConfig } from '@/src/modules/MenuRegistry';

export const votreModuleMenuConfig: ModuleMenuConfig = {
  module: 'VotreModule', // ← Changez le nom du module

  // Menus principaux (affichés dans la sidebar)
  menuItems: [
    {
      id: 'votre-module-menu-1', // ← ID unique
      label: 'Nom du Menu', // ← Texte affiché
      path: '/admin/votre-path', // ← URL de la page
      icon: {
        type: 'emoji',
        value: '📁', // ← Emoji ou icône
      },
      order: 30, // ← Ordre d'affichage (10, 20, 30...)
      module: 'VotreModule',
      permission: ['votre-module.view'], // ← Permission requise (optionnel)
    },
    // Ajoutez d'autres menus ici...
  ],

  // Sous-menus de paramètres (affichés dans la page Paramètres)
  settingsItems: [
    {
      id: 'settings-votre-module', // ← ID unique
      label: 'Paramètres Module', // ← Texte affiché
      description: 'Configurer les paramètres de votre module', // ← Description
      path: '/admin/settings/votre-module', // ← URL de la page
      icon: {
        type: 'emoji',
        value: '⚙️', // ← Emoji ou icône
      },
      order: 40, // ← Ordre d'affichage
      category: 'Modules', // ← Catégorie (Général, Sécurité, Modules, etc.)
      module: 'VotreModule',
      permission: ['settings.votre-module.manage'], // ← Permission requise (optionnel)
    },
    // Ajoutez d'autres paramètres ici...
  ],
};
```

## Étape 2 : Créer le fichier d'initialisation

**Emplacement** : `src/modules/[VotreModule]/admin/init.ts`

```typescript
import { menuRegistryService } from '@/src/modules/MenuRegistry';
import { votreModuleMenuConfig } from './config/menu.config';

export const initVotreModule = () => {
  // Enregistrer les menus
  menuRegistryService.registerModule(votreModuleMenuConfig);

  // Ajoutez d'autres initialisations ici si nécessaire
};
```

## Étape 3 : Exporter l'initialisation

**Emplacement** : `src/modules/[VotreModule]/index.ts`

Ajoutez cette ligne à votre fichier barrel export :

```typescript
export { initVotreModule } from './admin/init';
```

## Étape 4 : Enregistrer le module

**Emplacement** : `src/shared/lib/init-modules.ts`

Ajoutez votre module :

```typescript
import { initVotreModule } from '@/src/modules/VotreModule';

export const initializeModules = () => {
  menuRegistryService.registerModule(coreMenusConfig);
  initUsersGuardModule();
  initVotreModule(); // ← Ajoutez cette ligne

  console.log('All modules initialized successfully');
};
```

## Étape 5 : Créer les pages

### Page principale

**Emplacement** : `app/admin/[votre-path]/page.tsx`

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Titre de la Page</h1>

          {/* Votre contenu ici */}

        </div>
      </div>
    </div>
  );
}
```

### Page de paramètres

**Emplacement** : `app/admin/settings/[votre-module]/page.tsx`

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Paramètres de Votre Module
          </h1>

          {/* Vos paramètres ici */}

        </div>
      </div>
    </div>
  );
}
```

## Options de Configuration

### Types d'icônes

```typescript
// Emoji (recommandé pour la simplicité)
icon: {
  type: 'emoji',
  value: '📁'
}

// Classe CSS (FontAwesome, etc.)
icon: {
  type: 'icon-class',
  value: 'fas fa-folder'
}

// SVG
icon: {
  type: 'svg',
  value: '<svg>...</svg>'
}
```

### Formats de permissions

```typescript
// Format simple (toutes les permissions requises)
permission: ['users.view', 'users.edit']

// Format avancé (mode configurable)
permission: {
  key: 'users.view',
  mode: 'all' // ou 'any'
}
```

### Badges

```typescript
badge: {
  value: 5,              // Nombre ou texte
  variant: 'danger'      // 'primary' | 'success' | 'warning' | 'danger'
}
```

## Emojis Recommandés par Type

- 📁 Fichiers/Documents
- 👥 Utilisateurs
- 🔐 Rôles/Permissions
- ⚙️ Paramètres
- 🏠 Dashboard
- 📊 Statistiques/Rapports
- 📦 Produits
- 🛒 Commandes
- 💰 Finances
- 📧 Messages/Email
- 🔔 Notifications
- 🔑 Authentification
- 🔒 Sécurité
- 📝 Formulaires
- 🗂️ Catégories
- 🎨 Thème/Design
- 🌐 Langues/i18n
- 🔌 Intégrations
- 📱 Mobile
- 🖥️ Bureau

## Catégories de Paramètres Suggérées

- **Général** - Paramètres généraux de l'application
- **Sécurité** - Authentification, mots de passe, sessions
- **Modules** - Paramètres spécifiques aux modules
- **Intégrations** - API externes, webhooks
- **Avancé** - Paramètres techniques avancés
- **Apparence** - Thème, couleurs, logo
- **Notifications** - Email, SMS, push

## Ordre d'Affichage Recommandé

```typescript
// Menus principaux
Dashboard:  1
Modules:    10-90 (espacés de 10)
Settings:   1000

// Paramètres
Général:    10
Sécurité:   20
Modules:    30-80
Intégrations: 90
Avancé:     100
```

## Checklist

- [ ] Créer `menu.config.ts` dans `admin/config/`
- [ ] Créer `init.ts` dans `admin/`
- [ ] Exporter `initVotreModule` dans `index.ts`
- [ ] Ajouter à `init-modules.ts`
- [ ] Créer la page principale
- [ ] Créer la page de paramètres (si nécessaire)
- [ ] Tester l'affichage des menus
- [ ] Tester les permissions

## Ressources

- **Guide complet** : `MENU-SYSTEM-GUIDE.md`
- **Documentation** : `src/modules/MenuRegistry/README.md`
- **Exemple** : `src/modules/UsersGuard/admin/config/menu.config.ts`
