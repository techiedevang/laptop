import Link from 'next/link';
import { Check, X, Shield, Video, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NextGen IT Hub vs Typical Sellers | Objective Comparison',
  description:
    'Compare NextGen IT Hub refurbished standards with typical marketplace and local laptop sellers. 6-month warranty, live video inspection, GST input tax invoices, and 50-point diagnostic tests.',
};

export default function ComparePage() {
  const comparisonData = [
    {
      feature: 'Comprehensive Hardware Warranty',
      us: '6 to 12 Months Standard Warranty covering Motherboard, Panel, RAM, SSD & Battery',
      others: '7 to 30 Days (often superficial testing warranty only)',
      highlight: true,
    },
    {
      feature: 'Rigorous Multi-Point Diagnostics',
      us: '50-Point Hardware, Thermal Benchmark & Battery Degradation Audit',
      others: 'Basic boot test & external damp wipe',
      highlight: true,
    },
    {
      feature: 'Live Video Inspection Demo',
      us: 'Free 1-on-1 private video demo with warehouse engineer prior to payment',
      others: 'None (static stock photos only)',
      highlight: true,
    },
    {
      feature: 'Cosmetic Grading Transparency',
      us: 'Strict Grade A+ / Grade A / Grade B categorization with high-res photos',
      others: 'Vague descriptions like "Like New" with undisclosed denting',
      highlight: false,
    },
    {
      feature: 'Legal GST Input Tax Invoice',
      us: '100% Statutory GST e-invoice (18% input credit for Indian businesses)',
      others: 'Cash receipts or unverified non-GST invoices',
      highlight: true,
    },
    {
      feature: 'Guaranteed Battery Health',
      us: 'Minimum 80% original capacity guaranteed; replaced with OEM battery if below',
      others: 'Untested battery backup (often drains in under 45 mins)',
      highlight: true,
    },
    {
      feature: 'Doorstep Return Policy',
      us: '7-Day Zero-Hassle Return & Replacement Guarantee',
      others: 'No returns once unboxed or seal broken',
      highlight: false,
    },
    {
      feature: 'Pan-India Insured Packaging',
      us: 'Free express shipping in specialized shockproof anti-static flight cases',
      others: 'Extra courier shipping charges & minimal generic cardboard wrapping',
      highlight: false,
    },
    {
      feature: 'B2B Custom OS & Image Cloning',
      us: 'Custom Linux/Windows OS imaging, asset tagging, and centralized corporate AMC',
      others: 'Standard consumer retail units only',
      highlight: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>Honest & Objective Comparison</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            NextGen IT Hub vs Typical Sellers
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            See why thousands of developers, Indian enterprises, and retail buyers choose certified refurbished machines from NextGen IT Hub over unverified marketplace dealers.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
                  <th className="sticky left-0 bg-gray-50 dark:bg-gray-800/90 z-10 py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 w-1/3">
                    Evaluation Criteria
                  </th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400 bg-green-50/70 dark:bg-green-950/40 w-1/3 border-x border-gray-200 dark:border-gray-700">
                    NextGen IT Hub Certified
                  </th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 w-1/3">
                    Others (Typical Market / Local Sellers)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-xs">
                {comparisonData.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors ${
                      row.highlight ? 'bg-blue-50/10 dark:bg-blue-950/10' : ''
                    }`}
                  >
                    <td className="sticky left-0 bg-white dark:bg-gray-800 z-10 py-4 px-6 font-semibold text-gray-900 dark:text-gray-100 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                      {row.feature}
                    </td>

                    <td className="py-4 px-6 bg-green-50/30 dark:bg-green-950/20 border-x border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-medium">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                        <span className="text-green-950 dark:text-green-200">{row.us}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{row.others}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Callout */}
        <div className="p-8 rounded-2xl bg-blue-700 dark:bg-blue-800 text-white text-center space-y-4 shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold">Experience the NextGen Quality Difference</h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
            Book a live 1-on-1 video call to inspect any machine on screen, or browse our ready inventory of certified Dell, HP, Lenovo & Apple laptops.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/video-demo"
              className="bg-white text-blue-800 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-2 shadow"
            >
              <Video className="w-4 h-4" />
              <span>Book Live Video Demo</span>
            </Link>
            <Link
              href="/shop"
              className="border border-blue-400 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-1.5"
            >
              <span>Browse Laptop Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
