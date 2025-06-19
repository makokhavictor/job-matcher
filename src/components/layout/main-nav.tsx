'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/providers/auth-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function MainNav() {
  const pathname = usePathname()
  const auth = useAuth()
  const isDashboard = pathname?.startsWith('/dashboard')
  const user = auth?.user

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <div className="flex flex-1 items-center space-x-2 md:space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg md:text-xl text-primary">
              CV Matcher
            </span>
          </Link>
          {!isDashboard && (
            <nav className="hidden md:flex items-center space-x-4 md:space-x-6 text-sm font-medium">
              <Link
                href="/#features"
                className={
                  pathname === '/#features'
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }
              >
                Features
              </Link>
              <Link
                href="/#pricing"
                className={
                  pathname === '/#pricing'
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }
              >
                Pricing
              </Link>
            </nav>
          )}
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <nav className="flex items-center space-x-1 md:space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                    <Avatar className="h-8 w-8 ring-2 ring-primary ring-offset-2 ring-offset-background">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      localStorage.removeItem('auth_token')
                      window.location.href = '/'
                    }}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="md:size-default">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="md:size-default whitespace-nowrap"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
