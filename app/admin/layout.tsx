'use client';

import { ReactNode, useEffect, useState } from 'react';
import { TenantProvider } from '@/src/shared/lib/tenant-context';
import { LanguageProvider } from '@/src/shared/lib/language-context';
import { Sidebar } from '@/src/modules/Dashboard';
import { Navbar } from '@/src/shared/components/Navbar';
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
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </TenantProvider>
    );
  }

  // Wait for modules to initialize before showing sidebar
  if (!modulesInitialized) {
    return (
      <TenantProvider>
        <LanguageProvider>
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </LanguageProvider>
      </TenantProvider>
    );
  }

  return (
    <TenantProvider>
      <LanguageProvider>
        <div className="flex min-h-screen bg-slate-50">
          {/* Sidebar with gradient background */}
          <aside
            className="w-72 shadow-2xl relative"
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
              borderRight: '1px solid rgba(226, 232, 240, 0.8)',
            }}
          >
            {/* Decorative gradient overlay */}
            <div
              className="absolute top-0 left-0 w-full h-32 opacity-30 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                filter: 'blur(40px)',
              }}
            />
            <Sidebar />
          </aside>

          {/* Main content area with Navbar */}
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </LanguageProvider>
    </TenantProvider>
  );
}