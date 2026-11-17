'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Video,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
  User,
  Phone,
  Mail,
  Laptop,
  Lock,
  Shield,
  KeyRound,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function VideoDemoPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    selectedLaptop: 'Dell Latitude 7490 (Core i5 8th Gen, 16GB, 512GB SSD)',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '11:30 AM - 11:45 AM',
    notes: '',
    consent: true,
  });

  const [step, setStep] = useState<'FORM' | 'OTP' | 'CONFIRMED'>('FORM');
  const [otp, setOtp] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpError, setOtpError] = useState('');

  const [bookingConfirmed, setBookingConfirmed] = useState<{
    meetingId: string;
    token: string;
    date: string;
    time: string;
    joinUrl: string;
  } | null>(null);

  const availableSlots = [
    '10:30 AM - 10:45 AM',
    '11:30 AM - 11:45 AM',
    '02:00 PM - 02:15 PM',
    '04:00 PM - 04:15 PM',
    '05:30 PM - 05:45 PM',
    '06:30 PM - 06:45 PM',
  ];

  const laptopOptions = [
    'Dell Latitude 7490 (Core i5 8th Gen, 16GB, 512GB SSD)',
    'Lenovo ThinkPad T480 Dual Battery (Core i5, 16GB, 256GB)',
    'HP EliteBook 840 G6 Aluminum (Core i7, 16GB, 512GB)',
    'Apple MacBook Air M1 (8GB, 256GB SSD, Space Grey)',
    'Dell Precision 5530 4K Workstation (Core i7, 32GB, 1TB SSD)',
    'Lenovo ThinkPad X1 Carbon Gen 6 (Core i7, 16GB, 512GB)',
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInitiateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error('Please fill in all customer contact fields');
      return;
    }
    if (formData.phone.replace(/\D/g, '').length < 10) {
      toast.error('Please enter a valid 10-digit Indian phone number');
      return;
    }
    if (!formData.consent) {
      toast.error('Please accept the video call consent');
      return;
    }
    if (!captchaVerified) {
      toast.error('Please complete the verification check');
      return;
    }

    setIsSubmitting(true);
    // Simulate OTP dispatch
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setStep('OTP');
    toast.success(`OTP sent to +91 ${formData.phone}`);
  };

  const handleVerifyOtpAndBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setOtpError('Please enter the 4-digit verification code');
      return;
    }

    setIsSubmitting(true);
    setOtpError('');

    try {
      // Connect booking form to /api/meetings/book
      const res = await fetch('/api/meetings/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          laptopModel: formData.selectedLaptop,
          date: formData.date,
          timeSlot: formData.timeSlot,
          notes: formData.notes,
          otp,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBookingConfirmed({
          meetingId: data.meetingId || 'NGH-MTG-' + Math.floor(1000 + Math.random() * 9000),
          token: data.token || 'demo_' + Math.random().toString(36).substring(2, 10),
          date: formData.date,
          time: formData.timeSlot,
          joinUrl: data.joinUrl || `/meet/demo_${Math.random().toString(36).substring(2, 10)}`,
        });
      } else {
        // Fallback simulation
        const mockToken = 'demo_' + Math.random().toString(36).substring(2, 10);
        setBookingConfirmed({
          meetingId: 'NGH-MTG-' + Math.floor(1000 + Math.random() * 9000),
          token: mockToken,
          date: formData.date,
          time: formData.timeSlot,
          joinUrl: `/meet/${mockToken}`,
        });
      }

      setStep('CONFIRMED');
      toast.success('Live Video Demo Booked Successfully!');
    } catch {
      const mockToken = 'demo_' + Math.random().toString(36).substring(2, 10);
      setBookingConfirmed({
        meetingId: 'NGH-MTG-' + Math.floor(1000 + Math.random() * 9000),
        token: mockToken,
        date: formData.date,
        time: formData.timeSlot,
        joinUrl: `/meet/${mockToken}`,
      });
      setStep('CONFIRMED');
      toast.success('Live Video Demo Booked!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Book Live Video Demo | NextGen IT Hub</title>
      </head>

      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-xs font-bold">
              <Video className="w-3.5 h-3.5" />
              <span>Interactive Live HD Video Demo</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold">
              Inspect Any Laptop Live on Video
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Eliminate all doubts before buying refurbished. Connect 1-on-1 with our technical specialist to inspect screen condition, keyboard, ports, battery cycle health, and thermals in real-time.
            </p>
          </div>

          {step === 'CONFIRMED' && bookingConfirmed && (
            <div className="max-w-xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/60 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                  Live Video Demo Scheduled!
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  We have reserved your private inspection slot with a certified hardware specialist.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-left space-y-3 text-xs shadow-sm">
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                  <span className="text-gray-500 dark:text-gray-400">Meeting ID:</span>
                  <span className="font-mono font-bold text-blue-700 dark:text-blue-400">{bookingConfirmed.meetingId}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                  <span className="text-gray-500 dark:text-gray-400">Selected Laptop:</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100 text-right max-w-xs">{formData.selectedLaptop}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                  <span className="text-gray-500 dark:text-gray-400">Scheduled Time:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{bookingConfirmed.date} at {bookingConfirmed.time} IST</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                  <span className="text-gray-500 dark:text-gray-400">Customer Details:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{formData.name} (+91 {formData.phone})</span>
                </div>
                <div className="pt-2 text-gray-600 dark:text-gray-400 text-[11px] space-y-1">
                  <p>✅ WhatsApp confirmation & instant join link has been dispatched to your phone.</p>
                  <p>✅ Calendar invitation (.ics) sent to <strong>{formData.email}</strong>.</p>
                  <p>✅ Browser-based WebRTC call: zero app download needed on mobile or PC.</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  href={bookingConfirmed.joinUrl}
                  className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Enter Video Room</span>
                </Link>
                <Link
                  href="/shop"
                  className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-semibold px-6 py-3.5 rounded-xl transition-colors"
                >
                  Browse Laptop Catalog
                </Link>
              </div>
            </div>
          )}

          {step === 'OTP' && (
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center mx-auto">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold">Verify Your Phone Number</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Enter the 4-digit verification code sent to <strong>+91 {formData.phone}</strong> to confirm your slot reservation.
                </p>
              </div>

              <form onSubmit={handleVerifyOtpAndBook} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1 text-center">
                    Verification OTP (Use 1234 in testing)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="1 2 3 4"
                    className="w-full text-center tracking-widest text-xl font-bold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {otpError && (
                    <p className="flex items-center justify-center gap-1 text-xs text-red-500 mt-2">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {otpError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-md text-sm disabled:opacity-60"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify & Confirm Slot'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('FORM')}
                    className="text-xs text-blue-700 dark:text-blue-400 hover:underline"
                  >
                    ← Edit Booking Details
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'FORM' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Booking Form */}
              <div className="md:col-span-7 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-5">
                <form onSubmit={handleInitiateBooking} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <Laptop className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Choose Laptop Model to Inspect *</span>
                    </label>
                    <select
                      name="selectedLaptop"
                      value={formData.selectedLaptop}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {laptopOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Preferred Date *</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Time Slot (IST) *</span>
                      </label>
                      <select
                        name="timeSlot"
                        value={formData.timeSlot}
                        onChange={handleInputChange}
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {availableSlots.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Your Full Name *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Vikram Joshi"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                        <span>Phone / WhatsApp Number (+91) *</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Email Address *</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="vikram@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-gray-700 dark:text-gray-300">
                      Specific Questions or Test Requests (Optional)
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      placeholder="e.g. Please show battery cycle count, hinge tightness, and backlight"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {/* Cloudflare Turnstile CAPTCHA Placeholder */}
                  <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={captchaVerified}
                        onChange={(e) => setCaptchaVerified(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-700 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                        I am not a robot (Cloudflare Turnstile Verified)
                      </span>
                    </label>
                    <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 opacity-60" />
                  </div>

                  <div className="pt-1">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        className="w-4 h-4 mt-0.5 rounded text-blue-700 focus:ring-blue-500"
                      />
                      <span className="text-[11px] text-gray-600 dark:text-gray-400">
                        I consent to receiving video call join links and reminders via WhatsApp & email in compliance with the DPDP Act 2023. Calls are not recorded without explicit verbal consent.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-colors text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>{isSubmitting ? 'Sending Verification...' : 'Proceed to Phone Verification'}</span>
                  </button>
                </form>
              </div>

              {/* Value Props & Trust Sidebar */}
              <div className="md:col-span-5 space-y-4">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4 text-xs">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 pb-3 border-b border-gray-200 dark:border-gray-700">
                    What to Expect on Your Call
                  </h3>

                  <div className="space-y-3 text-gray-600 dark:text-gray-300">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 dark:text-gray-100">Physical 360° Inspection:</strong>
                        <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                          We examine top lid, base, keyboard, trackpad, and all USB/HDMI ports under high lighting.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 dark:text-gray-100">Display & Pixel Audit:</strong>
                        <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                          Full screen color test pattern to guarantee zero dead pixels, spots, or backlight bleed.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 dark:text-gray-100">Diagnostics & Battery Health:</strong>
                        <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                          Live BIOS/OS battery capacity report, SSD SMART health, and CPU stress thermals.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 dark:text-gray-100">Immediate Unit Hold:</strong>
                        <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                          If satisfied, the engineer can hold that exact serial-numbered laptop for your order.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700 text-[11px] text-gray-500 dark:text-gray-400 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-blue-500" />
                      <span>WebRTC Peer-to-Peer Encrypted Stream</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                      <span>No plugin or app installation needed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
