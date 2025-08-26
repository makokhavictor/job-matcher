'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  FileSearch, 
  Settings, 
  ChartLine,
  Zap
} from 'lucide-react'
import { useAuth } from '@/app/providers/auth-provider'
import { differenceInDays, parseISO } from 'date-fns'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

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

  // Calculate days left until subscription ends
  const endDate = user?.subscription?.end_date ? parseISO(user.subscription.end_date) : null
  const now = new Date()
  const daysLeft = endDate ? differenceInDays(endDate, now) : 0

  // Optionally, calculate total duration if you have a start_date
  const startDate = user?.subscription?.start_date ? parseISO(user.subscription.start_date) : null
  const totalDuration = (startDate && endDate) ? differenceInDays(endDate, startDate) : null
  const progress = (totalDuration && daysLeft >= 0) ? ((totalDuration - daysLeft) / totalDuration) * 100 : 0

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
      <div className="mt-auto p-4">
        <Card>
          <CardHeader className="p-2 pt-0 md:p-3">
            <CardTitle className="flex items-center gap-2">
              {user?.subscription?.plan?.name || "Free Plan"}
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">Current</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
            {endDate && daysLeft >= 0 && (
              <div className="text-center text-sm text-muted-foreground mb-4">
                <p>{daysLeft} days left</p>
                <Progress value={progress} className="w-full mt-2" />
              </div>
            )}
            <Link href="/dashboard/packages/upgrade">
              <Button size="sm" className="w-full">
                <Zap className="mr-2 h-4 w-4" />
                Upgrade plan
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
