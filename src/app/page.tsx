"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  CheckCircle, 
  FileText, 
  Truck, 
  Video, 
  ArrowRight, 
  Laptop, 
  Building2, 
  Star, 
  Play, 
  Pause, 
  Sparkles, 
  Award, 
  Users, 
  ChevronDown,
  RotateCcw,
  Headphones,
  Check,
  Briefcase,
  GraduationCap,
  Gamepad2,
  Palette,
  ExternalLink,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { LaptopCard } from "@/components/shop/LaptopCard";
import { ALL_LAPTOPS } from "@/data/laptops";
import { PartnerLogos } from "@/components/home/PartnerLogos";

// Featured enterprise refurbished laptops from rich catalog
const FEATURED_LAPTOPS = ALL_LAPTOPS.slice(0, 6);

const TESTIMONIALS = [
  {
    name: "Vikram Malhotra",
    city: "Bengaluru, Karnataka",
    laptop: "Lenovo ThinkPad T480 (Grade A+)",
    rating: 5,
    text: "Ordered 12 units for our engineering team. Every machine arrived spotless with brand new power adapters and battery health above 88%. The live video demo convinced our CTO before we issued the purchase order.",
  },
  {
    name: "Pooja Hegde",
    city: "New Delhi, Delhi",
    laptop: "Dell Latitude 7490 (Grade A+)",
    rating: 5,
    text: "Visited their Shakarpur facility for inspection and ended up ordering online with GST input credit. Saved ₹45,000 compared to a brand new Dell. Keyboard and display feel factory-fresh!",
  },
  {
    name: "Amanjot Singh",
    city: "Chandigarh, Punjab",
    laptop: "Apple MacBook Air M1 (Grade A+)",
    rating: 5,
    text: "Battery cycle count was only 48! Delivered in 3 days via insured Bluedart express. Packaging with custom air-cushioning is top-notch. Highly recommended for students and coders.",
  },
  {
    name: "Dr. Suresh Nair",
    city: "Kochi, Kerala",
    laptop: "HP EliteBook 840 G6 (Grade A)",
    rating: 5,
    text: "Was skeptical about refurbished laptops until I booked their 1-on-1 video demo. The technician turned the laptop around, showed every port and executed a live reboot. Absolute transparency.",
  },
];

const LATEST_BLOGS = [
  {
    slug: "refurbished-laptop-buying-guide-india-2024",
    title: "The Ultimate Refurbished Laptop Buying Guide in India (2024)",
    excerpt: "Everything you need to inspect: battery health cycles, processor generations, display panels, and avoiding scams.",
    date: "14 Nov 2024",
    readTime: "6 min read",
    tag: "Buying Guide",
  },
  {
    slug: "why-enterprise-dell-thinkpad-outlast-consumer-laptops",
    title: "Why Enterprise Dell Latitude & ThinkPads Outlast Consumer Laptops",
    excerpt: "Why a 3-year-old corporate ThinkPad T480 performs better and lasts twice as long as a brand-new budget plastic notebook.",
    date: "02 Nov 2024",
    readTime: "5 min read",
    tag: "Hardware",
  },
  {
    slug: "demystifying-laptop-grades-a-plus-a-b-explained",
    title: "Demystifying Laptop Grades: What Do Grade A+, A, and B Mean?",
    excerpt: "Understanding NextGen IT Hub's strict cosmetic and functional grading taxonomy. What to expect from each condition tier.",
    date: "25 Oct 2024",
    readTime: "4 min read",
    tag: "Quality",
  },
];

