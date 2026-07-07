import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { orderId?: string; tx_ref?: string; status?: string; paymentStatus?: string };
  const { orderId, tx_ref, status, paymentStatus } = body;
  if (!orderId && !tx_ref) return NextResponse.json({ error: "Missing identifier" }, { status: 400 });

  try {
    await connectToDatabase();
    const query = orderId ? { _id: orderId } : { tx_ref };
    const update: any = {};
    if (status) update.status = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    const order = await Order.findOneAndUpdate(query, update, { new: true }).lean().exec();
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ ok: true, order });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("Update order error", err?.message || err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
