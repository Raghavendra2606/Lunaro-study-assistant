import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Assignment from "@/models/Assignment"
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

    const assignments = await Assignment.find({
      userId: decoded.userId,
    }).sort({ createdAt: -1 })

    return NextResponse.json(assignments)
  } catch (error) {
    console.error("Get assignments error:", error)
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

    const { title, description, subject, status, dueDate } = await request.json()

    const assignment = await Assignment.create({
      userId: decoded.userId,
      title,
      description,
      subject,
      status,
      dueDate,
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error("Create assignment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
