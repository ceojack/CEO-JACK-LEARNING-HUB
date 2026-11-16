import { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    {
      url: 'https://ceojacklearninghub.com/',
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://ceojacklearninghub.com/about',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://ceojacklearninghub.com/contact',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
