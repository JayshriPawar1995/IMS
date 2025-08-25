import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret"; // use .env

export function getUserFromToken(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) return null;

    // ✅ verify with the same secret used when signing
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };

    return decoded;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

export function signToken(user: { id: string; email: string; role: string }) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}
