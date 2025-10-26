# Résumé du Système de Menus

## Ce qui a été créé

J'ai créé un système de gestion de menus modulaire complet pour votre application Next.js. Voici ce qui a été mis en place :

### 1. Module MenuRegistry (`src/modules/MenuRegistry/`)

Le module principal qui gère tous les menus de l'application :

#### Structure
```
MenuRegistry/
├── types/
│   └── menu.types.ts          # Types TypeScript
├── admin/
│   ├── components/
│   │   ├── Sidebar.tsx        # Barre latérale avec menus
│   │   └── SettingsMenu.tsx   # Menu de paramètres (3 variantes)
│   ├── hooks/
│   │   └── useMenu.ts         # Hook pour accéder aux menus
│   └── services/
│       └── menuRegistryService.ts  # Service de gestion centralisé
└── index.ts                   # Exports publics
```

#### Fonctionnalités
- ✅ Gestion centralisée de tous les menus
- ✅ Support des permissions par menu
- ✅ Filtrage automatique selon les permissions utilisateur
- ✅ Deux types de menus : principaux et paramètres
- ✅ Support des icônes (emoji, CSS, SVG)
- ✅ Support des badges de notification
- ✅ Catégorisation des paramètres
- ✅ Ordre d'affichage personnalisable

### 2. Exemple d'Implémentation (UsersGuard)

Le module UsersGuard a été configuré avec des menus :

**Fichier** : `src/modules/UsersGuard/admin/config/menu.config.ts`

**Menus ajoutés** :
- 👥 Utilisateurs (`/admin/users`)
- 🔐 Rôles & Permissions (`/admin/roles`)

**Paramètres ajoutés** :
- 🔒 Authentification (`/admin/settings/auth`)
- 🔑 Politique de mot de passe (`/admin/settings/password-policy`)
- ⏱️ Sessions (`/admin/settings/sessions`)

### 3. Menus de Base

**Fichier** : `src/shared/config/core-menus.config.ts`

**Menus ajoutés** :
- 🏠 Tableau de bord (`/admin/dashboard`)
- ⚙️ Paramètres (`/admin/settings`)

### 4. Initialisation Globale

**Fichier** : `src/shared/lib/init-modules.ts`

Système d'initialisation qui enregistre tous les modules au démarrage.

### 5. Intégration dans l'Application

#### Layout Admin Mis à Jour
**Fichier** : `app/admin/layout.tsx`

- ✅ Initialise tous les modules au chargement
- ✅ Affiche la sidebar avec les menus
- ✅ Extrait les permissions de l'utilisateur
- ✅ Masque la sidebar sur la page de login

#### Page de Paramètres Créée
**Fichier** : `app/admin/settings/page.tsx`

- ✅ Affiche tous les paramètres en grille
- ✅ Filtre par permissions utilisateur
- ✅ Groupe par catégories

### 6. Utilitaires de Permissions

**Fichier** : `src/shared/utils/permissions.ts`

Fonctions utilitaires pour gérer les permissions :
- `getUserPermissions()` - Extrait les permissions de l'utilisateur
- `userHasPermission()` - Vérifie une permission
- `userHasAllPermissions()` - Vérifie toutes les permissions
- `userHasAnyPermission()` - Vérifie au moins une permission

### 7. Documentation Complète

Trois fichiers de documentation créés :

1. **`MENU-SYSTEM-GUIDE.md`** - Guide complet d'utilisation
2. **`src/modules/MenuRegistry/README.md`** - Documentation technique
3. **`TEMPLATE-MODULE-MENU.md`** - Template rapide pour ajouter des menus

## Comment Utiliser le Système

### Pour Ajouter un Menu à un Module

**1. Créer la configuration** (`admin/config/menu.config.ts`)
```typescript
export const votreModuleMenuConfig: ModuleMenuConfig = {
  module: 'VotreModule',
  menuItems: [/* vos menus */],
  settingsItems: [/* vos paramètres */],
};
```

**2. Créer l'initialisation** (`admin/init.ts`)
```typescript
export const initVotreModule = () => {
  menuRegistryService.registerModule(votreModuleMenuConfig);
};
```

**3. Exporter** (`index.ts`)
```typescript
export { initVotreModule } from './admin/init';
```

**4. Enregistrer** (`src/shared/lib/init-modules.ts`)
```typescript
import { initVotreModule } from '@/src/modules/VotreModule';

export const initializeModules = () => {
  // ...
  initVotreModule(); // ← Ajouter ici
};
```

**5. Créer les pages**
- `app/admin/votre-path/page.tsx` (menu principal)
- `app/admin/settings/votre-module/page.tsx` (paramètres)

## Types de Menus

### 1. Menu Principal (MenuItem)
Affiché dans la barre latérale de navigation.

