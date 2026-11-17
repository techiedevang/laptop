'use client';

import React, { useState } from 'react';
import { Menu, Bell, Search, ChevronRight, Sun, Moon, User, LogOut, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';

interface AdminShellProps {
  children: React.ReactNode;
  user: { name: string; role: string; email: string };
}

function breadcrumbs(pathname: string): { label: string; href: string }[] {
  const parts = pathname.split('/').filter(Boolean);
  return parts.map((part, i) => ({
    label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
    href: '/' + parts.slice(0, i + 1).join('/'),
  }));
}

function pageTitle(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const last = segments[segments.length - 1] ?? 'Dashboard';
  return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ');
}

export function AdminShell({ children, user }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const crumbs = breadcrumbs(pathname);
  const title = pageTitle(pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        user={user}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 md:px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Title + Breadcrumbs */}
          <div className="hidden md:flex flex-col min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{title}</h1>
            <nav className="flex items-center text-xs text-gray-400 dark:text-gray-500">
              {crumbs.map((crumb, i) => (
                <React.Fragment key={crumb.href}>
                  {i > 0 && <ChevronRight className="h-3 w-3 mx-1 flex-shrink-0" />}
                  <span className={i === crumbs.length - 1 ? 'text-gray-600 dark:text-gray-300 font-medium' : 'hover:text-gray-600 dark:hover:text-gray-300 cursor-default'}>
                    {crumb.label}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Quick search..."
              className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-sm font-medium text-gray-900 dark:text-white leading-tight">{user.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{user.role}</span>
              </div>
            </button>
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 py-1">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                  <a href="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Settings className="h-4 w-4" /> Settings
                  </a>
                  <form action="/api/auth/signout" method="POST">
                    <button type="submit" className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
