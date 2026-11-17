'use client';

import React, { useState } from 'react';
import {
  Star, CheckCircle2, XCircle, Trash2, Filter, MessageSquare,
  AlertTriangle, Laptop, User
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface AdminReview {
  id: string;
  customerName: string;
  customerEmail: string;
  laptopModel: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  isVerifiedPurchase: boolean;
}

const INITIAL_REVIEWS: AdminReview[] = [
  {
    id: 'r-1',
    customerName: 'Rohit Kulkarni',
    customerEmail: 'rohit.k@gmail.com',
    laptopModel: 'Dell Latitude 7490 Core i7',
    rating: 5,
    title: 'Outstanding build quality and fast NVMe speed',
    comment: 'The laptop arrived in flawless Grade A+ condition. Zero scratches, battery cycle count was only 48, lasting 6+ hours easily! Best purchase for remote work.',
    status: 'PENDING',
    createdAt: '15 Nov 2024',
    isVerifiedPurchase: true,
  },
  {
    id: 'r-2',
    customerName: 'Sneha Patel',
    customerEmail: 'sneha.p@yahoo.com',
    laptopModel: 'Lenovo ThinkPad T480 Dual Battery',
    rating: 5,
    title: 'Keyboard is phenomenal!',
    comment: 'Typing on this ThinkPad keyboard is heavenly. TrackPoint works great, dual battery gives around 7.5 hours. Fast delivery to Pune via Delhivery.',
    status: 'PENDING',
    createdAt: '14 Nov 2024',
    isVerifiedPurchase: true,
  },
  {
    id: 'r-3',
    customerName: 'Anonymous Buyer',
    customerEmail: 'spammer123@temp.com',
    laptopModel: 'HP EliteBook 840 G6',
    rating: 1,
    title: 'Fake competitor advertisement',
    comment: 'Check out this external link for cheap electronics: http://spam-link.example.com',
    status: 'PENDING',
    createdAt: '13 Nov 2024',
    isVerifiedPurchase: false,
  },
  {
    id: 'r-4',
    customerName: 'Manish Tyagi',
    customerEmail: 'm.tyagi@outlook.com',
    laptopModel: 'Apple MacBook Air M1 Space Grey',
    rating: 5,
    title: 'Like brand new, 96% battery health',
    comment: 'Apple Silicon for ₹52,999 with 1-year NextGen warranty is unmatched value. Not even a hairline scratch on the retina display.',
    status: 'APPROVED',
    createdAt: '11 Nov 2024',
    isVerifiedPurchase: true,
  },
  {
    id: 'r-5',
    customerName: 'Vikas Nambiar',
    customerEmail: 'vikas.n@gmail.com',
    laptopModel: 'Dell Latitude 5400',
    rating: 4,
    title: 'Great budget workhorse',
    comment: 'Very fast SSD and clean internals. Only 4 stars because the charger brick had minor scuffs, but works perfectly.',
    status: 'APPROVED',
    createdAt: '09 Nov 2024',
    isVerifiedPurchase: true,
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>(INITIAL_REVIEWS);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [ratingFilter, setRatingFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReviews = reviews.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (ratingFilter !== 'ALL' && r.rating !== Number(ratingFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        r.customerName.toLowerCase().includes(q) ||
        r.laptopModel.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleApprove = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' } : r))
    );
    toast.success('Review approved and published to product page');
  };

  const handleReject = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r))
    );
    toast.error('Review rejected / hidden');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Permanently delete this review?')) return;
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast.success('Review permanently deleted');
  };

  const pendingCount = reviews.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Star className="h-6 w-6 text-amber-500 fill-amber-500" /> Customer Reviews Moderation
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Moderate genuine buyer reviews, filter spam, and ensure verified purchase transparency.
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>{pendingCount} Pending Moderation</span>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter */}
          <div>
            <span className="text-xs text-gray-500 mr-2 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <span className="text-xs text-gray-500 mr-2 font-medium">Rating:</span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs"
            >
              <option value="ALL">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        <input
          type="text"
          placeholder="Filter by customer, device or comment..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs w-64"
        />
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className={`bg-white dark:bg-gray-800 border rounded-2xl p-5 shadow-sm space-y-3 text-xs transition-all ${
              review.status === 'PENDING'
                ? 'border-amber-300 dark:border-amber-700/60 ring-1 ring-amber-300/40'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? 'fill-amber-400' : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">{review.title}</h3>
                {review.isVerifiedPurchase && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                    Verified Buyer
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    review.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : review.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  }`}
                >
                  {review.status}
                </span>
                <span className="text-gray-400">{review.createdAt}</span>
              </div>
            </div>

            {/* Comment Body */}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs">
              {review.comment}
            </p>

            {/* Laptop & Customer Footer */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 font-semibold text-gray-800 dark:text-gray-200">
                  <Laptop className="h-3.5 w-3.5 text-blue-500" /> {review.laptopModel}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" /> {review.customerName} ({review.customerEmail})
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {review.status !== 'APPROVED' && (
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors shadow"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                  </button>
                )}
                {review.status !== 'REJECTED' && (
                  <button
                    onClick={() => handleReject(review.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold transition-colors shadow"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  title="Permanently Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
