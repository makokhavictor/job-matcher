import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Search, ArrowRight } from 'lucide-react';
import { industries } from '@/data/industries';

export const metadata: Metadata = {
  title: 'Free Resume Templates by Industry | ATS-Optimized CV Templates',
  description: 'Download free, ATS-optimized resume templates for every industry. Get expert tips, salary insights, and industry-specific keywords to land your dream job.',
  keywords: 'resume templates, CV templates, ATS resume, free resume templates, industry resume templates, resume examples, professional resume templates',
  openGraph: {
    title: 'Free Resume Templates by Industry | ATS-Optimized',
    description: 'Professional resume templates optimized for ATS systems. Choose from templates for software engineering, healthcare, finance, and more.',
    type: 'website',
  },
};

export default function ResumeTemplatesPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Resume Templates by Industry",
    "description": "Professional resume templates optimized for different industries and ATS systems",
    "url": "https://cvjobmatcher.com/resume-templates",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": industries.map((industry, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Article",
          "name": `${industry.name} Resume Template`,
          "url": `https://cvjobmatcher.com/resume-templates/${industry.slug}`,
          "description": industry.description
        }
      }))
    }
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
              Resume Templates by Industry
            </h1>
            <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto text-gray-600">
              Professional, ATS-optimized resume templates tailored for your specific industry. 
              Get expert tips, salary insights, and the exact keywords employers are looking for.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full ring-1 ring-gray-900/10">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">50,000+ Users</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full ring-1 ring-gray-900/10">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">ATS Optimized</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full ring-1 ring-gray-900/10">
                <Search className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">Industry Specific</span>
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

        {/* Industries Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Industry
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each template is crafted with industry-specific keywords, formatting, and best practices 
              to help you pass ATS systems and impress hiring managers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry) => (
              <Link key={industry.slug} href={`/resume-templates/${industry.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {industry.name}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {industry.searchVolume.toLocaleString()} searches/mo
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {industry.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Average Salary</div>
                        <div className="text-lg font-semibold text-gray-900">{industry.averageSalary}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Growth Rate</div>
                        <div className="text-sm text-gray-600">{industry.growthRate}</div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Key Skills</div>
                        <div className="flex flex-wrap gap-1">
                          {industry.keySkills.slice(0, 4).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {industry.keySkills.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{industry.keySkills.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Top Companies</div>
                        <div className="text-sm text-gray-600">
                          {industry.topCompanies.slice(0, 3).join(', ')}
                          {industry.topCompanies.length > 3 && '...'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Optimize Your Resume?
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Use our AI-powered tool to match your resume to any job description and get instant feedback.
            </p>
            <Link href="/login">
              <Button size="lg" variant="secondary">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}