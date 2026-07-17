import { NextResponse } from "next/server";
import { PaymentLinkSchema } from "@/lib/validate";
import axios from "axios";

const FLW_SECRET = process.env.FLUTTERWAVE_SECRET_KEY || "";
const APP_URL = process.env.APP_URL || "http://localhost:3000";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as unknown;
  const parsed = PaymentLinkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const { amount, currency, email, tx_ref } = parsed.data;

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
        tx_ref,
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
