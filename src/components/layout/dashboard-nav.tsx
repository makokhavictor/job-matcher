'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SideNav } from './side-nav'
import { NotificationBell } from './NotificationBell'

export function DashboardNav() {
  return (
    <div className="flex h-14 items-center justify-between px-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SideNav />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2 ml-auto">
        <NotificationBell />
      </div>
    </div>
  )
}
