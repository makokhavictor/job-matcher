'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { GoogleAuthButton } from './google-auth-button'
import { useAuth } from '@/app/providers/auth-provider'
import { authService } from '@/lib/auth.service'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterValues) => {
    try {
      const registerData = {
        email: data.email,
        password: data.password,
        name: data.name,
        plan: plan || undefined
      }
      
      const authResponse = await authService.register(registerData)
      
      // Update auth context with login data
      login(authResponse)
      
      toast.success('Account created successfully!')
      
      // Redirect to dashboard or plan-specific page
      if (plan) {
        router.push(`/dashboard?plan=${plan}`)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Registration error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account. Please try again.'
      toast.error(errorMessage)
    }
  }

  return (
      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Input
                {...register('name')}
                placeholder="Your name"
                autoCapitalize="none"
                autoComplete="name"
                autoCorrect="off"
              />
              {errors?.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Input
                {...register('email')}
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
              />
              {errors?.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Input
                {...register('password')}
                placeholder="Create a password"
                type="password"
                autoComplete="new-password"
              />
              {errors?.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Input
                {...register('confirmPassword')}
                placeholder="Confirm password"
                type="password"
                autoComplete="new-password"
              />
              {errors?.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
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

        <GoogleAuthButton isSubmitting={isSubmitting} mode="register" plan={plan} />

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
  )
}
