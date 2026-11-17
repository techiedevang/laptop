/**
 * Zod validation schemas for NextGen IT Hub
 * All schemas use strict mode to avoid extra fields passing through
 */

import { z } from 'zod';

// ─── Reusable primitives ───────────────────────────────────────────────

const IndianPhone = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number (must be 10 digits starting with 6-9)');

const PincodeSchema = z
  .string()
  .regex(/^\d{6}$/, 'Pincode must be exactly 6 digits');

const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one digit');

// ─── Auth schemas ──────────────────────────────────────────────────────

export const SignupSchema = z.object({
  name: z.string().min(2, 'Name too short').max(100, 'Name too long').trim(),
  email: z.string().email('Invalid email').toLowerCase().optional(),
  phone: IndianPhone.optional(),
  password: PasswordSchema,
  confirmPassword: z.string(),
  captchaToken: z.string().min(1, 'CAPTCHA required'),
}).refine((d) => d.email || d.phone, {
  message: 'Either email or phone is required',
  path: ['email'],
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const LoginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone required'), // email or phone
  password: z.string().min(1, 'Password required'),
  captchaToken: z.string().optional(),
});

export const AdminLoginSchema = z.object({
  email: z.string().email('Invalid email').toLowerCase(),
  password: z.string().min(1, 'Password required'),
  totpCode: z.string().regex(/^\d{6}$/, 'TOTP must be 6 digits'),
});

// ─── Laptop schema ─────────────────────────────────────────────────────

export const LaptopSchema = z.object({
  brand: z.string().min(1).max(100),
  model: z.string().min(1).max(200),
  slug: z.string().min(1).max(250).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
  processor: z.string().min(1).max(200),
  processorGen: z.string().max(50).optional(),
  ram: z.number().int().positive(),           // GB
  ramType: z.string().max(50).optional(),
  storage: z.number().int().positive(),       // GB
  storageType: z.enum(['HDD', 'SSD', 'NVMe', 'eMMC']),
  display: z.string().max(100).optional(),
  resolution: z.string().max(50).optional(),
  gpu: z.string().max(200).optional(),
  os: z.string().max(100).optional(),
  battery: z.string().max(100).optional(),
  weight: z.number().positive().optional(),   // kg
  color: z.string().max(50).optional(),
  grade: z.enum(['A_PLUS', 'A', 'B']),
  priceInPaise: z.number().int().positive(),   // in paise
  mrpInPaise: z.number().int().positive().optional(),
  stock: z.number().int().min(0),
  description: z.string().max(5000).optional(),
  features: z.array(z.string().max(200)).max(20).optional(),
  warrantyMonths: z.number().int().min(0).max(60).optional(),
  status: z.enum(['AVAILABLE', 'SOLD', 'RESERVED', 'HIDDEN']).default('AVAILABLE'),
});

export const LaptopFilterSchema = z.object({
  brand: z.string().max(100).optional(),
  minPrice: z.coerce.number().int().min(0).optional(),   // paise
  maxPrice: z.coerce.number().int().min(0).optional(),   // paise
  ram: z.coerce.number().int().positive().optional(),
  storage: z.coerce.number().int().positive().optional(),
  processor: z.string().max(200).optional(),
  grade: z.enum(['A_PLUS', 'A', 'B']).optional(),
  inStock: z.coerce.boolean().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'popular', 'rating']).optional().default('newest'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().max(200).optional(),
});

// ─── Order / Checkout ──────────────────────────────────────────────────

export const OrderSchema = z.object({
  shippingAddressId: z.string().uuid().optional(),
  shippingAddress: z.object({
    name: z.string().min(2).max(100),
    phone: IndianPhone,
    line1: z.string().min(5).max(300),
    line2: z.string().max(300).optional(),
    city: z.string().min(2).max(100),
    state: z.string().min(2).max(100),
    pincode: PincodeSchema,
    country: z.string().default('India'),
  }).optional(),
  couponCode: z.string().max(50).optional(),
  notes: z.string().max(500).optional(),
}).refine((d) => d.shippingAddressId || d.shippingAddress, {
  message: 'Shipping address is required',
  path: ['shippingAddress'],
});

// ─── Booking / Meetings ────────────────────────────────────────────────

export const BookingSchema = z.object({
  name: z.string().min(2, 'Name too short').max(100),
  phone: IndianPhone,
  email: z.string().email('Invalid email').toLowerCase(),
  laptopIds: z.array(z.string().uuid()).min(1, 'Select at least one laptop').max(10),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/, 'Time slot must be HH:MM'),
  notes: z.string().max(1000).optional(),
  videoCallConsent: z.boolean(),
  otpToken: z.string().min(1, 'OTP verification required'), // signed token proving OTP verified
  captchaToken: z.string().min(1, 'CAPTCHA required'),
});

// ─── OTP ───────────────────────────────────────────────────────────────

export const OtpSendSchema = z.object({
  type: z.enum(['phone', 'email']),
  phone: IndianPhone.optional(),
  email: z.string().email().toLowerCase().optional(),
  purpose: z.enum(['login', 'signup', 'booking', 'password_reset', 'account_delete']),
}).refine((d) => {
  if (d.type === 'phone') return !!d.phone;
  if (d.type === 'email') return !!d.email;
  return false;
}, { message: 'Phone or email required based on type' });

