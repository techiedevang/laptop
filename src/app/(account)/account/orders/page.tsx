'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Shield,
  Download,
  ExternalLink,
  Clock,
  CheckCircle2,
  Truck,
  RotateCcw,
  XCircle,
  FileText,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderItem {
  id: string;
  orderNumber: string;
  date: string;
  status: 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  currentStep: number; // 1 to 5
  laptop: string;
  grade: 'A+' | 'A' | 'B';
  specs: string;
  totalINR: number;
  courier: string;
  awbNumber: string;
  warrantyExpiry: string;
  canReturn: boolean;
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: 'ord-1',
      orderNumber: 'NGH-2024-889123',
      date: '10 Nov 2024',
      status: 'DELIVERED',
      currentStep: 5,
      laptop: 'Dell Latitude 7490 Refurbished',
      grade: 'A+',
      specs: 'Core i5 8th Gen | 16GB RAM | 512GB SSD | 14" FHD',
      totalINR: 24999,
      courier: 'Bluedart Air Express',
      awbNumber: '7789123490',
      warrantyExpiry: '10 May 2025',
      canReturn: true,
    },
    {
      id: 'ord-2',
      orderNumber: 'NGH-2024-712044',
      date: '14 Oct 2024',
      status: 'SHIPPED',
      currentStep: 4,
      laptop: 'Lenovo ThinkPad T480 Dual Battery',
      grade: 'A',
      specs: 'Core i5 8th Gen | 16GB RAM | 256GB SSD | Backlit Keyboard',
      totalINR: 26499,
      courier: 'Delhivery Surface Express',
      awbNumber: '9912445890',
      warrantyExpiry: '14 Apr 2025',
      canReturn: false,
    },
  ]);

  const [returnModalOrder, setReturnModalOrder] = useState<OrderItem | null>(null);
  const [returnReason, setReturnReason] = useState('Changed my mind');
  const [expandedTimeline, setExpandedTimeline] = useState<string | null>('ord-1');

  const timelineSteps = [
    { label: 'Order Placed', desc: 'Payment verified' },
    { label: 'Confirmed', desc: 'Hardware QC check passed' },
    { label: 'Packed', desc: 'Flight case anti-shock package' },
    { label: 'Shipped', desc: 'In-transit with courier' },
    { label: 'Delivered', desc: 'Received at doorstep' },
  ];

  const handleDownloadInvoice = (orderNumber: string) => {
    toast.success(`Downloading official GST Tax Invoice for ${orderNumber}...`);
  };

  const handleInitiateReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnModalOrder) return;

    toast.success(
      `Return & Replacement ticket opened for ${returnModalOrder.orderNumber}. Our logistics partner will schedule doorstep pickup.`
    );
    setReturnModalOrder(null);
  };

  const formatINR = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Order History & Warranties | NextGen IT Hub</title>
      </head>

      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                My Orders & Warranties
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Track live shipments, download official GST tax invoices, and manage 6-month hardware warranties.
              </p>
            </div>

            <Link
              href="/shop"
              className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors shadow-sm self-start sm:self-auto"
            >
              Shop Laptops
            </Link>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {orders.map((order) => {
              const isTimelineOpen = expandedTimeline === order.id;

              return (
                <div
                  key={order.orderNumber}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-5"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-100 dark:border-gray-700 text-xs">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Order ID: </span>
                      <span className="font-mono font-bold text-gray-900 dark:text-gray-100">
                        {order.orderNumber}
                      </span>
                      <span className="text-gray-400 ml-2">• Placed on {order.date}</span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        order.status === 'DELIVERED'
                          ? 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/60 border-green-200 dark:border-green-800'
                          : 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      {order.status === 'DELIVERED' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Delivered</span>
                        </>
                      ) : (
                        <>
                          <Truck className="w-3.5 h-3.5" />
                          <span>In Transit</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Main Product Info */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                          Grade {order.grade}
                        </span>
                        <h2 className="font-bold text-base text-gray-900 dark:text-gray-100">
                          {order.laptop}
                        </h2>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{order.specs}</p>
                      <p className="text-sm font-bold text-blue-700 dark:text-blue-400">
                        {formatINR(order.totalINR)}{' '}
                        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                          (18% GST Included)
                        </span>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleDownloadInvoice(order.orderNumber)}
                        className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Invoice PDF</span>
                      </button>

                      {order.canReturn && (
                        <button
                          onClick={() => setReturnModalOrder(order)}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl border border-orange-300 dark:border-orange-800 text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Cancel / Return</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tracking Timeline Toggle */}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60">
                    <button
                      type="button"
                      onClick={() => setExpandedTimeline(isTimelineOpen ? null : order.id)}
                      className="flex items-center justify-between w-full text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 py-1"
                    >
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                        <span>
                          {order.courier} (AWB: <strong className="font-mono">{order.awbNumber}</strong>)
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-blue-700 dark:text-blue-400">
                        {isTimelineOpen ? 'Hide Tracking Steps' : 'View Tracking Steps'}
                        {isTimelineOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </span>
                    </button>

                    {/* Timeline Stepper */}
                    {isTimelineOpen && (
                      <div className="pt-4 pb-2 px-2">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative">
                          {timelineSteps.map((s, idx) => {
                            const stepNumber = idx + 1;
                            const isPassed = stepNumber <= order.currentStep;
                            return (
                              <div key={idx} className="flex flex-col items-center text-center space-y-1">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                    isPassed
                                      ? 'bg-green-600 text-white'
                                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                                  }`}
                                >
                                  {isPassed ? '✓' : stepNumber}
                                </div>
                                <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                                  {s.label}
                                </span>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                  {s.desc}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Warranty Status Banner */}
                  <div className="bg-gray-50 dark:bg-gray-900/60 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span>NextGen Comprehensive Warranty active until: <strong>{order.warrantyExpiry}</strong></span>
                    </div>
                    <Link
                      href="/support"
                      className="text-blue-700 dark:text-blue-400 hover:underline font-semibold"
                    >
                      Claim Warranty Support →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Return / Cancel Modal */}
          {returnModalOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-base">Request Return / Replacement</h3>
                  <button
                    onClick={() => setReturnModalOrder(null)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <XCircle className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="text-xs space-y-2 text-gray-600 dark:text-gray-300">
                  <p>
                    Eligible under our <strong>7-Day Zero-Risk Replacement Guarantee</strong> for order{' '}
                    <strong>{returnModalOrder.orderNumber}</strong>.
                  </p>
                  <p>
                    Our courier team will collect the laptop from your original delivery address and verify serial numbers.
                  </p>
                </div>

                <form onSubmit={handleInitiateReturn} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Reason for Return *</label>
                    <select
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="Cosmetic marks not as expected">Cosmetic marks not as expected</option>
                      <option value="Want to upgrade to higher RAM/SSD model">Want to upgrade to higher RAM/SSD model</option>
                      <option value="Battery life shorter than anticipated">Battery life shorter than anticipated</option>
                      <option value="Changed my mind">Changed my mind</option>
                      <option value="Other">Other technical question</option>
                    </select>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setReturnModalOrder(null)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl"
                    >
                      Confirm Return Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
