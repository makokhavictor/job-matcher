'use client'

import { SideNav } from '@/components/layout/side-nav'
import { DashboardNav } from '@/components/layout/dashboard-nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className="flex h-screen overflow-hidden">
        <SideNav className="hidden lg:block" />
        <div className="flex-1 overflow-auto">
          <div className="border-b">
            <DashboardNav />
          </div>
          <main className="container py-6 space-y-6 px-6">{children}</main>
        </div>
      </div>
  )
}
