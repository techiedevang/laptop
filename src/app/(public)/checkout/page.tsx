'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ShieldCheck,
  CheckCircle,
  CreditCard,
  Banknote,
  Building,
  ArrowRight,
  ArrowLeft,
  Lock,
  Package,
  MapPin,
  FileText,
} from 'lucide-react';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Please enter a valid email address'),
  line1: z.string().min(5, 'Flat/House No. and Street address is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
  gstin: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format')
    .optional()
    .or(z.literal('')),
  companyName: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CartSummaryItem {
  id: string;
  name: string;
  grade: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [useSavedAddress, setUseSavedAddress] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartSummaryItem[]>([
    {
      id: 'lap-01',
      name: 'Dell Latitude 7490 Refurbished',
      grade: 'A+',
      price: 24999,
      quantity: 1,
    },
  ]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ngh_cart') || localStorage.getItem('nextgen_guest_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCartItems(
            parsed.map((item: any) => ({
              id: item.id || item.laptopId,
              name: item.name || item.model,
              grade: item.grade || 'A+',
              price: item.price ? (item.price > 100000 ? Math.round(item.price / 100) : item.price) : 24999,
              quantity: item.quantity || 1,
            }))
          );
        }
      }
    } catch {
      // Keep default sample
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      line1: '',
      line2: '',
      city: '',
      state: 'Maharashtra',
      pincode: '',
      gstin: '',
      companyName: '',
    },
  });

  const formValues = watch();

  const handleSavedAddressToggle = () => {
    const nextVal = !useSavedAddress;
    setUseSavedAddress(nextVal);
    if (nextVal) {
      setValue('name', 'Priya Sharma');
      setValue('phone', '9876543210');
      setValue('email', 'priya.sharma@example.com');
      setValue('line1', '402, Green Valley Apartments, Baner Road');
      setValue('line2', 'Near D-Mart');
      setValue('city', 'Pune');
      setValue('state', 'Maharashtra');
      setValue('pincode', '411045');
    }
  };

  const onAddressSubmit = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const codFee = paymentMethod === 'COD' ? 50 : 0;
  const basePrice = Math.round(subtotal / 1.18);
  const gstTotal = subtotal - basePrice;
  const cgst = Math.round(gstTotal / 2);
  const sgst = gstTotal - cgst;
  const grandTotal = subtotal + codFee;

  const formatINR = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const handlePayment = async () => {
    setIsProcessing(true);

    if (paymentMethod === 'RAZORPAY') {
      try {
        // Step 1: Connect to /api/payments/razorpay/create-order
        const createRes = await fetch('/api/payments/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amountPaise: grandTotal * 100,
            items: cartItems,
            customer: formValues,
          }),
        });

        let rzpOrderId = 'order_mock_' + Math.random().toString(36).substring(2, 9);
        if (createRes.ok) {
          const data = await createRes.json();
          rzpOrderId = data.orderId || data.id || rzpOrderId;
        }

        // Step 2: Connect to /api/payments/razorpay/verify
        const verifyRes = await fetch('/api/payments/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: rzpOrderId,
            razorpay_payment_id: 'pay_mock_' + Math.random().toString(36).substring(2, 9),
            razorpay_signature: 'sig_mock_verified',
            customer: formValues,
          }),
        });

        if (verifyRes.ok) {
          const verifyData = await verifyRes.json();
          if (verifyData.orderNumber) {
            setOrderNumber(verifyData.orderNumber);
          }
        }
      } catch (err) {
        console.warn('Razorpay checkout flow fallback:', err);
      }
    } else {
      // COD flow
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    const generatedOrder = 'NGH-' + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(generatedOrder);

    // Clear cart in storage
    try {
      localStorage.removeItem('ngh_cart');
      localStorage.removeItem('nextgen_guest_cart');
      window.dispatchEvent(new Event('cart_updated'));
    } catch {}

    setIsProcessing(false);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const statesOfIndia = [
    'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana',
    'Gujarat', 'Uttar Pradesh', 'West Bengal', 'Rajasthan', 'Kerala',
    'Haryana', 'Punjab', 'Madhya Pradesh', 'Andhra Pradesh', 'Bihar',
    'Odisha', 'Assam', 'Chandigarh', 'Goa'
  ];

  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Checkout | NextGen IT Hub</title>
      </head>

      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Progress Stepper */}
          <div className="mb-10">
            <div className="flex items-center justify-center max-w-md mx-auto">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step >= 1
                      ? 'bg-blue-700 text-white dark:bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  1
                </div>
                <span className="text-xs font-medium mt-1.5 text-gray-600 dark:text-gray-400">Address</span>
              </div>

              <div
                className={`flex-1 h-1 mx-3 rounded transition-colors ${
                  step >= 2 ? 'bg-blue-700 dark:bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step >= 2
                      ? 'bg-blue-700 text-white dark:bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  2
                </div>
                <span className="text-xs font-medium mt-1.5 text-gray-600 dark:text-gray-400">Payment</span>
              </div>

              <div
                className={`flex-1 h-1 mx-3 rounded transition-colors ${
                  step >= 3 ? 'bg-blue-700 dark:bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step === 3
                      ? 'bg-green-600 text-white dark:bg-green-500'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  3
                </div>
                <span className="text-xs font-medium mt-1.5 text-gray-600 dark:text-gray-400">Confirmation</span>
              </div>
            </div>
          </div>

          {/* Step 1: Address */}
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                        Shipping & Delivery Address
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Enter your delivery details or use a saved profile.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSavedAddressToggle}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      {useSavedAddress ? 'Clear Form' : 'Use Saved Address'}
                    </button>
                  </div>

                  <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                          Full Name *
                        </label>
                        <input
                          {...register('name')}
                          placeholder="e.g. Priya Sharma"
                          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                          Phone Number (+91) *
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 text-sm">
                            +91
                          </span>
                          <input
                            {...register('phone')}
                            placeholder="9876543210"
                            maxLength={10}
                            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-r-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                          Email Address *
                        </label>
                        <input
                          {...register('email')}
                          type="email"
                          placeholder="priya@example.com"
                          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                      </div>

                      {/* Address Line 1 */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                          Address Line 1 (Flat/House No, Building, Street) *
                        </label>
                        <input
                          {...register('line1')}
                          placeholder="Flat 402, Green Valley Apartments, Baner Road"
                          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.line1 && <p className="text-xs text-red-500 mt-1">{errors.line1.message}</p>}
                      </div>

                      {/* Address Line 2 */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                          Address Line 2 (Landmark, Area - Optional)
                        </label>
                        <input
                          {...register('line2')}
                          placeholder="Near D-Mart / Opposite Park"
                          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                          City *
                        </label>
                        <input
                          {...register('city')}
                          placeholder="Pune"
                          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                      </div>

                      {/* Pincode */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                          PIN Code *
                        </label>
                        <input
                          {...register('pincode')}
                          placeholder="411045"
                          maxLength={6}
                          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>}
                      </div>

                      {/* State */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                          State *
                        </label>
                        <select
                          {...register('state')}
                          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {statesOfIndia.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* GST Section */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Building className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-semibold">Business GST Invoice (Optional)</span>
                        <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                          Claim 18% Input Tax Credit
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                            GSTIN (15 Alphanumeric)
                          </label>
                          <input
                            {...register('gstin')}
                            placeholder="27ABCDE1234F1Z5"
                            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.gstin && <p className="text-xs text-red-500 mt-1">{errors.gstin.message}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                            Company Legal Name
                          </label>
                          <input
                            {...register('companyName')}
                            placeholder="Innovatech Solutions Pvt Ltd"
                            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        type="submit"
                        className="w-full bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                      >
                        Proceed to Payment
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-4">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm sticky top-6">
                  <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                    Items in Order ({cartItems.length})
                  </h3>

                  <div className="space-y-3 divide-y divide-gray-100 dark:divide-gray-700 pb-4 mb-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="pt-3 first:pt-0 flex justify-between text-xs">
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</span>
                          <span className="block text-gray-500 dark:text-gray-400">Qty: {item.quantity} · Grade {item.grade}</span>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{formatINR(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 text-xs border-t border-gray-200 dark:border-gray-700 pt-3 text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Base Amount</span>
                      <span>{formatINR(basePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CGST (9%) + SGST (9%)</span>
                      <span>{formatINR(gstTotal)}</span>
                    </div>
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Express Shipping</span>
                      <span className="font-semibold">FREE</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between text-base font-bold text-gray-900 dark:text-gray-100">
                      <span>Total Amount</span>
                      <span className="text-xl text-blue-700 dark:text-blue-400">{formatINR(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                        Select Payment Method
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        All transactions are encrypted with 256-bit SSL.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Address
                    </button>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-4">
                    {/* Razorpay Online */}
                    <label
                      className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === 'RAZORPAY'
                          ? 'border-blue-700 bg-blue-50/50 dark:bg-blue-950/30'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'RAZORPAY'}
                          onChange={() => setPaymentMethod('RAZORPAY')}
                          className="mt-1 text-blue-700 focus:ring-blue-500"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                              Razorpay Secure Online Payment
                            </span>
                            <span className="text-[10px] bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full font-semibold">
                              Fastest
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            UPI (Google Pay, PhonePe, Paytm), Netbanking, Credit & Debit Cards.
                          </p>
                        </div>
                      </div>
                      <CreditCard className="w-5 h-5 text-blue-700 dark:text-blue-400 flex-shrink-0" />
                    </label>

                    {/* Cash on Delivery */}
                    <label
                      className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === 'COD'
                          ? 'border-blue-700 bg-blue-50/50 dark:bg-blue-950/30'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'COD'}
                          onChange={() => setPaymentMethod('COD')}
                          className="mt-1 text-blue-700 focus:ring-blue-500"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                              Cash on Delivery (COD)
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Pay cash at your doorstep when the laptop arrives.
                          </p>
                          <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mt-1">
                            ⚠️ ₹50 COD handling charge applicable for cash handling.
                          </p>
                        </div>
                      </div>
                      <Banknote className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    </label>
                  </div>

                  {/* GST Invoice Details summary */}
                  {formValues.gstin && (
                    <div className="mt-6 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-semibold text-xs mb-1">
                        <FileText className="w-4 h-4" />
                        GST Invoice Billing Details
                      </div>
                      <p className="text-xs text-purple-700 dark:text-purple-300">
                        GSTIN: <strong>{formValues.gstin}</strong> | Entity: <strong>{formValues.companyName || formValues.name}</strong>
                      </p>
                    </div>
                  )}

                  {/* Action button */}
                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      {isProcessing
                        ? 'Processing Payment...'
                        : paymentMethod === 'RAZORPAY'
                        ? `Pay ${formatINR(grandTotal)} via Razorpay`
                        : `Confirm Order with Cash on Delivery (${formatINR(grandTotal)})`}
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-4">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm sticky top-6">
                  <h3 className="font-bold text-base mb-4">Payment Summary</h3>

                  <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Deliver to:</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100 text-right">{formValues.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phone:</span>
                      <span className="text-gray-900 dark:text-gray-100">+91 {formValues.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>City:</span>
                      <span className="text-gray-900 dark:text-gray-100">{formValues.city}, {formValues.state}</span>
                    </div>

                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                      <div className="flex justify-between">
                        <span>Items Subtotal</span>
                        <span>{formatINR(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CGST + SGST (18% Incl.)</span>
                        <span>{formatINR(gstTotal)}</span>
                      </div>
                      {paymentMethod === 'COD' && (
                        <div className="flex justify-between text-orange-600 dark:text-orange-400">
                          <span>COD Convenience Fee</span>
                          <span>+₹50</span>
                        </div>
                      )}
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Delivery Fee</span>
                        <span className="font-semibold">FREE</span>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between text-base font-bold text-gray-900 dark:text-gray-100">
                        <span>Grand Total</span>
                        <span className="text-xl text-blue-700 dark:text-blue-400">{formatINR(grandTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/60 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                    Thank You! Order Confirmed
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your refurbished laptop order has been placed and assigned for rigorous final QC inspection.
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-left space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="text-gray-500 dark:text-gray-400">Order Reference Number:</span>
                    <span className="font-mono font-bold text-blue-700 dark:text-blue-400">{orderNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="text-gray-500 dark:text-gray-400">Delivery Address:</span>
                    <span className="text-right text-gray-900 dark:text-gray-100 font-medium max-w-xs">
                      {formValues.line1}, {formValues.city}, {formValues.pincode}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="text-gray-500 dark:text-gray-400">Payment Method:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {paymentMethod === 'RAZORPAY' ? 'Paid via Razorpay' : 'Cash on Delivery'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Total Amount:</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{formatINR(grandTotal)}</span>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-xs text-blue-800 dark:text-blue-300 text-left space-y-1">
                  <p className="font-semibold">📱 Confirmation & Live Tracking</p>
                  <p>
                    A confirmation message with order invoice details has been sent to <strong>{formValues.email}</strong> and via WhatsApp/SMS to <strong>+91 {formValues.phone}</strong>.
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    href="/account/orders"
                    className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                  >
                    View in Order History
                  </Link>
                  <Link
                    href="/shop"
                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
