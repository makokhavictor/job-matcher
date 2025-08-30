import { CTA } from '@/components/marketing/cta'
import { Features } from '@/components/marketing/features'
import { Hero } from '@/components/marketing/hero'
import { Pricing } from '@/components/marketing/pricing'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CV and Job Description Matcher | Optimize Your Resume',
  description: 'Match your CV to job descriptions with our AI-powered tool. Get instant compatibility scores, highlights of matching skills, and suggestions to improve your resume.',
  keywords: 'CV matcher, resume optimizer, job description analyzer, resume ATS, career tools, AI-powered resume tools, resume matching software, job application optimizer, skill matching tool, resume improvement suggestions, ATS optimization, resume scoring system',
  openGraph: {
    title: 'CV and Job Description Matcher | Optimize Your Resume',
    description: 'Get a personalized match score and suggestions to improve your CV for specific job applications.',
    url: 'https://cvjobmatcher.com',
    siteName: 'CV Matcher',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CV and Job Description Matcher',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CV and Job Description Matcher | Optimize Your Resume',
    description: 'Get a personalized match score and suggestions to improve your CV for specific job applications.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Home() {
  return (
    <div className="flex flex-col justify-center">
      <Hero />
      <Features />
      <Pricing />
      <CTA />
    </div>
  )
}