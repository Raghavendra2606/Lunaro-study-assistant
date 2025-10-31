"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, BookOpen, CheckSquare, FileText, Brain, Lightbulb, BarChart3, LogOut } from "lucide-react"

type ViewType = "tasks" | "assignments" | "subjects" | "focus" | "notes" | "progress"

interface SidebarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  user: any
  onLogout: () => void
}

export function Sidebar({ currentView, onViewChange, user, onLogout }: SidebarProps) {
  const { theme, setTheme } = useTheme()

  const menuItems = [
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "assignments", label: "Assignments", icon: FileText },
    { id: "subjects", label: "Subjects", icon: BookOpen },
    { id: "notes", label: "Notes", icon: Lightbulb },
    { id: "focus", label: "Focus Mode", icon: Brain },
    { id: "progress", label: "Progress", icon: BarChart3 },
  ]

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">StudyHub</h1>
            <p className="text-xs text-muted-foreground">Learn Smart</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-6 py-4 border-b border-border">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center justify-center gap-2"
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-4 h-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              Dark Mode
            </>
          )}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
