import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cartLimiter } from '@/lib/rate-limit';
import { getClientIp, enforceRateLimit, handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { getUserSession } from '@/lib/server-auth';
import { CartAddSchema, CartUpdateSchema, CartRemoveSchema } from '@/lib/validations';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

async function getOrSetGuestSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let guestId = cookieStore.get('guest_session_id')?.value;
  if (!guestId) {
    guestId = 'guest_' + crypto.randomBytes(16).toString('hex');
  }
  return guestId;
}

async function getOrCreateCart(userId?: string, sessionId?: string) {
  if (userId) {
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            laptop: {
              include: {
                brand: { select: { name: true } },
                images: { where: { isPrimary: true }, take: 1, select: { url: true } },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              laptop: {
                include: {
                  brand: { select: { name: true } },
                  images: { where: { isPrimary: true }, take: 1, select: { url: true } },
                },
              },
            },
          },
        },
      });
    }

    // Merge guest cart if sessionId exists
    if (sessionId) {
      const guestCart = await prisma.cart.findFirst({
        where: { sessionId },
        include: { items: true },
      });

      if (guestCart && guestCart.items.length > 0) {
        for (const gItem of guestCart.items) {
          const existingItem = cart.items.find((i) => i.laptopId === gItem.laptopId);
          if (existingItem) {
            await prisma.cartItem.update({
              where: { id: existingItem.id },
              data: { quantity: existingItem.quantity + gItem.quantity },
            });
          } else {
            await prisma.cartItem.create({
              data: {
                cartId: cart.id,
                laptopId: gItem.laptopId,
                quantity: gItem.quantity,
              },
            });
          }
        }
        await prisma.cart.delete({ where: { id: guestCart.id } });

        // Reload updated cart
        cart = (await prisma.cart.findUnique({
          where: { id: cart.id },
          include: {
            items: {
              include: {
                laptop: {
                  include: {
                    brand: { select: { name: true } },
                    images: { where: { isPrimary: true }, take: 1, select: { url: true } },
                  },
                },
              },
            },
          },
        }))!;
      }
    }

    return cart;
  }

  // Guest cart
  const sId = sessionId || (await getOrSetGuestSessionId());
  let cart = await prisma.cart.findFirst({
    where: { sessionId: sId },
    include: {
      items: {
        include: {
          laptop: {
            include: {
              brand: { select: { name: true } },
              images: { where: { isPrimary: true }, take: 1, select: { url: true } },
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId: sId },
      include: {
        items: {
          include: {
            laptop: {
              include: {
                brand: { select: { name: true } },
                images: { where: { isPrimary: true }, take: 1, select: { url: true } },
              },
            },
          },
        },
      },
    });
  }

  return cart;
}

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitError = await enforceRateLimit(cartLimiter, ip);
    if (rateLimitError) return rateLimitError;

    const user = await getUserSession(req);
    const cookieStore = await cookies();
    const guestSessionId = cookieStore.get('guest_session_id')?.value;

    const cart = await getOrCreateCart(user?.id, guestSessionId);

    // Calculate totals
    let subtotalPaise = 0;
    const formattedItems = cart.items.map((item) => {
      const lineTotal = item.laptop.sellingPrice * item.quantity;
      subtotalPaise += lineTotal;
      return {
        id: item.id,
        laptopId: item.laptopId,
        model: item.laptop.model,
        brand: item.laptop.brand.name,
        pricePaise: item.laptop.sellingPrice,
        mrpPaise: item.laptop.mrp,
        quantity: item.quantity,
        availableUnits: item.laptop.availableUnits,
        inStock: item.laptop.availableUnits >= item.quantity,
        imageUrl: item.laptop.images[0]?.url || null,
        lineTotalPaise: lineTotal,
      };
    });

    const response = successResponse({
      cartId: cart.id,
      items: formattedItems,
      subtotalPaise,
      itemCount: formattedItems.reduce((acc, i) => acc + i.quantity, 0),
    });

    if (!user && !guestSessionId) {
      response.cookies.set('guest_session_id', cart.sessionId!, {
        httpOnly: true,
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (error) {
    return handleApiError(error, 'GET /api/cart');
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitError = await enforceRateLimit(cartLimiter, ip);
    if (rateLimitError) return rateLimitError;

    const rawBody = await req.json();
    const body = CartAddSchema.parse(rawBody);

    const laptop = await prisma.laptop.findUnique({
      where: { id: body.laptopId },
    });

    if (!laptop || laptop.deletedAt || laptop.status !== 'AVAILABLE') {
      return errorResponse('Laptop is unavailable', 404);
    }

    if (laptop.availableUnits < body.quantity) {
      return errorResponse(
        `Only ${laptop.availableUnits} units available in stock`,
        400,
      );
    }

    const user = await getUserSession(req);
    const cookieStore = await cookies();
    const guestSessionId = body.sessionId || cookieStore.get('guest_session_id')?.value;

    const cart = await getOrCreateCart(user?.id, guestSessionId);

    // Upsert cart item
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_laptopId: {
          cartId: cart.id,
          laptopId: body.laptopId,
        },
      },
    });

    const newQuantity = (existingItem?.quantity || 0) + body.quantity;
    if (newQuantity > laptop.availableUnits) {
      return errorResponse(
        `Cannot add more. Only ${laptop.availableUnits} units available`,
        400,
      );
    }

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          laptopId: body.laptopId,
          quantity: body.quantity,
        },
      });
    }

    const response = successResponse({
      message: 'Item added to cart',
      cartId: cart.id,
    });

    if (!user && !guestSessionId && cart.sessionId) {
      response.cookies.set('guest_session_id', cart.sessionId, {
        httpOnly: true,
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (error) {
    return handleApiError(error, 'POST /api/cart');
  }
}

export async function PUT(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitError = await enforceRateLimit(cartLimiter, ip);
    if (rateLimitError) return rateLimitError;

    const rawBody = await req.json();
    const body = CartUpdateSchema.parse(rawBody);

    const item = await prisma.cartItem.findUnique({
      where: { id: body.itemId },
      include: { laptop: true },
    });

    if (!item) {
      return errorResponse('Cart item not found', 404);
    }

    if (body.quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: body.itemId } });
      return successResponse({ message: 'Item removed from cart' });
    }

    if (body.quantity > item.laptop.availableUnits) {
      return errorResponse(
        `Only ${item.laptop.availableUnits} units in stock`,
        400,
      );
    }

    const updated = await prisma.cartItem.update({
      where: { id: body.itemId },
      data: { quantity: body.quantity },
    });

    return successResponse({
      message: 'Quantity updated',
      item: updated,
    });
  } catch (error) {
    return handleApiError(error, 'PUT /api/cart');
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitError = await enforceRateLimit(cartLimiter, ip);
    if (rateLimitError) return rateLimitError;

    const url = new URL(req.url);
    const itemId = url.searchParams.get('itemId');

    if (itemId) {
      await prisma.cartItem.deleteMany({
        where: { id: itemId },
      });
      return successResponse({ message: 'Item removed' });
    }

    // Clear entire cart
    const user = await getUserSession(req);
    const cookieStore = await cookies();
    const guestSessionId = cookieStore.get('guest_session_id')?.value;

    const cart = await getOrCreateCart(user?.id, guestSessionId);
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return successResponse({ message: 'Cart cleared' });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/cart');
  }
}
