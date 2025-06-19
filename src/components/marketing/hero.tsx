import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import * as motion from "motion/react-client"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-primary/20 pt-14">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex"
          >
            <div className="relative flex items-center gap-x-3 rounded-full px-4 py-1.5 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-semibold text-primary"
              >
                NEW
              </motion.span>
              <span className="h-4 w-px bg-gray-900/10" aria-hidden="true" />
              <motion.a 
                href="#pricing" 
                className="flex items-center gap-x-1"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Try our Pro plan for free
                <ArrowRight className="ml-1 h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 max-w-lg text-3xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-5xl lg:text-6xl"
          >
            Perfect CV match for your dream job
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-4 text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8"
          >
            Use AI-powered analysis to match your CV with job descriptions and get instant feedback. 
            Improve your chances of landing your dream job with personalized suggestions.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-center sm:gap-x-6"
          >
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/dashboard">
                  Get Started 
                </Link>
              </motion.div>
            </Button>
            <motion.div whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 400 }}>
              <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary transition-colors">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, type: "spring" }}
          className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow"
        >
          <motion.div 
            className="relative mx-auto w-full max-w-[600px] drop-shadow-xl"
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="bg-white rounded-2xl ring-1 ring-gray-900/10 p-4 sm:p-6">
              <div className="aspect-[16/9] overflow-hidden rounded-lg bg-gray-50">
                <Image
                  src="/app-screenshot.png"
                  alt="App screenshot"
                  width={800}
                  height={450}
                  className="h-full w-full object-contain rounded-lg"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
