import { MetadataRoute } from 'next'
import { getBaseUrl, isProduction } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  if (!isProduction()) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  const baseUrl = getBaseUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/api/',
        '/admin/',
        '/_next/',
        '/private/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
