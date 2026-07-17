import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "dev-secret";
const AUTH_COOKIE_NAME = "phantom_token";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { name?: string; email?: string; password?: string; address?: string };
  const name = body.name?.trim() || "New user";
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const existing = await User.findOne({ email }).exec();
    if (existing) {
      return NextResponse.json({ error: "Email exists" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role: "customer", address: body.address });
    await user.save();

    const token = jwt.sign({ sub: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    const response = NextResponse.json({ ok: true, token, user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role } });

   response.cookies.set({
     name: AUTH_COOKIE_NAME,
     value: token,
     httpOnly: true,
     secure: process.env.NODE_ENV === "production",
     sameSite: "lax",
     path: "/",
     maxAge: 60 * 60 * 24 * 7,
});

    return response;
  } catch (error) {
    console.error("Register route error", error);
    return NextResponse.json({ error: "Registration service unavailable" }, { status: 500 });
  }
}
