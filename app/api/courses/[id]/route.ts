import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { getUserFromToken } from "@/lib/auth";  // ✅ FIXED IMPORT
// UPDATE course (PUT /api/courses/:id)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { id } = params

    const [result] = await pool.query(
      `UPDATE courses 
       SET title=?, description=?, instructor=?, duration=?, level=?, category=?, status=?, thumbnail=?, targetRole=?, passing_score=?, price=?, is_featured=?, tags=?, prerequisites=?, learning_outcomes=?, estimated_hours=?
       WHERE id=?`,
      [
        body.title,
        body.description,
        body.instructor,
        body.duration,
        body.level,
        body.category,
        body.status || "draft",
        body.thumbnail || null,
        body.targetRole || "both",
        body.passing_score || 70,
        body.price || 0,
        body.is_featured || false,
        body.tags ? JSON.stringify(body.tags) : null, 
        body.prerequisites || null,
        body.learning_outcomes || null,
        body.estimated_hours || null,
        id,
      ]
    )

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Course updated successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}

// DELETE course (DELETE /api/courses/:id)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const [result] = await pool.query(`DELETE FROM courses WHERE id=?`, [id])

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Course deleted successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}


// GET single course by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromToken(req as any);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courseId = params.id;

    // Get course info
    const [courseRows] = await pool.query("SELECT * FROM courses WHERE id = ?", [courseId]);
    if (!Array.isArray(courseRows) || courseRows.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    const course = courseRows[0];

    // Get lessons
    const [lessonRows] = await pool.query("SELECT * FROM lessons WHERE courseId = ?", [courseId]);

    // Get quizzes
    const [quizRows] = await pool.query("SELECT * FROM quizzes WHERE courseId = ?", [courseId]);

    return NextResponse.json({
      ...course,
      lessons: lessonRows,
      quizzes: quizRows,
    });
  } catch (err: any) {
    console.error("Course fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}