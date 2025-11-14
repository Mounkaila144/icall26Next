# Translation System - Usage Examples

## Philosophy

**Default Language: English**
- All text in your code is written in English
- Translations are only created for other languages (French, Arabic, etc.)
- No English translation files needed - the English text in your code IS the translation
- If a translation is not found, the system automatically falls back to the English text

## Setup

### 1. Wrap your app with LanguageProvider and TranslationProvider

In your root layout (`app/layout.tsx` or `app/admin/layout.tsx`):

```typescript
import { LanguageProvider } from '@/src/shared/lib/language-context';
import { TranslationProvider } from '@/src/shared/i18n';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <LanguageProvider>
          <TranslationProvider>
            {children}
          </TranslationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
```

## Usage Patterns

### 1. Using Global Translations

For shared translations across the entire app:

```typescript
'use client';

import { useTranslation } from '@/src/shared/i18n';

export function SaveButton() {
  const { t } = useTranslation(); // No module name = global only

  return (
    <button>
      {t('Save')} {/* EN: "Save" | FR: "Enregistrer" | AR: "حفظ" */}
    </button>
  );
}
```

### 2. Using Module-Specific Translations

For translations specific to a module with automatic fallback to global:

```typescript
'use client';

import { useTranslation } from '@/src/shared/i18n';

export function LoginForm() {
  const { t } = useTranslation('UsersGuard'); // Module name provided

  return (
    <div>
      <h1>{t('Login')}</h1> {/* Module: "Connexion" (FR) */}
      <button>{t('Cancel')}</button> {/* Fallback to global: "Annuler" (FR) */}
    </div>
  );
}
```

### 3. Using Translation Parameters

For dynamic translations with variables:

```typescript
'use client';

import { useTranslation } from '@/src/shared/i18n';

export function WelcomeMessage({ userName }: { userName: string }) {
  const { t } = useTranslation();

  return (
    <h1>
      {t('Welcome, {name}!', { name: userName })}
      {/* EN: "Welcome, John!" | FR: "Bienvenue, John!" */}
    </h1>
  );
}
```

### 4. Language Switcher

Add a language switcher to your UI:

```typescript
import { LanguageSwitcher } from '@/src/shared/components';

export function Header() {
  return (
    <header>
      <nav>
        {/* Your navigation */}
      </nav>
      <LanguageSwitcher />
    </header>
  );
}
```

### 5. Accessing Current Locale

```typescript
const { locale, setLocale } = useTranslation();

// Current locale
console.log(locale); // 'fr', 'en', or 'ar'

// Change locale programmatically
setLocale('fr');
```

## Creating Module Translations

### Step 1: Write Your Code in English

First, write your component with English text:

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

### Step 2: Create Translation Directory

```bash
mkdir -p src/modules/Products/translations
```

### Step 3: Create Translation Files (Only Non-English!)

Create `src/modules/Products/translations/fr.json`:

```json
{
  "Create Product": "Créer un produit",
  "Product created successfully": "Produit créé avec succès",
  "Product updated": "Produit mis à jour",
  "Product deleted": "Produit supprimé"
}
```

Create `src/modules/Products/translations/ar.json`:

```json
{
  "Create Product": "إنشاء منتج",
  "Product created successfully": "تم إنشاء المنتج بنجاح",
  "Product updated": "تم تحديث المنتج",
  "Product deleted": "تم حذف المنتج"
}
```

**Note:** No `en.json` file needed! The English text in your code is already the English translation.

### Step 4: Global Translations Fallback

Notice in the example above, `t('Save')` and `t('Cancel')` will automatically fall back to the global translations in `src/shared/i18n/translations/fr.json` since they're not in the module's translation file.

## Fallback Logic

The translation system follows this priority:

1. **English Check**: If locale is 'en', return the English text immediately (no file lookup)
2. **Module Translation**: Check `src/modules/{ModuleName}/translations/{locale}.json`
3. **Global Translation**: Check `src/shared/i18n/translations/{locale}.json`
4. **English Fallback**: Return the original English text if not found

Example:
```typescript
const { t } = useTranslation('UsersGuard');

// When locale is 'en':
t('Login')              // → "Login" (no file lookup)
t('Save')               // → "Save" (no file lookup)

// When locale is 'fr':
t('Login')              // → "Connexion" (from UsersGuard/translations/fr.json)
t('Save')               // → "Enregistrer" (from i18n/translations/fr.json)
t('Untranslated text')  // → "Untranslated text" (English fallback)
```

