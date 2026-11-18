import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/server-auth';
import { handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { ContentBlogSchema, ContentFaqSchema, ReviewModerateSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const url = new URL(req.url);
    const type = url.searchParams.get('type') || 'blogs';

    switch (type) {
      case 'blogs': {
        const blogs = await prisma.blog.findMany({
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          include: { category: true },
        });
        return successResponse({ blogs });
      }
      case 'faqs': {
        const faqs = await prisma.faq.findMany({
          where: { deletedAt: null },
          orderBy: { sortOrder: 'asc' },
          include: { category: true },
        });
        return successResponse({ faqs });
      }
      case 'reviews': {
        const status = url.searchParams.get('status') || undefined;
        const reviews = await prisma.review.findMany({
          where: {
            deletedAt: null,
            ...(status ? { status: status as any } : {}),
          },
          orderBy: { createdAt: 'desc' },
          include: { laptop: { select: { id: true, model: true } } },
        });
        return successResponse({ reviews });
      }
      case 'partners': {
        const partners = await prisma.partner.findMany({
          where: { deletedAt: null },
          orderBy: { sortOrder: 'asc' },
        });
        return successResponse({ partners });
      }
      case 'comparison': {
        const rows = await prisma.comparisonRow.findMany({
          orderBy: { sortOrder: 'asc' },
        });
        return successResponse({ rows });
      }
      case 'serviceAreas': {
        const areas = await prisma.serviceArea.findMany({
          orderBy: { city: 'asc' },
        });
        return successResponse({ areas });
      }
      case 'counters': {
        const counters = await prisma.siteCounter.findMany();
        return successResponse({ counters });
      }
      default:
        return errorResponse(`Invalid content type: ${type}`, 400);
    }
  } catch (error) {
    return handleApiError(error, 'GET /api/admin/content');
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const rawBody = await req.json();
    const type = rawBody.type;

    switch (type) {
      case 'blog': {
        const body = ContentBlogSchema.parse(rawBody.data);
        const blog = await prisma.blog.create({
          data: {
            title: body.title,
            slug: body.slug,
            excerpt: body.excerpt,
            content: body.content,
            coverImageUrl: body.coverImage,
            tags: body.tags || [],
            isPublished: body.published,
            publishedAt: body.published ? new Date() : null,
            metaTitle: body.seoTitle,
            metaDesc: body.seoDescription,
          },
        });
        return successResponse({ blog }, 201);
      }
      case 'faq': {
        const body = ContentFaqSchema.parse(rawBody.data);
        // Find or create default FAQ category
        const cat = await prisma.faqCategory.upsert({
          where: { slug: 'general' },
          update: {},
          create: { name: 'General', slug: 'general' },
        });
        const faq = await prisma.faq.create({
          data: {
            categoryId: cat.id,
            question: body.question,
            answer: body.answer,
            sortOrder: body.order || 0,
            isPublished: body.published,
          },
        });
        return successResponse({ faq }, 201);
      }
      case 'partner': {
        const partner = await prisma.partner.create({
          data: {
            name: rawBody.data.name,
            logoUrl: rawBody.data.logoUrl,
            website: rawBody.data.website,
            caseStudy: rawBody.data.caseStudy,
            sortOrder: rawBody.data.sortOrder || 0,
          },
        });
        return successResponse({ partner }, 201);
      }
      case 'comparison': {
        const row = await prisma.comparisonRow.create({
          data: {
            feature: rawBody.data.feature,
            us: rawBody.data.us,
            others: rawBody.data.others,
            highlight: rawBody.data.highlight || false,
            sortOrder: rawBody.data.sortOrder || 0,
          },
        });
        return successResponse({ row }, 201);
      }
      case 'serviceArea': {
        const area = await prisma.serviceArea.create({
          data: {
            city: rawBody.data.city,
            state: rawBody.data.state,
            pincodes: rawBody.data.pincodes || [],
            isActive: rawBody.data.isActive ?? true,
          },
        });
        return successResponse({ area }, 201);
      }
      default:
        return errorResponse(`Invalid content creation type: ${type}`, 400);
    }
  } catch (error) {
    return handleApiError(error, 'POST /api/admin/content');
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin(req);
    const rawBody = await req.json();
    const { type, id, data } = rawBody;

    if (!type || !id) {
      return errorResponse('Content type and id are required', 400);
    }

    switch (type) {
      case 'review_moderate': {
        const parsed = ReviewModerateSchema.parse(data);
        const review = await prisma.review.update({
          where: { id },
          data: { status: parsed.status },
        });
        return successResponse({ review });
      }
      case 'blog': {
        const blog = await prisma.blog.update({
          where: { id },
          data: {
            ...(data.title ? { title: data.title } : {}),
            ...(data.content ? { content: data.content } : {}),
            ...(data.excerpt !== undefined ? { excerpt: data.excerpt } : {}),
            ...(data.published !== undefined ? { isPublished: data.published, publishedAt: data.published ? new Date() : null } : {}),
          },
        });
        return successResponse({ blog });
      }
      case 'faq': {
        const faq = await prisma.faq.update({
          where: { id },
          data: {
            ...(data.question ? { question: data.question } : {}),
            ...(data.answer ? { answer: data.answer } : {}),
            ...(data.isPublished !== undefined ? { isPublished: data.isPublished } : {}),
          },
        });
        return successResponse({ faq });
      }
      case 'counter': {
        const counter = await prisma.siteCounter.upsert({
          where: { key: data.key },
          update: { value: data.value, label: data.label },
          create: { key: data.key, value: data.value, label: data.label },
        });
        return successResponse({ counter });
      }
      default:
        return errorResponse(`Unsupported update type: ${type}`, 400);
    }
  } catch (error) {
    return handleApiError(error, 'PUT /api/admin/content');
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req);
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const id = url.searchParams.get('id');

    if (!type || !id) {
      return errorResponse('type and id are required', 400);
    }

    switch (type) {
      case 'blog':
        await prisma.blog.update({ where: { id }, data: { deletedAt: new Date() } });
        break;
      case 'faq':
        await prisma.faq.update({ where: { id }, data: { deletedAt: new Date() } });
        break;
      case 'review':
        await prisma.review.update({ where: { id }, data: { deletedAt: new Date() } });
        break;
      case 'partner':
        await prisma.partner.update({ where: { id }, data: { deletedAt: new Date() } });
        break;
      case 'comparison':
        await prisma.comparisonRow.delete({ where: { id } });
        break;
      case 'serviceArea':
        await prisma.serviceArea.delete({ where: { id } });
        break;
      default:
        return errorResponse(`Invalid content type: ${type}`, 400);
    }

    return successResponse({ message: 'Deleted successfully' });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/admin/content');
  }
}
