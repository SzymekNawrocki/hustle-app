import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { usePaginatedQuery } from "@/hooks/use-paginated-query";

// Mock the api module
vi.mock("@/lib/api", () => ({
  api: {
    get: vi.fn().mockResolvedValue({
      data: { items: [], total: 0, page: 1, pages: 1 },
    }),
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("usePaginatedQuery", () => {
  it("starts at page 1", () => {
    const { result } = renderHook(
      () => usePaginatedQuery("test-key", "/test"),
      { wrapper: createWrapper() }
    );
    expect(result.current.page).toBe(1);
  });

  it("increments page on nextPage", () => {
    const { result } = renderHook(
      () => usePaginatedQuery("test-key", "/test"),
      { wrapper: createWrapper() }
    );
    act(() => result.current.nextPage());
    expect(result.current.page).toBe(2);
  });

  it("decrements page on prevPage, never below 1", () => {
    const { result } = renderHook(
      () => usePaginatedQuery("test-key", "/test"),
      { wrapper: createWrapper() }
    );
    act(() => result.current.prevPage());
    expect(result.current.page).toBe(1);

    act(() => result.current.nextPage());
    act(() => result.current.prevPage());
    expect(result.current.page).toBe(1);
  });

  it("hasPrevPage is false on page 1", () => {
    const { result } = renderHook(
      () => usePaginatedQuery("test-key", "/test"),
      { wrapper: createWrapper() }
    );
    expect(result.current.hasPrevPage).toBe(false);
  });

  it("hasPrevPage is true on page > 1", () => {
    const { result } = renderHook(
      () => usePaginatedQuery("test-key", "/test"),
      { wrapper: createWrapper() }
    );
    act(() => result.current.nextPage());
    expect(result.current.hasPrevPage).toBe(true);
  });

  it("accepts array query key", () => {
    const { result } = renderHook(
      () => usePaginatedQuery(["expenses"] as const, "/finance/expenses"),
      { wrapper: createWrapper() }
    );
    expect(result.current.page).toBe(1);
  });

  it("resets to page 1 after setPage", () => {
    const { result } = renderHook(
      () => usePaginatedQuery("test-key", "/test"),
      { wrapper: createWrapper() }
    );
    act(() => result.current.nextPage());
    act(() => result.current.nextPage());
    expect(result.current.page).toBe(3);
    act(() => result.current.setPage(1));
    expect(result.current.page).toBe(1);
  });
});
