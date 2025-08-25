// app/api/lessons/[id]/route.ts
import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM lessons WHERE courseId = ?", 
      [params.id]
    )

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ error: "Lessons not found" }, { status: 404 })
    }

    // ✅ return the whole array of lessons
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 })
  }
}


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()

    // Build dynamic SQL for only provided fields
    const fields: string[] = []
    const values: any[] = []

    if (body.title !== undefined) {
      fields.push("title = ?")
      values.push(body.title)
    }
    if (body.description !== undefined) {
      fields.push("description = ?")
      values.push(body.description)
    }
    if (body.content !== undefined) {
      fields.push("content = ?")
      values.push(body.content)
    }
    if (body.videoUrl !== undefined) {
      fields.push("videoUrl = ?")
      values.push(body.videoUrl)
    }
    if (body.videoThumbnail !== undefined) {
      fields.push("videoThumbnail = ?")
      values.push(body.videoThumbnail)
    }
    if (body.duration !== undefined) {
      fields.push("duration = ?")
      values.push(body.duration)
    }
    if (body.status !== undefined) {
      fields.push("status = ?")
      values.push(body.status)
    }
    

    if (fields.length === 0) {
      return NextResponse.json({ message: "No fields to update" }, { status: 400 })
    }

    values.push(params.id)

    const sql = `UPDATE lessons SET ${fields.join(", ")} WHERE id = ?`
    await db.execute(sql, values)

    return NextResponse.json({ message: "Lesson updated successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 })
  }
}


export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await db.execute("DELETE FROM lessons WHERE id = ?", [params.id])
    return NextResponse.json({ message: "Lesson deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 })
  }
}
