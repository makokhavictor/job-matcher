import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="border-t bg-gray-50 flex justify-center">
      <div className="container px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl">
            Ready to land your dream job?
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Start optimizing your CV today and increase your chances of getting hired.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:justify-center sm:gap-6">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
