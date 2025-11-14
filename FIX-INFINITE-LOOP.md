# Fix: Infinite Loop in AdminLayout

## Problem
The AdminLayout was mounting more than 10 times, indicating an infinite re-render loop.

Error:
```
🚨 [AdminLayout] TOO MANY MOUNTS! This is likely an infinite loop bug!
```

## Root Causes

### 1. Missing TranslationProvider in Layout
**Issue**: The `TranslationProvider` was not included in the admin layout, but components were using `useTranslation()`.

**Fix**: Added `TranslationProvider` to admin layout hierarchy:
```typescript
// app/admin/layout.tsx
<LanguageProvider>
  <TranslationProvider>  {/* ✅ Added */}
    <SidebarProvider>
      {children}
    </SidebarProvider>
  </TranslationProvider>
</LanguageProvider>
```

**File**: `app/admin/layout.tsx` (line 6, 200)

### 2. Unnecessary Page Reload on Language Change
**Issue**: The `LanguageSwitcher` was calling `window.location.reload()` on every language change, causing full page reloads and potential loops.

**Fix**: Removed `window.location.reload()` as the translation system now updates automatically via React Context:
```typescript
// Before
const handleChange = (e) => {
  setLanguage(e.target.value);
  window.location.reload(); // ❌ Removed
};

// After
const handleChange = (e) => {
  setLanguage(e.target.value);
  // ✅ No reload needed - translations update automatically
};
```

**File**: `src/shared/components/LanguageSwitcher.tsx` (line 19-22)

### 3. Debug Console Logs
**Issue**: Debug `console.log` statements in `LanguageProvider` were executing on every render, creating noise and potentially affecting performance.

**Fix**: Removed debug console.logs:
```typescript
// Before
const setLanguage = useCallback((lang: string) => {
  console.log('🌍 [LanguageProvider] setLanguage called:', lang); // ❌ Removed
  setLanguageState(lang);
  localStorage.setItem('app_language', lang);
}, []);

console.log('🔁 [LanguageProvider] Rendering with language:', language); // ❌ Removed

// After
const setLanguage = useCallback((lang: string) => {
  setLanguageState(lang);
  localStorage.setItem('app_language', lang);
}, []); // ✅ Clean
```

**File**: `src/shared/lib/language-context.tsx` (line 26-35)

## How the Translation System Now Works

### Provider Hierarchy
```
TenantProvider
└── PermissionsProvider
    └── LanguageProvider (manages current language)
        └── TranslationProvider (provides translation context)
            └── SidebarProvider
                └── App Components
```

### Translation Flow
1. User changes language via `LanguageSwitcher`
2. `setLanguage()` updates `language` state in `LanguageProvider`
3. `language` is persisted to `localStorage.app_language`
4. `TranslationProvider` detects language change
5. All components using `useTranslation()` automatically re-render with new translations
6. **No page reload needed!** ✅

### API Integration
The API client automatically adds the `Accept-Language` header:
```typescript
// src/shared/lib/api-client.ts
const locale = getCurrentLocale(); // Reads from localStorage
config.headers['Accept-Language'] = locale; // 'fr', 'en', or 'ar'
```

This ensures the backend receives the correct language in a simple format (not `fr_FR,fr;q=0.9`).

## Testing the Fix

1. **Clear cache**: Clear browser cache and sessionStorage
2. **Reload page**: Refresh the application
3. **Check mount count**: Should see only 1-2 mounts in console
4. **Change language**: Switch language - should update instantly without page reload
5. **Verify translations**: Check that text updates correctly in all components

## Files Modified

| File | Changes |
|------|---------|
| `app/admin/layout.tsx` | Added `TranslationProvider` import and wrapper |
| `src/shared/components/LanguageSwitcher.tsx` | Removed `window.location.reload()` |
| `src/shared/lib/language-context.tsx` | Removed debug console.logs |

## Prevention

To avoid similar issues in the future:

1. **Always wrap with TranslationProvider** when using `useTranslation()`
2. **Avoid page reloads** when using React Context for state management
3. **Remove debug logs** before committing to production
4. **Test provider hierarchy** - ensure all providers are in the correct order
5. **Monitor mount counts** - the debug code in AdminLayout will alert if mounts > 10

## Related Documentation

- `CLAUDE.md` - Section "Internationalization (i18n)"
- `TRANSLATION_EXAMPLE.md` - Complete translation usage guide
- `src/shared/i18n/README.md` - Quick reference
