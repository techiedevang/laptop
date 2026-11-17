'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import {
  Lock,
  Mail,
  Phone,
  User,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [step, setStep] = useState<'REGISTER' | 'OTP'>('REGISTER');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    agreeMarketing: false,
    agreeWhatsapp: false,
  });

  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0 to 4
  };

  const strengthScore = getPasswordStrength(formData.password);

  const getStrengthLabel = (score: number) => {
    if (!formData.password) return { text: '', color: 'bg-gray-200' };
    if (score <= 1) return { text: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { text: 'Fair', color: 'bg-yellow-500' };
    if (score === 3) return { text: 'Good', color: 'bg-blue-600' };
    return { text: 'Strong', color: 'bg-green-600' };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.name.trim()) {
      setValidationError('Please enter your full name');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setValidationError('Please enter a valid email address');
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      setValidationError('Please enter a valid 10-digit Indian mobile number (+91)');
      return;
    }
    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    if (!formData.agreeTerms) {
      setValidationError('You must agree to the Terms & Conditions and Privacy Policy');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate sending OTP to phone/email
      await new Promise((r) => setTimeout(r, 800));
      setStep('OTP');
      toast.success(`Verification OTP sent to +91 ${cleanPhone}`);
    } catch {
      setValidationError('Failed to initiate registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      toast.error('Please enter the 4-digit verification code');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      toast.success('Account created and phone verified! Welcome to NextGen IT Hub');
      window.location.href = '/account/orders';
    } catch {
      toast.error('Invalid OTP. Please check or request a new code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Create Account | NextGen IT Hub</title>
      </head>

      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center group py-1"
              aria-label="NextGen IT Hub Home"
            >
              <Logo height={52} className="h-12 w-auto transition-transform duration-200 group-hover:scale-105" />
            </Link>
            <h1 className="text-xl font-bold">
              {step === 'REGISTER' ? 'Create Your Account' : 'Verify Phone Number'}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {step === 'REGISTER'
                ? 'Join 9,800+ customers saving up to 70% on certified enterprise laptops.'
                : `Enter the code sent to +91 ${formData.phone}`}
            </p>
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {step === 'REGISTER' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              {/* Name */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Deepak Verma"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl pl-10 pr-3 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="deepak@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl pl-10 pr-3 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Phone with +91 validation */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300">
                  Mobile Number (+91 format) *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-r-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="pt-1.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-500">Password strength:</span>
                      <span className="font-bold text-gray-700 dark:text-gray-300">
                        {getStrengthLabel(strengthScore).text}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          strengthScore >= 1 ? getStrengthLabel(strengthScore).color : 'bg-transparent'
                        }`}
                      />
                      <div
                        className={`h-full ${
                          strengthScore >= 2 ? getStrengthLabel(strengthScore).color : 'bg-transparent'
                        }`}
                      />
                      <div
                        className={`h-full ${
                          strengthScore >= 3 ? getStrengthLabel(strengthScore).color : 'bg-transparent'
                        }`}
                      />
                      <div
                        className={`h-full ${
                          strengthScore >= 4 ? getStrengthLabel(strengthScore).color : 'bg-transparent'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl pl-10 pr-3 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Granular Consent Checkboxes (unticked by default) */}
              <div className="space-y-2.5 pt-2 border-t border-gray-100 dark:border-gray-700 text-[11px] text-gray-600 dark:text-gray-400">
                {/* 1. Required Terms & Privacy */}
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-700 focus:ring-blue-500"
                  />
                  <span>
                    <span className="text-red-500">*</span> I agree to the{' '}
                    <Link href="/terms" className="text-blue-700 dark:text-blue-400 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy-policy" className="text-blue-700 dark:text-blue-400 hover:underline">
                      Privacy Policy
                    </Link>{' '}
                    (DPDP Act 2023 compliant).
                  </span>
                </label>

                {/* 2. Optional Marketing */}
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="agreeMarketing"
                    checked={formData.agreeMarketing}
                    onChange={handleInputChange}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-700 focus:ring-blue-500"
                  />
                  <span>
                    I want to receive marketing updates, flash sales, and refurbished stock alerts via email. (Optional)
                  </span>
                </label>

                {/* 3. Optional WhatsApp */}
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="agreeWhatsapp"
                    checked={formData.agreeWhatsapp}
                    onChange={handleInputChange}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-700 focus:ring-blue-500"
                  />
                  <span>
                    I agree to receive order tracking updates and warranty notifications on WhatsApp. (Optional)
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <span>{isSubmitting ? 'Sending OTP...' : 'Continue to Mobile Verification'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Step 2: OTP Verification */
            <form onSubmit={handleVerifyOtp} className="space-y-5 text-xs">
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex items-center gap-3">
                <KeyRound className="w-5 h-5 text-blue-700 dark:text-blue-400 flex-shrink-0" />
                <span className="text-blue-900 dark:text-blue-200">
                  Please enter the 4-digit verification code sent to <strong>+91 {formData.phone}</strong>.
                </span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-700 dark:text-gray-300 block text-center">
                  Verification Code (Use 1234 in testing)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="1 2 3 4"
                  className="w-full text-center tracking-widest text-2xl font-bold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md text-xs sm:text-sm"
              >
                {isSubmitting ? 'Verifying...' : 'Verify OTP & Complete Registration'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('REGISTER')}
                  className="text-xs text-blue-700 dark:text-blue-400 hover:underline"
                >
                  ← Edit registration details
                </button>
              </div>
            </form>
          )}

          <div className="pt-2 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            Already registered?{' '}
            <Link href="/login" className="text-blue-700 dark:text-blue-400 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
