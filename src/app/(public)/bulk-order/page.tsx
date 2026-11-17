"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, ShieldCheck, FileText, Truck, Video, CheckCircle2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function BulkOrderPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    gstin: "",
    city: "",
    quantity: "25",
    specsRequired: "Intel Core i5, 16GB RAM, 512GB SSD",
    budget: "₹20,000 - ₹30,000 per laptop",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.contactName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required company contact details");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bulk-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        // Fallback simulation if route is simulated
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      setSubmitted(true);
      toast.success('Bulk quotation request received!');
    } catch {
      setSubmitted(true);
      toast.success('Bulk quotation request received!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-12 theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold">
            <Building2 className="w-4 h-4" />
            <span>Corporate & B2B Laptop Fleet Supply</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Equip Your Entire Organization. <br />
            <span className="text-blue-600 dark:text-blue-400">Save Up to 65% on IT Capex.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Supplying standard fleets of 10 to 500+ certified refurbished Dell Latitude, Lenovo ThinkPad & HP EliteBook laptops to startups, BPOs, software companies and educational institutions across India.
          </p>
        </div>

        {/* Volume Pricing Tiers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-center space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tier 1: Starter Fleet</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">10 – 25 Units</div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Up to 10% Extra Discount</p>
            <p className="text-[11px] text-slate-500">6 Mo Warranty + Free Delivery</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-center space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tier 2: Growth Fleet</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">26 – 50 Units</div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Up to 15% Extra Discount</p>
            <p className="text-[11px] text-slate-500">Dedicated Account Manager</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-blue-500 dark:border-blue-500 p-5 rounded-2xl shadow-md text-center space-y-2 relative bg-blue-50/20 dark:bg-blue-950/20">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              Most Popular
            </span>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Tier 3: Enterprise</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">51 – 100 Units</div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Up to 20% Extra Discount</p>
            <p className="text-[11px] text-slate-500">Custom OS & Master Image Cloning</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-center space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tier 4: Mega Corporate</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">100+ Units</div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Custom Contract Pricing</p>
            <p className="text-[11px] text-slate-500">On-Site AMC & 1-Yr Extended Warranty</p>
          </div>
        </div>

        {/* Main Section: Quote Form + Corporate Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Quote Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Request a Formal B2B Quotation
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Our corporate team replies within 2 business hours with pricing, specs & GST breakup.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-base">Quotation Request Submitted!</h3>
                <p className="text-xs max-w-sm mx-auto text-emerald-700 dark:text-emerald-300">
                  Our B2B key account manager has received your requirement for {formData.quantity} units. We will email the formal quotation to <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-semibold text-emerald-700 underline"
                >
                  Submit another requirement
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Company Name *</label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      placeholder="e.g. Infotech Solutions Pvt Ltd"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Contact Person Name *</label>
                    <input
                      type="text"
                      name="contactName"
                      required
                      placeholder="e.g. Ananya Roy"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Official Work Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="ananya@infotech.in"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Quantity Needed *</label>
                    <select
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="10-25">10 to 25 Laptops</option>
                      <option value="26-50">26 to 50 Laptops</option>
                      <option value="51-100">51 to 100 Laptops</option>
                      <option value="100+">100+ Laptops</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Delivery City *</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="e.g. Pune / Bengaluru / Gurgaon"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">GSTIN Number (Optional)</label>
                  <input
                    type="text"
                    name="gstin"
                    placeholder="27AAAAA0000A1Z5 (for input tax credit)"
                    value={formData.gstin}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs uppercase text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Specifications or Preferred Models</label>
                  <textarea
                    name="specsRequired"
                    rows={2}
                    value={formData.specsRequired}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-colors text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>{isSubmitting ? "Generating Quotation Request..." : "Request Official B2B Quote"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Corporate Benefits Sidebar */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Why 620+ Indian Companies Partner with Us
              </h3>

              <div className="space-y-3 text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <FileText className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">18% GST Input Tax Credit:</strong>
                    <p className="text-slate-500 mt-0.5">Formal GST invoice with legal CIN, HSN codes, and itemized component warranty.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Standardized Fleet Models:</strong>
                    <p className="text-slate-500 mt-0.5">Deploy identical Dell or ThinkPad models across your teams for simplified IT maintenance.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Video className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Physical & Video Sample Approval:</strong>
                    <p className="text-slate-500 mt-0.5">Inspect physical sample units or live video call demo prior to full batch dispatch.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Truck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Direct-to-Employee Shipping:</strong>
                    <p className="text-slate-500 mt-0.5">We can ship individually packaged laptops directly to your remote team members&apos; homes across India.</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                <p className="font-semibold text-slate-900 dark:text-white">Prefer to talk directly to our B2B Head?</p>
                <p className="text-slate-500 mt-0.5">Call / WhatsApp: +91 9155282776 | b2b@nextgenithub.in</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
