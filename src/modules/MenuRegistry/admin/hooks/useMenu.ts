'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { menuRegistryService } from '../services/menuRegistryService';
import {
  MenuItem,
  SettingsMenuItem,
  UserPermissions,
  MenuPermission,
} from '../../types/menu.types';

/**
 * Hook to access menu items with permission filtering
 */
export const useMenu = (userPermissions?: string[]) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [settingsItems, setSettingsItems] = useState<SettingsMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create permissions helper
  const permissions: UserPermissions = useMemo(() => {
    const perms = userPermissions || [];

    return {
      permissions: perms,
      hasPermission: (permission: string | string[] | MenuPermission): boolean => {
        return menuRegistryService.checkPermission(perms, permission);
      },
    };
  }, [userPermissions]);

  // Load menu items
  const loadMenus = useCallback(() => {
    setIsLoading(true);

    try {
      if (userPermissions !== undefined) {
        // Filter by permissions
        setMenuItems(menuRegistryService.getMenuItemsForUser(permissions));
        setSettingsItems(menuRegistryService.getSettingsItemsForUser(permissions));
      } else {
        // Get all items (no filtering)
        setMenuItems(menuRegistryService.getAllMenuItems());
        setSettingsItems(menuRegistryService.getAllSettingsItems());
      }

      // Log for debugging
      console.log('Menus loaded:', {
        menuItemsCount: menuRegistryService.getAllMenuItems().length,
        settingsItemsCount: menuRegistryService.getAllSettingsItems().length,
        userPermissions,
      });
    } catch (error) {
      console.error('Error loading menus:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userPermissions, permissions]);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  // Get settings items grouped by category
  const settingsByCategory = useMemo(() => {
    return menuRegistryService.getSettingsItemsByCategory(
      userPermissions ? permissions : undefined
    );
  }, [settingsItems, userPermissions, permissions]);

  // Refresh menus (useful when permissions change)
  const refresh = useCallback(() => {
    loadMenus();
  }, [loadMenus]);

  return {
    menuItems,
    settingsItems,
    settingsByCategory,
    isLoading,
    refresh,
    hasPermission: permissions.hasPermission,
  };
};

/**
 * Hook to get a specific menu item by ID
 */
export const useMenuItem = (menuId: string) => {
  const [menuItem, setMenuItem] = useState<MenuItem | undefined>();

  useEffect(() => {
    const item = menuRegistryService.getMenuItemById(menuId);
    setMenuItem(item);
  }, [menuId]);

  return menuItem;
};

/**
 * Hook to get a specific settings item by ID
 */
export const useSettingsItem = (settingsId: string) => {
  const [settingsItem, setSettingsItem] = useState<SettingsMenuItem | undefined>();

  useEffect(() => {
    const item = menuRegistryService.getSettingsItemById(settingsId);
    setSettingsItem(item);
  }, [settingsId]);

  return settingsItem;
};
