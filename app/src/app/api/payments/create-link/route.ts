import { NextResponse } from "next/server";
import axios from "axios";

const FLW_SECRET = process.env.FLUTTERWAVE_SECRET_KEY || "";
const APP_URL = process.env.APP_URL || "http://localhost:3000";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { amount?: number; currency?: string; email?: string; tx_ref?: string };
  const amount = Number(body.amount ?? 0);
  const currency = body.currency || "NGN";
  const email = body.email?.trim().toLowerCase();
  const txRef = body.tx_ref || `poppy_${Date.now()}`;

  if (!amount || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!FLW_SECRET) {
    return NextResponse.json({
      ok: true,
      data: {
        link: `${APP_URL}/orders`,
        message: "Flutterwave secret not configured; using local demo checkout flow.",
      },
    });
  }

  try {
    const resp = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      {
        tx_ref: txRef,
        amount,
        currency,
        redirect_url: `${APP_URL}/orders`,
        customer: { email },
        payment_options: "card,ussd",
      },
      { headers: { Authorization: `Bearer ${FLW_SECRET}` } }
    );

    return NextResponse.json({ ok: true, data: resp.data.data ?? resp.data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "payment error" }, { status: 500 });
  }
}