export default function HomePage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showYoutubeEmbed, setShowYoutubeEmbed] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Live count-up animation state
  const [counters, setCounters] = useState({ laptops: 10000, clients: 500, satisfaction: 98, cities: 25 });
  const countersSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Animate counters up
          let progress = 0;
          const interval = setInterval(() => {
            progress += 1;
            setCounters({
              laptops: Math.min(12450, Math.floor(10000 + progress * 80)),
              clients: Math.min(620, Math.floor(500 + progress * 4)),
              satisfaction: 99,
              cities: Math.min(32, Math.floor(25 + progress * 0.3)),
            });
            if (progress >= 30) clearInterval(interval);
          }, 35);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (countersSectionRef.current) {
      observer.observe(countersSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Video Background + Trust + 3 CTAs)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[620px] lg:min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-sky-50/60 via-blue-50/20 to-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
        {/* Background Video / Graphic Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* HTML5 video background with fallback */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
            onLoadedData={() => setVideoLoaded(true)}
            className="w-full h-full object-cover opacity-10 dark:opacity-25 scale-105"
            poster="/images/hero-poster.jpg"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
            <source src="/videos/hero.webm" type="video/webm" />
          </video>

          {/* Fallback subtle geometric mesh when video is loading or unsupported */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 dark:opacity-20 pointer-events-none" />

          {/* Crisp white and light blue gradient overlay in light mode, dark gradient in dark mode */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-50/70 via-white/90 to-white dark:bg-slate-950/90 z-10" />
        </div>

        {/* Video Control & Placeholder Label */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <span className="text-[10px] text-blue-900 dark:text-slate-400 bg-white/95 dark:bg-slate-900/80 border border-blue-100 dark:border-slate-700/60 px-2 py-0.5 rounded backdrop-blur-sm shadow-xs font-medium">
            [PLACEHOLDER VIDEO: Testing Lab & Unboxing]
          </span>
          <button
            onClick={toggleVideoPlayback}
            className="p-1.5 rounded-full bg-white/95 dark:bg-slate-900/80 hover:bg-blue-50 dark:hover:bg-slate-800 text-blue-700 dark:text-slate-300 hover:text-blue-900 dark:hover:text-white border border-blue-200 dark:border-slate-700 transition-colors shadow-xs"
            aria-label={isVideoPlaying ? "Pause background video" : "Play background video"}
          >
            {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Hero Main Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center lg:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-8 space-y-6">
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-500/30 text-blue-800 dark:text-blue-300 text-xs sm:text-sm font-semibold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>India&apos;s Most Trusted Refurbished Laptop Destination</span>
              </div>

              {/* H1 Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                India&apos;s Most Trusted <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 dark:from-blue-400 dark:via-sky-300 dark:to-emerald-400">
                  Refurbished Laptops
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Quality-tested, grade-certified, GST invoice included. Free delivery across India. Save up to 70% on genuine Dell Latitude, Lenovo ThinkPad, HP EliteBook, and Apple MacBook hardware with full 6-month warranty.
              </p>

              {/* 3 CTAs: Shop Laptops (primary), Get Bulk Quote (secondary outline), Book Live Demo (ghost) */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all text-sm sm:text-base group"
                >
                  <span>Shop Laptops</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/bulk-order"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-transparent hover:bg-blue-50 dark:hover:bg-slate-900/60 text-blue-900 dark:text-slate-100 font-semibold px-6 py-3.5 rounded-xl border border-blue-200 dark:border-slate-600 hover:border-blue-400 transition-all text-sm sm:text-base shadow-xs"
                >
                  <Building2 className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span>Get Bulk Quote</span>
                </Link>

                <Link
                  href="/video-demo"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white font-medium px-4 py-3.5 text-sm transition-colors group"
                >
                  <Video className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Book Live Demo</span>
                </Link>
              </div>

              {/* Trust Micro Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 6-Month Warranty
                </span>
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 7-Day Replacement
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" /> 18% GST Input Invoice
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Free Pan-India Delivery
                </span>
              </div>
            </div>

            {/* Live Inspection Preview Box */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="bg-white/95 dark:bg-slate-900/90 border border-blue-100 dark:border-slate-700/80 rounded-2xl p-6 shadow-xl shadow-blue-500/10 dark:shadow-2xl backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Live Video Inspection</span>
                  </div>
                  <span className="text-[11px] bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-slate-300 font-semibold px-2 py-0.5 rounded border border-blue-200/60 dark:border-transparent">Free 15 Mins</span>
                </div>

                <div className="aspect-video bg-gradient-to-br from-blue-50 via-sky-50/60 to-white dark:bg-slate-950 rounded-xl overflow-hidden relative flex items-center justify-center border border-blue-100 dark:border-slate-800">
                  <div className="text-center p-4">
                    <Laptop className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-2 animate-pulse" />
                    <p className="text-xs font-bold text-blue-950 dark:text-slate-200">Inspect Before You Buy</p>
                    <p className="text-[10px] text-blue-800/80 dark:text-slate-400 mt-1">Our engineer turns on the machine & tests ports live on camera</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Available Slots Today:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">4 slots open (IST)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">No App Needed:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">Direct WebRTC Browser Join</span>
                  </div>
                </div>

                <Link
                  href="/video-demo"
                  className="block text-center w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-md"
                >
                  Schedule Your Live Demo
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. TRUST BADGES (6 Pillars of Confidence)
         ───────────────────────────────────────────────────────────── */}
      <section className="bg-blue-50/40 dark:bg-slate-900 border-y border-blue-100 dark:border-slate-800 py-6 theme-transition overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 text-center min-w-[540px] sm:min-w-0">
            
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-100/90 dark:border-slate-700/60 shadow-xs flex flex-col items-center justify-center space-y-1">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">6-Month Warranty</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Zero-cost repairs</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-100/90 dark:border-slate-700/60 shadow-xs flex flex-col items-center justify-center space-y-1">
              <RotateCcw className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">30-Day Return</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">7-day replacement</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-100/90 dark:border-slate-700/60 shadow-xs flex flex-col items-center justify-center space-y-1">
              <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">Grade Certified</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">A+, A, B standards</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-100/90 dark:border-slate-700/60 shadow-xs flex flex-col items-center justify-center space-y-1">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">GST Invoice</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Claim 18% Input Credit</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-100/90 dark:border-slate-700/60 shadow-xs flex flex-col items-center justify-center space-y-1">
              <Truck className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">Free Delivery</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Pan-India Bluedart</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-100/90 dark:border-slate-700/60 shadow-xs flex flex-col items-center justify-center space-y-1">
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">100% Tested</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">50-point diagnostics</p>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. FEATURED LAPTOPS GRID
         ───────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-white dark:bg-slate-950 theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Certified Stock Ready to Ship</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Featured Laptops
              </h2>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <Link
                href="/shop"
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1"
              >
                <span>View All ({FEATURED_LAPTOPS.length}+)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Laptops Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_LAPTOPS.map((laptop) => (
              <LaptopCard key={laptop.id} laptop={laptop} />
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. CATEGORIES SECTION (Brands + Use Cases + Price Ranges)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-white dark:bg-slate-900/50 border-t border-blue-100 dark:border-slate-800 theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Find exactly what matches your workload, budget, or preferred brand.
            </p>
          </div>

          {/* 1. Brand Cards (Dell, HP, Lenovo, Apple, Asus, Acer) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Popular Brands</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { name: "Dell", series: "Latitude & Precision", from: "₹18,999" },
                { name: "HP", series: "EliteBook & ProBook", from: "₹21,499" },
                { name: "Lenovo", series: "ThinkPad & Yoga", from: "₹19,999" },
                { name: "Apple", series: "MacBook Air & Pro", from: "₹44,999" },
                { name: "Asus", series: "ExpertBook & ZenBook", from: "₹22,999" },
                { name: "Acer", series: "TravelMate & Swift", from: "₹17,999" },
              ].map((brand) => (
                <Link
                  key={brand.name}
                  href={`/shop?brand=${brand.name}`}
                  className="p-4 rounded-xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 hover:bg-blue-50/40 hover:shadow-md transition-all text-center group"
                >
                  <div className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {brand.name}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{brand.series}</p>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-2 inline-block">
                    From {brand.from}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* 2. Use-Case Cards (Business, Student, Gaming, Creative) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Shop by Use-Case</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/shop?useCase=business"
                className="p-5 rounded-2xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 hover:shadow-md transition-all flex items-start gap-4 group"
              >
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Business & Office</h4>
                  <p className="text-xs text-slate-500 mt-1">Durable magnesium chassis, spill-resistant keyboard & 10+ hr battery.</p>
                </div>
              </Link>

              <Link
                href="/shop?useCase=student"
                className="p-5 rounded-2xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-400 hover:shadow-md transition-all flex items-start gap-4 group"
              >
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Student & Coding</h4>
                  <p className="text-xs text-slate-500 mt-1">Budget-friendly i5/i7 portables with SSDs perfect for engineering & learning.</p>
                </div>
              </Link>

              <Link
                href="/shop?useCase=gaming"
                className="p-5 rounded-2xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-400 hover:shadow-md transition-all flex items-start gap-4 group"
              >
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Gaming & Workstation</h4>
                  <p className="text-xs text-slate-500 mt-1">Dedicated GPUs (Nvidia GTX/Quadro), high refresh rates, and quad cooling.</p>
                </div>
              </Link>

              <Link
                href="/shop?useCase=creative"
                className="p-5 rounded-2xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400 hover:shadow-md transition-all flex items-start gap-4 group"
              >
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Creative & Design</h4>
                  <p className="text-xs text-slate-500 mt-1">Color-accurate 4K/Retina displays, 32GB RAM & high-speed NVMe storage.</p>
                </div>
              </Link>
            </div>
          </div>

          {/* 3. Price Range Filters */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Shop by Budget</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                href="/shop?maxPrice=20000"
                className="p-4 rounded-xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 hover:bg-blue-50/50 text-center transition-all shadow-xs"
              >
                <span className="text-sm font-bold text-slate-900 dark:text-white">Under ₹20,000</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Reliable i5 8GB Laptops</p>
              </Link>

              <Link
                href="/shop?minPrice=20000&maxPrice=40000"
                className="p-4 rounded-xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 hover:bg-blue-50/50 text-center transition-all shadow-xs"
              >
                <span className="text-sm font-bold text-slate-900 dark:text-white">₹20,000 – ₹40,000</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Best Value Corporate Lots</p>
              </Link>

              <Link
                href="/shop?minPrice=40000&maxPrice=60000"
                className="p-4 rounded-xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 hover:bg-blue-50/50 text-center transition-all shadow-xs"
              >
                <span className="text-sm font-bold text-slate-900 dark:text-white">₹40,000 – ₹60,000</span>
                <p className="text-[11px] text-slate-500 mt-0.5">MacBooks & Precision Rigs</p>
              </Link>

              <Link
                href="/shop?minPrice=60000"
                className="p-4 rounded-xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 hover:bg-blue-50/50 text-center transition-all shadow-xs"
              >
                <span className="text-sm font-bold text-slate-900 dark:text-white">₹60,000+</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Flagship Workstations</p>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. LIVE COUNTERS (Animated with Intersection Observer)
         ───────────────────────────────────────────────────────────── */}
      <section ref={countersSectionRef} className="py-14 bg-white dark:bg-slate-950 theme-transition border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-blue-600 dark:text-blue-400">
                {counters.laptops.toLocaleString("en-IN")}+
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Laptops Sold</p>
              <p className="text-xs text-slate-500">Across retail & bulk lots</p>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400">
                {counters.clients}+
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Corporate Clients</p>
              <p className="text-xs text-slate-500">Startups, BPOs & IT firms</p>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-amber-600 dark:text-amber-400">
                {counters.satisfaction}%
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Happy Customers</p>
              <p className="text-xs text-slate-500">Verified Google reviews</p>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-purple-600 dark:text-purple-400">
                {counters.cities}+
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Cities Served</p>
              <p className="text-xs text-slate-500">Pan-India express delivery</p>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. "HOW WE TEST & REFURBISH" (5-Step Process + Click to Play Video)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white dark:bg-slate-900 theme-transition border-t border-blue-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-emerald-400">
              50-Point Inspection Standard
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              How We Test & Refurbish Every Laptop
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Unlike marketplaces selling untested second-hand goods, every machine undergoes a disciplined 5-step hardware restoration workflow.
            </p>
          </div>

          {/* 5-Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: "1",
                title: "Inspection",
                desc: "Sourced directly from corporate lease returns. Visual audit of chassis, hinges, screen panel, and keyboard.",
              },
              {
                step: "2",
                title: "Testing",
                desc: "CPU/GPU thermal stress test, MemTest RAM stability, SSD read/write health, and battery cycle analysis (>80%).",
              },
              {
                step: "3",
                title: "Refurbishing",
                desc: "Cooling fans ultrasonically cleaned, premium Arctic thermal paste reapplied, parts sanitized or replaced.",
              },
              {
                step: "4",
                title: "Quality Check",
                desc: "Rigorous secondary audit. Serial numbers logged and assigned to certificate. Graded as A+, A, or B.",
              },
              {
                step: "5",
                title: "Warranty & Pack",
                desc: "Original-grade power adapter, 6-month warranty card, GST invoice enclosed in multi-layer air cushions.",
              },
            ].map((s) => (
              <div key={s.step} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-blue-100 dark:border-slate-700 space-y-2.5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                  {s.step}
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{s.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Click-to-Play Lazy Video Embed */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-3xl overflow-hidden shadow-md">
            {showYoutubeEmbed ? (
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="NextGen IT Hub Refurbishing Process Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div
                onClick={() => setShowYoutubeEmbed(true)}
                className="aspect-video relative bg-gradient-to-br from-blue-50/70 via-sky-50/40 to-white hover:bg-blue-100/50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-blue-100 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center cursor-pointer group transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform mb-3">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Watch Behind the Scenes (2 Mins)</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">See how our technicians test, repaste & package your laptop in our Delhi facility</p>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 underline mt-2 font-medium">Click to load YouTube player</span>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. WHY CHOOSE US (6 Feature Cards)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white dark:bg-slate-950 theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Why Choose NextGen IT Hub?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Engineered from the ground up to eliminate risk when buying certified refurbished tech.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-xs hover:border-blue-300 hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-emerald-950/60 text-blue-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Transparent Grade System</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Objective A+, A, and B classifications. What you see on our site is exactly what arrives on your desk, guaranteed.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-xs hover:border-blue-300 hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-amber-950/60 text-sky-700 dark:text-amber-400 flex items-center justify-center font-bold">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">30-Day Return / 7-Day Swap</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Receive your unit and test it for 7 days. If there is any hardware defect or cosmetic discrepancy, we replace it immediately.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-xs hover:border-blue-300 hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">100% Legal GST Invoicing</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Every retail and bulk order comes with a legitimate GST tax invoice with serial number tracking, allowing 18% tax offset.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-xs hover:border-blue-300 hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-purple-950/60 text-indigo-700 dark:text-purple-400 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Volume Bulk Discounts</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Tiered enterprise pricing for 10 to 500+ units, custom OS master imaging, and dedicated corporate account support.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-xs hover:border-blue-300 hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center font-bold">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">1-on-1 Live Video Demo</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Book a 15-minute private call. Inspect the ports, hinges, screen brightness, and benchmark stats before paying.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-xs hover:border-blue-300 hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-indigo-950/60 text-blue-700 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Expert Engineering Support</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Dedicated Delhi-based technicians assist via phone, WhatsApp, and remote diagnostics throughout your 6-month warranty.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. PARTNERS STRIP ("Trusted by Companies Across India")
         ───────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-gradient-to-b from-blue-50/50 via-white to-blue-50/30 dark:bg-slate-900/60 border-y border-blue-100 dark:border-slate-800 theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              Enterprise Client Deployments
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Trusted by 500+ Companies Across India
            </h2>
            <p className="text-xs text-slate-500">
              Supplying certified IT fleets to premier startups, BPOs, logistics hubs & tech corporations.
            </p>
          </div>

          <PartnerLogos limit={8} showLink={true} />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. TESTIMONIALS SECTION (Customer Reviews + Rating Stars)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white dark:bg-slate-950 theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Verified Feedback
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                What Indian Customers Say
              </h2>
            </div>
            <Link href="/reviews" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mt-2 sm:mt-0 flex items-center gap-1">
              <span>View All 150+ Reviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <div className="border-t border-blue-100/80 dark:border-slate-800 pt-3 text-xs">
                  <strong className="text-slate-900 dark:text-white block">{t.name}</strong>
                  <span className="text-slate-500 block text-[11px]">{t.city}</span>
                  <span className="text-blue-600 dark:text-blue-400 text-[10px] font-semibold mt-1 block">
                    Bought: {t.laptop}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. LATEST BLOGS (3 Blog Post Cards)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-white dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Knowledge Base
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Latest Buying Guides & Analysis
              </h2>
            </div>
            <Link href="/blog" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mt-2 sm:mt-0 flex items-center gap-1">
              <span>Read All Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LATEST_BLOGS.map((blog) => (
              <article
                key={blog.slug}
                className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-transparent">
                      {blog.tag}
                    </span>
                    <span className="text-slate-400">{blog.readTime}</span>
                  </div>

                  <Link href={`/blog/${blog.slug}`}>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <Link
                  href={`/blog/${blog.slug}`}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 pt-2 border-t border-blue-100/60 dark:border-slate-800"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. FAQ PREVIEW (Common Questions with Accordion)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-white dark:bg-slate-950 theme-transition">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear answers on warranty, grading, GST invoicing & pan-India delivery.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "What is covered under the 6-Month Warranty?",
                a: "Our warranty covers all internal hardware components including the motherboard, display panel, RAM, SSD, keyboard, and power adapter. If a defect occurs, we repair or replace the machine at zero service cost.",
              },
              {
                q: "What is the difference between Grade A+ and Grade A?",
                a: "Grade A+ laptops are virtually indistinguishable from brand new units with no scratches or dents. Grade A laptops have very minor cosmetic wear from normal corporate desk use, but 100% flawless technical performance.",
              },
              {
                q: "How does the 'Book Live Video Demo' feature work?",
                a: "You select your desired laptop model and pick a convenient 15-minute slot. Our engineer connects with you via video call, starts the laptop, demonstrates screen viewing angles, ports, battery performance, and answers your technical questions.",
              },
              {
                q: "Can I get a GST input invoice for my company?",
                a: "Yes! During checkout or bulk quote request, simply enter your company's 15-digit GSTIN and legal name. We issue a formal 18% GST tax invoice allowing full input tax credit claim.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="border border-blue-100 hover:border-blue-300 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/60 shadow-xs transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-semibold text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transform transition-transform ${
                      activeFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/faq"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View All Frequently Asked Questions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          12. HIGH-IMPACT FINAL CTA BANNER
         ───────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white py-16 theme-transition">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to upgrade? Get the best refurbished laptops in India.
          </h2>
          <p className="text-xs sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Join 12,000+ satisfied developers, students, and businesses equipping their teams with certified enterprise hardware backed by our 6-month comprehensive warranty.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-white text-blue-900 hover:bg-slate-100 font-bold px-8 py-3.5 rounded-xl shadow-xl transition-colors text-xs sm:text-sm"
            >
              Shop Now
            </Link>
            <Link
              href="/bulk-order"
              className="w-full sm:w-auto bg-blue-900/80 hover:bg-blue-900 text-white font-semibold px-8 py-3.5 rounded-xl border border-blue-400/40 transition-colors text-xs sm:text-sm"
            >
              Get Bulk Quote
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
