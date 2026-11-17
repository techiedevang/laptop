import { RotateCcw, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ReturnRefundPolicyPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-12 theme-transition">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        
        <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>7-Day Hassle-Free Replacement Guarantee</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Return & Refund Policy
          </h1>
          <p className="text-xs text-slate-400">Clear, fair, and transparent customer return terms</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">1. 7-Day Replacement Window</h2>
          <p>
            We want you to be 100% confident with your purchase. Every refurbished laptop delivered by NextGen IT Hub includes a <strong>7-Day Replacement Guarantee</strong>. If your machine exhibits any functional defect or cosmetic discrepancy inconsistent with its certified grade (A+/A/B), you are eligible for an immediate replacement or full refund.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">2. Refund Timeline & Mode</h2>
          <p>
            Upon receipt of the returned laptop at our central Delhi warehouse and a quick 24-hour verification pass by our technical audit team:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li><strong>Online Razorpay Payments (UPI / Card / Netbanking):</strong> Refund is initiated automatically to the original payment source and reflects in 2 to 4 banking business days.</li>
            <li><strong>Cash on Delivery (COD) Orders:</strong> Our accounts team initiates a direct NEFT/IMPS transfer to your designated bank account or UPI VPA upon verifying your return.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">3. How to Initiate a Return</h2>
          <p>
            Send a WhatsApp message to <strong>+91 9155282776</strong> or email <strong>support@nextgenithub.in</strong> with your Order Number and photos/video of the issue. We arrange the reverse pickup with zero courier charge to you.
          </p>
        </section>

      </div>
    </div>
  );
}
