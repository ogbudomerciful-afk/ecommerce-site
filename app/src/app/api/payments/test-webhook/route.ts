import { NextResponse } from "next/server";

// Simple helper to POST a test payload to the webhook handler in this app.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as any;
  try {
    // Call local webhook route
    const url = `${process.env.APP_URL || "http://localhost:3000"}/api/payments/webhook`;
    await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("test webhook failed", err?.message || err);
    return NextResponse.json({ error: "Failed to call webhook" }, { status: 500 });
  }
}
