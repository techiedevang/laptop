export const UserRole = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const AdminRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF',
} as const;
export type AdminRole = (typeof AdminRole)[keyof typeof AdminRole];

export const LaptopStatus = {
  AVAILABLE: 'AVAILABLE',
  SOLD: 'SOLD',
  RESERVED: 'RESERVED',
  HIDDEN: 'HIDDEN',
} as const;
export type LaptopStatus = (typeof LaptopStatus)[keyof typeof LaptopStatus];

export const LaptopGrade = {
  A_PLUS: 'A_PLUS',
  A: 'A',
  B: 'B',
} as const;
export type LaptopGrade = (typeof LaptopGrade)[keyof typeof LaptopGrade];

export const UnitStatus = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  SOLD: 'SOLD',
  HIDDEN: 'HIDDEN',
} as const;
export type UnitStatus = (typeof UnitStatus)[keyof typeof UnitStatus];

export const OrderStatus = {
  PLACED: 'PLACED',
  CONFIRMED: 'CONFIRMED',
  PACKED: 'PACKED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED',
  REFUNDED: 'REFUNDED',
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  PARTIAL_REFUND: 'PARTIAL_REFUND',
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentMethod = {
  RAZORPAY: 'RAZORPAY',
  COD: 'COD',
  BANK_TRANSFER: 'BANK_TRANSFER',
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const MeetingStatus = {
  SCHEDULED: 'SCHEDULED',
  LIVE: 'LIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
} as const;
export type MeetingStatus = (typeof MeetingStatus)[keyof typeof MeetingStatus];

export const DataRequestType = {
  ACCESS: 'ACCESS',
  CORRECTION: 'CORRECTION',
  DELETION: 'DELETION',
} as const;
export type DataRequestType = (typeof DataRequestType)[keyof typeof DataRequestType];

export const DataRequestStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
} as const;
export type DataRequestStatus = (typeof DataRequestStatus)[keyof typeof DataRequestStatus];

export const TicketStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
} as const;
export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];

export const ReviewStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;
export type ReviewStatus = (typeof ReviewStatus)[keyof typeof ReviewStatus];

export const NotificationType = {
  EMAIL: 'EMAIL',
  WHATSAPP: 'WHATSAPP',
  SMS: 'SMS',
  PUSH: 'PUSH',
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export const BulkEnquiryStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUOTED: 'QUOTED',
  NEGOTIATING: 'NEGOTIATING',
  CONVERTED: 'CONVERTED',
  LOST: 'LOST',
} as const;
export type BulkEnquiryStatus = (typeof BulkEnquiryStatus)[keyof typeof BulkEnquiryStatus];
