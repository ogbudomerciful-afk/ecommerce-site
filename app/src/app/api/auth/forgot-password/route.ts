import { NextResponse } from "next/server";
import { randomString } from "@/lib/mock-data";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string };
  const email = body.email?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "Email already verified" }, { status: 400 });
    }

    const token = randomString("verify");
    user.verificationToken = token;
    await user.save();

    const verifyUrl = `${process.env.APP_URL || "http://localhost:3000"}/api/auth/verify-email?token=${token}`;
    const emailHtml = `
      <p>Hello ${user.name},</p>
      <p>Click the link below to verify your email:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: user.email, subject: "Verify your email", html: emailHtml }),
    }).catch(() => {});

    return NextResponse.json({ ok: true, message: "Verification email sent" });
  } catch (error) {
    console.error("Forgot password error", error);
    return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
  }
}
