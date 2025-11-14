import { ModuleMenuConfig } from '@/src/shared/types/menu-config.types';

/**
 * UsersGuard Module Menu Configuration
 *
 * This file defines all menu items for the UsersGuard (Authentication) module.
 */
export const usersGuardMenuConfig: ModuleMenuConfig = {
  module: 'UsersGuard',
  menus: [
    {
      id: 'users',
      label: 'Users',
      icon: {
        type: 'emoji',
        value: '👥',
      },
      order: 10,
      module: 'UsersGuard',
      isVisible: true,
      isActive: true,
      children: [
        {
          id: 'users-list',
          label: 'User Management',
          route: '/admin/users',
          order: 1,
          module: 'UsersGuard',
          parentId: 'users',
          isVisible: true,
          isActive: true,
        },
        {
          id: 'users-roles',
          label: 'Roles & Permissions',
          route: '/admin/users/roles',
          order: 2,
          module: 'UsersGuard',
          parentId: 'users',
          isVisible: true,
          isActive: true,
        },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: {
        type: 'emoji',
        value: '⚙️',
      },
      order: 100,
      module: 'UsersGuard',
      isVisible: true,
      isActive: true,
      children: [
        {
          id: 'settings-auth',
          label: 'Authentication',
          route: '/admin/settings/auth',
          order: 1,
          module: 'UsersGuard',
          parentId: 'settings',
          isVisible: true,
          isActive: true,
        },
        {
          id: 'settings-password-policy',
          label: 'Password Policy',
          route: '/admin/settings/password-policy',
          order: 2,
          module: 'UsersGuard',
          parentId: 'settings',
          isVisible: true,
          isActive: true,
        },
        {
          id: 'settings-sessions',
          label: 'Sessions',
          route: '/admin/settings/sessions',
          order: 3,
          module: 'UsersGuard',
          parentId: 'settings',
          isVisible: true,
          isActive: true,
        },
      ],
    },
  ],
};
