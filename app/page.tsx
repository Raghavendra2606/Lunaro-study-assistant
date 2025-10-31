"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Dashboard } from "@/components/dashboard"
import { AuthProvider } from "@/components/auth-provider"

export default function Home() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!mounted || !isAuthenticated) return null

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </ThemeProvider>
  )
}
