

// app/api/certificates/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import fs from "fs";
import path from "path";
export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.name, c.course_id, cr.title as courseName, c.template, c.issued_count, c.created_date 
       FROM certificates c
       JOIN courses cr ON c.course_id = cr.id`
    );
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const courseId = parseInt(formData.get("courseId") as string);
    const file = formData.get("template") as File;

    if (!name || !courseId || !file) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Save file to public/uploads/certificates
    const uploadDir = path.join(process.cwd(), "public/uploads/certificates");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const templateUrl = `/uploads/certificates/${file.name}`;

    await pool.query(
      "INSERT INTO certificates (name, course_id, template) VALUES (?, ?, ?)",
      [name, courseId, templateUrl]
    );

    return NextResponse.json({ message: "Certificate created successfully!" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}