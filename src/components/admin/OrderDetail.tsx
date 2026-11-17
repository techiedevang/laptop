'use client';

import React, { useState } from 'react';
import {
  X, User, Phone, MapPin, Package, CreditCard,
  FileText, RotateCcw, Truck, Printer, CheckCircle, AlertCircle,
  ExternalLink, Hash, Calendar, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface OrderItemType {
  id: string;
  sku: string;
  model: string;
  image: string;
  quantity: number;
  unitPrice: number; // in INR
}

export interface AdminOrderDetailData {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phoneMasked: string;
    phoneFull?: string;
    shippingAddress: {
      line1: string;
      city: string;
      state: string;
      pincode: string;
    };
    gstin?: string;
  };
  items: OrderItemType[];
  pricing: {
    subtotal: number;
    discount: number;
    cgst: number;
    sgst: number;
    igst: number;
    shipping: number;
    total: number;
  };
  payment: {
    method: 'RAZORPAY' | 'COD' | 'BANK_TRANSFER';
    status: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED' | 'PARTIAL_REFUND';
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
  };
  status: 'PLACED' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  tracking?: {
    carrier: string;
    trackingNumber: string;
    updatedAt?: string;
  };
  timeline?: { status: string; timestamp: string; note?: string }[];
}

interface OrderDetailProps {
  order: AdminOrderDetailData;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: AdminOrderDetailData['status'], reason?: string) => void;
  onUpdateTracking: (orderId: string, carrier: string, trackingNumber: string) => void;
}

