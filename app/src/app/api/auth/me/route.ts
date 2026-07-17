import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("phantom_token")?.value;
  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const payload = verifyToken(token);
    if (!payload?.sub) {
      return NextResponse.json({ user: null });
    }

    await connectToDatabase();
    const user = await User.findById(payload.sub).exec();

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
