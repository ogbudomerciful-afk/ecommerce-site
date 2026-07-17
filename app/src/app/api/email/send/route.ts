import { NextResponse } from "next/server";
import axios from "axios";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { to?: string; subject?: string; html?: string };
  const to = body.to;
  const subject = body.subject || "Notification from Phantom Gadgets";
  const html = body.html || "";

  if (!to) return NextResponse.json({ error: "Missing recipient" }, { status: 400 });

  if (!RESEND_API_KEY) {
    // Demo mode — log and return success so flows continue locally.
    // eslint-disable-next-line no-console
    console.log("Resend API key not configured. Email would be:", { to, subject });
    return NextResponse.json({ ok: true, demo: true });
  }

  try {
    const resp = await axios.post(
      "https://api.resend.com/emails",
      {
        from: "no-reply@phantomgadgets.store",
        to: [to],
        subject,
        html,
      },
      { headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" } }
    );

    return NextResponse.json({ ok: true, data: resp.data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "email error" }, { status: 500 });
  }
}
