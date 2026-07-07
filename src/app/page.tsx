import { CTA } from '@/components/marketing/cta'
import { Features } from '@/components/marketing/features'
import { Hero } from '@/components/marketing/hero'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { Pricing } from '@/components/marketing/pricing'
import { ReportPreview } from '@/components/marketing/report-preview'
import { Metadata } from 'next'
import { getBaseUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: {
    absolute: 'Fitted — A CV written for this exact job',
  },
  description: 'Paste the job description. Upload your CV. Fitted rewrites your CV to match the role and shows you a precise 0–100 match score — in under a minute.',
  keywords: 'CV tailoring, job description match, tailored CV, CV rewrite, match score, skill gap mapping, career readiness, resume optimisation, job application tool',
  alternates: {
    canonical: getBaseUrl(),
  },
  openGraph: {
    title: 'Fitted — A CV written for this exact job',
    description: 'Paste the job description. Upload your CV. Fitted rewrites your CV to match the role — in under a minute.',
    url: getBaseUrl(),
    siteName: 'Fitted',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fitted — CV matching and tailoring',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fitted — A CV written for this exact job',
    description: 'Paste the job description. Upload your CV. Fitted rewrites your CV to match the role — in under a minute.',
    images: ['/twitter-image.jpg'],
  },
}

export default function Home() {
  return (
    <div className="flex flex-col justify-center">
      <Hero />
      <HowItWorks />
      <ReportPreview />
      <Features />
      <Pricing />
      <CTA />
    </div>
  )
}