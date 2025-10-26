// Components
export { default as Sidebar } from './admin/components/Sidebar';
export { default as SettingsMenu } from './admin/components/SettingsMenu';

// Hooks
export { useMenu, useMenuItem, useSettingsItem } from './admin/hooks/useMenu';

// Services
export { menuRegistryService } from './admin/services/menuRegistryService';

// Types
export type {
  MenuItem,
  SettingsMenuItem,
  MenuIcon,
  MenuPermission,
  ModuleMenuConfig,
  MenuRegistryState,
  UserPermissions,
} from './types/menu.types';
