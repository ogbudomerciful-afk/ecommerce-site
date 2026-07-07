import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  try {
    await connectToDatabase();
    const filter: any = {};
    if (email) filter.userEmail = email.toLowerCase();
    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean().exec();
    return NextResponse.json({ ok: true, orders });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("List orders error", err?.message || err);
    return NextResponse.json({ error: "Failed to list orders" }, { status: 500 });
  }
}
