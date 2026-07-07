import { NextResponse } from "next/server";

const WEBHOOK_SECRET = process.env.FLUTTERWAVE_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  const signature = request.headers.get("verif-hash") || "";
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  if (WEBHOOK_SECRET && signature && signature !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // eslint-disable-next-line no-console
  console.log("Flutterwave webhook received:", JSON.stringify(body));

  return NextResponse.json({ ok: true });
}
