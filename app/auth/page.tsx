"use client"

import { useSearchParams } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "login"

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lunaro</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Your personal study assistant</p>
        </div>

        {mode === "signup" ? <SignupForm /> : <LoginForm />}
      </div>
    </div>
  )
}
