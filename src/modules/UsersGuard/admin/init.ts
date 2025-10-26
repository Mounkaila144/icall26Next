import { menuRegistryService } from '@/src/modules/MenuRegistry';
import { usersGuardMenuConfig } from './config/menu.config';

/**
 * Initialize UsersGuard module
 * Register menus and settings
 */
export const initUsersGuardModule = () => {
  // Register menus
  menuRegistryService.registerModule(usersGuardMenuConfig);

  // You can add other initialization logic here
  // e.g., register event listeners, validators, etc.
};
