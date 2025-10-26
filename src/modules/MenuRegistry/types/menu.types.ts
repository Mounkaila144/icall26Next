/**
 * Permission for menu visibility
 */
export interface MenuPermission {
  /**
   * Permission key (e.g., 'users.view', 'settings.manage')
   */
  key: string;

  /**
   * Optional: Require all permissions or any permission
   * @default 'all'
   */
  mode?: 'all' | 'any';
}

/**
 * Menu item icon configuration
 */
export interface MenuIcon {
  /**
   * Icon type (can be extended for different icon libraries)
   */
  type: 'svg' | 'emoji' | 'icon-class';

  /**
   * Icon value (SVG path, emoji character, or CSS class)
   */
  value: string;
}

/**
 * Main menu item (appears in sidebar/navigation)
 */
export interface MenuItem {
  /**
   * Unique identifier for the menu item
   */
  id: string;

  /**
   * Display label
   */
  label: string;

  /**
   * Route path (e.g., '/admin/users')
   */
  path: string;

  /**
   * Icon configuration
   */
  icon?: MenuIcon;

  /**
   * Display order (lower numbers appear first)
   */
  order: number;

  /**
   * Module that registered this menu
   */
  module: string;

  /**
   * Permission required to view this menu
   */
  permission?: MenuPermission | string[];

  /**
   * Badge to display (e.g., notification count)
   */
  badge?: {
    value: string | number;
    variant?: 'primary' | 'success' | 'warning' | 'danger';
  };
}

/**
 * Settings submenu item (appears in settings page)
 */
export interface SettingsMenuItem {
  /**
   * Unique identifier for the settings item
   */
  id: string;

  /**
   * Display label
   */
  label: string;

  /**
   * Description of what this setting does
   */
  description?: string;

  /**
   * Route path (e.g., '/admin/settings/general')
   */
  path: string;

  /**
   * Icon configuration
   */
  icon?: MenuIcon;

  /**
   * Display order within settings
   */
  order: number;

  /**
   * Category for grouping settings
   */
  category?: string;

  /**
   * Module that registered this setting
   */
  module: string;

  /**
   * Permission required to view this setting
   */
  permission?: MenuPermission | string[];
}

/**
 * Menu configuration for a module
 */
export interface ModuleMenuConfig {
  /**
   * Module identifier
   */
  module: string;

  /**
   * Main menu items
   */
  menuItems?: MenuItem[];

  /**
   * Settings submenu items
   */
  settingsItems?: SettingsMenuItem[];
}

/**
 * Menu registry state
 */
export interface MenuRegistryState {
  /**
   * All registered menu items
   */
  menuItems: MenuItem[];

  /**
   * All registered settings items
   */
  settingsItems: SettingsMenuItem[];

  /**
   * Loading state
   */
  isLoading: boolean;
}

/**
 * User permissions
 */
export interface UserPermissions {
  /**
   * List of permission keys the user has
   */
  permissions: string[];

  /**
   * Check if user has a specific permission
   */
  hasPermission: (permission: string | string[] | MenuPermission) => boolean;
}
