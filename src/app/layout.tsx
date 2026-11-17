import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { CookieConsentBanner } from "@/components/layout/CookieConsentBanner";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://nextgenithub.in"),
  title: {
    default: "NextGen IT Hub | Certified Refurbished Laptops India (B2B Bulk & Retail)",
    template: "%s | NextGen IT Hub",
  },
  description:
    "India's premier certified refurbished laptop provider. Enterprise laptops from Dell, HP, Lenovo, and Apple with 6-month warranty, 50-point inspection, GST input invoice, and live video demo before buying.",
  keywords: [
    "refurbished laptops India",
    "certified second hand laptops",
    "bulk refurbished laptops B2B",
    "Dell Latitude refurbished",
    "Lenovo ThinkPad refurbished",
    "HP EliteBook refurbished",
    "cheap gaming laptops India",
    "refurbished MacBook Pune Mumbai Delhi",
  ],
  authors: [{ name: "NextGen IT Hub Team" }],
  creator: "NextGen IT Hub",
  publisher: "NextGen IT Hub Private Limited",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://nextgenithub.in",
    siteName: "NextGen IT Hub",
    title: "NextGen IT Hub | Certified Refurbished Laptops India",
    description: "Quality-tested, grade-certified refurbished laptops with 6-month warranty, GST invoice & live video demos.",
    images: [
      {
        url: "/images/og-nextgen.jpg",
        width: 1200,
        height: 630,
        alt: "NextGen IT Hub Refurbished Laptops",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextGen IT Hub | Refurbished Laptops India",
    description: "Quality-tested, grade-certified refurbished laptops with 6-month warranty & GST invoice.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema for LocalBusiness and Organization
  const orgSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://nextgenithub.in/#organization",
        "name": "NextGen IT Hub",
        "url": "https://nextgenithub.in",
        "logo": "https://nextgenithub.in/images/logo.png",
        "sameAs": [
          "https://www.facebook.com/nextgenithub",
          "https://www.instagram.com/nextgenithub",
          "https://www.linkedin.com/company/nextgenithub",
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-9155282776",
          "contactType": "Customer Support",
          "areaServed": "IN",
          "availableLanguage": ["English", "Hindi"],
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://nextgenithub.in/#localbusiness",
        "name": "NextGen IT Hub",
        "image": "https://nextgenithub.in/images/showroom.jpg",
        "telephone": "+91-9155282776",
        "email": "support@nextgenithub.in",
        "priceRange": "₹₹",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Mother Dairy Road, Shakarpur",
          "addressLocality": "East Delhi",
          "addressRegion": "Delhi",
          "postalCode": "110092",
          "addressCountry": "IN",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 28.6282892,
          "longitude": 77.2782221,
        },
        "hasMap": "https://www.google.com/maps/place/28%C2%B037'41.8%22N+77%C2%B016'41.6%22E/@28.6282892,77.2782221,17z",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "10:00",
            "closes": "19:00",
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 theme-transition">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="nextgen_theme"
          disableTransitionOnChange
        >
          <Header announcementText="🚀 Festive B2B & Retail Sale: Flat ₹2,000 Off on all Grade A+ Laptops | Use Code: FESTIVE2000" />
          <Breadcrumbs />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <FloatingButtons />
          <CookieConsentBanner />
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
