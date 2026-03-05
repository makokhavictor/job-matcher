'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './auth-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { LoadingMask } from '@/components/ui/loading-mask'
import { MainNav } from '@/components/layout/main-nav'
import { Toaster } from '@/components/ui/sonner'

const queryClient = new QueryClient()

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LoadingMask />
          <MainNav />
          {children}
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
