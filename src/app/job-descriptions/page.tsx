import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, DollarSign, Search, ArrowRight, TrendingUp } from 'lucide-react';
import { jobRoles } from '@/data/job-roles';
import { getIndustryBySlug } from '@/data/industries';
import { getBaseUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Job Descriptions & Requirements by Role | Salary & Skills Guide',
  description: 'Complete job descriptions with requirements, responsibilities, and salary ranges for top roles. Optimize your resume for any position with our detailed guides.',
  keywords: 'job descriptions, job requirements, job responsibilities, salary guide, job skills, career guide, job search, employment guide',
  alternates: {
    canonical: `${getBaseUrl()}/job-descriptions`,
  },
  openGraph: {
    title: 'Job Descriptions & Requirements by Role',
    description: 'Comprehensive job descriptions with salary ranges, skills, and requirements for top positions across all industries.',
    type: 'website',
  },
};

export default function JobDescriptionsPage() {
  const baseUrl = getBaseUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Job Descriptions by Role",
    "description": "Comprehensive job descriptions with requirements, responsibilities, and salary information",
    "url": `${baseUrl}/job-descriptions`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": jobRoles.map((role, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "JobPosting",
          "title": role.title,
          "url": `${baseUrl}/job-descriptions/${role.slug}`,
          "description": role.description,
          "baseSalary": {
            "@type": "MonetaryAmount",
            "currency": "USD",
            "value": role.averageSalary
          }
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
              Job Descriptions & Requirements
            </h1>
            <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto text-gray-600">
              Comprehensive job descriptions with detailed requirements, responsibilities, and salary ranges. 
              Learn exactly what employers want and optimize your resume accordingly.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full ring-1 ring-gray-900/10">
                <Briefcase className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">{jobRoles.length}+ Roles</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full ring-1 ring-gray-900/10">
                <DollarSign className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">Salary Ranges</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full ring-1 ring-gray-900/10">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">Skills & Requirements</span>
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

        {/* Job Roles Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Job Roles
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get detailed insights into job requirements, responsibilities, and the skills you need 
              to succeed in your target role.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobRoles.map((role) => {
              const industry = getIndustryBySlug(role.industry);
              return (
                <Link key={role.slug} href={`/job-descriptions/${role.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {industry?.name}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {role.searchVolume.toLocaleString()} searches/mo
                        </Badge>
                      </div>
                      <CardTitle className="text-xl group-hover:text-green-600 transition-colors">
                        {role.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {role.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-700">Salary Range</div>
                            <div className="text-lg font-semibold text-gray-900">{role.averageSalary}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-700">Level</div>
                            <Badge variant="outline">{role.experienceLevel}</Badge>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">Key Skills</div>
                          <div className="flex flex-wrap gap-1">
                            {role.skills.slice(0, 4).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {role.skills.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{role.skills.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">Key Responsibilities</div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {role.responsibilities.slice(0, 2).map((resp, index) => (
                              <li key={index} className="truncate">• {resp}</li>
                            ))}
                            {role.responsibilities.length > 2 && (
                              <li className="text-gray-900">• +{role.responsibilities.length - 2} more...</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What You&apos;ll Find in Each Job Description
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Detailed Responsibilities</h3>
                <p className="text-gray-600">
                  Complete list of day-to-day tasks and key responsibilities for each role.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Skills & Requirements</h3>
                <p className="text-gray-600">
                  Technical skills, qualifications, and experience levels employers seek.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Salary Insights</h3>
                <p className="text-gray-600">
                  Current market salary ranges and compensation expectations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Optimize Your Resume?
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Use our AI-powered tool to match your resume to any job description and get personalized optimization suggestions.
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