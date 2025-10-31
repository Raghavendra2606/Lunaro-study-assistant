import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Note from "@/models/Note"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const notes = await Note.find({ userId: decoded.userId }).sort({
      createdAt: -1,
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Get notes error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { title, content, subject } = await request.json()

    const note = await Note.create({
      userId: decoded.userId,
      title,
      content,
      subject,
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error("Create note error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
