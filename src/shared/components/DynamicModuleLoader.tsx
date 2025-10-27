'use client';

import React, { useEffect, useState, ComponentType } from 'react';
import dynamic from 'next/dynamic';
import { toPascalCase, removeNumericPrefix } from '../utils/menu-route-generator';

interface DynamicModuleLoaderProps {
  slug: string[];
}

/**
 * DynamicModuleLoader Component
 *
 * Dynamically loads and renders module components based on the URL slug.
 * Transforms kebab-case URLs to PascalCase module/component names.
 *
 * Examples:
 *   Slug: ['customers-contracts', 'contracts-list1']
 *   → Module: CustomersContracts
 *   → Component: ContractsList1
 *   → Import: @/src/modules/CustomersContracts/admin/components/ContractsList1
 *
 *   Slug: ['products-installer-communication', 'products-installer-communication']
 *   → Module: ProductsInstallerCommunication
 *   → Component: ProductsInstallerCommunication
 */
export function DynamicModuleLoader({ slug }: DynamicModuleLoaderProps) {
  const [Component, setComponent] = useState<ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadComponent() {
      try {
        setIsLoading(true);
        setError(null);

        // Convert slug to module and component names
        const { moduleName, componentName, importPath } = transformSlugToModule(slug);

        console.log('🔍 Dynamic Module Loading:', {
          slug,
          moduleName,
          componentName,
          importPath,
        });

        // Dynamically import the component
        const module = await import(
          `@/src/modules/${moduleName}/admin/components/${componentName}.tsx`
        );

        // Get the default or named export
        const LoadedComponent = module.default || module[componentName];

        if (!LoadedComponent) {
          throw new Error(
            `Component "${componentName}" not found in module "${moduleName}"`
          );
        }

        setComponent(() => LoadedComponent);
      } catch (err: any) {
        console.error('❌ Failed to load dynamic component:', err);
        setError(err.message || 'Failed to load module');
      } finally {
        setIsLoading(false);
      }
    }

    loadComponent();
  }, [slug]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} slug={slug} />;
  }

  if (!Component) {
    return <NotFoundState slug={slug} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Component />
    </div>
  );
}

/**
 * Transform slug array to module information
 */
function transformSlugToModule(slug: string[]) {
  if (slug.length === 0) {
    throw new Error('Invalid slug: empty array');
  }

  // Case 1: Single segment (e.g., ['dashboard'])
  if (slug.length === 1) {
    const componentName = toPascalCase(slug[0].replace(/-/g, '_'));
    return {
      moduleName: componentName,
      componentName: componentName,
      importPath: `@/src/modules/${componentName}/admin/components/${componentName}`,
    };
  }

  // Case 2: Two segments (e.g., ['customers-contracts', 'contracts-list1'])
  // First segment is the module, second is the component
  const moduleName = toPascalCase(slug[0].replace(/-/g, '_'));
  const componentName = toPascalCase(slug[1].replace(/-/g, '_'));

  return {
    moduleName,
    componentName,
    importPath: `@/src/modules/${moduleName}/admin/components/${componentName}`,
  };
}

/**
 * Loading state component
 */
function LoadingState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p style={{ color: '#666', fontSize: '16px', fontWeight: '500' }}>
        Loading module...
      </p>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Error state component
 */
function ErrorState({ error, slug }: { error: string; slug: string[] }) {
  const { moduleName, componentName, importPath } = transformSlugToModule(slug);

  return (
    <div
      style={{
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '12px 12px 0 0',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>
          ⚠️ Module Not Found
        </h1>
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          padding: '24px',
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '8px' }}>
            The requested module could not be loaded.
          </p>
          <p
            style={{
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              padding: '12px',
              color: '#c33',
              fontSize: '14px',
              fontFamily: 'monospace',
            }}
          >
            {error}
          </p>
        </div>

        <div
          style={{
            background: '#f9f9f9',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#333' }}>
            Debugging Information:
          </h3>
          <table style={{ width: '100%', fontSize: '14px' }}>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: '8px',
                    color: '#666',
                    fontWeight: '600',
                    width: '150px',
                  }}
                >
                  URL Slug:
                </td>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>
                  {slug.join(' / ')}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', color: '#666', fontWeight: '600' }}>
                  Module Name:
                </td>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>
                  {moduleName}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', color: '#666', fontWeight: '600' }}>
                  Component Name:
                </td>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>
                  {componentName}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', color: '#666', fontWeight: '600' }}>
                  Import Path:
                </td>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>
                  {importPath}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          style={{
            background: '#e7f3ff',
            border: '1px solid #b3d9ff',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <h3
            style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              color: '#0066cc',
              fontWeight: '600',
            }}
          >
            💡 How to Fix:
          </h3>
          <ol style={{ margin: 0, paddingLeft: '20px', color: '#333' }}>
            <li style={{ marginBottom: '8px' }}>
              Ensure the module exists at:{' '}
              <code
                style={{
                  background: '#fff',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}
              >
                src/modules/{moduleName}/
              </code>
            </li>
            <li style={{ marginBottom: '8px' }}>
              Ensure the component exists at:{' '}
              <code
                style={{
                  background: '#fff',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}
              >
                src/modules/{moduleName}/admin/components/{componentName}.tsx
              </code>
            </li>
            <li style={{ marginBottom: '8px' }}>
              Ensure the component exports a default export or named export
            </li>
            <li>Check that the file name matches exactly (case-sensitive)</li>
          </ol>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <a
            href="/admin/dashboard"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            }}
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Not found state component
 */
function NotFoundState({ slug }: { slug: string[] }) {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <div style={{ fontSize: '72px', marginBottom: '16px' }}>🔍</div>
      <h1 style={{ fontSize: '32px', marginBottom: '12px', color: '#333' }}>
        Page Not Found
      </h1>
      <p style={{ color: '#666', fontSize: '16px', marginBottom: '24px' }}>
        The page <strong>/{slug.join('/')}</strong> does not exist.
      </p>
      <a
        href="/admin/dashboard"
        style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
        }}
      >
        ← Back to Dashboard
      </a>
    </div>
  );
}
