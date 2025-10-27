'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { DynamicModuleLoader } from '@/src/shared/components/DynamicModuleLoader';

/**
 * Dynamic Admin Route Handler
 *
 * This page handles all dynamic admin routes based on the menu structure from the database.
 * Routes follow the pattern: /admin/[module]/[component]
 *
 * Examples:
 *   /admin/customers-contracts/contracts-list1
 *   /admin/products-installer-communication/products-installer-communication
 *   /admin/customers-contracts-state/contracts
 */
export default function DynamicAdminPage() {
  const params = useParams();
  const slug = params.slug as string[];

  if (!slug || slug.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Page Not Found</h1>
        <p>The requested page does not exist.</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <DynamicModuleLoader slug={slug} />
    </Suspense>
  );
}

/**
 * Loading fallback component
 */
function LoadingFallback() {
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
      <p style={{ color: '#666', fontSize: '16px' }}>Loading module...</p>
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
