'use client'

import { Card } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="relative flex items-center justify-center w-16 h-16 mb-6">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
            <Settings className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Coming Soon</h2>
          <p className="text-muted-foreground max-w-md">
            We&apos;re currently developing personalized settings and preferences.
            Soon you&apos;ll be able to customize your CV matching experience here.
          </p>
        </div>
      </Card>
    </div>
  )
}
