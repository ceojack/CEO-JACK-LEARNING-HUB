import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://ceojacklearninghub.com', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://ceojacklearninghub.com/about', lastModified: new Date(), priority: 0.8 },
    { url: 'https://ceojacklearninghub.com/services', lastModified: new Date(), priority: 0.8 },
    { url: 'https://ceojacklearninghub.com/contact', lastModified: new Date(), priority: 0.8 },
  ]
}