import { signToken, verifyToken, getJwtSecret } from "@/lib/auth";

describe("Auth utilities", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("returns a signed token", () => {
    process.env.NODE_ENV = "development";
    const token = signToken({ sub: "user-1", email: "test@example.com", role: "customer" });
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("verifies a valid token", () => {
    process.env.NODE_ENV = "development";
    const token = signToken({ sub: "user-1", email: "test@example.com", role: "customer" });
    const payload = verifyToken(token);
    expect(payload?.sub).toBe("user-1");
    expect(payload?.email).toBe("test@example.com");
  });

  it("returns null for invalid token", () => {
    process.env.NODE_ENV = "development";
    const payload = verifyToken("invalid-token");
    expect(payload).toBeNull();
  });

  it("requires JWT_SECRET in production", () => {
    process.env.NODE_ENV = "production";
    delete process.env.NEXTAUTH_SECRET;
    delete process.env.JWT_SECRET;
    expect(getJwtSecret).toThrow("JWT_SECRET must be set in production");
  });
});
