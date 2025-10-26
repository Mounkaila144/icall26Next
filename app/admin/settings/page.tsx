'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/modules/UsersGuard';
import { SettingsMenu } from '@/src/modules/MenuRegistry';
import { getUserPermissions } from '@/src/shared/utils/permissions';

export default function SettingsPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const userPermissions = getUserPermissions(user);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Paramètres</h1>

          <div className="bg-white shadow rounded-lg p-6">
            <SettingsMenu
              userPermissions={userPermissions}
              variant="grid"
              showCategories={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
