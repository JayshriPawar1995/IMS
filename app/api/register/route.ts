import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import pool from "@/lib/db"
import { RowDataPacket, OkPacket } from "mysql2"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, role, password } = body

    if (!name || !email || !phone || !role || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // ✅ check if user already exists
    const [existingUser] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // ✅ generate UUID for user id
    const userId = uuidv4()

    // ✅ insert user into db
    await pool.query<OkPacket>(
      "INSERT INTO users (id, name, email, phone, role, password, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [userId, name, email, phone, role, hashedPassword, "approved"]
    )

    return NextResponse.json(
      { success: true, message: "User registered successfully" },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Registration error:", error) 
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 }) 
  }
}
