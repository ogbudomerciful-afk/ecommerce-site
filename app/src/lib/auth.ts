import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET must be set in production");
}

const FALLBACK_SECRET = process.env.NODE_ENV === "production" ? undefined : "dev-secret";

export function getJwtSecret() {
  return JWT_SECRET || FALLBACK_SECRET || "dev-secret";
}

export function signToken(payload: { sub: string; email: string; role: string }) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, getJwtSecret()) as { sub?: string; email?: string; role?: string };
  } catch {
    return null;
  }
}
