import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Subject from "@/models/Subject"
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
    const subject = await Subject.findOneAndUpdate({ _id: id, userId: decoded.userId }, await request.json(), {
      new: true,
    })

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    return NextResponse.json(subject)
  } catch (error) {
    console.error("Update subject error:", error)
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
    const subject = await Subject.findOneAndDelete({
      _id: id,
      userId: decoded.userId,
    })

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Subject deleted" })
  } catch (error) {
    console.error("Delete subject error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
