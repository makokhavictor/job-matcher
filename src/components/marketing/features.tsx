import {
  FileText,
  LineChart,
  ListChecks,
  MessageSquare,
  Settings,
  Sparkles,
} from "lucide-react"
import { Card } from "@/components/ui/card"

const features = [
  {
    name: "AI-Powered Analysis",
    description:
      "Our advanced AI analyzes your CV against job descriptions to identify matches and opportunities for improvement.",
    icon: Sparkles,
  },
  {
    name: "Skill Matching",
    description:
      "Get detailed insights into how your skills align with job requirements and discover gaps to fill.",
    icon: ListChecks,
  },
  {
    name: "Real-time Feedback",
    description:
      "Receive instant feedback and suggestions to optimize your CV for each job application.",
    icon: MessageSquare,
  },
  {
    name: "Match Score",
    description:
      "See your match score and understand exactly how well your profile fits the role.",
    icon: LineChart,
  },
  {
    name: "Multiple Formats",
    description:
      "Support for PDF and DOCX formats. Just upload your file and get started.",
    icon: FileText,
  },
  {
    name: "Customizable Analysis",
    description:
      "Tailor the analysis to specific industries and job roles for more accurate results.",
    icon: Settings,
  },
]

export function Features() {
  return (
    <section
      id="features"
      className="space-y-6 bg-white py-8 dark:bg-transparent md:py-12 lg:py-24 flex flex-col justify-center"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Features
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Everything you need to optimize your CV and land your dream job
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.name}
            className="relative overflow-hidden p-2"
          >
            <div className="flex h-[180px] flex-col justify-between rounded-lg p-6">
              <feature.icon className="h-12 w-12 fill-current" />
              <div className="space-y-2">
                <h3 className="font-bold">{feature.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
