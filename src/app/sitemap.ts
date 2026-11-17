import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nextgenithub.in';

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/shop',
    '/bulk-order',
    '/video-demo',
    '/about',
    '/contact',
    '/faq',
    '/compare',
    '/reviews',
    '/service-coverage',
    '/blog',
    '/warranty-policy',
    '/return-refund-policy',
    '/shipping-policy',
    '/privacy-policy',
    '/terms',
    '/cookie-policy',
    '/grievance-officer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  let laptopRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const laptops = await prisma.laptop.findMany({
      where: { deletedAt: null, status: 'AVAILABLE' },
      select: { slug: true, updatedAt: true },
      take: 200,
    });

    laptopRoutes = laptops.map((l) => ({
      url: `${baseUrl}/shop/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
  } catch {
    // Fallback static slugs
    laptopRoutes = [
      'dell-latitude-7490-i5-8th-16gb-512gb',
      'lenovo-thinkpad-t480-i5-16gb-256gb',
      'hp-elitebook-840-g6-i7-16gb-512gb',
      'apple-macbook-air-m1-8gb-256gb-space-grey',
    ].map((slug) => ({
      url: `${baseUrl}/shop/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));
  }

  try {
    const blogs = await prisma.blog.findMany({
      where: { deletedAt: null, isPublished: true },
      select: { slug: true, updatedAt: true },
      take: 100,
    });

    blogRoutes = blogs.map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {}

  return [...staticRoutes, ...laptopRoutes, ...blogRoutes];
}
