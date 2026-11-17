import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { apiLimiter } from '@/lib/rate-limit';
import { getClientIp, enforceRateLimit, handleApiError, successResponse } from '@/lib/api-utils';
import { LaptopFilterSchema } from '@/lib/validations';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitError = await enforceRateLimit(apiLimiter, ip);
    if (rateLimitError) return rateLimitError;

    const url = new URL(req.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());

    // Validate query parameters with Zod schema
    const filters = LaptopFilterSchema.parse(searchParams);

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.LaptopWhereInput = {
      deletedAt: null,
      status: 'AVAILABLE',
    };

    if (filters.brand) {
      where.brand = {
        name: { equals: filters.brand },
      };
    }

    if (filters.grade) {
      where.grade = filters.grade;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.sellingPrice = {};
      if (filters.minPrice !== undefined) {
        where.sellingPrice.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.sellingPrice.lte = filters.maxPrice;
      }
    }

    if (filters.ram) {
      where.ram = { contains: `${filters.ram}` };
    }

    if (filters.storage) {
      where.storage = { contains: `${filters.storage}` };
    }

    if (filters.processor) {
      where.processor = { contains: filters.processor };
    }

    if (filters.inStock) {
      where.availableUnits = { gt: 0 };
    }

    if (filters.search) {
      const q = filters.search.trim();
      where.OR = [
        { model: { contains: q } },
        { processor: { contains: q } },
        { description: { contains: q } },
        { shortDesc: { contains: q } },
      ];
    }

    // Sorting
    let orderBy: Prisma.LaptopOrderByWithRelationInput = { createdAt: 'desc' };
    if (filters.sort === 'price_asc') {
      orderBy = { sellingPrice: 'asc' };
    } else if (filters.sort === 'price_desc') {
      orderBy = { sellingPrice: 'desc' };
    } else if (filters.sort === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const [total, laptops] = await Promise.all([
      prisma.laptop.count({ where }),
      prisma.laptop.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          brand: { select: { id: true, name: true, slug: true } },
          category: { select: { id: true, name: true, slug: true } },
          images: {
            orderBy: { sortOrder: 'asc' },
            select: { id: true, url: true, altText: true, isPrimary: true },
          },
          reviews: {
            where: { status: 'APPROVED' },
            select: { rating: true },
          },
        },
      }),
    ]);

    const formattedLaptops = laptops.map((laptop) => {
      const reviewCount = laptop.reviews.length;
      const avgRating =
        reviewCount > 0
          ? Number((laptop.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
          : 5.0;

      const { reviews, ...rest } = laptop;
      return {
        ...rest,
        avgRating,
        reviewCount,
      };
    });

    return successResponse({
      laptops: formattedLaptops,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/shop/laptops');
  }
}
