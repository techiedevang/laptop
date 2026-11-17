import Link from "next/link";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-12 theme-transition">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        
        <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>Digital Personal Data Protection (DPDP) Act 2023 Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">Last Updated: November 2024 | Version 2.1</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">1. Introduction</h2>
          <p>
            NextGen IT Hub Private Limited (&quot;NextGen IT Hub&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the website https://nextgenithub.in. We are committed to safeguarding the digital personal data of our customers, corporate partners, and site visitors in strict adherence to India&apos;s Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information Technology Act, 2000.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">2. Data We Collect & Grounds of Processing</h2>
          <p>We adhere to the principle of <strong>Data Minimization</strong>. We collect only what is necessary to fulfill orders, facilitate live video calls, and provide warranty support:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li><strong>Identity & Contact Data:</strong> Name, shipping address, email address, phone number (encrypted at rest with AES-256-GCM).</li>
            <li><strong>Commercial & B2B Data:</strong> Company name and GSTIN (for generating valid tax invoices and Input Tax Credit).</li>
            <li><strong>Payment Identifiers:</strong> We partner with Razorpay (a PCI-DSS Level 1 compliant gateway). We <em>never</em> collect, handle, or store debit/credit card numbers, CVVs, or UPI PINs. We store only the Razorpay transaction ID, order reference, and payment status.</li>
            <li><strong>Video Call Metadata:</strong> Date, time, participant name, and meeting duration. Video calls are peer-to-peer encrypted (WebRTC) and are <strong>never recorded</strong> without explicit recorded verbal and written consent.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">3. Your Rights as a Data Principal (DPDP Act)</h2>
          <p>Under the DPDP Act 2023, you enjoy complete control over your personal data via our <Link href="/account/privacy-center" className="text-blue-600 dark:text-blue-400 font-semibold underline">Privacy Center</Link>:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li><strong>Right to Access & Summary:</strong> Download a full machine-readable JSON copy of all data held about you.</li>
            <li><strong>Right to Correction & Erasure:</strong> Request instant correction or complete deletion of non-legally-mandated records. (GST invoices are retained for the statutory period required by Indian tax law).</li>
            <li><strong>Right to Grievance Redressal:</strong> Dedicated access to our designated Grievance Officer in India.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">4. Grievance Officer Details (India)</h2>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
            <p><strong>Designated Grievance Officer:</strong> Mr. Rajesh Deshmukh</p>
            <p><strong>Designation:</strong> Head of Compliance & Data Protection</p>
            <p><strong>Email:</strong> grievance@nextgenithub.in | compliance@nextgenithub.in</p>
            <p><strong>Address:</strong> NextGen IT Hub Pvt Ltd, Mother Dairy Road, Shakarpur, East Delhi, Delhi 110092, India</p>
            <p><strong>Response SLA:</strong> Within 48 business hours of receipt</p>
          </div>
        </section>

      </div>
    </div>
  );
}
