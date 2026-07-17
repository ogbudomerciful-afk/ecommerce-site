import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ ok: true, message: "Auth health check" });
}
