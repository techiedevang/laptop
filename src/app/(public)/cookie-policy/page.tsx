import Link from "next/link";
import { Cookie, ShieldCheck } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-12 theme-transition">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        
        <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <Cookie className="w-3.5 h-3.5" />
            <span>DPDP Act 2023 Consent Compliance</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Cookie Policy
          </h1>
          <p className="text-xs text-slate-400">How NextGen IT Hub uses cookies & digital identifiers</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">1. What Are Cookies?</h2>
          <p>
            Cookies are small cryptographic text files placed on your device to ensure core shopping features (such as maintaining your cart items, guest session token, theme preference, and security protection) operate smoothly.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">2. Categories of Cookies We Use</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
            <li><strong>Strictly Necessary:</strong> Essential for cart management, CSRF security verification, and checkout authentication. These cannot be disabled.</li>
            <li><strong>Performance & Analytics:</strong> Anonymized metrics to optimize site speed and find navigation bottlenecks. Loaded only after consent.</li>
            <li><strong>WhatsApp Communication:</strong> Remembering your consent to send shipping and video demo join reminders.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">3. Managing Your Preferences</h2>
          <p>
            You can modify or withdraw your cookie consent anytime via the <Link href="/account/privacy-center" className="text-blue-600 dark:text-blue-400 font-semibold underline">Privacy Center</Link> or by resetting the cookie banner.
          </p>
        </section>

      </div>
    </div>
  );
}
