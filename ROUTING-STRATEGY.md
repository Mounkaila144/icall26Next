# 🗺️ Stratégie de Routing - Module & Name Convention

## 📋 Vue d'ensemble

Ce document explique comment les routes frontend sont générées automatiquement à partir des données de menus stockées dans la base de données.

## 🎯 Principe de Base

Chaque menu dans la base de données a 3 colonnes clés :
- **`module`** : Nom du module Laravel (ex: `customers_meetings`, `users_guard`)
- **`name`** : Nom de la route/fonctionnalité (ex: `meetings_statistics`, `user_list`)
- **`menu`** : Chemin explicite optionnel (ex: `/admin/custom-page`)

## 🔄 Règles de Génération (Par Priorité)

### Priorité 1 : Path Explicite ✅
Si la colonne `menu` contient une valeur → utiliser tel quel

```sql
module = "customers_meetings"
name = "meetings_statistics"
menu = "/admin/my-custom-path"
```
**→ Résultat:** `/admin/my-custom-path`

---

### Priorité 2 : Convention Module + Name 🔧
Si `module` est renseigné et `menu` est vide → générer automatiquement

```sql
module = "customers_meetings"
name = "meetings_statistics"
menu = ""
```
**→ Résultat:** `/admin/customers-meetings/meetings-statistics`

**Conversion appliquée:**
- `snake_case` → `kebab-case`
- `customers_meetings` → `customers-meetings`
- `meetings_statistics` → `meetings-statistics`

---

### Priorité 3 : Name Seul (Fallback) 📌
Si `module` est vide → utiliser uniquement le name

```sql
module = ""
name = "Dashboard"
menu = ""
```
**→ Résultat:** `/admin/dashboard`

---

## 📊 Exemples Réels

### Exemple 1 : Dashboard Principal
```sql
id = 2
module = ""
name = "Dashboard"
menu = ""
```
**Génération:** `/admin/dashboard`

---

### Exemple 2 : Statistics des Meetings
```sql
id = 237
module = "customers_meetings_statistic"
name = "10_meetings_statistics"
menu = ""
```
**Génération:** `/admin/customers-meetings-statistic/10-meetings-statistics`

---

### Exemple 3 : Page Personnalisée
```sql
id = 100
module = "reports"
name = "monthly_report"
menu = "/admin/reports/monthly"
```
**Génération:** `/admin/reports/monthly` (utilise le path explicite)

---

## 🏗️ Structure Next.js Correspondante

Pour que les routes générées fonctionnent, vous devez créer la structure de fichiers Next.js :

```
app/admin/
├── dashboard/
│   └── page.tsx                    # /admin/dashboard
├── customers-meetings-statistic/
│   └── 10-meetings-statistics/
│       └── page.tsx                # /admin/customers-meetings-statistic/10-meetings-statistics
├── users-guard/
│   ├── user-list/
│   │   └── page.tsx               # /admin/users-guard/user-list
│   └── roles/
│       └── page.tsx               # /admin/users-guard/roles
```

---

## 🎨 Convention de Nommage

### Backend Laravel (snake_case)
```
customers_meetings
users_guard
meeting_statistics
```

### Frontend Next.js (kebab-case)
```
customers-meetings
users-guard
meeting-statistics
```

**Conversion automatique** par le `routeGenerator`

---

## 🔧 Comment Ajouter un Nouveau Menu

### Méthode 1 : Avec Module (Recommandé)
1. Créer le module Laravel : `Modules/CustomersReports/`
2. Ajouter le menu en BDD :
   ```sql
   INSERT INTO menus (module, name, menu) VALUES
   ('customers_reports', 'monthly_statistics', '');
   ```
3. Créer la page Next.js :
   ```
   app/admin/customers-reports/monthly-statistics/page.tsx
   ```

### Méthode 2 : Sans Module (Simple)
1. Ajouter le menu en BDD :
   ```sql
   INSERT INTO menus (module, name, menu) VALUES
   ('', 'settings', '');
   ```
2. Créer la page Next.js :
   ```
   app/admin/settings/page.tsx
   ```

### Méthode 3 : Path Explicite (Custom)
1. Ajouter le menu en BDD avec path custom :
   ```sql
   INSERT INTO menus (module, name, menu) VALUES
   ('reports', 'quarterly', '/admin/custom-reports/q1-2024');
   ```
2. Créer la page Next.js au path exact :
   ```
   app/admin/custom-reports/q1-2024/page.tsx
   ```

---

## 🚀 Utilisation dans le Code

### Dans un Composant
```tsx
import { generateAdminRoute } from '@/src/shared/utils/routeGenerator';

const menuPath = generateAdminRoute({
  module: 'customers_meetings',
  name: 'meetings_statistics',
  menu: '', // ou path explicite
});
// → '/admin/customers-meetings/meetings-statistics'
```

### Dans le Service Menu
Le service `menuService` applique automatiquement la génération lors de la transformation des données backend.

---

## 📦 Avantages de cette Approche

✅ **Flexibilité** : Support de chemins personnalisés ET convention automatique
✅ **Maintenabilité** : Nommage cohérent entre backend et frontend
✅ **Évolutivité** : Facile d'ajouter de nouveaux modules
✅ **Convention** : Suit les best practices (kebab-case pour URLs)
✅ **Découplage** : Frontend peut fonctionner avec n'importe quel module backend

---

## 🔍 Débogage

Pour voir les routes générées dans la console :

```tsx
import { generateAdminRoute } from '@/src/shared/utils/routeGenerator';

console.log(generateAdminRoute({
  module: 'your_module',
  name: 'your_name',
  menu: ''
}));
```

---

## 📝 Notes Importantes

1. **Menus parents sans route** : Si un menu est juste un parent (avec enfants), laissez `menu` et `name` vides, ou définissez `menu = "#"`

2. **Caractères spéciaux** : Évitez les caractères spéciaux dans `module` et `name`. Utilisez uniquement `a-z`, `0-9`, `_`

3. **URLs lisibles** : Privilégiez des noms courts et descriptifs :
   - ✅ `users_list` → `/admin/users-list`
   - ❌ `users_management_detailed_list_v2` → trop long

4. **Cohérence** : Gardez le même format de nommage dans tous vos modules backend

---

## 🎯 Résumé

```
Base de données:
┌────────┬────────────────────┬─────────────────────┬────────────┐
│ module │ name               │ menu                │ Résultat   │
├────────┼────────────────────┼─────────────────────┼────────────┤
│ ""     │ Dashboard          │ ""                  │ /admin/dashboard
│ users  │ list               │ ""                  │ /admin/users/list
│ users  │ list               │ /admin/users-all    │ /admin/users-all
└────────┴────────────────────┴─────────────────────┴────────────┘
```

La génération est **automatique**, **intelligente** et **flexible** ! 🚀
