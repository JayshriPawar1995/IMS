import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [rows] = await pool.query(
      "SELECT * FROM courses WHERE (targetRole = ? OR targetRole = 'both') AND status = 'active'",
      [user.role]
    );

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Course fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
