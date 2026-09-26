import type { MetadataRoute } from 'next';
import { PRODUCTS } from '@/lib/products-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alighs.vercel.app';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/appointment`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/instagram`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = PRODUCTS
    .filter((p) => p.status !== 'inactive')
    .map((p) => ({
      url: `${baseUrl}/shop/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  return [...staticRoutes, ...productRoutes];
}
