import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="border-t bg-gray-50">
      <div className="container py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-bold text-3xl sm:text-4xl">
            Ready to land your dream job?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start optimizing your CV today and increase your chances of getting hired.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
