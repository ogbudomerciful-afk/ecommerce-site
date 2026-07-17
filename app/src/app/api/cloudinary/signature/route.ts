import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
const API_KEY = process.env.CLOUDINARY_API_KEY || "";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "";

if (CLOUD_NAME && API_KEY && API_SECRET) {
  cloudinary.config({ cloud_name: CLOUD_NAME, api_key: API_KEY, api_secret: API_SECRET });
}

export async function GET(req: Request) {
  // Return a signature + timestamp for client direct uploads.
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "phantom_gadgets";

  if (!API_SECRET) {
    return NextResponse.json({ ok: true, demo: true, uploadUrl: `https://res.cloudinary.com/${CLOUD_NAME || "demo"}/image/upload`, timestamp, signature: "" });
  }

  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, API_SECRET);
  return NextResponse.json({ ok: true, uploadUrl: `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, timestamp, signature, apiKey: API_KEY, folder });
}
