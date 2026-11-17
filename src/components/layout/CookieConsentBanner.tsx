"use client";

import { useState, useEffect } from "react";
import { Shield, ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ConsentSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  whatsapp: boolean;
}

export function CookieConsentBanner() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [settings, setSettings] = useState<ConsentSettings>({
    necessary: true,
    analytics: false,
    marketing: false,
    whatsapp: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem("ngh_cookie_consent");
    if (!saved) {
      // Delay showing banner slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    } else {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  const savePreferences = (consent: ConsentSettings) => {
    localStorage.setItem("ngh_cookie_consent", JSON.stringify(consent));
    setIsVisible(false);

    // Save consent to DB via API endpoint
    fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...consent,
        policyVersion: "2024-v1",
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // ignore network errors for consent logging
    });

    // Dynamically load analytics scripts only after explicit consent
    if (consent.analytics && typeof window !== "undefined") {
      const gaId = process.env.NEXT_PUBLIC_GA_ID;
      if (gaId && !document.getElementById("ga-script")) {
        const script = document.createElement("script");
        script.id = "ga-script";
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);
      }
    }
  };

  const handleAcceptAll = () => {
    const allConsents: ConsentSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
      whatsapp: true,
    };
    setSettings(allConsents);
    savePreferences(allConsents);
  };

  const handleAcceptNecessary = () => {
    const minConsents: ConsentSettings = {
      necessary: true,
      analytics: false,
      marketing: false,
      whatsapp: false,
    };
    setSettings(minConsents);
    savePreferences(minConsents);
  };

  if (!isVisible || pathname?.startsWith("/admin")) return null;

  return (
    <aside aria-label="Privacy and Cookie Consent" className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 text-slate-800 dark:text-slate-100 theme-transition">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              Privacy & Cookie Preferences
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              We respect your privacy under India&apos;s Digital Personal Data Protection (DPDP) Act 2023. We use cookies to enhance your shopping experience and deliver authentic refurbished laptop recommendations.
            </p>
          </div>
        </div>

        {/* Detailed Preferences Accordion */}
        {showPreferences && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs">
            {/* 1. Necessary */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Strictly Necessary</p>
                <p className="text-slate-500 dark:text-slate-400">Essential for cart, checkout & authentication</p>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Required
              </span>
            </div>

            {/* 2. Analytics */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Analytics & Performance</p>
                <p className="text-slate-500 dark:text-slate-400">GA4 metrics to analyze website traffic & speed</p>
              </div>
              <input
                type="checkbox"
                checked={settings.analytics}
                onChange={(e) => setSettings({ ...settings, analytics: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* 3. Marketing */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Marketing & Retargeting</p>
                <p className="text-slate-500 dark:text-slate-400">Personalized deals & refurbished laptop offers</p>
              </div>
              <input
                type="checkbox"
                checked={settings.marketing}
                onChange={(e) => setSettings({ ...settings, marketing: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* 4. WhatsApp */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">WhatsApp Updates</p>
                <p className="text-slate-500 dark:text-slate-400">Order tracking & demo meeting links via WhatsApp</p>
              </div>
              <input
                type="checkbox"
                checked={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={handleAcceptAll}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors shadow-sm text-center"
          >
            Accept All
          </button>
          <button
            onClick={showPreferences ? () => savePreferences(settings) : handleAcceptNecessary}
            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold py-2 px-3 rounded-lg transition-colors text-center"
          >
            {showPreferences ? "Save Preferences" : "Essential Only"}
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="hover:text-blue-600 dark:hover:text-blue-400 underline inline-flex items-center"
          >
            {showPreferences ? "Hide Options" : "Customize Options"}
            <ChevronRight className={`w-3 h-3 ml-0.5 transform transition-transform ${showPreferences ? "rotate-90" : ""}`} />
          </button>
          <Link href="/cookie-policy" className="hover:text-blue-600 dark:hover:text-blue-400 underline">
            Read Cookie Policy
          </Link>
        </div>
      </div>
    </aside>
  );
}
