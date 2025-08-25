// app/api/lessons/route.ts
import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const [result] = await db.execute(
      `INSERT INTO lessons 
        (courseId, title, description, content, videoUrl, videoThumbnail, duration, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.courseId,
        body.title,
        body.description,
        body.content,
        body.videoUrl || null,
        body.videoThumbnail || null,
        body.duration,
        body.status,
        
      ]
    )

    return NextResponse.json({ id: (result as any).insertId, ...body }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating lesson:", error)
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 })
  }
}

export async function GET(req: Request) { 
  try {
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get("courseId")

    let query = "SELECT * FROM lessons"
    let values: any[] = []

    if (courseId) {
      query += " WHERE courseId = ? ORDER BY `id` ASC"
      values.push(courseId)
    }

    const [rows] = await db.execute(query, values)

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching lessons:", error)
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 })
  }
}
