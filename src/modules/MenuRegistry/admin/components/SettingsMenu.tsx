'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMenu } from '../hooks/useMenu';
import { SettingsMenuItem } from '../../types/menu.types';

interface SettingsMenuProps {
  /**
   * User permissions for filtering settings items
   */
  userPermissions?: string[];

  /**
   * Display as tabs or list
   */
  variant?: 'tabs' | 'list' | 'grid';

  /**
   * Show categories
   */
  showCategories?: boolean;
}

/**
 * Settings menu component for settings page
 */
export default function SettingsMenu({
  userPermissions,
  variant = 'tabs',
  showCategories = true,
}: SettingsMenuProps) {
  const pathname = usePathname();
  const { settingsItems, settingsByCategory, isLoading } = useMenu(userPermissions);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded mb-4"></div>
      </div>
    );
  }

  const renderIcon = (item: SettingsMenuItem) => {
    if (!item.icon) return null;

    switch (item.icon.type) {
      case 'emoji':
        return <span className="text-2xl mr-3">{item.icon.value}</span>;
      case 'icon-class':
        return <i className={`${item.icon.value} mr-3`}></i>;
      case 'svg':
        return (
          <span
            className="mr-3"
            dangerouslySetInnerHTML={{ __html: item.icon.value }}
          />
        );
      default:
        return null;
    }
  };

  // Tabs variant (horizontal navigation)
  if (variant === 'tabs') {
    return (
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto" aria-label="Settings">
          {settingsItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.id}
                href={item.path}
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${
                    isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {renderIcon(item)}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }

  // List variant (vertical list)
  if (variant === 'list') {
    if (showCategories) {
      return (
        <div className="space-y-6">
          {Object.entries(settingsByCategory).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-lg font-medium text-gray-900 mb-3">{category}</h3>
              <div className="space-y-2">
                {items.map((item) => {
                  const isActive = pathname === item.path;

                  return (
                    <Link
                      key={item.id}
                      href={item.path}
                      className={`
                        flex items-start p-4 rounded-lg border transition-colors
                        ${
                          isActive
                            ? 'bg-indigo-50 border-indigo-200'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      {renderIcon(item)}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{item.label}</h4>
                        {item.description && (
                          <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {settingsItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.id}
              href={item.path}
              className={`
                flex items-start p-4 rounded-lg border transition-colors
                ${
                  isActive
                    ? 'bg-indigo-50 border-indigo-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {renderIcon(item)}
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{item.label}</h4>
                {item.description && (
                  <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  // Grid variant
  if (variant === 'grid') {
    if (showCategories) {
      return (
        <div className="space-y-8">
          {Object.entries(settingsByCategory).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => {
                  const isActive = pathname === item.path;

                  return (
                    <Link
                      key={item.id}
                      href={item.path}
                      className={`
                        flex flex-col items-center justify-center p-6 rounded-lg border transition-colors text-center
                        ${
                          isActive
                            ? 'bg-indigo-50 border-indigo-200'
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }
                      `}
                    >
                      {renderIcon(item)}
                      <h4 className="mt-2 text-sm font-medium text-gray-900">{item.label}</h4>
                      {item.description && (
                        <p className="mt-1 text-xs text-gray-500">{item.description}</p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.id}
              href={item.path}
              className={`
                flex flex-col items-center justify-center p-6 rounded-lg border transition-colors text-center
                ${
                  isActive
                    ? 'bg-indigo-50 border-indigo-200'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                }
              `}
            >
              {renderIcon(item)}
              <h4 className="mt-2 text-sm font-medium text-gray-900">{item.label}</h4>
              {item.description && (
                <p className="mt-1 text-xs text-gray-500">{item.description}</p>
              )}
            </Link>
          );
        })}
      </div>
    );
  }

  return null;
}
