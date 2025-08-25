import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import pool from "@/lib/db" // your mysql2/pool instance

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body 

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }



    

    // 🔍 check if user exists
    const [rows]: any = await pool.query("SELECT * FROM users WHERE email = ?", [email])


   

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 400 })
    }

    const user = rows[0]

    // 🔑 compare password
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
    }

    if (user.status !== "approved") {
      return NextResponse.json({ error: "Account not approved yet" }, { status: 403 })
    }

    // 🎟 generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "1d" }
    )

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
