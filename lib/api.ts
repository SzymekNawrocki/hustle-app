import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: string | { msg: string }[] }>;
    const detail = axiosError.response?.data?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      return detail.map((d: any) => d.msg).join(", ");
    }

    return axiosError.message || "An unexpected error occurred";
  }

  return error instanceof Error ? error.message : "An unknown error occurred";
};
