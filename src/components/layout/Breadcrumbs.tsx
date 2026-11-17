"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();

  // Don't show breadcrumbs on homepage or admin dashboard
  if (pathname === "/" || pathname.startsWith("/admin")) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    // Format slug into readable text: 'dell-latitude-7490' -> 'Dell Latitude 7490'
    const label = decodeURIComponent(segment)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return { href, label, isLast: index === segments.length - 1 };
  });

  // Generate BreadcrumbList JSON-LD schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": process.env.NEXT_PUBLIC_APP_URL || "https://nextgenithub.in",
      },
      ...breadcrumbs.map((b, idx) => ({
        "@type": "ListItem",
        "position": idx + 2,
        "name": b.label,
        "item": `${process.env.NEXT_PUBLIC_APP_URL || "https://nextgenithub.in"}${b.href}`,
      })),
    ],
  };

  return (
    <nav aria-label="Breadcrumb" className="bg-blue-50/40 dark:bg-slate-900/60 border-b border-blue-100 dark:border-slate-800 py-2.5 px-4 sm:px-6 lg:px-8 text-xs text-blue-900/80 dark:text-slate-400 theme-transition">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto flex items-center space-x-1.5 flex-wrap">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center">
          <Home className="w-3.5 h-3.5 mr-1" />
          <span>Home</span>
        </Link>

        {breadcrumbs.map((crumb) => (
          <div key={crumb.href} className="flex items-center space-x-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            {crumb.isLast ? (
              <span className="font-semibold text-slate-900 dark:text-slate-100 max-w-xs truncate">
                {crumb.label}
              </span>
            ) : (
              <Link href={crumb.href} className="hover:text-blue-600 dark:hover:text-blue-400">
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
