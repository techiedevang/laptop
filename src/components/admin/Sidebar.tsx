'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Video, FileText,
  Tag, Settings, Shield, Headphones, BarChart2, ChevronDown, ChevronRight,
  MessageSquare, Star, Megaphone, GitCompare, MapPin, LogOut, Menu, X,
  HelpCircle, Building2, Image as ImageIcon
} from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string; icon?: React.ReactNode }[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Inventory', href: '/admin/inventory', icon: <Package className="h-5 w-5" /> },
  { label: 'Orders', href: '/admin/orders', icon: <ShoppingCart className="h-5 w-5" /> },
  { label: 'Bulk Enquiries', href: '/admin/bulk-enquiries', icon: <Building2 className="h-5 w-5" /> },
  { label: 'Customers', href: '/admin/customers', icon: <Users className="h-5 w-5" /> },
  { label: 'Video Meetings', href: '/admin/meetings', icon: <Video className="h-5 w-5" /> },
  {
    label: 'Content', icon: <FileText className="h-5 w-5" />,
    children: [
      { label: 'Blogs', href: '/admin/content/blogs', icon: <FileText className="h-4 w-4" /> },
      { label: 'FAQs', href: '/admin/content/faqs', icon: <HelpCircle className="h-4 w-4" /> },
      { label: 'Reviews', href: '/admin/content/reviews', icon: <Star className="h-4 w-4" /> },
      { label: 'Partners', href: '/admin/content/partners', icon: <Building2 className="h-4 w-4" /> },
      { label: 'Banners', href: '/admin/content/banners', icon: <Megaphone className="h-4 w-4" /> },
      { label: 'Comparison', href: '/admin/content/comparison', icon: <GitCompare className="h-4 w-4" /> },
      { label: 'Service Coverage', href: '/admin/content/coverage', icon: <MapPin className="h-4 w-4" /> },
    ],
  },
  { label: 'Pricing & Coupons', href: '/admin/pricing', icon: <Tag className="h-5 w-5" /> },
  { label: 'Support Tickets', href: '/admin/support', icon: <Headphones className="h-5 w-5" /> },
  { label: 'Reports', href: '/admin/reports', icon: <BarChart2 className="h-5 w-5" /> },
  { label: 'Users & Roles', href: '/admin/users', icon: <Shield className="h-5 w-5" /> },
  { label: 'Privacy Requests', href: '/admin/privacy-requests', icon: <Shield className="h-5 w-5" /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
];

interface SidebarProps {
  user?: { name: string; role: string; avatarUrl?: string };
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ user, mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Content: true });

  function toggleGroup(label: string) {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  function isActive(href?: string, children?: { href: string }[]) {
    if (href) return pathname === href || (href !== '/admin' && pathname.startsWith(href));
    if (children) return children.some((c) => pathname.startsWith(c.href));
    return false;
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-700 dark:border-gray-800">
        <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-lg select-none">N</div>
        <div>
          <div className="font-bold text-white text-sm leading-tight">NextGen IT Hub</div>
          <div className="text-gray-400 text-xs">Admin Panel</div>
        </div>
        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          className="ml-auto lg:hidden text-gray-400 hover:text-white p-1 rounded"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 scrollbar-thin scrollbar-thumb-gray-700">
        {navItems.map((item) => {
          if (item.children) {
            const groupActive = isActive(undefined, item.children);
            const isOpen = openGroups[item.label] ?? groupActive;
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    groupActive
                      ? 'bg-gray-700 dark:bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700/60 hover:text-white'
                  }`}
                >
                  <span className={groupActive ? 'text-blue-400' : 'text-gray-400'}>{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {isOpen ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                </button>
                {isOpen && (
                  <div className="mt-0.5 ml-4 pl-3 border-l border-gray-700 dark:border-gray-800 space-y-0.5">
                    {item.children.map((child) => {
                      const childActive = pathname === child.href || pathname.startsWith(child.href);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onMobileClose}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                            childActive
                              ? 'bg-blue-600 text-white font-medium'
                              : 'text-gray-400 hover:bg-gray-700/60 hover:text-white'
                          }`}
                        >
                          {child.icon && <span>{child.icon}</span>}
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href!}
              onClick={onMobileClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700/60 hover:text-white'
              }`}
            >
              <span className={active ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-gray-700 dark:border-gray-800 p-4 space-y-3">
        {user && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.role}</p>
            </div>
          </div>
        )}
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-red-900/40 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 dark:bg-gray-950 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-gray-900 dark:bg-gray-950 z-50 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
