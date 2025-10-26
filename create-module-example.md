
 Creating a New Module - Step by Step Example

This guide shows you how to create a new module called "Users" for managing users in the admin panel.

## Step 1: Create Directory Structure

```bash
# Windows PowerShell
mkdir src\modules\Users\admin\components
mkdir src\modules\Users\admin\hooks
mkdir src\modules\Users\admin\services
mkdir src\modules\Users\admin\utils
mkdir src\modules\Users\types

# Linux/Mac
mkdir -p src/modules/Users/{admin/{components,hooks,services,utils},types}
```

## Step 2: Create Types

Create `src/modules/Users/types/users.types.ts`:

```typescript
export interface User {
  user_id: number;
  user_login: string;
  user_email: string;
  user_firstname?: string;
  user_lastname?: string;
  user_active: 'YES' | 'NO';
  group_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserData {
  user_login: string;
  user_email: string;
  user_password: string;
  user_firstname?: string;
  user_lastname?: string;
  group_id?: number;
}

export interface UpdateUserData extends Partial<CreateUserData> {
  user_id: number;
}

export interface UsersListResponse {
  data: User[];
  total: number;
  current_page: number;
  last_page: number;
}
```

## Step 3: Create Service

Create `src/modules/Users/admin/services/usersService.ts`:

```typescript
import { createApiClient } from '@/src/shared/lib/api-client';
import { User, CreateUserData, UpdateUserData, UsersListResponse } from '../../types/users.types';
import { ApiResponse } from '@/src/shared/types/api.types';

class UsersService {
  /**
   * Get all users
   */
  async getUsers(tenantId?: string, page = 1): Promise<UsersListResponse> {
    const client = createApiClient(tenantId);
    const response = await client.get<ApiResponse<UsersListResponse>>(
      `/admin/users?page=${page}`
    );
    return response.data.data;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number, tenantId?: string): Promise<User> {
    const client = createApiClient(tenantId);
    const response = await client.get<ApiResponse<User>>(`/admin/users/${userId}`);
    return response.data.data;
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserData, tenantId?: string): Promise<User> {
    const client = createApiClient(tenantId);
    const response = await client.post<ApiResponse<User>>('/admin/users', data);
    return response.data.data;
  }

  /**
   * Update user
   */
  async updateUser(data: UpdateUserData, tenantId?: string): Promise<User> {
    const client = createApiClient(tenantId);
    const response = await client.put<ApiResponse<User>>(
      `/admin/users/${data.user_id}`,
      data
    );
    return response.data.data;
  }

  /**
   * Delete user
   */
  async deleteUser(userId: number, tenantId?: string): Promise<void> {
    const client = createApiClient(tenantId);
    await client.delete(`/admin/users/${userId}`);
  }
}

export const usersService = new UsersService();
```

## Step 4: Create Hook

Create `src/modules/Users/admin/hooks/useUsers.ts`:

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/src/shared/lib/tenant-context';
import { usersService } from '../services/usersService';
import { User } from '../../types/users.types';

export const useUsers = () => {
  const { tenantId } = useTenant();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await usersService.getUsers(tenantId || undefined, page);
      setUsers(response.data);
      setCurrentPage(response.current_page);
      setTotalPages(response.last_page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [fetchUsers, currentPage]);

  const deleteUser = useCallback(async (userId: number) => {
    try {
      await usersService.deleteUser(userId, tenantId || undefined);
      // Refresh the list
      await fetchUsers(currentPage);
    } catch (err) {
      throw err;
    }
  }, [tenantId, currentPage, fetchUsers]);

  return {
    users,
    loading,
    error,
    currentPage,
    totalPages,
    fetchUsers,
    deleteUser,
    goToPage: setCurrentPage,
  };
};
```

## Step 5: Create Component

Create `src/modules/Users/admin/components/UsersList.tsx`:

```typescript
'use client';

import { useUsers } from '../hooks/useUsers';

export default function UsersList() {
  const { users, loading, error, currentPage, totalPages, goToPage, deleteUser } = useUsers();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  const handleDelete = async (userId: number, userName: string) => {
    if (confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await deleteUser(userId);
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Users List</h3>
      </div>
      <div className="border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.user_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.user_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.user_login}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.user_email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.user_active === 'YES'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.user_active === 'YES' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDelete(user.user_id, user.user_login)}
                    className="text-red-600 hover:text-red-900 ml-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Step 6: Create Barrel Export

Create `src/modules/Users/index.ts`:

```typescript
// Admin exports
export { default as UsersList } from './admin/components/UsersList';
export { useUsers } from './admin/hooks/useUsers';
export { usersService } from './admin/services/usersService';

// Types
export type {
  User,
  CreateUserData,
  UpdateUserData,
  UsersListResponse,
} from './types/users.types';
```

## Step 7: Create Page

Create `app/admin/users/page.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/modules/UsersGuard';
import { UsersList } from '@/src/modules/Users';

export default function UsersPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Users Management</h1>
          <UsersList />
        </div>
      </div>
    </div>
  );
}
```

## Step 8: Test Your Module

1. Start the development server:
```bash
npm run dev
```

2. Navigate to:
```
http://localhost:3000/admin/users
```

3. You should see the users list with pagination and delete functionality.

## Module Checklist

- ✅ Types defined in `types/`
- ✅ Service created in `admin/services/`
- ✅ Hook created in `admin/hooks/`
- ✅ Component created in `admin/components/`
- ✅ Barrel export in `index.ts`
- ✅ Page created in `app/admin/`
- ✅ Uses `useTenant()` for multi-tenancy
- ✅ Uses `createApiClient()` for API calls
- ✅ Implements loading and error states
- ✅ TypeScript types for all data

## Best Practices Applied

1. **Separation of Concerns**: Service → Hook → Component
2. **Type Safety**: All data is typed
3. **Error Handling**: Try-catch in services and hooks
4. **Loading States**: User feedback during async operations
5. **Multi-tenancy**: Tenant ID passed to all API calls
6. **Reusability**: Hook can be used in multiple components
7. **Clean API**: Barrel export exposes only public interface

## Next Steps

You can extend this module by adding:
- Create user form
- Edit user form
- Search and filtering
- Sorting
- Bulk actions
- Export to CSV
- User permissions management