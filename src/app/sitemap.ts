import { MetadataRoute } from 'next'
import { getAllIndustrySlugs } from '@/data/industries'
import { getAllJobRoleSlugs } from '@/data/job-roles'
import { getAllBlogSlugs } from '@/data/blog-posts'
import { salaryData } from '@/data/salary-data'
import { getBaseUrl, isProduction } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isProduction()) {
    return []
  }

  const baseUrl = getBaseUrl()

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard/matching`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resume-templates`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/job-descriptions`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Industry resume template pages
  const industryPages = getAllIndustrySlugs().map((slug) => ({
    url: `${baseUrl}/resume-templates/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Job description pages
  const jobRolePages = getAllJobRoleSlugs().map((slug) => ({
    url: `${baseUrl}/job-descriptions/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Blog post pages
  const blogPages = getAllBlogSlugs().map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Salary guide pages
  const salaryPages: MetadataRoute.Sitemap = []
  salaryData.forEach(roleData => {
    Object.keys(roleData.locations).forEach(location => {
      salaryPages.push({
        url: `${baseUrl}/salary-guide/${location}/${roleData.roleSlug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })
    })
  })

  return [...staticPages, ...industryPages, ...jobRolePages, ...blogPages, ...salaryPages]
}