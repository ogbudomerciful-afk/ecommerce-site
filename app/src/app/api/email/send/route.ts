import { NextResponse } from "next/server";
import { EmailSchema } from "@/lib/validate";
import axios from "axios";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as unknown;
  const parsed = EmailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message || "Invalid input" }, { status: 400 });
  }

  const { to, subject, html } = parsed.data;

  if (!RESEND_API_KEY) {
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
