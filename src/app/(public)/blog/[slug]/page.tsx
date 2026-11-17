import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User, Share2, ShieldCheck } from "lucide-react";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const title = "Refurbished Laptop Guide | NextGen IT Hub";
  return {
    title,
    description: "In-depth guide from NextGen IT Hub technical engineering team.",
  };
}

export default function SingleBlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "The Ultimate Refurbished Laptop Buying Guide in India",
    "datePublished": "2024-11-14T10:00:00+05:30",
    "dateModified": "2024-11-14T10:00:00+05:30",
    "author": {
      "@type": "Organization",
      "name": "NextGen IT Hub Engineering Team",
    },
    "publisher": {
      "@type": "Organization",
      "name": "NextGen IT Hub",
    },
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-12 theme-transition">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Articles</span>
        </Link>

        {/* Title & Metadata */}
        <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Buying Guide & Tips
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
            The Ultimate Refurbished Laptop Buying Guide in India (2024)
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>NextGen Hardware QC Team</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>14 November 2024</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>6 min read</span>
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white">
            Buying a refurbished laptop in India can save you between 50% and 75% compared to purchasing new. However, navigating unverified local computer markets or unregulated classifieds often leads to machines with failing batteries, hidden motherboard repairs, or cracked hinge assemblies.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
            1. Always Choose Commercial/Enterprise Series Over Consumer Lines
          </h2>
          <p>
            The single most critical decision is the laptop family. Manufacturers build consumer laptops (like Dell Inspiron or HP Pavilion) with plastic chassis and light-duty components designed for casual home use. By contrast, enterprise lines (Dell Latitude, Lenovo ThinkPad T/X-Series, HP EliteBook) are engineered for Fortune 500 fleets. They feature magnesium-alloy internal roll cages, spill-resistant keyboards, and superior thermal dissipation.
          </p>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
            2. Demand Objective Condition Grading (A+, A, B)
          </h2>
          <p>
            Avoid sellers who use vague descriptions like &quot;good working condition&quot;. At NextGen IT Hub, we publish explicit grade definitions:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li><strong>Grade A+:</strong> Virtually mint condition with flawless screen and no noticeable scratches.</li>
            <li><strong>Grade A:</strong> Light cosmetic signs of desk usage; screen and keyboard pristine.</li>
            <li><strong>Grade B:</strong> Visible cosmetic wear or minor casing scratches, but 100% hardware-tested performance.</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
            3. Insist on a Live 1-on-1 Video Demo
          </h2>
          <p>
            Never purchase refurbished hardware without seeing the exact machine operational. We offer free 1-on-1 live video demonstration calls where our engineer opens the laptop lid, tests viewing angles, connects chargers to each port, and demonstrates the battery diagnostic report on camera.
          </p>

          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-5 rounded-2xl space-y-2">
            <h3 className="font-bold text-sm text-blue-950 dark:text-blue-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Looking to buy a certified laptop today?</span>
            </h3>
            <p className="text-xs text-blue-900 dark:text-blue-300">
              Browse our inventory with 6-month warranty, GST invoice, and free pan-India shipping.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs inline-block transition-colors shadow"
              >
                Browse Available Laptops
              </Link>
            </div>
          </div>
        </div>

      </article>
    </div>
  );
}
