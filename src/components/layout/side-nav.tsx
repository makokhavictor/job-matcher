'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  FileSearch, 
  Settings, 
  ChartLine 
} from 'lucide-react'
import { useAuth } from '@/app/providers/auth-provider'
import { differenceInDays, parseISO } from 'date-fns'

const navItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Job Matching',
    href: '/dashboard/matching',
    icon: ChartLine
  },
  {
    title: 'Analyses',
    href: '/dashboard/analyses',
    icon: FileSearch
  },
  {
    title: 'Packages',
    href: '/dashboard/packages',
    icon: FileSearch
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings
  }
]

export function SideNav({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()
  const { user } = useAuth()

  // Filter nav items: only show Packages if user is admin
  const filteredNavItems = navItems.filter(
    (item) => item.title !== 'Packages' || user?.is_admin
  )

  return (
    <div className={cn("pb-12 w-64 border-r bg-secondary-50 flex flex-col h-full min-h-screen", className)} {...props}>
      <div className="space-y-4 py-4 flex-1">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-4 px-4 text-xl font-semibold tracking-tight">
              Dashboard
            </h2>
            <nav className="space-y-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    pathname === item.href 
                      ? "bg-primary text-white" 
                      : "text-secondary-600 hover:text-primary hover:bg-secondary-100"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      {/* Plan footer */}
        <div className="mt-auto bg-secondary-100 px-4 py-4 flex flex-col items-start gap-2">
          <span className="text-sm text-muted-foreground font-bold">
            Plan: <span className="text-primary">{user?.subscription?.package?.name || "Free Plan"}</span>
            {user?.subscription?.status?.toLowerCase() === 'trial' && <>(Trial)</>}
            {user?.subscription?.end_date && (
              <> ({differenceInDays(parseISO(user.subscription.end_date), new Date())} days left)</>
            )}
          </span>
          <Link href="/dashboard/packages/upgrade">
            <button className="text-xs font-semibold text-primary hover:underline focus:outline-none">
              Upgrade / Change Plan
            </button>
          </Link>
        </div>
    </div>
  )
}
