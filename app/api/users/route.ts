// app/api/users/route.ts
import { NextResponse } from "next/server"
import pool from "@/lib/db" // <- MySQL/Postgres connection pool

export async function GET() {
  try {
    const [users] = await pool.query("SELECT * FROM users WHERE role != 'admin'")
    const [enrollments] = await pool.query("SELECT * FROM enrollments")
    const [courses] = await pool.query("SELECT * FROM courses")

    return NextResponse.json({ users, enrollments, courses })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
