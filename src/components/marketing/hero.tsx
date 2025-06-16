import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-primary/20 pt-14">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <div className="flex">
            <div className="relative flex items-center gap-x-3 rounded-full px-4 py-1.5 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              <span className="font-semibold text-primary">NEW</span>
              <span className="h-4 w-px bg-gray-900/10" aria-hidden="true" />
              <a href="#pricing" className="flex items-center gap-x-1">
                Try our Pro plan for free
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
          <h1 className="mt-8 max-w-lg text-3xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-5xl lg:text-6xl">
            Perfect CV match for your dream job
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8">
            Use AI-powered analysis to match your CV with job descriptions and get instant feedback. 
            Improve your chances of landing your dream job with personalized suggestions.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-center sm:gap-x-6">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/dashboard">
                Get Started 
              </Link>
            </Button>
            <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary transition-colors">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
          <div className="relative mx-auto w-full max-w-[364px] drop-shadow-xl">
            <div className="bg-white rounded-2xl ring-1 ring-gray-900/10 p-6 sm:p-8">
              <div className="aspect-[1/1.2] overflow-hidden rounded-lg bg-gray-50">
                <Image
                  src="/dashboard-preview.png"
                  alt="App screenshot"
                  width={364}
                  height={437}
                  className="h-full w-full object-cover rounded-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
