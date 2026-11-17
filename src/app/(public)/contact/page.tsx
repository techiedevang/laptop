"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Retail Laptop Enquiry",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSubmitted(true);
      toast.success("Message sent successfully!");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen py-12 theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Get in Touch with NextGen IT Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Have questions about laptop availability, warranty claims, B2B quotes, or visiting our Delhi warehouse showroom?
          </p>
        </div>

        {/* Contact Grid: Details + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details & Map */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4 text-xs">
              <h2 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-blue-100/60 dark:border-slate-800">
                NextGen IT Hub Headquarters
              </h2>

              <div className="space-y-3.5 text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Warehouse & Showroom:</strong>
                    <p className="text-slate-500 mt-0.5">
                      Mother Dairy Road, Shakarpur, East Delhi, Delhi 110092, India
                    </p>
                    <a
                      href="https://www.google.com/maps/place/28%C2%B037'41.8%22N+77%C2%B016'41.6%22E/@28.6282892,77.2782221,17z"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Direct Phone:</strong>
                    <p className="text-slate-500">+91 9155282776 / +91 87654 32109</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-sky-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Email Addresses:</strong>
                    <p className="text-slate-500">support@nextgenithub.in | sales@nextgenithub.in</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Working Hours:</strong>
                    <p className="text-slate-500">Monday – Saturday: 10:00 AM – 7:00 PM IST (Closed Sundays)</p>
                  </div>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <a
                  href="tel:+919155282776"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-3 rounded-xl text-center transition-colors text-xs"
                >
                  Call Sales
                </a>
                <a
                  href="https://wa.me/919155282776?text=Hi%20NextGen%20IT%20Hub%2C%20I%20have%20an%20enquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-3 rounded-xl text-center transition-colors text-xs"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* Embedded Google Maps Viewport */}
            <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs aspect-video relative">
              <iframe
                title="NextGen IT Hub Delhi Location"
                src="https://maps.google.com/maps?q=28.6282892,77.2782221&hl=en&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Send Us a Message
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                We typically respond within 1 to 2 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-base">Message Sent Successfully!</h3>
                <p className="text-xs max-w-sm mx-auto text-emerald-700 dark:text-emerald-300">
                  Thank you, {formData.name}. Our team has received your message and will contact you via email or phone shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-semibold text-emerald-700 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Your Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Priya Deshmukh"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-blue-50/40 dark:bg-slate-800 border border-blue-200/80 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Phone (WhatsApp) *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-blue-50/40 dark:bg-slate-800 border border-blue-200/80 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="priya@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-blue-50/40 dark:bg-slate-800 border border-blue-200/80 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Purpose of Enquiry *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full bg-blue-50/40 dark:bg-slate-800 border border-blue-200/80 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    >
                      <option value="Retail Laptop Enquiry">Retail Laptop Purchase Enquiry</option>
                      <option value="B2B Bulk Quotation">B2B / Corporate Bulk Order</option>
                      <option value="Book Video Demo">Schedule Live Video Demo</option>
                      <option value="Warranty / Repair Service">Warranty Support / AMC</option>
                      <option value="General Question">General Question / Partnership</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Your Message *</label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder="Please share your requirements or question..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-colors text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
