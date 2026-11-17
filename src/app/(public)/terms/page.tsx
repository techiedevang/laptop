import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-12 theme-transition">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        
        <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Terms & Conditions of Sale
          </h1>
          <p className="text-xs text-slate-400">NextGen IT Hub Private Limited | Effective Date: November 2024</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">1. Nature of Goods</h2>
          <p>
            NextGen IT Hub specializes in certified enterprise refurbished computer hardware (Dell, HP, Lenovo, Apple). Every unit is professionally inspected, restored, and classified into Grade A+, Grade A, or Grade B based on objective physical standards.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">2. Pricing, Invoicing & GST</h2>
          <p>
            All listed prices are denominated in Indian Rupees (INR) and are inclusive of applicable Goods and Services Tax (GST 18%). Invoices with legal GSTIN and serial number details are issued automatically upon confirmed payment.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">3. Governing Law & Jurisdiction</h2>
          <p>
            These terms are governed by the laws of India. Any disputes arising out of transactions on this site shall be subject to the exclusive jurisdiction of the competent courts in New Delhi / Delhi, India.
          </p>
        </section>

      </div>
    </div>
  );
}
