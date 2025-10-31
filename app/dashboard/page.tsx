"use client"

import { Dashboard } from "@/components/dashboard"
import { AuthProvider } from "@/components/auth-provider"
import { AppProvider } from "@/components/app-context"

export default function DashboardPage() {
  return (
    <AuthProvider>
      <AppProvider>
        <Dashboard />
      </AppProvider>
    </AuthProvider>
  )
}
