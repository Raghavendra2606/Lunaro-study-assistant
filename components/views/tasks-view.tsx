"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, CheckCircle2, Circle, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface Task {
  _id: string
  title: string
  description: string
  priority: "High" | "Medium" | "Low"
  subject: string
  completed: boolean
  dueDate: string
}

interface Subject {
  _id: string
  name: string
}

export function TasksView() {
  const { token } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [newTask, setNewTask] = useState("")
  const [selectedPriority, setSelectedPriority] = useState<"High" | "Medium" | "Low">("Medium")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchTasks()
    fetchSubjects()
  }, [token])

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "same-origin",
      })
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      } else {
        const ct = response.headers.get("content-type") || ""
        const msg = ct.includes("application/json") ? (await response.json()).error : await response.text()
        setError(msg || "Failed to fetch tasks")
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setError("Error fetching tasks")
    } finally {
      setLoading(false)
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await fetch("/api/subjects", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "same-origin",
      })
      if (response.ok) {
        const data = await response.json()
        setSubjects(data)
        if (data.length > 0 && !selectedSubject) {
          setSelectedSubject(data[0].name)
        }
      } else {
        const ct = response.headers.get("content-type") || ""
        const msg = ct.includes("application/json") ? (await response.json()).error : await response.text()
        setError(msg || "Failed to fetch subjects")
      }
    } catch (error) {
      console.error("Error fetching subjects:", error)
      setError("Error fetching subjects")
    }
  }

  const addNewTask = async () => {
    if (!newTask.trim() || !selectedSubject) return

    setSubmitting(true)
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "same-origin",
        body: JSON.stringify({
          title: newTask,
          priority: selectedPriority,
          subject: selectedSubject,
          dueDate: new Date().toISOString().split("T")[0],
        }),
      })

      if (response.ok) {
        const newTaskData = await response.json()
        setTasks([newTaskData, ...tasks])
        setNewTask("")
        setSelectedPriority("Medium")
        setShowForm(false)
      } else {
        const ct = response.headers.get("content-type") || ""
        const msg = ct.includes("application/json") ? (await response.json()).error : await response.text()
        setError(msg || "Failed to add task")
      }
    } catch (error) {
      console.error("Error adding task:", error)
      setError("Error adding task")
    } finally {
      setSubmitting(false)
    }
  }

  const updateTaskStatus = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "same-origin",
        body: JSON.stringify({ completed }),
      })

      if (response.ok) {
        setTasks(tasks.map((t) => (t._id === taskId ? { ...t, completed } : t)))
      } else {
        const ct = response.headers.get("content-type") || ""
        const msg = ct.includes("application/json") ? (await response.json()).error : await response.text()
        setError(msg || "Failed to update task")
      }
    } catch (error) {
      console.error("Error updating task:", error)
      setError("Error updating task")
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "same-origin",
      })

      if (response.ok) {
        setTasks(tasks.filter((t) => t._id !== taskId))
      } else {
        const ct = response.headers.get("content-type") || ""
        const msg = ct.includes("application/json") ? (await response.json()).error : await response.text()
        setError(msg || "Failed to delete task")
      }
    } catch (error) {
      console.error("Error deleting task:", error)
      setError("Error deleting task")
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return ""
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <h2 className="text-3xl font-bold mb-8">My Tasks</h2>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {!showForm ? (
          <Button onClick={() => setShowForm(true)} className="gap-2 mb-8">
            <Plus className="w-4 h-4" />
            Add New Task
          </Button>
        ) : (
          <Card className="p-6 mb-8">
            <h3 className="font-bold mb-4">Create New Task</h3>
            <Input
              placeholder="Task title..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addNewTask()}
              className="mb-4"
              disabled={submitting}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as "High" | "Medium" | "Low")}
                  className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                  disabled={submitting}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                  disabled={submitting}
                >
                  {subjects.map((s) => (
                    <option key={s._id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={addNewTask} className="gap-2 w-full sm:w-auto" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Task
                  </>
                )}
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline" className="w-full sm:w-auto" disabled={submitting}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task._id} className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <button onClick={() => updateTaskStatus(task._id, !task.completed)} className="flex-shrink-0 p-2.5 rounded">
                {task.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground" />
                )}
              </button>
              <div className="flex-1">
                <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </p>
                <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                  <span>{task.subject}</span>
                  <span>•</span>
                  <span>{task.dueDate}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <button
                onClick={() => deleteTask(task._id)}
                className="text-destructive hover:bg-destructive/10 p-3 rounded"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tasks yet. Add one to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
