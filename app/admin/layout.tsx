'use client';

import { ReactNode, useEffect, useState } from 'react';
import { TenantProvider } from '@/src/shared/lib/tenant-context';
import { LanguageProvider } from '@/src/shared/lib/language-context';
import { SidebarProvider, useSidebar } from '@/src/shared/lib/sidebar-context';
import { PermissionsProvider } from '@/src/shared/contexts/PermissionsContext';
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

  // Debug: Track component lifecycle
  useEffect(() => {
    const mountId = Math.random().toString(36).substr(2, 9);
    console.log(`🟢 [AdminLayoutContent] MOUNTED - ID: ${mountId}`);

    return () => {
      console.log(`🔴 [AdminLayoutContent] UNMOUNTED - ID: ${mountId}`);
    };
  }, []);

  // Initialize modules on mount
  useEffect(() => {
    console.log('🔧 [AdminLayoutContent] Initializing modules...');
    initializeModules();
    setModulesInitialized(true);
    console.log('✅ [AdminLayoutContent] Modules initialized');
  }, []);

  // Track pathname changes
  useEffect(() => {
    console.log('🔀 [AdminLayoutContent] Pathname changed:', pathname);
  }, [pathname]);

  // Hide sidebar on login page
  const isLoginPage = pathname === '/admin/login';

  // Get user permissions (extracts slugs from permissions and groups)
  const userPermissions = getUserPermissions(user);

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

  // Debug: Detect full page reloads
  useEffect(() => {
    // Generate a unique session ID on mount
    if (typeof window !== 'undefined') {
      // Track mount count
      const mountCount = parseInt(window.sessionStorage.getItem('mount_count') || '0') + 1;
      window.sessionStorage.setItem('mount_count', mountCount.toString());

      const currentSessionId = window.sessionStorage.getItem('app_session_id');

      if (!currentSessionId) {
        const sessionId = Math.random().toString(36).substr(2, 9);
        window.sessionStorage.setItem('app_session_id', sessionId);
        window.sessionStorage.setItem('page_load_time', new Date().toISOString());
        console.log('🆕 [AdminLayout] NEW PAGE LOAD - Session ID:', sessionId, '- Time:', new Date().toISOString());
      } else {
        const pageLoadTime = window.sessionStorage.getItem('page_load_time');
        const timeSinceLoad = pageLoadTime ? ((Date.now() - new Date(pageLoadTime).getTime()) / 1000).toFixed(2) : 'unknown';
        console.log(`♻️ [AdminLayout] REACT RE-RENDER #${mountCount} - Session ID:`, currentSessionId, `- ${timeSinceLoad}s since page load`);
      }

      // Alert if too many mounts
      if (mountCount > 10) {
        console.error('🚨 [AdminLayout] TOO MANY MOUNTS! This is likely an infinite loop bug!');
      }

      // Track beforeunload (page is about to reload/close)
      const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
        console.error('🔄 [AdminLayout] PAGE IS ABOUT TO RELOAD/CLOSE!');
        console.trace('Stack trace:');
      };
      window.addEventListener('beforeunload', beforeUnloadHandler);

      // Track unload (page is reloading)
      const unloadHandler = () => {
        console.error('🚪 [AdminLayout] PAGE IS UNLOADING (RELOAD CONFIRMED)!');
      };
      window.addEventListener('unload', unloadHandler);

      // Track unhandled errors
      const errorHandler = (event: ErrorEvent) => {
        console.error('💥 [AdminLayout] UNHANDLED ERROR:', event.error);
        console.error('💥 Error message:', event.message);
        console.error('💥 Error stack:', event.error?.stack);
        console.error('💥 This error might cause a page reload!');
      };

      const rejectionHandler = (event: PromiseRejectionEvent) => {
        console.error('💥 [AdminLayout] UNHANDLED PROMISE REJECTION:', event.reason);
        console.error('💥 This might cause a page reload!');
      };

      window.addEventListener('error', errorHandler);
      window.addEventListener('unhandledrejection', rejectionHandler);

      // Track page visibility changes
      const visibilityHandler = () => {
        console.log('👁️ [AdminLayout] Page visibility:', document.visibilityState);
      };
      document.addEventListener('visibilitychange', visibilityHandler);

      // Track navigation (popstate)
      const popstateHandler = (event: PopStateEvent) => {
        console.log('⬅️ [AdminLayout] POPSTATE (back/forward button):', event.state);
      };
      window.addEventListener('popstate', popstateHandler);

      // Track hashchange
      const hashchangeHandler = () => {
        console.log('🔗 [AdminLayout] HASH CHANGED:', window.location.hash);
      };
      window.addEventListener('hashchange', hashchangeHandler);

      const mountId = Math.random().toString(36).substr(2, 9);
      console.log(`🟢 [AdminLayout] ROOT MOUNTED - ID: ${mountId}`);

      return () => {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        window.removeEventListener('unload', unloadHandler);
        window.removeEventListener('error', errorHandler);
        window.removeEventListener('unhandledrejection', rejectionHandler);
        document.removeEventListener('visibilitychange', visibilityHandler);
        window.removeEventListener('popstate', popstateHandler);
        window.removeEventListener('hashchange', hashchangeHandler);
        console.log(`🔴 [AdminLayout] ROOT UNMOUNTED - ID: ${mountId}`);
      };
    }
  }, []);

  return (
    <TenantProvider>
      <PermissionsProvider>
        <LanguageProvider>
          <SidebarProvider>
            {isLoginPage ? (
              children
            ) : (
              <AdminLayoutContent>{children}</AdminLayoutContent>
            )}
          </SidebarProvider>
        </LanguageProvider>
      </PermissionsProvider>
    </TenantProvider>
  );
}