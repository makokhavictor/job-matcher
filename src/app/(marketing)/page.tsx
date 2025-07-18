'use client'
import { Hero } from "@/components/marketing/hero"
import { Features } from "@/components/marketing/features"
import { Pricing } from "@/components/marketing/pricing"
import { CTA } from "@/components/marketing/cta"

export default function LandingPage() {
  return (
    <div className="flex flex-col justify-center">
      <Hero />
      <Features />
      <Pricing />
      <CTA />
    </div>
  )
}
