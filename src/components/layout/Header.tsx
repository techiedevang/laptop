"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ShoppingCart, User, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { AnnouncementBar } from "./AnnouncementBar";
import { Logo } from "@/components/ui/Logo";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Bulk Orders", href: "/bulk-order" },
  { label: "Support", href: "/contact" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

interface HeaderProps {
  cartCount?: number;
  announcementText?: string;
}

export function Header({ cartCount = 0, announcementText }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <AnnouncementBar />
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-shadow duration-200",
          "bg-white dark:bg-slate-900 border-b border-blue-100 dark:border-slate-800",
          scrolled && "shadow-md shadow-blue-900/5"
        )}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group py-1" aria-label="NextGen IT Hub Home">
              <Logo height={42} className="h-9 sm:h-11 w-auto transition-transform duration-200 group-hover:scale-105" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                    "text-slate-600 hover:text-blue-600 hover:bg-blue-50/70",
                    "dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800",
                    pathname === link.href &&
                      "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-semibold border border-blue-200/60 dark:border-blue-800/60"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <div className="relative">
                {searchOpen ? (
                  <div className="flex items-center gap-1">
                    <input
                      autoFocus
                      type="search"
                      placeholder="Search laptops..."
                      className="w-48 sm:w-64 h-9 rounded-lg border border-blue-200 dark:border-slate-700 bg-blue-50/50 dark:bg-slate-800 text-slate-900 dark:text-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      onBlur={() => setSearchOpen(false)}
                      onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                    />
                    <button
                      onClick={() => setSearchOpen(false)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                aria-label={`Cart (${cartCount} items)`}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold leading-none shadow-sm">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="hidden sm:flex items-center gap-1.5 p-2 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                aria-label="My Account"
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-medium hidden md:block">Account</span>
              </Link>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div
          className={cn(
            "lg:hidden fixed inset-0 top-16 z-50 transition-opacity duration-200",
            mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div
            className={cn(
              "absolute right-0 top-0 h-full w-72 max-w-full",
              "bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700",
              "shadow-xl transition-transform duration-200",
              mobileOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="p-4 space-y-1 overflow-y-auto h-full">
              {/* Mobile Search */}
              <div className="pb-3 mb-3 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="search"
                  placeholder="Search laptops..."
                  className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors",
                    "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
                    "dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800",
                    pathname === link.href &&
                      "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <Link href="/account">
                  <Button variant="outline" fullWidth>
                    <User className="h-4 w-4" /> My Account
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button fullWidth>
                    Shop Laptops
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
