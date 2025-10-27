# 🚀 Système de Routage Dynamique

Ce document explique le système de routage dynamique qui génère automatiquement les routes frontend à partir de la structure des menus en base de données.

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Convention de nommage](#convention-de-nommage)
4. [Flux de données](#flux-de-données)
5. [Exemples pratiques](#exemples-pratiques)
6. [Créer un nouveau module](#créer-un-nouveau-module)
7. [Dépannage](#dépannage)

## Vue d'ensemble

Le système génère automatiquement des routes Next.js basées sur les données de menu stockées dans la table `system_menu` de votre base de données Laravel.

### Principe de fonctionnement

```
Base de données → API Laravel → Service Frontend → Route Generator → Dynamic Page
```

**Exemple concret:**
```
DB: { module: "customers_contracts", name: "0010_contracts_list1" }
↓
Route générée: /admin/customers-contracts/contracts-list1
↓
Module chargé: src/modules/CustomersContracts/admin/components/ContractsList1.tsx
```

## Architecture

### 1. Structure de la base de données

Table `system_menu`:
```sql
CREATE TABLE system_menu (
    id INT PRIMARY KEY,
    name VARCHAR(255),           -- Ex: "0010_contracts_list1"
    module VARCHAR(255),         -- Ex: "customers_contracts"
    menu VARCHAR(255),           -- Path explicite (optionnel)
    lb INT,                      -- Left boundary (nested set)
    rb INT,                      -- Right boundary (nested set)
    level INT,                   -- Niveau hiérarchique
    status ENUM('ACTIVE', 'INACTIVE', 'DELETED'),
    type ENUM('SYSTEM', 'CUSTOM'),
    translation VARCHAR(255),    -- Label traduit
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**Exemple de données:**
```json
[
  {
    "id": 237,
    "name": "10_meetings_statistics",
    "module": "customers_meetings_statistic",
    "menu": "",
    "translation": "Statistics Leads"
  },
  {
    "id": 12,
    "name": "0010_contracts_list1",
    "module": "customers_contracts",
    "menu": "",
    "translation": "Liste Contrats 1"
  }
]
```

### 2. Backend Laravel (API)

**Endpoint:** `GET /api/admin/menus?lang=fr`

**Réponse:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 237,
        "name": "10_meetings_statistics",
        "module": "customers_meetings_statistic",
        "menu": "",
        "lb": 3,
        "rb": 4,
        "level": 2,
        "status": "ACTIVE",
        "type": "SYSTEM",
        "translation": "Statistics Leads",
        "created_at": "2024-05-23T09:27:49.000000Z",
        "updated_at": "2024-05-23T09:27:49.000000Z"
      }
    ]
  }
}
```

### 3. Frontend Next.js

#### a) Service Layer (`menuService.ts`)

Transforme les données backend en format frontend:

```typescript
// Input (Backend)
{
  id: 237,
  name: "10_meetings_statistics",
  module: "customers_meetings_statistic",
  translation: "Statistics Leads"
}

// Output (Frontend)
{
  id: "237",
  label: "Statistics Leads",
  path: "/admin/customers-meetings-statistic/meetings-statistics",
  module: "customers_meetings_statistic",
  name: "10_meetings_statistics"
}
```

#### b) Route Generator (`routeGenerator.ts`)

Génère les URLs à partir des données menu:

```typescript
generateAdminRoute({
  module: "customers_meetings_statistic",
  name: "10_meetings_statistics"
})
// → "/admin/customers-meetings-statistic/meetings-statistics"
```

**Logique:**
1. Supprime les préfixes numériques (`10_` → ``)
2. Convertit en kebab-case (`meetings_statistics` → `meetings-statistics`)
3. Combine module + name

#### c) Dynamic Route Handler (`app/admin/[...slug]/page.tsx`)

Capture toutes les routes `/admin/*` et charge le bon composant.

#### d) Dynamic Module Loader (`DynamicModuleLoader.tsx`)

Charge dynamiquement le composant React correspondant:

```typescript
// URL: /admin/customers-contracts/contracts-list1
// Slug: ['customers-contracts', 'contracts-list1']

// Transformation:
moduleName = "CustomersContracts"       // PascalCase
componentName = "ContractsList1"        // PascalCase

// Import dynamique:
import(`@/src/modules/${moduleName}/admin/components/${componentName}.tsx`)
```

## Convention de nommage

### 1. Base de données → URL

| Base de données | URL générée |
|----------------|-------------|
| `module: "customers_contracts"`<br>`name: "0010_contracts_list1"` | `/admin/customers-contracts/contracts-list1` |
| `module: "products_installer_communication"`<br>`name: "0000_users_product"` | `/admin/products-installer-communication/users-product` |
| `module: ""`<br>`name: "Dashboard"` | `/admin/dashboard` |

### 2. URL → Module/Composant

| URL | Module | Composant |
|-----|--------|-----------|
| `/admin/customers-contracts/contracts-list1` | `CustomersContracts` | `ContractsList1` |
| `/admin/products-installer-communication/users-product` | `ProductsInstallerCommunication` | `UsersProduct` |
| `/admin/dashboard` | `Dashboard` | `Dashboard` |

### 3. Règles de transformation

#### a) Suppression des préfixes numériques
```
0000_ → (supprimé)
0010_ → (supprimé)
10_   → (supprimé)
30_   → (supprimé)
```

#### b) snake_case → kebab-case (URL)
```
customers_contracts → customers-contracts
meeting_statistics  → meeting-statistics
users_product       → users-product
```

#### c) kebab-case → PascalCase (Module)
```
customers-contracts → CustomersContracts
meeting-statistics  → MeetingStatistics
users-product       → UsersProduct
```

## Flux de données

### 1. Chargement initial des menus

```
┌─────────────────┐
│ User loads page │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ useMenus hook (React)       │
│ - Calls menuService         │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ menuService.getMenuTree()   │
│ - GET /api/admin/menus/tree │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Laravel API                 │
│ - Returns nested menu data  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│ menuService.transformMenuItem() │
│ - Converts to MenuItem          │
│ - Generates path via            │
│   generateAdminRoute()          │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Sidebar Component           │
│ - Renders menu with Links   │
│ - Uses generated paths      │
└─────────────────────────────┘
```

### 2. Navigation vers une page

```
┌──────────────────────────────────────┐
│ User clicks menu link                │
│ /admin/customers-contracts/list1     │
└────────┬─────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ Next.js routing                         │
│ - Matches: app/admin/[...slug]/page.tsx │
│ - slug = ['customers-contracts','list1']│
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ DynamicModuleLoader                 │
│ - Transforms slug to module info    │
│   * module: CustomersContracts      │
│   * component: List1                │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│ Dynamic import                                  │
│ import('@/src/modules/CustomersContracts/       │
│        admin/components/List1.tsx')             │
└────────┬────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Component renders           │
└─────────────────────────────┘
```

## Exemples pratiques

### Exemple 1: Module Customers Contracts

**Base de données:**
```json
{
  "id": 12,
  "name": "0010_contracts_list1",
  "module": "customers_contracts",
  "translation": "Liste Contrats 1"
}
```

**Transformations:**
1. **Route générée:** `/admin/customers-contracts/contracts-list1`
2. **Module name:** `CustomersContracts`
3. **Component name:** `ContractsList1`
4. **File path:** `src/modules/CustomersContracts/admin/components/ContractsList1.tsx`

**Structure de fichiers requise:**
```
src/modules/CustomersContracts/
├── admin/
│   ├── components/
│   │   └── ContractsList1.tsx    ← Composant chargé dynamiquement
│   ├── hooks/
│   ├── services/
│   └── utils/
├── types/
└── index.ts
```

### Exemple 2: Module Products Installer Communication

**Base de données:**
```json
{
  "id": 242,
  "name": "0000_users_product_installer_communications",
  "module": "products_installer_communication",
  "translation": "Communications Produits"
}
```

**Transformations:**
1. **Route:** `/admin/products-installer-communication/users-product-installer-communications`
2. **Module:** `ProductsInstallerCommunication`
3. **Component:** `UsersProductInstallerCommunications`
4. **Path:** `src/modules/ProductsInstallerCommunication/admin/components/UsersProductInstallerCommunications.tsx`

### Exemple 3: Dashboard (sans module)

**Base de données:**
```json
{
  "id": 2,
  "name": "Dashboard",
  "module": "",
  "translation": "Dashboard"
}
```

**Transformations:**
1. **Route:** `/admin/dashboard`
2. **Module:** `Dashboard`
3. **Component:** `Dashboard`
4. **Path:** `src/modules/Dashboard/admin/components/Dashboard.tsx`

## Créer un nouveau module

### Étape 1: Ajouter dans la base de données

```sql
INSERT INTO system_menu (name, module, menu, lb, rb, level, status, type, translation)
VALUES ('0050_customer_reports', 'customers_reports', '', 10, 11, 2, 'ACTIVE', 'SYSTEM', 'Rapports Clients');
```

### Étape 2: Créer la structure de fichiers

```bash
mkdir -p src/modules/CustomersReports/admin/components
mkdir -p src/modules/CustomersReports/admin/hooks
mkdir -p src/modules/CustomersReports/admin/services
mkdir -p src/modules/CustomersReports/types
```

### Étape 3: Créer le composant

**Fichier:** `src/modules/CustomersReports/admin/components/CustomerReports.tsx`

```tsx
'use client';

import React from 'react';

export default function CustomerReports() {
  return (
    <div>
      <h1>Rapports Clients</h1>
      <p>Page de rapports pour les clients...</p>
    </div>
  );
}
```

### Étape 4: Tester

1. Rechargez la page admin
2. Le menu "Rapports Clients" apparaîtra automatiquement dans la sidebar
3. Cliquez dessus → route `/admin/customers-reports/customer-reports`
4. Le composant `CustomerReports` se charge automatiquement

## Dépannage

### Problème 1: "Module Not Found"

**Symptôme:** Erreur lors du clic sur un menu

**Causes possibles:**
1. Le fichier composant n'existe pas
2. Le nom du fichier ne correspond pas (casse incorrecte)
3. Le composant n'a pas d'export par défaut

**Solution:**
```bash
# Vérifier que le fichier existe
ls src/modules/CustomersContracts/admin/components/ContractsList1.tsx

# Vérifier l'export dans le composant
export default function ContractsList1() { ... }
```

### Problème 2: Mauvaise route générée

**Symptôme:** Le lien dans le menu ne fonctionne pas

**Solution:** Vérifier la transformation dans la console:
```typescript
// Dans menuService.ts, ajoutez des logs
console.log('🔍 Menu transformation:', {
  input: backendItem,
  output: generatedPath
});
```

### Problème 3: Menu ne s'affiche pas

**Causes possibles:**
1. `status !== 'ACTIVE'` dans la base de données
2. `level === 0` (menu root, ignoré)
3. Erreur API

**Solution:**
```sql
-- Vérifier le statut
SELECT id, name, status, level FROM system_menu WHERE name = 'votre_menu';

-- Corriger si nécessaire
UPDATE system_menu SET status = 'ACTIVE' WHERE id = 237;
```

### Problème 4: Composant se charge mais est vide

**Cause:** Le composant n'a pas de contenu ou ne s'exporte pas correctement

**Solution:**
```tsx
// Mauvais ❌
export function MyComponent() { ... }

// Bon ✅
export default function MyComponent() { ... }
```

## Fichiers clés

| Fichier | Rôle |
|---------|------|
| `src/shared/utils/routeGenerator.ts` | Génère les routes URL à partir de module/name |
| `src/shared/utils/menu-route-generator.ts` | Utilitaires de transformation (PascalCase, etc.) |
| `src/modules/Dashboard/admin/services/menuService.ts` | Service API pour les menus |
| `src/shared/components/DynamicModuleLoader.tsx` | Charge dynamiquement les composants |
| `app/admin/[...slug]/page.tsx` | Point d'entrée pour routes dynamiques |
| `src/modules/Dashboard/admin/components/Sidebar.tsx` | Affiche les menus avec liens |

## Tests rapides

### Test 1: Vérifier la génération de routes

```typescript
import { generateAdminRoute } from '@/src/shared/utils/routeGenerator';

// Test
console.log(generateAdminRoute({
  module: 'customers_contracts',
  name: '0010_contracts_list1'
}));
// Attendu: /admin/customers-contracts/contracts-list1
```

### Test 2: Vérifier la transformation PascalCase

```typescript
import { toPascalCase } from '@/src/shared/utils/menu-route-generator';

console.log(toPascalCase('customers_contracts'));
// Attendu: CustomersContracts

console.log(toPascalCase('products_installer_communication'));
// Attendu: ProductsInstallerCommunication
```

### Test 3: Vérifier le chargement d'un module

1. Ouvrir la console du navigateur
2. Naviguer vers `/admin/customers-contracts/contracts-list1`
3. Chercher les logs: `🔍 Dynamic Module Loading:`
4. Vérifier que `moduleName` et `componentName` sont corrects

## Bonnes pratiques

1. **Nommage cohérent:** Toujours utiliser snake_case dans la base de données
2. **PascalCase pour les fichiers:** Les noms de fichiers composants doivent être en PascalCase
3. **Export par défaut:** Toujours utiliser `export default` pour les composants de page
4. **Préfixes numériques:** Utiliser des préfixes pour l'ordre (0010_, 0020_, etc.)
5. **Tester après ajout:** Toujours tester un nouveau menu après l'avoir ajouté en BDD

## Résumé

✅ **Ce que fait le système:**
- Génère automatiquement les routes depuis la base de données
- Transforme les noms (snake_case → kebab-case → PascalCase)
- Charge dynamiquement les composants React
- Gère les erreurs avec messages d'aide

✅ **Ce que vous devez faire:**
- Ajouter les menus dans la base de données
- Créer les modules/composants correspondants
- Respecter les conventions de nommage
- Exporter les composants correctement

✅ **Ce que vous N'avez PAS besoin de faire:**
- Créer manuellement les routes Next.js
- Maintenir un registry de modules
- Écrire du code de routing
- Gérer le mapping URL → Composant
