import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: Request) {
  const user = getUserFromToken(req as any);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = await req.json();
  await pool.query("INSERT IGNORE INTO enrollments (user_id, course_id) VALUES (?, ?)", [user.id, courseId]);

  return NextResponse.json({ success: true });
}




export async function PUT(req: Request) {
  const user = getUserFromToken(req as any);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId, progress } = await req.json();

  await pool.query(
    "UPDATE enrollments SET progress = ?, status = ? WHERE user_id = ? AND course_id = ?",
    [
      JSON.stringify(progress),
      progress?.completedLessons?.length > 0 ? "completed" : "enrolled",
      user.id,
      courseId,
    ]
  );

  return NextResponse.json({ success: true });
}
