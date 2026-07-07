import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as any;
  const { tx_ref, userEmail, items, total, address } = body;
  if (!tx_ref || !userEmail || !items || !total) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  try {
    await connectToDatabase();
    const existing = await Order.findOne({ tx_ref }).exec();
    if (existing) return NextResponse.json({ ok: true, order: existing });

    const order = new Order({ tx_ref, userEmail, items, total, status: "Pending", address, paymentStatus: "Pending" });
    await order.save();
    return NextResponse.json({ ok: true, order: { id: order._id.toString(), tx_ref: order.tx_ref } });
  } catch (err: any) {
    console.error("Create order error", err?.message || err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
