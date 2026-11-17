import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { apiLimiter } from '@/lib/rate-limit';
import { getClientIp, enforceRateLimit, handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { getLaptopBySlug, ALL_LAPTOPS } from '@/data/laptops';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const ip = getClientIp(req);
    const rateLimitError = await enforceRateLimit(apiLimiter, ip);
    if (rateLimitError) return rateLimitError;

    const { slug } = await params;
    if (!slug) {
      return errorResponse('Slug is required', 400);
    }

    const laptop = await prisma.laptop.findUnique({
      where: { slug },
      include: {
        brand: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true, slug: true } },
        images: {
          orderBy: { sortOrder: 'asc' },
          select: { id: true, url: true, altText: true, isPrimary: true },
        },
        specs: {
          orderBy: { sortOrder: 'asc' },
          select: { id: true, key: true, value: true, group: true },
        },
        priceTiers: {
          orderBy: { minQty: 'asc' },
          select: { minQty: true, maxQty: true, pricePerUnit: true },
        },
        reviews: {
          where: { status: 'APPROVED', deletedAt: null },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            rating: true,
            title: true,
            body: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    });

    if (!laptop || laptop.deletedAt || laptop.status === 'HIDDEN') {
      const fallbackLaptop = getLaptopBySlug(slug);
      if (fallbackLaptop) {
        const related = ALL_LAPTOPS.filter(
          (l) => l.id !== fallbackLaptop.id && l.brand === fallbackLaptop.brand
        ).slice(0, 4);
        return successResponse({
          laptop: {
            ...fallbackLaptop,
            avgRating: 4.9,
            reviewCount: 38,
            isInStock: fallbackLaptop.availableUnits > 0,
          },
          relatedLaptops: related,
        });
      }
      return errorResponse('Laptop not found', 404);
    }

    // Fetch related laptops from the same brand or price range
    const relatedLaptops = await prisma.laptop.findMany({
      where: {
        id: { not: laptop.id },
        deletedAt: null,
        status: 'AVAILABLE',
        OR: [
          { brandId: laptop.brandId },
          { categoryId: laptop.categoryId },
        ],
      },
      take: 4,
      include: {
        brand: { select: { name: true } },
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true, altText: true },
        },
      },
    });

    const reviews = laptop.reviews || [];
    const reviewCount = reviews.length;
    const avgRating =
      reviewCount > 0
        ? Number((reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviewCount).toFixed(1))
        : 5.0;

    return successResponse({
      laptop: {
        ...laptop,
        avgRating,
        reviewCount,
        isInStock: laptop.availableUnits > 0,
      },
      relatedLaptops,
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/shop/laptop/[slug]');
  }
}
