import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Subject from "@/models/Subject"
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

    const subjects = await Subject.find({ userId: decoded.userId }).sort({
      createdAt: -1,
    })

    return NextResponse.json(subjects)
  } catch (error) {
    console.error("Get subjects error:", error)
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

    const { name, teacher, credits } = await request.json()

    const subject = await Subject.create({
      userId: decoded.userId,
      name,
      teacher,
      credits,
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    console.error("Create subject error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
