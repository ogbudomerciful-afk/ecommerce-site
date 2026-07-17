import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("phantom_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = verifyToken(token);
    if (!payload?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(payload.sub).exec();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ addresses: user.addresses || [] });
  } catch {
    return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("phantom_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = verifyToken(token);
    if (!payload?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as {
      label?: string;
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
      isDefault?: boolean;
    };

    if (!body.label || !body.street || !body.city || !body.state || !body.zip || !body.country) {
      return NextResponse.json({ error: "All address fields are required" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(payload.sub).exec();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.addresses) {
      user.addresses = [];
    }

    if (body.isDefault) {
      (user.addresses || []).forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    const newAddress = {
      id: `addr-${Date.now()}`,
      label: body.label,
      street: body.street,
      city: body.city,
      state: body.state,
      zip: body.zip,
      country: body.country,
      isDefault: body.isDefault || false,
    };

    user.addresses.push(newAddress);
    await user.save();

    return NextResponse.json({ addresses: user.addresses });
  } catch {
    return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
  }
}
