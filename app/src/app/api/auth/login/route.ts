import { serialize } from "cookie";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "dev-secret";
const AUTH_COOKIE_NAME = "poppy_token";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ sub: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    const response = NextResponse.json({
      ok: true,
      token,
      user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role },
    });

    response.headers.set(
      "Set-Cookie",
      serialize(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    );

    return response;
  } catch (error) {
    console.error("Login route error", error);
    return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 });
  }
}
