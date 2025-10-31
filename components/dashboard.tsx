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
import { Loader2 } from "lucide-react"

type ViewType = "tasks" | "assignments" | "subjects" | "focus" | "notes" | "progress"

export function Dashboard() {
  const [currentView, setCurrentView] = useState<ViewType>("tasks")
  const { user, token, logout } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

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
      <Sidebar currentView={currentView} onViewChange={setCurrentView} user={user} onLogout={logout} />
      <main className="flex-1 overflow-auto">{renderView()}</main>
    </div>
  )
}
