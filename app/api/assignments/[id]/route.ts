import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Assignment from "@/models/Assignment"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params
    const assignment = await Assignment.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      await request.json(),
      { new: true },
    )

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    return NextResponse.json(assignment)
  } catch (error) {
    console.error("Update assignment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params
    const assignment = await Assignment.findOneAndDelete({
      _id: id,
      userId: decoded.userId,
    })

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Assignment deleted" })
  } catch (error) {
    console.error("Delete assignment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
