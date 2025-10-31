"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Task {
  id: string
  title: string
  completed: boolean
  priority: "high" | "medium" | "low"
  dueDate: string
  subject: string
}

export interface Assignment {
  id: string
  title: string
  subject: string
  dueDate: string
  description: string
  status: "pending" | "submitted" | "graded"
}

export interface Subject {
  id: string
  name: string
  instructor: string
  color: string
  credits: number
}

export interface Note {
  id: string
  title: string
  content: string
  subject: string
  createdAt: string
}

interface AppContextType {
  tasks: Task[]
  assignments: Assignment[]
  subjects: Subject[]
  notes: Note[]
  addTask: (task: Omit<Task, "id">) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  addAssignment: (assignment: Omit<Assignment, "id">) => void
  updateAssignment: (id: string, assignment: Partial<Assignment>) => void
  deleteAssignment: (id: string) => void
  addSubject: (subject: Omit<Subject, "id">) => void
  deleteSubject: (id: string) => void
  addNote: (note: Omit<Note, "id">) => void
  updateNote: (id: string, note: Partial<Note>) => void
  deleteNote: (id: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete Math Assignment",
      completed: false,
      priority: "high",
      dueDate: "2025-11-05",
      subject: "Mathematics",
    },
    {
      id: "2",
      title: "Read Chapter 5",
      completed: true,
      priority: "medium",
      dueDate: "2025-11-03",
      subject: "English Literature",
    },
    {
      id: "3",
      title: "Prepare for Physics Quiz",
      completed: false,
      priority: "high",
      dueDate: "2025-11-06",
      subject: "Physics",
    },
    {
      id: "4",
      title: "Biology Lab Report",
      completed: true,
      priority: "medium",
      dueDate: "2025-11-04",
      subject: "Biology",
    },
  ])

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "Essay on Climate Change",
      subject: "English Literature",
      dueDate: "2025-11-10",
      description: "Write a 2000-word essay on climate change impacts",
      status: "pending",
    },
    {
      id: "2",
      title: "Calculus Problem Set",
      subject: "Mathematics",
      dueDate: "2025-11-08",
      description: "Complete problems 1-50 from chapter 5",
      status: "submitted",
    },
    {
      id: "3",
      title: "Biology Lab Report",
      subject: "Biology",
      dueDate: "2025-11-15",
      description: "Document experiment results and analysis",
      status: "pending",
    },
  ])

  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", name: "Mathematics", instructor: "Dr. Smith", color: "from-blue-500 to-blue-600", credits: 4 },
    { id: "2", name: "Physics", instructor: "Prof. Johnson", color: "from-purple-500 to-purple-600", credits: 3 },
    { id: "3", name: "English Literature", instructor: "Ms. Williams", color: "from-pink-500 to-pink-600", credits: 3 },
    { id: "4", name: "Biology", instructor: "Dr. Brown", color: "from-green-500 to-green-600", credits: 4 },
  ])

  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Photosynthesis",
      content: "Light-dependent reactions occur in thylakoids. Produces ATP and NADPH.",
      subject: "Biology",
      createdAt: "2025-11-01",
    },
    {
      id: "2",
      title: "Quadratic Formula",
      content: "x = (-b ± √(b²-4ac)) / 2a. Used to solve quadratic equations.",
      subject: "Mathematics",
      createdAt: "2025-10-30",
    },
    {
      id: "3",
      title: "Newton's Laws",
      content: "First Law: Object in motion stays in motion. Second Law: F=ma. Third Law: Action-reaction pairs.",
      subject: "Physics",
      createdAt: "2025-10-29",
    },
  ])

  const addTask = (task: Omit<Task, "id">) => {
    setTasks([...tasks, { ...task, id: Date.now().toString() }])
  }

  const updateTask = (id: string, task: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...task } : t)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const addAssignment = (assignment: Omit<Assignment, "id">) => {
    setAssignments([...assignments, { ...assignment, id: Date.now().toString() }])
  }

  const updateAssignment = (id: string, assignment: Partial<Assignment>) => {
    setAssignments(assignments.map((a) => (a.id === id ? { ...a, ...assignment } : a)))
  }

  const deleteAssignment = (id: string) => {
    setAssignments(assignments.filter((a) => a.id !== id))
  }

  const addSubject = (subject: Omit<Subject, "id">) => {
    setSubjects([...subjects, { ...subject, id: Date.now().toString() }])
  }

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id))
  }

  const addNote = (note: Omit<Note, "id">) => {
    setNotes([...notes, { ...note, id: Date.now().toString() }])
  }

  const updateNote = (id: string, note: Partial<Note>) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, ...note } : n)))
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id))
  }

  return (
    <AppContext.Provider
      value={{
        tasks,
        assignments,
        subjects,
        notes,
        addTask,
        updateTask,
        deleteTask,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        addSubject,
        deleteSubject,
        addNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider")
  }
  return context
}
