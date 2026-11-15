'use client';

import { useState } from 'react';
import { Star, ThumbsUp, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface Review {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  verified: boolean;
  helpfulCount: number;
  laptopModel?: string;
}

interface ReviewSummary {
  average: number;
  count: number;
  distribution: { stars: number; count: number }[];
}

interface ProductReviewsProps {
  summary: ReviewSummary;
  reviews: Review[];
  laptopId?: string;
  laptopSlug?: string;
  onReviewSubmit?: (data: ReviewFormData) => Promise<void>;
}

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  body: z.string().min(20, 'Review must be at least 20 characters').max(2000),
  authorName: z.string().min(2, 'Name is required').max(60),
  authorEmail: z.string().email('Valid email required'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

function StarRating({ rating, max = 5, size = 'md', interactive = false, onChange }: {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (r: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';
  const display = interactive ? (hover || rating) : rating;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < display;
        return (
          <button
            key={i}
            type={interactive ? 'button' : undefined}
            onClick={interactive && onChange ? () => onChange(i + 1) : undefined}
            onMouseEnter={interactive ? () => setHover(i + 1) : undefined}
            onMouseLeave={interactive ? () => setHover(0) : undefined}
            className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}
            aria-label={interactive ? `Rate ${i + 1} star${i !== 0 ? 's' : ''}` : undefined}
            disabled={!interactive}
          >
            <Star
              className={`${sizeClass} ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
            />
          </button>
        );
      })}
    </div>
  );
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600 dark:text-gray-400 w-8 text-right">{stars}★</span>
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-gray-500 dark:text-gray-400 w-6">{count}</span>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [helpful, setHelpful] = useState(review.helpfulCount);
  const [voted, setVoted] = useState(false);

  const handleHelpful = () => {
    if (!voted) {
      setHelpful((h) => h + 1);
      setVoted(true);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{review.authorName}</span>
            {review.verified && (
              <span className="inline-flex items-center gap-1 text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/40 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" /> Verified Purchase
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={review.rating} size="sm" />
            {review.laptopModel && (
              <span className="text-xs text-gray-500 dark:text-gray-400">for {review.laptopModel}</span>
            )}
          </div>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
          {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      {review.title && (
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">{review.title}</h4>
      )}
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{review.body}</p>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={handleHelpful}
          disabled={voted}
          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors ${
            voted
              ? 'border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
              : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
        >
          <ThumbsUp className="w-3 h-3" />
          Helpful ({helpful})
        </button>
      </div>
    </div>
  );
}

export default function ProductReviews({ summary, reviews, laptopId, laptopSlug, onReviewSubmit }: ProductReviewsProps) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0 },
  });

  const ratingValue = watch('rating');

  const onSubmit = async (data: ReviewFormData) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      if (onReviewSubmit) {
        await onReviewSubmit(data);
      } else {
        await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, laptopId }),
        });
      }
      setSubmitted(true);
      reset();
    } catch {
      setSubmitError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="reviews-heading" className="mt-12">
      <h2 id="reviews-heading" className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Customer Reviews
      </h2>

      {/* Summary */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Average */}
          <div className="flex flex-col items-center justify-center min-w-[120px]">
            <span className="text-5xl font-bold text-gray-900 dark:text-gray-100">
              {summary.average.toFixed(1)}
            </span>
            <StarRating rating={summary.average} size="lg" />
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {summary.count} review{summary.count !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Distribution */}
          <div className="flex-1 flex flex-col gap-1.5 justify-center">
            {[5, 4, 3, 2, 1].map((stars) => {
              const dist = summary.distribution.find((d) => d.stars === stars);
              return (
                <RatingBar key={stars} stars={stars} count={dist?.count ?? 0} total={summary.count} />
              );
            })}
          </div>
        </div>
      </div>

      {/* Review list */}
      <div className="flex flex-col gap-4 mb-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No reviews yet. Be the first to review this laptop!
          </p>
        ) : (
          reviews.map((review) => <ReviewCard key={review.id} review={review} />)
        )}
      </div>

      {/* Write review CTA */}
      {!showForm && !submitted && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          Write a Review
        </button>
      )}

      {/* Success state */}
      {submitted && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-green-700 dark:text-green-300 font-medium">
            Thank you! Your review has been submitted for moderation.
          </p>
        </div>
      )}

      {/* Review form */}
      {showForm && !submitted && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Write a Review</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your Rating <span className="text-red-500">*</span>
              </label>
              <StarRating
                rating={ratingValue}
                size="lg"
                interactive
                onChange={(r) => setValue('rating', r, { shouldValidate: true })}
              />
              {errors.rating && (
                <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Review Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register('title')}
                placeholder="Summarize your experience"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Review <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('body')}
                rows={4}
                placeholder="Share your detailed experience with this laptop..."
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('authorName')}
                  placeholder="e.g. Rahul S."
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.authorName && <p className="text-red-500 text-xs mt-1">{errors.authorName.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('authorEmail')}
                  type="email"
                  placeholder="Not published publicly"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.authorEmail && <p className="text-red-500 text-xs mt-1">{errors.authorEmail.message}</p>}
              </div>
            </div>

            {submitError && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {submitError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); reset(); }}
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-2.5 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
