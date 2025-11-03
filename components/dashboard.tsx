"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./sidebar"
import { TasksView } from "./views/tasks-view"
import { AssignmentsView } from "./views/assignments-view"
import { SubjectsView } from "./views/subjects-view"
import { FocusMode } from "./views/focus-mode"
import { NotesView } from "./views/notes-view"
import { ProgressView } from "./views/progress-view"
import { useAuth } from "./auth-provider"
import { Loader2, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

type ViewType = "tasks" | "assignments" | "subjects" | "focus" | "notes" | "progress"

export function Dashboard() {
  const [currentView, setCurrentView] = useState<ViewType>("tasks")
  const { user, token, logout } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!token) {
      router.push("/auth")
    } else {
      setLoading(false)
    }
  }, [token, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  const renderView = () => {
    switch (currentView) {
      case "tasks":
        return <TasksView />
      case "assignments":
        return <AssignmentsView />
      case "subjects":
        return <SubjectsView />
      case "focus":
        return <FocusMode />
      case "notes":
        return <NotesView />
      case "progress":
        return <ProgressView />
      default:
        return <TasksView />
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} user={user} onLogout={logout} />
      </div>

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-20 bg-background border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu className="w-6 h-6" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold truncate">Lunaro</h1>
            </div>
            <Button variant="outline" size="sm" onClick={logout} aria-label="Logout" className="ml-auto">
              Logout
            </Button>
          </div>
        </header>

        {/* Mobile Sidebar Drawer */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-30" aria-modal="true" role="dialog">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            {/* Panel */}
            <div
              className="absolute left-0 top-0 h-full w-64 bg-card border-r border-border shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar
                currentView={currentView}
                onViewChange={(v) => {
                  setCurrentView(v)
                  setMobileOpen(false)
                }}
                user={user}
                onLogout={() => {
                  setMobileOpen(false)
                  logout()
                }}
              />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 pb-6 md:pb-0">
          {renderView()}
        </main>
      </div>
    </div>
  )
}
