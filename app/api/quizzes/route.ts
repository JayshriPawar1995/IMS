import { NextResponse } from "next/server"
import pool from "@/lib/db"

// CREATE a quiz
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const [result]: any = await pool.query(
      `INSERT INTO quizzes 
      (title, description, lessonId, courseId, timeLimit, passingScore, maxAttempts, isFinalQuiz, status, questions) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      ]
    )

    return NextResponse.json({ id: result.insertId, ...body }, { status: 201 })
  } catch (err: any) {
    console.error("POST QUIZ ERROR:", err)
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 })
  }
} 




// GET all quizzes
// export async function GET() {
//   try {
//     const [rows] = await pool.execute("SELECT * FROM quizzes");
//     const quizzes = (rows as any[]).map(q => ({
//       ...q,
//       questions: JSON.parse(q.questions || "[]")
//     }));

//     return NextResponse.json(quizzes);
//   } catch (err) {
//     return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
//   }
// }


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get("courseId")

    let query = `SELECT * FROM quizzes`
    const values: any[] = []

    if (courseId) {
      query += ` WHERE courseId = ?`
      values.push(courseId)
    }

    const [rows]: any = await pool.query(query, values)

    const quizzes = rows.map((quiz: any) => ({
      ...quiz,
      questions: JSON.parse(quiz.questions || "[]"),
    }))

    return NextResponse.json(quizzes)
  } catch (err: any) {
    console.error("GET QUIZZES ERROR:", err)
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 })
  }
} 
