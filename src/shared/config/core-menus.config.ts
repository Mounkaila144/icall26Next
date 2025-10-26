import { ModuleMenuConfig } from '@/src/modules/MenuRegistry';

/**
 * Core application menus
 * These are application-wide menus not specific to any module
 */
export const coreMenusConfig: ModuleMenuConfig = {
  module: 'Core',

  menuItems: [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      path: '/admin/dashboard',
      icon: {
        type: 'emoji',
        value: '🏠',
      },
      order: 1,
      module: 'Core',
      // No permission required - everyone can see dashboard
    },
    {
      id: 'settings',
      label: 'Paramètres',
      path: '/admin/settings',
      icon: {
        type: 'emoji',
        value: '⚙️',
      },
      order: 1000, // Apparaît en dernier
      module: 'Core',
      // No permission required for now
      // permission: ['settings.view'],
    },
  ],
};
