import axios from "axios";

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL as string) ?? "/api",
  headers: { "Content-Type": "application/json" },
});

export function getApiErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return "An unexpected error occurred.";
  }

  if (axios.isAxiosError(error)) {
    if (error.response?.data) {
      const data = error.response.data as Record<string, unknown>;
      if (typeof data.message === "string") {
        return data.message;
      }
      if (typeof data.error === "string") {
        return data.error;
      }
    }

    return error.message || "An API error occurred.";
  }

  return "An unexpected error occurred.";
}

export default api;
