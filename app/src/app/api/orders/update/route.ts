import { NextResponse } from "next/server";
import { UpdateOrderSchema } from "@/lib/validate";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => ({}))) as unknown;
  const parsed = UpdateOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const { orderId, tx_ref, status, paymentStatus } = parsed.data;

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
    console.error("Update order error", err?.message || err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
