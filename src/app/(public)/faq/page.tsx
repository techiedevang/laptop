"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";

interface FAQItem {
  category: string;
  q: string;
  a: string;
}

const ALL_FAQS: FAQItem[] = [
  // Warranty
  {
    category: "Warranty",
    q: "What does NextGen IT Hub's 6-Month Warranty cover?",
    a: "Our warranty covers 100% of internal hardware components including the motherboard, processor, display screen, RAM, SSD, keyboard, touchpad, internal cooling fan, and charger. If any hardware fault arises, our engineers repair or replace the part without charging service or component fees.",
  },
  {
    category: "Warranty",
    q: "How do I claim warranty if I live outside Delhi NCR?",
    a: "We provide hassle-free pickup and return warranty across all 28 states of India. You can submit a warranty ticket online or message our WhatsApp support (+91 9155282776). We arrange an insured Bluedart return pickup, service the machine at our central facility, and return it to your doorstep.",
  },
  {
    category: "Warranty",
    q: "Can I extend my warranty to 1 year or 2 years?",
    a: "Yes! During checkout or within 30 days of purchase, you can upgrade to our 1-Year Comprehensive Warranty (for ₹1,499) or 2-Year Extended Care (for ₹2,999).",
  },

  // Returns & Refund
  {
    category: "Returns & Refund",
    q: "What is your 7-Day Replacement Policy?",
    a: "If you receive a laptop and encounter any hardware issue or cosmetic mismatch with the certified grade within 7 days of delivery, you can request an instant 1-to-1 replacement or full refund.",
  },
  {
    category: "Returns & Refund",
    q: "How long does a refund take to reflect in my bank account?",
    a: "Once the laptop is received back and inspected at our hub (typically 24 hours after arrival), we initiate the refund immediately via Razorpay. UPI and card refunds reflect in 2 to 4 business days.",
  },

  // Video Demo
  {
    category: "Video Demo",
    q: "How does the 'Book Live Video Demo' work?",
    a: "You pick an available 15-minute slot on our site. You will receive a WhatsApp and email confirmation with a secure join link (no app download needed). Our warehouse engineer will join on camera to show you the exact laptop, its serial number, physical condition, ports, and live screen display.",
  },
  {
    category: "Video Demo",
    q: "Do I have to turn on my camera during the video call?",
    a: "No! Turning on your camera is completely optional. You can just watch the engineer's video feed and speak with them via voice or in-call chat.",
  },

  // Payment & Pricing
  {
    category: "Payment & Pricing",
    q: "What payment methods are supported?",
    a: "We support Razorpay Checkout (UPI, Google Pay, PhonePe, Paytm, RuPay, Visa, Mastercard, Netbanking), Bank NEFT/RTGS for corporate orders, and Cash on Delivery (COD) for eligible pincodes across India.",
  },
  {
    category: "Payment & Pricing",
    q: "Do your prices include GST?",
    a: "Yes, all listed prices on our website are inclusive of 18% Goods and Services Tax (GST). If you enter your GSTIN during checkout, you receive a tax invoice enabling your business to claim full input tax credit.",
  },

  // Bulk Orders & B2B
  {
    category: "Bulk Orders",
    q: "What is the minimum quantity for corporate bulk B2B pricing?",
    a: "Our bulk pricing tiers begin at 10 units. We offer escalating volume discounts for 10-25 units, 26-50 units, 51-100 units, and custom enterprise contracts for 100+ laptops.",
  },
  {
    category: "Bulk Orders",
    q: "Can you pre-install custom operating systems or company software?",
    a: "Yes! For corporate bulk orders, our engineers can image your fleet with specific OS configurations (Windows 11 Pro, Ubuntu LTS, custom golden image), setup domain joins, and pre-install productivity software.",
  },

  // Quality & Testing
  {
    category: "Quality & Testing",
    q: "What is a 50-Point Diagnostics Check?",
    a: "Every single laptop we source undergoes rigorous hardware checks: CPU/GPU thermal stress testing, MemTest RAM stability, CrystalDisk SSD health analysis, battery health verification (>80%), display color and pixel test, keyboard key registration, and all I/O port testing.",
  },
  {
    category: "Quality & Testing",
    q: "What battery backup can I expect on a refurbished laptop?",
    a: "We guarantee that all Grade A+ and Grade A laptops have genuine batteries with minimum 80% original design capacity remaining, typically delivering 3 to 6 hours of typical office/coding use depending on the model.",
  },
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = ["ALL", "Warranty", "Returns & Refund", "Video Demo", "Payment & Pricing", "Bulk Orders", "Quality & Testing"];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": ALL_FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  const filteredFaqs = ALL_FAQS.filter((faq) => {
    if (selectedCategory !== "ALL" && faq.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-12 theme-transition">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support Knowledgebase</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Everything you need to know about purchasing, warranty, testing, and bulk ordering refurbished laptops from NextGen IT Hub.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-lg mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions (e.g. warranty, battery, return, GST)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {cat === "ALL" ? "All Categories" : cat}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900 dark:text-white"
                  >
                    <span className="flex-1">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transform transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No questions found matching your search.</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("ALL"); }}
                className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
