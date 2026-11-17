import { ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function WarrantyPolicyPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-12 theme-transition">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        
        <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Standard 6-Month Comprehensive Cover</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Comprehensive Warranty Policy
          </h1>
          <p className="text-xs text-slate-400">NextGen IT Hub Warranty Terms & Claim Guidelines</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">1. Scope of Coverage</h2>
          <p>
            Every refurbished laptop sold by NextGen IT Hub carries our standard <strong>6-Month Comprehensive Hardware Warranty</strong> starting from the recorded date of delivery.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Covered under Warranty:
              </span>
              <ul className="list-disc pl-5 space-y-1 text-slate-500 text-xs">
                <li>Motherboard & CPU functionality</li>
                <li>Display screen panel & inverter board</li>
                <li>RAM memory & SSD storage modules</li>
                <li>Keyboard, touchpad & cooling fan</li>
                <li>Original power adapter & charging circuitry</li>
                <li>Battery backup (guaranteed &gt;80% capacity)</li>
              </ul>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
              <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Not Covered:
              </span>
              <ul className="list-disc pl-5 space-y-1 text-slate-500 text-xs">
                <li>Physical liquid spills or water damage</li>
                <li>Accidental drop damage or crushed display</li>
                <li>Unauthorized third-party repairs or alterations</li>
                <li>Software malware, virus, or OS tampering</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">2. Hassle-Free Pan-India Claim Process</h2>
          <ol className="list-decimal pl-5 space-y-2 text-slate-600 dark:text-slate-400">
            <li><strong>Step 1:</strong> Contact our support via WhatsApp (+91 9155282776) or email support@nextgenithub.in with your Order Number and a short video/photo of the fault.</li>
            <li><strong>Step 2:</strong> Our hardware engineer connects with you remotely to troubleshoot or diagnose the problem.</li>
            <li><strong>Step 3:</strong> If replacement of a component or machine is required, we schedule an insured pickup through Bluedart from your address.</li>
            <li><strong>Step 4:</strong> The laptop is repaired or replaced with an equivalent certified unit and returned to you within 4 to 6 business days.</li>
          </ol>
        </section>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <Link href="/contact" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
            Need to open a warranty ticket? Contact Support &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
