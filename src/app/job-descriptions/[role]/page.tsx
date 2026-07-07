import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Briefcase, GraduationCap, DollarSign, ArrowRight, Target } from 'lucide-react';
import { getJobRoleBySlug, getAllJobRoleSlugs, jobRoles } from '@/data/job-roles';
import { getIndustryBySlug } from '@/data/industries';
import { getBaseUrl } from '@/lib/seo';

interface Props {
  params: Promise<{
    role: string;
  }>;
}

export async function generateStaticParams() {
  return getAllJobRoleSlugs().map((role) => ({
    role,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role: roleSlug } = await params;
  const role = getJobRoleBySlug(roleSlug);
  
  if (!role) {
    return {
      title: 'Job Role Not Found',
    };
  }

  return {
    title: `${role.title} Job Description & Requirements`,
    description: `Complete ${role.title} job description with responsibilities, requirements, and skills. Salary range: ${role.averageSalary}. Optimize your resume for this role.`,
    keywords: `${role.keywords.join(', ')}, ${role.title} job description, ${role.title} requirements, ${role.title} salary`,
    alternates: {
      canonical: `${getBaseUrl()}/job-descriptions/${roleSlug}`,
    },
    openGraph: {
      title: `${role.title} Job Description & Requirements`,
      description: `Everything you need to know about ${role.title} positions including salary, skills, and how to optimize your resume.`,
      type: 'article',
    },
  };
}

export default async function JobDescriptionPage({ params }: Props) {
  const { role: roleSlug } = await params;
  const role = getJobRoleBySlug(roleSlug);
  const industry = role ? getIndustryBySlug(role.industry) : null;
  const relatedRoles = jobRoles.filter(r => 
    r.industry === role?.industry && r.slug !== role?.slug
  ).slice(0, 4);
  
  if (!role || !industry) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": role.title,
    "description": role.description,
    "industry": industry.name,
    "employmentType": "FULL_TIME",
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": {
        "@type": "QuantitativeValue",
        "value": role.averageSalary
      }
    },
    "skills": role.skills.join(", "),
    "experienceRequirements": role.experienceLevel,
    "datePosted": new Date().toISOString(),
    "url": `${getBaseUrl()}/job-descriptions/${roleSlug}`
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
                  {industry.name}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
                {role.title} Job Description
              </h1>
              <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto text-gray-600">
                {role.description}
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full ring-1 ring-gray-900/10">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900 font-medium">{role.averageSalary}</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full ring-1 ring-gray-900/10">
                  <GraduationCap className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900 font-medium">{role.experienceLevel} Level</span>
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
              {/* Key Responsibilities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-gray-900" />
                    Key Responsibilities
                  </CardTitle>
                  <CardDescription>
                    What you&apos;ll be doing as a {role.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {role.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-gray-900" />
                    Requirements & Qualifications
                  </CardTitle>
                  <CardDescription>
                    What employers typically look for
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {role.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Skills & Technologies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-gray-900" />
                    Required Skills & Technologies
                  </CardTitle>
                  <CardDescription>
                    Technical and soft skills for success
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Resume Optimization Tips */}
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle>Resume Optimization Tips for {role.title}</CardTitle>
                  <CardDescription>
                    How to tailor your resume for this specific role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                      <span>Include specific keywords: {role.skills.slice(0, 3).join(', ')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                      <span>Highlight {role.experienceLevel.toLowerCase()}-level experience and achievements</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                      <span>Quantify your impact with metrics and specific results</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-gray-900 mt-0.5 flex-shrink-0" />
                      <span>Match your experience to the key responsibilities listed above</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Role Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600">Industry</div>
                    <div className="font-semibold">{industry.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Experience Level</div>
                    <div className="font-semibold">{role.experienceLevel}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Salary Range</div>
                    <div className="font-semibold">{role.averageSalary}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Monthly Searches</div>
                    <div className="font-semibold">{role.searchVolume.toLocaleString()}</div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Card */}
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle>Optimize Your Resume</CardTitle>
                  <CardDescription>
                    Get an instant compatibility score and personalized suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/login">
                    <Button className="w-full mb-3">
                      Get Started
                    </Button>
                  </Link>
                  <Link href={`/resume-templates/${role.industry}`}>
                    <Button variant="outline" className="w-full">
                      View {industry.name} Templates
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Related Roles */}
              {relatedRoles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Related Roles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {relatedRoles.map((relatedRole) => (
                        <Link
                          key={relatedRole.slug}
                          href={`/job-descriptions/${relatedRole.slug}`}
                          className="block p-3 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="font-semibold text-sm">{relatedRole.title}</div>
                          <div className="text-xs text-gray-600">{relatedRole.averageSalary}</div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}