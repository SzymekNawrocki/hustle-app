import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";

// We test the 401 interceptor behavior by importing the configured api instance
// The interceptor should redirect to /login and DELETE the session cookie

describe("api 401 interceptor", () => {
  const originalWindow = global.window;
  let hrefSetter: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock window.location.href setter
    hrefSetter = vi.fn();
    Object.defineProperty(global, "window", {
      value: {
        location: { href: "" },
      },
      writable: true,
    });
    Object.defineProperty(global.window.location, "href", {
      set: hrefSetter,
      configurable: true,
    });

    global.fetch = vi.fn().mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    global.window = originalWindow;
    vi.restoreAllMocks();
  });

  it("redirects to /login on 401 for non-auth endpoint", async () => {
    // Dynamically import api to get the configured instance
    const { api } = await import("@/lib/api");

    // Mock an axios 401 response
    const error = new axios.AxiosError(
      "Unauthorized",
      "401",
      { url: "/goals/dashboard/today" } as never,
      {},
      { status: 401, data: {}, headers: {}, config: { url: "/goals/dashboard/today" } as never, statusText: "Unauthorized" }
    );
    error.config = { url: "/goals/dashboard/today" } as never;
    error.response = { status: 401, data: {}, headers: {}, config: { url: "/goals/dashboard/today" } as never, statusText: "Unauthorized" };

    const handlers = api.interceptors.response as unknown as { handlers: Array<{ rejected?: (e: unknown) => unknown }> };
    await expect(
      handlers.handlers[0]?.rejected?.(error)
    ).rejects.toThrow();

    // fetch to clear session cookie should have been called
    expect(global.fetch).toHaveBeenCalledWith("/api/auth/session", { method: "DELETE" });
  });
});

describe("getApiError", () => {
  it("extracts string detail from axios error", async () => {
    const { getApiError } = await import("@/lib/api");
    const error = new axios.AxiosError("Test");
    error.response = {
      status: 422,
      data: { detail: "Invalid input" },
      headers: {},
      config: {} as never,
      statusText: "Unprocessable Entity",
    };
    expect(getApiError(error)).toBe("Invalid input");
  });

  it("joins array detail messages", async () => {
    const { getApiError } = await import("@/lib/api");
    const error = new axios.AxiosError("Test");
    error.response = {
      status: 422,
      data: { detail: [{ msg: "Field required" }, { msg: "Too short" }] },
      headers: {},
      config: {} as never,
      statusText: "Unprocessable Entity",
    };
    expect(getApiError(error)).toBe("Field required, Too short");
  });

  it("returns error message for unknown error", async () => {
    const { getApiError } = await import("@/lib/api");
    expect(getApiError(new Error("Something broke"))).toBe("Something broke");
  });
});
