"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export function MainNav() {
  const pathname = usePathname()
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <div className="flex flex-1 items-center space-x-2 md:space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg md:text-xl text-primary">CV Matcher</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4 md:space-x-6 text-sm font-medium">
            <Link
              href="/#features"
              className={pathname === "/#features" ? "text-primary" : "text-muted-foreground"}
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className={pathname === "/#pricing" ? "text-primary" : "text-muted-foreground"}
            >
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <nav className="flex items-center space-x-1 md:space-x-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="md:size-default">Login</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="md:size-default whitespace-nowrap">Get Started</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
