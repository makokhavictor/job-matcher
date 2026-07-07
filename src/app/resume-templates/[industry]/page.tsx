import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, TrendingUp, Users, DollarSign, ArrowRight } from 'lucide-react';
import { getIndustryBySlug, getAllIndustrySlugs, industries } from '@/data/industries';
import { getJobRolesByIndustry } from '@/data/job-roles';
import { getBaseUrl, SITE_NAME } from '@/lib/seo';

interface Props {
  params: Promise<{
    industry: string;
  }>;
}

export async function generateStaticParams() {
  return getAllIndustrySlugs().map((industry) => ({
    industry,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry: industrySlug } = await params;
  const industry = getIndustryBySlug(industrySlug);
  
  if (!industry) {
    return {
      title: 'Industry Not Found',
    };
  }

  return {
    title: `${industry.name} Resume Template & Examples`,
    description: `Free ${industry.name} resume template optimized for ATS. Get expert tips, salary insights, and industry-specific keywords to land your dream job. Average salary: ${industry.averageSalary}.`,
    keywords: `${industry.keywords.join(', ')}, ${industry.name} resume template, ${industry.name} CV example, ATS optimized resume`,
    alternates: {
      canonical: `${getBaseUrl()}/resume-templates/${industrySlug}`,
    },
    openGraph: {
      title: `${industry.name} Resume Template & Examples`,
      description: `Professional ${industry.name} resume template with industry insights and optimization tips.`,
      type: 'article',
    },
  };
}

export default async function IndustryResumePage({ params }: Props) {
  const { industry: industrySlug } = await params;
  const industry = getIndustryBySlug(industrySlug);
  const relatedRoles = getJobRolesByIndustry(industrySlug);
  
  if (!industry) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${industry.name} Resume Template & Examples`,
    "description": industry.description,
    "author": {
      "@type": "Organization",
      "name": SITE_NAME
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME
    },
    "datePublished": new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${getBaseUrl()}/resume-templates/${industrySlug}`
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
                {industry.name} Resume Template
              </h1>
              <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto text-gray-600">
                {industry.description}
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full ring-1 ring-gray-900/10">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900 font-medium">Avg. Salary: {industry.averageSalary}</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full ring-1 ring-gray-900/10">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900 font-medium">Growth: {industry.growthRate}</span>
                </div>
              </div>
              <Link href="/login">
                <Button size="lg">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Key Skills Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-gray-900" />
                    Essential {industry.name} Skills
                  </CardTitle>
                  <CardDescription>
                    Top skills employers look for in {industry.name} resumes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {industry.keySkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Resume Tips Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Resume Optimization Tips</CardTitle>
                  <CardDescription>
                    Expert advice to make your {industry.name} resume stand out
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {industry.resumeTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Common Roles Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular {industry.name} Roles</CardTitle>
                  <CardDescription>
                    Explore specific job descriptions and requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {relatedRoles.map((role) => (
                      <Link 
                        key={role.slug} 
                        href={`/job-descriptions/${role.slug}`}
                        className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-semibold text-lg mb-2">{role.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{role.averageSalary}</p>
                        <Badge variant="outline">{role.experienceLevel} Level</Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Top Companies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-900" />
                    Top Employers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {industry.topCompanies.map((company) => (
                      <li key={company} className="text-sm">{company}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* CTA Card */}
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle>Ready to Optimize?</CardTitle>
                  <CardDescription>
                    Use our AI-powered tool to match your resume to any {industry.name} job description
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/login">
                    <Button className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Related Industries */}
              <Card>
                <CardHeader>
                  <CardTitle>Related Industries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {industries
                      .filter(ind => ind.slug !== industry.slug)
                      .slice(0, 5)
                      .map((relatedIndustry) => (
                        <Link
                          key={relatedIndustry.slug}
                          href={`/resume-templates/${relatedIndustry.slug}`}
                          className="block text-sm text-gray-900 hover:underline"
                        >
                          {relatedIndustry.name}
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}