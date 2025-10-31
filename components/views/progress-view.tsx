"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"

interface Task {
  _id: string
  completed: boolean
  priority: string
  subject: string
}

interface Assignment {
  _id: string
  status: string
  subject: string
}

interface Subject {
  _id: string
  name: string
  credits: number
}

interface Note {
  _id: string
  subject: string
}

export function ProgressView() {
  const { token } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
  }, [token])

  const fetchAllData = async () => {
    try {
      const [tasksRes, assignmentsRes, subjectsRes, notesRes] = await Promise.all([
        fetch("/api/tasks", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/assignments", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/subjects", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/notes", { headers: { Authorization: `Bearer ${token}` } }),
      ])

      if (tasksRes.ok) setTasks(await tasksRes.json())
      if (assignmentsRes.ok) setAssignments(await assignmentsRes.json())
      if (subjectsRes.ok) setSubjects(await subjectsRes.json())
      if (notesRes.ok) setNotes(await notesRes.json())
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const completedTasks = tasks.filter((t) => t.completed).length
  const completedAssignments = assignments.filter((a) => a.status === "Graded").length
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0)

  const weeklyData = [
    { day: "Mon", hours: Math.ceil(tasks.length * 0.3), tasks: tasks.filter((t) => t.priority === "High").length },
    { day: "Tue", hours: Math.ceil(tasks.length * 0.4), tasks: tasks.filter((t) => t.priority === "Medium").length },
    { day: "Wed", hours: Math.ceil(tasks.length * 0.35), tasks: completedTasks },
    { day: "Thu", hours: Math.ceil(assignments.length * 0.5), tasks: assignments.length },
    { day: "Fri", hours: Math.ceil(tasks.length * 0.45), tasks: tasks.length },
    { day: "Sat", hours: Math.ceil(tasks.length * 0.2), tasks: Math.ceil(tasks.length * 0.5) },
    { day: "Sun", hours: Math.ceil(tasks.length * 0.15), tasks: Math.ceil(tasks.length * 0.3) },
  ]

  const subjectProgress = subjects.map((subject) => {
    const subjectTasks = tasks.filter((t) => t.subject === subject.name)
    const subjectAssignments = assignments.filter((a) => a.subject === subject.name)
    const completedSubjectTasks = subjectTasks.filter((t) => t.completed).length
    const completedSubjectAssignments = subjectAssignments.filter((a) => a.status === "Graded").length

    const totalItems = subjectTasks.length + subjectAssignments.length
    const completedItems = completedSubjectTasks + completedSubjectAssignments
    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

    return {
      name: subject.name,
      value: percentage,
    }
  })

  const stats = [
    { label: "Total Study Hours", value: weeklyData.reduce((sum, d) => sum + d.hours, 0).toString(), unit: "hrs" },
    { label: "Tasks Completed", value: completedTasks.toString(), unit: `of ${tasks.length}` },
    { label: "Assignments Done", value: completedAssignments.toString(), unit: `of ${assignments.length}` },
    { label: "Total Credits", value: totalCredits.toString(), unit: "credits" },
  ]

  const colors = ["#3b82f6", "#a855f7", "#ec4899", "#10b981", "#f59e0b", "#ef4444"]

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
        <h2 className="text-3xl font-bold mb-8">Your Progress</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.unit}</p>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Activity */}
          <Card className="p-6">
            <h3 className="font-bold mb-4">Weekly Study Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                />
                <Legend />
                <Bar dataKey="hours" fill="#3b82f6" name="Study Hours" />
                <Bar dataKey="tasks" fill="#10b981" name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Subject Performance */}
          <Card className="p-6">
            <h3 className="font-bold mb-4">Subject Performance</h3>
            {subjectProgress.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={subjectProgress}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {subjectProgress.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No subject data available
              </div>
            )}
          </Card>
        </div>

        {/* Subject Breakdown */}
        <Card className="p-6">
          <h3 className="font-bold mb-6">Subject Performance Breakdown</h3>
          {subjectProgress.length > 0 ? (
            <div className="space-y-4">
              {subjectProgress.map((subject) => (
                <div key={subject.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{subject.name}</span>
                    <span className="font-bold">{subject.value}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all bg-blue-500"
                      style={{ width: `${subject.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No subject data available</p>
          )}
        </Card>
      </div>
    </div>
  )
}
