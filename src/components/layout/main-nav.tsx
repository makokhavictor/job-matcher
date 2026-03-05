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
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/theme-toggle'

export function MainNav() {
  const pathname = usePathname()
  const auth = useAuth()
  const isDashboard = pathname?.startsWith('/dashboard')
  const user = auth?.user

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      borderBottom: '1px solid var(--accent-dim)',
      background: 'var(--background)',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{ display: 'flex', height: 56, alignItems: 'center', padding: '0 24px', gap: 16 }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', marginRight: 8 }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            letterSpacing: '0.08em',
            color: 'var(--foreground)',
            textTransform: 'uppercase',
          }}>
            Pivot<span style={{ color: 'var(--accent)' }}>.</span>
          </span>
        </Link>

        {/* Nav links */}
        {!isDashboard && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: 24, flex: 1 }}>
            {user && (
              <Link href="/dashboard" style={{
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                textDecoration: 'none',
                color: 'var(--muted)',
                letterSpacing: '0.04em',
              }}>Dashboard</Link>
            )}
            <Link href="/#features" style={{
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              textDecoration: 'none',
              color: pathname === '/#features' ? 'var(--foreground)' : 'var(--muted)',
              letterSpacing: '0.04em',
            }}>Features</Link>
            <Link href="/#pricing" style={{
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              textDecoration: 'none',
              color: pathname === '/#pricing' ? 'var(--foreground)' : 'var(--muted)',
              letterSpacing: '0.04em',
            }}>Pricing</Link>
          </nav>
        )}

        <div style={{ flex: 1 }} />

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThemeToggle />

          {user ? (
            <>
              <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--muted)', letterSpacing: '0.04em' }}>
                {user?.name}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full p-0 cursor-pointer"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-primary ring-offset-2 ring-offset-background">
                      <AvatarImage src={user.picture} alt={user.name} />
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
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
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
                  <DropdownMenuItem className="cursor-pointer" onClick={auth?.logout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.04em' }}>
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.04em', background: 'var(--foreground)', color: 'var(--background)' }}>
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
