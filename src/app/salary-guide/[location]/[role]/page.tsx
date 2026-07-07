import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, MapPin, Building, Users, ArrowRight } from 'lucide-react';
import { getSalaryDataByRole, salaryData } from '@/data/salary-data';
import { getJobRoleBySlug } from '@/data/job-roles';
import { getBaseUrl, SITE_NAME } from '@/lib/seo';

interface Props {
  params: Promise<{
    location: string;
    role: string;
  }>;
}

export async function generateStaticParams() {
  const params: { location: string; role: string }[] = [];
  
  salaryData.forEach(roleData => {
    Object.keys(roleData.locations).forEach(location => {
      params.push({
        location,
        role: roleData.roleSlug
      });
    });
  });
  
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location, role } = await params;
  const salaryInfo = getSalaryDataByRole(role);
  const locationData = salaryInfo?.locations[location];
  const jobRole = getJobRoleBySlug(role);
  
  if (!salaryInfo || !locationData || !jobRole) {
    return {
      title: 'Salary Information Not Found',
    };
  }

  const formattedSalary = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(locationData.averageSalary);

  return {
    title: `${jobRole.title} Salary in ${locationData.name} | ${formattedSalary} Average`,
    description: `${jobRole.title} salary in ${locationData.name}: Average ${formattedSalary}, range ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(locationData.salaryRange.min)} - ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(locationData.salaryRange.max)}. Get salary insights, top companies, and optimize your resume.`,
    keywords: `${jobRole.title} salary ${locationData.name}, ${role} salary, ${locationData.name} tech salaries, ${jobRole.title} compensation`,
    alternates: {
      canonical: `${getBaseUrl()}/salary-guide/${location}/${role}`,
    },
    openGraph: {
      title: `${jobRole.title} Salary in ${locationData.name}`,
      description: `Average salary: ${formattedSalary}. Get detailed salary insights and optimize your resume.`,
      type: 'article',
    },
  };
}

export default async function SalaryGuidePage({ params }: Props) {
  const { location, role } = await params;
  const salaryInfo = getSalaryDataByRole(role);
  const locationData = salaryInfo?.locations[location];
  const jobRole = getJobRoleBySlug(role);
  
  if (!salaryInfo || !locationData || !jobRole) {
    notFound();
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const otherLocations = Object.entries(salaryInfo.locations)
    .filter(([slug]) => slug !== location)
    .slice(0, 4);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${jobRole.title} Salary in ${locationData.name}`,
    "description": `Comprehensive salary guide for ${jobRole.title} positions in ${locationData.name}`,
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
      "@id": `${getBaseUrl()}/salary-guide/${location}/${role}`
    },
    "about": {
      "@type": "Occupation",
      "name": jobRole.title,
      "estimatedSalary": {
        "@type": "MonetaryAmountDistribution",
        "name": "base",
        "currency": "USD",
        "duration": "P1Y",
        "median": locationData.averageSalary,
        "percentile10": locationData.salaryRange.min,
        "percentile90": locationData.salaryRange.max
      }
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
              <div className="flex justify-center mb-4">
                <Badge variant="secondary" className="bg-white ring-1 ring-gray-900/10 text-gray-900">
                  {salaryInfo.industry}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
                {jobRole.title} Salary in {locationData.name}
              </h1>
              <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto text-gray-600">
                Comprehensive salary insights, market trends, and career guidance for {jobRole.title} professionals in {locationData.name}.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full ring-1 ring-gray-900/10">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900 font-medium">Avg: {formatCurrency(locationData.averageSalary)}</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full ring-1 ring-gray-900/10">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900 font-medium">Growth: {locationData.growthRate}</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full ring-1 ring-gray-900/10">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900 font-medium">{locationData.jobCount.toLocaleString()} Jobs</span>
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
              {/* Salary Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-gray-900" />
                    Salary Overview
                  </CardTitle>
                  <CardDescription>
                    {jobRole.title} compensation in {locationData.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(locationData.salaryRange.min)}
                      </div>
                      <div className="text-sm text-gray-600">Entry Level</div>
                    </div>
                    <div className="text-center p-4 bg-gray-100 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(locationData.averageSalary)}
                      </div>
                      <div className="text-sm text-gray-600">Average</div>
                    </div>
                    <div className="text-center p-4 bg-gray-200 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(locationData.salaryRange.max)}
                      </div>
                      <div className="text-sm text-gray-600">Senior Level</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Salary Factors</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Experience level and years in role</li>
                      <li>• Company size and industry sector</li>
                      <li>• Technical skills and certifications</li>
                      <li>• Education and advanced degrees</li>
                      <li>• Performance and leadership experience</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Market Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-gray-900" />
                    Market Insights
                  </CardTitle>
                  <CardDescription>
                    Job market trends and opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Market Statistics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Available Jobs</span>
                          <span className="font-semibold">{locationData.jobCount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Growth Rate</span>
                          <span className="font-semibold text-gray-900">{locationData.growthRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cost of Living Index</span>
                          <span className="font-semibold">{locationData.costOfLiving}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Salary Adjusted for Cost of Living</h4>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">
                          {formatCurrency(Math.round(locationData.averageSalary / (locationData.costOfLiving / 100)))}
                        </div>
                        <div className="text-sm text-gray-600">
                          Purchasing power equivalent
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Companies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-6 h-6 text-gray-900" />
                    Top Hiring Companies
                  </CardTitle>
                  <CardDescription>
                    Leading employers for {jobRole.title} in {locationData.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {locationData.topCompanies.map((company, index) => (
                      <div key={company} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-900 font-semibold text-sm">{index + 1}</span>
                        </div>
                        <span className="font-medium">{company}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Career Tips */}
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle>Maximize Your {jobRole.title} Salary</CardTitle>
                  <CardDescription>
                    Proven strategies to increase your earning potential
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
                      <span>Highlight relevant skills: {jobRole.skills.slice(0, 3).join(', ')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
                      <span>Quantify your achievements with specific metrics and results</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
                      <span>Target companies known for competitive compensation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
                      <span>Negotiate based on market data and your unique value proposition</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle>Optimize for This Role</CardTitle>
                  <CardDescription>
                    Get personalized resume suggestions for {jobRole.title} positions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/login">
                    <Button className="w-full">
                      Get Started
                    </Button>
                  </Link>
                  <Link href={`/job-descriptions/${role}`}>
                    <Button variant="outline" className="w-full">
                      View Job Requirements
                    </Button>
                  </Link>
                  <Link href={`/resume-templates/${jobRole.industry}`}>
                    <Button variant="outline" className="w-full">
                      Get Resume Template
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Other Locations */}
              {otherLocations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Other Locations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {otherLocations.map(([slug, data]) => (
                        <Link
                          key={slug}
                          href={`/salary-guide/${slug}/${role}`}
                          className="block p-3 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-semibold text-sm">{data.name}</div>
                              <div className="text-xs text-gray-600">
                                {formatCurrency(data.averageSalary)} avg
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {data.growthRate}
                            </Badge>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Related Resources */}
              <Card>
                <CardHeader>
                  <CardTitle>Related Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <Link href="/blog/ats-resume-optimization-guide-2025" className="block text-blue-600 hover:underline">
                      ATS Resume Optimization Guide
                    </Link>
                    <Link href="/blog/resume-keywords-optimization-2025" className="block text-blue-600 hover:underline">
                      Resume Keywords Guide
                    </Link>
                    <Link href="/blog/remote-work-resume-tips-2025" className="block text-blue-600 hover:underline">
                      Remote Work Resume Tips
                    </Link>
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