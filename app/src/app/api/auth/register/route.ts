import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/lib/validate";
import { signToken } from "@/lib/auth";
import { rateLimit, getRateLimitIdentifier } from "@/lib/rate-limit";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  const identifier = getRateLimitIdentifier(request);
  if (!rateLimit(identifier, 3, 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  const body = (await request.json().catch(() => ({}))) as unknown;
  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message || "Invalid input" }, { status: 400 });
  }

  const { name, email, password, address } = parsed.data;

  try {
    await connectToDatabase();
    const existing = await User.findOne({ email: email.toLowerCase() }).exec();
    if (existing) {
      return NextResponse.json({ error: "Email exists" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email: email.toLowerCase(), password: hashed, role: "customer", address });
    await user.save();

    const token = signToken({ sub: user._id.toString(), email: user.email, role: user.role });
    const response = NextResponse.json({ ok: true, token, user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role } });

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
    console.error("Register route error", error);
    return NextResponse.json({ error: "Registration service unavailable" }, { status: 500 });
  }
}
