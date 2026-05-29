import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  updateProfileSchema,
  offerSchema,
  expenseEditSchema,
} from "@/lib/schemas";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    expect(loginSchema.safeParse({ username: "a@b.com", password: "abc123" }).success).toBe(true);
  });
  it("rejects invalid email", () => {
    expect(loginSchema.safeParse({ username: "notanemail", password: "abc123" }).success).toBe(false);
  });
  it("rejects short password", () => {
    expect(loginSchema.safeParse({ username: "a@b.com", password: "abc" }).success).toBe(false);
  });
  it("rejects empty body", () => {
    expect(loginSchema.safeParse({}).success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts valid registration data", () => {
    expect(registerSchema.safeParse({ email: "a@b.com", password: "abc123", full_name: "John Doe" }).success).toBe(true);
  });
  it("rejects full_name shorter than 2 chars", () => {
    expect(registerSchema.safeParse({ email: "a@b.com", password: "abc123", full_name: "J" }).success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("accepts matching passwords", () => {
    const data = { current_password: "old123", new_password: "new1234", confirm_password: "new1234" };
    expect(changePasswordSchema.safeParse(data).success).toBe(true);
  });
  it("rejects mismatched confirm password", () => {
    const data = { current_password: "old123", new_password: "new1234", confirm_password: "different" };
    expect(changePasswordSchema.safeParse(data).success).toBe(false);
  });
  it("rejects new_password over 128 chars", () => {
    const data = {
      current_password: "old",
      new_password: "a".repeat(129),
      confirm_password: "a".repeat(129),
    };
    expect(changePasswordSchema.safeParse(data).success).toBe(false);
  });
});

describe("updateProfileSchema", () => {
  it("accepts valid full name", () => {
    expect(updateProfileSchema.safeParse({ full_name: "Jane Doe" }).success).toBe(true);
  });
  it("rejects empty full name", () => {
    expect(updateProfileSchema.safeParse({ full_name: "J" }).success).toBe(false);
  });
  it("rejects names over 100 chars", () => {
    expect(updateProfileSchema.safeParse({ full_name: "A".repeat(101) }).success).toBe(false);
  });
});

describe("offerSchema", () => {
  it("accepts valid offer", () => {
    const data = { title: "Dev", url: "https://example.com", status: "wysłano" as const };
    expect(offerSchema.safeParse(data).success).toBe(true);
  });
  it("rejects empty title", () => {
    const data = { title: "", url: "https://example.com", status: "wysłano" as const };
    expect(offerSchema.safeParse(data).success).toBe(false);
  });
  it("rejects invalid URL", () => {
    const data = { title: "Dev", url: "not-a-url", status: "wysłano" as const };
    expect(offerSchema.safeParse(data).success).toBe(false);
  });
});

describe("expenseEditSchema", () => {
  it("accepts valid expense edit", () => {
    const data = { amount: 50.5, category: "INCOME" as const, description: "Salary", date: "2025-01-01" };
    expect(expenseEditSchema.safeParse(data).success).toBe(true);
  });
  it("rejects zero amount", () => {
    const data = { amount: 0, category: "INCOME" as const, description: "Test", date: "2025-01-01" };
    expect(expenseEditSchema.safeParse(data).success).toBe(false);
  });
  it("rejects negative amount", () => {
    const data = { amount: -10, category: "EXPENSES" as const, description: "Test", date: "2025-01-01" };
    expect(expenseEditSchema.safeParse(data).success).toBe(false);
  });
  it("rejects missing description", () => {
    const data = { amount: 10, category: "EXPENSES" as const, description: "", date: "2025-01-01" };
    expect(expenseEditSchema.safeParse(data).success).toBe(false);
  });
});
