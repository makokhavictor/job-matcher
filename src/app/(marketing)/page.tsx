'"use client"'
// import { Metadata } from "next"
import { Hero } from "@/components/marketing/hero"
import { Features } from "@/components/marketing/features"
import { Pricing } from "@/components/marketing/pricing"
import { CTA } from "@/components/marketing/cta"

// export const metadata: Metadata = {
//   title: "CV Matcher - Smart CV Analysis & Job Matching",
//   description: "Match your CV with job descriptions using AI and get instant feedback to improve your chances of landing your dream job.",
// }

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
