'use client';

import { ReactNode, useEffect, useState } from 'react';
import { TenantProvider } from '@/src/shared/lib/tenant-context';
import { Sidebar } from '@/src/modules/MenuRegistry';
import { initializeModules } from '@/src/shared/lib/init-modules';
import { useAuth } from '@/src/modules/UsersGuard';
import { usePathname } from 'next/navigation';
import { getUserPermissions } from '@/src/shared/utils/permissions';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [modulesInitialized, setModulesInitialized] = useState(false);

  // Initialize modules on mount
  useEffect(() => {
    initializeModules();
    setModulesInitialized(true);
    console.log('Modules initialized in layout');
  }, []);

  // Hide sidebar on login page
  const isLoginPage = pathname === '/admin/login';

  // Get user permissions (extracts slugs from permissions and groups)
  const userPermissions = getUserPermissions(user);

  console.log('AdminLayout render:', {
    modulesInitialized,
    isLoginPage,
    userPermissions,
    pathname,
  });

  if (isLoginPage) {
    return (
      <TenantProvider>
        {children}
      </TenantProvider>
    );
  }

  // Wait for modules to initialize before showing sidebar
  if (!modulesInitialized) {
    return (
      <TenantProvider>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </TenantProvider>
    );
  }

  return (
    <TenantProvider>
      <div className="flex min-h-screen">
        <Sidebar userPermissions={userPermissions} />
        <main className="flex-1 bg-gray-100">
          {children}
        </main>
      </div>
    </TenantProvider>
  );
}