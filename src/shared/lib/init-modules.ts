/**
 * Global module initialization
 * This file registers all modules and their menus
 */

import { menuRegistryService } from '@/src/modules/MenuRegistry';
import { coreMenusConfig } from '@/src/shared/config/core-menus.config';
import { initUsersGuardModule } from '@/src/modules/UsersGuard';

/**
 * Initialize all application modules
 * Call this once at application startup
 */
export const initializeModules = () => {
  // Register core menus (Dashboard, Settings, etc.)
  menuRegistryService.registerModule(coreMenusConfig);

  // Initialize UsersGuard module
  initUsersGuardModule();

  // Add other module initializations here
  // Example:
  // initProductsModule();
  // initOrdersModule();
  // etc.

  console.log('All modules initialized successfully');
};
