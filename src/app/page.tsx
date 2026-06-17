import { CTA } from '@/components/marketing/cta'
import { Features } from '@/components/marketing/features'
import { Hero } from '@/components/marketing/hero'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { Pricing } from '@/components/marketing/pricing'
import { ReportPreview } from '@/components/marketing/report-preview'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pivot — Know Your Career Readiness Score',
  description: 'Upload your CV, set a target role, and get your Pivot Readiness Score — a precise 0–100 measure of how ready you are to make your next career move.',
  keywords: 'career readiness score, pivot readiness, career position intelligence, CV analysis, skill gap mapping, career transition tool, job readiness, resume analysis, career change tool',
  openGraph: {
    title: 'Pivot — Know Your Career Readiness Score',
    description: 'Upload your CV, set a target role, and get your Pivot Readiness Score in under a minute.',
    url: 'https://pivot.careers',
    siteName: 'Pivot',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pivot — Career Position Intelligence',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pivot — Know Your Career Readiness Score',
    description: 'Upload your CV, set a target role, and get your Pivot Readiness Score in under a minute.',
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
      <HowItWorks />
      <ReportPreview />
      <Features />
      <Pricing />
      <CTA />
    </div>
  )
}