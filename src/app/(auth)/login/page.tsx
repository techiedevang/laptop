'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validate = () => {
    if (!emailOrPhone.trim()) {
      return 'Please enter your registered email address or 10-digit mobile number';
    }
    if (!password) {
      return 'Please enter your password';
    }
    return '';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setErrorMsg(error);
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      // Simulate / real auth flow
      await new Promise((r) => setTimeout(r, 900));
      toast.success('Welcome back to NextGen IT Hub!');
      window.location.href = '/account/orders';
    } catch {
      setErrorMsg('Invalid login credentials. Please check your password or email/phone.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    toast('Google Single Sign-On integration initializing...', { icon: '🚀' });
  };

  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Customer Sign In | NextGen IT Hub</title>
      </head>

      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Brand & Heading */}
          <div className="text-center space-y-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center group py-1"
              aria-label="NextGen IT Hub Home"
            >
              <Logo height={52} className="h-12 w-auto transition-transform duration-200 group-hover:scale-105" />
            </Link>
            <h1 className="text-xl font-bold">Sign In to Your Account</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Access orders, live tracking, GST invoices, and privacy center.
            </p>
          </div>

          {/* Google SSO Button Placeholder */}
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/60 rounded-xl py-2.5 px-4 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-gray-800 px-3 text-gray-500 dark:text-gray-400">
                  Or continue with email/phone
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Email or Phone */}
            <div className="space-y-1">
              <label className="font-semibold text-gray-700 dark:text-gray-300">
                Email Address OR 10-Digit Mobile Number *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="name@company.com or 9876543210"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl pl-10 pr-3 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-gray-700 dark:text-gray-300">Password *</label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-blue-700 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-700 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In to Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Link to Signup */}
          <div className="pt-2 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            Don&apos;t have an account yet?{' '}
            <Link
              href="/signup"
              className="text-blue-700 dark:text-blue-400 font-bold hover:underline"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
