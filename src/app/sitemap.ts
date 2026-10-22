import { MetadataRoute } from 'next'
import { blogPosts } from '@/src/lib/blog-posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ceojacklearninghub.com'
  const now = new Date()

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/author/ceo-jack`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(`${post.datePublished}T00:00:00Z`),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
