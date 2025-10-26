'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMenu } from '../hooks/useMenu';
import { MenuItem } from '../../types/menu.types';

interface SidebarProps {
  /**
   * User permissions for filtering menu items
   */
  userPermissions?: string[];

  /**
   * Callback when menu item is clicked
   */
  onMenuClick?: (item: MenuItem) => void;
}

/**
 * Sidebar component that displays menu items
 */
export default function Sidebar({ userPermissions, onMenuClick }: SidebarProps) {
  const pathname = usePathname();
  const { menuItems, isLoading } = useMenu(userPermissions);

  if (isLoading) {
    return (
      <div className="w-64 bg-gray-800 min-h-screen p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const renderIcon = (item: MenuItem) => {
    if (!item.icon) return null;

    switch (item.icon.type) {
      case 'emoji':
        return <span className="text-xl mr-3">{item.icon.value}</span>;
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

  const renderBadge = (item: MenuItem) => {
    if (!item.badge) return null;

    const badgeColors = {
      primary: 'bg-blue-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
    };

    const bgColor = badgeColors[item.badge.variant || 'primary'];

    return (
      <span
        className={`ml-auto px-2 py-1 text-xs font-semibold rounded-full text-white ${bgColor}`}
      >
        {item.badge.value}
      </span>
    );
  };

  return (
    <div className="w-64 bg-gray-800 min-h-screen text-white">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/');

            return (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => onMenuClick?.(item)}
                className={`
                  flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                  ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                {renderIcon(item)}
                <span className="flex-1">{item.label}</span>
                {renderBadge(item)}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
