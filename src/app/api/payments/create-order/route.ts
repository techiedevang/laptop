import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { paymentOrderLimiter } from '@/lib/rate-limit';
import { getClientIp, enforceRateLimit, handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { getUserSession } from '@/lib/server-auth';
import { CreateOrderSchema } from '@/lib/validations';
import { createRazorpayOrder } from '@/lib/razorpay';
import { computeOrderGST, SELLER_STATE } from '@/lib/gst';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitError = await enforceRateLimit(paymentOrderLimiter, ip);
    if (rateLimitError) return rateLimitError;

    const rawBody = await req.json();
    const body = CreateOrderSchema.parse(rawBody);

    const user = await getUserSession(req);
    const cookieStore = await cookies();
    const guestSessionId = body.guestSessionId || cookieStore.get('guest_session_id')?.value;

    if (!user && !guestSessionId) {
      return errorResponse('User session or guest session is required', 400);
    }

    // 1. Fetch user's cart
    const cart = await prisma.cart.findFirst({
      where: user ? { userId: user.id } : { sessionId: guestSessionId },
      include: {
        items: {
          include: {
            laptop: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return errorResponse('Cart is empty', 400);
    }

    // 2. Validate stock availability for all items
    for (const item of cart.items) {
      if (item.laptop.deletedAt || item.laptop.status !== 'AVAILABLE') {
        return errorResponse(`Laptop "${item.laptop.model}" is no longer available`, 400);
      }
      if (item.laptop.availableUnits < item.quantity) {
        return errorResponse(
          `Insufficient stock for "${item.laptop.model}". Only ${item.laptop.availableUnits} left.`,
          400,
        );
      }
    }

    // 3. Address resolution
    let addressId: string | undefined = body.shippingAddressId;
    let shippingCity = 'Mumbai';
    let shippingState = 'Maharashtra';
    let buyerName = user?.name || body.shippingAddress?.name || 'Customer';
    let buyerPhone = body.shippingAddress?.phone || '9999999999';
    let buyerEmail = user?.email || 'customer@example.com';

    if (body.shippingAddress) {
      shippingCity = body.shippingAddress.city;
      shippingState = body.shippingAddress.state;
      buyerName = body.shippingAddress.name;
      buyerPhone = body.shippingAddress.phone;

      if (user) {
        const newAddr = await prisma.userAddress.create({
          data: {
            userId: user.id,
            name: body.shippingAddress.name,
            phone: body.shippingAddress.phone,
            line1: body.shippingAddress.line1,
            line2: body.shippingAddress.line2,
            city: body.shippingAddress.city,
            state: body.shippingAddress.state,
            pincode: body.shippingAddress.pincode,
          },
        });
        addressId = newAddr.id;
      }
    } else if (addressId) {
      const existingAddr = await prisma.userAddress.findUnique({
        where: { id: addressId },
      });
      if (existingAddr) {
        shippingCity = existingAddr.city;
        shippingState = existingAddr.state;
        buyerName = existingAddr.name;
      }
    }

    // 4. Calculate Subtotal from Database (Never client price)
    let subtotalPaise = 0;
    const itemsForGst = cart.items.map((item) => {
      const lineTotal = item.laptop.sellingPrice * item.quantity;
      subtotalPaise += lineTotal;
      return {
        sellingPrice: item.laptop.sellingPrice,
        quantity: item.quantity,
        gstRate: item.laptop.gstRate || 18,
      };
    });

    // 5. Coupon validation
    let discountPaise = 0;
    let validCouponId: string | undefined;

    if (body.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: body.couponCode.toUpperCase().trim() },
      });

      const now = new Date();
      if (
        coupon &&
        coupon.isActive &&
        (!coupon.validUntil || coupon.validUntil > now) &&
        (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) &&
        (!coupon.minOrderValue || subtotalPaise >= coupon.minOrderValue)
      ) {
        validCouponId = coupon.id;
        if (coupon.discountType === 'PERCENTAGE') {
          const discount = Math.round((subtotalPaise * coupon.discountValue) / 100);
          discountPaise = coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount;
        } else {
          discountPaise = coupon.discountValue;
        }
      }
    }

    // 6. Compute GST Server-side
    const gstCalculation = computeOrderGST(itemsForGst, shippingState);
    const shippingFeePaise = 0; // Free shipping
    const totalPaise = Math.max(0, gstCalculation.total - discountPaise) + shippingFeePaise;

    // 7. Generate order reference
    const orderNumber = `NGH-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // 8. Create Razorpay order
    const rzpOrder = await createRazorpayOrder({
      amountPaise: totalPaise,
      receipt: orderNumber,
      notes: {
        orderNumber,
        buyerEmail,
      },
    });

    // 9. Database transaction: Create order, decrement stock, save payment
    const newOrder = await prisma.$transaction(async (tx) => {
      // Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user?.id,
          addressId: addressId,
          guestName: user ? undefined : buyerName,
          guestPhone: user ? undefined : buyerPhone,
          guestEmail: user ? undefined : buyerEmail,
          subtotal: subtotalPaise,
          discountAmount: discountPaise,
          cgst: gstCalculation.cgst,
          sgst: gstCalculation.sgst,
          igst: gstCalculation.igst,
          shippingFee: shippingFeePaise,
          total: totalPaise,
          couponId: validCouponId,
          paymentMethod: 'RAZORPAY',
          paymentStatus: 'PENDING',
          status: 'PLACED',
        },
      });

      // Create OrderItems
      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            laptopId: item.laptopId,
            quantity: item.quantity,
            unitPrice: item.laptop.sellingPrice,
            gstRate: item.laptop.gstRate || 18,
            total: item.laptop.sellingPrice * item.quantity,
          },
        });

        // Reserve stock: decrement available units
        await tx.laptop.update({
          where: { id: item.laptopId },
          data: {
            availableUnits: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Record Payment attempt
      await tx.payment.create({
        data: {
          orderId: order.id,
          razorpayOrderId: rzpOrder.id,
          method: 'RAZORPAY',
          status: 'PENDING',
          amount: totalPaise,
          currency: 'INR',
        },
      });

      return order;
    });

    return successResponse({
      orderId: newOrder.id,
      orderNumber,
      razorpayOrderId: rzpOrder.id,
      amount: totalPaise,
      currency: 'INR',
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || '',
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/payments/create-order');
  }
}
