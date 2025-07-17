"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter, useSearchParams } from 'next/navigation'
import { GoogleAuthButton } from "./google-auth-button"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginValues) => {
    try {
      const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL
      const response = await fetch(`${backendApiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (response.ok) {
        toast.success("Successfully logged in!")
        // Save the token and redirect
        if (responseData.token) {
          localStorage.setItem('auth_token', responseData.token)
          router.push('/dashboard')
        }
      } else {
        throw new Error(responseData.detail || 'Failed to login')
      }
    } catch (error) {
      console.log("Login error:", error);
      toast.error("Failed to login. Please try again.")
    }
  }

  return (
    <div className="grid gap-6">
      <div className="mb-4 p-3 rounded bg-yellow-100 text-yellow-800 text-center font-medium">
        🚧 Email/password login is coming soon! Please use <span className="font-semibold">Google</span> to sign in below.
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Input
              {...register("email")}
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled
            />
            {errors?.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Input
              {...register("password")}
              placeholder="Password"
              type="password"
              autoComplete="current-password"
              disabled
            />
            {errors?.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button disabled>
            Sign In
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <GoogleAuthButton isSubmitting={isSubmitting} mode="login" plan={plan} />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
