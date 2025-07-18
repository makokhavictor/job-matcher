import { CTA } from '@/components/marketing/cta'
import { Features } from '@/components/marketing/features'
import { Hero } from '@/components/marketing/hero'
import { Pricing } from '@/components/marketing/pricing'

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
