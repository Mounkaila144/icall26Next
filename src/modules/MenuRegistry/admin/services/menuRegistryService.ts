import {
  MenuItem,
  SettingsMenuItem,
  ModuleMenuConfig,
  MenuPermission,
  UserPermissions,
} from '../../types/menu.types';

/**
 * Menu Registry Service
 * Centralized service for managing all menu items across modules
 */
class MenuRegistryService {
  private menuItems: MenuItem[] = [];
  private settingsItems: SettingsMenuItem[] = [];
  private modules: Set<string> = new Set();

  /**
   * Register menus from a module
   */
  registerModule(config: ModuleMenuConfig): void {
    // Prevent duplicate registration
    if (this.modules.has(config.module)) {
      console.warn(`Module "${config.module}" is already registered. Skipping.`);
      return;
    }

    this.modules.add(config.module);

    // Register menu items
    if (config.menuItems) {
      config.menuItems.forEach((item) => {
        this.menuItems.push({
          ...item,
          module: config.module,
        });
      });
    }

    // Register settings items
    if (config.settingsItems) {
      config.settingsItems.forEach((item) => {
        this.settingsItems.push({
          ...item,
          module: config.module,
        });
      });
    }

    // Sort items by order
    this.menuItems.sort((a, b) => a.order - b.order);
    this.settingsItems.sort((a, b) => a.order - b.order);
  }

  /**
   * Unregister a module's menus
   */
  unregisterModule(moduleName: string): void {
    this.modules.delete(moduleName);
    this.menuItems = this.menuItems.filter((item) => item.module !== moduleName);
    this.settingsItems = this.settingsItems.filter((item) => item.module !== moduleName);
  }

  /**
   * Get all menu items
   */
  getAllMenuItems(): MenuItem[] {
    return [...this.menuItems];
  }

  /**
   * Get menu items filtered by user permissions
   */
  getMenuItemsForUser(userPermissions: UserPermissions): MenuItem[] {
    return this.menuItems.filter((item) => {
      if (!item.permission) return true;
      return userPermissions.hasPermission(item.permission);
    });
  }

  /**
   * Get all settings items
   */
  getAllSettingsItems(): SettingsMenuItem[] {
    return [...this.settingsItems];
  }

  /**
   * Get settings items filtered by user permissions
   */
  getSettingsItemsForUser(userPermissions: UserPermissions): SettingsMenuItem[] {
    return this.settingsItems.filter((item) => {
      if (!item.permission) return true;
      return userPermissions.hasPermission(item.permission);
    });
  }

  /**
   * Get settings items grouped by category
   */
  getSettingsItemsByCategory(userPermissions?: UserPermissions): Record<string, SettingsMenuItem[]> {
    const items = userPermissions
      ? this.getSettingsItemsForUser(userPermissions)
      : this.getAllSettingsItems();

    return items.reduce((acc, item) => {
      const category = item.category || 'General';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, SettingsMenuItem[]>);
  }

  /**
   * Get a menu item by ID
   */
  getMenuItemById(id: string): MenuItem | undefined {
    return this.menuItems.find((item) => item.id === id);
  }

  /**
   * Get a settings item by ID
   */
  getSettingsItemById(id: string): SettingsMenuItem | undefined {
    return this.settingsItems.find((item) => item.id === id);
  }

  /**
   * Check if a permission is granted
   */
  checkPermission(
    userPermissions: string[],
    required: MenuPermission | string[] | undefined
  ): boolean {
    if (!required) return true;

    // Handle string array format
    if (Array.isArray(required)) {
      return required.every((perm) => userPermissions.includes(perm));
    }

    // Handle MenuPermission object format
    const permissions = Array.isArray(required.key) ? required.key : [required.key];
    const mode = required.mode || 'all';

    if (mode === 'all') {
      return permissions.every((perm) => userPermissions.includes(perm));
    } else {
      return permissions.some((perm) => userPermissions.includes(perm));
    }
  }

  /**
   * Reset the registry (useful for testing)
   */
  reset(): void {
    this.menuItems = [];
    this.settingsItems = [];
    this.modules.clear();
  }

  /**
   * Get all registered modules
   */
  getRegisteredModules(): string[] {
    return Array.from(this.modules);
  }
}

// Singleton instance
export const menuRegistryService = new MenuRegistryService();
