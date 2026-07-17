import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/lib/validate";
import { signToken } from "@/lib/auth";
import { rateLimit, getRateLimitIdentifier } from "@/lib/rate-limit";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  const identifier = getRateLimitIdentifier(request);
  if (!rateLimit(identifier, 5, 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  const body = (await request.json().catch(() => ({}))) as unknown;
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  try {
    await connectToDatabase();
    const user = await User.findOne({ email: email.toLowerCase() }).exec();

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ sub: user._id.toString(), email: user.email, role: user.role });
    const response = NextResponse.json({
      ok: true,
      token,
      user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role },
    });

    response.cookies.set({
      name: "phantom_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login route error", error);
    return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 });
  }
}
