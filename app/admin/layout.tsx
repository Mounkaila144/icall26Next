'use client';

import { ReactNode, useEffect, useState } from 'react';
import { TenantProvider } from '@/src/shared/lib/tenant-context';
import { LanguageProvider } from '@/src/shared/lib/language-context';
import { SidebarProvider, useSidebar } from '@/src/shared/lib/sidebar-context';
import { Sidebar } from '@/src/modules/Dashboard';
import { Navbar } from '@/src/shared/components/Navbar';
import { initializeModules } from '@/src/shared/lib/init-modules';
import { useAuth } from '@/src/modules/UsersGuard';
import { usePathname } from 'next/navigation';
import { getUserPermissions } from '@/src/shared/utils/permissions';

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isCollapsed } = useSidebar();
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
    return children;
  }

  // Wait for modules to initialize before showing sidebar
  if (!modulesInitialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Calculate sidebar width and margin
  const sidebarWidth = isCollapsed ? '80px' : '288px'; // 80px or w-72 (18rem = 288px)

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar with gradient background - Fixed position */}
      <aside
        className="shadow-2xl fixed left-0 top-0 h-screen z-40 transition-all duration-300"
        style={{
          width: sidebarWidth,
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

      {/* Main content area with Navbar - Dynamic left margin */}
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <Navbar />
        <main className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <TenantProvider>
      <LanguageProvider>
        <SidebarProvider>
          {isLoginPage ? (
            children
          ) : (
            <AdminLayoutContent>{children}</AdminLayoutContent>
          )}
        </SidebarProvider>
      </LanguageProvider>
    </TenantProvider>
  );
}