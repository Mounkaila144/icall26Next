'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMenus } from '../hooks/useMenus';
import type { MenuItem } from '../../types';

/**
 * Sidebar Component
 * Modern CRM navigation sidebar with elegant design
 */
export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { menus, isLoading, error } = useMenus();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const toggleExpand = (menuId: string) => {
    setExpandedMenus((prev) => {
      const next = new Set(prev);
      if (next.has(menuId)) {
        next.delete(menuId);
      } else {
        next.add(menuId);
      }
      return next;
    });
  };

  const isActive = (menu: MenuItem): boolean => {
    if (menu.path === pathname) return true;
    if (menu.children) {
      return menu.children.some((child) => isActive(child));
    }
    return false;
  };

  const renderMenuItem = (menu: MenuItem, level: number = 0): React.ReactNode => {
    // Only render visible and active menus
    if (!menu.is_visible || !menu.is_active) {
      return null;
    }

    const hasChildren = menu.children && menu.children.length > 0;
    const isExpanded = expandedMenus.has(menu.id);
    const active = isActive(menu);
    const isHovered = hoveredMenu === menu.id;

    const styles = {
      item: {
        marginBottom: level === 0 ? '6px' : '2px',
      },
      button: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: level === 0 ? '12px 16px' : `${8 + level * 2}px ${12 + level * 12}px`,
        backgroundColor: active
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : isHovered
          ? 'rgba(102, 126, 234, 0.08)'
          : 'transparent',
        color: active ? '#ffffff' : '#4a5568',
        border: 'none',
        borderRadius: level === 0 ? '12px' : '8px',
        cursor: 'pointer',
        fontSize: level === 0 ? '15px' : '14px',
        fontWeight: active ? '600' : level === 0 ? '500' : '400',
        textDecoration: 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative' as const,
        overflow: 'hidden' as const,
        boxShadow: active
          ? '0 4px 12px rgba(102, 126, 234, 0.4)'
          : isHovered
          ? '0 2px 8px rgba(0, 0, 0, 0.05)'
          : 'none',
        transform: isHovered && !active ? 'translateX(4px)' : 'translateX(0)',
      },
      buttonGradient: active ? {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      } : {},
      icon: {
        marginRight: '12px',
        fontSize: level === 0 ? '20px' : '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: level === 0 ? '32px' : '28px',
        height: level === 0 ? '32px' : '28px',
        borderRadius: '8px',
        backgroundColor: active
          ? 'rgba(255, 255, 255, 0.2)'
          : isHovered
          ? 'rgba(102, 126, 234, 0.1)'
          : 'transparent',
        transition: 'all 0.3s ease',
      },
      label: {
        flex: 1,
        textAlign: 'left' as const,
        letterSpacing: '0.01em',
      },
      arrow: {
        fontSize: '12px',
        marginLeft: '8px',
        transition: 'transform 0.3s ease',
        transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
        opacity: active ? 1 : 0.6,
      },
      children: {
        marginTop: '4px',
        marginLeft: level === 0 ? '16px' : '12px',
        paddingLeft: '16px',
        borderLeft: `2px solid ${active ? 'rgba(102, 126, 234, 0.3)' : 'rgba(226, 232, 240, 0.8)'}`,
        animation: isExpanded ? 'slideDown 0.3s ease' : 'none',
      },
      badge: active && {
        position: 'absolute' as const,
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '4px',
        height: '60%',
        borderRadius: '0 4px 4px 0',
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
      },
    };

    const content = (
      <>
        {menu.icon && (
          <span style={styles.icon}>
            {menu.icon.type === 'emoji' ? menu.icon.value : '📄'}
          </span>
        )}
        <span style={styles.label}>{menu.label}</span>
        {hasChildren && (
          <span style={styles.arrow}>▼</span>
        )}
      </>
    );

    return (
      <div key={menu.id} style={styles.item}>
        {hasChildren ? (
          // Menu with children - button to expand/collapse
          <>
            <button
              onClick={() => toggleExpand(menu.id)}
              style={{ ...styles.button, ...styles.buttonGradient }}
              onMouseEnter={() => setHoveredMenu(menu.id)}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              {content}
            </button>
            {isExpanded && (
              <div style={styles.children}>
                {menu.children!.map((child) => renderMenuItem(child, level + 1))}
              </div>
            )}
          </>
        ) : menu.path ? (
          // Menu with path - link
          <Link
            href={menu.path}
            style={{ ...styles.button, ...styles.buttonGradient }}
            onMouseEnter={() => setHoveredMenu(menu.id)}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            {content}
          </Link>
        ) : (
          // Menu without path or children - disabled
          <div style={{ ...styles.button, cursor: 'default', opacity: 0.5 }}>
            {content}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '20px 16px',
      }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
            }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        margin: '16px',
        borderRadius: '12px',
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        color: '#c33',
        fontSize: '14px',
      }}>
        <div style={{ fontWeight: '600', marginBottom: '4px' }}>⚠️ Error</div>
        <small>Failed to load navigation</small>
      </div>
    );
  }

  if (menus.length === 0) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        color: '#999',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
        <small style={{ fontSize: '14px' }}>No menu items</small>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <nav style={{
        padding: '16px 12px',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {/* Logo/Brand Section */}
        <div style={{
          padding: '8px 12px 24px',
          borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
          marginBottom: '16px',
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            letterSpacing: '-0.5px',
          }}>
            CRM Dashboard
          </h2>
          <p style={{
            fontSize: '12px',
            color: '#94a3b8',
            margin: '4px 0 0',
          }}>
            Manage your business
          </p>
        </div>

        {/* Navigation Menu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menus.map((menu) => renderMenuItem(menu))}
        </div>
      </nav>
    </>
  );
};
