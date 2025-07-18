import { Suspense } from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
    <div className="min-h-screen bg-gray-50 justify-center flex p-4">
      <Suspense>
        {children}
      </Suspense>
    </div>
  )
}
