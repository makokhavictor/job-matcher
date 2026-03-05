'use client'

import { SideNav } from '@/components/layout/side-nav'
import { DashboardNav } from '@/components/layout/dashboard-nav'
import { JobsStatusBanner } from '@/components/layout/JobsStatusBanner'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Sidebar } from '@/components/ui/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <Sidebar className="hidden lg:flex">
          <SideNav className="h-full" />
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <div className="border-b">
            <DashboardNav />
          </div>
          <main className="container py-6 space-y-6 px-6">
            {children}
          </main>
        </div>
      </div>
      <JobsStatusBanner />
    </SidebarProvider>
  )
}
