import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

const WEBHOOK_SECRET = process.env.FLUTTERWAVE_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  const signature = request.headers.get("verif-hash") || "";
  const body = (await request.json().catch(() => ({}))) as any;

  if (WEBHOOK_SECRET && signature && signature !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const data = body?.data || body;
    const txRef = data?.tx_ref || data?.reference || body?.tx_ref;
    const status = data?.status || body?.status || "unknown";

    if (txRef) {
      // Map flutterwave status to order status
      const paymentStatus = status === "successful" || status === "paid" ? "Paid" : status;
      const order = await Order.findOneAndUpdate({ tx_ref: txRef }, { paymentStatus, status: paymentStatus }, { new: true }).exec();
      // eslint-disable-next-line no-console
      console.log("Webhook updated order", txRef, order ? "updated" : "not found");
    } else {
      // eslint-disable-next-line no-console
      console.log("Flutterwave webhook received (no tx_ref)", JSON.stringify(body));
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Webhook processing error", e);
  }

  return NextResponse.json({ ok: true });
}
