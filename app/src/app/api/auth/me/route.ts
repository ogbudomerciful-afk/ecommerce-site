import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "dev-secret";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("poppy_token")?.value;
  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub?: string; email?: string; role?: string };
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
