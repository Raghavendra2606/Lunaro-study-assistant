"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Calendar, BookOpen, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface Assignment {
  _id: string
  title: string
  description: string
  subject: string
  status: "Pending" | "Submitted" | "Graded"
  dueDate: string
}

interface Subject {
  _id: string
  name: string
}

export function AssignmentsView() {
  const { token } = useAuth()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    status: "Pending" as const,
  })

  useEffect(() => {
    fetchAssignments()
    fetchSubjects()
  }, [token])

  const fetchAssignments = async () => {
    try {
      const response = await fetch("/api/assignments", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "same-origin",
      })
      if (response.ok) {
        const data = await response.json()
        setAssignments(data)
      } else {
        const ct = response.headers.get("content-type") || ""
        const msg = ct.includes("application/json") ? (await response.json()).error : await response.text()
        setError(msg || "Failed to fetch assignments")
      }
    } catch (error) {
      console.error("Error fetching assignments:", error)
      setError("Error fetching assignments")
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
        if (data.length > 0 && !formData.subject) {
          setFormData((prev) => ({ ...prev, subject: data[0].name }))
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

  const addNewAssignment = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.subject) return

    setSubmitting(true)
    try {
      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "same-origin",
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newAssignment = await response.json()
        setAssignments([newAssignment, ...assignments])
        setFormData({
          title: "",
          subject: subjects[0]?.name || "",
          description: "",
          dueDate: new Date().toISOString().split("T")[0],
          status: "Pending",
        })
        setShowForm(false)
      } else {
        const ct = response.headers.get("content-type") || ""
        const msg = ct.includes("application/json") ? (await response.json()).error : await response.text()
        setError(msg || "Failed to add assignment")
      }
    } catch (error) {
      console.error("Error adding assignment:", error)
      setError("Error adding assignment")
    } finally {
      setSubmitting(false)
    }
  }

  const updateAssignmentStatus = async (assignmentId: string, status: "Pending" | "Submitted" | "Graded") => {
    try {
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "same-origin",
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setAssignments(assignments.map((a) => (a._id === assignmentId ? { ...a, status } : a)))
      } else {
        const ct = response.headers.get("content-type") || ""
        const msg = ct.includes("application/json") ? (await response.json()).error : await response.text()
        setError(msg || "Failed to update assignment")
      }
    } catch (error) {
      console.error("Error updating assignment:", error)
      setError("Error updating assignment")
    }
  }

  const deleteAssignment = async (assignmentId: string) => {
    try {
      const response = await fetch(`/api/assignments/${assignmentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "same-origin",
      })

      if (response.ok) {
        setAssignments(assignments.filter((a) => a._id !== assignmentId))
      } else {
        const ct = response.headers.get("content-type") || ""
        const msg = ct.includes("application/json") ? (await response.json()).error : await response.text()
        setError(msg || "Failed to delete assignment")
      }
    } catch (error) {
      console.error("Error deleting assignment:", error)
      setError("Error deleting assignment")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Submitted":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "Graded":
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
        <h2 className="text-3xl font-bold mb-8">Assignments</h2>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {!showForm ? (
          <Button onClick={() => setShowForm(true)} className="gap-2 mb-8">
            <Plus className="w-4 h-4" />
            Add New Assignment
          </Button>
        ) : (
          <Card className="p-6 mb-8">
            <h3 className="font-bold mb-4">Create New Assignment</h3>
            <Input
              placeholder="Assignment title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mb-4"
              disabled={submitting}
            />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
              <div>
                <label className="text-sm font-medium mb-2 block">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                  disabled={submitting}
                />
              </div>
            </div>
            <textarea
              placeholder="Assignment description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-border rounded-lg mb-4 bg-background text-foreground"
              rows={3}
              disabled={submitting}
            />
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as "Pending" | "Submitted" | "Graded" })
                }
                className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                disabled={submitting}
              >
                <option value="Pending">Pending</option>
                <option value="Submitted">Submitted</option>
                <option value="Graded">Graded</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={addNewAssignment} className="gap-2" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Assignment
                  </>
                )}
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline" disabled={submitting}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Assignments Grid */}
        <div className="grid gap-4">
          {assignments.map((assignment) => (
            <Card key={assignment._id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">{assignment.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {assignment.subject}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {assignment.dueDate}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteAssignment(assignment._id)}
                  className="text-destructive hover:bg-destructive/10 p-2 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm mb-4">{assignment.description}</p>
              <div className="flex items-center justify-between">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}
                >
                  {assignment.status}
                </span>
                <select
                  value={assignment.status}
                  onChange={(e) =>
                    updateAssignmentStatus(assignment._id, e.target.value as "Pending" | "Submitted" | "Graded")
                  }
                  className="text-xs p-1 border border-border rounded bg-background text-foreground"
                >
                  <option value="Pending">Pending</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Graded">Graded</option>
                </select>
              </div>
            </Card>
          ))}
        </div>

        {assignments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No assignments yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
