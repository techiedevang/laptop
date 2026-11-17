'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Tag,
  AlertCircle,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface CartItem {
  id: string;
  laptopId?: string;
  name: string;
  model?: string;
  slug?: string;
  brand?: string;
  grade: 'A+' | 'A' | 'B';
  specs?: string;
  price: number; // in INR
  sellingPrice?: number;
  mrp?: number;
  quantity: number;
  image?: string;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [discountINR, setDiscountINR] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ngh_cart') || localStorage.getItem('nextgen_guest_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(
            parsed.map((item: any) => ({
              id: item.id || item.laptopId || 'item-1',
              laptopId: item.laptopId || item.id,
              name: item.name || item.model || 'Dell Latitude 7490 Refurbished',
              slug: item.slug || 'dell-latitude-7490',
              brand: item.brand || 'Dell',
              grade: item.grade === 'A_PLUS' ? 'A+' : item.grade || 'A+',
              specs: item.specs || 'Core i5 8th Gen · 16GB RAM · 512GB SSD',
              price: item.price
                ? item.price > 100000
                  ? Math.round(item.price / 100)
                  : item.price
                : item.sellingPrice
                ? Math.round(item.sellingPrice / 100)
                : 24999,
              mrp: item.mrp || 65000,
              quantity: item.quantity || 1,
              image:
                item.image ||
                'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=60',
            }))
          );
        } else {
          loadDefaultSample();
        }
      } else {
        loadDefaultSample();
      }
    } catch {
      loadDefaultSample();
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const loadDefaultSample = () => {
    const sample: CartItem[] = [
      {
        id: 'item-1',
        laptopId: 'lap-01',
        name: 'Dell Latitude 7490 Refurbished',
        slug: 'dell-latitude-7490',
        brand: 'Dell',
        grade: 'A+',
        specs: 'Core i5 8th Gen · 16GB RAM · 512GB SSD · 14" FHD',
        price: 24999,
        mrp: 65000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=60',
      },
    ];
    setItems(sample);
    try {
      localStorage.setItem('ngh_cart', JSON.stringify(sample));
    } catch {}
  };

  const syncCart = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem('ngh_cart', JSON.stringify(newItems));
      localStorage.setItem('nextgen_guest_cart', JSON.stringify(newItems));
      window.dispatchEvent(new Event('cart_updated'));
    } catch {}
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = items
      .map((item) => {
        if (item.id === id) {
          const nextQty = item.quantity + delta;
          return nextQty > 0 ? { ...item, quantity: nextQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    syncCart(updated);
  };

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    syncCart(updated);
    toast.success('Item removed from cart');
  };

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'FESTIVE2000' || code === 'WELCOME10') {
      const discount = code === 'FESTIVE2000' ? 2000 : Math.round(subtotal * 0.1);
      setDiscountINR(discount);
      setCouponApplied(true);
      toast.success(`Coupon ${code} applied! Saved ₹${discount.toLocaleString('en-IN')}`);
    } else {
      setCouponError("Invalid coupon code. Try 'FESTIVE2000' or 'WELCOME10'");
      toast.error('Invalid coupon code');
    }
  };

  const formatINR = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const basePrice = Math.round(subtotal / 1.18);
  const gstInclusive = subtotal - basePrice;
  const cgst = Math.round(gstInclusive / 2);
  const sgst = gstInclusive - cgst;
  const grandTotal = Math.max(0, subtotal - discountINR);

  const getGradeBadge = (grade: 'A+' | 'A' | 'B') => {
    switch (grade) {
      case 'A+':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'A':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'B':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 dark:border-blue-400" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-10 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Shopping Cart</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review your selected laptops and proceed to verified checkout.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto shadow-sm">
            <ShoppingBag className="w-14 h-14 text-gray-400 dark:text-gray-500 mx-auto" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Your cart is currently empty
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Browse our inventory of certified enterprise refurbished laptops with 6-month warranty.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold px-6 py-3.5 rounded-xl transition-colors shadow-md"
            >
              Shop Laptops Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 sm:p-6 divide-y divide-gray-100 dark:divide-gray-700">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex gap-4 items-center">
                        {item.image && (
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-contain p-2"
                              sizes="96px"
                            />
                          </div>
                        )}
                        <div className="space-y-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getGradeBadge(
                              item.grade
                            )}`}
                          >
                            Grade {item.grade} Certified
                          </span>
                          <Link
                            href={item.slug ? `/shop/${item.slug}` : '/shop'}
                            className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 hover:text-blue-700 dark:hover:text-blue-400 block transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.specs}</p>
                          <p className="text-xs font-bold text-blue-700 dark:text-blue-400">
                            {formatINR(item.price)} per unit
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-gray-900 dark:text-gray-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-right min-w-[5rem]">
                          <div className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-gray-100">
                            {formatINR(item.price * item.quantity)}
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Banner */}
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl p-4 flex items-center gap-3 text-green-800 dark:text-green-300 text-xs">
                <ShieldCheck className="w-5 h-5 shrink-0 text-green-600 dark:text-green-400" />
                <span>
                  All laptops in your order include <strong>7-Day Zero-Risk Replacement</strong> and{' '}
                  <strong>6-Month Warranty</strong>.
                </span>
              </div>
            </div>

            {/* Price Summary Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-5 sticky top-24">
                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 pb-3 border-b border-gray-100 dark:border-gray-700">
                  Order Summary
                </h2>

                <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatINR(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST Breakdown (18% Incl.)</span>
                    <span>
                      CGST: {formatINR(cgst)} | SGST: {formatINR(sgst)}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Shipping (Bluedart Express)</span>
                    <span className="font-bold">FREE</span>
                  </div>
                  {discountINR > 0 && (
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>Promo Discount</span>
                      <span>-{formatINR(discountINR)}</span>
                    </div>
                  )}
                </div>

                {/* Coupon Input Form */}
                <form
                  onSubmit={applyCoupon}
                  className="pt-2 border-t border-gray-100 dark:border-gray-700 flex gap-2"
                >
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl pl-8 pr-3 py-2 text-xs uppercase placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {couponError && (
                  <p className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {couponError}
                  </p>
                )}

                {/* Total */}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-base text-gray-900 dark:text-gray-100">Total Amount</span>
                    <p className="text-[10px] text-gray-400">Includes all taxes & delivery</p>
                  </div>
                  <span className="text-xl font-extrabold text-blue-700 dark:text-blue-400">
                    {formatINR(grandTotal)}
                  </span>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-xs sm:text-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-center text-[10px] text-gray-400">
                  🔒 256-Bit SSL Encrypted & PCI-DSS Compliant Razorpay Gateway
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
