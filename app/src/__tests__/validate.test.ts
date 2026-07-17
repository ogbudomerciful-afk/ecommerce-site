import { LoginSchema, RegisterSchema, CreateOrderSchema, UpdateOrderSchema, PaymentLinkSchema, EmailSchema } from "@/lib/validate";

describe("Validation schemas", () => {
  it("accepts valid login input", () => {
    const result = LoginSchema.safeParse({ email: "test@example.com", password: "secret" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid login email", () => {
    const result = LoginSchema.safeParse({ email: "invalid", password: "secret" });
    expect(result.success).toBe(false);
  });

  it("accepts valid register input", () => {
    const result = RegisterSchema.safeParse({ name: "Test", email: "test@example.com", password: "password123", address: "123 St" });
    expect(result.success).toBe(true);
  });

  it("rejects short password on register", () => {
    const result = RegisterSchema.safeParse({ name: "Test", email: "test@example.com", password: "123" });
    expect(result.success).toBe(false);
  });

  it("accepts valid create order input", () => {
    const result = CreateOrderSchema.safeParse({
      tx_ref: "tx-123",
      userEmail: "test@example.com",
      items: [{ productId: "p1", quantity: 1, price: 1000 }],
      total: 1000,
    });
    expect(result.success).toBe(true);
  });

  it("rejects order with empty items", () => {
    const result = CreateOrderSchema.safeParse({
      tx_ref: "tx-123",
      userEmail: "test@example.com",
      items: [],
      total: 1000,
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid payment link input", () => {
    const result = PaymentLinkSchema.safeParse({ amount: 5000, email: "test@example.com", tx_ref: "tx-123" });
    expect(result.success).toBe(true);
  });

  it("rejects negative payment amount", () => {
    const result = PaymentLinkSchema.safeParse({ amount: -100, email: "test@example.com", tx_ref: "tx-123" });
    expect(result.success).toBe(false);
  });

  it("accepts valid email input", () => {
    const result = EmailSchema.safeParse({ to: "test@example.com", subject: "Hello", html: "<p>Hi</p>" });
    expect(result.success).toBe(true);
  });

  it("requires either orderId or tx_ref for update", () => {
    const result = UpdateOrderSchema.safeParse({ status: "Shipped" });
    expect(result.success).toBe(false);
  });

  it("accepts update with orderId", () => {
    const result = UpdateOrderSchema.safeParse({ orderId: "ord-1", status: "Shipped" });
    expect(result.success).toBe(true);
  });
});
