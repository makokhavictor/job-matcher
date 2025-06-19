import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out CV Matcher",
    features: [
      "3 CV analyses per month",
      "Basic match scoring",
      "Key skills identification",
      "24-hour result access",
    ],
    cta: "Get Started",
    href: "/register"
  },
  {
    name: "Pro",
    price: "$12",
    description: "For active job seekers",
    features: [
      "Unlimited CV analyses",
      "Advanced match scoring",
      "Tailored improvement suggestions",
      "30-day result history",
      "Priority support",
      "Multiple CV versions",
      "Export reports",
    ],
    cta: "Start Pro Trial",
    href: "/register?plan=pro"
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-gray-50 flex justify-center">
      <div className="container px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <div className="mx-auto mb-12 flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-bold text-2xl leading-[1.1] sm:text-3xl lg:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg">
            Choose the perfect plan for your job search needs
          </p>
        </div>
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {plans.map((plan) => (
              <Card key={plan.name} className="flex flex-col">
                <CardHeader className="flex-1">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold tracking-tight sm:text-4xl">
                      {plan.price}
                    </span>
                    {plan.price !== "$0" && (
                      <span className="ml-1 text-sm text-muted-foreground">/month</span>
                    )}
                  </div>
                  <CardDescription className="mt-4">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="grid gap-3 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <a href={plan.href}>{plan.cta}</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
