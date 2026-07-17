import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ verificationToken: token }).exec();

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ ok: true, message: "Email already verified" });
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.json({ ok: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify email error", error);
    return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
  }
}
