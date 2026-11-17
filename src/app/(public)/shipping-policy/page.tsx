import { Truck, ShieldCheck, Clock } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-12 theme-transition">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        
        <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <Truck className="w-3.5 h-3.5" />
            <span>Pan-India Insured Express Shipping</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs text-slate-400">Safe, insured transit with real-time tracking</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">1. Shipping Charges & Carriers</h2>
          <p>
            We provide <strong>FREE express insured shipping</strong> on all orders across India. We partner exclusively with tier-1 logistics providers including <strong>Bluedart, Delhivery Express, and DTDC Air</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">2. Delivery Timelines</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li><strong>Delhi NCR:</strong> Same-day dispatch; delivery within 24 hours.</li>
            <li><strong>Metro Cities (Mumbai, Bengaluru, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad):</strong> Delivery within 2 to 3 business days.</li>
            <li><strong>Rest of India (Tier 2 & 3 Cities, Towns):</strong> Delivery within 3 to 5 business days.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">3. Industrial Protective Packaging</h2>
          <p>
            Every machine is enclosed in shock-absorbing multi-chamber air bubble wrap, rigid heavy-gauge corrugated outer boxes, and tamper-evident security tape. Every parcel is 100% transit-insured against loss or damage.
          </p>
        </section>

      </div>
    </div>
  );
}
