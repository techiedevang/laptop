import Link from "next/link";
import { BookOpen, Clock, Calendar, ArrowRight, User } from "lucide-react";

export const metadata = {
  title: "Refurbished Laptop Guides, Buying Advice & Tech Insights",
  description: "Expert guides on buying refurbished laptops in India, hardware testing benchmarks, B2B procurement tips, and maintenance tutorials.",
};

const BLOG_POSTS = [
  {
    slug: "refurbished-laptop-buying-guide-india-2024",
    title: "The Ultimate Refurbished Laptop Buying Guide in India (2024)",
    excerpt: "Everything you need to inspect before buying: battery health cycles, processor generations, display panels, and avoiding marketplace scams.",
    category: "Buying Guide",
    author: "Technical Team",
    date: "14 Nov 2024",
    readTime: "6 min read",
  },
  {
    slug: "why-enterprise-dell-thinkpad-outlast-consumer-laptops",
    title: "Why Enterprise Dell Latitude & ThinkPads Outlast Consumer Laptops",
    excerpt: "Why a 3-year-old corporate ThinkPad T480 or Dell Latitude 7490 performs better and lasts twice as long as a brand-new budget plastic notebook.",
    category: "Hardware Analysis",
    author: "Hardware QC Lead",
    date: "02 Nov 2024",
    readTime: "5 min read",
  },
  {
    slug: "demystifying-laptop-grades-a-plus-a-b-explained",
    title: "Demystifying Laptop Grades: What Do Grade A+, A, and B Mean?",
    excerpt: "Understanding NextGen IT Hub's strict cosmetic and functional grading taxonomy. Learn what to expect from each condition tier.",
    category: "Quality Standards",
    author: "Compliance Desk",
    date: "25 Oct 2024",
    readTime: "4 min read",
  },
  {
    slug: "how-startups-save-lakhs-on-it-capex-with-refurbished-fleets",
    title: "How Indian Startups Save 60%+ on IT Capex with Refurbished Fleets",
    excerpt: "Case studies of 10 Indian startups scaling from 15 to 100+ engineers without blowing their seed rounds on hardware purchases.",
    category: "B2B Case Study",
    author: "B2B Director",
    date: "18 Oct 2024",
    readTime: "7 min read",
  },
  {
    slug: "5-crucial-hardware-tests-for-used-laptops",
    title: "5 Crucial Hardware Diagnostic Tests You Must Run on Second-Hand Laptops",
    excerpt: "Step-by-step tutorial on running CrystalDiskInfo, MemTest86, and battery health reporting in Windows 11.",
    category: "Tutorial",
    author: "Senior Engineer",
    date: "10 Oct 2024",
    readTime: "5 min read",
  },
];

export default function BlogListingPage() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-12 theme-transition">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tech Insights & Buying Advice</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            NextGen Hardware Blog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Unbiased guides, hardware benchmark tests, and business advice on refurbished technology in India.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <Link href={`/blog/${post.slug}`}>
                  <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{post.author}</span>
                </span>

                <Link
                  href={`/blog/${post.slug}`}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
