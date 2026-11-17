"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Laptop, 
  CheckCircle2, 
  CreditCard,
  ExternalLink,
  Send,
  Check
} from "lucide-react";
import toast from "react-hot-toast";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubscribed(true);
    toast.success("Thank you for subscribing to refurbished laptop deals!");
    setEmail("");
  };

  return (
    <footer className="bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 border-t border-blue-100 dark:border-slate-800 transition-colors">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-blue-100 dark:border-slate-800 bg-blue-50/40 dark:bg-slate-900/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">6 Months Comprehensive Warranty</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">50+ Point Hardware QC</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CreditCard className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">GST Invoice with Input Credit</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Laptop className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">Live Video Demo Before Buying</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Company Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center group py-1" aria-label="NextGen IT Hub Home">
              <Logo height={48} className="h-11 sm:h-12 w-auto transition-transform duration-200 group-hover:scale-105" />
            </Link>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Trusted Refurbished Laptops Since 2020
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm leading-relaxed">
              India&apos;s trusted destination for enterprise-grade refurbished laptops. Serving B2B bulk orders and retail individual customers with certified Grade A+/A hardware, verified GST invoices, and end-to-end support.
            </p>

            {/* Newsletter Signup */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">Subscribe for Flash Sales & Bulk Inventory Alerts</p>
              {subscribed ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-lg p-2.5">
                  <Check className="w-4 h-4" />
                  <span>Subscribed! We will alert you on fresh corporate lots.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your corporate or personal email"
                    className="flex-1 bg-blue-50/40 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-3.5 py-2 rounded-lg text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>Join</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>

            {/* Contact details */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-2">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span>NextGen IT Hub, Mother Dairy Road, Shakarpur, East Delhi, Delhi 110092, India</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>+91 9155282776 / +91 87654 32109</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>hello@nextgenithhub.com | support@nextgenithub.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Mon - Sat: 10:00 AM - 7:00 PM IST (Closed Sunday)</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2 flex items-center space-x-3 text-slate-500 dark:text-slate-400">
              <a
                href="https://facebook.com/nextgenithub"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="https://instagram.com/nextgenithub"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors p-1"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href="https://linkedin.com/company/nextgenithub"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors p-1"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a
                href="https://twitter.com/nextgenithub"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors p-1"
                aria-label="X (Twitter)"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="https://youtube.com/@nextgenithub"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-600 dark:hover:text-red-500 transition-colors p-1"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a
                href="https://wa.me/919155282776"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-1"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column 1: Shop */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Shop</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/shop" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">All Laptops</Link></li>
              <li><Link href="/shop?brand=Dell" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dell Latitude & XPS</Link></li>
              <li><Link href="/shop?brand=Lenovo" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Lenovo ThinkPads</Link></li>
              <li><Link href="/shop?brand=HP" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">HP EliteBooks</Link></li>
              <li><Link href="/shop?brand=Apple" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Apple MacBooks</Link></li>
              <li><Link href="/bulk-order" className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors">Bulk / B2B Quotes</Link></li>
              <li><Link href="/video-demo" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">Book Live Video Demo</Link></li>
            </ul>
          </div>

          {/* Quick Links Column 2: Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog & Guides</Link></li>
              <li><Link href="/reviews" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Customer Reviews</Link></li>
              <li><Link href="/compare" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Why NextGen IT Hub</Link></li>
              <li><Link href="/bulk-order" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Corporate Partnerships</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Our Team</Link></li>
            </ul>
          </div>

          {/* Quick Links Column 3: Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Support</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Help & Contact</Link></li>
              <li><Link href="/faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/service-coverage" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pincode Serviceability</Link></li>
              <li><Link href="/account/orders" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Track Order</Link></li>
              <li><Link href="/warranty-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Warranty Claim</Link></li>
              <li><Link href="/return-refund-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>

          {/* Quick Links Column 4: Policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase">Policies</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/warranty-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Warranty Policy (6 Mo)</Link></li>
              <li><Link href="/return-refund-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Return & Refund Policy</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy (DPDP Act)</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
              <li><Link href="/grievance-officer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Grievance Officer</Link></li>
            </ul>
          </div>

        </div>

        {/* Payment & Location Info Strip */}
        <div className="mt-12 pt-8 border-t border-blue-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-slate-700 dark:text-slate-300 mr-1">Accepted Payment Methods:</span>
            <span className="bg-blue-50/60 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 px-2.5 py-1 rounded text-blue-900 dark:text-slate-200 font-medium">UPI (GPay, PhonePe, Paytm)</span>
            <span className="bg-blue-50/60 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 px-2.5 py-1 rounded text-blue-900 dark:text-slate-200 font-medium">Razorpay</span>
            <span className="bg-blue-50/60 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 px-2.5 py-1 rounded text-blue-900 dark:text-slate-200 font-medium">Visa</span>
            <span className="bg-blue-50/60 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 px-2.5 py-1 rounded text-blue-900 dark:text-slate-200 font-medium">Mastercard</span>
            <span className="bg-blue-50/60 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 px-2.5 py-1 rounded text-blue-900 dark:text-slate-200 font-medium">Cash on Delivery (COD)</span>
          </div>
          <div className="flex items-center space-x-2">
            <a 
              href="https://www.google.com/maps/place/28%C2%B037'41.8%22N+77%C2%B016'41.6%22E/@28.6282892,77.2782221,17z" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center space-x-1 font-medium"
            >
              <span>View On Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* GSTIN and Copyright */}
        <div className="mt-6 pt-6 border-t border-blue-100/70 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <p>© 2024 NextGen IT Hub. All rights reserved.</p>
          <p>NextGen IT Hub | GSTIN: [PLACEHOLDER] | CIN: [PLACEHOLDER]</p>
        </div>
      </div>
    </footer>
  );
}
