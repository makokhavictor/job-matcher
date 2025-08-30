import { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | CV Matcher",
  description: "Sign in to your CV Matcher account to access your dashboard and continue optimizing your resume for job applications.",
  keywords: "login, sign in, CV matcher, resume optimizer, job application tool",
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
