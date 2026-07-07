import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight, BookOpen, TrendingUp } from 'lucide-react';
import { blogPosts, getBlogPostsByCategory } from '@/data/blog-posts';
import { getBaseUrl, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Resume Tips & Career Advice Blog',
  description: 'Expert resume tips, job search strategies, and career advice. Learn how to optimize your CV, ace interviews, and land your dream job with our comprehensive guides.',
  keywords: 'resume tips, job search advice, career guidance, CV optimization, interview tips, job application strategies, career development',
  alternates: {
    canonical: `${getBaseUrl()}/blog`,
  },
  openGraph: {
    title: 'Resume Tips & Career Advice Blog',
    description: 'Expert guides on resume optimization, job search strategies, and career development.',
    type: 'website',
  },
};

export default function BlogPage() {
  const baseUrl = getBaseUrl();
  const featuredPosts = blogPosts.slice(0, 3);
  const resumeTips = getBlogPostsByCategory('resume-tips');
  const careerAdvice = getBlogPostsByCategory('career-advice');
  const jobSearchTips = getBlogPostsByCategory('job-search');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": `${SITE_NAME} Blog`,
    "description": "Expert resume tips, job search strategies, and career advice",
    "url": `${baseUrl}/blog`,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "url": `${baseUrl}/blog/${post.slug}`,
      "datePublished": post.publishedAt,
      "author": {
        "@type": "Organization",
        "name": SITE_NAME
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/20 pt-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
              Resume Tips & Career Advice
            </h1>
            <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto text-gray-600">
              Expert guides, proven strategies, and actionable tips to help you optimize your resume, 
              ace your job search, and advance your career in 2025.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full ring-1 ring-gray-900/10">
                <BookOpen className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">{blogPosts.length} Articles</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full ring-1 ring-gray-900/10">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">Updated Weekly</span>
              </div>
            </div>
            <Link href="/login">
              <Button size="lg">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Articles
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our most popular and comprehensive guides to help you succeed in your job search.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {featuredPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.category.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {post.searchVolume.toLocaleString()} searches/mo
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-gray-600 transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-3">
                      {post.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime} min read</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Tags</div>
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Browse by Category
              </h2>
              <p className="text-lg text-gray-600">
                Find exactly what you&apos;re looking for with our organized content categories.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Resume Tips */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-gray-900" />
                  </div>
                  Resume Tips
                </h3>
                <div className="space-y-3">
                  {resumeTips.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="block p-3 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-semibold text-sm mb-1 line-clamp-2">{post.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime} min read</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Career Advice */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-gray-900" />
                  </div>
                  Career Advice
                </h3>
                <div className="space-y-3">
                  {careerAdvice.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="block p-3 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-semibold text-sm mb-1 line-clamp-2">{post.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime} min read</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Job Search */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-gray-900" />
                  </div>
                  Job Search
                </h3>
                <div className="space-y-3">
                  {jobSearchTips.length > 0 ? jobSearchTips.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="block p-3 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-semibold text-sm mb-1 line-clamp-2">{post.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime} min read</span>
                      </div>
                    </Link>
                  )) : (
                    <div className="p-3 border rounded-lg text-center text-gray-500">
                      <p className="text-sm">More job search articles coming soon!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Stay Ahead in Your Career
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Get the latest resume tips, job search strategies, and career insights delivered to your inbox weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              />
              <Button variant="secondary" className="px-8">
                Subscribe
              </Button>
            </div>
            <p className="text-sm mt-4 text-gray-400">
              Join 10,000+ professionals who get our weekly newsletter. Unsubscribe anytime.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}