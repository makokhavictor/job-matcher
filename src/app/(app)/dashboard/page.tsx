'use client'
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileSearch, Settings, BarChart } from "lucide-react"

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Job Matching</h2>
              <p className="text-sm text-secondary-600">Match your CV with jobs</p>
            </div>
          </div>
          <Link href="/dashboard/matching" className="w-full">
            <Button className="w-full mt-4">
              Start Matching
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileSearch className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Recent Analyses</h2>
              <p className="text-sm text-secondary-600">View your CV analyses</p>
            </div>
          </div>
          <Link href="/dashboard/analyses" className="w-full">
            <Button className="w-full mt-4">
              View Analyses
            </Button>
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Settings</h2>
              <p className="text-sm text-secondary-600">Manage your account</p>
            </div>
          </div>
          <Link href="/dashboard/settings" className="w-full">
            <Button className="w-full mt-4">
              Open Settings
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