export function OrderDetail({
  order,
  onClose,
  onUpdateStatus,
  onUpdateTracking,
}: OrderDetailProps) {
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [statusReason, setStatusReason] = useState('');
  const [carrier, setCarrier] = useState(order.tracking?.carrier || 'Delhivery Express');
  const [trackingNumber, setTrackingNumber] = useState(order.tracking?.trackingNumber || '');
  const [showFullPhone, setShowFullPhone] = useState(false);

  // Refund Dialog
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [refundAmount, setRefundAmount] = useState(order.pricing.total);

  const handleSaveStatus = () => {
    onUpdateStatus(order.id, selectedStatus, statusReason);
    toast.success(`Order status changed to ${selectedStatus}`);
  };

  const handleSaveTracking = () => {
    if (!trackingNumber.trim()) {
      toast.error('Enter valid AWB / Tracking number');
      return;
    }
    onUpdateTracking(order.id, carrier, trackingNumber.trim());
    toast.success(`Tracking updated: ${carrier} - ${trackingNumber}`);
  };

  const handleGenerateInvoice = () => {
    toast.success(`Generating GST Invoice for ${order.orderNumber}...`);
    // Simulating invoice download
    const dummyInvoiceUrl = `/api/orders/${order.id}/invoice`;
    window.open(dummyInvoiceUrl, '_blank');
  };

  const handlePrintShippingLabel = () => {
    toast.success(`Preparing shipping label for ${order.orderNumber}`);
    window.print();
  };

  const handleExecuteRefund = () => {
    if (!refundReason.trim()) {
      toast.error('Please enter an administrative audit reason for refund');
      return;
    }
    toast.success(`Refund of ₹${refundAmount.toLocaleString('en-IN')} initiated via Razorpay API`);
    setIsRefundModalOpen(false);
    onUpdateStatus(order.id, 'REFUNDED', `Refund initiated: ${refundReason}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-6 my-6 text-gray-900 dark:text-gray-100">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                {order.orderNumber}
              </h2>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" /> Placed on {order.createdAt}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintShippingLabel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold"
            >
              <Printer className="h-3.5 w-3.5" /> Label
            </button>
            <button
              onClick={handleGenerateInvoice}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow"
            >
              <FileText className="h-3.5 w-3.5" /> GST Invoice
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 2 Column Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer & Shipping Information */}
          <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <User className="h-4 w-4 text-blue-500" /> Customer & Shipping Info
            </h3>
            <div className="space-y-1.5 text-xs">
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{order.customer.name}</p>
              <p className="text-gray-500">{order.customer.email}</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-gray-700 dark:text-gray-300">
                  {showFullPhone ? (order.customer.phoneFull || '+91 9876543210') : order.customer.phoneMasked}
                </span>
                <button
                  type="button"
                  onClick={() => setShowFullPhone(!showFullPhone)}
                  className="text-[10px] text-blue-600 dark:text-blue-400 underline hover:font-bold"
                >
                  {showFullPhone ? 'Mask' : 'Reveal (Audit)'}
                </button>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" /> Delivery Address:
                </p>
                <p className="mt-0.5">{order.customer.shippingAddress.line1}</p>
                <p>{order.customer.shippingAddress.city}, {order.customer.shippingAddress.state} - {order.customer.shippingAddress.pincode}</p>
              </div>
              {order.customer.gstin && (
                <div className="pt-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  Business GSTIN: {order.customer.gstin}
                </div>
              )}
            </div>
          </div>

          {/* Payment & Status Control */}
          <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-emerald-500" /> Payment & Transaction
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Payment Gateway:</span>
                <span className="font-semibold">{order.payment.method}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Payment Status:</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                  {order.payment.status}
                </span>
              </div>
              {order.payment.razorpayPaymentId && (
                <div className="flex justify-between items-center font-mono text-[11px]">
                  <span className="text-gray-500">Razorpay ID:</span>
                  <span className="text-blue-600 dark:text-blue-400">{order.payment.razorpayPaymentId}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              <button
                type="button"
                onClick={() => setIsRefundModalOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg text-xs font-bold transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Initiate Refund
              </button>
            </div>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-500" /> Ordered Items ({order.items.length})
          </h3>
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2.5 px-4">Item</th>
                  <th className="py-2.5 px-4">SKU</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Price</th>
                  <th className="py-2.5 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.model}
                        className="w-10 h-8 object-cover rounded border border-gray-200 dark:border-gray-700"
                      />
                      <span className="font-semibold text-gray-900 dark:text-white">{item.model}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-500">{item.sku}</td>
                    <td className="py-3 px-4 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="flex justify-end">
          <div className="w-full sm:w-72 bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Taxable Subtotal:</span>
              <span>₹{order.pricing.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.pricing.discount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Discount Applied:</span>
                <span>-₹{order.pricing.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>CGST (9%):</span>
              <span>₹{order.pricing.cgst.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>SGST (9%):</span>
              <span>₹{order.pricing.sgst.toLocaleString('en-IN')}</span>
            </div>
            {order.pricing.igst > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>IGST (18%):</span>
                <span>₹{order.pricing.igst.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>Insured Shipping:</span>
              <span>{order.pricing.shipping === 0 ? 'FREE' : `₹${order.pricing.shipping}`}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold text-sm text-gray-900 dark:text-white">
              <span>Total Grand Amount:</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                ₹{order.pricing.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Tracking & Status Update Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          {/* Tracking Update */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-blue-500" /> Courier AWB Tracking
            </label>
            <div className="flex gap-2">
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-1/3 px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <option value="Delhivery Express">Delhivery</option>
                <option value="BlueDart Air">BlueDart</option>
                <option value="DTDC Premium">DTDC</option>
                <option value="XpressBees">XpressBees</option>
              </select>
              <input
                type="text"
                placeholder="AWB Tracking Number..."
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 font-mono"
              />
              <button
                type="button"
                onClick={handleSaveTracking}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow"
              >
                Update
              </button>
            </div>
          </div>

          {/* Status Update with Reason */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Update Order Status & Audit Note
            </label>
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="w-1/3 px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <option value="PLACED">PLACED</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PACKED">PACKED</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
              <input
                type="text"
                placeholder="Reason or dispatch notes..."
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
              />
              <button
                type="button"
                onClick={handleSaveStatus}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Refund Confirmation Modal */}
      {isRefundModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Initiate Razorpay Refund</h3>
            </div>
            <p className="text-gray-500">
              This action issues an online refund to the original payment source. An audit log entry will be permanently recorded.
            </p>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300">Refund Amount (₹)</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300">Admin Audit Reason *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Customer cancelled before dispatch / Return verified by QA"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRefundModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRefund}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow"
              >
                Confirm & Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
