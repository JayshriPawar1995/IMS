import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM courses"); // ✅ works with mysql2/promise
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("DB Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Insert a new course
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Required fields check (no nulls allowed)
    const requiredFields = [
      "title", "description", "instructor", "duration",
      "level", "category"
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json( 
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const [result] = await pool.query(
      `INSERT INTO courses 
        (title, description, instructor, duration, level, category, status, thumbnail, targetRole, passing_score, price, is_featured, tags, prerequisites, learning_outcomes, estimated_hours) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      ]
    );

    return NextResponse.json(
      { message: "Course created successfully", id: (result as any).insertId },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("DB Insert Error:", err);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}

// GET single course
// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const [rows]: any = await pool.query("SELECT * FROM courses WHERE id = ?", [params.id]);

//     if (!rows || rows.length === 0) {
//       return NextResponse.json({ error: "Course not found" }, { status: 404 });
//     }

//     return NextResponse.json(rows[0]);
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }


