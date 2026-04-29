import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: "/api/backend",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Redirect to /login on 401 for any non-auth endpoint.
// Auth endpoints (login, me, refresh) handle 401 themselves.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const url = error.config?.url ?? "";
    if (
      error.response?.status === 401 &&
      !url.startsWith("/auth/") &&
      typeof window !== "undefined"
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: string | { msg: string }[] }>;
    const detail = axiosError.response?.data?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      return detail.map((d: { msg: string }) => d.msg).join(", ");
    }

    return axiosError.message || "An unexpected error occurred";
  }

  return error instanceof Error ? error.message : "An unknown error occurred";
};
