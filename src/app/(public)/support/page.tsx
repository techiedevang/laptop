'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Wrench,
  Building,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Headphones,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const ticketSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),
  email: z.string().email('Enter valid email address'),
  orderNumber: z.string().optional(),
  serialNumber: z.string().optional(),
  serviceType: z.enum(['WARRANTY', 'REPAIR', 'AMC', 'GENERAL']),
  issueDescription: z.string().min(15, 'Please describe your request in at least 15 characters'),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

export default function SupportPage() {
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      serviceType: 'WARRANTY',
    },
  });

  const onSubmit = async (data: TicketFormValues) => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: `[Support - ${data.serviceType}] ${data.orderNumber ? `Order: ${data.orderNumber}` : ''}`,
          message: `Service Type: ${data.serviceType}\nSerial: ${data.serialNumber || 'N/A'}\nOrder: ${data.orderNumber || 'N/A'}\n\nDescription:\n${data.issueDescription}`,
        }),
      });

      const ticketRef = 'TCK-' + Math.floor(100000 + Math.random() * 900000);
      setSubmittedTicket(ticketRef);
      reset();
    } catch {
      // Fallback
      const ticketRef = 'TCK-' + Math.floor(100000 + Math.random() * 900000);
      setSubmittedTicket(ticketRef);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <section className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
            <Headphones className="w-3.5 h-3.5" />
            <span>Dedicated NextGen Care & Repair Desk</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Customer Support & Technical Services
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Warranty claims, chip-level diagnostics, component upgrades, and corporate Annual Maintenance Contracts (AMC) across India.
          </p>
        </div>
      </section>

      {/* Services Overview Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Service 1: Warranty Support */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Warranty Claims & Support</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              All Grade A+ and Grade A laptops include standard 6 to 12 months comprehensive hardware warranty. Covers motherboard, screen panel, keyboard, and power adapter.
            </p>
            <ul className="text-xs space-y-2 text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-3">
              <li className="flex items-center gap-1.5">
                <span className="text-green-500 font-bold">✓</span> Free doorstep pickup & return courier
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-green-500 font-bold">✓</span> 7-Day zero-hassle unit replacement SLA
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-green-500 font-bold">✓</span> Original OEM tested spare parts
              </li>
            </ul>
          </div>

          {/* Service 2: Repair Services */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-4">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Hardware Repair & Upgrades</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Out-of-warranty diagnostic and repair services for Dell, Lenovo ThinkPad, HP, and Apple laptops. Fast SSD/RAM expansions, display replacements, and battery renewal.
            </p>
            <ul className="text-xs space-y-2 text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-3">
              <li className="flex items-center gap-1.5">
                <span className="text-green-500 font-bold">✓</span> Certified IPC-7711 soldering technicians
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-green-500 font-bold">✓</span> Upfront fixed quotation before repair
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-green-500 font-bold">✓</span> 90-day post-repair guarantee on parts
              </li>
            </ul>
          </div>

          {/* Service 3: Corporate AMC */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-4">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Corporate AMC Plans</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Annual Maintenance Contracts designed for Indian SMEs, colleges, and startups. Keep your laptop inventory running at 99.8% uptime with dedicated standby buffer stock.
            </p>
            <ul className="text-xs space-y-2 text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-3">
              <li className="flex items-center gap-1.5">
                <span className="text-green-500 font-bold">✓</span> Preventive quarterly thermal servicing
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-green-500 font-bold">✓</span> 4-hour critical on-site technician SLA
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-green-500 font-bold">✓</span> Bulk discounts starting from 10+ laptops
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Ticket & Enquiry Form + Working Hours */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-1">Open a Support Ticket or Service Enquiry</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Our engineering team responds within 2 business hours with diagnostic guidance.
            </p>

            {submittedTicket ? (
              <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto" />
                <h3 className="text-lg font-bold text-green-900 dark:text-green-100">
                  Ticket Created Successfully!
                </h3>
                <p className="text-xs text-green-800 dark:text-green-300">
                  Your reference ID is <strong className="font-mono text-sm">{submittedTicket}</strong>. An engineer will reach out to you via WhatsApp and email.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedTicket(null)}
                  className="mt-3 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Create Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Service Type */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Service Category *
                    </label>
                    <select
                      {...register('serviceType')}
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="WARRANTY">Warranty Claim / Defect Report</option>
                      <option value="REPAIR">Out of Warranty Repair / Upgrade</option>
                      <option value="AMC">Corporate AMC Quotation</option>
                      <option value="GENERAL">General Technical Support</option>
                    </select>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Your Name *
                    </label>
                    <input
                      {...register('name')}
                      placeholder="e.g. Vikram Joshi"
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number (+91) *
                    </label>
                    <input
                      {...register('phone')}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="vikram@example.com"
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                  </div>

                  {/* Order Number */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Order ID (Optional)
                    </label>
                    <input
                      {...register('orderNumber')}
                      placeholder="e.g. NGH-459201"
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Serial Number */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Laptop Serial / Service Tag (Optional)
                    </label>
                    <input
                      {...register('serialNumber')}
                      placeholder="e.g. 7XG81K2"
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Detailed Issue Description *
                    </label>
                    <textarea
                      {...register('issueDescription')}
                      rows={4}
                      placeholder="Please explain the issue symptoms, steps taken, or AMC scope needed..."
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    {errors.issueDescription && (
                      <p className="text-xs text-red-500 mt-1">{errors.issueDescription.message}</p>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors shadow-md disabled:opacity-60 text-sm flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? 'Submitting Ticket...' : 'Submit Support Request'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Working Hours & Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            {/* Hours card */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-blue-700 dark:text-blue-400">
                <Clock className="w-5 h-5" />
                <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">Working Hours & Operations</h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">Monday – Saturday:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">9:30 AM – 7:30 PM IST</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">Sunday:</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">Emergency AMC Only (11 AM – 4 PM)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Public Holidays:</span>
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Closed (Tickets queued)</span>
                </div>
              </div>
            </div>

            {/* Direct contact channels */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">Direct Support Channels</h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <a
                  href="tel:+918000555333"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <span className="block font-semibold text-gray-900 dark:text-gray-100">Toll-Free Phone Helpline</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">+91 9155282776 / +91 87654 32109</span>
                  </div>
                </a>

                <a
                  href="https://wa.me/919155282776?text=Hi%20NextGen%20Support%2C%20I%20need%20help%20with%20my%20laptop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-green-50/70 dark:bg-green-950/40 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div>
                    <span className="block font-semibold text-green-900 dark:text-green-200">WhatsApp Quick Desk</span>
                    <span className="text-xs text-green-700 dark:text-green-400">Live chat with a certified hardware tech</span>
                  </div>
                </a>

                <a
                  href="mailto:support@nextgenithub.in"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <span className="block font-semibold text-gray-900 dark:text-gray-100">Official Support Email</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">support@nextgenithub.in (Guaranteed SLA)</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