**Propriétés** :
- `id` - Identifiant unique
- `label` - Texte affiché
- `path` - URL de la page
- `icon` - Icône (emoji/CSS/SVG)
- `order` - Ordre d'affichage
- `permission` - Permission(s) requise(s)
- `badge` - Badge de notification (optionnel)

### 2. Sous-menu Paramètres (SettingsMenuItem)
Affiché dans la page de paramètres, occupe toute une page.

**Propriétés supplémentaires** :
- `description` - Description du paramètre
- `category` - Catégorie de regroupement

## Composants Disponibles

### Sidebar
Barre latérale avec menus principaux.

```typescript
<Sidebar
  userPermissions={['users.view', 'settings.manage']}
  onMenuClick={(item) => console.log('Clicked:', item)}
/>
```

### SettingsMenu
Menu de paramètres avec 3 variantes.

```typescript
<SettingsMenu
  userPermissions={['settings.manage']}
  variant="grid"        // 'tabs' | 'list' | 'grid'
  showCategories={true}
/>
```

**Variantes** :
- `tabs` - Onglets horizontaux
- `list` - Liste verticale avec descriptions
- `grid` - Grille de cartes (recommandé)

## Permissions

Le système gère automatiquement l'affichage des menus selon les permissions de l'utilisateur.

### Format Simple
```typescript
permission: ['users.view', 'users.edit']
```
Toutes les permissions sont requises.

### Format Avancé
```typescript
permission: {
  key: 'users.view',
  mode: 'all' // ou 'any'
}
```

- `mode: 'all'` - L'utilisateur doit avoir TOUTES les permissions
- `mode: 'any'` - L'utilisateur doit avoir AU MOINS UNE permission

## Structure des Permissions Backend

Le système extrait automatiquement les permissions de :
1. Les permissions directes de l'utilisateur (`user.permissions`)
2. Les permissions des groupes de l'utilisateur (`user.groups[].permissions`)

Les permissions sont des objets avec :
- `id` - ID de la permission
- `name` - Nom de la permission
- `slug` - Slug utilisé pour les vérifications (ex: `users.view`)

## Exemple Complet

Voir le module UsersGuard pour un exemple complet :
- Configuration : `src/modules/UsersGuard/admin/config/menu.config.ts`
- Initialisation : `src/modules/UsersGuard/admin/init.ts`
- Export : `src/modules/UsersGuard/index.ts`

## Ordre d'Affichage Recommandé

```
Dashboard:  1
Menus:      10, 20, 30, 40... (espacés de 10)
Settings:   1000
```

Espacez par 10 pour permettre l'insertion de nouveaux menus entre les existants.

## Catégories de Paramètres Suggérées

- **Général** - Paramètres généraux
- **Sécurité** - Auth, mots de passe, sessions
- **Modules** - Paramètres des modules
- **Intégrations** - APIs externes
- **Avancé** - Paramètres techniques

## Fichiers Créés

### Module MenuRegistry
- `src/modules/MenuRegistry/types/menu.types.ts`
- `src/modules/MenuRegistry/admin/services/menuRegistryService.ts`
- `src/modules/MenuRegistry/admin/hooks/useMenu.ts`
- `src/modules/MenuRegistry/admin/components/Sidebar.tsx`
- `src/modules/MenuRegistry/admin/components/SettingsMenu.tsx`
- `src/modules/MenuRegistry/index.ts`
- `src/modules/MenuRegistry/README.md`

### Exemple UsersGuard
- `src/modules/UsersGuard/admin/config/menu.config.ts`
- `src/modules/UsersGuard/admin/init.ts`

### Configuration Globale
- `src/shared/config/core-menus.config.ts`
- `src/shared/lib/init-modules.ts`
- `src/shared/utils/permissions.ts`

### Pages
- `app/admin/settings/page.tsx`

### Documentation
- `MENU-SYSTEM-GUIDE.md`
- `TEMPLATE-MODULE-MENU.md`
- `MENU-SYSTEM-SUMMARY.md`

### Fichiers Modifiés
- `app/admin/layout.tsx` (intégration sidebar + init)
- `src/modules/UsersGuard/index.ts` (export init)

## Prochaines Étapes

1. **Tester le système** - Lancez `npm run dev` et vérifiez l'affichage des menus
2. **Ajouter des permissions** - Configurez les permissions dans votre backend Laravel
3. **Créer de nouveaux modules** - Utilisez le template pour ajouter vos menus
4. **Personnaliser le style** - Modifiez les composants Sidebar et SettingsMenu selon vos besoins

## Support

Pour toute question, consultez :
- `MENU-SYSTEM-GUIDE.md` - Guide complet
- `TEMPLATE-MODULE-MENU.md` - Template rapide
- `src/modules/MenuRegistry/README.md` - Documentation technique
