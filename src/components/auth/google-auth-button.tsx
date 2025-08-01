'use client'

import { useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface GoogleAuthButtonProps {
  isSubmitting?: boolean
  mode?: 'login' | 'register'
  plan?: string | null
}

export function GoogleAuthButton({
  mode = 'login',
  plan = null,
}: GoogleAuthButtonProps) {
  const router = useRouter()

  // 1️⃣  Wrap in useCallback so the reference is stable
  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      const idToken = response.credential
      const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL

      const res = await fetch(`${backendApiUrl}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken, ...(plan && { plan }) }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(
          `Successfully ${mode === 'login' ? 'logged in' : 'registered'} with Google!`
        )
        if (data.access_token) {
          localStorage.setItem('auth', JSON.stringify(data))
          router.push('/dashboard')
        }
      } else {
        toast.error(
          `Failed to ${mode === 'login' ? 'log in' : 'register'} with Google: ${
            data.detail || 'Unknown error'
          }`
        )
      }
    },
    [mode, plan, router] // all values used inside the callback
  )

  // 2️⃣  Add the missing dependencies to the array
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredentialResponse,
        ux_mode: 'popup',
      })

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-btn')!,
        { theme: 'outline', size: 'large' }
      )
    }

    document.body.appendChild(script)

    return () => {
      // Optional: remove the script on unmount
      document.body.removeChild(script)
    }
  }, [handleCredentialResponse]) // ✅ all dependencies listed
  // isSubmitting and mode are only used in the callback,
  // so they don't need to be here if handleCredentialResponse is stable.

  return <div id="google-signin-btn" className="w-full" />
}