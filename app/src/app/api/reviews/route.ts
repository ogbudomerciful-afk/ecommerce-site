import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Review from "@/models/Review";
import Order from "@/models/Order";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 }).exec();
    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("phantom_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = verifyToken(token);
    if (!payload?.sub || !payload?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as { productId?: string; rating?: number; comment?: string };
    const { productId, rating, comment } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: "Product ID, rating, and comment are required" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    await connectToDatabase();

    const hasPurchased = await Order.findOne({ userEmail: payload.email, "items.productId": productId }).exec();
    const verifiedPurchase = !!hasPurchased;

    const review = new Review({
      productId,
      userEmail: payload.email,
      userName: payload.sub,
      rating,
      comment,
      verifiedPurchase,
    });

    await review.save();
    return NextResponse.json({ review });
  } catch {
    return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
  }
}
