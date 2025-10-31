"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Edit2, Save, X } from "lucide-react"
import { useAppContext } from "@/components/app-context"
import { useAuth } from "@/components/auth-provider"

export function NotesView() {
  const { notes, addNote, updateNote, deleteNote } = useAppContext()
  const { token } = useAuth()
  const [subjects, setSubjects] = useState<Array<{ _id: string; name: string }>>([])
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [newSubject, setNewSubject] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [loadingSubjects, setLoadingSubjects] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/subjects", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "same-origin",
        })
        if (!res.ok) {
          const ct = res.headers.get("content-type") || ""
          const msg = ct.includes("application/json") ? (await res.json()).error : await res.text()
          setError(msg || "Failed to load subjects")
          setSubjects([])
          return
        }
        const data = (await res.json()) as Array<{ _id: string; name: string }>
        setSubjects(data)
        if (data.length > 0) {
          setNewSubject((prev) => prev || data[0].name)
        } else {
          setNewSubject("")
        }
      } catch (e) {
        console.error("Error loading subjects:", e)
        setError("Error loading subjects")
        setSubjects([])
      } finally {
        setLoadingSubjects(false)
      }
    }
    fetchSubjects()
  }, [token])

  const addNewNote = () => {
    if (newTitle.trim() && newContent.trim()) {
      addNote({
        title: newTitle,
        content: newContent,
        subject: newSubject,
        createdAt: new Date().toISOString().split("T")[0],
      })
      setNewTitle("")
      setNewContent("")
      setNewSubject(subjects[0]?.name || "")
    }
  }

  const startEdit = (note: any) => {
    setEditingId(note.id)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  const saveEdit = (id: string) => {
    updateNote(id, { title: editTitle, content: editContent })
    setEditingId(null)
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <h2 className="text-3xl font-bold mb-8">Study Notes</h2>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Add Note */}
        <Card className="p-6 mb-8">
          <h3 className="font-bold mb-4">Create New Note</h3>
          <Input
            placeholder="Note title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="mb-4"
          />
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Subject</label>
            {loadingSubjects ? (
              <div className="text-sm text-muted-foreground">Loading subjects...</div>
            ) : subjects.length === 0 ? (
              <div className="text-sm text-muted-foreground">No subjects found. Create a subject first.</div>
            ) : (
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
              >
                {subjects.map((s) => (
                  <option key={s._id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <textarea
            placeholder="Write your notes here..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full p-3 border border-border rounded-lg mb-4 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
          />
          <Button onClick={addNewNote} className="gap-2" disabled={subjects.length === 0}>
            <Plus className="w-4 h-4" />
            Add Note
          </Button>
        </Card>

        {/* Notes List */}
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id} className="p-6">
              {editingId === note.id ? (
                <div>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="mb-4 font-bold text-lg"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg mb-4 bg-background text-foreground"
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => saveEdit(note.id)} size="sm" className="gap-2">
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                    <Button onClick={() => setEditingId(null)} size="sm" variant="outline" className="gap-2">
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{note.title}</h3>
                      <div className="flex gap-3 text-sm text-muted-foreground">
                        <span>{note.subject}</span>
                        <span>•</span>
                        <span>{note.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(note)} className="text-primary hover:bg-primary/10 p-2 rounded">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-foreground whitespace-pre-wrap">{note.content}</p>
                </div>
              )}
            </Card>
          ))}
        </div>

        {notes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No notes yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
