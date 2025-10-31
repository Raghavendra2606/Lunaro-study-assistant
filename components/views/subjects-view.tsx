"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, BookOpen, Users, X, ChevronRight, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface Subject {
  _id: string
  name: string
  teacher: string
  credits: number
}

interface Task {
  _id: string
  title: string
  completed: boolean
  subject: string
}

interface Assignment {
  _id: string
  title: string
  subject: string
  dueDate: string
  status: string
}

interface Note {
  _id: string
  title: string
  content: string
  subject: string
}

export function SubjectsView() {
  const { token } = useAuth()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    teacher: "",
    credits: "3",
  })

  const colors = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-pink-500 to-pink-600",
    "from-green-500 to-green-600",
    "from-orange-500 to-orange-600",
    "from-red-500 to-red-600",
  ]

  useEffect(() => {
    fetchAllData()
  }, [token])

  const fetchAllData = async () => {
    try {
      const [subjectsRes, tasksRes, assignmentsRes, notesRes] = await Promise.all([
        fetch("/api/subjects", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/tasks", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/assignments", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/notes", { headers: { Authorization: `Bearer ${token}` } }),
      ])

      if (subjectsRes.ok) setSubjects(await subjectsRes.json())
      if (tasksRes.ok) setTasks(await tasksRes.json())
      if (assignmentsRes.ok) setAssignments(await assignmentsRes.json())
      if (notesRes.ok) setNotes(await notesRes.json())
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const addNewSubject = async () => {
    if (!formData.name.trim() || !formData.teacher.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          teacher: formData.teacher,
          credits: Number.parseInt(formData.credits || "0") || 0,
        }),
      })

      if (response.ok) {
        const newSubject = await response.json()
        setSubjects([newSubject, ...subjects])
        setFormData({ name: "", teacher: "", credits: "3" })
        setShowForm(false)
      }
    } catch (error) {
      console.error("Error adding subject:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const deleteSubject = async (subjectId: string) => {
    try {
      const response = await fetch(`/api/subjects/${subjectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setSubjects(subjects.filter((s) => s._id !== subjectId))
      }
    } catch (error) {
      console.error("Error deleting subject:", error)
    }
  }

  const getSubjectDetails = (subjectName: string) => {
    const subjectTasks = tasks.filter((t) => t.subject === subjectName)
    const subjectAssignments = assignments.filter((a) => a.subject === subjectName)
    const subjectNotes = notes.filter((n) => n.subject === subjectName)
    const completedTasks = subjectTasks.filter((t) => t.completed).length

    return {
      tasks: subjectTasks,
      assignments: subjectAssignments,
      notes: subjectNotes,
      completedTasks,
      totalTasks: subjectTasks.length,
    }
  }

  const subject = selectedSubject ? subjects.find((s) => s._id === selectedSubject) : null
  const details = subject ? getSubjectDetails(subject.name) : null

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl">
        <h2 className="text-3xl font-bold mb-8">My Subjects</h2>

        {!showForm ? (
          <Button onClick={() => setShowForm(true)} className="gap-2 mb-8">
            <Plus className="w-4 h-4" />
            Add New Subject
          </Button>
        ) : (
          <Card className="p-6 mb-8">
            <h3 className="font-bold mb-4">Create New Subject</h3>
            <Input
              placeholder="Subject name..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mb-4"
              disabled={submitting}
            />
            <Input
              placeholder="Instructor/Teacher name..."
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              className="mb-4"
              disabled={submitting}
            />
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Credits</label>
              <input
                type="number"
                min="1"
                max="6"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                disabled={submitting}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addNewSubject} className="gap-2" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Subject
                  </>
                )}
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline" disabled={submitting}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {selectedSubject && subject && details && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{subject.name}</h2>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {subject.teacher}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {subject.credits} Credits
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSubject(null)}
                    className="text-muted-foreground hover:bg-muted p-2 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                {details.totalTasks > 0 && (
                  <div className="mb-6 p-4 bg-muted rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Task Progress</span>
                      <span className="text-sm">
                        {details.completedTasks} of {details.totalTasks} completed
                      </span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all"
                        style={{ width: `${(details.completedTasks / details.totalTasks) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Tasks Section */}
                {details.tasks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold mb-3">Related Tasks ({details.tasks.length})</h3>
                    <div className="space-y-2">
                      {details.tasks.map((task) => (
                        <div key={task._id} className="p-3 bg-muted rounded-lg flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${task.completed ? "bg-green-500" : "bg-yellow-500"}`}
                          />
                          <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assignments Section */}
                {details.assignments.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold mb-3">Related Assignments ({details.assignments.length})</h3>
                    <div className="space-y-2">
                      {details.assignments.map((assignment) => (
                        <div key={assignment._id} className="p-3 bg-muted rounded-lg">
                          <div className="font-medium">{assignment.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">Due: {assignment.dueDate}</div>
                          <span className="inline-block mt-2 px-2 py-1 text-xs rounded bg-background">
                            {assignment.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes Section */}
                {details.notes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold mb-3">Study Notes ({details.notes.length})</h3>
                    <div className="space-y-2">
                      {details.notes.map((note) => (
                        <div key={note._id} className="p-3 bg-muted rounded-lg">
                          <div className="font-medium">{note.title}</div>
                          <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{note.content}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {details.tasks.length === 0 && details.assignments.length === 0 && details.notes.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No tasks, assignments, or notes for this subject yet.
                  </p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, idx) => {
            const details = getSubjectDetails(subject.name)
            return (
              <Card
                key={subject._id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedSubject(subject._id)}
              >
                <div className={`h-24 bg-gradient-to-br ${colors[idx % colors.length]}`} />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{subject.name}</h3>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {subject.teacher}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      {subject.credits} Credits
                    </div>
                    {details.totalTasks > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {details.completedTasks}/{details.totalTasks} tasks completed
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedSubject(subject._id)
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                    >
                      View <ChevronRight className="w-3 h-3" />
                    </Button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSubject(subject._id)
                      }}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {subjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No subjects yet. Add one to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