export const OtpVerifySchema = z.object({
  type: z.enum(['phone', 'email']),
  phone: IndianPhone.optional(),
  email: z.string().email().toLowerCase().optional(),
  purpose: z.enum(['login', 'signup', 'booking', 'password_reset', 'account_delete']),
  code: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

// ─── Contact form ──────────────────────────────────────────────────────

export const ContactSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase(),
  phone: IndianPhone.optional(),
  subject: z.string().min(5).max(200).trim(),
  message: z.string().min(10).max(2000).trim(),
  captchaToken: z.string().min(1, 'CAPTCHA required'),
});

// ─── Review ────────────────────────────────────────────────────────────

export const ReviewSchema = z.object({
  laptopId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(150).trim(),
  body: z.string().min(10).max(3000).trim(),
  guestEmail: z.string().email().toLowerCase().optional(), // for guest reviews
  captchaToken: z.string().min(1, 'CAPTCHA required'),
});

// ─── Bulk enquiry ──────────────────────────────────────────────────────

export const BulkEnquirySchema = z.object({
  companyName: z.string().min(2).max(200).trim(),
  contactName: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase(),
  phone: IndianPhone,
  quantity: z.number().int().min(5).max(10000),
  budget: z.string().max(100).optional(),
  requirements: z.string().min(10).max(2000).trim(),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).optional(),
  captchaToken: z.string().min(1, 'CAPTCHA required'),
});

// ─── Cart ──────────────────────────────────────────────────────────────

export const CartAddSchema = z.object({
  laptopId: z.string().uuid(),
  quantity: z.number().int().min(1).max(10),
  sessionId: z.string().max(128).optional(), // guest cart
});

export const CartUpdateSchema = z.object({
  itemId: z.string().uuid(),
  quantity: z.number().int().min(0).max(10), // 0 = remove
});

export const CartRemoveSchema = z.object({
  itemId: z.string().uuid(),
});

// ─── Payment ───────────────────────────────────────────────────────────

export const CreateOrderSchema = z.object({
  shippingAddressId: z.string().uuid().optional(),
  shippingAddress: z.object({
    name: z.string().min(2).max(100),
    phone: IndianPhone,
    line1: z.string().min(5).max(300),
    line2: z.string().max(300).optional(),
    city: z.string().min(2).max(100),
    state: z.string().min(2).max(100),
    pincode: PincodeSchema,
  }).optional(),
  couponCode: z.string().max(50).optional(),
  guestSessionId: z.string().max(128).optional(),
}).refine((d) => d.shippingAddressId || d.shippingAddress, {
  message: 'Shipping address is required',
  path: ['shippingAddress'],
});

export const VerifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  orderId: z.string().uuid(),
});

// ─── Upload ────────────────────────────────────────────────────────────

export const UploadSchema = z.object({
  folder: z.string().max(100).optional().default('general'),
});

// ─── Admin ─────────────────────────────────────────────────────────────

export const AdminOrderStatusSchema = z.object({
  status: z.enum(['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED']),
  reason: z.string().max(500).optional(),
  trackingNumber: z.string().max(100).optional(),
  trackingUrl: z.string().url().optional(),
});

export const RefundSchema = z.object({
  amount: z.number().int().positive(), // paise
  reason: z.string().min(5).max(500),
  notes: z.string().max(500).optional(),
});

export const SiteSettingsSchema = z.object({
  siteName: z.string().max(100).optional(),
  siteTagline: z.string().max(300).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  gstNumber: z.string().max(20).optional(),
  razorpayEnabled: z.boolean().optional(),
  maintenanceMode: z.boolean().optional(),
  announcementText: z.string().max(500).optional(),
  announcementActive: z.boolean().optional(),
  announcementBgColor: z.string().max(20).optional(),
  shippingFeeInPaise: z.number().int().min(0).optional(),
  freeShippingAboveInPaise: z.number().int().min(0).optional(),
  gstPercent: z.number().min(0).max(100).optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  socialLinks: z.object({
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    twitter: z.string().url().optional(),
    youtube: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    whatsapp: z.string().max(20).optional(),
  }).optional(),
});

export const AnnouncementSchema = z.object({
  text: z.string().max(500).min(1),
  active: z.boolean(),
  bgColor: z.string().max(20).optional(),
  link: z.string().url().optional(),
  linkText: z.string().max(100).optional(),
});

export const ContentBlogSchema = z.object({
  title: z.string().min(5).max(300),
  slug: z.string().min(1).max(350).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(50),
  coverImage: z.string().url().optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  published: z.boolean().default(false),
  publishedAt: z.string().datetime().optional(),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(500).optional(),
});

export const ContentFaqSchema = z.object({
  question: z.string().min(5).max(500),
  answer: z.string().min(5).max(5000),
  category: z.string().max(100).optional(),
  order: z.number().int().min(0).optional(),
  published: z.boolean().default(true),
});

export const ReviewModerateSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  adminNote: z.string().max(500).optional(),
});

export const AvailabilitySlotSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/),
  maxBookings: z.number().int().min(1).max(20).default(5),
  staffId: z.string().uuid().optional(),
  isBlocked: z.boolean().optional(),
});

export const MeetingUpdateSchema = z.object({
  status: z.enum(['SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  staffId: z.string().uuid().optional(),
  cancelReason: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
});

export const PincodeCheckSchema = z.object({
  pincode: PincodeSchema,
});


export const AccountDeleteSchema = z.object({
  password: z.string().min(1, 'Password confirmation is required'),
  reason: z.string().max(500).optional(),
});
