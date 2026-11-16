import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard',
        '/profile',
        '/onboarding',
        '/api/',
        '/login',
        '/signup',
        '/reset-password',
        '/jack-ai',
        '/ai',
        '/auth',
        '/lesson',
      ],
    },
    sitemap: 'https://ceojacklearninghub.com/sitemap.xml',
  }
}