## Best Practices

### 1. Naming Conventions

**Use natural English sentences as keys:**

✅ Good:
```typescript
t('Save')
t('Create new product')
t('Are you sure you want to delete this item?')
t('Product created successfully')
```

❌ Bad:
```typescript
t('btn.save')
t('product.create.new')
t('confirm.delete.message')
```

### 2. Global vs Module Translations

**Use Global for:**
- Common UI labels: Save, Cancel, Delete, Edit, Add
- Navigation items: Home, Dashboard, Settings
- Generic errors and messages
- Shared validation messages

**Use Module for:**
- Feature-specific labels
- Module-specific errors
- Business logic messages
- Domain-specific terminology

### 3. Avoid Duplication

If a translation is used in multiple modules, add it to global translations:

```json
// ❌ Bad - duplicated in each module
// modules/Users/translations/fr.json
{ "Save": "Enregistrer" }

// modules/Products/translations/fr.json
{ "Save": "Enregistrer" }

// ✅ Good - in global translations
// shared/i18n/translations/fr.json
{ "Save": "Enregistrer" }
```

### 4. Parameter Naming

Use clear parameter names in curly braces:

```json
{
  "Hello {userName}, you have {count} messages": "Bonjour {userName}, vous avez {count} messages"
}
```

```typescript
t('Hello {userName}, you have {count} messages', { userName: 'Marie', count: 5 })
// EN: "Hello Marie, you have 5 messages"
// FR: "Bonjour Marie, vous avez 5 messages"
```

### 5. Keep Translations Consistent

Use the exact same English text throughout your app:

✅ Good:
```typescript
// All components use the same English text
t('Save')
t('Save')
t('Save')
```

❌ Bad:
```typescript
// Different variations - each needs separate translation
t('Save')
t('Save changes')
t('Save data')
```

## Complete Example

### Component with English Text

```typescript
'use client';

import { useTranslation } from '@/src/shared/i18n';
import { useState } from 'react';

export function ProductForm() {
  const { t } = useTranslation('Products');
  const [name, setName] = useState('');

  const handleSubmit = () => {
    // Save product...
    alert(t('Product created successfully'));
  };

  return (
    <div>
      <h1>{t('Create Product')}</h1>
      <p>{t('Fill in the form below to create a new product')}</p>

      <label>
        {t('Product Name')}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('Enter product name')}
        />
      </label>

      {!name && <span>{t('This field is required')}</span>}

      <button onClick={handleSubmit}>{t('Save')}</button>
      <button>{t('Cancel')}</button>
    </div>
  );
}
```

### Module Translations (French)

`src/modules/Products/translations/fr.json`:
```json
{
  "Create Product": "Créer un produit",
  "Fill in the form below to create a new product": "Remplissez le formulaire ci-dessous pour créer un nouveau produit",
  "Product Name": "Nom du produit",
  "Enter product name": "Entrez le nom du produit",
  "Product created successfully": "Produit créé avec succès"
}
```

**Note:**
- `Save`, `Cancel`, and `This field is required` are NOT in this file
- They automatically fall back to global translations
- No `en.json` file needed!

## Troubleshooting

### Translation not updating after language change

The component should re-render automatically. If not, ensure:
1. Component is wrapped in both `LanguageProvider` and `TranslationProvider`
2. Using `'use client'` directive in the component
3. Translation files are properly formatted JSON

### Translation returns English text when I expect French

This is normal if:
1. The translation doesn't exist in the JSON file (intended fallback behavior)
2. You're testing with locale set to 'en'
3. Translation files haven't loaded yet (they should load quickly)

To debug:
```typescript
const { t, locale } = useTranslation('ModuleName');
console.log('Current locale:', locale);
console.log('Translation:', t('Your Text'));
```

### Module translations not loading

Ensure:
1. Module name matches the directory name exactly (case-sensitive)
2. Translation files are in the correct location: `src/modules/{ModuleName}/translations/`
3. Only create `fr.json` and `ar.json` files (no `en.json` needed)
4. Module name is passed to `useTranslation('ModuleName')`

## Supported Languages

- **English (en)**: Default language, no translation files needed
- **French (fr)**: Français - Create `fr.json` files
- **Arabic (ar)**: العربية - Create `ar.json` files
