import { NextResponse } from "next/server"
import pool from "@/lib/db"

// GET quiz by ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const [rows]: any = await pool.query("SELECT * FROM quizzes WHERE id = ?", [params.id])
  if (!rows.length) return NextResponse.json({ error: "Quiz not found" }, { status: 404 })

  const quiz = { ...rows[0], questions: JSON.parse(rows[0].questions || "[]") }
  return NextResponse.json(quiz)
}

// UPDATE quiz
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    await pool.query(
      `UPDATE quizzes 
      SET title=?, description=?, lessonId=?, courseId=?, timeLimit=?, passingScore=?, maxAttempts=?, isFinalQuiz=?, status=?, questions=? 
      WHERE id=?`,
      [
        body.title,
        body.description,
        body.lessonId || null,
        body.courseId,
        body.timeLimit,
        body.passingScore,
        body.maxAttempts,
        body.isFinalQuiz,
        body.status,
        JSON.stringify(body.questions),
        params.id,
      ]
    )
    return NextResponse.json({ id: params.id, ...body })
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 })
  }
}

// DELETE quiz
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await pool.query("DELETE FROM quizzes WHERE id = ?", [params.id])
  return NextResponse.json({ success: true })
}
